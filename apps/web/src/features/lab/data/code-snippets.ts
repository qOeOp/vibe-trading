/**
 * code-snippets.ts — Pre-built factor templates for the Lab sidebar
 *
 * Each snippet can be inserted as a new cell (or set of cells)
 * into the notebook workspace.
 */

// ─── Types ──────────────────────────────────────────────

export interface CodeSnippet {
  id: string;
  name: string;
  description: string;
  /** Code cells to insert (each string becomes one cell) */
  cells: string[];
  tags: string[];
}

export interface SnippetCategory {
  name: string;
  icon: string;
  description: string;
  snippets: CodeSnippet[];
}

// ─── Quick Start ────────────────────────────────────────

const quickStart: SnippetCategory = {
  name: "快速开始",
  icon: "🚀",
  description: "完整的因子开发模板",
  snippets: [
    {
      id: "basic-factor-template",
      name: "基础因子模板",
      description: "加载数据 → 构建因子 → 标准化 → 检验",
      tags: ["template", "beginner"],
      cells: [
        `# 加载行情数据
from vt_data import load_prices, delay
close, open_, high, low, vwap = load_prices()`,

        `# 构建因子：20日动量
returns_20d = close / delay(close, 20) - 1
factor = returns_20d`,

        `# 标准预处理
from vt_data import winsorize, zscore, neutralize, load_classification
industry, sector = load_classification()

factor = winsorize(factor, 0.025, 0.975)
factor = zscore(factor)
factor = neutralize(factor, industry)`,

        `# 查看因子统计
import numpy as np
print(f"因子 shape: {factor.shape}")
print(f"均值: {np.nanmean(factor):.4f}")
print(f"标准差: {np.nanstd(factor):.4f}")
print(f"非空比例: {1 - np.isnan(factor).mean():.2%}")`,
      ],
    },
  ],
};

// ─── Factor Construction ────────────────────────────────

const factorConstruction: SnippetCategory = {
  name: "因子构建",
  icon: "📊",
  description: "常见量化因子的实现",
  snippets: [
    {
      id: "momentum-factor",
      name: "动量因子",
      description: "过去 N 日的价格涨幅",
      tags: ["momentum", "price"],
      cells: [
        `# 动量因子
from vt_data import load_prices, delay, rank
close, open_, high, low, vwap = load_prices()

momentum_20 = close / delay(close, 20) - 1
factor = rank(momentum_20)`,
      ],
    },
    {
      id: "reversal-factor",
      name: "反转因子",
      description: "短期收益率反转（5日均收益的负值）",
      tags: ["reversal", "mean-reversion"],
      cells: [
        `# 反转因子
from vt_data import load_prices, delay, ts_mean
close, open_, high, low, vwap = load_prices()

daily_ret = close / delay(close, 1) - 1
factor = -ts_mean(daily_ret, 5)`,
      ],
    },
    {
      id: "volatility-factor",
      name: "波动率因子",
      description: "20日收益率标准差",
      tags: ["volatility", "risk"],
      cells: [
        `# 波动率因子
from vt_data import load_prices, delay, ts_std
close, open_, high, low, vwap = load_prices()

daily_ret = close / delay(close, 1) - 1
factor = ts_std(daily_ret, 20)`,
      ],
    },
    {
      id: "turnover-factor",
      name: "换手率因子",
      description: "20日平均换手率排名",
      tags: ["turnover", "liquidity"],
      cells: [
        `# 换手率因子
from vt_data import load_volume, ts_mean, rank
volume, amount, turn = load_volume()

factor = rank(ts_mean(turn, 20))`,
      ],
    },
    {
      id: "volume-price-corr",
      name: "量价相关因子",
      description: "成交量与价格变动的10日相关系数",
      tags: ["volume", "price", "correlation"],
      cells: [
        `# 量价相关因子
from vt_data import load_prices, load_volume, delay, ts_corr
close, open_, high, low, vwap = load_prices()
volume, amount, turn = load_volume()

daily_ret = close / delay(close, 1) - 1
factor = ts_corr(volume, daily_ret, 10)`,
      ],
    },
  ],
};

// ─── Preprocessing ──────────────────────────────────────

