# Phase 3: 模块联动 Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Mining 挖出的因子可以持久推送到 Library，Library 中的挖掘因子可以一键在 Lab 中打开编辑。

**Architecture:** 三步流转：Mining `推送到Library` → 后端写 SQLite `knowledge.db` + 写 `.py` 文件 → 前端 `addFactor()` 追加到 Library store；Library `在Lab中编辑` → 后端验证文件路径 → 前端导航 `/lab?file=path` → Lab 读 `?file=` param 打开对应 notebook。

**Tech Stack:** Python (sqlite3, dataclasses, starlette), TypeScript/React 19, Zustand, Next.js App Router (`useSearchParams`), pytest, Vitest + RTL

---

## 前置条件

### 分支说明
- **Tasks 1-3**: 在 `.worktrees/phase1-rdagent-integration` 分支 `feature/phase1-rdagent-integration` 上改后端
- **Tasks 4-6**: 在 `.worktrees/phase2-mining-tab` 分支 `feature/phase2-mining-tab` 上改前端
- 两批任务可并行开发，前端 Tasks 4-5 用 mock API，Task 6 最后联调

### 关键已有代码
- `apps/vibe-editor/marimo/_server/api/router.py` — 路由挂载入口，模式是 `app_router.mount("/api/xxx", app=xxx_router, name="xxx")`
- `apps/vibe-editor/marimo/_server/start.py` — 服务初始化，模式是 `app.state.vt_xxx_manager = XxxManager()`
- `apps/vibe-editor/vt_mining/routes.py` — 路由模式参考，`router = Router(routes=[...])`
- `apps/web/src/features/library/store/use-library-store.ts` — Library Zustand store，目前无 `addFactor`
- `apps/web/src/features/factor/mining/components/task-detail-panel.tsx:250-270` — `推送到Library` 按钮已有 UI，但未接线
- `apps/web/src/features/lab/components/lab-page.tsx` — Lab 入口，`buildRuntimeURL(notebookPath)` 用于构建 kernel 连接 URL

---

## Task 1: KnowledgeStore — SQLite CRUD

**分支**: `feature/phase1-rdagent-integration` (`.worktrees/phase1-rdagent-integration`)

**Files:**
- Create: `apps/vibe-editor/vt_mining/knowledge.py`
- Create: `apps/vibe-editor/tests/test_knowledge.py`

### Step 1: 写失败测试

```python
# apps/vibe-editor/tests/test_knowledge.py
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
    assert result.workspace_path is None  # 初始为 None

def test_list_factors_empty(store):
    factors = store.list_factors()
    assert factors == []

def test_list_factors_by_status(store):
    # Add two factors with different statuses
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
```

### Step 2: 运行确认失败

```bash
cd apps/vibe-editor
python -m pytest tests/test_knowledge.py -v
```
Expected: `ModuleNotFoundError: No module named 'vt_mining.knowledge'`

### Step 3: 实现 KnowledgeStore

