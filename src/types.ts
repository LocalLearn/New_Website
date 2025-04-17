import { ChatMessage } from './lib/types';

export type { ChatMessage };

export type LearningPreference = 'visual' | 'auditory' | 'reading' | 'kinesthetic';

export interface Availability {
  day: string;
  start_time: string;
  end_time: string;
}

export interface Interest {
  id: string;
  name: string;
  created_at: string;
}

export interface Course {
  id: string;
  title: string;
  interest_id: string;
  status: 'pending' | 'active' | 'completed';
  created_at: string;
  interest: Interest;
  enrollments: Array<{
    user_id: string;
    created_at: string;
  }>;
}