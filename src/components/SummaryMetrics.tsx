interface SummaryMetricsProps {
  total: number;
  active: number;
  completed: number;
  highPriorityActive: number;
}

export function SummaryMetrics({
  total,
  active,
  completed,
  highPriorityActive,
}: SummaryMetricsProps) {
  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <section
      aria-label="Productivity summary"
      className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4"
    >
      <div className="rounded-2xl border border-[#E2E8F0] bg-[#FFFFFF] p-4 sm:p-5 shadow-[0_1px_2px_0_rgba(15,23,42,0.04)]">
        <p className="text-xs font-medium text-[#64748B]">Total Tasks</p>
        <div className="mt-2 flex items-baseline justify-between gap-2">
          <span className="font-display text-2xl sm:text-3xl font-bold tracking-[-0.02em] text-[#0B1C30] tabular-nums">
            {total}
          </span>
          <span className="text-xs text-[#64748B] tabular-nums whitespace-nowrap">
            {active} open
          </span>
        </div>
      </div>

      <div className="rounded-2xl border border-[#E2E8F0] bg-[#FFFFFF] p-4 sm:p-5 shadow-[0_1px_2px_0_rgba(15,23,42,0.04)]">
        <p className="text-xs font-medium text-[#64748B]">Active Queue</p>
        <div className="mt-2 flex items-baseline justify-between gap-2">
          <span className="font-display text-2xl sm:text-3xl font-bold tracking-[-0.02em] text-[#0B1C30] tabular-nums">
            {active}
          </span>
          <span className="text-xs font-medium text-[#DC2626] tabular-nums whitespace-nowrap">
            {highPriorityActive} high priority
          </span>
        </div>
      </div>

      <div className="rounded-2xl border border-[#E2E8F0] bg-[#FFFFFF] p-4 sm:p-5 shadow-[0_1px_2px_0_rgba(15,23,42,0.04)]">
        <p className="text-xs font-medium text-[#64748B]">Completed</p>
        <div className="mt-2 flex items-baseline justify-between gap-2">
          <span className="font-display text-2xl sm:text-3xl font-bold tracking-[-0.02em] text-[#059669] tabular-nums">
            {completed}
          </span>
          <span className="text-xs text-[#64748B] tabular-nums whitespace-nowrap">
            of {total} tasks
          </span>
        </div>
      </div>

      <div className="rounded-2xl border border-[#E2E8F0] bg-[#FFFFFF] p-4 sm:p-5 shadow-[0_1px_2px_0_rgba(15,23,42,0.04)]">
        <div className="flex items-center justify-between gap-2">
          <p className="text-xs font-medium text-[#64748B]">Completion Rate</p>
          <span className="font-mono text-xs font-semibold text-[#0B1C30] tabular-nums">
            {completionRate}%
          </span>
        </div>
        <div className="mt-3.5 h-2 w-full overflow-hidden rounded-full bg-[#EFF4FF]">
          <div
            className="h-full rounded-full bg-[#10B981] transition-all duration-300 ease-out"
            style={{ width: `${completionRate}%` }}
            role="progressbar"
            aria-valuenow={completionRate}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Task completion percentage"
          />
        </div>
        <p className="mt-2 text-xs text-[#64748B] truncate">
          {completionRate === 100 && total > 0
            ? 'All queued tasks finished'
            : active > 0
            ? `${active} remaining to clear`
            : 'Ready for new tasks'}
        </p>
      </div>
    </section>
  );
}
