/* Copyright 2026 Marimo. All rights reserved. */

import { atomWithStorage } from 'jotai/utils';
import { jotaiJsonStorage } from '@/features/lab/utils/storage/jotai';
import type { PanelType } from './types';
import { PANELS } from './types';

/**
 * Layout configuration for panels in sidebar and developer panel.
 * Each array contains the ordered list of visible panel IDs for that section.
 */
export interface PanelLayout {
  sidebar: PanelType[];
  developerPanel: PanelType[];
}

const DEFAULT_PANEL_LAYOUT: PanelLayout = {
  sidebar: PANELS.filter(
    (p) => !p.hidden && p.defaultSection === 'sidebar',
  ).map((p) => p.type),
  developerPanel: PANELS.filter(
    (p) => !p.hidden && p.defaultSection === 'developer-panel',
  ).map((p) => p.type),
};

export const panelLayoutAtom = atomWithStorage<PanelLayout>(
  'marimo:panel-layout',
  DEFAULT_PANEL_LAYOUT,
  jotaiJsonStorage,
  { getOnInit: true },
);
