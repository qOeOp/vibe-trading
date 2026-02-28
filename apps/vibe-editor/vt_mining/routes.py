"""vt_mining/routes.py — Mining REST API endpoints.

Mounted at /api/mining/ in the Starlette app.
"""
from __future__ import annotations

import asyncio
import json
import logging
from typing import TYPE_CHECKING

from starlette.requests import Request
from starlette.responses import JSONResponse, StreamingResponse
from starlette.routing import Route, Router

if TYPE_CHECKING:
    from .manager import MiningTaskManager

from .models import MiningTaskConfig, MiningMode, DateRange, TaskStatus

logger = logging.getLogger(__name__)


def _get_manager(request: Request) -> "MiningTaskManager":
    """Extract MiningTaskManager from app state."""
    return request.app.state.vt_mining_manager


async def create_task_endpoint(request: Request) -> JSONResponse:
    """POST /api/mining/tasks — Create and start a mining task."""
    try:
        body = await request.json()
    except (json.JSONDecodeError, ValueError):
        return JSONResponse({"error": "Invalid JSON body"}, status_code=400)

    mode_str = body.get("mode", "factor")
    try:
        mode = MiningMode(mode_str)
    except ValueError:
        return JSONResponse({"error": f"Invalid mode: {mode_str}"}, status_code=400)

    raw_config = body.get("config", {})
    date_range_raw = raw_config.get("dateRange", {})
    date_range = DateRange(
        train_start=date_range_raw.get("trainStart", "2015-01-01"),
        train_end=date_range_raw.get("trainEnd", "2021-12-31"),
        valid_start=date_range_raw.get("validStart", "2022-01-01"),
        valid_end=date_range_raw.get("validEnd", "2023-12-31"),
        test_start=date_range_raw.get("testStart", "2024-01-01"),
        test_end=date_range_raw.get("testEnd"),
    )

    config = MiningTaskConfig(
        mode=mode,
        max_loops=raw_config.get("maxLoops", 10),
        llm_model=raw_config.get("llmModel", "deepseek/deepseek-chat"),
        universe=raw_config.get("universe", "csi300"),
        date_range=date_range,
        dedup_threshold=raw_config.get("dedupThreshold", 0.99),
    )

    manager = _get_manager(request)
    task = manager.create_task(config)

    try:
        manager.start_task(task.task_id)
    except Exception as e:
        logger.exception("Failed to start task %s", task.task_id)
        return JSONResponse(
            {"error": f"Failed to start task: {e}", "taskId": task.task_id},
            status_code=500,
        )

    return JSONResponse(task.to_dict())


async def get_task_endpoint(request: Request) -> JSONResponse:
    """GET /api/mining/tasks/{task_id} — Get task status and progress."""
    task_id = request.path_params["task_id"]
    manager = _get_manager(request)
    task = manager.get_task(task_id)
    if task is None:
        return JSONResponse({"error": "Task not found"}, status_code=404)
    return JSONResponse(task.to_dict())


async def list_tasks_endpoint(request: Request) -> JSONResponse:
    """GET /api/mining/tasks — List all tasks."""
    status_filter = request.query_params.get("status")
    manager = _get_manager(request)

    status = None
    if status_filter:
        try:
            status = TaskStatus(status_filter)
        except ValueError:
            pass

    tasks = manager.list_tasks(status=status)
    return JSONResponse({"tasks": [t.to_dict() for t in tasks]})


async def cancel_task_endpoint(request: Request) -> JSONResponse:
    """POST /api/mining/tasks/{task_id}/cancel — Cancel a running task."""
    task_id = request.path_params["task_id"]
    manager = _get_manager(request)
    result = manager.cancel_task(task_id)
    if not result:
        return JSONResponse({"error": "Task not found"}, status_code=404)
    return JSONResponse({"success": True})


async def get_results_endpoint(request: Request) -> JSONResponse:
    """GET /api/mining/tasks/{task_id}/results — Get discovered factors."""
    task_id = request.path_params["task_id"]
    manager = _get_manager(request)
    task = manager.get_task(task_id)
    if task is None:
        return JSONResponse({"error": "Task not found"}, status_code=404)
    return JSONResponse({
        "taskId": task.task_id,
        "status": task.status.value,
        "factors": [f.to_dict() for f in task.factors],
    })


async def stream_task_endpoint(request: Request) -> JSONResponse | StreamingResponse:
    """GET /api/mining/tasks/{task_id}/stream — SSE stream of task progress."""
    task_id = request.path_params["task_id"]
    manager = _get_manager(request)
    task = manager.get_task(task_id)
    if task is None:
        return JSONResponse({"error": "Task not found"}, status_code=404)

    async def event_generator():
        last_loop = -1
        last_factor_idx = 0
        while True:
            # Refresh from filesystem
            manager.refresh_task_progress(task_id)
            manager.refresh_task_factors(task_id)
            manager._check_worker_status(task)

            current = task.progress.current_loop
            if current != last_loop:
                yield f"event: iteration\ndata: {json.dumps(task.progress.to_dict())}\n\n"
                last_loop = current

            # Emit only newly discovered factors
            for factor in task.factors[last_factor_idx:]:
                yield f"event: factor_found\ndata: {json.dumps(factor.to_dict())}\n\n"
            last_factor_idx = len(task.factors)

            # Terminal states
            if task.status in (TaskStatus.COMPLETED, TaskStatus.FAILED, TaskStatus.CANCELLED):
                yield f"event: complete\ndata: {json.dumps({'taskId': task_id, 'status': task.status.value})}\n\n"
                break

            await asyncio.sleep(2)  # Poll every 2 seconds

    return StreamingResponse(
        event_generator(),
        media_type="text/event-stream",
        headers={"Cache-Control": "no-cache", "Connection": "keep-alive"},
    )


# Router instance — compatible with marimo's APIRouter.include_router()
router = Router(routes=[
    Route("/tasks", create_task_endpoint, methods=["POST"]),
    Route("/tasks", list_tasks_endpoint, methods=["GET"]),
    Route("/tasks/{task_id}", get_task_endpoint, methods=["GET"]),
    Route("/tasks/{task_id}/cancel", cancel_task_endpoint, methods=["POST"]),
    Route("/tasks/{task_id}/results", get_results_endpoint, methods=["GET"]),
    Route("/tasks/{task_id}/stream", stream_task_endpoint, methods=["GET"]),
])
