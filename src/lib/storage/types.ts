import type { ChatMessage, UserPreferences } from '../types';

export interface ChatSession {
  id: string;
  userId: string;
  lesson: string;
  createdAt: Date;
  updatedAt: Date;
  preferences: UserPreferences;
  messages: ChatMessage[];
  isComplete: boolean;
}

export interface StorageProvider {
  getSessions(): Promise<ChatSession[]>;
  getSession(id: string): Promise<ChatSession | null>;
  saveSession(session: ChatSession): Promise<void>;
  deleteSession(id: string): Promise<void>;
  sync(): Promise<void>;
}

export interface SyncStatus {
  lastSynced: Date | null;
  isPending: boolean;
  error: Error | null;
}