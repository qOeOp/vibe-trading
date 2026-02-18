import type { CompletionContext, CompletionResult, Completion } from "@codemirror/autocomplete";

// ─── VT API Functions ────────────────────────────────────
// Priority: highest (boost: 2) — platform-specific APIs

const VT_API_COMPLETIONS: Completion[] = [
  { label: "get_universe", type: "function", detail: "获取股票池", boost: 2 },
  { label: "get_factor_data", type: "function", detail: "获取因子数据", boost: 2 },
  { label: "rank", type: "function", detail: "截面排序" },
  { label: "zscore", type: "function", detail: "Z-score 标准化" },
  { label: "ts_mean", type: "function", detail: "时序均值" },
  { label: "ts_std", type: "function", detail: "时序标准差" },
  { label: "ts_corr", type: "function", detail: "时序相关性" },
  { label: "ts_rank", type: "function", detail: "时序排序" },
  { label: "ts_sum", type: "function", detail: "时序求和" },
  { label: "ts_max", type: "function", detail: "时序最大值" },
  { label: "ts_min", type: "function", detail: "时序最小值" },
  { label: "ts_delta", type: "function", detail: "时序差分" },
  { label: "ts_argmax", type: "function", detail: "时序 argmax" },
  { label: "ts_argmin", type: "function", detail: "时序 argmin" },
  { label: "ts_product", type: "function", detail: "时序乘积" },
  { label: "delay", type: "function", detail: "滞后算子" },
  { label: "neutralize", type: "function", detail: "因子中性化" },
];

// ─── Data Variables ──────────────────────────────────────
// Priority: high (boost: -1)

const DATA_VARIABLES: Completion[] = [
  { label: "close", type: "variable", detail: "收盘价", boost: -1 },
  { label: "open", type: "variable", detail: "开盘价", boost: -1 },
  { label: "high", type: "variable", detail: "最高价", boost: -1 },
  { label: "low", type: "variable", detail: "最低价", boost: -1 },
  { label: "vwap", type: "variable", detail: "成交量加权均价", boost: -1 },
  { label: "volume", type: "variable", detail: "成交量", boost: -1 },
  { label: "amount", type: "variable", detail: "成交额", boost: -1 },
  { label: "turn", type: "variable", detail: "换手率", boost: -1 },
  { label: "returns", type: "variable", detail: "日收益率", boost: -1 },
  { label: "mkt_cap", type: "variable", detail: "总市值", boost: -1 },
  { label: "industry", type: "variable", detail: "行业分类", boost: -1 },
];

// ─── NumPy / Pandas Common ───────────────────────────────
// Priority: medium (boost: -2)

const NUMPY_PANDAS: Completion[] = [
  { label: "np", type: "variable", detail: "numpy", boost: -2 },
  { label: "pd", type: "variable", detail: "pandas", boost: -2 },
  { label: "np.array", type: "function", detail: "numpy array", boost: -2 },
  { label: "np.mean", type: "function", detail: "numpy mean", boost: -2 },
  { label: "np.std", type: "function", detail: "numpy std", boost: -2 },
  { label: "np.log", type: "function", detail: "numpy log", boost: -2 },
  { label: "np.exp", type: "function", detail: "numpy exp", boost: -2 },
  { label: "np.abs", type: "function", detail: "numpy abs", boost: -2 },
  { label: "np.sqrt", type: "function", detail: "numpy sqrt", boost: -2 },
  { label: "np.where", type: "function", detail: "numpy where", boost: -2 },
  { label: "np.nan", type: "constant", detail: "Not a Number", boost: -2 },
  { label: "np.inf", type: "constant", detail: "Infinity", boost: -2 },
  { label: "pd.DataFrame", type: "class", detail: "pandas DataFrame", boost: -2 },
  { label: "pd.Series", type: "class", detail: "pandas Series", boost: -2 },
  { label: "pd.concat", type: "function", detail: "pandas concat", boost: -2 },
];

// ─── Python Keywords ─────────────────────────────────────
// Priority: low (boost: -3) — Python's built-in syntax

const PYTHON_KEYWORDS: Completion[] = [
  "and", "as", "assert", "async", "await", "break", "class",
  "continue", "def", "del", "elif", "else", "except", "finally",
  "for", "from", "global", "if", "import", "in", "is", "lambda",
  "nonlocal", "not", "or", "pass", "raise", "return", "try",
  "while", "with", "yield", "True", "False", "None",
].map((kw) => ({
  label: kw,
  type: "keyword" as const,
  boost: -3,
}));

// ─── Python Builtins ─────────────────────────────────────
// Priority: lowest (boost: -4)

const PYTHON_BUILTINS: Completion[] = [
  "abs", "all", "any", "bool", "dict", "enumerate", "filter",
  "float", "format", "frozenset", "getattr", "hasattr", "hash",
  "int", "isinstance", "issubclass", "iter", "len", "list",
  "map", "max", "min", "next", "object", "open", "print",
  "range", "repr", "reversed", "round", "set", "slice",
  "sorted", "str", "sum", "super", "tuple", "type", "zip",
].map((fn) => ({
  label: fn,
  type: "function" as const,
  detail: "builtin",
  boost: -4,
}));

// ─── All Completions (merged) ────────────────────────────

const ALL_COMPLETIONS: Completion[] = [
  ...VT_API_COMPLETIONS,
  ...DATA_VARIABLES,
  ...NUMPY_PANDAS,
  ...PYTHON_KEYWORDS,
  ...PYTHON_BUILTINS,
];

// ─── Completion Source ───────────────────────────────────

export function vtCompletionSource(
  context: CompletionContext,
): CompletionResult | null {
  const word = context.matchBefore(/[\w.]*/);
  if (!word || (word.from === word.to && !context.explicit)) return null;
  return { from: word.from, options: ALL_COMPLETIONS };
}
