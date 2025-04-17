import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../store/useAuthStore';
import { InterestsSelection } from '../components/InterestsSelection';
import { LearningPreference } from '../types';

const OnboardingPage = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    age: '',
    gender: '',
    zipCode: '',
    learningPreferences: [] as LearningPreference[],
    selectedInterests: [] as string[]
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;

    try {
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

      // Insert into user_interests
      const interestInserts = formData.selectedInterests.map(interestId => ({
        user_id: user.id,
        interest_id: interestId
      }));

      const { error: interestsError } = await supabase
        .from('user_interests')
        .insert(interestInserts);

      if (interestsError) throw interestsError;

      navigate('/courses');
    } catch (error) {
      console.error('Error saving onboarding data:', error);
    }
  };

  const nextStep = () => setStep(step + 1);
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
                    onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                  />
                </div>
                <div>
                  <label htmlFor="gender" className="block text-sm font-medium text-gray-700">
                    Gender
                  </label>
                  <select
                    id="gender"
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                  >
                    <option value="">Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                    <option value="prefer_not_to_say">Prefer not to say</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700">
                    ZIP Code
                  </label>
                  <input
                    type="text"
                    id="zipCode"
                    value={formData.zipCode}
                    onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                  />
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
                        }}
                        className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                      />
                      <span className="ml-2">{preference}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {step === 3 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-4">
                  What are you interested in learning?
                </label>
                <InterestsSelection
                  selectedInterests={formData.selectedInterests}
                  onInterestsChange={(interests) => setFormData({ ...formData, selectedInterests: interests })}
                />
              </div>
            )}

            <div className="flex justify-between">
              {step > 1 && (
                <button
                  type="button"
                  onClick={prevStep}
                  className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                >
                  Previous
                </button>
              )}
              {step < 3 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                >
                  Next
                </button>
              ) : (
                <button
                  type="submit"
                  className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                >
                  Complete
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default OnboardingPage;