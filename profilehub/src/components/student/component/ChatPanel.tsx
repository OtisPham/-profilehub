import React, { useRef, useEffect, useState } from 'react';
import  { Message } from '../../../types/type';

interface ChatPanelProps {
  messages: Message[];
  isTyping: boolean;
  onSendMessage: (msg: string) => void;
}

export const ChatPanel: React.FC<ChatPanelProps> = ({ messages, isTyping, onSendMessage }) => {
  const [input, setInput] = useState('');
  const endOfMessagesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    onSendMessage(input);
    setInput('');
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
        <h2 className="font-semibold text-sm uppercase tracking-wider text-slate-500">Career Discovery</h2>
        <span className="flex items-center gap-2 text-xs text-green-600 font-medium">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
          AI Active
        </span>
      </div>

      {/* Message List */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
            <span className="text-[10px] text-slate-400 font-medium mb-1 uppercase tracking-wider">
              {msg.role === 'user' ? 'You' : 'ProfileHub AI'}
            </span>
            <div className={`px-4 py-3 max-w-[85%] rounded-lg text-[15px] leading-relaxed ${
              msg.role === 'user' 
                ? 'bg-slate-900 text-white' 
                : 'bg-slate-100 text-slate-800 border border-slate-200'
            }`}>
              {msg.content}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex items-start flex-col">
            <span className="text-[10px] text-slate-400 font-medium mb-1 uppercase tracking-wider">ProfileHub AI</span>
            <div className="px-4 py-3 bg-slate-100 text-slate-500 rounded-lg border border-slate-200 text-sm flex gap-1 items-center">
              <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></span>
              <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-150"></span>
              <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-300"></span>
            </div>
          </div>
        )}
        <div ref={endOfMessagesRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-slate-100">
        <form onSubmit={handleSend} className="relative flex items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Chia sẻ về công việc gần đây của bạn..."
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white transition-all text-sm"
          />
          <button 
            type="submit" 
            disabled={!input.trim() || isTyping}
            className="absolute right-2 px-4 py-1.5 bg-slate-900 text-white text-sm font-medium rounded-md hover:bg-slate-800 disabled:opacity-50 transition-colors"
          >
            Gửi
          </button>
        </form>
      </div>
    </div>
  );
};