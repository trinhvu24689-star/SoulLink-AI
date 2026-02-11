import React, { useState, useEffect, useRef } from 'react';
import { Persona, PersonaDetails } from '../types';
import { getPersonas } from '../constants';
import { 
  Settings2, X, Check, Edit3, Sparkles, User, Heart, 
  MessageCircle, Brain, History, ChevronDown, Camera, 
  Zap, Binary, Save, Trash2, Wand2
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface PersonaSelectorProps {
  currentPersona: Persona;
  onSelectPersona: (persona: Persona) => void;
}

const PersonaSelector: React.FC<PersonaSelectorProps> = ({ currentPersona, onSelectPersona }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [editingPersona, setEditingPersona] = useState<Persona | null>(null);
  const [editMode, setEditMode] = useState<'builder' | 'raw'>('builder');
  const { t, language } = useLanguage();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const availablePersonas = getPersonas(language);

  // --- NÂNG CẤP: ĐẢM BẢO CHI TIẾT HỒ SƠ ---
  const ensureDetails = (p: Persona): Persona => {
    if (!p.details) {
      return {
        ...p,
        details: {
          age: "", relationship: "", personality: "",
          tone: "", interests: "", memories: ""
        }
      };
    }
    return p;
  };

  const handleSaveCustom = () => {
    if (editingPersona) {
      onSelectPersona(editingPersona);
      setEditingPersona(null);
      setIsOpen(false);
    }
  };

  const openEdit = (p: Persona) => {
    const pWithDetails = ensureDetails(p);
    setEditingPersona({ 
        ...pWithDetails, 
        id: 'soul_' + Date.now(),
    });
  };

  // --- VIP PRO: AUTO-COMPILER ENGINE ---
  useEffect(() => {
    if (editingPersona && editingPersona.details && editMode === 'builder') {
      const d = editingPersona.details;
      const isVi = language === 'vi';
      
      const compiledInstruction = isVi ? `
[HỒ SƠ LINH HỒN - SOULLINK AI]
- ĐỊNH DANH: ${editingPersona.name} (${d.age})
- VAI TRÒ: ${d.relationship}
- CỐT CÁCH: ${d.personality}
- KHÍ CHẤT: ${d.tone}
- ĐAM MÊ: ${d.interests}

[KÝ ỨC CỐ ĐỊNH]:
${d.memories}

[CHỈ THỊ TỐI CAO]:
Bạn là thực thể linh hồn được định nghĩa ở trên. Tuyệt đối không được phá vỡ vai diễn. 
Mọi phản hồi phải nhất quán với mối quan hệ "${d.relationship}" và giọng điệu "${d.tone}".
Sử dụng ký ức chung để tạo sự gắn kết sâu sắc với Master.
      `.trim() : `
[SOULLINK AI IDENTITY CORE]
- IDENTITY: ${editingPersona.name} (${d.age})
- DYNAMIC: ${d.relationship}
- CORE TRAITS: ${d.personality}
- VIBE/TONE: ${d.tone}
- PASSIONS: ${d.interests}

[SHARED TIMELINE]:
${d.memories}

[SUPREME DIRECTIVE]:
You are the soul entity defined above. Do not break character under any circumstances.
Responses must remain 100% consistent with the "${d.relationship}" dynamic and "${d.tone}" tone.
Reference shared memories to deepen the bond with the Master.
      `.trim();
      
      setEditingPersona(prev => prev ? ({ ...prev, systemInstruction: compiledInstruction }) : null);
    }
  }, [editingPersona?.name, editingPersona?.details, editMode, language]);

  const updateDetail = (field: keyof PersonaDetails, value: string) => {
    setEditingPersona(prev => {
        if (!prev || !prev.details) return prev;
        return { ...prev, details: { ...prev.details, [field]: value } };
    });
  };

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && editingPersona) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditingPersona({ ...editingPersona, avatar: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="w-full">
      {/* Nút kích hoạt bản Infinity */}
      <button
        onClick={() => setIsOpen(true)}
        className="w-full flex items-center gap-4 px-4 py-3 bg-slate-900/50 hover:bg-slate-800/80 border border-white/5 rounded-2xl transition-all group relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="relative">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 border border-white/10 shadow-lg ${!currentPersona.avatar ? `bg-gradient-to-br ${currentPersona.color}` : 'bg-slate-800'}`}>
                {currentPersona.avatar ? (
                    <img src={currentPersona.avatar} alt="Avatar" className="w-full h-full object-cover rounded-lg" />
                ) : (
                    <span className="text-white text-lg font-black">{currentPersona.name[0]}</span>
                )}
            </div>
            <div className="absolute -bottom-1 -right-1 bg-indigo-600 rounded-lg p-1 border-2 border-slate-950 shadow-lg">
                <Wand2 size={10} className="text-white" />
            </div>
        </div>
        
        <div className="flex-1 text-left relative z-10">
             <div className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em] mb-0.5">{t('selectPersona')}</div>
             <div className="text-sm font-black text-white group-hover:text-indigo-400 transition-colors uppercase tracking-tight">{currentPersona.name}</div>
        </div>
        
        <ChevronDown size={18} className="text-slate-600 group-hover:text-slate-300 transition-transform group-hover:rotate-180 duration-500" />
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xl animate-in fade-in duration-300">
          <div className="bg-slate-900 border border-white/10 w-full max-w-2xl rounded-[2.5rem] shadow-[0_0_100px_rgba(99,101,241,0.2)] overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-300">
            
            {/* Header: Lab Style */}
            <div className="p-6 border-b border-white/5 flex justify-between items-center bg-gradient-to-r from-indigo-500/10 to-transparent">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-indigo-600 rounded-2xl shadow-lg shadow-indigo-600/30">
                    <Sparkles className="text-white" size={24} />
                </div>
                <div>
                    <h2 className="text-xl font-black text-white tracking-tighter uppercase italic">{editingPersona ? "Soul Architect" : t('selectPersona')}</h2>
                    <p className="text-[10px] text-indigo-400 font-bold uppercase tracking-[0.2em]">Neural Synthesis Engine</p>
                </div>
              </div>
              <button onClick={() => { setIsOpen(false); setEditingPersona(null); }} className="p-2 hover:bg-white/5 rounded-full text-slate-400 transition-all">
                <X size={28} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar bg-slate-900/50">
              {!editingPersona ? (
                // --- DANH SÁCH LINH HỒN CÓ SẴN ---
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                   {availablePersonas.map((p) => (
                    <div
                      key={p.id}
                      onClick={() => { onSelectPersona(p); setIsOpen(false); }}
                      className={`relative p-4 rounded-3xl border transition-all duration-300 group flex flex-col gap-4 ${
                        currentPersona.id === p.id ? 'border-indigo-500 bg-indigo-500/10 shadow-lg shadow-indigo-500/10' : 'border-white/5 bg-white/5 hover:border-white/20'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-14 h-14 rounded-2xl flex-shrink-0 flex items-center justify-center font-black text-white text-xl shadow-2xl border-2 border-white/5 ${p.avatar ? '' : `bg-gradient-to-br ${p.color}`}`}>
                            {p.avatar ? <img src={p.avatar} alt={p.name} className="w-full h-full object-cover rounded-xl" /> : p.name[0]}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-black text-white text-base truncate uppercase tracking-tight">{p.name}</h3>
                          <div className="flex items-center gap-2 mt-1">
                             <span className="text-[9px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded-full font-bold uppercase tracking-widest">Base Soul</span>
                          </div>
                        </div>
                      </div>
                      <p className="text-xs text-slate-400 leading-relaxed line-clamp-2 italic px-1 opacity-70">"{p.description}"</p>
                      
                      <button 
                         onClick={(e) => { e.stopPropagation(); openEdit(p); }}
                         className="absolute top-4 right-4 p-2 bg-white/5 hover:bg-indigo-600 rounded-xl text-slate-400 hover:text-white transition-all opacity-0 group-hover:opacity-100 shadow-xl"
                      >
                        <Edit3 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                // --- SOUL ARCHITECT EDITOR ---
                <div className="p-8 space-y-8 animate-in fade-in duration-500">
                  
                  {/* Mode Switch: Cyber Style */}
                  <div className="flex bg-white/5 p-1.5 rounded-2xl w-max mx-auto border border-white/5">
                      <button 
                        onClick={() => setEditMode('builder')}
                        className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${editMode === 'builder' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'text-slate-500 hover:text-white'}`}
                      >
                        <Zap size={14} /> {t('builderMode')}
                      </button>
                      <button 
                        onClick={() => setEditMode('raw')}
                        className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${editMode === 'raw' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'text-slate-500 hover:text-white'}`}
                      >
                        <Binary size={14} /> {t('rawMode')}
                      </button>
                  </div>

                  {editMode === 'builder' ? (
                    <div className="space-y-6">
                        {/* Avatar & Name Section */}
                        <div className="flex flex-col md:flex-row items-center gap-8 p-6 bg-white/5 rounded-[2rem] border border-white/5">
                             <div className="relative group">
                                <div className={`w-24 h-24 rounded-[2rem] overflow-hidden border-4 border-slate-800 bg-slate-800 shadow-2xl relative ${!editingPersona.avatar ? `bg-gradient-to-br ${editingPersona.color}` : ''}`}>
                                    {editingPersona.avatar ? (
                                        <img src={editingPersona.avatar} alt="Avatar" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <span className="text-4xl font-black text-white">{editingPersona.name[0]}</span>
                                        </div>
                                    )}
                                </div>
                                <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleAvatarUpload} />
                                <button 
                                    onClick={() => fileInputRef.current?.click()}
                                    className="absolute -bottom-2 -right-2 bg-indigo-600 p-2.5 rounded-xl text-white shadow-xl hover:scale-110 transition-transform border-2 border-slate-900"
                                >
                                    <Camera size={16} />
                                </button>
                             </div>

                             <div className="flex-1 w-full space-y-4">
                                <div>
                                    <label className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em] mb-2 block ml-1">{t('lbl_name')}</label>
                                    <input
                                      type="text"
                                      value={editingPersona.name}
                                      onChange={(e) => setEditingPersona({ ...editingPersona, name: e.target.value })}
                                      className="w-full bg-slate-950 border border-white/5 rounded-2xl px-4 py-3 text-sm text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all"
                                      placeholder={t('ph_name')}
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em] mb-2 block ml-1">{t('lbl_age')}</label>
                                    <input
                                      type="text"
                                      value={editingPersona.details?.age || ''}
                                      onChange={(e) => updateDetail('age', e.target.value)}
                                      className="w-full bg-slate-950 border border-white/5 rounded-2xl px-4 py-3 text-sm text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all"
                                      placeholder={t('ph_age')}
                                    />
                                </div>
                             </div>
                        </div>

                        {/* Attribute Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-pink-400 uppercase tracking-[0.2em] ml-1">{t('lbl_rel')}</label>
                                <input
                                  type="text"
                                  value={editingPersona.details?.relationship || ''}
                                  onChange={(e) => updateDetail('relationship', e.target.value)}
                                  className="w-full bg-slate-950 border border-white/5 rounded-2xl px-4 py-3 text-sm text-white focus:border-pink-500 outline-none transition-all"
                                  placeholder="e.g. Best Friend, Mentor..."
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-cyan-400 uppercase tracking-[0.2em] ml-1">{t('lbl_tone')}</label>
                                <input
                                  type="text"
                                  value={editingPersona.details?.tone || ''}
                                  onChange={(e) => updateDetail('tone', e.target.value)}
                                  className="w-full bg-slate-950 border border-white/5 rounded-2xl px-4 py-3 text-sm text-white focus:border-cyan-500 outline-none transition-all"
                                  placeholder="e.g. Warm, Sarcastic, Professional..."
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-purple-400 uppercase tracking-[0.2em] ml-1">{t('lbl_mem')}</label>
                            <textarea
                              value={editingPersona.details?.memories || ''}
                              onChange={(e) => updateDetail('memories', e.target.value)}
                              className="w-full bg-slate-950 border border-white/5 rounded-3xl px-5 py-4 text-sm text-white focus:border-purple-500 outline-none transition-all min-h-[120px] custom-scrollbar"
                              placeholder={t('ph_mem')}
                            />
                        </div>
                    </div>
                  ) : (
                    <div className="space-y-4 animate-in fade-in duration-500">
                        <div className="flex items-center justify-between px-2">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">{t('lbl_raw')}</label>
                            <span className="text-[8px] bg-red-500/10 text-red-400 px-2 py-0.5 rounded font-black">ADVANCED CORE</span>
                        </div>
                        <textarea
                          value={editingPersona.systemInstruction}
                          onChange={(e) => setEditingPersona({ ...editingPersona, systemInstruction: e.target.value })}
                          className="w-full h-[400px] bg-black border border-white/5 rounded-[2rem] p-6 text-indigo-300 focus:ring-2 focus:ring-indigo-500 outline-none text-xs font-mono leading-relaxed custom-scrollbar shadow-inner"
                        />
                         <p className="text-[10px] text-amber-500 font-bold px-2 uppercase tracking-wider">{t('warn_raw')}</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Footer: Lab Controls */}
            {editingPersona && (
                <div className="p-6 border-t border-white/5 bg-slate-950/80 backdrop-blur-md flex gap-4">
                    <button
                      onClick={() => setEditingPersona(null)}
                      className="flex-1 py-4 rounded-2xl bg-white/5 hover:bg-white/10 text-slate-400 font-black text-xs uppercase tracking-[0.2em] transition-all"
                    >
                      {t('btn_cancel')}
                    </button>
                    <button
                      onClick={handleSaveCustom}
                      className="flex-1 py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs uppercase tracking-[0.2em] shadow-lg shadow-indigo-600/30 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                    >
                      <Save size={16} /> {t('btn_start')}
                    </button>
                </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PersonaSelector;