import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Message, Persona, LoadingState, Language, ChatSession, Attachment } from './types';
import { getPersonas } from './constants';
import { sendMessageToGemini, generateImageFromPrompt, performFaceSwap, performHairSwap, performOutfitSwap } from './services/geminiService';
import { saveSession, getSessions } from './services/storageService';
import ChatBubble from './components/ChatBubble';
import InputArea from './components/InputArea';
import TypingIndicator from './components/TypingIndicator';
import ImageGeneratorModal from './components/ImageGeneratorModal';
import FaceSwapModal from './components/FaceSwapModal';
import HairSwapModal from './components/HairSwapModal';
import OutfitSwapModal from './components/OutfitSwapModal';
import SideMenu from './components/SideMenu';
import HistoryModal from './components/HistoryModal';
import AuthModal from './components/AuthModal';
import IntroAnimation from './components/IntroAnimation';
import GlobalChat from './components/GlobalChat';
import AdminPanel from './components/AdminPanel';
import ShopModal from './components/ShopModal';
import ProfileModal from './components/ProfileModal';
import LiveCallModal from './components/LiveCallModal';
import AppInstaller from './components/AppInstaller';
import { Sparkles, Plus, Languages, ChevronDown, Lock, Phone, WifiOff } from 'lucide-react'; 
import { LanguageProvider, useLanguage } from './contexts/LanguageContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';

// --- 👇 CHÈN ĐOẠN NÀY ĐỂ FIX LỖI KẾT NỐI TRÊN ĐIỆN THOẠI 👇 ---
import axios from 'axios';

// Đây là IP máy tính của ck đã tìm thấy lúc nãy
const SERVER_IP = "http://192.168.1.7:3000"; 

// Ép Axios dùng IP này cho tất cả các dịch vụ (Shop, Auth, Global Chat...)
axios.defaults.baseURL = SERVER_IP;

console.log("🚀 SoulLink AI: Đã chuyển hướng kết nối về máy tính:", SERVER_IP);
// -----------------------------------------------------------
// --- FIX LỖI TS2307: Thêm ConnectionStatus để fix luôn lỗi TS7006 ---
import { Network, ConnectionStatus } from '@capacitor/network'; 

// Helper to get video duration from base64
const getVideoDuration = (base64Data: string, mimeType: string): Promise<number> => {
    return new Promise((resolve) => {
        const video = document.createElement('video');
        video.preload = 'metadata';
        video.onloadedmetadata = () => {
            window.URL.revokeObjectURL(video.src);
            resolve(video.duration);
        };
        video.onerror = () => resolve(0);
        const byteCharacters = atob(base64Data);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: mimeType });
        video.src = URL.createObjectURL(blob);
    });
};

