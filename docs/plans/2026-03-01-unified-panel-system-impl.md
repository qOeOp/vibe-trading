# Unified Panel System — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a unified panel component library at `components/shared/panel/` that replaces three separate systems (lab `panel-primitives`, library `detail-panel`, mining hand-written).

**Architecture:** CVA-based typography system with 4 semantic roles. Container hierarchy: PanelFrame → PanelFrameHeader + PanelFrameBody → PanelSection → content primitives. All components at L2 layer (`components/shared/`).

**Tech Stack:** React 19, Tailwind v4, CVA, Framer Motion (for collapsible sections), Lucide icons

**Design doc:** `docs/plans/2026-03-01-unified-panel-system-design.md`

---

### Task 1: Typography System + PanelText

**Files:**
- Create: `apps/web/src/components/shared/panel/panel-typography.ts`
- Create: `apps/web/src/components/shared/panel/panel-text.tsx`

**Step 1: Create the typography map**

```ts
// apps/web/src/components/shared/panel/panel-typography.ts
// Single source of truth for all panel text styles.
// Every panel component references this map — no hardcoded font specs anywhere else.

const PANEL_TYPOGRAPHY = {
  label:    'font-medium text-mine-muted uppercase tracking-wider',
  body:     'text-mine-text',
  value:    'font-mono tabular-nums text-mine-text',
  hint:     'text-mine-muted',
} as const

const PANEL_SIZE = {
  sm:   'text-[9px]',
  base: 'text-[11px]',
  lg:   'text-sm font-bold',
} as const

// Default size overrides per role (label and hint default to 10px, not 11px)
const PANEL_ROLE_DEFAULT_SIZE: Partial<Record<keyof typeof PANEL_TYPOGRAPHY, string>> = {
  label: 'text-[10px]',
  hint:  'text-[10px]',
}

export { PANEL_TYPOGRAPHY, PANEL_SIZE, PANEL_ROLE_DEFAULT_SIZE }
```

**Step 2: Create PanelText with CVA**

```tsx
// apps/web/src/components/shared/panel/panel-text.tsx
'use client'

import * as React from 'react'
import { cva } from 'class-variance-authority'
import type { VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const panelTextVariants = cva('', {
  variants: {
    variant: {
      label: 'font-medium text-mine-muted uppercase tracking-wider',
      body:  'text-mine-text',
      value: 'font-mono tabular-nums text-mine-text',
      hint:  'text-mine-muted',
    },
    size: {
      sm:   'text-[9px]',
      base: 'text-[11px]',
      lg:   'text-sm font-bold',
    },
  },
  defaultVariants: { variant: 'body', size: 'base' },
  compoundVariants: [
    { variant: 'label', size: 'base', className: 'text-[10px]' },
    { variant: 'hint',  size: 'base', className: 'text-[10px]' },
  ],
})

type PanelTextProps = React.ComponentProps<'span'> &
  VariantProps<typeof panelTextVariants>

function PanelText({ variant, size, className, children, ...props }: PanelTextProps) {
  return (
    <span
      data-slot="panel-text"
      className={cn(panelTextVariants({ variant, size }), className)}
      {...props}
    >
      {children}
    </span>
  )
}

export { PanelText, panelTextVariants }
export type { PanelTextProps }
```

**Step 3: Commit**

```bash
git add apps/web/src/components/shared/panel/
git commit -m "feat(panel): add typography system and PanelText component"
```

---

### Task 2: PanelFrame + PanelFrameHeader + PanelFrameBody

**Files:**
- Create: `apps/web/src/components/shared/panel/panel-frame.tsx`
- Create: `apps/web/src/components/shared/panel/panel-frame-header.tsx`
- Create: `apps/web/src/components/shared/panel/panel-frame-body.tsx`

**Context:** These replace `content-frame.tsx` (gray bg container + white body) and `detail-panel.tsx` (white card container). The new PanelFrame uses the ContentFrame visual style (gray bg `#f2f2f2`, rounded-[20px], inset shadow, white inner body).

**Key refs:**
- `BUTTON_SHADOW` and `BUTTON_INSET` are defined in `features/lab/components/shell/panels.ts` — import from there or duplicate the constants
- Red close button: `bg-[#FF5F57]`, 20x20, X icon 10x10, same shadow as activity bar buttons

**Step 1: Create PanelFrameHeader**

