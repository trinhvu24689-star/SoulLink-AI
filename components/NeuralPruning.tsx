import React, { useState } from 'react';
import { Trash2, Scissors, CheckSquare, Square, AlertTriangle, Database } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const NeuralPruning: React.FC = () => {
  const { user } = useAuth();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  
  if (user?.role !== 'admin') return null;

  const mockSessions = [
    { id: '1', title: 'Hỏi về Code Python', date: '2026-02-10', size: '12kb' },
    { id: '2', title: 'Tâm sự đêm khuya', date: '2026-02-09', size: '45kb' },
    { id: '3', title: 'Test API FaceSwap', date: '2026-02-08', size: '8kb' },
  ];

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  return (
    <div className="p-8 bg-slate-900/90 border border-red-500/20 rounded-[3rem] backdrop-blur-3xl shadow-2xl">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-red-600 rounded-2xl shadow-lg shadow-red-600/20 animate-pulse">
            <Scissors className="text-white" size={24} />
          </div>
          <div>
            <h3 className="text-xl font-black text-white tracking-tighter uppercase italic">Neural Pruning</h3>
            <p className="text-[10px] text-red-400 font-bold uppercase tracking-[0.3em]">Selective Database Optimization</p>
          </div>
        </div>
        <div className="text-right">
          <span className="block text-[10px] font-black text-slate-500 uppercase italic">Selected</span>
          <span className="text-2xl font-mono font-black text-red-500">{selectedIds.length}</span>
        </div>
      </div>

      <div className="space-y-3 mb-8 max-h-64 overflow-y-auto custom-scrollbar pr-2">
        {mockSessions.map(session => (
          <div 
            key={session.id}
            onClick={() => toggleSelect(session.id)}
            className={`p-4 rounded-2xl border transition-all cursor-pointer flex justify-between items-center ${selectedIds.includes(session.id) ? 'bg-red-500/10 border-red-500/50 shadow-lg' : 'bg-black/40 border-white/5 hover:border-white/20'}`}
          >
            <div className="flex items-center gap-4">
              {selectedIds.includes(session.id) ? <CheckSquare className="text-red-500" size={18} /> : <Square className="text-slate-600" size={18} />}
              <div>
                <p className="text-sm font-bold text-white uppercase tracking-tight">{session.title}</p>
                <p className="text-[10px] text-slate-500 font-mono">{session.date} • {session.size}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <button 
        disabled={selectedIds.length === 0}
        className="w-full py-4 bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.4em] shadow-xl shadow-red-900/20 transition-all disabled:opacity-30 flex items-center justify-center gap-3"
      >
        <Trash2 size={16} /> Execute Selective Pruning
      </button>
    </div>
  );
};