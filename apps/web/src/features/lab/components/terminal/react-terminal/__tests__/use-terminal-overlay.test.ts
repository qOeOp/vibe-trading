import { describe, expect, it, beforeEach } from 'vitest';
import { useTerminalOverlayStore } from '../use-terminal-overlay';

describe('useTerminalOverlayStore', () => {
  beforeEach(() => {
    useTerminalOverlayStore.getState().clearBlocks();
  });

  it('starts with empty blocks and block mode', () => {
    const state = useTerminalOverlayStore.getState();
    expect(state.mode).toBe('block');
    expect(state.blocks).toEqual([]);
    expect(state.promptText).toBe('$ ');
  });

  it('addBlock creates a running block with timestamp', () => {
    const { addBlock } = useTerminalOverlayStore.getState();
    addBlock('ls -la');
    const { blocks } = useTerminalOverlayStore.getState();
    expect(blocks).toHaveLength(1);
    expect(blocks[0].command).toBe('ls -la');
    expect(blocks[0].status).toBe('running');
    expect(blocks[0].outputChunks).toEqual([]);
    expect(blocks[0].id).toBeTruthy();
    expect(blocks[0].timestamp).toBeInstanceOf(Date);
  });

  it('appendOutput adds chunks to the correct block', () => {
    const store = useTerminalOverlayStore.getState();
    store.addBlock('echo hello');
    const blockId = useTerminalOverlayStore.getState().blocks[0].id;
    store.appendOutput(blockId, 'hello\n');
    store.appendOutput(blockId, 'world\n');
    const block = useTerminalOverlayStore.getState().blocks[0];
    expect(block.outputChunks).toEqual(['hello\n', 'world\n']);
  });

  it('finishBlock sets status to done with optional exitCode', () => {
    const store = useTerminalOverlayStore.getState();
    store.addBlock('cat missing');
    const blockId = useTerminalOverlayStore.getState().blocks[0].id;
    store.finishBlock(blockId, 1);
    const block = useTerminalOverlayStore.getState().blocks[0];
    expect(block.status).toBe('done');
    expect(block.exitCode).toBe(1);
    expect(block.durationMs).toBeGreaterThanOrEqual(0);
  });

  it('setPromptText updates promptText', () => {
    useTerminalOverlayStore.getState().setPromptText('(base) vx@ai ~ % ');
    expect(useTerminalOverlayStore.getState().promptText).toBe(
      '(base) vx@ai ~ % ',
    );
  });

  it('setMode toggles between block and grid', () => {
    useTerminalOverlayStore.getState().setMode('grid');
    expect(useTerminalOverlayStore.getState().mode).toBe('grid');
    useTerminalOverlayStore.getState().setMode('block');
    expect(useTerminalOverlayStore.getState().mode).toBe('block');
  });

  it('clearBlocks resets blocks array', () => {
    const store = useTerminalOverlayStore.getState();
    store.addBlock('cmd1');
    store.addBlock('cmd2');
    expect(useTerminalOverlayStore.getState().blocks).toHaveLength(2);
    store.clearBlocks();
    expect(useTerminalOverlayStore.getState().blocks).toEqual([]);
  });
});
