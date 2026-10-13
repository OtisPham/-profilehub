import { useState, useRef, useEffect } from 'react';
import useSWR from 'swr';
import { Message, Profile } from '../types/type';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export const useDiscovery = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const sessionId = useRef(crypto.randomUUID());

  // Tự động fetch và re-fetch profile từ backend
  const { data: profile, mutate: mutateProfile } = useSWR<Profile>(
    `/api/profile?sessionId=${sessionId.current}`,
    fetcher,
    { fallbackData: null }
  );

  const sendMessage = async (content: string) => {
    if (!content.trim()) return;

    const newUserMsg: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content,
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, newUserMsg]);
    setIsTyping(true);

    try {
      const response = await fetch('/api/discovery/message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId: sessionId.current, message: content }),
      });
      
      const data = await response.json();
      
      const newAiMsg: Message = {
        id: crypto.randomUUID(),
        role: 'ai',
        content: data.reply,
        createdAt: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, newAiMsg]);
      
      // DoD: Re-fetch profile ngay sau khi AI trả lời để có Live Profile cập nhật
      mutateProfile();
    } catch (error) {
      console.error("Failed to send message", error);
    } finally {
      setIsTyping(false);
    }
  };

  return { messages, isTyping, profile, sendMessage };
};