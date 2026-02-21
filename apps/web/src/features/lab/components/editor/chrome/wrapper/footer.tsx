/* Copyright 2026 Marimo. All rights reserved. */

import { useAtomValue } from 'jotai';
import {
  AlertTriangleIcon,
  KeyboardIcon,
  PlayCircleIcon,
  SquareIcon,
  XCircleIcon,
} from 'lucide-react';
import type React from 'react';
import { renderShortcut } from '../../../shortcuts/renderShortcut';
import { Tooltip } from '../../../ui/tooltip';
import { cellErrorCount } from '../../../../core/cells/cells';
import { isConnectingAtom } from '../../../../core/network/connection';
import { useRequestClient } from '../../../../core/network/requests';
import { useHotkey } from '../../../../hooks/useHotkey';
import { useLabModeStore } from '../../../../store/use-lab-mode-store';
import { ShowInKioskMode } from '../../kiosk-mode';
import { useRunAllCells } from '../../cell/useRunCells';
import { panelLayoutAtom, useChromeActions, useChromeState } from '../state';
import { FooterItem } from './footer-item';
import { AIStatusIcon } from './footer-items/ai-status';
import {
  BackendConnectionStatus,
  connectionStatusAtom,
} from './footer-items/backend-status';
import { CopilotStatusIcon } from './footer-items/copilot-status';
import { MachineStats } from './footer-items/machine-stats';
import { RTCStatus } from './footer-items/rtc-status';
import { RuntimeSettings } from './footer-items/runtime-settings';

export const Footer: React.FC = () => {
  const { isDeveloperPanelOpen } = useChromeState();
  const { toggleDeveloperPanel } = useChromeActions();
  const labMode = useLabModeStore((s) => s.mode);
  const isLabActive = labMode === 'active';

  const errorCount = useAtomValue(cellErrorCount);
  const connectionStatus = useAtomValue(connectionStatusAtom);
  const panelLayout = useAtomValue(panelLayoutAtom);

  // Show issue count: cell errors + connection issues
  // Don't include error count if errors panel is in sidebar (it shows there instead)
  const errorsInSidebar = panelLayout.sidebar.includes('errors');
  const hasConnectionIssue =
    connectionStatus === 'unhealthy' || connectionStatus === 'disconnected';
  const issueCount =
    (errorsInSidebar ? 0 : errorCount) + (hasConnectionIssue ? 1 : 0);

  // TODO: Add warning count from diagnostics/linting
  const warningCount = 0;

  useHotkey('global.togglePanel', () => {
    toggleDeveloperPanel();
  });

  const runAllCells = useRunAllCells();
  const { sendInterrupt } = useRequestClient();

  // ── Lab mode dock layout ──
  if (isLabActive) {
    return (
      <footer
        data-slot="lab-status-dock"
        className="h-10 py-1 gap-1 flex items-center text-mine-muted select-none print:hidden text-sm z-50 bg-white/40 backdrop-blur-2xl border border-white/60 shadow-[0_8px_32px_rgba(0,0,0,0.08)] rounded-full pointer-events-auto px-1"
      >
        {/* Kernel status */}
        <BackendConnectionStatus />

        {/* Error/warning count */}
        <FooterItem
          className="h-full"
          tooltip={
            <span className="flex items-center gap-2">
              Toggle developer panel{' '}
              {renderShortcut('global.togglePanel', false)}
            </span>
          }
          selected={isDeveloperPanelOpen}
          onClick={() => toggleDeveloperPanel()}
          data-testid="footer-panel"
        >
          <div className="flex items-center gap-1 h-full">
            <XCircleIcon
              className={`w-3.5 h-3.5 ${issueCount > 0 ? 'text-destructive' : ''}`}
            />
            <span className="tabular-nums font-mono">{issueCount}</span>
            <AlertTriangleIcon
              className={`w-3.5 h-3.5 ml-0.5 ${warningCount > 0 ? 'text-yellow-500' : ''}`}
            />
            <span className="tabular-nums font-mono">{warningCount}</span>
          </div>
        </FooterItem>

        {/* Divider */}
        <div className="w-px h-4 bg-mine-border/50" />

        {/* Run All */}
        <Tooltip content="Run all cells ⇧⌘↵">
          <button
            type="button"
            aria-label="Run all cells"
            className="flex items-center justify-center h-7 px-2 rounded-full hover:bg-white/60 transition-colors"
            onClick={runAllCells}
          >
            <PlayCircleIcon className="w-3.5 h-3.5" />
          </button>
        </Tooltip>

        {/* Stop */}
        <Tooltip content="Interrupt execution">
          <button
            type="button"
            aria-label="Interrupt execution"
            className="flex items-center justify-center h-7 px-2 rounded-full hover:bg-white/60 transition-colors"
            onClick={() => sendInterrupt()}
          >
            <SquareIcon className="w-3.5 h-3.5" />
          </button>
        </Tooltip>

        {/* Divider */}
        <div className="w-px h-4 bg-mine-border/50" />

        {/* Keyboard shortcuts */}
        <Tooltip content="Keyboard shortcuts ⌘K">
          <button
            type="button"
            aria-label="Keyboard shortcuts"
            className="flex items-center justify-center h-7 px-2 rounded-full hover:bg-white/60 transition-colors"
          >
            <KeyboardIcon className="w-3.5 h-3.5" />
          </button>
        </Tooltip>
      </footer>
    );
  }

  // ── Normal mode footer ──
  return (
    <footer
      data-slot="lab-footer"
      className="h-10 py-1 gap-1 bg-background flex items-center text-muted-foreground text-md pl-2 pr-1 border-t border-border select-none print:hidden text-sm z-50 hide-on-fullscreen overflow-x-auto overflow-y-hidden scrollbar-thin"
    >
      <FooterItem
        className="h-full"
        tooltip={
          <span className="flex items-center gap-2">
            Toggle developer panel {renderShortcut('global.togglePanel', false)}
          </span>
        }
        selected={isDeveloperPanelOpen}
        onClick={() => toggleDeveloperPanel()}
        data-testid="footer-panel"
      >
        <div className="flex items-center gap-1 h-full">
          <XCircleIcon
            className={`w-4 h-4 ${issueCount > 0 ? 'text-destructive' : ''}`}
          />
          <span>{issueCount}</span>
          <AlertTriangleIcon
            className={`w-4 h-4 ml-1 ${warningCount > 0 ? 'text-yellow-500' : ''}`}
          />
          <span>{warningCount}</span>
        </div>
      </FooterItem>

      <RuntimeSettings />

      <div className="mx-auto" />

      <ConnectingKernelIndicatorItem />

      <ShowInKioskMode>
        <Tooltip
          content={
            <div className="w-[200px]">
              Kiosk mode is enabled. This allows you to view the outputs of the
              cells without the ability to edit them.
            </div>
          }
        >
          <span className="text-muted-foreground text-sm mr-4">kiosk mode</span>
        </Tooltip>
      </ShowInKioskMode>

      <div className="flex items-center shrink-0 min-w-0">
        <MachineStats />
        <AIStatusIcon />
        <CopilotStatusIcon />
        <RTCStatus />
      </div>
    </footer>
  );
};

/**
 * Only show the backend connection status if we are connecting to a kernel
 */
const ConnectingKernelIndicatorItem: React.FC = () => {
  const isConnecting = useAtomValue(isConnectingAtom);
  if (!isConnecting) {
    return null;
  }
  return <BackendConnectionStatus />;
};
