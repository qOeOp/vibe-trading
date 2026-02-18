/**
 * Pyodide Web Worker — runs Python code in the browser via WebAssembly.
 *
 * Protocol (legacy — backward compatible):
 *   IN:  { type: "INIT" }
 *   IN:  { type: "EXEC", code: string, id: string }
 *   IN:  { type: "LINT", code: string, id: string }
 *   OUT: { type: "INIT_START" }
 *   OUT: { type: "INIT_DONE", duration: number }
 *   OUT: { type: "INIT_ERROR", error: string }
 *   OUT: { type: "STDOUT", text: string, id: string }
 *   OUT: { type: "STDERR", text: string, id: string }
 *   OUT: { type: "EXEC_DONE", id: string, duration: number }
 *   OUT: { type: "EXEC_ERROR", id: string, error: string, traceback?: string }
 *   OUT: { type: "LINT_RESULT", id: string, diagnostics: Array }
 *
 * Protocol (cell-based — new):
 *   IN:  { type: "ANALYZE", code: string, id: string }
 *   IN:  { type: "EXEC_CELL", code: string, cellId: string, execId: string }
 *   IN:  { type: "INJECT_VT_DATA" }
 *   OUT: { type: "ANALYZE_RESULT", id: string, defines: string[], uses: string[] }
 *   OUT: { type: "CELL_STDOUT", text: string, cellId: string }
 *   OUT: { type: "CELL_STDERR", text: string, cellId: string }
 *   OUT: { type: "CELL_DONE", cellId: string, execId: string, duration: number, defines: string[] }
 *   OUT: { type: "CELL_ERROR", cellId: string, execId: string, error: string, traceback?: string }
 *   OUT: { type: "VT_DATA_READY" }
 */

/* global importScripts, loadPyodide */

const PYODIDE_CDN = "https://cdn.jsdelivr.net/pyodide/v0.27.5/full/";

let pyodide = null;
let initPromise = null;

/**
 * Lazily initialize Pyodide (idempotent — only loads once).
 * Returns the pyodide instance.
 */
async function ensureInit() {
  if (pyodide) return pyodide;

  // If already initializing, wait for that same promise
  if (initPromise) return initPromise;

  initPromise = (async () => {
    const t0 = performance.now();
    self.postMessage({ type: "INIT_START" });

    try {
      // Load the Pyodide bootstrap script from CDN
      importScripts(PYODIDE_CDN + "pyodide.js");

      pyodide = await loadPyodide({
        indexURL: PYODIDE_CDN,
        stdout: (text) => {
          // Will be overridden per-execution with id
        },
        stderr: (text) => {
          // Will be overridden per-execution with id
        },
      });

      // Pre-load scientific computing packages (built-in Pyodide wasm packages)
      // numpy + pandas are essential for quant research workflows
      self.postMessage({ type: "INIT_PROGRESS", stage: "packages" });
      await pyodide.loadPackage(["numpy", "pandas"]);

      // Install the AST analysis helper (used by ANALYZE and EXEC_CELL)
      pyodide.runPython(ANALYZE_HELPER_PY);

      const duration = Math.round(performance.now() - t0);
      self.postMessage({ type: "INIT_DONE", duration });
      return pyodide;
    } catch (err) {
      initPromise = null; // Allow retry on failure
      const msg = err instanceof Error ? err.message : String(err);
      self.postMessage({ type: "INIT_ERROR", error: msg });
      throw err;
    }
  })();

  return initPromise;
}

// ─── AST Analysis Helper (Python) ─────────────────────────

