"""vt_mining/worker.py — Subprocess worker that runs RD-Agent loops.

Must be invoked with the rdagent conda environment Python, NOT the marimo Python:
  /opt/homebrew/Caskroom/miniconda/base/envs/rdagent/bin/python -m vt_mining.worker <config_json>

Architecture:
- Worker runs FactorRDLoop from rdagent (no qlib import needed here).
- rdagent internally uses QlibCondaEnv ("rdagent4qlib" conda env) to run qlib backtests.
- Progress/results are written to filesystem so the main process can poll them.
- API keys and MODEL_COSTEER_ENV_TYPE are passed via environment variables.
"""
from __future__ import annotations

import json
import logging
import os
import time
from dataclasses import dataclass
from pathlib import Path
from typing import Any, Optional

logger = logging.getLogger(__name__)


@dataclass
class WorkerConfig:
    """Configuration passed from main process to worker subprocess."""
    mode: str  # "factor" | "factor_report" | "quant"
    max_loops: int
    llm_model: str
    train_start: str
    train_end: str
    valid_start: str
    valid_end: str
    test_start: str
    test_end: Optional[str] = None
    result_dir: str = ""
    universe: str = "csi300"
    dedup_threshold: float = 0.99


def build_env_config(config: WorkerConfig) -> dict[str, str]:
    """Build environment variables for RD-Agent from WorkerConfig.

    These are merged into os.environ BEFORE importing rdagent, because rdagent
    reads pydantic-settings at import time.
    """
    env: dict[str, str] = {
        # LLM — already set by manager via inherited env, but explicit here for clarity
        "CHAT_MODEL": config.llm_model,

        # Factor loop settings (QLIB_FACTOR_ prefix → FactorBasePropSetting)
        "QLIB_FACTOR_EVOLVING_N": str(config.max_loops),
        "QLIB_FACTOR_TRAIN_START": config.train_start,
        "QLIB_FACTOR_TRAIN_END": config.train_end,
        "QLIB_FACTOR_VALID_START": config.valid_start,
        "QLIB_FACTOR_VALID_END": config.valid_end,
        "QLIB_FACTOR_TEST_START": config.test_start,

        # Use conda for qlib execution (not Docker-in-Docker)
        "MODEL_COSTEER_ENV_TYPE": "conda",

        # Point rdagent workspace to our task result dir so artefacts are colocated
        "WORKSPACE_PATH": config.result_dir,
    }
    if config.test_end:
        env["QLIB_FACTOR_TEST_END"] = config.test_end
    return env


def write_progress(result_dir: str, **kwargs: Any) -> None:
    """Write progress.json for main process to poll."""
    path = os.path.join(result_dir, "progress.json")
    with open(path, "w") as f:
        json.dump(kwargs, f)


def append_factor(
    result_dir: str,
    name: str,
    code: str,
    metrics: dict,
    accepted: bool,
    **kwargs: Any,
) -> None:
    """Append a discovered factor to factors.jsonl."""
    path = os.path.join(result_dir, "factors.jsonl")
    entry = {"name": name, "code": code, "metrics": metrics, "accepted": accepted, **kwargs}
    with open(path, "a") as f:
        f.write(json.dumps(entry) + "\n")


def write_status(
    result_dir: str,
    status: str,
    error: str = "",
    summary: Optional[dict] = None,
) -> None:
    """Write terminal status.json (completed/failed)."""
    path = os.path.join(result_dir, "status.json")
    data: dict[str, Any] = {"status": status, "timestamp": time.time()}
    if error:
        data["error"] = error
    if summary:
        data["summary"] = summary
    with open(path, "w") as f:
        json.dump(data, f)


