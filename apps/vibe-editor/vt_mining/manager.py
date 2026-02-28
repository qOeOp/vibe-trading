"""vt_mining/manager.py — Mining task lifecycle management."""
from __future__ import annotations

import json
import logging
import os
import signal
import subprocess
import sys
import time
from datetime import datetime
from typing import Optional

from .models import (
    MiningTask, MiningTaskConfig, MiningProgress,
    DiscoveredFactor, FactorMetrics, TaskStatus,
)

logger = logging.getLogger(__name__)


class MiningTaskManager:
    """
    Manages mining task lifecycle: create, start, cancel, query.

    Tasks run in subprocess workers. Communication is via filesystem:
    - {result_dir}/progress.json — worker writes, manager reads
    - {result_dir}/factors.jsonl — worker appends, manager reads
    - {result_dir}/status.json — worker writes on completion/failure
    """

    def __init__(self, base_dir: str = os.path.expanduser("~/.vt-lab/mining")) -> None:
        self._tasks: dict[str, MiningTask] = {}
        self._base_dir = base_dir
        os.makedirs(base_dir, exist_ok=True)

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
        logger.info(
            "Created mining task %s (mode=%s, loops=%d)",
            task_id, config.mode.value, config.max_loops,
        )
        return task

    def get_task(self, task_id: str) -> Optional[MiningTask]:
        """Get task by ID, refreshing progress if running."""
        task = self._tasks.get(task_id)
        if task and task.status == TaskStatus.RUNNING:
            self.refresh_task_progress(task_id)
            self.refresh_task_factors(task_id)
            self._check_worker_status(task)
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

        # Spawn worker subprocess
        proc = subprocess.Popen(
            [sys.executable, "-m", "vt_mining.worker", config_path],
            cwd=os.path.dirname(os.path.dirname(os.path.abspath(__file__))),
        )

        task.pid = proc.pid
        task.status = TaskStatus.RUNNING
        task.started_at = time.time()
        logger.info("Started worker PID %d for task %s", proc.pid, task_id)
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
            task.progress.current_loop = data.get("current_loop", 0)
            task.progress.max_loops = data.get("max_loops", task.config.max_loops)
            task.progress.factors_discovered = data.get("factors_discovered", 0)
            task.progress.factors_accepted = data.get("factors_accepted", 0)
            task.progress.factors_rejected = data.get("factors_rejected", 0)
            task.progress.best_ic = data.get("best_ic", 0.0)
            task.progress.best_ir = data.get("best_ir", 0.0)
            task.progress.elapsed_seconds = data.get("elapsed_seconds", 0.0)
            task.progress.estimated_remaining_seconds = data.get("estimated_remaining_seconds", 0.0)
            task.progress.current_hypothesis = data.get("current_hypothesis", "")
            task.progress.current_step = data.get("current_step", "")
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
                        description=data.get("description", ""),
                        dedup_score=data.get("dedup_score", 0.0),
                        accepted=data.get("accepted", False),
                    ))
            task.factors = factors
        except (json.JSONDecodeError, OSError) as e:
            logger.warning("Failed to read factors for %s: %s", task_id, e)

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
