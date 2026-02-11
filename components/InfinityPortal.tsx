import React, { useState } from 'react';
import { Globe, RefreshCw, Database, ShieldCheck, Zap } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const InfinityPortal: React.FC = () => {
  const { user } = useAuth();
  const [isSyncing, setIsSyncing] = useState(false);

  if (user?.role !== 'admin') return null; // KHÓA CHẶT

  return (
    <div className="p-8 bg-black border border-cyan-500/30 rounded-[3rem] shadow-[0_0_60px_rgba(6,182,212,0.15)] relative overflow-hidden group">
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20" />
      
      <div className="relative z-10 flex flex-col items-center text-center">
        <div className={`w-20 h-20 rounded-full bg-cyan-600/20 border border-cyan-500/50 flex items-center justify-center mb-6 ${isSyncing ? 'animate-spin' : 'animate-pulse'}`}>
          <Globe className="text-cyan-400" size={40} />
        </div>

        <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter mb-2">Infinity Portal</h3>
        <p className="text-[10px] text-cyan-500 font-bold uppercase tracking-[0.4em] mb-8 px-4 leading-relaxed">
          Cross-Dimension Data Synchronization Protocol
        </p>

        <div className="grid grid-cols-2 gap-4 w-full mb-8">
          <div className="p-4 bg-slate-900 rounded-3xl border border-white/5">
            <span className="block text-[8px] font-black text-slate-500 uppercase mb-1">Source</span>
            <span className="text-xs font-bold text-white">Local_DB</span>
          </div>
          <div className="p-4 bg-slate-900 rounded-3xl border border-white/5">
            <span className="block text-[8px] font-black text-slate-500 uppercase mb-1">Target</span>
            <span className="text-xs font-bold text-cyan-400">Neon_Cloud</span>
          </div>
        </div>

        <button 
          onClick={() => setIsSyncing(!isSyncing)}
          className="w-full py-4 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 rounded-2xl text-xs font-black uppercase tracking-[0.3em] text-white shadow-lg transition-all flex items-center justify-center gap-3"
        >
          {isSyncing ? <RefreshCw className="animate-spin" size={18} /> : <Zap size={18} />}
          {isSyncing ? "Syncing Universe..." : "Open Portal"}
        </button>
      </div>
    </div>
  );
};