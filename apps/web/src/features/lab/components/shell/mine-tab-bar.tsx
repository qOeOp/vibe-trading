'use client';

import { Code2, FileCode2, Play } from 'lucide-react';
import { cn } from '@/lib/utils';

// ─── Mine Tab Bar ────────────────────────────────────────
//
// Detached tab header shared between static and live states.
// Same component — same pixels — "CSS artwork comes alive".

type TabDef = {
  id: string;
  label: string;
  icon: 'notebook' | 'source' | 'preview';
  badge?: string;
};

const DEFAULT_TABS: TabDef[] = [
  { id: 'notebook', label: 'vt-lab', icon: 'notebook', badge: 'V1.0' },
  { id: 'source', label: 'vt-lab.py', icon: 'source' },
  { id: 'preview', label: 'preview', icon: 'preview' },
];

const ICON_MAP = {
  notebook: FileCode2,
  source: Code2,
  preview: Play,
} as const;

type MineTabBarProps = {
  tabs?: TabDef[];
  activeTab?: string;
  className?: string;
};

function MineTabBar({
  tabs = DEFAULT_TABS,
  activeTab = 'notebook',
  className,
}: MineTabBarProps) {
  return (
    <div
      data-slot="mine-tab-bar"
      className={cn(
        'flex shrink-0 bg-white rounded-lg shadow-sm px-1 py-1 gap-1',
        className,
      )}
    >
      {tabs.map((tab) => {
        const Icon = ICON_MAP[tab.icon];
        const isActive = tab.id === activeTab;

        return (
          <div
            key={tab.id}
            className={cn(
              'flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-mono font-medium rounded-md transition-colors',
              isActive
                ? 'text-white bg-[#1a1a1a]'
                : 'text-[#a3a3a3] hover:bg-[#f5f5f5] cursor-pointer',
            )}
          >
            <Icon
              className={cn(
                'w-3.5 h-3.5',
                isActive ? 'text-white/70' : 'text-[#b3b3b3]',
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
      })}
    </div>
  );
}

export { MineTabBar, type TabDef };
