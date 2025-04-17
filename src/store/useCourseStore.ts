import { create } from 'zustand';
import { Course } from '../types';
import { supabase } from '../lib/supabase';

interface CourseState {
  courses: Course[];
  loading: boolean;
  error: string | null;
  enrollInCourse: (courseId: string) => Promise<void>;
}

export const useCourseStore = create<CourseState>((set, get) => ({
  courses: [],
  loading: false,
  error: null,

  enrollInCourse: async (courseId: string) => {
    try {
      const { error } = await supabase
        .from('course_enrollments')
        .insert({ course_id: courseId });

      if (error) throw error;
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Failed to enroll in course');
    }
  },
}));