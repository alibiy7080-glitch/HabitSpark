import React, { useState } from 'react';
import { useHabit } from '../context/HabitContext';

export const SyncBackupView: React.FC = () => {
  const {
    user,
    habits,
    isOffline,
    setIsOffline,
    pendingQueue,
    syncing,
    triggerSync,
    exportBackup,
    restoreBackup,
    apiLogs,
    clearApiLogs,
    setShowArchitectureModal,
  } = useHabit();

  const [restoreText, setRestoreText] = useState('');
  const [showRestoreBox, setShowRestoreBox] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  // Handle Export Backup
  const handleExport = async () => {
    try {
      const backupData = await exportBackup();
      const blob = new Blob([JSON.stringify(backupData, null, 2)], {
        type: 'application/json',
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `habitspark_backup_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 3000);
    } catch (e) {
      console.error(e);
    }
  };

  // Handle Import / Restore
  const handleRestoreSubmit = async () => {
    if (!restoreText.trim()) return;
    try {
      const parsed = JSON.parse(restoreText);
      await restoreBackup(parsed);
      setShowRestoreBox(false);
      setRestoreText('');
    } catch (err: any) {
      alert(`Ошибка чтения файла: ${err.message}`);
    }
  };

  return (
    <div className="flex flex-col gap-5 px-4 md:px-6 pb-28 pt-3 max-w-xl mx-auto w-full">
      {/* Title */}
      <div>
        <h1 className="font-headline text-2xl font-bold text-[#131b2e]">Синхронизация & Облако</h1>
        <p className="text-xs text-[#464554] mt-0.5">
          Облачные бэкапы, мультидевайс доступ и офлайн-очередь
        </p>
      </div>

      {/* Cloud Status Card */}
      <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                isOffline ? 'bg-amber-100 text-amber-700' : 'bg-emerald-50 text-[#006c49]'
              }`}
            >
              <span className="material-symbols-outlined text-[26px]">
                {isOffline ? 'cloud_off' : 'cloud_done'}
              </span>
            </div>
            <div>
              <h2 className="font-headline font-bold text-sm text-[#131b2e]">
                {isOffline ? 'Офлайн режим активен' : 'Облачная база синхронизирована'}
              </h2>
              <p className="text-xs text-[#464554]">
                {isOffline
                  ? 'Все действия сохраняются в памяти устройства'
                  : 'Все ваши устройства видят актуальные данные'}
              </p>
            </div>
          </div>

          <span
            className={`px-3 py-1 rounded-full text-xs font-bold ${
              isOffline ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-[#006c49]'
            }`}
          >
            {isOffline ? 'Offline' : 'Online'}
          </span>
        </div>

        {/* Multi-Device Status Badges */}
        <div className="pt-3 border-t border-slate-100">
          <span className="text-xs font-bold text-[#131b2e] block mb-2">
            Подключенные устройства пользователя:
          </span>
          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
              <span className="material-symbols-outlined text-slate-700 text-lg">smartphone</span>
              <div className="font-bold text-[11px] text-[#131b2e] mt-1">iPhone 16</div>
              <span className="text-[10px] text-emerald-600 font-semibold">Синхронно</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
              <span className="material-symbols-outlined text-slate-700 text-lg">tablet_mac</span>
              <div className="font-bold text-[11px] text-[#131b2e] mt-1">iPad Air</div>
              <span className="text-[10px] text-emerald-600 font-semibold">Синхронно</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
              <span className="material-symbols-outlined text-slate-700 text-lg">laptop_mac</span>
              <div className="font-bold text-[11px] text-[#131b2e] mt-1">Web Chrome</div>
              <span className="text-[10px] text-emerald-600 font-semibold">Синхронно</span>
            </div>
          </div>
        </div>

        {/* Sync Action Button */}
        <div className="flex gap-2 pt-1">
          <button
            onClick={triggerSync}
            disabled={syncing || isOffline}
            className="flex-1 py-2.5 px-4 bg-[#4648d4] hover:bg-[#3a3bc4] text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <span className={`material-symbols-outlined text-[16px] ${syncing ? 'animate-spin' : ''}`}>
              sync
            </span>
            <span>{syncing ? 'Синхронизация...' : 'Синхронизировать сейчас'}</span>
          </button>
          <button
            onClick={() => setIsOffline(!isOffline)}
            className="py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-[#131b2e] font-semibold text-xs rounded-xl transition-all"
          >
            {isOffline ? 'Включить Online' : 'Тест Offline'}
          </button>
        </div>
      </div>

      {/* Cloud Backup (Бэкап) Section */}
      <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100 flex flex-col gap-4">
        <div>
          <h2 className="font-headline font-bold text-base text-[#131b2e]">
            Облачное сохранение (Бэкап)
          </h2>
          <p className="text-xs text-[#464554] mt-0.5">
            Защита данных от потери при смене или поломке телефона
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-2.5">
          <button
            onClick={handleExport}
            className="flex-1 py-3 px-4 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-[18px]">download</span>
            <span>{downloadSuccess ? 'Файл скачан!' : 'Скачать бэкап (JSON)'}</span>
          </button>

          <button
            onClick={() => setShowRestoreBox(!showRestoreBox)}
            className="flex-1 py-3 px-4 bg-slate-100 hover:bg-slate-200 text-[#131b2e] font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-[18px]">upload</span>
            <span>Восстановить из файла</span>
          </button>
        </div>

        {/* Restore Panel */}
        {showRestoreBox && (
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col gap-2.5 animate-pop-check">
            <span className="text-xs font-bold text-[#131b2e]">
              Вставьте JSON-содержимое бэкапа:
            </span>
            <textarea
              value={restoreText}
              onChange={(e) => setRestoreText(e.target.value)}
              placeholder='{"version": "1.0.0", "habits": [...]}'
              rows={4}
              className="w-full text-xs font-mono p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#4648d4] bg-white"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowRestoreBox(false)}
                className="px-3 py-1.5 text-xs text-slate-500 font-semibold"
              >
                Отмена
              </button>
              <button
                onClick={handleRestoreSubmit}
                className="px-4 py-1.5 bg-[#4648d4] text-white text-xs font-bold rounded-lg shadow-sm"
              >
                Применить бэкап
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Offline Queue Inspector */}
      <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-headline font-bold text-base text-[#131b2e]">
              Очередь офлайн-синхронизации
            </h2>
            <p className="text-xs text-[#464554] mt-0.5">
              Локальный буфер действий (Offline First Architecture)
            </p>
          </div>
          <span className="px-2.5 py-1 bg-indigo-50 text-[#4648d4] font-mono-numbers font-bold text-xs rounded-full">
            {pendingQueue.length} в очереди
          </span>
        </div>

        {pendingQueue.length === 0 ? (
          <div className="p-4 rounded-2xl bg-slate-50 text-center text-xs text-slate-400">
            Очередь пуста. Все действия сохранены в базе данных на сервере.
          </div>
        ) : (
          <div className="divide-y divide-slate-100 max-h-48 overflow-y-auto">
            {pendingQueue.map((act) => (
              <div key={act.id} className="py-2 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                  <span className="font-mono font-bold text-[#131b2e]">{act.type}</span>
                  <span className="text-slate-400 text-[10px]">
                    {new Date(act.timestamp).toLocaleTimeString()}
                  </span>
                </div>
                <span className="text-[11px] text-[#464554] truncate max-w-[160px]">
                  {act.payload?.title || act.habit_id}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Backend Architecture & Live REST API Inspector */}
      <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-headline font-bold text-base text-[#131b2e]">
              Архитектура бэкенда & Live REST API
            </h2>
            <p className="text-xs text-[#464554] mt-0.5">
              Мониторинг запросов к серверу по протоколу REST
            </p>
          </div>
          <button
            onClick={() => setShowArchitectureModal(true)}
            className="px-3 py-1.5 bg-[#eaedff] text-[#4648d4] text-xs font-bold rounded-xl hover:bg-indigo-100 transition-all flex items-center gap-1"
          >
            <span className="material-symbols-outlined text-[15px]">schema</span>
            <span>Схема БД</span>
          </button>
        </div>

        {/* Live API Requests Stream */}
        <div className="flex items-center justify-between pt-1">
          <span className="text-xs font-bold text-[#131b2e]">Журнал сетевых запросов:</span>
          <button onClick={clearApiLogs} className="text-[10px] text-slate-400 hover:text-slate-600">
            Очистить
          </button>
        </div>

        <div className="bg-[#131b2e] text-slate-200 p-3 rounded-2xl font-mono text-[11px] max-h-56 overflow-y-auto space-y-2">
          {apiLogs.length === 0 ? (
            <div className="text-slate-500 text-center py-2">Сетевых запросов еще не было</div>
          ) : (
            apiLogs.slice(0, 10).map((log) => (
              <div
                key={log.id}
                className="flex items-center justify-between border-b border-white/5 pb-1.5"
              >
                <div className="flex items-center gap-2 truncate">
                  <span
                    className={`font-bold px-1.5 py-0.2 rounded text-[9px] ${
                      log.method === 'POST'
                        ? 'bg-emerald-900 text-emerald-300'
                        : log.method === 'DELETE'
                        ? 'bg-rose-900 text-rose-300'
                        : log.method.includes('QUEUE')
                        ? 'bg-amber-900 text-amber-300'
                        : 'bg-indigo-900 text-indigo-300'
                    }`}
                  >
                    {log.method}
                  </span>
                  <span className="text-slate-300 truncate">{log.url}</span>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0 text-[10px]">
                  <span className={log.status === 200 || log.status === 201 ? 'text-emerald-400' : 'text-amber-400'}>
                    {log.status || 'OFFLINE'}
                  </span>
                  <span className="text-slate-500">{log.durationMs}ms</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