```python
# apps/vibe-editor/vt_mining/knowledge.py
"""vt_mining/knowledge.py — SQLite-backed knowledge store for mining factors."""
from __future__ import annotations

import os
import sqlite3
from dataclasses import dataclass, field
from datetime import datetime, timezone
from typing import Optional


@dataclass
class MiningFactorRecord:
    """A factor discovered by mining, stored in knowledge.db."""
    id: str                      # "{task_id}_{factor_name}"
    task_id: str
    name: str
    expression: str              # factor formula / code snippet (first 500 chars)
    ic_mean: float
    ic_ir: float
    annual_return: float
    sharpe_ratio: float
    max_drawdown: float
    code_file: str               # absolute path to factor .py file
    hypothesis: str = ""
    workspace_path: Optional[str] = None  # set after Lab file association
    status: str = "INCUBATING"
    created_at: str = field(
        default_factory=lambda: datetime.now(timezone.utc).isoformat()
    )


class KnowledgeStore:
    """SQLite-backed persistence for mining factors."""

    def __init__(self, db_path: str = "~/.vt-lab/knowledge.db") -> None:
        self.db_path = os.path.expanduser(db_path)
        os.makedirs(os.path.dirname(self.db_path), exist_ok=True)
        self._init_schema()

    def _conn(self) -> sqlite3.Connection:
        conn = sqlite3.connect(self.db_path)
        conn.row_factory = sqlite3.Row
        return conn

    def _init_schema(self) -> None:
        with self._conn() as conn:
            conn.execute("""
                CREATE TABLE IF NOT EXISTS mining_factors (
                    id             TEXT PRIMARY KEY,
                    task_id        TEXT NOT NULL,
                    name           TEXT NOT NULL,
                    expression     TEXT NOT NULL,
                    hypothesis     TEXT DEFAULT '',
                    ic_mean        REAL DEFAULT 0,
                    ic_ir          REAL DEFAULT 0,
                    annual_return  REAL DEFAULT 0,
                    sharpe_ratio   REAL DEFAULT 0,
                    max_drawdown   REAL DEFAULT 0,
                    code_file      TEXT NOT NULL,
                    workspace_path TEXT,
                    status         TEXT DEFAULT 'INCUBATING',
                    created_at     TEXT NOT NULL
                )
            """)
            conn.execute(
                "CREATE INDEX IF NOT EXISTS idx_mf_task_id ON mining_factors(task_id)"
            )
            conn.execute(
                "CREATE INDEX IF NOT EXISTS idx_mf_status ON mining_factors(status)"
            )

    def add_factor(self, record: MiningFactorRecord) -> None:
        """Insert or replace a mining factor record (upsert)."""
        with self._conn() as conn:
            conn.execute(
                """
                INSERT OR REPLACE INTO mining_factors
                    (id, task_id, name, expression, hypothesis,
                     ic_mean, ic_ir, annual_return, sharpe_ratio,
                     max_drawdown, code_file, workspace_path, status, created_at)
                VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)
                """,
                (
                    record.id, record.task_id, record.name, record.expression,
                    record.hypothesis, record.ic_mean, record.ic_ir,
                    record.annual_return, record.sharpe_ratio,
                    record.max_drawdown, record.code_file,
                    record.workspace_path, record.status, record.created_at,
                ),
            )

    def get_factor(self, factor_id: str) -> Optional[MiningFactorRecord]:
        """Return a single factor by id, or None."""
        with self._conn() as conn:
            row = conn.execute(
                "SELECT * FROM mining_factors WHERE id = ?", (factor_id,)
            ).fetchone()
        if row is None:
            return None
        return self._row_to_record(row)

    def list_factors(self, status: Optional[str] = None) -> list[MiningFactorRecord]:
        """Return all factors, optionally filtered by status."""
        with self._conn() as conn:
            if status:
                rows = conn.execute(
                    "SELECT * FROM mining_factors WHERE status = ? ORDER BY created_at DESC",
                    (status,),
                ).fetchall()
            else:
                rows = conn.execute(
                    "SELECT * FROM mining_factors ORDER BY created_at DESC"
                ).fetchall()
        return [self._row_to_record(r) for r in rows]

    def update_workspace_path(self, factor_id: str, workspace_path: str) -> None:
        """Set workspace_path after Lab file association is created."""
        with self._conn() as conn:
            conn.execute(
                "UPDATE mining_factors SET workspace_path = ? WHERE id = ?",
                (workspace_path, factor_id),
            )

    @staticmethod
    def _row_to_record(row: sqlite3.Row) -> MiningFactorRecord:
        return MiningFactorRecord(
            id=row["id"],
            task_id=row["task_id"],
            name=row["name"],
            expression=row["expression"],
            hypothesis=row["hypothesis"] or "",
            ic_mean=row["ic_mean"],
            ic_ir=row["ic_ir"],
            annual_return=row["annual_return"],
            sharpe_ratio=row["sharpe_ratio"],
            max_drawdown=row["max_drawdown"],
            code_file=row["code_file"],
            workspace_path=row["workspace_path"],
            status=row["status"],
            created_at=row["created_at"],
        )
```

### Step 4: 运行测试确认通过

```bash
cd apps/vibe-editor
python -m pytest tests/test_knowledge.py -v
```
Expected: `5 passed`

### Step 5: Commit

```bash
git add apps/vibe-editor/vt_mining/knowledge.py apps/vibe-editor/tests/test_knowledge.py
git commit -m "feat(vt-mining): add KnowledgeStore with SQLite CRUD for mining factors"
```

---

## Task 2: `/api/library/factors` 路由

**分支**: `feature/phase1-rdagent-integration`

**Files:**
- Create: `apps/vibe-editor/vt_mining/library_routes.py`
- Modify: `apps/vibe-editor/marimo/_server/api/router.py`
- Modify: `apps/vibe-editor/marimo/_server/start.py`
- Create: `apps/vibe-editor/tests/test_library_routes.py`

### Step 1: 写失败测试

```python
# apps/vibe-editor/tests/test_library_routes.py
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
```

### Step 2: 运行确认失败

```bash
cd apps/vibe-editor
python -m pytest tests/test_library_routes.py -v
```
Expected: `ModuleNotFoundError: No module named 'vt_mining.library_routes'`

### Step 3: 实现 library_routes.py

