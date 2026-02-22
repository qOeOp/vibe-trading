"use client";

import { useState, useCallback } from "react";
import { cn } from "@/lib/utils";
import { useLabCellStore } from "@/features/lab/store/use-lab-cell-store";
import {
  DATA_CATALOG,
  flattenCatalog,
  type CatalogCategory,
  type CatalogFunction,
  type CatalogItem,
  type CatalogVariable,
} from "@/features/lab/data/data-catalog";
import {
  ChevronRight,
  Search,
  X,
  Copy,
  Check,
} from "lucide-react";

/**
 * DataCatalogPanel — Browsable tree of platform data + factor tools
 *
 * Users can discover available variables and functions, search/filter,
 * and click to copy code to clipboard for pasting into cells.
 */
export function DataCatalogPanel() {
  const setSidebarPanel = useLabCellStore((s) => s.setSidebarPanel);
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set(),
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

  // Filter items by search query
  const isSearching = searchQuery.trim().length > 0;
  const flatItems = isSearching
    ? flattenCatalog(DATA_CATALOG).filter(
        (item) =>
          item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.description.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : [];

  return (
    <div
      data-slot="data-catalog-panel"
      className="flex flex-col h-full bg-white"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-mine-border/50">
        <span className="text-xs font-medium text-mine-muted uppercase tracking-wide">
          数据字典
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

      {/* Search */}
      <div className="px-3 py-2 border-b border-mine-border/30">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-mine-muted" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="搜索变量或函数..."
            className={cn(
              "w-full pl-8 pr-3 py-1.5",
              "text-xs text-mine-text placeholder:text-mine-muted/60",
              "bg-mine-bg/50 border border-mine-border/50 rounded-md",
              "focus:outline-none focus:border-mine-accent-teal/50",
              "transition-colors",
            )}
          />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {isSearching ? (
          /* Search results */
          <div className="px-3 py-2 space-y-1">
            {flatItems.length === 0 ? (
              <p className="text-xs text-mine-muted py-4 text-center">
                未找到匹配项
              </p>
            ) : (
              flatItems.map((item) =>
                item.kind === "variable" ? (
                  <VariableRow key={item.name} item={item} />
                ) : (
                  <FunctionRow key={item.name} item={item} />
                ),
              )
            )}
          </div>
        ) : (
          /* Tree view */
          <div className="py-1">
            {DATA_CATALOG.map((category) => (
              <CategoryNode
                key={category.name}
                category={category}
                expanded={expandedCategories}
                onToggle={toggleCategory}
                depth={0}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Tree node for category ─────────────────────────────

function CategoryNode({
  category,
  expanded,
  onToggle,
  depth,
}: {
  category: CatalogCategory;
  expanded: Set<string>;
  onToggle: (name: string) => void;
  depth: number;
}) {
  const isExpanded = expanded.has(category.name);

  return (
    <div data-slot="catalog-category">
      <button
        type="button"
        onClick={() => onToggle(category.name)}
        className={cn(
          "w-full flex items-center gap-2 px-3 py-1.5 text-left",
          "hover:bg-mine-bg/50 transition-colors",
        )}
        style={{ paddingLeft: `${12 + depth * 16}px` }}
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
          {category.children.length}
        </span>
      </button>

      {isExpanded && (
        <div>
          {category.children.map((child) =>
            child.kind === "category" ? (
              <CategoryNode
                key={child.name}
                category={child}
                expanded={expanded}
                onToggle={onToggle}
                depth={depth + 1}
              />
            ) : child.kind === "variable" ? (
              <VariableRow
                key={child.name}
                item={child}
                depth={depth + 1}
              />
            ) : (
              <FunctionRow
                key={child.name}
                item={child}
                depth={depth + 1}
              />
            ),
          )}
        </div>
      )}
    </div>
  );
}

// ─── Variable row ────────────────────────────────────────

function VariableRow({
  item,
  depth = 0,
}: {
  item: CatalogVariable;
  depth?: number;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(() => {
    const text = item.insertCode ?? item.name;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }, [item]);

  return (
    <div
      data-slot="catalog-variable"
      className={cn(
        "group flex items-center gap-2 px-3 py-1",
        "hover:bg-mine-bg/50 transition-colors cursor-pointer",
      )}
      style={{ paddingLeft: `${28 + depth * 16}px` }}
      onClick={handleCopy}
      title={`点击复制 ${item.insertCode ? "加载代码" : item.name}`}
    >
      <span className="text-xs font-mono text-mine-accent-teal font-medium">
        {item.name}
      </span>
      <span className="text-[10px] text-mine-muted font-mono">
        {item.dtype}
      </span>
      <span className="text-[10px] text-mine-muted">{item.shape}</span>
      <span className="text-[10px] text-mine-muted ml-auto truncate max-w-[80px]">
        {item.description}
      </span>
      <span className="opacity-0 group-hover:opacity-100 transition-opacity">
        {copied ? (
          <Check className="w-3 h-3 text-mine-accent-green" />
        ) : (
          <Copy className="w-3 h-3 text-mine-muted" />
        )}
      </span>
    </div>
  );
}

// ─── Function row ────────────────────────────────────────

function FunctionRow({
  item,
  depth = 0,
}: {
  item: CatalogFunction;
  depth?: number;
}) {
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      const text = item.insertCode ?? item.signature;
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    },
    [item],
  );

  return (
    <div data-slot="catalog-function">
      <div
        className={cn(
          "group flex items-center gap-2 px-3 py-1",
          "hover:bg-mine-bg/50 transition-colors cursor-pointer",
        )}
        style={{ paddingLeft: `${28 + depth * 16}px` }}
        onClick={() => setExpanded(!expanded)}
      >
        <span className="text-xs font-mono text-indigo-600 font-medium">
          {item.name}
        </span>
        <span className="text-[10px] text-mine-muted font-mono truncate">
          {item.signature}
        </span>
        <span className="ml-auto flex items-center gap-1">
          <button
            type="button"
            onClick={handleCopy}
            className="opacity-0 group-hover:opacity-100 transition-opacity"
            title="复制代码"
          >
            {copied ? (
              <Check className="w-3 h-3 text-mine-accent-green" />
            ) : (
              <Copy className="w-3 h-3 text-mine-muted" />
            )}
          </button>
        </span>
      </div>

      {expanded && (
        <div
          className="px-3 py-2 bg-mine-bg/30 text-[10px] space-y-1"
          style={{ paddingLeft: `${28 + (depth + 1) * 16}px` }}
        >
          <p className="text-mine-text">{item.description}</p>
          <p className="text-mine-muted">
            返回: <span className="font-mono">{item.returnType}</span>
          </p>
          <p className="font-mono text-mine-muted bg-mine-bg rounded px-2 py-1">
            {item.example}
          </p>
        </div>
      )}
    </div>
  );
}
