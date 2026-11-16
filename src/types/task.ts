export type Priority = 'high' | 'medium' | 'low';

export type TaskStatusFilter = 'all' | 'active' | 'completed';

export type NavSection = 'all-tasks' | 'today' | 'analytics';

export type SortOption = 'manual' | 'priority' | 'newest' | 'due-date';

export const TASK_CATEGORIES = [
  'Product',
  'Engineering',
  'Design',
  'Operations',
  'Personal',
] as const;

export type TaskCategory = (typeof TASK_CATEGORIES)[number] | string;

export interface Task {
  id: string;
  title: string;
  notes?: string;
  priority: Priority;
  category: TaskCategory;
  dueDate?: string; // YYYY-MM-DD
  completed: boolean;
  createdAt: string; // ISO timestamp
  completedAt?: string; // ISO timestamp
}

export interface WorkspacePreferences {
  activeSection: NavSection;
  statusFilter: TaskStatusFilter;
  priorityFilter: Priority | 'all';
  categoryFilter: string | 'all';
  sortBy: SortOption;
}
