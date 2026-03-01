"""Qlib experiment workspace — executes backtest via direct Python API.

Original implementation used CondaEnv/DockerEnv subprocess to run `qrun`
CLI tool. This version calls qlib API directly through QlibDirectExecutor,
eliminating the conda subprocess chain.

The return signature (pd.Series | None, str) is preserved for compatibility
with QlibFactorRunner.develop() which unpacks the result as:
    result, stdout = exp.experiment_workspace.execute(...)
"""
import re
from pathlib import Path
from typing import Any

import pandas as pd

from rdagent.core.experiment import FBWorkspace
from rdagent.log import rdagent_logger as logger


class QlibFBWorkspace(FBWorkspace):
    def __init__(self, template_folder_path: Path, *args, **kwargs) -> None:
        super().__init__(*args, **kwargs)
        self.inject_code_from_folder(template_folder_path)

    def execute(
        self,
        qlib_config_name: str = "conf.yaml",
        run_env: dict = {},
        *args,
        **kwargs,
    ) -> tuple[pd.Series | None, str]:
        """Run qlib backtest via direct Python API.

        Returns:
            (metrics_series, filtered_log) on success
            (None, error_log) on failure
        """
        from vt_mining.executor import QlibDirectExecutor

        executor = QlibDirectExecutor()
        result = executor.run_backtest(
            workspace_path=self.workspace_path,
            qlib_config_name=qlib_config_name,
            run_env=run_env,
        )

        if not result.success:
            logger.error(f"Backtest failed: {result.error}")
            return None, result.log

        # Log returns chart if available
        if result.returns_path and result.returns_path.exists():
            ret_df = pd.read_pickle(result.returns_path)
            logger.log_object(ret_df, tag="Quantitative Backtesting Chart")

        logger.log_object(result.log, tag="Qlib_execute_log")
        return result.metrics, result.log
