import { ChatMessage, UserPreferences, UserState } from './types';
import { DEFAULT_PREFERENCES, VALID_PREFERENCES } from './constants';
import { supabase } from './supabase';
import { chatCache } from './cache';

export class ChatState {
  private state: UserState;

  constructor() {
    this.state = {
      preferences: { ...DEFAULT_PREFERENCES },
      preferences_set: false,
      conversation_started: true,
    };
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
      conversation_started: true,
    };
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

export async function handleChatMessage(
  message: string,
  history: ChatMessage[],
  chatState: ChatState,
  selectedLesson: string,
  onChunk: (chunk: string) => void
): Promise<ChatMessage[]> {
  const { data: { session } } = await supabase.auth.getSession();
  const userId = session?.user?.id;

  if (!userId) {
    throw new Error('User not authenticated');
  }

  if (history.length === 0) {
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
      content: `Great! I'll adjust my responses to match your preferences: ${chatState.getPreferenceString()}. Let's begin ${selectedLesson}!`,
      timestamp: new Date().toISOString(),
      userId,
    };

    const updatedHistory = [...newHistory, responseMessage];
    await chatCache.saveConversationToCache(selectedLesson, updatedHistory, userId);
    return updatedHistory;
  }

  try {
    const response = await fetch(`${supabase.functions.url}/chat`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${session?.access_token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages: newHistory,
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