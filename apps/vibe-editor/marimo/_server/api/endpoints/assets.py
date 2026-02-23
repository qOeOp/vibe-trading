# Copyright 2026 Marimo. All rights reserved.
"""
Asset serving for VT Editor.

Only two endpoints are needed:
  - /@file/{filename_and_length} — virtual files produced by cell output (images, etc.)
  - /public/{filepath} — files from notebook's /public/ directory

Everything else (index.html, static JS/CSS, og thumbnails, service worker, favicon)
is served by the Next.js frontend — not this backend.
"""
from __future__ import annotations

import mimetypes
from pathlib import Path
from typing import TYPE_CHECKING

from starlette.authentication import requires
from starlette.exceptions import HTTPException
from starlette.responses import Response

from marimo import _loggers
from marimo._output.utils import uri_decode_component
from marimo._runtime.virtual_file import EMPTY_VIRTUAL_FILE, read_virtual_file
from marimo._server.api.deps import AppState
from marimo._server.files.path_validator import PathValidator
from marimo._server.router import APIRouter

if TYPE_CHECKING:
    from starlette.requests import Request

LOGGER = _loggers.marimo_logger()

router = APIRouter()

FILE_QUERY_PARAM_KEY = "file"


@router.get("/@file/{filename_and_length:path}")
@requires("read")
def virtual_file(
    request: Request,
) -> Response:
    """
    parameters:
        - in: path
          name: filename_and_length
          required: true
          schema:
            type: string
          description: The filename and byte length of the virtual file
    responses:
        200:
            description: Get a virtual file
            content:
                application/octet-stream:
                    schema:
                        type: string
        404:
            description: Invalid virtual file request
    """
    filename_and_length = request.path_params["filename_and_length"]

    LOGGER.debug("Getting virtual file: %s", filename_and_length)
    if filename_and_length == EMPTY_VIRTUAL_FILE.filename:
        return Response(content=b"", media_type="application/octet-stream")
    if "-" not in filename_and_length:
        raise HTTPException(
            status_code=404,
            detail="Invalid virtual file request",
        )

    byte_length, filename = filename_and_length.split("-", 1)
    if not byte_length.isdigit():
        raise HTTPException(
            status_code=404,
            detail="Invalid byte length in virtual file request",
        )

    buffer_contents = read_virtual_file(filename, int(byte_length))
    mimetype, _ = mimetypes.guess_type(filename)
    return Response(
        content=buffer_contents,
        media_type=mimetype,
        headers={"Cache-Control": "max-age=86400"},
    )


@router.get("/public/{filepath:path}")
@requires("read")
async def serve_public_file(request: Request) -> Response:
    """Serve files from the notebook's directory under /public/"""
    app_state = AppState(request)
    filepath = str(request.path_params["filepath"])
    notebook_id = request.headers.get("X-Notebook-Id")
    if notebook_id:
        notebook_id = uri_decode_component(notebook_id)
        app_manager = app_state.session_manager.app_manager(notebook_id)
        if app_manager.filename:
            notebook_dir = Path(app_manager.filename).parent
        else:
            notebook_dir = Path.cwd()
        public_dir = notebook_dir / "public"
        file_path = public_dir / filepath

        try:
            PathValidator().validate_inside_directory(public_dir, file_path)
        except HTTPException:
            return Response(status_code=403, content="Access denied")

        if file_path.is_file():
            from starlette.responses import FileResponse
            return FileResponse(file_path)

    raise HTTPException(status_code=404, detail="File not found")
