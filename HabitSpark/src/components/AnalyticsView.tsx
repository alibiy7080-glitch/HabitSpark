import React, { useState } from 'react';
import { useHabit } from '../context/HabitContext';

export const AnalyticsView: React.FC = () => {
  const { user, habits, globalStats } = useHabit();
  const [timeframe, setTimeframe] = useState<'week' | 'month' | 'year'>('month');

  // Heatmap mock data for 4 weeks x 7 days
  const daysOfWeek = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
  const weeksData = [
    [3, 4, 2, 4, 3, 2, 1], // Week 1 (earlier)
    [4, 4, 4, 3, 2, 3, 2], // Week 2
    [4, 4, 4, 4, 3, 4, 3], // Week 3
    [4, 4, 4, 4, 0, 0, 0], // Week 4 (current week, Mon-Thu active)
  ];

  const getHeatmapColor = (level: number) => {
    switch (level) {
      case 4:
        return 'bg-[#006c49] text-white shadow-sm shadow-emerald-600/30';
      case 3:
        return 'bg-[#10b981] text-white';
      case 2:
        return 'bg-[#6cf8bb] text-[#002113]';
      case 1:
        return 'bg-[#d2d9f4] text-[#131b2e]';
      default:
        return 'bg-slate-100 text-slate-400';
    }
  };

  const categoriesStats = [
    { name: 'Здоровье', pct: 92, count: 2, color: 'bg-[#006c49]' },
    { name: 'Осознанность', pct: 85, count: 1, color: 'bg-[#4648d4]' },
    { name: 'Саморазвитие', pct: 75, count: 1, color: 'bg-[#6063ee]' },
    { name: 'Спорт', pct: 60, count: 1, color: 'bg-[#cd4729]' },
    { name: 'Обучение', pct: 50, count: 1, color: 'bg-amber-500' },
  ];

  return (
    <div className="flex flex-col gap-5 px-4 md:px-6 pb-28 pt-3 max-w-xl mx-auto w-full">
      {/* Title & Timeframe Selector */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-headline text-2xl font-bold text-[#131b2e]">Статистика</h1>
          <p className="text-xs text-[#464554] mt-0.5">Динамика прогресса и регулярности</p>
        </div>

        <div className="flex items-center gap-1 bg-[#eaedff] p-1 rounded-xl">
          <button
            onClick={() => setTimeframe('week')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
              timeframe === 'week' ? 'bg-[#4648d4] text-white shadow-sm' : 'text-[#464554]'
            }`}
          >
            Неделя
          </button>
          <button
            onClick={() => setTimeframe('month')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
              timeframe === 'month' ? 'bg-[#4648d4] text-white shadow-sm' : 'text-[#464554]'
            }`}
          >
            Месяц
          </button>
          <button
            onClick={() => setTimeframe('year')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
              timeframe === 'year' ? 'bg-[#4648d4] text-white shadow-sm' : 'text-[#464554]'
            }`}
          >
            Год
          </button>
        </div>
      </div>

      {/* 4 Metric Summary Cards */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold text-[#464554]">Текущий стрик</span>
            <span
              className="material-symbols-outlined text-[18px] text-[#aa2f13]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              local_fire_department
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="font-headline text-3xl font-extrabold text-[#131b2e] font-mono-numbers">
              {user?.streak || 14}
            </span>
            <span className="text-xs text-[#464554]">дней подряд</span>
          </div>
          <span className="text-[10px] text-emerald-600 font-semibold mt-1">▲ +4 дня к прошлой неделе</span>
        </div>

        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold text-[#464554]">Рекорд стрика</span>
            <span className="material-symbols-outlined text-[18px] text-amber-500">military_tech</span>
          </div>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="font-headline text-3xl font-extrabold text-[#131b2e] font-mono-numbers">
              28
            </span>
            <span className="text-xs text-[#464554]">дней</span>
          </div>
          <span className="text-[10px] text-slate-400 mt-1">Установлен в августе</span>
        </div>

        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold text-[#464554]">Дисциплина (30д)</span>
            <span className="material-symbols-outlined text-[18px] text-[#4648d4]">auto_graph</span>
          </div>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="font-headline text-3xl font-extrabold text-[#4648d4] font-mono-numbers">
              88%
            </span>
            <span className="text-xs text-[#464554]">индекс</span>
          </div>
          <span className="text-[10px] text-emerald-600 font-semibold mt-1">Топ 15% среди друзей</span>
        </div>

        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold text-[#464554]">Всего закрыто</span>
            <span className="material-symbols-outlined text-[18px] text-[#006c49]">task_alt</span>
          </div>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="font-headline text-3xl font-extrabold text-[#131b2e] font-mono-numbers">
              138
            </span>
            <span className="text-xs text-[#464554]">раз</span>
          </div>
          <span className="text-[10px] text-slate-400 mt-1">За текущий месяц</span>
        </div>
      </div>

      {/* Heatmap Activity Matrix */}
      <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100">
        <div className="flex items-center justify-between mb-3">
          <div>
            <span className="font-headline font-bold text-base text-[#131b2e]">Тепловая карта активности</span>
            <p className="text-xs text-[#464554] mt-0.5">Октябрь 2024</p>
          </div>
          <div className="flex items-center gap-1 text-[10px] text-[#464554]">
            <span>Меньше</span>
            <span className="w-2.5 h-2.5 rounded bg-slate-100 inline-block" />
            <span className="w-2.5 h-2.5 rounded bg-[#6cf8bb] inline-block" />
            <span className="w-2.5 h-2.5 rounded bg-[#006c49] inline-block" />
            <span>Больше</span>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-2 text-center text-xs font-semibold text-slate-400 mb-2">
          {daysOfWeek.map((d) => (
            <span key={d}>{d}</span>
          ))}
        </div>

        <div className="flex flex-col gap-2">
          {weeksData.map((week, wIdx) => (
            <div key={wIdx} className="grid grid-cols-7 gap-2">
              {week.map((level, dIdx) => (
                <div
                  key={dIdx}
                  className={`h-9 rounded-xl flex items-center justify-center font-bold text-xs transition-all ${getHeatmapColor(
                    level
                  )}`}
                  title={`Неделя ${wIdx + 1}, День ${dIdx + 1}: Уровень ${level}`}
                >
                  {level > 0 ? `${level}/4` : '·'}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Category Breakdown */}
      <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100">
        <span className="font-headline font-bold text-base text-[#131b2e]">
          Успеваемость по категориям
        </span>
        <div className="flex flex-col gap-3.5 mt-4">
          {categoriesStats.map((cat) => (
            <div key={cat.name} className="flex flex-col gap-1.5">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-[#131b2e]">{cat.name}</span>
                <span className="font-mono-numbers font-semibold text-[#464554]">{cat.pct}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                <div
                  className={`h-full rounded-full ${cat.color} transition-all duration-700`}
                  style={{ width: `${cat.pct}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Global Community Benchmark */}
      {globalStats && (
        <div className="bg-gradient-to-br from-[#4648d4] to-[#6063ee] p-5 rounded-3xl text-white shadow-lg shadow-indigo-500/20">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[20px] text-amber-300">public</span>
            <span className="text-xs uppercase font-bold tracking-wider text-indigo-100">
              Глобальная статистика сообщества
            </span>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-3">
            <div>
              <div className="text-2xl font-extrabold font-mono-numbers">
                {globalStats.total_completions_today.toLocaleString()}
              </div>
              <div className="text-xs text-indigo-100">Выполнений сегодня в мире</div>
            </div>
            <div>
              <div className="text-2xl font-extrabold font-mono-numbers">
                {globalStats.community_avg_streak} дней
              </div>
              <div className="text-xs text-indigo-100">Средний стрик пользователей</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
