/**
 * Complete semantic typography tokens — each role includes font-size,
 * weight, color, tracking. Consumers just apply the class string.
 *
 * For the rare case where a smaller variant is needed (e.g. StatItem
 * labels), use the `sm` sub-tokens.
 */
const PANEL_TYPOGRAPHY = {
  /** Section titles, KV labels, frame headers — 10px uppercase muted */
  label: 'text-[10px] font-medium text-mine-muted uppercase tracking-wider',
  /** Primary readable content — 11px normal */
  body: 'text-[11px] text-mine-text',
  /** Data that changes — 11px mono tabular */
  value: 'text-[11px] font-mono tabular-nums text-mine-text',
  /** Secondary context, timestamps — 10px muted */
  hint: 'text-[10px] text-mine-muted',

  /** Smaller variants for compact contexts */
  sm: {
    /** StatItem labels, badge text — 9px uppercase muted */
    label: 'text-[9px] font-medium text-mine-muted uppercase tracking-wider',
    /** Small body text — 9px */
    body: 'text-[9px] text-mine-text',
    /** Badge values, inline counts — 9px mono */
    value: 'text-[9px] font-mono tabular-nums text-mine-muted',
    /** Tiny secondary info — 9px muted */
    hint: 'text-[9px] text-mine-muted',
  },

  /** Larger variants for prominent display */
  lg: {
    /** KPI headline numbers — text-sm bold mono */
    value: 'text-sm font-bold font-mono tabular-nums text-mine-text',
  },
} as const;

export { PANEL_TYPOGRAPHY };
