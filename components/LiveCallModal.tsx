import React, { useEffect, useState, useRef } from 'react';
import { SoulLinkLiveClient } from '../services/liveService';
import { Persona } from '../types';
import { PhoneOff, Mic, MicOff, Signal, Volume2, AlertCircle, Loader2 } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface LiveCallModalProps {
  isOpen: boolean;
  onClose: () => void;
  persona: Persona;
}

// Định nghĩa kiểu dữ liệu trạng thái chuẩn
type CallStatus = 'connecting' | 'connected' | 'speaking' | 'disconnected' | 'error';

const LiveCallModal: React.FC<LiveCallModalProps> = ({ isOpen, onClose, persona }) => {
  const { t, language } = useLanguage();
  const [status, setStatus] = useState<CallStatus>('connecting');
  const [isMuted, setIsMuted] = useState(false);
  const [callTime, setCallTime] = useState(0);
  const clientRef = useRef<SoulLinkLiveClient | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // --- 1. QUẢN LÝ CUỘC GỌI ---
  useEffect(() => {
    if (isOpen) {
      setCallTime(0);
      const client = new SoulLinkLiveClient(persona.systemInstruction);
      client.setLanguage(language);
      
      // Cập nhật trạng thái từ Client
      client.onStateChange = (s: CallStatus) => {
        setStatus(s);
        if (s === 'connected') {
          // Bắt đầu đếm giờ khi cuộc gọi thông suốt
          timerRef.current = setInterval(() => {
            setCallTime(prev => prev + 1);
          }, 1000);
        }
      };
      
      clientRef.current = client;

      client.connect().catch((err: Error) => {
        console.error("Lỗi Live Call:", err);
        setStatus('error');
      });
    }

    return () => {
      if (clientRef.current) {
        clientRef.current.disconnect();
        clientRef.current = null;
      }
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isOpen, persona.systemInstruction, language]);

  if (!isOpen) return null;

  // --- 2. HÀM BỔ TRỢ ---
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const toggleMute = () => {
    if (clientRef.current) {
      const nextMute = !isMuted;
      setIsMuted(nextMute);
      // Giả sử client có hàm setMute, nếu chưa ck báo vợ viết thêm nhé
      if ((clientRef.current as any).setMute) {
          (clientRef.current as any).setMute(nextMute);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-[200] bg-slate-950 flex flex-col items-center justify-center animate-in fade-in duration-500 overflow-hidden">
      
      {/* Hiệu ứng Aura động theo trạng thái */}
      <div className={`absolute w-[500px] h-[500px] rounded-full blur-[100px] transition-all duration-1000 ${
        status === 'speaking' ? 'bg-indigo-500/30 scale-125 opacity-100' : 
        status === 'error' ? 'bg-red-500/20 opacity-100' : 'bg-indigo-900/10 opacity-50'
      }`} />

      <div className="relative z-10 flex flex-col items-center justify-between h-full w-full max-w-md py-16 px-6">
        
        {/* Top Section: Status & Persona Info */}
        <div className="text-center space-y-4">
          <div className="flex flex-col items-center gap-2">
             <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/80 border border-slate-800 shadow-sm">
                {status === 'connecting' ? <Loader2 size={12} className="animate-spin text-indigo-400" /> : <Signal size={12} className={status === 'error' ? 'text-red-500' : 'text-green-500'} />}
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-300">
                    {status === 'connecting' ? 'Establishing Secure Link...' : status === 'error' ? 'Connection Failed' : formatTime(callTime)}
                </span>
             </div>
          </div>
          <h2 className="text-4xl font-bold text-white tracking-tight">{persona.name}</h2>
          <p className="text-indigo-400/80 text-xs font-medium uppercase tracking-tighter">
            {status === 'speaking' ? 'SoulLink AI is speaking...' : 'Listening to your soul...'}
          </p>
        </div>

        {/* Center Section: Avatar & Visualizer */}
        <div className="relative group">
          {/* Waveform Visualizer (Fake animation for look & feel) */}
          {status === 'speaking' && (
             <div className="absolute -inset-8 flex items-center justify-center gap-1 opacity-50">
                {[...Array(8)].map((_, i) => (
                    <div key={i} className="w-1 bg-indigo-400 rounded-full animate-pulse" style={{ height: `${Math.random() * 100 + 20}%`, animationDelay: `${i * 0.1}s` }} />
                ))}
             </div>
          )}

          <div className={`w-56 h-56 rounded-full overflow-hidden border-2 transition-all duration-500 shadow-2xl ${
            status === 'speaking' ? 'border-indigo-400 scale-105 shadow-indigo-500/40' : 'border-slate-800'
          }`}>
            {persona.avatar ? (
              <img src={persona.avatar} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <div className={`w-full h-full bg-gradient-to-br ${persona.color} flex items-center justify-center text-7xl font-black text-white`}>
                {persona.name[0]}
              </div>
            )}
          </div>
        </div>

        {/* Bottom Section: Controls */}
        <div className="w-full space-y-12">
            {status === 'error' ? (
                <div className="flex flex-col items-center gap-4 animate-bounce">
                    <div className="flex items-center gap-2 text-red-400 text-sm font-bold">
                        <AlertCircle size={18} /> {t('errorConnection')}
                    </div>
                    <button onClick={onClose} className="px-8 py-3 bg-slate-800 rounded-full text-white font-bold">Quay lại</button>
                </div>
            ) : (
                <div className="flex items-center justify-around w-full">
                    <button 
                        onClick={toggleMute}
                        className={`group p-5 rounded-full border-2 transition-all active:scale-90 ${
                        isMuted ? 'bg-red-500/10 border-red-500 text-red-500' : 'bg-slate-900/50 border-slate-700 text-white hover:border-indigo-500'
                        }`}
                    >
                        {isMuted ? <MicOff size={28} /> : <Mic size={28} className="group-hover:animate-pulse" />}
                    </button>

                    <button 
                        onClick={() => { clientRef.current?.disconnect(); onClose(); }}
                        className="p-8 rounded-full bg-red-600 hover:bg-red-500 text-white shadow-[0_0_50px_rgba(220,38,38,0.3)] active:scale-95 transition-all transform hover:rotate-90 duration-500"
                    >
                        <PhoneOff size={36} fill="currentColor" />
                    </button>

                    <button className="p-5 rounded-full bg-slate-900/50 border-2 border-slate-700 text-white opacity-50 cursor-not-allowed">
                        <Volume2 size={28} />
                    </button>
                </div>
            )}
            
            <p className="text-center text-slate-700 text-[9px] font-bold uppercase tracking-[0.3em]">
                Secure End-to-End Encryption • SoulLink v1.5
            </p>
        </div>
      </div>
    </div>
  );
};

export default LiveCallModal;