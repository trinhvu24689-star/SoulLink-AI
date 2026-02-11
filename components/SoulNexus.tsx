import React, { useState, useEffect } from 'react';
import { 
  Zap, Activity, Database, Cpu, 
  Orbit, Wind, ShieldAlert, Sparkle,
  Waves, BarChart3, Globe2
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const SoulNexus: React.FC = () => {
  const { user } = useAuth();
  const [syncLevel, setSyncLevel] = useState(0);
  const [coreTemp, setCoreTemp] = useState(36.5);

  // Giả lập đồng bộ nơ-ron thời gian thực
  useEffect(() => {
    const interval = setInterval(() => {
      setSyncLevel(prev => (prev < 99 ? prev + 1 : 99));
      setCoreTemp(prev => +(prev + (Math.random() * 0.4 - 0.2)).toFixed(1));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full h-[600px] flex items-center justify-center overflow-hidden bg-slate-950 rounded-[3rem] border border-white/5 shadow-2xl">
      
      {/* 🌀 TRÁI TIM NƠ-RON (Neural Core) */}
      <div className="relative flex items-center justify-center w-full h-full">
        {/* Lớp nền Hologram */}
        <div className="absolute w-[450px] h-[450px] bg-indigo-500/10 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute w-[300px] h-[300px] border border-indigo-500/20 rounded-full animate-spin-slow" />
        <div className="absolute w-[350px] h-[350px] border-t-2 border-indigo-400/30 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '10s' }} />

        {/* Thông tin Core trung tâm */}
        <div className="relative z-10 text-center space-y-2 group cursor-none">
          <div className="w-48 h-48 rounded-full bg-slate-900/80 backdrop-blur-3xl border border-white/10 shadow-2xl flex flex-col items-center justify-center group-hover:scale-110 transition-transform duration-700">
            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-indigo-500/20 via-transparent to-pink-500/20 animate-spin-slow" />
            <Sparkle className="text-indigo-400 animate-pulse mb-2" size={32} />
            <span className="text-4xl font-black text-white tracking-tighter">{syncLevel}%</span>
            <span className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.3em]">Neural Sync</span>
          </div>
        </div>

        {/* 🛰️ CÁC VỆ TINH DỮ LIỆU (Floating Modules) */}
        {/* Module 1: Moon Shards Energy */}
        <div className="absolute top-20 left-10 md:left-24 animate-bounce-slow">
          <div className="p-4 bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-[2rem] shadow-xl">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-500/20 rounded-xl">
                <Zap size={20} className="text-yellow-400 fill-yellow-400/20" />
              </div>
              <div className="flex flex-col">
                <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Shard Energy</span>
                <span className="text-lg font-black text-white font-mono">{user?.moonShards?.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Module 2: System Health */}
        <div className="absolute bottom-20 right-10 md:right-24 animate-float">
          <div className="p-4 bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-[2rem] shadow-xl">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-500/20 rounded-xl">
                <Activity size={20} className="text-green-400" />
              </div>
              <div className="flex flex-col">
                <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Core Temp</span>
                <span className="text-lg font-black text-white font-mono">{coreTemp}°C</span>
              </div>
            </div>
          </div>
        </div>

        {/* Module 3: Database Link */}
        <div className="absolute top-1/2 -right-4 -translate-y-1/2 rotate-90">
            <div className="flex items-center gap-4 text-slate-700">
                <div className="h-px w-32 bg-gradient-to-r from-transparent to-indigo-500/50" />
                <span className="text-[10px] font-black uppercase tracking-[0.5em] whitespace-nowrap">Neon DB Active</span>
            </div>
        </div>
      </div>

      {/* 📊 FOOTER: SYSTEM LOGS */}
      <div className="absolute bottom-0 w-full p-8 flex justify-between items-end bg-gradient-to-t from-slate-950 to-transparent">
        <div className="space-y-2">
            <div className="flex items-center gap-2 text-indigo-400">
                <Cpu size={14} />
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-300">Processor: Quantum-V6</span>
            </div>
            <div className="flex items-center gap-2 text-cyan-400">
                <Globe2 size={14} />
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-300">Region: Ep-Southeast-1</span>
            </div>
        </div>
        
        <div className="text-right">
            <p className="text-[9px] font-bold text-slate-600 uppercase mb-1">SoulLink Protocol v6.0.4-Build</p>
            <div className="h-1.5 w-48 bg-slate-800 rounded-full overflow-hidden border border-white/5">
                <div className="h-full bg-indigo-500 animate-shimmer" style={{ width: '75%' }} />
            </div>
        </div>
      </div>

      {/* 🎇 HIỆU ỨNG HẠT (Particles Filter) */}
      <svg className="hidden">
        <filter id="glow">
          <feGaussianBlur stdDeviation="3.5" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </svg>
    </div>
  );
};

export default SoulNexus;