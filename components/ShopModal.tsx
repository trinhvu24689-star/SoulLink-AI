import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { X, Moon, CreditCard, Sparkles, Zap, Crown, Check, Loader2 } from 'lucide-react';
import axios from 'axios';

interface ShopModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const ShopModal: React.FC<ShopModalProps> = ({ isOpen, onClose }) => {
    const { user, addMoonShards } = useAuth();
    const { t } = useLanguage();
    const [purchasing, setPurchasing] = useState<number | null>(null);

    if (!isOpen) return null;

    // --- CÁC GÓI VẬT PHẨM ĐÃ ĐƯỢC THÊM MỚI ---
    const packages = [
        { id: 1, amount: 100, price: '25.000đ', popular: false, icon: <Moon size={24} /> },
        { id: 2, amount: 600, price: '129.000đ', popular: true, bonus: '+10%', icon: <Zap size={24} className="text-yellow-400" /> },
        { id: 3, amount: 1500, price: '299.000đ', popular: false, bonus: '+20%', icon: <Sparkles size={24} className="text-indigo-400" /> },
        { id: 4, amount: 5000, price: '999.000đ', popular: false, bonus: 'VIP ROLE', icon: <Crown size={24} className="text-yellow-500" /> },
    ];

    const handleBuy = async (pkg: any) => {
        setPurchasing(pkg.id);
        
        // --- GIẢ LẬP THANH TOÁN (Ck có thể thay bằng API thật sau này) ---
        try {
            // Ck có thể gọi API Backend tại đây để cập nhật Neon DB
            // await axios.post('/api/shop/purchase', { userId: user.id, amount: pkg.amount });
            
            await new Promise(resolve => setTimeout(resolve, 1500)); // Delay cho giống thật
            
            addMoonShards(pkg.amount); // Cập nhật state local
            alert(`Thanh toán thành công gói ${pkg.amount} Shards!`);
            onClose();
        } catch (error) {
            alert("Giao dịch thất bại, vui lòng thử lại!");
        } finally {
            setPurchasing(null);
        }
    };

    return (
        <div className="fixed inset-0 z-[1000] bg-slate-950/90 backdrop-blur-xl flex items-center justify-center p-2 md:p-4 animate-in fade-in duration-300">
            <div className="bg-slate-900 border border-white/10 w-full max-w-xl rounded-[2.5rem] overflow-hidden shadow-[0_0_80px_rgba(79,70,229,0.15)] relative">
                
                {/* Trang trí background */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600/20 blur-[60px] rounded-full -mr-10 -mt-10" />

                {/* Header */}
                <div className="p-6 flex justify-between items-center border-b border-white/5 bg-slate-900/50">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-indigo-600 rounded-xl shadow-lg shadow-indigo-600/20">
                            <Moon className="text-white fill-white" size={20} />
                        </div>
                        <div>
                            <h2 className="text-xl font-black text-white tracking-tight uppercase italic">{t('shop_title') || "SoulLink Emporium"}</h2>
                            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Nạp năng lượng cho linh hồn</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full text-slate-400 transition-all"><X size={24} /></button>
                </div>

                {/* Grid Packages */}
                <div className="p-6 grid grid-cols-2 gap-4">
                    {packages.map((pkg) => (
                        <div 
                            key={pkg.id} 
                            className={`relative group p-5 rounded-[2rem] border transition-all duration-300 flex flex-col items-center overflow-hidden ${
                                pkg.popular 
                                ? 'bg-indigo-600/10 border-indigo-500/50 shadow-lg shadow-indigo-500/10 scale-105 z-10' 
                                : 'bg-white/5 border-white/5 hover:border-white/20'
                            }`}
                        >
                            {/* Hiệu ứng tia sét cho gói phổ biến */}
                            {pkg.popular && (
                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-400 to-transparent" />
                            )}

                            {pkg.bonus && (
                                <div className="absolute top-3 right-3 px-2 py-0.5 bg-green-500/20 border border-green-500/30 text-green-400 text-[8px] font-black rounded-full animate-pulse">
                                    {pkg.bonus}
                                </div>
                            )}

                            <div className={`mb-4 p-3 rounded-2xl ${pkg.popular ? 'bg-indigo-500/20 text-indigo-400' : 'bg-slate-800 text-slate-400'}`}>
                                {pkg.icon}
                            </div>

                            <div className="text-3xl font-black text-white mb-1 tracking-tighter">
                                {pkg.amount.toLocaleString()}
                            </div>
                            <div className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em] mb-6">Moon Shards</div>

                            <button 
                                disabled={purchasing !== null}
                                onClick={() => handleBuy(pkg)}
                                className={`w-full py-3 rounded-2xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${
                                    pkg.popular 
                                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 hover:bg-indigo-500' 
                                    : 'bg-white text-slate-900 hover:bg-slate-200'
                                }`}
                            >
                                {purchasing === pkg.id ? (
                                    <Loader2 size={16} className="animate-spin" />
                                ) : (
                                    <>
                                        <CreditCard size={16} />
                                        {pkg.price}
                                    </>
                                )}
                            </button>
                        </div>
                    ))}
                </div>

                {/* Footer với thông tin bảo mật */}
                <div className="px-6 py-4 bg-slate-950/50 border-t border-white/5 flex items-center justify-center gap-4">
                    <div className="flex items-center gap-1 text-[9px] font-bold text-slate-600 uppercase tracking-widest">
                        <Check size={10} /> Bảo mật SSL
                    </div>
                    <div className="w-1 h-1 bg-slate-800 rounded-full" />
                    <div className="flex items-center gap-1 text-[9px] font-bold text-slate-600 uppercase tracking-widest">
                        <Check size={10} /> Google Pay
                    </div>
                    <div className="w-1 h-1 bg-slate-800 rounded-full" />
                    <div className="flex items-center gap-1 text-[9px] font-bold text-slate-600 uppercase tracking-widest">
                        <Check size={10} /> Apple Pay
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ShopModal;