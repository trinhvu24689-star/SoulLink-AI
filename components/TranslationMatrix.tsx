import React from 'react';
import { Languages, Save, RefreshCw, Search, FileText } from 'lucide-react';

const TranslationMatrix: React.FC = () => {
  return (
    <div className="p-6 bg-slate-900/60 border border-emerald-500/20 rounded-[2.5rem] backdrop-blur-2xl">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-emerald-600 rounded-2xl shadow-lg"><Languages className="text-white" size={20} /></div>
          <span className="text-sm font-black text-white uppercase italic tracking-tighter">Translation Matrix</span>
        </div>
        <button className="p-2 bg-white/5 rounded-xl text-emerald-400 hover:bg-emerald-500 hover:text-white transition-all"><Save size={18} /></button>
      </div>
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-2 text-[10px] font-black text-slate-500 uppercase px-2">
          <span>Vietnamese (VI)</span>
          <span>English (EN)</span>
        </div>
        <div className="flex gap-2">
          <input className="flex-1 bg-black/40 border border-white/5 rounded-xl p-3 text-xs text-emerald-400" placeholder="Chào Master..." />
          <input className="flex-1 bg-black/40 border border-white/5 rounded-xl p-3 text-xs text-white" placeholder="Hello Master..." />
        </div>
      </div>
    </div>
  );
};