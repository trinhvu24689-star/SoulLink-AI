import React from 'react';
import { ShieldAlert, Eye, Lock, Zap, Activity } from 'lucide-react';

const SecuritySentinel: React.FC = () => {
  return (
    <div className="p-6 bg-black border border-indigo-500/30 rounded-[2.5rem] shadow-[0_0_50px_rgba(99,102,241,0.1)] relative overflow-hidden group">
      <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.1),transparent)]" />
      <div className="relative z-10 space-y-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-indigo-500 animate-ping" />
            <span className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.3em]">Sentinel Active</span>
          </div>
          <Activity size={16} className="text-slate-700" />
        </div>
        
        <div className="space-y-4">
          <div className="p-4 bg-red-500/5 border border-red-500/20 rounded-2xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <ShieldAlert className="text-red-500" size={18} />
              <span className="text-xs font-bold text-white uppercase tracking-tighter">Brute-force detected</span>
            </div>
            <span className="text-[9px] font-mono text-red-400">IP: 103.44.xx.xx</span>
          </div>
        </div>
        
        <button className="w-full py-3 border border-indigo-500/30 rounded-xl text-[9px] font-black text-indigo-400 uppercase tracking-widest hover:bg-indigo-500 hover:text-white transition-all">
          Initiate Global Lockdown
        </button>
      </div>
    </div>
  );
};