```tsx
// apps/web/src/components/shared/panel/panel-frame-header.tsx
'use client'

import * as React from 'react'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { PANEL_TYPOGRAPHY } from './panel-typography'

// Tactile button shadow (same as activity bar buttons in shell/panels.ts)
const CLOSE_SHADOW =
  '0px 1px 1px 0.5px rgba(51,51,51,0.04), 0px 3px 3px -1.5px rgba(51,51,51,0.02), 0px 6px 6px -3px rgba(51,51,51,0.04), 0px 12px 12px -6px rgba(51,51,51,0.04), 0px 0px 0px 1px rgba(51,51,51,0.1)'
const CLOSE_INSET = 'inset 0px -1px 1px -0.5px rgba(51,51,51,0.06)'

type PanelFrameHeaderProps = {
  /** Panel title — rendered uppercase with label typography */
  title: string
  /** Optional subtitle badge (e.g. <PanelBadgeTag>) */
  subtitle?: React.ReactNode
  /** Right-side action buttons (before close dot) */
  actions?: React.ReactNode
  /** Close handler — shows red close dot when provided */
  onClose?: () => void
  className?: string
}

function PanelFrameHeader({
  title,
  subtitle,
  actions,
  onClose,
  className,
}: PanelFrameHeaderProps) {
  return (
    <div
      data-slot="panel-frame-header"
      className={cn('flex items-center px-2.5 py-2 shrink-0', className)}
    >
      <span
        className={cn(
          PANEL_TYPOGRAPHY.label,
          'text-[10px] pl-2 font-semibold',
        )}
      >
        {title}
      </span>
      {subtitle && <div className="ml-2">{subtitle}</div>}
      <div className="flex-1" />
      <div className="flex items-center gap-1.5">
        {actions}
        {onClose && <FrameCloseButton onClick={onClose} />}
      </div>
    </div>
  )
}

function FrameCloseButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      data-slot="frame-close-button"
      className="w-5 h-5 flex items-center justify-center rounded-full bg-[#FF5F57] text-white hover:brightness-90 transition-all"
      style={{ boxShadow: CLOSE_SHADOW }}
      onClick={onClick}
    >
      <div
        className="absolute inset-0 rounded-full pointer-events-none"
        style={{ boxShadow: CLOSE_INSET }}
      />
      <X className="w-2.5 h-2.5 relative z-[1]" strokeWidth={2.5} />
    </button>
  )
}

export { PanelFrameHeader, FrameCloseButton }
export type { PanelFrameHeaderProps }
```

**Step 2: Create PanelFrameBody**

```tsx
// apps/web/src/components/shared/panel/panel-frame-body.tsx
'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

type PanelFrameBodyProps = React.ComponentProps<'div'> & {
  /** Fixed toolbar above scrollable content (e.g. PanelSearchBar) */
  toolbar?: React.ReactNode
}

const PanelFrameBody = React.forwardRef<HTMLDivElement, PanelFrameBodyProps>(
  ({ toolbar, className, children, ...props }, ref) => {
    return (
      <div
        data-slot="panel-frame-body"
        className={cn(
          'flex-1 min-h-0 overflow-hidden bg-white rounded-2xl mx-1.5 mb-1.5 flex flex-col',
          className,
        )}
      >
        {toolbar && (
          <div data-slot="panel-frame-toolbar" className="shrink-0">
            {toolbar}
          </div>
        )}
        <div
          ref={ref}
          data-slot="panel-frame-scroll"
          className="flex-1 min-h-0 overflow-y-auto"
          {...props}
        >
          {children}
        </div>
      </div>
    )
  },
)
PanelFrameBody.displayName = 'PanelFrameBody'

export { PanelFrameBody }
export type { PanelFrameBodyProps }
```

**Step 3: Create PanelFrame**

```tsx
// apps/web/src/components/shared/panel/panel-frame.tsx
'use client'

import { type PropsWithChildren } from 'react'
import { cn } from '@/lib/utils'

type PanelFrameProps = PropsWithChildren<{
  className?: string
}>

function PanelFrame({ className, children }: PanelFrameProps) {
  return (
    <div
      data-slot="panel-frame"
      className={cn(
        'flex flex-col overflow-hidden bg-[#f2f2f2] rounded-[20px]',
        className,
      )}
      style={{
        boxShadow: 'inset 0px 0.75px 0.75px rgba(0,0,0,0.04)',
      }}
    >
      {children}
    </div>
  )
}

export { PanelFrame }
export type { PanelFrameProps }
```

**Step 4: Commit**

```bash
git add apps/web/src/components/shared/panel/
git commit -m "feat(panel): add PanelFrame, PanelFrameHeader, PanelFrameBody"
```

---

### Task 3: PanelSection with Collapsible Support

**Files:**
- Create: `apps/web/src/components/shared/panel/panel-section.tsx`

**Context:** Merges `DetailSection` (px-4 py-3, border-b/50, title + suffix) with lab `PanelSection` (px-3 py-2.5, border-b/20, title + titleRight). Uses DetailSection's spacing (px-4 py-3) and border opacity (/50) as the unified standard. Adds built-in collapsible with Framer Motion AnimatePresence.

**Step 1: Create PanelSection**

