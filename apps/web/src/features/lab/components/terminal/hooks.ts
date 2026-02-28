/* Copyright 2026 Marimo. All rights reserved. */

import { useLabModeStore } from '@/features/lab/store/use-lab-mode-store';
import { useTerminalActions } from './state';

/**
 * Hook for sending commands to the terminal programmatically.
 * This will:
 * 1. Open the terminal if it's not already open
 * 2. Wait for the terminal to be connected
 * 3. Send the command text to the terminal
 *
 * @example
 * ```tsx
 * function CopyButton({ command }: { command: string }) {
 *   const { sendCommand } = useTerminalCommands();
 *
 *   return (
 *     <button onClick={() => sendCommand(command)}>
 *       Copy to Terminal
 *     </button>
 *   );
 * }
 * ```
 */
export function useTerminalCommands() {
  const { addCommand } = useTerminalActions();

  const sendCommand = (text: string) => {
    // Open the terminal panel (auto-closes file tree via mutex)
    const state = useLabModeStore.getState();
    if (state.bottomPanel !== 'terminal') {
      state.togglePanel('terminal');
    }

    // Add the command to the queue
    addCommand(text);
  };

  return {
    sendCommand,
  };
}
