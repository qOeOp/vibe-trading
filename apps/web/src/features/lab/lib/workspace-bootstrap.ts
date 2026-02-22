/**
 * Bootstraps the VT Lab workspace directory (~/.vt-lab/).
 *
 * Uses marimo's file API to detect/create the workspace and welcome notebook,
 * ensuring the file tree always points to a fixed location regardless of
 * the kernel's CWD.
 *
 * Requires marimo to be started with --no-skew-protection so that POST
 * requests don't need the Marimo-Server-Token header.
 */

import { VT_WORKSPACE_DIR, VT_WELCOME_NOTEBOOK } from '../constants';

const WELCOME_NOTEBOOK_CONTENT = `import marimo

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

    mo.md("# VT Lab \u2014 \u56e0\u5b50\u7814\u7a76\u5de5\u4f5c\u53f0")
    mo.hstack(
        [
            mo.stat(value=len(factor_names), label="\u56e0\u5b50\u603b\u6570", bordered=True),
            mo.stat(value=_active, label="\u6d3b\u8dc3\u56e0\u5b50", bordered=True),
            mo.stat(value=round(_avg_ic, 4), label="\u5e73\u5747 IC", bordered=True),
            mo.stat(value=round(_avg_ir, 2), label="\u5e73\u5747 IR", bordered=True),
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
        label="\u9009\u62e9\u56e0\u5b50",
    )
    mo.output.replace(selector)
    return (selector,)


@app.cell
def _(data, mo, selector):
    _f = selector.value
    _d = data[_f]
    _status = "\u2705 \u6d3b\u8dc3" if abs(_d["ic_mean"]) > 0.02 else "\u26a0\ufe0f \u5f85\u89c2\u5bdf"

    mo.hstack(
        [
            mo.stat(value=round(_d["ic_mean"], 4), label="IC \u5747\u503c", bordered=True),
            mo.stat(value=round(_d["ir"], 2), label="IR", bordered=True),
            mo.stat(value=round(_d["t_stat"], 2), label="t-stat", bordered=True),
            mo.stat(value=round(_d["turnover"], 2), label="\u6362\u624b\u7387", bordered=True),
            mo.stat(value="%d \u4ebf" % _d["capacity"], label="\u5bb9\u91cf", bordered=True),
        ],
        justify="start",
        gap=1,
    )
    mo.md("**\u72b6\u6001**: %s \u2003 **\u7c7b\u522b**: %s" % (_status, _d["cat"]))
    return


@app.cell
def _(data, go, mo, np, pd, selector, POOL_NAMES):
    _f = selector.value
    _d = data[_f]

    # ── Tab 1: IC time series ──
    _ic_df = pd.DataFrame({
        "\u4ea4\u6613\u65e5": range(1, 241),
        "IC": _d["ic_ts"],
        "20\u65e5\u6eda\u52a8\u5747\u503c": pd.Series(_d["ic_ts"]).rolling(20).mean().values,
    })

    _fig_ic = go.Figure()
    _fig_ic.add_trace(go.Scatter(x=_ic_df["\u4ea4\u6613\u65e5"], y=_ic_df["IC"],
                                mode="lines", name="IC", line=dict(color="#93c5fd", width=1)))
    _fig_ic.add_trace(go.Scatter(x=_ic_df["\u4ea4\u6613\u65e5"], y=_ic_df["20\u65e5\u6eda\u52a8\u5747\u503c"],
                                mode="lines", name="MA20", line=dict(color="#2563eb", width=2)))
    _fig_ic.add_hline(y=0, line_dash="dash", line_color="#94a3b8", line_width=1)
    _fig_ic.update_layout(
        title="%s \u2014 IC \u65f6\u95f4\u5e8f\u5217 (240\u5929)" % _f,
        xaxis_title="\u4ea4\u6613\u65e5", yaxis_title="IC",
        template="plotly_white", height=380, margin=dict(t=40, b=40),
    )
    _tab_ic = mo.ui.plotly(_fig_ic)

    # ── Tab 2: Quintile cumulative returns ──
    _q_colors = ["#0B8C5F", "#58CEAA", "#94a3b8", "#E8626F", "#CF304A"]
    _q_labels = ["Q1 (\u7a7a\u5934)", "Q2", "Q3", "Q4", "Q5 (\u591a\u5934)"]
    _fig_q = go.Figure()
    for _qi in range(5):
        _fig_q.add_trace(go.Scatter(
            x=list(range(1, 241)), y=_d["quintile"][:, _qi].tolist(),
            mode="lines", name=_q_labels[_qi],
            line=dict(color=_q_colors[_qi], width=2),
        ))
    _fig_q.update_layout(
        title="%s \u2014 \u5206\u4f4d\u7d2f\u8ba1\u6536\u76ca" % _f,
        xaxis_title="\u4ea4\u6613\u65e5", yaxis_title="\u7d2f\u8ba1\u6536\u76ca",
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
        title="%s \u2014 IC \u8870\u51cf (Lag T+1 ~ T+20)" % _f,
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
        title="%s \u2014 \u591a\u5e02\u573a\u6c60 IC \u5bf9\u6bd4" % _f,
        yaxis_title="IC \u5747\u503c",
        template="plotly_white", height=380, margin=dict(t=40, b=40),
    )
    _tab_pool = mo.ui.plotly(_fig_pool)

    mo.ui.tabs({
        "\ud83d\udcc8 IC \u5206\u6790": _tab_ic,
        "\ud83d\udcca \u5206\u4f4d\u6536\u76ca": _tab_quintile,
        "\u23f3 IC \u8870\u51cf": _tab_decay,
        "\ud83c\udf0d \u591a\u5e02\u573a\u6c60": _tab_pool,
    })
    return


@app.cell
def _(data, factor_names, mo, pd):
    _rows = []
    for _name in factor_names:
        _d = data[_name]
        _rows.append({
            "\u56e0\u5b50": _name,
            "\u7c7b\u522b": _d["cat"],
            "IC": round(_d["ic_mean"], 4),
            "IR": round(_d["ir"], 2),
            "t-stat": round(_d["t_stat"], 2),
            "\u6362\u624b\u7387": round(_d["turnover"], 2),
            "\u72b6\u6001": "\u2705 \u6d3b\u8dc3" if abs(_d["ic_mean"]) > 0.02 else "\u26a0\ufe0f \u5f85\u89c2\u5bdf",
        })

    mo.md("## \u56e0\u5b50\u603b\u89c8")
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
        title="\u56e0\u5b50\u76f8\u5173\u6027\u77e9\u9635",
        template="plotly_white", height=420, width=520,
        margin=dict(t=40, b=40),
    )

    mo.md("## \u56e0\u5b50\u76f8\u5173\u6027")
    mo.ui.plotly(_fig_corr)
    return


@app.cell
def _(mo):
    mo.accordion({
        "\ud83d\ude80 \u521b\u5efa\u65b0 Notebook": mo.md(
            "\u70b9\u51fb\u5de6\u4fa7\u6587\u4ef6\u6811\u53f3\u952e \u2192 **New File** \u2192 \u547d\u540d\u4e3a ${'`'}my_factor.py${'`'}\\n\\n"
            "\u6bcf\u4e2a notebook \u662f\u4e00\u4e2a\u72ec\u7acb\u7684\u56e0\u5b50\u7814\u7a76\u73af\u5883\u3002"
        ),
        "\ud83d\udcca A \u80a1\u6570\u636e\u5bfc\u5165": mo.md(
            "${'```'}python\\n"
            "import akshare as ak\\n"
            "df = ak.stock_zh_a_hist(symbol='000001', period='daily')\\n"
            "${'```'}\\n\\n"
            "\u652f\u6301\u6cbf\u6df1/\u521b\u4e1a\u677f/\u79d1\u521b\u677f/\u5317\u4ea4\u6240\u5168\u5e02\u573a\u6570\u636e\u3002"
        ),
        "\ud83d\udd04 \u56e0\u5b50\u751f\u547d\u5468\u671f": mo.md(
            "**Draft** \u2192 Testing \u2192 Validated \u2192 Paper(\u6a21\u62df\u76d8) \u2192 Live(\u5b9e\u76d8) \u2192 Degrading \u2192 Retired\\n\\n"
            "\u7814\u7a76\u533a \u2192 \u751f\u4ea7\u73af\u5883\u5fc5\u987b\u7ecf\u8fc7\u663e\u5f0f\u90e8\u7f72\u3002\u672a\u9a8c\u8bc1\u7b56\u7565\u6c38\u8fdc\u4e0d\u78b0\u771f\u94b1\u3002"
        ),
    })
    return


