'use client';

import * as React from 'react';
import * as RechartsPrimitive from 'recharts';
import { cn } from '@/lib/utils';

// ─── Config ──────────────────────────────────────────────

// IMPORTANT: Mine theme uses semantic tokens (mine-*), not shadcn defaults.
// When defining a ChartConfig, use CSS variable references like:
//   color: 'var(--color-mine-accent-teal)'
// or bare Tailwind token names that get resolved via --color-{name}:
//   color: 'mine-accent-teal'

export type ChartConfig = Record<
  string,
  {
    label?: React.ReactNode;
    icon?: React.ComponentType;
  } & (
    | { color?: string; theme?: never }
    | { color?: never; theme: Record<string, string> }
  )
>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type PayloadItem = Record<string, any>;

type ChartContextProps = {
  config: ChartConfig;
};

const ChartContext = React.createContext<ChartContextProps | null>(null);

function useChart() {
  const context = React.useContext(ChartContext);
  if (!context) {
    throw new Error('useChart must be used within a <ChartContainer />');
  }
  return context;
}

// ─── ChartContainer ──────────────────────────────────────

function ChartContainer({
  id,
  className,
  children,
  config,
  ...props
}: React.ComponentProps<'div'> & {
  config: ChartConfig;
  children: React.ComponentProps<
    typeof RechartsPrimitive.ResponsiveContainer
  >['children'];
}) {
  const uniqueId = React.useId();
  const chartId = `chart-${id || uniqueId.replace(/:/g, '')}`;

  return (
    <ChartContext.Provider value={{ config }}>
      <div
        data-slot="chart"
        data-chart={chartId}
        className={cn(
          '[&_.recharts-cartesian-axis-tick_text]:fill-mine-muted',
          "[&_.recharts-cartesian-grid_line[stroke='#ccc']]:stroke-mine-border/50",
          'flex aspect-video justify-center text-xs',
          "[&_.recharts-dot[stroke='#fff']]:stroke-transparent",
          '[&_.recharts-layer]:outline-hidden',
          "[&_.recharts-polar-grid_[stroke='#ccc']]:stroke-mine-border",
          '[&_.recharts-radial-bar-background-sector]:fill-mine-bg',
          '[&_.recharts-rectangle.recharts-tooltip-cursor]:fill-mine-hover',
          '[&_.recharts-reference-line_[stroke]]:stroke-mine-border',
          "[&_.recharts-sector[stroke='#fff']]:stroke-transparent",
          '[&_.recharts-sector]:outline-hidden',
          '[&_.recharts-surface]:outline-hidden',
          className,
        )}
        {...props}
      >
        <ChartStyle id={chartId} config={config} />
        <RechartsPrimitive.ResponsiveContainer>
          {children}
        </RechartsPrimitive.ResponsiveContainer>
      </div>
    </ChartContext.Provider>
  );
}

// ─── ChartStyle ──────────────────────────────────────────

function ChartStyle({ id, config }: { id: string; config: ChartConfig }) {
  const colorConfig = Object.entries(config).filter(
    ([, cfg]) => cfg.theme || cfg.color,
  );

  if (!colorConfig.length) return null;

  return (
    <style
      dangerouslySetInnerHTML={{
        __html: Object.entries({ light: '' })
          .map(
            ([theme]) =>
              `${
                theme === 'light'
                  ? `[data-chart=${id}]`
                  : `.dark [data-chart=${id}]`
              } {\n${colorConfig
                .map(([key, itemConfig]) => {
                  const color = itemConfig.theme?.[theme] || itemConfig.color;
                  return color ? `  --color-${key}: ${color};` : null;
                })
                .filter(Boolean)
                .join('\n')}\n}`,
          )
          .join('\n'),
      }}
    />
  );
}

// ─── ChartTooltip ────────────────────────────────────────

const ChartTooltip = RechartsPrimitive.Tooltip;

