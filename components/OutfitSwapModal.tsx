import React, { useState, useRef, useEffect } from 'react';
import { 
  X, Shirt, Video, ShoppingBag, Sparkles, 
  Zap, Wallet, Loader2, Wand2, Star, 
  CheckCircle2, Info, UserSquare2 // 👈 ĐÃ THÊM ICON NÀY
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { Attachment } from '../types';

interface OutfitSwapModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwap: (source: Attachment, target: Attachment) => void;
}

const OutfitSwapModal: React.FC<OutfitSwapModalProps> = ({ isOpen, onClose, onSwap }) => {
  const [sourceOutfit, setSourceOutfit] = useState<Attachment | null>(null);
  const [targetPerson, setTargetPerson] = useState<Attachment | null>(null);
  const [estimatedCost, setEstimatedCost] = useState<number>(0);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const { t } = useLanguage();
  const sourceInputRef = useRef<HTMLInputElement>(null);
  const targetInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isOpen) {
        setSourceOutfit(null);
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
            // Công thức Infinity: 1s video = 2 Shards. Tối thiểu 20 Shards cho Outfit.
            const cost = duration < 5 ? 20 : duration * 2; 
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
                if (isSource) setSourceOutfit(att);
                else setTargetPerson(att);
            }
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSwapClick = async () => {
    if (sourceOutfit && targetPerson) {
        setIsProcessing(true);
        // Giả lập xử lý nén texture vải vóc cho AI
        await new Promise(resolve => setTimeout(resolve, 1500));
        onSwap(sourceOutfit, targetPerson);
        onClose();
    }
  };

  const renderPreview = (att: Attachment | null, placeholder: string, icon: React.ReactNode, activeColor: string) => {
      if (!att) {
          return (
              <div className="flex flex-col items-center justify-center h-full text-slate-500 gap-3 group-hover:text-emerald-400 transition-colors">
                  <div className="p-4 bg-slate-900 rounded-[2rem] border border-white/5 shadow-inner">
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
                <img src={`data:${att.mimeType};base64,${att.data}`} className="w-full h-full object-cover animate-in fade-in duration-700" alt="preview" />
            )}
            <div className={`absolute inset-0 bg-gradient-to-t from-${activeColor}-600/40 to-transparent opacity-0 group-hover/preview:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]`}>
                <Star className="text-white drop-shadow-lg animate-spin-slow" size={32} />
            </div>
        </div>
      );
  };

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xl animate-in fade-in duration-300">
      <div className="absolute inset-0" onClick={onClose} />

      <div className="bg-slate-900/90 border border-white/10 w-full max-w-2xl rounded-[3rem] shadow-[0_0_80px_rgba(16,185,129,0.15)] p-8 relative flex flex-col max-h-[95vh] overflow-y-auto custom-scrollbar z-10 animate-in zoom-in-95 duration-500">
        
        {/* Header: Cyber Boutique Style */}
        <div className="flex justify-between items-start mb-8">
            <div className="flex items-center gap-4">
                <div className="bg-emerald-600 p-3 rounded-2xl shadow-lg shadow-emerald-600/30">
                    <Shirt size={28} className="text-white" />
                </div>
                <div>
                    <h2 className="text-2xl font-black text-white tracking-tighter uppercase italic">
                        {t('osModalTitle') || "SoulLink Virtual Couture"}
                    </h2>
                    <p className="text-[10px] text-emerald-400 font-bold uppercase tracking-[0.3em]">Neural Fabric Synthesis</p>
                </div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full text-slate-500 hover:text-white transition-all">
                <X size={24} />
            </button>
        </div>

        {/* Input Slots */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div className="space-y-3 group">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2 flex items-center gap-2">
                    <ShoppingBag size={12} className="text-emerald-500" /> {t('osSourceLabel') || "Trang phục mẫu"}
                </label>
                <div 
                    onClick={() => sourceInputRef.current?.click()}
                    className={`h-64 bg-slate-950 border-2 border-dashed rounded-[2.5rem] overflow-hidden cursor-pointer transition-all duration-500 ${sourceOutfit ? 'border-emerald-500 shadow-lg shadow-emerald-500/20' : 'border-slate-800 hover:border-emerald-500/50 hover:bg-slate-900'}`}
                >
                    {renderPreview(sourceOutfit, "Upload Outfit", <ShoppingBag size={40} />, "emerald")}
                </div>
                <input type="file" ref={sourceInputRef} onChange={(e) => handleFileChange(e, true)} accept="image/*" className="hidden" />
            </div>

            <div className="space-y-3 group">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2 flex items-center gap-2">
                    <UserSquare2 size={12} className="text-emerald-500" /> {t('osTargetLabel') || "Người mặc"}
                </label>
                 <div 
                    onClick={() => targetInputRef.current?.click()}
                    className={`h-64 bg-slate-950 border-2 border-dashed rounded-[2.5rem] overflow-hidden cursor-pointer transition-all duration-500 ${targetPerson ? 'border-green-500 shadow-lg shadow-green-500/20' : 'border-slate-800 hover:border-green-500/50 hover:bg-slate-900'}`}
                >
                    {renderPreview(targetPerson, "Upload Person", <Video size={40} />, "green")}
                </div>
                <input type="file" ref={targetInputRef} onChange={(e) => handleFileChange(e, false)} accept="image/*,video/*" className="hidden" />
            </div>
        </div>

        {/* Dynamic Cost Display */}
        {targetPerson && (
            <div className="mb-8 px-6 py-5 bg-emerald-600/5 rounded-3xl border border-emerald-500/20 flex justify-between items-center animate-in slide-in-from-top-2">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-emerald-500/10 rounded-xl">
                        <Wallet className="text-emerald-400" size={20} />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Phí thiết kế dự kiến</span>
                        <span className="text-xs text-emerald-200/60 italic">Cấp bởi SoulLink Engine</span>
                    </div>
                </div>
                <div className="flex items-center gap-2 text-emerald-400 font-black font-mono text-2xl">
                    <Sparkles size={20} fill="currentColor" className="animate-pulse" />
                    {estimatedCost} SHARDS
                </div>
            </div>
        )}

        {/* Action Button: Emerald Shimmer */}
        <button
          onClick={handleSwapClick}
          disabled={!sourceOutfit || !targetPerson || isProcessing}
          className="relative w-full py-5 rounded-[2rem] bg-gradient-to-r from-emerald-600 via-green-500 to-emerald-600 hover:from-emerald-500 hover:via-green-400 hover:to-emerald-500 text-white font-black text-sm uppercase tracking-[0.3em] shadow-xl shadow-emerald-500/25 transition-all active:scale-[0.98] disabled:opacity-30 disabled:grayscale overflow-hidden group"
        >
          <div className="relative z-10 flex items-center justify-center gap-3">
            {isProcessing ? (
                <>
                    <Loader2 size={20} className="animate-spin" />
                    Đang may đo kỹ thuật số...
                </>
            ) : (
                <>
                    <Wand2 size={20} className="group-hover:rotate-12 transition-transform" />
                    {t('osSwapBtn') || "Mặc thử ngay"}
                </>
            )}
          </div>
          {sourceOutfit && targetPerson && !isProcessing && (
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-shimmer" />
          )}
        </button>
        
        {/* Security Info */}
        <div className="mt-6 flex items-center justify-center gap-6 opacity-40">
            <div className="flex items-center gap-1.5">
                <CheckCircle2 size={10} className="text-emerald-500" />
                <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">End-to-End SSL</span>
            </div>
            <div className="flex items-center gap-1.5">
                <Info size={10} className="text-emerald-500" />
                <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">AI Fabric Mapping v3.0</span>
            </div>
        </div>
      </div>
    </div>
  );
};

export default OutfitSwapModal;