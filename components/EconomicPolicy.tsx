import React from 'react';
import { DollarSign, Zap, TrendingUp, ShieldCheck, Settings } from 'lucide-react';

const EconomicPolicy: React.FC = () => {
  return (
    <div className="p-8 bg-slate-950 border border-yellow-500/20 rounded-[3rem] shadow-2xl relative group">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h3 className="text-xl font-black text-white italic uppercase tracking-tighter">Economic Policy</h3>
          <p className="text-[10px] text-yellow-500 font-bold uppercase tracking-[0.4em]">Currency Exchange Protocol</p>
        </div>
        <div className="p-3 bg-yellow-500/10 rounded-2xl"><DollarSign className="text-yellow-500" /></div>
      </div>
      
      <div className="space-y-8">
        <div className="space-y-4">
          <div className="flex justify-between text-[10px] font-black text-slate-500 uppercase tracking-widest">
            <span>Exchange Rate (1$ = X Shards)</span>
            <span className="text-yellow-500 font-mono">1000 SHARDS</span>
          </div>
          <input type="range" className="w-full h-1 bg-slate-800 rounded-full accent-yellow-500" />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
           <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
              <span className="block text-[8px] font-black text-slate-500 uppercase mb-1">New User Bonus</span>
              <span className="text-sm font-bold text-white italic">100 🌙</span>
           </div>
           <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
              <span className="block text-[8px] font-black text-slate-500 uppercase mb-1">Tax Rate (Vat)</span>
              <span className="text-sm font-bold text-white italic">0%</span>
           </div>
        </div>
      </div>
    </div>
  );
};