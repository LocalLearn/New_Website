import React from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface CodeBlockProps {
  code: string;
  language?: string;
  maxHeight?: number;
}

export function CodeBlock({ code, language = 'python', maxHeight = 400 }: CodeBlockProps) {
  return (
    <div 
      className="rounded-md overflow-hidden my-2"
      style={{ maxHeight: `${maxHeight}px`, overflow: 'auto' }}
    >
      <SyntaxHighlighter
        language={language}
        style={tomorrow}
        customStyle={{
          margin: 0,
          padding: '1rem',
          backgroundColor: '#1a1a1a',
          fontSize: '0.9rem',
          lineHeight: '1.5',
        }}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
}