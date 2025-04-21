import { ChatMessage } from './types';

interface CachedConversation {
  conversationId: string;
  messages: ChatMessage[];
  createdAt: string;
  updatedAt: string;
  userId: string;
  currentChallengeIndex: number;
}

class ChatCache {
  private readonly DB_NAME = 'locallearn_chat_cache';
  private readonly STORE_NAME = 'conversations';
  private readonly VERSION = 1;
  private db: IDBDatabase | null = null;

  private async getDB(): Promise<IDBDatabase> {
    if (this.db) return this.db;

    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.DB_NAME, this.VERSION);

      request.onerror = () => {
        console.error('Error opening IndexedDB:', request.error);
        reject(request.error);
      };

      request.onsuccess = () => {
        this.db = request.result;
        resolve(request.result);
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        
        if (!db.objectStoreNames.contains(this.STORE_NAME)) {
          const store = db.createObjectStore(this.STORE_NAME, { keyPath: ['userId', 'conversationId'] });
          store.createIndex('userId', 'userId', { unique: false });
          store.createIndex('updatedAt', 'updatedAt', { unique: false });
        }
      };
    });
  }

  private async getStore(mode: IDBTransactionMode = 'readonly'): Promise<IDBObjectStore> {
    try {
      const db = await this.getDB();
      const transaction = db.transaction(this.STORE_NAME, mode);
      
      transaction.onerror = () => {
        console.error('Transaction error:', transaction.error);
      };
      
      return transaction.objectStore(this.STORE_NAME);
    } catch (error) {
      console.error('Error getting store:', error);
      throw error;
    }
  }

  async saveConversationToCache(
    conversationId: string,
    messages: ChatMessage[],
    userId: string,
    currentChallengeIndex: number = 0
  ): Promise<void> {
    try {
      const store = await this.getStore('readwrite');
      
      const sortedMessages = [...messages].sort((a, b) => {
        const aTime = a.timestamp ? new Date(a.timestamp).getTime() : 0;
        const bTime = b.timestamp ? new Date(b.timestamp).getTime() : 0;
        return aTime - bTime;
      });
      
      const conversation: CachedConversation = {
        conversationId,
        userId,
        messages: sortedMessages,
        currentChallengeIndex,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      return new Promise((resolve, reject) => {
        const request = store.put(conversation);
        request.onerror = () => {
          console.error('Error saving conversation:', request.error);
          reject(request.error);
        };
        request.onsuccess = () => resolve();
      });
    } catch (error) {
      console.error('Error in saveConversationToCache:', error);
      throw error;
    }
  }

  async getConversationFromCache(
    conversationId: string,
    userId: string,
    offset = 0,
    limit = 50
  ): Promise<{ messages: ChatMessage[]; currentChallengeIndex: number }> {
    try {
      const store = await this.getStore();

      return new Promise((resolve, reject) => {
        const request = store.get([userId, conversationId]);
        
        request.onerror = () => {
          console.error('Error getting conversation:', request.error);
          reject(request.error);
        };
        
        request.onsuccess = () => {
          const conversation = request.result as CachedConversation | undefined;
          if (!conversation) {
            resolve({ messages: [], currentChallengeIndex: 0 });
            return;
          }

          const sortedMessages = [...conversation.messages].sort((a, b) => {
            const aTime = a.timestamp ? new Date(a.timestamp).getTime() : 0;
            const bTime = b.timestamp ? new Date(b.timestamp).getTime() : 0;
            return aTime - bTime;
          });

          const messages = sortedMessages.slice(
            Math.max(0, sortedMessages.length - limit - offset),
            sortedMessages.length - offset
          );

          resolve({
            messages,
            currentChallengeIndex: conversation.currentChallengeIndex || 0
          });
        };
      });
    } catch (error) {
      console.error('Error in getConversationFromCache:', error);
      throw error;
    }
  }

  async updateCachedConversation(
    conversationId: string,
    newMessage: ChatMessage,
    userId: string,
    currentChallengeIndex: number
  ): Promise<void> {
    try {
      const store = await this.getStore('readwrite');

      return new Promise((resolve, reject) => {
        const getRequest = store.get([userId, conversationId]);

        getRequest.onerror = () => {
          console.error('Error getting conversation for update:', getRequest.error);
          reject(getRequest.error);
        };

        getRequest.onsuccess = () => {
          const conversation = getRequest.result as CachedConversation | undefined;
          
          if (!conversation) {
            this.saveConversationToCache(conversationId, [newMessage], userId, currentChallengeIndex)
              .then(resolve)
              .catch(reject);
            return;
          }

          const updatedMessages = [...conversation.messages, newMessage];
          
          const sortedMessages = updatedMessages.sort((a, b) => {
            const aTime = a.timestamp ? new Date(a.timestamp).getTime() : 0;
            const bTime = b.timestamp ? new Date(b.timestamp).getTime() : 0;
            return aTime - bTime;
          });

          const finalMessages = sortedMessages.slice(-50);

          conversation.messages = finalMessages;
          conversation.currentChallengeIndex = currentChallengeIndex;
          conversation.updatedAt = new Date().toISOString();

          const putRequest = store.put(conversation);
          putRequest.onerror = () => {
            console.error('Error updating conversation:', putRequest.error);
            reject(putRequest.error);
          };
          putRequest.onsuccess = () => resolve();
        };
      });
    } catch (error) {
      console.error('Error in updateCachedConversation:', error);
      throw error;
    }
  }

  async clearCache(): Promise<void> {
    try {
      const store = await this.getStore('readwrite');

      return new Promise((resolve, reject) => {
        const request = store.clear();
        request.onerror = () => {
          console.error('Error clearing cache:', request.error);
          reject(request.error);
        };
        request.onsuccess = () => resolve();
      });
    } catch (error) {
      console.error('Error in clearCache:', error);
      throw error;
    }
  }

  async getAllConversations(userId: string): Promise<CachedConversation[]> {
    try {
      const store = await this.getStore();
      const index = store.index('userId');

      return new Promise((resolve, reject) => {
        const request = index.getAll(userId);
        request.onerror = () => {
          console.error('Error getting all conversations:', request.error);
          reject(request.error);
        };
        request.onsuccess = () => resolve(request.result);
      });
    } catch (error) {
      console.error('Error in getAllConversations:', error);
      throw error;
    }
  }
}

// Export a singleton instance
export const chatCache = new ChatCache();