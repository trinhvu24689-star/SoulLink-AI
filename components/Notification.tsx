import React, { useEffect } from 'react';
import { 
  CheckCircle2, AlertCircle, Info, X, 
  Bell, Sparkles, Moon, Zap, ShieldCheck 
} from 'lucide-react';

export type NotificationType = 'success' | 'error' | 'info' | 'shard' | 'system';

interface NotificationProps {
  id: string;
  type: NotificationType;
  message: string;
  onClose: (id: string) => void;
}

const Notification: React.FC<NotificationProps> = ({ id, type, message, onClose }) => {
  
  useEffect(() => {
    const timer = setTimeout(() => onClose(id), 5000);
    return () => clearTimeout(timer);
  }, [id, onClose]);

  // --- CẤU HÌNH GIAO DIỆN THEO LOẠI ---
  const config = {
    success: {
      icon: <CheckCircle2 size={20} className="text-green-400" />,
      bg: 'bg-green-500/10',
      border: 'border-green-500/30',
      glow: 'shadow-green-500/20'
    },
    error: {
      icon: <AlertCircle size={20} className="text-red-400" />,
      bg: 'bg-red-500/10',
      border: 'border-red-500/30',
      glow: 'shadow-red-500/20'
    },
    shard: {
      icon: <Moon size={20} className="text-yellow-400 fill-yellow-400/20" />,
      bg: 'bg-yellow-500/10',
      border: 'border-yellow-500/30',
      glow: 'shadow-yellow-500/20'
    },
    system: {
      icon: <ShieldCheck size={20} className="text-indigo-400" />,
      bg: 'bg-indigo-500/10',
      border: 'border-indigo-500/30',
      glow: 'shadow-indigo-500/20'
    },
    info: {
      icon: <Info size={20} className="text-cyan-400" />,
      bg: 'bg-cyan-500/10',
      border: 'border-cyan-500/30',
      glow: 'shadow-cyan-500/20'
    }
  };

  const { icon, bg, border, glow } = config[type];

  return (
    <div className={`pointer-events-auto flex items-center gap-4 p-4 rounded-2xl border ${bg} ${border} ${glow} backdrop-blur-xl shadow-2xl animate-in slide-in-from-right-full duration-500 min-w-[300px] max-w-md group`}>
      
      {/* Icon rực rỡ */}
      <div className="relative">
        <div className="absolute inset-0 blur-lg opacity-50 bg-current" />
        {icon}
      </div>

      {/* Nội dung thông báo */}
      <div className="flex-1">
        <p className="text-sm font-bold text-white tracking-tight leading-tight">
          {message}
        </p>
        <div className="flex items-center gap-1.5 mt-1">
           <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest italic">SoulLink Security</span>
           <div className="w-1 h-1 bg-slate-700 rounded-full" />
           <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Just Now</span>
        </div>
      </div>

      {/* Nút đóng */}
      <button 
        onClick={() => onClose(id)}
        className="p-1 hover:bg-white/5 rounded-lg text-slate-500 hover:text-white transition-all opacity-0 group-hover:opacity-100"
      >
        <X size={16} />
      </button>

      {/* Thanh tiến trình (Progress Bar) */}
      <div className="absolute bottom-0 left-0 h-0.5 bg-white/10 w-full overflow-hidden rounded-b-2xl">
         <div className={`h-full bg-white/20 animate-shrink`} style={{ animationDuration: '5000ms' }} />
      </div>
    </div>
  );
};

export default Notification;