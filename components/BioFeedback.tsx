import React, { useState, useEffect } from 'react';
import { Activity } from 'lucide-react';

const BioFeedback: React.FC<{ chatSpeed: number }> = ({ chatSpeed }) => {
  const [bpm, setBpm] = useState(70);

  useEffect(() => {
    // Tính toán BPM dựa trên tốc độ Master "hành hạ" AI
    const targetBpm = 70 + (chatSpeed * 10);
    const timeout = setTimeout(() => setBpm(targetBpm), 500);
    return () => clearTimeout(timeout);
  }, [chatSpeed]);

  return (
    <div className="p-4 bg-black/40 border border-white/5 rounded-3xl flex items-center gap-4 transition-all duration-700">
      <div className="relative">
        <Activity size={24} className={`text-rose-500 transition-all duration-300 ${bpm > 100 ? 'animate-ping' : 'animate-pulse'}`} />
        <div className="absolute inset-0 blur-md bg-rose-500/30 rounded-full" />
      </div>
      <div>
        <span className="block text-[8px] font-black text-slate-500 uppercase tracking-widest">Neural Pulse</span>
        <div className="flex items-baseline gap-1">
            <span className="text-xl font-mono font-black text-white">{bpm}</span>
            <span className="text-[10px] font-bold text-rose-400 uppercase">BPM</span>
        </div>
      </div>
      
      {/* Waveform mini */}
      <div className="flex-1 flex items-center gap-0.5 h-6">
         {[...Array(8)].map((_, i) => (
             <div key={i} className="flex-1 bg-rose-500/20 rounded-full animate-pulse" style={{ height: `${Math.random() * 100}%`, animationDelay: `${i * 0.1}s` }} />
         ))}
      </div>
    </div>
  );
};

export default BioFeedback;