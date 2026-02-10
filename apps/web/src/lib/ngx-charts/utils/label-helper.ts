/**
 * @fileoverview Label formatting helpers
 *
 * @migrated-from ngx-charts
 * @source https://github.com/swimlane/ngx-charts
 * @commit e241d94221430000a8fddaa9eb4d8f2878ed8a38
 * @original-file projects/swimlane/ngx-charts/src/lib/common/trim-label.helper.ts
 *
 * @description
 * Utilities for formatting and trimming chart labels.
 * Migrated from Angular ngx-charts library.
 *
 * @license MIT
 */

/**
 * Trims a label to a maximum length, adding ellipsis if truncated
 */
export function trimLabel(s: unknown, max = 16): string {
  if (typeof s !== 'string') {
    if (typeof s === 'number') {
      return String(s);
    }
    return '';
  }

  const trimmed = s.trim();
  if (trimmed.length <= max) {
    return trimmed;
  }
  return `${trimmed.slice(0, max)}...`;
}

/**
 * Formats a number value for display
 */
export function formatNumber(value: number, precision = 2): string {
  if (value === null || value === undefined || isNaN(value)) {
    return '';
  }

  if (Math.abs(value) >= 1000000) {
    return `${(value / 1000000).toFixed(precision)}M`;
  }
  if (Math.abs(value) >= 1000) {
    return `${(value / 1000).toFixed(precision)}K`;
  }
  return value.toFixed(precision);
}

/**
 * Formats a percentage value
 */
export function formatPercent(value: number, precision = 1): string {
  if (value === null || value === undefined || isNaN(value)) {
    return '';
  }
  return `${(value * 100).toFixed(precision)}%`;
}

/**
 * Formats a date for display
 */
export function formatDate(date: Date | string | number): string {
  const d = date instanceof Date ? date : new Date(date);
  if (isNaN(d.getTime())) {
    return '';
  }
  return d.toLocaleDateString();
}

/**
 * Calculates the width of text in SVG
 * This is an approximation - actual width depends on font
 */
export function estimateTextWidth(text: string, fontSize = 12): number {
  // Average character width is approximately 0.6 times the font size
  const avgCharWidth = fontSize * 0.6;
  return text.length * avgCharWidth;
}

/**
 * Wraps text to fit within a maximum width
 */
export function wrapText(text: string, maxWidth: number, fontSize = 12): string[] {
  const words = text.split(' ');
  const lines: string[] = [];
  let currentLine = '';

  for (const word of words) {
    const testLine = currentLine ? `${currentLine} ${word}` : word;
    const testWidth = estimateTextWidth(testLine, fontSize);

    if (testWidth > maxWidth && currentLine) {
      lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine = testLine;
    }
  }

  if (currentLine) {
    lines.push(currentLine);
  }

  return lines;
}

/**
 * Escapes HTML entities in a string for safe display
 */
export function escapeLabel(str: unknown): string {
  if (str === null || str === undefined) {
    return '';
  }
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * Formats a label for display, handling various input types
 */
export function formatLabel(label: unknown): string {
  if (label instanceof Date) {
    return label.toLocaleDateString();
  }
  if (label === null || label === undefined) {
    return '';
  }
  return String(label);
}
