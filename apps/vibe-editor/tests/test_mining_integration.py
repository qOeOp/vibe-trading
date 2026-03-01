"""tests/test_mining_integration.py — End-to-end mining API test."""
import json
import os
import tempfile
import time
import pytest
from starlette.testclient import TestClient
from starlette.applications import Starlette
from vt_mining.routes import router as mining_router
from vt_mining.manager import MiningTaskManager


@pytest.fixture
def integration_app():
    """Create a real app with a real MiningTaskManager (no mocks)."""
    tmp_dir = tempfile.mkdtemp()
    app = Starlette()
    app.mount("/api/mining", app=mining_router, name="mining")
    manager = MiningTaskManager(workspace_path=tmp_dir)
    app.state.vt_mining_manager = manager
    return TestClient(app), manager, tmp_dir


def test_full_task_lifecycle(integration_app):
    """Test create → get → list → cancel lifecycle (without actual RD-Agent)."""
    client, manager, tmp_dir = integration_app

    # 1. Create task (will fail to start since RD-Agent isn't available,
    # but we can test the API contract)
    resp = client.post("/api/mining/tasks", json={
        "mode": "factor",
        "config": {"maxLoops": 2, "llmModel": "test-model"},
    })
    # May be 200 (task created+started) or 500 (worker failed to start)
    # Either way, task should exist
    data = resp.json()
    task_id = data.get("taskId")

    if resp.status_code == 500:
        # Worker failed to start — expected without RD-Agent
        task_id = data.get("taskId")
        assert task_id is not None
        # Task should still be in manager
        task = manager.get_task(task_id)
        assert task is not None
        return  # Can't test further without worker

    assert resp.status_code == 200
    assert task_id is not None

    # 2. Get task
    resp = client.get(f"/api/mining/tasks/{task_id}")
    assert resp.status_code == 200

    # 3. List tasks
    resp = client.get("/api/mining/tasks")
    assert resp.status_code == 200
    assert len(resp.json()["tasks"]) >= 1

    # 4. Cancel task
    resp = client.post(f"/api/mining/tasks/{task_id}/cancel")
    assert resp.status_code == 200

    # 5. Get results
    resp = client.get(f"/api/mining/tasks/{task_id}/results")
    assert resp.status_code == 200


def test_simulated_worker_output(integration_app):
    """Test that manager correctly reads worker output files."""
    client, manager, tmp_dir = integration_app

    # Create task without starting worker
    from vt_mining.models import MiningTaskConfig, TaskStatus
    config = MiningTaskConfig(max_loops=5)
    task = manager.create_task(config)
    task.status = TaskStatus.RUNNING

    # Simulate worker writing progress
    with open(os.path.join(task.result_dir, "progress.json"), "w") as f:
        json.dump({"current_loop": 3, "max_loops": 5, "factors_discovered": 7, "best_ic": 0.035}, f)

    # Simulate worker writing factors
    with open(os.path.join(task.result_dir, "factors.jsonl"), "w") as f:
        f.write(json.dumps({"name": "TestFactor", "code": "def f(): pass", "metrics": {"ic": 0.035}, "accepted": True}) + "\n")

    # Get task via API — should show updated progress
    resp = client.get(f"/api/mining/tasks/{task.task_id}")
    assert resp.status_code == 200
    data = resp.json()
    assert data["progress"]["currentLoop"] == 3
    assert data["progress"]["bestIc"] == 0.035

    # Get results
    resp = client.get(f"/api/mining/tasks/{task.task_id}/results")
    assert resp.status_code == 200
    factors = resp.json()["factors"]
    assert len(factors) == 1
    assert factors[0]["name"] == "TestFactor"
