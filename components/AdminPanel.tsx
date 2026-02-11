import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { User, UserRole } from '../types';
import { X, Search, Shield, Moon, Crown, Trash2, Ban, UserCheck, Loader2, RefreshCw } from 'lucide-react';
import axios from 'axios';

const AdminPanel: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
    const { user: currentUser } = useAuth();
    const { t } = useLanguage();
    const [users, setUsers] = useState<User[]>([]);
    const [filter, setFilter] = useState('');
    const [loading, setLoading] = useState(false);

    // --- 1. TẢI DANH SÁCH USER TỪ NEON DB ---
    const fetchUsers = async () => {
        setLoading(true);
        try {
            // Ck nhớ tạo route này ở backend nhé
            const res = await axios.get('/api/admin/users');
            setUsers(res.data);
        } catch (error) {
            console.error("Lỗi tải danh sách Master:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isOpen) fetchUsers();
    }, [isOpen]);

    // --- 2. CẬP NHẬT QUYỀN HẠN (THÔNG QUA BACKEND) ---
    const handleAction = async (targetId: string, data: any) => {
        try {
            await axios.put(`/api/admin/users/${targetId}`, data);
            fetchUsers(); // Tải lại để cập nhật UI
        } catch (error) {
            alert("Lệnh không thực hiện được, thưa Master!");
        }
    };

    const giftShards = async (targetId: string, currentShards: number) => {
        const amount = Number(prompt("Số lượng Moon Shards muốn ban tặng:"));
        if (amount) {
            await handleAction(targetId, { moonShards: currentShards + amount });
        }
    };

    if (!isOpen || currentUser?.role !== 'admin') return null;

    return (
        <div className="fixed inset-0 z-[1000] bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-2 md:p-4 animate-in fade-in duration-300">
            <div className="bg-slate-900 border border-red-500/30 w-full max-w-5xl h-[90vh] rounded-3xl flex flex-col shadow-[0_0_50px_rgba(239,68,68,0.15)] overflow-hidden">
                
                {/* Header: Đậm chất Master */}
                <div className="p-6 border-b border-red-900/20 flex justify-between items-center bg-gradient-to-r from-red-950/40 to-slate-900">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-red-600 rounded-2xl shadow-lg shadow-red-600/20">
                            <Shield className="text-white" size={24} />
                        </div>
                        <div>
                            <h2 className="text-xl font-black text-white tracking-tighter uppercase italic">SoulLink Control Center</h2>
                            <p className="text-[10px] text-red-400 font-bold uppercase tracking-[0.2em]">Master: {currentUser.name}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <button onClick={fetchUsers} className="p-2 hover:bg-slate-800 rounded-full text-slate-400"><RefreshCw size={20} className={loading ? 'animate-spin' : ''} /></button>
                        <button onClick={onClose} className="p-2 hover:bg-red-500/20 rounded-full text-slate-400 hover:text-red-500 transition-all"><X size={24} /></button>
                    </div>
                </div>

                {/* Search Bar: Tối ưu cho Mobile */}
                <div className="p-4 bg-slate-900/50 border-b border-slate-800">
                    <div className="relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-red-500 transition-colors" size={18} />
                        <input 
                            className="w-full bg-slate-950 border border-slate-800 rounded-2xl pl-12 pr-4 py-3 text-sm text-white focus:ring-2 focus:ring-red-500/50 outline-none transition-all placeholder:text-slate-600"
                            placeholder="Truy tìm danh tính User..."
                            value={filter}
                            onChange={e => setFilter(e.target.value)}
                        />
                    </div>
                </div>

                {/* Table Section */}
                <div className="flex-1 overflow-auto custom-scrollbar">
                    {loading && users.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full gap-4 text-slate-500">
                            <Loader2 className="animate-spin text-red-500" size={40} />
                            <p className="text-xs font-bold uppercase tracking-widest">Đang kết nối Neon DB...</p>
                        </div>
                    ) : (
                        <table className="w-full text-left border-collapse min-w-[600px]">
                            <thead className="sticky top-0 bg-slate-900/95 backdrop-blur-sm z-10">
                                <tr className="text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-slate-800">
                                    <th className="p-6">Thành viên</th>
                                    <th className="p-6">Cấp bậc</th>
                                    <th className="p-6">Moon Shards</th>
                                    <th className="p-6 text-right">Thao phạt</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.filter(u => u.name.toLowerCase().includes(filter.toLowerCase())).map(u => (
                                    <tr key={u.id} className="border-b border-white/5 hover:bg-red-500/5 transition-colors group">
                                        <td className="p-6">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center font-bold text-red-500 border border-white/5">
                                                    {u.name[0]}
                                                </div>
                                                <div>
                                                    <div className="font-bold text-slate-100">{u.name}</div>
                                                    <div className="text-[10px] text-slate-500 font-mono">{u.username}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-6">
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${
                                                u.role === 'ultra' ? 'bg-yellow-500/20 text-yellow-500 border border-yellow-500/20' : 
                                                u.role === 'admin' ? 'bg-red-500/20 text-red-500 border border-red-500/20' : 
                                                'bg-slate-800 text-slate-400'
                                            }`}>
                                                {u.role}
                                            </span>
                                        </td>
                                        <td className="p-6 font-mono text-yellow-500 font-bold">
                                            <div className="flex items-center gap-1">
                                                <Moon size={14} className="fill-yellow-500" />
                                                {u.moonShards?.toLocaleString() || 0}
                                            </div>
                                        </td>
                                        <td className="p-6">
                                            <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                {u.role !== 'admin' && (
                                                    <>
                                                        <button 
                                                            onClick={() => giftShards(u.id, u.moonShards || 0)} 
                                                            className="p-2.5 bg-green-500/10 text-green-500 rounded-xl hover:bg-green-500 hover:text-white transition-all"
                                                        >
                                                            <Moon size={18} />
                                                        </button>
                                                        <button 
                                                            onClick={() => handleAction(u.id, { role: u.role === 'ultra' ? 'user' : 'ultra' })}
                                                            className={`p-2.5 rounded-xl transition-all ${u.role === 'ultra' ? 'bg-slate-800 text-slate-400' : 'bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500 hover:text-white'}`}
                                                        >
                                                            <Crown size={18} />
                                                        </button>
                                                        <button className="p-2.5 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-600 hover:text-white transition-all">
                                                            <Ban size={18} />
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>

                {/* Footer: System Stats */}
                <div className="p-4 bg-red-950/10 border-t border-red-900/20 flex justify-between items-center text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                    <span>SoulLink Security Protocol v4.0</span>
                    <span className="text-red-400 animate-pulse">System Live: 100% Stable</span>
                </div>
            </div>
        </div>
    );
};

export default AdminPanel;