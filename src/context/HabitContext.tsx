import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Habit, User, SharedHabit, LeaderboardUser, GlobalStats, BackupData, SyncAction } from '../types';
import { api, ApiLogEntry } from '../services/api';

export type DeviceMode = 'phone' | 'tablet' | 'desktop';

interface HabitContextType {
  user: User | null;
  habits: Habit[];
  selectedDate: string;
  setSelectedDate: (date: string) => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  loading: boolean;
  deviceMode: DeviceMode;
  setDeviceMode: (mode: DeviceMode) => void;
  isOffline: boolean;
  setIsOffline: (offline: boolean) => void;
  pendingQueue: SyncAction[];
  apiLogs: ApiLogEntry[];
  syncing: boolean;
  syncNotification: string | null;
  toggleHabitCheck: (habitId: string) => Promise<void>;
  createHabit: (habitData: Partial<Habit>) => Promise<void>;
  deleteHabit: (habitId: string) => Promise<void>;
  triggerSync: () => Promise<void>;
  exportBackup: () => Promise<BackupData>;
  restoreBackup: (data: BackupData) => Promise<void>;
  switchUser: (userId: string) => Promise<void>;
  refreshHabits: () => Promise<void>;
  clearApiLogs: () => void;
  activeTab: 'today' | 'analytics' | 'social' | 'sync' | 'new';
  setActiveTab: (tab: 'today' | 'analytics' | 'social' | 'sync' | 'new') => void;
  showNewHabitModal: boolean;
  setShowNewHabitModal: (show: boolean) => void;
  showArchitectureModal: boolean;
  setShowArchitectureModal: (show: boolean) => void;
  leaderboard: LeaderboardUser[];
  sharedHabits: SharedHabit[];
  globalStats: GlobalStats | null;
  joinSharedHabit: (id: string) => Promise<void>;
}

const HabitContext = createContext<HabitContextType | undefined>(undefined);

