import React, { useState } from 'react';
import { Send } from 'lucide-react';

const LESSONS = [
  'Lesson 1: Basics of Syntax and Execution',
  'Lesson 2: Control Flow with Conditionals',
  'Lesson 3: Loops and Iteration',
  'Lesson 4: Functions and Scope'
];

function PythonPilotPage() {
  const [selectedLesson, setSelectedLesson] = useState(LESSONS[0]);
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      // Handle message submission
      console.log('Message sent:', message);
      setMessage('');
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Chat Interface */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow-md overflow-hidden">
            <div className="h-[600px] flex flex-col">
              {/* Chat Messages Area */}
              <div className="flex-1 p-4 overflow-y-auto">
                {/* Messages will be displayed here */}
              </div>

              {/* Message Input */}
              <form onSubmit={handleSubmit} className="border-t p-4">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                  <button
                    type="submit"
                    className="bg-purple-600 text-white p-2 rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Right Panel */}
          <div className="space-y-6">
            {/* Lesson Selection */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <label htmlFor="lesson" className="block text-sm font-medium text-gray-700 mb-2">
                Select Lesson
              </label>
              <select
                id="lesson"
                value={selectedLesson}
                onChange={(e) => setSelectedLesson(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                {LESSONS.map((lesson) => (
                  <option key={lesson} value={lesson}>
                    {lesson}
                  </option>
                ))}
              </select>
            </div>

            {/* Instructions Box */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Instructions:</h3>
              <ol className="list-decimal list-inside space-y-2 text-gray-600 mb-6">
                <li>Select a lesson from the dropdown menu above</li>
                <li>Type 'Let's Go' to begin the lesson</li>
                <li>Ask questions about the lesson content</li>
                <li>The AI will respond with helpful explanations</li>
              </ol>
              <h4 className="font-semibold text-gray-900 mb-2">Tips:</h4>
              <ul className="list-disc list-inside space-y-2 text-gray-600">
                <li>Be specific in your questions</li>
                <li>Use follow-up questions to dive deeper</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PythonPilotPage;