```tsx
// apps/web/src/components/shared/panel/panel-section.tsx
'use client'

import * as React from 'react'
import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { PANEL_TYPOGRAPHY } from './panel-typography'

type PanelSectionProps = React.ComponentProps<'div'> & {
  /** Section title (rendered uppercase with label typography) */
  title?: string
  /** Right-side of title row (parameter context, links) */
  suffix?: React.ReactNode
  /** Right-most slot in title row (fold button, toggle, etc.) */
  titleRight?: React.ReactNode
  /** Count or status badge next to title */
  badge?: React.ReactNode
  /** Enable built-in collapsible behavior */
  collapsible?: boolean
  /** Initial collapsed state (default: true = open) */
  defaultOpen?: boolean
  /** Force hide bottom border */
  noBorder?: boolean
}

function PanelSection({
  title,
  suffix,
  titleRight,
  badge,
  collapsible = false,
  defaultOpen = true,
  noBorder = false,
  className,
  children,
  ...props
}: PanelSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen)
  const showContent = !collapsible || isOpen

  return (
    <div
      data-slot="panel-section"
      className={cn(
        'px-4 py-3',
        !noBorder && 'border-b border-mine-border/50 last:border-b-0',
        className,
      )}
      {...props}
    >
      {/* Section header */}
      {title && (
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5">
            {collapsible && (
              <button
                type="button"
                onClick={() => setIsOpen((o) => !o)}
                className="p-0.5 -ml-1 text-mine-muted hover:text-mine-text transition-colors"
              >
                <motion.div
                  animate={{ rotate: isOpen ? 90 : 0 }}
                  transition={{ duration: 0.15 }}
                >
                  <ChevronRight className="w-3 h-3" />
                </motion.div>
              </button>
            )}
            <span className={cn(PANEL_TYPOGRAPHY.label, 'text-[10px]')}>
              {title}
            </span>
            {badge && <span className="text-[9px] font-mono tabular-nums text-mine-muted">{badge}</span>}
          </div>
          <div className="flex items-center gap-2">
            {suffix && (
              <span className="text-[10px] text-mine-muted">{suffix}</span>
            )}
            {titleRight}
          </div>
        </div>
      )}

      {/* Section content */}
      {collapsible ? (
        <AnimatePresence initial={false}>
          {isOpen && (
            <motion.div
              key="content"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
              style={{ overflow: 'hidden' }}
            >
              {children}
            </motion.div>
          )}
        </AnimatePresence>
      ) : (
        children
      )}
    </div>
  )
}

export { PanelSection }
export type { PanelSectionProps }
```

**Step 2: Commit**

```bash
git add apps/web/src/components/shared/panel/panel-section.tsx
git commit -m "feat(panel): add PanelSection with collapsible support"
```

---

### Task 4: Content Primitives (StatGrid, KV, Row, ChartBox, Empty, Badge, ActionButton, SearchBar)

**Files:**
- Create: `apps/web/src/components/shared/panel/panel-stat-grid.tsx`
- Create: `apps/web/src/components/shared/panel/panel-kv.tsx`
- Create: `apps/web/src/components/shared/panel/panel-row.tsx`
- Create: `apps/web/src/components/shared/panel/panel-chart-box.tsx`
- Create: `apps/web/src/components/shared/panel/panel-empty.tsx`
- Create: `apps/web/src/components/shared/panel/panel-badge.tsx`
- Create: `apps/web/src/components/shared/panel/panel-action-button.tsx`
- Create: `apps/web/src/components/shared/panel/panel-search-bar.tsx`

**Context:** These merge primitives from both existing systems. Color maps are unified — keep `up/down/flat/muted` from detail-panel (the most common pattern) and add `positive/negative` as aliases. All components reference `PANEL_TYPOGRAPHY` instead of hardcoding font specs.

**Step 1: Create PanelStatGrid + PanelStatItem**

```tsx
// apps/web/src/components/shared/panel/panel-stat-grid.tsx
'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'
import { PANEL_TYPOGRAPHY } from './panel-typography'

// ─── Color Map ─────────────────────────────────────────

const STAT_COLOR_MAP = {
  up:       'text-market-up-medium',
  down:     'text-market-down-medium',
  flat:     'text-market-flat',
  muted:    'text-mine-muted',
  positive: 'text-market-down',
  negative: 'text-market-up-medium',
} as const

type StatColor = keyof typeof STAT_COLOR_MAP

// ─── StatItem ──────────────────────────────────────────

type PanelStatItemProps = {
  label: string
  value: string
  color?: StatColor
  className?: string
}

function PanelStatItem({ label, value, color, className }: PanelStatItemProps) {
  return (
    <div
      data-slot="panel-stat-item"
      className={cn('flex flex-col items-center gap-0.5', className)}
    >
      <span
        className={cn(
          'text-sm font-bold font-mono tabular-nums',
          color ? STAT_COLOR_MAP[color] : 'text-mine-text',
        )}
      >
        {value}
      </span>
      <span className={cn(PANEL_TYPOGRAPHY.label, 'text-[9px]')}>
        {label}
      </span>
    </div>
  )
}

// ─── StatGrid ──────────────────────────────────────────

type PanelStatGridProps = {
  columns?: 2 | 3 | 4
  className?: string
  children: React.ReactNode
}

const GRID_COLS: Record<number, string> = {
  2: 'grid-cols-2',
  3: 'grid-cols-3',
  4: 'grid-cols-4',
}

function PanelStatGrid({ columns = 3, className, children }: PanelStatGridProps) {
  return (
    <div
      data-slot="panel-stat-grid"
      className={cn('grid gap-3', GRID_COLS[columns], className)}
    >
      {children}
    </div>
  )
}

export { PanelStatGrid, PanelStatItem, STAT_COLOR_MAP }
export type { PanelStatGridProps, PanelStatItemProps, StatColor }
```

