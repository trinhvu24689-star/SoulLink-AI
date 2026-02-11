import React from 'react';
import { Bot, Sparkles } from 'lucide-react';

const TypingIndicator: React.FC = () => {
  return (
    <div className="flex w-full mb-6 justify-start animate-in slide-in-from-bottom-2 duration-500 ease-out">
      <div className="flex max-w-[85%] md:max-w-[70%] flex-row items-end gap-3 group">
        
        {/* Avatar AI với hiệu ứng Pulsing Neon */}
        <div className="relative w-9 h-9 rounded-2xl flex items-center justify-center flex-shrink-0 z-10 shadow-lg border border-white/10 bg-slate-800 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/20 to-purple-600/20 animate-pulse" />
          <Bot size={18} className="text-indigo-400 relative z-20" />
          
          {/* Sparkle Icon nhỏ góc Avatar */}
          <div className="absolute -top-1 -right-1 bg-slate-900 rounded-full p-0.5 border border-indigo-500/50">
            <Sparkles size={8} className="text-indigo-400 animate-spin-slow" />
          </div>
        </div>

        {/* Bubble: Glassmorphism Ultra Style */}
        <div className="relative px-5 py-4 rounded-[1.5rem] rounded-bl-none bg-slate-800/40 backdrop-blur-xl border border-white/5 shadow-2xl flex items-center gap-1.5 overflow-hidden">
          
          {/* Hiệu ứng tia sáng chạy ngang (Shimmer) */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-shimmer" />

          {/* Ba chấm nhảy múa với dải màu Gradient */}
          <div className="flex space-x-1.5 h-4 items-center relative z-10">
            <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce [animation-duration:1.2s] [animation-delay:-0.3s] shadow-[0_0_8px_rgba(99,101,241,0.6)]" />
            <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce [animation-duration:1.2s] [animation-delay:-0.15s] shadow-[0_0_8px_rgba(168,85,247,0.6)]" />
            <div className="w-2 h-2 bg-pink-500 rounded-full animate-bounce [animation-duration:1.2s] shadow-[0_0_8px_rgba(236,72,153,0.6)]" />
          </div>

          <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-2 animate-pulse">
            AI Thinking
          </span>
        </div>
      </div>
    </div>
  );
};

export default TypingIndicator;