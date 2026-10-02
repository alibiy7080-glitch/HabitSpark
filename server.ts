import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '10mb' }));

// CORS & logging
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// ==========================================
// IN-MEMORY DATABASE (Users, Habits, HabitLogs)
// Matches relational schema requested by user
// ==========================================

export interface UserEntity {
  id: string;
  email: string;
  password_hash: string;
  name: string;
  avatar: string;
  created_at: string;
  streak: number;
  total_points: number;
}

export interface HabitEntity {
  id: string;
  user_id: string;
  title: string;
  category: string;
  icon: string;
  frequency: string[];
  target_time: string;
  target_metric?: string;
  current_metric?: string;
  unit?: string;
  target_val?: number;
  current_val?: number;
  streak: number;
  created_at: string;
}

export interface HabitLogEntity {
  id: string;
  habit_id: string;
  user_id: string;
  date: string; // YYYY-MM-DD
  completed: boolean;
  completed_at: string;
}

export interface SharedHabitEntity {
  id: string;
  title: string;
  category: string;
  icon: string;
  target_time: string;
  participants_count: number;
  description: string;
  avg_completion_rate: number;
  color: string;
  participant_user_ids: string[];
}

// Initial Mock Seed Data
const users: UserEntity[] = [
  {
    id: 'user-alex',
    email: 'alex@habitspark.app',
    password_hash: '$2b$10$e8..samplehashalex',
    name: 'Алекс',
    avatar: '/src/assets/images/alex_avatar_1790855720780.jpg',
    created_at: '2024-01-15T08:00:00Z',
    streak: 14,
    total_points: 1850,
  },
  {
    id: 'user-elena',
    email: 'elena@habitspark.app',
    password_hash: '$2b$10$e8..samplehashelena',
    name: 'Елена В.',
    avatar: '/src/assets/images/elena_avatar_1790855735138.jpg',
    created_at: '2024-02-10T11:20:00Z',
    streak: 21,
    total_points: 2420,
  },
  {
    id: 'user-dmitry',
    email: 'dmitry@habitspark.app',
    password_hash: '$2b$10$e8..samplehashdmitry',
    name: 'Дмитрий С.',
    avatar: '/src/assets/images/dmitry_avatar_1790855748348.jpg',
    created_at: '2024-03-01T14:40:00Z',
    streak: 9,
    total_points: 1200,
  },
];

let habits: HabitEntity[] = [
  {
    id: 'habit-1',
    user_id: 'user-alex',
    title: 'Выпить 2л воды',
    category: 'Здоровье',
    icon: 'water_drop',
    frequency: ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'],
    target_time: 'Весь день',
    target_metric: '1.5 из 2.0 л',
    current_metric: '1.5 л',
    target_val: 2.0,
    current_val: 1.5,
    unit: 'л',
    streak: 19,
    created_at: '2024-09-01T08:00:00Z',
  },
  {
    id: 'habit-2',
    user_id: 'user-alex',
    title: 'Утренняя медитация',
    category: 'Осознанность',
    icon: 'self_improvement',
    frequency: ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'],
    target_time: '08:30',
    target_metric: '15 мин',
    current_metric: '15 мин',
    target_val: 15,
    current_val: 15,
    unit: 'мин',
    streak: 12,
    created_at: '2024-09-05T08:00:00Z',
  },
  {
    id: 'habit-3',
    user_id: 'user-alex',
    title: 'Чтение книги',
    category: 'Саморазвитие',
    icon: 'menu_book',
    frequency: ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'],
    target_time: '21:00',
    target_metric: '30 стр',
    current_metric: '0 стр',
    target_val: 30,
    current_val: 0,
    unit: 'стр',
    streak: 8,
    created_at: '2024-09-10T08:00:00Z',
  },
  {
    id: 'habit-4',
    user_id: 'user-alex',
    title: 'Тренировка в зале',
    category: 'Спорт',
    icon: 'fitness_center',
    frequency: ['mon', 'wed', 'fri'],
    target_time: '19:00',
    target_metric: '45 мин',
    current_metric: '0 мин',
    target_val: 45,
    current_val: 0,
    unit: 'мин',
    streak: 4,
    created_at: '2024-09-15T08:00:00Z',
  },
  {
    id: 'habit-5',
    user_id: 'user-alex',
    title: 'Учить английский (Anki)',
    category: 'Обучение',
    icon: 'translate',
    frequency: ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'],
    target_time: '22:00',
    target_metric: '20 карточек',
    current_metric: '0 карточек',
    target_val: 20,
    current_val: 0,
    unit: 'карт',
    streak: 1,
    created_at: '2024-10-01T08:00:00Z',
  },
  {
    id: 'habit-6',
    user_id: 'user-alex',
    title: 'Вечерняя прогулка',
    category: 'Здоровье',
    icon: 'directions_walk',
    frequency: ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'],
    target_time: '18:00',
    target_metric: '5000 шагов',
    current_metric: '5000 шагов',
    target_val: 5000,
    current_val: 5000,
    unit: 'шагов',
    streak: 14,
    created_at: '2024-09-02T08:00:00Z',
  },
];

