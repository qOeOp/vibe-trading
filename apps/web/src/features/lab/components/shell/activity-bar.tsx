'use client';

import type { LucideIcon } from 'lucide-react';
import {
  // Mine custom icons
  Variable,
  Box,
  Bot,
  SquareDashedBottomCode,
  FlaskConical,
  // Marimo panel icons
  Package,
  Database,
  AlertCircle,
  // Footer
  MoreHorizontal,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { GlowingEffect } from '@/components/ui/glowing-effect';

// ─── Tactile Button ───────────────────────────────────────

const BUTTON_SHADOW =
  '0px 1px 1px 0.5px rgba(51,51,51,0.04), 0px 3px 3px -1.5px rgba(51,51,51,0.02), 0px 6px 6px -3px rgba(51,51,51,0.04), 0px 12px 12px -6px rgba(51,51,51,0.04), 0px 0px 0px 1px rgba(51,51,51,0.1)';

const BUTTON_INSET = 'inset 0px -1px 1px -0.5px rgba(51,51,51,0.06)';

// ─── Panel Definitions ───────────────────────────────────

type PanelDef = {
  id: string;
  icon: LucideIcon;
  label: string;
  /** Push-aside panel width in px */
  width: number;
  /** Group separator — renders a gap before this item */
  group?: 'mine' | 'data' | 'dev';
};

const PANEL_ITEMS: PanelDef[] = [
  // ── Mine custom panels ──
  {
    id: 'variables-mine',
    icon: Variable,
    label: '变量',
    width: 280,
    group: 'mine',
  },
  { id: 'components', icon: Box, label: '组件', width: 320 },
  { id: 'ai', icon: Bot, label: 'AI 助手', width: 360 },
  {
    id: 'snippets-mine',
    icon: SquareDashedBottomCode,
    label: '代码片段',
    width: 300,
  },
  { id: 'experiments', icon: FlaskConical, label: '实验', width: 340 },

  // ── Marimo panels (real kernel data in connected mode) ──
  {
    id: 'variables',
    icon: Package,
    label: '变量检查器',
    width: 280,
    group: 'data',
  },
  { id: 'packages', icon: Box, label: '包管理', width: 280 },
  { id: 'snippets', icon: Database, label: '数据目录', width: 320 },

  // ── Marimo developer panels ──
  { id: 'errors', icon: AlertCircle, label: '错误', width: 300, group: 'dev' },
  { id: 'validation', icon: FlaskConical, label: '因子验证', width: 340 },
];

// ─── Activity Bar ─────────────────────────────────────────

type ActivityBarProps = {
  activePanel?: string | null;
  onPanelToggle?: (panelId: string) => void;
  className?: string;
};

function ActivityBar({
  activePanel,
  onPanelToggle,
  className,
  ...props
}: ActivityBarProps &
  Omit<React.ComponentProps<'div'>, keyof ActivityBarProps>) {
  let lastGroup: string | undefined;

  return (
    <div
      data-slot="activity-bar"
      className={cn(
        'shrink-0 flex flex-col items-center pt-0 pb-0 gap-2',
        className,
      )}
      {...props}
    >
      {PANEL_ITEMS.map((item) => {
        const isActive = activePanel === item.id;
        const needsSeparator =
          item.group && item.group !== lastGroup && lastGroup != null;
        lastGroup = item.group ?? lastGroup;

        return (
          <div key={item.id} className="contents">
            {needsSeparator && (
              <div className="w-5 h-px bg-mine-border my-0.5" />
            )}
            <button
              title={item.label}
              className={cn(
                'w-[36px] h-[36px] flex items-center justify-center rounded-[9px] relative transition-all',
                isActive
                  ? 'bg-mine-nav-active text-white scale-105'
                  : 'bg-white text-mine-text hover:scale-105',
              )}
              style={{ boxShadow: isActive ? undefined : BUTTON_SHADOW }}
              onClick={() => onPanelToggle?.(item.id)}
            >
              {!isActive && (
                <div
                  className="absolute inset-0 rounded-[9px] pointer-events-none"
                  style={{ boxShadow: BUTTON_INSET }}
                />
              )}
              {!isActive && (
                <GlowingEffect
                  spread={40}
                  glow
                  disabled={false}
                  proximity={48}
                  inactiveZone={0.01}
                  borderWidth={2}
                />
              )}
              <item.icon
                className="w-[18px] h-[18px] relative z-[1]"
                strokeWidth={1.5}
              />
            </button>
          </div>
        );
      })}

      {/* Spacer */}
      <div className="flex-1" />

      {/* More options — circular, positioned to align with frame corner radius */}
      <button
        className="w-[36px] h-[36px] flex items-center justify-center rounded-full bg-white text-mine-text relative hover:scale-105 transition-transform"
        style={{ boxShadow: BUTTON_SHADOW }}
      >
        <div
          className="absolute inset-0 rounded-full pointer-events-none"
          style={{ boxShadow: BUTTON_INSET }}
        />
        <GlowingEffect
          spread={40}
          glow
          disabled={false}
          proximity={48}
          inactiveZone={0.01}
          borderWidth={2}
        />
        <MoreHorizontal
          className="w-[18px] h-[18px] relative z-[1]"
          strokeWidth={1.5}
        />
      </button>
    </div>
  );
}

export { ActivityBar, PANEL_ITEMS, type PanelDef };
