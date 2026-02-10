import type { CurveFactory } from "d3-shape";

export interface DataPoint {
  name: string | number | Date;
  value: number;
}

export interface AreaChartSeries {
  name: string;
  series: DataPoint[];
}

export interface NgxAreaChartProps {
  results: AreaChartSeries[];
  width?: number;
  height?: number;
  legend?: boolean;
  legendTitle?: string;
  xAxis?: boolean;
  yAxis?: boolean;
  showXAxisLabel?: boolean;
  showYAxisLabel?: boolean;
  xAxisLabel?: string;
  yAxisLabel?: string;
  /** When true, Y axis domain is derived from data only; otherwise includes 0 */
  autoScale?: boolean;
  showGridLines?: boolean;
  curve?: CurveFactory;
  gradient?: boolean;
  scheme?: { domain: string[] };
  animations?: boolean;
  tooltipDisabled?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Callers pass (v: number) => string, (v: Date) => string, etc.; union of all signatures is impractical
  xAxisTickFormatting?: (value: any) => string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Callers pass (v: number) => string, (v: Date) => string, etc.; union of all signatures is impractical
  yAxisTickFormatting?: (value: any) => string;
  onSelect?: (data: unknown) => void;
}

export interface ViewDimensions {
  width: number;
  height: number;
  xOffset: number;
}

export interface GradientStop {
  offset: number;
  color: string;
  opacity: number;
}