let habitLogs: HabitLogEntity[] = [
  // Thursday 2024-10-24 (today in mockup: 4 out of 6 completed: habit 1, 2, 6 completed)
  {
    id: 'log-1',
    habit_id: 'habit-1',
    user_id: 'user-alex',
    date: '2024-10-24',
    completed: true,
    completed_at: '2024-10-24T09:15:00Z',
  },
  {
    id: 'log-2',
    habit_id: 'habit-2',
    user_id: 'user-alex',
    date: '2024-10-24',
    completed: true,
    completed_at: '2024-10-24T08:45:00Z',
  },
  {
    id: 'log-3',
    habit_id: 'habit-6',
    user_id: 'user-alex',
    date: '2024-10-24',
    completed: true,
    completed_at: '2024-10-24T18:30:00Z',
  },
  // Wed 2024-10-23
  {
    id: 'log-w1',
    habit_id: 'habit-1',
    user_id: 'user-alex',
    date: '2024-10-23',
    completed: true,
    completed_at: '2024-10-23T19:00:00Z',
  },
  {
    id: 'log-w2',
    habit_id: 'habit-2',
    user_id: 'user-alex',
    date: '2024-10-23',
    completed: true,
    completed_at: '2024-10-23T08:40:00Z',
  },
  {
    id: 'log-w3',
    habit_id: 'habit-3',
    user_id: 'user-alex',
    date: '2024-10-23',
    completed: true,
    completed_at: '2024-10-23T21:30:00Z',
  },
  {
    id: 'log-w4',
    habit_id: 'habit-4',
    user_id: 'user-alex',
    date: '2024-10-23',
    completed: true,
    completed_at: '2024-10-23T20:00:00Z',
  },
  {
    id: 'log-w6',
    habit_id: 'habit-6',
    user_id: 'user-alex',
    date: '2024-10-23',
    completed: true,
    completed_at: '2024-10-23T18:45:00Z',
  },
  // Tue 2024-10-22
  {
    id: 'log-t1',
    habit_id: 'habit-1',
    user_id: 'user-alex',
    date: '2024-10-22',
    completed: true,
    completed_at: '2024-10-22T19:00:00Z',
  },
  {
    id: 'log-t2',
    habit_id: 'habit-2',
    user_id: 'user-alex',
    date: '2024-10-22',
    completed: true,
    completed_at: '2024-10-22T08:40:00Z',
  },
  {
    id: 'log-t3',
    habit_id: 'habit-3',
    user_id: 'user-alex',
    date: '2024-10-22',
    completed: true,
    completed_at: '2024-10-22T21:30:00Z',
  },
  // Mon 2024-10-21
  {
    id: 'log-m1',
    habit_id: 'habit-1',
    user_id: 'user-alex',
    date: '2024-10-21',
    completed: true,
    completed_at: '2024-10-21T19:00:00Z',
  },
  {
    id: 'log-m2',
    habit_id: 'habit-2',
    user_id: 'user-alex',
    date: '2024-10-21',
    completed: true,
    completed_at: '2024-10-21T08:40:00Z',
  },
  {
    id: 'log-m4',
    habit_id: 'habit-4',
    user_id: 'user-alex',
    date: '2024-10-21',
    completed: true,
    completed_at: '2024-10-21T20:00:00Z',
  },
];

