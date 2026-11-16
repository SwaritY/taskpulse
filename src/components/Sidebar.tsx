import {
  BarChart3,
  CalendarClock,
  CheckSquare,
  Folder,
  RotateCcw,
  X,
} from 'lucide-react';
import { useState } from 'react';
import { NavSection, Priority } from '../types/task';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  activeSection: NavSection;
  onSelectSection: (section: NavSection) => void;
  priorityFilter: Priority | 'all';
  onSelectPriority: (priority: Priority | 'all') => void;
  categoryFilter: string | 'all';
  onSelectCategory: (category: string | 'all') => void;
  counts: {
    all: number;
    active: number;
    today: number;
    high: number;
    medium: number;
    low: number;
    categories: Record<string, number>;
  };
  categories: string[];
  onResetSampleData: () => void;
}

export function Sidebar({
  isOpen,
  onClose,
  activeSection,
  onSelectSection,
  priorityFilter,
  onSelectPriority,
  categoryFilter,
  onSelectCategory,
  counts,
  categories,
  onResetSampleData,
}: SidebarProps) {
  const [confirmReset, setConfirmReset] = useState(false);

  const handleNavClick = (section: NavSection) => {
    onSelectSection(section);
    onClose();
  };

  const handlePriorityClick = (priority: Priority | 'all') => {
    if (activeSection === 'analytics') {
      onSelectSection('all-tasks');
    }
    onSelectPriority(priorityFilter === priority ? 'all' : priority);
    onClose();
  };

  const handleCategoryClick = (category: string) => {
    if (activeSection === 'analytics') {
      onSelectSection('all-tasks');
    }
    onSelectCategory(categoryFilter === category ? 'all' : category);
    onClose();
  };

  const navContent = (
    <div className="flex h-full flex-col justify-between bg-[#FFFFFF] border-r border-[#E2E8F0]">
      <div className="flex flex-col gap-6 p-4 sm:p-5 overflow-y-auto">
        {/* Brand Header */}
        <div className="flex items-center justify-between px-2 pt-1">
          <button
            type="button"
            onClick={() => {
              onSelectSection('all-tasks');
              onSelectPriority('all');
              onSelectCategory('all');
              onClose();
            }}
            className="flex items-center gap-2.5 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6366F1] focus-visible:ring-offset-2 rounded-lg"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#4648D4] text-white shadow-xs shrink-0">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <polyline points="22 12 18 12 15 20 9 4 6 12 2 12" />
              </svg>
            </div>
            <span className="font-display text-lg font-bold tracking-[-0.02em] text-[#0B1C30] whitespace-nowrap">
              TaskPulse
            </span>
          </button>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close navigation menu"
            className="flex h-9 w-9 items-center justify-center rounded-lg text-[#64748B] hover:bg-[#F1F5F9] hover:text-[#0B1C30] lg:hidden transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Workspace Views */}
        <nav aria-label="Primary navigation" className="flex flex-col gap-1">
          <p className="px-2.5 pb-1.5 text-[11px] font-semibold tracking-[0.04em] text-[#64748B]">
            Workspace
          </p>

          <button
            type="button"
            onClick={() => handleNavClick('all-tasks')}
            className={`flex h-10 w-full items-center justify-between rounded-lg px-2.5 text-sm font-medium transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6366F1] ${
              activeSection === 'all-tasks'
                ? 'bg-[#EFF4FF] text-[#4648D4]'
                : 'text-[#464554] hover:bg-[#F8FAFC] hover:text-[#0B1C30]'
            }`}
          >
            <span className="flex items-center gap-2.5 whitespace-nowrap shrink-0">
              <CheckSquare className="h-4 w-4 shrink-0" />
              All Tasks
            </span>
            <span
              className={`font-mono text-xs tabular-nums ${
                activeSection === 'all-tasks' ? 'text-[#4648D4] font-semibold' : 'text-[#64748B]'
              }`}
            >
              {counts.all}
            </span>
          </button>

          <button
            type="button"
            onClick={() => handleNavClick('today')}
            className={`flex h-10 w-full items-center justify-between rounded-lg px-2.5 text-sm font-medium transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6366F1] ${
              activeSection === 'today'
                ? 'bg-[#EFF4FF] text-[#4648D4]'
                : 'text-[#464554] hover:bg-[#F8FAFC] hover:text-[#0B1C30]'
            }`}
          >
            <span className="flex items-center gap-2.5 whitespace-nowrap shrink-0">
              <CalendarClock className="h-4 w-4 shrink-0" />
              Today’s Focus
            </span>
            <span
              className={`font-mono text-xs tabular-nums ${
                activeSection === 'today' ? 'text-[#4648D4] font-semibold' : 'text-[#64748B]'
              }`}
            >
              {counts.today}
            </span>
          </button>

          <button
            type="button"
            onClick={() => handleNavClick('analytics')}
            className={`flex h-10 w-full items-center justify-between rounded-lg px-2.5 text-sm font-medium transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6366F1] ${
              activeSection === 'analytics'
                ? 'bg-[#EFF4FF] text-[#4648D4]'
                : 'text-[#464554] hover:bg-[#F8FAFC] hover:text-[#0B1C30]'
            }`}
          >
            <span className="flex items-center gap-2.5 whitespace-nowrap shrink-0">
              <BarChart3 className="h-4 w-4 shrink-0" />
              Velocity & Insights
            </span>
          </button>
        </nav>

        {/* Priority Quick Filters */}
        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-between px-2.5 pb-1.5">
            <p className="text-[11px] font-semibold tracking-[0.04em] text-[#64748B]">
              Priority
            </p>
            {priorityFilter !== 'all' && (
              <button
                type="button"
                onClick={() => onSelectPriority('all')}
                className="text-[11px] font-medium text-[#4648D4] hover:underline"
              >
                Clear
              </button>
            )}
          </div>

          {(
            [
              {
                key: 'high' as const,
                label: 'High Priority',
                count: counts.high,
                swatch: 'bg-[#EF4444]',
              },
              {
                key: 'medium' as const,
                label: 'Medium Priority',
                count: counts.medium,
                swatch: 'bg-[#F59E0B]',
              },
              {
                key: 'low' as const,
                label: 'Low Priority',
                count: counts.low,
                swatch: 'bg-[#3B82F6]',
              },
            ]
          ).map((item) => {
            const selected = priorityFilter === item.key && activeSection !== 'analytics';
            return (
              <button
                key={item.key}
                type="button"
                onClick={() => handlePriorityClick(item.key)}
                className={`flex h-9 w-full items-center justify-between rounded-lg px-2.5 text-sm font-medium transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6366F1] ${
                  selected
                    ? 'bg-[#EFF4FF] text-[#4648D4]'
                    : 'text-[#464554] hover:bg-[#F8FAFC] hover:text-[#0B1C30]'
                }`}
              >
                <span className="flex items-center gap-2.5 whitespace-nowrap shrink-0">
                  <span
                    className={`h-2 w-2 rounded-sm ${item.swatch} shrink-0`}
                    aria-hidden="true"
                  />
                  {item.label}
                </span>
                <span className="font-mono text-xs tabular-nums text-[#64748B]">
                  {item.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Categories */}
        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-between px-2.5 pb-1.5">
            <p className="text-[11px] font-semibold tracking-[0.04em] text-[#64748B]">
              Lists
            </p>
            {categoryFilter !== 'all' && (
              <button
                type="button"
                onClick={() => onSelectCategory('all')}
                className="text-[11px] font-medium text-[#4648D4] hover:underline"
              >
                All
              </button>
            )}
          </div>

          {categories.map((category) => {
            const selected = categoryFilter === category && activeSection !== 'analytics';
            const count = counts.categories[category] ?? 0;
            return (
              <button
                key={category}
                type="button"
                onClick={() => handleCategoryClick(category)}
                className={`flex h-9 w-full items-center justify-between rounded-lg px-2.5 text-sm font-medium transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6366F1] ${
                  selected
                    ? 'bg-[#EFF4FF] text-[#4648D4]'
                    : 'text-[#464554] hover:bg-[#F8FAFC] hover:text-[#0B1C30]'
                }`}
              >
                <span className="flex items-center gap-2.5 truncate">
                  <Folder className="h-4 w-4 shrink-0 text-[#64748B]" />
                  <span className="truncate">{category}</span>
                </span>
                <span className="font-mono text-xs tabular-nums text-[#64748B]">
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Bottom Workspace Utility */}
      <div className="border-t border-[#E2E8F0] p-4">
        {!confirmReset ? (
          <button
            type="button"
            onClick={() => setConfirmReset(true)}
            className="flex h-9 w-full items-center gap-2 rounded-lg px-2.5 text-xs font-medium text-[#64748B] hover:bg-[#F1F5F9] hover:text-[#0B1C30] transition-colors"
          >
            <RotateCcw className="h-3.5 w-3.5 shrink-0" />
            <span className="whitespace-nowrap">Restore starter tasks</span>
          </button>
        ) : (
          <div className="flex flex-col gap-2 rounded-lg bg-[#F8FAFC] p-2.5 border border-[#E2E8F0]">
            <p className="text-xs text-[#464554]">Replace current list with defaults?</p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  onResetSampleData();
                  setConfirmReset(false);
                  onClose();
                }}
                className="flex-1 rounded-md bg-[#4648D4] px-2.5 py-1.5 text-xs font-medium text-white hover:bg-[#3B3DC4] transition-colors"
              >
                Restore
              </button>
              <button
                type="button"
                onClick={() => setConfirmReset(false)}
                className="flex-1 rounded-md border border-[#E2E8F0] bg-white px-2.5 py-1.5 text-xs font-medium text-[#464554] hover:bg-[#F8FAFC] transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Static Sidebar */}
      <aside className="hidden lg:block lg:w-64 lg:shrink-0">
        <div className="sticky top-0 h-screen">{navContent}</div>
      </aside>

      {/* Mobile / Tablet Slide-over Drawer */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex lg:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Workspace Navigation"
        >
          <div
            className="fixed inset-0 bg-[#0B1C30]/30 backdrop-blur-[1px] transition-opacity"
            onClick={onClose}
          />
          <div className="relative z-10 w-72 max-w-[85vw] h-full shadow-[0_20px_25px_-5px_rgba(15,23,42,0.1)]">
            {navContent}
          </div>
        </div>
      )}
    </>
  );
}
