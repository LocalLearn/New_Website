export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          full_name: string | null
          avatar_url: string | null
          updated_at: string
        }
        Insert: {
          id: string
          full_name?: string | null
          avatar_url?: string | null
          updated_at?: string
        }
        Update: {
          id?: string
          full_name?: string | null
          avatar_url?: string | null
          updated_at?: string
        }
      }
      chat_sessions: {
        Row: {
          id: string
          user_id: string
          lesson: string
          created_at: string
          updated_at: string
          preferences: Json
          messages: Json[]
          is_complete: boolean
        }
        Insert: {
          id?: string
          user_id: string
          lesson: string
          created_at?: string
          updated_at?: string
          preferences: Json
          messages: Json[]
          is_complete?: boolean
        }
        Update: {
          id?: string
          user_id?: string
          lesson?: string
          created_at?: string
          updated_at?: string
          preferences?: Json
          messages?: Json[]
          is_complete?: boolean
        }
      }
    }
  }
}