**Step 2: Create PanelKV**

```tsx
// apps/web/src/components/shared/panel/panel-kv.tsx
'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'
import { STAT_COLOR_MAP, type StatColor } from './panel-stat-grid'

type PanelKVProps = {
  label: string
  value: React.ReactNode
  color?: StatColor
  className?: string
}

function PanelKV({ label, value, color, className }: PanelKVProps) {
  return (
    <div
      data-slot="panel-kv"
      className={cn('flex items-center justify-between py-1', className)}
    >
      <span className="text-[10px] text-mine-muted">{label}</span>
      <span
        className={cn(
          'text-[11px] font-mono tabular-nums',
          color ? STAT_COLOR_MAP[color] : 'text-mine-text',
        )}
      >
        {value}
      </span>
    </div>
  )
}

export { PanelKV }
export type { PanelKVProps }
```

**Step 3: Create PanelRow + PanelActions**

```tsx
// apps/web/src/components/shared/panel/panel-row.tsx
'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

type PanelRowProps = {
  onPress?: () => void
  hoverBg?: 'default' | 'red' | 'none'
  className?: string
  children?: React.ReactNode
}

function PanelRow({ onPress, hoverBg = 'default', className, children }: PanelRowProps) {
  const hoverClass = {
    default: 'hover:bg-mine-bg/30',
    red: 'hover:bg-mine-accent-red/5',
    none: '',
  }[hoverBg]

  const classes = cn(
    'flex items-center gap-2 px-3 py-1.5 group transition-colors w-full text-left',
    hoverClass,
    className,
  )

  if (onPress) {
    return (
      <button type="button" data-slot="panel-row" className={classes} onClick={onPress}>
        {children}
      </button>
    )
  }

  return (
    <div data-slot="panel-row" className={classes}>
      {children}
    </div>
  )
}

// Container for hover-revealed action buttons within a PanelRow
type PanelActionsProps = React.ComponentProps<'div'>

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
  )
}

export { PanelRow, PanelActions }
export type { PanelRowProps, PanelActionsProps }
```

**Step 4: Create PanelChartBox**

```tsx
// apps/web/src/components/shared/panel/panel-chart-box.tsx
'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

type PanelChartBoxProps = React.ComponentProps<'div'>

function PanelChartBox({ className, children, ...props }: PanelChartBoxProps) {
  return (
    <div
      data-slot="panel-chart-box"
      className={cn('bg-mine-bg rounded-md p-1', className)}
      {...props}
    >
      {children}
    </div>
  )
}

export { PanelChartBox }
export type { PanelChartBoxProps }
```

**Step 5: Create PanelEmpty**

```tsx
// apps/web/src/components/shared/panel/panel-empty.tsx
'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

type PanelEmptyProps = {
  title: string
  description?: React.ReactNode
  icon?: React.ReactElement<{ className?: string }>
  action?: React.ReactNode
  className?: string
}

function PanelEmpty({ title, description, icon, action, className }: PanelEmptyProps) {
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
  )
}

export { PanelEmpty }
export type { PanelEmptyProps }
```

**Step 6: Create PanelBadge + PanelBadgeTag**

```tsx
// apps/web/src/components/shared/panel/panel-badge.tsx
'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

// ─── Inline Badge ──────────────────────────────────────

type PanelBadgeProps = React.ComponentProps<'span'> & {
  color?: 'muted' | 'red' | 'teal' | 'yellow'
}

const BADGE_COLOR = {
  muted:  'text-mine-muted',
  red:    'text-mine-accent-red',
  teal:   'text-mine-accent-teal',
  yellow: 'text-mine-accent-yellow',
} as const

function PanelBadge({ color = 'muted', className, children, ...props }: PanelBadgeProps) {
  return (
    <span
      data-slot="panel-badge"
      className={cn('text-[9px] font-mono tabular-nums', BADGE_COLOR[color], className)}
      {...props}
    >
      {children}
    </span>
  )
}

// ─── Capsule Tag ───────────────────────────────────────

type PanelBadgeTagProps = React.ComponentProps<'span'> & {
  color?: 'muted' | 'teal' | 'red' | 'yellow'
}

const TAG_COLOR = {
  muted:  'bg-mine-bg text-mine-muted',
  teal:   'bg-mine-accent-teal/10 text-mine-accent-teal',
  red:    'bg-mine-accent-red/10 text-mine-accent-red',
  yellow: 'bg-mine-accent-yellow/10 text-mine-accent-yellow',
} as const

function PanelBadgeTag({ color = 'muted', className, children, ...props }: PanelBadgeTagProps) {
  return (
    <span
      data-slot="panel-badge-tag"
      className={cn(
        'px-1.5 py-0.5 text-[9px] font-medium rounded',
        TAG_COLOR[color],
        className,
      )}
      {...props}
    >
      {children}
    </span>
  )
}

export { PanelBadge, PanelBadgeTag }
export type { PanelBadgeProps, PanelBadgeTagProps }
```

