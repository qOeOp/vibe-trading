'use client';

import { Code2, FileCode2, FileJson, FileText, Play, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  useLabFileTabStore,
  type FileTab,
} from '../../store/use-lab-file-tab-store';
import { useLabModeStore } from '../../store/use-lab-mode-store';

// ─── Mine Tab Bar ────────────────────────────────────────
//
// Connected mode: data-driven from useLabFileTabStore.
// Disconnected mode: static mock tabs.

// ─── Static mock (disconnected) ─────────────────────────

type StaticTab = {
  id: string;
  label: string;
  icon: 'notebook' | 'source' | 'preview';
  badge?: string;
};

const DEFAULT_TABS: StaticTab[] = [
  { id: 'notebook', label: 'vt-lab', icon: 'notebook', badge: 'V1.0' },
  { id: 'source', label: 'vt-lab.py', icon: 'source' },
  { id: 'preview', label: 'preview', icon: 'preview' },
];

const STATIC_ICON_MAP = {
  notebook: FileCode2,
  source: Code2,
  preview: Play,
} as const;

// ─── File icon by extension ─────────────────────────────

function getFileIcon(path: string) {
  const ext = path.split('.').pop()?.toLowerCase();
  switch (ext) {
    case 'py':
      return FileCode2;
    case 'json':
      return FileJson;
    case 'md':
    case 'txt':
    case 'toml':
    case 'csv':
      return FileText;
    default:
      return Code2;
  }
}

// ─── Connected Tab ──────────────────────────────────────

function ConnectedTab({ tab, isActive }: { tab: FileTab; isActive: boolean }) {
  const setActive = useLabFileTabStore((s) => s.setActive);
  const closeTab = useLabFileTabStore((s) => s.closeTab);
  const Icon = getFileIcon(tab.path);

  return (
    <div
      data-slot="mine-tab"
      className={cn(
        'group flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-mono font-medium rounded-md transition-colors',
        isActive
          ? 'text-white bg-mine-nav-active'
          : 'text-mine-muted hover:bg-mine-bg cursor-pointer',
      )}
      onClick={() => setActive(tab.id)}
    >
      <Icon
        className={cn(
          'w-3.5 h-3.5 shrink-0',
          isActive ? 'text-white/70' : 'text-mine-muted',
        )}
        strokeWidth={1.5}
      />
      {tab.isDirty && (
        <span
          className={cn(
            'w-1.5 h-1.5 rounded-full shrink-0',
            isActive ? 'bg-white/50' : 'bg-[#a3a3a3]',
          )}
        />
      )}
      <span className="truncate max-w-[120px]">{tab.label}</span>
      {tab.pinned && (
        <span
          className={cn(
            'ml-0.5 text-[9px] px-1 py-0.5 rounded font-sans',
            isActive
              ? 'text-white/50 bg-white/10'
              : 'text-mine-muted bg-mine-bg',
          )}
        >
          NB
        </span>
      )}
      {!tab.pinned && (
        <button
          className={cn(
            'ml-0.5 w-4 h-4 flex items-center justify-center rounded-sm shrink-0 transition-colors',
            isActive
              ? 'text-white/40 hover:text-white hover:bg-white/10'
              : 'text-transparent group-hover:text-mine-muted hover:text-mine-text hover:bg-mine-border',
          )}
          onClick={(e) => {
            e.stopPropagation();
            closeTab(tab.id);
          }}
        >
          <X className="w-3 h-3" strokeWidth={2} />
        </button>
      )}
    </div>
  );
}

// ─── Static Tab (disconnected) ──────────────────────────

function StaticTabItem({
  tab,
  isActive,
}: {
  tab: StaticTab;
  isActive: boolean;
}) {
  const Icon = STATIC_ICON_MAP[tab.icon];
  return (
    <div
      className={cn(
        'flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-mono font-medium rounded-md transition-colors',
        isActive
          ? 'text-white bg-mine-nav-active'
          : 'text-mine-muted hover:bg-mine-bg cursor-pointer',
      )}
    >
      <Icon
        className={cn(
          'w-3.5 h-3.5',
          isActive ? 'text-white/70' : 'text-mine-muted',
        )}
        strokeWidth={1.5}
      />
      {tab.label}
      {tab.badge && (
        <span className="ml-1 text-[9px] text-white/50 bg-white/10 px-1 py-0.5 rounded font-sans">
          {tab.badge}
        </span>
      )}
    </div>
  );
}

// ─── Tab Bar ────────────────────────────────────────────

type MineTabBarProps = {
  className?: string;
};

function MineTabBar({ className }: MineTabBarProps) {
  const isConnected = useLabModeStore((s) => s.mode) === 'active';
  const tabs = useLabFileTabStore((s) => s.tabs);
  const activeTabId = useLabFileTabStore((s) => s.activeTabId);

  return (
    <div
      data-slot="mine-tab-bar"
      className={cn(
        'flex shrink-0 bg-white rounded-lg shadow-sm px-1 py-1 gap-1 overflow-x-auto',
        className,
      )}
    >
      {isConnected ? (
        tabs.length > 0 ? (
          tabs.map((tab) => (
            <ConnectedTab
              key={tab.id}
              tab={tab}
              isActive={tab.id === activeTabId}
            />
          ))
        ) : (
          /* Connected but no tabs yet — show minimal placeholder */
          <div className="flex items-center px-3 py-1.5 text-[12px] font-mono text-mine-muted">
            等待 notebook 初始化...
          </div>
        )
      ) : (
        DEFAULT_TABS.map((tab) => (
          <StaticTabItem
            key={tab.id}
            tab={tab}
            isActive={tab.id === 'notebook'}
          />
        ))
      )}
    </div>
  );
}

export { MineTabBar };
