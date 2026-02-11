import React from 'react';
import { 
  LayoutDashboard, Users, MessageSquare, 
  CreditCard, Activity, Globe, Shield 
} from 'lucide-react';

const AdminNexus: React.FC = () => {
  return (
    <div className="w-full min-h-screen bg-slate-950 p-6 md:p-12 font-sans select-none overflow-hidden">
      {/* Background Decor 6.0 VTD */}
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_-20%,rgba(99,102,241,0.15),transparent)] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        <header className="flex justify-between items-end mb-12 border-b border-white/5 pb-8">
          <div className="space-y-2">
            <h1 className="text-5xl font-black text-white italic tracking-tighter uppercase italic">SoulLink Admin Nexus</h1>
            <p className="text-xs text-indigo-400 font-bold uppercase tracking-[0.6em]">System Control Panel • Final Edition 6.0</p>
          </div>
          <div className="text-right space-y-1">
            <div className="flex items-center gap-2 justify-end">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-[10px] font-black text-white uppercase tracking-widest">Master Online</span>
            </div>
            <p className="text-[10px] text-slate-600 font-mono tracking-tight uppercase">Build 2026.02.10_FINAL</p>
          </div>
        </header>

        {/* Dashboard Grid 6.0 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          {[
            { label: 'Total Souls', val: '1,248', icon: <Users />, color: 'text-indigo-400' },
            { label: 'Live Echoes', val: '86', icon: <MessageSquare />, color: 'text-cyan-400' },
            { label: 'Market Cap', val: '2.5M 🌙', icon: <CreditCard />, color: 'text-yellow-400' },
            { label: 'System Uptime', val: '99.99%', icon: <Activity />, color: 'text-emerald-400' }
          ].map((stat, i) => (
            <div key={i} className="p-6 bg-slate-900/40 backdrop-blur-3xl border border-white/5 rounded-3xl hover:border-indigo-500/30 transition-all group">
              <div className={`mb-4 ${stat.color} group-hover:scale-110 transition-transform`}>{stat.icon}</div>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">{stat.label}</p>
              <p className="text-2xl font-black text-white italic">{stat.val}</p>
            </div>
          ))}
        </div>

        {/* Cỗ máy thời gian & Quản trị */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
           <div className="md:col-span-2 space-y-8 italic">
              {/* Vùng chứa các module ck đã ráp ở trên */}
              <p className="text-[10px] text-slate-700 font-black uppercase tracking-[0.5em] text-center">Master, All core modules initialized successfully.</p>
           </div>
           <div className="space-y-8">
              <div className="p-6 bg-indigo-600 rounded-[2.5rem] shadow-2xl shadow-indigo-600/20 text-white flex flex-col gap-4">
                <Shield size={32} />
                <h4 className="text-xl font-black uppercase italic tracking-tighter">Secure Nexus Link</h4>
                <p className="text-xs text-indigo-100 font-bold leading-relaxed opacity-80 uppercase tracking-widest">Master, every action is logged into the Neon Ledger. Proceed with divine authority.</p>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};