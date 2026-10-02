import React, { useState } from 'react';
import { useHabit } from '../context/HabitContext';

export const SocialView: React.FC = () => {
  const { leaderboard, sharedHabits, joinSharedHabit, user, switchUser } = useHabit();
  const [socialTab, setSocialTab] = useState<'leaderboard' | 'shared'>('leaderboard');

  return (
    <div className="flex flex-col gap-5 px-4 md:px-6 pb-28 pt-3 max-w-xl mx-auto w-full">
      {/* Title & Tab Switcher */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-headline text-2xl font-bold text-[#131b2e]">Сообщество & Стрики</h1>
          <p className="text-xs text-[#464554] mt-0.5">Соревнуйтесь и формируйте привычки вместе</p>
        </div>
      </div>

      {/* Segmented Control */}
      <div className="flex items-center p-1 bg-[#eaedff] rounded-2xl">
        <button
          onClick={() => setSocialTab('leaderboard')}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
            socialTab === 'leaderboard'
              ? 'bg-[#4648d4] text-white shadow-md'
              : 'text-[#464554] hover:text-[#131b2e]'
          }`}
        >
          <span className="material-symbols-outlined text-[16px]">leaderboard</span>
          <span>Лидерборд друзей</span>
        </button>
        <button
          onClick={() => setSocialTab('shared')}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
            socialTab === 'shared'
              ? 'bg-[#4648d4] text-white shadow-md'
              : 'text-[#464554] hover:text-[#131b2e]'
          }`}
        >
          <span className="material-symbols-outlined text-[16px]">groups</span>
          <span>Общие привычки ({sharedHabits.length})</span>
        </button>
      </div>

      {socialTab === 'leaderboard' ? (
        <div className="flex flex-col gap-4">
          {/* Top 3 Podium Cards */}
          <div className="grid grid-cols-3 gap-2.5 items-end pt-4 pb-2">
            {/* Rank 2 - Alex */}
            {leaderboard[1] && (
              <div
                onClick={() => switchUser(leaderboard[1].id)}
                className={`flex flex-col items-center p-3 rounded-2xl bg-white shadow-sm border transition-all cursor-pointer ${
                  leaderboard[1].is_current_user
                    ? 'border-[#4648d4] ring-2 ring-[#4648d4]/20'
                    : 'border-slate-100 hover:border-slate-300'
                }`}
              >
                <div className="relative">
                  <div className="w-12 h-12 rounded-full overflow-hidden shadow-sm">
                    <img
                      src={leaderboard[1].avatar}
                      alt={leaderboard[1].name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-slate-300 text-slate-800 text-[10px] font-bold flex items-center justify-center ring-2 ring-white">
                    2
                  </span>
                </div>
                <span className="text-xs font-bold text-[#131b2e] mt-2 text-center truncate max-w-full">
                  {leaderboard[1].name}
                </span>
                <span className="text-[11px] font-mono-numbers font-extrabold text-[#aa2f13] flex items-center gap-0.5 mt-0.5">
                  🔥 {leaderboard[1].streak} дн
                </span>
              </div>
            )}

            {/* Rank 1 - Elena */}
            {leaderboard[0] && (
              <div
                onClick={() => switchUser(leaderboard[0].id)}
                className={`flex flex-col items-center p-3.5 rounded-2xl bg-gradient-to-b from-amber-50 to-white shadow-md border transition-all cursor-pointer relative -translate-y-2 ${
                  leaderboard[0].is_current_user
                    ? 'border-amber-400 ring-2 ring-amber-300/30'
                    : 'border-amber-200 hover:border-amber-300'
                }`}
              >
                <span className="absolute -top-3 text-lg">👑</span>
                <div className="relative mt-1">
                  <div className="w-14 h-14 rounded-full overflow-hidden shadow-md ring-2 ring-amber-400">
                    <img
                      src={leaderboard[0].avatar}
                      alt={leaderboard[0].name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-amber-400 text-amber-950 text-[10px] font-extrabold flex items-center justify-center ring-2 ring-white">
                    1
                  </span>
                </div>
                <span className="text-xs font-bold text-[#131b2e] mt-2 text-center truncate max-w-full">
                  {leaderboard[0].name}
                </span>
                <span className="text-xs font-mono-numbers font-extrabold text-[#aa2f13] flex items-center gap-0.5 mt-0.5">
                  🔥 {leaderboard[0].streak} дн
                </span>
              </div>
            )}

            {/* Rank 3 - Dmitry */}
            {leaderboard[2] && (
              <div
                onClick={() => switchUser(leaderboard[2].id)}
                className={`flex flex-col items-center p-3 rounded-2xl bg-white shadow-sm border transition-all cursor-pointer ${
                  leaderboard[2].is_current_user
                    ? 'border-[#4648d4] ring-2 ring-[#4648d4]/20'
                    : 'border-slate-100 hover:border-slate-300'
                }`}
              >
                <div className="relative">
                  <div className="w-12 h-12 rounded-full overflow-hidden shadow-sm">
                    <img
                      src={leaderboard[2].avatar}
                      alt={leaderboard[2].name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-amber-700 text-white text-[10px] font-bold flex items-center justify-center ring-2 ring-white">
                    3
                  </span>
                </div>
                <span className="text-xs font-bold text-[#131b2e] mt-2 text-center truncate max-w-full">
                  {leaderboard[2].name}
                </span>
                <span className="text-[11px] font-mono-numbers font-extrabold text-[#aa2f13] flex items-center gap-0.5 mt-0.5">
                  🔥 {leaderboard[2].streak} дн
                </span>
              </div>
            )}
          </div>

          <div className="text-[11px] text-center text-slate-400 -mt-1">
            💡 Нажмите на пользователя в лидерборде, чтобы переключить профиль для теста
          </div>

          {/* Full Leaderboard List */}
          <div className="bg-white rounded-3xl p-4 shadow-sm border border-slate-100 divide-y divide-slate-100">
            {leaderboard.map((item) => (
              <div
                key={item.id}
                onClick={() => switchUser(item.id)}
                className={`py-3 flex items-center justify-between gap-3 cursor-pointer hover:bg-slate-50 rounded-xl px-2 transition-colors ${
                  item.is_current_user ? 'bg-indigo-50/60' : ''
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="font-headline font-extrabold text-sm w-5 text-center text-[#464554]">
                    #{item.rank}
                  </span>
                  <div className="w-10 h-10 rounded-full overflow-hidden shadow-sm">
                    <img src={item.avatar} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-bold text-[#131b2e]">{item.name}</span>
                      {item.is_current_user && (
                        <span className="text-[10px] bg-[#4648d4] text-white px-1.5 py-0.2 rounded-full font-bold">
                          Вы
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-[#464554]">{item.badge}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-right">
                  <div className="flex flex-col items-end">
                    <span className="font-headline font-bold text-xs text-[#131b2e] font-mono-numbers">
                      {item.consistency_pct}%
                    </span>
                    <span className="text-[10px] text-slate-400">регулярность</span>
                  </div>
                  <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#ffdad2] text-[#aa2f13] text-xs font-bold font-mono-numbers">
                    <span>🔥</span>
                    <span>{item.streak}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* Shared Habits (Общие привычки с друзьями) */
        <div className="flex flex-col gap-4">
          <div className="bg-[#eaedff] p-4 rounded-2xl text-xs text-[#464554] leading-relaxed">
            🤝 <strong>Общие привычки</strong> позволяют объединяться в челленджи с друзьями. Вы видите
            общий прогресс и поддерживаете друг друга каждый день!
          </div>

          <div className="flex flex-col gap-3">
            {sharedHabits.map((sh) => (
              <div
                key={sh.id}
                className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100 flex flex-col gap-3 hover:shadow-md transition-all"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-sm flex-shrink-0"
                      style={{ backgroundColor: sh.color }}
                    >
                      <span className="material-symbols-outlined text-[24px]">{sh.icon}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-headline font-bold text-sm text-[#131b2e]">{sh.title}</span>
                      <div className="flex items-center gap-2 mt-0.5 text-xs text-[#464554]">
                        <span>{sh.category}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <span className="material-symbols-outlined text-[13px]">group</span>
                          <span>{sh.participants_count} участников</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => joinSharedHabit(sh.id)}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all shadow-sm ${
                      sh.joined
                        ? 'bg-emerald-100 text-[#006c49] border border-emerald-300'
                        : 'bg-[#4648d4] text-white hover:bg-[#3a3bc4]'
                    }`}
                  >
                    {sh.joined ? '✓ Участвуете' : '+ Вступить'}
                  </button>
                </div>

                <p className="text-xs text-[#464554] leading-relaxed">{sh.description}</p>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs text-[#464554]">
                  <span>Средняя результативность группы:</span>
                  <span className="font-bold text-[#006c49] font-mono-numbers">
                    {sh.avg_completion_rate}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