**Step 7: Create PanelActionButton**

```tsx
// apps/web/src/components/shared/panel/panel-action-button.tsx
'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

type PanelActionButtonProps = React.ComponentProps<'button'> & {
  icon: React.ReactElement<{ className?: string }>
  hoverColor?: 'default' | 'teal' | 'red'
  label: string
}

const HOVER_COLOR = {
  default: 'hover:text-mine-text',
  teal:    'hover:text-mine-accent-teal',
  red:     'hover:text-market-up-medium',
} as const

function PanelActionButton({
  icon,
  hoverColor = 'default',
  label,
  className,
  ...props
}: PanelActionButtonProps) {
  return (
    <button
      type="button"
      data-slot="panel-action-button"
      className={cn(
        'p-1 rounded text-mine-muted transition-colors',
        HOVER_COLOR[hoverColor],
        className,
      )}
      aria-label={label}
      {...props}
    >
      {React.cloneElement(icon, { className: 'w-3 h-3' })}
    </button>
  )
}

export { PanelActionButton }
export type { PanelActionButtonProps }
```

**Step 8: Create PanelSearchBar**

```tsx
// apps/web/src/components/shared/panel/panel-search-bar.tsx
'use client'

import * as React from 'react'
import { Search, X } from 'lucide-react'
import { cn } from '@/lib/utils'

type PanelSearchBarProps = {
  value?: string
  onChange?: (value: string) => void
  placeholder?: string
  className?: string
}

function PanelSearchBar({ value = '', onChange, placeholder = 'Search...', className }: PanelSearchBarProps) {
  return (
    <div
      data-slot="panel-search-bar"
      className={cn(
        'flex items-center gap-1.5 px-3 py-1.5 border-b border-mine-border/30',
        className,
      )}
    >
      <Search className="w-3 h-3 text-mine-muted shrink-0" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
        className="flex-1 text-[11px] text-mine-text bg-transparent outline-none placeholder:text-mine-muted/50"
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange?.('')}
          className="p-0.5 text-mine-muted hover:text-mine-text transition-colors"
        >
          <X className="w-2.5 h-2.5" />
        </button>
      )}
    </div>
  )
}

export { PanelSearchBar }
export type { PanelSearchBarProps }
```

**Step 9: Commit**

```bash
git add apps/web/src/components/shared/panel/
git commit -m "feat(panel): add content primitives (StatGrid, KV, Row, ChartBox, Empty, Badge, ActionButton, SearchBar)"
```

---

### Task 5: Index File + Build Verification

**Files:**
- Create: `apps/web/src/components/shared/panel/index.ts`

**Step 1: Create barrel export**

```ts
// apps/web/src/components/shared/panel/index.ts

// Container
export { PanelFrame } from './panel-frame'
export { PanelFrameHeader, FrameCloseButton } from './panel-frame-header'
export { PanelFrameBody } from './panel-frame-body'
export { PanelSection } from './panel-section'

// Content primitives
export { PanelStatGrid, PanelStatItem } from './panel-stat-grid'
export { PanelKV } from './panel-kv'
export { PanelRow, PanelActions } from './panel-row'
export { PanelChartBox } from './panel-chart-box'
export { PanelEmpty } from './panel-empty'
export { PanelText, panelTextVariants } from './panel-text'
export { PanelBadge, PanelBadgeTag } from './panel-badge'
export { PanelActionButton } from './panel-action-button'
export { PanelSearchBar } from './panel-search-bar'

// Typography
export { PANEL_TYPOGRAPHY, PANEL_SIZE, PANEL_ROLE_DEFAULT_SIZE } from './panel-typography'

// Types
export type { PanelFrameProps } from './panel-frame'
export type { PanelFrameHeaderProps } from './panel-frame-header'
export type { PanelFrameBodyProps } from './panel-frame-body'
export type { PanelSectionProps } from './panel-section'
export type { PanelStatGridProps, PanelStatItemProps, StatColor } from './panel-stat-grid'
export type { PanelKVProps } from './panel-kv'
export type { PanelRowProps, PanelActionsProps } from './panel-row'
export type { PanelChartBoxProps } from './panel-chart-box'
export type { PanelEmptyProps } from './panel-empty'
export type { PanelTextProps } from './panel-text'
export type { PanelBadgeProps, PanelBadgeTagProps } from './panel-badge'
export type { PanelActionButtonProps } from './panel-action-button'
export type { PanelSearchBarProps } from './panel-search-bar'
```

**Step 2: Verify build passes**

Run: `cd apps/web && NEXT_BUILD_DIR=.next-prod npx next build`
Expected: Build succeeds (new files are unused but should compile)

**Step 3: Commit**

```bash
git add apps/web/src/components/shared/panel/index.ts
git commit -m "feat(panel): add barrel export and verify build"
```

---

### Task 6: Integrate PanelFrame into PanelSlot (Replace ContentFrame)

**Files:**
- Modify: `apps/web/src/features/lab/components/shell/panel-slot.tsx`
- Modify: `apps/web/src/features/lab/components/shell/panel-content.tsx` — check if `getPanelHeaderRight` needs changes

