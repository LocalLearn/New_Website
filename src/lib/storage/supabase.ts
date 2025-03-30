import { supabase } from '../supabase';
import type { ChatSession } from './types';
import { Database } from '../database.types';

export class SupabaseStorage {
  async getSessions(): Promise<ChatSession[]> {
    const { data, error } = await supabase
      .from('chat_sessions')
      .select('*')
      .order('updated_at', { ascending: false });

    if (error) throw error;

    return data.map(this.mapFromDatabase);
  }

  async getSession(id: string): Promise<ChatSession | null> {
    const { data, error } = await supabase
      .from('chat_sessions')
      .select('*')
      .eq('id', id)
      .single();

    if (error) return null;
    return this.mapFromDatabase(data);
  }

  async saveSession(session: ChatSession): Promise<void> {
    const { error } = await supabase
      .from('chat_sessions')
      .upsert(this.mapToDatabase(session));

    if (error) throw error;
  }

  async deleteSession(id: string): Promise<void> {
    const { error } = await supabase
      .from('chat_sessions')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  private mapFromDatabase(data: Database['public']['Tables']['chat_sessions']['Row']): ChatSession {
    return {
      id: data.id,
      userId: data.user_id,
      lesson: data.lesson,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at),
      preferences: data.preferences as any,
      messages: data.messages as any[],
      isComplete: data.is_complete,
    };
  }

  private mapToDatabase(session: ChatSession): Database['public']['Tables']['chat_sessions']['Insert'] {
    return {
      id: session.id,
      user_id: session.userId,
      lesson: session.lesson,
      created_at: session.createdAt.toISOString(),
      updated_at: session.updatedAt.toISOString(),
      preferences: session.preferences,
      messages: session.messages,
      is_complete: session.isComplete,
    };
  }
}