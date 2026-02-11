import React, { useRef } from 'react';
import { 
  Home, History, Headset, LifeBuoy, Settings, X, LogOut, 
  ChevronRight, Image as ImageIcon, RotateCcw, Scissors, 
  Shirt, Globe, Moon, Shield, Edit2, Wifi, WifiOff, Download, Sparkles 
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { Persona } from '../types';
import PersonaSelector from './PersonaSelector';

interface SideMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (page: string) => void;
  currentBg: string | null;
  onUploadBg: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onResetBg: () => void;
  currentPersona: Persona;
  onSelectPersona: (persona: Persona) => void;
  onOpenProfile: () => void;
  isOfflineMode: boolean;
  onToggleOffline: () => void;
}

const SideMenu: React.FC<SideMenuProps> = ({ 
  isOpen, onClose, onNavigate, currentBg, onUploadBg, onResetBg,
  currentPersona, onSelectPersona, onOpenProfile, isOfflineMode, onToggleOffline
}) => {
  const { t } = useLanguage();
  const { user, logout } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const menuItems = [
    { id: 'home', label: t('menu_home'), icon: <Home size={18} />, color: 'text-indigo-400', glow: 'shadow-indigo-500/20' },
    { id: 'community', label: t('menu_community'), icon: <Globe size={18} />, color: 'text-cyan-400', glow: 'shadow-cyan-500/20' },
    { id: 'shop', label: t('menu_shop'), icon: <Moon size={18} />, color: 'text-slate-300', glow: 'shadow-slate-500/20' }, 
    { id: 'faceswap', label: t('faceSwapBtn'), icon: <Sparkles size={18} />, color: 'text-pink-400', glow: 'shadow-pink-500/20' },
    { id: 'hairswap', label: t('hairSwapBtn'), icon: <Scissors size={18} />, color: 'text-amber-400', glow: 'shadow-amber-500/20' },
    { id: 'outfitswap', label: t('outfitSwapBtn'), icon: <Shirt size={18} />, color: 'text-green-400', glow: 'shadow-green-500/20' },
    { id: 'history', label: t('menu_history'), icon: <History size={18} />, color: 'text-blue-400', glow: 'shadow-blue-500/20' },
    { id: 'install', label: t('menu_install'), icon: <Download size={18} />, color: 'text-lime-400', glow: 'shadow-lime-500/20' },
  ];

  if (user?.role === 'admin') {
      menuItems.push({ id: 'admin', label: t('admin_panel'), icon: <Shield size={18} />, color: 'text-red-500', glow: 'shadow-red-500/20' });
  }

  return (
    <div className="fixed inset-0 z-[1000] flex justify-start overflow-hidden">
      {/* Backdrop: Ultra Blur */}
      <div 
        className="fixed inset-0 bg-slate-950/40 backdrop-blur-md animate-in fade-in duration-500"
        onClick={onClose}
      />

      {/* Sidebar Panel: Glassmorphism Design */}
      <div className="relative w-[85vw] max-w-[280px] h-full bg-slate-900/80 backdrop-blur-2xl border-r border-white/10 shadow-[20px_0_50px_rgba(0,0,0,0.5)] flex flex-col animate-in slide-in-from-left duration-500">
        
        {/* Top Glow Decor */}
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-indigo-500/10 to-transparent pointer-events-none" />

        {/* Header */}
        <div className="p-6 border-b border-white/5 flex items-center justify-between relative z-10">
           <div className="flex items-center gap-2">
             <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse shadow-[0_0_10px_#6366f1]" />
             <h2 className="text-xs font-black text-slate-400 tracking-[0.3em] uppercase">SoulLink Engine</h2>
           </div>
           <button 
             onClick={onClose}
             className="p-2 text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-xl transition-all active:scale-90"
           >
             <X size={20} />
           </button>
        </div>

        {/* User Profile: Infinity Style */}
        {user && (
            <div className="p-6 flex flex-col gap-4 relative z-10">
                <div className="flex items-center gap-4">
                    <div className="relative group">
                         {/* Animated Ring for Ultra Users */}
                        {user.role === 'ultra' && (
                          <div className="absolute -inset-1 bg-gradient-to-tr from-yellow-500 via-amber-200 to-yellow-600 rounded-full animate-spin-slow opacity-70 blur-[2px]" />
                        )}
                        
                        <div className={`relative w-14 h-14 rounded-full flex items-center justify-center text-white font-black text-xl shadow-2xl overflow-hidden bg-slate-800 z-20 border-2 ${user.role === 'admin' ? 'border-red-500' : 'border-slate-700'}`}>
                            {user.avatar ? <img src={user.avatar} className="w-full h-full object-cover" alt="avatar"/> : user.name.charAt(0).toUpperCase()}
                        </div>

                        {user.frame && (
                            <img src={user.frame} className="absolute inset-[-15%] w-[130%] h-[130%] object-contain pointer-events-none z-30 drop-shadow-[0_0_10px_rgba(0,0,0,0.5)]" alt="frame" />
                        )}
                    </div>

                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                            <p className="text-base font-black text-white truncate tracking-tight">{user.name}</p>
                            {user.role === 'ultra' && (
                              <div className="bg-gradient-to-r from-yellow-400 to-amber-600 p-[1px] rounded">
                                <span className="block text-[8px] bg-slate-900 text-yellow-400 px-1 rounded-sm font-black">ULTRA</span>
                              </div>
                            )}
                        </div>
                        <button onClick={() => { onOpenProfile(); onClose(); }} className="text-[10px] text-indigo-400 font-bold hover:text-indigo-300 transition-colors flex items-center gap-1 uppercase tracking-widest mt-0.5">
                          Manage Soul <Edit2 size={8} />
                        </button>
                    </div>
                </div>
                
                {/* Balance: Silver Shimmer Style */}
                <div className="relative group overflow-hidden bg-gradient-to-br from-slate-800 to-slate-950 rounded-2xl p-3 border border-white/5 shadow-inner">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:animate-shimmer" />
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Moon size={14} className="text-slate-200 drop-shadow-[0_0_8px_rgba(255,255,255,0.6)]" fill="currentColor" />
                        <span className="text-sm font-black text-white font-mono tracking-tighter">
                            {user.moonShards?.toLocaleString() || 0}
                        </span>
                      </div>
                      <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Available Shards</span>
                    </div>
                </div>
            </div>
        )}

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto py-2 px-4 space-y-6 custom-scrollbar relative z-10">
          
          {/* Persona Selection Group */}
          <div className="space-y-3">
            <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] px-2 flex items-center gap-2">
              <div className="w-1 h-3 bg-indigo-500 rounded-full" /> {t('lbl_ai_persona')}
            </h3>
            <div className="bg-white/5 rounded-3xl p-2 border border-white/5">
              <PersonaSelector currentPersona={currentPersona} onSelectPersona={onSelectPersona} />
            </div>
          </div>

          {/* Core Systems */}
          <div className="space-y-1">
             <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] px-2 mb-3">{t('Systems')}</h3>
             
             {/* Mode Toggle Card */}
             <div 
                onClick={onToggleOffline}
                className={`flex items-center justify-between p-4 rounded-2xl border transition-all duration-500 mb-4 ${isOfflineMode ? 'bg-slate-800/50 border-white/5' : 'bg-indigo-600/10 border-indigo-500/30 shadow-[0_0_20px_rgba(99,101,241,0.1)]'}`}
             >
                <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-xl transition-all duration-500 ${isOfflineMode ? 'bg-slate-700 text-slate-500' : 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/40'}`}>
                        {isOfflineMode ? <WifiOff size={18} /> : <Wifi size={18} />}
                    </div>
                    <div className="flex flex-col">
                         <span className={`text-xs font-black uppercase tracking-tighter ${isOfflineMode ? 'text-slate-500' : 'text-white'}`}>
                            {isOfflineMode ? t('mode_offline') : t('mode_online')}
                         </span>
                         <span className="text-[9px] text-slate-600 font-bold uppercase tracking-widest">
                            {isOfflineMode ? "Local Processing" : "Cloud Synchronized"}
                         </span>
                    </div>
                </div>
                <div className={`w-10 h-5 rounded-full relative transition-colors duration-500 ${isOfflineMode ? 'bg-slate-700' : 'bg-indigo-500'}`}>
                     <div className={`absolute top-1 w-3 h-3 rounded-full bg-white shadow-md transition-all duration-500 ${isOfflineMode ? 'left-1' : 'left-6'}`} />
                </div>
             </div>

             {/* Menu List */}
             <div className="grid gap-1">
                {menuItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => { onNavigate(item.id); onClose(); }}
                    disabled={item.id === 'community' && isOfflineMode}
                    className={`w-full flex items-center justify-between p-3.5 rounded-2xl group transition-all duration-300 border border-transparent ${
                       item.id === 'community' && isOfflineMode 
                        ? 'opacity-30 grayscale cursor-not-allowed' 
                        : 'hover:bg-white/5 hover:border-white/10 active:scale-95'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`p-2 rounded-xl bg-slate-800/50 group-hover:scale-110 transition-transform shadow-lg ${item.glow} ${item.color}`}>
                        {item.icon}
                      </div>
                      <span className="font-bold text-slate-300 group-hover:text-white transition-colors text-sm tracking-tight">
                        {item.label}
                      </span>
                    </div>
                    <ChevronRight size={14} className="text-slate-700 group-hover:text-indigo-400 transition-all transform group-hover:translate-x-1" />
                  </button>
                ))}
             </div>
          </div>

          {/* Customization Section */}
          <div className="space-y-3 pt-2 pb-6">
             <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] px-2">{t('lbl_theme')}</h3>
             <div className="flex gap-2">
                 <input type="file" ref={fileInputRef} onChange={onUploadBg} accept="image/*" className="hidden" />
                 <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="flex-1 flex flex-col items-center justify-center gap-2 p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-indigo-500/50 hover:bg-indigo-500/5 transition-all group"
                 >
                    <ImageIcon size={20} className="text-indigo-400 group-hover:scale-110 transition-transform" />
                    <span className="text-[10px] font-black text-slate-400 group-hover:text-white uppercase tracking-widest">{t('btn_bg_upload')}</span>
                 </button>

                 {currentBg && (
                   <button 
                      onClick={onResetBg}
                      className="p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-red-500/50 hover:bg-red-500/5 transition-all group"
                   >
                      <RotateCcw size={20} className="text-red-400 group-hover:rotate-[-180deg] transition-transform duration-500" />
                   </button>
                 )}
             </div>
          </div>
        </div>

        {/* Footer: Ultra Branding */}
        <div className="p-6 border-t border-white/5 bg-slate-950/80 backdrop-blur-md relative z-20">
            <button 
              onClick={() => { logout(); onClose(); }}
              className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 hover:bg-red-500 hover:text-white transition-all font-black text-xs uppercase tracking-[0.2em] shadow-lg shadow-red-500/5"
            >
               <LogOut size={16} />
               <span>{t('logOut')}</span>
            </button>
            <div className="flex justify-between items-center mt-4">
              <span className="text-[9px] font-black text-slate-700 uppercase tracking-[0.3em]">Build 2026.02</span>
              <span className="text-[9px] font-black text-indigo-500/50 uppercase tracking-[0.3em]">Infinite Edition</span>
            </div>
        </div>
      </div>
    </div>
  );
};

export default SideMenu;