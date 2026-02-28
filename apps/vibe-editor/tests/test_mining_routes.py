"""tests/test_mining_routes.py"""
import json
import pytest
from unittest.mock import MagicMock, patch
from starlette.testclient import TestClient
from starlette.applications import Starlette
from vt_mining.routes import router as mining_router
from vt_mining.models import MiningTask, MiningTaskConfig, TaskStatus, MiningProgress


@pytest.fixture
def app():
    """Create test Starlette app with mining routes."""
    app = Starlette()
    app.mount("/api/mining", app=mining_router, name="mining")

    # Mock manager on app.state
    mock_manager = MagicMock()
    app.state.vt_mining_manager = mock_manager
    return app, mock_manager


@pytest.fixture
def client(app):
    return TestClient(app[0]), app[1]


def _make_task(task_id="mining_001", status=TaskStatus.PENDING):
    config = MiningTaskConfig()
    task = MiningTask(task_id=task_id, config=config, status=status)
    return task


def test_create_task(client):
    tc, mock_mgr = client
    task = _make_task()
    mock_mgr.create_task.return_value = task
    mock_mgr.start_task.return_value = task

    resp = tc.post("/api/mining/tasks", json={"mode": "factor", "config": {"maxLoops": 5}})
    assert resp.status_code == 200
    data = resp.json()
    assert data["taskId"] == "mining_001"


def test_get_task(client):
    tc, mock_mgr = client
    task = _make_task(status=TaskStatus.RUNNING)
    mock_mgr.get_task.return_value = task

    resp = tc.get("/api/mining/tasks/mining_001")
    assert resp.status_code == 200
    assert resp.json()["taskId"] == "mining_001"


def test_get_task_not_found(client):
    tc, mock_mgr = client
    mock_mgr.get_task.return_value = None

    resp = tc.get("/api/mining/tasks/nonexistent")
    assert resp.status_code == 404


def test_list_tasks(client):
    tc, mock_mgr = client
    mock_mgr.list_tasks.return_value = [_make_task("t1"), _make_task("t2")]

    resp = tc.get("/api/mining/tasks")
    assert resp.status_code == 200
    assert len(resp.json()["tasks"]) == 2


def test_cancel_task(client):
    tc, mock_mgr = client
    mock_mgr.cancel_task.return_value = True

    resp = tc.post("/api/mining/tasks/mining_001/cancel")
    assert resp.status_code == 200
    assert resp.json()["success"] is True


def test_cancel_task_not_found(client):
    tc, mock_mgr = client
    mock_mgr.cancel_task.return_value = False

    resp = tc.post("/api/mining/tasks/nonexistent/cancel")
    assert resp.status_code == 404


def test_get_task_results(client):
    tc, mock_mgr = client
    task = _make_task(status=TaskStatus.COMPLETED)
    mock_mgr.get_task.return_value = task

    resp = tc.get("/api/mining/tasks/mining_001/results")
    assert resp.status_code == 200
    assert "factors" in resp.json()
