import { create } from 'zustand';

type CommandBlock = {
  id: string;
  timestamp: Date;
  command: string;
  prompt: string;
  outputChunks: string[];
  status: 'running' | 'done';
  exitCode?: number;
  durationMs?: number;
};

type TerminalCell = {
  char: string;
  fg: string;
  bg: string;
  bold: boolean;
};

type GridSnapshot = TerminalCell[][];

type TerminalOverlayState = {
  mode: 'block' | 'grid';
  blocks: CommandBlock[];
  promptText: string;
  gridSnapshot: GridSnapshot | null;
  addBlock: (command: string) => void;
  appendOutput: (blockId: string, chunk: string) => void;
  finishBlock: (blockId: string, exitCode?: number) => void;
  setPromptText: (text: string) => void;
  setMode: (mode: 'block' | 'grid') => void;
  updateGrid: (snapshot: GridSnapshot) => void;
  clearBlocks: () => void;
};

let counter = 0;

const useTerminalOverlayStore = create<TerminalOverlayState>((set) => ({
  mode: 'block',
  blocks: [],
  promptText: '(base) vibe@lab ~/workspace $ ',
  gridSnapshot: null,

  addBlock: (command) =>
    set((s) => ({
      blocks: [
        ...s.blocks,
        {
          id: `block-${++counter}`,
          timestamp: new Date(),
          command,
          prompt: s.promptText,
          outputChunks: [],
          status: 'running',
        },
      ],
    })),

  appendOutput: (blockId, chunk) =>
    set((s) => ({
      blocks: s.blocks.map((b) =>
        b.id === blockId
          ? { ...b, outputChunks: [...b.outputChunks, chunk] }
          : b,
      ),
    })),

  finishBlock: (blockId, exitCode) =>
    set((s) => ({
      blocks: s.blocks.map((b) =>
        b.id === blockId
          ? {
              ...b,
              status: 'done' as const,
              exitCode,
              durationMs: Date.now() - b.timestamp.getTime(),
            }
          : b,
      ),
    })),

  setPromptText: (text) => set({ promptText: text }),
  setMode: (mode) => set({ mode }),
  updateGrid: (snapshot) => set({ gridSnapshot: snapshot }),
  clearBlocks: () => set({ blocks: [], mode: 'block', gridSnapshot: null }),
}));

export {
  useTerminalOverlayStore,
  type CommandBlock,
  type TerminalCell,
  type GridSnapshot,
  type TerminalOverlayState,
};
