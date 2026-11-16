import { Priority } from '../types/task';

interface PriorityBadgeProps {
  priority: Priority;
}

const PRIORITY_STYLES: Record<
  Priority,
  { bg: string; text: string; label: string }
> = {
  high: {
    bg: 'bg-[#FEF2F2]',
    text: 'text-[#DC2626]',
    label: 'High',
  },
  medium: {
    bg: 'bg-[#FFFBEB]',
    text: 'text-[#D97706]',
    label: 'Medium',
  },
  low: {
    bg: 'bg-[#EFF6FF]',
    text: 'text-[#2563EB]',
    label: 'Low',
  },
};

export function PriorityBadge({ priority }: PriorityBadgeProps) {
  const style = PRIORITY_STYLES[priority];

  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-[2px] text-[11px] font-semibold leading-4 tracking-[0.02em] whitespace-nowrap shrink-0 ${style.bg} ${style.text}`}
    >
      {style.label}
    </span>
  );
}

export function CompletedBadge() {
  return (
    <span className="inline-flex items-center rounded-full bg-[#ECFDF5] px-2 py-[2px] text-[11px] font-semibold leading-4 tracking-[0.02em] text-[#059669] whitespace-nowrap shrink-0">
      Completed
    </span>
  );
}
