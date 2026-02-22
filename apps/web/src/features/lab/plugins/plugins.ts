/* Copyright 2026 Marimo. All rights reserved. */
/**
 * Plugin initialization — registers marimo web component plugins.
 *
 * Must be called BEFORE any cell output HTML containing custom elements
 * (e.g. <marimo-table>, <marimo-multiselect>) is rendered into the DOM.
 *
 * Original marimo registered 31 UI + 13 layout plugins here.
 * VT only retains the plugins whose implementations are still in the codebase.
 */

import { initializeUIElement } from '../core/dom/ui-element';
import { registerReactComponent } from './core/registerReactComponent';
import { DataTablePlugin } from './impl/DataTablePlugin';
import { MultiselectPlugin } from './impl/MultiselectPlugin';

let initialized = false;

export function initializePlugins(): void {
  if (initialized) return;
  initialized = true;

  // Register the <marimo-ui-element> wrapper (value sync between UI and kernel)
  initializeUIElement();

  // Register stateful UI plugins (custom elements with React shadow DOM)
  registerReactComponent(DataTablePlugin);
  registerReactComponent(new MultiselectPlugin());
}
