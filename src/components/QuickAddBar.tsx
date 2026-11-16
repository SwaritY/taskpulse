import { Plus } from 'lucide-react';
import { FormEvent, RefObject, useState } from 'react';
import { Priority, TASK_CATEGORIES } from '../types/task';

interface QuickAddBarProps {
  inputRef?: RefObject<HTMLInputElement | null>;
  defaultCategory?: string;
  defaultPriority?: Priority;
  onAddTask: (data: {
    title: string;
    priority: Priority;
    category: string;
    dueDate?: string;
  }) => void;
}

export function QuickAddBar({
  inputRef,
  defaultCategory,
  defaultPriority,
  onAddTask,
}: QuickAddBarProps) {
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState<Priority>(defaultPriority ?? 'medium');
  const [category, setCategory] = useState<string>(defaultCategory ?? 'Product');
  const [dueDate, setDueDate] = useState<string>('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = title.trim();
    if (!trimmed) return;

    onAddTask({
      title: trimmed,
      priority,
      category,
      dueDate: dueDate || undefined,
    });
    setTitle('');
    setDueDate('');
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-[#E2E8F0] bg-[#FFFFFF] p-3 sm:p-4 shadow-[0_1px_2px_0_rgba(15,23,42,0.04)]"
    >
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="relative flex-1">
          <input
            ref={inputRef}
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Add a task... (Press N to focus)"
            aria-label="New task title"
            className="h-10 w-full rounded-lg border border-[#E2E8F0] bg-[#FFFFFF] px-3.5 text-sm text-[#0B1C30] placeholder:text-[#94A3B8] transition-shadow focus:border-[#6366F1] focus:outline-none focus:ring-2 focus:ring-[#6366F1] focus:ring-offset-1"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:flex-nowrap">
          {/* Priority Selector */}
          <div
            role="group"
            aria-label="Task priority"
            className="inline-flex h-10 items-center rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] p-1"
          >
            {(
              [
                { key: 'high' as const, label: 'High', activeClass: 'bg-[#FEF2F2] text-[#DC2626] shadow-2xs' },
                { key: 'medium' as const, label: 'Med', activeClass: 'bg-[#FFFBEB] text-[#D97706] shadow-2xs' },
                { key: 'low' as const, label: 'Low', activeClass: 'bg-[#EFF6FF] text-[#2563EB] shadow-2xs' },
              ]
            ).map((opt) => (
              <button
                key={opt.key}
                type="button"
                onClick={() => setPriority(opt.key)}
                className={`h-8 rounded-md px-2.5 text-xs font-semibold transition-colors whitespace-nowrap shrink-0 ${
                  priority === opt.key
                    ? opt.activeClass
                    : 'text-[#64748B] hover:text-[#0B1C30]'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {/* Category Selector */}
          <select
            aria-label="Task category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="h-10 rounded-lg border border-[#E2E8F0] bg-[#FFFFFF] px-3 text-xs font-medium text-[#0B1C30] focus:border-[#6366F1] focus:outline-none focus:ring-2 focus:ring-[#6366F1] focus:ring-offset-1"
          >
            {TASK_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          {/* Optional Due Date */}
          <input
            type="date"
            aria-label="Task due date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="h-10 rounded-lg border border-[#E2E8F0] bg-[#FFFFFF] px-2.5 font-mono text-xs text-[#464554] focus:border-[#6366F1] focus:outline-none focus:ring-2 focus:ring-[#6366F1] focus:ring-offset-1"
          />

          {/* Submit */}
          <button
            type="submit"
            disabled={!title.trim()}
            className="inline-flex h-10 items-center justify-center gap-1.5 rounded-lg bg-[#4648D4] px-4 text-sm font-medium text-white transition-all duration-150 hover:bg-[#3B3DC4] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-45 whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6366F1] focus-visible:ring-offset-2"
          >
            <Plus className="h-4 w-4 shrink-0" />
            <span>Add Task</span>
          </button>
        </div>
      </div>
    </form>
  );
}
