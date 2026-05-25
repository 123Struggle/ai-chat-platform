'use client';

import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { User, Bot } from 'lucide-react';
import { Message as MessageType } from '@/types/chat';

interface MessageProps {
  message: MessageType;
  isStreaming?: boolean;
}

export default function Message({ message, isStreaming }: MessageProps) {
  const isUser = message.role === 'user';

  return (
    <div className={`flex gap-4 p-4 ${isUser ? 'bg-transparent' : 'bg-gray-50'}`}>
      <div
        className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
          isUser ? 'bg-blue-500' : 'bg-green-500'
        }`}
      >
        {isUser ? (
          <User size={18} className="text-white" />
        ) : (
          <Bot size={18} className="text-white" />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="font-medium text-sm text-gray-700 mb-1">
          {isUser ? '你' : 'AI助手'}
        </div>
        <div className="prose prose-sm max-w-none">
          <ReactMarkdown
            components={{
              code({ className, children, ...props }) {
                const match = /language-(\w+)/.exec(className || '');
                const codeString = String(children).replace(/\n$/, '');
                const inline = !className && !codeString.includes('\n');

                if (!inline && match) {
                  return (
                    <div className="relative">
                      <div className="absolute top-2 right-2 text-xs text-gray-400 bg-gray-700 px-2 py-1 rounded">
                        {match[1]}
                      </div>
                      <SyntaxHighlighter
                        style={oneDark}
                        language={match[1]}
                        PreTag="div"
                        className="rounded-lg"
                      >
                        {codeString}
                      </SyntaxHighlighter>
                    </div>
                  );
                }

                return (
                  <code
                    className="bg-gray-100 px-1.5 py-0.5 rounded text-sm text-pink-600"
                    {...props}
                  >
                    {children}
                  </code>
                );
              },
              p({ children }) {
                return <p className="mb-3 last:mb-0">{children}</p>;
              },
              ul({ children }) {
                return <ul className="list-disc pl-5 mb-3 space-y-1">{children}</ul>;
              },
              ol({ children }) {
                return <ol className="list-decimal pl-5 mb-3 space-y-1">{children}</ol>;
              },
              li({ children }) {
                return <li>{children}</li>;
              },
              h1({ children }) {
                return <h1 className="text-2xl font-bold mb-3 mt-4">{children}</h1>;
              },
              h2({ children }) {
                return <h2 className="text-xl font-bold mb-3 mt-4">{children}</h2>;
              },
              h3({ children }) {
                return <h3 className="text-lg font-bold mb-3 mt-4">{children}</h3>;
              },
              blockquote({ children }) {
                return (
                  <blockquote className="border-l-4 border-gray-300 pl-4 italic text-gray-600 mb-3">
                    {children}
                  </blockquote>
                );
              },
              a({ href, children }) {
                return (
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline"
                  >
                    {children}
                  </a>
                );
              },
            }}
          >
            {message.content}
          </ReactMarkdown>
          {isStreaming && (
            <span className="inline-block w-2 h-4 bg-gray-400 animate-pulse ml-0.5" />
          )}
        </div>
      </div>
    </div>
  );
}
