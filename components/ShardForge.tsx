import React, { useState } from 'react';
import { Hammer, Zap, Gift, Coins, Flame, Loader2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const ShardForge: React.FC = () => {
  const { user } = useAuth();
  const [isForging, setIsForging] = useState(false);

  if (user?.role !== 'admin') return null;

  return (
    <div className="p-8 bg-slate-900 border border-orange-500/30 rounded-[3rem] shadow-[0_0_50px_rgba(249,115,22,0.1)] relative overflow-hidden group">
      <div className="absolute top-0 right-0 w-64 h-64 bg-orange-600/10 blur-[100px] animate-pulse" />
      
      <div className="relative z-10 space-y-6">
        <div className="flex items-center gap-4">
            <div className="p-3 bg-orange-600 rounded-2xl shadow-lg animate-bounce-slow">
                <Hammer className="text-white" size={24} />
            </div>
            <div>
                <h3 className="text-xl font-black text-white uppercase italic tracking-tighter">Shard Forge</h3>
                <p className="text-[9px] text-orange-400 font-bold uppercase tracking-[0.3em]">Cỗ máy in tiền của Master</p>
            </div>
        </div>

        <div className="grid grid-cols-1 gap-4">
            <div className="bg-black/40 border border-white/5 p-6 rounded-3xl flex items-center justify-between group-hover:border-orange-500/30 transition-all">
                <div className="flex items-center gap-4">
                    <Coins className="text-yellow-500" size={32} />
                    <div>
                        <span className="block text-[10px] font-black text-slate-500 uppercase">Current Supply</span>
                        <span className="text-2xl font-black text-white font-mono italic">1.2M 🌙</span>
                    </div>
                </div>
                <button 
                    onClick={() => setIsForging(true)}
                    className="px-6 py-3 bg-orange-600 hover:bg-orange-500 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white shadow-lg transition-all active:scale-95"
                >
                    {isForging ? <Loader2 className="animate-spin" size={16} /> : "Mint Shards"}
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};