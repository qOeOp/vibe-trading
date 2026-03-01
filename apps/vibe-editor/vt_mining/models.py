"""vt_mining/models.py — Data models for mining task management."""
from __future__ import annotations

import time
from dataclasses import dataclass, field
from enum import Enum
from typing import Optional


class MiningMode(str, Enum):
    """RD-Agent mining mode."""
    FACTOR = "factor"               # Autonomous factor discovery
    FACTOR_REPORT = "factor_report"  # Extract factors from PDF reports
    QUANT = "quant"                 # Joint factor + model optimization


class TaskStatus(str, Enum):
    """Mining task lifecycle state. Values match frontend TypeScript TaskStatus."""
    PENDING = "PENDING"
    RUNNING = "RUNNING"
    COMPLETED = "COMPLETED"
    FAILED = "FAILED"
    CANCELLED = "CANCELLED"


@dataclass
class DateRange:
    """Train/validation/test date splits for Qlib."""
    train_start: str = "2008-01-01"
    train_end: str = "2014-12-31"
    valid_start: str = "2015-01-01"
    valid_end: str = "2016-12-31"
    test_start: str = "2017-01-01"
    test_end: str = "2024-12-31"

    def to_dict(self) -> dict:
        return {
            "trainStart": self.train_start,
            "trainEnd": self.train_end,
            "validStart": self.valid_start,
            "validEnd": self.valid_end,
            "testStart": self.test_start,
            "testEnd": self.test_end,
        }


@dataclass
class MiningTaskConfig:
    """Configuration for a mining task."""
    mode: MiningMode = MiningMode.FACTOR
    max_loops: int = 10
    llm_model: str = "deepseek/deepseek-chat"
    universe: str = "csi300"
    date_range: DateRange = field(default_factory=DateRange)
    dedup_threshold: float = 0.99
    seed_factors: list = field(default_factory=list)
    report_files: list = field(default_factory=list)

    def to_dict(self) -> dict:
        return {
            "mode": self.mode.value,
            "maxLoops": self.max_loops,
            "llmModel": self.llm_model,
            "universe": self.universe,
            "dateRange": self.date_range.to_dict(),
            "dedupThreshold": self.dedup_threshold,
            "seedFactors": self.seed_factors,
            "reportFiles": self.report_files,
        }


@dataclass
class FactorMetrics:
    """Quantitative metrics for a discovered factor."""
    ic: float = 0.0
    icir: float = 0.0
    rank_ic: float = 0.0
    rank_icir: float = 0.0
    turnover: float = 0.0
    arr: float = 0.0
    sharpe: float = 0.0
    max_drawdown: float = 0.0

    def to_dict(self) -> dict:
        return {
            "ic": self.ic,
            "icir": self.icir,
            "rankIc": self.rank_ic,
            "rankIcir": self.rank_icir,
            "turnover": self.turnover,
            "arr": self.arr,
            "sharpe": self.sharpe,
            "maxDrawdown": self.max_drawdown,
        }


@dataclass
class DiscoveredFactor:
    """A factor discovered by the mining process."""
    name: str
    code: str
    metrics: FactorMetrics
    generation: int = 0
    # Per-factor fields (from RD-Agent factor spec)
    hypothesis: str = ""   # Round-level hypothesis under which this factor was generated
    reason: str = ""       # LLM's reasoning for the hypothesis
    description: str = ""  # Natural language description, e.g. "[Momentum Factor] ..."
    formulation: str = ""  # LaTeX math formula
    variables: str = ""    # Variable definitions (raw string from log)
    dedup_score: float = 0.0
    accepted: bool = False

    def to_dict(self) -> dict:
        return {
            "name": self.name,
            "code": self.code,
            "metrics": self.metrics.to_dict(),
            "generation": self.generation,
            "hypothesis": self.hypothesis,
            "reason": self.reason,
            "description": self.description,
            "formulation": self.formulation,
            "variables": self.variables,
            "dedupScore": self.dedup_score,
            "accepted": self.accepted,
        }


@dataclass
class MiningProgress:
    """Real-time progress of a mining task."""
    current_loop: int = 0
    max_loops: int = 10
    factors_discovered: int = 0
    factors_accepted: int = 0
    factors_rejected: int = 0
    best_ic: float = 0.0
    best_ir: float = 0.0
    elapsed_seconds: float = 0.0
    estimated_remaining_seconds: float = 0.0
    current_hypothesis: str = ""
    current_step: str = ""  # "hypothesis" | "coding" | "running" | "feedback"

    def to_dict(self) -> dict:
        return {
            "currentLoop": self.current_loop,
            "maxLoops": self.max_loops,
            "factorsDiscovered": self.factors_discovered,
            "factorsAccepted": self.factors_accepted,
            "factorsRejected": self.factors_rejected,
            "bestIc": self.best_ic,
            "bestIr": self.best_ir,
            "elapsedSeconds": self.elapsed_seconds,
            "estimatedRemainingSeconds": self.estimated_remaining_seconds,
            "currentHypothesis": self.current_hypothesis,
            "currentStep": self.current_step,
        }


@dataclass
class MiningTask:
    """A mining task with full lifecycle state."""
    task_id: str
    config: MiningTaskConfig
    status: TaskStatus = TaskStatus.PENDING
    progress: MiningProgress = field(default_factory=MiningProgress)
    factors: list = field(default_factory=list)
    error_message: str = ""
    result_dir: str = ""
    pid: Optional[int] = None
    created_at: float = field(default_factory=time.time)
    started_at: Optional[float] = None
    completed_at: Optional[float] = None

    def to_dict(self) -> dict:
        return {
            "taskId": self.task_id,
            "config": self.config.to_dict(),
            "status": self.status.value,
            "progress": self.progress.to_dict(),
            "factors": [f.to_dict() for f in self.factors],
            "errorMessage": self.error_message,
            "resultDir": self.result_dir,
            "pid": self.pid,
            "createdAt": self.created_at,
            "startedAt": self.started_at,
            "completedAt": self.completed_at,
        }
