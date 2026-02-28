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

Removed Linux-specific platform guards. Added conda path resolution that works
on both Linux and macOS (see `_ensure_conda_in_path()` in `vt_mining/worker.py`).

## Syncing from Upstream

We do NOT automatically sync from upstream. If a useful upstream commit exists:

1. Read the commit diff carefully
2. Assess if it applies to our architecture
3. Cherry-pick manually and document here

Do NOT run `git pull` or merge upstream automatically.

## Changelog

### 2026-02-28 — Initial Fork

- Copied from commit `26560b3d`
- Added this FORK_NOTES.md
- Removed `_smoke_tests/`, `_pyodide/` from marimo (already done at vendor time)
- `scenarios/` already trimmed to `qlib/` only at vendor time
- `app/` already trimmed to `qlib_rd_loop/` only at vendor time
