'use client';

import type { PropsWithChildren } from 'react';
import { LabFullscreenContext } from '../lab-fullscreen-context';
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
    <LabFullscreenContext.Provider value={{ isFullscreen: true, onExit: null }}>
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
          <div className="flex-1 min-h-0 overflow-y-auto rounded-lg">
            {children}
          </div>
        </div>
      </div>
    </LabFullscreenContext.Provider>
  );
}

export { MineAppChrome };
