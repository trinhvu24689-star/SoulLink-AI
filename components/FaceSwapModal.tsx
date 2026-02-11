import React, { useState, useRef, useEffect } from 'react';
import { 
  X, RefreshCcw, Image as ImageIcon, Video, 
  UserSquare2, Sparkles, Zap, Info, ShieldCheck, 
  Loader2, Wallet, Wand2 
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { Attachment } from '../types';

interface FaceSwapModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwap: (source: Attachment, target: Attachment) => void;
}

const FaceSwapModal: React.FC<FaceSwapModalProps> = ({ isOpen, onClose, onSwap }) => {
  const [sourceFace, setSourceFace] = useState<Attachment | null>(null);
  const [targetMedia, setTargetMedia] = useState<Attachment | null>(null);
  const [estimatedCost, setEstimatedCost] = useState<number>(0);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const { t } = useLanguage();
  const sourceInputRef = useRef<HTMLInputElement>(null);
  const targetInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isOpen) {
        setSourceFace(null);
        setTargetMedia(null);
        setEstimatedCost(0);
        setIsProcessing(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // --- VIP PRO: SMART COST CALCULATION ---
  const calculateCost = (file: File) => {
    if (file.type.startsWith('image/')) {
        setEstimatedCost(10); 
    } else if (file.type.startsWith('video/')) {
        const video = document.createElement('video');
        video.preload = 'metadata';
        video.onloadedmetadata = () => {
            window.URL.revokeObjectURL(video.src);
            const duration = Math.ceil(video.duration);
            // Công thức Infinity: 1s video = 2 Shards. Tối thiểu 15 Shards.
            const cost = duration < 5 ? 15 : duration * 2; 
            setEstimatedCost(cost);
        };
        video.src = URL.createObjectURL(file);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, isSource: boolean) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!isSource) calculateCost(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        if (typeof result === 'string') {
            const parts = result.split(',');
            const mimeMatch = result.match(/data:([^;]+);/);
            
            if (parts.length === 2 && mimeMatch) {
                const att: Attachment = {
                    mimeType: mimeMatch[1],
                    data: parts[1]
                };
                if (isSource) setSourceFace(att);
                else setTargetMedia(att);
            }
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSwapClick = async () => {
    if (sourceFace && targetMedia) {
        setIsProcessing(true);
        // Giả lập độ trễ nén dữ liệu trước khi gửi lên Backend Neon DB
        await new Promise(resolve => setTimeout(resolve, 1200));
        onSwap(sourceFace, targetMedia);
        onClose();
    }
  };

  const renderPreview = (att: Attachment | null, placeholder: string, icon: React.ReactNode, activeColor: string) => {
      if (!att) {
          return (
              <div className="flex flex-col items-center justify-center h-full text-slate-500 gap-3 group-hover:text-slate-300 transition-colors">
                  <div className="p-4 bg-slate-900 rounded-2xl border border-white/5 shadow-inner">
                    {icon}
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-[0.2em]">{placeholder}</span>
              </div>
          );
      }
      return (
        <div className="relative w-full h-full group/preview">
            {att.mimeType.startsWith('video/') ? (
                <video className="w-full h-full object-cover" muted loop autoPlay>
                    <source src={`data:${att.mimeType};base64,${att.data}`} type={att.mimeType} />
                </video>
            ) : (
                <img src={`data:${att.mimeType};base64,${att.data}`} className="w-full h-full object-cover animate-in fade-in duration-500" alt="preview" />
            )}
            <div className={`absolute inset-0 bg-gradient-to-t from-${activeColor}-600/40 to-transparent opacity-0 group-hover/preview:opacity-100 transition-opacity flex items-center justify-center`}>
                <Wand2 className="text-white drop-shadow-lg" size={32} />
            </div>
        </div>
      );
  };

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xl animate-in fade-in duration-300">
      <div className="absolute inset-0" onClick={onClose} />

      <div className="bg-slate-900/90 border border-white/10 w-full max-w-2xl rounded-[2.5rem] shadow-[0_0_80px_rgba(99,101,241,0.2)] p-8 relative flex flex-col max-h-[95vh] overflow-y-auto custom-scrollbar z-10 animate-in zoom-in-95 duration-500">
        
        {/* Header Section */}
        <div className="flex justify-between items-start mb-8">
            <div className="flex items-center gap-4">
                <div className="bg-indigo-600 p-3 rounded-2xl shadow-lg shadow-indigo-600/30">
                    <RefreshCcw size={28} className="text-white" />
                </div>
                <div>
                    <h2 className="text-2xl font-black text-white tracking-tighter uppercase italic italic">
                        {t('fsModalTitle') || "SoulLink Metamorphosis"}
                    </h2>
                    <p className="text-[10px] text-indigo-400 font-bold uppercase tracking-[0.3em]">AI Face-Synthesis Engine</p>
                </div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full text-slate-500 hover:text-white transition-all">
                <X size={24} />
            </button>
        </div>

        {/* Input Slots */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="space-y-3 group">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2 flex items-center gap-2">
                    <UserSquare2 size={12} /> {t('fsSourceLabel') || "Khuôn mặt nguồn"}
                </label>
                <div 
                    onClick={() => sourceInputRef.current?.click()}
                    className={`h-56 bg-slate-950 border-2 border-dashed rounded-[2rem] overflow-hidden cursor-pointer transition-all duration-500 ${sourceFace ? 'border-indigo-500 shadow-lg shadow-indigo-500/20' : 'border-slate-800 hover:border-indigo-500/50 hover:bg-slate-900'}`}
                >
                    {renderPreview(sourceFace, "Upload Face", <UserSquare2 size={40} />, "indigo")}
                </div>
                <input type="file" ref={sourceInputRef} onChange={(e) => handleFileChange(e, true)} accept="image/*" className="hidden" />
            </div>

            <div className="space-y-3 group">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2 flex items-center gap-2">
                    <ImageIcon size={12} /> {t('fsTargetLabel') || "Bối cảnh mục tiêu"}
                </label>
                 <div 
                    onClick={() => targetInputRef.current?.click()}
                    className={`h-56 bg-slate-950 border-2 border-dashed rounded-[2rem] overflow-hidden cursor-pointer transition-all duration-500 ${targetMedia ? 'border-pink-500 shadow-lg shadow-pink-500/20' : 'border-slate-800 hover:border-pink-500/50 hover:bg-slate-900'}`}
                >
                    {renderPreview(targetMedia, "Upload Media", <Video size={40} />, "pink")}
                </div>
                <input type="file" ref={targetInputRef} onChange={(e) => handleFileChange(e, false)} accept="image/*,video/*" className="hidden" />
            </div>
        </div>

        {/* Cost & Info Panel */}
        <div className="space-y-4 mb-8">
            {targetMedia && (
                <div className="flex justify-between items-center px-6 py-4 bg-white/5 rounded-2xl border border-white/5 animate-in slide-in-from-top-2">
                    <div className="flex items-center gap-3">
                        <Wallet className="text-slate-500" size={18} />
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Chi phí ước tính:</span>
                    </div>
                    <div className="flex items-center gap-2 text-yellow-400 font-black font-mono text-xl">
                        <Sparkles size={18} fill="currentColor" />
                        {estimatedCost} SHARDS
                    </div>
                </div>
            )}

            <div className="flex items-start gap-3 p-4 bg-indigo-500/5 rounded-2xl border border-indigo-500/10">
                <ShieldCheck size={18} className="text-indigo-400 shrink-0 mt-0.5" />
                <p className="text-[10px] text-slate-400 leading-relaxed italic">
                    Công nghệ DeepLink hỗ trợ ảnh Full HD và Video 60fps. Mọi dữ liệu sẽ được xử lý bảo mật và tự động xóa sau 24h.
                </p>
            </div>
        </div>

        {/* Action Button */}
        <button
          onClick={handleSwapClick}
          disabled={!sourceFace || !targetMedia || isProcessing}
          className="relative w-full py-5 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:via-purple-500 hover:to-pink-500 text-white font-black text-sm uppercase tracking-[0.3em] shadow-xl shadow-purple-500/25 transition-all active:scale-[0.98] disabled:opacity-30 disabled:grayscale overflow-hidden group"
        >
          <div className="relative z-10 flex items-center justify-center gap-3">
            {isProcessing ? (
                <>
                    <Loader2 size={20} className="animate-spin" />
                    Đang đồng bộ thực tại...
                </>
            ) : (
                <>
                    <Zap size={20} className="group-hover:animate-pulse" />
                    {t('fsSwapBtn') || "Bắt đầu hoán đổi"}
                </>
            )}
          </div>
          {sourceFace && targetMedia && !isProcessing && (
              <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 italic" />
          )}
        </button>
      </div>
    </div>
  );
};

export default FaceSwapModal;