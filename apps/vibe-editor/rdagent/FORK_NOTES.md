# VT Fork of RD-Agent

**Forked from**: `microsoft/RD-Agent`
**Fork commit**: `26560b3d7485f30246af3ddb2d6185fbe05fb4fd`
**Fork date**: 2026-02-28
**Vendored path**: `apps/vibe-editor/rdagent/`

## Why We Forked

The upstream RD-Agent was designed as a research tool and CLI application.
We need it to run as a service component inside Vibe Compute.

Key incompatibilities that drove the fork:

1. **No structured callback API** — results only accessible via log file parsing
2. **Linux-only assumptions** — hard-coded platform guards, Docker socket paths
3. **CLI-first design** — `fire.Fire(main)` entry points, not importable as a library
4. **App layer** — upstream's `app/` directory couples to their CLI dispatch

## What We Keep

| Module                             | Why                                                      |
| ---------------------------------- | -------------------------------------------------------- |
| `core/`                            | RDLoop, Hypothesis, Feedback base classes                |
| `oai/`                             | LiteLLM unified API layer                                |
| `components/workflow/`             | RDLoop step orchestration                                |
| `components/coder/factor_coder/`   | FactorTask, FactorFBWorkspace, CoSTEER code synthesis    |
| `components/runner/`               | Qlib execution runners                                   |
| `components/knowledge_management/` | RAG knowledge base                                       |
| `components/document_reader/`      | PDF/research report reading                              |
| `scenarios/qlib/`                  | Qlib data interface and factor evaluation                |
| `utils/`                           | Logging, workflow loop, shared utilities                 |
| `app/qlib_rd_loop/`                | FactorRDLoop, FactorReportLoop, ModelRDLoop, QuantRDLoop |

## Our Structural Changes

### 1. Callback Hooks (replaces log parsing)

We subclass `FactorRDLoop` in `vt_mining/rdagent_loop.py` as `VTFactorRDLoop`.
Each step override captures structured Python objects directly:

- `direct_exp_gen` → writes `rounds.json` after hypothesis generation
- `running` → writes per-factor entries to `factors.jsonl` after qlib evaluation
- `feedback` → updates `progress.json` after each loop

This replaces all `_parse_log_rounds()` and `_parse_log_factor_metadata()` log
parsing that was fragile, ANSI-dependent, and timing-sensitive.

### 2. macOS Compatibility

Removed Linux-specific platform guards (`select.poll()` → threading).
Added conda path resolution for both Linux and macOS (see `_ensure_conda_in_path()` in `vt_mining/worker.py`).

### 3. Direct Qlib Execution (replaces conda/docker subprocess)

Upstream uses a three-layer subprocess chain:
`QlibFBWorkspace` → `CondaEnv.run("qrun conf.yaml")` → conda subprocess → `read_exp_res.py`

We replaced this with `QlibDirectExecutor` in `vt_mining/executor.py` which calls
`qlib.init()` + `task_train()` directly as Python API. No subprocess, no conda, no Docker.
`QlibFBWorkspace.execute()` now delegates to this executor.

## Syncing from Upstream

We do NOT automatically sync from upstream. If a useful upstream commit exists:

1. Read the commit diff carefully
2. Assess if it applies to our architecture
3. Cherry-pick manually and document here

Do NOT run `git pull` or merge upstream automatically.

## Changelog

### 2026-03-01 — Phase 5: Workspace-Isolated Storage

Mining task artifacts (progress, factors, rounds) now live inside the user's session workspace, colocated with their editor notebooks. This replaces the global `~/.vt-lab/mining/` directory.

- **Rewrote `vt_mining/config.py`**: Removed global `MINING_BASE_DIR`/`KNOWLEDGE_DB_PATH`. Added `get_mining_dir(workspace)` and `get_knowledge_db_path(workspace)` — paths derived from workspace at runtime
- **Updated `vt_mining/manager.py`**: `MiningTaskManager.__init__` now requires `workspace_path`. Mining dir = `{workspace}/mining/`
- **Updated `start.py`**: Wired workspace from VTSessionManager into MiningTaskManager and KnowledgeStore
- **Updated `vt_mining/library_routes.py`**: Gets mining dir from manager instead of global constant
- **Clarified data semantics**: Qlib market data (`daily_pv.h5`) is shared infrastructure (`~/.vt-lab/factor_data/`), NOT per-user. Mining results are per-user, in workspace.

Layout:

```
{workspace}/
├── factor.py          ← user's notebooks (editor)
├── mining/            ← mining task artifacts
│   └── mining_20260301_*/
└── knowledge.db       ← per-user knowledge store
```

### 2026-03-01 — Phase 6: E2E Runtime Bug Fixes

First successful end-to-end mining run: hypothesis → factor coding → qlib backtest → signal metrics.
Fixed 6 runtime bugs discovered during E2E integration testing:

