/* Copyright 2026 Marimo. All rights reserved. */

import { FitAddon } from '@xterm/addon-fit';
import { SearchAddon } from '@xterm/addon-search';
import { Unicode11Addon } from '@xterm/addon-unicode11';
import { Terminal } from '@xterm/xterm';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import '@xterm/xterm/css/xterm.css';
import './xterm.css';
import useEvent from 'react-use-event-hook';
import { waitForConnectionOpen } from '@/features/lab/core/network/connection';
import { useRuntimeManager } from '@/features/lab/core/runtime/config';
import { useDebouncedCallback } from '@/features/lab/hooks/useDebounce';
import { Logger } from '@/features/lab/utils/Logger';
import { useTerminalActions, useTerminalState } from './state';
import { createTerminalTheme, TERMINAL_BG } from './theme';
import { ReactTerminal } from './react-terminal/react-terminal';
import { StreamParser } from './react-terminal/stream-parser';
import {
  useTerminalOverlayStore,
  type GridSnapshot,
  type TerminalCell,
} from './react-terminal/use-terminal-overlay';
import { ANSI_COLORS } from './react-terminal/grid-view';

interface TerminalComponentProps {
  visible: boolean;
  onClose: () => void;
}

const RESIZE_DEBOUNCE_TIME = 100;

