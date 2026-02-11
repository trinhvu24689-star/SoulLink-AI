import React from 'react';
import { Power, ShieldAlert, AlertTriangle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const MasterOverride: React.FC = () => {
  const { user } = useAuth();
  if (user?.role !== 'admin') return null;

  return (
    <div className="p-6 bg-red-950/20 border-2 border-red-600/50 rounded-[2.5rem] flex items-center justify-between group">
      <div className="flex items-center gap-4">
        <div className="p-3 bg-red-600 rounded-2xl shadow-[0_0_20px_rgba(220,38,38,0.5)] group-hover:scale-110 transition-transform">
          <Power className="text-white" size={24} />
        </div>
        <div>
          <h4 className="text-sm font-black text-red-500 uppercase tracking-tighter">Emergency Override</h4>
          <p className="text-[9px] text-red-400/60 font-bold uppercase tracking-widest">Freeze All Neural Streams</p>
        </div>
      </div>
      <button className="px-4 py-2 bg-red-600/10 hover:bg-red-600 text-red-500 hover:text-white rounded-xl text-[10px] font-black uppercase transition-all border border-red-600/30">
        Initiate Halt
      </button>
    </div>
  );
};