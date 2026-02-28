'use client';

import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { GlowingEffect } from '@/components/ui/glowing-effect';
import { BUTTON_SHADOW, BUTTON_INSET } from './panels';

// ─── Panel Button ────────────────────────────────────────
//
// Shared 36×36px icon button used by LeftBar and ActivityBar.
// Bottom-slot panels get rounded-full; left/right get rounded-[9px].

type PanelButtonProps = {
  icon: LucideIcon;
  label: string;
  isActive: boolean;
  /** Use rounded-full instead of rounded-[9px] */
  round?: boolean;
  disabled?: boolean;
  /** Badge overlay (e.g. error count) */
  badge?: ReactNode;
  onClick?: () => void;
};

function PanelButton({
  icon: Icon,
  label,
  isActive,
  round = false,
  disabled = false,
  badge,
  onClick,
}: PanelButtonProps) {
  const radius = round ? 'rounded-full' : 'rounded-[9px]';

  return (
    <button
      data-slot="panel-button"
      title={disabled ? 'Available after connect' : label}
      disabled={disabled}
      className={cn(
        'w-[36px] h-[36px] flex items-center justify-center relative transition-all',
        radius,
        disabled
          ? 'bg-white text-mine-text opacity-40 cursor-not-allowed'
          : isActive
            ? 'bg-mine-nav-active text-white scale-105'
            : 'bg-white text-mine-text hover:scale-105',
      )}
      style={{
        boxShadow: isActive && !disabled ? undefined : BUTTON_SHADOW,
      }}
      onClick={disabled ? undefined : onClick}
    >
      {/* Inset shadow overlay */}
      {(!isActive || disabled) && (
        <div
          className={cn('absolute inset-0 pointer-events-none', radius)}
          style={{ boxShadow: BUTTON_INSET }}
        />
      )}

      {/* Glow effect (inactive + enabled only) */}
      {!isActive && !disabled && (
        <GlowingEffect
          spread={40}
          glow
          disabled={false}
          proximity={48}
          inactiveZone={0.01}
          borderWidth={2}
        />
      )}

      <Icon className="w-[18px] h-[18px] relative z-[1]" strokeWidth={1.5} />

      {badge}
    </button>
  );
}

export { PanelButton, type PanelButtonProps };
