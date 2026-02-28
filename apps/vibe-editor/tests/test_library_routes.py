import json
import pytest
from starlette.testclient import TestClient
from starlette.applications import Starlette
from starlette.routing import Mount

from vt_mining.knowledge import KnowledgeStore
from vt_mining.library_routes import router


@pytest.fixture
def client(tmp_path):
    """TestClient with a real in-memory KnowledgeStore."""
    store = KnowledgeStore(db_path=str(tmp_path / "knowledge.db"))
    app = Starlette(routes=[Mount("/api/library", app=router)])
    app.state.vt_knowledge_store = store
    return TestClient(app)


def test_list_factors_empty(client):
    resp = client.get("/api/library/factors")
    assert resp.status_code == 200
    data = resp.json()
    assert data["factors"] == []


def test_push_factor(client):
    body = {
        "taskId": "task_001",
        "factorIndex": 0,
        "name": "MomentumReversal",
        "code": "def factor(df):\n    return df['close'].pct_change(5)",
        "hypothesis": "5日动量反转",
        "metrics": {
            "ic": 0.024,
            "icir": 0.81,
            "arr": 0.187,
            "sharpe": 1.42,
            "maxDrawdown": -0.083,
            "turnover": 0.12,
        },
    }
    resp = client.post("/api/library/factors", json=body)
    assert resp.status_code == 201
    factor = resp.json()
    assert factor["name"] == "MomentumReversal"
    assert factor["source"] == "mining_llm"
    assert factor["status"] == "INCUBATING"
    assert factor["ic"] == pytest.approx(0.024)
    assert "codeFile" in factor
    assert "id" in factor


def test_list_factors_after_push(client):
    body = {
        "taskId": "task_001",
        "factorIndex": 0,
        "name": "TestFactor",
        "code": "return close",
        "hypothesis": "",
        "metrics": {"ic": 0.01, "icir": 0.5, "arr": 0.1,
                     "sharpe": 0.8, "maxDrawdown": -0.1, "turnover": 0.2},
    }
    client.post("/api/library/factors", json=body)
    resp = client.get("/api/library/factors")
    assert resp.status_code == 200
    factors = resp.json()["factors"]
    assert len(factors) == 1
    assert factors[0]["name"] == "TestFactor"


def test_push_same_factor_twice_is_idempotent(client):
    body = {
        "taskId": "task_001",
        "factorIndex": 0,
        "name": "TestFactor",
        "code": "return close",
        "hypothesis": "",
        "metrics": {"ic": 0.01, "icir": 0.5, "arr": 0.1,
                     "sharpe": 0.8, "maxDrawdown": -0.1, "turnover": 0.2},
    }
    client.post("/api/library/factors", json=body)
    resp2 = client.post("/api/library/factors", json=body)
    assert resp2.status_code == 201
    resp_list = client.get("/api/library/factors")
    assert len(resp_list.json()["factors"]) == 1  # still 1, not 2
