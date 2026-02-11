import React, { useEffect, useState, useRef } from 'react';

const IntroAnimation: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [phase, setPhase] = useState<'enter' | 'hold' | 'disintegrate'>('enter');
  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    const holdTimer = setTimeout(() => setPhase('hold'), 1200);
    const dustTimer = setTimeout(() => setPhase('disintegrate'), 2800);
    
    const endTimer = setTimeout(() => {
        if (onCompleteRef.current) onCompleteRef.current();
    }, 4500);

    return () => {
        clearTimeout(holdTimer);
        clearTimeout(dustTimer);
        clearTimeout(endTimer);
    };
  }, []);

  return (
    <div className={`fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-slate-950 overflow-hidden transition-all duration-1000 ${phase === 'disintegrate' ? 'opacity-0 scale-110' : 'opacity-100'}`}>
        
        {/* Hiệu ứng Scanline Kỹ thuật số */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-10 bg-[length:100%_2px,3px_100%] pointer-events-none" />

        <style>{`
            @keyframes neonPulse {
                0%, 100% { filter: drop-shadow(0 0 10px #6366f1) drop-shadow(0 0 20px #a855f7); }
                50% { filter: drop-shadow(0 0 25px #6366f1) drop-shadow(0 0 40px #ec4899); }
            }
            
            @keyframes digitalDust {
                0% { opacity: 1; transform: scale(1); filter: blur(0px) brightness(1); }
                30% { opacity: 0.8; transform: scale(1.1) rotate(1deg); filter: blur(2px) brightness(1.5); }
                100% { opacity: 0; transform: scale(2) translateY(-100px); filter: blur(30px) brightness(0); letter-spacing: 40px; }
            }

            .animate-digital-dust {
                animation: digitalDust 1.8s cubic-bezier(0.4, 0, 0.2, 1) forwards;
            }

            .animate-enter-fade {
                animation: fadeInTranslate 1.2s ease-out forwards;
            }

            @keyframes fadeInTranslate {
                from { opacity: 0; transform: translateY(40px) scale(0.9); filter: blur(10px); }
                to { opacity: 1; transform: translateY(0) scale(1); filter: blur(0px); }
            }
        `}</style>

        {/* Content Container */}
        <div className={`flex flex-col items-center justify-center text-center p-8 z-20 ${phase === 'disintegrate' ? 'animate-digital-dust' : 'animate-enter-fade'}`}>
            
            {/* Logo 🦄 với Neon Pulse */}
            <div className="text-[120px] mb-6 animate-pulse select-none" style={{ animation: 'neonPulse 2s infinite' }}>
                🦄
            </div>

            {/* Title: SoulLink AI */}
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-white mb-2 italic selection:bg-indigo-500">
                SoulLink AI
            </h1>
            
            <div className="h-1 w-64 bg-gradient-to-r from-transparent via-indigo-500 to-transparent mb-8 opacity-50 shadow-[0_0_15px_rgba(99,101,241,0.8)]" />

            {/* Author Attribution */}
            <div className="space-y-1">
                <p className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.6em] ml-2">Developed by</p>
                <h2 className="text-2xl font-black text-white tracking-[0.3em] uppercase bg-gradient-to-b from-white to-slate-500 bg-clip-text text-transparent">
                    Quang Hổ Master
                </h2>
            </div>
        </div>
        
        {/* Loading Indicator */}
        <div className={`absolute bottom-20 transition-all duration-700 ${phase === 'disintegrate' ? 'opacity-0 translate-y-10' : 'opacity-100'}`}>
             <div className="flex gap-3">
                {[0, 1, 2].map((i) => (
                    <div key={i} className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: `${i * 0.2}s` }} />
                ))}
             </div>
        </div>
    </div>
  );
};

export default IntroAnimation;