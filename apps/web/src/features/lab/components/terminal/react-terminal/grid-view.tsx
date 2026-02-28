'use client';

import { useMemo } from 'react';
import { cn } from '@/lib/utils';
import { TERMINAL_BG } from '../theme';
import { useTerminalOverlayStore } from './use-terminal-overlay';
import type { GridSnapshot } from './use-terminal-overlay';

// Catppuccin Latte 16-color mapping (ANSI color index → hex, light theme)
const ANSI_COLORS: Record<number, string> = {
  0: '#5c5f77', // black
  1: '#d20f39', // red
  2: '#40a02b', // green
  3: '#df8e1d', // yellow
  4: '#1e66f5', // blue
  5: '#8839ef', // magenta
  6: '#179299', // cyan
  7: '#acb0be', // white
  8: '#6c6f85', // bright black
  9: '#d20f39', // bright red
  10: '#40a02b', // bright green
  11: '#df8e1d', // bright yellow
  12: '#1e66f5', // bright blue
  13: '#ea76cb', // bright magenta → pink
  14: '#04a5e5', // bright cyan → sky
  15: '#4c4f69', // bright white → text
};

function resolveColor(colorIdx: number | undefined, fallback: string): string {
  if (colorIdx === undefined || colorIdx < 0) return fallback;
  return ANSI_COLORS[colorIdx] ?? fallback;
}

type GridViewProps = {
  onKeyData?: (data: string) => void;
  className?: string;
};

function GridView({ className }: GridViewProps) {
  const gridSnapshot = useTerminalOverlayStore((s) => s.gridSnapshot);

  if (!gridSnapshot || gridSnapshot.length === 0) {
    return (
      <div
        data-slot="grid-view"
        className={cn(
          'w-full h-full flex items-center justify-center font-mono text-[13px] bg-white text-mine-muted',
          className,
        )}
      >
        交互模式
      </div>
    );
  }

  return (
    <div
      data-slot="grid-view"
      className={cn(
        'w-full h-full overflow-hidden font-mono bg-white',
        className,
      )}
      tabIndex={0}
    >
      <GridContent grid={gridSnapshot} />
    </div>
  );
}

/** Renders the xterm buffer as a React DOM character grid */
function GridContent({ grid }: { grid: GridSnapshot }) {
  const rows = useMemo(() => {
    return grid.map((row, rowIdx) => {
      // Merge consecutive cells with same style into spans for efficiency
      const spans: Array<{
        text: string;
        fg: string;
        bg: string;
        bold: boolean;
        key: number;
      }> = [];

      let current: (typeof spans)[0] | null = null;

      for (let col = 0; col < row.length; col++) {
        const cell = row[col];
        if (
          current &&
          current.fg === cell.fg &&
          current.bg === cell.bg &&
          current.bold === cell.bold
        ) {
          current.text += cell.char;
        } else {
          current = {
            text: cell.char,
            fg: cell.fg,
            bg: cell.bg,
            bold: cell.bold,
            key: col,
          };
          spans.push(current);
        }
      }

      return { rowIdx, spans };
    });
  }, [grid]);

  return (
    <div
      className="text-[13px] leading-[1.2]"
      style={{ whiteSpace: 'pre', fontVariantLigatures: 'none' }}
    >
      {rows.map(({ rowIdx, spans }) => (
        <div key={rowIdx} className="h-[18px]">
          {spans.map((span) => (
            <span
              key={span.key}
              style={{
                color: span.fg,
                backgroundColor: span.bg !== TERMINAL_BG ? span.bg : undefined,
                fontWeight: span.bold ? 700 : 400,
              }}
            >
              {span.text}
            </span>
          ))}
        </div>
      ))}
    </div>
  );
}

export { GridView, resolveColor, ANSI_COLORS };
