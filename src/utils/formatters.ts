import { Priority } from '../types/task';
import { getTodayISO } from './storage';

export function formatDueDate(dueDate?: string): {
  label: string;
  isOverdue: boolean;
  isToday: boolean;
} | null {
  if (!dueDate) return null;

  const today = getTodayISO();
  const [y, m, d] = dueDate.split('-').map(Number);
  if (!y || !m || !d) return null;

  const targetDate = new Date(y, m - 1, d);
  const [ty, tm, td] = today.split('-').map(Number);
  const todayDate = new Date(ty, tm - 1, td);

  const diffDays = Math.round(
    (targetDate.getTime() - todayDate.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (diffDays === 0) {
    return { label: 'Today', isOverdue: false, isToday: true };
  }
  if (diffDays === 1) {
    return { label: 'Tomorrow', isOverdue: false, isToday: false };
  }
  if (diffDays === -1) {
    return { label: 'Yesterday', isOverdue: true, isToday: false };
  }

  const formatted = targetDate.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });

  return {
    label: formatted,
    isOverdue: diffDays < 0,
    isToday: false,
  };
}

export const PRIORITY_ORDER: Record<Priority, number> = {
  high: 0,
  medium: 1,
  low: 2,
};

export const PRIORITY_LABEL: Record<Priority, string> = {
  high: 'High',
  medium: 'Medium',
  low: 'Low',
};
