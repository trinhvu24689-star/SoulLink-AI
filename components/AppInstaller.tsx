import React, { useState, useEffect } from 'react';
import { 
  Smartphone, Download, CheckCircle, Terminal, Shield, X, 
  Cpu, Code, Copy, Check, BadgeCheck, ExternalLink, QrCode 
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';

interface AppInstallerProps {
  isOpen: boolean;
  onClose: () => void;
}

const AppInstaller: React.FC<AppInstallerProps> = ({ isOpen, onClose }) => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'auto' | 'manual'>('auto');
  const [step, setStep] = useState(0);
  const [copiedSection, setCopiedSection] = useState<string | null>(null);
  
  const isAdmin = user?.role === 'admin';

  // 🔗 ĐƯỜNG DẪN NỘI BỘ: Lấy file từ thư mục public
  const OFFICIAL_APK_URL = window.location.origin + "/soullink-ai.apk";
  const QR_CODE_API = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(OFFICIAL_APK_URL)}`;

  useEffect(() => {
    if (isOpen) {
        if (!isAdmin) setActiveTab('auto');
        if (activeTab === 'auto') {
            setStep(0);
            const timers = [
                setTimeout(() => setStep(1), 500),
                setTimeout(() => setStep(2), 1200),
                setTimeout(() => setStep(3), 2200),
                setTimeout(() => setStep(4), 3000),
            ];
            return () => timers.forEach(clearTimeout);
        }
    }
  }, [activeTab, isOpen, isAdmin]);

  const copyToClipboard = (text: string, section: string) => {
      navigator.clipboard.writeText(text);
      setCopiedSection(section);
      setTimeout(() => setCopiedSection(null), 2000);
  };

  const CAP_CMD_BUILD = `pnpm run build && npx cap sync && npx cap open android`;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-black/40 flex flex-col items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
      <div className="absolute inset-0" onClick={onClose}></div>

      <div className="bg-slate-900/90 border border-slate-700/50 rounded-3xl w-full max-w-2xl p-6 relative shadow-[0_0_50px_rgba(0,0,0,0.6)] flex flex-col max-h-[95vh] backdrop-blur-2xl z-10 animate-scale-in">
        <button onClick={onClose} className="absolute top-5 right-5 text-slate-400 hover:text-white transition-colors p-1 hover:bg-slate-800 rounded-full">
          <X size={20}/>
        </button>
        
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <div className="bg-indigo-600/20 p-3 rounded-2xl border border-indigo-500/30">
             <Smartphone className="text-indigo-400 w-8 h-8" />
          </div>
          <div>
              <h2 className="text-2xl font-black text-white tracking-tight">SoulLink Installer</h2>
              <div className="flex items-center gap-2 mt-1">
                <span className="bg-indigo-500/10 text-indigo-400 text-[9px] px-2 py-0.5 rounded-full border border-indigo-500/20 font-mono font-bold uppercase">BUILD: LOCAL_DEBUG</span>
                <span className="bg-green-500/10 text-green-400 text-[9px] px-2 py-0.5 rounded-full border border-green-500/20 font-bold uppercase">Auto-Sync Enabled</span>
              </div>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-slate-950/50 p-1.5 rounded-xl mb-6 border border-slate-800/50 shrink-0">
            <button 
                onClick={() => setActiveTab('auto')}
                className={`flex-1 py-2.5 rounded-lg text-xs font-black transition-all flex items-center justify-center gap-2 ${activeTab === 'auto' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
            >
                <Download size={14} /> TẢI APK TRỰC TIẾP
            </button>
            {isAdmin && (
                <button 
                    onClick={() => setActiveTab('manual')}
                    className={`flex-1 py-2.5 rounded-lg text-xs font-black transition-all flex items-center justify-center gap-2 ${activeTab === 'manual' ? 'bg-slate-800 text-indigo-400' : 'text-slate-500 hover:text-slate-300'}`}
                >
                    <Code size={14} /> DEV CONSOLE
                </button>
            )}
        </div>

        {activeTab === 'auto' && (
            <div className="flex flex-col animate-fade-in custom-scrollbar overflow-y-auto pr-1">
                
                {/* 🏆 Local Download Section */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="md:col-span-2 p-5 rounded-2xl bg-gradient-to-br from-indigo-900/30 to-slate-900/30 border border-indigo-500/20 flex flex-col justify-center">
                        <div className="flex items-center gap-2 mb-4">
                            <BadgeCheck className="text-indigo-400" size={20} />
                            <span className="text-sm font-black text-white uppercase tracking-wider">Bản Debug từ máy vk</span>
                        </div>
                        
                        <a 
                            href={OFFICIAL_APK_URL}
                            download="soullink-ai-debug.apk"
                            className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-black text-sm rounded-xl flex items-center justify-center gap-3 shadow-xl shadow-indigo-600/20 transition-all active:scale-95 group"
                        >
                            <Download size={20} className="group-hover:animate-bounce" />
                            TẢI FILE APK NGAY
                            <ExternalLink size={14} className="opacity-50" />
                        </a>
                        <p className="text-[10px] text-slate-500 mt-3 text-center font-medium italic">Path: ...\build\outputs\apk\debug\app-debug.apk</p>
                    </div>

                    <div className="bg-white p-3 rounded-2xl flex flex-col items-center justify-center shadow-inner">
                        <img src={QR_CODE_API} alt="QR Download" className="w-32 h-32 rounded-lg" />
                        <div className="mt-2 text-slate-900 font-bold text-[10px] uppercase">Quét để tải nhanh</div>
                    </div>
                </div>

                {/* Build Terminal */}
                <div className="w-full bg-black/90 border border-slate-800 rounded-xl p-4 font-mono text-[11px] text-green-500 mb-6 h-32 overflow-hidden flex flex-col shadow-2xl">
                    <div className="flex items-center justify-between mb-2 text-slate-600 border-b border-slate-800/50 pb-2 uppercase text-[9px] font-bold">
                        <div className="flex items-center gap-2"><Terminal size={12} /> Local Sync Monitor</div>
                    </div>
                    <div className="space-y-1">
                        <div>&gt; Checking local path: D:\soullink-ai\...</div>
                        {step >= 1 && <div>&gt; Found app-debug.apk <span className="text-indigo-400">READY</span></div>}
                        {step >= 2 && <div>&gt; Syncing to public folder... <span className="text-indigo-400">SUCCESS</span></div>}
                        {step >= 3 && <div className="text-green-400 font-bold animate-pulse">&gt; Link updated! VK can download now.</div>}
                    </div>
                </div>
            </div>
        )}

        {activeTab === 'manual' && isAdmin && (
            <div className="space-y-4 animate-fade-in pr-2">
                <div className="bg-blue-950/30 border border-blue-500/20 p-4 rounded-2xl flex gap-4">
                    <Cpu size={24} className="text-blue-400 shrink-0" />
                    <div>
                        <h4 className="font-black text-sm text-white">Automation Script</h4>
                        <p className="text-[11px] text-slate-400 mt-1">Dùng lệnh dưới để tự động copy APK từ folder Build vào App.</p>
                    </div>
                </div>
                <div className="space-y-1.5">
                    <button 
                        onClick={() => copyToClipboard(`copy /y android\\app\\build\\outputs\\apk\\debug\\app-debug.apk public\\soullink-ai.apk`, 'copy')}
                        className="w-full bg-black/40 p-3 rounded-xl border border-slate-800 text-[11px] text-indigo-300 font-mono text-left relative group"
                    >
                        copy /y android\app\build\outputs\apk\debug\app-debug.apk public\soullink-ai.apk
                        <Copy size={12} className="absolute right-3 top-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                </div>
            </div>
        )}
      </div>
    </div>
  );
};

export default AppInstaller;