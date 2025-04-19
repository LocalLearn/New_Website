import React from 'react';

interface ProgressBarProps {
  currentChallenge: number;
  totalChallenges: number;
}

export function ProgressBar({ currentChallenge, totalChallenges }: ProgressBarProps) {
  const progress = Math.round((currentChallenge / totalChallenges) * 100);

  return (
    <div className="w-full space-y-2" role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100}>
      <div className="flex justify-between items-center text-sm text-gray-600">
        <span>Challenge {currentChallenge} of {totalChallenges}</span>
        <span>{progress}% Complete</span>
      </div>
      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
        <div 
          className="h-full bg-purple-600 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}