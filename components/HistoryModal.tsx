import React, { useEffect, useState, useMemo } from 'react';
import { X, MessageSquare, Trash2, Clock, Calendar, Search, Ghost, Hash, Trash } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { ChatSession } from '../types';
import { getSessions, deleteSession, clearAllSessions } from '../services/storageService';

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectSession: (session: ChatSession) => void;
  currentSessionId: string;
}

const HistoryModal: React.FC<HistoryModalProps> = ({ isOpen, onClose, onSelectSession, currentSessionId }) => {
  const { t } = useLanguage();
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadSessions();
    }
  }, [isOpen]);

  const loadSessions = async () => {
    setLoading(true);
    try {
      const data = await getSessions();
      // Sắp xếp mới nhất lên đầu
      const sorted = data.sort((a, b) => b.lastModified - a.lastModified);
      setSessions(sorted);
    } catch (error) {
      console.error("Failed to load history:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (window.confirm(t('confirmDelete') || "Bạn có chắc chắn muốn xóa cuộc trò chuyện này?")) {
      await deleteSession(id);
      setSessions(prev => prev.filter(s => s.id !== id));
    }
  };

  const handleClearAll = async () => {
    if (window.confirm("CẢNH BÁO: Xóa toàn bộ lịch sử trò chuyện? Hành động này không thể hoàn tác!")) {
      await clearAllSessions();
      setSessions([]);
    }
  };

  // --- LOGIC TÌM KIẾM VÀ PHÂN LOẠI THỜI GIAN ---
  const filteredAndGroupedSessions = useMemo(() => {
    const filtered = sessions.filter(s => 
      (s.title?.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (s.preview?.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const groups: Record<string, ChatSession[]> = {
      'Today': [],
      'Yesterday': [],
      'Previous 7 Days': [],
      'Older': []
    };

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    const yesterday = today - 86400000;
    const sevenDaysAgo = today - 86400000 * 7;

    filtered.forEach(session => {
      const time = session.lastModified;
      if (time >= today) groups['Today'].push(session);
      else if (time >= yesterday) groups['Yesterday'].push(session);
      else if (time >= sevenDaysAgo) groups['Previous 7 Days'].push(session);
      else groups['Older'].push(session);
    });

    return groups;
  }, [sessions, searchTerm]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="absolute inset-0" onClick={onClose}></div>

      <div className="relative bg-slate-900/90 border border-white/10 w-full max-w-md rounded-3xl shadow-2xl flex flex-col max-h-[85vh] z-10 animate-in zoom-in-95 duration-300 overflow-hidden">
        
        {/* Header với Gradient mờ */}
        <div className="p-6 border-b border-white/5 bg-gradient-to-b from-slate-800/50 to-transparent">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-500/20 rounded-xl">
                <Clock size={20} className="text-indigo-400" />
              </div>
              <h2 className="text-xl font-bold text-white tracking-tight">
                {t('history_title') || "Chat History"}
              </h2>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full text-slate-400 hover:text-white transition-all">
              <X size={20} />
            </button>
          </div>

          {/* Thanh tìm kiếm Vip Pro */}
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors" size={16} />
            <input 
              type="text"
              placeholder="Tìm kiếm nội dung chat..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-950/50 border border-white/5 rounded-xl py-2.5 pl-10 pr-4 text-sm text-slate-200 focus:ring-2 focus:ring-indigo-500/50 outline-none transition-all placeholder:text-slate-600"
            />
          </div>
        </div>

        {/* Danh sách Sessions */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar">
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="w-8 h-8 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
            </div>
          ) : sessions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-slate-500 gap-4">
              <div className="p-4 bg-slate-800/50 rounded-full">
                <Ghost size={48} strokeWidth={1} className="opacity-20" />
              </div>
              <p className="text-sm font-medium">{t('no_history') || "Chưa có lịch sử trò chuyện"}</p>
            </div>
          ) : (
            Object.entries(filteredAndGroupedSessions).map(([groupName, groupSessions]) => (
              groupSessions.length > 0 && (
                <div key={groupName} className="space-y-2">
                  <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-2 mb-3 flex items-center gap-2">
                    <Hash size={10} /> {groupName}
                  </h4>
                  {groupSessions.map((session) => (
                    <div
                      key={session.id}
                      onClick={() => { onSelectSession(session); onClose(); }}
                      className={`group relative p-4 rounded-2xl border transition-all duration-300 ${
                        currentSessionId === session.id
                          ? 'bg-indigo-600/20 border-indigo-500/50 shadow-lg shadow-indigo-500/10'
                          : 'bg-white/5 border-transparent hover:bg-white/10'
                      }`}
                    >
                      <div className="flex justify-between items-start gap-4">
                        <div className="flex-1 min-w-0">
                          <h3 className={`text-sm font-bold truncate mb-1 ${currentSessionId === session.id ? 'text-indigo-300' : 'text-slate-100'}`}>
                            {session.title || t('untitled_chat') || "Cuộc trò chuyện mới"}
                          </h3>
                          <p className="text-xs text-slate-400 line-clamp-1 opacity-70 mb-2">
                            {session.preview || "Không có nội dung xem trước..."}
                          </p>
                          <div className="flex items-center gap-2 text-[10px] text-slate-500 font-mono">
                              <Calendar size={10} />
                              {new Date(session.lastModified).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                              <span className="opacity-30">|</span>
                              {new Date(session.lastModified).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </div>
                        
                        <button
                          onClick={(e) => handleDelete(e, session.id)}
                          className="p-2 text-slate-600 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all opacity-0 group-hover:opacity-100"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )
            ))
          )}
        </div>

        {/* Footer: Nút dọn dẹp bộ nhớ */}
        {sessions.length > 5 && (
          <div className="p-4 bg-slate-950/50 border-t border-white/5">
            <button 
              onClick={handleClearAll}
              className="w-full py-2.5 rounded-xl text-xs font-bold text-slate-500 hover:text-red-400 hover:bg-red-500/5 transition-all flex items-center justify-center gap-2"
            >
              <Trash size={14} /> Dọn dẹp toàn bộ lịch sử
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default HistoryModal;