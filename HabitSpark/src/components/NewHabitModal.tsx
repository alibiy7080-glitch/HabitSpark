import React, { useState } from 'react';
import { useHabit } from '../context/HabitContext';

export const NewHabitModal: React.FC = () => {
  const { showNewHabitModal, setShowNewHabitModal, createHabit } = useHabit();

  const presets = [
    { title: 'Пить 2.5л воды', cat: 'Здоровье', icon: 'water_drop', time: 'Весь день', metric: '2.5 л' },
    { title: '10,000 шагов', cat: 'Спорт', icon: 'directions_walk', time: '18:00', metric: '10000 шагов' },
    { title: 'Медитация', cat: 'Осознанность', icon: 'self_improvement', time: '08:00', metric: '15 мин' },
    { title: 'Чтение книги', cat: 'Саморазвитие', icon: 'menu_book', time: '21:30', metric: '20 стр' },
    { title: 'Зарядка утром', cat: 'Спорт', icon: 'fitness_center', time: '07:30', metric: '15 мин' },
  ];

  const categories = ['Здоровье', 'Осознанность', 'Спорт', 'Саморазвитие', 'Обучение'];
  const icons = ['water_drop', 'self_improvement', 'menu_book', 'fitness_center', 'translate', 'directions_walk', 'bedtime', 'psychology'];

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Здоровье');
  const [icon, setIcon] = useState('water_drop');
  const [targetTime, setTargetTime] = useState('Весь день');
  const [targetMetric, setTargetMetric] = useState('');

  if (!showNewHabitModal) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    createHabit({
      title: title.trim(),
      category,
      icon,
      target_time: targetTime,
      target_metric: targetMetric || undefined,
      frequency: ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'],
    });

    setTitle('');
    setTargetMetric('');
  };

  const applyPreset = (p: typeof presets[0]) => {
    setTitle(p.title);
    setCategory(p.cat);
    setIcon(p.icon);
    setTargetTime(p.time);
    setTargetMetric(p.metric);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-white rounded-t-3xl sm:rounded-3xl w-full max-w-md p-6 max-h-[90vh] overflow-y-auto animate-pop-check shadow-2xl">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h2 className="font-headline font-bold text-lg text-[#131b2e]">Новая привычка</h2>
            <p className="text-xs text-[#464554]">Синхронизируется на всех ваших устройствах</p>
          </div>
          <button
            onClick={() => setShowNewHabitModal(false)}
            className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-500 font-bold"
          >
            ✕
          </button>
        </div>

        {/* Quick Presets */}
        <div className="mt-4">
          <span className="text-[11px] font-bold text-[#464554] uppercase tracking-wider block mb-2">
            Быстрые шаблоны:
          </span>
          <div className="flex gap-1.5 overflow-x-auto no-scrollbar pb-1">
            {presets.map((p) => (
              <button
                key={p.title}
                type="button"
                onClick={() => applyPreset(p)}
                className="px-2.5 py-1 rounded-xl bg-slate-100 hover:bg-indigo-50 hover:text-[#4648d4] text-[11px] font-medium text-slate-700 whitespace-nowrap transition-colors"
              >
                {p.title}
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-4">
          {/* Title */}
          <div>
            <label className="text-xs font-bold text-[#131b2e] block mb-1">
              Название привычки *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="например: Выпить 2л воды"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#4648d4] text-sm text-[#131b2e]"
            />
          </div>

          {/* Category */}
          <div>
            <label className="text-xs font-bold text-[#131b2e] block mb-1">Категория</label>
            <div className="flex flex-wrap gap-1.5">
              {categories.map((cat) => (
                <button
                  type="button"
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                    category === cat
                      ? 'bg-[#4648d4] text-white shadow-sm'
                      : 'bg-slate-100 text-[#464554] hover:bg-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Icon Picker */}
          <div>
            <label className="text-xs font-bold text-[#131b2e] block mb-1">Иконка</label>
            <div className="flex gap-2 overflow-x-auto no-scrollbar py-1">
              {icons.map((ic) => (
                <button
                  type="button"
                  key={ic}
                  onClick={() => setIcon(ic)}
                  className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-all ${
                    icon === ic
                      ? 'bg-[#4648d4] text-white shadow-md'
                      : 'bg-slate-100 text-[#464554] hover:bg-slate-200'
                  }`}
                >
                  <span className="material-symbols-outlined text-[20px]">{ic}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Time & Target Metric */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-[#131b2e] block mb-1">Время</label>
              <input
                type="text"
                value={targetTime}
                onChange={(e) => setTargetTime(e.target.value)}
                placeholder="08:30 или Весь день"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#4648d4] text-xs"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-[#131b2e] block mb-1">Норма (метрика)</label>
              <input
                type="text"
                value={targetMetric}
                onChange={(e) => setTargetMetric(e.target.value)}
                placeholder="20 стр / 2.0 л"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#4648d4] text-xs"
              />
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={() => setShowNewHabitModal(false)}
              className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-[#464554] font-bold text-xs rounded-xl transition-all"
            >
              Отмена
            </button>
            <button
              type="submit"
              className="flex-1 py-3 bg-[#4648d4] hover:bg-[#3a3bc4] text-white font-bold text-xs rounded-xl shadow-md transition-all"
            >
              Создать привычку
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