```python
# apps/vibe-editor/vt_mining/library_routes.py
"""vt_mining/library_routes.py — Library factor persistence API.

Mounted at /api/library/ in the Starlette app.
"""
from __future__ import annotations

import json
import logging
import os
from datetime import datetime, timezone
from typing import TYPE_CHECKING

from starlette.requests import Request
from starlette.responses import JSONResponse
from starlette.routing import Route, Router

if TYPE_CHECKING:
    from .knowledge import KnowledgeStore

from .knowledge import MiningFactorRecord

logger = logging.getLogger(__name__)

BASE_MINING_DIR = os.path.expanduser("~/.vt-lab/mining")


def _get_store(request: Request) -> "KnowledgeStore":
    return request.app.state.vt_knowledge_store


def _record_to_factor_json(record: MiningFactorRecord) -> dict:
    """Convert MiningFactorRecord to frontend Factor JSON shape."""
    return {
        "id": record.id,
        "name": record.name,
        "version": "1.0",
        "category": "动能",          # default; user can change in Library
        "factorType": "leaf",
        "expectedDirection": "positive" if record.ic_mean >= 0 else "negative",
        "source": "mining_llm",
        "status": record.status,
        "expression": record.expression[:200],  # truncate for display
        "ic": record.ic_mean,
        "ir": record.ic_ir,
        "icTstat": 0.0,
        "turnover": 0.0,
        "capacity": 10000,
        "createdAt": record.created_at,
        "createdBy": "RD-Agent",
        "tags": ["挖掘"],
        "icTrend": [],
        "winRate": 50.0,
        "ic60d": record.ic_mean,
        "ic120d": record.ic_mean,
        "quantileReturns": [0.0, 0.0, 0.0, 0.0, 0.0],
        "icTimeSeries": [],
        "benchmarkConfig": {
            "universe": "沪深300",
            "icMethod": "RankIC",
            "winsorization": "MAD",
            "rebalanceDays": 5,
            "quantiles": 5,
        },
        "icDistribution": {
            "icMean": record.ic_mean,
            "icStd": 0.0,
            "icPositiveCount": 0,
            "icNegativeCount": 0,
            "icSignificantRatio": 0.0,
            "icPositiveSignificantRatio": 0.0,
            "icNegativeSignificantRatio": 0.0,
            "icPValue": 1.0,
            "icSkewness": 0.0,
            "icKurtosis": 0.0,
        },
        "icDecayProfile": [],
        "universeProfile": [],
        "rankTestRetention": 0.0,
        "binaryTestRetention": 0.0,
        "vScore": 0.0,
        "icHalfLife": 0,
        "coverageRate": 0.0,
        "longShortReturn": record.annual_return * 100,
        "longShortEquityCurve": [],
        "longSideReturnRatio": 0.0,
        "icHistogramBins": [],
        "quantileCumulativeReturns": [[], [], [], [], []],
        "lookback": 5,
        "statusHistory": [],
        # Mining-specific extension fields
        "codeFile": record.code_file,
        "workspacePath": record.workspace_path,
        "taskId": record.task_id,
        "annualReturn": record.annual_return,
        "sharpeRatio": record.sharpe_ratio,
        "maxDrawdown": record.max_drawdown,
        "hypothesis": record.hypothesis,
    }


async def list_factors_endpoint(request: Request) -> JSONResponse:
    """GET /api/library/factors — List all mining factors."""
    status_filter = request.query_params.get("status")
    store = _get_store(request)
    records = store.list_factors(status=status_filter or None)
    return JSONResponse({"factors": [_record_to_factor_json(r) for r in records]})


async def push_factor_endpoint(request: Request) -> JSONResponse:
    """POST /api/library/factors — Push a discovered factor to Library."""
    try:
        body = await request.json()
    except (json.JSONDecodeError, ValueError):
        return JSONResponse({"error": "Invalid JSON body"}, status_code=400)

    task_id = body.get("taskId", "")
    factor_name = body.get("name", "")
    if not task_id or not factor_name:
        return JSONResponse(
            {"error": "taskId and name are required"}, status_code=400
        )

    code = body.get("code", "")
    metrics = body.get("metrics", {})
    factor_index = body.get("factorIndex", 0)
    factor_id = f"{task_id}_factor_{factor_index}"

    # Write code to file within mining result dir
    task_dir = os.path.join(BASE_MINING_DIR, task_id)
    os.makedirs(task_dir, exist_ok=True)
    safe_name = "".join(c if c.isalnum() or c == "_" else "_" for c in factor_name)
    code_file = os.path.join(task_dir, f"{safe_name}.py")
    with open(code_file, "w") as f:
        f.write(code)

    record = MiningFactorRecord(
        id=factor_id,
        task_id=task_id,
        name=factor_name,
        expression=code[:500],
        hypothesis=body.get("hypothesis", ""),
        ic_mean=metrics.get("ic", 0.0),
        ic_ir=metrics.get("icir", 0.0),
        annual_return=metrics.get("arr", 0.0),
        sharpe_ratio=metrics.get("sharpe", 0.0),
        max_drawdown=metrics.get("maxDrawdown", 0.0),
        code_file=code_file,
    )
    store = _get_store(request)
    store.add_factor(record)

    return JSONResponse(_record_to_factor_json(record), status_code=201)


router = Router(routes=[
    Route("/factors", list_factors_endpoint, methods=["GET"]),
    Route("/factors", push_factor_endpoint, methods=["POST"]),
])
```

