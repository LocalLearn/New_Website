import React, { useRef, useEffect } from 'react';
import { Send } from 'lucide-react';

interface ChatInputProps {
  message: string;
  setMessage: (message: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
  disabled?: boolean;
}

export function ChatInput({ message, setMessage, onSubmit, isLoading, disabled }: ChatInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      // Reset height to auto to properly calculate new height
      textareaRef.current.style.height = 'auto';
      // Set new height based on scrollHeight
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [message]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (!isLoading && message.trim()) {
        onSubmit(e);
      }
    }
  };

  return (
    <form onSubmit={onSubmit} className="border-t p-4">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message... (Shift + Enter for new line)"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none min-h-[44px] max-h-[200px] overflow-y-auto"
            disabled={isLoading || disabled}
            rows={1}
          />
        </div>
        <button
          type="submit"
          disabled={isLoading || disabled || !message.trim()}
          className="bg-purple-600 text-white p-2 rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 h-[44px] w-[44px] flex items-center justify-center"
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
    </form>
  );
}