import {
  CheckCheck,
  ClipboardList,
  Menu,
  Plus,
  Search,
  X,
} from 'lucide-react';
import { DragEvent, useEffect, useMemo, useRef, useState } from 'react';
import { AnalyticsView } from './components/AnalyticsView';
import { QuickAddBar } from './components/QuickAddBar';
import { Sidebar } from './components/Sidebar';
import { SummaryMetrics } from './components/SummaryMetrics';
import { TaskModal } from './components/TaskModal';
import { TaskRow } from './components/TaskRow';
import {
  NavSection,
  Priority,
  SortOption,
  TASK_CATEGORIES,
  Task,
  TaskStatusFilter,
  WorkspacePreferences,
} from './types/task';
import { PRIORITY_ORDER } from './utils/formatters';
import {
  getDefaultTasks,
  getTodayISO,
  loadPreferences,
  loadTasks,
  savePreferences,
  saveTasks,
} from './utils/storage';

interface UndoState {
  message: string;
  previousTasks: Task[];
}

export default function App() {
  const [tasks, setTasks] = useState<Task[]>(() => loadTasks());
  const [prefs, setPrefs] = useState<WorkspacePreferences>(() => loadPreferences());
  const [searchQuery, setSearchQuery] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);
  const [dropTargetId, setDropTargetId] = useState<string | null>(null);

  const [undoState, setUndoState] = useState<UndoState | null>(null);

  const searchInputRef = useRef<HTMLInputElement>(null);
  const quickAddInputRef = useRef<HTMLInputElement>(null);
  const undoTimerRef = useRef<number | null>(null);

  // Persist tasks to localStorage on every change
  useEffect(() => {
    saveTasks(tasks);
  }, [tasks]);

  // Persist workspace view/filter preferences to localStorage
  useEffect(() => {
    savePreferences(prefs);
  }, [prefs]);

  // Keyboard shortcuts: '/' focuses search, 'n' focuses quick-add
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const isTyping =
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.tagName === 'SELECT' ||
          target.isContentEditable);

      if (isTyping || modalOpen) return;

      if (e.key === '/') {
        e.preventDefault();
        searchInputRef.current?.focus();
      } else if (e.key.toLowerCase() === 'n' && prefs.activeSection !== 'analytics') {
        e.preventDefault();
        quickAddInputRef.current?.focus();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [modalOpen, prefs.activeSection]);

  const showUndoToast = (message: string, previousTasks: Task[]) => {
    if (undoTimerRef.current) {
      window.clearTimeout(undoTimerRef.current);
    }
    setUndoState({ message, previousTasks });
    undoTimerRef.current = window.setTimeout(() => {
      setUndoState(null);
      undoTimerRef.current = null;
    }, 5000);
  };

  const handleUndo = () => {
    if (!undoState) return;
    setTasks(undoState.previousTasks);
    setUndoState(null);
    if (undoTimerRef.current) {
      window.clearTimeout(undoTimerRef.current);
      undoTimerRef.current = null;
    }
  };

  const todayISO = getTodayISO();

  const allCategories = useMemo(() => {
    const set = new Set<string>([...TASK_CATEGORIES]);
    tasks.forEach((t) => {
      if (t.category) set.add(t.category);
    });
    return Array.from(set);
  }, [tasks]);

  const counts = useMemo(() => {
    const categories: Record<string, number> = {};
    let active = 0;
    let completed = 0;
    let high = 0;
    let medium = 0;
    let low = 0;
    let highPriorityActive = 0;
    let today = 0;

    for (const t of tasks) {
      if (t.completed) {
        completed += 1;
      } else {
        active += 1;
        if (t.priority === 'high') highPriorityActive += 1;
      }

      if (t.priority === 'high') high += 1;
      else if (t.priority === 'medium') medium += 1;
      else low += 1;

      if (!t.completed && (t.dueDate === todayISO || (t.dueDate && t.dueDate < todayISO))) {
        today += 1;
      }

      categories[t.category] = (categories[t.category] ?? 0) + 1;
    }

    return {
      all: tasks.length,
      active,
      completed,
      high,
      medium,
      low,
      highPriorityActive,
      today,
      categories,
    };
  }, [tasks, todayISO]);

  // Scope tasks by sidebar section, priority, category, and search before status tabs
  const scopedTasks = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return tasks.filter((task) => {
      if (prefs.activeSection === 'today') {
        const isDueTodayOrOverdue = Boolean(task.dueDate && task.dueDate <= todayISO);
        if (!isDueTodayOrOverdue && task.priority !== 'high') {
          return false;
        }
      }

      if (prefs.priorityFilter !== 'all' && task.priority !== prefs.priorityFilter) {
        return false;
      }

      if (prefs.categoryFilter !== 'all' && task.category !== prefs.categoryFilter) {
        return false;
      }

      if (query) {
        const haystack = `${task.title} ${task.notes ?? ''} ${task.category}`.toLowerCase();
        if (!haystack.includes(query)) return false;
      }

      return true;
    });
  }, [tasks, prefs.activeSection, prefs.priorityFilter, prefs.categoryFilter, searchQuery, todayISO]);

  const tabCounts = useMemo(() => {
    const active = scopedTasks.filter((t) => !t.completed).length;
    const completed = scopedTasks.length - active;
    return {
      all: scopedTasks.length,
      active,
      completed,
    };
  }, [scopedTasks]);

  const visibleTasks = useMemo(() => {
    const filtered = scopedTasks.filter((task) => {
      if (prefs.statusFilter === 'active') return !task.completed;
      if (prefs.statusFilter === 'completed') return task.completed;
      return true;
    });

    if (prefs.sortBy === 'manual') {
      return filtered;
    }

    return [...filtered].sort((a, b) => {
      if (prefs.sortBy === 'priority') {
        if (a.completed !== b.completed) return a.completed ? 1 : -1;
        return PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority];
      }
      if (prefs.sortBy === 'newest') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      if (prefs.sortBy === 'due-date') {
        if (!a.dueDate && !b.dueDate) return 0;
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return a.dueDate.localeCompare(b.dueDate);
      }
      return 0;
    });
  }, [scopedTasks, prefs.statusFilter, prefs.sortBy]);

  const updatePrefs = (patch: Partial<WorkspacePreferences>) => {
    setPrefs((prev) => ({ ...prev, ...patch }));
  };

  const handleAddTask = (data: {
    title: string;
    notes?: string;
    priority: Priority;
    category: string;
    dueDate?: string;
  }) => {
    const newTask: Task = {
      id: `tp-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      title: data.title,
      notes: data.notes,
      priority: data.priority,
      category: data.category || 'Product',
      dueDate: data.dueDate,
      completed: false,
      createdAt: new Date().toISOString(),
    };

    setTasks((prev) => [newTask, ...prev]);

    // If user is currently viewing only Completed, switch to Active/All so they see their new task
    if (prefs.statusFilter === 'completed') {
      updatePrefs({ statusFilter: 'all' });
    }
  };

  const handleSaveModalTask = (data: {
    id?: string;
    title: string;
    notes?: string;
    priority: Priority;
    category: string;
    dueDate?: string;
    completed?: boolean;
  }) => {
    if (data.id) {
      setTasks((prev) =>
        prev.map((task) => {
          if (task.id !== data.id) return task;
          const nextCompleted = data.completed ?? task.completed;
          return {
            ...task,
            title: data.title,
            notes: data.notes,
            priority: data.priority,
            category: data.category,
            dueDate: data.dueDate,
            completed: nextCompleted,
            completedAt:
              nextCompleted && !task.completed
                ? new Date().toISOString()
                : nextCompleted
                ? task.completedAt
                : undefined,
          };
        })
      );
    } else {
      handleAddTask(data);
    }
  };

  const handleToggleComplete = (id: string) => {
    setTasks((prev) =>
      prev.map((task) => {
        if (task.id !== id) return task;
        const completed = !task.completed;
        return {
          ...task,
          completed,
          completedAt: completed ? new Date().toISOString() : undefined,
        };
      })
    );
  };

  const handleDeleteTask = (id: string) => {
    const target = tasks.find((t) => t.id === id);
    if (!target) return;
    const snapshot = tasks;
    setTasks((prev) => prev.filter((t) => t.id !== id));
    showUndoToast(`Deleted "${target.title}"`, snapshot);
  };

  const handleClearCompleted = () => {
    const completedCount = tasks.filter((t) => t.completed).length;
    if (completedCount === 0) return;
    const snapshot = tasks;
    setTasks((prev) => prev.filter((t) => !t.completed));
    showUndoToast(
      `Cleared ${completedCount} completed ${completedCount === 1 ? 'task' : 'tasks'}`,
      snapshot
    );
  };

  const handleResetSampleData = () => {
    const snapshot = tasks;
    setTasks(getDefaultTasks());
    updatePrefs({
      activeSection: 'all-tasks',
      statusFilter: 'all',
      priorityFilter: 'all',
      categoryFilter: 'all',
    });
    setSearchQuery('');
    showUndoToast('Restored starter tasks', snapshot);
  };

  // Drag and Drop Reordering (Manual Sort)
  const isManualSort = prefs.sortBy === 'manual';

  const handleDragStart = (e: DragEvent<HTMLDivElement>, id: string) => {
    setDraggedTaskId(id);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', id);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>, id: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (draggedTaskId && draggedTaskId !== id) {
      setDropTargetId(id);
    }
  };

  const handleDragLeave = () => {
    setDropTargetId(null);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>, targetId: string) => {
    e.preventDefault();
    const sourceId = draggedTaskId || e.dataTransfer.getData('text/plain');
    setDraggedTaskId(null);
    setDropTargetId(null);

    if (!sourceId || sourceId === targetId) return;

    setTasks((prev) => {
      const fromIndex = prev.findIndex((t) => t.id === sourceId);
      const toIndex = prev.findIndex((t) => t.id === targetId);
      if (fromIndex === -1 || toIndex === -1) return prev;
      const updated = [...prev];
      const [moved] = updated.splice(fromIndex, 1);
      updated.splice(toIndex, 0, moved);
      return updated;
    });
  };

  const handleDragEnd = () => {
    setDraggedTaskId(null);
    setDropTargetId(null);
  };

  const sectionTitle =
    prefs.activeSection === 'today'
      ? "Today's Focus"
      : prefs.activeSection === 'analytics'
      ? 'Velocity & Insights'
      : 'All Tasks';

  const hasExtraFilters =
    prefs.priorityFilter !== 'all' ||
    prefs.categoryFilter !== 'all' ||
    searchQuery.trim().length > 0;

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0B1C30] flex">
      {/* Responsive Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        activeSection={prefs.activeSection}
        onSelectSection={(section: NavSection) => updatePrefs({ activeSection: section })}
        priorityFilter={prefs.priorityFilter}
        onSelectPriority={(priority) => updatePrefs({ priorityFilter: priority })}
        categoryFilter={prefs.categoryFilter}
        onSelectCategory={(category) => updatePrefs({ categoryFilter: category })}
        counts={counts}
        categories={allCategories}
        onResetSampleData={handleResetSampleData}
      />

      {/* Main Content Area */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Top Header */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-4 border-b border-[#E2E8F0] bg-[#FFFFFF]/95 px-4 sm:px-6 lg:px-10 backdrop-blur-xs">
          <div className="flex min-w-0 items-center gap-3">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open navigation menu"
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#E2E8F0] bg-white text-[#464554] hover:bg-[#F8FAFC] lg:hidden shrink-0"
            >
              <Menu className="h-5 w-5" />
            </button>

            <div className="flex min-w-0 items-center gap-2 text-sm">
              <span className="hidden sm:inline text-[#64748B] whitespace-nowrap">
                Workspace
              </span>
              <span className="hidden sm:inline text-[#CBD5E1]" aria-hidden="true">
                /
              </span>
              <h1 className="font-display text-base sm:text-lg font-semibold tracking-[-0.015em] text-[#0B1C30] truncate">
                {sectionTitle}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
            {/* Search Input */}
            <div className="relative hidden sm:block w-56 md:w-64">
              <Search
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#94A3B8]"
                aria-hidden="true"
              />
              <input
                ref={searchInputRef}
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search tasks... (/)"
                aria-label="Search tasks"
                className="h-10 w-full rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] pl-9 pr-8 text-sm text-[#0B1C30] placeholder:text-[#94A3B8] transition-colors focus:border-[#6366F1] focus:bg-[#FFFFFF] focus:outline-none focus:ring-2 focus:ring-[#6366F1] focus:ring-offset-1"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  aria-label="Clear search"
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded p-0.5 text-[#64748B] hover:text-[#0B1C30]"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            {/* Primary CTA */}
            <button
              type="button"
              onClick={() => {
                setEditingTask(null);
                setModalOpen(true);
              }}
              className="inline-flex h-10 items-center justify-center gap-1.5 rounded-lg bg-[#4648D4] px-3.5 sm:px-4 text-sm font-medium text-white transition-all duration-150 hover:bg-[#3B3DC4] active:scale-[0.98] whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6366F1] focus-visible:ring-offset-2"
            >
              <Plus className="h-4 w-4 shrink-0" />
              <span>New Task</span>
            </button>
          </div>
        </header>

        {/* Main Viewport */}
        <main className="mx-auto w-full max-w-[1440px] flex-1 px-4 py-6 sm:px-6 lg:px-10 lg:py-8">
          <div className="flex flex-col gap-6">
            {/* Mobile Search Input */}
            <div className="relative sm:hidden">
              <Search
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#94A3B8]"
                aria-hidden="true"
              />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search tasks..."
                aria-label="Search tasks"
                className="h-10 w-full rounded-lg border border-[#E2E8F0] bg-[#FFFFFF] pl-9 pr-8 text-sm text-[#0B1C30] placeholder:text-[#94A3B8] focus:border-[#6366F1] focus:outline-none focus:ring-2 focus:ring-[#6366F1] focus:ring-offset-1"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  aria-label="Clear search"
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded p-0.5 text-[#64748B] hover:text-[#0B1C30]"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            {/* Summary KPI Row */}
            <SummaryMetrics
              total={counts.all}
              active={counts.active}
              completed={counts.completed}
              highPriorityActive={counts.highPriorityActive}
            />

            {prefs.activeSection === 'analytics' ? (
              <AnalyticsView
                tasks={tasks}
                onNavigateToTasks={(priority, category) => {
                  updatePrefs({
                    activeSection: 'all-tasks',
                    priorityFilter: priority ?? 'all',
                    categoryFilter: category ?? 'all',
                  });
                }}
              />
            ) : (
              <>
                {/* Inline Quick-Add Bar */}
                <QuickAddBar
                  inputRef={quickAddInputRef}
                  defaultCategory={
                    prefs.categoryFilter !== 'all' ? prefs.categoryFilter : 'Product'
                  }
                  defaultPriority={
                    prefs.priorityFilter !== 'all' ? prefs.priorityFilter : 'medium'
                  }
                  onAddTask={handleAddTask}
                />

                {/* Task Board Container */}
                <section
                  aria-label="Task list"
                  className="rounded-2xl border border-[#E2E8F0] bg-[#FFFFFF] shadow-[0_1px_2px_0_rgba(15,23,42,0.04)] overflow-hidden"
                >
                  {/* Filter & Sort Toolbar */}
                  <div className="flex flex-col gap-3 border-b border-[#E2E8F0] bg-[#FFFFFF] px-4 py-3.5 sm:px-5 md:flex-row md:items-center md:justify-between">
                    {/* Status Segmented Tabs: All | Active | Completed */}
                    <div
                      role="tablist"
                      aria-label="Filter tasks by status"
                      className="inline-flex items-center gap-1 rounded-lg bg-[#F1F5F9] p-1 self-start"
                    >
                      {(
                        [
                          { key: 'all' as TaskStatusFilter, label: 'All', count: tabCounts.all },
                          { key: 'active' as TaskStatusFilter, label: 'Active', count: tabCounts.active },
                          {
                            key: 'completed' as TaskStatusFilter,
                            label: 'Completed',
                            count: tabCounts.completed,
                          },
                        ]
                      ).map((tab) => {
                        const isActive = prefs.statusFilter === tab.key;
                        return (
                          <button
                            key={tab.key}
                            type="button"
                            role="tab"
                            aria-selected={isActive}
                            onClick={() => updatePrefs({ statusFilter: tab.key })}
                            className={`inline-flex h-8 items-center gap-1.5 rounded-md px-3 text-xs font-semibold transition-all duration-150 whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6366F1] ${
                              isActive
                                ? 'bg-[#FFFFFF] text-[#0B1C30] shadow-2xs'
                                : 'text-[#64748B] hover:text-[#0B1C30]'
                            }`}
                          >
                            <span>{tab.label}</span>
                            <span
                              className={`font-mono text-[11px] tabular-nums ${
                                isActive ? 'text-[#4648D4]' : 'text-[#94A3B8]'
                              }`}
                            >
                              {tab.count}
                            </span>
                          </button>
                        );
                      })}
                    </div>

                    {/* Right Toolbar Controls: Priority Filter, Sort, Clear Completed */}
                    <div className="flex flex-wrap items-center gap-2">
                      {/* Active Filter Context Summary / Reset */}
                      {hasExtraFilters && (
                        <button
                          type="button"
                          onClick={() => {
                            updatePrefs({ priorityFilter: 'all', categoryFilter: 'all' });
                            setSearchQuery('');
                          }}
                          className="inline-flex h-8 items-center gap-1 rounded-lg border border-[#E2E8F0] bg-[#EFF4FF] px-2.5 text-xs font-medium text-[#4648D4] hover:bg-[#E1E0FF] transition-colors whitespace-nowrap"
                        >
                          <span>
                            {prefs.categoryFilter !== 'all' ? prefs.categoryFilter : ''}
                            {prefs.categoryFilter !== 'all' && prefs.priorityFilter !== 'all'
                              ? ' · '
                              : ''}
                            {prefs.priorityFilter !== 'all'
                              ? `${prefs.priorityFilter[0].toUpperCase()}${prefs.priorityFilter.slice(1)} priority`
                              : ''}
                            {searchQuery.trim()
                              ? `${
                                  prefs.categoryFilter !== 'all' || prefs.priorityFilter !== 'all'
                                    ? ' · '
                                    : ''
                                }"${searchQuery.trim()}"`
                              : ''}
                          </span>
                          <X className="h-3 w-3 shrink-0" />
                        </button>
                      )}

                      <select
                        aria-label="Filter by priority"
                        value={prefs.priorityFilter}
                        onChange={(e) =>
                          updatePrefs({
                            priorityFilter: e.target.value as Priority | 'all',
                          })
                        }
                        className="h-8 rounded-lg border border-[#E2E8F0] bg-[#FFFFFF] px-2.5 text-xs font-medium text-[#464554] focus:border-[#6366F1] focus:outline-none focus:ring-2 focus:ring-[#6366F1]"
                      >
                        <option value="all">All Priorities</option>
                        <option value="high">High Priority</option>
                        <option value="medium">Medium Priority</option>
                        <option value="low">Low Priority</option>
                      </select>

                      <select
                        aria-label="Sort tasks"
                        value={prefs.sortBy}
                        onChange={(e) =>
                          updatePrefs({ sortBy: e.target.value as SortOption })
                        }
                        className="h-8 rounded-lg border border-[#E2E8F0] bg-[#FFFFFF] px-2.5 text-xs font-medium text-[#464554] focus:border-[#6366F1] focus:outline-none focus:ring-2 focus:ring-[#6366F1]"
                      >
                        <option value="manual">Manual Order</option>
                        <option value="priority">Priority (High → Low)</option>
                        <option value="due-date">Due Date</option>
                        <option value="newest">Newest First</option>
                      </select>

                      {counts.completed > 0 && (
                        <button
                          type="button"
                          onClick={handleClearCompleted}
                          className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-[#E2E8F0] bg-[#FFFFFF] px-2.5 text-xs font-medium text-[#64748B] hover:bg-[#F8FAFC] hover:text-[#0B1C30] transition-colors whitespace-nowrap shrink-0"
                        >
                          <CheckCheck className="h-3.5 w-3.5" />
                          <span>Clear completed</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Task Rows or Empty State */}
                  {visibleTasks.length > 0 ? (
                    <div className="divide-y divide-[#E2E8F0]">
                      {visibleTasks.map((task) => (
                        <TaskRow
                          key={task.id}
                          task={task}
                          isDraggable={isManualSort}
                          isDragged={draggedTaskId === task.id}
                          isDropTarget={dropTargetId === task.id}
                          onToggleComplete={handleToggleComplete}
                          onEdit={(t) => {
                            setEditingTask(t);
                            setModalOpen(true);
                          }}
                          onDelete={handleDeleteTask}
                          onDragStart={handleDragStart}
                          onDragOver={handleDragOver}
                          onDragLeave={handleDragLeave}
                          onDrop={handleDrop}
                          onDragEnd={handleDragEnd}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center px-6 py-14 text-center">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#EFF4FF] text-[#4648D4]">
                        <ClipboardList className="h-6 w-6" />
                      </div>
                      <h3 className="mt-4 font-display text-base font-semibold text-[#0B1C30]">
                        {tasks.length === 0
                          ? 'Your task queue is empty'
                          : 'No tasks match these filters'}
                      </h3>
                      <p className="mt-1.5 max-w-sm text-sm text-[#64748B]">
                        {tasks.length === 0
                          ? 'Add your first task above or create a detailed item to begin tracking progress.'
                          : 'Try switching status tabs or clearing your active search and sidebar filters.'}
                      </p>
                      <div className="mt-5 flex items-center gap-2.5">
                        {tasks.length === 0 ? (
                          <button
                            type="button"
                            onClick={() => {
                              setEditingTask(null);
                              setModalOpen(true);
                            }}
                            className="inline-flex h-10 items-center gap-1.5 rounded-lg bg-[#4648D4] px-4 text-sm font-medium text-white hover:bg-[#3B3DC4] transition-colors"
                          >
                            <Plus className="h-4 w-4" />
                            <span>Create First Task</span>
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => {
                              updatePrefs({
                                activeSection: 'all-tasks',
                                statusFilter: 'all',
                                priorityFilter: 'all',
                                categoryFilter: 'all',
                              });
                              setSearchQuery('');
                            }}
                            className="inline-flex h-10 items-center rounded-lg border border-[#E2E8F0] bg-[#FFFFFF] px-4 text-sm font-medium text-[#0B1C30] hover:bg-[#F8FAFC] transition-colors"
                          >
                            Reset Filters
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </section>
              </>
            )}
          </div>
        </main>
      </div>

      {/* Add / Edit Task Modal */}
      <TaskModal
        isOpen={modalOpen}
        editingTask={editingTask}
        defaultCategory={prefs.categoryFilter}
        onClose={() => {
          setModalOpen(false);
          setEditingTask(null);
        }}
        onSave={handleSaveModalTask}
      />

      {/* Undo Toast */}
      {undoState && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-5 right-5 z-50 flex items-center gap-4 rounded-xl bg-[#213145] px-4 py-3 text-sm text-[#EAF1FF] shadow-[0_10px_15px_-3px_rgba(15,23,42,0.18)]"
        >
          <span className="max-w-xs truncate">{undoState.message}</span>
          <button
            type="button"
            onClick={handleUndo}
            className="font-semibold text-[#C0C1FF] hover:text-white transition-colors whitespace-nowrap"
          >
            Undo
          </button>
        </div>
      )}
    </div>
  );
}
