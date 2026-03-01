"""
VT Snippet API — parse marimo notebook files and return structured cell data.

Mounted at /api/snippets/ in the marimo Starlette app.
"""
from __future__ import annotations

import ast
import logging
import os
import textwrap

from starlette.requests import Request
from starlette.responses import JSONResponse
from starlette.routing import Route, Router

logger = logging.getLogger(__name__)

# Snippets directory — sibling to this module's package
_SNIPPETS_DIR = os.path.normpath(
    os.path.join(os.path.dirname(__file__), "..", "snippets")
)


def _is_app_cell_decorator(decorator: ast.expr) -> bool:
    """Check if a decorator is @app.cell or @app.cell(...)."""
    # @app.cell
    if (
        isinstance(decorator, ast.Attribute)
        and isinstance(decorator.value, ast.Name)
        and decorator.value.id == "app"
        and decorator.attr == "cell"
    ):
        return True
    # @app.cell(...)
    if (
        isinstance(decorator, ast.Call)
        and isinstance(decorator.func, ast.Attribute)
        and isinstance(decorator.func.value, ast.Name)
        and decorator.func.value.id == "app"
        and decorator.func.attr == "cell"
    ):
        return True
    return False


def _extract_return_names(node: ast.Return) -> list[str]:
    """Extract variable names from a return statement."""
    if node.value is None:
        return []
    if isinstance(node.value, ast.Tuple):
        return [
            elt.id
            for elt in node.value.elts
            if isinstance(elt, ast.Name)
        ]
    if isinstance(node.value, ast.Name):
        return [node.value.id]
    return []


def _parse_notebook(source: str) -> dict | None:
    """Parse a marimo notebook and extract the first @app.cell function."""
    tree = ast.parse(source)
    source_lines = source.splitlines()

    for node in ast.walk(tree):
        if not isinstance(node, ast.FunctionDef):
            continue
        if not any(_is_app_cell_decorator(d) for d in node.decorator_list):
            continue

        # Extract refs from function arguments (skip "_")
        refs = [
            arg.arg for arg in node.args.args if arg.arg != "_"
        ]

        # Extract defs from the return statement
        defs: list[str] = []
        body = node.body

        # Check if last statement is a return
        last_stmt = body[-1] if body else None
        has_return = isinstance(last_stmt, ast.Return)

        if has_return:
            defs = _extract_return_names(last_stmt)  # type: ignore[arg-type]

        # Extract body code lines (from first body statement to end of function)
        if not body:
            return {"code": "", "defs": defs, "refs": refs}

        first_body_line = body[0].lineno  # 1-based
        if has_return and len(body) > 1:
            # Exclude the return statement — use the line before it
            last_line = last_stmt.lineno - 1  # type: ignore[union-attr]
            # Strip trailing blank lines
            while last_line > first_body_line and not source_lines[last_line - 1].strip():
                last_line -= 1
            code_lines = source_lines[first_body_line - 1 : last_line]
        elif has_return and len(body) == 1:
            # Only a return statement — no code
            code_lines = []
        else:
            # No return — take all body lines
            code_lines = source_lines[first_body_line - 1 : node.end_lineno]

        code = textwrap.dedent("\n".join(code_lines))

        return {"code": code, "defs": defs, "refs": refs}

    return None


async def get_snippet(request: Request) -> JSONResponse:
    """
    GET /api/snippets/{path:path}

    Parse a marimo notebook snippet and return structured cell data.
    Response: { "code": str, "defs": [str], "refs": [str], "name": str, "path": str }
    """
    rel_path = request.path_params.get("path", "")
    if not rel_path:
        return JSONResponse(
            {"error": "path parameter is required"},
            status_code=400,
        )

    # Security: prevent path traversal
    resolved = os.path.normpath(os.path.join(_SNIPPETS_DIR, rel_path))
    if not resolved.startswith(_SNIPPETS_DIR + os.sep) and resolved != _SNIPPETS_DIR:
        return JSONResponse(
            {"error": "invalid path"},
            status_code=403,
        )

    if not os.path.isfile(resolved):
        return JSONResponse(
            {"error": f"snippet not found: {rel_path}"},
            status_code=404,
        )

    try:
        with open(resolved, "r", encoding="utf-8") as f:
            source = f.read()
    except OSError as exc:
        logger.error("Failed to read snippet %s: %s", resolved, exc)
        return JSONResponse(
            {"error": "failed to read snippet file"},
            status_code=500,
        )

    try:
        result = _parse_notebook(source)
    except SyntaxError as exc:
        logger.error("Failed to parse snippet %s: %s", resolved, exc)
        return JSONResponse(
            {"error": "snippet file has syntax errors"},
            status_code=422,
        )

    if result is None:
        return JSONResponse(
            {"error": "no @app.cell function found in snippet"},
            status_code=422,
        )

    # Derive name from filename (without extension)
    name = os.path.splitext(os.path.basename(rel_path))[0]

    return JSONResponse({
        "code": result["code"],
        "defs": result["defs"],
        "refs": result["refs"],
        "name": name,
        "path": rel_path,
    })


router = Router(routes=[
    Route("/{path:path}", get_snippet, methods=["GET"]),
])
