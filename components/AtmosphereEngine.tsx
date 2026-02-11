import React, { useState } from 'react';
import { Sun, Moon, CloudLightning, Wind } from 'lucide-react';

const AtmosphereEngine: React.FC = () => {
  const [theme, setTheme] = useState('Cyber');

  const themes = [
    { name: 'Cyber', icon: <Sun size={14}/>, color: 'from-indigo-600 to-blue-600' },
    { name: 'Void', icon: <Moon size={14}/>, color: 'from-slate-900 to-black' },
    { name: 'Nebula', icon: <CloudLightning size={14}/>, color: 'from-purple-600 to-pink-600' }
  ];

  return (
    <div className="flex gap-2 p-2 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 w-max mx-auto">
      {themes.map((t) => (
        <button
          key={t.name}
          onClick={() => setTheme(t.name)}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${theme === t.name ? `bg-gradient-to-r ${t.color} text-white shadow-lg` : 'text-slate-500 hover:text-slate-300'}`}
        >
          {t.icon} {t.name}
        </button>
      ))}
    </div>
  );
};