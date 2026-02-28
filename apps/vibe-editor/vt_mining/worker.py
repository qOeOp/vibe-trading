"""vt_mining/worker.py — Subprocess worker that runs RD-Agent loops.

This module is designed to run in a child process. It imports RD-Agent,
configures the environment, runs the loop, and writes progress/results
to the filesystem for the main process to read.
"""
from __future__ import annotations

import json
import logging
import os
import time
from dataclasses import dataclass, field
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
    qlib_data_dir: str = "/data/qlib/cn_data"
    result_dir: str = ""
    universe: str = "csi300"
    dedup_threshold: float = 0.99


def build_env_config(config: WorkerConfig) -> dict[str, str]:
    """Build environment variables for RD-Agent from WorkerConfig."""
    env = {
        "CHAT_MODEL": config.llm_model,
        "QLIB_FACTOR_EVOLVING_N": str(config.max_loops),
        "QLIB_FACTOR_TRAIN_START": config.train_start,
        "QLIB_FACTOR_TRAIN_END": config.train_end,
        "QLIB_FACTOR_VALID_START": config.valid_start,
        "QLIB_FACTOR_VALID_END": config.valid_end,
        "QLIB_FACTOR_TEST_START": config.test_start,
        "MODEL_COSTEER_ENV_TYPE": "conda",  # Don't use Docker-in-Docker
    }
    if config.test_end:
        env["QLIB_FACTOR_TEST_END"] = config.test_end
    return env


def write_progress(result_dir: str, **kwargs: Any) -> None:
    """Write progress.json for main process to read."""
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


def run_mining_worker(config_json: str) -> None:
    """
    Entry point for the mining worker subprocess.

    Called via: python -m vt_mining.worker <config_json_path>

    This function:
    1. Loads config from JSON file
    2. Sets RD-Agent environment variables
    3. Initializes Qlib
    4. Runs FactorRDLoop
    5. Writes progress and results to filesystem
    """
    with open(config_json) as f:
        raw = json.load(f)

    config = WorkerConfig(**raw)

    # Set environment variables BEFORE importing RD-Agent
    env_vars = build_env_config(config)
    for key, value in env_vars.items():
        os.environ[key] = value

    try:
        # Import RD-Agent (heavy imports, only in worker process)
        import qlib
        qlib.init(provider_uri=config.qlib_data_dir, region="cn")

        from rdagent.app.qlib_rd_loop.factor import FactorRDLoop

        write_progress(
            config.result_dir,
            current_loop=0,
            max_loops=config.max_loops,
            current_step="initializing",
        )

        # Run the R&D loop
        loop = FactorRDLoop()
        loop.run(step=config.max_loops)

        # Write final status
        write_status(config.result_dir, status="completed", summary={
            "total_loops": config.max_loops,
        })

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
