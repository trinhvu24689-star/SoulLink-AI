import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { X, User, Image as ImageIcon, Check, Upload, Sparkles, Camera } from 'lucide-react';
import { PRESET_AVATARS, PRESET_FRAMES } from '../constants';

interface ProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose }) => {
    const { user, updateUser } = useAuth();
    const { t } = useLanguage();
    const [activeTab, setActiveTab] = useState<'avatar' | 'frame'>('avatar');
    
    const [previewAvatar, setPreviewAvatar] = useState(user?.avatar || '');
    const [previewFrame, setPreviewFrame] = useState(user?.frame || '');
    const [isSaving, setIsSaving] = useState(false);

    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isOpen && user) {
            setPreviewAvatar(user.avatar || '');
            setPreviewFrame(user.frame || '');
        }
    }, [isOpen, user]);

    if (!isOpen || !user) return null;

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const result = reader.result as string;
                if (activeTab === 'avatar') setPreviewAvatar(result);
                else setPreviewFrame(result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            // Cập nhật lên Neon DB thông qua context/backend
            await updateUser({
                ...user,
                avatar: previewAvatar,
                frame: previewFrame
            });
            onClose();
        } catch (error) {
            console.error("Lỗi cập nhật Master:", error);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xl animate-in fade-in duration-300">
            <div className="bg-slate-900/90 border border-white/10 w-full max-w-lg rounded-[2.5rem] shadow-[0_0_100px_rgba(99,101,241,0.2)] flex flex-col max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-300">
                
                {/* Header: Neon Style */}
                <div className="p-6 border-b border-white/5 flex justify-between items-center bg-gradient-to-r from-indigo-500/10 to-transparent">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-indigo-600 rounded-2xl shadow-lg shadow-indigo-600/30">
                            <User className="text-white" size={20} />
                        </div>
                        <div>
                            <h2 className="text-xl font-black text-white tracking-tight uppercase italic">{t('profile_title') || "Identity Core"}</h2>
                            <p className="text-[10px] text-indigo-400 font-bold uppercase tracking-[0.2em]">SoulLink Registry</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full text-slate-400 transition-all active:scale-90">
                        <X size={24} />
                    </button>
                </div>

                <div className="p-8 flex flex-col gap-8 overflow-y-auto custom-scrollbar">
                    
                    {/* Live Preview: Animated Section */}
                    <div className="flex flex-col items-center justify-center group">
                        <div className="relative w-40 h-40 mb-4">
                            {/* Glow Effect */}
                            <div className="absolute inset-0 rounded-full bg-indigo-500/20 blur-2xl animate-pulse" />
                            
                            {/* Avatar Main */}
                            <div className="relative w-full h-full rounded-full overflow-hidden border-4 border-slate-800 bg-slate-800 z-10 shadow-2xl">
                                {previewAvatar ? (
                                    <img src={previewAvatar} className="w-full h-full object-cover" alt="Avatar" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-5xl font-black text-slate-600">
                                        {user.name[0].toUpperCase()}
                                    </div>
                                )}
                                <div onClick={() => {setActiveTab('avatar'); fileInputRef.current?.click();}} className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                                    <Camera className="text-white" />
                                </div>
                            </div>
                            
                            {/* Dynamic Frame Overlay */}
                            {previewFrame && (
                                <img 
                                    src={previewFrame} 
                                    className="absolute inset-[-15%] w-[130%] h-[130%] object-contain pointer-events-none z-20 drop-shadow-[0_0_15px_rgba(99,101,241,0.5)] animate-spin-slow" 
                                    alt="Frame" 
                                />
                            )}
                        </div>
                        <div className="text-center">
                            <h3 className="text-2xl font-black text-white tracking-tight">{user.name}</h3>
                            <div className="inline-flex items-center gap-2 px-3 py-1 mt-1 rounded-full bg-white/5 border border-white/10">
                                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Master Identity</p>
                            </div>
                        </div>
                    </div>

                    {/* Tabs: Infinity Style */}
                    <div className="flex bg-white/5 p-1.5 rounded-[1.25rem] border border-white/5">
                        <button 
                            onClick={() => setActiveTab('avatar')}
                            className={`flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'avatar' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30' : 'text-slate-500 hover:text-slate-300'}`}
                        >
                            {t('tab_avatar') || "Neural Avatar"}
                        </button>
                        <button 
                            onClick={() => setActiveTab('frame')}
                            className={`flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'frame' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30' : 'text-slate-500 hover:text-slate-300'}`}
                        >
                            {t('tab_frame') || "Infinity Frame"}
                        </button>
                    </div>

                    {/* Content Area */}
                    <div className="space-y-6">
                        <button 
                            onClick={() => fileInputRef.current?.click()}
                            className="w-full border-2 border-dashed border-white/10 hover:border-indigo-500/50 hover:bg-indigo-500/5 rounded-[1.5rem] p-6 flex flex-col items-center justify-center gap-2 transition-all group"
                        >
                            <div className="p-3 bg-slate-800 rounded-2xl group-hover:scale-110 transition-transform">
                                <Upload size={20} className="text-indigo-400" />
                            </div>
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{t('upload_device')}</span>
                            <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept="image/*" className="hidden" />
                        </button>

                        <div>
                            <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-4 flex items-center gap-2 ml-2">
                                <Sparkles size={12} className="text-indigo-500" /> {t('ai_presets')}
                            </h3>
                            <div className="grid grid-cols-4 gap-4">
                                {(activeTab === 'avatar' ? PRESET_AVATARS : PRESET_FRAMES).map((item, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => activeTab === 'avatar' ? setPreviewAvatar(item) : setPreviewFrame(item)}
                                        className={`aspect-square rounded-2xl overflow-hidden border-2 transition-all relative group/item ${
                                            (activeTab === 'avatar' ? previewAvatar === item : previewFrame === item) 
                                                ? 'border-indigo-500 shadow-[0_0_15px_rgba(99,101,241,0.4)]' 
                                                : 'border-white/5 hover:border-white/20'
                                        }`}
                                    >
                                        {item ? (
                                            <img src={item} className="w-full h-full object-cover transition-transform group-hover/item:scale-110" alt="preset" />
                                        ) : (
                                            <div className="w-full h-full bg-slate-800 flex items-center justify-center">
                                                <X size={16} className="text-slate-600" />
                                            </div>
                                        )}
                                        {(activeTab === 'avatar' ? previewAvatar === item : previewFrame === item) && (
                                            <div className="absolute inset-0 bg-indigo-600/40 flex items-center justify-center backdrop-blur-[2px]">
                                                <Check className="text-white" size={24} strokeWidth={3} />
                                            </div>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer: Action Section */}
                <div className="p-6 border-t border-white/5 bg-slate-950/50">
                    <button 
                        onClick={handleSave}
                        disabled={isSaving}
                        className="w-full py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs uppercase tracking-[0.3em] shadow-lg shadow-indigo-600/20 transition-all active:scale-[0.98] flex items-center justify-center gap-3 disabled:opacity-50"
                    >
                        {isSaving && <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
                        {t('save_profile') || "Synchronize Identity"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProfileModal;