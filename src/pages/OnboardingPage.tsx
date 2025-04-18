import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { InterestsSelection } from '../components/InterestsSelection';
import { LearningPreference } from '../types';

interface FormData {
  age: string;
  gender: string;
  zipCode: string;
  learningPreferences: LearningPreference[];
  selectedInterests: string[];
}

interface FormErrors {
  age?: string;
  gender?: string;
  zipCode?: string;
  learningPreferences?: string;
  selectedInterests?: string;
  submit?: string;
}

const OnboardingPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    age: '',
    gender: '',
    zipCode: '',
    learningPreferences: [],
    selectedInterests: []
  });
  const [errors, setErrors] = useState<FormErrors>({});

  const validateStep = (currentStep: number): boolean => {
    const newErrors: FormErrors = {};

    switch (currentStep) {
      case 1:
        if (!formData.age) {
          newErrors.age = 'Age is required';
        } else if (parseInt(formData.age) < 13 || parseInt(formData.age) > 120) {
          newErrors.age = 'Please enter a valid age between 13 and 120';
        }
        if (!formData.gender) {
          newErrors.gender = 'Gender selection is required';
        }
        if (!formData.zipCode) {
          newErrors.zipCode = 'ZIP code is required';
        } else if (!/^\d{5}(-\d{4})?$/.test(formData.zipCode)) {
          newErrors.zipCode = 'Please enter a valid ZIP code';
        }
        break;

      case 2:
        if (formData.learningPreferences.length === 0) {
          newErrors.learningPreferences = 'Please select at least one learning preference';
        }
        break;

      case 3:
        if (formData.selectedInterests.length === 0) {
          newErrors.selectedInterests = 'Please select at least one interest';
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isStepValid = (currentStep: number): boolean => {
    switch (currentStep) {
      case 1:
        return Boolean(
          formData.age &&
          parseInt(formData.age) >= 13 &&
          parseInt(formData.age) <= 120 &&
          formData.gender &&
          formData.zipCode &&
          /^\d{5}(-\d{4})?$/.test(formData.zipCode)
        );
      case 2:
        return formData.learningPreferences.length > 0;
      case 3:
        return formData.selectedInterests.length > 0;
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

    if (step < 3) {
      setStep(step + 1);
      return;
    }

    try {
      setIsSubmitting(true);
      setErrors({});

      // Insert into user_profiles
      const { error: profileError } = await supabase
        .from('user_profiles')
        .insert({
          user_id: user.id,
          age: parseInt(formData.age),
          gender: formData.gender,
          zip_code: formData.zipCode,
          learning_preferences: formData.learningPreferences
        });

      if (profileError) throw profileError;

      // Get existing user interests
      const { data: existingInterests } = await supabase
        .from('user_interests')
        .select('interest_id')
        .eq('user_id', user.id);

      // Filter out interests that already exist
      const existingInterestIds = existingInterests?.map(i => i.interest_id) || [];
      const newInterests = formData.selectedInterests.filter(
        interestId => !existingInterestIds.includes(interestId)
      );

      // Only insert new interests
      if (newInterests.length > 0) {
        const interestInserts = newInterests.map(interestId => ({
          user_id: user.id,
          interest_id: interestId
        }));

        const { error: interestsError } = await supabase
          .from('user_interests')
          .insert(interestInserts);

        if (interestsError) throw interestsError;
      }

      // Only navigate after successful data insertion
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

  const prevStep = () => setStep(step - 1);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Let's get to know you better
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Step {step} of 3
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {step === 1 && (
              <>
                <div>
                  <label htmlFor="age" className="block text-sm font-medium text-gray-700">
                    Age
                  </label>
                  <input
                    type="number"
                    id="age"
                    value={formData.age}
                    onChange={(e) => {
                      setFormData({ ...formData, age: e.target.value });
                      setErrors({ ...errors, age: undefined });
                    }}
                    className={`mt-1 block w-full border ${
                      errors.age ? 'border-red-300' : 'border-gray-300'
                    } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500`}
                  />
                  {errors.age && (
                    <p className="mt-1 text-sm text-red-600">{errors.age}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="gender" className="block text-sm font-medium text-gray-700">
                    Gender
                  </label>
                  <select
                    id="gender"
                    value={formData.gender}
                    onChange={(e) => {
                      setFormData({ ...formData, gender: e.target.value });
                      setErrors({ ...errors, gender: undefined });
                    }}
                    className={`mt-1 block w-full border ${
                      errors.gender ? 'border-red-300' : 'border-gray-300'
                    } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500`}
                  >
                    <option value="">Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                    <option value="prefer_not_to_say">Prefer not to say</option>
                  </select>
                  {errors.gender && (
                    <p className="mt-1 text-sm text-red-600">{errors.gender}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700">
                    ZIP Code
                  </label>
                  <input
                    type="text"
                    id="zipCode"
                    value={formData.zipCode}
                    onChange={(e) => {
                      setFormData({ ...formData, zipCode: e.target.value });
                      setErrors({ ...errors, zipCode: undefined });
                    }}
                    className={`mt-1 block w-full border ${
                      errors.zipCode ? 'border-red-300' : 'border-gray-300'
                    } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500`}
                  />
                  {errors.zipCode && (
                    <p className="mt-1 text-sm text-red-600">{errors.zipCode}</p>
                  )}
                </div>
              </>
            )}

            {step === 2 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  How do you prefer to learn?
                </label>
                <div className="space-y-2">
                  {['Visual', 'Reading/Writing', 'Auditory', 'Hands-on'].map((preference) => (
                    <label key={preference} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.learningPreferences.includes(preference.toLowerCase() as LearningPreference)}
                        onChange={(e) => {
                          const preferences = e.target.checked
                            ? [...formData.learningPreferences, preference.toLowerCase() as LearningPreference]
                            : formData.learningPreferences.filter(p => p !== preference.toLowerCase());
                          setFormData({ ...formData, learningPreferences: preferences });
                          setErrors({ ...errors, learningPreferences: undefined });
                        }}
                        className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                      />
                      <span className="ml-2">{preference}</span>
                    </label>
                  ))}
                </div>
                {errors.learningPreferences && (
                  <p className="mt-1 text-sm text-red-600">{errors.learningPreferences}</p>
                )}
              </div>
            )}

            {step === 3 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-4">
                  What are you interested in learning?
                </label>
                <InterestsSelection
                  selectedInterests={formData.selectedInterests}
                  onInterestsChange={(interests) => {
                    setFormData({ ...formData, selectedInterests: interests });
                    setErrors({ ...errors, selectedInterests: undefined });
                  }}
                />
                {errors.selectedInterests && (
                  <p className="mt-1 text-sm text-red-600">{errors.selectedInterests}</p>
                )}
              </div>
            )}

            {errors.submit && (
              <div className="rounded-md bg-red-50 p-4">
                <p className="text-sm text-red-600">{errors.submit}</p>
              </div>
            )}

            <div className="flex justify-between">
              {step > 1 && (
                <button
                  type="button"
                  onClick={prevStep}
                  disabled={isSubmitting}
                  className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50"
                >
                  Previous
                </button>
              )}
              <button
                type="submit"
                disabled={isSubmitting || !isStepValid(step)}
                className={`inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white ${
                  step === 3 ? 'bg-green-600 hover:bg-green-700' : 'bg-purple-600 hover:bg-purple-700'
                } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50`}
              >
                {isSubmitting ? (
                  <span className="flex items-center">
                    <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
                    Saving...
                  </span>
                ) : step === 3 ? (
                  'Complete'
                ) : (
                  'Next'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default OnboardingPage;