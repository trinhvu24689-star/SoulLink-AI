import React from 'react';
import { Waves, Heart, CloudRain, Sun } from 'lucide-react';

const SentienceVibe: React.FC<{ mood: 'happy' | 'sad' | 'love' }> = ({ mood }) => {
  const config = {
    happy: { color: 'from-yellow-400 to-orange-500', icon: <Sun />, label: 'Radiant' },
    sad: { color: 'from-blue-500 to-indigo-700', icon: <CloudRain />, label: 'Deep Blue' },
    love: { color: 'from-pink-500 to-rose-600', icon: <Heart />, label: 'Soul-Bond' }
  };

  const { color, icon, label } = config[mood];

  return (
    <div className={`p-4 rounded-3xl bg-gradient-to-br ${color} shadow-lg animate-pulse`}>
      <div className="flex items-center gap-3 text-white">
        <div className="p-2 bg-white/20 rounded-xl backdrop-blur-md">
            {icon}
        </div>
        <div>
            <span className="block text-[8px] font-black uppercase tracking-widest opacity-60">AI Mood State</span>
            <span className="text-xs font-black uppercase italic">{label}</span>
        </div>
      </div>
    </div>
  );
};