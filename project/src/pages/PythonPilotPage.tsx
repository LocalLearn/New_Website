import React, { useState, useRef, useEffect } from 'react';
import { Send, RefreshCw } from 'lucide-react';
import { LESSONS } from '../lib/constants';
import { ChatMessage } from '../lib/types';
import { ChatState, handleChatMessage } from '../lib/chat';
import { FormattedMessage } from '../components/FormattedMessage';
import { LoadingIndicator } from '../components/LoadingIndicator';

function PythonPilotPage() {
  const [selectedLesson, setSelectedLesson] = useState(LESSONS[0]);
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const chatState = useRef(new ChatState());
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory, isLoading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const currentMessage = message.trim();
    if (!currentMessage) return;

    // Immediately clear input and add user message to chat
    setMessage('');
    const newMessage: ChatMessage = { role: 'user', content: currentMessage };
    setChatHistory(prev => [...prev, newMessage]);
    
    // Focus back on input for next message
    inputRef.current?.focus();

    // Process the message
    setIsLoading(true);
    try {
      const response = await handleChatMessage(
        currentMessage,
        chatHistory,
        chatState.current,
        selectedLesson
      );
      // Only update with assistant's response
      const assistantMessage = response[response.length - 1];
      if (assistantMessage.role === 'assistant') {
        setChatHistory(prev => [...prev, assistantMessage]);
      }
    } catch (error) {
      console.error('Error handling message:', error);
      setChatHistory(prev => [...prev, {
        role: 'assistant',
        content: 'I apologize, but I encountered an error processing your request. Please try again.'
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const resetChat = () => {
    chatState.current.reset();
    setChatHistory([]);
    setMessage('');
    inputRef.current?.focus();
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
                {chatHistory.map((msg, index) => (
                  <FormattedMessage
                    key={index}
                    content={msg.content}
                    isUser={msg.role === 'user'}
                  />
                ))}
                {isLoading && <LoadingIndicator />}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <form onSubmit={handleSubmit} className="border-t p-4">
                <div className="flex gap-2">
                  <input
                    ref={inputRef}
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    disabled={isLoading}
                  />
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="bg-purple-600 text-white p-2 rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
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
                <li>Set your learning preferences when prompted</li>
                <li>Ask questions about the lesson content</li>
              </ol>
              <h4 className="font-semibold text-gray-900 mb-2">Tips:</h4>
              <ul className="list-disc list-inside space-y-2 text-gray-600 mb-6">
                <li>Be specific in your questions</li>
                <li>Use follow-up questions to dive deeper</li>
              </ul>
              <button
                onClick={resetChat}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                Reset Preferences
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PythonPilotPage;