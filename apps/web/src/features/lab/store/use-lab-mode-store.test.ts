/**
 * use-lab-mode-store.test.ts — Panel mutex and slot routing tests
 *
 * Tests the unified panel system: togglePanel(), slot routing,
 * MUTEX_GROUPS (files ↔ terminal ↔ logs), connectedOnly gating,
 * and legacy compat fields.
 */

import { act } from '@testing-library/react';
import { useLabModeStore } from './use-lab-mode-store';

// jsdom defaults to innerWidth=0 which triggers auto-collapse of left panel
// when opening right panels. Set a wide viewport for testing.
Object.defineProperty(window, 'innerWidth', { value: 1920, writable: true });

function resetStore() {
  useLabModeStore.setState({
    mode: 'idle',
    leftPanel: 'files',
    rightPanel: null,
    bottomPanel: null,
    lastBottomPanel: null,
    focusLogCellId: null,
    fileTreeVisible: true,
    terminalOpen: false,
  });
}

beforeEach(() => {
  resetStore();
});

// ─── Slot Routing ─────────────────────────────────────────

describe('slot routing', () => {
  it('routes left-side panels to leftPanel', () => {
    act(() => useLabModeStore.getState().togglePanel('files'));
    // files was already open → toggle closes it
    expect(useLabModeStore.getState().leftPanel).toBeNull();
  });

  it('routes right-side panels to rightPanel', () => {
    act(() => useLabModeStore.getState().togglePanel('errors'));
    expect(useLabModeStore.getState().rightPanel).toBe('errors');
    expect(useLabModeStore.getState().leftPanel).toBe('files'); // unchanged
  });

  it('routes bottom panels to bottomPanel (when active)', () => {
    useLabModeStore.setState({ mode: 'active' });
    act(() => useLabModeStore.getState().togglePanel('terminal'));
    expect(useLabModeStore.getState().bottomPanel).toBe('terminal');
  });

  it('toggles same panel off', () => {
    useLabModeStore.setState({ mode: 'active' });
    act(() => useLabModeStore.getState().togglePanel('terminal'));
    expect(useLabModeStore.getState().bottomPanel).toBe('terminal');

    act(() => useLabModeStore.getState().togglePanel('terminal'));
    expect(useLabModeStore.getState().bottomPanel).toBeNull();
  });

  it('switches panels within the same slot', () => {
    act(() => useLabModeStore.getState().togglePanel('errors'));
    expect(useLabModeStore.getState().rightPanel).toBe('errors');

    act(() => useLabModeStore.getState().togglePanel('variables'));
    expect(useLabModeStore.getState().rightPanel).toBe('variables');
  });
});

// ─── Mutex: files ↔ terminal ↔ logs ──────────────────────

describe('mutex: files ↔ terminal ↔ logs', () => {
  beforeEach(() => {
    useLabModeStore.setState({ mode: 'active', leftPanel: 'files' });
  });

  it('opening terminal closes file tree', () => {
    act(() => useLabModeStore.getState().togglePanel('terminal'));

    const s = useLabModeStore.getState();
    expect(s.bottomPanel).toBe('terminal');
    expect(s.leftPanel).toBeNull();
  });

  it('opening logs closes file tree', () => {
    act(() => useLabModeStore.getState().togglePanel('logs'));

    const s = useLabModeStore.getState();
    expect(s.bottomPanel).toBe('logs');
    expect(s.leftPanel).toBeNull();
  });

  it('opening file tree closes terminal', () => {
    // Start with terminal open, files closed
    useLabModeStore.setState({ leftPanel: null, bottomPanel: 'terminal' });

    act(() => useLabModeStore.getState().togglePanel('files'));

    const s = useLabModeStore.getState();
    expect(s.leftPanel).toBe('files');
    expect(s.bottomPanel).toBeNull();
  });

  it('opening file tree closes logs', () => {
    useLabModeStore.setState({ leftPanel: null, bottomPanel: 'logs' });

    act(() => useLabModeStore.getState().togglePanel('files'));

    const s = useLabModeStore.getState();
    expect(s.leftPanel).toBe('files');
    expect(s.bottomPanel).toBeNull();
  });

  it('switching terminal → logs keeps file tree closed', () => {
    // Open terminal (closes files via mutex)
    act(() => useLabModeStore.getState().togglePanel('terminal'));
    expect(useLabModeStore.getState().leftPanel).toBeNull();

    // Switch to logs — same bottom slot, files stays closed
    act(() => useLabModeStore.getState().togglePanel('logs'));

    const s = useLabModeStore.getState();
    expect(s.bottomPanel).toBe('logs');
    expect(s.leftPanel).toBeNull();
  });

  it('switching logs → terminal keeps file tree closed', () => {
    act(() => useLabModeStore.getState().togglePanel('logs'));
    expect(useLabModeStore.getState().leftPanel).toBeNull();

    act(() => useLabModeStore.getState().togglePanel('terminal'));

    const s = useLabModeStore.getState();
    expect(s.bottomPanel).toBe('terminal');
    expect(s.leftPanel).toBeNull();
  });

  it('closing terminal does NOT auto-reopen file tree', () => {
    act(() => useLabModeStore.getState().togglePanel('terminal'));
    expect(useLabModeStore.getState().leftPanel).toBeNull();

    // Toggle terminal off
    act(() => useLabModeStore.getState().togglePanel('terminal'));

    const s = useLabModeStore.getState();
    expect(s.bottomPanel).toBeNull();
    expect(s.leftPanel).toBeNull(); // files stays closed
  });
});

