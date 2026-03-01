# RD-Agent Vendor 清理与执行层重写

> 日期: 2026-03-01
> 状态: Draft — 待评审
> 前置: `2026-02-27-rdagent-integration-design.md`

## 1. 背景与动机

对 vendored RD-Agent (`apps/vibe-editor/rdagent/`) 的全面审查发现三层问题：

1. **Vendored 副本是死代码** — 主进程不 import 它，worker subprocess 用的是 `~/PycharmProjects/RD-Agent/` 的 editable install。部署不可移植，版本不可控。
2. **执行环境过度复杂** — 三层 Python 进程套娃（主进程 → worker subprocess → conda subprocess），只为调三行 qlib API。
3. **~90 个文件完全未使用** — Kaggle pipeline、Streamlit UI、Docker 构建文件等死模块占 50% 体积。

**目标**: 让 vendored 副本成为唯一 rdagent 来源（自包含），消除 conda 依赖，简化执行层。

## 2. 当前架构 vs 目标架构

### 2.1 当前（三层套娃）

```
主进程 (system python, marimo)
  │ subprocess.Popen
  ▼
Worker (conda rdagent env, Python 3.10)
  │ import rdagent ← 来自 ~/PycharmProjects/RD-Agent/ editable install
  │ CondaConf.model_validator → shell("conda run -n rdagent4qlib env | grep PATH")
  │ subprocess.Popen(shell=True)
  ▼
qrun subprocess (conda rdagent4qlib env, Python 3.10)
  │ qlib.init() → task_train() → 输出 qlib_res.csv + ret.pkl
  │ 又跑一个 subprocess: python read_exp_res.py
  ▼
结果通过文件系统传回（progress.json, factors.jsonl）
```

**问题**:
- 依赖外部 RD-Agent 仓库（editable install）
- 两个 conda env（rdagent + rdagent4qlib），部署时都要创建
- `CondaConf` import 时跑 shell 命令解析 PATH
- `shell=True` + 字符串拼接（安全隐患）
- `select.poll()` Linux-only（macOS 崩溃）
- `pandarallel.initialize()` import 时 fork 进程

### 2.2 目标（两层，无 conda）

```
主进程 (system python, marimo)
  │ subprocess.Popen
  ▼
Worker (uv venv, Python 3.11)
  │ import rdagent ← 来自 vendored apps/vibe-editor/rdagent/ (PYTHONPATH)
  │ import qlib    ← pip installed in same venv
  │ 直接调 qlib.init() + task_train()  ← 无子进程
  │ FactorExecutor Protocol 抽象执行层
  ▼
结果通过文件系统传回（不变）
```

**收益**:
- 零外部仓库依赖，vendored 副本自包含
- 一个 uv venv 替代两个 conda env
- 无 import-time 副作用
- `shell=False`，list args
- 跨平台（macOS + Linux）
- 可 Mock 测试

## 3. 工作项

### Phase 1: 死代码裁剪

删除 vendored `rdagent/` 中未被使用的模块。

| 删除目标 | 文件数 | 理由 |
|----------|--------|------|
| `components/coder/data_science/` | 46 | Kaggle pipeline，与 qlib 因子无关 |
| `components/agent/` | 8 | Agent framework (context7/MCP/RAG)，FactorRDLoop 不用 |
| `components/benchmark/` | 3 | Benchmark 评测模块 |
| `components/interactor/` | 1 | Interactive mode |
| `components/coder/model_coder/benchmark/` | 8 | Ground-truth 模型代码 (visnet/linkx 等) |
| `log/ui/` | 14 | Streamlit UI，import 了不存在的 scenarios.kaggle |
| `log/server/` | 3 | 日志可视化服务 |
| `log/mle_summary.py` | 1 | MLE benchmark 汇总 |
| `scenarios/qlib/docker/Dockerfile` | 1 | Docker 构建 — 我们不用 Docker |
| **合计** | **~85** | **从 ~182 文件降至 ~97 文件** |

保留但标记为低优先级清理：
- `app/qlib_rd_loop/model.py` — ModelRDLoop 入口（未来可能用）
- `app/qlib_rd_loop/quant.py` — QuantRDLoop 入口（未来可能用）
- `app/qlib_rd_loop/factor_from_report.py` — 研报模式（未来可能用）
- `utils/repo/` — Git diff 工具（3 文件）

