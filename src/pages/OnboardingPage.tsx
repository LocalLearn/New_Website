import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { LearningPreference } from '../types';
import { WelcomeStep } from '../components/WelcomeStep';
import { LearningPreferencesStep } from '../components/LearningPreferencesStep';
import { LearningDifficultyStep } from '../components/LearningDifficultyStep';
import { CompletionStep } from '../components/CompletionStep';
import { OnboardingNavigation } from '../components/OnboardingNavigation';

interface FormData {
  learningPreferences: LearningPreference[];
  difficulty: string;
}

interface FormErrors {
  learningPreferences?: string;
  difficulty?: string;
  submit?: string;
}

const OnboardingPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    learningPreferences: [],
    difficulty: ''
  });
  const [errors, setErrors] = useState<FormErrors>({});

  const validateStep = (currentStep: number): boolean => {
    const newErrors: FormErrors = {};

    if (currentStep === 2) {
      if (formData.learningPreferences.length === 0) {
        newErrors.learningPreferences = 'Please select at least one learning preference';
      }
    }

    if (currentStep === 3) {
      if (!formData.difficulty) {
        newErrors.difficulty = 'Please select a difficulty level';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isStepValid = (currentStep: number): boolean => {
    switch (currentStep) {
      case 1:
        return true;
      case 2:
        return formData.learningPreferences.length > 0;
      case 3:
        return !!formData.difficulty;
      case 4:
        return true;
      default:
        return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;

    if (!validateStep(step)) {
      return;
    }

    if (step < 4) {
      setStep(step + 1);
      return;
    }

    try {
      setIsSubmitting(true);
      setErrors({});

      const { error: profileError } = await supabase
        .from('user_profiles')
        .insert({
          user_id: user.id,
          learning_preferences: formData.learningPreferences,
          difficulty_level: formData.difficulty.toLowerCase()
        });

      if (profileError) throw profileError;

      navigate('/courses');
    } catch (error) {
      console.error('Error saving onboarding data:', error);
      setErrors({
        submit: 'Failed to save your profile. Please try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Just a few things before we get started...
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Step {step} of 4
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-2xl">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {step === 1 && (
              <WelcomeStep onNext={() => setStep(2)} />
            )}

            {step === 2 && (
              <LearningPreferencesStep
                selectedPreferences={formData.learningPreferences}
                onChange={(preferences) => {
                  setFormData({ ...formData, learningPreferences: preferences });
                  setErrors({ ...errors, learningPreferences: undefined });
                }}
                error={errors.learningPreferences}
              />
            )}

            {step === 3 && (
              <LearningDifficultyStep
                selectedDifficulty={formData.difficulty}
                onChange={(difficulty) => {
                  setFormData({ ...formData, difficulty });
                  setErrors({ ...errors, difficulty: undefined });
                }}
                error={errors.difficulty}
              />
            )}

            {step === 4 && (
              <CompletionStep onNext={() => handleSubmit} />
            )}

            {errors.submit && (
              <div className="rounded-md bg-red-50 p-4">
                <p className="text-sm text-red-600">{errors.submit}</p>
              </div>
            )}

            {step > 1 && step < 4 && (
              <OnboardingNavigation
                currentStep={step}
                totalSteps={4}
                onPrevious={() => setStep(step - 1)}
                onNext={() => setStep(step + 1)}
                isSubmitting={isSubmitting}
                isValid={isStepValid(step)}
              />
            )}
          </form>
        </div>
      </div>
    </div>
  );
}

export default OnboardingPage;