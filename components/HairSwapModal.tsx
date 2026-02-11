import React, { useState, useRef, useEffect } from 'react';
import { 
  X, Scissors, Video, UserSquare2, Sparkles, 
  Zap, Info, Wallet, Loader2, Wand2, Camera 
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { Attachment } from '../types';

interface HairSwapModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwap: (source: Attachment, target: Attachment) => void;
}

const HairSwapModal: React.FC<HairSwapModalProps> = ({ isOpen, onClose, onSwap }) => {
  const [sourceHair, setSourceHair] = useState<Attachment | null>(null);
  const [targetPerson, setTargetPerson] = useState<Attachment | null>(null);
  const [estimatedCost, setEstimatedCost] = useState<number>(0);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const { t } = useLanguage();
  const sourceInputRef = useRef<HTMLInputElement>(null);
  const targetInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isOpen) {
        setSourceHair(null);
        setTargetPerson(null);
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
            // Công thức Infinity: 1s video = 1 Shard. Tối thiểu 5 Shards.
            const cost = duration < 5 ? 5 : duration; 
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
                if (isSource) setSourceHair(att);
                else setTargetPerson(att);
            }
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSwapClick = async () => {
    if (sourceHair && targetPerson) {
        setIsProcessing(true);
        // Giả lập xử lý nén dữ liệu cho Android 14
        await new Promise(resolve => setTimeout(resolve, 1000));
        onSwap(sourceHair, targetPerson);
        onClose();
    }
  };

  const renderPreview = (att: Attachment | null, placeholder: string, icon: React.ReactNode, activeColor: string) => {
      if (!att) {
          return (
              <div className="flex flex-col items-center justify-center h-full text-slate-500 gap-3 group-hover:text-amber-400 transition-colors">
                  <div className="p-4 bg-slate-900 rounded-3xl border border-white/5 shadow-inner">
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
                <Camera className="text-white drop-shadow-lg" size={32} />
            </div>
        </div>
      );
  };

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xl animate-in fade-in duration-300">
      <div className="absolute inset-0" onClick={onClose} />

      <div className="bg-slate-900/90 border border-white/10 w-full max-w-2xl rounded-[2.5rem] shadow-[0_0_80px_rgba(245,158,11,0.15)] p-8 relative flex flex-col max-h-[95vh] overflow-y-auto custom-scrollbar z-10 animate-in zoom-in-95 duration-500">
        
        {/* Header: Amber Salon Style */}
        <div className="flex justify-between items-start mb-8">
            <div className="flex items-center gap-4">
                <div className="bg-amber-600 p-3 rounded-2xl shadow-lg shadow-amber-600/30">
                    <Scissors size={28} className="text-white" />
                </div>
                <div>
                    <h2 className="text-2xl font-black text-white tracking-tighter uppercase italic">
                        {t('hsModalTitle') || "SoulLink Hair Studio"}
                    </h2>
                    <p className="text-[10px] text-amber-500 font-bold uppercase tracking-[0.3em]">AI Stylist & Coiffure</p>
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
                    <Zap size={12} className="text-amber-500" /> {t('hsSourceLabel') || "Mẫu tóc nguồn"}
                </label>
                <div 
                    onClick={() => sourceInputRef.current?.click()}
                    className={`h-56 bg-slate-950 border-2 border-dashed rounded-[2rem] overflow-hidden cursor-pointer transition-all duration-500 ${sourceHair ? 'border-amber-500 shadow-lg shadow-amber-500/20' : 'border-slate-800 hover:border-amber-500/50 hover:bg-slate-900'}`}
                >
                    {renderPreview(sourceHair, "Upload Style", <Scissors size={40} />, "amber")}
                </div>
                <input type="file" ref={sourceInputRef} onChange={(e) => handleFileChange(e, true)} accept="image/*" className="hidden" />
            </div>

            <div className="space-y-3 group">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2 flex items-center gap-2">
                    <UserSquare2 size={12} className="text-amber-500" /> {t('hsTargetLabel') || "Người nhận tóc"}
                </label>
                 <div 
                    onClick={() => targetInputRef.current?.click()}
                    className={`h-56 bg-slate-950 border-2 border-dashed rounded-[2rem] overflow-hidden cursor-pointer transition-all duration-500 ${targetPerson ? 'border-yellow-500 shadow-lg shadow-yellow-500/20' : 'border-slate-800 hover:border-yellow-500/50 hover:bg-slate-900'}`}
                >
                    {renderPreview(targetPerson, "Upload Target", <Video size={40} />, "yellow")}
                </div>
                <input type="file" ref={targetInputRef} onChange={(e) => handleFileChange(e, false)} accept="image/*,video/*" className="hidden" />
            </div>
        </div>

        {/* Cost Panel */}
        {targetPerson && (
            <div className="mb-8 px-6 py-4 bg-white/5 rounded-2xl border border-white/5 flex justify-between items-center animate-in slide-in-from-top-2">
                <div className="flex items-center gap-3">
                    <Wallet className="text-slate-500" size={18} />
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Phí tạo kiểu:</span>
                </div>
                <div className="flex items-center gap-2 text-yellow-500 font-black font-mono text-xl">
                    <Sparkles size={18} fill="currentColor" />
                    {estimatedCost} SHARDS
                </div>
            </div>
        )}

        {/* Action Button */}
        <button
          onClick={handleSwapClick}
          disabled={!sourceHair || !targetPerson || isProcessing}
          className="relative w-full py-5 rounded-2xl bg-gradient-to-r from-amber-600 via-yellow-600 to-amber-600 hover:from-amber-500 hover:via-yellow-500 hover:to-amber-500 text-white font-black text-sm uppercase tracking-[0.3em] shadow-xl shadow-amber-500/25 transition-all active:scale-[0.98] disabled:opacity-30 disabled:grayscale overflow-hidden group"
        >
          <div className="relative z-10 flex items-center justify-center gap-3">
            {isProcessing ? (
                <>
                    <Loader2 size={20} className="animate-spin" />
                    Đang thiết kế kiểu tóc...
                </>
            ) : (
                <>
                    <Wand2 size={20} className="group-hover:animate-pulse" />
                    {t('hsSwapBtn') || "Biến hình ngay"}
                </>
            )}
          </div>
          {sourceHair && targetPerson && !isProcessing && (
              <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 italic" />
          )}
        </button>
        
        <p className="text-center text-[9px] font-bold text-slate-600 mt-6 uppercase tracking-[0.4em]">
            Neural Hair-Synthesis Protocol v2.0 • Secure Processing
        </p>
      </div>
    </div>
  );
};

export default HairSwapModal;