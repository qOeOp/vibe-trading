"""tests/test_mining_worker.py"""
import json
import os
import tempfile
import pytest
from unittest.mock import patch, MagicMock
from vt_mining.worker import (
    write_progress, append_factor, write_status,
    build_env_config, WorkerConfig,
)


@pytest.fixture
def tmp_dir():
    with tempfile.TemporaryDirectory() as d:
        yield d


def test_write_progress(tmp_dir):
    write_progress(tmp_dir, current_loop=3, max_loops=10, factors_discovered=5)
    path = os.path.join(tmp_dir, "progress.json")
    assert os.path.exists(path)
    with open(path) as f:
        data = json.load(f)
    assert data["current_loop"] == 3
    assert data["max_loops"] == 10


def test_append_factor(tmp_dir):
    append_factor(tmp_dir, name="F1", code="def f(): ...", metrics={"ic": 0.04}, accepted=True)
    append_factor(tmp_dir, name="F2", code="def g(): ...", metrics={"ic": 0.02}, accepted=False)
    path = os.path.join(tmp_dir, "factors.jsonl")
    with open(path) as f:
        lines = [json.loads(line) for line in f if line.strip()]
    assert len(lines) == 2
    assert lines[0]["name"] == "F1"
    assert lines[0]["accepted"] is True
    assert lines[1]["accepted"] is False


def test_write_status_completed(tmp_dir):
    write_status(tmp_dir, status="completed", summary={"total": 10, "accepted": 3})
    path = os.path.join(tmp_dir, "status.json")
    with open(path) as f:
        data = json.load(f)
    assert data["status"] == "completed"
    assert data["summary"]["accepted"] == 3


def test_write_status_failed(tmp_dir):
    write_status(tmp_dir, status="failed", error="LLM API timeout")
    path = os.path.join(tmp_dir, "status.json")
    with open(path) as f:
        data = json.load(f)
    assert data["status"] == "failed"
    assert data["error"] == "LLM API timeout"


def test_build_env_config():
    wc = WorkerConfig(
        mode="factor",
        max_loops=10,
        llm_model="deepseek/deepseek-chat",
        train_start="2015-01-01",
        train_end="2021-12-31",
        valid_start="2022-01-01",
        valid_end="2023-12-31",
        test_start="2024-01-01",
        qlib_data_dir="/data/qlib/cn_data",
        result_dir="/tmp/results",
    )
    env = build_env_config(wc)
    assert env["CHAT_MODEL"] == "deepseek/deepseek-chat"
    assert env["QLIB_FACTOR_EVOLVING_N"] == "10"
    assert env["QLIB_FACTOR_TRAIN_START"] == "2015-01-01"