### Phase 2: Bug 修复与跨平台兼容

#### 2.1 补齐 `scenarios/shared/` 缺失模块

**问题**: 3 个文件 import `rdagent.scenarios.shared.get_runtime_info`，但 vendored 时漏掉了 `scenarios/shared/`。

**修法**: 从上游 `~/PycharmProjects/RD-Agent/rdagent/scenarios/shared/` 复制所需文件。

#### 2.2 `select.poll()` macOS 不兼容

**位置**: `utils/env.py:563`，`LocalEnv._run()` 的 live_output 模式。

**修法**: 用 `subprocess.communicate()` + `threading` 读 stdout/stderr 替代 `select.poll()`。跨平台且更简洁。

#### 2.3 `pandarallel.initialize()` import-time 副作用

**位置**: `scenarios/qlib/developer/factor_runner.py:9`

**修法**: 移到函数内部 lazy init：

```python
# Before (module level)
from pandarallel import pandarallel
pandarallel.initialize(verbose=1)

# After (lazy, inside function)
def _init_pandarallel():
    from pandarallel import pandarallel
    pandarallel.initialize(verbose=1)
```

#### 2.4 bare `except:` 修复

**位置**: `components/coder/factor_coder/eva_utils.py:334`（在活跃的因子评估路径上）

**修法**: 改为 `except Exception:`，不吞 `KeyboardInterrupt`/`SystemExit`。

#### 2.5 `docker` 模块级 import 保护

**位置**: `utils/env.py:27-30`

**修法**: Lazy import，移到 `DockerEnv.__init__()` 内部：

```python
# Before (module level)
import docker

# After (lazy)
def _get_docker_client():
    try:
        import docker
        return docker.from_env()
    except ImportError:
        raise RuntimeError("docker package not installed — use conda or local executor")
```

#### 2.6 `fire`/`typer` CLI 入口保护

**位置**: `app/qlib_rd_loop/factor.py:9-11`

**修法**: 移除顶层 `import fire, typer`，保留 `FactorRDLoop` class 定义。CLI `main()` 函数标记为 dead code（我们通过 `vt_mining/worker.py` 入口，不走 CLI）。

### Phase 3: 执行层重写 — FactorExecutor Protocol

#### 3.1 设计

替换 rdagent 的 `Env` / `DockerEnv` / `LocalEnv` / `CondaEnv` 体系，引入干净的 Protocol：

```python
# vt_mining/executor.py

from typing import Protocol
from dataclasses import dataclass
from pathlib import Path

@dataclass
class FactorResult:
    """Phase A 输出: 因子代码执行结果"""
    values_path: Path | None    # result.h5 (factor values DataFrame)
    success: bool
    error: str | None
    stdout: str

@dataclass
class BacktestConfig:
    """Phase B 输入: qlib 回测配置"""
    provider_uri: str           # ~/.qlib/qlib_data/cn_data
    region: str                 # "cn"
    model_class: str            # "LGBModel"
    train_start: str
    train_end: str
    valid_start: str
    valid_end: str
    test_start: str
    test_end: str | None

@dataclass
class BacktestResult:
    """Phase B 输出: 回测指标"""
    metrics: dict[str, float]   # IC, ICIR, Rank IC, Rank ICIR, ARR, Sharpe, Max DD
    returns_path: Path | None   # ret.pkl (daily returns)
    success: bool
    error: str | None
    log: str

class FactorExecutor(Protocol):
    """因子执行与回测的最小契约"""

    def execute_factor(
        self, code: str, data_path: Path, workspace: Path
    ) -> FactorResult:
        """执行 LLM 生成的因子代码, 输出因子值"""
        ...

    def run_backtest(
        self, factors_parquet: Path, config: BacktestConfig, workspace: Path
    ) -> BacktestResult:
        """用 qlib 跑回测, 输出指标"""
        ...
```

#### 3.2 实现: `QlibDirectExecutor`

直接调 qlib Python API，无子进程：