**Context:** PanelSlot currently wraps panel content in `<ContentFrame>`. Replace with `<PanelFrame>` + `<PanelFrameHeader>` + `<PanelFrameBody>`. The PanelSlot keeps its animation/resize logic unchanged — only the inner container changes.

**Step 1: Update SideSlot in panel-slot.tsx**

Replace the `<ContentFrame>` usage in `SideSlot` with:

```tsx
import { PanelFrame, PanelFrameHeader, PanelFrameBody } from '@/components/shared/panel'

// In SideSlot, replace:
//   <ContentFrame title={def.label} onClose={onClose} headerRight={...} ...>
//     <PanelContent ... />
//   </ContentFrame>
// With:
<PanelFrame className="h-full">
  <PanelFrameHeader
    title={def.label}
    onClose={onClose}
    actions={getPanelHeaderRight(panelId, isConnected)}
  />
  <PanelFrameBody className="overflow-y-auto flex flex-col">
    <PanelContent panelId={panelId} isConnected={isConnected} />
  </PanelFrameBody>
</PanelFrame>
```

**Step 2: Update BottomSlot similarly**

Both terminal and non-terminal paths need updating. Terminal path:

```tsx
<PanelFrame className="h-full">
  <PanelFrameHeader title="Terminal" onClose={onClose} />
  <PanelFrameBody className="overflow-hidden flex flex-col">
    <Suspense>
      <LazyTerminal visible={isOpen && isTerminal} onClose={onClose ?? (() => {})} />
    </Suspense>
  </PanelFrameBody>
</PanelFrame>
```

Non-terminal path:

```tsx
<PanelFrame className="h-full">
  <PanelFrameHeader
    title={def.label}
    onClose={onClose}
    actions={getPanelHeaderRight(panelId!, isConnected)}
  />
  <PanelFrameBody className="overflow-y-auto flex flex-col">
    <PanelContent panelId={panelId!} isConnected={isConnected} />
  </PanelFrameBody>
</PanelFrame>
```

**Step 3: Update imports in other ContentFrame consumers**

Check `mine-app-chrome.tsx` and `lab-page.tsx` — if they use `ContentFrame` for the editor frame (not panel frames), those can keep using the old one for now or be updated to PanelFrame if the visual is identical.

The `shell/index.ts` re-exports `ContentFrame` — update or keep as alias depending on whether non-panel uses exist.

**Step 4: Verify the lab page renders correctly**

Run: `npx nx run web:serve --port=4200`
Open: `http://localhost:4200/lab`
Verify: Side panels open/close with same animation, header shows title + close button, content renders correctly.

**Step 5: Commit**

```bash
git add apps/web/src/features/lab/components/shell/
git commit -m "refactor(lab): replace ContentFrame with PanelFrame in PanelSlot"
```

---

### Task 7: Migrate Lab Panels to New Primitives + Remove V1/V2 Toggle

**Files:**
- Modify: `apps/web/src/features/lab/components/panels/variable-panel.tsx`
- Modify: `apps/web/src/features/lab/components/panels/error-panel.tsx`
- Modify: `apps/web/src/features/lab/components/panels/logs-panel.tsx`
- Modify: `apps/web/src/features/lab/components/editor/chrome/panels/outline-panel.tsx`
- Modify: `apps/web/src/features/lab/components/editor/chrome/panels/secrets-panel.tsx`
- Modify: `apps/web/src/features/lab/components/editor/chrome/panels/data-catalog/data-catalog-panel.tsx`
- Modify: `apps/web/src/features/lab/components/shell/panels/system-status-panel.tsx`

**Context:** Each panel currently imports from `../panel-primitives` and some use `usePanelV2`. Replace imports with `@/components/shared/panel`. Remove all V1/V2 toggle logic — keep only the V2 version (the new primitives version). Remove `PanelBar` usage since header is now in PanelFrameHeader (rendered by PanelSlot).

**Key change per panel:**
1. Replace `import { PanelBar, PanelBody, PanelSection, ... } from '../panel-primitives'` → `import { PanelSection, PanelRow, PanelText, ... } from '@/components/shared/panel'`
2. Remove `const [isV2, toggleV2] = usePanelV2('xxx')` and all V1 conditional rendering
3. Remove `<PanelBar>` — header is now handled by PanelSlot via PanelFrameHeader
4. Remove `<PanelBody>` — body scrolling is now handled by PanelFrameBody in PanelSlot
5. Keep `<PanelSection>`, `<PanelRow>`, `<PanelText>`, etc. but from new import path
6. Map old PanelText variants to new: `content`→`body`, `sub`→`hint`, `mono`→`value`, `tiny`→keep using size="sm"

**Step 1: Migrate each panel file**

For each file, the transformation is:
- Old: `<PanelBar title="X" v2={...} />` + `<PanelBody>` + `<PanelSection>` children
- New: Just the `<PanelSection>` children (PanelBar and PanelBody are handled by PanelSlot)

