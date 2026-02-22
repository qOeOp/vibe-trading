/* Copyright 2026 Marimo. All rights reserved. */

import {
  BotIcon,
  BoxIcon,
  FlaskConicalIcon,
  FolderTreeIcon,
  type LucideIcon,
  SquareDashedBottomCodeIcon,
  VariableIcon,
  XCircleIcon,
} from 'lucide-react';
import type { Capabilities } from '@/features/lab/core/kernel/messages';

/**
 * Unified panel ID for all panels in sidebar and developer panel
 */
export type PanelType =
  | 'files'
  | 'variables'
  | 'packages'
  | 'ai'
  | 'snippets'
  | 'errors'
  | 'validation'
  | 'terminal'
  | 'documentation';

export type PanelSection = 'sidebar' | 'developer-panel';

export interface PanelDescriptor {
  type: PanelType;
  Icon: LucideIcon;
  /** Short label for developer panel tabs */
  label: string;
  /** Descriptive tooltip for sidebar icons */
  tooltip: string;
  /** If true, the panel is completely unavailable */
  hidden?: boolean;
  /** Which section this panel belongs to by default */
  defaultSection: PanelSection;
  /** Capability required for this panel to be visible. If the capability is false, the panel is hidden. */
  requiredCapability?: keyof Capabilities;
}

/**
 * All panels in the application.
 * Panels can be in either sidebar or developer panel, configurable by user.
 */
export const PANELS: PanelDescriptor[] = [
  {
    type: 'files',
    Icon: FolderTreeIcon,
    label: 'Files',
    tooltip: 'View files',
    defaultSection: 'sidebar',
  },
  {
    type: 'variables',
    Icon: VariableIcon,
    label: 'Variables',
    tooltip: 'Explore variables and data sources',
    defaultSection: 'sidebar',
  },
  {
    type: 'packages',
    Icon: BoxIcon,
    label: 'Packages',
    tooltip: 'Manage packages',
    defaultSection: 'sidebar',
  },
  {
    type: 'ai',
    Icon: BotIcon,
    label: 'AI',
    tooltip: 'Chat & Agents',
    defaultSection: 'sidebar',
  },
  {
    type: 'snippets',
    Icon: SquareDashedBottomCodeIcon,
    label: 'Data Catalog',
    tooltip: 'Data Catalog',
    defaultSection: 'sidebar',
  },
  {
    type: 'errors',
    Icon: XCircleIcon,
    label: 'Errors',
    tooltip: 'View errors',
    defaultSection: 'developer-panel',
  },
  {
    type: 'validation',
    Icon: FlaskConicalIcon,
    label: 'Validation',
    tooltip: '因子验证',
    defaultSection: 'sidebar',
  },
];

export const PANEL_MAP = new Map<PanelType, PanelDescriptor>(
  PANELS.map((p) => [p.type, p]),
);

/**
 * Check if a panel should be hidden based on its `hidden` property
 * and `requiredCapability`.
 */
export function isPanelHidden(
  panel: PanelDescriptor,
  capabilities: Capabilities,
): boolean {
  if (panel.hidden) {
    return true;
  }
  if (panel.requiredCapability && !capabilities[panel.requiredCapability]) {
    return true;
  }
  return false;
}
