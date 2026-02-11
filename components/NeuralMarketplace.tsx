import React from 'react';
import { ShoppingCart, Star, Sparkles, Zap, Lock } from 'lucide-react';

const NeuralMarketplace: React.FC = () => {
  const skins = [
    { id: 1, name: 'Tsundere AI', price: 500, rarity: 'Epic', color: 'from-pink-500 to-rose-600' },
    { id: 2, name: 'Cyber Investigator', price: 1200, rarity: 'Legendary', color: 'from-cyan-500 to-blue-600' },
    { id: 3, name: 'Ancient Philosopher', price: 300, rarity: 'Rare', color: 'from-amber-500 to-orange-600' }
  ];

  return (
    <div className="p-6 bg-slate-900/60 backdrop-blur-2xl border border-white/10 rounded-[3rem] shadow-2xl">
      <div className="flex justify-between items-center mb-8 px-2">
        <div>
          <h3 className="text-xl font-black text-white italic tracking-tighter uppercase">Soul Market</h3>
          <p className="text-[9px] text-indigo-400 font-bold uppercase tracking-[0.3em]">Unlock New Dimensions</p>
        </div>
        <div className="p-3 bg-indigo-600 rounded-2xl shadow-lg shadow-indigo-600/20">
          <ShoppingCart size={20} className="text-white" />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {skins.map(skin => (
          <div key={skin.id} className="group relative p-4 rounded-[2rem] bg-black/40 border border-white/5 hover:border-indigo-500/50 transition-all overflow-hidden">
            <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${skin.color} opacity-10 blur-3xl group-hover:opacity-30 transition-opacity`} />
            
            <div className="flex items-center justify-between relative z-10">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${skin.color} flex items-center justify-center shadow-lg`}>
                  <Sparkles className="text-white" size={20} />
                </div>
                <div>
                  <h4 className="text-sm font-black text-white uppercase tracking-tight">{skin.name}</h4>
                  <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">{skin.rarity} Persona</span>
                </div>
              </div>
              <button className="px-5 py-2 bg-white/5 hover:bg-indigo-600 rounded-xl text-[10px] font-black text-white transition-all border border-white/10">
                {skin.price} 🌙
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NeuralMarketplace;