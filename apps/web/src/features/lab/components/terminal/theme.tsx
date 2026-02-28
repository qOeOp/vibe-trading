/* Copyright 2026 Marimo. All rights reserved. */
import type { ResolvedTheme } from '@/features/lab/theme/useTheme';

// ─── Catppuccin Mocha palette ──────────────────────────────
// https://github.com/catppuccin/catppuccin
const mocha = {
  base: '#1e1e2e',
  mantle: '#181825',
  crust: '#11111b',
  text: '#cdd6f4',
  subtext1: '#bac2de',
  subtext0: '#a6adc8',
  overlay2: '#9399b2',
  overlay1: '#7f849c',
  overlay0: '#6c7086',
  surface2: '#585b70',
  surface1: '#45475a',
  surface0: '#313244',
  rosewater: '#f5e0dc',
  flamingo: '#f2cdcd',
  pink: '#f5c2e7',
  mauve: '#cba6f7',
  red: '#f38ba8',
  maroon: '#eba0ac',
  peach: '#fab387',
  yellow: '#f9e2af',
  green: '#a6e3a1',
  teal: '#94e2d5',
  sky: '#89dceb',
  sapphire: '#74c7ec',
  blue: '#89b4fa',
  lavender: '#b4befe',
};

/** Background color for the terminal body (white — lives inside ContentFrame). */
export const TERMINAL_BG = '#ffffff';

// Terminal theme configuration
export function createTerminalTheme(theme: ResolvedTheme) {
  return theme === 'dark'
    ? {
        background: mocha.base,
        foreground: mocha.text,
        cursor: mocha.rosewater,
        cursorAccent: mocha.base,
        selectionBackground: mocha.surface2,
        selectionForeground: mocha.text,
        selectionInactiveBackground: mocha.surface1,
        black: mocha.surface1,
        red: mocha.red,
        green: mocha.green,
        yellow: mocha.yellow,
        blue: mocha.blue,
        magenta: mocha.mauve,
        cyan: mocha.teal,
        white: mocha.subtext1,
        brightBlack: mocha.overlay0,
        brightRed: mocha.maroon,
        brightGreen: mocha.green,
        brightYellow: mocha.yellow,
        brightBlue: mocha.sapphire,
        brightMagenta: mocha.pink,
        brightCyan: mocha.sky,
        brightWhite: mocha.text,
      }
    : {
        // Catppuccin Latte (light variant)
        background: '#eff1f5',
        foreground: '#4c4f69',
        cursor: '#dc8a78',
        cursorAccent: '#eff1f5',
        selectionBackground: '#acb0be',
        selectionForeground: '#4c4f69',
        black: '#5c5f77',
        red: '#d20f39',
        green: '#40a02b',
        yellow: '#df8e1d',
        blue: '#1e66f5',
        magenta: '#8839ef',
        cyan: '#179299',
        white: '#acb0be',
        brightBlack: '#6c6f85',
        brightRed: '#d20f39',
        brightGreen: '#40a02b',
        brightYellow: '#df8e1d',
        brightBlue: '#1e66f5',
        brightMagenta: '#8839ef',
        brightCyan: '#179299',
        brightWhite: '#4c4f69',
      };
}