function ChartTooltipContent({
  active,
  payload,
  className,
  indicator = 'dot',
  hideLabel = false,
  hideIndicator = false,
  label,
  labelFormatter,
  labelClassName,
  formatter,
  color,
  nameKey,
  labelKey,
  ...props
}: React.ComponentProps<'div'> & {
  active?: boolean;
  payload?: PayloadItem[];
  label?: string;
  labelFormatter?: (label: unknown, payload: PayloadItem[]) => React.ReactNode;
  formatter?: (
    value: unknown,
    name: string,
    item: PayloadItem,
    index: number,
    payload: unknown,
  ) => React.ReactNode;
  hideLabel?: boolean;
  hideIndicator?: boolean;
  indicator?: 'line' | 'dot' | 'dashed';
  nameKey?: string;
  labelKey?: string;
  labelClassName?: string;
  color?: string;
}) {
  const { config } = useChart();

  const tooltipLabel = React.useMemo(() => {
    if (hideLabel || !payload?.length) return null;

    const [item] = payload;
    const key = `${labelKey || item?.dataKey || item?.name || 'value'}`;
    const itemConfig = getPayloadConfigFromPayload(config, item, key);
    const value =
      !labelKey && typeof label === 'string'
        ? config[label]?.label || label
        : itemConfig?.label;

    if (labelFormatter) {
      return (
        <div className={cn('font-medium', labelClassName)}>
          {labelFormatter(value, payload)}
        </div>
      );
    }

    if (!value) return null;

    return <div className={cn('font-medium', labelClassName)}>{value}</div>;
  }, [
    label,
    labelFormatter,
    payload,
    hideLabel,
    labelClassName,
    config,
    labelKey,
  ]);

  if (!active || !payload?.length) return null;

  const nestLabel = payload.length === 1 && indicator !== 'dot';

  return (
    <div
      data-slot="chart-tooltip-content"
      className={cn(
        'grid min-w-[8rem] items-start gap-1.5 rounded-lg border border-mine-border/50 bg-white px-2.5 py-1.5 text-xs shadow-xl',
        className,
      )}
      {...props}
    >
      {!nestLabel ? tooltipLabel : null}
      <div className="grid gap-1.5">
        {payload.map((item, index) => {
          const key = `${nameKey || item.name || item.dataKey || 'value'}`;
          const itemConfig = getPayloadConfigFromPayload(config, item, key);
          const indicatorColor = color || item.payload?.fill || item.color;

          return (
            <div
              key={item.dataKey}
              className={cn(
                'flex w-full flex-wrap items-stretch gap-2 [&>svg]:h-2.5 [&>svg]:w-2.5 [&>svg]:text-mine-muted',
                indicator === 'dot' && 'items-center',
              )}
            >
              {formatter && item?.value !== undefined && item.name ? (
                formatter(item.value, item.name, item, index, item.payload)
              ) : (
                <>
                  {itemConfig?.icon ? (
                    <itemConfig.icon />
                  ) : (
                    !hideIndicator && (
                      <div
                        className={cn(
                          'shrink-0 rounded-[2px] border-(--color-border) bg-(--color-bg)',
                          {
                            'h-2.5 w-2.5': indicator === 'dot',
                            'w-1': indicator === 'line',
                            'w-0 border-[1.5px] border-dashed bg-transparent':
                              indicator === 'dashed',
                            'my-0.5': nestLabel && indicator === 'dashed',
                          },
                        )}
                        style={
                          {
                            '--color-bg': indicatorColor,
                            '--color-border': indicatorColor,
                          } as React.CSSProperties
                        }
                      />
                    )
                  )}
                  <div
                    className={cn(
                      'flex flex-1 justify-between leading-none',
                      nestLabel ? 'items-end' : 'items-center',
                    )}
                  >
                    <div className="grid gap-1.5">
                      {nestLabel ? tooltipLabel : null}
                      <span className="text-mine-muted">
                        {itemConfig?.label || item.name}
                      </span>
                    </div>
                    {item.value !== undefined && (
                      <span className="font-mono font-medium tabular-nums text-mine-text">
                        {typeof item.value === 'number'
                          ? item.value.toLocaleString()
                          : String(item.value)}
                      </span>
                    )}
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── ChartLegend ─────────────────────────────────────────

const ChartLegend = RechartsPrimitive.Legend;

function ChartLegendContent({
  className,
  hideIcon = false,
  payload,
  verticalAlign = 'bottom',
  nameKey,
}: React.ComponentProps<'div'> & {
  payload?: PayloadItem[];
  verticalAlign?: 'top' | 'bottom';
  hideIcon?: boolean;
  nameKey?: string;
}) {
  const { config } = useChart();

  if (!payload?.length) return null;

  return (
    <div
      data-slot="chart-legend-content"
      className={cn(
        'flex items-center justify-center gap-4',
        verticalAlign === 'top' ? 'pb-3' : 'pt-3',
        className,
      )}
    >
      {payload.map((item) => {
        const key = `${nameKey || item.dataKey || 'value'}`;
        const itemConfig = getPayloadConfigFromPayload(config, item, key);

        return (
          <div
            key={item.value}
            className={cn(
              'flex items-center gap-1.5 [&>svg]:h-3 [&>svg]:w-3 [&>svg]:text-mine-muted',
            )}
          >
            {itemConfig?.icon && !hideIcon ? (
              <itemConfig.icon />
            ) : (
              <div
                className="h-2 w-2 shrink-0 rounded-[2px]"
                style={{ backgroundColor: item.color }}
              />
            )}
            <span className="text-mine-muted">{itemConfig?.label}</span>
          </div>
        );
      })}
    </div>
  );
}

// ─── Helpers ─────────────────────────────────────────────

function getPayloadConfigFromPayload(
  config: ChartConfig,
  payload: unknown,
  key: string,
) {
  if (typeof payload !== 'object' || payload === null) return undefined;

  const payloadPayload =
    'payload' in payload &&
    typeof payload.payload === 'object' &&
    payload.payload !== null
      ? payload.payload
      : undefined;

  let configLabelKey: string = key;

  if (key in config) {
    configLabelKey = key;
  } else if (
    payloadPayload &&
    typeof payloadPayload === 'object' &&
    key in payloadPayload &&
    typeof (payloadPayload as Record<string, unknown>)[key] === 'string'
  ) {
    configLabelKey = (payloadPayload as Record<string, string>)[key];
  }

  return configLabelKey in config ? config[configLabelKey] : config[key];
}

// ─── Exports ─────────────────────────────────────────────

export {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  ChartStyle,
};