let sharedHabits: SharedHabitEntity[] = [
  {
    id: 'shared-1',
    title: 'Марафон 10,000 шагов в день',
    category: 'Здоровье',
    icon: 'directions_walk',
    target_time: 'Весь день',
    participants_count: 54,
    description: 'Ежедневная норма активности для крепкого сердца и тонуса.',
    avg_completion_rate: 88,
    color: '#006c49',
    participant_user_ids: ['user-alex', 'user-elena', 'user-dmitry'],
  },
  {
    id: 'shared-2',
    title: 'Утренний клуб 06:00',
    category: 'Продуктивность',
    icon: 'wb_sunny',
    target_time: '06:00',
    participants_count: 32,
    description: 'Ранний подъем, зарядка и настрой на продуктивный день.',
    avg_completion_rate: 76,
    color: '#4648d4',
    participant_user_ids: ['user-elena'],
  },
  {
    id: 'shared-3',
    title: '30 дней без сахара',
    category: 'Питание',
    icon: 'no_food',
    target_time: 'Весь день',
    participants_count: 89,
    description: 'Чистое питание без добавленного сахара и сладких напитков.',
    avg_completion_rate: 69,
    color: '#aa2f13',
    participant_user_ids: ['user-alex', 'user-dmitry'],
  },
  {
    id: 'shared-4',
    title: 'Книжный спринт 20 минут',
    category: 'Саморазвитие',
    icon: 'menu_book',
    target_time: '21:00',
    participants_count: 41,
    description: 'Минимум 20 минут вдумчивого чтения профессиональной или худ. литературы.',
    avg_completion_rate: 92,
    color: '#6063ee',
    participant_user_ids: ['user-alex', 'user-elena'],
  },
];

// Helper: current user context from header or fallback to Alex
function getCurrentUserId(req: express.Request): string {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7);
    if (token === 'token-elena') return 'user-elena';
    if (token === 'token-dmitry') return 'user-dmitry';
  }
  const customUserHeader = req.headers['x-user-id'];
  if (typeof customUserHeader === 'string' && customUserHeader) {
    return customUserHeader;
  }
  return 'user-alex';
}

// ==========================================
// REST API ROUTES
// ==========================================

// 1. Auth routes
app.post('/api/auth/register', (req, res) => {
  const { email, name, password } = req.body;
  if (!email || !name) {
    return res.status(400).json({ error: 'Email and name are required' });
  }
  const existing = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (existing) {
    return res.status(409).json({ error: 'User with this email already exists' });
  }

  const newUser: UserEntity = {
    id: `user-${Date.now()}`,
    email,
    password_hash: `$2b$10$dummyhash_${Date.now()}`,
    name,
    avatar: '/src/assets/images/alex_avatar_1790855720780.jpg',
    created_at: new Date().toISOString(),
    streak: 1,
    total_points: 100,
  };
  users.push(newUser);

  res.status(201).json({
    token: `token-${newUser.id}`,
    user: newUser,
    message: 'User registered successfully',
  });
});

app.post('/api/auth/login', (req, res) => {
  const { email } = req.body;
  const user = users.find((u) => u.email.toLowerCase() === (email || '').toLowerCase()) || users[0];
  res.json({
    token: `token-${user.id}`,
    user,
    message: 'Login successful',
  });
});

app.get('/api/auth/me', (req, res) => {
  const userId = getCurrentUserId(req);
  const user = users.find((u) => u.id === userId) || users[0];
  res.json(user);
});

// Switch user for testing multi-user
app.post('/api/auth/switch-user', (req, res) => {
  const { userId } = req.body;
  const user = users.find((u) => u.id === userId);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  res.json({
    token: `token-${user.id}`,
    user,
    message: `Switched to ${user.name}`,
  });
});

// 2. Habits CRUD routes
app.get('/api/habits', (req, res) => {
  const userId = getCurrentUserId(req);
  const targetDate = (req.query.date as string) || '2024-10-24';

  const userHabits = habits.filter((h) => h.user_id === userId);
  const userLogs = habitLogs.filter((l) => l.user_id === userId && l.date === targetDate);

  const habitsWithStatus = userHabits.map((h) => {
    const log = userLogs.find((l) => l.habit_id === h.id);
    return {
      ...h,
      completed: log ? log.completed : false,
      completed_at: log ? log.completed_at : null,
    };
  });

  res.json({
    date: targetDate,
    habits: habitsWithStatus,
    all_logs_count: habitLogs.filter((l) => l.user_id === userId).length,
  });
});

