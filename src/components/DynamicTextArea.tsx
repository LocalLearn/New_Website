import React, { useRef, useEffect, ChangeEvent, KeyboardEvent } from 'react';

interface DynamicTextAreaProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  disabled?: boolean;
  placeholder?: string;
  maxHeight?: number;
}

export function DynamicTextArea({
  value,
  onChange,
  onSubmit,
  disabled = false,
  placeholder = 'Type your message...',
  maxHeight = 200
}: DynamicTextAreaProps) {
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  const adjustHeight = () => {
    const textArea = textAreaRef.current;
    if (!textArea) return;

    // Reset height to auto to get the correct scrollHeight
    textArea.style.height = 'auto';
    
    // Calculate new height
    const newHeight = Math.min(textArea.scrollHeight, maxHeight);
    textArea.style.height = `${newHeight}px`;
    
    // Add scrollbar if content exceeds maxHeight
    textArea.style.overflowY = textArea.scrollHeight > maxHeight ? 'auto' : 'hidden';
  };

  useEffect(() => {
    adjustHeight();
  }, [value, maxHeight]);

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (value.trim()) {
        onSubmit();
      }
    }
  };

  return (
    <textarea
      ref={textAreaRef}
      value={value}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      disabled={disabled}
      placeholder={placeholder}
      rows={1}
      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
      style={{
        minHeight: '42px', // Match the height of a single-line input
        maxHeight: `${maxHeight}px`,
      }}
    />
  );
}