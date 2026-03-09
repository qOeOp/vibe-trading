'use client';

import { useState } from 'react';
import { XIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  useLabFileTabStore,
  type FileTab,
} from '@/features/lab/store/use-lab-file-tab-store';
import { useLabModeStore } from '@/features/lab/store/use-lab-mode-store';

// ─── Mine Tab Bar ────────────────────────────────────────
//
// Align UI breadcrumb-style file bar (v2).
// File tabs separated by vertical dividers, colorful Python icon.

// ─── Python Icon (official logo colors) ──────────────────

function PythonIcon({ className }: { className?: string }) {
  return (
    <svg
      data-slot="python-icon"
      className={cn('shrink-0', className)}
      viewBox="0 0 256 255"
      fill="none"
    >
      <path
        d="M126.916.072c-64.832 0-60.784 28.115-60.784 28.115l.072 29.128h61.868v8.745H41.631S.145 61.355.145 126.77c0 65.417 36.21 63.097 36.21 63.097h21.61v-30.356s-1.165-36.21 35.632-36.21h61.362s34.475.557 34.475-33.319V33.97S194.67.072 126.916.072zM92.802 19.66a11.12 11.12 0 11.087 22.241 11.12 11.12 0 01-.087-22.24z"
        fill="#3776AB"
      />
      <path
        d="M128.757 254.126c64.832 0 60.784-28.115 60.784-28.115l-.072-29.127H127.6v-8.745h86.441s41.486 4.705 41.486-60.712c0-65.416-36.21-63.096-36.21-63.096h-21.61v30.355s1.165 36.21-35.632 36.21h-61.362s-34.475-.557-34.475 33.32v56.013s-5.235 33.897 62.519 33.897zm34.114-19.586a11.12 11.12 0 11-.087-22.24 11.12 11.12 0 01.087 22.24z"
        fill="#FFD43B"
      />
    </svg>
  );
}

// ─── Modified Dot ────────────────────────────────────────

function ModifiedDot({ visible = true }: { visible?: boolean }) {
  if (!visible) return null;
  return (
    <div
      data-slot="modified-dot"
      className="shrink-0 flex items-center h-5 pt-0.5 pl-0.5"
    >
      <div className="w-1.5 h-1.5 rounded-full bg-mine-muted" />
    </div>
  );
}

// ─── Single File Tab ─────────────────────────────────────

function FileTabItem({
  label,
  isDirty,
  isActive,
  isLast,
  closable,
  onClick,
  onClose,
}: {
  label: string;
  isDirty?: boolean;
  isActive?: boolean;
  isLast?: boolean;
  closable?: boolean;
  onClick?: () => void;
  onClose?: () => void;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      data-slot="tab-section-file"
      className={cn(
        'group/tab flex items-center pr-px',
        !isLast && 'border-r border-mine-border',
        onClick && 'cursor-pointer',
        isActive && 'bg-white/40 rounded-lg',
      )}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="flex items-center gap-1 pl-4 pr-2">
        <PythonIcon className="w-4 h-4" />
        <span className="font-mono font-medium text-sm text-mine-muted leading-5 tracking-[-0.084px] whitespace-nowrap">
          {label}
        </span>
        <ModifiedDot visible={isDirty} />
        {closable ? (
          <button
            type="button"
            data-slot="tab-close-btn"
            className={cn(
              'shrink-0 ml-1 p-0.5 rounded hover:bg-mine-border/40 transition-opacity',
              hovered ? 'opacity-100' : 'opacity-0',
            )}
            onClick={(e) => {
              e.stopPropagation();
              onClose?.();
            }}
          >
            <XIcon className="w-3 h-3 text-mine-muted" strokeWidth={2} />
          </button>
        ) : (
          <div className="w-4 shrink-0" />
        )}
      </div>
    </div>
  );
}

// ─── Connected File Tab ──────────────────────────────────

function ConnectedFileTab({
  tab,
  isActive,
  isLast,
}: {
  tab: FileTab;
  isActive: boolean;
  isLast: boolean;
}) {
  const setActive = useLabFileTabStore((s) => s.setActive);
  const closeTab = useLabFileTabStore((s) => s.closeTab);

  return (
    <FileTabItem
      label={tab.label}
      isDirty={tab.isDirty}
      isActive={isActive}
      isLast={isLast}
      closable={!tab.pinned}
      onClick={() => setActive(tab.id)}
      onClose={() => closeTab(tab.id)}
    />
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
      className={cn('flex items-center px-2.5 py-2', className)}
    >
      {isConnected ? (
        tabs.length > 0 ? (
          tabs.map((tab, i) => (
            <ConnectedFileTab
              key={tab.id}
              tab={tab}
              isActive={tab.id === activeTabId}
              isLast={i === tabs.length - 1}
            />
          ))
        ) : (
          <FileTabItem label="factor.py" isLast />
        )
      ) : (
        /* Disconnected: single welcome tab */
        <FileTabItem label="welcome.py" isLast />
      )}
    </div>
  );
}

export { MineTabBar };
