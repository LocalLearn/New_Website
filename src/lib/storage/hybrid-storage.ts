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
      await this.localStore.saveSession(sessionToSave);
      this.scheduleSync();
    } catch (error) {
      console.error('Failed to save to IndexedDB, attempting direct Supabase save:', error);
      await this.remoteStore.saveSession(sessionToSave);
    }
  }

  async deleteSession(id: string): Promise<void> {
    try {
      await this.localStore.deleteSession(id);
      this.scheduleSync();
    } catch (error) {
      console.error('Failed to delete from IndexedDB, attempting direct Supabase delete:', error);
      await this.remoteStore.deleteSession(id);
    }
  }

  private async scheduleSync(immediate = false) {
    if (this.syncStatus.isPending) return;

    this.syncStatus.isPending = true;

    if (immediate) {
      await this.sync();
    } else {
      setTimeout(() => this.sync(), 5000);
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

      // Handle conflicts and sync
      for (const localSession of localSessions) {
        const remoteSession = remoteSessions.find(r => r.id === localSession.id);
        
        if (!remoteSession || localSession.updatedAt > remoteSession.updatedAt) {
          await this.remoteStore.saveSession(localSession);
        }
      }

      // Update local storage with any new remote sessions
      for (const remoteSession of remoteSessions) {
        const localSession = localSessions.find(l => l.id === remoteSession.id);
        
        if (!localSession || remoteSession.updatedAt > localSession.updatedAt) {
          await this.localStore.saveSession(remoteSession);
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