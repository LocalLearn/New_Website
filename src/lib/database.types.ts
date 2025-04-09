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
          username: string
          email: string
          created_at: string
        }
        Insert: {
          id: string
          full_name?: string | null
          avatar_url?: string | null
          updated_at?: string
          username: string
          email: string
          created_at?: string
        }
        Update: {
          id?: string
          full_name?: string | null
          avatar_url?: string | null
          updated_at?: string
          username?: string
          email?: string
          created_at?: string
        }
      }
    }
  }
}