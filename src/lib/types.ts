export interface UserPreferences {
  theme: 'Fantasy' | 'Space' | 'Cyberpunk' | 'Classic Python';
  tone: 'Encouraging' | 'Humorous' | 'Serious' | 'Mysterious';
  difficulty: 'Novice' | 'Explorer' | 'Master';
  learning_style: 'Visual' | 'Hands-on' | 'Analytical' | 'Story-driven';
}

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface UserState {
  preferences: UserPreferences;
  preferences_set: boolean;
  conversation_started: boolean;
}

export interface LessonProgress {
  completedChallenges: number;
  totalChallenges: number;
  lastChallenge?: string;
}