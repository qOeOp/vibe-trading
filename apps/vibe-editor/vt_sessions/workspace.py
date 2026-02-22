"""
Workspace bootstrap — ensures workspace directory and welcome notebook exist.

Migrated from frontend TypeScript (workspace-bootstrap.ts) to backend Python.
Now runs server-side during session connect, not client-side via marimo file API.
"""
from __future__ import annotations

import os
import logging

logger = logging.getLogger(__name__)

# Default workspace base directory
# In production this would be /data/workspaces/{userId}/
# For now, single-user mode uses ~/.vt-lab/
DEFAULT_WORKSPACE_BASE = os.path.expanduser("~/.vt-lab")

WELCOME_NOTEBOOK_NAME = "welcome.py"

# fmt: off
WELCOME_NOTEBOOK_CONTENT = '''import marimo

__generated_with = "0.20.1"
app = marimo.App(width="medium")


@app.cell
def _():
    import marimo as mo
    import numpy as np
    import pandas as pd
    import plotly.graph_objects as go

    np.random.seed(42)

    # ── Factor definitions ──────────────────────────────
    FACTORS = {
        "Mom_20D": {"cat": "动量", "ic_mu": 0.032, "ic_std": 0.028, "turnover": 0.42, "capacity": 85},
        "EP":      {"cat": "价值", "ic_mu": 0.045, "ic_std": 0.035, "turnover": 0.15, "capacity": 120},
        "ROE_TTM": {"cat": "质量", "ic_mu": 0.038, "ic_std": 0.022, "turnover": 0.18, "capacity": 95},
        "Vol_20D": {"cat": "波动率", "ic_mu": -0.025, "ic_std": 0.030, "turnover": 0.35, "capacity": 70},
        "North_Flow": {"cat": "资金流", "ic_mu": 0.028, "ic_std": 0.032, "turnover": 0.55, "capacity": 45},
    }

    def gen_ic_series(mu, std, n=240):
        """Mean-reverting IC series via AR(1)"""
        ic = np.zeros(n)
        ic[0] = mu
        for i in range(1, n):
            ic[i] = 0.7 * ic[i - 1] + 0.3 * mu + std * np.random.randn()
        return ic

    def gen_quintile_returns(ic_mu, n=240):
        """5-quantile cumulative returns driven by factor IC"""
        spreads = np.linspace(-1, 1, 5) * abs(ic_mu) * 8
        daily = np.zeros((n, 5))
        for q in range(5):
            daily[:, q] = spreads[q] / 240 + np.random.randn(n) * 0.015
        return np.cumsum(daily, axis=0)

    def gen_ic_decay(ic_mu):
        """IC decay from T+1 to T+20"""
        lags = np.arange(1, 21)
        return ic_mu * np.exp(-0.12 * lags) + np.random.randn(20) * 0.003

    POOL_NAMES = ["全A", "沪深300", "中证500", "中证1000"]
    POOL_SCALES = [1.0, 0.75, 1.15, 1.30]

    data = {}
    for _name, _cfg in FACTORS.items():
        _ic_ts = gen_ic_series(_cfg["ic_mu"], _cfg["ic_std"])
        _ir = np.mean(_ic_ts) / (np.std(_ic_ts) + 1e-9)
        _t_stat = _ir * np.sqrt(len(_ic_ts))
        data[_name] = {
            "cat": _cfg["cat"],
            "ic_ts": _ic_ts,
            "ic_mean": float(np.mean(_ic_ts)),
            "ir": float(_ir),
            "t_stat": float(_t_stat),
            "turnover": _cfg["turnover"],
            "capacity": _cfg["capacity"],
            "quintile": gen_quintile_returns(_cfg["ic_mu"]),
            "decay": gen_ic_decay(_cfg["ic_mu"]),
            "pool_ic": [float(np.mean(_ic_ts) * s + np.random.randn() * 0.003) for s in POOL_SCALES],
        }

    factor_names = list(FACTORS.keys())
    return data, factor_names, mo, np, pd, go, FACTORS, POOL_NAMES


@app.cell
def _(data, factor_names, mo, np):
    _avg_ic = float(np.mean([data[_f]["ic_mean"] for _f in factor_names]))
    _avg_ir = float(np.mean([data[_f]["ir"] for _f in factor_names]))
    _active = sum(1 for _f in factor_names if abs(data[_f]["ic_mean"]) > 0.02)

    mo.md("# VT Lab \\u2014 因子研究工作台")
    mo.hstack(
        [
            mo.stat(value=len(factor_names), label="因子总数", bordered=True),
            mo.stat(value=_active, label="活跃因子", bordered=True),
            mo.stat(value=round(_avg_ic, 4), label="平均 IC", bordered=True),
            mo.stat(value=round(_avg_ir, 2), label="平均 IR", bordered=True),
        ],
        justify="start",
        gap=1,
    )
    return


@app.cell
def _(data, factor_names, mo, np):
    selector = mo.ui.dropdown(
        options=factor_names,
        value=factor_names[0],
        label="选择因子",
    )
    mo.output.replace(selector)
    return (selector,)


@app.cell
def _(data, mo, selector):
    _f = selector.value
    _d = data[_f]
    _status = "\\u2705 活跃" if abs(_d["ic_mean"]) > 0.02 else "\\u26a0\\ufe0f 待观察"

    mo.hstack(
        [
            mo.stat(value=round(_d["ic_mean"], 4), label="IC 均值", bordered=True),
            mo.stat(value=round(_d["ir"], 2), label="IR", bordered=True),
            mo.stat(value=round(_d["t_stat"], 2), label="t-stat", bordered=True),
            mo.stat(value=round(_d["turnover"], 2), label="换手率", bordered=True),
            mo.stat(value="%d 亿" % _d["capacity"], label="容量", bordered=True),
        ],
        justify="start",
        gap=1,
    )
    mo.md("**状态**: %s \\u2003 **类别**: %s" % (_status, _d["cat"]))
    return


@app.cell
def _(data, go, mo, np, pd, selector, POOL_NAMES):
    _f = selector.value
    _d = data[_f]

    # ── Tab 1: IC time series ──
    _ic_df = pd.DataFrame({
        "交易日": range(1, 241),
        "IC": _d["ic_ts"],
        "20日滚动均值": pd.Series(_d["ic_ts"]).rolling(20).mean().values,
    })

    _fig_ic = go.Figure()
    _fig_ic.add_trace(go.Scatter(x=_ic_df["交易日"], y=_ic_df["IC"],
                                mode="lines", name="IC", line=dict(color="#93c5fd", width=1)))
    _fig_ic.add_trace(go.Scatter(x=_ic_df["交易日"], y=_ic_df["20日滚动均值"],
                                mode="lines", name="MA20", line=dict(color="#2563eb", width=2)))
    _fig_ic.add_hline(y=0, line_dash="dash", line_color="#94a3b8", line_width=1)
    _fig_ic.update_layout(
        title="%s \\u2014 IC 时间序列 (240天)" % _f,
        xaxis_title="交易日", yaxis_title="IC",
        template="plotly_white", height=380, margin=dict(t=40, b=40),
    )
    _tab_ic = mo.ui.plotly(_fig_ic)

    # ── Tab 2: Quintile cumulative returns ──
    _q_colors = ["#0B8C5F", "#58CEAA", "#94a3b8", "#E8626F", "#CF304A"]
    _q_labels = ["Q1 (空头)", "Q2", "Q3", "Q4", "Q5 (多头)"]
    _fig_q = go.Figure()
    for _qi in range(5):
        _fig_q.add_trace(go.Scatter(
            x=list(range(1, 241)), y=_d["quintile"][:, _qi].tolist(),
            mode="lines", name=_q_labels[_qi],
            line=dict(color=_q_colors[_qi], width=2),
        ))
    _fig_q.update_layout(
        title="%s \\u2014 分位累计收益" % _f,
        xaxis_title="交易日", yaxis_title="累计收益",
        template="plotly_white", height=380, margin=dict(t=40, b=40),
    )
    _tab_quintile = mo.ui.plotly(_fig_q)

    # ── Tab 3: IC decay ──
    _fig_decay = go.Figure()
    _colors = ["#F6465D" if _v > 0 else "#2EBD85" for _v in _d["decay"]]
    _fig_decay.add_trace(go.Bar(
        x=["T+%d" % _i for _i in range(1, 21)], y=_d["decay"].tolist(),
        marker_color=_colors,
    ))
    _fig_decay.update_layout(
        title="%s \\u2014 IC 衰减 (Lag T+1 ~ T+20)" % _f,
        xaxis_title="Lag", yaxis_title="IC",
        template="plotly_white", height=380, margin=dict(t=40, b=40),
    )
    _tab_decay = mo.ui.plotly(_fig_decay)

    # ── Tab 4: Multi-pool IC comparison ──
    _fig_pool = go.Figure()
    _pool_colors = ["#F6465D" if _v > 0 else "#2EBD85" for _v in _d["pool_ic"]]
    _fig_pool.add_trace(go.Bar(
        x=POOL_NAMES, y=_d["pool_ic"],
        marker_color=_pool_colors, text=["%.4f" % _v for _v in _d["pool_ic"]],
        textposition="outside",
    ))
    _fig_pool.update_layout(
        title="%s \\u2014 多市场池 IC 对比" % _f,
        yaxis_title="IC 均值",
        template="plotly_white", height=380, margin=dict(t=40, b=40),
    )
    _tab_pool = mo.ui.plotly(_fig_pool)

    mo.ui.tabs({
        "\\U0001f4c8 IC 分析": _tab_ic,
        "\\U0001f4ca 分位收益": _tab_quintile,
        "\\u23f3 IC 衰减": _tab_decay,
        "\\U0001f30d 多市场池": _tab_pool,
    })
    return


@app.cell
def _(data, factor_names, mo, pd):
    _rows = []
    for _name in factor_names:
        _d = data[_name]
        _rows.append({
            "因子": _name,
            "类别": _d["cat"],
            "IC": round(_d["ic_mean"], 4),
            "IR": round(_d["ir"], 2),
            "t-stat": round(_d["t_stat"], 2),
            "换手率": round(_d["turnover"], 2),
            "状态": "\\u2705 活跃" if abs(_d["ic_mean"]) > 0.02 else "\\u26a0\\ufe0f 待观察",
        })

    mo.md("## 因子总览")
    mo.ui.table(pd.DataFrame(_rows), selection=None)
    return


@app.cell
def _(data, factor_names, go, mo, np):
    _n = len(factor_names)
    _corr = np.eye(_n)
    np.random.seed(99)
    for _i in range(_n):
        for _j in range(_i + 1, _n):
            _r = np.corrcoef(data[factor_names[_i]]["ic_ts"], data[factor_names[_j]]["ic_ts"])[0, 1]
            _corr[_i, _j] = round(_r, 3)
            _corr[_j, _i] = _corr[_i, _j]

    _text_matrix = [[("%.3f" % _corr[_i][_j]) for _j in range(_n)] for _i in range(_n)]

    _fig_corr = go.Figure(data=go.Heatmap(
        z=_corr.tolist(),
        x=factor_names,
        y=factor_names,
        text=_text_matrix,
        texttemplate="%{text}",
        colorscale="RdBu_r",
        zmid=0,
        zmin=-1,
        zmax=1,
    ))
    _fig_corr.update_layout(
        title="因子相关性矩阵",
        template="plotly_white", height=420, width=520,
        margin=dict(t=40, b=40),
    )

    mo.md("## 因子相关性")
    mo.ui.plotly(_fig_corr)
    return


@app.cell
def _(mo):
    mo.accordion({
        "\\U0001f680 创建新 Notebook": mo.md(
            "点击左侧文件树右键 → **New File** → 命名为 `my_factor.py`\\n\\n"
            "每个 notebook 是一个独立的因子研究环境。"
        ),
        "\\U0001f4ca A 股数据导入": mo.md(
            "```python\\n"
            "import akshare as ak\\n"
            "df = ak.stock_zh_a_hist(symbol='000001', period='daily')\\n"
            "```\\n\\n"
            "支持沪深/创业板/科创板/北交所全市场数据。"
        ),
        "\\U0001f504 因子生命周期": mo.md(
            "**Draft** → Testing → Validated → Paper(模拟盘) → Live(实盘) → Degrading → Retired\\n\\n"
            "研究区 → 生产环境必须经过显式部署。未验证策略永远不碰真钱。"
        ),
    })
    return


@app.cell
def _(mo):
    mo.callout(
        mo.md("**VT Lab** v0.1.0 · marimo 0.20.1 · 因子研究工作台"),
        kind="info",
    )
    return


if __name__ == "__main__":
    app.run()
'''
# fmt: on


