/* Copyright 2026 Marimo. All rights reserved. */

import { useAtomValue } from 'jotai';
import { AlertTriangleIcon, PlusIcon, XCircleIcon } from 'lucide-react';
import type React from 'react';
import { renderShortcut } from '../../../shortcuts/renderShortcut';
import { Tooltip } from '../../../ui/tooltip';
import { cellErrorCount } from '../../../../core/cells/cells';
import { isConnectingAtom } from '../../../../core/network/connection';
import { useHotkey } from '../../../../hooks/useHotkey';
import { useLabModeStore } from '../../../../store/use-lab-mode-store';
import { ShowInKioskMode } from '../../kiosk-mode';
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
import { useFilename } from '../../../../core/saving/filename';

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

  // ── Lab mode dock layout ──
  if (isLabActive) {
    return (
      <footer
        data-slot="lab-status-dock"
        className="h-10 py-1 gap-1 flex items-center text-mine-muted select-none print:hidden text-sm z-50 bg-white/40 backdrop-blur-2xl border border-white/60 shadow-[0_8px_32px_rgba(0,0,0,0.08)] rounded-full pointer-events-auto px-1"
      >
        {/* Left: file tabs */}
        <DockFileTabs />

        {/* Spacer */}
        <div className="flex-1 min-w-0" />

        {/* Right: status indicators */}
        <div
          data-slot="dock-status"
          className="flex items-center shrink-0 gap-0.5"
        >
          <BackendConnectionStatus />
          <MachineStats />
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
          <RuntimeSettings />
          <AIStatusIcon />
          <CopilotStatusIcon />
          <RTCStatus />
        </div>
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

/**
 * Dock file tabs — shows current filename as a pill, + button for new file.
 */
const DockFileTabs: React.FC = () => {
  const filename = useFilename();
  const displayName = filename
    ? filename.split('/').pop()?.replace(/\.py$/, '') || filename
    : 'untitled';

  return (
    <div
      data-slot="dock-file-tabs"
      className="flex items-center gap-1 min-w-0 overflow-x-auto scrollbar-none"
    >
      <Tooltip content="New file">
        <button
          type="button"
          aria-label="New file"
          className="flex items-center justify-center w-7 h-7 rounded-full hover:bg-white/60 transition-colors shrink-0"
        >
          <PlusIcon className="w-3.5 h-3.5 text-mine-muted" strokeWidth={1.5} />
        </button>
      </Tooltip>
      <button
        type="button"
        className="flex items-center gap-1.5 h-7 px-3 rounded-full bg-mine-nav-active text-white text-xs font-medium whitespace-nowrap shrink-0"
        title={filename || 'untitled'}
      >
        <span className="max-w-[200px] truncate">{displayName}</span>
      </button>
    </div>
  );
};
