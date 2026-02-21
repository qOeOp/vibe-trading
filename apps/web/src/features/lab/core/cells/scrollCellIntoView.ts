/* Copyright 2026 Marimo. All rights reserved. */
/* Stub: VT lab migration — scroll cell into view utilities */

import type { RefObject } from 'react';
import type { CellId } from './ids';
import { HTMLCellId } from './ids';

export function focusAndScrollCellIntoView({
  cellId,
}: {
  cellId: CellId;
  cell?: RefObject<any>;
  isCodeHidden?: boolean;
  codeFocus?: 'top' | 'bottom' | undefined;
  variableName?: string | undefined;
}) {
  const element = document.getElementById(HTMLCellId.create(cellId));
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
}

export function focusAndScrollCellOutputIntoView(cellId: CellId) {
  const element = document.getElementById(HTMLCellId.create(cellId));
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
}

export function scrollToBottom() {
  const app = document.getElementById('App');
  app?.scrollTo({ top: app.scrollHeight, behavior: 'smooth' });
}

export function scrollToTop() {
  const app = document.getElementById('App');
  app?.scrollTo({ top: 0, behavior: 'smooth' });
}

export function scrollCellIntoView(cellId: CellId): void {
  const element = document.getElementById(HTMLCellId.create(cellId));
  if (element) {
    element.scrollIntoView({ behavior: 'instant', block: 'nearest' });
  }
}