const ANALYZE_HELPER_PY = `
import ast
import json
import builtins

_BUILTIN_NAMES = set(dir(builtins))

def _vt_analyze(code_str):
    """
    Analyze Python code to extract top-level definitions and external references.
    Returns JSON: { "defines": [...], "uses": [...] }

    defines: variable names assigned at top-level, function/class defs
    uses: names referenced but not defined locally or in builtins
    """
    try:
        tree = ast.parse(code_str)
    except SyntaxError:
        return json.dumps({"defines": [], "uses": [], "error": "syntax_error"})

    defines = set()
    local_names = set()  # all names defined at any scope level

    # Pass 1: collect top-level definitions
    for node in ast.iter_child_nodes(tree):
        if isinstance(node, ast.Assign):
            for target in node.targets:
                if isinstance(target, ast.Name):
                    defines.add(target.id)
                elif isinstance(target, ast.Tuple):
                    for elt in target.elts:
                        if isinstance(elt, ast.Name):
                            defines.add(elt.id)
        elif isinstance(node, ast.AnnAssign) and isinstance(node.target, ast.Name):
            defines.add(node.target.id)
        elif isinstance(node, (ast.FunctionDef, ast.AsyncFunctionDef)):
            defines.add(node.name)
        elif isinstance(node, ast.ClassDef):
            defines.add(node.name)
        elif isinstance(node, ast.Import):
            for alias in node.names:
                name = alias.asname if alias.asname else alias.name.split('.')[0]
                defines.add(name)
        elif isinstance(node, ast.ImportFrom):
            for alias in node.names:
                name = alias.asname if alias.asname else alias.name
                defines.add(name)
        elif isinstance(node, (ast.AugAssign,)):
            if isinstance(node.target, ast.Name):
                defines.add(node.target.id)
        elif isinstance(node, ast.For):
            if isinstance(node.target, ast.Name):
                defines.add(node.target.id)

    # Pass 2: collect ALL defined names (including nested scopes)
    for node in ast.walk(tree):
        if isinstance(node, ast.Name) and isinstance(getattr(node, 'ctx', None), ast.Store):
            local_names.add(node.id)
        elif isinstance(node, (ast.FunctionDef, ast.AsyncFunctionDef)):
            local_names.add(node.name)
            for arg in node.args.args + node.args.posonlyargs + node.args.kwonlyargs:
                local_names.add(arg.arg)
            if node.args.vararg:
                local_names.add(node.args.vararg.arg)
            if node.args.kwarg:
                local_names.add(node.args.kwarg.arg)
        elif isinstance(node, ast.ClassDef):
            local_names.add(node.name)
        elif isinstance(node, ast.Import):
            for alias in node.names:
                local_names.add(alias.asname if alias.asname else alias.name.split('.')[0])
        elif isinstance(node, ast.ImportFrom):
            for alias in node.names:
                local_names.add(alias.asname if alias.asname else alias.name)

    # Pass 3: collect all Name references in Load context
    uses = set()
    for node in ast.walk(tree):
        if isinstance(node, ast.Name) and isinstance(node.ctx, ast.Load):
            uses.add(node.id)
        elif isinstance(node, ast.Attribute):
            # For x.y.z, only track the root 'x'
            root = node
            while isinstance(root, ast.Attribute):
                root = root.value
            if isinstance(root, ast.Name) and isinstance(root.ctx, ast.Load):
                uses.add(root.id)

    # External uses = referenced but not locally defined and not builtin
    external_uses = uses - local_names - _BUILTIN_NAMES - {'__name__', '__file__', '__doc__'}

    return json.dumps({
        "defines": sorted(defines),
        "uses": sorted(external_uses)
    })
`;

// ─── VT Data Module (Python mock) ─────────────────────────