@app.cell
def _(mo):
    mo.callout(
        mo.md("**VT Lab** v0.1.0 \u00b7 marimo 0.20.1 \u00b7 \u56e0\u5b50\u7814\u7a76\u5de5\u4f5c\u53f0"),
        kind="info",
    )
    return


if __name__ == "__main__":
    app.run()
`;

export interface BootstrapResult {
  workspacePath: string;
  notebookPath: string;
}

const FALLBACK_NOTEBOOK = '/tmp/vt-lab.py';

/**
 * Derives the user's home directory from the marimo CWD root.
 * macOS: /Users/xxx → take first 2 segments (Users, username)
 * Linux: /home/xxx → take first 2 segments (home, username)
 * Fallback: use root as-is
 */
export function deriveHomeDir(root: string): string {
  const segments = root.split('/').filter(Boolean);

  // /Users/xxx or /home/xxx → first 2 segments
  if (
    segments.length >= 2 &&
    (segments[0] === 'Users' || segments[0] === 'home')
  ) {
    return '/' + segments.slice(0, 2).join('/');
  }

  // Already at home or unknown structure — use root
  return root.replace(/\/$/, '') || '/';
}

/** POST to marimo API (no auth header needed with --no-skew-protection) */
async function marimoPost(
  kernelBase: string,
  path: string,
  body: Record<string, unknown>,
): Promise<Response> {
  return fetch(`${kernelBase}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
}

