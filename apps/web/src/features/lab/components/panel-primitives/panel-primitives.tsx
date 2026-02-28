'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { ToggleLeft, ToggleRight } from 'lucide-react';

// ─── Panel Primitives ───────────────────────────────────
//
// Shared building blocks for lab IDE sidebar panels.
// Enforces consistent typography, colors, spacing, and icons.
//
// Typography lockdown:
//   title    → text-[10px] font-medium text-mine-muted uppercase tracking-wider
//   content  → text-[11px] text-mine-text
//   sub      → text-[10px] text-mine-muted
//   mono     → text-[11px] font-mono tabular-nums
//   tiny     → text-[9px] text-mine-muted
//   icon     → w-3 h-3
//
// Border opacity: /30 for section dividers, /20 for row dividers

// ─── PanelBar ───────────────────────────────────────────
//
// Top bar of a panel: icon + title + optional badge + right slot.
// Always shrink-0 with bottom border.

type PanelBarProps = {
  /** Title text (uppercased automatically) */
  title: string;
  /** Icon component (rendered at w-3 h-3) */
  icon?: React.ReactElement<{ className?: string }>;
  /** Count or status badge next to title */
  badge?: React.ReactNode;
  /** Right-side content (action buttons, toggles) */
  right?: React.ReactNode;
  /** V2 toggle state — pass to show the toggle button */
  v2?: { active: boolean; onToggle: () => void };
  className?: string;
};

function PanelBar({ title, icon, badge, right, v2, className }: PanelBarProps) {
  return (
    <div
      data-slot="panel-bar"
      className={cn(
        'flex items-center gap-1.5 px-3 py-1.5 border-b border-mine-border/30 shrink-0',
        className,
      )}
    >
      {icon &&
        React.cloneElement(icon, {
          className: cn(
            'w-3 h-3 text-mine-muted shrink-0',
            icon.props.className,
          ),
        })}
      <span className="text-[10px] font-medium text-mine-muted uppercase tracking-wider">
        {title}
      </span>
      {badge}
      <div className="flex-1" />
      <div className="flex items-center gap-1">
        {right}
        {v2 && (
          <button
            type="button"
            onClick={v2.onToggle}
            className={cn(
              'p-0.5 rounded transition-colors',
              v2.active
                ? 'text-mine-accent-teal hover:text-mine-accent-teal/80'
                : 'text-mine-muted/40 hover:text-mine-muted',
            )}
            title={v2.active ? 'Switch to v1 (old)' : 'Switch to v2 (new)'}
          >
            {v2.active ? (
              <ToggleRight className="w-3.5 h-3.5" />
            ) : (
              <ToggleLeft className="w-3.5 h-3.5" />
            )}
          </button>
        )}
      </div>
    </div>
  );
}

// ─── PanelBody ──────────────────────────────────────────
//
// Scrollable content area below PanelBar.

type PanelBodyProps = React.ComponentProps<'div'>;

function PanelBody({ className, children, ...props }: PanelBodyProps) {
  return (
    <div
      data-slot="panel-body"
      className={cn('flex-1 min-h-0 overflow-y-auto flex flex-col', className)}
      {...props}
    >
      {children}
    </div>
  );
}

// ─── PanelSection ───────────────────────────────────────
//
// Content group with optional title and bottom divider.
// Last section auto-hides its bottom border.

type PanelSectionProps = React.ComponentProps<'div'> & {
  /** Section title (uppercased, small label) */
  title?: string;
  /** Right-side content for the title row */
  titleRight?: React.ReactNode;
};

function PanelSection({
  title,
  titleRight,
  className,
  children,
  ...props
}: PanelSectionProps) {
  return (
    <div
      data-slot="panel-section"
      className={cn(
        'px-3 py-2.5 border-b border-mine-border/20 last:border-b-0',
        className,
      )}
      {...props}
    >
      {title && (
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-medium text-mine-muted uppercase tracking-wider">
            {title}
          </span>
          {titleRight}
        </div>
      )}
      {children}
    </div>
  );
}

// ─── PanelRow ───────────────────────────────────────────
//
// Interactive row with hover state and optional hover-reveal actions.
// Uses `group` class for coordinated hover effects.

type PanelRowProps = {
  /** Click handler (makes the row a button semantically) */
  onPress?: () => void;
  /** Hover background variant */
  hoverBg?: 'default' | 'red' | 'none';
  className?: string;
  children?: React.ReactNode;
};

function PanelRow({
  onPress,
  hoverBg = 'default',
  className,
  children,
}: PanelRowProps) {
  const hoverClass = {
    default: 'hover:bg-mine-bg/30',
    red: 'hover:bg-mine-accent-red/5',
    none: '',
  }[hoverBg];

  const classes = cn(
    'flex items-center gap-2 px-3 py-1.5 group transition-colors w-full text-left',
    hoverClass,
    className,
  );

  if (onPress) {
    return (
      <button
        type="button"
        data-slot="panel-row"
        className={classes}
        onClick={onPress}
      >
        {children}
      </button>
    );
  }

  return (
    <div data-slot="panel-row" className={classes}>
      {children}
    </div>
  );
}

// ─── PanelActions ───────────────────────────────────────
//
// Container for hover-revealed action buttons within a PanelRow.

type PanelActionsProps = React.ComponentProps<'div'>;