const VT_DATA_MODULE_PY = `
import sys
from types import ModuleType
import numpy as np
import pandas as pd

# ─── Create vt_data module ──────────────────────────────

vt_data = ModuleType("vt_data")
vt_data.__doc__ = "Vibe Trading Data Hub — platform data access layer"

# ── Constants ──

_N_DAYS = 1220       # ~5 years of trading days
_N_STOCKS = 300      # HS300 universe size
_DATE_RANGE = ("2021-01-04", "2025-12-31")
_RNG = np.random.RandomState(42)

# ── Price Data ──

def _load_prices(universe="hs300", start=None, end=None):
    """
    加载 OHLCV 价格数据

    Returns: (close, open, high, low, vwap)
    Shape: (trading_days, n_stocks)
    """
    base = np.cumsum(_RNG.randn(_N_DAYS, _N_STOCKS) * 0.02, axis=0) + 100
    close = base.copy()
    open_ = base + _RNG.randn(_N_DAYS, _N_STOCKS) * 0.5
    high = np.maximum(close, open_) + np.abs(_RNG.randn(_N_DAYS, _N_STOCKS) * 0.3)
    low = np.minimum(close, open_) - np.abs(_RNG.randn(_N_DAYS, _N_STOCKS) * 0.3)
    vwap = (high + low + close) / 3.0
    return close, open_, high, low, vwap

vt_data.load_prices = _load_prices

# ── Volume Data ──

def _load_volume(universe="hs300", start=None, end=None):
    """
    加载成交量数据

    Returns: (volume, amount, turn)
    Shape: (trading_days, n_stocks)
    """
    volume = np.abs(_RNG.randn(_N_DAYS, _N_STOCKS) * 1e6 + 5e6)
    # amount ≈ volume * avg_price
    amount = volume * (100 + _RNG.randn(_N_DAYS, _N_STOCKS) * 5)
    # turnover rate: 0.5% ~ 5%
    turn = np.abs(_RNG.randn(_N_DAYS, _N_STOCKS) * 0.01 + 0.02)
    return volume, amount, turn

vt_data.load_volume = _load_volume

# ── Fundamental Data ──

def _load_fundamentals(universe="hs300", start=None, end=None):
    """
    加载基本面数据

    Returns: (mkt_cap, pe, pb, roe)
    Shape: (trading_days, n_stocks)
    """
    mkt_cap = np.abs(_RNG.randn(_N_DAYS, _N_STOCKS) * 50 + 200) * 1e8  # 亿元
    pe = np.abs(_RNG.randn(_N_DAYS, _N_STOCKS) * 10 + 20)
    pb = np.abs(_RNG.randn(_N_DAYS, _N_STOCKS) * 1.5 + 3)
    roe = _RNG.randn(_N_DAYS, _N_STOCKS) * 0.05 + 0.12
    return mkt_cap, pe, pb, roe

vt_data.load_fundamentals = _load_fundamentals

# ── Industry Classification ──

def _load_industry(universe="hs300"):
    """
    加载行业分类

    Returns: (industry, sector)
    industry: ndarray of shape (n_stocks,) with industry codes (0-30)
    sector: ndarray of shape (n_stocks,) with sector codes (0-10)
    """
    industry = _RNG.randint(0, 31, size=_N_STOCKS)
    sector = industry // 3  # coarser grouping
    return industry, sector

vt_data.load_industry = _load_industry

# ── Returns ──

def _load_returns(universe="hs300", start=None, end=None):
    """
    加载日收益率

    Returns: ndarray of shape (trading_days, n_stocks)
    """
    return _RNG.randn(_N_DAYS, _N_STOCKS) * 0.025

vt_data.load_returns = _load_returns

# ── Factor Tools ──

def _rank(arr, axis=1):
    """截面排名百分位 (0~1)"""
    ranks = np.argsort(np.argsort(arr, axis=axis), axis=axis)
    return ranks / (arr.shape[axis] - 1)

def _zscore(arr, axis=1):
    """截面 Z-score 标准化"""
    mu = np.nanmean(arr, axis=axis, keepdims=True)
    sigma = np.nanstd(arr, axis=axis, keepdims=True)
    sigma = np.where(sigma < 1e-10, 1.0, sigma)
    return (arr - mu) / sigma

def _neutralize(factor, industry, mkt_cap=None):
    """因子中性化 (行业 + 可选市值)"""
    result = factor.copy()
    for ind_code in np.unique(industry):
        mask = industry == ind_code
        if mask.sum() < 2:
            continue
        subset = factor[:, mask]
        result[:, mask] = subset - np.nanmean(subset, axis=1, keepdims=True)
    return result

def _ts_mean(arr, window):
    """时序滚动均值"""
    result = np.full_like(arr, np.nan, dtype=float)
    for t in range(window - 1, arr.shape[0]):
        result[t] = np.nanmean(arr[t - window + 1:t + 1], axis=0)
    return result

def _ts_std(arr, window):
    """时序滚动标准差"""
    result = np.full_like(arr, np.nan, dtype=float)
    for t in range(window - 1, arr.shape[0]):
        result[t] = np.nanstd(arr[t - window + 1:t + 1], axis=0)
    return result

def _ts_corr(x, y, window):
    """时序滚动相关系数"""
    n = x.shape[0]
    result = np.full_like(x, np.nan, dtype=float)
    for t in range(window - 1, n):
        xw = x[t - window + 1:t + 1]
        yw = y[t - window + 1:t + 1]
        # Per-column correlation
        xm = xw - np.nanmean(xw, axis=0, keepdims=True)
        ym = yw - np.nanmean(yw, axis=0, keepdims=True)
        num = np.nansum(xm * ym, axis=0)
        den = np.sqrt(np.nansum(xm**2, axis=0) * np.nansum(ym**2, axis=0))
        den = np.where(den < 1e-10, 1.0, den)
        result[t] = num / den
    return result

def _ts_rank(arr, window):
    """时序滚动排名百分位"""
    result = np.full_like(arr, np.nan, dtype=float)
    for t in range(window - 1, arr.shape[0]):
        w = arr[t - window + 1:t + 1]
        ranks = np.argsort(np.argsort(w, axis=0), axis=0)
        result[t] = ranks[-1] / (window - 1)
    return result

def _ts_sum(arr, window):
    """时序滚动求和"""
    result = np.full_like(arr, np.nan, dtype=float)
    for t in range(window - 1, arr.shape[0]):
        result[t] = np.nansum(arr[t - window + 1:t + 1], axis=0)
    return result

def _ts_max(arr, window):
    """时序滚动最大值"""
    result = np.full_like(arr, np.nan, dtype=float)
    for t in range(window - 1, arr.shape[0]):
        result[t] = np.nanmax(arr[t - window + 1:t + 1], axis=0)
    return result

def _ts_min(arr, window):
    """时序滚动最小值"""
    result = np.full_like(arr, np.nan, dtype=float)
    for t in range(window - 1, arr.shape[0]):
        result[t] = np.nanmin(arr[t - window + 1:t + 1], axis=0)
    return result

def _ts_delta(arr, period=1):
    """时序差分"""
    result = np.full_like(arr, np.nan, dtype=float)
    result[period:] = arr[period:] - arr[:-period]
    return result

def _ts_argmax(arr, window):
    """时序滚动 argmax (距最大值的天数)"""
    result = np.full_like(arr, np.nan, dtype=float)
    for t in range(window - 1, arr.shape[0]):
        w = arr[t - window + 1:t + 1]
        result[t] = window - 1 - np.nanargmax(w, axis=0)
    return result

def _ts_argmin(arr, window):
    """时序滚动 argmin (距最小值的天数)"""
    result = np.full_like(arr, np.nan, dtype=float)
    for t in range(window - 1, arr.shape[0]):
        w = arr[t - window + 1:t + 1]
        result[t] = window - 1 - np.nanargmin(w, axis=0)
    return result

def _ts_product(arr, window):
    """时序滚动乘积"""
    result = np.full_like(arr, np.nan, dtype=float)
    for t in range(window - 1, arr.shape[0]):
        result[t] = np.nanprod(arr[t - window + 1:t + 1], axis=0)
    return result

def _delay(arr, period=1):
    """滞后算子"""
    result = np.full_like(arr, np.nan, dtype=float)
    if period > 0:
        result[period:] = arr[:-period]
    return result

def _winsorize(arr, lower=0.01, upper=0.99):
    """缩尾处理"""
    result = arr.copy()
    for col in range(arr.shape[1]):
        lo = np.nanquantile(arr[:, col], lower)
        hi = np.nanquantile(arr[:, col], upper)
        result[:, col] = np.clip(arr[:, col], lo, hi)
    return result

# Register all tools on vt_data module
vt_data.rank = _rank
vt_data.zscore = _zscore
vt_data.neutralize = _neutralize
vt_data.ts_mean = _ts_mean
vt_data.ts_std = _ts_std
vt_data.ts_corr = _ts_corr
vt_data.ts_rank = _ts_rank
vt_data.ts_sum = _ts_sum
vt_data.ts_max = _ts_max
vt_data.ts_min = _ts_min
vt_data.ts_delta = _ts_delta
vt_data.ts_argmax = _ts_argmax
vt_data.ts_argmin = _ts_argmin
vt_data.ts_product = _ts_product
vt_data.delay = _delay
vt_data.winsorize = _winsorize

# ── Metadata for platform cells ──

vt_data.N_DAYS = _N_DAYS
vt_data.N_STOCKS = _N_STOCKS
vt_data.DATE_RANGE = _DATE_RANGE

# Register module
sys.modules["vt_data"] = vt_data
`;

