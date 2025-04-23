import React from 'react';
import { Loader2 } from 'lucide-react';

interface OnboardingNavigationProps {
  currentStep: number;
  totalSteps: number;
  onPrevious: () => void;
  onNext: () => void;
  isSubmitting: boolean;
  isValid: boolean;
}

export function OnboardingNavigation({ 
  currentStep,
  totalSteps,
  onPrevious,
  onNext,
  isSubmitting,
  isValid
}: OnboardingNavigationProps) {
  return (
    <div className="flex justify-between">
      {currentStep > 1 && (
        <button
          type="button"
          onClick={onPrevious}
          disabled={isSubmitting}
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50"
        >
          Previous
        </button>
      )}
      <button
        type="submit"
        disabled={isSubmitting || !isValid}
        className={`inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white ${
          currentStep === totalSteps ? 'bg-green-600 hover:bg-green-700' : 'bg-purple-600 hover:bg-purple-700'
        } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50`}
      >
        {isSubmitting ? (
          <span className="flex items-center">
            <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
            Saving...
          </span>
        ) : currentStep === totalSteps ? (
          'Complete'
        ) : (
          'Next'
        )}
      </button>
    </div>
  );
}