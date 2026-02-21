'use client';

import { useState, useCallback, useMemo } from 'react';
import {
  TrendingUp,
  Building2,
  FlaskConical,
  Zap,
  BookOpen,
  ChevronRight,
  Copy,
  Check,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  CATEGORIES,
  DATA_SOURCES,
  type DataCategory,
  type DataSource,
} from './mock-data';

const ICON_MAP: Record<string, React.FC<{ className?: string }>> = {
  TrendingUp,
  Building2,
  FlaskConical,
  Zap,
  BookOpen,
};

function CopyButton({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  }, [code]);

  return (
    <button
      type="button"
      data-slot="copy-button"
      onClick={handleCopy}
      className={cn(
        'flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-medium transition-colors cursor-pointer',
        copied
          ? 'bg-mine-accent-green/10 text-mine-accent-green'
          : 'bg-mine-bg text-mine-muted hover:text-mine-text hover:bg-mine-border/50',
      )}
    >
      {copied ? (
        <>
          <Check className="w-3 h-3" />
          Copied!
        </>
      ) : (
        <>
          <Copy className="w-3 h-3" />
          Insert Code
        </>
      )}
    </button>
  );
}

function SchemaTable({ schema }: { schema: DataSource['schema'] }) {
  return (
    <div
      data-slot="schema-table"
      className="bg-mine-bg rounded-md overflow-hidden"
    >
      <table className="w-full text-[10px]">
        <thead>
          <tr className="border-b border-mine-border/30">
            <th className="text-left px-2 py-1 text-mine-muted font-medium uppercase tracking-wider">
              Column
            </th>
            <th className="text-right px-2 py-1 text-mine-muted font-medium uppercase tracking-wider">
              Type
            </th>
          </tr>
        </thead>
        <tbody>
          {schema.map((field) => (
            <tr
              key={field.column}
              className="border-b border-mine-border/20 last:border-b-0"
            >
              <td className="px-2 py-1 font-mono text-mine-text">
                {field.column}
              </td>
              <td className="px-2 py-1 text-right font-mono text-mine-muted">
                {field.type}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function DataSourceCard({ source }: { source: DataSource }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      data-slot="data-source-card"
      className="border border-mine-border/50 rounded-lg bg-white overflow-hidden"
    >
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-start gap-2 px-3 py-2 text-left hover:bg-mine-bg/50 transition-colors cursor-pointer"
      >
        <ChevronRight
          className={cn(
            'w-3 h-3 mt-0.5 text-mine-muted shrink-0 transition-transform duration-200',
            expanded && 'rotate-90',
          )}
        />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="font-mono text-[11px] font-medium text-mine-text truncate">
              {source.name}
            </span>
            <span className="text-[10px] text-mine-muted shrink-0">
              {source.nameZh}
            </span>
          </div>
          <p className="text-[10px] text-mine-muted mt-0.5 leading-relaxed">
            {source.description}
          </p>
        </div>
      </button>

      {expanded && (
        <div className="px-3 pb-3 pt-1 border-t border-mine-border/30 space-y-2">
          <SchemaTable schema={source.schema} />
          <div className="flex items-center justify-between">
            <code className="text-[10px] font-mono text-mine-muted truncate flex-1 mr-2">
              {source.sampleCode}
            </code>
            <CopyButton code={source.sampleCode} />
          </div>
        </div>
      )}
    </div>
  );
}

function CategoryGroup({
  label,
  iconName,
  sources,
}: {
  label: string;
  iconName: string;
  sources: DataSource[];
}) {
  const [expanded, setExpanded] = useState(true);
  const Icon = ICON_MAP[iconName];

  return (
    <div data-slot="category-group" className="space-y-1.5">
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center gap-2 px-1 py-1 rounded-md hover:bg-mine-bg/50 transition-colors cursor-pointer"
      >
        <ChevronRight
          className={cn(
            'w-3 h-3 text-mine-muted transition-transform duration-200',
            expanded && 'rotate-90',
          )}
        />
        {Icon && <Icon className="w-3.5 h-3.5 text-mine-muted" />}
        <span className="text-[11px] font-medium text-mine-text">{label}</span>
        <span className="text-[10px] text-mine-muted ml-auto font-mono tabular-nums">
          {sources.length}
        </span>
      </button>

      {expanded && (
        <div className="space-y-1.5 pl-2">
          {sources.map((source) => (
            <DataSourceCard key={source.id} source={source} />
          ))}
        </div>
      )}
    </div>
  );
}

function DataCatalogPanel() {
  const [search, setSearch] = useState('');

  const filteredByCategory = useMemo(() => {
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

  return (
    <div
      data-slot="data-catalog-panel"
      className="flex flex-col h-full overflow-hidden"
    >
      {/* Search */}
      <div className="px-3 py-2 border-b border-mine-border/50 shrink-0">
        <input
          type="text"
          placeholder="Search data sources..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-mine-bg rounded-md px-3 py-1.5 text-[11px] text-mine-text placeholder:text-mine-muted/60 border border-mine-border/50 focus:outline-none focus:border-mine-accent-teal/50 transition-colors"
        />
      </div>

      {/* Category list */}
      <div className="flex-1 overflow-y-auto scrollbar-thin px-3 py-3 space-y-4">
        {CATEGORIES.map((cat) => {
          const sources = filteredByCategory.get(cat.id);
          if (!sources || sources.length === 0) return null;
          return (
            <CategoryGroup
              key={cat.id}
              label={cat.label}
              iconName={cat.icon}
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

export { DataCatalogPanel };