/**
 * Inject the vt_data mock module into the Pyodide namespace.
 */
async function injectVTData() {
  const py = await ensureInit();
  try {
    await py.runPythonAsync(VT_DATA_MODULE_PY);
    self.postMessage({ type: "VT_DATA_READY" });
  } catch (err) {
    const error = err instanceof Error ? err.message : String(err);
    self.postMessage({ type: "VT_DATA_ERROR", error });
  }
}

/**
 * Execute Python code and stream stdout/stderr back to the main thread.
 * (Legacy — backward compatible with existing Lab)
 */
async function executeCode(code, id) {
  const py = await ensureInit();
  const t0 = performance.now();

  // Wire up stdout/stderr to forward to main thread with exec id
  py.setStdout({
    batched: (text) => {
      self.postMessage({ type: "STDOUT", text, id });
    },
  });

  py.setStderr({
    batched: (text) => {
      self.postMessage({ type: "STDERR", text, id });
    },
  });

  try {
    await py.runPythonAsync(code);
    const duration = Math.round(performance.now() - t0);
    self.postMessage({ type: "EXEC_DONE", id, duration });
  } catch (err) {
    const error = err instanceof Error ? err.message : String(err);
    // Try to extract Python traceback
    let traceback;
    if (err && typeof err === "object" && "message" in err) {
      traceback = err.message;
    }
    self.postMessage({ type: "EXEC_ERROR", id, error, traceback });
  }
}

