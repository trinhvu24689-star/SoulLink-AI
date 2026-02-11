import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { Send, Shield, Crown, User as UserIcon, Gift, X, Loader2 } from 'lucide-react';
import axios from 'axios';

interface GlobalChatProps { onClose: () => void; }

const GlobalChat: React.FC<GlobalChatProps> = ({ onClose }) => {
    const { user, addMoonShards } = useAuth();
    const { t } = useLanguage();
    const [messages, setMessages] = useState<any[]>([]);
    const [inputText, setInputText] = useState('');
    const [loading, setLoading] = useState(true);
    const [claimingId, setClaimingId] = useState<string | null>(null); // Trạng thái đang giật lì xì
    const endRef = useRef<HTMLDivElement>(null);

    // --- 1. ĐỒNG BỘ DỮ LIỆU ---
    const fetchMessages = async () => {
        try {
            const res = await axios.get('/api/global-chat');
            setMessages(res.data);
        } catch (error) {
            console.error("Lỗi đồng bộ community:", error);
        } finally { setLoading(false); }
    };

    useEffect(() => {
        fetchMessages();
        const timer = setInterval(fetchMessages, 5000);
        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        endRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // --- 2. GỬI TIN NHẮN ---
    const handleSend = async () => {
        if (!inputText.trim() || !user || user.isBanned) return;
        try {
            const res = await axios.post('/api/global-chat', {
                userId: user.id,
                text: inputText,
                type: 'text'
            });
            setMessages(prev => [...prev, res.data]);
            setInputText('');
        } catch (error) { alert("Mất kết nối server!"); }
    };

    // --- 3. LOGIC LÌ XÌ (ĐỘC QUYỀN ADMIN) ---
    const handleRedEnvelope = async () => {
        if (user?.role !== 'admin') return;
        const amount = Math.floor(Math.random() * 500) + 50; // Random từ 50-550 Shards
        try {
            await axios.post('/api/global-chat', {
                userId: user.id,
                text: `🧧 LÌ XÌ MAY MẮN: ${amount} SHARDS!`,
                type: 'red_envelope',
                data: amount // Lưu số tiền vào field data của message
            });
            fetchMessages();
        } catch (e) { console.error(e); }
    };

    // --- 4. GIẬT LÌ XÌ (DÀNH CHO TẤT CẢ USER) ---
    const claimRedEnvelope = async (msg: any) => {
        if (!user || claimingId === msg.id) return;
        setClaimingId(msg.id);
        try {
            // Gọi API nạp tiền ck vừa viết ở server.ts
            const res = await axios.post('/api/shop/purchase', {
                userId: user.id,
                amount: msg.data
            });
            if (res.data.success) {
                addMoonShards(msg.data);
                alert(`Chúc mừng Master! Ck đã nhận được ${msg.data} Moon Shards 🌙`);
            }
        } catch (e) {
            alert("Lì xì này đã hết hạn hoặc có lỗi hệ thống!");
        } finally { setClaimingId(null); }
    };

    const renderBadge = (role: string, badges: string[] = []) => {
        const items = [];
        if (role === 'admin') items.push(<Shield key="adm" size={12} className="text-red-500 fill-red-500/20" />);
        if (role === 'ultra') items.push(<Crown key="ult" size={12} className="text-yellow-400 fill-yellow-400/20" />);
        if (badges?.includes('Ultra Vip')) items.push(<span key="vip" className="text-[8px] bg-yellow-500/20 text-yellow-300 px-1 rounded border border-yellow-500/50">VIP</span>);
        return <div className="flex gap-1 items-center">{items}</div>;
    };

    return (
        <div className="fixed inset-0 z-[1000] bg-slate-950 flex flex-col animate-in fade-in duration-300">
            {/* Header: Live Community */}
            <div className="h-16 border-b border-white/5 flex items-center justify-between px-6 bg-slate-900/40 backdrop-blur-xl">
                <div className="flex items-center gap-3">
                    <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse shadow-[0_0_10px_#22c55e]" />
                    <div>
                        <h2 className="font-black text-white uppercase tracking-tighter italic">SoulLink Community</h2>
                        <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">Real-time Neon Sync</p>
                    </div>
                </div>
                <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full text-slate-400 transition-all active:scale-90"><X size={24} /></button>
            </div>

            {/* Admin Controls */}
            {user?.role === 'admin' && (
                <div className="px-4 py-2 bg-red-500/5 border-b border-red-500/10 flex items-center gap-4">
                    <button onClick={handleRedEnvelope} className="flex items-center gap-2 text-[10px] font-black text-red-400 hover:text-red-300 uppercase tracking-widest transition-colors">
                        <Gift size={14}/> Thả Lì Xì (Admin Only)
                    </button>
                </div>
            )}

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar bg-slate-900/20">
                {loading ? (
                    <div className="flex flex-col items-center justify-center h-full text-slate-500 gap-3">
                        <Loader2 className="animate-spin text-indigo-500" size={32} />
                        <p className="text-[10px] font-black uppercase tracking-[0.2em]">Connecting to Neon DB...</p>
                    </div>
                ) : (
                    messages.map((msg) => (
                        <div key={msg.id} className={`flex gap-4 ${msg.userId === user?.id ? 'flex-row-reverse' : ''} animate-in slide-in-from-bottom-2 duration-300`}>
                            <div className={`w-10 h-10 rounded-2xl flex-shrink-0 flex items-center justify-center border-2 overflow-hidden shadow-lg ${msg.user?.role === 'admin' ? 'border-red-500/50' : 'border-slate-800'}`}>
                                {msg.user?.avatar ? <img src={msg.user.avatar} className="w-full h-full object-cover" /> : <UserIcon size={18} className="text-slate-600" />}
                            </div>
                            
                            <div className={`flex flex-col max-w-[75%] ${msg.userId === user?.id ? 'items-end' : 'items-start'}`}>
                                <div className="flex items-center gap-2 mb-1.5 px-1">
                                    <span className={`text-[10px] font-black uppercase tracking-tight ${msg.user?.role === 'admin' ? 'text-red-400' : 'text-slate-400'}`}>
                                        {msg.user?.name || 'SoulLinker'}
                                    </span>
                                    {renderBadge(msg.user?.role, msg.user?.badges)}
                                </div>
                                
                                {msg.type === 'red_envelope' ? (
                                    <button 
                                        onClick={() => claimRedEnvelope(msg)}
                                        disabled={claimingId === msg.id}
                                        className="group relative bg-gradient-to-br from-red-600 to-orange-600 p-4 rounded-3xl flex flex-col items-center gap-2 min-w-[160px] shadow-[0_10px_20px_rgba(220,38,38,0.3)] hover:scale-105 active:scale-95 transition-all overflow-hidden"
                                    >
                                        <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                                        <Gift className="text-white animate-bounce" size={32} />
                                        <span className="text-xs font-black text-white uppercase tracking-widest">{msg.text}</span>
                                        <div className="text-[8px] text-red-200 font-bold uppercase tracking-tighter bg-red-900/30 px-2 py-0.5 rounded-full mt-1">Chạm để giật Shards</div>
                                        {claimingId === msg.id && <Loader2 className="absolute animate-spin text-white" size={24} />}
                                    </button>
                                ) : (
                                    <div className={`px-5 py-3 rounded-[1.5rem] text-sm leading-relaxed shadow-xl border ${
                                        msg.userId === user?.id 
                                            ? 'bg-indigo-600 border-indigo-500 text-white rounded-tr-none' 
                                            : 'bg-slate-800/80 border-white/5 text-slate-100 rounded-tl-none backdrop-blur-md'
                                    }`}>
                                        {msg.text}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))
                )}
                <div ref={endRef} />
            </div>

            {/* Floating Input Area */}
            <div className="p-4 bg-slate-900/60 border-t border-white/5 backdrop-blur-2xl pb-safe">
                <div className="max-w-4xl mx-auto flex gap-3">
                    <input 
                        className="flex-1 bg-slate-950 border border-white/5 rounded-[1.5rem] px-6 py-3 text-white text-sm focus:outline-none focus:border-indigo-500 transition-all shadow-inner placeholder:text-slate-600"
                        placeholder="Chia sẻ linh hồn với cộng đồng..."
                        value={inputText}
                        onChange={e => setInputText(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && handleSend()}
                    />
                    <button onClick={handleSend} className="w-12 h-12 bg-indigo-600 hover:bg-indigo-500 rounded-2xl text-white shadow-lg shadow-indigo-600/30 transition-all active:scale-90 flex items-center justify-center">
                        <Send size={20} className="translate-x-0.5 -translate-y-0.5" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default GlobalChat;