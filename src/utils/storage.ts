import { Task, WorkspacePreferences } from '../types/task';

const TASKS_STORAGE_KEY = 'taskpulse_tasks_v1';
const PREFS_STORAGE_KEY = 'taskpulse_prefs_v1';

export function getTodayISO(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function getOffsetDateISO(offsetDays: number): string {
  const date = new Date();
  date.setDate(date.getDate() + offsetDays);
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function getDefaultTasks(): Task[] {
  const today = getTodayISO();
  const tomorrow = getOffsetDateISO(1);
  const inThreeDays = getOffsetDateISO(3);
  const yesterday = getOffsetDateISO(-1);

  return [
    {
      id: 'tp-101',
      title: 'Finalize Q4 product roadmap and release milestones',
      notes: 'Align engineering capacity estimates with upcoming onboarding deliverables.',
      priority: 'high',
      category: 'Product',
      dueDate: today,
      completed: false,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    },
    {
      id: 'tp-102',
      title: 'Audit authentication middleware & session token rotation',
      notes: 'Verify refresh window edge cases across mobile and desktop sessions.',
      priority: 'high',
      category: 'Engineering',
      dueDate: today,
      completed: false,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
    },
    {
      id: 'tp-103',
      title: 'Refine responsive grid spacing on analytics summary widgets',
      notes: 'Check 768px tablet breakpoint alignment and tabular numeral legibility.',
      priority: 'medium',
      category: 'Design',
      dueDate: tomorrow,
      completed: false,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 18).toISOString(),
    },
    {
      id: 'tp-104',
      title: 'Prepare weekly operations standup agenda & blocker log',
      notes: 'Consolidate vendor renewals and support escalation SLA metrics.',
      priority: 'medium',
      category: 'Operations',
      dueDate: inThreeDays,
      completed: false,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    },
    {
      id: 'tp-105',
      title: 'Schedule annual dental checkup and renew gym membership',
      priority: 'low',
      category: 'Personal',
      dueDate: inThreeDays,
      completed: false,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 30).toISOString(),
    },
    {
      id: 'tp-106',
      title: 'Publish design token specification for elevation and badges',
      notes: 'Shared typography scale and semantic color contrast ratios.',
      priority: 'high',
      category: 'Design',
      dueDate: yesterday,
      completed: true,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
      completedAt: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
    },
    {
      id: 'tp-107',
      title: 'Optimize localStorage serialization and state hydration hook',
      priority: 'medium',
      category: 'Engineering',
      dueDate: yesterday,
      completed: true,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 60).toISOString(),
      completedAt: new Date(Date.now() - 1000 * 60 * 60 * 20).toISOString(),
    },
    {
      id: 'tp-108',
      title: 'Archive completed October sprint retrospective notes',
      priority: 'low',
      category: 'Operations',
      completed: true,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
      completedAt: new Date(Date.now() - 1000 * 60 * 60 * 36).toISOString(),
    },
  ];
}

export function loadTasks(): Task[] {
  try {
    const raw = window.localStorage.getItem(TASKS_STORAGE_KEY);
    if (raw === null) {
      const initial = getDefaultTasks();
      saveTasks(initial);
      return initial;
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return getDefaultTasks();
    }
    return parsed.filter(
      (item): item is Task =>
        Boolean(item) &&
        typeof item.id === 'string' &&
        typeof item.title === 'string' &&
        (item.priority === 'high' || item.priority === 'medium' || item.priority === 'low') &&
        typeof item.completed === 'boolean'
    );
  } catch {
    return getDefaultTasks();
  }
}

export function saveTasks(tasks: Task[]): void {
  try {
    window.localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks));
  } catch {
    // Ignore storage quota errors gracefully
  }
}

export const DEFAULT_PREFERENCES: WorkspacePreferences = {
  activeSection: 'all-tasks',
  statusFilter: 'all',
  priorityFilter: 'all',
  categoryFilter: 'all',
  sortBy: 'manual',
};

export function loadPreferences(): WorkspacePreferences {
  try {
    const raw = window.localStorage.getItem(PREFS_STORAGE_KEY);
    if (!raw) return DEFAULT_PREFERENCES;
    const parsed = JSON.parse(raw);
    return {
      activeSection:
        parsed.activeSection === 'today' || parsed.activeSection === 'analytics'
          ? parsed.activeSection
          : 'all-tasks',
      statusFilter:
        parsed.statusFilter === 'active' || parsed.statusFilter === 'completed'
          ? parsed.statusFilter
          : 'all',
      priorityFilter:
        parsed.priorityFilter === 'high' ||
        parsed.priorityFilter === 'medium' ||
        parsed.priorityFilter === 'low'
          ? parsed.priorityFilter
          : 'all',
      categoryFilter: typeof parsed.categoryFilter === 'string' ? parsed.categoryFilter : 'all',
      sortBy:
        parsed.sortBy === 'priority' ||
        parsed.sortBy === 'newest' ||
        parsed.sortBy === 'due-date'
          ? parsed.sortBy
          : 'manual',
    };
  } catch {
    return DEFAULT_PREFERENCES;
  }
}

export function savePreferences(prefs: WorkspacePreferences): void {
  try {
    window.localStorage.setItem(PREFS_STORAGE_KEY, JSON.stringify(prefs));
  } catch {
    // Ignore storage quota errors gracefully
  }
}