app.post('/api/habits', (req, res) => {
  const userId = getCurrentUserId(req);
  const { title, category, icon, frequency, target_time, target_metric } = req.body;

  if (!title) {
    return res.status(400).json({ error: 'Title is required' });
  }

  const newHabit: HabitEntity = {
    id: `habit-${Date.now()}`,
    user_id: userId,
    title,
    category: category || 'Здоровье',
    icon: icon || 'check_circle',
    frequency: Array.isArray(frequency) ? frequency : ['daily'],
    target_time: target_time || 'Весь день',
    target_metric: target_metric || '',
    streak: 0,
    created_at: new Date().toISOString(),
  };

  habits.push(newHabit);
  res.status(201).json(newHabit);
});

app.put('/api/habits/:id', (req, res) => {
  const { id } = req.params;
  const userId = getCurrentUserId(req);
  const habitIndex = habits.findIndex((h) => h.id === id && h.user_id === userId);

  if (habitIndex === -1) {
    return res.status(404).json({ error: 'Habit not found' });
  }

  habits[habitIndex] = {
    ...habits[habitIndex],
    ...req.body,
    id,
    user_id: userId,
  };

  res.json(habits[habitIndex]);
});

app.delete('/api/habits/:id', (req, res) => {
  const { id } = req.params;
  const userId = getCurrentUserId(req);
  const initialLength = habits.length;

  habits = habits.filter((h) => !(h.id === id && h.user_id === userId));
  habitLogs = habitLogs.filter((l) => l.habit_id !== id);

  if (habits.length === initialLength) {
    return res.status(404).json({ error: 'Habit not found' });
  }

  res.json({ success: true, message: 'Habit deleted' });
});

// 3. Habit Logging (check / uncheck)
app.post('/api/habits/:id/check', (req, res) => {
  const { id } = req.params;
  const userId = getCurrentUserId(req);
  const date = req.body.date || '2024-10-24';

  const habit = habits.find((h) => h.id === id && h.user_id === userId);
  if (!habit) {
    return res.status(404).json({ error: 'Habit not found' });
  }

  // Find existing log
  let log = habitLogs.find((l) => l.habit_id === id && l.user_id === userId && l.date === date);
  const completedAt = new Date().toISOString();

  if (log) {
    log.completed = true;
    log.completed_at = completedAt;
  } else {
    log = {
      id: `log-${Date.now()}`,
      habit_id: id,
      user_id: userId,
      date,
      completed: true,
      completed_at: completedAt,
    };
    habitLogs.push(log);
  }

  // Increment habit streak if needed
  habit.streak = (habit.streak || 0) + 1;

  res.json({
    success: true,
    log,
    streak: habit.streak,
    habit,
    timestamp: Date.now(),
  });
});

app.post('/api/habits/:id/uncheck', (req, res) => {
  const { id } = req.params;
  const userId = getCurrentUserId(req);
  const date = req.body.date || '2024-10-24';

  const habit = habits.find((h) => h.id === id && h.user_id === userId);
  if (!habit) {
    return res.status(404).json({ error: 'Habit not found' });
  }

  let log = habitLogs.find((l) => l.habit_id === id && l.user_id === userId && l.date === date);
  if (log) {
    log.completed = false;
  }

  if (habit.streak > 0) {
    habit.streak = Math.max(0, habit.streak - 1);
  }

  res.json({
    success: true,
    log,
    streak: habit.streak,
    habit,
    timestamp: Date.now(),
  });
});

// 4. Offline-First Sync Endpoint
// Takes client offline queue and returns merged state
app.post('/api/sync', (req, res) => {
  const userId = getCurrentUserId(req);
  const { actions, clientHabits, clientLogs, lastSyncTimestamp } = req.body;

  let appliedActionsCount = 0;

  if (Array.isArray(actions)) {
    for (const act of actions) {
      if (act.type === 'CHECK' && act.habit_id && act.date) {
        let log = habitLogs.find(
          (l) => l.habit_id === act.habit_id && l.user_id === userId && l.date === act.date
        );
        if (log) {
          log.completed = true;
          log.completed_at = new Date(act.timestamp || Date.now()).toISOString();
        } else {
          habitLogs.push({
            id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
            habit_id: act.habit_id,
            user_id: userId,
            date: act.date,
            completed: true,
            completed_at: new Date(act.timestamp || Date.now()).toISOString(),
          });
        }
        appliedActionsCount++;
      } else if (act.type === 'UNCHECK' && act.habit_id && act.date) {
        let log = habitLogs.find(
          (l) => l.habit_id === act.habit_id && l.user_id === userId && l.date === act.date
        );
        if (log) {
          log.completed = false;
        }
        appliedActionsCount++;
      } else if (act.type === 'CREATE_HABIT' && act.payload) {
        const payload = act.payload;
        if (!habits.some((h) => h.id === payload.id)) {
          habits.push({
            ...payload,
            user_id: userId,
          });
          appliedActionsCount++;
        }
      }
    }
  }

  // Return server truth
  const serverHabits = habits.filter((h) => h.user_id === userId);
  const serverLogs = habitLogs.filter((l) => l.user_id === userId);

  res.json({
    synced: true,
    appliedActionsCount,
    serverTimestamp: Date.now(),
    habits: serverHabits,
    logs: serverLogs,
    message: `Успешно синхронизировано ${appliedActionsCount} действий с облаком`,
  });
});

