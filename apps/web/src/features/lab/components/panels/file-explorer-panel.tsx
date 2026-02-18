"use client";

import { useState } from "react";
import { FileCode, Database, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { DATA_CATALOG } from "../../data/data-catalog";
import { CODE_SNIPPETS } from "../../data/code-snippets";
import { useLabCellStore } from "../../store/use-lab-cell-store";

// ─── File Explorer Panel ────────────────────────────────

type TabId = "catalog" | "snippets";

/**
 * FileExplorerPanel — Data catalog + code snippets browser
 *
 * Two tabs:
 * - Catalog: pre-loaded platform data (variables, functions)
 * - Snippets: factor templates that can be inserted as cells
 */
export function FileExplorerPanel() {
  const [tab, setTab] = useState<TabId>("catalog");
  const [search, setSearch] = useState("");

  return (
    <div data-slot="file-explorer-panel" className="h-full flex flex-col">
      {/* Header */}
      <div className="px-3 py-2 border-b border-mine-border/50 shrink-0">
        <h3 className="text-xs font-medium text-mine-muted uppercase tracking-wide mb-2">
          文件浏览
        </h3>

        {/* Tabs */}
        <div className="flex gap-1">
          <TabBtn
            active={tab === "catalog"}
            onClick={() => setTab("catalog")}
            icon={Database}
            label="数据目录"
          />
          <TabBtn
            active={tab === "snippets"}
            onClick={() => setTab("snippets")}
            icon={FileCode}
            label="代码模板"
          />
        </div>

        {/* Search */}
        <div className="relative mt-2">
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-mine-muted" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="搜索..."
            className="w-full pl-7 pr-2 py-1 text-xs bg-mine-bg border border-mine-border/50 rounded-md outline-none focus:border-mine-accent-teal/30"
          />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-3 py-2">
        {tab === "catalog" ? (
          <CatalogContent search={search} />
        ) : (
          <SnippetsContent search={search} />
        )}
      </div>
    </div>
  );
}

// ─── Tab Button ──────────────────────────────────────────

function TabBtn({
  active,
  onClick,
  icon: Icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ElementType;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex items-center gap-1 px-2 py-1 text-[11px] font-medium rounded-md transition-colors",
        active
          ? "bg-mine-nav-active text-white"
          : "text-mine-muted hover:text-mine-text hover:bg-mine-bg",
      )}
    >
      <Icon className="w-3 h-3" />
      {label}
    </button>
  );
}

// ─── Catalog Content ─────────────────────────────────────

function CatalogContent({ search }: { search: string }) {
  const q = search.toLowerCase();

  return (
    <div className="space-y-3">
      {DATA_CATALOG.map((category) => {
        const items = category.children.filter(
          (item) =>
            !q ||
            item.name.toLowerCase().includes(q) ||
            item.description.toLowerCase().includes(q),
        );
        if (items.length === 0) return null;

        return (
          <div key={category.name}>
            <h4 className="text-[10px] font-medium text-mine-muted uppercase tracking-wider mb-1">
              {category.name}
            </h4>
            <div className="space-y-0.5">
              {items.map((item) => (
                <CatalogItem key={item.name} item={item} />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function CatalogItem({
  item,
}: {
  item: { name: string; kind: string; description: string; insertCode?: string };
}) {
  const handleInsert = () => {
    if (!item.insertCode) return;
    const state = useLabCellStore.getState();
    const lastId = state.cellIds.length > 0 ? state.cellIds[state.cellIds.length - 1] : undefined;
    state.addCell(lastId);
    // Set code on the newly created cell
    const newIds = useLabCellStore.getState().cellIds;
    const newCellId = newIds[newIds.length - 1];
    if (newCellId) {
      useLabCellStore.getState().setCellCode(newCellId, item.insertCode);
    }
  };

  return (
    <button
      type="button"
      onClick={handleInsert}
      disabled={!item.insertCode}
      className={cn(
        "w-full text-left px-2 py-1 rounded-md transition-colors",
        item.insertCode
          ? "hover:bg-mine-bg cursor-pointer"
          : "cursor-default",
      )}
    >
      <div className="flex items-center gap-1.5">
        <span className="text-xs font-mono text-mine-text">{item.name}</span>
        <span className="text-[9px] px-1 py-0.5 bg-mine-bg rounded text-mine-muted">
          {item.kind}
        </span>
      </div>
      <p className="text-[10px] text-mine-muted mt-0.5 line-clamp-1">
        {item.description}
      </p>
    </button>
  );
}

// ─── Snippets Content ────────────────────────────────────

function SnippetsContent({ search }: { search: string }) {
  const q = search.toLowerCase();

  const handleInsertSnippet = (cells: string[]) => {
    const state = useLabCellStore.getState();
    let afterId = state.cellIds.length > 0 ? state.cellIds[state.cellIds.length - 1] : undefined;
    for (const code of cells) {
      useLabCellStore.getState().addCell(afterId);
      const newIds = useLabCellStore.getState().cellIds;
      const newCellId = newIds[newIds.length - 1];
      if (newCellId) {
        useLabCellStore.getState().setCellCode(newCellId, code);
      }
      afterId = newCellId;
    }
  };

  return (
    <div className="space-y-3">
      {CODE_SNIPPETS.map((category) => {
        const snippets = category.snippets.filter(
          (s) =>
            !q ||
            s.name.toLowerCase().includes(q) ||
            s.description.toLowerCase().includes(q) ||
            s.tags.some((t) => t.toLowerCase().includes(q)),
        );
        if (snippets.length === 0) return null;

        return (
          <div key={category.name}>
            <h4 className="text-[10px] font-medium text-mine-muted uppercase tracking-wider mb-1">
              {category.icon} {category.name}
            </h4>
            <div className="space-y-0.5">
              {snippets.map((snippet) => (
                <button
                  key={snippet.id}
                  type="button"
                  onClick={() => handleInsertSnippet(snippet.cells)}
                  className="w-full text-left px-2 py-1.5 rounded-md hover:bg-mine-bg transition-colors"
                >
                  <span className="text-xs font-medium text-mine-text">
                    {snippet.name}
                  </span>
                  <p className="text-[10px] text-mine-muted mt-0.5 line-clamp-1">
                    {snippet.description}
                  </p>
                  <div className="flex gap-1 mt-1">
                    {snippet.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="px-1 py-0.5 text-[9px] bg-mine-bg text-mine-muted rounded"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </button>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
