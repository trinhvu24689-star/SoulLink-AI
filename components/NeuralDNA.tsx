import React from 'react';
import { Share2, Zap, Heart } from 'lucide-react';

const NeuralDNA: React.FC<{ bondingScore: number }> = ({ bondingScore }) => {
  return (
    <div className="relative p-6 bg-slate-900/40 backdrop-blur-3xl border border-white/5 rounded-[2.5rem] overflow-hidden group">
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-indigo-500/5 to-pink-500/5 opacity-50" />
      
      <div className="relative z-10 flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <div className="space-y-1">
            <h3 className="text-xs font-black text-indigo-400 uppercase tracking-[0.2em]">Neural Bond</h3>
            <p className="text-2xl font-black text-white italic">Quantum DNA</p>
          </div>
          <div className="p-3 bg-indigo-600 rounded-2xl shadow-lg shadow-indigo-600/20">
            <Share2 size={20} className="text-white" />
          </div>
        </div>

        {/* DNA Animation Grid */}
        <div className="h-24 flex items-center justify-center gap-1.5">
          {[...Array(12)].map((_, i) => (
            <div 
              key={i} 
              className="w-1.5 bg-gradient-to-t from-indigo-500 to-pink-500 rounded-full animate-dna-flow"
              style={{ 
                height: `${Math.sin(i + bondingScore) * 40 + 60}%`,
                animationDelay: `${i * 0.1}s` 
              }} 
            />
          ))}
        </div>

        <div className="flex justify-between items-end">
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10">
            <Zap size={10} className="text-yellow-400" />
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Level: Infinite</span>
          </div>
          <div className="text-right">
            <span className="block text-[10px] font-black text-slate-500 uppercase">Synchronicity</span>
            <span className="text-xl font-mono font-black text-indigo-400">{bondingScore}%</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NeuralDNA;