import type { LucideIcon } from 'lucide-react';
import {
  // Left
  FolderOpen,
  Network,
  List,
  // Right — Mine custom
  Variable,
  Box,
  Bot,
  FlaskConical,
  // Right — Marimo data
  Package,
  Database,
  DatabaseZap,
  AlertCircle,
  KeyRound,
  // Bottom
  TerminalSquare,
  ScrollText,
} from 'lucide-react';

// ─── Panel Definitions ───────────────────────────────────
//
// Single config array driving all three panel slots.
// Each panel belongs to a side (left/right/bottom) and
// is toggled via `togglePanel(id)` in the store.

type PanelDef = {
  id: string;
  icon: LucideIcon;
  label: string;
  side: 'left' | 'right' | 'bottom';
  /** Width in px (left/right) or CSS value (bottom height) */
  size: number | string;
  /** Minimum width in px for side panels (defaults to global MIN_SIDE_WIDTH) */
  minSize?: number;
  /** Button group separator — renders a gap before this item */
  group?: string;
  /** Disabled when not connected to kernel */
  connectedOnly?: boolean;
};

const PANELS: PanelDef[] = [
  // ── Left ──
  { id: 'files', icon: FolderOpen, label: 'Files', side: 'left', size: 280 },
  {
    id: 'dependencies',
    icon: Network,
    label: 'Dependencies',
    side: 'left',
    size: 280,
    connectedOnly: true,
  },
  {
    id: 'outline',
    icon: List,
    label: 'Outline',
    side: 'left',
    size: 280,
    connectedOnly: true,
  },

  // ── Right — Mine custom panels ──
  {
    id: 'components',
    icon: Box,
    label: 'Components',
    side: 'right',
    size: 320,
    group: 'mine',
  },
  { id: 'ai', icon: Bot, label: 'AI Assistant', side: 'right', size: 360 },
  {
    id: 'experiments',
    icon: FlaskConical,
    label: 'Experiments',
    side: 'right',
    size: 340,
  },

  // ── Right — Marimo data panels ──
  {
    id: 'variables',
    icon: Variable,
    label: 'Variables',
    side: 'right',
    size: 320,
    group: 'data',
    connectedOnly: true,
  },
  {
    id: 'datasources',
    icon: DatabaseZap,
    label: 'Data Sources',
    side: 'right',
    size: 400,
    connectedOnly: true,
  },
  {
    id: 'packages',
    icon: Package,
    label: 'Packages',
    side: 'right',
    size: 500,
    minSize: 500,
  },
  {
    id: 'data-catalog',
    icon: Database,
    label: 'Data Catalog',
    side: 'right',
    size: 320,
  },

  // ── Right — Marimo developer panels ──
  {
    id: 'errors',
    icon: AlertCircle,
    label: 'Errors',
    side: 'right',
    size: 300,
    group: 'dev',
  },
  {
    id: 'validation',
    icon: FlaskConical,
    label: 'Validation',
    side: 'right',
    size: 340,
  },
  {
    id: 'secrets',
    icon: KeyRound,
    label: 'Secrets',
    side: 'right',
    size: 320,
    connectedOnly: true,
  },

  // ── Bottom ──
  {
    id: 'terminal',
    icon: TerminalSquare,
    label: 'Terminal',
    side: 'bottom',
    size: '30%',
    connectedOnly: true,
  },
  {
    id: 'logs',
    icon: ScrollText,
    label: 'Logs',
    side: 'bottom',
    size: '30%',
    connectedOnly: true,
  },
];

/** Mutex groups: opening one panel auto-closes others in the same group.
 *  files ↔ terminal/logs: bottom panels collapse the file tree. */
const MUTEX_GROUPS: string[][] = [
  ['files', 'dependencies', 'outline', 'terminal', 'logs'],
];

// ─── Tactile Button Styles ───────────────────────────────

const BUTTON_SHADOW =
  '0px 1px 1px 0.5px rgba(51,51,51,0.04), 0px 3px 3px -1.5px rgba(51,51,51,0.02), 0px 6px 6px -3px rgba(51,51,51,0.04), 0px 12px 12px -6px rgba(51,51,51,0.04), 0px 0px 0px 1px rgba(51,51,51,0.1)';

const BUTTON_INSET = 'inset 0px -1px 1px -0.5px rgba(51,51,51,0.06)';

// ─── Helpers ─────────────────────────────────────────────

function getPanelDef(id: string): PanelDef | undefined {
  return PANELS.find((p) => p.id === id);
}

function getPanelsBySlot(side: PanelDef['side']): PanelDef[] {
  return PANELS.filter((p) => p.side === side);
}

export {
  PANELS,
  MUTEX_GROUPS,
  BUTTON_SHADOW,
  BUTTON_INSET,
  getPanelDef,
  getPanelsBySlot,
  type PanelDef,
};
