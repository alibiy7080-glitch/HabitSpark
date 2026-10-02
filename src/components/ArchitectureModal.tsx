import React, { useState } from 'react';
import { useHabit } from '../context/HabitContext';

export const ArchitectureModal: React.FC = () => {
  const { showArchitectureModal, setShowArchitectureModal } = useHabit();
  const [activeTab, setActiveTab] = useState<'db' | 'api' | 'sync' | 'stack'>('db');

  if (!showArchitectureModal) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden animate-pop-check">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-[#faf8ff]">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-[#4648d4] text-white flex items-center justify-center">
              <span className="material-symbols-outlined text-[22px]">hub</span>
            </div>
            <div>
              <h2 className="font-headline font-bold text-base text-[#131b2e]">
                Архитектура бэкенда трекера привычек
              </h2>
              <p className="text-xs text-[#464554]">СУБД, REST API, Offline-First синхронизация</p>
            </div>
          </div>
          <button
            onClick={() => setShowArchitectureModal(false)}
            className="w-8 h-8 rounded-full hover:bg-slate-200/60 flex items-center justify-center text-slate-500 font-bold"
          >
            ✕
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-100 px-5 gap-4 bg-slate-50 text-xs font-bold text-[#464554]">
          <button
            onClick={() => setActiveTab('db')}
            className={`py-3 border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'db' ? 'border-[#4648d4] text-[#4648d4]' : 'border-transparent'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">database</span>
            <span>1. База данных (СУБД)</span>
          </button>
          <button
            onClick={() => setActiveTab('api')}
            className={`py-3 border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'api' ? 'border-[#4648d4] text-[#4648d4]' : 'border-transparent'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">api</span>
            <span>2. REST API</span>
          </button>
          <button
            onClick={() => setActiveTab('sync')}
            className={`py-3 border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'sync' ? 'border-[#4648d4] text-[#4648d4]' : 'border-transparent'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">sync_alt</span>
            <span>3. Синхронизация (Offline-First)</span>
          </button>
          <button
            onClick={() => setActiveTab('stack')}
            className={`py-3 border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'stack' ? 'border-[#4648d4] text-[#4648d4]' : 'border-transparent'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">code</span>
            <span>4. Стек & BaaS</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 overflow-y-auto flex-1 space-y-4 text-xs leading-relaxed text-[#131b2e]">
          {activeTab === 'db' && (
            <div className="space-y-4">
              <div className="bg-[#eaedff] p-3.5 rounded-2xl text-[#464554]">
                Для трекера привычек используется <strong>реляционная модель данных</strong>{' '}
                (PostgreSQL / SQLite). Схема построена на трех базовых таблицах со строгими внешними
                ключами (Foreign Keys).
              </div>

              {/* Table 1: Users */}
              <div className="border border-slate-200 rounded-2xl overflow-hidden">
                <div className="bg-slate-100 px-3.5 py-2 font-mono font-bold text-xs flex justify-between items-center">
                  <span>📊 users (Пользователи)</span>
                  <span className="text-[10px] text-slate-500">Авторизация и профили</span>
                </div>
                <div className="p-3 font-mono text-[11px] space-y-1 bg-white">
                  <div>
                    <span className="text-[#4648d4] font-bold">id</span>: VARCHAR(36) PRIMARY KEY
                  </div>
                  <div>
                    <span className="text-[#4648d4] font-bold">email</span>: VARCHAR(255) UNIQUE NOT
                    NULL
                  </div>
                  <div>
                    <span className="text-[#4648d4] font-bold">password_hash</span>: VARCHAR(255) NOT
                    NULL (bcrypt)
                  </div>
                  <div>
                    <span className="text-[#4648d4] font-bold">name</span>: VARCHAR(100) NOT NULL
                  </div>
                  <div>
                    <span className="text-[#4648d4] font-bold">created_at</span>: TIMESTAMPTZ DEFAULT
                    NOW()
                  </div>
                </div>
              </div>

              {/* Table 2: Habits */}
              <div className="border border-slate-200 rounded-2xl overflow-hidden">
                <div className="bg-slate-100 px-3.5 py-2 font-mono font-bold text-xs flex justify-between items-center">
                  <span>📊 habits (Привычки)</span>
                  <span className="text-[10px] text-slate-500">Связь с Users (1 к Многим)</span>
                </div>
                <div className="p-3 font-mono text-[11px] space-y-1 bg-white">
                  <div>
                    <span className="text-[#4648d4] font-bold">id</span>: VARCHAR(36) PRIMARY KEY
                  </div>
                  <div>
                    <span className="text-emerald-700 font-bold">user_id</span>: VARCHAR(36)
                    REFERENCES users(id) ON DELETE CASCADE
                  </div>
                  <div>
                    <span className="text-[#4648d4] font-bold">title</span>: VARCHAR(255) NOT NULL
                    (например: "Выпить 2л воды")
                  </div>
                  <div>
                    <span className="text-[#4648d4] font-bold">frequency</span>: TEXT[] (массив дней
                    недели)
                  </div>
                  <div>
                    <span className="text-[#4648d4] font-bold">target_time</span>: VARCHAR(20) (время
                    напоминания)
                  </div>
                </div>
              </div>

              {/* Table 3: HabitLogs */}
              <div className="border border-slate-200 rounded-2xl overflow-hidden">
                <div className="bg-slate-100 px-3.5 py-2 font-mono font-bold text-xs flex justify-between items-center">
                  <span>📊 habit_logs (Логи выполнений)</span>
                  <span className="text-[10px] text-slate-500">Связь с Habits (1 к Многим)</span>
                </div>
                <div className="p-3 font-mono text-[11px] space-y-1 bg-white">
                  <div>
                    <span className="text-[#4648d4] font-bold">id</span>: VARCHAR(36) PRIMARY KEY
                  </div>
                  <div>
                    <span className="text-emerald-700 font-bold">habit_id</span>: VARCHAR(36)
                    REFERENCES habits(id) ON DELETE CASCADE
                  </div>
                  <div>
                    <span className="text-emerald-700 font-bold">user_id</span>: VARCHAR(36)
                    REFERENCES users(id)
                  </div>
                  <div>
                    <span className="text-[#4648d4] font-bold">date</span>: DATE NOT NULL (день
                    выполнения YYYY-MM-DD)
                  </div>
                  <div>
                    <span className="text-[#4648d4] font-bold">completed</span>: BOOLEAN DEFAULT TRUE
                  </div>
                  <div>
                    <span className="text-[#4648d4] font-bold">completed_at</span>: TIMESTAMPTZ
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'api' && (
            <div className="space-y-3">
              <p className="text-[#464554]">
                Эндпоинты REST API, реализованные на сервере Express / Node.js и используемые мобильным
                приложением:
              </p>

              <div className="space-y-2">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 font-mono text-[11px]">
                  <div className="text-emerald-700 font-bold">POST /api/auth/register</div>
                  <div className="text-[#464554] mt-0.5">
                    Регистрация пользователя. Возвращает JWT токен.
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 font-mono text-[11px]">
                  <div className="text-emerald-700 font-bold">POST /api/auth/login</div>
                  <div className="text-[#464554] mt-0.5">
                    Вход. Возвращает JWT токен для заголовка Authorization: Bearer &lt;token&gt;.
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 font-mono text-[11px]">
                  <div className="text-[#4648d4] font-bold">GET /api/habits?date=YYYY-MM-DD</div>
                  <div className="text-[#464554] mt-0.5">
                    Получить список привычек текущего пользователя и статус выполнения на дату.
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 font-mono text-[11px]">
                  <div className="text-emerald-700 font-bold">POST /api/habits</div>
                  <div className="text-[#464554] mt-0.5">
                    Создать новую привычку (title, category, frequency, target_time).
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 font-mono text-[11px]">
                  <div className="text-emerald-700 font-bold">POST /api/habits/:id/check</div>
                  <div className="text-[#464554] mt-0.5">
                    Отметить привычку как выполненную на указанную дату (создает запись в HabitLogs).
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 font-mono text-[11px]">
                  <div className="text-rose-700 font-bold">POST /api/habits/:id/uncheck</div>
                  <div className="text-[#464554] mt-0.5">
                    Снять отметку выполнения (например, если нажали случайно).
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 font-mono text-[11px]">
                  <div className="text-indigo-700 font-bold">POST /api/sync</div>
                  <div className="text-[#464554] mt-0.5">
                    Пакетная синхронизация накопленных офлайн-действий из очереди приложения.
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'sync' && (
            <div className="space-y-3">
              <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl">
                <h4 className="font-bold text-[#006c49] mb-1">
                  Золотое правило мобильной разработки: Offline First
                </h4>
                <p className="text-[#464554]">
                  Приложение должно работать безупречно даже без сети (в самолете, метро, лифте).
                </p>
              </div>

              <div className="space-y-2">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="font-bold text-[#131b2e] mb-0.5">
                    1. Локальная запись (Optimistic UI)
                  </div>
                  <p className="text-[#464554]">
                    При нажатии на галочку привычка отмечается МГНОВЕННО (0 мс задержки). Лог
                    записывается в локальную БД телефона (Room на Android, SwiftData на iOS,
                    LocalStorage в веб-версии) и добавляется в очередь `offlineQueue`.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="font-bold text-[#131b2e] mb-0.5">
                    2. Автоматическое обнаружение сети
                  </div>
                  <p className="text-[#464554]">
                    Слушатель событий `window.ononline` или `ConnectivityManager` на смартфоне отслеживает
                    появление Wi-Fi/4G.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="font-bold text-[#131b2e] mb-0.5">
                    3. Двусторонняя синхронизация (Sync Reconciliation)
                  </div>
                  <p className="text-[#464554]">
                    Приложение отправляет массив действий на эндпоинт <code>POST /api/sync</code> с
                    клиентскими таймстемпами. Сервер объединяет данные по стратегии Last-Write-Wins и
                    возвращает клиенту последние изменения, внесенные с других девайсов (планшета или
                    браузера).
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'stack' && (
            <div className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-100 flex flex-col justify-between">
                  <div>
                    <h4 className="font-bold text-[#4648d4] text-sm">Вариант 1: Backend-as-a-Service</h4>
                    <p className="text-[#464554] mt-1 text-[11px]">
                      <strong>Supabase</strong> или <strong>Firebase</strong>.
                    </p>
                    <ul className="list-disc list-inside text-[11px] text-[#464554] mt-2 space-y-1">
                      <li>Быстрый старт за один вечер</li>
                      <li>Автоматическая авторизация и REST/GraphQL API</li>
                      <li>Встроенное облачное сохранение и бэкапы</li>
                    </ul>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-100 flex flex-col justify-between">
                  <div>
                    <h4 className="font-bold text-[#006c49] text-sm">Вариант 2: Собственный бэкенд</h4>
                    <p className="text-[#464554] mt-1 text-[11px]">
                      <strong>Node.js / Express</strong> (как в этом проекте), <strong>Ktor</strong>{' '}
                      (для Kotlin) или <strong>FastAPI</strong> (Python).
                    </p>
                    <ul className="list-disc list-inside text-[11px] text-[#464554] mt-2 space-y-1">
                      <li>Полный контроль над схемой БД и очередью sync</li>
                      <li>Кастомные лидерборды и алгоритмы стриков</li>
                      <li>Легкий деплой в Docker / Cloud Run</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
          <button
            onClick={() => setShowArchitectureModal(false)}
            className="px-5 py-2.5 bg-[#4648d4] hover:bg-[#3a3bc4] text-white text-xs font-bold rounded-xl shadow-md transition-all"
          >
            Закрыть
          </button>
        </div>
      </div>
    </div>
  );
};
