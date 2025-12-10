import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2 } from 'lucide-react';
import { ChatMessage } from '../types';

interface DreamChatProps {
  history: ChatMessage[];
  onSendMessage: (message: string) => void;
  isChatting: boolean;
}

const DreamChat: React.FC<DreamChatProps> = ({ history, onSendMessage, isChatting }) => {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [history, isChatting]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isChatting) return;
    onSendMessage(input);
    setInput('');
  };

  return (
    <div className="bg-slate-900/50 rounded-2xl border border-slate-700 overflow-hidden flex flex-col h-[600px] shadow-xl backdrop-blur-sm animate-fade-in">
      {/* Header */}
      <div className="p-4 border-b border-slate-700 bg-slate-800/80 flex items-center gap-3">
        <div className="bg-indigo-500/20 p-2 rounded-lg">
          <Bot className="w-6 h-6 text-indigo-400" />
        </div>
        <div>
          <h3 className="font-bold text-slate-100">Dream Guide</h3>
          <p className="text-xs text-slate-400">Ask about your dream's hidden meaning</p>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-grow overflow-y-auto p-4 space-y-4">
        {history.length === 0 && (
          <div className="text-center text-slate-500 mt-10">
            <p>Type below to start exploring your dream...</p>
          </div>
        )}
        
        {history.map((msg) => (
          <div 
            key={msg.id} 
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div 
              className={`
                max-w-[80%] rounded-2xl p-4 flex gap-3
                ${msg.role === 'user' 
                  ? 'bg-indigo-600 text-white rounded-br-none' 
                  : 'bg-slate-800 text-slate-200 rounded-bl-none'}
              `}
            >
              <div className="flex-shrink-0 mt-1">
                {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>
              <div className="text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</div>
            </div>
          </div>
        ))}

        {isChatting && (
          <div className="flex justify-start">
            <div className="bg-slate-800 rounded-2xl rounded-bl-none p-4 flex items-center gap-2">
              <Bot className="w-4 h-4 text-slate-400" />
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                <span className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                <span className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <form onSubmit={handleSubmit} className="p-4 bg-slate-800/50 border-t border-slate-700">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="What does the purple sky symbolize?"
            className="flex-grow bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder-slate-500"
            disabled={isChatting}
          />
          <button
            type="submit"
            disabled={!input.trim() || isChatting}
            className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white p-3 rounded-xl transition-colors"
          >
            {isChatting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
          </button>
        </div>
      </form>
    </div>
  );
};

export default DreamChat;