/**
 * Analyze Python code using AST — extract defines and uses.
 * Returns { defines: string[], uses: string[] }
 */
async function analyzeCode(code, id) {
  const py = await ensureInit();

  try {
    const result = py.runPython(`_vt_analyze(${JSON.stringify(code)})`);
    const parsed = JSON.parse(result);
    self.postMessage({
      type: "ANALYZE_RESULT",
      id,
      defines: parsed.defines || [],
      uses: parsed.uses || [],
    });
  } catch (err) {
    // On failure, return empty analysis
    self.postMessage({
      type: "ANALYZE_RESULT",
      id,
      defines: [],
      uses: [],
    });
  }
}

/**
 * Execute a single cell's code with cell-specific stdout/stderr routing.
 * All cells share the same Python globals() namespace.
 * After execution, re-analyzes the code to return final defines.
 */
async function executeCellCode(code, cellId, execId) {
  const py = await ensureInit();
  const t0 = performance.now();

  // Route stdout/stderr to cell-specific messages
  py.setStdout({
    batched: (text) => {
      self.postMessage({ type: "CELL_STDOUT", text, cellId });
    },
  });

  py.setStderr({
    batched: (text) => {
      self.postMessage({ type: "CELL_STDERR", text, cellId });
    },
  });

  try {
    await py.runPythonAsync(code);
    const duration = Math.round(performance.now() - t0);

    // Re-analyze to get final defines (may differ from pre-analysis if code is dynamic)
    let defines = [];
    try {
      const result = py.runPython(`_vt_analyze(${JSON.stringify(code)})`);
      const parsed = JSON.parse(result);
      defines = parsed.defines || [];
    } catch {
      // Analysis failure is non-fatal
    }

    self.postMessage({ type: "CELL_DONE", cellId, execId, duration, defines });
  } catch (err) {
    const error = err instanceof Error ? err.message : String(err);
    let traceback;
    if (err && typeof err === "object" && "message" in err) {
      traceback = err.message;
    }
    self.postMessage({ type: "CELL_ERROR", cellId, execId, error, traceback });
  }
}

/**
 * Lint Python code using ast.parse() — returns syntax diagnostics.
 * This is extremely fast (~1ms) and non-blocking.
 */
async function lintCode(code, id) {
  const py = await ensureInit();

  try {
    // Use Python's ast.parse() to check syntax
    const result = py.runPython(`
import ast, json

def _vt_lint(code_str):
    diagnostics = []
    try:
        ast.parse(code_str)
    except SyntaxError as e:
        line = e.lineno or 1
        col = (e.offset or 1)
        end_line = getattr(e, 'end_lineno', None) or line
        end_col = getattr(e, 'end_offset', None) or col
        diagnostics.append({
            "line": line,
            "col": col,
            "endLine": end_line,
            "endCol": end_col,
            "severity": "error",
            "message": e.msg or str(e)
        })
    return json.dumps(diagnostics)

_vt_lint(${JSON.stringify(code)})
`);

    const diagnostics = JSON.parse(result);
    self.postMessage({ type: "LINT_RESULT", id, diagnostics });
  } catch (err) {
    // If linting itself fails, return empty diagnostics
    self.postMessage({ type: "LINT_RESULT", id, diagnostics: [] });
  }
}

// ─── Message Handler ──────────────────────────────────────

self.onmessage = async function (event) {
  const msg = event.data;

  switch (msg.type) {
    case "INIT":
      try {
        await ensureInit();
      } catch {
        // Error already sent via postMessage in ensureInit
      }
      break;

    case "EXEC":
      try {
        await executeCode(msg.code, msg.id);
      } catch {
        // Error already sent via postMessage in executeCode
      }
      break;

    case "LINT":
      try {
        await lintCode(msg.code, msg.id);
      } catch {
        // Return empty diagnostics on failure
        self.postMessage({ type: "LINT_RESULT", id: msg.id, diagnostics: [] });
      }
      break;

    case "ANALYZE":
      try {
        await analyzeCode(msg.code, msg.id);
      } catch {
        self.postMessage({
          type: "ANALYZE_RESULT",
          id: msg.id,
          defines: [],
          uses: [],
        });
      }
      break;

    case "EXEC_CELL":
      try {
        await executeCellCode(msg.code, msg.cellId, msg.execId);
      } catch {
        // Error already sent via postMessage in executeCellCode
      }
      break;

    case "INJECT_VT_DATA":
      try {
        await injectVTData();
      } catch {
        // Error already sent via postMessage in injectVTData
      }
      break;

    default:
      console.warn("[pyodide-worker] Unknown message type:", msg.type);
  }
};
