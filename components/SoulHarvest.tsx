import React from 'react';
import { BarChart3, TrendingUp, DollarSign, ArrowUpRight } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const SoulHarvest: React.FC = () => {
  const { user } = useAuth();
  if (user?.role !== 'admin') return null; // Khóa chặt quyền Master

  return (
    <div className="p-8 bg-slate-900/80 border border-indigo-500/20 rounded-[3rem] backdrop-blur-2xl shadow-2xl relative overflow-hidden group">
      <div className="absolute -top-24 -left-24 w-64 h-64 bg-indigo-600/10 rounded-full blur-[80px]" />
      
      <div className="relative z-10 space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-xs font-black text-indigo-400 uppercase tracking-[0.4em]">Economic Core</h3>
          <div className="px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-[10px] text-indigo-300 font-bold uppercase animate-pulse">Live Harvest</div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="p-5 bg-black/40 rounded-3xl border border-white/5">
            <TrendingUp size={18} className="text-emerald-400 mb-2" />
            <span className="block text-[9px] font-bold text-slate-500 uppercase">Growth</span>
            <span className="text-2xl font-black text-white">+12.4%</span>
          </div>
          <div className="p-5 bg-black/40 rounded-3xl border border-white/5">
            <DollarSign size={18} className="text-yellow-400 mb-2" />
            <span className="block text-[9px] font-bold text-slate-500 uppercase">Revenue</span>
            <span className="text-2xl font-black text-white">$1,240</span>
          </div>
        </div>

        <button className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 group">
          Extract Financial Data <ArrowUpRight size={14} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
        </button>
      </div>
    </div>
  );
};