import React, { useState } from 'react';
import { X, Sparkles, Image as ImageIcon, Zap, Wand2, Palette, Info, Check } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface ImageGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGenerate: (prompt: string, style: string) => void;
}

const ImageGeneratorModal: React.FC<ImageGeneratorModalProps> = ({ isOpen, onClose, onGenerate }) => {
  const [prompt, setPrompt] = useState('');
  const [selectedStyle, setSelectedStyle] = useState('Realistic');
  const { t } = useLanguage();

  if (!isOpen) return null;

  // --- VIP PRO: STYLE PRESETS ---
  const styles = [
    { name: 'Realistic', icon: '📸', desc: 'Ảnh chụp chân thực' },
    { name: 'Anime', icon: '🌸', desc: 'Phong cách Nhật Bản' },
    { name: 'Cyberpunk', icon: '🌃', desc: 'Tương lai neon' },
    { name: 'Oil Painting', icon: '🎨', desc: 'Tranh sơn dầu' },
    { name: '3D Render', icon: '💎', desc: 'Chất lượng Unreal Engine 5' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim()) {
      // Kết hợp prompt với style để AI hiểu rõ hơn
      onGenerate(prompt.trim(), selectedStyle);
      setPrompt('');
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xl animate-in fade-in duration-300">
      
      {/* Background Glow Decor */}
      <div className="absolute w-[400px] h-[400px] bg-purple-600/20 rounded-full blur-[120px] pointer-events-none" />

      <div className="bg-slate-900/90 border border-white/10 w-full max-w-lg rounded-[2.5rem] shadow-[0_0_80px_rgba(168,85,247,0.15)] overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-300">
        
        {/* Header: Cyber Style */}
        <div className="p-6 border-b border-white/5 flex justify-between items-center bg-gradient-to-r from-purple-500/10 to-transparent">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-purple-600 rounded-2xl shadow-lg shadow-purple-600/30">
              <Sparkles className="text-white" size={22} />
            </div>
            <div>
              <h2 className="text-xl font-black text-white tracking-tighter uppercase italic">{t('genModalTitle') || "SoulLink Vision"}</h2>
              <p className="text-[10px] text-purple-400 font-bold uppercase tracking-[0.2em]">Neural Image Synthesis</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full text-slate-400 transition-all active:scale-90">
            <X size={24} />
          </button>
        </div>

        <div className="p-8 overflow-y-auto custom-scrollbar space-y-8">
          
          {/* Style Selector Section */}
          <div className="space-y-4">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-2 flex items-center gap-2">
              <Palette size={12} /> {t('styleLabel') || "Chọn phong cách nghệ thuật"}
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {styles.map((style) => (
                <button
                  key={style.name}
                  onClick={() => setSelectedStyle(style.name)}
                  className={`p-3 rounded-2xl border transition-all duration-300 flex flex-col items-center text-center gap-1 ${
                    selectedStyle === style.name 
                    ? 'bg-purple-600/20 border-purple-500 shadow-lg shadow-purple-500/10' 
                    : 'bg-white/5 border-transparent hover:bg-white/10'
                  }`}
                >
                  <span className="text-xl">{style.icon}</span>
                  <span className={`text-[10px] font-black uppercase tracking-tight ${selectedStyle === style.name ? 'text-white' : 'text-slate-400'}`}>
                    {style.name}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Prompt Input Section */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-3">
              <div className="flex justify-between items-end px-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] flex items-center gap-2">
                  <Wand2 size={12} /> {t('promptLabel') || "Mô tả hình ảnh"}
                </label>
                <span className="text-[9px] text-purple-400 font-bold bg-purple-500/10 px-2 py-0.5 rounded uppercase">AI Enhanced</span>
              </div>
              
              <div className="relative group">
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder={t('promptPlaceholder') || "Ví dụ: Một cô gái đứng dưới mưa ở phố cổ Hội An, phong cách Cyberpunk..."}
                  className="w-full bg-slate-950 border border-white/5 rounded-[1.5rem] p-5 text-white text-sm focus:border-purple-500 outline-none transition-all h-40 resize-none custom-scrollbar shadow-inner"
                  autoFocus
                />
                <div className="absolute bottom-4 right-4 text-slate-600">
                  <Zap size={16} className={prompt.length > 0 ? "text-purple-500 animate-pulse" : ""} />
                </div>
              </div>
            </div>

            {/* Quick Tips */}
            <div className="p-4 bg-white/5 rounded-2xl border border-white/5 flex items-start gap-3">
              <Info size={16} className="text-indigo-400 shrink-0 mt-0.5" />
              <p className="text-[10px] text-slate-400 leading-relaxed italic">
                {t('promptTip') || "Mẹo: Hãy thêm các từ khóa như '4k', 'detailed', 'cinematic lighting' để hình ảnh của Master đẹp hơn!"}
              </p>
            </div>

            {/* Generate Button: Ultra Glow */}
            <button
              type="submit"
              disabled={!prompt.trim()}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-black text-xs uppercase tracking-[0.3em] shadow-[0_10px_30px_rgba(168,85,247,0.3)] transition-all flex items-center justify-center gap-3 active:scale-95 disabled:opacity-30 disabled:grayscale"
            >
              <Sparkles size={18} />
              {t('generateBtn') || "Khởi tạo hình ảnh"}
            </button>
          </form>
        </div>

        {/* Footer info */}
        <div className="p-4 bg-slate-950/50 border-t border-white/5 text-center">
            <p className="text-[9px] font-black text-slate-600 uppercase tracking-[0.4em]">Powered by Stable Diffusion XL & SoulLink Core</p>
        </div>
      </div>
    </div>
  );
};

export default ImageGeneratorModal;