'use client';

import { Plus } from 'lucide-react';
import { useAtomValue } from 'jotai';
import { cn } from '@/lib/utils';
import { useCellActions } from '@/features/lab/core/cells/cells';
import { maybeAddMarimoImport } from '@/features/lab/core/cells/add-missing-import';
import { LanguageAdapters } from '@/features/lab/core/codemirror/language/LanguageAdapters';
import { MARKDOWN_INITIAL_HIDE_CODE } from '@/features/lab/core/codemirror/language/languages/markdown';
import { canInteractWithAppAtom } from '@/features/lab/core/network/connection';
import type { CellColumnId } from '@/features/lab/utils/id-tree';

type MineAddCellAreaProps = {
  columnId: CellColumnId;
  className?: string;
};

function AddCellIcon({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        'w-4 h-4 rounded-full border border-dashed border-current',
        'flex items-center justify-center flex-shrink-0',
        className,
      )}
    >
      <Plus className="w-2 h-2" strokeWidth={2} />
    </span>
  );
}

function MineAddCellArea({ columnId, className }: MineAddCellAreaProps) {
  const { createNewCell } = useCellActions();
  const canInteract = useAtomValue(canInteractWithAppAtom);

  const handleAddPython = () => {
    createNewCell({
      cellId: { type: '__end__', columnId },
      before: false,
    });
  };

  const handleAddMarkdown = () => {
    maybeAddMarimoImport({ autoInstantiate: true, createNewCell });
    createNewCell({
      cellId: { type: '__end__', columnId },
      before: false,
      code: LanguageAdapters.markdown.defaultCode,
      hideCode: MARKDOWN_INITIAL_HIDE_CODE,
    });
  };

  const handleAddSQL = () => {
    maybeAddMarimoImport({ autoInstantiate: true, createNewCell });
    createNewCell({
      cellId: { type: '__end__', columnId },
      before: false,
      code: LanguageAdapters.sql.defaultCode,
    });
  };

  return (
    <div
      data-slot="mine-add-cell-area"
      className={cn('w-full mt-2 pb-32 print:hidden', className)}
    >
      <div
        className={cn(
          'flex items-stretch w-full',
          'border border-dashed rounded-lg overflow-hidden',
          'border-mine-border/30 hover:border-mine-border/60 transition-colors duration-200',
          !canInteract && 'pointer-events-none opacity-40',
        )}
      >
        <button
          type="button"
          disabled={!canInteract}
          onClick={handleAddPython}
          className="group/py flex-1 flex items-center justify-center gap-2 h-10 hover:bg-mine-bg transition-colors border-r border-dashed border-mine-border/20 disabled:cursor-not-allowed text-mine-muted/30 group-hover/py:text-blue-400"
        >
          <AddCellIcon />
          <span className="text-[12px] font-medium transition-colors text-mine-muted/50 group-hover/py:text-mine-text">
            Python
          </span>
        </button>

        <button
          type="button"
          disabled={!canInteract}
          onClick={handleAddMarkdown}
          className="group/md flex-1 flex items-center justify-center gap-2 h-10 hover:bg-mine-bg transition-colors border-r border-dashed border-mine-border/20 disabled:cursor-not-allowed text-mine-muted/30 group-hover/md:text-violet-400"
        >
          <AddCellIcon />
          <span className="text-[12px] font-medium transition-colors text-mine-muted/50 group-hover/md:text-mine-text">
            Markdown
          </span>
        </button>

        <button
          type="button"
          disabled={!canInteract}
          onClick={handleAddSQL}
          className="group/sql flex-1 flex items-center justify-center gap-2 h-10 hover:bg-mine-bg transition-colors disabled:cursor-not-allowed text-mine-muted/30 group-hover/sql:text-amber-500"
        >
          <AddCellIcon />
          <span className="text-[12px] font-medium transition-colors text-mine-muted/50 group-hover/sql:text-mine-text">
            SQL
          </span>
        </button>
      </div>
    </div>
  );
}

export { MineAddCellArea };
