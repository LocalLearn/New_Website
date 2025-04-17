import { create } from 'zustand';
import { Interest } from '../types';
import { supabase } from '../lib/supabase';

interface InterestState {
  interests: Interest[];
  userInterests: string[];
  loading: boolean;
  error: string | null;
  fetchInterests: () => Promise<void>;
  fetchUserInterests: () => Promise<void>;
  createInterest: (name: string) => Promise<Interest>;
  addUserInterest: (interestId: string) => Promise<void>;
  removeUserInterest: (interestId: string) => Promise<void>;
}

export const useInterestStore = create<InterestState>((set, get) => ({
  interests: [],
  userInterests: [],
  loading: false,
  error: null,
  
  fetchInterests: async () => {
    try {
      set({ loading: true, error: null });
      const { data, error } = await supabase
        .from('interests')
        .select('*')
        .order('name');
      
      if (error) throw error;
      set({ interests: data });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to fetch interests' });
    } finally {
      set({ loading: false });
    }
  },

  fetchUserInterests: async () => {
    try {
      set({ loading: true, error: null });
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('user_interests')
        .select('interest_id')
        .eq('user_id', user.id);
      
      if (error) throw error;
      
      set({ userInterests: data.map(item => item.interest_id) });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to fetch user interests' });
    } finally {
      set({ loading: false });
    }
  },

  createInterest: async (name: string) => {
    try {
      set({ loading: true, error: null });
      
      // First check if interest already exists
      const { data: existingInterest } = await supabase
        .from('interests')
        .select('*')
        .ilike('name', name)
        .single();

      if (existingInterest) {
        return existingInterest;
      }

      // Create new interest if it doesn't exist
      const { data, error } = await supabase
        .from('interests')
        .insert({ name })
        .select()
        .single();

      if (error) throw error;
      
      set(state => ({ interests: [...state.interests, data] }));
      return data;
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Failed to create interest');
    } finally {
      set({ loading: false });
    }
  },

  addUserInterest: async (interestId: string) => {
    try {
      set({ loading: true, error: null });
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('user_interests')
        .insert({ 
          user_id: user.id,
          interest_id: interestId 
        });

      if (error) throw error;
      
      set(state => ({ userInterests: [...state.userInterests, interestId] }));
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Failed to add user interest');
    } finally {
      set({ loading: false });
    }
  },

  removeUserInterest: async (interestId: string) => {
    try {
      set({ loading: true, error: null });
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('user_interests')
        .delete()
        .eq('user_id', user.id)
        .eq('interest_id', interestId);

      if (error) throw error;
      
      set(state => ({
        userInterests: state.userInterests.filter(id => id !== interestId)
      }));
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Failed to remove user interest');
    } finally {
      set({ loading: false });
    }
  },
}));