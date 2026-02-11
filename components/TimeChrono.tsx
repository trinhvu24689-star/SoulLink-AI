import React from 'react';
import { Clock, Rewind, FastForward, History } from 'lucide-react';

const TimeChrono: React.FC = () => {
  return (
    <div className="w-full p-6 bg-slate-900/60 backdrop-blur-3xl border border-white/5 rounded-[2.5rem] shadow-2xl relative overflow-hidden group">
      {/* Hiệu ứng tia sáng thời gian */}
      <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-30" />
      
      <div className="relative z-10 flex flex-col items-center">
        <div className="flex justify-between w-full mb-8">
            <h3 className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.4em]">Temporal Axis</h3>
            <History size={16} className="text-slate-500" />
        </div>

        {/* Trục vuốt thời gian (Slider 6.0) */}
        <div className="flex items-center gap-6 w-full px-4">
            <Rewind size={20} className="text-slate-600 hover:text-indigo-400 transition-colors cursor-pointer" />
            <div className="flex-1 h-12 flex items-end justify-between gap-1">
                {[...Array(20)].map((_, i) => (
                    <div key={i} className={`w-1 rounded-full transition-all duration-500 ${i === 10 ? 'h-10 bg-indigo-500 shadow-[0_0_15px_#6366f1]' : 'h-4 bg-slate-800'}`} />
                ))}
            </div>
            <FastForward size={20} className="text-slate-600 hover:text-indigo-400 transition-colors cursor-pointer" />
        </div>

        <div className="mt-6 text-center">
            <p className="text-2xl font-black text-white tracking-tighter italic">FEBRUARY 2026</p>
            <p className="text-[9px] text-slate-500 font-bold uppercase tracking-[0.2em]">Neural Memory Point: #AX-77</p>
        </div>
      </div>
    </div>
  );
};

export default TimeChrono;