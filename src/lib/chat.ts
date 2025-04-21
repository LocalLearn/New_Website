import { ChatMessage, UserPreferences, UserState, Challenge } from './types';
import { DEFAULT_PREFERENCES, VALID_PREFERENCES } from './constants';
import { supabase } from './supabase';
import { chatCache } from './cache';

export class ChatState {
  private state: UserState;
  private currentChallengeIndex: number;

  constructor() {
    this.state = {
      preferences: { ...DEFAULT_PREFERENCES },
      preferences_set: false,
      conversation_started: false,
    };
    this.currentChallengeIndex = 0;
  }

  updatePreferences(preferences: Partial<UserPreferences>): void {
    Object.entries(preferences).forEach(([key, value]) => {
      const validValues = VALID_PREFERENCES[key as keyof UserPreferences];
      if (validValues?.includes(value)) {
        this.state.preferences[key as keyof UserPreferences] = value as any;
      }
    });
    this.state.preferences_set = true;
  }

  setPreferencesFromHistory(messages: ChatMessage[]): void {
    const preferencesMessage = messages.find(msg => 
      msg.role === 'assistant' && 
      msg.content.includes('adjust my responses to match your preferences:')
    );

    if (preferencesMessage) {
      const preferences = parsePreferences(preferencesMessage.content);
      if (Object.keys(preferences).length > 0) {
        this.updatePreferences(preferences);
      }
    }

    if (messages.length > 0) {
      this.state.conversation_started = true;
    }
  }

  getCurrentChallengeIndex(): number {
    return this.currentChallengeIndex;
  }

  incrementChallengeIndex(): void {
    this.currentChallengeIndex++;
  }

  getPreferenceString(): string {
    return Object.entries(this.state.preferences)
      .map(([key, value]) => `${key}: ${value}`)
      .join(', ');
  }

  getPreferences(): UserPreferences {
    return { ...this.state.preferences };
  }

  isConversationStarted(): boolean {
    return this.state.conversation_started;
  }

  startConversation(): void {
    this.state.conversation_started = true;
  }

  arePreferencesSet(): boolean {
    return this.state.preferences_set;
  }

  reset(): void {
    this.state = {
      preferences: { ...DEFAULT_PREFERENCES },
      preferences_set: false,
      conversation_started: false,
    };
    this.currentChallengeIndex = 0;
  }
}

export function parsePreferences(message: string): Partial<UserPreferences> {
  const parts = message.toLowerCase().split(',').map(part => part.trim());
  const parsed: Partial<UserPreferences> = {};

  Object.entries(VALID_PREFERENCES).forEach(([category, validValues]) => {
    const matchingValue = validValues.find(value =>
      parts.some(part => part.includes(value.toLowerCase()))
    );
    if (matchingValue) {
      parsed[category as keyof UserPreferences] = matchingValue as any;
    }
  });

  return parsed;
}