export const HabitProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>({
    id: 'user-alex',
    email: 'alex@habitspark.app',
    name: 'Алекс',
    avatar: '/src/assets/images/alex_avatar_1790855720780.jpg',
    created_at: '2024-01-15T08:00:00Z',
    streak: 14,
    total_points: 1850,
  });

  const [habits, setHabits] = useState<Habit[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>('2024-10-24');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [loading, setLoading] = useState<boolean>(true);
  const [deviceMode, setDeviceMode] = useState<DeviceMode>('phone');
  const [isOffline, setIsOfflineState] = useState<boolean>(false);
  const [pendingQueue, setPendingQueue] = useState<SyncAction[]>([]);
  const [apiLogs, setApiLogs] = useState<ApiLogEntry[]>([]);
  const [syncing, setSyncing] = useState<boolean>(false);
  const [syncNotification, setSyncNotification] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'today' | 'analytics' | 'social' | 'sync' | 'new'>('today');
  const [showNewHabitModal, setShowNewHabitModal] = useState<boolean>(false);
  const [showArchitectureModal, setShowArchitectureModal] = useState<boolean>(false);

  const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>([]);
  const [sharedHabits, setSharedHabits] = useState<SharedHabit[]>([]);
  const [globalStats, setGlobalStats] = useState<GlobalStats | null>(null);

  // Sync state from API service
  const updateServiceState = useCallback(() => {
    setPendingQueue(api.getPendingQueue());
    setApiLogs(api.getApiLogs());
  }, []);

  const setIsOffline = useCallback((offline: boolean) => {
    setIsOfflineState(offline);
    api.setSimulatedOffline(offline);
    if (!offline) {
      triggerSync();
    } else {
      setSyncNotification('📴 Переключено в офлайн-режим (запросы сохраняются в локальную очередь)');
      setTimeout(() => setSyncNotification(null), 4000);
    }
  }, []);

  // Fetch initial habits and user data
  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      if (!isOffline) {
        const [meData, habitData, lbData, shData, statsData] = await Promise.all([
          api.getMe().catch(() => null),
          api.getHabits(selectedDate).catch(() => ({ habits: [], all_logs_count: 0 })),
          api.getLeaderboard().catch(() => ({ leaderboard: [] })),
          api.getSharedHabits().catch(() => []),
          api.getGlobalStats().catch(() => null),
        ]);

        if (meData) setUser(meData);
        if (habitData?.habits) setHabits(habitData.habits);
        if (lbData?.leaderboard) setLeaderboard(lbData.leaderboard);
        if (shData) setSharedHabits(shData);
        if (statsData) setGlobalStats(statsData);
      }
    } catch (e) {
      console.error('Error loading initial data:', e);
    } finally {
      setLoading(false);
      updateServiceState();
    }
  }, [selectedDate, isOffline, updateServiceState]);

  useEffect(() => {
    loadData();
    const unsubscribe = api.subscribe(updateServiceState);
    return () => unsubscribe();
  }, [loadData, updateServiceState]);

  // Toggle habit complete
  const toggleHabitCheck = async (habitId: string) => {
    const target = habits.find((h) => h.id === habitId);
    if (!target) return;

    const newCompleted = !target.completed;
    const newStreak = newCompleted ? target.streak + 1 : Math.max(0, target.streak - 1);

    // Optimistic UI Update immediately
    setHabits((prev) =>
      prev.map((h) =>
        h.id === habitId
          ? {
              ...h,
              completed: newCompleted,
              streak: newStreak,
              completed_at: newCompleted ? new Date().toISOString() : null,
            }
          : h
      )
    );

    // Update user streak if today
    if (selectedDate === '2024-10-24' && user) {
      setUser((u) => (u ? { ...u, streak: newStreak } : null));
    }

    try {
      if (newCompleted) {
        await api.checkHabit(habitId, selectedDate);
      } else {
        await api.uncheckHabit(habitId, selectedDate);
      }

      if (isOffline) {
        setSyncNotification('⚡ Сохранено локально в офлайн-очереди');
        setTimeout(() => setSyncNotification(null), 3000);
      }
    } catch (err) {
      console.error('Toggle error:', err);
    } finally {
      updateServiceState();
    }
  };

  const createHabit = async (habitData: Partial<Habit>) => {
    try {
      const created = await api.createHabit(habitData);
      setHabits((prev) => [...prev, { ...created, completed: false }]);
      setShowNewHabitModal(false);

      if (isOffline) {
        setSyncNotification('⚡ Новая привычка сохранена в локальной очереди устройства');
      } else {
        setSyncNotification('✅ Привычка сохранена в облаке!');
      }
      setTimeout(() => setSyncNotification(null), 3000);
    } catch (err) {
      console.error('Create error:', err);
    } finally {
      updateServiceState();
    }
  };

  const deleteHabit = async (habitId: string) => {
    setHabits((prev) => prev.filter((h) => h.id !== habitId));
    try {
      await api.deleteHabit(habitId);
      setSyncNotification('🗑️ Привычка удалена');
      setTimeout(() => setSyncNotification(null), 3000);
    } catch (err) {
      console.error('Delete error:', err);
    } finally {
      updateServiceState();
    }
  };

  const triggerSync = async () => {
    setSyncing(true);
    try {
      const res = await api.syncPendingQueue();
      if (res.synced && res.count > 0) {
        setSyncNotification(`☁️ ${res.message}!`);
        await loadData();
      } else if (res.synced && res.count === 0) {
        setSyncNotification('☁️ Все данные синхронизированы с облаком!');
      } else {
        setSyncNotification(`⚠️ ${res.message}`);
      }
      setTimeout(() => setSyncNotification(null), 4000);
    } catch (err: any) {
      setSyncNotification(`❌ Ошибка синхронизации: ${err.message}`);
      setTimeout(() => setSyncNotification(null), 4000);
    } finally {
      setSyncing(false);
      updateServiceState();
    }
  };

  const exportBackup = async (): Promise<BackupData> => {
    const data = await api.exportBackup();
    return data;
  };

  const restoreBackup = async (data: BackupData) => {
    setLoading(true);
    try {
      const res = await api.restoreBackup(data);
      setSyncNotification(`✅ ${res.message}!`);
      setTimeout(() => setSyncNotification(null), 4000);
      await loadData();
    } catch (err: any) {
      setSyncNotification(`❌ Ошибка восстановления: ${err.message}`);
      setTimeout(() => setSyncNotification(null), 4000);
    } finally {
      setLoading(false);
    }
  };

  const switchUser = async (userId: string) => {
    setLoading(true);
    try {
      const updatedUser = await api.switchUser(userId);
      setUser(updatedUser);
      setSyncNotification(`👤 Переключен профиль: ${updatedUser.name}`);
      setTimeout(() => setSyncNotification(null), 3000);
      await loadData();
    } catch (err: any) {
      console.error('Switch user error:', err);
    } finally {
      setLoading(false);
    }
  };

  const joinSharedHabit = async (id: string) => {
    try {
      const res = await api.joinSharedHabit(id);
      setSharedHabits((prev) =>
        prev.map((sh) =>
          sh.id === id
            ? {
                ...sh,
                joined: res.joined,
                participants_count: res.participants_count,
              }
            : sh
        )
      );
      setSyncNotification(
        res.joined ? '🎉 Вы присоединились к совместной привычке!' : 'Вы покинули совместную привычку'
      );
      setTimeout(() => setSyncNotification(null), 3500);
      await loadData();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <HabitContext.Provider
      value={{
        user,
        habits,
        selectedDate,
        setSelectedDate,
        selectedCategory,
        setSelectedCategory,
        loading,
        deviceMode,
        setDeviceMode,
        isOffline,
        setIsOffline,
        pendingQueue,
        apiLogs,
        syncing,
        syncNotification,
        toggleHabitCheck,
        createHabit,
        deleteHabit,
        triggerSync,
        exportBackup,
        restoreBackup,
        switchUser,
        refreshHabits: loadData,
        clearApiLogs: () => {
          api.clearApiLogs();
          updateServiceState();
        },
        activeTab,
        setActiveTab,
        showNewHabitModal,
        setShowNewHabitModal,
        showArchitectureModal,
        setShowArchitectureModal,
        leaderboard,
        sharedHabits,
        globalStats,
        joinSharedHabit,
      }}
    >
      {children}
    </HabitContext.Provider>
  );
};

export const useHabit = () => {
  const context = useContext(HabitContext);
  if (!context) {
    throw new Error('useHabit must be used within a HabitProvider');
  }
  return context;
};