- **Bug 1: `docker.DockerClient` type annotation** — `docker = None` (lazy import) but type hint evaluated at class definition time. Fixed with string annotations `"docker.DockerClient"`.
- **Bug 2: Dead kaggle import** — `factor.py` still imported `KAGGLE_IMPLEMENT_SETTING` from deleted `app/kaggle/`. Removed import and `version == 2` Kaggle code branch.
- **Bug 3: `LocalConf` missing `default_entry`** — `EnvConf.default_entry` is required but `LocalConf` didn't provide a default. Added `default_entry: str = "python main.py"`.
- **Bug 4: `data_science.share` yaml reference** — `LocalEnv._run()` referenced deleted `scenarios/data_science/share.yaml` for cache path. Changed `if self.conf.extra_volumes is not None:` to `if self.conf.extra_volumes:` (empty dict is falsy).
- **Bug 5: macOS `timeout` command** — `timeout --kill-after` not in macOS default PATH. Now resolves `gtimeout` (GNU coreutils) or `timeout` via `shutil.which()`.
- **Bug 6: qlib PortAnaRecord calendar boundary** — `signal_strategy.py` IndexError at last calendar date. Made `QlibDirectExecutor` resilient: catches `task_train` errors, recovers signal metrics (IC/ICIR) from recorder even when portfolio backtest fails.

Also set `test_end` default to `"2024-12-31"` instead of `None` (avoids qlib calendar boundary edge case).

### 2026-03-01 — Phase 4: conda → uv Environment Migration

Eliminated conda dependency. Worker now runs in a uv venv with all deps (rdagent + qlib) in one environment.

- **Created `requirements.in`**: All direct deps for the unified venv (rdagent + qlib + LLM merged)
- **Rewrote `config.py`**: Replaced `CondaConf` (runs `conda run -n ENV env`) with plain `LocalConf(bin_path=venv/bin/)` — no conda subprocess at import time
- **Rewrote `manager.py`**: Worker Python resolved from `.venv/bin/python`, `PYTHONPATH` set to `apps/vibe-editor/` so vendored rdagent is importable, CWD set to `result_dir` (not `~/PycharmProjects/RD-Agent/`)
- **Rewrote `worker.py`**: Removed `_ensure_conda_in_path()`, removed `MODEL_COSTEER_ENV_TYPE`/`CONDA_DEFAULT_ENV` env vars, data folder paths set via absolute `FACTOR_CoSTEER_data_folder` env vars
- **Data path decoupling**: Factor data resolved to `~/.vt-lab/factor_data/` (or `VT_FACTOR_DATA_DIR` env var) — no more relative `git_ignore_folder/` depending on CWD

### 2026-03-01 — Phase 1: Dead Code Trimming

Deleted 86 files across 9 directories that are unused in VT's Qlib-only pipeline:

- `components/coder/data_science/` (46 files — Kaggle pipeline)
- `components/agent/` (8 files — unused agent framework)
- `components/benchmark/` (3 files — benchmark evaluation)
- `components/interactor/` (1 file — interactive mode)
- `components/coder/model_coder/benchmark/` (8 files — GT model code)
- `log/ui/` (15 files — Streamlit UI)
- `log/server/` (3 files — log visualization server)
- `log/mle_summary.py` (1 file)
- `scenarios/qlib/docker/Dockerfile` (1 file)

Fixed `json_loader.py` — removed `FactorTestCaseLoaderFromJsonFile` class that depended on deleted `benchmark/` module.

Result: 101 .py files remaining, zero dangling imports.

### 2026-03-01 — Phase 2: Bug Fixes

- **Missing module**: Copied `scenarios/shared/` from upstream (3 files: `__init__.py`, `get_runtime_info.py`, `runtime_info.py`) — fixes ImportError in 3 files
- **Linux-only `select.poll()`**: Replaced with cross-platform `threading.Thread` readers in `utils/env.py`
- **Docker module-level import**: Changed to lazy `_ensure_docker()` helper in `utils/env.py` — module can now be imported without docker package
- **pandarallel import-time side effect**: Moved `pandarallel.initialize(verbose=1)` to lazy `_ensure_pandarallel()` in `factor_runner.py`
- **Bare `except:` clauses**: Changed to `except Exception:` in `eva_utils.py` (line 334) and `knowledge_management.py` (line 392)
- **CLI dead code**: Removed `fire`/`typer` imports and `main()` entry point from `app/qlib_rd_loop/factor.py`

### 2026-03-01 — Phase 3: Execution Layer Rewrite

Replaced the conda/docker subprocess chain with direct qlib Python API calls.

**Old chain**: `QlibFBWorkspace.execute()` → `CondaEnv.run("qrun conf.yaml")` → subprocess → `read_exp_res.py`

**New chain**: `QlibFBWorkspace.execute()` → `QlibDirectExecutor.run_backtest()` → `qlib.init()` + `task_train()` directly

Changes:

- **Created `vt_mining/executor.py`**: `FactorExecutor` Protocol + `QlibDirectExecutor` implementation + `BacktestConfig`/`BacktestResult` dataclasses
- **Rewrote `scenarios/qlib/experiment/workspace.py`**: Delegates to `QlibDirectExecutor` instead of `CondaEnv`/`DockerEnv`. Return signature `(pd.Series | None, str)` preserved for compatibility.
- **Rewrote `scenarios/qlib/experiment/utils.py`**: Replaced `QTDockerEnv` data generation with direct `subprocess.run()` for `generate.py`

### 2026-02-28 — Initial Fork

- Copied from commit `26560b3d`
- Added this FORK_NOTES.md
- Removed `_smoke_tests/`, `_pyodide/` from marimo (already done at vendor time)
- `scenarios/` already trimmed to `qlib/` only at vendor time
- `app/` already trimmed to `qlib_rd_loop/` only at vendor time
