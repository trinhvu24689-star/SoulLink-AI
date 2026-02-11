import React from 'react';
import { Ticket, Sparkles, Copy } from 'lucide-react';

const VoucherFactory: React.FC = () => {
  return (
    <div className="p-6 bg-gradient-to-br from-amber-900/20 to-slate-900 border border-amber-500/20 rounded-[2.5rem]">
      <div className="flex justify-between items-start mb-6">
        <div className="p-3 bg-amber-600/20 rounded-2xl"><Ticket className="text-amber-500" /></div>
        <div className="text-right">
            <span className="block text-[8px] font-black text-slate-500 uppercase">Factory Status</span>
            <span className="text-xs font-bold text-green-500 uppercase italic">Active</span>
        </div>
      </div>
      <div className="space-y-4">
        <div className="flex gap-2">
            <input className="flex-1 bg-black/40 border border-white/5 rounded-xl px-3 py-2 text-xs text-white" placeholder="Amount (e.g. 1000)" />
            <button className="px-4 py-2 bg-amber-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest">Create</button>
        </div>
        <div className="p-3 bg-black/60 rounded-xl border border-dashed border-amber-500/30 flex justify-between items-center group cursor-pointer">
            <span className="text-sm font-mono text-amber-500">SOULLINK-MASTER-999</span>
            <Copy size={14} className="text-slate-600 group-hover:text-white transition-colors" />
        </div>
      </div>
    </div>
  );
};