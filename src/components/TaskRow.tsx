import { Check, GripVertical, Pencil, Trash2 } from 'lucide-react';
import { DragEvent } from 'react';
import { Task } from '../types/task';
import { formatDueDate } from '../utils/formatters';
import { CompletedBadge, PriorityBadge } from './PriorityBadge';

interface TaskRowProps {
  task: Task;
  isDraggable: boolean;
  isDragged: boolean;
  isDropTarget: boolean;
  onToggleComplete: (id: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onDragStart: (e: DragEvent<HTMLDivElement>, id: string) => void;
  onDragOver: (e: DragEvent<HTMLDivElement>, id: string) => void;
  onDragLeave: () => void;
  onDrop: (e: DragEvent<HTMLDivElement>, targetId: string) => void;
  onDragEnd: () => void;
}

export function TaskRow({
  task,
  isDraggable,
  isDragged,
  isDropTarget,
  onToggleComplete,
  onEdit,
  onDelete,
  onDragStart,
  onDragOver,
  onDragLeave,
  onDrop,
  onDragEnd,
}: TaskRowProps) {
  const due = formatDueDate(task.dueDate);

  return (
    <div
      draggable={isDraggable}
      onDragStart={(e) => isDraggable && onDragStart(e, task.id)}
      onDragOver={(e) => isDraggable && onDragOver(e, task.id)}
      onDragLeave={onDragLeave}
      onDrop={(e) => isDraggable && onDrop(e, task.id)}
      onDragEnd={onDragEnd}
      className={`group flex items-start sm:items-center justify-between gap-3 px-3 sm:px-5 py-3.5 border-b border-[#E2E8F0] last:border-b-0 transition-colors duration-150 ${
        isDragged
          ? 'opacity-45 bg-[#EFF4FF]'
          : isDropTarget
          ? 'bg-[#EFF4FF]/70 ring-1 ring-inset ring-[#6366F1]'
          : task.completed
          ? 'bg-[#F8FAFC]/55 hover:bg-[#F8FAFC]'
          : 'bg-[#FFFFFF] hover:bg-[#F8FAFC]/80'
      }`}
    >
      {/* Left Cluster: Drag Handle + Checkbox + Title & Metadata */}
      <div className="flex min-w-0 flex-1 items-start gap-2.5 sm:gap-3">
        <div
          className={`mt-1 sm:mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center text-[#94A3B8] ${
            isDraggable
              ? 'cursor-grab active:cursor-grabbing opacity-60 group-hover:opacity-100 hover:text-[#464554]'
              : 'opacity-25 cursor-default'
          }`}
          title={
            isDraggable
              ? 'Drag to reorder'
              : 'Switch sort to Manual Order to drag and reorder'
          }
          aria-hidden="true"
        >
          <GripVertical className="h-4 w-4" />
        </div>

        {/* Custom 20x20px Checkbox */}
        <button
          type="button"
          role="checkbox"
          aria-checked={task.completed}
          aria-label={
            task.completed
              ? `Mark "${task.title}" as active`
              : `Mark "${task.title}" as completed`
          }
          onClick={() => onToggleComplete(task.id)}
          className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-[6px] border-[1.5px] transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6366F1] focus-visible:ring-offset-2 ${
            task.completed
              ? 'border-[#10B981] bg-[#10B981] text-white'
              : 'border-[#CBD5E1] bg-[#FFFFFF] text-transparent hover:border-[#6366F1]'
          }`}
        >
          <Check className="h-3.5 w-3.5 stroke-[2.75]" aria-hidden="true" />
        </button>

        {/* Task Content */}
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
            <button
              type="button"
              onClick={() => onEdit(task)}
              className={`text-left text-[15px] font-semibold leading-5 tracking-[-0.005em] transition-colors focus-visible:outline-none focus-visible:underline ${
                task.completed
                  ? 'text-[#64748B] line-through decoration-[#94A3B8]'
                  : 'text-[#0B1C30] hover:text-[#4648D4]'
              }`}
            >
              {task.title}
            </button>
          </div>

          {task.notes && (
            <p
              className={`mt-0.5 text-xs leading-4 truncate max-w-2xl ${
                task.completed ? 'text-[#94A3B8]' : 'text-[#64748B]'
              }`}
            >
              {task.notes}
            </p>
          )}

          {/* Unboxed Metadata Line */}
          <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-[#64748B]">
            <span className="font-medium text-[#464554]">{task.category}</span>
            {due && (
              <>
                <span aria-hidden="true">·</span>
                <span
                  className={`font-mono tabular-nums ${
                    !task.completed && due.isOverdue
                      ? 'font-medium text-[#DC2626]'
                      : !task.completed && due.isToday
                      ? 'font-medium text-[#4648D4]'
                      : 'text-[#64748B]'
                  }`}
                >
                  {due.isOverdue && !task.completed ? `Overdue (${due.label})` : `Due ${due.label}`}
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Right Cluster: Priority Badge + Status Badge + Row Actions */}
      <div className="flex shrink-0 items-center gap-2 sm:gap-2.5">
        <div className="flex items-center gap-1.5">
          {task.completed && (
            <span className="hidden sm:inline-flex">
              <CompletedBadge />
            </span>
          )}
          <PriorityBadge priority={task.priority} />
        </div>

        <div className="flex items-center gap-0.5 sm:opacity-75 sm:group-hover:opacity-100 sm:focus-within:opacity-100 transition-opacity">
          <button
            type="button"
            onClick={() => onEdit(task)}
            aria-label={`Edit "${task.title}"`}
            title="Edit task"
            className="flex h-8 w-8 items-center justify-center rounded-lg text-[#64748B] hover:bg-[#F1F5F9] hover:text-[#0B1C30] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6366F1]"
          >
            <Pencil className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={() => onDelete(task.id)}
            aria-label={`Delete "${task.title}"`}
            title="Delete task"
            className="flex h-8 w-8 items-center justify-center rounded-lg text-[#64748B] hover:bg-[#FEF2F2] hover:text-[#DC2626] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#DC2626]"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
