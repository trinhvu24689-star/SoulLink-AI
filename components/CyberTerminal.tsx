import React, { useState, useEffect } from 'react';
import { Terminal, Cpu, Database, ChevronRight } from 'lucide-react';

const CyberTerminal: React.FC = () => {
  const [logs, setLogs] = useState<string[]>(["[SYSTEM]: Initializing V6 Engine..."]);

  useEffect(() => {
    const messages = [
      "Connecting to ep-southeast-1.aws.neon.tech...",
      "Prisma Engine: v7.3.0 detected.",
      "Syncing User Meta-Data...",
      "Quantum Encryption: ACTIVE",
      "SoulLink Protocol: STABLE"
    ];
    let i = 0;
    const interval = setInterval(() => {
      if (i < messages.length) {
        setLogs(prev => [...prev.slice(-4), `> ${messages[i]}`]);
        i++;
      }
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full bg-black border border-indigo-500/30 rounded-3xl p-5 font-mono shadow-[0_0_30px_rgba(99,102,241,0.1)] overflow-hidden">
      <div className="flex items-center justify-between mb-4 border-b border-indigo-500/20 pb-3">
        <div className="flex items-center gap-2">
          <Terminal size={16} className="text-indigo-400" />
          <span className="text-[10px] font-bold text-indigo-300 uppercase tracking-widest">Master Console v6.0</span>
        </div>
        <div className="flex gap-1.5">
          <div className="w-2 h-2 rounded-full bg-red-500/50" />
          <div className="w-2 h-2 rounded-full bg-yellow-500/50" />
          <div className="w-2 h-2 rounded-full bg-green-500/50" />
        </div>
      </div>
      
      <div className="space-y-2">
        {logs.map((log, idx) => (
          <div key={idx} className="flex gap-2 text-xs">
            <span className="text-indigo-900">{new Date().toLocaleTimeString()}</span>
            <span className={log.startsWith('[') ? 'text-pink-500' : 'text-indigo-400'}>{log}</span>
          </div>
        ))}
        <div className="flex items-center gap-2 text-xs text-indigo-400">
          <ChevronRight size={14} className="animate-pulse" />
          <span className="w-2 h-4 bg-indigo-500 animate-blink" />
        </div>
      </div>
    </div>
  );
};

export default CyberTerminal;