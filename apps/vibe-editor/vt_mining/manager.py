"""vt_mining/manager.py — Mining task lifecycle management."""
from __future__ import annotations

import json
import logging
import os
import signal
import subprocess
import time
from datetime import datetime
from pathlib import Path
from typing import Optional

from .config import get_mining_dir
from .models import (
    MiningTask, MiningTaskConfig, MiningProgress, DateRange,
    DiscoveredFactor, FactorMetrics, MiningMode, TaskStatus,
)

logger = logging.getLogger(__name__)

# ── Worker Python resolution ──────────────────────────────────────────────────
# Worker runs in a uv venv with rdagent + qlib + LLM deps.
# PYTHONPATH is set to apps/vibe-editor/ so vendored rdagent/ is importable.
_VIBE_EDITOR_ROOT = Path(__file__).resolve().parent.parent  # apps/vibe-editor/
_DEFAULT_VENV_PYTHON = str(_VIBE_EDITOR_ROOT / ".venv" / "bin" / "python")
RDAGENT_PYTHON = os.environ.get("RDAGENT_PYTHON", _DEFAULT_VENV_PYTHON)


def _load_mining_env() -> dict[str, str]:
    """Load API keys and LLM config from apps/vibe-editor/.env."""
    dotenv_path = _VIBE_EDITOR_ROOT / ".env"

    env: dict[str, str] = {}
    if dotenv_path.exists():
        logger.info("Loading mining env from %s", dotenv_path)
        with open(dotenv_path) as f:
            for line in f:
                line = line.strip()
                if not line or line.startswith("#") or "=" not in line:
                    continue
                key, _, value = line.partition("=")
                env[key.strip()] = value.strip()
    else:
        logger.warning("No .env file found at %s — API keys may be missing", dotenv_path)

    return env