Example for variable-panel.tsx:
```tsx
// Before:
import { PanelBar, PanelBody, PanelSection, PanelRow, PanelText, usePanelV2 } from '../panel-primitives'

export function VariablePanel() {
  const [isV2, toggleV2] = usePanelV2('variable-panel')
  return isV2 ? <VariablePanelV2 /> : <VariablePanelV1 />
}

function VariablePanelV2() {
  return <>
    <PanelBar title="Variables" badge="5 definitions" v2={{...}} />
    <PanelBody>
      <PanelSection>...</PanelSection>
    </PanelBody>
  </>
}

// After:
import { PanelSection, PanelRow, PanelText } from '@/components/shared/panel'

export function VariablePanel() {
  return (
    <PanelSection>
      {/* rows */}
    </PanelSection>
  )
}
```

**Step 2: Verify each panel renders correctly in the lab page**

Run dev server, open each panel one by one, verify content displays correctly.

**Step 3: Commit**

```bash
git add apps/web/src/features/lab/
git commit -m "refactor(lab): migrate all panels to unified panel primitives, remove V1/V2 toggle"
```

---

### Task 8: Remove Old Panel Primitives + V2 Toggle

**Files:**
- Delete: `apps/web/src/features/lab/components/panel-primitives/panel-primitives.tsx`
- Delete: `apps/web/src/features/lab/components/panel-primitives/use-panel-v2.ts`
- Delete: `apps/web/src/features/lab/components/panel-primitives/index.ts`
- Modify: `apps/web/src/features/lab/components/shell/content-frame.tsx` — check if still used elsewhere; if not, delete
- Modify: `apps/web/src/features/lab/components/shell/index.ts` — remove ContentFrame re-export if deleted
- Modify: `apps/web/src/app/globals.css` — remove `--text-panel-header: 11px` (line 62)

**Step 1: Delete panel-primitives directory**

```bash
rm -rf apps/web/src/features/lab/components/panel-primitives/
```

**Step 2: Check if ContentFrame is still used**

Search for any remaining `ContentFrame` imports. If only used in panel-slot.tsx (which was already migrated in Task 6), delete it. If used elsewhere (e.g., editor frame in mine-app-chrome.tsx), keep it but note for future cleanup.

**Step 3: Remove `--text-panel-header` CSS variable from globals.css**

This was only used by the old ContentFrame header. The new PanelFrameHeader uses inline `text-[10px]` via PANEL_TYPOGRAPHY.

**Step 4: Verify build**

Run: `cd apps/web && NEXT_BUILD_DIR=.next-prod npx next build`
Expected: Build succeeds with no errors

**Step 5: Commit**

```bash
git add -A
git commit -m "chore(lab): remove old panel-primitives and V1/V2 toggle system"
```

---

### Task 9: Migrate Factor Detail Panel to New Primitives

**Files:**
- Modify: `apps/web/src/features/library/components/factor-detail/factor-detail-panel.tsx`
- Modify: All 8 section files in `factor-detail/`
- Modify: All 12 chart files in `factor-detail/charts/`

**Context:** Replace all `import { DetailSection, DetailStatGrid, DetailStatItem, DetailKV, DetailChartBox, DetailPanel, DetailHeader } from "@/components/shared/detail-panel"` with imports from `@/components/shared/panel`.

**Mapping:**
- `DetailPanel` → `PanelFrame` + `PanelFrameHeader` + `PanelFrameBody` (split into 3 components)
- `DetailSection` → `PanelSection` (same props: title, suffix, noBorder, className)
- `DetailHeader` → `PanelSection` with noBorder (or just a `<div>` with border-b)
- `DetailStatGrid` → `PanelStatGrid`
- `DetailStatItem` → `PanelStatItem`
- `DetailKV` → `PanelKV`
- `DetailChartBox` → `PanelChartBox`
- `DetailKPIRow` → keep inline or add to panel lib later

**Important:** The factor detail panel is currently rendered INSIDE the library page (not inside PanelSlot). So it needs its OWN PanelFrame wrapper, unlike lab panels which get their frame from PanelSlot.

**Step 1: Update factor-detail-panel.tsx**

```tsx
// Before:
import { DetailPanel } from "@/components/shared/detail-panel"
<DetailPanel title="因子详情" onClose={...}>
  <DetailHeader>...</DetailHeader>
  <DetailSection>...</DetailSection>
</DetailPanel>

// After:
import { PanelFrame, PanelFrameHeader, PanelFrameBody, PanelSection } from "@/components/shared/panel"
<PanelFrame className="h-full">
  <PanelFrameHeader title="因子详情" onClose={...} />
  <PanelFrameBody>
    <PanelSection noBorder>...</PanelSection>  {/* was DetailHeader */}
    <PanelSection title="核心指标">...</PanelSection>
  </PanelFrameBody>
</PanelFrame>
```

**Step 2: Update each section file**

Replace `DetailSection` → `PanelSection`, `DetailStatGrid` → `PanelStatGrid`, etc. Same props.

**Step 3: Update each chart file**

Most only use `DetailSection` + `DetailChartBox`. Direct replacement.

**Step 4: Verify factor detail panel renders correctly**

Open library page, click a factor, verify all sections/charts render.

