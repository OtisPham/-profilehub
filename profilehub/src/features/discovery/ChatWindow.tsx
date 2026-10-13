import React, { useState, useRef, useEffect } from 'react';
import type { ChatMessage, PublicPendingFact } from '../../types';
import { FactCard } from './FactCard';

interface ChatWindowProps {
  messages: ChatMessage[];
  isSending: boolean;
  onSendMessage: (text: string) => void;
  onResolveFact: (factId: string, action: 'confirm' | 'reject') => void;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({
  messages,
  isSending,
  onSendMessage,
  onResolveFact,
}) => {
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickPrompts = [
    '💻 Tôi là Frontend Developer với thế mạnh React, TypeScript, TailwindCSS.',
    '⚡ Dự án gần nhất tôi đã tối ưu tốc độ tải trang web tăng 40% bằng Lazy loading & Caching.',
    '🐛 Tôi từng xử lý sự cố giật lag và tối ưu kết nối API trong đồ án tốt nghiệp.',
    '👥 Tôi từng làm việc nhóm 4 người, phân chia task và review code qua GitHub PR.',
  ];


  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isSending]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isSending) return;
    onSendMessage(inputText);
    setInputText('');
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-50 relative overflow-hidden">
      {/* Header */}
      <header className="px-6 py-4 bg-white border-b border-gray-200 shadow-sm flex items-center justify-between">
        <div>
          <h1 className="text-base font-semibold text-gray-900">Phiên Career Discovery</h1>
          <p className="text-xs text-gray-500">Khám phá năng lực & xây dựng Career DNA cùng AI</p>
        </div>
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
          AI Đang trực tuyến
        </span>
      </header>

      {/* Message List */}
      <div className="flex-1 p-4 md:p-6 overflow-y-auto space-y-4">
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';
          return (
            <div key={msg.id} className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
              <div
                className={`max-w-2xl px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                  isUser
                    ? 'bg-blue-600 text-white rounded-br-sm shadow-sm'
                    : 'bg-white text-gray-800 border border-gray-200 rounded-bl-sm shadow-sm'
                }`}
              >
                <div className="whitespace-pre-wrap">{msg.content}</div>

                {/* Inline Facts Trích Xuất */}
                {msg.facts && msg.facts.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-blue-100">
                    <p className="text-xs font-semibold text-blue-900 mb-2">
                      💡 Dữ kiện AI phát hiện & đề xuất bổ sung:
                    </p>
                    <div className="space-y-2">
                      {msg.facts.map((fact: PublicPendingFact) => (
                        <FactCard key={fact.id} fact={fact} onResolve={onResolveFact} />
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <span className="text-[11px] text-gray-400 mt-1 px-1">{msg.timestamp}</span>
            </div>
          );
        })}

        {isSending && (
          <div className="flex items-center gap-2 text-gray-400 text-xs italic bg-white px-4 py-2.5 rounded-2xl border border-gray-200 w-fit">
            <div className="flex gap-1">
              <span className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
              <span className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
              <span className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce"></span>
            </div>
            AI đang phân tích câu trả lời & trích xuất thành tích...
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompts */}
      {messages.length <= 2 && (
        <div className="px-6 py-2 bg-white/60 border-t border-gray-100 flex flex-wrap gap-2">
          {quickPrompts.map((prompt, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => onSendMessage(prompt)}
              className="text-xs bg-white hover:bg-blue-50 text-gray-700 hover:text-blue-700 border border-gray-200 hover:border-blue-200 rounded-full px-3 py-1.5 transition-all shadow-xs"
            >
              + {prompt}
            </button>
          ))}
        </div>
      )}

      {/* Input Form */}
      <div className="p-4 bg-white border-t border-gray-200">
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto flex gap-3">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            disabled={isSending}
            placeholder="Chia sẻ về dự án, kỹ năng hoặc trải nghiệm công việc của bạn..."
            className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all disabled:opacity-60"
          />
          <button
            type="submit"
            disabled={isSending || !inputText.trim()}
            className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-medium px-5 py-3 rounded-xl text-sm transition-all shadow-sm"
          >
            Gửi
          </button>
        </form>
      </div>
    </div>
  );
};
