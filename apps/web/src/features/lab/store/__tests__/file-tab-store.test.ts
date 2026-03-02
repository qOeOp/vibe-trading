import { describe, expect, it, beforeEach } from 'vitest';
import { act } from '@testing-library/react';
import { useLabFileTabStore } from '../use-lab-file-tab-store';

describe('useLabFileTabStore', () => {
  beforeEach(() => {
    act(() => useLabFileTabStore.getState().reset());
  });

  describe('openFile', () => {
    it('creates a new tab and sets it active', () => {
      act(() => useLabFileTabStore.getState().openFile('/workspace/factor.py'));

      const state = useLabFileTabStore.getState();
      expect(state.tabs).toHaveLength(1);
      expect(state.tabs[0].path).toBe('/workspace/factor.py');
      expect(state.tabs[0].label).toBe('factor.py');
      expect(state.tabs[0].pinned).toBe(false);
      expect(state.activeTabId).toBe('/workspace/factor.py');
    });

    it('switches to existing tab without duplicating', () => {
      act(() => {
        useLabFileTabStore.getState().openFile('/workspace/factor.py');
        useLabFileTabStore.getState().openFile('/workspace/utils.py');
        useLabFileTabStore.getState().openFile('/workspace/factor.py');
      });

      const state = useLabFileTabStore.getState();
      expect(state.tabs).toHaveLength(2);
      expect(state.activeTabId).toBe('/workspace/factor.py');
    });
  });

  describe('closeTab', () => {
    it('closes non-pinned tab', () => {
      act(() => {
        useLabFileTabStore.getState().openFile('/workspace/factor.py');
        useLabFileTabStore.getState().openFile('/workspace/utils.py');
      });

      act(() => useLabFileTabStore.getState().closeTab('/workspace/factor.py'));

      const state = useLabFileTabStore.getState();
      expect(state.tabs).toHaveLength(1);
      expect(state.tabs[0].path).toBe('/workspace/utils.py');
    });

    it('does not close pinned tab', () => {
      act(() => {
        useLabFileTabStore.getState().initNotebookTab('/workspace/notebook.py');
      });

      act(() =>
        useLabFileTabStore.getState().closeTab('/workspace/notebook.py'),
      );

      const state = useLabFileTabStore.getState();
      expect(state.tabs).toHaveLength(1);
      expect(state.tabs[0].pinned).toBe(true);
    });

    it('switches active tab to neighbor after close', () => {
      act(() => {
        useLabFileTabStore.getState().initNotebookTab('/workspace/notebook.py');
        useLabFileTabStore.getState().openFile('/workspace/factor.py');
        useLabFileTabStore.getState().openFile('/workspace/utils.py');
        // active = utils.py
      });

      act(() => useLabFileTabStore.getState().closeTab('/workspace/utils.py'));

      const state = useLabFileTabStore.getState();
      expect(state.activeTabId).toBe('/workspace/factor.py');
    });
  });
});
