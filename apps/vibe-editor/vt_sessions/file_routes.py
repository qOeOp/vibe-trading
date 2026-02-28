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
    try:
        store.update_workspace_path(factor_id, resolved_path)
    except KeyError:
        return JSONResponse(
            {"error": f"Factor not found: {factor_id}"}, status_code=404
        )

    logger.info("Lab file resolved: factor_id=%s path=%s", factor_id, resolved_path)
    return JSONResponse({"workspacePath": resolved_path})


router = Router(routes=[
    Route("/files/resolve", resolve_file_endpoint, methods=["POST"]),
])
