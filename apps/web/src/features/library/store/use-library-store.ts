'use client';

import { create } from 'zustand';
import type {
  Factor,
  FactorCategory,
  FactorLifecycleStatus,
  StatusChangeRecord,
} from '../types';
import { VALID_STATUS_TRANSITIONS } from '../types';
import { getLibraryFactors } from '../data/mock-library';
import { VIBE_COMPUTE_URL } from '@/lib/env';

// ─── Filter State ────────────────────────────────────────

export type ViewMode = 'grid' | 'card';

interface LibraryFilters {
  /** Multi-select status filter (empty = all) */
  statuses: FactorLifecycleStatus[];
  /** Single-select category (null = all) */
  category: FactorCategory | null;
  /** Search query (name / hypothesis / tags) */
  search: string;
  /** Grid or Card view */
  viewMode: ViewMode;
}

interface LibraryState extends LibraryFilters {
  /** All factors (mutable for status changes) */
  factors: Factor[];
  /** Currently selected factor for detail panel (null = collapsed) */
  selectedFactorId: string | null;
  /** Batch-selected factor IDs for multi-select operations */
  selectedFactorIds: Set<string>;
  /** Row grouping: ordered array of column IDs to group by */
  grouping: string[];
  /** Expanded state for grouped rows (true = all expanded by default) */
  expanded: Record<string, boolean> | boolean;

  // Filter actions
  toggleStatus: (status: FactorLifecycleStatus) => void;
  setCategory: (category: FactorCategory | null) => void;
  setSearch: (search: string) => void;
  setViewMode: (mode: ViewMode) => void;
  resetFilters: () => void;
  clearStatuses: () => void;

  // Selection actions
  selectFactor: (id: string | null) => void;
  toggleFactorSelection: (id: string) => void;
  selectAllFactors: (ids: string[]) => void;
  clearSelection: () => void;

  // Grouping actions
  setGrouping: (grouping: string[]) => void;
  addGrouping: (columnId: string) => void;
  removeGrouping: (columnId: string) => void;
  reorderGrouping: (columnId: string, newIndex: number) => void;
  setExpanded: (expanded: Record<string, boolean> | boolean) => void;
  expandAllGroups: () => void;
  collapseAllGroups: () => void;

  // Mutation actions
  updateFactorStatus: (
    factorId: string,
    newStatus: FactorLifecycleStatus,
    reason: string,
  ) => void;
  batchUpdateStatus: (
    factorIds: string[],
    newStatus: FactorLifecycleStatus,
    reason: string,
  ) => void;

  // Proposal actions
  dismissProposal: (factorId: string) => void;

  // Mining integration actions
  addFactor: (factor: Factor) => void;
  fetchMiningFactors: () => Promise<void>;
}

const DEFAULT_FILTERS: LibraryFilters = {
  statuses: [],
  category: null,
  search: '',
  viewMode: 'grid',
};