function gradeChallenge(userInput: string, correctSolution: string): boolean {
  const normalizeCode = (code: string): string => {
    return code
      .trim()
      .toLowerCase()
      .replace(/\s+/g, '')
      .replace(/['"`]/g, "'");
  };

  return normalizeCode(userInput) === normalizeCode(correctSolution);
}

export async function handleChatMessage(
  message: string,
  history: ChatMessage[],
  chatState: ChatState,
  selectedLesson: string,
  challenges: Challenge[],
  onChunk: (chunk: string) => void
): Promise<ChatMessage[]> {
  const { data: { session } } = await supabase.auth.getSession();
  const userId = session?.user?.id;

  if (!userId) {
    throw new Error('User not authenticated');
  }

  if (!chatState.isConversationStarted()) {
    const initialMessage: ChatMessage = {
      role: 'assistant',
      content: selectedLesson === 'Project Builder Tool' 
        ? "What is the coding topic (or framework/technology) for this project, and how many people are in your group?"
        : `Welcome, Adventurer! 🧙‍♂️ Let's tailor your quest. Choose your preferences:
Theme: Fantasy 🏰 / Space 🚀 / Cyberpunk 🤖 / Classic Python 🐍
Tone: Encouraging 🌟 / Humorous 😄 / Serious 🧠 / Mysterious 🔮
Difficulty: Novice (guided discovery) / Explorer (balanced) / Master (no hints)
Learning Style: Visual 🎨 / Hands-on ✋ / Analytical 🔍 / Story-driven 📖
Type your choices (e.g., 'Fantasy, Humorous, Novice, Visual') or press Enter to use default settings`,
      timestamp: new Date().toISOString(),
      userId,
    };

    chatState.startConversation();
    await chatCache.saveConversationToCache(selectedLesson, [initialMessage], userId);
    return [initialMessage];
  }

  const newMessage: ChatMessage = {
    role: 'user',
    content: message,
    timestamp: new Date().toISOString(),
    userId,
  };

  const newHistory = [...history, newMessage];

  if (!chatState.arePreferencesSet() && selectedLesson !== 'Project Builder Tool') {
    const preferences = parsePreferences(message);
    chatState.updatePreferences(preferences);
    
    const responseMessage: ChatMessage = {
      role: 'assistant',
      content: `Great! I'll adjust my responses to match your preferences: ${chatState.getPreferenceString()}. Let's begin with your first challenge!\n\n${challenges[0].primerAndChallenge}`,
      timestamp: new Date().toISOString(),
      userId,
    };

    const updatedHistory = [...newHistory, responseMessage];
    await chatCache.saveConversationToCache(selectedLesson, updatedHistory, userId);
    return updatedHistory;
  }

  const currentChallenge = challenges[chatState.getCurrentChallengeIndex()];
  const isCorrect = gradeChallenge(message, currentChallenge.correctSolution);

  if (isCorrect) {
    const rewardMessage: ChatMessage = {
      role: 'assistant',
      content: `Congratulations! ${currentChallenge.reward}\n\n${
        chatState.getCurrentChallengeIndex() < challenges.length - 1
          ? challenges[chatState.getCurrentChallengeIndex() + 1].primerAndChallenge
          : "Congratulations! You've completed all challenges in this lesson!"
      }`,
      timestamp: new Date().toISOString(),
      userId,
    };

    chatState.incrementChallengeIndex();
    const updatedHistory = [...newHistory, rewardMessage];
    await chatCache.saveConversationToCache(selectedLesson, updatedHistory, userId);
    return updatedHistory;
  }

  // Add system message for incorrect answer
  const systemMessage: ChatMessage = {
    role: 'system',
    content: `The student's answer is incorrect. Their attempt was:
${message}

The correct solution pattern is:
${currentChallenge.correctSolution}
BUT DO NOT SHOW THE CORRECT ANSWER IN YOUR RESPONSE!!

Please provide themed guidance based on their preferences:
${chatState.getPreferenceString()}

Remember:
1. DO NOT provide code or pseudocode
2. Give hints that match their learning style
3. Ask guiding questions that lead to understanding
4. Focus on the specific concepts they need to grasp
5. Be encouraging and maintain the theme
6. Point out specific issues while staying in character`,
    timestamp: new Date().toISOString(),
    userId,
  };

  try {
    const response = await fetch(`${supabase.functions.url}/chat`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${session?.access_token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages: [...history, systemMessage, newMessage],
        selectedLesson,
        preferences: chatState.getPreferences(),
      }),
    });

    if (!response.ok) throw new Error('Failed to get response');

    const reader = response.body!.getReader();
    const decoder = new TextDecoder();
    let fullContent = '';

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        const text = decoder.decode(value);
        const lines = text.split('\n');
        
        for (const line of lines) {
          if (line.trim() === '') continue;
          if (line.trim() === 'data: [DONE]') continue;
          
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(5));
              const content = data.choices[0]?.delta?.content || '';
              if (content) {
                fullContent += content;
                onChunk(content);
              }
            } catch (error) {
              console.error('Error parsing chunk:', error);
            }
          }
        }
      }
    } catch (error) {
      console.error('Error reading stream:', error);
      throw error;
    }

    const assistantMessage: ChatMessage = {
      role: 'assistant',
      content: fullContent,
      timestamp: new Date().toISOString(),
      userId,
    };

    const finalHistory = [...newHistory, assistantMessage];
    await chatCache.saveConversationToCache(selectedLesson, finalHistory, userId);
    return finalHistory;
  } catch (error) {
    console.error('Error calling chat function:', error);
    const errorMessage: ChatMessage = {
      role: 'assistant',
      content: 'I apologize, but I encountered an error processing your request. Please try again.',
      timestamp: new Date().toISOString(),
      userId,
    };
    const errorHistory = [...newHistory, errorMessage];
    await chatCache.saveConversationToCache(selectedLesson, errorHistory, userId);
    return errorHistory;
  }
}