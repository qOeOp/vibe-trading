/**
 * scrollCellIntoView — Cell scroll and focus utilities
 * Forked from Marimo: core/cells/scrollCellIntoView.ts
 *
 * Modifications:
 * 1. Removed variable navigation (goToVariableDefinition)
 * 2. Removed retryWithTimeout for editor focus
 * 3. Removed HTMLCellId utility → direct template string
 * 4. Simplified to 3 functions: scroll, focus+scroll, focus-outline
 */

import type { EditorView } from '@codemirror/view';

/**
 * Scroll a cell into view without focusing it.
 */
export function scrollCellIntoView(cellId: string): void {
  const el = document.getElementById(`cell-${cellId}`);
  if (!el) return;
  el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

/**
 * Focus a cell and scroll it into view.
 * If an EditorView is provided, focuses the editor instead of the cell container.
 */
export function focusAndScrollCellIntoView(
  cellId: string,
  editor?: EditorView | null,
): void {
  const el = document.getElementById(`cell-${cellId}`);
  if (!el) return;
  el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  if (editor) {
    editor.focus();
  } else {
    el.focus();
  }
}

/**
 * Temporarily add a focus-outline class to highlight a cell.
 * Uses the `.focus-outline` CSS class defined in cell.css.
 */
export function addFocusOutline(cellId: string, durationMs = 2000): void {
  const el = document.getElementById(`cell-${cellId}`);
  if (!el) return;
  const cell = el.closest('.marimo-cell');
  if (!cell) return;
  cell.classList.add('focus-outline');
  setTimeout(() => cell.classList.remove('focus-outline'), durationMs);
}

/**
 * Scroll to the top of the notebook container.
 */
export function scrollToTop(): void {
  const app = document.getElementById('lab-notebook');
  if (app) {
    app.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

/**
 * Scroll to the bottom of the notebook container.
 */
export function scrollToBottom(): void {
  const app = document.getElementById('lab-notebook');
  if (app) {
    app.scrollTo({ top: app.scrollHeight, behavior: 'smooth' });
  }
}
