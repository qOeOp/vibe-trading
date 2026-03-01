const PANEL_TYPOGRAPHY = {
  label: 'font-medium text-mine-muted uppercase tracking-wider',
  body: 'text-mine-text',
  value: 'font-mono tabular-nums text-mine-text',
  hint: 'text-mine-muted',
} as const;

const PANEL_SIZE = {
  sm: 'text-[9px]',
  base: 'text-[11px]',
  lg: 'text-sm font-bold',
} as const;

const PANEL_ROLE_DEFAULT_SIZE: Partial<
  Record<keyof typeof PANEL_TYPOGRAPHY, string>
> = {
  label: 'text-[10px]',
  hint: 'text-[10px]',
};

export { PANEL_TYPOGRAPHY, PANEL_SIZE, PANEL_ROLE_DEFAULT_SIZE };
