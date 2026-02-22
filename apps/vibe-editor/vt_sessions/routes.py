"""
VT Session API endpoints.

Mounted at /api/sessions/ in the marimo Starlette app.
These are REST endpoints — separate from marimo's WebSocket session system.
"""
from __future__ import annotations

import json
import logging
from typing import TYPE_CHECKING

from starlette.requests import Request
from starlette.responses import JSONResponse
from starlette.routing import Route, Router

if TYPE_CHECKING:
    from .manager import VTSessionManager

logger = logging.getLogger(__name__)


def _get_manager(request: Request) -> VTSessionManager:
    """Extract VTSessionManager from app state."""
    return request.app.state.vt_session_manager


async def connect_endpoint(request: Request) -> JSONResponse:
    """
    POST /api/sessions/connect

    Request body: { "userId": "root" }
    Response: { "userId", "workspacePath", "notebookPath", "sessionId", "status", ... }

    Creates or reconnects a session for the given userId.
    Bootstraps workspace directory and welcome notebook if needed.
    """
    try:
        body = await request.json()
    except (json.JSONDecodeError, ValueError):
        return JSONResponse(
            {"error": "Invalid JSON body"},
            status_code=400,
        )

    user_id = body.get("userId", "").strip()
    if not user_id:
        return JSONResponse(
            {"error": "userId is required"},
            status_code=400,
        )

    manager = _get_manager(request)
    session = manager.connect(user_id)

    return JSONResponse(session.to_dict())


async def disconnect_endpoint(request: Request) -> JSONResponse:
    """
    POST /api/sessions/disconnect

    Request body: { "userId": "root" }
    Response: { "success": true } or 404

    Disconnects a user's VT session. Does not stop marimo kernel
    (marimo handles its own TTL-based cleanup).
    """
    try:
        body = await request.json()
    except (json.JSONDecodeError, ValueError):
        return JSONResponse(
            {"error": "Invalid JSON body"},
            status_code=400,
        )

    user_id = body.get("userId", "").strip()
    if not user_id:
        return JSONResponse(
            {"error": "userId is required"},
            status_code=400,
        )

    manager = _get_manager(request)
    removed = manager.disconnect(user_id)

    if not removed:
        return JSONResponse(
            {"error": "No session found for userId"},
            status_code=404,
        )

    return JSONResponse({"success": True})


async def status_endpoint(request: Request) -> JSONResponse:
    """
    GET /api/sessions/status?userId=root

    Response: Session metadata or 404 if no session exists.
    """
    user_id = request.query_params.get("userId", "").strip()
    if not user_id:
        return JSONResponse(
            {"error": "userId query parameter is required"},
            status_code=400,
        )

    manager = _get_manager(request)
    status = manager.get_status(user_id)

    if status is None:
        return JSONResponse(
            {"error": "No session found for userId"},
            status_code=404,
        )

    return JSONResponse(status)


async def heartbeat_endpoint(request: Request) -> JSONResponse:
    """
    POST /api/sessions/heartbeat

    Request body: { "userId": "root" }
    Response: { "success": true } or 404

    Called periodically by frontend (every 30s) to keep session alive.
    Prevents idle timeout cleanup.
    """
    try:
        body = await request.json()
    except (json.JSONDecodeError, ValueError):
        return JSONResponse(
            {"error": "Invalid JSON body"},
            status_code=400,
        )

    user_id = body.get("userId", "").strip()
    if not user_id:
        return JSONResponse(
            {"error": "userId is required"},
            status_code=400,
        )

    manager = _get_manager(request)
    alive = manager.heartbeat(user_id)

    if not alive:
        return JSONResponse(
            {"error": "No session found for userId"},
            status_code=404,
        )

    return JSONResponse({"success": True})


# Router instance — compatible with marimo's APIRouter.include_router()
router = Router(routes=[
    Route("/connect", connect_endpoint, methods=["POST"]),
    Route("/disconnect", disconnect_endpoint, methods=["POST"]),
    Route("/status", status_endpoint, methods=["GET"]),
    Route("/heartbeat", heartbeat_endpoint, methods=["POST"]),
])
