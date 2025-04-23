import React from 'react';
import { Code2, Blocks, Braces, Cpu } from 'lucide-react';

interface WelcomeStepProps {
  onNext: () => void;
}

export function WelcomeStep({ onNext }: WelcomeStepProps) {
  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h3 className="text-2xl font-bold text-gray-900">
          Choose a topic to explore!
        </h3>
        <p className="text-gray-600">
          Experience how LocalLearn combines AI lessons with collaborative projects in minutes
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Python Card */}
        <div className="bg-purple-50 p-6 rounded-lg space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Code2 className="w-6 h-6 text-purple-600" />
            </div>
            <h4 className="font-semibold text-purple-900">Python</h4>
          </div>
          <p className="text-purple-700">
            Build anything from automation tools to AI in minutes. Python is beginner-friendly, powerful, and your gateway to coding magic.
          </p>
          <button
            onClick={onNext}
            className="w-full bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
          >
            Start Learning!
          </button>
        </div>

        {/* React Card */}
        <div className="bg-purple-50 p-6 rounded-lg space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Blocks className="w-6 h-6 text-purple-600" />
            </div>
            <h4 className="font-semibold text-purple-900">React</h4>
          </div>
          <p className="text-purple-700">
            Create stunning web apps with lightning-fast performance. React lets you build interactive interfaces like a frontend wizard.
          </p>
          <button
            disabled
            className="w-full bg-purple-200 text-purple-400 px-4 py-2 rounded-lg cursor-not-allowed"
          >
            Coming Soon...
          </button>
        </div>

        {/* JavaScript Card */}
        <div className="bg-purple-50 p-6 rounded-lg space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Braces className="w-6 h-6 text-purple-600" />
            </div>
            <h4 className="font-semibold text-purple-900">JavaScript</h4>
          </div>
          <p className="text-purple-700">
            The language of the web! Power websites, games, and dynamic apps straight from your browser. Code it, click it, ship it.
          </p>
          <button
            disabled
            className="w-full bg-purple-200 text-purple-400 px-4 py-2 rounded-lg cursor-not-allowed"
          >
            Coming Soon...
          </button>
        </div>

        {/* C++ Card */}
        <div className="bg-purple-50 p-6 rounded-lg space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Cpu className="w-6 h-6 text-purple-600" />
            </div>
            <h4 className="font-semibold text-purple-900">C++</h4>
          </div>
          <p className="text-purple-700">
            Master the language behind high-performance engines and real-time systems. C++ is raw power with ultimate control.
          </p>
          <button
            disabled
            className="w-full bg-purple-200 text-purple-400 px-4 py-2 rounded-lg cursor-not-allowed"
          >
            Coming Soon...
          </button>
        </div>
      </div>
    </div>
  );
}