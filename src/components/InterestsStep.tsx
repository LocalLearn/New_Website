import React from 'react';
import { InterestsSelection } from './InterestsSelection';

interface InterestsStepProps {
  selectedInterests: string[];
  onInterestsChange: (interests: string[]) => void;
  error?: string;
}

export function InterestsStep({ selectedInterests, onInterestsChange, error }: InterestsStepProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-4">
        What are you interested in learning?
      </label>
      <InterestsSelection
        selectedInterests={selectedInterests}
        onInterestsChange={onInterestsChange}
      />
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}