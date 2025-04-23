import React from 'react';

interface LearningDifficultyStepProps {
  selectedDifficulty: string;
  onChange: (difficulty: string) => void;
  error?: string;
}

export function LearningDifficultyStep({ selectedDifficulty, onChange, error }: LearningDifficultyStepProps) {
  const difficulties = [
    {
      name: 'Novice',
      description: 'Step-by-step guidance with explanations of core concepts'
    },
    {
      name: 'Explorer',
      description: 'Balanced guided instruction with independent challenges'
    },
    {
      name: 'Expert',
      description: 'Advanced problems with minimal guidance'
    }
  ];

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-4">
        What learning approach works best for you?
      </label>
      <div className="grid grid-cols-1 gap-4">
        {difficulties.map((difficulty) => (
          <button
            key={difficulty.name}
            type="button"
            onClick={() => onChange(difficulty.name)}
            className={`p-6 rounded-lg text-left transition-all ${
              selectedDifficulty === difficulty.name
                ? 'bg-purple-100 border-2 border-purple-500 shadow-md transform -translate-y-1'
                : 'bg-gray-50 border-2 border-gray-200 hover:bg-purple-50 hover:border-purple-300'
            }`}
          >
            <h3 className="text-lg font-semibold mb-2">{difficulty.name}</h3>
            <p className="text-sm text-gray-600">{difficulty.description}</p>
          </button>
        ))}
      </div>
      {error && (
        <p className="mt-4 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}