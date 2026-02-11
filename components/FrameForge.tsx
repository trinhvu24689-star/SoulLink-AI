import React from 'react';
import { Sparkles, Upload, Eye, Layers, Palette } from 'lucide-react';

const FrameForge: React.FC = () => {
  return (
    <div className="p-8 bg-slate-900 border border-purple-500/30 rounded-[3rem] shadow-2xl relative overflow-hidden group">
      <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-purple-600/10 rounded-full blur-[80px]" />
      <div className="relative z-10 flex flex-col gap-6">
        <h3 className="text-xl font-black text-white italic uppercase tracking-tighter flex items-center gap-3">
          <Layers className="text-purple-400" /> Frame Forge
        </h3>
        <div className="aspect-square w-32 h-32 mx-auto rounded-full border-4 border-dashed border-purple-500/30 flex flex-col items-center justify-center gap-2 group-hover:border-purple-500 transition-all cursor-pointer">
          <Upload className="text-purple-400" size={24} />
          <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest text-center">Drop SVG Frame</span>
        </div>
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-2">Frame Animation Speed</label>
            <input type="range" className="w-full h-1 bg-slate-800 rounded-full accent-purple-500" />
          </div>
          <button className="w-full py-3 bg-purple-600 hover:bg-purple-500 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white shadow-lg transition-all active:scale-95">
            MINT INFINITY FRAME
          </button>
        </div>
      </div>
    </div>
  );
};