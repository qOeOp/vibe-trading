import { describe, expect, it, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { act } from '@testing-library/react';
import { MineTabBar } from '../mine-tab-bar';
import { useLabFileTabStore } from '@/features/lab/store/use-lab-file-tab-store';
import { useLabModeStore } from '@/features/lab/store/use-lab-mode-store';

describe('MineTabBar', () => {
  beforeEach(() => {
    act(() => {
      useLabFileTabStore.getState().reset();
      // Set connected mode
      useLabModeStore.setState({ mode: 'active' });
    });
  });

  it('shows close button on hover for non-pinned tab', async () => {
    act(() => {
      useLabFileTabStore.getState().initNotebookTab('/workspace/notebook.py');
      useLabFileTabStore.getState().openFile('/workspace/factor.py');
    });

    render(<MineTabBar />);

    // Find the factor.py tab section
    const factorTab = screen
      .getByText('factor.py')
      .closest('[data-slot="tab-section-file"]')!;

    // Close button should be hidden initially
    const closeBtn = factorTab.querySelector('[data-slot="tab-close-btn"]');
    expect(closeBtn).toBeTruthy();
    expect(closeBtn).toHaveClass('opacity-0');

    // On hover, close button should be visible
    fireEvent.mouseEnter(factorTab);
    expect(closeBtn).toHaveClass('opacity-100');
  });

  it('does NOT show close button for pinned tab', () => {
    act(() => {
      useLabFileTabStore.getState().initNotebookTab('/workspace/notebook.py');
    });

    render(<MineTabBar />);

    const notebookTab = screen
      .getByText('notebook.py')
      .closest('[data-slot="tab-section-file"]')!;
    const closeBtn = notebookTab.querySelector('[data-slot="tab-close-btn"]');
    expect(closeBtn).toBeNull();
  });

  it('closes tab when close button is clicked', () => {
    act(() => {
      useLabFileTabStore.getState().initNotebookTab('/workspace/notebook.py');
      useLabFileTabStore.getState().openFile('/workspace/factor.py');
    });

    render(<MineTabBar />);

    const factorTab = screen
      .getByText('factor.py')
      .closest('[data-slot="tab-section-file"]')!;
    const closeBtn = factorTab.querySelector(
      '[data-slot="tab-close-btn"]',
    ) as HTMLElement;

    fireEvent.click(closeBtn);

    // factor.py tab should be gone
    expect(screen.queryByText('factor.py')).toBeNull();
    expect(useLabFileTabStore.getState().tabs).toHaveLength(1);
  });
});
