"""tests/test_mining_sse.py"""
import json
import os
import tempfile
import pytest
from unittest.mock import MagicMock
from starlette.testclient import TestClient
from starlette.applications import Starlette
from vt_mining.routes import router as mining_router
from vt_mining.models import MiningTask, MiningTaskConfig, TaskStatus, MiningProgress


@pytest.fixture
def tmp_dir():
    with tempfile.TemporaryDirectory() as d:
        yield d


@pytest.fixture
def app_with_task(tmp_dir):
    app = Starlette()
    app.mount("/api/mining", app=mining_router, name="mining")

    mock_manager = MagicMock()
    config = MiningTaskConfig(max_loops=3)
    task = MiningTask(
        task_id="mining_sse_test",
        config=config,
        status=TaskStatus.COMPLETED,  # Completed so SSE terminates immediately
        result_dir=tmp_dir,
        progress=MiningProgress(current_loop=3, max_loops=3),
    )
    mock_manager.get_task.return_value = task
    app.state.vt_mining_manager = mock_manager
    return app, mock_manager, task


def test_sse_stream_returns_event_stream(app_with_task):
    app, _, _ = app_with_task
    client = TestClient(app)
    with client.stream("GET", "/api/mining/tasks/mining_sse_test/stream") as resp:
        assert resp.status_code == 200
        assert "text/event-stream" in resp.headers["content-type"]


def test_sse_stream_not_found():
    app = Starlette()
    app.mount("/api/mining", app=mining_router, name="mining")
    mock_manager = MagicMock()
    mock_manager.get_task.return_value = None
    app.state.vt_mining_manager = mock_manager

    client = TestClient(app)
    resp = client.get("/api/mining/tasks/nonexistent/stream")
    assert resp.status_code == 404