const TerminalComponent: React.FC<TerminalComponentProps> = ({
  visible,
  onClose,
}) => {
  const terminalRef = useRef<HTMLDivElement>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const parserRef = useRef<StreamParser | null>(null);

  // eslint-disable-next-line react/hook-use-state
  const [{ terminal, fitAddon }] = useState(() => {
    // Hidden xterm instance — PTY engine only, no visible rendering
    const term = new Terminal({
      fontFamily: 'JetBrains Mono, Menlo, Consolas, monospace',
      fontSize: 13,
      scrollback: 10_000,
      cursorBlink: false,
      allowTransparency: false,
      theme: createTerminalTheme('light'),
      allowProposedApi: true,
    });

    const fitAddon = new FitAddon();
    const searchAddon = new SearchAddon();
    const unicode11Addon = new Unicode11Addon();

    term.loadAddon(fitAddon);
    term.loadAddon(searchAddon);
    term.loadAddon(unicode11Addon);
    term.unicode.activeVersion = '11';

    return { terminal: term, fitAddon };
  });

  const [initialized, setInitialized] = React.useState(false);
  const runtimeManager = useRuntimeManager();

  // Terminal command state management (jotai — for programmatic commands)
  const terminalState = useTerminalState();
  const { removeCommand, setReady } = useTerminalActions();

  const handleBackendResizeDebounced = useDebouncedCallback(
    ({ cols, rows }: { cols: number; rows: number }) => {
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        Logger.debug('Sending resize to backend terminal', { cols, rows });
        wsRef.current.send(JSON.stringify({ type: 'resize', cols, rows }));
      }
    },
    RESIZE_DEBOUNCE_TIME,
  );

  const handleResize = useEvent(() => {
    if (!terminal || !fitAddon) return;
    fitAddon.fit();
  });

  // ─── Send command from InputBar → PTY ────────────────
  const handleSendCommand = useCallback((text: string) => {
    if (wsRef.current?.readyState !== WebSocket.OPEN) return;
    const overlayStore = useTerminalOverlayStore.getState();
    overlayStore.addBlock(text);
    // Get the just-created block's id
    const blocks = useTerminalOverlayStore.getState().blocks;
    const block = blocks[blocks.length - 1];
    parserRef.current?.beginBlock(block.id);
    wsRef.current.send(text + '\r');
  }, []);

  // ─── Ctrl+C interrupt → PTY ──────────────────────────
  const handleInterrupt = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send('\x03');
    }
  }, []);

  // ─── WebSocket Connection ────────────────────────────
  useEffect(() => {
    if (initialized) return;

    const connectTerminal = async () => {
      try {
        await waitForConnectionOpen();

        terminal.clear();
        terminal.reset();

        const socket = new WebSocket(runtimeManager.getTerminalWsURL());
        wsRef.current = socket;

        // StreamParser: splits PTY output into command blocks
        const parser = new StreamParser({
          onPromptDetected: (promptText) => {
            const store = useTerminalOverlayStore.getState();
            const running = store.blocks.find((b) => b.status === 'running');
            if (running) store.finishBlock(running.id);
            store.setPromptText(promptText);
          },
          onOutputChunk: (blockId, chunk) => {
            useTerminalOverlayStore.getState().appendOutput(blockId, chunk);
          },
          onClearScreen: () => {
            useTerminalOverlayStore.getState().clearBlocks();
          },
        });
        parserRef.current = parser;

        // ─── Grid Mode: capture xterm buffer → React DOM grid ──
        const captureGrid = (): GridSnapshot => {
          const buffer = terminal.buffer.active;
          const grid: GridSnapshot = [];
          for (let row = 0; row < terminal.rows; row++) {
            const line = buffer.getLine(row);
            if (!line) continue;
            const cells: TerminalCell[] = [];
            for (let col = 0; col < terminal.cols; col++) {
              const cell = line.getCell(col);
              if (!cell) {
                cells.push({
                  char: ' ',
                  fg: '#4c4f69',
                  bg: TERMINAL_BG,
                  bold: false,
                });
                continue;
              }
              const fgIdx =
                cell.getFgColorMode() === 1 ? cell.getFgColor() : -1;
              const bgIdx =
                cell.getBgColorMode() === 1 ? cell.getBgColor() : -1;
              cells.push({
                char: cell.getChars() || ' ',
                fg: ANSI_COLORS[fgIdx] ?? '#4c4f69',
                bg: ANSI_COLORS[bgIdx] ?? TERMINAL_BG,
                bold: !!cell.isBold?.(),
              });
            }
            grid.push(cells);
          }
          return grid;
        };

        // ─── Alternate screen buffer detection (vim/top/less) ──
        let gridRafId: number | null = null;
        terminal.buffer.onBufferChange((activeBuffer) => {
          const store = useTerminalOverlayStore.getState();
          if (activeBuffer.type === 'alternate') {
            store.setMode('grid');
            store.updateGrid(captureGrid());
          } else {
            store.setMode('block');
          }
        });

        // Manual WebSocket handling (replaces AttachAddon)
        socket.addEventListener('message', (event) => {
          const data = event.data;
          // Write to hidden xterm (preserves terminal emulation state)
          terminal.write(
            typeof data === 'string' ? data : new Uint8Array(data),
          );

          const store = useTerminalOverlayStore.getState();
          if (store.mode === 'grid') {
            // In grid mode, refresh the React DOM grid via rAF
            if (gridRafId) cancelAnimationFrame(gridRafId);
            gridRafId = requestAnimationFrame(() => {
              store.updateGrid(captureGrid());
              gridRafId = null;
            });
          }

          // Feed stream parser for block splitting (only in block mode)
          if (store.mode === 'block') {
            if (typeof data === 'string') {
              parser.feed(data);
            } else if (data instanceof ArrayBuffer) {
              parser.feed(new TextDecoder().decode(data));
            }
          }
        });

        // Forward xterm keyboard input to PTY (for programmatic commands)
        terminal.onData((data) => {
          if (socket.readyState === WebSocket.OPEN) {
            socket.send(data);
          }
        });

        const updateReadyState = () => {
          setReady(socket.readyState === WebSocket.OPEN);
        };

        const handleDisconnect = () => {
          onClose();
          wsRef.current = null;
          parserRef.current = null;
          terminal.clear();
          setInitialized(false);
          setReady(false);
          useTerminalOverlayStore.getState().clearBlocks();
        };

        socket.addEventListener('open', updateReadyState);
        socket.addEventListener('close', handleDisconnect);
        socket.addEventListener('error', updateReadyState);

        updateReadyState();
        setInitialized(true);
      } catch (error) {
        Logger.error('Runtime health check failed for terminal', error);
        onClose();
      }
    };

    connectTerminal();

    return () => {
      // noop
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialized]);

  // Process pending programmatic commands (from useTerminalCommands hook)
  useEffect(() => {
    if (!terminalState.isReady || terminalState.pendingCommands.length === 0) {
      return;
    }

    for (const command of terminalState.pendingCommands) {
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        Logger.debug('Sending programmatic command to terminal', {
          command: command.text,
        });
        // Route through overlay store so it appears as a block
        handleSendCommand(command.text);
        removeCommand(command.id);
      }
    }
  }, [
    terminalState.isReady,
    terminalState.pendingCommands,
    removeCommand,
    handleSendCommand,
  ]);

  // Mount hidden xterm (required for terminal emulation state)
  useEffect(() => {
    if (!terminalRef.current) return;

    terminal.open(terminalRef.current);
    terminal.options.theme = createTerminalTheme('light');

    setTimeout(() => {
      fitAddon.fit();
    }, RESIZE_DEBOUNCE_TIME);

    const abortController = new AbortController();
    window.addEventListener('resize', handleResize, {
      signal: abortController.signal,
    });
    terminal.onResize(handleBackendResizeDebounced);

    return () => {
      abortController.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="relative w-full h-full bg-white">
      {/* Hidden xterm — PTY engine only, never visible */}
      <div className="absolute w-0 h-0 overflow-hidden" aria-hidden="true">
        <div ref={terminalRef} />
      </div>

      {/* Visible React DOM terminal overlay */}
      <ReactTerminal
        onSendCommand={handleSendCommand}
        onInterrupt={handleInterrupt}
        visible={visible}
      />
    </div>
  );
};

export default React.memo(TerminalComponent);
