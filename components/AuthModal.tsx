import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { 
  Mail, Lock, User, ArrowRight, Loader2, 
  Eye, EyeOff, Sparkles, ShieldCheck, FileText, 
  ExternalLink, CheckCircle2 
} from 'lucide-react';
import axios from 'axios';

// --- COMPONENT CON: GIAO KÈO PHÁP LÝ ---
const LegalProtocol: React.FC<{ onAccept: (val: boolean) => void, isAccepted: boolean }> = ({ onAccept, isAccepted }) => {
  const { t } = useLanguage();
  return (
    <div className="mt-4 p-4 bg-indigo-500/5 border border-indigo-500/20 rounded-2xl animate-in slide-in-from-top-2">
      <div className="flex items-start gap-3 mb-3">
        <ShieldCheck className="text-indigo-400 shrink-0 mt-1" size={18} />
        <p className="text-[10px] text-slate-400 leading-relaxed uppercase tracking-widest font-bold">
          Để khởi tạo linh hồn trên Neon DB, Master cần chấp thuận Giao kèo bảo mật v6.0.
        </p>
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex gap-2">
          <button type="button" className="flex-1 flex items-center justify-between px-3 py-2 bg-black/40 border border-white/5 rounded-xl hover:border-indigo-500/50 transition-all group">
            <span className="text-[9px] font-black text-slate-300 uppercase tracking-tighter">Privacy Policy</span>
            <ExternalLink size={10} className="text-slate-600 group-hover:text-indigo-400" />
          </button>
          <button type="button" className="flex-1 flex items-center justify-between px-3 py-2 bg-black/40 border border-white/5 rounded-xl hover:border-indigo-500/50 transition-all group">
            <span className="text-[9px] font-black text-slate-300 uppercase tracking-tighter">Terms of Service</span>
            <ExternalLink size={10} className="text-slate-600 group-hover:text-indigo-400" />
          </button>
        </div>
        
        <label className="flex items-center gap-3 p-3 bg-indigo-600/10 border border-indigo-500/20 rounded-xl cursor-pointer group active:scale-95 transition-all">
          <input 
            type="checkbox" 
            className="hidden" 
            checked={isAccepted} 
            onChange={(e) => onAccept(e.target.checked)} 
          />
          <div className={`w-5 h-5 rounded-lg border-2 flex items-center justify-center transition-all ${isAccepted ? 'bg-indigo-600 border-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]' : 'border-slate-700 bg-slate-900'}`}>
            {isAccepted && <CheckCircle2 className="text-white" size={14} />}
          </div>
          <span className={`text-[10px] font-black uppercase tracking-widest ${isAccepted ? 'text-indigo-300' : 'text-slate-500'}`}>
            Tôi đồng ý với mọi điều khoản
          </span>
        </label>
      </div>
    </div>
  );
};

// --- COMPONENT CHÍNH ---
const AuthModal: React.FC = () => {
  // 🔥 SỬA DÒNG NÀY: Lấy hàm setUser thay vì login
  const { user, setUser } = useAuth(); 
  
  const { t } = useLanguage();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isLegalAccepted, setIsLegalAccepted] = useState(false); // Trạng thái pháp lý

  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [pass, setPass] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  if (user) return null;

  // Cấu hình URL Backend (Master nhớ thay đổi nếu IP khác)
  const API_URL = 'http://192.168.1.7:3000/api';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === 'register' && !isLegalAccepted) return; // Chặn Register nếu chưa đồng ý

    setError('');
    setLoading(true);
    try {
      // Gọi trực tiếp axios ở đây để linh hoạt xử lý lỗi UI
      const response = await axios.post(`${API_URL}/auth`, {
        username: username.toLowerCase(),
        name: mode === 'register' ? name : username,
        password: pass,
        isLegalAccepted: mode === 'register' ? isLegalAccepted : undefined
      });
      
      // Nếu thành công, set user vào Context
      setUser(response.data);
      
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.error || "Lỗi kết nối SoulLink Server (Kiểm tra IP)");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-950/80 backdrop-blur-xl p-4 animate-in fade-in duration-500">
      <div className="w-full max-w-md bg-slate-900 border border-white/10 rounded-[2.5rem] shadow-[0_0_100px_rgba(99,101,241,0.2)] overflow-hidden relative flex flex-col animate-in zoom-in-95">
        
        {/* Top Gradient Decor */}
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-indigo-500/10 to-transparent pointer-events-none" />

        <div className="p-8 relative z-10">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-indigo-600 rounded-2xl shadow-lg shadow-indigo-600/30 flex items-center justify-center mx-auto mb-4 animate-bounce-slow">
              <Sparkles className="text-white" size={32} />
            </div>
            <h2 className="text-3xl font-black text-white italic tracking-tighter uppercase">SoulLink AI</h2>
            <p className="text-[10px] text-indigo-400 font-bold uppercase tracking-[0.4em] mt-1">Universal Identity Portal</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'register' && (
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors" size={18} />
                <input 
                  className="w-full bg-black/40 border border-white/5 rounded-2xl pl-12 pr-4 py-4 text-sm text-white outline-none focus:border-indigo-500/50 transition-all"
                  placeholder="Họ tên Master..."
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            )}

            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors" size={18} />
              <input 
                className="w-full bg-black/40 border border-white/5 rounded-2xl pl-12 pr-4 py-4 text-sm text-white outline-none focus:border-indigo-500/50 transition-all"
                placeholder="Username nơ-ron..."
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors" size={18} />
              <input 
                type={showPassword ? 'text' : 'password'}
                className="w-full bg-black/40 border border-white/5 rounded-2xl pl-12 pr-12 py-4 text-sm text-white outline-none focus:border-indigo-500/50 transition-all"
                placeholder="Mật mã Quantum..."
                value={pass}
                onChange={(e) => setPass(e.target.value)}
                required
              />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {/* INTEGRATED LEGAL PROTOCOL (Chỉ hiện khi Đăng ký) */}
            {mode === 'register' && (
              <LegalProtocol isAccepted={isLegalAccepted} onAccept={setIsLegalAccepted} />
            )}

            {error && <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-[10px] font-bold text-center uppercase tracking-widest">{error}</div>}

            <button 
              type="submit" 
              disabled={loading || (mode === 'register' && !isLegalAccepted)}
              className={`w-full py-4 rounded-[1.5rem] font-black text-xs uppercase tracking-[0.3em] transition-all flex items-center justify-center gap-2 mt-4 shadow-xl ${
                (mode === 'register' && !isLegalAccepted) 
                  ? 'bg-slate-800 text-slate-600 grayscale cursor-not-allowed opacity-50' 
                  : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-indigo-500/20 active:scale-95'
              }`}
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : (mode === 'login' ? t('auth_signin') : t('auth_signup'))}
              {!loading && <ArrowRight size={18} />}
            </button>
          </form>

          <div className="mt-8 text-center space-y-4">
            <button 
              onClick={() => {
                setMode(mode === 'login' ? 'register' : 'login');
                setIsLegalAccepted(false); // Reset pháp lý khi đổi mode
              }}
              className="text-[10px] font-black text-slate-500 hover:text-indigo-400 uppercase tracking-[0.2em] transition-colors"
            >
              {mode === 'login' ? "Chưa có linh hồn? Khởi tạo ngay" : "Đã có thực thể? Đồng bộ hóa"}
            </button>
          </div>
        </div>

        {/* Footer info */}
        <div className="p-4 bg-slate-950/50 border-t border-white/5 text-center">
            <p className="text-[8px] font-black text-slate-700 uppercase tracking-[0.4em]">SoulLink Security Protocol v6.0.2</p>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;