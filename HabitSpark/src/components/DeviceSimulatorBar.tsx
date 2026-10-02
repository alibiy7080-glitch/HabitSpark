import React from 'react';
import { useHabit, DeviceMode } from '../context/HabitContext';

export const DeviceSimulatorBar: React.FC = () => {
  const {
    deviceMode,
    setDeviceMode,
    isOffline,
    setIsOffline,
    pendingQueue,
    syncing,
    triggerSync,
    setShowArchitectureModal,
    user,
    switchUser,
  } = useHabit();

  return (
    <div className="bg-[#131b2e] text-white text-xs border-b border-white/10 px-3 py-2 z-50 transition-all select-none">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
        {/* Device Switcher */}
        <div className="flex items-center gap-1.5 bg-white/10 p-0.5 rounded-lg">
          <span className="text-[11px] text-slate-400 px-1 font-medium hidden sm:inline">Девайс:</span>
          <button
            onClick={() => setDeviceMode('phone')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all ${
              deviceMode === 'phone'
                ? 'bg-[#4648d4] text-white shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
            title="Вид смартфона (390px)"
          >
            <span className="material-symbols-outlined text-[14px]">smartphone</span>
            <span>Смартфон</span>
          </button>
          <button
            onClick={() => setDeviceMode('tablet')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all ${
              deviceMode === 'tablet'
                ? 'bg-[#4648d4] text-white shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
            title="Вид планшета (iPad 768px)"
          >
            <span className="material-symbols-outlined text-[14px]">tablet_mac</span>
            <span>Планшет</span>
          </button>
          <button
            onClick={() => setDeviceMode('desktop')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all ${
              deviceMode === 'desktop'
                ? 'bg-[#4648d4] text-white shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
            title="Широкий экран (Web Desktop)"
          >
            <span className="material-symbols-outlined text-[14px]">laptop_mac</span>
            <span>Десктоп</span>
          </button>
        </div>

        {/* Network State & Offline Simulator */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsOffline(!isOffline)}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-[11px] font-semibold transition-all ${
              isOffline
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
            }`}
            title="Переключить сеть для симуляции в метро/самолете"
          >
            <span
              className={`w-2 h-2 rounded-full ${
                isOffline ? 'bg-amber-400 animate-pulse' : 'bg-emerald-400'
              }`}
            />
            <span>{isOffline ? 'Офлайн (в метро)' : 'Облако Онлайн'}</span>
            <span className="text-[10px] opacity-70 underline ml-0.5">
              {isOffline ? 'Включить' : 'Тест офлайна'}
            </span>
          </button>

          {/* Pending Sync Queue Badge */}
          {pendingQueue.length > 0 && (
            <button
              onClick={triggerSync}
              disabled={syncing || isOffline}
              className="flex items-center gap-1 px-2 py-1 bg-[#4648d4]/30 border border-[#4648d4] text-indigo-200 rounded-lg text-[11px] hover:bg-[#4648d4] hover:text-white transition-all disabled:opacity-50"
            >
              <span className={`material-symbols-outlined text-[13px] ${syncing ? 'animate-spin' : ''}`}>
                sync
              </span>
              <span>Очередь: {pendingQueue.length}</span>
            </button>
          )}

          {/* Architecture & DB schema quick link */}
          <button
            onClick={() => setShowArchitectureModal(true)}
            className="flex items-center gap-1 px-2.5 py-1 bg-white/10 hover:bg-white/20 text-slate-200 rounded-lg text-[11px] font-medium transition-all"
          >
            <span className="material-symbols-outlined text-[13px]">database</span>
            <span className="hidden md:inline">Схема БД & REST</span>
          </button>

          {/* User Profile Switcher */}
          <div className="flex items-center gap-1 bg-white/10 px-2 py-0.5 rounded-lg">
            <span className="text-[10px] text-slate-400 hidden lg:inline">Юзер:</span>
            <select
              value={user?.id || 'user-alex'}
              onChange={(e) => switchUser(e.target.value)}
              className="bg-transparent text-white text-[11px] font-medium focus:outline-none cursor-pointer pr-1"
            >
              <option value="user-alex" className="bg-[#131b2e] text-white">
                Алекс (Вы)
              </option>
              <option value="user-elena" className="bg-[#131b2e] text-white">
                Елена (Подруга)
              </option>
              <option value="user-dmitry" className="bg-[#131b2e] text-white">
                Дмитрий (Друг)
              </option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};
