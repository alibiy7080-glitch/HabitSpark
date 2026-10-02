import { Habit, HabitLog, User, SharedHabit, LeaderboardUser, GlobalStats, BackupData, SyncAction } from '../types';

export interface ApiLogEntry {
  id: string;
  method: string;
  url: string;
  status: number;
  timestamp: string;
  payload?: any;
  response?: any;
  durationMs: number;
  isOffline?: boolean;
}

class ApiService {
  private queueKey = 'habitspark_offline_queue';
  private logsKey = 'habitspark_api_logs';
  private currentUserId = 'user-alex';
  private simulatedOffline = false;
  private listeners: (() => void)[] = [];

  constructor() {
    // Listen for browser online event
    if (typeof window !== 'undefined') {
      window.addEventListener('online', () => {
        if (!this.simulatedOffline) {
          this.syncPendingQueue();
        }
      });
    }
  }

  public setSimulatedOffline(isOffline: boolean) {
    this.simulatedOffline = isOffline;
    this.notify();
    if (!isOffline) {
      this.syncPendingQueue();
    }
  }

  public isOfflineMode(): boolean {
    if (typeof navigator !== 'undefined' && !navigator.onLine) {
      return true;
    }
    return this.simulatedOffline;
  }

  public setCurrentUserId(userId: string) {
    this.currentUserId = userId;
  }

  public getCurrentUserId(): string {
    return this.currentUserId;
  }

  public subscribe(listener: () => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private notify() {
    this.listeners.forEach((l) => l());
  }

  // --- Offline Queue Handling ---
  public getPendingQueue(): SyncAction[] {
    try {
      const saved = localStorage.getItem(this.queueKey);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  }

  private savePendingQueue(queue: SyncAction[]) {
    try {
      localStorage.setItem(this.queueKey, JSON.stringify(queue));
      this.notify();
    } catch (e) {
      console.error('Failed to save offline queue', e);
    }
  }

  public clearQueue() {
    localStorage.removeItem(this.queueKey);
    this.notify();
  }

  public queueAction(action: Omit<SyncAction, 'id' | 'timestamp'>): SyncAction {
    const fullAction: SyncAction = {
      ...action,
      id: `act-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      timestamp: Date.now(),
    };
    const queue = this.getPendingQueue();
    queue.push(fullAction);
    this.savePendingQueue(queue);

    this.recordApiLog({
      id: fullAction.id,
      method: 'QUEUE (OFFLINE)',
      url: `/api/habits/${action.habit_id || 'new'}`,
      status: 202,
      timestamp: new Date().toLocaleTimeString(),
      payload: action,
      response: { status: 'Saved to local device queue', pendingCount: queue.length },
      durationMs: 4,
      isOffline: true,
    });

    return fullAction;
  }

  // --- API Call Logger for Architecture & Inspector ---
  public getApiLogs(): ApiLogEntry[] {
    try {
      const logs = localStorage.getItem(this.logsKey);
      return logs ? JSON.parse(logs) : [];
    } catch {
      return [];
    }
  }

  public recordApiLog(entry: ApiLogEntry) {
    try {
      const logs = this.getApiLogs();
      logs.unshift(entry);
      if (logs.length > 50) logs.pop();
      localStorage.setItem(this.logsKey, JSON.stringify(logs));
      this.notify();
    } catch {}
  }

  public clearApiLogs() {
    localStorage.removeItem(this.logsKey);
    this.notify();
  }

  // --- Core Fetch with Telemetry & Offline Fallback ---
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<{ data: T; status: number }> {
    const startTime = performance.now();
    const method = options.method || 'GET';

    if (this.isOfflineMode()) {
      const durationMs = Math.round(performance.now() - startTime);
      this.recordApiLog({
        id: `offline-${Date.now()}`,
        method,
        url: endpoint,
        status: 0,
        timestamp: new Date().toLocaleTimeString(),
        payload: options.body ? JSON.parse(options.body as string) : undefined,
        response: { error: 'Network unavailable: App is running in Offline Mode' },
        durationMs,
        isOffline: true,
      });
      throw new Error('OFFLINE_MODE');
    }

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'x-user-id': this.currentUserId,
      Authorization: `Bearer token-${this.currentUserId}`,
      ...(options.headers as Record<string, string>),
    };

    try {
      const res = await fetch(endpoint, {
        ...options,
        headers,
      });

      const data = await res.json();
      const durationMs = Math.round(performance.now() - startTime);

      this.recordApiLog({
        id: `req-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
        method,
        url: endpoint,
        status: res.status,
        timestamp: new Date().toLocaleTimeString(),
        payload: options.body ? JSON.parse(options.body as string) : undefined,
        response: data,
        durationMs,
        isOffline: false,
      });

      return { data, status: res.status };
    } catch (err: any) {
      const durationMs = Math.round(performance.now() - startTime);
      this.recordApiLog({
        id: `err-${Date.now()}`,
        method,
        url: endpoint,
        status: 500,
        timestamp: new Date().toLocaleTimeString(),
        payload: options.body ? JSON.parse(options.body as string) : undefined,
        response: { error: err.message },
        durationMs,
        isOffline: true,
      });
      throw err;
    }
  }