// 5. Cloud Backup & Restore
app.get('/api/backup/export', (req, res) => {
  const userId = getCurrentUserId(req);
  const user = users.find((u) => u.id === userId) || users[0];
  const userHabits = habits.filter((h) => h.user_id === userId);
  const userLogs = habitLogs.filter((l) => l.user_id === userId);

  const backup = {
    version: '1.0.0',
    service: 'HabitSpark Cloud Backup Engine',
    exported_at: new Date().toISOString(),
    user,
    habits: userHabits,
    logs: userLogs,
    metadata: {
      total_habits: userHabits.length,
      total_completions: userLogs.filter((l) => l.completed).length,
      current_streak: user.streak,
    },
  };

  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Content-Disposition', 'attachment; filename=habitspark_backup.json');
  res.json(backup);
});

app.post('/api/backup/restore', (req, res) => {
  const userId = getCurrentUserId(req);
  const backupData = req.body;

  if (!backupData || !Array.isArray(backupData.habits)) {
    return res.status(400).json({ error: 'Invalid backup file format' });
  }

  // Remove existing habits and logs for this user
  habits = habits.filter((h) => h.user_id !== userId);
  habitLogs = habitLogs.filter((l) => l.user_id !== userId);

  // Restore habits
  for (const h of backupData.habits) {
    habits.push({
      ...h,
      user_id: userId,
    });
  }

  // Restore logs
  if (Array.isArray(backupData.logs)) {
    for (const l of backupData.logs) {
      habitLogs.push({
        ...l,
        user_id: userId,
      });
    }
  }

  res.json({
    success: true,
    message: `Восстановлено ${backupData.habits.length} привычек и ${backupData.logs?.length || 0} логов`,
    habits: habits.filter((h) => h.user_id === userId),
    logs: habitLogs.filter((l) => l.user_id === userId),
  });
});

// 6. Social Features (Leaderboard, Shared Habits, Global Stats)
app.get('/api/social/leaderboard', (req, res) => {
  const currentUserId = getCurrentUserId(req);

  const leaderboard = [
    {
      id: 'user-elena',
      name: 'Елена В.',
      avatar: '/src/assets/images/elena_avatar_1790855735138.jpg',
      streak: 21,
      consistency_pct: 98,
      habits_count: 8,
      is_current_user: currentUserId === 'user-elena',
      rank: 1,
      badge: '👑 Мастер дисциплины',
    },
    {
      id: 'user-alex',
      name: 'Алекс (Вы)',
      avatar: '/src/assets/images/alex_avatar_1790855720780.jpg',
      streak: 14,
      consistency_pct: 88,
      habits_count: 6,
      is_current_user: currentUserId === 'user-alex',
      rank: 2,
      badge: '⚡ Огненный темп',
    },
    {
      id: 'user-dmitry',
      name: 'Дмитрий С.',
      avatar: '/src/assets/images/dmitry_avatar_1790855748348.jpg',
      streak: 9,
      consistency_pct: 74,
      habits_count: 5,
      is_current_user: currentUserId === 'user-dmitry',
      rank: 3,
      badge: '🎯 На подъеме',
    },
    {
      id: 'user-olga',
      name: 'Ольга К.',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      streak: 7,
      consistency_pct: 71,
      habits_count: 4,
      is_current_user: false,
      rank: 4,
      badge: '🌱 Новичок недели',
    },
    {
      id: 'user-max',
      name: 'Максим Р.',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      streak: 5,
      consistency_pct: 65,
      habits_count: 4,
      is_current_user: false,
      rank: 5,
      badge: '🚀 Стабильный старт',
    },
  ];

  res.json({
    timeframe: 'weekly',
    leaderboard,
  });
});

