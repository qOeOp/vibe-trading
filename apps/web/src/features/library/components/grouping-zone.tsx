'use client';

import { useCallback } from 'react';
import { useDroppable } from '@dnd-kit/core';
import {
  SortableContext,
  useSortable,
  horizontalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  GripVertical,
  X,
  ChevronsUpDown,
  ChevronsDownUp,
  Trash2,
} from 'lucide-react';
import { useLibraryStore } from '../store/use-library-store';

// ─── Column label mapping ────────────────────────────────

const COLUMN_LABELS: Record<string, string> = {
  category: '类别',
  status: '状态',
  source: '来源',
  factorType: '类型',
};

// ─── Sortable Pill ───────────────────────────────────────

function GroupingPill({
  columnId,
  onRemove,
}: {
  columnId: string;
  onRemove: () => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: columnId });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-0.5 px-1.5 py-0.5 bg-white border border-mine-border/60 rounded cursor-grab active:cursor-grabbing select-none shadow-[0_1px_2px_rgba(0,0,0,0.04)]"
      {...attributes}
      {...listeners}
    >
      <GripVertical className="w-2.5 h-2.5 text-mine-muted/40" />
      <span className="text-[10px] font-medium text-mine-text">
        {COLUMN_LABELS[columnId] ?? columnId}
      </span>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onRemove();
        }}
        onPointerDown={(e) => e.stopPropagation()}
        className="ml-0.5 text-mine-muted/40 hover:text-mine-text transition-colors"
      >
        <X className="w-2.5 h-2.5" />
      </button>
    </div>
  );
}

// ─── Grouping Zone ───────────────────────────────────────

interface GroupingZoneProps {
  isDraggingColumn: boolean;
}

export function GroupingZone({ isDraggingColumn }: GroupingZoneProps) {
  const grouping = useLibraryStore((s) => s.grouping);
  const removeGrouping = useLibraryStore((s) => s.removeGrouping);
  const expandAllGroups = useLibraryStore((s) => s.expandAllGroups);
  const collapseAllGroups = useLibraryStore((s) => s.collapseAllGroups);
  const setGrouping = useLibraryStore((s) => s.setGrouping);

  const { setNodeRef, isOver } = useDroppable({ id: 'grouping-zone' });

  const handleClear = useCallback(() => {
    setGrouping([]);
  }, [setGrouping]);

  return (
    <div
      data-slot="grouping-zone"
      ref={setNodeRef}
      className={`flex items-center gap-2 px-3 py-1.5 min-h-[32px] border-b transition-colors ${
        isOver
          ? 'bg-mine-accent-teal/5 border-mine-accent-teal/30'
          : isDraggingColumn
            ? 'bg-mine-accent-teal/3 border-mine-border/50'
            : 'border-mine-border/20'
      }`}
    >
      {/* Label */}
      <span className="text-[10px] text-mine-muted/60 font-medium shrink-0 select-none">
        分组
      </span>

      {/* Pills or placeholder */}
      {grouping.length === 0 ? (
        <span className="text-[10px] text-mine-muted/40 italic select-none">
          {isDraggingColumn ? '松开以按此列分组' : '拖拽列标题到此处进行分组'}
        </span>
      ) : (
        <SortableContext
          items={grouping}
          strategy={horizontalListSortingStrategy}
        >
          <div className="flex items-center gap-1">
            {grouping.map((columnId) => (
              <GroupingPill
                key={columnId}
                columnId={columnId}
                onRemove={() => removeGrouping(columnId)}
              />
            ))}
          </div>
        </SortableContext>
      )}

      {/* Spacer */}
      <div className="flex-1" />

      {/* Controls — compact icon-only buttons */}
      {grouping.length > 0 && (
        <div className="flex items-center gap-0.5 shrink-0">
          <button
            type="button"
            onClick={expandAllGroups}
            className="flex items-center justify-center w-5 h-5 text-mine-muted/50 hover:text-mine-text transition-colors rounded"
            title="全部展开"
          >
            <ChevronsUpDown className="w-3 h-3" />
          </button>
          <button
            type="button"
            onClick={collapseAllGroups}
            className="flex items-center justify-center w-5 h-5 text-mine-muted/50 hover:text-mine-text transition-colors rounded"
            title="全部折叠"
          >
            <ChevronsDownUp className="w-3 h-3" />
          </button>
          <button
            type="button"
            onClick={handleClear}
            className="flex items-center justify-center w-5 h-5 text-mine-muted/50 hover:text-mine-text transition-colors rounded"
            title="清除分组"
          >
            <Trash2 className="w-3 h-3" />
          </button>
        </div>
      )}
    </div>
  );
}