const preprocessing: SnippetCategory = {
  name: "预处理",
  icon: "📐",
  description: "因子标准化和中性化流程",
  snippets: [
    {
      id: "standard-preprocess",
      name: "标准预处理流程",
      description: "缩尾 → 标准化 → 行业中性化",
      tags: ["preprocessing", "neutralize"],
      cells: [
        `# 标准预处理流程
from vt_data import winsorize, zscore, neutralize, load_classification
industry, sector = load_classification()

# 1. 缩尾（去极端值）
factor = winsorize(factor, 0.025, 0.975)
# 2. 截面标准化
factor = zscore(factor)
# 3. 行业中性化
factor = neutralize(factor, industry)`,
      ],
    },
    {
      id: "industry-neutral",
      name: "行业中性化",
      description: "去除行业间差异",
      tags: ["neutralize", "industry"],
      cells: [
        `# 行业中性化
from vt_data import neutralize, load_classification
industry, sector = load_classification()

factor = neutralize(factor, industry)`,
      ],
    },
    {
      id: "cap-neutral",
      name: "市值中性化",
      description: "去除市值效应",
      tags: ["neutralize", "market-cap"],
      cells: [
        `# 市值中性化
from vt_data import neutralize, rank, load_fundamentals
mkt_cap, pe, pb, roe = load_fundamentals()

factor = neutralize(factor, rank(mkt_cap))`,
      ],
    },
  ],
};

// ─── Validation ─────────────────────────────────────────

const validation: SnippetCategory = {
  name: "检验",
  icon: "📋",
  description: "因子检验和回测分析",
  snippets: [
    {
      id: "ic-analysis",
      name: "IC 分析",
      description: "计算因子 IC 时间序列和统计量",
      tags: ["ic", "validation"],
      cells: [
        `# IC 分析
import numpy as np
from vt_data import load_prices, delay

close, open_, high, low, vwap = load_prices()
fwd_ret = delay(close, -1) / close - 1  # 未来1日收益

# 逐日计算 Rank IC
from scipy.stats import spearmanr
ic_series = []
for t in range(factor.shape[0]):
    mask = ~np.isnan(factor[t]) & ~np.isnan(fwd_ret[t])
    if mask.sum() > 30:
        ic, _ = spearmanr(factor[t, mask], fwd_ret[t, mask])
        ic_series.append(ic)

ic_arr = np.array(ic_series)
print(f"IC Mean: {ic_arr.mean():.4f}")
print(f"IC Std:  {ic_arr.std():.4f}")
print(f"IR:      {ic_arr.mean() / ic_arr.std():.4f}")
print(f"IC > 0:  {(ic_arr > 0).mean():.2%}")`,
      ],
    },
    {
      id: "quantile-returns",
      name: "分层回测",
      description: "按因子分5组，观察各组收益",
      tags: ["quantile", "backtest"],
      cells: [
        `# 分层回测
import numpy as np
from vt_data import load_prices, delay

close, open_, high, low, vwap = load_prices()
fwd_ret = delay(close, -1) / close - 1

n_groups = 5
group_returns = {i: [] for i in range(n_groups)}

for t in range(factor.shape[0]):
    mask = ~np.isnan(factor[t]) & ~np.isnan(fwd_ret[t])
    if mask.sum() < n_groups * 10:
        continue
    vals = factor[t, mask]
    rets = fwd_ret[t, mask]
    quantiles = np.percentile(vals, np.linspace(0, 100, n_groups + 1))
    for g in range(n_groups):
        lo, hi = quantiles[g], quantiles[g + 1]
        if g == n_groups - 1:
            sel = (vals >= lo) & (vals <= hi)
        else:
            sel = (vals >= lo) & (vals < hi)
        if sel.sum() > 0:
            group_returns[g].append(rets[sel].mean())

for g in range(n_groups):
    avg = np.mean(group_returns[g]) * 252
    print(f"Q{g+1} 年化: {avg:+.2%}")`,
      ],
    },
  ],
};

// ─── Public API ─────────────────────────────────────────

/** All snippet categories for the sidebar panel */
export const CODE_SNIPPETS: SnippetCategory[] = [
  quickStart,
  factorConstruction,
  preprocessing,
  validation,
];

/** Find a snippet by id */
export function findSnippetById(id: string): CodeSnippet | undefined {
  for (const category of CODE_SNIPPETS) {
    const found = category.snippets.find((s) => s.id === id);
    if (found) return found;
  }
  return undefined;
}
