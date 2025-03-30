import { openDB, IDBPDatabase } from 'idb';
import type { ChatSession } from './types';

const DB_NAME = 'locallearn_chat';
const STORE_NAME = 'chat_sessions';
const DB_VERSION = 1;

export class IndexedDBStorage {
  private db: Promise<IDBPDatabase>;

  constructor() {
    this.db = this.initDB();
  }

  private async initDB() {
    return openDB(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
          store.createIndex('userId', 'userId', { unique: false });
          store.createIndex('updatedAt', 'updatedAt', { unique: false });
          store.createIndex('lesson', 'lesson', { unique: false });
        }
      },
    });
  }

  async getSessions(): Promise<ChatSession[]> {
    const db = await this.db;
    return db.getAll(STORE_NAME);
  }

  async getRecentSessions(days: number = 7): Promise<ChatSession[]> {
    const db = await this.db;
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);

    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    const index = store.index('updatedAt');
    
    const sessions = await index.getAll(IDBKeyRange.lowerBound(cutoff));
    return sessions;
  }

  async saveSession(session: ChatSession): Promise<void> {
    const db = await this.db;
    await db.put(STORE_NAME, {
      ...session,
      updatedAt: new Date(),
    });
  }

  async deleteSession(id: string): Promise<void> {
    const db = await this.db;
    await db.delete(STORE_NAME, id);
  }

  async clear(): Promise<void> {
    const db = await this.db;
    const tx = db.transaction(STORE_NAME, 'readwrite');
    await tx.objectStore(STORE_NAME).clear();
    await tx.done;
  }
}