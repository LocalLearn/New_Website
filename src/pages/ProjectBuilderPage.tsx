import React, { useState, useRef, useEffect } from 'react';
import { Send, RefreshCw, ChevronDown, ChevronUp } from 'lucide-react';
import { PROJECT_TOOLS } from '../lib/constants';
import { ChatMessage } from '../lib/types';
import { ChatState, handleChatMessage } from '../lib/chat';
import { FormattedMessage } from '../components/FormattedMessage';
import { LoadingIndicator } from '../components/LoadingIndicator';
import { chatCache } from '../lib/cache';
import { useAuth } from '../contexts/AuthContext';

function ProjectBuilderPage() {
  const { user } = useAuth();
  const [selectedTool, setSelectedTool] = useState(PROJECT_TOOLS[0]);
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [streamingContent, setStreamingContent] = useState('');
  const [isInstructionsOpen, setIsInstructionsOpen] = useState(true);
  const chatState = useRef(new ChatState());
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const instructionsRef = useRef<HTMLDivElement>(null);
  const [shouldAutoScroll, setShouldAutoScroll] = useState(true);

  // Handle tool selection
  const handleToolChange = async (newTool: string) => {
    if (!user?.id) return;

    setSelectedTool(newTool);
    setChatHistory([]);
    chatState.current.reset();

    try {
      const messages = await chatCache.getConversationFromCache(newTool, user.id);
      if (messages.length > 0) {
        const sortedMessages = [...messages].sort((a, b) => {
          const aTime = a.timestamp ? new Date(a.timestamp).getTime() : 0;
          const bTime = b.timestamp ? new Date(b.timestamp).getTime() : 0;
          return aTime - bTime;
        });
        setChatHistory(sortedMessages);
      }
    } catch (error) {
      console.error('Error loading cached messages:', error);
    }
  };

  useEffect(() => {
    if (!user?.id) return;
    handleToolChange(selectedTool);
  }, [user?.id]);

  const isNearBottom = () => {
    const container = chatContainerRef.current;
    if (!container) return true;
    
    const threshold = 100;
    const position = container.scrollHeight - container.scrollTop - container.clientHeight;
    return position <= threshold;
  };

  const scrollToBottom = (force = false) => {
    if (!shouldAutoScroll && !force) return;
    
    const container = chatContainerRef.current;
    if (!container) return;

    container.scrollTo({
      top: container.scrollHeight,
      behavior: 'smooth'
    });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory]);

  useEffect(() => {
    if (streamingContent && shouldAutoScroll) {
      scrollToBottom();
    }
  }, [streamingContent, shouldAutoScroll]);

  const handleScroll = () => {
    setShouldAutoScroll(isNearBottom());
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const currentMessage = message.trim();
    if (!currentMessage || !user?.id) return;

    setMessage('');
    const newMessage: ChatMessage = {
      role: 'user',
      content: currentMessage,
      timestamp: new Date().toISOString(),
      userId: user.id,
    };
    
    setChatHistory(prev => [...prev, newMessage]);
    setStreamingContent('');
    setShouldAutoScroll(true);
    scrollToBottom(true);
    
    inputRef.current?.focus();
    setIsLoading(true);

    try {
      const response = await handleChatMessage(
        currentMessage,
        chatHistory,
        chatState.current,
        selectedTool,
        (chunk) => {
          setStreamingContent(prev => prev + chunk);
        }
      );
      
      setChatHistory(response);
      setStreamingContent('');
    } catch (error) {
      console.error('Error handling message:', error);
      setChatHistory(prev => [...prev, {
        role: 'assistant',
        content: 'I apologize, but I encountered an error processing your request. Please try again.',
        timestamp: new Date().toISOString(),
        userId: user.id,
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const resetTool = async () => {
    if (!user?.id) return;

    chatState.current.reset();
    setChatHistory([]);
    setMessage('');
    setStreamingContent('');
    setShouldAutoScroll(true);
    
    try {
      const store = await chatCache.getStore('readwrite');
      const request = store.delete([user.id, selectedTool]);
      
      request.onerror = () => {
        console.error('Error clearing tool cache:', request.error);
      };
      
      request.onsuccess = () => {
        console.log('Tool cache cleared successfully');
      };
    } catch (error) {
      console.error('Error clearing tool cache:', error);
    }
    
    inputRef.current?.focus();
  };

  const toggleInstructions = () => {
    setIsInstructionsOpen(!isInstructionsOpen);
  };

  return (
    <div className="min-h-[calc(100vh-80px)] bg-gray-50">
      <div className="container mx-auto px-4  py-8">
        <div className="space-y-8">
          {/* Instructions and Controls Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <button
                  onClick={toggleInstructions}
                  className="w-full px-6 py-4 flex items-center justify-between text-left bg-purple-50 hover:bg-purple-100 transition-colors"
                  aria-expanded={isInstructionsOpen}
                  aria-controls="instructions-content"
                >
                  <h3 className="font-semibold text-gray-900">Instructions and Tips</h3>
                  {isInstructionsOpen ? (
                    <ChevronUp className="w-5 h-5 text-gray-600" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-600" />
                  )}
                </button>
                <div
                  id="instructions-content"
                  ref={instructionsRef}
                  className={`transition-all duration-300 ease-in-out overflow-hidden ${
                    isInstructionsOpen ? 'max-h-96' : 'max-h-0'
                  }`}
                  aria-hidden={!isInstructionsOpen}
                >
                  <div className="p-6">
                    <div className="mb-6">
                      <h4 className="font-semibold text-gray-900 mb-2">Getting Started:</h4>
                      <ol className="list-decimal list-inside space-y-2 text-gray-600">
                        <li>Select a tool from the dropdown menu</li>
                        <li>Type 'Let's Go' to begin</li>
                        <li>Set your preferences when prompted</li>
                        <li>Follow the tool's guidance for project planning</li>
                      </ol>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Tips for Success:</h4>
                      <ul className="list-disc list-inside space-y-2 text-gray-600">
                        <li>Be specific about your project goals</li>
                        <li>Break down complex tasks into smaller steps</li>
                        <li>Document your progress regularly</li>
                        <li>Collaborate effectively with team members</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow-md p-6">
                <label htmlFor="tool" className="block text-sm font-medium text-gray-700 mb-2">
                  Select Tool
                </label>
                <select
                  id="tool"
                  value={selectedTool}
                  onChange={(e) => handleToolChange(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  {PROJECT_TOOLS.map((tool) => (
                    <option key={tool} value={tool}>
                      {tool}
                    </option>
                  ))}
                </select>
              </div>

              <button
                onClick={resetTool}
                disabled={!user}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
              >
                <RefreshCw className="w-4 h-4" />
                Reset Tool
              </button>
            </div>
          </div>

          {/* Chat Section */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="h-[600px] flex flex-col">
              <div 
                ref={chatContainerRef}
                onScroll={handleScroll}
                className="flex-1 p-4 overflow-y-auto scroll-smooth"
              >
                {chatHistory.map((msg, index) => (
                  <FormattedMessage
                    key={`${msg.timestamp}-${index}`}
                    content={msg.content}
                    isUser={msg.role === 'user'}
                  />
                ))}
                {streamingContent && (
                  <FormattedMessage
                    content={streamingContent}
                    isUser={false}
                  />
                )}
                {isLoading && !streamingContent && <LoadingIndicator />}
                <div ref={messagesEndRef} className="h-[1px]" />
              </div>

              <form onSubmit={handleSubmit} className="border-t p-4">
                <div className="flex gap-2">
                  <input
                    ref={inputRef}
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    disabled={isLoading || !user}
                  />
                  <button
                    type="submit"
                    disabled={isLoading || !user}
                    className="bg-purple-600 text-white p-2 rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProjectBuilderPage;