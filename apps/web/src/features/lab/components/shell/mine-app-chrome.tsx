'use client';

import type { PropsWithChildren } from 'react';
import { LabModeContext } from '../lab-mode-context';
import { MineFileTree } from './mine-file-tree';
import { MineTabBar } from './mine-tab-bar';

// ─── Mine App Chrome ─────────────────────────────────────
//
// Replaces marimo's AppChrome with our Mine visual frame.
// Wraps EditApp (children) with the same file tree + tabs
// as the disconnected static view — "CSS artwork comes alive".
//
// EditApp handles ALL kernel communication internally.
// This component is purely visual layout.

function MineAppChrome({ children }: PropsWithChildren) {
  return (
    <LabModeContext.Provider value={{ isLabMode: true, onExit: null }}>
      <div
        data-slot="mine-app-chrome"
        className="flex-1 flex overflow-hidden h-full"
      >
        {/* Column 1: File tree */}
        <MineFileTree />

        {/* Column 2: Editor (tabs + marimo cells) */}
        <div className="flex-1 min-w-0 flex flex-col ml-2 gap-2 overflow-hidden">
          <MineTabBar />

          {/* Marimo EditApp renders here — real cells from kernel */}
          {/* data-slot="lab-fullscreen" scopes cell.css lab-mode styles:
              dashed separators, focus-based controls, shine borders,
              gutter run button, cell type indicator, progressive blur */}
          <div
            data-slot="lab-fullscreen"
            className="relative flex-1 min-h-0 overflow-y-auto rounded-lg"
          >
            {children}
            {/* Progressive blur — fades editor bottom into dock area */}
            <div data-slot="editor-progressive-blur" />
          </div>
        </div>
      </div>
    </LabModeContext.Provider>
  );
}

export { MineAppChrome };
