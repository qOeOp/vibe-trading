import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { PanelShell } from '../panel-shell';
import { DisconnectedFileTree } from '../mine-file-tree';

// ─── PanelShell unit tests ──────────────────────────────

describe('PanelShell', () => {
  it('renders title in uppercase header', () => {
    render(<PanelShell title="Files">content</PanelShell>);
    expect(screen.getByText('Files')).toBeInTheDocument();
    const header = screen.getByText('Files');
    expect(header.className).toContain('uppercase');
  });

  it('renders children in the body area', () => {
    render(
      <PanelShell title="Test">
        <div data-testid="child">hello</div>
      </PanelShell>,
    );
    expect(screen.getByTestId('child')).toBeInTheDocument();
    expect(screen.getByText('hello')).toBeInTheDocument();
  });

  it('shows close button only when onClose is provided', () => {
    const { rerender } = render(<PanelShell title="Test">body</PanelShell>);
    // No close button
    expect(screen.queryByRole('button')).toBeNull();

    // With onClose
    const onClose = vi.fn();
    rerender(
      <PanelShell title="Test" onClose={onClose}>
        body
      </PanelShell>,
    );
    const btn = screen.getByRole('button');
    expect(btn).toBeInTheDocument();
    fireEvent.click(btn);
    expect(onClose).toHaveBeenCalledOnce();
  });

  it('renders headerRight content before close button', () => {
    render(
      <PanelShell
        title="Test"
        onClose={() => {}}
        headerRight={<span data-testid="extra">extra</span>}
      >
        body
      </PanelShell>,
    );
    expect(screen.getByTestId('extra')).toBeInTheDocument();
  });

  it('has data-slot="panel-shell" on root', () => {
    const { container } = render(<PanelShell title="T">body</PanelShell>);
    expect(container.querySelector('[data-slot="panel-shell"]')).toBeTruthy();
  });

  it('merges className onto root', () => {
    const { container } = render(
      <PanelShell title="T" className="h-full custom-class">
        body
      </PanelShell>,
    );
    const root = container.querySelector('[data-slot="panel-shell"]')!;
    expect(root.className).toContain('h-full');
    expect(root.className).toContain('custom-class');
  });

  it('root has correct base classes (white bg, rounded, no shadow)', () => {
    const { container } = render(<PanelShell title="T">body</PanelShell>);
    const root = container.querySelector('[data-slot="panel-shell"]')!;
    expect(root.className).toContain('bg-white');
    expect(root.className).toContain('rounded-lg');
    expect(root.className).toContain('flex');
    expect(root.className).toContain('flex-col');
    // Must NOT have shadow (shadow goes on animation wrapper)
    expect(root.className).not.toContain('shadow');
  });

  it('header uses text-mine-muted (not hardcoded hex)', () => {
    render(<PanelShell title="Variables">body</PanelShell>);
    const label = screen.getByText('Variables');
    expect(label.className).toContain('text-mine-muted');
    expect(label.className).not.toContain('#737373');
  });

  it('body is scrollable with flex-1', () => {
    render(
      <PanelShell title="T">
        <div data-testid="inner">content</div>
      </PanelShell>,
    );
    const body = screen.getByTestId('inner').parentElement!;
    expect(body.className).toContain('flex-1');
    expect(body.className).toContain('overflow-y-auto');
    expect(body.className).toContain('min-h-0');
  });

  it('body is flex-col (required for children using flex-1 + useResizeObserver)', () => {
    render(
      <PanelShell title="T">
        <div data-testid="inner">content</div>
      </PanelShell>,
    );
    const body = screen.getByTestId('inner').parentElement!;
    // flex + flex-col on body is critical: ConnectedFileTreeInner uses
    // a flex-1 div with useResizeObserver to measure available height.
    // Without flex-col, flex-1 children don't expand and height = 0.
    expect(body.className).toContain('flex');
    expect(body.className).toContain('flex-col');
  });
});

// ─── DisconnectedFileTree integration ───────────────────

