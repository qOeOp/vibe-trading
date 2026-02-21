/* Copyright 2026 Marimo. All rights reserved. */

import { useAtomValue } from 'jotai';
import {
  EditIcon,
  LayoutTemplateIcon,
  PlayIcon,
  SquareIcon,
  Undo2Icon,
  XIcon,
} from 'lucide-react';
import type { JSX } from 'react';
import { KeyboardShortcuts } from './keyboard-shortcuts';
import { NotebookMenuDropdown } from './notebook-menu-dropdown';
import { ShutdownButton } from './shutdown-button';
import { Button } from '../inputs/Inputs';
import { FindReplace } from '../../find-replace/find-replace';
import type { AppConfig } from '../../../core/config/config-schema';
import { canInteractWithAppAtom } from '../../../core/network/connection';
import { SaveComponent } from '../../../core/saving/save-component';
import {
  getConnectionTooltip,
  isAppInteractionDisabled,
} from '../../../core/websocket/connection-utils';
import { WebSocketState } from '../../../core/websocket/types';
import { cn } from '../../../utils/cn';
import { Functions } from '../../../utils/functions';
import {
  canUndoDeletesAtom,
  needsRunAtom,
  useCellActions,
} from '../../../core/cells/cells';
import { ConfigButton } from '../../app-config/app-config-button';
import { renderShortcut } from '../../shortcuts/renderShortcut';
import { Tooltip } from '../../ui/tooltip';
import { useShouldShowInterrupt } from '../cell/useShouldShowInterrupt';
import { HideInKioskMode } from '../kiosk-mode';
import { LayoutSelect } from '../renderers/layout-select';
import { CommandPaletteButton } from './command-palette-button';
import { useLabMode } from '../../lab-mode-context';
import { LogOutIcon } from 'lucide-react';
import { useLabModeStore } from '../../../store/use-lab-mode-store';

interface ControlsProps {
  presenting: boolean;
  onTogglePresenting: () => void;
  onInterrupt: () => void;
  onRun: () => void;
  connectionState: WebSocketState;
  running: boolean;
  appConfig: AppConfig;
}

export const Controls = ({
  presenting,
  onTogglePresenting,
  onInterrupt,
  onRun,
  connectionState,
  running,
}: ControlsProps): JSX.Element => {
  const { isLabMode, onExit } = useLabMode();
  const labMode = useLabModeStore((s) => s.mode);
  const hideTopRight = labMode === 'active';
  const undoAvailable = useAtomValue(canUndoDeletesAtom);
  const needsRun = useAtomValue(needsRunAtom);
  const { undoDeleteCell } = useCellActions();
  const closed = connectionState === WebSocketState.CLOSED;

  let undoControl: JSX.Element | null = null;
  if (!closed && undoAvailable) {
    undoControl = (
      <Tooltip content="Undo cell deletion">
        <Button
          data-testid="undo-delete-cell"
          size="medium"
          color="hint-green"
          shape="circle"
          onClick={undoDeleteCell}
        >
          <Undo2Icon size={16} strokeWidth={1.5} />
        </Button>
      </Tooltip>
    );
  }

  const disabled = isAppInteractionDisabled(connectionState);
  const connectionTooltip = disabled
    ? getConnectionTooltip(connectionState)
    : undefined;
  return (
    <>
      {!presenting && <FindReplace />}

      {/* Top-right controls: hidden in lab active mode (moved to main topbar) */}
      {!hideTopRight && (
        <div className={topRightControls}>
          {presenting && !closed && <LayoutSelect />}
          <NotebookMenuDropdown
            disabled={disabled}
            tooltip={connectionTooltip}
          />
          <ConfigButton disabled={disabled} tooltip={connectionTooltip} />
          <ShutdownButton
            description="This will terminate the Python kernel. You'll lose all data that's in memory."
            disabled={disabled}
            tooltip={connectionTooltip}
          />
          {isLabMode && onExit && (
            <Tooltip content="Exit Lab">
              <Button
                aria-label="Exit Lab"
                data-testid="exit-lab-button"
                shape="circle"
                size="small"
                color="hint-green"
                className="h-[27px] w-[27px]"
                onClick={onExit}
              >
                <LogOutIcon size={14} strokeWidth={1.5} />
              </Button>
            </Tooltip>
          )}
        </div>
      )}

      {/* Bottom-right controls: hidden in lab active mode (shell provides its own chrome) */}
      {!hideTopRight && (
        <div className={cn(bottomRightControls)}>
          <HideInKioskMode>
            <SaveComponent kioskMode={false} />
          </HideInKioskMode>

          <Tooltip content={renderShortcut('global.hideCode')}>
            <Button
              data-testid="hide-code-button"
              id="preview-button"
              shape="rectangle"
              color="hint-green"
              onClick={onTogglePresenting}
            >
              {presenting ? (
                <EditIcon strokeWidth={1.5} size={18} />
              ) : (
                <LayoutTemplateIcon strokeWidth={1.5} size={18} />
              )}
            </Button>
          </Tooltip>

          <CommandPaletteButton />
          <KeyboardShortcuts />

          <div />

          <HideInKioskMode>
            <div className="flex flex-col gap-2 items-center">
              {undoControl}
              <StopControlButton
                running={closed ? false : running}
                onInterrupt={onInterrupt}
              />
              <RunControlButton
                needsRun={closed ? false : needsRun}
                onRun={onRun}
              />
            </div>
          </HideInKioskMode>
        </div>
      )}
    </>
  );
};

const RunControlButton = ({
  needsRun,
  onRun,
}: {
  needsRun: boolean;
  onRun: () => void;
}) => {
  const canInteractWithApp = useAtomValue(canInteractWithAppAtom);

  if (needsRun) {
    return (
      <Tooltip content={renderShortcut('global.runStale')}>
        <Button
          data-testid="run-button"
          size="medium"
          color="yellow"
          shape="circle"
          onClick={onRun}
          disabled={!canInteractWithApp}
        >
          <PlayIcon strokeWidth={1.5} size={16} />
        </Button>
      </Tooltip>
    );
  }

  return (
    <Tooltip content="Nothing to run">
      <Button
        data-testid="run-button"
        className={'inactive-button'}
        color="disabled"
        size="medium"
        shape="circle"
        disabled={!canInteractWithApp}
      >
        <PlayIcon strokeWidth={1.5} size={16} />
      </Button>
    </Tooltip>
  );
};

const StopControlButton = ({
  running,
  onInterrupt,
}: {
  running: boolean;
  onInterrupt: () => void;
}) => {
  // Show the interrupt button after 200ms to avoid flickering.
  const showInterrupt = useShouldShowInterrupt(running);

  return (
    <Tooltip content={renderShortcut('global.interrupt')}>
      <Button
        className={cn(
          !showInterrupt && 'inactive-button active:shadow-xs-solid',
        )}
        data-testid="interrupt-button"
        size="medium"
        color={showInterrupt ? 'yellow' : 'disabled'}
        shape="circle"
        onClick={showInterrupt ? onInterrupt : Functions.NOOP}
      >
        <SquareIcon strokeWidth={1.5} size={16} />
      </Button>
    </Tooltip>
  );
};

const topRightControls =
  'absolute top-3 right-5 m-0 flex items-center gap-2 min-h-[28px] print:hidden pointer-events-auto z-30';

const bottomRightControls =
  'absolute bottom-5 right-5 flex flex-col gap-2 items-center print:hidden pointer-events-auto z-30';
