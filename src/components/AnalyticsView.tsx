import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { Priority, TASK_CATEGORIES, Task } from '../types/task';
import { PriorityBadge } from './PriorityBadge';

interface AnalyticsViewProps {
  tasks: Task[];
  onNavigateToTasks: (priority?: Priority | 'all', category?: string | 'all') => void;
}

export function AnalyticsView({ tasks, onNavigateToTasks }: AnalyticsViewProps) {
  const total = tasks.length;
  const completed = tasks.filter((t) => t.completed).length;
  const active = total - completed;
  const overallRate = total > 0 ? Math.round((completed / total) * 100) : 0;

  const priorityRows: {
    key: Priority;
    label: string;
    barColor: string;
    total: number;
    completed: number;
    active: number;
  }[] = (
    [
      { key: 'high' as const, label: 'High Priority', barColor: 'bg-[#EF4444]' },
      { key: 'medium' as const, label: 'Medium Priority', barColor: 'bg-[#F59E0B]' },
      { key: 'low' as const, label: 'Low Priority', barColor: 'bg-[#3B82F6]' },
    ]
  ).map((p) => {
    const subset = tasks.filter((t) => t.priority === p.key);
    const done = subset.filter((t) => t.completed).length;
    return {
      ...p,
      total: subset.length,
      completed: done,
      active: subset.length - done,
    };
  });

  const allCategories = Array.from(
    new Set([...TASK_CATEGORIES, ...tasks.map((t) => t.category)])
  );

  const categoryRows = allCategories
    .map((cat) => {
      const subset = tasks.filter((t) => t.category === cat);
      const done = subset.filter((t) => t.completed).length;
      const pct = subset.length > 0 ? Math.round((done / subset.length) * 100) : 0;
      return {
        category: cat,
        total: subset.length,
        active: subset.length - done,
        completed: done,
        pct,
      };
    })
    .filter((row) => row.total > 0);

  const recentlyCompleted = tasks
    .filter((t) => t.completed)
    .sort((a, b) => {
      const ta = a.completedAt ? new Date(a.completedAt).getTime() : 0;
      const tb = b.completedAt ? new Date(b.completedAt).getTime() : 0;
      return tb - ta;
    })
    .slice(0, 5);

  return (
    <div className="flex flex-col gap-6">
      {/* Top Overview Banner */}
      <div className="rounded-2xl border border-[#E2E8F0] bg-[#FFFFFF] p-5 sm:p-6 shadow-[0_1px_2px_0_rgba(15,23,42,0.04)]">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-display text-lg font-semibold tracking-[-0.01em] text-[#0B1C30]">
              Execution Progress
            </h2>
            <p className="mt-1 text-sm text-[#64748B]">
              Live completion metrics derived from your current workspace tasks.
            </p>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-display text-3xl font-bold tracking-[-0.02em] text-[#0B1C30] tabular-nums">
              {overallRate}%
            </span>
            <span className="text-xs font-medium text-[#64748B] tabular-nums">
              {completed} of {total} completed
            </span>
          </div>
        </div>

        <div className="mt-5 h-2.5 w-full overflow-hidden rounded-full bg-[#EFF4FF]">
          <div
            className="h-full rounded-full bg-[#10B981] transition-all duration-300"
            style={{ width: `${overallRate}%` }}
          />
        </div>

        <div className="mt-3 flex items-center justify-between text-xs text-[#64748B] tabular-nums">
          <span>{active} active tasks remaining</span>
          <span>{completed} tasks cleared</span>
        </div>
      </div>

      {/* Two-Column Breakdown */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Priority Distribution */}
        <section className="rounded-2xl border border-[#E2E8F0] bg-[#FFFFFF] p-5 sm:p-6 shadow-[0_1px_2px_0_rgba(15,23,42,0.04)]">
          <div className="flex items-center justify-between gap-2 pb-4 border-b border-[#E2E8F0]">
            <h3 className="font-display text-base font-semibold text-[#0B1C30]">
              Priority Distribution
            </h3>
            <span className="text-xs text-[#64748B] tabular-nums">{total} total</span>
          </div>

          <div className="mt-4 flex flex-col gap-4">
            {priorityRows.map((row) => {
              const share = total > 0 ? Math.round((row.total / total) * 100) : 0;
              return (
                <div key={row.key} className="flex flex-col gap-2">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <PriorityBadge priority={row.key} />
                      <span className="text-xs text-[#64748B] tabular-nums">
                        {row.active} active · {row.completed} done
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => onNavigateToTasks(row.key, 'all')}
                      className="inline-flex items-center gap-1 text-xs font-medium text-[#4648D4] hover:underline tabular-nums"
                    >
                      <span>{row.total} tasks</span>
                      <ArrowRight className="h-3 w-3" />
                    </button>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-[#F1F5F9]">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${row.barColor}`}
                      style={{ width: `${share}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Category Breakdown Table */}
        <section className="rounded-2xl border border-[#E2E8F0] bg-[#FFFFFF] p-5 sm:p-6 shadow-[0_1px_2px_0_rgba(15,23,42,0.04)]">
          <div className="flex items-center justify-between gap-2 pb-4 border-b border-[#E2E8F0]">
            <h3 className="font-display text-base font-semibold text-[#0B1C30]">
              Lists & Categories
            </h3>
            <span className="text-xs text-[#64748B] tabular-nums">
              {categoryRows.length} active lists
            </span>
          </div>

          {categoryRows.length === 0 ? (
            <p className="py-8 text-center text-sm text-[#64748B]">
              Add tasks to see list velocity metrics.
            </p>
          ) : (
            <div className="mt-2 overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#E2E8F0] text-[11px] font-semibold tracking-[0.02em] text-[#64748B]">
                    <th className="py-2.5 pr-3">List</th>
                    <th className="py-2.5 px-3 text-right">Active</th>
                    <th className="py-2.5 px-3 text-right">Done</th>
                    <th className="py-2.5 pl-3 text-right">Progress</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E2E8F0] text-sm">
                  {categoryRows.map((row) => (
                    <tr key={row.category} className="hover:bg-[#F8FAFC] transition-colors">
                      <td className="py-2.5 pr-3 font-medium text-[#0B1C30]">
                        <button
                          type="button"
                          onClick={() => onNavigateToTasks('all', row.category)}
                          className="hover:text-[#4648D4] hover:underline text-left"
                        >
                          {row.category}
                        </button>
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono text-xs text-[#464554] tabular-nums">
                        {row.active}
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono text-xs text-[#059669] tabular-nums">
                        {row.completed}
                      </td>
                      <td className="py-2.5 pl-3 text-right font-mono text-xs font-semibold text-[#0B1C30] tabular-nums">
                        {row.pct}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>

      {/* Recently Completed */}
      <section className="rounded-2xl border border-[#E2E8F0] bg-[#FFFFFF] p-5 sm:p-6 shadow-[0_1px_2px_0_rgba(15,23,42,0.04)]">
        <div className="flex items-center justify-between gap-2 pb-4 border-b border-[#E2E8F0]">
          <h3 className="font-display text-base font-semibold text-[#0B1C30]">
            Recently Completed
          </h3>
          <span className="text-xs text-[#64748B] tabular-nums">
            Latest {recentlyCompleted.length}
          </span>
        </div>

        {recentlyCompleted.length === 0 ? (
          <p className="py-8 text-center text-sm text-[#64748B]">
            No completed tasks yet. Check off an item in All Tasks to track your progress.
          </p>
        ) : (
          <ul className="divide-y divide-[#E2E8F0]">
            {recentlyCompleted.map((task) => (
              <li
                key={task.id}
                className="flex items-center justify-between gap-3 py-3 text-sm"
              >
                <div className="flex min-w-0 items-center gap-2.5">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-[#10B981]" aria-hidden="true" />
                  <span className="truncate font-medium text-[#0B1C30]">{task.title}</span>
                </div>
                <div className="flex shrink-0 items-center gap-3">
                  <span className="hidden sm:inline text-xs text-[#64748B]">
                    {task.category}
                  </span>
                  <PriorityBadge priority={task.priority} />
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