### Step 4: 在 router.py 挂载 + start.py 初始化

修改 `apps/vibe-editor/marimo/_server/api/router.py`，在 `from vt_mining.routes import router as vt_mining_router` 后加一行：

```python
from vt_mining.library_routes import router as vt_library_router
```

在 `app_router.mount("/api/mining", app=vt_mining_router, name="vt_mining")` 后加：

```python
app_router.mount("/api/library", app=vt_library_router, name="vt_library")
```

修改 `apps/vibe-editor/marimo/_server/start.py`，在 `app.state.vt_mining_manager = vt_mining_manager` 后加：

```python
from vt_mining.knowledge import KnowledgeStore
vt_knowledge_store = KnowledgeStore()
app.state.vt_knowledge_store = vt_knowledge_store
```

### Step 5: 运行测试确认通过

```bash
cd apps/vibe-editor
python -m pytest tests/test_library_routes.py -v
```
Expected: `4 passed`

### Step 6: Commit

```bash
git add apps/vibe-editor/vt_mining/library_routes.py \
        apps/vibe-editor/tests/test_library_routes.py \
        apps/vibe-editor/marimo/_server/api/router.py \
        apps/vibe-editor/marimo/_server/start.py
git commit -m "feat(vt-mining): add /api/library/factors GET+POST routes with KnowledgeStore"
```

---

## Task 3: `/api/lab/files/resolve` 路由

**分支**: `feature/phase1-rdagent-integration`

**Files:**
- Create: `apps/vibe-editor/vt_sessions/file_routes.py`
- Modify: `apps/vibe-editor/marimo/_server/api/router.py`
- Create: `apps/vibe-editor/tests/test_file_routes.py`

### Step 1: 写失败测试

```python
# apps/vibe-editor/tests/test_file_routes.py
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
```

### Step 2: 运行确认失败

```bash
cd apps/vibe-editor
python -m pytest tests/test_file_routes.py -v
```
Expected: `ModuleNotFoundError: No module named 'vt_sessions.file_routes'`

### Step 3: 实现 file_routes.py

```python
# apps/vibe-editor/vt_sessions/file_routes.py
"""vt_sessions/file_routes.py — Lab file association endpoints.

Mounted at /api/lab/ in the Starlette app.
"""
from __future__ import annotations

import json
import logging
import os
from typing import TYPE_CHECKING

from starlette.requests import Request
from starlette.responses import JSONResponse
from starlette.routing import Route, Router

if TYPE_CHECKING:
    from vt_mining.knowledge import KnowledgeStore

logger = logging.getLogger(__name__)


def _get_store(request: Request) -> "KnowledgeStore":
    return request.app.state.vt_knowledge_store


async def resolve_file_endpoint(request: Request) -> JSONResponse:
    """POST /api/lab/files/resolve — Verify factor .py exists, update SQLite.

    Body: { "factorId": str, "codeFile": str }
    Returns: { "workspacePath": str }

    The mining output is already written under ~/.vt-lab/mining/,
    which is the marimo workspace root — so codeFile IS the workspace_path.
    This endpoint just validates existence and records the association.
    """
    try:
        body = await request.json()
    except (json.JSONDecodeError, ValueError):
        return JSONResponse({"error": "Invalid JSON body"}, status_code=400)

    factor_id = body.get("factorId")
    code_file = body.get("codeFile")

    if not factor_id or not code_file:
        return JSONResponse(
            {"error": "factorId and codeFile are required"}, status_code=400
        )

    resolved_path = os.path.expanduser(code_file)

    if not os.path.isfile(resolved_path):
        return JSONResponse(
            {"error": f"File not found: {code_file}"}, status_code=404
        )

    store = _get_store(request)
    store.update_workspace_path(factor_id, resolved_path)

    return JSONResponse({"workspacePath": resolved_path})


router = Router(routes=[
    Route("/files/resolve", resolve_file_endpoint, methods=["POST"]),
])
```

### Step 4: 挂载到 router.py

修改 `apps/vibe-editor/marimo/_server/api/router.py`，在 `from vt_sessions.routes import router as vt_sessions_router` 后加：

```python
from vt_sessions.file_routes import router as vt_lab_router
```

在 `app_router.mount("/api/sessions", ...)` 后加：

```python
app_router.mount("/api/lab", app=vt_lab_router, name="vt_lab")
```

