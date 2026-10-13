import React from 'react';
import { ChatPanel } from './component/ChatPanel';
import { LiveProfilePanel } from './component/LiveProfilePanel';
import { useDiscovery } from '../../hooks/useDiscovery';

export const DiscoveryPage: React.FC = () => {
  const { messages, isTyping, profile, sendMessage } = useDiscovery();

  return (
    <div className="flex flex-col md:flex-row h-screen w-full bg-white text-slate-900 font-sans">
      {/* Chat Panel - 60% width on Desktop */}
      <div className="w-full md:w-3/5 h-[50vh] md:h-full border-b md:border-b-0 md:border-r border-slate-200">
        <ChatPanel 
          messages={messages} 
          isTyping={isTyping} 
          onSendMessage={sendMessage} 
        />
      </div>

      {/* Live Profile Panel - 40% width on Desktop */}
      <div className="w-full md:w-2/5 h-[50vh] md:h-full bg-slate-50 overflow-hidden">
        <LiveProfilePanel profile={profile} />
      </div>
    </div>
  );
};