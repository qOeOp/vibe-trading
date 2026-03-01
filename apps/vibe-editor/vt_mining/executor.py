"""vt_mining/executor.py — Factor execution and qlib backtest layer.

Replaces rdagent's CondaEnv/DockerEnv subprocess chain with direct
qlib Python API calls.  The worker subprocess already has qlib installed
in its environment, so we can call qlib.init() + task_train() directly.

Design:
  FactorExecutor (Protocol)
    └── QlibDirectExecutor — production implementation
"""
from __future__ import annotations

import io
import logging
import os
import re
import sys
import traceback
from contextlib import redirect_stdout, redirect_stderr
from dataclasses import dataclass, field
from pathlib import Path
from typing import Protocol

import pandas as pd

logger = logging.getLogger(__name__)


# ── Data classes ──────────────────────────────────────────────────────────────

@dataclass
class BacktestConfig:
    """Input configuration for qlib backtest."""
    provider_uri: str = "~/.qlib/qlib_data/cn_data"
    region: str = "cn"
    train_start: str = "2008-01-01"
    train_end: str = "2014-12-31"
    valid_start: str = "2015-01-01"
    valid_end: str = "2016-12-31"
    test_start: str = "2017-01-01"
    test_end: str | None = None
    # Model config — defaults match rdagent's LGBModel setup
    model_class: str = "LGBModel"
    model_module: str = "qlib.contrib.model.gbdt"
    model_kwargs: dict = field(default_factory=lambda: {
        "loss": "mse",
        "colsample_bytree": 0.8879,
        "learning_rate": 0.2,
        "subsample": 0.8789,
        "lambda_l1": 205.6999,
        "lambda_l2": 580.9768,
        "max_depth": 8,
        "num_leaves": 210,
        "num_threads": 20,
    })


@dataclass
class BacktestResult:
    """Output from qlib backtest."""
    metrics: pd.Series | None = None  # IC, ICIR, Rank IC, Sharpe, etc.
    returns_path: Path | None = None  # ret.pkl
    success: bool = False
    error: str | None = None
    log: str = ""


# ── Protocol ──────────────────────────────────────────────────────────────────

class FactorExecutor(Protocol):
    """Minimal contract for factor backtest execution."""

    def run_backtest(
        self,
        workspace_path: Path,
        qlib_config_name: str,
        run_env: dict[str, str],
    ) -> BacktestResult:
        """Run qlib backtest and return metrics.

        This matches the signature expected by QlibFBWorkspace.execute(),
        keeping the workspace_path + config_name + env convention from
        the original rdagent code.
        """
        ...


# ── Implementation ────────────────────────────────────────────────────────────

class QlibDirectExecutor:
    """Execute qlib backtest via Python API — no subprocess, no conda.

    Replaces the old pipeline:
      QlibCondaEnv → subprocess("qrun conf.yaml") → subprocess("python read_exp_res.py")

    With:
      qlib.init() → render YAML → task_train() → extract metrics from Recorder
    """

    def __init__(self, config: BacktestConfig | None = None):
        self._config = config or BacktestConfig()
        self._qlib_initialized = False

    def _ensure_qlib(self) -> None:
        """Initialize qlib once per executor lifetime."""
        if self._qlib_initialized:
            return
        import qlib
        provider_uri = os.path.expanduser(self._config.provider_uri)
        qlib.init(provider_uri=provider_uri, region=self._config.region)
        self._qlib_initialized = True

    def run_backtest(
        self,
        workspace_path: Path,
        qlib_config_name: str,
        run_env: dict[str, str],
    ) -> BacktestResult:
        """Run qlib backtest directly via Python API.

        Args:
            workspace_path: Directory containing YAML configs + factor data.
            qlib_config_name: YAML config filename (e.g. "conf_combined_factors.yaml").
            run_env: Environment variables with date ranges and optional hyperparams.

        Returns:
            BacktestResult with metrics and log.
        """
        try:
            self._ensure_qlib()

            # 1. Load and render YAML config (with Jinja2 template substitution)
            config = self._load_config(workspace_path, qlib_config_name, run_env)

            # 2. Ensure workspace is on sys.path (for custom factor imports)
            ws_str = str(workspace_path)
            if ws_str not in sys.path:
                sys.path.insert(0, ws_str)

            # 3. Run qlib training + backtest pipeline
            log_capture = io.StringIO()
            try:
                with redirect_stdout(log_capture), redirect_stderr(log_capture):
                    from qlib.model.trainer import task_train
                    recorder = task_train(
                        config["task"],
                        experiment_name="vt_factor_eval",
                    )
            finally:
                # Remove workspace from sys.path
                if ws_str in sys.path:
                    sys.path.remove(ws_str)

            raw_log = log_capture.getvalue()

            # 4. Extract metrics directly from recorder (replaces read_exp_res.py)
            metrics = pd.Series(recorder.list_metrics())

            # Save qlib_res.csv for compatibility with downstream code
            metrics_path = workspace_path / "qlib_res.csv"
            metrics.to_csv(metrics_path)

            # 5. Extract portfolio returns
            returns_path = workspace_path / "ret.pkl"
            try:
                ret_df = recorder.load_object(
                    "portfolio_analysis/report_normal_1day.pkl"
                )
                ret_df.to_pickle(returns_path)
            except Exception as e:
                logger.warning("Could not load portfolio returns: %s", e)
                returns_path = None

            # 6. Filter log to training progress lines (same regex as original)
            pattern = r"(Epoch\d+: train -[0-9\.]+, valid -[0-9\.]+|best score: -[0-9\.]+ @ \d+ epoch)"
            matches = re.findall(pattern, raw_log)
            filtered_log = "\n".join(matches)

            return BacktestResult(
                metrics=metrics,
                returns_path=returns_path,
                success=True,
                log=filtered_log,
            )

        except Exception as e:
            logger.error("Backtest failed: %s", e)
            return BacktestResult(
                success=False,
                error=str(e),
                log=traceback.format_exc(),
            )

    def _load_config(
        self,
        workspace_path: Path,
        config_name: str,
        run_env: dict[str, str],
    ) -> dict:
        """Load YAML config with Jinja2 template rendering.

        This replicates what `qrun` does internally:
        1. Read the YAML file
        2. Render Jinja2 templates ({{ train_start }}, etc.)
        3. Parse YAML with anchors/aliases
        """
        config_path = workspace_path / config_name
        if not config_path.exists():
            raise FileNotFoundError(f"Config not found: {config_path}")

        raw_text = config_path.read_text()

        # Render Jinja2 templates with env variables
        try:
            from jinja2 import Template
            template = Template(raw_text)
            rendered = template.render(**run_env)
        except ImportError:
            # Fallback: simple string replacement if jinja2 not available
            rendered = raw_text
            for key, value in run_env.items():
                rendered = rendered.replace(f"{{{{ {key} }}}}", str(value))

        # Parse YAML
        from ruamel.yaml import YAML
        yaml = YAML(typ="safe", pure=True)
        config = yaml.load(rendered)

        return config