  // --- REST Endpoints ---

  public async getMe(): Promise<User> {
    const { data } = await this.request<User>('/api/auth/me');
    return data;
  }

  public async switchUser(userId: string): Promise<User> {
    this.currentUserId = userId;
    const { data } = await this.request<{ user: User }>('/api/auth/switch-user', {
      method: 'POST',
      body: JSON.stringify({ userId }),
    });
    return data.user;
  }

  public async getHabits(date: string): Promise<{ habits: Habit[]; all_logs_count: number }> {
    const { data } = await this.request<{ habits: Habit[]; all_logs_count: number }>(
      `/api/habits?date=${date}`
    );
    return data;
  }

  public async createHabit(habitData: Partial<Habit>): Promise<Habit> {
    if (this.isOfflineMode()) {
      const tempHabit: Habit = {
        id: `habit-offline-${Date.now()}`,
        user_id: this.currentUserId,
        title: habitData.title || '',
        category: habitData.category || 'Здоровье',
        icon: habitData.icon || 'check_circle',
        frequency: habitData.frequency || ['daily'],
        target_time: habitData.target_time || 'Весь день',
        target_metric: habitData.target_metric || '',
        streak: 0,
        created_at: new Date().toISOString(),
      };
      this.queueAction({
        type: 'CREATE_HABIT',
        payload: tempHabit,
      });
      return tempHabit;
    }

    const { data } = await this.request<Habit>('/api/habits', {
      method: 'POST',
      body: JSON.stringify(habitData),
    });
    return data;
  }

  public async checkHabit(habitId: string, date: string): Promise<any> {
    if (this.isOfflineMode()) {
      this.queueAction({
        type: 'CHECK',
        habit_id: habitId,
        date,
      });
      return { success: true, offline: true, habitId, date };
    }

    const { data } = await this.request(`/api/habits/${habitId}/check`, {
      method: 'POST',
      body: JSON.stringify({ date }),
    });
    return data;
  }

  public async uncheckHabit(habitId: string, date: string): Promise<any> {
    if (this.isOfflineMode()) {
      this.queueAction({
        type: 'UNCHECK',
        habit_id: habitId,
        date,
      });
      return { success: true, offline: true, habitId, date };
    }

    const { data } = await this.request(`/api/habits/${habitId}/uncheck`, {
      method: 'POST',
      body: JSON.stringify({ date }),
    });
    return data;
  }

  public async deleteHabit(habitId: string): Promise<void> {
    if (this.isOfflineMode()) {
      this.queueAction({
        type: 'DELETE_HABIT',
        habit_id: habitId,
      });
      return;
    }
    await this.request(`/api/habits/${habitId}`, { method: 'DELETE' });
  }

  // --- Offline Sync Engine ---
  public async syncPendingQueue(): Promise<{ synced: boolean; count: number; message: string }> {
    const queue = this.getPendingQueue();
    if (queue.length === 0) {
      return { synced: true, count: 0, message: 'Все данные уже синхронизированы с облаком' };
    }

    if (this.isOfflineMode()) {
      return { synced: false, count: queue.length, message: 'Устройство находится в офлайн-режиме' };
    }

    try {
      const { data } = await this.request<any>('/api/sync', {
        method: 'POST',
        body: JSON.stringify({
          actions: queue,
          lastSyncTimestamp: Date.now(),
        }),
      });

      this.clearQueue();
      return {
        synced: true,
        count: queue.length,
        message: data.message || `Синхронизировано ${queue.length} действий`,
      };
    } catch (err: any) {
      return { synced: false, count: queue.length, message: `Ошибка синхронизации: ${err.message}` };
    }
  }

  // --- Cloud Backup & Restore ---
  public async exportBackup(): Promise<BackupData> {
    const { data } = await this.request<BackupData>('/api/backup/export');
    return data;
  }

  public async restoreBackup(backupData: BackupData): Promise<any> {
    const { data } = await this.request<any>('/api/backup/restore', {
      method: 'POST',
      body: JSON.stringify(backupData),
    });
    return data;
  }

  // --- Social & Leaderboards ---
  public async getLeaderboard(): Promise<{ timeframe: string; leaderboard: LeaderboardUser[] }> {
    const { data } = await this.request<{ timeframe: string; leaderboard: LeaderboardUser[] }>(
      '/api/social/leaderboard'
    );
    return data;
  }

  public async getSharedHabits(): Promise<SharedHabit[]> {
    const { data } = await this.request<SharedHabit[]>('/api/social/shared-habits');
    return data;
  }

  public async joinSharedHabit(sharedId: string): Promise<any> {
    const { data } = await this.request<any>('/api/social/shared-habits/join', {
      method: 'POST',
      body: JSON.stringify({ sharedId }),
    });
    return data;
  }

  public async getGlobalStats(): Promise<GlobalStats> {
    const { data } = await this.request<GlobalStats>('/api/social/global-stats');
    return data;
  }
}

export const api = new ApiService();
