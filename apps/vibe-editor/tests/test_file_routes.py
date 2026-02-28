import os
import pytest
from starlette.testclient import TestClient
from starlette.applications import Starlette
from starlette.routing import Mount

from vt_mining.knowledge import KnowledgeStore, MiningFactorRecord
from vt_sessions.file_routes import router


@pytest.fixture
def client_with_factor(tmp_path):
    """TestClient with a KnowledgeStore that has a real file on disk."""
    store = KnowledgeStore(db_path=str(tmp_path / "knowledge.db"))

    # Create a real .py file to simulate mining output
    code_file = str(tmp_path / "factor.py")
    with open(code_file, "w") as f:
        f.write("def factor(df): return df['close'].pct_change(5)\n")

    record = MiningFactorRecord(
        id="task_001_factor_0",
        task_id="task_001",
        name="TestFactor",
        expression="pct_change(5)",
        ic_mean=0.02,
        ic_ir=0.7,
        annual_return=0.15,
        sharpe_ratio=1.1,
        max_drawdown=-0.08,
        code_file=code_file,
    )
    store.add_factor(record)

    app = Starlette(routes=[Mount("/api/lab", app=router)])
    app.state.vt_knowledge_store = store
    return TestClient(app), store, code_file


def test_resolve_existing_file(client_with_factor):
    client, store, code_file = client_with_factor
    resp = client.post("/api/lab/files/resolve", json={
        "factorId": "task_001_factor_0",
        "codeFile": code_file,
    })
    assert resp.status_code == 200
    data = resp.json()
    assert data["workspacePath"] == code_file
    assert os.path.exists(data["workspacePath"])


def test_resolve_updates_sqlite(client_with_factor):
    client, store, code_file = client_with_factor
    client.post("/api/lab/files/resolve", json={
        "factorId": "task_001_factor_0",
        "codeFile": code_file,
    })
    record = store.get_factor("task_001_factor_0")
    assert record.workspace_path == code_file


def test_resolve_missing_file_returns_404(client_with_factor):
    client, store, _ = client_with_factor
    resp = client.post("/api/lab/files/resolve", json={
        "factorId": "task_001_factor_0",
        "codeFile": "/nonexistent/path/factor.py",
    })
    assert resp.status_code == 404


def test_resolve_missing_factor_id_returns_400(client_with_factor):
    client, _, code_file = client_with_factor
    resp = client.post("/api/lab/files/resolve", json={"codeFile": code_file})
    assert resp.status_code == 400