### Step 5: 运行所有后端测试

```bash
cd apps/vibe-editor
python -m pytest tests/ -v
```
Expected: 全部通过（test_knowledge.py + test_library_routes.py + test_file_routes.py + 已有测试）

### Step 6: Commit

```bash
git add apps/vibe-editor/vt_sessions/file_routes.py \
        apps/vibe-editor/tests/test_file_routes.py \
        apps/vibe-editor/marimo/_server/api/router.py
git commit -m "feat(vt-sessions): add /api/lab/files/resolve route for Lab file association"
```

---

## Task 4: Library store — addFactor + fetchMiningFactors

**分支**: `feature/phase2-mining-tab` (`.worktrees/phase2-mining-tab`)

**Files:**
- Modify: `apps/web/src/features/library/types.ts`
- Modify: `apps/web/src/features/library/store/use-library-store.ts`
- Create: `apps/web/src/features/library/store/use-library-store.test.ts`

### Step 1: 写失败测试

```typescript
// apps/web/src/features/library/store/use-library-store.test.ts
import { describe, it, expect, beforeEach } from 'vitest';
import { useLibraryStore } from './use-library-store';
import type { Factor } from '../types';

// Minimal mining factor fixture
const miningFactor: Factor = {
  id: 'task_001_factor_0',
  name: 'MomentumReversal',
  version: '1.0',
  category: '动能',
  factorType: 'leaf',
  expectedDirection: 'positive',
  source: 'mining_llm',
  status: 'INCUBATING',
  expression: 'pct_change(5)',
  ic: 0.024,
  ir: 0.81,
  icTstat: 0,
  turnover: 0,
  capacity: 10000,
  createdAt: '2026-02-28T10:00:00Z',
  createdBy: 'RD-Agent',
  tags: ['挖掘'],
  icTrend: [],
  winRate: 50,
  ic60d: 0.024,
  ic120d: 0.024,
  quantileReturns: [0, 0, 0, 0, 0],
  icTimeSeries: [],
  benchmarkConfig: {
    universe: '沪深300',
    icMethod: 'RankIC',
    winsorization: 'MAD',
    rebalanceDays: 5,
    quantiles: 5,
  },
  icDistribution: {
    icMean: 0.024,
    icStd: 0,
    icPositiveCount: 0,
    icNegativeCount: 0,
    icSignificantRatio: 0,
    icPositiveSignificantRatio: 0,
    icNegativeSignificantRatio: 0,
    icPValue: 1,
    icSkewness: 0,
    icKurtosis: 0,
  },
  icDecayProfile: [],
  universeProfile: [],
  rankTestRetention: 0,
  binaryTestRetention: 0,
  vScore: 0,
  icHalfLife: 0,
  coverageRate: 0,
  longShortReturn: 18.7,
  longShortEquityCurve: [],
  longSideReturnRatio: 0,
  icHistogramBins: [],
  quantileCumulativeReturns: [[], [], [], [], []],
  lookback: 5,
  statusHistory: [],
  codeFile: '/Users/vx/.vt-lab/mining/task_001/MomentumReversal.py',
};

describe('useLibraryStore – addFactor', () => {
  beforeEach(() => {
    // Reset store to initial state between tests
    useLibraryStore.setState({ factors: [] });
  });

  it('adds a new mining factor to the store', () => {
    useLibraryStore.getState().addFactor(miningFactor);
    const factors = useLibraryStore.getState().factors;
    expect(factors.some((f) => f.id === 'task_001_factor_0')).toBe(true);
  });

  it('does not add duplicate factor (same id)', () => {
    useLibraryStore.getState().addFactor(miningFactor);
    useLibraryStore.getState().addFactor(miningFactor);
    const factors = useLibraryStore.getState().factors;
    const matches = factors.filter((f) => f.id === 'task_001_factor_0');
    expect(matches).toHaveLength(1);
  });
});
```

### Step 2: 运行确认失败

```bash
cd /path/to/vibe-trading
npx nx run web:test -- --reporter=verbose 2>&1 | grep "addFactor"
```
Expected: `TypeError: useLibraryStore.getState(...).addFactor is not a function`

### Step 3: 扩展 Library types.ts — 在 Factor interface 末尾添加

定位到 `apps/web/src/features/library/types.ts`，在 `Factor` interface 的最后 `statusHistory` 字段后加（约第 170 行）：

```typescript
  /** 挖掘来源扩展字段 — 仅 source === "mining_llm" 时存在 */
  codeFile?: string;           // factor.py 绝对路径
  workspacePath?: string;      // Lab workspace 关联路径（关联后填入）
  taskId?: string;             // 来源挖掘任务 ID
  annualReturn?: number;       // 年化收益（来自 RD-Agent 回测）
  sharpeRatio?: number;        // Sharpe ratio
  maxDrawdown?: number;        // 最大回撤
  hypothesis?: string;         // 挖掘假设描述
```

