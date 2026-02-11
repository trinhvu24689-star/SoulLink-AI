import React from 'react';
import { Activity, Cpu, Database, Binary } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const NeuroSpy: React.FC = () => {
  const { user } = useAuth();
  if (user?.role !== 'admin') return null;

  return (
    <div className="p-6 bg-black border border-indigo-500/20 rounded-[2.5rem] shadow-inner">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
            <Binary className="text-indigo-500" size={18} />
            <span className="text-[10px] font-black text-white uppercase tracking-widest italic">Live Neural Traffic</span>
        </div>
        <div className="h-1.5 w-24 bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full bg-indigo-500 animate-shimmer w-2/3" />
        </div>
      </div>

      <div className="space-y-4">
        {[1, 2, 3].map(i => (
            <div key={i} className="flex items-center justify-between text-[10px] font-mono p-2 border-b border-white/5">
                <span className="text-slate-500">REQ_ID: {Math.random().toString(36).substr(2, 9)}</span>
                <span className="text-green-500">SUCCESS: 200ms</span>
                <span className="text-indigo-400">124 Tokens</span>
            </div>
        ))}
      </div>
    </div>
  );
};