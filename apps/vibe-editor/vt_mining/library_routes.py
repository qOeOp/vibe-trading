"""vt_mining/library_routes.py — Library factor persistence API.

Mounted at /api/library/ in the Starlette app.
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
        "category": "动能",
        "factorType": "leaf",
        "expectedDirection": "positive" if record.ic_mean >= 0 else "negative",
        "source": "mining_llm",
        "status": record.status,
        "expression": record.expression[:200],
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
    records = store.list_factors(status=status_filter if status_filter else None)
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
