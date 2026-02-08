'use client';

import { useState, useRef, useEffect } from 'react';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/state/authContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Send, MessageCircle } from 'lucide-react';

interface ChatbotProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Chatbot({ isOpen, onClose }: ChatbotProps) {
  const [messages, setMessages] = useState<{id: number, text: string, sender: 'user' | 'ai', timestamp: Date}[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<null | HTMLDivElement>(null);
  const { token } = useAuth();

  // Extract user ID from token (assuming JWT format)
  const getUserIdFromToken = (): number | null => {
    if (!token) return null;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.user_id || payload.sub || null;
    } catch (error) {
      console.error('Error parsing token:', error);
      return null;
    }
  };

  const userId = getUserIdFromToken();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || !token || !userId) return;

    const userMessage = {
      id: Date.now(),
      text: inputMessage,
      sender: 'user' as const,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      // Call the chat API endpoint with user ID
      const response = await api.post<{response: string}>(`/api/${userId}/chat`, { message: inputMessage }, true);

      const aiMessage = {
        id: Date.now() + 1,
        text: response.response,
        sender: 'ai' as const,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error sending message:', error);

      const errorMessage = {
        id: Date.now() + 1,
        text: 'Sorry, I encountered an error processing your request.',
        sender: 'ai' as const,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-28 right-8 z-50 w-[380px] h-[520px] bg-slate-900/98 backdrop-blur-2xl rounded-3xl shadow-2xl shadow-black/30 border border-slate-700/60 flex flex-col overflow-hidden">
      <div className="flex items-center justify-between p-5 bg-gradient-to-r from-indigo-500/15 to-violet-500/15 border-b border-slate-700/50">
        <h3 className="font-bold text-white flex items-center gap-3 text-base">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 via-violet-500 to-purple-600 rounded-xl flex items-center justify-center shadow-xl shadow-indigo-500/25">
            <MessageCircle className="h-5 w-5 text-white" />
          </div>
          AI Assistant
        </h3>
        <Button
          onClick={onClose}
          variant="ghost"
          size="icon"
          className="text-slate-400 hover:text-white hover:bg-slate-700/50 h-9 w-9 rounded-xl transition-all border border-transparent hover:border-slate-600/50"
        >
          <span className="text-xl leading-none">×</span>
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-slate-900/50">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center p-5">
            <div className="w-16 h-16 bg-gradient-to-br from-indigo-500/20 to-violet-500/20 rounded-2xl flex items-center justify-center mb-5 border border-indigo-500/20">
              <MessageCircle className="h-8 w-8 text-indigo-400" />
            </div>
            <h4 className="text-lg font-bold text-white mb-2">TaskFlow AI</h4>
            <p className="text-slate-400 text-sm leading-relaxed">Ask me anything about your tasks, productivity tips, or let me help you stay organized.</p>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] px-4 py-3 text-sm leading-relaxed ${
                  message.sender === 'user'
                    ? 'bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-600 text-white rounded-2xl rounded-br-md shadow-xl shadow-indigo-500/25'
                    : 'bg-slate-800/60 text-white rounded-2xl rounded-bl-md border border-slate-700/50'
                }`}
              >
                {message.text}
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-5 border-t border-slate-700/50 bg-slate-900/70">
        <div className="flex gap-3">
          <Input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type a message..."
            className="flex-1 bg-slate-800/50 text-white border-slate-700/60 text-sm py-3 px-4 h-12 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 placeholder:text-slate-500"
            disabled={isLoading}
          />
          <Button
            onClick={handleSendMessage}
            disabled={isLoading || !inputMessage.trim() || !userId}
            className="bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-600 hover:from-indigo-600 hover:via-violet-600 hover:to-purple-700 text-white h-12 w-12 p-0 rounded-xl transition-all shadow-xl shadow-indigo-500/25 hover:shadow-2xl hover:shadow-indigo-500/35 disabled:opacity-50"
          >
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}