### Step 4: 扩展 use-library-store.ts — 在 LibraryState interface 中的 mutation actions 部分加

在 `batchUpdateStatus` 后，interface 定义和实现中各加：

**Interface** (约第 73 行后):
```typescript
  addFactor: (factor: Factor) => void;
  fetchMiningFactors: () => Promise<void>;
```

**Implementation** (在 `batchUpdateStatus` 实现后):
```typescript
  addFactor: (factor) =>
    set((state) => {
      // Dedup: skip if already exists by id
      if (state.factors.some((f) => f.id === factor.id)) return state;
      return { factors: [factor, ...state.factors] };
    }),

  fetchMiningFactors: async () => {
    try {
      const resp = await fetch('http://localhost:2728/api/library/factors');
      if (!resp.ok) return;
      const data = await resp.json() as { factors: Factor[] };
      const { addFactor } = useLibraryStore.getState();
      data.factors.forEach((f) => addFactor(f));
    } catch {
      // Backend not running — silently ignore
    }
  },
```

### Step 5: 运行测试确认通过

```bash
npx nx run web:test -- --reporter=verbose 2>&1 | grep -A5 "addFactor"
```
Expected: `2 passed`

### Step 6: Commit

```bash
git add apps/web/src/features/library/types.ts \
        apps/web/src/features/library/store/use-library-store.ts \
        apps/web/src/features/library/store/use-library-store.test.ts
git commit -m "feat(library): add addFactor + fetchMiningFactors to Library store"
```

---

## Task 5: Mining 推送按钮 + Library "在Lab中编辑"按钮

**分支**: `feature/phase2-mining-tab`

**Files:**
- Modify: `apps/web/src/features/factor/mining/components/task-detail-panel.tsx`
- Modify: `apps/web/src/features/factor/mining/types.ts`
- Modify: `apps/web/src/features/library/components/factor-data-table/use-factor-row-click.ts` (or appropriate table component)
- Create: `apps/web/src/features/factor/mining/api.ts` (append push function) or modify existing

### Step 1: 扩展 mining API — 在 `api.ts` 末尾追加

找到 `apps/web/src/features/factor/mining/api.ts`，在文件末尾加：

```typescript
export interface PushFactorRequest {
  taskId: string;
  factorIndex: number;
  name: string;
  code: string;
  hypothesis: string;
  metrics: {
    ic: number;
    icir: number;
    arr: number;
    sharpe: number;
    maxDrawdown: number;
    turnover: number;
  };
}

export async function pushFactorToLibrary(req: PushFactorRequest): Promise<Factor> {
  const resp = await fetch(`${MINING_BASE_URL.replace('/mining', '/library')}/factors`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(req),
  });
  if (!resp.ok) {
    const err = await resp.json().catch(() => ({}));
    throw new Error((err as { error?: string }).error ?? `Push failed: ${resp.status}`);
  }
  return resp.json() as Promise<Factor>;
}
```

**注意**: `MINING_BASE_URL` 是 `http://localhost:2728/api/mining`，library 路径是 `http://localhost:2728/api/library`。需要从 constants 中取 base URL 拼接。实际实现时用 `import { VIBE_COMPUTE_BASE } from '../constants'` 拼接，或直接用 `'http://localhost:2728/api/library'`。

Import `Factor` from library types:
```typescript
import type { Factor } from '@/features/library/types';
```

### Step 2: 修改 task-detail-panel.tsx — 接线推送按钮

在 `FactorResultCard` 接口添加 `onPush` prop：

```tsx
interface FactorResultCardProps {
  factor: DiscoveredFactor;
  taskId: string;            // NEW
  factorIndex: number;       // NEW
  onViewCode?: (factor: DiscoveredFactor) => void;
  onPush?: (factor: DiscoveredFactor) => void;   // NEW
}
```

在 `FactorResultCard` 组件中，给推送按钮添加状态和逻辑（在组件顶部加）：

```tsx
const [pushState, setPushState] = React.useState<'idle' | 'loading' | 'done' | 'error'>('idle');

async function handlePush() {
  setPushState('loading');
  try {
    await pushFactorToLibrary({
      taskId,
      factorIndex,
      name: factor.name,
      code: factor.code,
      hypothesis: factor.hypothesis,
      metrics: {
        ic: factor.metrics.ic,
        icir: factor.metrics.icir,
        arr: factor.metrics.arr,
        sharpe: factor.metrics.sharpe,
        maxDrawdown: factor.metrics.maxDrawdown,
        turnover: factor.metrics.turnover,
      },
    });
    // Add to Library store directly (optimistic update)
    // The factory conversion happens server-side; re-fetch to get full Factor
    await useLibraryStore.getState().fetchMiningFactors();
    setPushState('done');
    onPush?.(factor);
  } catch {
    setPushState('error');
    setTimeout(() => setPushState('idle'), 3000);
  }
}
```