export const useLibraryStore = create<LibraryState>((set, get) => ({
  ...DEFAULT_FILTERS,
  factors: getLibraryFactors(),
  selectedFactorId: null,
  selectedFactorIds: new Set<string>(),
  grouping: [],
  expanded: true,

  // ─── Filter Actions ──────────────────────────────────

  toggleStatus: (status) =>
    set((state) => ({
      statuses: state.statuses.includes(status)
        ? state.statuses.filter((s) => s !== status)
        : [...state.statuses, status],
    })),

  setCategory: (category) => set({ category }),

  setSearch: (search) => set({ search }),

  setViewMode: (mode) => set({ viewMode: mode }),

  resetFilters: () => set({ ...DEFAULT_FILTERS, selectedFactorId: null }),

  clearStatuses: () => set({ statuses: [] }),

  // ─── Selection Actions ───────────────────────────────

  selectFactor: (id) => set({ selectedFactorId: id }),

  toggleFactorSelection: (id) =>
    set((state) => {
      const next = new Set(state.selectedFactorIds);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return { selectedFactorIds: next };
    }),

  selectAllFactors: (ids) => set({ selectedFactorIds: new Set(ids) }),

  clearSelection: () => set({ selectedFactorIds: new Set<string>() }),

  // ─── Grouping Actions ───────────────────────────────

  setGrouping: (grouping) => set({ grouping, expanded: true }),

  addGrouping: (columnId) =>
    set((state) => {
      if (state.grouping.includes(columnId)) return state;
      return { grouping: [...state.grouping, columnId], expanded: true };
    }),

  removeGrouping: (columnId) =>
    set((state) => ({
      grouping: state.grouping.filter((id) => id !== columnId),
    })),

  reorderGrouping: (columnId, newIndex) =>
    set((state) => {
      const currentIndex = state.grouping.indexOf(columnId);
      if (currentIndex < 0) return state;
      const next = [...state.grouping];
      next.splice(currentIndex, 1);
      next.splice(newIndex, 0, columnId);
      return { grouping: next };
    }),

  setExpanded: (expanded) => set({ expanded }),

  expandAllGroups: () => set({ expanded: true }),

  collapseAllGroups: () => set({ expanded: {} }),

  // ─── Mutation Actions ────────────────────────────────

  updateFactorStatus: (factorId, newStatus, reason) =>
    set((state) => {
      const factors = state.factors.map((f) => {
        if (f.id !== factorId) return f;
        // Validate transition
        if (!VALID_STATUS_TRANSITIONS[f.status].includes(newStatus)) return f;
        const record: StatusChangeRecord = {
          timestamp: new Date().toISOString(),
          operator: 'Vincent',
          reason,
          fromStatus: f.status,
          toStatus: newStatus,
        };
        return {
          ...f,
          status: newStatus,
          pendingProposal: undefined,
          statusHistory: [...f.statusHistory, record],
        };
      });
      return { factors };
    }),

  batchUpdateStatus: (factorIds, newStatus, reason) =>
    set((state) => {
      const idSet = new Set(factorIds);
      const factors = state.factors.map((f) => {
        if (!idSet.has(f.id)) return f;
        if (!VALID_STATUS_TRANSITIONS[f.status].includes(newStatus)) return f;
        const record: StatusChangeRecord = {
          timestamp: new Date().toISOString(),
          operator: 'Vincent',
          reason,
          fromStatus: f.status,
          toStatus: newStatus,
        };
        return {
          ...f,
          status: newStatus,
          statusHistory: [...f.statusHistory, record],
        };
      });
      return { factors, selectedFactorIds: new Set<string>() };
    }),

  // ─── Proposal Actions ───────────────────────────────

  dismissProposal: (factorId) =>
    set((state) => ({
      factors: state.factors.map((f) =>
        f.id === factorId ? { ...f, pendingProposal: undefined } : f,
      ),
    })),

  addFactor: (factor) =>
    set((state) => {
      // Dedup: skip if already exists by id
      if (state.factors.some((f) => f.id === factor.id)) return state;
      return { factors: [factor, ...state.factors] };
    }),

  fetchMiningFactors: async () => {
    try {
      const resp = await fetch(`${VIBE_COMPUTE_URL}/api/library/factors`);
      if (!resp.ok) return;
      const data = (await resp.json()) as { factors: Factor[] };
      const { addFactor } = useLibraryStore.getState();
      data.factors.forEach((f) => addFactor(f));
    } catch {
      // Backend not running — silently ignore
    }
  },
}));

// ─── Selector: Filtered Factors ──────────────────────────

export function filterFactors(
  factors: Factor[],
  filters: Pick<LibraryFilters, 'statuses' | 'category' | 'search'>,
): Factor[] {
  let result = factors;

  // Status filter (multi-select, empty = all)
  if (filters.statuses.length > 0) {
    result = result.filter((f) => filters.statuses.includes(f.status));
  }

  // Category filter (single-select, null = all)
  if (filters.category) {
    result = result.filter((f) => f.category === filters.category);
  }

  // Search filter (name, hypothesis, tags)
  if (filters.search.trim()) {
    const q = filters.search.trim().toLowerCase();
    result = result.filter(
      (f) =>
        f.name.toLowerCase().includes(q) ||
        f.hypothesis.toLowerCase().includes(q) ||
        f.tags.some((t) => t.toLowerCase().includes(q)),
    );
  }

  return result;
}
