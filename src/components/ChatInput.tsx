'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Loader2, Trash2 } from 'lucide-react';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
  onClearContext: () => void;
}

export default function ChatInput({ onSendMessage, isLoading, onClearContext }: ChatInputProps) {
  const [input, setInput] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [input]);

  const handleSubmit = () => {
    if (!input.trim() || isLoading) return;
    onSendMessage(input.trim());
    setInput('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="border-t border-gray-200 bg-white p-4">
      <div className="max-w-4xl mx-auto">
        <div className="relative">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="输入你的消息... (Enter发送，Shift+Enter换行)"
            className="w-full px-4 py-3 pr-24 border border-gray-300 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            rows={1}
            disabled={isLoading}
          />
          <div className="absolute right-2 bottom-2 flex items-center gap-2">
            <button
              onClick={onClearContext}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              title="清空上下文"
              disabled={isLoading}
            >
              <Trash2 size={18} />
            </button>
            <button
              onClick={handleSubmit}
              disabled={!input.trim() || isLoading}
              className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <Send size={18} />
              )}
            </button>
          </div>
        </div>
        <p className="text-xs text-gray-400 mt-2 text-center">
          AI可能会产生不准确的信息，请注意甄别
        </p>
      </div>
    </div>
  );
}