// ─── Right panel independence ─────────────────────────────

describe('right panel independence', () => {
  beforeEach(() => {
    useLabModeStore.setState({ mode: 'active', leftPanel: 'files' });
  });

  it('opening right panel does not affect file tree or bottom', () => {
    act(() => useLabModeStore.getState().togglePanel('errors'));

    const s = useLabModeStore.getState();
    expect(s.rightPanel).toBe('errors');
    expect(s.leftPanel).toBe('files');
    expect(s.bottomPanel).toBeNull();
  });

  it('opening terminal does not affect right panel', () => {
    act(() => useLabModeStore.getState().togglePanel('errors'));
    act(() => useLabModeStore.getState().togglePanel('terminal'));

    const s = useLabModeStore.getState();
    expect(s.rightPanel).toBe('errors');
    expect(s.bottomPanel).toBe('terminal');
    expect(s.leftPanel).toBeNull(); // mutex with files
  });
});

// ─── connectedOnly gating ─────────────────────────────────

describe('connectedOnly gating', () => {
  it('blocks terminal when mode is idle', () => {
    useLabModeStore.setState({ mode: 'idle' });
    act(() => useLabModeStore.getState().togglePanel('terminal'));
    expect(useLabModeStore.getState().bottomPanel).toBeNull();
  });

  it('blocks logs when mode is connecting', () => {
    useLabModeStore.setState({ mode: 'connecting' });
    act(() => useLabModeStore.getState().togglePanel('logs'));
    expect(useLabModeStore.getState().bottomPanel).toBeNull();
  });

  it('allows terminal when mode is active', () => {
    useLabModeStore.setState({ mode: 'active' });
    act(() => useLabModeStore.getState().togglePanel('terminal'));
    expect(useLabModeStore.getState().bottomPanel).toBe('terminal');
  });

  it('allows non-connectedOnly panels in any mode', () => {
    useLabModeStore.setState({ mode: 'idle' });
    act(() => useLabModeStore.getState().togglePanel('errors'));
    expect(useLabModeStore.getState().rightPanel).toBe('errors');
  });
});

// ─── Legacy compat fields ─────────────────────────────────

