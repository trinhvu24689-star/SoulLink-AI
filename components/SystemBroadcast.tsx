import React, { useState } from 'react';
import { Megaphone, Send, Zap } from 'lucide-react';

const SystemBroadcast: React.FC = () => {
  const [msg, setMsg] = useState('');
  return (
    <div className="p-6 bg-indigo-950/20 border border-indigo-500/30 rounded-[2.5rem] backdrop-blur-xl group">
      <div className="flex items-center gap-3 mb-4">
        <Megaphone className="text-indigo-400 animate-bounce" size={20} />
        <span className="text-[10px] font-black text-white uppercase tracking-[0.3em]">Omni-Broadcast</span>
      </div>
      <div className="relative">
        <input 
          value={msg} onChange={e => setMsg(e.target.value)}
          className="w-full bg-black/40 border border-white/10 rounded-2xl px-4 py-3 text-sm text-indigo-200 outline-none focus:border-indigo-500 transition-all"
          placeholder="Nhập thông điệp gửi tới toàn bộ user..."
        />
        <button className="absolute right-2 top-2 p-2 bg-indigo-600 rounded-xl text-white hover:bg-indigo-500 transition-all">
          <Send size={16} />
        </button>
      </div>
    </div>
  );
};