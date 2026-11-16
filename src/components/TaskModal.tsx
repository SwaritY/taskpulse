import { X } from 'lucide-react';
import { FormEvent, useEffect, useRef, useState } from 'react';
import { Priority, TASK_CATEGORIES, Task } from '../types/task';

interface TaskModalProps {
  isOpen: boolean;
  editingTask: Task | null;
  defaultCategory?: string;
  onClose: () => void;
  onSave: (data: {
    id?: string;
    title: string;
    notes?: string;
    priority: Priority;
    category: string;
    dueDate?: string;
    completed?: boolean;
  }) => void;
}

export function TaskModal({
  isOpen,
  editingTask,
  defaultCategory,
  onClose,
  onSave,
}: TaskModalProps) {
  const [title, setTitle] = useState('');
  const [notes, setNotes] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');
  const [category, setCategory] = useState<string>('Product');
  const [dueDate, setDueDate] = useState('');
  const [completed, setCompleted] = useState(false);

  const titleInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      if (editingTask) {
        setTitle(editingTask.title);
        setNotes(editingTask.notes ?? '');
        setPriority(editingTask.priority);
        setCategory(editingTask.category || 'Product');
        setDueDate(editingTask.dueDate ?? '');
        setCompleted(editingTask.completed);
      } else {
        setTitle('');
        setNotes('');
        setPriority('medium');
        setCategory(defaultCategory && defaultCategory !== 'all' ? defaultCategory : 'Product');
        setDueDate('');
        setCompleted(false);
      }
      setTimeout(() => titleInputRef.current?.focus(), 20);
    }
  }, [isOpen, editingTask, defaultCategory]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = title.trim();
    if (!trimmed) return;

    onSave({
      id: editingTask?.id,
      title: trimmed,
      notes: notes.trim() || undefined,
      priority,
      category: category.trim() || 'Product',
      dueDate: dueDate || undefined,
      completed,
    });
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="task-modal-title"
    >
      <div
        className="fixed inset-0 bg-[#0B1C30]/35 backdrop-blur-[2px] transition-opacity"
        onClick={onClose}
      />

      <div className="relative z-10 w-full sm:max-w-lg rounded-t-3xl sm:rounded-3xl border border-[#E2E8F0] bg-[#FFFFFF] p-6 shadow-[0_20px_25px_-5px_rgba(15,23,42,0.1),0_8px_10px_-6px_rgba(15,23,42,0.04)]">
        <div className="flex items-center justify-between gap-4 pb-4 border-b border-[#E2E8F0]">
          <h2
            id="task-modal-title"
            className="font-display text-lg font-semibold tracking-[-0.01em] text-[#0B1C30]"
          >
            {editingTask ? 'Edit Task' : 'New Task'}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="flex h-9 w-9 items-center justify-center rounded-lg text-[#64748B] hover:bg-[#F1F5F9] hover:text-[#0B1C30] transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 flex flex-col gap-4">
          <div>
            <label
              htmlFor="modal-task-title"
              className="block text-xs font-semibold text-[#464554] mb-1.5"
            >
              Task title
            </label>
            <input
              ref={titleInputRef}
              id="modal-task-title"
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Review sprint retrospective notes"
              className="h-10 w-full rounded-lg border border-[#E2E8F0] bg-[#FFFFFF] px-3.5 text-sm text-[#0B1C30] placeholder:text-[#94A3B8] focus:border-[#6366F1] focus:outline-none focus:ring-2 focus:ring-[#6366F1] focus:ring-offset-1"
            />
          </div>

          <div>
            <label
              htmlFor="modal-task-notes"
              className="block text-xs font-semibold text-[#464554] mb-1.5"
            >
              Notes <span className="font-normal text-[#94A3B8]">(optional)</span>
            </label>
            <textarea
              id="modal-task-notes"
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add context, links, or acceptance criteria..."
              className="w-full rounded-lg border border-[#E2E8F0] bg-[#FFFFFF] px-3.5 py-2.5 text-sm text-[#0B1C30] placeholder:text-[#94A3B8] focus:border-[#6366F1] focus:outline-none focus:ring-2 focus:ring-[#6366F1] focus:ring-offset-1 resize-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <span className="block text-xs font-semibold text-[#464554] mb-1.5">
                Priority
              </span>
              <div
                role="group"
                aria-label="Select priority"
                className="grid grid-cols-3 gap-1 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] p-1"
              >
                {(
                  [
                    { key: 'high' as const, label: 'High', active: 'bg-[#FEF2F2] text-[#DC2626] shadow-2xs' },
                    { key: 'medium' as const, label: 'Medium', active: 'bg-[#FFFBEB] text-[#D97706] shadow-2xs' },
                    { key: 'low' as const, label: 'Low', active: 'bg-[#EFF6FF] text-[#2563EB] shadow-2xs' },
                  ]
                ).map((opt) => (
                  <button
                    key={opt.key}
                    type="button"
                    onClick={() => setPriority(opt.key)}
                    className={`h-8 rounded-md text-xs font-semibold transition-colors ${
                      priority === opt.key
                        ? opt.active
                        : 'text-[#64748B] hover:text-[#0B1C30]'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label
                htmlFor="modal-task-category"
                className="block text-xs font-semibold text-[#464554] mb-1.5"
              >
                List / Category
              </label>
              <select
                id="modal-task-category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="h-10 w-full rounded-lg border border-[#E2E8F0] bg-[#FFFFFF] px-3 text-sm text-[#0B1C30] focus:border-[#6366F1] focus:outline-none focus:ring-2 focus:ring-[#6366F1] focus:ring-offset-1"
              >
                {TASK_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
            <div>
              <label
                htmlFor="modal-task-due"
                className="block text-xs font-semibold text-[#464554] mb-1.5"
              >
                Due date <span className="font-normal text-[#94A3B8]">(optional)</span>
              </label>
              <input
                id="modal-task-due"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="h-10 w-full rounded-lg border border-[#E2E8F0] bg-[#FFFFFF] px-3 font-mono text-sm text-[#0B1C30] focus:border-[#6366F1] focus:outline-none focus:ring-2 focus:ring-[#6366F1] focus:ring-offset-1"
              />
            </div>

            {editingTask && (
              <label className="flex h-10 cursor-pointer items-center gap-2.5 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] px-3 text-sm font-medium text-[#0B1C30]">
                <input
                  type="checkbox"
                  checked={completed}
                  onChange={(e) => setCompleted(e.target.checked)}
                  className="h-4 w-4 rounded accent-[#10B981]"
                />
                <span>Mark as completed</span>
              </label>
            )}
          </div>

          <div className="mt-2 flex items-center justify-end gap-2.5 pt-4 border-t border-[#E2E8F0]">
            <button
              type="button"
              onClick={onClose}
              className="h-10 rounded-lg border border-[#E2E8F0] bg-[#FFFFFF] px-4 text-sm font-medium text-[#0B1C30] hover:bg-[#F8FAFC] transition-colors whitespace-nowrap"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!title.trim()}
              className="h-10 rounded-lg bg-[#4648D4] px-5 text-sm font-medium text-white hover:bg-[#3B3DC4] active:scale-[0.98] transition-all disabled:opacity-45 whitespace-nowrap"
            >
              {editingTask ? 'Save Changes' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
