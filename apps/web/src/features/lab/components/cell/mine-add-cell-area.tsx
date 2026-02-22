'use client';

import { useState } from 'react';
import { Plus, ChevronDown } from 'lucide-react';
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

function MineAddCellArea({ columnId, className }: MineAddCellAreaProps) {
  const { createNewCell } = useCellActions();
  const canInteract = useAtomValue(canInteractWithAppAtom);
  const [showMenu, setShowMenu] = useState(false);

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
    setShowMenu(false);
  };

  const handleAddSQL = () => {
    maybeAddMarimoImport({ autoInstantiate: true, createNewCell });
    createNewCell({
      cellId: { type: '__end__', columnId },
      before: false,
      code: LanguageAdapters.sql.defaultCode,
    });
    setShowMenu(false);
  };

  return (
    <div
      data-slot="mine-add-cell-area"
      className={cn(
        'flex justify-center mt-4 pt-2 pb-32 print:hidden',
        className,
      )}
    >
      <div className="relative flex items-center gap-1">
        {/* Main add button */}
        <button
          type="button"
          disabled={!canInteract}
          onClick={handleAddPython}
          className={cn(
            'flex items-center gap-2 h-12 px-6 rounded-lg',
            'border border-dashed border-mine-border',
            'text-mine-muted text-[13px] font-medium',
            'opacity-30 hover:opacity-60 transition-opacity',
            !canInteract && 'cursor-not-allowed',
          )}
        >
          <Plus className="w-4 h-4" strokeWidth={1.5} />
          New Cell
        </button>

        {/* Dropdown toggle for other cell types */}
        <button
          type="button"
          disabled={!canInteract}
          onClick={() => setShowMenu((v) => !v)}
          className={cn(
            'flex items-center justify-center w-8 h-8 rounded-md',
            'text-mine-muted',
            'opacity-30 hover:opacity-60 transition-opacity',
            !canInteract && 'cursor-not-allowed',
          )}
        >
          <ChevronDown className="w-3.5 h-3.5" strokeWidth={1.5} />
        </button>

        {/* Cell type dropdown */}
        {showMenu && (
          <div
            data-slot="mine-add-cell-menu"
            className="absolute top-full left-0 mt-1 z-20 bg-white shadow-sm border border-mine-border rounded-lg py-1 min-w-[140px]"
          >
            <button
              type="button"
              onClick={handleAddPython}
              className="w-full text-left px-3 py-1.5 text-[12px] text-mine-text hover:bg-mine-bg transition-colors"
            >
              Python
            </button>
            <button
              type="button"
              onClick={handleAddMarkdown}
              className="w-full text-left px-3 py-1.5 text-[12px] text-mine-text hover:bg-mine-bg transition-colors"
            >
              Markdown
            </button>
            <button
              type="button"
              onClick={handleAddSQL}
              className="w-full text-left px-3 py-1.5 text-[12px] text-mine-text hover:bg-mine-bg transition-colors"
            >
              SQL
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export { MineAddCellArea };
