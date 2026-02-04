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
  /** Chart data - array of series */
  results: AreaChartSeries[];
  /** Chart width (auto if not specified) */
  width?: number;
  /** Chart height (auto if not specified) */
  height?: number;
  /** Show legend */
  legend?: boolean;
  /** Legend title */
  legendTitle?: string;
  /** Show X axis */
  xAxis?: boolean;
  /** Show Y axis */
  yAxis?: boolean;
  /** Show X axis label */
  showXAxisLabel?: boolean;
  /** Show Y axis label */
  showYAxisLabel?: boolean;
  /** X axis label text */
  xAxisLabel?: string;
  /** Y axis label text */
  yAxisLabel?: string;
  /** Auto scale Y axis (default includes 0) */
  autoScale?: boolean;
  /** Show grid lines */
  showGridLines?: boolean;
  /** Curve factory for line interpolation */
  curve?: CurveFactory;
  /** Enable gradient fill */
  gradient?: boolean;
  /** Color scheme - array of colors */
  scheme?: { domain: string[] };
  /** Enable animations */
  animations?: boolean;
  /** Disable tooltip */
  tooltipDisabled?: boolean;
  /** X axis tick formatting function */
  xAxisTickFormatting?: (value: any) => string;
  /** Y axis tick formatting function */
  yAxisTickFormatting?: (value: any) => string;
  /** Click handler */
  onSelect?: (data: any) => void;
  /** Hover handler */
  onActivate?: (data: any) => void;
  /** Leave handler */
  onDeactivate?: (data: any) => void;
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
