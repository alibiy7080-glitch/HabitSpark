import React, { useState } from 'react';
import { useHabit } from '../context/HabitContext';

export const TodayView: React.FC = () => {
  const {
    user,
    habits,
    selectedDate,
    setSelectedDate,
    selectedCategory,
    setSelectedCategory,
    toggleHabitCheck,
    setShowNewHabitModal,
  } = useHabit();

  const [showWidgetModal, setShowWidgetModal] = useState(false);

  // Week days reference (October 2024 matching mockup)
  const weekDays = [
    { day: 'Пн', num: '21', date: '2024-10-21', hasDot: true },
    { day: 'Вт', num: '22', date: '2024-10-22', hasDot: true },
    { day: 'Ср', num: '23', date: '2024-10-23', hasDot: true },
    { day: 'Чт', num: '24', date: '2024-10-24', hasDot: true },
    { day: 'Пт', num: '25', date: '2024-10-25', hasDot: false },
    { day: 'Сб', num: '26', date: '2024-10-26', hasDot: false },
    { day: 'Вс', num: '27', date: '2024-10-27', hasDot: false },
  ];

  const categories = [
    { id: 'all', label: 'Все', icon: null, count: habits.length },
    { id: 'Утро', label: 'Утро', icon: 'wb_twilight' },
    { id: 'Здоровье', label: 'Здоровье', icon: 'favorite' },
    { id: 'Продуктивность', label: 'Продуктивность', icon: 'psychology' },
    { id: 'Саморазвитие', label: 'Саморазвитие', icon: 'auto_stories' },
    { id: 'Спорт', label: 'Спорт', icon: 'fitness_center' },
  ];

  // Filter habits by category
  const filteredHabits = habits.filter((h) => {
    if (selectedCategory === 'all') return true;
    if (selectedCategory === 'Утро') {
      return h.target_time.includes('08:') || h.target_time.includes('06:') || h.title.includes('Утрен');
    }
    return h.category.toLowerCase().includes(selectedCategory.toLowerCase());
  });

  const completedCount = habits.filter((h) => h.completed).length;
  const totalCount = habits.length;
  const completionPct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
  const remainingCount = totalCount - completedCount;

  // SVG progress ring calculation (circumference 2 * pi * 40 ≈ 251.32)
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (completionPct / 100) * circumference;

  return (
    <div className="flex flex-col gap-5 px-4 md:px-6 pb-28 pt-3 max-w-xl mx-auto w-full">
      {/* Greeting & Motivational Header */}
      <div className="flex items-center justify-between pt-1">
        <div className="flex flex-col">
          <span className="text-xs font-semibold text-[#464554] tracking-wide">
            {selectedDate === '2024-10-24' ? 'Четверг, 24 октября' : `Выбранная дата: ${selectedDate}`}
          </span>
          <h1 className="font-headline text-2xl md:text-3xl font-bold text-[#131b2e] tracking-tight mt-0.5">
            Привет, {user?.name || 'Алекс'}!
          </h1>
          <p className="text-sm text-[#464554] flex items-center gap-1.5 mt-1 font-medium">
            <span>Сегодня отличный день для побед</span>
            <span className="text-[#aa2f13] text-base">🔥</span>
          </p>
        </div>
        <div className="relative flex-shrink-0">
          <div className="w-12 h-12 rounded-full overflow-hidden shadow-sm ring-2 ring-white">
            <img
              src={user?.avatar || '/src/assets/images/alex_avatar_1790855720780.jpg'}
              alt={user?.name || 'Alex'}
              className="w-full h-full object-cover"
            />
          </div>
          <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-[#006c49] rounded-full ring-2 ring-[#faf8ff]"></span>
        </div>
      </div>

      {/* Hero Daily Focus & Ring Progress Card */}
      <div className="relative overflow-hidden rounded-3xl bg-white p-5 shadow-[0_4px_24px_rgba(70,72,212,0.06)] border border-slate-100">
        <div className="flex items-center justify-between gap-4">
          <div className="flex flex-col min-w-0">
            {/* Streak badge */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ffdad2] text-[#3d0600] self-start shadow-sm">
              <span className="material-symbols-outlined text-[15px] fill-1 text-[#aa2f13]">bolt</span>
              <span className="text-xs font-bold font-headline">
                Стрик: {user?.streak || 14} дней подряд
              </span>
            </div>

            <div className="mt-2.5">
              <div className="flex items-baseline gap-1.5 font-mono-numbers">
                <span className="font-headline text-4xl font-extrabold text-[#131b2e] tracking-tight">
                  {completedCount}
                </span>
                <span className="font-headline text-2xl font-bold text-[#464554]">
                  / {totalCount}
                </span>
                <span className="text-sm text-[#464554] ml-1 font-medium">привычек</span>
              </div>
              <p className="text-xs text-[#464554] mt-1 font-medium">
                {remainingCount === 0
                  ? 'Все привычки выполнены! Превосходный день! 🎉'
                  : `Супер-темп! Осталось ${remainingCount} ${
                      remainingCount === 1 ? 'шаг' : remainingCount < 5 ? 'шага' : 'шагов'
                    } до закрытия дня.`}
              </p>
            </div>
          </div>

          {/* Circular Progress Ring */}
          <div className="relative flex items-center justify-center flex-shrink-0 w-24 h-24">
            <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 96 96">
              <circle
                className="text-[#eaedff]"
                cx="48"
                cy="48"
                fill="none"
                r={radius}
                stroke="currentColor"
                strokeWidth="8"
              />
              <circle
                className="text-[#4648d4] transition-all duration-700 ease-out"
                cx="48"
                cy="48"
                fill="none"
                r={radius}
                stroke="currentColor"
                strokeWidth="8"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="font-headline text-xl font-bold text-[#131b2e] leading-none font-mono-numbers">
                {completionPct}%
              </span>
              <span className="text-[10px] uppercase font-bold text-[#464554] tracking-wider mt-1">итог</span>
            </div>
          </div>
        </div>
      </div>

      {/* Weekly Horizontal Strip Calendar */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between px-1">
          <span className="text-sm font-bold text-[#131b2e] font-headline">Эта неделя</span>
          <span className="text-xs font-semibold text-[#4648d4] flex items-center gap-1">
            Октябрь 2024
          </span>
        </div>
        <div className="grid grid-cols-7 gap-1.5 pt-0.5">
          {weekDays.map((item) => {
            const isActive = selectedDate === item.date;
            return (
              <button
                key={item.date}
                onClick={() => setSelectedDate(item.date)}
                className={`flex flex-col items-center py-2.5 rounded-2xl transition-all ${
                  isActive
                    ? 'bg-[#4648d4] text-white shadow-md shadow-[#4648d4]/30 scale-105 z-10'
                    : 'bg-white text-[#131b2e] shadow-sm hover:bg-slate-50 opacity-90'
                }`}
              >
                <span
                  className={`text-[11px] font-semibold ${
                    isActive ? 'text-indigo-200' : 'text-[#464554]'
                  }`}
                >
                  {item.day}
                </span>
                <span
                  className={`text-sm font-bold mt-0.5 font-mono-numbers ${
                    isActive ? 'text-white text-base' : 'text-[#131b2e]'
                  }`}
                >
                  {item.num}
                </span>
                <span
                  className={`w-1.5 h-1.5 rounded-full mt-1 ${
                    isActive ? 'bg-[#6ffbbe]' : item.hasDot ? 'bg-[#006c49]' : 'bg-transparent'
                  }`}
                />
              </button>
            );
          })}
        </div>
      </div>

      {/* Category Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
        {categories.map((cat) => {
          const isActive = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 flex-shrink-0 transition-all ${
                isActive
                  ? 'bg-[#4648d4] text-white shadow-sm'
                  : 'bg-white text-[#464554] shadow-sm hover:bg-slate-50'
              }`}
            >
              {cat.icon && <span className="material-symbols-outlined text-[16px]">{cat.icon}</span>}
              <span>{cat.label}</span>
              {cat.count !== undefined && (
                <span
                  className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                    isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-[#464554]'
                  }`}
                >
                  {cat.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Habit Items List */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between px-1">
          <span className="font-headline font-bold text-lg text-[#131b2e]">План на день</span>
          <span className="text-xs text-[#464554] font-medium">Обновлено 10м назад</span>
        </div>

        {filteredHabits.length === 0 ? (
          <div className="bg-white rounded-2xl p-6 text-center shadow-sm border border-slate-100">
            <span className="material-symbols-outlined text-4xl text-slate-300">task_alt</span>
            <p className="text-sm font-semibold text-[#131b2e] mt-2">Нет привычек в этой категории</p>
            <p className="text-xs text-slate-400 mt-1">Добавьте новую привычку или выберите другую категорию</p>
            <button
              onClick={() => setShowNewHabitModal(true)}
              className="mt-3 px-4 py-2 bg-[#4648d4] text-white text-xs font-semibold rounded-xl hover:bg-[#3a3bc4] transition-all"
            >
              + Создать привычку
            </button>
          </div>
        ) : (
          filteredHabits.map((habit) => (
            <div
              key={habit.id}
              className="flex flex-col p-4 rounded-2xl bg-white shadow-sm hover:shadow-md transition-all border border-slate-100/80 group"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  {/* Category icon */}
                  <div
                    className={`w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0 transition-colors ${
                      habit.completed
                        ? 'bg-emerald-50 text-[#006c49]'
                        : 'bg-[#eaedff] text-[#4648d4]'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[22px]">{habit.icon}</span>
                  </div>

                  {/* Habit info */}
                  <div className="flex flex-col min-w-0">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-sm font-bold text-[#131b2e] truncate ${
                          habit.completed ? 'line-through text-slate-400' : ''
                        }`}
                      >
                        {habit.title}
                      </span>

                      {/* Streak pill */}
                      {habit.streak > 0 && (
                        <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-[#ffdad2] text-[#3d0600] text-[10px] font-bold font-mono-numbers">
                          <span
                            className="material-symbols-outlined text-[12px] text-[#aa2f13]"
                            style={{ fontVariationSettings: "'FILL' 1" }}
                          >
                            local_fire_department
                          </span>
                          {habit.streak}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5 mt-0.5 text-xs text-[#464554]">
                      <span>{habit.category}</span>
                      {habit.target_metric && (
                        <>
                          <span className="text-slate-300">•</span>
                          <span>{habit.target_metric}</span>
                        </>
                      )}
                      <span className="text-slate-300">•</span>
                      <span className="flex items-center gap-0.5">
                        <span className="material-symbols-outlined text-[13px]">alarm</span>
                        <span>{habit.target_time}</span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Tactile Check Button */}
                <button
                  aria-label={habit.completed ? 'Отмечено' : 'Отметить'}
                  onClick={() => toggleHabitCheck(habit.id)}
                  className={`w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0 active:scale-90 transition-all shadow-sm ${
                    habit.completed
                      ? 'bg-[#006c49] text-white shadow-[#006c49]/30 scale-100 animate-pop-check'
                      : 'bg-[#eaedff] text-[#464554] hover:bg-emerald-100 hover:text-[#006c49]'
                  }`}
                >
                  <span className="material-symbols-outlined text-[22px]">
                    {habit.completed ? 'check' : 'circle'}
                  </span>
                </button>
              </div>

              {/* Special metric progress bar for water/steps */}
              {habit.target_val && habit.current_val !== undefined && (
                <div className="flex flex-col gap-1 mt-3 pt-2 border-t border-slate-50">
                  <div className="flex justify-between items-center text-xs text-[#464554] font-medium font-mono-numbers">
                    <span>
                      Прогресс: {habit.current_val} из {habit.target_val} {habit.unit}
                    </span>
                    <span
                      className={`font-semibold ${
                        habit.completed ? 'text-[#006c49]' : 'text-[#4648d4]'
                      }`}
                    >
                      {habit.completed ? 'Выполнено' : `${Math.round((habit.current_val / habit.target_val) * 100)}%`}
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        habit.completed ? 'bg-[#006c49]' : 'bg-[#4648d4]'
                      }`}
                      style={{
                        width: `${Math.min(
                          100,
                          Math.round((habit.current_val / habit.target_val) * 100)
                        )}%`,
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Desktop Widget Teaser Banner */}
      <div
        onClick={() => setShowWidgetModal(true)}
        className="relative overflow-hidden rounded-2xl bg-[#eaedff] p-4 shadow-sm flex items-center gap-3.5 cursor-pointer hover:bg-indigo-100/70 transition-all"
      >
        <div className="w-12 h-12 rounded-xl bg-[#4648d4] flex items-center justify-center text-white shadow-md flex-shrink-0">
          <span className="material-symbols-outlined text-[26px]">widgets</span>
        </div>
        <div className="flex flex-col flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="text-sm font-bold text-[#131b2e] font-headline">Виджет HabitSpark</span>
            <span className="px-1.5 py-0.5 rounded-full bg-[#e1e0ff] text-[#07006c] text-[10px] font-bold">
              Новинка
            </span>
          </div>
          <p className="text-xs text-[#464554] mt-0.5 leading-snug">
            Добавьте виджет на экран «Домой», чтобы отмечать привычки в 1 клик
          </p>
        </div>
        <div className="w-8 h-8 rounded-full bg-white text-[#131b2e] flex items-center justify-center shadow-sm flex-shrink-0">
          <span className="material-symbols-outlined text-[18px]">chevron_right</span>
        </div>
      </div>

      {/* Widget Preview Modal */}
      {showWidgetModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl animate-pop-check">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="font-headline font-bold text-base text-[#131b2e]">
                Виджет для iOS & Android
              </span>
              <button
                onClick={() => setShowWidgetModal(false)}
                className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-500"
              >
                ✕
              </button>
            </div>

            {/* Simulated Mobile Home Screen Widget */}
            <div className="my-5 p-4 rounded-3xl bg-gradient-to-br from-[#4648d4] to-[#6063ee] text-white shadow-xl shadow-indigo-500/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-sm">bolt</span>
                  <span className="text-xs font-bold font-headline">HabitSpark</span>
                </div>
                <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full">Четверг 24</span>
              </div>
              <div className="mt-3 flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold font-mono-numbers">
                    {completedCount} / {totalCount}
                  </div>
                  <div className="text-[10px] text-indigo-100">Привычек закрыто</div>
                </div>
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center font-bold text-xs">
                  {completionPct}%
                </div>
              </div>
              <div className="mt-3 pt-2 border-t border-white/10 flex justify-between text-[11px]">
                <span className="truncate">💧 Вода: 1.5/2л</span>
                <span className="font-bold text-emerald-300">✓ Зачтено</span>
              </div>
            </div>

            <p className="text-xs text-[#464554] text-center mb-4 leading-relaxed">
              Виджет синхронизируется в реальном времени с облачной базой данных HabitSpark через фоновые воркеры.
            </p>

            <button
              onClick={() => setShowWidgetModal(false)}
              className="w-full py-3 bg-[#4648d4] hover:bg-[#3a3bc4] text-white font-semibold text-xs rounded-xl shadow-md transition-all"
            >
              Понятно, отлично!
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
