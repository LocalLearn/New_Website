import { ChatMessage, UserPreferences, UserState } from './types';
import { DEFAULT_PREFERENCES, VALID_PREFERENCES } from './constants';
import { supabase } from './supabase';

export class ChatState {
  private state: UserState;

  constructor() {
    this.state = {
      preferences: { ...DEFAULT_PREFERENCES },
      preferences_set: false,
      conversation_started: false,
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
      conversation_started: false,
    };
  }
}

export function parsePreferences(message: string): Partial<UserPreferences> | null {
  const parts = message.toLowerCase().split(',').map(part => part.trim());
  const parsed: Partial<UserPreferences> = {};
  let validCount = 0;

  Object.entries(VALID_PREFERENCES).forEach(([category, validValues]) => {
    const matchingValue = validValues.find(value =>
      parts.some(part => part.includes(value.toLowerCase()))
    );
    if (matchingValue) {
      parsed[category as keyof UserPreferences] = matchingValue as any;
      validCount++;
    }
  });

  return validCount >= 2 ? parsed : null;
}

export async function handleChatMessage(
  message: string,
  history: ChatMessage[],
  chatState: ChatState,
  selectedLesson: string
): Promise<ChatMessage[]> {
  const newHistory = [...history, { role: 'user', content: message }];

  if (!chatState.isConversationStarted() && message.toLowerCase() === "let's go") {
    chatState.startConversation();
    return [
      ...newHistory,
      {
        role: 'assistant',
        content: `Welcome, Adventurer! 🧙‍♂️ Let's tailor your quest. Choose your preferences:
Theme: Fantasy 🏰 / Space 🚀 / Cyberpunk 🤖 / Classic Python 🐍
Tone: Encouraging 🌟 / Humorous 😄 / Serious 🧠 / Mysterious 🔮
Difficulty: Novice (guided discovery) / Explorer (balanced) / Master (no hints)
Learning Style: Visual 🎨 / Hands-on ✋ / Analytical 🔍 / Story-driven 📖
Type your choices (e.g., 'Fantasy, Humorous, Novice, Visual')`,
      },
    ];
  }

  if (!chatState.arePreferencesSet()) {
    const preferences = parsePreferences(message);
    if (preferences) {
      chatState.updatePreferences(preferences);
      return [
        ...newHistory,
        {
          role: 'assistant',
          content: `Great! I'll adjust my responses to match your preferences: ${chatState.getPreferenceString()}. Ready to start your lesson about ${selectedLesson}?`,
        },
      ];
    }
  }

  try {
    const { data, error } = await supabase.functions.invoke('chat', {
      body: {
        messages: newHistory,
        selectedLesson,
        preferences: chatState.getPreferences(),
      },
    });

    if (error) throw error;

    return [
      ...newHistory,
      {
        role: 'assistant',
        content: data.choices[0].message.content,
      },
    ];
  } catch (error) {
    console.error('Error calling chat function:', error);
    return [
      ...newHistory,
      {
        role: 'assistant',
        content: 'I apologize, but I encountered an error processing your request. Please try again.',
      },
    ];
  }
}