def ensure_workspace(user_id: str, base_dir: str | None = None) -> tuple[str, str]:
    """
    Ensure workspace directory and welcome notebook exist for a user.

    Args:
        user_id: User identifier (currently "root" for single-user mode)
        base_dir: Override workspace base directory. Defaults to ~/.vt-lab/

    Returns:
        (workspace_path, notebook_path) — absolute paths

    This replaces the frontend bootstrapWorkspace() function.
    Server-side filesystem access is direct — no need to go through marimo's
    file API endpoints.
    """
    if base_dir is None:
        base_dir = DEFAULT_WORKSPACE_BASE

    # TODO: auth — when multi-user, workspace_path = base_dir / user_id
    # For now, single user shares the base directory directly
    workspace_path = base_dir

    # Ensure workspace directory exists
    os.makedirs(workspace_path, exist_ok=True)
    logger.info("Workspace ensured at %s for user %s", workspace_path, user_id)

    # Ensure welcome notebook exists
    notebook_path = os.path.join(workspace_path, WELCOME_NOTEBOOK_NAME)
    if not os.path.exists(notebook_path):
        logger.info("Creating welcome notebook at %s", notebook_path)
        with open(notebook_path, "w", encoding="utf-8") as f:
            f.write(WELCOME_NOTEBOOK_CONTENT)

    return workspace_path, notebook_path