const SoulLinkApp: React.FC = () => {
  // Use Context
  const { language, setLanguage, t } = useLanguage();
  const { user, canGuestChat, recordGuestMessage, spendMoonShards } = useAuth();
  const personas = getPersonas(language);

  // App State
  const [showIntro, setShowIntro] = useState(true);
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentPersona, setCurrentPersona] = useState<Persona>(personas[0]);
  const [loadingState, setLoadingState] = useState<LoadingState>(LoadingState.IDLE);
  const [isOfflineMode, setIsOfflineMode] = useState(false);
  
  // Modals
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [isFaceSwapModalOpen, setIsFaceSwapModalOpen] = useState(false);
  const [isHairSwapModalOpen, setIsHairSwapModalOpen] = useState(false);
  const [isOutfitSwapModalOpen, setIsOutfitSwapModalOpen] = useState(false);
  const [isGlobalChatOpen, setIsGlobalChatOpen] = useState(false);
  const [isAdminPanelOpen, setIsAdminPanelOpen] = useState(false);
  const [isShopOpen, setIsShopOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isLiveCallOpen, setIsLiveCallOpen] = useState(false);
  const [isInstallerOpen, setIsInstallerOpen] = useState(false);
  
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [sessionId, setSessionId] = useState<string>(Date.now().toString());
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null);
  const [guestLimitInfo, setGuestLimitInfo] = useState<{ allowed: boolean; waitTime: number }>({ allowed: true, waitTime: 0 });
  
  // Refs
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Stable handler for intro completion
  const handleIntroComplete = useCallback(() => {
    setShowIntro(false);
  }, []);

  // --- 2. TỰ ĐỘNG BẮT TRẠNG THÁI MẠNG ---
  useEffect(() => {
      // Hàm kiểm tra ngay khi mở app
      const checkStatus = async () => {
          const status = await Network.getStatus();
          setIsOfflineMode(!status.connected);
      };
      checkStatus();

      // --- FIX LỖI remove() ở đây: Lưu vào một Promise ---
      const handlerPromise = Network.addListener('networkStatusChange', (status: ConnectionStatus) => {
          console.log('Network status changed', status);
          setIsOfflineMode(!status.connected);
      });

      return () => {
          // --- FIX LỖI TS2339: Chờ Promise hoàn thành rồi mới gọi remove() ---
          handlerPromise.then(h => h.remove());
      };
  }, []);

  const handleToggleOffline = () => {
      const newState = !isOfflineMode;
      setIsOfflineMode(newState);
  };

  // Check Guest Limits periodically
  useEffect(() => {
    const check = () => setGuestLimitInfo(canGuestChat());
    check();
    const interval = setInterval(check, 1000);
    return () => clearInterval(interval);
  }, [user, messages]);

  // Load background from storage
  useEffect(() => {
    const savedBg = localStorage.getItem('soullink_bg');
    if (savedBg) {
      setBackgroundImage(savedBg);
    }
  }, []);

  // Mock support persona getter
  const getSupportPersona = (lang: Language): Persona => {
      return { id: 'support', name: 'Support', description: '', systemInstruction: 'You are support', avatar: '', color: '' };
  };

  // Sync Persona Language
  useEffect(() => {
    const updatedPersonas = getPersonas(language);
    const match = updatedPersonas.find(p => p.id === currentPersona.id);
    if (match) setCurrentPersona(match);
    
    setMessages(prev => {
        if (prev.length === 1 && prev[0].id === 'init') {
            return [{ ...prev[0], text: t('initMessage') }];
        }
        return prev;
    });
  }, [language]);

  // Init Message
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([{ id: 'init', role: 'model', text: t('initMessage'), timestamp: Date.now() }]);
    }
  }, []);

  // Save Session
  useEffect(() => {
    if (messages.length <= 1) return;
    
    const autoSave = async () => {
        const firstUserMsg = messages.find(m => m.role === 'user');
        const title = firstUserMsg && firstUserMsg.text ? (firstUserMsg.text.slice(0, 30) + '...') : t('untitled_chat');
        const lastMsg = messages[messages.length - 1];
        const preview = lastMsg && lastMsg.text ? lastMsg.text.slice(0, 50) : "";
        
        await saveSession({ 
            id: sessionId, 
            title, 
            personaId: currentPersona.id, 
            messages, 
            lastModified: Date.now(), 
            preview 
        });
    };
    autoSave();
  }, [messages, sessionId, currentPersona, t]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  useEffect(() => scrollToBottom(), [messages, loadingState]);

  // --- HANDLERS ---

  const handleSendMessage = async (text: string, attachment?: Attachment) => {
    if (isOfflineMode) {
        setMessages(prev => [...prev, { 
            id: Date.now().toString(), 
            role: 'model', 
            text: "📡 Bạn đang ngoại tuyến. Vui lòng kết nối mạng để tiếp tục trò chuyện.", 
            timestamp: Date.now() 
        }]);
        return;
    }

    const limit = canGuestChat();
    if (!limit.allowed) {
        alert(t('guest_limit_reached'));
        return;
    }

    recordGuestMessage();

    const newUserMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      text,
      attachment,
      timestamp: Date.now()
    };

    const newHistory = [...messages, newUserMsg];
    setMessages(newHistory);
    setLoadingState(LoadingState.THINKING);

    try {
      const responseText = await sendMessageToGemini(newHistory, '', currentPersona.systemInstruction, attachment);
      const botMsg: Message = { id: (Date.now() + 1).toString(), role: 'model', text: responseText, timestamp: Date.now() };
      setMessages(prev => [...prev, botMsg]);
    } catch (error) {
      setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), role: 'model', text: t('errorConnection'), timestamp: Date.now() }]);
    } finally {
      setLoadingState(LoadingState.IDLE);
    }
  };

  const handleGenerateImage = async (prompt: string) => {
      if (isOfflineMode) { alert("Cần có mạng để tạo ảnh!"); return; }
      if (!spendMoonShards(5)) {
          alert(t('insufficient_balance') + " (Cost: 5)");
          return;
      }
      
      const newUserMsg: Message = { id: Date.now().toString(), role: 'user', text: t('generatingPrompt', { prompt }), timestamp: Date.now() };
      setMessages(prev => [...prev, newUserMsg]);
      setLoadingState(LoadingState.GENERATING_IMAGE);
      try {
          const base64Image = await generateImageFromPrompt(prompt);
          const botMsg: Message = {
              id: (Date.now() + 1).toString(), role: 'model', text: t('imageResult', { prompt }),
              attachment: { mimeType: 'image/png', data: base64Image.split(',')[1] }, timestamp: Date.now()
          };
          setMessages(prev => [...prev, botMsg]);
      } catch (error) {
          setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), role: 'model', text: t('errorImage'), timestamp: Date.now() }]);
      } finally {
          setLoadingState(LoadingState.IDLE);
      }
  };

  const handleSwapAction = async (
      type: 'face' | 'hair' | 'outfit', 
      source: Attachment, 
      target: Attachment, 
      fn: (s: Attachment, t: Attachment) => Promise<Attachment>
  ) => {
      if (isOfflineMode) { alert("Cần có mạng để thực hiện tính năng này!"); return; }

      let cost = 10; 
      let duration = 0;

      if (target.mimeType.startsWith('video/')) {
          try {
              duration = await getVideoDuration(target.data, target.mimeType);
              cost = Math.ceil(duration); 
              if (cost < 1) cost = 1;
          } catch (e) {
              console.error("Could not determine video duration", e);
              cost = 20; 
          }
      }

      if (!spendMoonShards(cost)) {
          alert(`${t('insufficient_balance')} (Cost: ${cost} Shards${duration > 0 ? ` for ${Math.round(duration)}s video` : ''})`);
          return;
      }

      const msgMap = { face: t('fsProcessing'), hair: t('hsProcessing'), outfit: t('osProcessing') };
      const resMap = { face: t('fsResult'), hair: t('hsResult'), outfit: t('osResult') };
      const stateMap = { face: LoadingState.SWAPPING_FACE, hair: LoadingState.SWAPPING_HAIR, outfit: LoadingState.SWAPPING_OUTFIT };

      const newUserMsg: Message = { id: Date.now().toString(), role: 'user', text: `${msgMap[type]} (Cost: ${cost} Shards)`, attachment: target, timestamp: Date.now() };
      setMessages(prev => [...prev, newUserMsg]);
      setLoadingState(stateMap[type]);
      
      try {
          const result = await fn(source, target);
          const botMsg: Message = { id: (Date.now() + 1).toString(), role: 'model', text: resMap[type], attachment: result, timestamp: Date.now() };
          setMessages(prev => [...prev, botMsg]);
      } catch (error) {
          setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), role: 'model', text: t('errorImage'), timestamp: Date.now() }]);
      } finally {
          setLoadingState(LoadingState.IDLE);
      }
  };

  const handleNewChat = () => {
    if (window.confirm(t('confirmClear'))) {
        setSessionId(Date.now().toString());
        setMessages([{ id: Date.now().toString(), role: 'model', text: t('historyCleared'), timestamp: Date.now() }]);
    }
  };

  const handleLoadSession = (session: ChatSession) => {
      setSessionId(session.id);
      setMessages(session.messages);
      const savedPersona = personas.find(p => p.id === session.personaId);
      if (savedPersona) setCurrentPersona(savedPersona);
  };

  const checkUltraAccess = () => {
      if (user?.role !== 'ultra' && user?.role !== 'admin') {
          alert(t('ultra_only'));
          return false;
      }
      return true;
  };

  const handleMenuNavigate = (page: string) => {
    switch (page) {
        case 'home': break;
        case 'community': 
            if (isOfflineMode) {
                alert(t('offline_restriction'));
            } else {
                setIsGlobalChatOpen(true); 
            }
            break;
        case 'shop': setIsShopOpen(true); break;
        case 'admin': setIsAdminPanelOpen(true); break;
        case 'faceswap': if(checkUltraAccess()) setIsFaceSwapModalOpen(true); break;
        case 'hairswap': if(checkUltraAccess()) setIsHairSwapModalOpen(true); break;
        case 'outfitswap': if(checkUltraAccess()) setIsOutfitSwapModalOpen(true); break;
        case 'cskh': setCurrentPersona(getSupportPersona(language)); break;
        case 'contact': window.location.href = "mailto:admin@soullink.ai"; break;
        case 'history': setIsHistoryOpen(true); break;
        case 'install': setIsInstallerOpen(true); break;
    }
  };

  const handleStartLiveCall = () => {
      if (isOfflineMode) { alert("Cần có mạng để gọi điện!"); return; }
      if (!spendMoonShards(50)) { 
         if(!confirm(t('insufficient_balance') + " (50 Shards). Continue anyway for demo?")) return;
      }
      setIsLiveCallOpen(true);
  };

  return (
    <>
      {showIntro && <IntroAnimation onComplete={handleIntroComplete} />}
      
      <div 
        className="flex flex-col h-[100dvh] text-slate-200 overflow-hidden font-sans selection:bg-indigo-500/30 transition-all duration-500 ease-in-out bg-slate-950"
        style={{ backgroundImage: backgroundImage ? `url(${backgroundImage})` : 'none', backgroundSize: 'cover', backgroundPosition: 'center' }}
      >
        <AuthModal />

        {isOfflineMode && (
          <div className="bg-red-600/90 text-white text-xs font-bold text-center py-1 absolute top-0 w-full z-[60] backdrop-blur-sm flex items-center justify-center gap-2 safe-top-padding">
             <WifiOff size={14} /> <span>Mất kết nối Internet - Đang chạy chế độ Offline</span>
          </div>
        )}

        {!guestLimitInfo.allowed && !isGlobalChatOpen && (
             <div className="fixed bottom-20 left-4 right-4 z-40 bg-red-900/90 border border-red-500 text-white p-4 rounded-xl shadow-2xl flex flex-col items-center animate-bounce">
                <Lock className="mb-2" />
                <h3 className="font-bold text-lg">{t('guest_limit_reached')}</h3>
                <p className="text-sm text-center mb-2">{t('guest_limit_desc')}</p>
                <div className="text-xl font-mono font-bold">
                    {t('guest_lock_timer')} {new Date(guestLimitInfo.waitTime).toISOString().substr(11, 8)}
                </div>
             </div>
        )}

        <div className={`flex flex-col h-full w-full ${backgroundImage ? 'bg-black/70 backdrop-blur-[2px]' : ''}`}>
            <SideMenu 
                isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} onNavigate={handleMenuNavigate}
                currentBg={backgroundImage} onUploadBg={(e) => {
                      const f = e.target.files?.[0]; 
                      if(f) { const r = new FileReader(); r.onload = () => { setBackgroundImage(r.result as string); localStorage.setItem('soullink_bg', r.result as string); }; r.readAsDataURL(f); }
                }} 
                onResetBg={() => { setBackgroundImage(null); localStorage.removeItem('soullink_bg'); }}
                currentPersona={currentPersona} onSelectPersona={(p) => { setCurrentPersona(p); setMessages(prev => [...prev, { id: Date.now().toString(), role: 'model', text: t('switchedPersona', { name: p.name }), timestamp: Date.now() }]); }}
                onOpenProfile={() => setIsProfileModalOpen(true)}
                isOfflineMode={isOfflineMode}
                onToggleOffline={handleToggleOffline}
            />

            <HistoryModal isOpen={isHistoryOpen} onClose={() => setIsHistoryOpen(false)} onSelectSession={handleLoadSession} currentSessionId={sessionId} />
            
            <header className="flex-none h-16 border-b border-slate-800 bg-slate-900/80 backdrop-blur-md flex items-center justify-between px-4 z-10 sticky top-0 safe-top pt-2">
                <div className="flex items-center gap-2">
                <button onClick={() => setIsMenuOpen(true)} className="bg-indigo-600 hover:bg-indigo-500 p-1.5 rounded-lg shadow-lg shadow-indigo-500/20 transition-all active:scale-95">
                    <Sparkles size={20} className="text-white" />
                </button>
                <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent hidden md:block">{t('appTitle')}</h1>
                </div>
                <div className="flex items-center gap-2">
                   <button 
                      onClick={handleStartLiveCall}
                      className={`flex items-center gap-1 text-white px-3 py-1.5 rounded-full text-xs font-bold mr-2 shadow-lg ${isOfflineMode ? 'bg-gray-600 cursor-not-allowed' : 'bg-green-600 hover:bg-green-500 animate-pulse shadow-green-500/20'}`}
                   >
                      <Phone size={14} fill="currentColor" />
                      <span className="hidden sm:inline">{t('live_call_btn')}</span>
                   </button>

                   <div className="relative group">
                      <div className="flex items-center gap-1 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-full px-3 py-1.5 cursor-pointer">
                        <Languages size={14} className="text-slate-400" />
                        <select value={language} onChange={(e) => setLanguage(e.target.value as Language)} className="bg-transparent text-xs font-bold text-slate-200 appearance-none focus:outline-none cursor-pointer pr-4">
                          <option value="en">English</option><option value="vi">Tiếng Việt</option><option value="zh">中文</option><option value="ja">日本語</option><option value="ko">한국어</option><option value="ru">Русский</option><option value="th">ไทย</option><option value="hi">हिन्दी</option>
                        </select>
                        <ChevronDown size={12} className="text-slate-400 absolute right-2 pointer-events-none" />
                      </div>
                   </div>
                   <button onClick={handleNewChat} className="p-2 text-slate-500 hover:text-indigo-400 transition-colors"><Plus size={20} /></button>
                </div>
            </header>

            <main ref={containerRef} className="flex-1 overflow-y-auto w-full max-w-3xl mx-auto p-4 pb-32">
                <div className="flex flex-col">
                    {messages.map((msg) => <ChatBubble key={msg.id} message={msg} personaColor={currentPersona.color} personaAvatar={currentPersona.avatar} />)}
                    {loadingState !== LoadingState.IDLE && <TypingIndicator />}
                    <div ref={messagesEndRef} />
                </div>
            </main>

            {guestLimitInfo.allowed && (
                 <InputArea onSendMessage={handleSendMessage} onOpenImageGen={() => setIsImageModalOpen(true)} loadingState={loadingState} />
            )}
        </div>

        {isGlobalChatOpen && <GlobalChat onClose={() => setIsGlobalChatOpen(false)} />}
        <AdminPanel isOpen={isAdminPanelOpen} onClose={() => setIsAdminPanelOpen(false)} />
        <ShopModal isOpen={isShopOpen} onClose={() => setIsShopOpen(false)} />
        <ProfileModal isOpen={isProfileModalOpen} onClose={() => setIsProfileModalOpen(false)} />
        <LiveCallModal isOpen={isLiveCallOpen} onClose={() => setIsLiveCallOpen(false)} persona={currentPersona} />
        <AppInstaller isOpen={isInstallerOpen} onClose={() => setIsInstallerOpen(false)} />

        <ImageGeneratorModal isOpen={isImageModalOpen} onClose={() => setIsImageModalOpen(false)} onGenerate={handleGenerateImage} />
        <FaceSwapModal isOpen={isFaceSwapModalOpen} onClose={() => setIsFaceSwapModalOpen(false)} onSwap={(s, t) => handleSwapAction('face', s, t, performFaceSwap)} />
        <HairSwapModal isOpen={isHairSwapModalOpen} onClose={() => setIsHairSwapModalOpen(false)} onSwap={(s, t) => handleSwapAction('hair', s, t, performHairSwap)} />
        <OutfitSwapModal isOpen={isOutfitSwapModalOpen} onClose={() => setIsOutfitSwapModalOpen(false)} onSwap={(s, t) => handleSwapAction('outfit', s, t, performOutfitSwap)} />
      </div>
    </>
  );
};

const App: React.FC = () => (
    <LanguageProvider>
      <AuthProvider>
         <SoulLinkApp />
      </AuthProvider>
    </LanguageProvider>
);

export default App;