import { v4 as uuidv4 } from 'uuid';
import type { ChatSession, StorageProvider, SyncStatus } from './types';
import { IndexedDBStorage } from './indexeddb';
import { SupabaseStorage } from './supabase';

export class HybridStorage implements StorageProvider {
  private localStore: IndexedDBStorage;
  private remoteStore: SupabaseStorage;
  private syncStatus: SyncStatus = {
    lastSynced: null,
    isPending: false,
    error: null,
  };

  constructor() {
    this.localStore = new IndexedDBStorage();
    this.remoteStore = new SupabaseStorage();
  }

  async getSessions(): Promise<ChatSession[]> {
    try {
      return await this.localStore.getSessions();
    } catch (error) {
      console.error('Failed to get sessions from IndexedDB, falling back to Supabase:', error);
      return this.remoteStore.getSessions();
    }
  }

  async getSession(id: string): Promise<ChatSession | null> {
    try {
      const sessions = await this.localStore.getSessions();
      return sessions.find(s => s.id === id) || null;
    } catch (error) {
      console.error('Failed to get session from IndexedDB, falling back to Supabase:', error);
      return this.remoteStore.getSession(id);
    }
  }

  async saveSession(session: ChatSession): Promise<void> {
    const sessionToSave = {
      ...session,
      id: session.id || uuidv4(),
      updatedAt: new Date(),
    };

    try {
      await Promise.all([
        this.localStore.saveSession(sessionToSave),
        this.remoteStore.saveSession(sessionToSave)
      ]);
    } catch (error) {
      console.error('Failed to save session:', error);
      // Try individual saves if parallel save fails
      try {
        await this.localStore.saveSession(sessionToSave);
      } catch (localError) {
        console.error('Failed to save to IndexedDB:', localError);
      }
      try {
        await this.remoteStore.saveSession(sessionToSave);
      } catch (remoteError) {
        console.error('Failed to save to Supabase:', remoteError);
      }
      throw error;
    }
  }

  async deleteSession(id: string): Promise<void> {
    const errors: Error[] = [];

    try {
      // Delete from both stores in parallel
      await Promise.all([
        this.deleteFromStore(this.localStore, id),
        this.deleteFromStore(this.remoteStore, id)
      ]);
    } catch (error) {
      console.error('Failed to delete session:', error);
      throw error;
    }

    if (errors.length > 0) {
      throw new Error(`Failed to delete session: ${errors.map(e => e.message).join(', ')}`);
    }
  }

  private async deleteFromStore(store: IndexedDBStorage | SupabaseStorage, id: string): Promise<void> {
    try {
      await store.deleteSession(id);
    } catch (error) {
      console.error(`Failed to delete from ${store.constructor.name}:`, error);
      throw error;
    }
  }

  async sync(): Promise<void> {
    if (!navigator.onLine) {
      this.syncStatus.isPending = false;
      return;
    }

    try {
      const localSessions = await this.localStore.getSessions();
      const remoteSessions = await this.remoteStore.getSessions();

      // Create sets of IDs for efficient lookup
      const localIds = new Set(localSessions.map(s => s.id));
      const remoteIds = new Set(remoteSessions.map(s => s.id));

      // Handle deletions
      for (const id of localIds) {
        if (!remoteIds.has(id)) {
          await this.localStore.deleteSession(id);
        }
      }
      for (const id of remoteIds) {
        if (!localIds.has(id)) {
          await this.remoteStore.deleteSession(id);
        }
      }

      // Handle updates
      for (const localSession of localSessions) {
        if (remoteIds.has(localSession.id)) {
          const remoteSession = remoteSessions.find(r => r.id === localSession.id)!;
          if (localSession.updatedAt > remoteSession.updatedAt) {
            await this.remoteStore.saveSession(localSession);
          } else if (remoteSession.updatedAt > localSession.updatedAt) {
            await this.localStore.saveSession(remoteSession);
          }
        }
      }

      this.syncStatus.lastSynced = new Date();
      this.syncStatus.error = null;
    } catch (error) {
      console.error('Sync failed:', error);
      this.syncStatus.error = error as Error;
    } finally {
      this.syncStatus.isPending = false;
    }
  }

  getSyncStatus(): SyncStatus {
    return { ...this.syncStatus };
  }
}