/**
 * Bootstrap the VT Lab workspace. Called during doConnect() before takeover.
 *
 * 1. Fetches marimo's CWD root to derive the home directory
 * 2. Ensures ~/.vt-lab/ directory exists
 * 3. Ensures welcome.py notebook exists inside it
 * 4. Returns { workspacePath, notebookPath }
 *
 * On any failure, falls back to /tmp/vt-lab.py without blocking connection.
 */
export async function bootstrapWorkspace(
  kernelBase: string,
): Promise<BootstrapResult> {
  try {
    // Step 1: Get CWD root from marimo
    const rootRes = await marimoPost(kernelBase, '/api/files/list_files', {
      path: '',
    });
    if (!rootRes.ok) throw new Error(`list_files root: ${rootRes.status}`);
    const rootData: { root: string; files: unknown[] } = await rootRes.json();
    const homeDir = deriveHomeDir(rootData.root);
    const workspacePath = `${homeDir}/${VT_WORKSPACE_DIR}`;

    // Step 2: Check if workspace directory exists
    const wsRes = await marimoPost(kernelBase, '/api/files/list_files', {
      path: workspacePath,
    });

    if (!wsRes.ok) {
      // Directory doesn't exist — create it
      const createDirRes = await marimoPost(kernelBase, '/api/files/create', {
        path: homeDir,
        type: 'directory',
        name: VT_WORKSPACE_DIR,
      });
      if (!createDirRes.ok)
        throw new Error(`create workspace dir: ${createDirRes.status}`);
    }

    // Step 3: Check if welcome notebook exists
    const notebookPath = `${workspacePath}/${VT_WELCOME_NOTEBOOK}`;
    const filesRes = await marimoPost(kernelBase, '/api/files/list_files', {
      path: workspacePath,
    });

    if (filesRes.ok) {
      const filesData: { files?: Array<{ name: string }> } =
        await filesRes.json();
      const hasWelcome = filesData.files?.some(
        (f) => f.name === VT_WELCOME_NOTEBOOK,
      );

      if (!hasWelcome) {
        // Create welcome.py
        const createRes = await marimoPost(kernelBase, '/api/files/create', {
          path: workspacePath,
          type: 'file',
          name: VT_WELCOME_NOTEBOOK,
        });
        if (!createRes.ok)
          throw new Error(`create welcome notebook: ${createRes.status}`);

        // Write content to welcome.py
        await marimoPost(kernelBase, '/api/files/update', {
          path: notebookPath,
          contents: WELCOME_NOTEBOOK_CONTENT,
        });
      }
    }

    return { workspacePath, notebookPath };
  } catch (err) {
    console.warn('[VT Lab] Workspace bootstrap failed, using fallback:', err);
    return {
      workspacePath: '',
      notebookPath: FALLBACK_NOTEBOOK,
    };
  }
}
