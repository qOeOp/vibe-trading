'use client';

import { useState, useMemo } from 'react';
import { ChevronDown, ChevronRight, DatabaseIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { SearchInput } from '@/features/lab/components/ui/input';
import {
  CATEGORIES,
  DATA_SOURCES,
  type DataCategory,
  type DataSource,
} from './mock-data';
import {
  PanelBar,
  PanelBody,
  PanelRow,
  PanelEmpty,
  PanelBadge,
  PanelText,
  usePanelV2,
} from '../../../../panel-primitives';

// ─── Shared sub-components ──────────────────────────────

function DataSourceLink({ source }: { source: DataSource }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div data-slot="data-source-link">
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center gap-1.5 bg-mine-bg/70 hover:bg-mine-bg transition-colors cursor-pointer py-2 pl-4 pr-3"
      >
        <div className="shrink-0 flex items-center justify-center w-5">
          <ChevronRight
            className={cn(
              'w-3 h-3 text-mine-muted transition-transform duration-200',
              expanded && 'rotate-90',
            )}
          />
        </div>
        <span className="font-mono text-[11px] text-mine-text/70 truncate">
          {source.name}
        </span>
        <span className="text-[10px] text-mine-muted shrink-0 ml-auto">
          {source.nameZh}
        </span>
      </button>

      {expanded && (
        <div className="pl-5 pr-3 pb-2.5 pt-1">
          <div className="bg-white rounded-lg shadow-xs px-3.5 py-3">
            <p className="text-[11px] leading-[16px] text-mine-text/55">
              {source.description}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

function useFilteredData(search: string) {
  return useMemo(() => {
    const lower = search.toLowerCase();
    const filtered = search
      ? DATA_SOURCES.filter(
          (s) =>
            s.name.toLowerCase().includes(lower) ||
            s.nameZh.includes(search) ||
            s.description.includes(search),
        )
      : DATA_SOURCES;

    const grouped = new Map<DataCategory, DataSource[]>();
    for (const source of filtered) {
      const list = grouped.get(source.category) || [];
      list.push(source);
      grouped.set(source.category, list);
    }
    return grouped;
  }, [search]);
}

// ─── V2 Category Accordion ──────────────────────────────

function CategoryAccordionV2({
  label,
  sources,
}: {
  label: string;
  sources: DataSource[];
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      data-slot="category-accordion"
      className="border-b border-mine-border/20 last:border-b-0"
    >
      <PanelRow
        onPress={() => setExpanded(!expanded)}
        className="bg-white hover:bg-mine-bg/40 px-3 py-2.5"
      >
        <PanelText variant="content" className="font-semibold">
          {label}
        </PanelText>
        <PanelBadge className="ml-auto mr-2">{sources.length}</PanelBadge>
        <ChevronDown
          className={cn(
            'w-3 h-3 text-mine-muted shrink-0 transition-transform duration-200',
            !expanded && '-rotate-90',
          )}
        />
      </PanelRow>

      {expanded && (
        <div>
          {sources.map((source) => (
            <DataSourceLink key={source.id} source={source} />
          ))}
        </div>
      )}
    </div>
  );
}

// ─── V2 (primitives) ────────────────────────────────────

function DataCatalogPanelV2() {
  const [search, setSearch] = useState('');
  const filteredByCategory = useFilteredData(search);
  const [isV2, toggleV2] = usePanelV2('data-catalog');

  return (
    <div
      data-slot="data-catalog-panel"
      className="flex flex-col h-full overflow-hidden"
    >
      <PanelBar
        title="Data Catalog"
        icon={<DatabaseIcon />}
        v2={{ active: isV2, onToggle: toggleV2 }}
      />

      {/* Search */}
      <div className="flex items-center w-full border-b border-mine-border/20 shrink-0">
        <SearchInput
          placeholder="Search data sources..."
          rootClassName="flex-1 border-none"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <PanelBody className="scrollbar-thin">
        {CATEGORIES.map((cat) => {
          const sources = filteredByCategory.get(cat.id);
          if (!sources || sources.length === 0) return null;
          return (
            <CategoryAccordionV2
              key={cat.id}
              label={cat.label}
              sources={sources}
            />
          );
        })}

        {filteredByCategory.size === 0 && (
          <PanelEmpty title="No data sources found" />
        )}
      </PanelBody>
    </div>
  );
}

// ─── V1 Category Accordion ──────────────────────────────

function CategoryAccordionV1({
  label,
  sources,
}: {
  label: string;
  sources: DataSource[];
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      data-slot="category-accordion"
      className="border-b border-mine-border/30 last:border-b-0"
    >
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center bg-white hover:bg-mine-bg/40 transition-colors cursor-pointer px-3 py-2.5"
      >
        <span className="text-[13px] font-semibold text-mine-text">
          {label}
        </span>
        <span className="text-[10px] font-mono tabular-nums ml-auto mr-2 text-mine-muted">
          {sources.length}
        </span>
        <ChevronDown
          className={cn(
            'w-4 h-4 text-mine-muted shrink-0 transition-transform duration-200',
            !expanded && '-rotate-90',
          )}
        />
      </button>

      {expanded && (
        <div>
          {sources.map((source) => (
            <DataSourceLink key={source.id} source={source} />
          ))}
        </div>
      )}
    </div>
  );
}

// ─── V1 (original) ──────────────────────────────────────

function DataCatalogPanelV1() {
  const [search, setSearch] = useState('');
  const filteredByCategory = useFilteredData(search);
  const [, toggleV2] = usePanelV2('data-catalog');

  return (
    <div
      data-slot="data-catalog-panel"
      className="flex flex-col h-full overflow-hidden"
    >
      {/* Search */}
      <div className="flex items-center w-full border-b shrink-0">
        <SearchInput
          placeholder="Search data sources..."
          rootClassName="flex-1 border-none"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button
          type="button"
          className={cn(
            'float-right px-2 m-0 h-full text-sm text-secondary-foreground ml-2',
            search && 'bg-accent text-accent-foreground',
            'disabled:cursor-not-allowed disabled:opacity-50',
          )}
          disabled={!search}
        >
          Search
        </button>
        <button
          type="button"
          onClick={toggleV2}
          className="text-mine-muted/40 hover:text-mine-muted p-0.5 rounded transition-colors mr-1"
          title="Switch to v2 (new)"
        >
          <span className="text-[8px] font-mono">v2</span>
        </button>
      </div>

      {/* Category list */}
      <div className="flex-1 overflow-y-auto scrollbar-thin">
        {CATEGORIES.map((cat) => {
          const sources = filteredByCategory.get(cat.id);
          if (!sources || sources.length === 0) return null;
          return (
            <CategoryAccordionV1
              key={cat.id}
              label={cat.label}
              sources={sources}
            />
          );
        })}

        {filteredByCategory.size === 0 && (
          <div className="text-center py-8">
            <p className="text-[11px] text-mine-muted">No data sources found</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Switch ─────────────────────────────────────────────

function DataCatalogPanel() {
  const [isV2] = usePanelV2('data-catalog');
  return isV2 ? <DataCatalogPanelV2 /> : <DataCatalogPanelV1 />;
}

export { DataCatalogPanel };
