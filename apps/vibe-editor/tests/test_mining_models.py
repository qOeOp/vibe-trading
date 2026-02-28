"""tests/test_mining_models.py"""
import pytest
from vt_mining.models import (
    MiningMode,
    TaskStatus,
    MiningTaskConfig,
    DateRange,
    MiningTask,
    MiningProgress,
    DiscoveredFactor,
    FactorMetrics,
)


def test_mining_mode_enum():
    assert MiningMode.FACTOR == "factor"
    assert MiningMode.FACTOR_REPORT == "factor_report"
    assert MiningMode.QUANT == "quant"


def test_task_status_lifecycle():
    assert TaskStatus.PENDING == "pending"
    assert TaskStatus.RUNNING == "running"
    assert TaskStatus.COMPLETED == "completed"
    assert TaskStatus.FAILED == "failed"
    assert TaskStatus.CANCELLED == "cancelled"


def test_date_range_defaults():
    dr = DateRange()
    assert dr.train_start == "2015-01-01"
    assert dr.test_end is None


def test_mining_task_config_defaults():
    config = MiningTaskConfig()
    assert config.mode == MiningMode.FACTOR
    assert config.max_loops == 10
    assert config.llm_model == "deepseek/deepseek-chat"
    assert config.universe == "csi300"


def test_mining_task_creation():
    config = MiningTaskConfig(max_loops=5)
    task = MiningTask(task_id="mining_001", config=config)
    assert task.status == TaskStatus.PENDING
    assert task.task_id == "mining_001"
    assert task.started_at is None
    assert task.completed_at is None


def test_mining_progress_serialization():
    progress = MiningProgress(
        current_loop=3,
        max_loops=10,
        factors_discovered=5,
        factors_accepted=2,
    )
    d = progress.to_dict()
    assert d["currentLoop"] == 3
    assert d["factorsAccepted"] == 2


def test_discovered_factor():
    metrics = FactorMetrics(ic=0.041, icir=1.52, rank_ic=0.038)
    factor = DiscoveredFactor(
        name="Mom_Vol_20D",
        code="def factor(df): ...",
        metrics=metrics,
        generation=5,
        accepted=True,
    )
    assert factor.accepted is True
    assert factor.metrics.ic == 0.041


def test_mining_task_to_dict():
    config = MiningTaskConfig()
    task = MiningTask(task_id="t1", config=config)
    d = task.to_dict()
    assert d["taskId"] == "t1"
    assert d["status"] == "pending"
    assert d["config"]["mode"] == "factor"