describe('DisconnectedFileTree', () => {
  it('renders inside PanelShell with "Files" title', () => {
    const { container } = render(<DisconnectedFileTree />);
    const shell = container.querySelector('[data-slot="panel-shell"]');
    expect(shell).toBeTruthy();
    expect(screen.getByText('Files')).toBeInTheDocument();
  });

  it('renders file names (root level)', () => {
    render(<DisconnectedFileTree />);
    expect(screen.getByText('vt-lab.py')).toBeInTheDocument();
    expect(screen.getByText('config.toml')).toBeInTheDocument();
    expect(screen.getByText('requirements.txt')).toBeInTheDocument();
    expect(screen.getByText('backtest_result.json')).toBeInTheDocument();
  });

  it('renders folder names', () => {
    render(<DisconnectedFileTree />);
    expect(screen.getByText('strategies')).toBeInTheDocument();
    expect(screen.getByText('cache')).toBeInTheDocument();
    expect(screen.getByText('data')).toBeInTheDocument();
  });

  it('shows nested files when folder is expanded (strategies is open by default)', () => {
    render(<DisconnectedFileTree />);
    // strategies folder is defaultOpen
    expect(screen.getByText('momentum.py')).toBeInTheDocument();
    expect(screen.getByText('mean_revert.py')).toBeInTheDocument();
    expect(screen.getByText('pairs.py')).toBeInTheDocument();
  });

  it('toggles folder open/close on click', () => {
    render(<DisconnectedFileTree />);
    // strategies is open by default — children visible
    expect(screen.getByText('momentum.py')).toBeInTheDocument();

    // Click strategies folder to close it
    fireEvent.click(screen.getByText('strategies'));
    expect(screen.queryByText('momentum.py')).toBeNull();

    // Click again to re-open
    fireEvent.click(screen.getByText('strategies'));
    expect(screen.getByText('momentum.py')).toBeInTheDocument();
  });

  it('highlights selected file', () => {
    const { container } = render(<DisconnectedFileTree />);
    // vt-lab.py is selected by default
    const vtLabBtn = screen.getByText('vt-lab.py').closest('button')!;
    expect(vtLabBtn.className).toContain('bg-mine-bg');

    // Click another file
    fireEvent.click(screen.getByText('config.toml'));
    const configBtn = screen.getByText('config.toml').closest('button')!;
    expect(configBtn.className).toContain('bg-mine-bg');
    // Previous selection should no longer have bg-mine-bg (without /60)
    const vtLabBtnAfter = screen.getByText('vt-lab.py').closest('button')!;
    // Should have hover variant only, not solid bg-mine-bg
    expect(vtLabBtnAfter.className).not.toMatch(/\bbg-mine-bg\b(?!\/)/);
  });

  it('uses Inter font (no font-mono on tree labels)', () => {
    const { container } = render(<DisconnectedFileTree />);
    // No font-mono class anywhere in the tree content
    const staticTree = container.querySelector('[data-slot="static-tree"]')!;
    expect(staticTree.innerHTML).not.toContain('font-mono');
  });

  it('uses Mine color tokens (text-mine-text, text-mine-muted)', () => {
    const { container } = render(<DisconnectedFileTree />);
    const staticTree = container.querySelector('[data-slot="static-tree"]')!;
    // File labels use text-mine-text
    expect(staticTree.innerHTML).toContain('text-mine-text');
    // Icons use text-mine-muted
    expect(staticTree.innerHTML).toContain('text-mine-muted');
  });

  it('uses Mine hover states (hover:bg-mine-bg)', () => {
    const { container } = render(<DisconnectedFileTree />);
    const staticTree = container.querySelector('[data-slot="static-tree"]')!;
    expect(staticTree.innerHTML).toContain('hover:bg-mine-bg');
  });

  it('passes className through to PanelShell', () => {
    const { container } = render(<DisconnectedFileTree className="h-full" />);
    const shell = container.querySelector('[data-slot="panel-shell"]')!;
    expect(shell.className).toContain('h-full');
  });

  it('does not have PanelShell close button', () => {
    const { container } = render(<DisconnectedFileTree />);
    const shell = container.querySelector('[data-slot="panel-shell"]')!;
    const header = shell.firstElementChild!;
    const closeBtn = header.querySelector('button');
    expect(closeBtn).toBeNull();
  });
});
