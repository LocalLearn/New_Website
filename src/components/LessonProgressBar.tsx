import React from 'react';

interface LessonProgressBarProps {
  totalChallenges: number;
  completedChallenges: number;
  className?: string;
}

export function LessonProgressBar({
  totalChallenges,
  completedChallenges,
  className = '',
}: LessonProgressBarProps) {
  const percentage = Math.min(100, Math.round((completedChallenges / totalChallenges) * 100)) || 0;

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium text-gray-700">
          Progress: {completedChallenges} of {totalChallenges} challenges
        </span>
        <span className="text-sm font-medium text-purple-600">{percentage}%</span>
      </div>
      <div
        className="h-2 bg-gray-200 rounded-full overflow-hidden"
        role="progressbar"
        aria-valuenow={percentage}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className="h-full bg-purple-600 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}