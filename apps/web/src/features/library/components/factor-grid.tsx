"use client";

import { useMemo, useCallback } from "react";
import { AgGridReact } from "ag-grid-react";
import type { CustomCellRendererProps } from "ag-grid-react";
import {
  AllCommunityModule,
  ModuleRegistry,
  themeQuartz,
} from "ag-grid-community";
import type {
  ColDef,
  GetRowIdFunc,
  GetRowIdParams,
  ValueFormatterParams,
  CellClassParams,
} from "ag-grid-community";
import type { LibraryFactor } from "../types";

ModuleRegistry.registerModules([AllCommunityModule]);

const mineGridTheme = themeQuartz.withParams({
  accentColor: "#2d2d2d",
  backgroundColor: "#ffffff",
  borderColor: "#e8e5e0",
  borderRadius: 0,
  browserColorScheme: "light",
  chromeBackgroundColor: "#faf9f7",
  foregroundColor: "#1a1a1a",
  fontFamily: "'Inter', ui-sans-serif, system-ui, sans-serif",
  fontSize: 13,
  headerBackgroundColor: "#f5f3ef",
  headerFontWeight: 600,
  headerTextColor: "#6b6b6b",
  headerFontSize: 12,
  oddRowBackgroundColor: "#fefefe",
  rowBorder: { color: "#f0ede8" },
  rowHoverColor: "#f7f5f1",
  spacing: 8,
  wrapperBorderRadius: 0,
  cellHorizontalPadding: 16,
  columnBorder: false,
});

const CATEGORY_COLORS: Record<string, string> = {
  "价值": "#3b82f6",
  "质量": "#10b981",
  "动量": "#f97316",
  "情绪": "#a855f7",
  "波动": "#eab308",
  "流动性": "#06b6d4",
  "规模": "#64748b",
};

const STATUS_STYLES: Record<string, { color: string; fontWeight: number }> = {
  "强有效": { color: "#F6465D", fontWeight: 600 },
  "有效": { color: "#2EBD85", fontWeight: 500 },
  "弱": { color: "#76808E", fontWeight: 500 },
  "反向": { color: "#f59e0b", fontWeight: 500 },
};

function FactorNameCellRenderer({ data }: CustomCellRendererProps<LibraryFactor>) {
  if (!data) return null;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
      <b style={{ fontSize: 13 }}>{data.name}</b>
      <span style={{ opacity: 0.55, fontSize: 12 }}>{data.description}</span>
    </div>
  );
}

function CategoryCellRenderer({ value }: CustomCellRendererProps<LibraryFactor>) {
  if (!value) return null;
  const c = CATEGORY_COLORS[value as string] ?? "#888";
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        padding: "2px 10px",
        fontSize: 11,
        fontWeight: 600,
        borderRadius: 6,
        backgroundColor: `${c}18`,
        color: c,
        letterSpacing: "0.02em",
      }}
    >
      {value as string}
    </span>
  );
}

function StatusCellRenderer({ value }: CustomCellRendererProps<LibraryFactor>) {
  if (!value) return null;
  const s = STATUS_STYLES[value as string] ?? { color: "#888", fontWeight: 400 };
  return (
    <span style={{ color: s.color, fontWeight: s.fontWeight, fontSize: 12 }}>
      {value as string}
    </span>
  );
}

