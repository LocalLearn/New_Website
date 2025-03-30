import React, { useState, useRef, useEffect } from 'react';
import { Send, RefreshCw } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { LESSONS } from '../lib/constants';
import { ChatMessage } from '../lib/types';
import { ChatState, handleChatMessage } from '../lib/chat';
import { FormattedMessage } from '../components/FormattedMessage';
import { LoadingIndicator } from '../components/LoadingIndicator';
import { HybridStorage } from '../lib/storage/hybrid-storage';
import { useAuth } from '../contexts/AuthContext';
import { DynamicTextArea } from '../components/DynamicTextArea';

function PythonPilotPage() {
  const { user } = useAuth();
  const [selectedLesson, setSelectedLesson] = useState(LESSONS[0]);
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [streamingContent, setStreamingContent] = useState('');
  const chatState = useRef(new ChatState());
  const storage = useRef(new HybridStorage());
  const sessionId = useRef<string>(uuidv4());
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const [shouldAutoScroll, setShouldAutoScroll] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isRestarting, setIsRestarting] = useState(false);

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

  const loadSession = async (lesson: string) => {
    if (!user) return;

    try {
      const sessions = await storage.current.getSessions();
      const lessonSession = sessions.find(s => s.lesson === lesson && s.userId === user.id);

      if (lessonSession) {
        sessionId.current = lessonSession.id;
        setChatHistory(lessonSession.messages);
        chatState.current.updatePreferences(lessonSession.preferences);
      }
    } catch (error) {
      console.error('Error loading chat session:', error);
    }
  };

  const saveSession = async () => {
    if (!user) return;

    try {
      await storage.current.saveSession({
        id: sessionId.current,
        userId: user.id,
        lesson: selectedLesson,
        createdAt: new Date(),
        updatedAt: new Date(),
        preferences: chatState.current.getPreferences(),
        messages: chatHistory,
        isComplete: false,
      });
    } catch (error) {
      console.error('Error saving chat session:', error);
    }
  };

  useEffect(() => {
    if (!isInitialized && user) {
      loadSession(selectedLesson);
      setIsInitialized(true);
    }
  }, [user, isInitialized]);

  useEffect(() => {
    if (chatHistory.length > 0) {
      saveSession();
    }
  }, [chatHistory, user]);

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    const currentMessage = message.trim();
    if (!currentMessage) return;

    setMessage('');
    const newMessage: ChatMessage = { role: 'user', content: currentMessage };
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
        selectedLesson,
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
        content: 'I apologize, but I encountered an error processing your request. Please try again.'
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const restartLesson = async () => {
    if (!user || isRestarting) return;

    setIsRestarting(true);
    try {
      // Delete the current session from storage
      await storage.current.deleteSession(sessionId.current);
      
      // Reset the chat state and UI
      chatState.current.reset();
      setChatHistory([]);
      setMessage('');
      setStreamingContent('');
      setShouldAutoScroll(true);
      
      // Generate a new session ID
      sessionId.current = uuidv4();
    } catch (error) {
      console.error('Error restarting lesson:', error);
      // Optionally show an error message to the user
    } finally {
      setIsRestarting(false);
    }
  };

  const handleLessonChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLesson = e.target.value;
    
    // Save current session before switching
    if (chatHistory.length > 0) {
      await saveSession();
    }
    
    setSelectedLesson(newLesson);
    sessionId.current = uuidv4();
    setChatHistory([]);
    setStreamingContent('');
    chatState.current.reset();
    
    // Load session for the new lesson
    await loadSession(newLesson);
  };

  return (
    <div className="min-h-[calc(100vh-80px)] bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white rounded-lg shadow-md overflow-hidden">
            <div className="h-[600px] flex flex-col">
              <div 
                ref={chatContainerRef}
                onScroll={handleScroll}
                className="flex-1 p-4 overflow-y-auto scroll-smooth"
              >
                {chatHistory.map((msg, index) => (
                  <FormattedMessage
                    key={index}
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
                <div className="flex gap-2 items-end">
                  <DynamicTextArea
                    value={message}
                    onChange={setMessage}
                    onSubmit={handleSubmit}
                    disabled={isLoading}
                    maxHeight={200}
                  />
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="bg-purple-600 text-white p-2 rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 flex-shrink-0"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              </form>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <label htmlFor="lesson" className="block text-sm font-medium text-gray-700 mb-2">
                Select Lesson
              </label>
              <select
                id="lesson"
                value={selectedLesson}
                onChange={handleLessonChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                {LESSONS.map((lesson) => (
                  <option key={lesson} value={lesson}>
                    {lesson}
                  </option>
                ))}
              </select>
            </div>

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
                onClick={restartLesson}
                disabled={isRestarting}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${isRestarting ? 'animate-spin' : ''}`} />
                {isRestarting ? 'Restarting...' : 'Restart Lesson'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PythonPilotPage;