```python
class QlibDirectExecutor:
    """直接调 qlib API 的执行器 — 要求 qlib 在当前 Python 环境中可用"""

    def execute_factor(self, code, data_path, workspace):
        # 写 factor.py 到 workspace
        # subprocess.run([sys.executable, factor_script], cwd=workspace, shell=False)
        # 读 result.h5
        ...

    def run_backtest(self, factors_parquet, config, workspace):
        import qlib
        from qlib.model.trainer import task_train

        qlib.init(provider_uri=config.provider_uri, region=config.region)
        task_config = self._build_task_config(factors_parquet, config)
        recorder = task_train(task_config, experiment_name="vt_factor_eval")

        # 直接从 recorder 读指标，不需要 read_exp_res.py
        metrics = recorder.list_metrics()
        returns = recorder.load_object("portfolio_analysis/report_normal_1day.pkl")
        ...
```

**注意**: `execute_factor` 仍然用 `subprocess.run()` 执行 LLM 生成的因子代码（安全隔离——不 import 不可信代码到主进程）。但用 `shell=False` + list args。

#### 3.3 集成点

修改 `vt_mining/rdagent_loop.py` 中的 `VTFactorRDLoop`，将 `QlibFactorRunner` 的执行路径替换为 `FactorExecutor`：

```python
# rdagent_loop.py (修改后)
class VTFactorRDLoop(FactorRDLoop):
    def __init__(self, executor: FactorExecutor, ...):
        self._executor = executor
        ...
```

rdagent 的调用链：

```
QlibFactorRunner.develop()                    ← 200 行 (因子处理/去重，不改)
  └→ exp.experiment_workspace.execute()        ← QlibFBWorkspace.execute() (全改)
       ├→ QlibCondaEnv("qrun conf.yaml")       ← 删除
       └→ QlibCondaEnv("python read_exp_res.py")← 删除
```

**直接修改 vendored 代码**，不用子类覆写（覆写会导致复制 150 行有用代码只为改最后 30 行，且上游更新不会自动继承）。

改动集中在一个文件：`scenarios/qlib/experiment/workspace.py`，重写 `QlibFBWorkspace.execute()` 方法：

```python
# Before: conda subprocess 调 qrun CLI
def execute(self, qlib_config_name, run_env, ...):
    qtde = QlibCondaEnv(conf=QlibCondaConf())
    qtde.prepare()
    log = qtde.check_output(entry=f"qrun {qlib_config_name}", ...)
    qtde.check_output(entry="python read_exp_res.py", ...)
    return pd.read_csv("qlib_res.csv"), log

# After: 直接调 qlib Python API
def execute(self, qlib_config_name, run_env, ...):
    from vt_mining.executor import QlibDirectExecutor
    executor = QlibDirectExecutor()
    config = self._load_yaml_config(qlib_config_name, run_env)
    result = executor.run_backtest(
        factors_parquet=self.workspace_path / "combined_factors_df.parquet",
        config=config,
        workspace=self.workspace_path,
    )
    return result.metrics, result.log
```

`QlibFactorRunner.develop()` 那 200 行**不动**——因子处理、去重、parquet 保存全保留，它调 `workspace.execute()` 时自动走重写后的路径。

### Phase 4: conda → uv 环境迁移

#### 4.1 创建统一 venv

```bash
# 在 apps/vibe-editor/ 下创建
uv venv .venv --python 3.11

# 安装所有依赖（原 rdagent + rdagent4qlib 合并）
uv pip install \
  pyqlib==0.9.6.99 \
  lightgbm>=4.0 \
  catboost>=1.2 \
  xgboost>=3.0 \
  tables>=3.9 \
  pandarallel>=1.6 \
  litellm>=1.80 \
  pydantic-settings>=2.0 \
  ruamel.yaml \
  # ... 其他 deps
```

#### 4.2 修改 `manager.py`

```python
# Before
RDAGENT_PYTHON = "/opt/homebrew/.../envs/rdagent/bin/python"
worker_env.pop("PYTHONPATH", None)

# After
VENV_DIR = Path(__file__).parent.parent / ".venv"
RDAGENT_PYTHON = str(VENV_DIR / "bin" / "python")
VENDORED_ROOT = str(Path(__file__).parent.parent)  # apps/vibe-editor/
worker_env["PYTHONPATH"] = VENDORED_ROOT  # vendored rdagent/ 在这个目录下
```

#### 4.3 Worker CWD 解耦

