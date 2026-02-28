import os
import pytest
import tempfile
from vt_mining.knowledge import KnowledgeStore, MiningFactorRecord

@pytest.fixture
def store(tmp_path):
    db_path = str(tmp_path / "knowledge.db")
    return KnowledgeStore(db_path=db_path)

def test_add_and_get_factor(store):
    record = MiningFactorRecord(
        id="task_001_factor_0",
        task_id="task_001",
        name="MomentumReversal",
        expression="(close - delay(close, 5)) / delay(close, 5)",
        hypothesis="5日动量反转",
        ic_mean=0.024,
        ic_ir=0.81,
        annual_return=0.187,
        sharpe_ratio=1.42,
        max_drawdown=-0.083,
        code_file="/Users/vx/.vt-lab/mining/task_001/MomentumReversal.py",
    )
    store.add_factor(record)
    result = store.get_factor("task_001_factor_0")
    assert result is not None
    assert result.name == "MomentumReversal"
    assert result.ic_mean == pytest.approx(0.024)
    assert result.workspace_path is None  # initially None

def test_list_factors_empty(store):
    factors = store.list_factors()
    assert factors == []

def test_list_factors_by_status(store):
    r1 = MiningFactorRecord(id="f1", task_id="t1", name="F1", expression="x",
                             ic_mean=0.01, ic_ir=0.5, annual_return=0.1,
                             sharpe_ratio=0.8, max_drawdown=-0.1,
                             code_file="/tmp/f1.py")
    r2 = MiningFactorRecord(id="f2", task_id="t1", name="F2", expression="y",
                             ic_mean=0.02, ic_ir=0.9, annual_return=0.2,
                             sharpe_ratio=1.2, max_drawdown=-0.05,
                             code_file="/tmp/f2.py", status="PAPER_TEST")
    store.add_factor(r1)
    store.add_factor(r2)
    incubating = store.list_factors(status="INCUBATING")
    assert len(incubating) == 1
    assert incubating[0].name == "F1"

def test_update_workspace_path(store):
    record = MiningFactorRecord(id="f1", task_id="t1", name="F1",
                                 expression="x", ic_mean=0.01, ic_ir=0.5,
                                 annual_return=0.1, sharpe_ratio=0.8,
                                 max_drawdown=-0.1, code_file="/tmp/f1.py")
    store.add_factor(record)
    store.update_workspace_path("f1", "/Users/vx/.vt-lab/mining/t1/F1.py")
    updated = store.get_factor("f1")
    assert updated.workspace_path == "/Users/vx/.vt-lab/mining/t1/F1.py"

def test_add_factor_upsert(store):
    """Second add with same id should update rather than error."""
    record = MiningFactorRecord(id="f1", task_id="t1", name="F1",
                                 expression="x", ic_mean=0.01, ic_ir=0.5,
                                 annual_return=0.1, sharpe_ratio=0.8,
                                 max_drawdown=-0.1, code_file="/tmp/f1.py")
    store.add_factor(record)
    record.ic_mean = 0.03
    store.add_factor(record)  # upsert
    result = store.get_factor("f1")
    assert result.ic_mean == pytest.approx(0.03)
