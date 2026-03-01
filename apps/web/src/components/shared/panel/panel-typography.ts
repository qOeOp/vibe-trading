/**
 * Semantic typography tokens for the unified panel system.
 *
 * Each token maps to a single CSS utility defined in globals.css
 * via `@utility panel-*`. The utility encapsulates font-size, weight,
 * color, and tracking — consumers just write `className="panel-label"`.
 */
const PANEL_TYPOGRAPHY = {
  /** Section titles, frame headers — 10px uppercase muted */
  label: 'panel-label',
  /** Primary readable content — 11px */
  body: 'panel-body',
  /** Data that changes — 11px mono tabular */
  value: 'panel-value',
  /** Secondary context, KV labels, timestamps — 10px muted */
  hint: 'panel-hint',

  /** Compact variants */
  sm: {
    /** StatItem labels, badge text — 9px uppercase muted */
    label: 'panel-label-sm',
    /** Badge values, inline counts — 9px mono */
    value: 'panel-value-sm',
  },

  /** Prominent variants */
  lg: {
    /** KPI headline numbers — 14px bold mono */
    value: 'panel-value-lg',
  },
} as const;

export { PANEL_TYPOGRAPHY };
