import React, { useState } from 'react';
import { ScanFace, Fingerprint, ShieldCheck, Lock } from 'lucide-react';

const BiometricGate: React.FC<{ onUnlocked: () => void }> = ({ onUnlocked }) => {
  const [status, setStatus] = useState<'idle' | 'scanning' | 'success'>('idle');

  const startScan = () => {
    setStatus('scanning');
    setTimeout(() => {
      setStatus('success');
      setTimeout(onUnlocked, 1000);
    }, 2500);
  };

  return (
    <div className="p-8 bg-slate-900 border border-white/5 rounded-[3rem] flex flex-col items-center gap-8 relative overflow-hidden">
      {status === 'scanning' && (
        <div className="absolute top-0 left-0 w-full h-1 bg-indigo-500 animate-scan shadow-[0_0_15px_#6366f1]" />
      )}
      
      <div className="text-center space-y-2">
        <h3 className="text-xl font-black text-white uppercase italic tracking-tighter">Security Gate</h3>
        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Identify Master to proceed</p>
      </div>

      <div 
        onClick={startScan}
        className={`w-32 h-32 rounded-full flex items-center justify-center cursor-pointer transition-all duration-500 border-2 ${
          status === 'success' ? 'bg-green-500 border-green-400 shadow-[0_0_30px_rgba(34,197,94,0.4)]' : 
          status === 'scanning' ? 'bg-indigo-600/20 border-indigo-500 animate-pulse' : 
          'bg-slate-800 border-slate-700 hover:border-indigo-500'
        }`}
      >
        {status === 'success' ? <ShieldCheck size={48} className="text-white" /> : 
         status === 'scanning' ? <ScanFace size={48} className="text-indigo-400" /> : 
         <Fingerprint size={48} className="text-slate-500" />}
      </div>

      <div className="flex items-center gap-2 text-[10px] font-black text-slate-600 uppercase tracking-[0.3em]">
        <Lock size={12} /> Encrypted Session
      </div>
    </div>
  );
};

export default BiometricGate;