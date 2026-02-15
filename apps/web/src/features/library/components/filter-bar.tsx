"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { Search, LayoutGrid, Table2, X } from "lucide-react";
import {
  FACTOR_LIFECYCLE_STATUSES,
  FACTOR_CATEGORIES,
  STATUS_LABELS,
  STATUS_COLORS,
  CATEGORY_COLORS,
} from "../types";
import type { FactorLifecycleStatus, FactorCategory } from "../types";
import { useLibraryStore } from "../store/use-library-store";
import type { ViewMode } from "../store/use-library-store";

// ─── Status Toggle Button ────────────────────────────────

function StatusToggle({
  status,
  active,
  onToggle,
}: {
  status: FactorLifecycleStatus;
  active: boolean;
  onToggle: () => void;
}) {
  const color = STATUS_COLORS[status];
  const label = STATUS_LABELS[status];

  return (
    <button
      type="button"
      onClick={onToggle}
      className="px-2.5 py-1 text-[11px] font-semibold rounded-md transition-all border"
      style={
        active
          ? {
              backgroundColor: color,
              borderColor: color,
              color: "#fff",
            }
          : {
              backgroundColor: "transparent",
              borderColor: "#e0ddd8",
              color: "#8a8a8a",
            }
      }
    >
      {label}
    </button>
  );
}

// ─── Category Tag ────────────────────────────────────────

function CategoryTag({
  category,
  active,
  onClick,
}: {
  category: FactorCategory;
  active: boolean;
  onClick: () => void;
}) {
  const color = CATEGORY_COLORS[category];

  return (
    <button
      type="button"
      onClick={onClick}
      className="px-2.5 py-1 text-[11px] font-medium rounded-md transition-all"
      style={
        active
          ? {
              backgroundColor: `${color}18`,
              color: color,
              fontWeight: 600,
            }
          : {
              backgroundColor: "transparent",
              color: "#8a8a8a",
            }
      }
    >
      {category}
    </button>
  );
}

// ─── View Mode Toggle ────────────────────────────────────

function ViewModeToggle({
  mode,
  onModeChange,
}: {
  mode: ViewMode;
  onModeChange: (m: ViewMode) => void;
}) {
  return (
    <div className="flex items-center border border-mine-border rounded-lg overflow-hidden">
      <button
        type="button"
        onClick={() => onModeChange("grid")}
        className="p-1.5 transition-colors"
        style={{
          backgroundColor: mode === "grid" ? "#2d2d2d" : "transparent",
          color: mode === "grid" ? "#fff" : "#8a8a8a",
        }}
        title="表格视图"
      >
        <Table2 className="w-3.5 h-3.5" />
      </button>
      <button
        type="button"
        onClick={() => onModeChange("card")}
        className="p-1.5 transition-colors"
        style={{
          backgroundColor: mode === "card" ? "#2d2d2d" : "transparent",
          color: mode === "card" ? "#fff" : "#8a8a8a",
        }}
        title="卡片视图"
      >
        <LayoutGrid className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

// ─── FilterBar ───────────────────────────────────────────

export function FilterBar() {
  const {
    statuses,
    toggleStatus,
    clearStatuses,
    category,
    setCategory,
    search,
    setSearch,
    viewMode,
    setViewMode,
    resetFilters,
  } = useLibraryStore();

  const [localSearch, setLocalSearch] = useState(search);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleSearchChange = useCallback(
    (value: string) => {
      setLocalSearch(value);
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => setSearch(value), 200);
    },
    [setSearch],
  );

  // Sync external search changes to local state
  useEffect(() => {
    setLocalSearch(search);
  }, [search]);

  const hasActiveFilters =
    statuses.length > 0 || category !== null || search.trim() !== "";

  return (
    <div className="flex items-center gap-3 flex-wrap">
      {/* Status toggles */}
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={clearStatuses}
          className="px-2.5 py-1 text-[11px] font-semibold rounded-md transition-all border"
          style={
            statuses.length === 0
              ? {
                  backgroundColor: "#2d2d2d",
                  borderColor: "#2d2d2d",
                  color: "#fff",
                }
              : {
                  backgroundColor: "transparent",
                  borderColor: "#e0ddd8",
                  color: "#8a8a8a",
                }
          }
        >
          全部
        </button>
        {FACTOR_LIFECYCLE_STATUSES.map((s) => (
          <StatusToggle
            key={s}
            status={s}
            active={statuses.includes(s)}
            onToggle={() => toggleStatus(s)}
          />
        ))}
      </div>

      <div className="w-px h-5 bg-mine-border" />

      {/* Category tags */}
      <div className="flex items-center gap-0.5 flex-wrap">
        {FACTOR_CATEGORIES.map((c) => (
          <CategoryTag
            key={c}
            category={c}
            active={category === c}
            onClick={() => setCategory(category === c ? null : c)}
          />
        ))}
      </div>

      <div className="flex-1" />

      {/* Clear filters */}
      {hasActiveFilters && (
        <button
          type="button"
          onClick={resetFilters}
          className="flex items-center gap-1 text-[11px] text-mine-muted hover:text-mine-text transition-colors"
        >
          <X className="w-3 h-3" />
          清除
        </button>
      )}

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-mine-muted" />
        <input
          type="text"
          placeholder="搜索因子..."
          value={localSearch}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="text-sm text-mine-text bg-white border border-mine-border rounded-lg pl-8 pr-3 py-1.5 w-[180px] outline-none focus:border-mine-nav-active transition-colors placeholder:text-mine-muted"
        />
      </div>

      {/* View mode */}
      <ViewModeToggle mode={viewMode} onModeChange={setViewMode} />
    </div>
  );
}