def extract_factors_from_rdagent_workspace(workspace_path: str, result_dir: str) -> int:
    """
    After loop completes, scan rdagent workspace for discovered factors
    and write them to factors.jsonl.

    Returns number of factors written.
    """
    count = 0
    ws = Path(workspace_path)
    if not ws.exists():
        return count

    # rdagent stores factor code in workspace dirs like:
    # {workspace_path}/<session_hash>/workspace/qlib_workspace/combined_factors/
    # and results in qlib_res.csv
    for qlib_ws in ws.rglob("qlib_workspace"):
        factors_dir = qlib_ws / "combined_factors"
        results_csv = qlib_ws / "qlib_res.csv"
        if not factors_dir.exists():
            continue

        metrics: dict[str, float] = {}
        if results_csv.exists():
            try:
                import csv
                with open(results_csv) as f:
                    reader = csv.DictReader(f)
                    for row in reader:
                        # qlib_res.csv has metric name → value
                        for k, v in row.items():
                            try:
                                metrics[k] = float(v)
                            except (ValueError, TypeError):
                                pass
            except Exception:
                pass

        for factor_file in sorted(factors_dir.glob("*.py")):
            name = factor_file.stem
            code = factor_file.read_text(encoding="utf-8", errors="replace")
            ic = metrics.get("IC", 0.0)
            accepted = ic > 0.01  # simple acceptance threshold
            append_factor(
                result_dir,
                name=name,
                code=code,
                metrics={
                    "ic": ic,
                    "icir": metrics.get("ICIR", 0.0),
                    "rankIc": metrics.get("RankIC", 0.0),
                    "rankIcir": metrics.get("RankICIR", 0.0),
                    "annualizedReturn": metrics.get("1day.excess_return_without_cost.annualized_return", 0.0),
                    "maxDrawdown": metrics.get("1day.excess_return_without_cost.max_drawdown", 0.0),
                    "sharpe": metrics.get("1day.excess_return_without_cost.information_ratio", 0.0),
                },
                accepted=accepted,
            )
            count += 1

    return count


def run_mining_worker(config_json: str) -> None:
    """
    Entry point for the mining worker subprocess.

    MUST run in rdagent conda env (has rdagent + LLM deps).
    qlib backtests run in rdagent4qlib conda env (auto-created by rdagent if missing).

    Flow:
    1. Load config, set env vars
    2. Import rdagent (heavy, only in worker)
    3. Run FactorRDLoop — rdagent orchestrates the full R&D loop:
       - LLM generates factor hypothesis + Python code
       - rdagent4qlib runs qlib backtest (conda subprocess)
       - LLM analyzes results, iterates
    4. Extract results from rdagent workspace → factors.jsonl
    5. Write final status
    """
    with open(config_json) as f:
        raw = json.load(f)

    config = WorkerConfig(**raw)

    # Set environment variables BEFORE importing rdagent (pydantic-settings reads at import)
    env_vars = build_env_config(config)
    for key, value in env_vars.items():
        os.environ[key] = value

    write_progress(
        config.result_dir,
        currentLoop=0,
        maxLoops=config.max_loops,
        currentStep="initializing",
        factorsDiscovered=0,
        factorsAccepted=0,
        factorsRejected=0,
    )

    try:
        # Import rdagent — only works in the rdagent conda env
        import asyncio  # noqa: PLC0415
        from rdagent.app.qlib_rd_loop.factor import FactorRDLoop  # noqa: PLC0415
        from rdagent.app.qlib_rd_loop.conf import FACTOR_PROP_SETTING  # noqa: PLC0415

        write_progress(
            config.result_dir,
            currentLoop=0,
            maxLoops=config.max_loops,
            currentStep="running",
            factorsDiscovered=0,
            factorsAccepted=0,
            factorsRejected=0,
        )

        # Run the full R&D loop (async).
        # rdagent will:
        #   1. Create rdagent4qlib conda env if it doesn't exist (~first run only)
        #   2. LLM generates factor hypothesis + Python code
        #   3. rdagent4qlib runs qlib backtest (conda subprocess)
        #   4. LLM analyzes IC results and iterates
        loop = FactorRDLoop(FACTOR_PROP_SETTING)
        asyncio.run(loop.run(loop_n=config.max_loops))

        # Extract discovered factors from rdagent workspace
        workspace_path = os.environ.get("WORKSPACE_PATH", config.result_dir)
        n_factors = extract_factors_from_rdagent_workspace(workspace_path, config.result_dir)

        write_progress(
            config.result_dir,
            currentLoop=config.max_loops,
            maxLoops=config.max_loops,
            currentStep="completed",
            factorsDiscovered=n_factors,
            factorsAccepted=n_factors,
            factorsRejected=0,
        )
        write_status(config.result_dir, status="completed", summary={"total_loops": config.max_loops, "factors": n_factors})

    except Exception as e:
        logger.exception("Mining worker failed: %s", e)
        write_status(config.result_dir, status="failed", error=str(e))
        raise


if __name__ == "__main__":
    import sys
    if len(sys.argv) < 2:
        print("Usage: python -m vt_mining.worker <config_json_path>")
        sys.exit(1)
    run_mining_worker(sys.argv[1])
