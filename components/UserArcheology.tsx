import React, { useState } from 'react';
import { 
  History, Search, User, Camera, 
  RotateCcw, Moon, Fingerprint, Calendar,
  ArrowDownCircle, ShieldCheck, Database
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const UserArcheology: React.FC = () => {
  const { user } = useAuth();
  const [searchId, setSearchId] = useState('');
  
  if (user?.role !== 'admin') return null; // Niêm phong cổng khảo cổ

  // Giả lập dữ liệu "khảo cổ" từ Neon DB
  const historyData = [
    { date: '2026-02-10 14:20', type: 'name', old: 'QuangHo_Pro', new: 'Quang Hổ Master', icon: <User size={14}/> },
    { date: '2026-02-08 09:15', type: 'shard', action: 'Recharge', amount: '+5000', balance: '12400', icon: <Moon size={14}/> },
    { date: '2026-02-05 23:45', type: 'avatar', old: 'https://old-link.png', new: 'https://new-link.png', icon: <Camera size={14}/> },
    { date: '2026-02-01 10:00', type: 'system', action: 'Registration', details: 'SoulLink AI Core Joined', icon: <Fingerprint size={14}/> },
  ];

  return (
    <div className="p-8 bg-slate-900/90 border border-indigo-500/20 rounded-[3rem] backdrop-blur-3xl shadow-[0_0_100px_rgba(99,101,241,0.1)] relative overflow-hidden group">
      
      {/* Hiệu ứng quét radar khảo cổ */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent animate-scan" />

      <div className="relative z-10 flex flex-col gap-8">
        
        {/* Header Section */}
        <div className="flex justify-between items-start">
          <div className="space-y-2">
            <h3 className="text-2xl font-black text-white italic tracking-tighter uppercase flex items-center gap-3">
              <History className="text-indigo-400" size={28} /> User Archeology
            </h3>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.4em]">Deep Identity Excavation Protocol</p>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-black/40 rounded-2xl border border-white/5">
             <Database size={14} className="text-indigo-500" />
             <span className="text-[10px] font-black text-indigo-300 uppercase">Neon Sync: Active</span>
          </div>
        </div>

        {/* Search Bar: Truy tìm đối tượng */}
        <div className="relative group/search">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within/search:text-indigo-400 transition-colors" size={18} />
          <input 
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
            className="w-full bg-black/50 border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-sm text-white focus:border-indigo-500 outline-none transition-all shadow-inner"
            placeholder="Nhập UserID hoặc Username để khai quật..."
          />
        </div>

        {/* Timeline Excavation Area */}
        <div className="space-y-6">
          <div className="flex items-center gap-2 ml-2">
             <Calendar size={12} className="text-slate-500" />
             <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Logs retrieved for February 2026</span>
          </div>

          <div className="relative ml-4 border-l-2 border-slate-800 space-y-8 pb-4">
            {historyData.map((log, idx) => (
              <div key={idx} className="relative pl-8 animate-in slide-in-from-left duration-500" style={{ animationDelay: `${idx * 0.1}s` }}>
                {/* Điểm nút Timeline */}
                <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-slate-900 border-2 border-indigo-500 shadow-[0_0_10px_#6366f1]" />
                
                <div className="p-5 bg-white/5 border border-white/5 rounded-3xl hover:border-indigo-500/30 transition-all group/item">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-indigo-600/20 rounded-xl text-indigo-400 group-hover/item:scale-110 transition-transform">
                        {log.icon}
                      </div>
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{log.date}</span>
                    </div>
                    <span className="text-[9px] font-black text-indigo-500 bg-indigo-500/10 px-2 py-0.5 rounded uppercase">{log.type}</span>
                  </div>

                  {/* Logic hiển thị nội dung tùy theo loại log */}
                  <div className="text-sm">
                    {log.type === 'name' && (
                      <div className="flex items-center gap-2">
                        <span className="text-slate-500 line-through italic">{log.old}</span>
                        <span className="text-indigo-400">→</span>
                        <span className="text-white font-bold">{log.new}</span>
                      </div>
                    )}
                    {log.type === 'shard' && (
                      <div className="flex items-center justify-between">
                         <span className="text-emerald-400 font-black">{log.action}: {log.amount} 🌙</span>
                         <span className="text-[10px] text-slate-500">Balance: {log.balance}</span>
                      </div>
                    )}
                    {log.type === 'avatar' && (
                      <div className="flex items-center gap-4">
                         <div className="w-10 h-10 rounded-full bg-slate-800 border border-white/10 overflow-hidden opacity-40">
                            <img src={log.old} alt="old" className="w-full h-full object-cover" />
                         </div>
                         <span className="text-indigo-400">→</span>
                         <div className="w-10 h-10 rounded-full bg-slate-800 border border-indigo-500 overflow-hidden shadow-lg shadow-indigo-500/20">
                            <img src={log.new} alt="new" className="w-full h-full object-cover" />
                         </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer: Trạng thái Master */}
        <div className="flex justify-center pt-4">
           <button className="flex items-center gap-2 px-6 py-2 bg-indigo-600/10 hover:bg-indigo-600/20 text-indigo-400 rounded-full border border-indigo-500/20 text-[10px] font-black uppercase tracking-[0.3em] transition-all active:scale-95">
             <ArrowDownCircle size={14} /> Load Older Layers
           </button>
        </div>
      </div>
    </div>
  );
};

export default UserArcheology;