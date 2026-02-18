/**
 * data-catalog.ts — Browsable data catalog for the Lab sidebar
 *
 * Defines all pre-loaded platform data (market data, fundamentals,
 * classification) and factor tools (cross-section, time-series,
 * data processing) that users can discover and insert into cells.
 */

// ─── Types ──────────────────────────────────────────────

export type CatalogItemKind = "variable" | "function" | "category";

export interface CatalogVariable {
  kind: "variable";
  name: string;
  dtype: string;
  shape: string;
  description: string;
  /** Python code to insert when clicked */
  insertCode?: string;
}

export interface CatalogFunction {
  kind: "function";
  name: string;
  signature: string;
  returnType: string;
  description: string;
  example: string;
  /** Python code to insert when clicked */
  insertCode?: string;
}

export interface CatalogCategory {
  kind: "category";
  name: string;
  icon: string;
  description: string;
  children: CatalogItem[];
}

export type CatalogItem = CatalogVariable | CatalogFunction | CatalogCategory;

// ─── Market Data ────────────────────────────────────────

const marketData: CatalogCategory = {
  kind: "category",
  name: "行情数据",
  icon: "📈",
  description: "日频行情数据，shape = (交易日数, 股票数)",
  children: [
    {
      kind: "variable",
      name: "close",
      dtype: "float64",
      shape: "(T, N)",
      description: "日收盘价",
      insertCode: "from vt_data import load_prices\nclose, open_, high, low, vwap = load_prices()",
    },
    {
      kind: "variable",
      name: "open",
      dtype: "float64",
      shape: "(T, N)",
      description: "日开盘价",
    },
    {
      kind: "variable",
      name: "high",
      dtype: "float64",
      shape: "(T, N)",
      description: "日最高价",
    },
    {
      kind: "variable",
      name: "low",
      dtype: "float64",
      shape: "(T, N)",
      description: "日最低价",
    },
    {
      kind: "variable",
      name: "vwap",
      dtype: "float64",
      shape: "(T, N)",
      description: "成交量加权均价",
    },
    {
      kind: "variable",
      name: "volume",
      dtype: "float64",
      shape: "(T, N)",
      description: "成交量（手）",
      insertCode: "from vt_data import load_volume\nvolume, amount, turn = load_volume()",
    },
    {
      kind: "variable",
      name: "amount",
      dtype: "float64",
      shape: "(T, N)",
      description: "成交额（元）",
    },
    {
      kind: "variable",
      name: "turn",
      dtype: "float64",
      shape: "(T, N)",
      description: "换手率",
    },
  ],
};

// ─── Fundamentals ───────────────────────────────────────

const fundamentals: CatalogCategory = {
  kind: "category",
  name: "基本面",
  icon: "📋",
  description: "基本面指标，shape = (交易日数, 股票数)",
  children: [
    {
      kind: "variable",
      name: "mkt_cap",
      dtype: "float64",
      shape: "(T, N)",
      description: "总市值",
      insertCode: "from vt_data import load_fundamentals\nmkt_cap, pe, pb, roe = load_fundamentals()",
    },
    {
      kind: "variable",
      name: "pe",
      dtype: "float64",
      shape: "(T, N)",
      description: "市盈率（TTM）",
    },
    {
      kind: "variable",
      name: "pb",
      dtype: "float64",
      shape: "(T, N)",
      description: "市净率",
    },
    {
      kind: "variable",
      name: "roe",
      dtype: "float64",
      shape: "(T, N)",
      description: "净资产收益率（TTM）",
    },
  ],
};

// ─── Classification ─────────────────────────────────────

const classification: CatalogCategory = {
  kind: "category",
  name: "分类",
  icon: "🏭",
  description: "股票分类信息",
  children: [
    {
      kind: "variable",
      name: "industry",
      dtype: "str",
      shape: "(N,)",
      description: "申万一级行业",
      insertCode: "from vt_data import load_classification\nindustry, sector = load_classification()",
    },
    {
      kind: "variable",
      name: "sector",
      dtype: "str",
      shape: "(N,)",
      description: "板块分类",
    },
  ],
};

// ─── Factor Tools: Cross-Section ────────────────────────

const crossSectionOps: CatalogCategory = {
  kind: "category",
  name: "截面算子",
  icon: "📐",
  description: "对每个截面（同一天的所有股票）进行运算",
  children: [
    {
      kind: "function",
      name: "rank",
      signature: "rank(x)",
      returnType: "ndarray",
      description: "截面排名，归一化到 [0, 1]",
      example: "factor = rank(close / delay(close, 20) - 1)",
      insertCode: "from vt_data import rank\nfactor = rank(x)",
    },
    {
      kind: "function",
      name: "zscore",
      signature: "zscore(x)",
      returnType: "ndarray",
      description: "截面标准化（均值=0，标准差=1）",
      example: "factor = zscore(pe)",
      insertCode: "from vt_data import zscore\nfactor = zscore(x)",
    },
    {
      kind: "function",
      name: "neutralize",
      signature: "neutralize(x, groups)",
      returnType: "ndarray",
      description: "分组中性化（去除组间差异）",
      example: "factor = neutralize(raw_factor, industry)",
      insertCode: "from vt_data import neutralize\nfactor = neutralize(x, industry)",
    },
  ],
};

