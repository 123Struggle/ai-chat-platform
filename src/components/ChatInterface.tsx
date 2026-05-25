'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Menu, AlertCircle } from 'lucide-react';
import Sidebar from './Sidebar';
import Message from './Message';
import ChatInput from './ChatInput';
import { Message as MessageType } from '@/types/chat';

const WELCOME_MESSAGE: MessageType = {
  id: 'welcome',
  role: 'assistant',
  content: '你好！我是AI助手，有什么可以帮助你的吗？',
  timestamp: new Date(),
};

export default function ChatInterface() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [messages, setMessages] = useState<MessageType[]>([WELCOME_MESSAGE]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  useEffect(() => {
    const savedMessages = localStorage.getItem('chatMessages');
    if (savedMessages) {
      try {
        const parsed = JSON.parse(savedMessages);
        setMessages(parsed.map((msg: MessageType) => ({
          ...msg,
          timestamp: new Date(msg.timestamp),
        })));
      } catch (e) {
        console.error('加载历史消息失败:', e);
      }
    }
  }, []);

  useEffect(() => {
    if (messages.length > 1) {
      localStorage.setItem('chatMessages', JSON.stringify(messages));
    }
  }, [messages]);

  const handleSendMessage = useCallback(async (content: string) => {
    if (isLoading) return;

    setError(null);

    const userMessage: MessageType = {
      id: `user-${Date.now()}`,
      role: 'user',
      content,
      timestamp: new Date(),
    };

    const assistantMessage: MessageType = {
      id: `assistant-${Date.now()}`,
      role: 'assistant',
      content: '',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage, assistantMessage]);
    setIsLoading(true);

    try {
      abortControllerRef.current = new AbortController();

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [...messages, userMessage].map((msg) => ({
            role: msg.role,
            content: msg.content,
          })),
        }),
        signal: abortControllerRef.current.signal,
      });

      if (!response.ok) {
        throw new Error(`请求失败: ${response.status}`);
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error('无法读取响应流');

      const decoder = new TextDecoder();
      let accumulatedContent = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') {
              break;
            }

            try {
              const parsed = JSON.parse(data);
              if (parsed.error) {
                throw new Error(parsed.error);
              }
              if (parsed.content) {
                accumulatedContent += parsed.content;
                setMessages((prev) =>
                  prev.map((msg) =>
                    msg.id === assistantMessage.id
                      ? { ...msg, content: accumulatedContent }
                      : msg
                  )
                );
              }
            } catch (e) {
              if (e instanceof SyntaxError) continue;
              throw e;
            }
          }
        }
      }
    } catch (e) {
      if (e instanceof Error && e.name === 'AbortError') {
        console.log('请求被取消');
      } else {
        const errorMessage = e instanceof Error ? e.message : '发送消息失败';
        setError(errorMessage);
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantMessage.id
              ? { ...msg, content: `错误: ${errorMessage}` }
              : msg
          )
        );
      }
    } finally {
      setIsLoading(false);
      abortControllerRef.current = null;
    }
  }, [messages, isLoading]);

  const handleClearContext = useCallback(() => {
    setMessages([WELCOME_MESSAGE]);
    localStorage.removeItem('chatMessages');
    setError(null);
  }, []);

  const handleNewChat = useCallback(() => {
    handleClearContext();
  }, [handleClearContext]);

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
        onNewChat={handleNewChat}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-4">
          {!sidebarOpen && (
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="展开侧边栏"
            >
              <Menu size={20} />
            </button>
          )}
          <div>
            <h1 className="text-lg font-semibold text-gray-800">AI大模型在线平台</h1>
            <p className="text-sm text-gray-500">基于GPT-5.5模型</p>
          </div>
        </header>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 flex items-center gap-3">
            <AlertCircle className="text-red-400 flex-shrink-0" size={20} />
            <p className="text-red-700 text-sm">{error}</p>
            <button
              onClick={() => setError(null)}
              className="ml-auto text-red-400 hover:text-red-600"
            >
              ×
            </button>
          </div>
        )}

        <div className="flex-1 overflow-y-auto">
          <div className="max-w-4xl mx-auto">
            {messages.map((message) => (
              <Message
                key={message.id}
                message={message}
                isStreaming={isLoading && message.id === messages[messages.length - 1]?.id && message.role === 'assistant'}
              />
            ))}
            <div ref={messagesEndRef} />
          </div>
        </div>

        <ChatInput
          onSendMessage={handleSendMessage}
          isLoading={isLoading}
          onClearContext={handleClearContext}
        />
      </div>
    </div>
  );
}
