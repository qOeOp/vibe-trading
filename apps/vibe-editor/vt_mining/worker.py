"""vt_mining/worker.py — Subprocess worker that runs RD-Agent loops.

Must be invoked with the uv venv Python:
  apps/vibe-editor/.venv/bin/python worker.py <config_json>

Architecture:
- Worker runs VTFactorRDLoop (our subclass of FactorRDLoop) from vendored rdagent.
- rdagent is importable via PYTHONPATH pointing to apps/vibe-editor/.
- qlib is installed in the same venv — backtest runs via direct Python API (no subprocess).
- Progress/results are written to filesystem via structured callbacks (not log parsing).
- API keys are passed via environment variables from .env.

VTFactorRDLoop (vt_mining/rdagent_loop.py) overrides each step to capture:
  - hypothesis + reason → rounds.json (written immediately after LLM responds)
  - factor code + metadata → factors.jsonl (written immediately after qlib evaluation)
  - loop counters → progress.json (updated at each step transition)
"""
from __future__ import annotations

import json
import logging
import os
import sys
import time
from dataclasses import dataclass
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
    test_end: str = "2024-12-31"
    result_dir: str = ""
    universe: str = "csi300"
    dedup_threshold: float = 0.99


def _resolve_qlib_data_dir() -> str:
    """Resolve the shared Qlib market data directory.

    This is READ-ONLY infrastructure data (daily_pv.h5, ~2.4GB) shared across
    all users. It contains historical price/volume data for backtesting.
    NOT per-user — it's the same market data for everyone.

    Search order:
      1. VT_FACTOR_DATA_DIR env var (explicit override)
      2. ~/.vt-lab/factor_data/ (default server-level location)
    """
    from_env = os.environ.get("VT_FACTOR_DATA_DIR")
    if from_env:
        return os.path.expanduser(from_env)
    return os.path.expanduser("~/.vt-lab/factor_data")


def build_env_config(config: WorkerConfig) -> dict[str, str]:
    """Build environment variables for RD-Agent from WorkerConfig.

    These are merged into os.environ BEFORE importing rdagent, because rdagent
    reads pydantic-settings at import time.
    """
    data_dir = _resolve_qlib_data_dir()
    data_dir_full = os.path.join(data_dir, "full")
    data_dir_debug = os.path.join(data_dir, "debug")

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
        "QLIB_FACTOR_TEST_END": config.test_end,

        # Factor data paths — absolute, decoupled from CWD
        # FactorCoSTEERSettings reads FACTOR_CoSTEER_ prefix
        "FACTOR_CoSTEER_data_folder": data_dir_full,
        "FACTOR_CoSTEER_data_folder_debug": data_dir_debug,

        # Point rdagent workspace to our task result dir so artefacts are colocated
        "WORKSPACE_PATH": config.result_dir,
    }
    return env


def write_progress(result_dir: str, **kwargs: Any) -> None:
    """Write progress.json for main process to poll."""
    path = os.path.join(result_dir, "progress.json")
    with open(path, "w") as f:
        json.dump(kwargs, f)


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




def _patch_rdagent_embedding() -> None:
    """Patch rdagent's litellm backend to honour embedding_openai_base_url/api_key.

    The vendored rdagent calls litellm.embedding() without forwarding these two
    settings, so custom providers (e.g. SiliconFlow) are not reachable.
    We monkey-patch the method on the class after import.
    """
    try:
        from rdagent.oai.backend.litellm import LiteLLMAPIBackend, LITELLM_SETTINGS  # noqa: PLC0415
        from litellm import embedding as _litellm_embedding  # noqa: PLC0415

        def _patched(self: Any, input_content_list: list[str]) -> list[list[float]]:
            model_name = LITELLM_SETTINGS.embedding_model
            extra: dict = {}
            if LITELLM_SETTINGS.embedding_openai_base_url:
                extra["api_base"] = LITELLM_SETTINGS.embedding_openai_base_url
            if LITELLM_SETTINGS.embedding_openai_api_key:
                extra["api_key"] = LITELLM_SETTINGS.embedding_openai_api_key
            response = _litellm_embedding(model=model_name, input=input_content_list, **extra)
            return [data["embedding"] for data in response.data]

        LiteLLMAPIBackend._create_embedding_inner_function = _patched  # type: ignore[method-assign]
        logger.info("Patched rdagent embedding to use configured api_base/api_key")
    except Exception as exc:
        logger.warning("Could not patch rdagent embedding: %s", exc)