// ─── Factor Tools: Time-Series ──────────────────────────

const timeSeriesOps: CatalogCategory = {
  kind: "category",
  name: "时序算子",
  icon: "⏳",
  description: "对每只股票的时间序列进行运算",
  children: [
    {
      kind: "function",
      name: "ts_mean",
      signature: "ts_mean(x, d)",
      returnType: "ndarray",
      description: "过去 d 日的滚动均值",
      example: "ma20 = ts_mean(close, 20)",
      insertCode: "from vt_data import ts_mean",
    },
    {
      kind: "function",
      name: "ts_std",
      signature: "ts_std(x, d)",
      returnType: "ndarray",
      description: "过去 d 日的滚动标准差",
      example: "vol = ts_std(close / delay(close, 1) - 1, 20)",
      insertCode: "from vt_data import ts_std",
    },
    {
      kind: "function",
      name: "ts_corr",
      signature: "ts_corr(x, y, d)",
      returnType: "ndarray",
      description: "过去 d 日的滚动相关系数",
      example: "corr = ts_corr(volume, close, 10)",
      insertCode: "from vt_data import ts_corr",
    },
    {
      kind: "function",
      name: "ts_rank",
      signature: "ts_rank(x, d)",
      returnType: "ndarray",
      description: "过去 d 日内的排名（归一化到 [0,1]）",
      example: "tr = ts_rank(turn, 20)",
      insertCode: "from vt_data import ts_rank",
    },
    {
      kind: "function",
      name: "ts_max",
      signature: "ts_max(x, d)",
      returnType: "ndarray",
      description: "过去 d 日的最大值",
      example: "high20 = ts_max(high, 20)",
      insertCode: "from vt_data import ts_max",
    },
    {
      kind: "function",
      name: "ts_min",
      signature: "ts_min(x, d)",
      returnType: "ndarray",
      description: "过去 d 日的最小值",
      example: "low20 = ts_min(low, 20)",
      insertCode: "from vt_data import ts_min",
    },
    {
      kind: "function",
      name: "ts_sum",
      signature: "ts_sum(x, d)",
      returnType: "ndarray",
      description: "过去 d 日的累计和",
      example: "vol_sum = ts_sum(volume, 5)",
      insertCode: "from vt_data import ts_sum",
    },
  ],
};

// ─── Factor Tools: Data Processing ──────────────────────

const dataProcessing: CatalogCategory = {
  kind: "category",
  name: "数据处理",
  icon: "🔧",
  description: "数据清洗与预处理工具",
  children: [
    {
      kind: "function",
      name: "winsorize",
      signature: "winsorize(x, lower, upper)",
      returnType: "ndarray",
      description: "缩尾处理，将极端值截断到分位数范围",
      example: 'factor = winsorize(raw, 0.025, 0.975)',
      insertCode: "from vt_data import winsorize\nfactor = winsorize(x, 0.025, 0.975)",
    },
    {
      kind: "function",
      name: "delay",
      signature: "delay(x, d)",
      returnType: "ndarray",
      description: "将数据延迟 d 期（用于构建收益率）",
      example: "ret = close / delay(close, 1) - 1",
      insertCode: "from vt_data import delay",
    },
  ],
};

// ─── Factor Tools Root ──────────────────────────────────

const factorTools: CatalogCategory = {
  kind: "category",
  name: "因子工具",
  icon: "📐",
  description: "量化因子构建和处理函数",
  children: [crossSectionOps, timeSeriesOps, dataProcessing],
};

// ─── Public API ─────────────────────────────────────────

/** The full data catalog tree for the sidebar panel */
export const DATA_CATALOG: CatalogCategory[] = [
  marketData,
  fundamentals,
  classification,
  factorTools,
];

/** Flat list of all searchable items (for search/filter) */
export function flattenCatalog(
  items: CatalogItem[],
): (CatalogVariable | CatalogFunction)[] {
  const result: (CatalogVariable | CatalogFunction)[] = [];

  function walk(list: CatalogItem[]) {
    for (const item of list) {
      if (item.kind === "category") {
        walk(item.children);
      } else {
        result.push(item);
      }
    }
  }

  walk(items);
  return result;
}