class MiningTaskManager:
    """
    Manages mining task lifecycle: create, start, cancel, query.

    Tasks run in subprocess workers. Communication is via filesystem:
    - {result_dir}/task.json    — written on create, enables restart recovery
    - {result_dir}/progress.json — worker writes, manager reads
    - {result_dir}/factors.jsonl — worker appends, manager reads
    - {result_dir}/status.json  — worker writes on completion/failure
    """

    def __init__(self, workspace_path: str) -> None:
        """Initialize mining task manager.

        Args:
            workspace_path: User's workspace directory (e.g. ~/.vt-lab/).
                Mining artifacts are stored at {workspace}/mining/{task_id}/.
        """
        self._tasks: dict[str, MiningTask] = {}
        self._workspace_path = workspace_path
        self._base_dir = get_mining_dir(workspace_path)
        os.makedirs(self._base_dir, exist_ok=True)
        self._recover_from_disk()

    def create_task(self, config: MiningTaskConfig) -> MiningTask:
        """Create a new mining task (PENDING state)."""
        task_id = f"mining_{datetime.now().strftime('%Y%m%d_%H%M%S')}_{len(self._tasks):03d}"
        result_dir = os.path.join(self._base_dir, task_id)
        os.makedirs(result_dir, exist_ok=True)

        task = MiningTask(
            task_id=task_id,
            config=config,
            result_dir=result_dir,
            progress=MiningProgress(max_loops=config.max_loops),
        )
        self._tasks[task_id] = task
        self._persist_task_manifest(task)
        logger.info(
            "Created mining task %s (mode=%s, loops=%d)",
            task_id, config.mode.value, config.max_loops,
        )
        return task

    def get_task(self, task_id: str) -> Optional[MiningTask]:
        """Get task by ID, refreshing progress/factors from filesystem."""
        task = self._tasks.get(task_id)
        if task is None:
            return None
        if task.status == TaskStatus.RUNNING:
            self.refresh_task_progress(task_id)
            self._check_worker_status(task)
        # Always refresh factors — worker writes factors.jsonl on completion,
        # so completed tasks also need to load them (especially after recovery).
        if task.status in (TaskStatus.RUNNING, TaskStatus.COMPLETED):
            self.refresh_task_factors(task_id)
        return task

    def list_tasks(self, status: Optional[TaskStatus] = None) -> list[MiningTask]:
        """List all tasks, optionally filtered by status."""
        tasks = list(self._tasks.values())
        if status is not None:
            tasks = [t for t in tasks if t.status == status]
        return sorted(tasks, key=lambda t: t.created_at, reverse=True)

    def cancel_task(self, task_id: str) -> bool:
        """Cancel a task. Kills worker if running."""
        task = self._tasks.get(task_id)
        if task is None:
            return False

        if task.status == TaskStatus.RUNNING and task.pid:
            try:
                os.kill(task.pid, signal.SIGTERM)
                logger.info("Sent SIGTERM to worker PID %d for task %s", task.pid, task_id)
            except ProcessLookupError:
                pass

        task.status = TaskStatus.CANCELLED
        task.completed_at = time.time()
        logger.info("Cancelled task %s", task_id)
        return True

    def start_task(self, task_id: str) -> "MiningTask":
        """Start a pending task by spawning a worker subprocess."""
        task = self._tasks.get(task_id)
        if task is None:
            raise ValueError(f"Task {task_id} not found")
        if task.status != TaskStatus.PENDING:
            raise ValueError(f"Task {task_id} not in PENDING state (is {task.status.value})")

        # Write config file for worker
        config_path = os.path.join(task.result_dir, "config.json")
        config_data = {
            "mode": task.config.mode.value,
            "max_loops": task.config.max_loops,
            "llm_model": task.config.llm_model,
            "train_start": task.config.date_range.train_start,
            "train_end": task.config.date_range.train_end,
            "valid_start": task.config.date_range.valid_start,
            "valid_end": task.config.date_range.valid_end,
            "test_start": task.config.date_range.test_start,
            "test_end": task.config.date_range.test_end,
            "universe": task.config.universe,
            "dedup_threshold": task.config.dedup_threshold,
            "result_dir": task.result_dir,
        }
        with open(config_path, "w") as f:
            json.dump(config_data, f)

        # Build worker environment:
        #   - Inherit current process env (PATH, HOME, etc.)
        #   - Overlay API keys + LLM config from .env
        #   - Set PYTHONPATH so vendored rdagent/ is importable
        worker_env = {**os.environ}
        worker_env.update(_load_mining_env())
        worker_env["PYTHONPATH"] = str(_VIBE_EDITOR_ROOT)

        worker_script = os.path.join(
            os.path.dirname(os.path.abspath(__file__)), "worker.py"
        )

        # Log file captures rdagent's verbose output (LLM calls, qlib logs)
        log_path = os.path.join(task.result_dir, "worker.log")
        log_file = open(log_path, "w")  # noqa: WPS515  (closed when process exits)

        # Worker CWD is the task result dir — all relative paths resolved via env vars.
        proc = subprocess.Popen(
            [RDAGENT_PYTHON, worker_script, config_path],
            cwd=task.result_dir,
            env=worker_env,
            stdout=log_file,
            stderr=subprocess.STDOUT,
        )

        task.pid = proc.pid
        task.status = TaskStatus.RUNNING
        task.started_at = time.time()
        logger.info(
            "Started worker PID %d for task %s (python=%s)",
            proc.pid, task_id, RDAGENT_PYTHON,
        )
        return task

    def refresh_task_progress(self, task_id: str) -> None:
        """Read progress.json from worker and update task."""
        task = self._tasks.get(task_id)
        if not task or not task.result_dir:
            return

        progress_file = os.path.join(task.result_dir, "progress.json")
        if not os.path.exists(progress_file):
            return

        try:
            with open(progress_file) as f:
                data = json.load(f)
            # Worker writes camelCase keys (matching MiningProgress.to_dict())
            task.progress.current_loop = data.get("currentLoop", 0)
            task.progress.max_loops = data.get("maxLoops", task.config.max_loops)
            task.progress.factors_discovered = data.get("factorsDiscovered", 0)
            task.progress.factors_accepted = data.get("factorsAccepted", 0)
            task.progress.factors_rejected = data.get("factorsRejected", 0)
            task.progress.best_ic = data.get("bestIc", 0.0)
            task.progress.best_ir = data.get("bestIr", 0.0)
            task.progress.elapsed_seconds = data.get("elapsedSeconds", 0.0)
            task.progress.estimated_remaining_seconds = data.get("estimatedRemainingSeconds", 0.0)
            task.progress.current_hypothesis = data.get("currentHypothesis", "")
            task.progress.current_step = data.get("currentStep", "")
        except (json.JSONDecodeError, OSError) as e:
            logger.warning("Failed to read progress for %s: %s", task_id, e)

    def refresh_task_factors(self, task_id: str) -> None:
        """Read factors.jsonl from worker and update task."""
        task = self._tasks.get(task_id)
        if not task or not task.result_dir:
            return

        factors_file = os.path.join(task.result_dir, "factors.jsonl")
        if not os.path.exists(factors_file):
            return

        try:
            factors = []
            with open(factors_file) as f:
                for line in f:
                    line = line.strip()
                    if not line:
                        continue
                    data = json.loads(line)
                    metrics_data = data.get("metrics", {})
                    metrics = FactorMetrics(
                        ic=metrics_data.get("ic", 0.0),
                        icir=metrics_data.get("icir", 0.0),
                        rank_ic=metrics_data.get("rank_ic", 0.0),
                        rank_icir=metrics_data.get("rank_icir", 0.0),
                        turnover=metrics_data.get("turnover", 0.0),
                        arr=metrics_data.get("arr", 0.0),
                        sharpe=metrics_data.get("sharpe", 0.0),
                        max_drawdown=metrics_data.get("max_drawdown", 0.0),
                    )
                    factors.append(DiscoveredFactor(
                        name=data.get("name", ""),
                        code=data.get("code", ""),
                        metrics=metrics,
                        generation=data.get("generation", 0),
                        hypothesis=data.get("hypothesis", ""),
                        reason=data.get("reason", ""),
                        description=data.get("description", ""),
                        formulation=data.get("formulation", ""),
                        variables=data.get("variables", ""),
                        dedup_score=data.get("dedup_score", 0.0),
                        accepted=data.get("accepted", False),
                    ))
            task.factors = factors
        except (json.JSONDecodeError, OSError) as e:
            logger.warning("Failed to read factors for %s: %s", task_id, e)

    def _persist_task_manifest(self, task: MiningTask) -> None:
        """Write {result_dir}/task.json — used to rebuild state after server restart."""
        manifest = {
            "taskId": task.task_id,
            "mode": task.config.mode.value,
            "maxLoops": task.config.max_loops,
            "llmModel": task.config.llm_model,
            "universe": task.config.universe,
            "dateRange": task.config.date_range.to_dict(),
            "dedupThreshold": task.config.dedup_threshold,
            "createdAt": task.created_at,
        }
        path = os.path.join(task.result_dir, "task.json")
        try:
            with open(path, "w") as f:
                json.dump(manifest, f)
        except OSError as e:
            logger.warning("Failed to persist task manifest for %s: %s", task.task_id, e)

    def _recover_from_disk(self) -> None:
        """Rebuild in-memory task registry from {base_dir}/*/task.json files."""
        try:
            entries = sorted(os.listdir(self._base_dir))
        except OSError:
            return
        for entry in entries:
            task_dir = os.path.join(self._base_dir, entry)
            manifest_path = os.path.join(task_dir, "task.json")
            if not os.path.isfile(manifest_path):
                continue
            try:
                with open(manifest_path) as f:
                    m = json.load(f)
                dr_raw = m.get("dateRange", {})
                config = MiningTaskConfig(
                    mode=MiningMode(m.get("mode", "factor")),
                    max_loops=m.get("maxLoops", 10),
                    llm_model=m.get("llmModel", ""),
                    universe=m.get("universe", "csi300"),
                    date_range=DateRange(
                        train_start=dr_raw.get("trainStart", "2015-01-01"),
                        train_end=dr_raw.get("trainEnd", "2021-12-31"),
                        valid_start=dr_raw.get("validStart", "2022-01-01"),
                        valid_end=dr_raw.get("validEnd", "2023-12-31"),
                        test_start=dr_raw.get("testStart", "2024-01-01"),
                        test_end=dr_raw.get("testEnd"),
                    ),
                    dedup_threshold=m.get("dedupThreshold", 0.99),
                )
                task = MiningTask(
                    task_id=m["taskId"],
                    config=config,
                    result_dir=task_dir,
                    progress=MiningProgress(max_loops=config.max_loops),
                    created_at=m.get("createdAt", 0.0),
                )
                # Derive status from terminal status.json (RUNNING tasks from previous
                # session are treated as FAILED — the worker is no longer alive).
                status_path = os.path.join(task_dir, "status.json")
                if os.path.exists(status_path):
                    with open(status_path) as sf:
                        s = json.load(sf)
                    if s.get("status") == "completed":
                        task.status = TaskStatus.COMPLETED
                    else:
                        task.status = TaskStatus.FAILED
                        task.error_message = s.get("error", "")
                    task.completed_at = s.get("timestamp")
                else:
                    # No terminal status — assume worker died during previous session
                    task.status = TaskStatus.FAILED
                    task.error_message = "Server restarted while task was running"
                self._tasks[task.task_id] = task
                logger.info("Recovered task %s (status=%s)", task.task_id, task.status.value)
            except Exception as e:
                logger.warning("Skipping unreadable task dir %s: %s", entry, e)

    def _check_worker_status(self, task: MiningTask) -> None:
        """Check if worker process has exited and update status."""
        if task.pid is None:
            return

        # Check status.json (written by worker on exit)
        status_file = os.path.join(task.result_dir, "status.json")
        if os.path.exists(status_file):
            try:
                with open(status_file) as f:
                    data = json.load(f)
                final_status = data.get("status", "completed")
                if final_status == "failed":
                    task.status = TaskStatus.FAILED
                    task.error_message = data.get("error", "Unknown error")
                else:
                    task.status = TaskStatus.COMPLETED
                task.completed_at = time.time()
            except (json.JSONDecodeError, OSError):
                pass
            return

        # Check if process is still alive
        try:
            os.kill(task.pid, 0)  # Signal 0 = check existence
        except ProcessLookupError:
            # Process died without writing status.json
            task.status = TaskStatus.FAILED
            task.error_message = "Worker process exited unexpectedly"
            task.completed_at = time.time()
            logger.error(
                "Worker PID %d for task %s exited without status",
                task.pid, task.task_id,
            )