def run_mining_worker(config_json: str) -> None:
    """
    Entry point for the mining worker subprocess.

    Runs in uv venv with rdagent + qlib + LLM deps.
    PYTHONPATH is set by manager to apps/vibe-editor/ so vendored rdagent/ is importable.

    Flow:
    1. Load config, set env vars before importing rdagent (pydantic-settings reads at import)
    2. Import rdagent + VTFactorRDLoop (heavy, only in worker)
    3. Run VTFactorRDLoop — subclasses FactorRDLoop with structured callbacks:
       - direct_exp_gen: LLM generates hypothesis → rounds.json written immediately
       - coding: LLM generates factor code (CoSTEER synthesis)
       - running: qlib backtest via direct Python API → factors.jsonl appended immediately
       - feedback: LLM evaluates, decides to accept/reject → progress.json updated
    4. Write final status (factors accumulated by callbacks during run)
    """
    with open(config_json) as f:
        raw = json.load(f)

    config = WorkerConfig(**raw)

    # 1. Set environment variables BEFORE importing rdagent (pydantic-settings reads at import)
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
        # Import rdagent — from vendored copy via PYTHONPATH
        import asyncio  # noqa: PLC0415
        from rdagent.app.qlib_rd_loop.factor import FactorRDLoop  # noqa: PLC0415
        from rdagent.app.qlib_rd_loop.conf import FACTOR_PROP_SETTING  # noqa: PLC0415

        from vt_mining.rdagent_loop import VTFactorRDLoop  # noqa: PLC0415

        # Patch rdagent's litellm backend so embedding() receives api_base/api_key.
        _patch_rdagent_embedding()

        write_progress(
            config.result_dir,
            currentLoop=0,
            maxLoops=config.max_loops,
            currentStep="running",
            factorsDiscovered=0,
            factorsAccepted=0,
            factorsRejected=0,
        )

        # Build VTFactorRDLoop: our mixin on top of FactorRDLoop.
        # MRO: VTFactorLoop → VTFactorRDLoop → FactorRDLoop → RDLoop → LoopBase
        # VTFactorRDLoop overrides each step to write structured JSON directly.
        # NOTE: Class must be defined at module top level for pickle compatibility
        # (LoopBase uses pickle for checkpointing). We inject the class into the
        # global namespace here since FactorRDLoop import is deferred to runtime.
        import vt_mining.rdagent_loop as _rdagent_loop_mod  # noqa: PLC0415
        _rdagent_loop_mod._make_loop_class(FactorRDLoop)
        VTFactorLoop = _rdagent_loop_mod.VTFactorLoop  # noqa: PLC0415

        loop = VTFactorLoop(
            FACTOR_PROP_SETTING,
            result_dir=config.result_dir,
            max_loops=config.max_loops,
        )
        asyncio.run(loop.run(loop_n=config.max_loops))

        n_accepted = loop._vt_factors_accepted  # type: ignore[attr-defined]
        n_rejected = loop._vt_factors_rejected  # type: ignore[attr-defined]
        n_factors = n_accepted + n_rejected

        write_progress(
            config.result_dir,
            currentLoop=config.max_loops,
            maxLoops=config.max_loops,
            currentStep="completed",
            factorsDiscovered=n_factors,
            factorsAccepted=n_accepted,
            factorsRejected=n_rejected,
        )
        write_status(
            config.result_dir,
            status="completed",
            summary={
                "total_loops": config.max_loops,
                "factors_accepted": n_accepted,
                "factors_rejected": n_rejected,
            },
        )

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
