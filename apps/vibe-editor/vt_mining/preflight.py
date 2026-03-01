"""vt_mining/preflight.py — Startup self-check for the mining module.

Validates that the mining environment is correctly set up:
  - uv venv exists with the right Python version
  - Critical packages (rdagent, qlib, litellm) are importable
  - Qlib market data files are present
  - .env has required API keys

Call `run_preflight(workspace_path)` at server startup. Returns a
PreflightReport with pass/fail status and actionable messages.
"""
from __future__ import annotations

import logging
import os
import subprocess
import sys
from dataclasses import dataclass, field
from pathlib import Path

logger = logging.getLogger(__name__)

_VIBE_EDITOR_ROOT = Path(__file__).resolve().parent.parent  # apps/vibe-editor/
_VENV_PYTHON = str(_VIBE_EDITOR_ROOT / ".venv" / "bin" / "python")

# Packages critical for mining — if any is missing, mining cannot run.
_CRITICAL_PACKAGES = ["rdagent", "qlib", "litellm", "lightgbm", "pandas", "numpy"]

# Qlib data files required for backtest (inside factor_data/full/).
_REQUIRED_DATA_FILES = ["daily_pv.h5"]


@dataclass
class CheckResult:
    name: str
    passed: bool
    message: str


@dataclass
class PreflightReport:
    checks: list[CheckResult] = field(default_factory=list)

    @property
    def all_passed(self) -> bool:
        return all(c.passed for c in self.checks)

    @property
    def failed(self) -> list[CheckResult]:
        return [c for c in self.checks if not c.passed]

    def summary(self) -> str:
        total = len(self.checks)
        passed = sum(1 for c in self.checks if c.passed)
        lines = [f"Mining preflight: {passed}/{total} checks passed"]
        for c in self.checks:
            status = "PASS" if c.passed else "FAIL"
            lines.append(f"  [{status}] {c.name}: {c.message}")
        return "\n".join(lines)


def _check_venv() -> CheckResult:
    """Check that the uv venv exists and has a valid Python."""
    if not os.path.isfile(_VENV_PYTHON):
        return CheckResult(
            name="venv",
            passed=False,
            message=f"Python not found at {_VENV_PYTHON}. "
                    f"Run: cd apps/vibe-editor && uv venv && uv pip install -r requirements.in",
        )

    # Check Python version
    try:
        result = subprocess.run(
            [_VENV_PYTHON, "-c", "import sys; print(f'{sys.version_info.major}.{sys.version_info.minor}')"],
            capture_output=True, text=True, timeout=10,
        )
        version = result.stdout.strip()
        major, minor = version.split(".")
        if int(major) < 3 or (int(major) == 3 and int(minor) < 11):
            return CheckResult(
                name="venv",
                passed=False,
                message=f"Python {version} found but >= 3.11 required. Recreate venv with Python 3.11+",
            )
        return CheckResult(name="venv", passed=True, message=f"Python {version} at {_VENV_PYTHON}")
    except Exception as e:
        return CheckResult(name="venv", passed=False, message=f"Cannot execute venv Python: {e}")


def _check_packages() -> CheckResult:
    """Check that critical packages are importable in the venv."""
    check_script = "; ".join(f"import {pkg}" for pkg in _CRITICAL_PACKAGES)
    try:
        result = subprocess.run(
            [_VENV_PYTHON, "-c", check_script],
            capture_output=True, text=True, timeout=30,
            env={**os.environ, "PYTHONPATH": str(_VIBE_EDITOR_ROOT)},
        )
        if result.returncode != 0:
            # Find which package failed
            for pkg in _CRITICAL_PACKAGES:
                single = subprocess.run(
                    [_VENV_PYTHON, "-c", f"import {pkg}"],
                    capture_output=True, text=True, timeout=10,
                    env={**os.environ, "PYTHONPATH": str(_VIBE_EDITOR_ROOT)},
                )
                if single.returncode != 0:
                    return CheckResult(
                        name="packages",
                        passed=False,
                        message=f"Cannot import '{pkg}'. Run: "
                                f"cd apps/vibe-editor && .venv/bin/pip install -r requirements.in",
                    )
            return CheckResult(name="packages", passed=False, message=f"Import error: {result.stderr[:200]}")
        return CheckResult(name="packages", passed=True, message=f"All {len(_CRITICAL_PACKAGES)} critical packages OK")
    except Exception as e:
        return CheckResult(name="packages", passed=False, message=f"Package check failed: {e}")


def _check_qlib_data() -> CheckResult:
    """Check that Qlib market data files exist."""
    from .config import FACTOR_DATA_DIR  # noqa: PLC0415

    data_full = os.path.join(FACTOR_DATA_DIR, "full")
    missing = []
    for fname in _REQUIRED_DATA_FILES:
        if not os.path.isfile(os.path.join(data_full, fname)):
            missing.append(fname)

    if missing:
        return CheckResult(
            name="qlib_data",
            passed=False,
            message=f"Missing data files in {data_full}: {missing}. "
                    f"Generate with: python -m qlib.contrib.data.handler",
        )
    return CheckResult(name="qlib_data", passed=True, message=f"Market data present at {data_full}")


def _check_env_keys() -> CheckResult:
    """Check that .env file has at least one LLM API key."""
    dotenv_path = _VIBE_EDITOR_ROOT / ".env"
    if not dotenv_path.exists():
        return CheckResult(
            name="env_keys",
            passed=False,
            message=f"No .env file at {dotenv_path}. Mining requires LLM API keys.",
        )

    with open(dotenv_path) as f:
        content = f.read()

    # Check for at least one API key
    key_patterns = ["DEEPSEEK_API_KEY", "OPENAI_API_KEY", "ANTHROPIC_API_KEY"]
    found = [k for k in key_patterns if k in content]
    if not found:
        return CheckResult(
            name="env_keys",
            passed=False,
            message="No LLM API key found in .env. Set DEEPSEEK_API_KEY or OPENAI_API_KEY.",
        )
    return CheckResult(name="env_keys", passed=True, message=f"API keys found: {', '.join(found)}")


def run_preflight() -> PreflightReport:
    """Run all preflight checks and return a report.

    Called at server startup. Non-blocking — failures are logged as warnings,
    not exceptions. Mining API endpoints will fail gracefully if env is broken.
    """
    report = PreflightReport()
    report.checks.append(_check_venv())
    # Only check packages if venv exists
    if report.checks[-1].passed:
        report.checks.append(_check_packages())
    report.checks.append(_check_qlib_data())
    report.checks.append(_check_env_keys())

    # Log the report
    for line in report.summary().split("\n"):
        if report.all_passed:
            logger.info(line)
        else:
            logger.warning(line)

    return report
