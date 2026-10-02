import React, { useState } from 'react';
import { useHabit } from '../context/HabitContext';

export const Header: React.FC = () => {
  const { user, isOffline, pendingQueue, syncing, triggerSync, setActiveTab } = useHabit();
  const [showNotifications, setShowNotifications] = useState(false);

  const notifications = [
    {
      id: 1,
      title: 'Елена выполнила цель дня!',
      time: '15 минут назад',
      icon: 'emoji_events',
      color: 'text-amber-500',
    },
    {
      id: 2,
      title: 'Стрик 14 дней подряд активен',
      time: '2 часа назад',
      icon: 'local_fire_department',
      color: 'text-rose-500',
    },
    {
      id: 3,
      title: 'Облачный бэкап сохранен',
      time: '04:30',
      icon: 'cloud_done',
      color: 'text-emerald-500',
    },
  ];

  return (
    <header className="sticky top-0 w-full z-40 bg-[#faf8ff]/85 backdrop-blur-xl border-b border-slate-200/50">
      <div className="h-16 px-4 md:px-6 flex items-center justify-between max-w-5xl mx-auto">
        {/* Brand Zone */}
        <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => setActiveTab('today')}>
          <div className="w-9 h-9 rounded-xl bg-[#4648d4] text-white flex items-center justify-center shadow-[0_4px_12px_rgba(70,72,212,0.25)]">
            <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
              bolt
            </span>
          </div>
          <div className="flex flex-col">
            <span className="font-headline font-bold text-lg text-[#131b2e] tracking-tight leading-none">
              HabitSpark
            </span>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="text-[11px] font-semibold text-[#464554] tracking-wide uppercase">Today</span>
              <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-emerald-100 text-emerald-800 font-medium">
                {isOffline ? 'Офлайн-режим' : 'Синхронизировано'}
              </span>
            </div>
          </div>
        </div>

        {/* Action Zone */}
        <div className="flex items-center gap-2 relative">
          {/* Cloud Sync Status Icon */}
          <button
            onClick={triggerSync}
            disabled={syncing || isOffline}
            title={
              isOffline
                ? 'Офлайн режим (изменения копятся в очереди)'
                : pendingQueue.length > 0
                ? `В очереди ${pendingQueue.length} действий. Нажмите для синхронизации.`
                : 'Синхронизировано с облаком'
            }
            className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
              isOffline
                ? 'bg-amber-100 text-amber-700'
                : pendingQueue.length > 0
                ? 'bg-indigo-100 text-[#4648d4] animate-bounce'
                : 'hover:bg-slate-100 text-slate-500'
            }`}
          >
            <span
              className={`material-symbols-outlined text-[19px] ${syncing ? 'animate-spin text-[#4648d4]' : ''}`}
            >
              {isOffline ? 'cloud_off' : pendingQueue.length > 0 ? 'cloud_sync' : 'cloud_done'}
            </span>
          </button>

          {/* Notifications Button */}
          <div className="relative">
            <button
              aria-label="Уведомления"
              onClick={() => setShowNotifications(!showNotifications)}
              className="w-10 h-10 rounded-full flex items-center justify-center text-[#464554] hover:bg-slate-200/50 transition-colors relative"
            >
              <span className="material-symbols-outlined text-[22px]">notifications</span>
              <span className="absolute top-2 right-2 w-2 h-2 bg-[#aa2f13] rounded-full ring-2 ring-white"></span>
            </button>

            {/* Notifications Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-slate-100 p-3 z-50 animate-pop-check">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <span className="font-semibold text-xs text-[#131b2e]">Уведомления</span>
                  <span className="text-[10px] text-[#4648d4] font-medium cursor-pointer">Прочитаны</span>
                </div>
                <div className="divide-y divide-slate-50 mt-1 max-h-60 overflow-y-auto">
                  {notifications.map((n) => (
                    <div key={n.id} className="py-2.5 flex items-start gap-2.5">
                      <span className={`material-symbols-outlined text-[18px] ${n.color} mt-0.5`}>
                        {n.icon}
                      </span>
                      <div className="flex-1">
                        <p className="text-xs text-[#131b2e] leading-snug">{n.title}</p>
                        <span className="text-[10px] text-slate-400">{n.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* User Profile Avatar with Online indicator */}
          <button
            onClick={() => setActiveTab('sync')}
            title="Профиль и Синхронизация"
            className="relative flex items-center focus:outline-none"
          >
            <div className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-[#4648d4]/30 hover:ring-[#4648d4] transition-all bg-indigo-50 shadow-sm">
              <img
                src={user?.avatar || '/src/assets/images/alex_avatar_1790855720780.jpg'}
                alt={user?.name || 'User'}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            </div>
            <span
              className={`absolute bottom-0 right-0 w-3 h-3 rounded-full ring-2 ring-white ${
                isOffline ? 'bg-amber-500' : 'bg-[#006c49]'
              }`}
            />
          </button>
        </div>
      </div>
    </header>
  );
};
