import React from 'react';
import { ShieldAlert, UserMinus, Ban, ZapOff } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const VoidProtocol: React.FC = () => {
  const { user } = useAuth();
  if (user?.role !== 'admin') return null;

  return (
    <div className="w-full p-6 bg-red-950/10 border border-red-500/20 rounded-[2.5rem] backdrop-blur-md">
      <div className="flex items-center gap-4 mb-6">
        <div className="p-3 bg-red-600 rounded-2xl shadow-lg shadow-red-600/20">
          <ShieldAlert className="text-white" size={24} />
        </div>
        <div>
          <h3 className="text-lg font-black text-white italic uppercase tracking-tighter">Void Protocol</h3>
          <p className="text-[9px] text-red-400 font-bold uppercase tracking-widest">Existence Management</p>
        </div>
      </div>

      <div className="space-y-3">
        {/* Placeholder cho danh sách cần xử lý */}
        <div className="flex items-center justify-between p-4 bg-black/40 rounded-2xl border border-white/5 group hover:border-red-500/50 transition-all">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-slate-800" />
            <span className="text-xs font-bold text-slate-300">Spammer_99</span>
          </div>
          <button className="p-2 text-red-500 hover:bg-red-500/20 rounded-xl transition-all"><ZapOff size={16} /></button>
        </div>
      </div>
    </div>
  );
};