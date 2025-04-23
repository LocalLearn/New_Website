import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles } from 'lucide-react';
import { ChatMessage, Challenge } from '../lib/types';
import { ChatState, handleChatMessage } from '../lib/chat';
import { FormattedMessage } from '../components/FormattedMessage';
import { LoadingIndicator } from '../components/LoadingIndicator';
import { ChatInput } from '../components/ChatInput';
import { ProgressBar } from '../components/ProgressBar';
import { chatCache } from '../lib/cache';
import { useAuth } from '../contexts/AuthContext';
import { lesson1Content } from '../lib/lessons/lesson1';

// Only use the first three challenges for the demo
const DEMO_CHALLENGES = lesson1Content.slice(0, 3);
const LESSON_NAME = 'Lesson 1: Basics of Syntax and Execution';

function CodeDemoPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [streamingContent, setStreamingContent] = useState('');
  const [demoComplete, setDemoComplete] = useState(false);
  const chatState = useRef(new ChatState());
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const [shouldAutoScroll, setShouldAutoScroll] = useState(true);

  useEffect(() => {
    if (!user?.id) return;

    const loadCachedMessages = async () => {
      try {
        const { messages, currentChallengeIndex } = await chatCache.getConversationFromCache(LESSON_NAME, user.id);
        if (messages.length > 0) {
          const sortedMessages = [...messages].sort((a, b) => {
            const aTime = a.timestamp ? new Date(a.timestamp).getTime() : 0;
            const bTime = b.timestamp ? new Date(b.timestamp).getTime() : 0;
            return aTime - bTime;
          });
          setChatHistory(sortedMessages);
          chatState.current.setPreferencesFromHistory(sortedMessages);
          chatState.current.setCurrentChallengeIndex(currentChallengeIndex);
          
          // Set demo complete if all challenges are done
          if (currentChallengeIndex >= DEMO_CHALLENGES.length) {
            setDemoComplete(true);
          }
        }
      } catch (error) {
        console.error('Error loading cached messages:', error);
      }
    };

    loadCachedMessages();
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
    if (!currentMessage || !user?.id || demoComplete) return;

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
    
    setIsLoading(true);

    try {
      const response = await handleChatMessage(
        currentMessage,
        chatHistory,
        chatState.current,
        LESSON_NAME,
        DEMO_CHALLENGES,
        (chunk) => {
          setStreamingContent(prev => prev + chunk);
        }
      );
      
      setChatHistory(response);
      setStreamingContent('');

      // Check if all demo challenges are completed
      if (chatState.current.getCurrentChallengeIndex() >= DEMO_CHALLENGES.length) {
        setDemoComplete(true);
      }
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

  return (
    <div className="min-h-[calc(100vh-80px)] bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Python Demo</h2>
            <p className="text-gray-600">
              Experience a quick taste of our interactive Python lessons. Complete these three challenges to unlock the full course!
            </p>
            <div className="mt-4">
              <ProgressBar
                currentChallenge={chatState.current.getCurrentChallengeIndex()}
                totalChallenges={DEMO_CHALLENGES.length}
              />
            </div>
          </div>

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

              <div className="border-t">
                {demoComplete ? (
                  <div className="p-4 flex justify-center">
                    <button
                      onClick={() => navigate('/courses')}
                      className="group relative overflow-hidden bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-lg font-bold px-8 py-4 rounded-xl shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 animate-pulse hover:animate-none"
                    >
                      <div className="absolute inset-0 bg-white/20 group-hover:animate-sparkle" />
                      <span className="flex items-center gap-2">
                        <Sparkles className="w-6 h-6 animate-bounce" />
                        Claim your reward!
                        <Sparkles className="w-6 h-6 animate-bounce delay-100" />
                      </span>
                    </button>
                  </div>
                ) : (
                  <ChatInput
                    message={message}
                    setMessage={setMessage}
                    onSubmit={handleSubmit}
                    isLoading={isLoading}
                    disabled={!user || demoComplete}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CodeDemoPage;