describe('legacy compat fields', () => {
  beforeEach(() => {
    useLabModeStore.setState({ mode: 'active' });
  });

  it('fileTreeVisible tracks leftPanel === files', () => {
    expect(useLabModeStore.getState().fileTreeVisible).toBe(true);

    act(() => useLabModeStore.getState().togglePanel('files'));
    expect(useLabModeStore.getState().fileTreeVisible).toBe(false);

    act(() => useLabModeStore.getState().togglePanel('files'));
    expect(useLabModeStore.getState().fileTreeVisible).toBe(true);
  });

  it('terminalOpen tracks bottomPanel === terminal or logs', () => {
    expect(useLabModeStore.getState().terminalOpen).toBe(false);

    act(() => useLabModeStore.getState().togglePanel('terminal'));
    expect(useLabModeStore.getState().terminalOpen).toBe(true);

    act(() => useLabModeStore.getState().togglePanel('terminal'));
    expect(useLabModeStore.getState().terminalOpen).toBe(false);

    act(() => useLabModeStore.getState().togglePanel('logs'));
    expect(useLabModeStore.getState().terminalOpen).toBe(true);
  });

  it('toggleFileTree() delegates to togglePanel', () => {
    act(() => useLabModeStore.getState().toggleFileTree());
    expect(useLabModeStore.getState().leftPanel).toBeNull();

    act(() => useLabModeStore.getState().toggleFileTree());
    expect(useLabModeStore.getState().leftPanel).toBe('files');
  });

  it('openTerminal() opens terminal if not already open', () => {
    act(() => useLabModeStore.getState().openTerminal());
    expect(useLabModeStore.getState().bottomPanel).toBe('terminal');

    // Calling again is a no-op
    act(() => useLabModeStore.getState().openTerminal());
    expect(useLabModeStore.getState().bottomPanel).toBe('terminal');
  });

  it('closeTerminal() closes terminal if open', () => {
    act(() => useLabModeStore.getState().openTerminal());
    act(() => useLabModeStore.getState().closeTerminal());
    expect(useLabModeStore.getState().bottomPanel).toBeNull();

    // Calling again is a no-op
    act(() => useLabModeStore.getState().closeTerminal());
    expect(useLabModeStore.getState().bottomPanel).toBeNull();
  });
});

// ─── lastBottomPanel memory ───────────────────────────────

describe('lastBottomPanel memory', () => {
  beforeEach(() => {
    useLabModeStore.setState({ mode: 'active' });
  });

  it('tracks last opened bottom panel', () => {
    act(() => useLabModeStore.getState().togglePanel('terminal'));
    expect(useLabModeStore.getState().lastBottomPanel).toBe('terminal');

    act(() => useLabModeStore.getState().togglePanel('logs'));
    expect(useLabModeStore.getState().lastBottomPanel).toBe('logs');
  });

  it('keeps lastBottomPanel when closing', () => {
    act(() => useLabModeStore.getState().togglePanel('terminal'));
    act(() => useLabModeStore.getState().togglePanel('terminal')); // close
    expect(useLabModeStore.getState().bottomPanel).toBeNull();
    expect(useLabModeStore.getState().lastBottomPanel).toBe('terminal');
  });
});

// ─── openLogsForCell ─────────────────────────────────────

describe('openLogsForCell', () => {
  beforeEach(() => {
    useLabModeStore.setState({ mode: 'active' });
  });

  it('opens logs panel and sets focusLogCellId', () => {
    act(() => useLabModeStore.getState().openLogsForCell('cell-123'));

    const s = useLabModeStore.getState();
    expect(s.bottomPanel).toBe('logs');
    expect(s.focusLogCellId).toBe('cell-123');
  });

  it('does not toggle off if logs already open', () => {
    act(() => useLabModeStore.getState().togglePanel('logs'));
    expect(useLabModeStore.getState().bottomPanel).toBe('logs');

    act(() => useLabModeStore.getState().openLogsForCell('cell-456'));

    const s = useLabModeStore.getState();
    expect(s.bottomPanel).toBe('logs'); // still open
    expect(s.focusLogCellId).toBe('cell-456');
  });

  it('switches from terminal to logs when called', () => {
    act(() => useLabModeStore.getState().togglePanel('terminal'));
    expect(useLabModeStore.getState().bottomPanel).toBe('terminal');

    act(() => useLabModeStore.getState().openLogsForCell('cell-789'));

    const s = useLabModeStore.getState();
    expect(s.bottomPanel).toBe('logs');
    expect(s.focusLogCellId).toBe('cell-789');
  });
});

// ─── Unknown panel ID ─────────────────────────────────────

describe('unknown panel', () => {
  it('ignores unknown panel IDs', () => {
    const before = useLabModeStore.getState();
    act(() => useLabModeStore.getState().togglePanel('nonexistent'));
    const after = useLabModeStore.getState();

    expect(after.leftPanel).toBe(before.leftPanel);
    expect(after.rightPanel).toBe(before.rightPanel);
    expect(after.bottomPanel).toBe(before.bottomPanel);
  });
});
