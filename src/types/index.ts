export type DayOfWeek = 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun';

export interface User {
  id: string;
  email: string;
  name: string;
  avatar: string;
  created_at: string;
  streak: number;
  total_points: number;
  role?: string;
}

export interface Habit {
  id: string;
  user_id: string;
  title: string;
  category: string;
  icon: string;
  frequency: DayOfWeek[] | 'daily' | string[];
  target_time: string;
  target_metric?: string;
  current_metric?: string;
  unit?: string;
  target_val?: number;
  current_val?: number;
  streak: number;
  color?: string;
  created_at: string;
  shared_id?: string;
  shared_members_count?: number;
  completed?: boolean;
  completed_at?: string | null;
}

export interface HabitLog {
  id: string;
  habit_id: string;
  user_id: string;
  date: string; // YYYY-MM-DD
  completed: boolean;
  completed_at: string;
  synced?: boolean;
}

export interface SharedHabit {
  id: string;
  title: string;
  category: string;
  icon: string;
  target_time: string;
  participants_count: number;
  description: string;
  avg_completion_rate: number;
  joined: boolean;
  color: string;
}

export interface LeaderboardUser {
  id: string;
  name: string;
  avatar: string;
  streak: number;
  consistency_pct: number;
  habits_count: number;
  is_current_user: boolean;
  rank: number;
  badge: string;
}

export interface SyncAction {
  id: string;
  type: 'CHECK' | 'UNCHECK' | 'CREATE_HABIT' | 'UPDATE_HABIT' | 'DELETE_HABIT';
  habit_id?: string;
  date?: string;
  payload?: any;
  timestamp: number;
}

export interface GlobalStats {
  total_users: number;
  total_completions_today: number;
  community_avg_streak: number;
  retention_rate_pct: number;
  top_habit_title: string;
  top_habit_completion_pct: number;
}

export interface BackupData {
  version: string;
  exported_at: string;
  user: User;
  habits: Habit[];
  logs: HabitLog[];
}