当前 worker CWD 必须是 `~/PycharmProjects/RD-Agent/`（因为 qlib 数据用相对路径 `git_ignore_folder/...`）。

修法：
1. `worker.py` 启动时设置 `WORKSPACE_PATH` 环境变量为绝对路径（`~/.vt-lab/mining/{task_id}/`）
2. qlib 数据路径改为绝对路径配置：`VT_QLIB_DATA_DIR` env var（默认 `~/.qlib/qlib_data/cn_data`）
3. 因子数据（`daily_pv.h5`）的路径通过 `VT_FACTOR_DATA_DIR` env var 配置

#### 4.4 依赖锁定

```bash
# 生成锁文件
uv pip compile requirements.in -o requirements.lock
```

`requirements.in` 放在 `apps/vibe-editor/` 下，记录所有直接依赖。

### Phase 5: 验证

#### 5.1 单元测试

- `vt_mining/executor.py` — Mock qlib API，验证 FactorExecutor 契约
- `vt_mining/worker.py` — 验证 env var 设置、PYTHONPATH 注入
- vendored rdagent import chain — `python -c "from rdagent.app.qlib_rd_loop.factor import FactorRDLoop"` 无 ImportError

#### 5.2 集成测试

- 启动 vibe-editor → 创建 mining task → 验证 worker 进程启动
- 因子代码执行（Phase A）→ result.h5 生成
- qlib 回测（Phase B）→ 指标返回
- SSE 流推送正常

#### 5.3 E2E 冒烟

- 完整运行一轮 FactorRDLoop（1 iteration）
- 验证 factors.jsonl 有输出
- 验证 progress.json 实时更新

## 4. 风险与缓解

| 风险 | 概率 | 影响 | 缓解 |
|------|------|------|------|
| qlib 0.9.6 与 Python 3.11 不兼容 | 中 | 阻塞 | 先在 venv 里 `import qlib` 验证；不行退回 3.10 |
| rdagent pydantic-settings 与 qlib 的包依赖冲突 | 低 | 阻塞 | uv 的依赖解析比 pip 强，冲突时 pin 版本 |
| `task_train()` API 与 `qrun` CLI 行为差异 | 低 | 指标偏差 | 对比测试：同一因子分别用 qrun 和 API 跑，验证指标一致 |
| vendored rdagent 上游更新同步 | 中 | 维护成本 | 锁定 commit hash，手动 cherry-pick，FORK_NOTES.md 记录 diff |

## 5. 执行顺序

```
Phase 1 (裁剪)  ──→ Phase 2 (修 bug) ──→ Phase 3 (重写执行层)
                                              │
                                     Phase 4 (uv 迁移) ──→ Phase 5 (验证)
```

Phase 1-2 可以先做，立即减少代码体积和修复已知 bug。
Phase 3-4 是核心架构变更，需要一起做（执行层重写依赖 qlib 在同一 venv 可用）。
Phase 5 贯穿全程。

## 6. Vendored 代码修改策略

**精准修改，不回避改 vendored 代码**。子类覆写会导致架构冗余（复制父类逻辑 + 上游更新不继承），直接改更干净。

修改范围严格限定在执行层，不碰 R&D 循环逻辑：

| 文件 | 改动 | 性质 |
|------|------|------|
| `scenarios/qlib/experiment/workspace.py` | 重写 `execute()` — 删 conda/docker，改为直接 qlib API | 核心改动 |
| `scenarios/qlib/developer/factor_runner.py:4,9` | pandarallel lazy init | Bug fix |
| `utils/env.py` | docker lazy import + select.poll 跨平台 | Bug fix |
| `components/coder/factor_coder/eva_utils.py:334` | bare `except:` → `except Exception:` | Bug fix |
| `app/qlib_rd_loop/factor.py:9-11` | 移除 fire/typer 顶层 import | 清理 |

**不动的部分**：
- rdagent R&D 循环逻辑（Hypothesis 生成、CoSTEER 进化、知识库 RAG）
- `QlibFactorRunner.develop()` 的 200 行因子处理/去重逻辑
- `vt_mining/` 的 API 层（routes, models, manager 外部接口不变）
- 前端（mining 页面不受影响，API 契约不变）
- Worker 仍然是 subprocess（隔离重型依赖 + LLM 生成代码的安全沙箱）