app.get('/api/social/shared-habits', (req, res) => {
  const currentUserId = getCurrentUserId(req);
  const result = sharedHabits.map((sh) => ({
    ...sh,
    joined: sh.participant_user_ids.includes(currentUserId),
  }));
  res.json(result);
});

app.post('/api/social/shared-habits/join', (req, res) => {
  const currentUserId = getCurrentUserId(req);
  const { sharedId } = req.body;

  const target = sharedHabits.find((sh) => sh.id === sharedId);
  if (!target) {
    return res.status(404).json({ error: 'Shared habit not found' });
  }

  const alreadyJoined = target.participant_user_ids.includes(currentUserId);
  if (alreadyJoined) {
    target.participant_user_ids = target.participant_user_ids.filter((id) => id !== currentUserId);
    target.participants_count = Math.max(0, target.participants_count - 1);
  } else {
    target.participant_user_ids.push(currentUserId);
    target.participants_count += 1;

    // Also auto-add to user's habits if not existing
    const exists = habits.some(
      (h) => h.user_id === currentUserId && h.title.includes(target.title.split(' ')[0])
    );
    if (!exists) {
      habits.push({
        id: `habit-${Date.now()}`,
        user_id: currentUserId,
        title: target.title,
        category: target.category,
        icon: target.icon,
        frequency: ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'],
        target_time: target.target_time,
        streak: 1,
        created_at: new Date().toISOString(),
      });
    }
  }

  res.json({
    joined: !alreadyJoined,
    participants_count: target.participants_count,
    target,
  });
});

app.get('/api/social/global-stats', (req, res) => {
  res.json({
    total_users: 14820,
    total_completions_today: 92430,
    community_avg_streak: 8.6,
    retention_rate_pct: 82,
    top_habit_title: 'Выпить 2л воды',
    top_habit_completion_pct: 91,
    active_squads_count: 1420,
  });
});

// 7. Architecture Documentation & Interactive API Explorer
app.get('/api/docs/architecture', (req, res) => {
  res.json({
    architecture_overview: {
      pattern: 'Offline-First REST Architecture with Cloud Sync',
      database_type: 'Relational Database (PostgreSQL / SQLite)',
      tables: [
        {
          name: 'users',
          columns: [
            { name: 'id', type: 'VARCHAR PRIMARY KEY' },
            { name: 'email', type: 'VARCHAR UNIQUE NOT NULL' },
            { name: 'password_hash', type: 'VARCHAR NOT NULL' },
            { name: 'name', type: 'VARCHAR NOT NULL' },
            { name: 'created_at', type: 'TIMESTAMPTZ DEFAULT NOW()' },
          ],
        },
        {
          name: 'habits',
          columns: [
            { name: 'id', type: 'VARCHAR PRIMARY KEY' },
            { name: 'user_id', type: 'VARCHAR REFERENCES users(id)' },
            { name: 'title', type: 'VARCHAR NOT NULL' },
            { name: 'frequency', type: 'TEXT[] NOT NULL' },
            { name: 'target_time', type: 'VARCHAR' },
            { name: 'category', type: 'VARCHAR' },
          ],
        },
        {
          name: 'habit_logs',
          columns: [
            { name: 'id', type: 'VARCHAR PRIMARY KEY' },
            { name: 'habit_id', type: 'VARCHAR REFERENCES habits(id)' },
            { name: 'user_id', type: 'VARCHAR REFERENCES users(id)' },
            { name: 'date', type: 'DATE NOT NULL' },
            { name: 'completed', type: 'BOOLEAN NOT NULL' },
            { name: 'completed_at', type: 'TIMESTAMPTZ' },
          ],
        },
      ],
      offline_sync_strategy: {
        local_layer: 'LocalStorage / Room / SwiftData offline queue',
        detection: 'window.addEventListener("online") + heartbeat',
        conflict_resolution: 'Last-Write-Wins (LWW) with client-timestamped audit records',
      },
    },
  });
});

// ==========================================
// VITE DEV SERVER / STATIC FILE SERVING
// ==========================================

async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[HabitSpark Server] running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
