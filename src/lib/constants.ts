import { UserPreferences } from './types';

export const VALID_PREFERENCES = {
  theme: ['Fantasy', 'Space', 'Cyberpunk', 'Classic Python'],
  tone: ['Encouraging', 'Humorous', 'Serious', 'Mysterious'],
  difficulty: ['Novice', 'Explorer', 'Master'],
  learning_style: ['Visual', 'Hands-on', 'Analytical', 'Story-driven'],
} as const;

export const DEFAULT_PREFERENCES: UserPreferences = {
  theme: 'Fantasy',
  tone: 'Encouraging',
  difficulty: 'Novice',
  learning_style: 'Visual',
};

export const LESSONS = [
  'Lesson 1: Basics of Syntax and Execution',
  'Lesson 2: Control Flow with Conditionals',
  'Lesson 3: Loops and Iteration',
  'Lesson 4: Functions and Scope',
] as const;

export const LESSON_CHALLENGES = {
  'Lesson 1: Basics of Syntax and Execution': 8,
  'Lesson 2: Control Flow with Conditionals': 7,
  'Lesson 3: Loops and Iteration': 11,
  'Lesson 4: Functions and Scope': 11,
} as const;