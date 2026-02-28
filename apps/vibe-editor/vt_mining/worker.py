"""vt_mining/worker.py — Subprocess worker that runs RD-Agent loops.

Must be invoked with the rdagent conda environment Python, NOT the marimo Python:
  /opt/homebrew/Caskroom/miniconda/base/envs/rdagent/bin/python -m vt_mining.worker <config_json>

Architecture:
- Worker runs VTFactorRDLoop (our subclass of FactorRDLoop) from rdagent.
- rdagent internally uses QlibCondaEnv ("rdagent4qlib" conda env) to run qlib backtests.
- Progress/results are written to filesystem via structured callbacks (not log parsing).
- API keys and MODEL_COSTEER_ENV_TYPE are passed via environment variables.

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


def _ensure_conda_in_path() -> None:
    """Pre-add conda paths to PATH before importing rdagent.

    rdagent's CondaConf model_validator runs:
      conda run -n {CONDA_DEFAULT_ENV} env | grep '^PATH='
    to discover the conda env's full PATH (needed to find qrun, timeout, python).
    This requires 'conda' to be in PATH when the model_validator fires.

    The worker's PATH is inherited from the vibe-editor server process, which may
    not include conda (e.g. when started from an IDE without shell init).

    We derive the conda base from sys.executable:
      /opt/.../miniconda/base/envs/rdagent/bin/python → /opt/.../miniconda/base
    """
    # sys.executable = .../miniconda/base/envs/rdagent/bin/python
    # 4 dirname calls: bin → rdagent → envs → base
    conda_base = os.path.dirname(
        os.path.dirname(os.path.dirname(os.path.dirname(sys.executable)))
    )
    conda_env = os.environ.get("CONDA_DEFAULT_ENV", "rdagent4qlib")

    # Priority order: conda env bin (qrun, timeout, python) first, then conda itself
    paths_to_prepend = [
        os.path.join(conda_base, "envs", conda_env, "bin"),
        os.path.join(conda_base, "condabin"),  # 'conda' command lives here
        os.path.join(conda_base, "bin"),
    ]

    current_path = os.environ.get("PATH", "").split(":")
    new_entries = [p for p in paths_to_prepend if os.path.isdir(p) and p not in current_path]

    if new_entries:
        os.environ["PATH"] = ":".join(new_entries) + ":" + os.environ.get("PATH", "")
        logger.info("Prepended conda paths to PATH: %s", new_entries)


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

        # Use conda for qlib execution (not Docker-in-Docker).
        # CONDA_DEFAULT_ENV tells get_factor_env() which conda env to use for factor
        # code execution (reading daily_pv.h5, computing factor values). That env's
        # PATH is prepended to the subprocess PATH, so 'timeout' is findable there.
        "MODEL_COSTEER_ENV_TYPE": "conda",
        "CONDA_DEFAULT_ENV": "rdagent4qlib",

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

    The installed rdagent (any version/source) calls litellm.embedding() without
    forwarding these two settings, so custom providers (e.g. SiliconFlow) are not
    reachable.  We monkey-patch the method on the class after import so our fix
    works regardless of which rdagent version is in the conda env.
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

    MUST run in rdagent conda env (has rdagent + LLM deps).
    qlib backtests run in rdagent4qlib conda env (auto-created by rdagent if missing).

    Flow:
    1. Load config, set env vars before importing rdagent (pydantic-settings reads at import)
    2. Import rdagent + VTFactorRDLoop (heavy, only in worker)
    3. Run VTFactorRDLoop — subclasses FactorRDLoop with structured callbacks:
       - direct_exp_gen: LLM generates hypothesis → rounds.json written immediately
       - coding: LLM generates factor code (CoSTEER synthesis)
       - running: rdagent4qlib runs qlib backtest → factors.jsonl appended immediately
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

    # 2. Ensure conda + conda env bin are in PATH so CondaConf.change_bin_path()
    #    can run 'conda run -n rdagent4qlib env' to discover qrun/timeout/python paths.
    _ensure_conda_in_path()

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
        # MRO: _Loop → VTFactorRDLoop → FactorRDLoop → RDLoop → LoopBase
        # VTFactorRDLoop overrides each step to write structured JSON directly,
        # replacing the previous approach of parsing ANSI log files post-hoc.
        class _Loop(VTFactorRDLoop, FactorRDLoop):
            pass

        loop = _Loop(
            FACTOR_PROP_SETTING,
            result_dir=config.result_dir,
            max_loops=config.max_loops,
        )
        asyncio.run(loop.run(loop_n=config.max_loops))

        n_accepted = loop._vt_factors_accepted
        n_rejected = loop._vt_factors_rejected
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
