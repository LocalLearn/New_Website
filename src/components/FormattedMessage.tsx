import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface FormattedMessageProps {
  content: string;
  isUser?: boolean;
}

export function FormattedMessage({ content, isUser = false }: FormattedMessageProps) {
  return (
    <div
      className={`mb-4 ${
        isUser ? 'text-right' : 'text-left'
      }`}
    >
      <div
        className={`inline-block max-w-[80%] rounded-lg px-4 py-2 ${
          isUser
            ? 'bg-purple-600 text-white'
            : 'bg-gray-100 text-gray-800'
        }`}
      >
        <ReactMarkdown
          className="prose max-w-none"
          remarkPlugins={[remarkGfm]}
          components={{
            code({ node, inline, className, children, ...props }) {
              const match = /language-(\w+)/.exec(className || '');
              const language = match ? match[1] : 'text';
              
              if (inline) {
                return (
                  <code
                    className={`${
                      isUser ? 'text-purple-100' : 'text-purple-600'
                    } bg-opacity-10 rounded px-1`}
                    {...props}
                  >
                    {children}
                  </code>
                );
              }

              return (
                <div className="rounded-md overflow-hidden my-2">
                  <SyntaxHighlighter
                    language={language}
                    style={tomorrow}
                    customStyle={{
                      margin: 0,
                      padding: '1rem',
                      backgroundColor: isUser ? 'rgba(255, 255, 255, 0.1)' : '#1a1a1a',
                    }}
                    {...props}
                  >
                    {String(children).replace(/\n$/, '')}
                  </SyntaxHighlighter>
                </div>
              );
            },
            p({ children }) {
              return <p className="whitespace-pre-wrap mb-2 last:mb-0">{children}</p>;
            },
            ul({ children }) {
              return <ul className="list-disc list-inside space-y-1 mb-2">{children}</ul>;
            },
            ol({ children }) {
              return <ol className="list-decimal list-inside space-y-1 mb-2">{children}</ol>;
            },
            li({ children }) {
              return <li className="ml-4">{children}</li>;
            },
          }}
        >
          {content}
        </ReactMarkdown>
      </div>
    </div>
  );
}