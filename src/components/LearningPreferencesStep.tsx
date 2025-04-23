import React from 'react';
import { LearningPreference } from '../types';

interface LearningPreferencesStepProps {
  selectedPreferences: LearningPreference[];
  onChange: (preferences: LearningPreference[]) => void;
  error?: string;
}

export function LearningPreferencesStep({ selectedPreferences, onChange, error }: LearningPreferencesStepProps) {
  const preferences = [
    {
      name: 'Visual',
      description: 'Learn through diagrams, charts, and visual examples'
    },
    {
      name: 'Reading/Writing',
      description: 'Learn by reading documentation and writing notes'
    },
    {
      name: 'Auditory',
      description: 'Learn through spoken explanations and discussions'
    },
    {
      name: 'Hands-on',
      description: 'Learn by doing and experimenting with code'
    }
  ];

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-4">
        How do you learn best?
      </label>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {preferences.map((preference) => (
          <button
            key={preference.name}
            type="button"
            onClick={() => {
              const prefLower = preference.name.toLowerCase() as LearningPreference;
              const newPreferences = selectedPreferences.includes(prefLower)
                ? selectedPreferences.filter(p => p !== prefLower)
                : [...selectedPreferences, prefLower];
              onChange(newPreferences);
            }}
            className={`p-6 rounded-lg text-left transition-all ${
              selectedPreferences.includes(preference.name.toLowerCase() as LearningPreference)
                ? 'bg-purple-100 border-2 border-purple-500 shadow-md transform -translate-y-1'
                : 'bg-gray-50 border-2 border-gray-200 hover:bg-purple-50 hover:border-purple-300'
            }`}
          >
            <h3 className="text-lg font-semibold mb-2">{preference.name}</h3>
            <p className="text-sm text-gray-600">{preference.description}</p>
          </button>
        ))}
      </div>
      {error && (
        <p className="mt-4 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}