替换推送按钮的渲染（`factor.accepted &&` 块）：

```tsx
{factor.accepted && (
  <button
    onClick={pushState === 'idle' ? handlePush : undefined}
    disabled={pushState === 'loading' || pushState === 'done'}
    className={cn(
      'flex items-center gap-1 px-2 py-1 rounded text-[10px] font-medium transition-colors',
      pushState === 'done'
        ? 'text-market-down-medium border border-market-down-medium/30 bg-market-down-medium/5 cursor-default'
        : pushState === 'error'
          ? 'text-market-up-medium border border-market-up-medium/30 hover:bg-market-up-medium/5'
          : 'text-mine-accent-teal border border-mine-accent-teal/30 hover:bg-mine-accent-teal/5',
    )}
  >
    <Rocket className="w-3 h-3" />
    {pushState === 'loading'
      ? '推送中...'
      : pushState === 'done'
        ? '已推送到 Library ✓'
        : pushState === 'error'
          ? '推送失败，重试'
          : '推送到 Library'}
  </button>
)}
```

在 `TaskDetailPanel` 的 `FactorResultCard` 调用处，加 `taskId` 和 `factorIndex`：

```tsx
{task.factors.map((factor, idx) => (
  <FactorResultCard
    key={`${factor.name}-${idx}`}
    factor={factor}
    taskId={task.taskId}
    factorIndex={idx}
    onViewCode={onViewCode}
  />
))}
```

### Step 3: 添加 Library "在Lab中编辑"按钮

找到 Library factor data table 的操作区。检查 `apps/web/src/features/library/components/factor-data-table/` 目录，在表格 columns 配置或 row action 处，添加新的操作列。

在 `use-factor-table.ts` 或 `constants.ts` 中找到 columns 定义，增加一个 actions column（仅 `source === "mining_llm"` 时显示）：

```tsx
// 在表格 action 列或 row context menu 中加:
function OpenInLabButton({ factor }: { factor: Factor }) {
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);

  if (factor.source !== 'mining_llm' || !factor.codeFile) return null;

  async function handleOpen() {
    setLoading(true);
    try {
      const resp = await fetch('http://localhost:2728/api/lab/files/resolve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          factorId: factor.id,
          codeFile: factor.codeFile,
        }),
      });
      if (!resp.ok) throw new Error('resolve failed');
      const { workspacePath } = await resp.json() as { workspacePath: string };
      router.push(`/lab?file=${encodeURIComponent(workspacePath)}`);
    } catch {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleOpen}
      disabled={loading}
      className="flex items-center gap-1 px-2 py-1 text-[10px] font-medium rounded
                 text-mine-muted hover:text-mine-text hover:bg-mine-bg
                 border border-transparent hover:border-mine-border transition-colors"
    >
      <ExternalLink className="w-3 h-3" />
      {loading ? '打开中...' : '在 Lab 中编辑'}
    </button>
  );
}
```

实际放置位置：查看现有的 FactorDataTable 中如何渲染行操作，放到与现有操作按钮一致的位置。如果 table 有 `actions` cell renderer，在那里 render `<OpenInLabButton factor={row.original} />`。

### Step 4: 运行 TypeScript 检查

```bash
cd apps/web
npx tsc --noEmit 2>&1 | head -30
```
Expected: 无 TS 错误（或只有既有的非相关错误）

### Step 5: Commit

```bash
git add apps/web/src/features/factor/mining/components/task-detail-panel.tsx \
        apps/web/src/features/factor/mining/api.ts \
        apps/web/src/features/library/components/factor-data-table/
git commit -m "feat(mining): wire push-to-library button; feat(library): add open-in-lab action"
```

---

## Task 6: Lab `?file=` query param — 自动打开文件

**分支**: `feature/phase2-mining-tab`

**Files:**
- Modify: `apps/web/src/features/lab/components/lab-page.tsx`
- Modify: `apps/web/src/app/(main)/lab/page.tsx` (add Suspense boundary for useSearchParams)

### Step 1: 了解当前 Lab 连接流程

在 `lab-page.tsx` 中搜索 `doConnect` 函数，了解它如何使用 `notebookPath`：

```bash
grep -n "doConnect\|notebookPath\|buildRuntimeURL\|takeoverSession" \
  apps/web/src/features/lab/components/lab-page.tsx | head -20
```

关键：`buildRuntimeURL(notebookPath)` 构建 marimo kernel URL，`?file=notebookPath` 是 marimo 用来加载特定 notebook 的 query param。

### Step 2: 修改 lab/page.tsx — 加 Suspense boundary

