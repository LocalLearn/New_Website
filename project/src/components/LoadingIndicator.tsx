import React from 'react';

export function LoadingIndicator() {
  return (
    <div className="mb-4 text-left">
      <div className="inline-block max-w-[80%] rounded-lg px-4 py-2 bg-gray-100">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
      </div>
    </div>
  );
}