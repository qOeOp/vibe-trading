"use client";

import { useState, useCallback } from "react";
import { cn } from "@/lib/utils";
import { useLabCellStore } from "../../store/use-lab-cell-store";
import {
  CODE_SNIPPETS,
  type CodeSnippet,
  type SnippetCategory,
} from "../../data/code-snippets";
import {
  ChevronRight,
  X,
  Plus,
} from "lucide-react";

/**
 * SnippetsPanel — Pre-built factor templates for quick insertion
 *
 * Click a snippet → inserts its cells into the workspace after
 * the currently active cell. Categories are collapsible.
 */
export function SnippetsPanel() {
  const setSidebarPanel = useLabCellStore((s) => s.setSidebarPanel);
  const activeCellId = useLabCellStore((s) => s.activeCellId);
  const addCell = useLabCellStore((s) => s.addCell);
  const setCellCode = useLabCellStore((s) => s.setCellCode);

  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    () => new Set(CODE_SNIPPETS.map((c) => c.name)),
  );

  const toggleCategory = useCallback((name: string) => {
    setExpandedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(name)) {
        next.delete(name);
      } else {
        next.add(name);
      }
      return next;
    });
  }, []);

  const insertSnippet = useCallback(
    (snippet: CodeSnippet) => {
      const store = useLabCellStore.getState();
      let afterId = activeCellId;

      // Insert each cell in order
      for (const code of snippet.cells) {
        store.addCell(afterId ?? undefined);
        const newState = useLabCellStore.getState();
        const newCellId = newState.activeCellId;
        if (newCellId) {
          store.setCellCode(newCellId, code);
          afterId = newCellId;
        }
      }
    },
    [activeCellId],
  );

  return (
    <div
      data-slot="snippets-panel"
      className="flex flex-col h-full bg-white"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-mine-border/50">
        <span className="text-xs font-medium text-mine-muted uppercase tracking-wide">
          代码片段
        </span>
        <button
          type="button"
          onClick={() => setSidebarPanel(null)}
          className="text-mine-muted hover:text-mine-text transition-colors"
          aria-label="关闭"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto py-1">
        {CODE_SNIPPETS.map((category) => (
          <SnippetCategoryNode
            key={category.name}
            category={category}
            isExpanded={expandedCategories.has(category.name)}
            onToggle={() => toggleCategory(category.name)}
            onInsert={insertSnippet}
          />
        ))}
      </div>
    </div>
  );
}

// ─── Category node ───────────────────────────────────────

function SnippetCategoryNode({
  category,
  isExpanded,
  onToggle,
  onInsert,
}: {
  category: SnippetCategory;
  isExpanded: boolean;
  onToggle: () => void;
  onInsert: (snippet: CodeSnippet) => void;
}) {
  return (
    <div data-slot="snippet-category">
      <button
        type="button"
        onClick={onToggle}
        className={cn(
          "w-full flex items-center gap-2 px-3 py-2 text-left",
          "hover:bg-mine-bg/50 transition-colors",
        )}
      >
        <ChevronRight
          className={cn(
            "w-3 h-3 text-mine-muted transition-transform duration-150",
            isExpanded && "rotate-90",
          )}
        />
        <span className="text-sm">{category.icon}</span>
        <span className="text-xs font-medium text-mine-text">
          {category.name}
        </span>
        <span className="text-[10px] text-mine-muted ml-auto">
          {category.snippets.length}
        </span>
      </button>

      {isExpanded && (
        <div className="pb-1">
          {category.snippets.map((snippet) => (
            <SnippetRow
              key={snippet.id}
              snippet={snippet}
              onInsert={() => onInsert(snippet)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Snippet row ─────────────────────────────────────────

function SnippetRow({
  snippet,
  onInsert,
}: {
  snippet: CodeSnippet;
  onInsert: () => void;
}) {
  return (
    <div
      data-slot="snippet-row"
      className={cn(
        "group flex items-start gap-2 px-3 py-1.5 ml-5",
        "hover:bg-mine-bg/50 transition-colors cursor-pointer",
      )}
      onClick={onInsert}
      title={`插入 "${snippet.name}" 模板 (${snippet.cells.length} 个 cells)`}
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-mine-text">
            {snippet.name}
          </span>
          <span className="text-[10px] text-mine-muted">
            {snippet.cells.length} cells
          </span>
        </div>
        <p className="text-[10px] text-mine-muted truncate mt-0.5">
          {snippet.description}
        </p>
      </div>

      <button
        type="button"
        className={cn(
          "mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity",
          "w-5 h-5 rounded flex items-center justify-center",
          "bg-mine-accent-teal/10 text-mine-accent-teal",
          "hover:bg-mine-accent-teal/20",
        )}
        aria-label={`插入 ${snippet.name}`}
      >
        <Plus className="w-3 h-3" />
      </button>
    </div>
  );
}
