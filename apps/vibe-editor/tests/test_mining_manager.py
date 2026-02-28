"""tests/test_mining_manager.py"""
import json
import os
import pytest
import tempfile
from unittest.mock import patch, MagicMock
from vt_mining.manager import MiningTaskManager
from vt_mining.models import MiningTaskConfig, MiningMode, TaskStatus


@pytest.fixture
def tmp_dir():
    with tempfile.TemporaryDirectory() as d:
        yield d


@pytest.fixture
def manager(tmp_dir):
    return MiningTaskManager(base_dir=tmp_dir)


def test_create_task(manager):
    config = MiningTaskConfig(max_loops=5)
    task = manager.create_task(config)
    assert task.status == TaskStatus.PENDING
    assert task.task_id.startswith("mining_")
    assert task.config.max_loops == 5


def test_get_task(manager):
    config = MiningTaskConfig()
    task = manager.create_task(config)
    retrieved = manager.get_task(task.task_id)
    assert retrieved is not None
    assert retrieved.task_id == task.task_id


def test_get_task_not_found(manager):
    assert manager.get_task("nonexistent") is None


def test_list_tasks(manager):
    manager.create_task(MiningTaskConfig())
    manager.create_task(MiningTaskConfig(mode=MiningMode.QUANT))
    tasks = manager.list_tasks()
    assert len(tasks) == 2


def test_list_tasks_filter_status(manager):
    t1 = manager.create_task(MiningTaskConfig())
    t2 = manager.create_task(MiningTaskConfig())
    t1.status = TaskStatus.RUNNING
    tasks = manager.list_tasks(status=TaskStatus.RUNNING)
    assert len(tasks) == 1
    assert tasks[0].task_id == t1.task_id


def test_cancel_task_pending(manager):
    task = manager.create_task(MiningTaskConfig())
    result = manager.cancel_task(task.task_id)
    assert result is True
    assert task.status == TaskStatus.CANCELLED


def test_cancel_task_not_found(manager):
    assert manager.cancel_task("nonexistent") is False


def test_result_dir_created(manager):
    config = MiningTaskConfig()
    task = manager.create_task(config)
    assert task.result_dir != ""
    assert os.path.isdir(task.result_dir)


def test_read_progress_from_file(manager, tmp_dir):
    config = MiningTaskConfig()
    task = manager.create_task(config)
    task.status = TaskStatus.RUNNING

    # Simulate worker writing progress
    progress_file = os.path.join(task.result_dir, "progress.json")
    progress_data = {
        "current_loop": 3, "max_loops": 10,
        "factors_discovered": 5, "factors_accepted": 2,
        "best_ic": 0.041,
    }
    with open(progress_file, "w") as f:
        json.dump(progress_data, f)

    manager.refresh_task_progress(task.task_id)
    assert task.progress.current_loop == 3
    assert task.progress.factors_accepted == 2
    assert task.progress.best_ic == 0.041


def test_read_factors_from_file(manager):
    config = MiningTaskConfig()
    task = manager.create_task(config)
    task.status = TaskStatus.RUNNING

    # Simulate worker writing factors
    factors_file = os.path.join(task.result_dir, "factors.jsonl")
    with open(factors_file, "w") as f:
        f.write(json.dumps({
            "name": "Mom_Vol_20D", "code": "def f(df): ...",
            "metrics": {"ic": 0.041, "icir": 1.52},
            "generation": 5, "accepted": True,
        }) + "\n")

    manager.refresh_task_factors(task.task_id)
    assert len(task.factors) == 1
    assert task.factors[0].name == "Mom_Vol_20D"
    assert task.factors[0].accepted is True
