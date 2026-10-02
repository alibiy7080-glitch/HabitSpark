import React from 'react';
import { useHabit } from '../context/HabitContext';

export const BottomNav: React.FC = () => {
  const { activeTab, setActiveTab, setShowNewHabitModal, pendingQueue } = useHabit();

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 pb-safe pointer-events-none px-4 mb-2 max-w-xl mx-auto">
      <nav className="pointer-events-auto bg-white/90 backdrop-blur-xl rounded-3xl shadow-[0_12px_36px_rgba(70,72,212,0.14),0_2px_8px_rgba(0,0,0,0.04)] px-2 py-1.5 flex items-center justify-around border border-slate-100">
        {/* Tab 1: Сегодня */}
        <button
          onClick={() => setActiveTab('today')}
          className={`flex flex-col items-center justify-center min-w-[54px] min-h-[46px] py-1 transition-colors ${
            activeTab === 'today' ? 'text-[#4648d4] font-bold' : 'text-[#464554]'
          }`}
        >
          <span
            className="material-symbols-outlined text-[24px]"
            style={activeTab === 'today' ? { fontVariationSettings: "'FILL' 1" } : {}}
          >
            check_circle
          </span>
          <span className="text-[10px] font-semibold tracking-tight mt-0.5">Сегодня</span>
        </button>

        {/* Tab 2: Статистика */}
        <button
          onClick={() => setActiveTab('analytics')}
          className={`flex flex-col items-center justify-center min-w-[54px] min-h-[46px] py-1 transition-colors ${
            activeTab === 'analytics' ? 'text-[#4648d4] font-bold' : 'text-[#464554]'
          }`}
        >
          <span
            className="material-symbols-outlined text-[24px]"
            style={activeTab === 'analytics' ? { fontVariationSettings: "'FILL' 1" } : {}}
          >
            equalizer
          </span>
          <span className="text-[10px] font-semibold tracking-tight mt-0.5">Статистика</span>
        </button>

        {/* Center Primary Action FAB (+) */}
        <div className="relative flex items-center justify-center px-1">
          <button
            onClick={() => setShowNewHabitModal(true)}
            aria-label="Добавить новую привычку"
            className="w-12 h-12 rounded-full bg-[#4648d4] hover:bg-[#3a3bc4] flex items-center justify-center text-white shadow-[0_6px_18px_rgba(70,72,212,0.4)] active:scale-95 transition-transform"
          >
            <span className="material-symbols-outlined text-[26px]">add</span>
          </button>
        </div>

        {/* Tab 3: Стрики & Сообщество */}
        <button
          onClick={() => setActiveTab('social')}
          className={`flex flex-col items-center justify-center min-w-[54px] min-h-[46px] py-1 transition-colors ${
            activeTab === 'social' ? 'text-[#4648d4] font-bold' : 'text-[#464554]'
          }`}
        >
          <span
            className="material-symbols-outlined text-[24px]"
            style={activeTab === 'social' ? { fontVariationSettings: "'FILL' 1" } : {}}
          >
            local_fire_department
          </span>
          <span className="text-[10px] font-semibold tracking-tight mt-0.5">Стрики</span>
        </button>

        {/* Tab 4: Профиль & Синхронизация */}
        <button
          onClick={() => setActiveTab('sync')}
          className={`flex flex-col items-center justify-center min-w-[54px] min-h-[46px] py-1 transition-colors relative ${
            activeTab === 'sync' ? 'text-[#4648d4] font-bold' : 'text-[#464554]'
          }`}
        >
          <span
            className="material-symbols-outlined text-[24px]"
            style={activeTab === 'sync' ? { fontVariationSettings: "'FILL' 1" } : {}}
          >
            tune
          </span>
          <span className="text-[10px] font-semibold tracking-tight mt-0.5">Облако</span>
          {pendingQueue.length > 0 && (
            <span className="absolute top-1 right-2 w-2 h-2 rounded-full bg-amber-500 ring-2 ring-white"></span>
          )}
        </button>
      </nav>
    </div>
  );
};
