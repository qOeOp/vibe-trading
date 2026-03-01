'use client';

import { useState, useMemo } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { SearchInput } from '@/features/lab/components/ui/input';
import {
  CATEGORIES,
  DATA_SOURCES,
  type DataCategory,
  type DataSource,
} from './mock-data';
import {
  PanelRow,
  PanelEmpty,
  PanelBadge,
  PanelText,
} from '@/components/shared/panel';
import { SnippetStudio } from './snippet-studio';

// ─── Shared sub-components ──────────────────────────────

function DataSourceLink({
  source,
  onSelect,
}: {
  source: DataSource;
  onSelect?: (s: DataSource) => void;
}) {
  const [expanded, setExpanded] = useState(false);

  const handleClick = () => {
    if (source.snippetPath && onSelect) {
      onSelect(source);
    } else {
      setExpanded(!expanded);
    }
  };

  return (
    <div data-slot="data-source-link">
      <button
        type="button"
        onClick={handleClick}
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

// ─── Category Accordion ─────────────────────────────────

function CategoryAccordion({
  label,
  sources,
  onSelect,
}: {
  label: string;
  sources: DataSource[];
  onSelect?: (s: DataSource) => void;
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
        <PanelText variant="body" className="font-semibold">
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
            <DataSourceLink
              key={source.id}
              source={source}
              onSelect={onSelect}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Data Catalog Panel Content ─────────────────────────

function DataCatalogPanel() {
  const [search, setSearch] = useState('');
  const [selectedSource, setSelectedSource] = useState<DataSource | null>(null);
  const filteredByCategory = useFilteredData(search);

  if (selectedSource) {
    return (
      <SnippetStudio
        source={selectedSource}
        onClose={() => setSelectedSource(null)}
      />
    );
  }

  return (
    <div
      data-slot="data-catalog-panel"
      className="flex flex-col h-full overflow-hidden"
    >
      {/* Search */}
      <div className="flex items-center w-full border-b border-mine-border/20 shrink-0">
        <SearchInput
          placeholder="Search data sources..."
          rootClassName="flex-1 border-none"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-thin">
        {CATEGORIES.map((cat) => {
          const sources = filteredByCategory.get(cat.id);
          if (!sources || sources.length === 0) return null;
          return (
            <CategoryAccordion
              key={cat.id}
              label={cat.label}
              sources={sources}
              onSelect={setSelectedSource}
            />
          );
        })}

        {filteredByCategory.size === 0 && (
          <PanelEmpty title="No data sources found" />
        )}
      </div>
    </div>
  );
}

export { DataCatalogPanel };
