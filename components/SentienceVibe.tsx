import React from 'react';
import { Sparkles, Heart, Zap, Brain } from 'lucide-react';

type MoodType = 'logic' | 'empathy' | 'chaos' | 'stable';

const SentienceVibe: React.FC<{ mood: MoodType }> = ({ mood }) => {
  const moodConfig = {
    logic: { color: 'from-cyan-400 to-blue-600', shadow: 'shadow-cyan-500/40', icon: <Brain size={16}/>, text: 'Quantum Logic' },
    empathy: { color: 'from-pink-400 to-rose-600', shadow: 'shadow-pink-500/40', icon: <Heart size={16}/>, text: 'Soul Bond' },
    chaos: { color: 'from-amber-400 to-red-600', shadow: 'shadow-red-500/40', icon: <Zap size={16}/>, text: 'High Alert' },
    stable: { color: 'from-emerald-400 to-teal-600', shadow: 'shadow-emerald-500/40', icon: <Sparkles size={16}/>, text: 'Stable Link' }
  };

  const { color, shadow, icon, text } = moodConfig[mood];

  return (
    <div className={`relative px-4 py-2 rounded-2xl bg-gradient-to-r ${color} ${shadow} shadow-lg transition-all duration-1000 animate-in fade-in`}>
      <div className="absolute inset-0 bg-white/20 rounded-2xl animate-pulse" />
      <div className="relative z-10 flex items-center gap-2 text-white">
        <div className="p-1 bg-black/20 rounded-lg">{icon}</div>
        <span className="text-[10px] font-black uppercase tracking-[0.2em] italic">{text}</span>
      </div>
    </div>
  );
};

export default SentienceVibe;