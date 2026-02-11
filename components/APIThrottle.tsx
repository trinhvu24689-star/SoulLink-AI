import React, { useState } from 'react';
import { Wind, Zap, ShieldAlert, Activity } from 'lucide-react';

const APIThrottle: React.FC = () => {
  const [rpm, setRpm] = useState(100);
  return (
    <div className="p-6 bg-slate-900/90 border border-indigo-500/30 rounded-[2.5rem] backdrop-blur-2xl shadow-xl group">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-600 rounded-xl animate-pulse"><Wind size={20} className="text-white" /></div>
          <span className="text-[10px] font-black text-white uppercase tracking-[0.3em]">Traffic Controller</span>
        </div>
        <span className="text-xs font-mono text-indigo-400 font-black">{rpm} RPM</span>
      </div>
      <input 
        type="range" min="10" max="500" value={rpm} 
        onChange={(e) => setRpm(parseInt(e.target.value))}
        className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500 mb-4"
      />
      <div className="flex justify-between text-[8px] font-black text-slate-500 uppercase tracking-widest">
        <span>Stable Mode</span>
        <span className="text-red-500">Chaos Mode</span>
      </div>
    </div>
  );
};