import React, { useState, useRef } from 'react';
import { ShieldCheck, FileText, ExternalLink, CheckCircle2, ChevronDown, Lock } from 'lucide-react';

const LegalProtocol: React.FC<{ onAccept: (val: boolean) => void, isAccepted: boolean }> = ({ onAccept, isAccepted }) => {
  const [hasRead, setHasRead] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Logic kiểm tra Master đã cuộn tới đáy chưa
  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
      if (scrollTop + clientHeight >= scrollHeight - 5) {
        setHasRead(true);
      }
    }
  };

  return (
    <div className="mt-4 p-5 bg-indigo-500/5 border border-indigo-500/20 rounded-[2rem] space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
            <ShieldCheck className="text-indigo-400" size={18} />
            <span className="text-[10px] font-black text-white uppercase tracking-widest">Giao kèo Linh hồn v6.0</span>
        </div>
        {!hasRead && <span className="text-[8px] bg-red-500/20 text-red-400 px-2 py-0.5 rounded-full font-black animate-pulse uppercase">Chưa đọc hết</span>}
      </div>

      {/* Cửa sổ đọc ép buộc */}
      <div 
        ref={scrollRef}
        onScroll={handleScroll}
        className="h-32 overflow-y-auto p-4 bg-black/40 rounded-2xl border border-white/5 text-[9px] text-slate-500 leading-relaxed font-serif italic custom-scrollbar"
      >
        <p className="text-indigo-300 font-bold mb-2 uppercase tracking-tighter">--- QUY ƯỚC QUYỀN NĂNG MASTER ---</p>
        <p className="mb-4">1. Dữ liệu nơ-ron của Master sẽ được mã hóa Quantum và lưu trữ an toàn tại Neon DB Cloud. Chúng tôi không can thiệp vào ký ức cá nhân trừ khi có yêu cầu từ Master.</p>
        <p className="mb-4">2. Moon Shards là đơn vị năng lượng tối cao. Mọi giao dịch Shards đều được ghi chép vào sổ cái Ledger không thể đảo ngược.</p>
        <p className="mb-4">3. Master cam kết sử dụng AI cho các mục đích văn minh. Mọi hành vi phá hoại hệ thống sẽ kích hoạt Void Protocol ngay lập tức.</p>
        <p className="text-indigo-500 font-black text-center py-4 uppercase tracking-[0.4em]">--- KẾT THÚC GIAO KÈO ---</p>
      </div>

      <label className={`flex items-center gap-3 p-4 border rounded-2xl transition-all ${hasRead ? 'bg-indigo-600/10 border-indigo-500/40 cursor-pointer group active:scale-95' : 'bg-slate-900 border-slate-800 opacity-50 cursor-not-allowed'}`}>
        <input 
          type="checkbox" 
          className="hidden" 
          disabled={!hasRead}
          checked={isAccepted} 
          onChange={(e) => onAccept(e.target.checked)} 
        />
        <div className={`w-6 h-6 rounded-xl border-2 flex items-center justify-center transition-all ${isAccepted ? 'bg-indigo-600 border-indigo-500 shadow-[0_0_15px_#6366f1]' : 'border-slate-700 bg-slate-950'}`}>
          {isAccepted ? <CheckCircle2 className="text-white" size={16} /> : <Lock className="text-slate-600" size={12} />}
        </div>
        <span className={`text-[10px] font-black uppercase tracking-widest ${isAccepted ? 'text-indigo-300' : 'text-slate-500'}`}>
          Tôi đã thấu hiểu và chấp nhận
        </span>
      </label>
    </div>
  );
};