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
    if (e.key === 'Tab') {
      e.preventDefault();
      const start = e.currentTarget.selectionStart;
      const end = e.currentTarget.selectionEnd;
      const spaces = '    '; // 4 spaces for indentation

      const newValue = value.substring(0, start) + spaces + value.substring(end);
      onChange(newValue);

      // Move cursor after indentation
      setTimeout(() => {
        if (textAreaRef.current) {
          textAreaRef.current.selectionStart = textAreaRef.current.selectionEnd = start + spaces.length;
        }
      }, 0);
    } else if (e.key === 'Enter') {
      if (e.shiftKey) {
        // Allow new line with Shift+Enter
        return;
      }
      e.preventDefault();
      if (value.trim()) {
        onSubmit();
      }
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const text = e.clipboardData.getData('text/plain');
    
    // Get the current cursor position
    const start = textAreaRef.current?.selectionStart || 0;
    const end = textAreaRef.current?.selectionEnd || 0;
    
    // Insert the pasted text at the cursor position
    const newValue = value.substring(0, start) + text + value.substring(end);
    onChange(newValue);
    
    // Update cursor position after paste
    setTimeout(() => {
      if (textAreaRef.current) {
        const newPosition = start + text.length;
        textAreaRef.current.selectionStart = textAreaRef.current.selectionEnd = newPosition;
      }
    }, 0);
  };

  return (
    <textarea
      ref={textAreaRef}
      value={value}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      onPaste={handlePaste}
      disabled={disabled}
      placeholder={placeholder}
      rows={1}
      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none font-mono"
      style={{
        minHeight: '42px',
        maxHeight: `${maxHeight}px`,
        tabSize: 4,
      }}
    />
  );
}