Next.js static export 中，`useSearchParams()` 必须在 Suspense 内部使用。

查看 `apps/web/src/app/(main)/lab/page.tsx` 当前内容：

```bash
cat apps/web/src/app/\(main\)/lab/page.tsx
```

如果当前是：
```tsx
import LabPage from '@/features/lab/components/lab-page';
export default function Page() { return <LabPage />; }
```

改为：
```tsx
'use client';
import { Suspense } from 'react';
import LabPageInner from '@/features/lab/components/lab-page';

function LabPageWithSuspense() {
  return (
    <Suspense>
      <LabPageInner />
    </Suspense>
  );
}

export default LabPageWithSuspense;
```

**注意**: Next.js static export 中，page.tsx 使用 `default export`（CLAUDE.md 中的例外规则）。

### Step 3: 修改 lab-page.tsx — 读取 `?file=` param

在 lab-page.tsx 顶部 imports 区加：

```tsx
import { useSearchParams } from 'next/navigation';
```

在 `LabPage` 组件（或其直接子组件）内部，找到 `doConnect` 调用逻辑，在其前面加：

```tsx
const searchParams = useSearchParams();
const fileParam = searchParams.get('file');
```

在 `doConnect` 调用时，如果 `fileParam` 存在，用它覆盖 session 返回的 `notebookPath`：

找到类似这样的代码（实际行号通过 grep 确认）：
```tsx
// 在 doConnect 里或连接成功回调里，找到 notebookPath 被使用的地方
```

目标：当 `fileParam` 存在时：
```tsx
const effectiveNotebookPath = fileParam ?? session.notebookPath;
// 然后用 effectiveNotebookPath 替代 notebookPath 传给 buildRuntimeURL 和 takeoverSession
```

具体改法依赖实际代码结构，原则是：`doConnect(workspacePath, fileParam ?? notebookPath)`。

### Step 4: 确认 marimo 能打开指定文件

marimo 的 `buildRuntimeURL(path)` 传递 `?file=path` 给 kernel，marimo 会打开该 notebook。Mining 产出的 `factor.py` 是合法的 Python 文件，marimo 会把它当作 notebook 加载（含 `def factor(df):` 的普通 Python 函数）。

验证方式（手动）：
```bash
# 启动 vibe-editor
nx run vibe-editor:serve
# 浏览器访问
# http://localhost:4200/lab?file=/Users/vx/.vt-lab/mining/test/factor.py
```
Expected: Lab 加载，marimo kernel 打开 factor.py。

### Step 5: 运行 TypeScript 检查 + 单测

```bash
cd apps/web
npx tsc --noEmit 2>&1 | head -20
npx nx run web:test -- --reporter=verbose 2>&1 | tail -20
```
Expected: TS 无新增错误，既有测试通过。

### Step 6: Commit

```bash
git add apps/web/src/features/lab/components/lab-page.tsx \
        apps/web/src/app/\(main\)/lab/page.tsx
git commit -m "feat(lab): read ?file= query param to open specific notebook from Library"
```

---

## 验收测试（手动端到端）

所有 6 个任务完成后，按以下顺序验证：

```bash
# 1. 启动 vibe-editor (Phase 1 分支 或 merged)
cd apps/vibe-editor && python main.py

# 2. 启动 web dev server
npx nx run web:serve --port=4200
```

**验收步骤**:
1. 打开 `http://localhost:4200/factor/mining`
2. 创建一个新 Mining 任务（可以是 mock 完成状态）
3. 在 TaskDetailPanel 找到一个 `accepted=true` 的 factor
4. 点「推送到 Library」— 按钮应变为「已推送到 Library ✓」
5. 打开 `http://localhost:4200/library`
6. 能看到新增因子，`source` 列显示 `mining_llm`，status 为 `INCUBATING`
7. 刷新页面 → 因子仍然存在（SQLite 持久化）
8. 点该因子行的「在 Lab 中编辑」按钮
9. 页面跳转到 `/lab?file=...`，Lab 加载并打开对应 factor.py notebook

**SQLite 验证**:
```bash
sqlite3 ~/.vt-lab/knowledge.db "SELECT id, name, code_file, workspace_path FROM mining_factors;"
```
Expected: 推送的因子记录，点 Lab 后 workspace_path 也填入了值。

---

## 执行笔记

- Task 1-3 可以在 Phase 1 worktree 独立执行，不依赖 Phase 2 前端
- Task 4-5 可以先 mock API (`fetch` 返回 200)，等 Task 1-3 完成后联调
- Task 6 是 Lab 的改动，建议最后做，因为 lab-page.tsx 改动风险最高
- `fetchMiningFactors()` 在 Library 页面 mount 时调用，需要在 Library 的顶层页面组件或 store 初始化时触发
