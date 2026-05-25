'use client';

import { MessageSquare, Plus, ChevronLeft, ChevronRight } from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  onNewChat: () => void;
}

export default function Sidebar({ isOpen, onToggle, onNewChat }: SidebarProps) {
  return (
    <div
      className={`bg-gray-900 text-white transition-all duration-300 flex flex-col ${
        isOpen ? 'w-64' : 'w-0 overflow-hidden'
      }`}
    >
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        <span className="font-semibold text-lg">会话列表</span>
        <button
          onClick={onToggle}
          className="p-1 hover:bg-gray-700 rounded transition-colors"
          aria-label="收起侧边栏"
        >
          <ChevronLeft size={20} />
        </button>
      </div>

      <div className="p-3">
        <button
          onClick={onNewChat}
          className="w-full flex items-center gap-2 px-4 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
        >
          <Plus size={18} />
          <span>新建对话</span>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {/* 未来扩展：历史会话列表 */}
        <div className="flex items-center gap-2 px-4 py-3 bg-gray-800 rounded-lg text-gray-300">
          <MessageSquare size={16} />
          <span className="truncate">当前对话</span>
        </div>
      </div>

      <div className="p-4 border-t border-gray-700 text-sm text-gray-400">
        <p>AI大模型在线平台</p>
        <p className="text-xs mt-1">基于GPT-5.5</p>
      </div>
    </div>
  );
}
