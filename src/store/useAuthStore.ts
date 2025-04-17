import { create } from 'zustand';
import { User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
  setUser: (user: User | null) => void;
  setError: (error: string | null) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: true,
  error: null,
  setUser: (user) => set({ user }),
  setError: (error) => set({ error }),
}));

// Initialize auth state
supabase.auth.getSession().then(({ data: { session } }) => {
  useAuthStore.setState({ user: session?.user ?? null, loading: false });
});

// Listen for auth changes
supabase.auth.onAuthStateChange((_event, session) => {
  useAuthStore.setState({ user: session?.user ?? null });
});