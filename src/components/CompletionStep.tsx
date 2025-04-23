import React from 'react';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface CompletionStepProps {
  onNext: () => void;
}

export function CompletionStep({ onNext }: CompletionStepProps) {
  const navigate = useNavigate();

  const handleStart = () => {
    navigate('/code-demo');
  };

  return (
    <div className="flex flex-col items-center text-center space-y-8">
      {/* Header */}
      <h2 className="text-3xl font-bold text-gray-900">
        Thank you for submitting your preferences!
      </h2>

      {/* Subtext */}
      <p className="text-lg text-gray-600 max-w-2xl">
        Your responses help match you with the right community members and help tailor your coding challenges
      </p>

      {/* Demo Animation */}
      <div className="w-full max-w-[600px] rounded-lg overflow-hidden shadow-lg">
        <img
          src="https://images.unsplash.com/photo-1516116216624-53e697fedbea?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2128&q=80"
          alt="Preview of AI-powered interactive coding lessons"
          className="w-full h-auto"
        />
      </div>

      {/* Call to Action Card */}
      <div className="bg-white rounded-xl shadow-md p-8 max-w-md w-full">
        <h3 className="text-2xl font-semibold text-gray-900 mb-4">
          Let's start coding!
        </h3>
        <p className="text-gray-600 mb-6">
          After this two-minute intro, you can unlock the rest of the course and save your learning progress.
        </p>
        <button
          onClick={handleStart}
          className="w-full flex items-center justify-center gap-2 bg-purple-600 text-white px-6 py-3 rounded-lg text-lg font-medium transition-all duration-200 hover:bg-purple-700 hover:scale-105 hover:brightness-110 cursor-pointer"
        >
          Let's Go!
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}