**Step 5: Commit**

```bash
git add apps/web/src/features/library/
git commit -m "refactor(library): migrate factor detail panel to unified panel primitives"
```

---

### Task 10: Delete Old detail-panel Directory

**Files:**
- Delete: `apps/web/src/components/shared/detail-panel/` (entire directory, 9 files)

**Step 1: Verify no remaining imports**

Search for any `import.*detail-panel` in the codebase. Should be zero after Task 9.

**Step 2: Delete directory**

```bash
rm -rf apps/web/src/components/shared/detail-panel/
```

**Step 3: Verify build**

Run: `cd apps/web && NEXT_BUILD_DIR=.next-prod npx next build`
Expected: Build succeeds

**Step 4: Commit**

```bash
git add -A
git commit -m "chore: remove old detail-panel primitives (replaced by shared/panel)"
```

---

### Task 11: Add USAGE.md + Update CLAUDE.md

**Files:**
- Create: `apps/web/src/components/shared/panel/USAGE.md`
- Modify: Root `CLAUDE.md` — add panel system reference

**Step 1: Write USAGE.md**

This file lives next to the component code. AI assistants will read it when working on panels.

```markdown
# Panel System — Usage Guide

## Mandatory Rules

1. **ALL panels** (sidebar, detail, bottom) MUST use PanelFrame + PanelFrameHeader + PanelFrameBody
2. **ALL content sections** MUST be wrapped in PanelSection — never hand-write `border-b` dividers
3. **ALL text** inside panels MUST use PanelText or a panel primitive — never hardcode font sizes
4. **ALL numeric values** MUST use `<PanelText variant="value">` or PanelStatItem/PanelKV
5. **ALL section titles** come from PanelSection's `title` prop — never write label typography manually

## Decision Tree

Need to display data in a panel? Follow this:

1. Multiple KPI numbers in a grid? → `PanelStatGrid` + `PanelStatItem`
2. Key-value pairs (label: value)? → `PanelKV`
3. Clickable list items? → `PanelRow` (+ `PanelActions` for hover buttons)
4. A chart/visualization? → `PanelChartBox`
5. No data yet? → `PanelEmpty`
6. Inline count/status? → `PanelBadge` or `PanelBadgeTag`
7. Free-form text? → `PanelText` with appropriate variant

## Typography — Use the 4 Semantic Roles

| Role | When | Example |
|------|------|---------|
| `label` | Annotating what something IS | Section titles, stat labels, KV labels |
| `body` | Primary readable content | Descriptions, explanations |
| `value` | Data that changes | Numbers, variable names, code |
| `hint` | Secondary context | Timestamps, parameter descriptions, suffixes |

Never hardcode: `text-[10px] font-medium text-mine-muted uppercase tracking-wider`
Instead use: `<PanelText variant="label">` or reference `PANEL_TYPOGRAPHY.label`

## Anti-Patterns (BANNED)

```tsx
// ❌ Hand-written section divider
<div className="border-b border-mine-border/50">

// ✅ Use PanelSection (border-b built in)
<PanelSection title="Statistics">

// ❌ Hardcoded font spec
<span className="text-[10px] text-mine-muted uppercase tracking-wider font-medium">

// ✅ Use PanelText or let PanelSection handle it
<PanelText variant="label">

// ❌ Hand-written stat display
<div className="text-sm font-bold font-mono tabular-nums">+0.022</div>

// ✅ Use PanelStatItem or PanelText variant="value"
<PanelStatItem label="IC" value="+0.022" color="down" />

// ❌ Hand-written KV pair
<div className="flex justify-between">
  <span className="text-[10px] text-mine-muted">Label</span>
  <span className="text-[11px] font-mono">Value</span>
</div>

// ✅ Use PanelKV
<PanelKV label="Label" value="Value" />
```
```

**Step 2: Update CLAUDE.md**

Add a reference in the "Key Rules" or "Components" section pointing to the panel system.

**Step 3: Commit**

```bash
git add -f apps/web/src/components/shared/panel/USAGE.md CLAUDE.md
git commit -m "docs: add panel system USAGE.md and update CLAUDE.md references"
```

---

## Summary

| Task | What | Files | Depends On |
|------|------|-------|------------|
| 1 | Typography + PanelText | 2 new | — |
| 2 | PanelFrame + Header + Body | 3 new | 1 |
| 3 | PanelSection (collapsible) | 1 new | 1 |
| 4 | Content primitives (8 files) | 8 new | 1 |
| 5 | Index + build verify | 1 new | 1-4 |
| 6 | Replace ContentFrame in PanelSlot | 1-2 modify | 5 |
| 7 | Migrate lab panels + remove V2 | 7 modify | 6 |
| 8 | Delete old panel-primitives | 3 delete | 7 |
| 9 | Migrate factor detail | ~20 modify | 5 |
| 10 | Delete old detail-panel | 9 delete | 9 |
| 11 | USAGE.md + CLAUDE.md | 2 new | 10 |

Tasks 6-8 (lab migration) and 9-10 (library migration) are independent and can run in parallel after Task 5.