function SparklineCellRenderer({ data }: CustomCellRendererProps<LibraryFactor>) {
  if (!data) return null;
  const points = data.icTrend;
  const min = Math.min(...points);
  const max = Math.max(...points);
  const range = max - min || 1;
  const w = 110;
  const h = 28;
  const isUp = points[points.length - 1] >= points[0];
  const color = isUp ? "#2EBD85" : "#F6465D";

  const d = points
    .map((v, i) => {
      const x = (i / (points.length - 1)) * w;
      const y = h - ((v - min) / range) * (h - 4) - 2;
      return `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");

  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
      <path d={d} fill="none" stroke={color} strokeWidth={1.5} strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}

function icFormatter(params: ValueFormatterParams): string {
  if (params.value == null) return "";
  const v = params.value as number;
  return `${v >= 0 ? "+" : ""}${v.toFixed(3)}`;
}

function numFormatter2(params: ValueFormatterParams): string {
  if (params.value == null) return "";
  return (params.value as number).toFixed(2);
}

function pctFormatter(params: ValueFormatterParams): string {
  if (params.value == null) return "";
  return `${Math.round(params.value as number)}%`;
}

function drawdownFormatter(params: ValueFormatterParams): string {
  if (params.value == null) return "";
  return `${(params.value as number).toFixed(1)}%`;
}

const EMPTY_VALUE_FORMATTER = (): string => "";

function icCellClass(params: CellClassParams): string {
  if (params.value == null) return "";
  return (params.value as number) >= 0 ? "ag-cell-value-up" : "ag-cell-value-down";
}

function ratioCellClass(params: CellClassParams): string {
  if (params.value == null) return "";
  const v = params.value as number;
  if (v >= 1.5) return "ag-cell-value-up ag-cell-bold";
  if (v >= 0) return "ag-cell-value-up";
  return "ag-cell-value-down";
}

const DRAWDOWN_CELL_CLASS = "ag-cell-value-down";

interface FactorGridProps {
  factors: LibraryFactor[];
}

export function FactorGrid({ factors }: FactorGridProps) {
  const defaultColDef = useMemo<ColDef>(
    () => ({
      flex: 1,
      filter: true,
      sortable: true,
      resizable: true,
    }),
    []
  );

  const getRowId = useCallback<GetRowIdFunc>(
    ({ data }: GetRowIdParams) => data.id,
    []
  );

  const columnDefs = useMemo<ColDef<LibraryFactor>[]>(
    () => [
      {
        headerName: "因子",
        field: "name",
        cellRenderer: FactorNameCellRenderer,
        cellDataType: "text",
        minWidth: 200,
        flex: 2.5,
        filter: true,
      },
      {
        headerName: "类别",
        field: "category",
        cellRenderer: CategoryCellRenderer,
        cellDataType: "text",
        minWidth: 90,
        maxWidth: 100,
        filter: true,
      },
      {
        headerName: "IC均值",
        field: "icMean",
        cellDataType: "number",
        valueFormatter: icFormatter,
        cellClass: icCellClass,
        type: "rightAligned",
        minWidth: 100,
        maxWidth: 110,
      },
      {
        headerName: "ICIR",
        field: "icir",
        cellDataType: "number",
        valueFormatter: numFormatter2,
        cellClass: ratioCellClass,
        type: "rightAligned",
        minWidth: 85,
        maxWidth: 95,
      },
      {
        headerName: "胜率",
        field: "winRate",
        cellDataType: "number",
        valueFormatter: pctFormatter,
        type: "rightAligned",
        minWidth: 75,
        maxWidth: 85,
      },
      {
        headerName: "周期",
        field: "period",
        cellDataType: "text",
        minWidth: 70,
        maxWidth: 80,
        sortable: false,
        filter: false,
      },
      {
        headerName: "换手",
        field: "turnover",
        cellDataType: "number",
        valueFormatter: pctFormatter,
        type: "rightAligned",
        minWidth: 75,
        maxWidth: 85,
      },
      {
        headerName: "最大回撤",
        field: "maxDrawdown",
        cellDataType: "number",
        valueFormatter: drawdownFormatter,
        cellClass: DRAWDOWN_CELL_CLASS,
        type: "rightAligned",
        minWidth: 100,
        maxWidth: 110,
      },
      {
        headerName: "Sharpe",
        field: "sharpe",
        cellDataType: "number",
        valueFormatter: numFormatter2,
        cellClass: ratioCellClass,
        type: "rightAligned",
        minWidth: 90,
        maxWidth: 100,
      },
      {
        headerName: "IC趋势",
        field: "icTrend",
        cellRenderer: SparklineCellRenderer,
        valueFormatter: EMPTY_VALUE_FORMATTER,
        sortable: false,
        filter: false,
        minWidth: 140,
        maxWidth: 160,
      },
      {
        headerName: "状态",
        field: "status",
        cellRenderer: StatusCellRenderer,
        cellDataType: "text",
        minWidth: 80,
        maxWidth: 90,
        filter: true,
      },
    ],
    []
  );

  return (
    <div className="ag-grid-mine" style={{ width: "100%" }}>
      <AgGridReact<LibraryFactor>
        theme={mineGridTheme}
        rowData={factors}
        columnDefs={columnDefs}
        defaultColDef={defaultColDef}
        getRowId={getRowId}
        rowHeight={46}
        headerHeight={44}
        animateRows
        suppressCellFocus
        domLayout="autoHeight"
        enableCellTextSelection
      />
    </div>
  );
}