function PanelActions({ className, children, ...props }: PanelActionsProps) {
  return (
    <div
      data-slot="panel-actions"
      className={cn(
        'flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

// ─── PanelActionButton ──────────────────────────────────
//
// Individual action icon button (w-3 h-3 icon, p-1 hit area).

type PanelActionButtonProps = React.ComponentProps<'button'> & {
  icon: React.ReactElement<{ className?: string }>;
  /** Hover color variant */
  hoverColor?: 'default' | 'teal' | 'red';
  label: string;
};

function PanelActionButton({
  icon,
  hoverColor = 'default',
  label,
  className,
  ...props
}: PanelActionButtonProps) {
  const hoverClass = {
    default: 'hover:text-mine-text',
    teal: 'hover:text-mine-accent-teal',
    red: 'hover:text-market-up-medium',
  }[hoverColor];

  return (
    <button
      type="button"
      data-slot="panel-action-button"
      className={cn(
        'p-1 rounded text-mine-muted transition-colors',
        hoverClass,
        className,
      )}
      aria-label={label}
      {...props}
    >
      {React.cloneElement(icon, {
        className: 'w-3 h-3',
      })}
    </button>
  );
}

// ─── PanelEmpty ─────────────────────────────────────────
//
// Empty state placeholder. Replaces both marimo's PanelEmptyState
// (which uses Radix tokens) and ad-hoc centered divs.

type PanelEmptyProps = {
  /** Main message */
  title: string;
  /** Optional description below title */
  description?: React.ReactNode;
  /** Icon (rendered at w-6 h-6, muted) */
  icon?: React.ReactElement<{ className?: string }>;
  /** Optional action button/link */
  action?: React.ReactNode;
  className?: string;
};

function PanelEmpty({
  title,
  description,
  icon,
  action,
  className,
}: PanelEmptyProps) {
  return (
    <div
      data-slot="panel-empty"
      className={cn(
        'flex-1 flex flex-col items-center justify-center gap-2 px-6 py-8',
        className,
      )}
    >
      {icon &&
        React.cloneElement(icon, {
          className: 'w-6 h-6 text-mine-muted/40',
        })}
      <span className="text-[11px] font-medium text-mine-muted">{title}</span>
      {description && (
        <span className="text-[10px] text-mine-muted/60 text-center leading-relaxed">
          {description}
        </span>
      )}
      {action && <div className="mt-1">{action}</div>}
    </div>
  );
}

// ─── PanelBadge ─────────────────────────────────────────
//
// Small inline badge for counts, status labels, etc.

type PanelBadgeProps = React.ComponentProps<'span'> & {
  /** Semantic color */
  color?: 'muted' | 'red' | 'teal' | 'yellow';
};

function PanelBadge({
  color = 'muted',
  className,
  children,
  ...props
}: PanelBadgeProps) {
  const colorClass = {
    muted: 'text-mine-muted',
    red: 'text-mine-accent-red',
    teal: 'text-mine-accent-teal',
    yellow: 'text-mine-accent-yellow',
  }[color];

  return (
    <span
      data-slot="panel-badge"
      className={cn('text-[9px] font-mono tabular-nums', colorClass, className)}
      {...props}
    >
      {children}
    </span>
  );
}

// ─── PanelBadgeTag ──────────────────────────────────────
//
// Pill-shaped badge with tinted background (e.g. "writable", "read-only").

type PanelBadgeTagProps = React.ComponentProps<'span'> & {
  color?: 'muted' | 'teal';
};

function PanelBadgeTag({
  color = 'muted',
  className,
  children,
  ...props
}: PanelBadgeTagProps) {
  const colorClass = {
    muted: 'bg-mine-bg text-mine-muted',
    teal: 'bg-mine-accent-teal/10 text-mine-accent-teal',
  }[color];

  return (
    <span
      data-slot="panel-badge-tag"
      className={cn(
        'px-1 py-0.5 text-[9px] font-medium rounded',
        colorClass,
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
}

// ─── PanelText ──────────────────────────────────────────
//
// Typed text spans for consistent typography within panels.

type PanelTextVariant = 'title' | 'content' | 'sub' | 'mono' | 'tiny';

type PanelTextProps = React.ComponentProps<'span'> & {
  variant?: PanelTextVariant;
};

const textVariantClass: Record<PanelTextVariant, string> = {
  title: 'text-[10px] font-medium text-mine-muted uppercase tracking-wider',
  content: 'text-[11px] text-mine-text',
  sub: 'text-[10px] text-mine-muted',
  mono: 'text-[11px] font-mono tabular-nums text-mine-text',
  tiny: 'text-[9px] text-mine-muted',
};

function PanelText({
  variant = 'content',
  className,
  children,
  ...props
}: PanelTextProps) {
  return (
    <span
      data-slot="panel-text"
      className={cn(textVariantClass[variant], className)}
      {...props}
    >
      {children}
    </span>
  );
}

// ─── Exports ────────────────────────────────────────────

export {
  PanelBar,
  PanelBody,
  PanelSection,
  PanelRow,
  PanelActions,
  PanelActionButton,
  PanelEmpty,
  PanelBadge,
  PanelBadgeTag,
  PanelText,
};

export type {
  PanelBarProps,
  PanelBodyProps,
  PanelSectionProps,
  PanelRowProps,
  PanelActionsProps,
  PanelActionButtonProps,
  PanelEmptyProps,
  PanelBadgeProps,
  PanelBadgeTagProps,
  PanelTextProps,
  PanelTextVariant,
};
