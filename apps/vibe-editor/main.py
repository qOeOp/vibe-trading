"""
Vibe Editor — marimo-based notebook server for VT Lab.

Replaces `marimo edit ~/.vt-lab --headless --port 2728 --no-token
--no-skew-protection --allow-origins "http://localhost:4200"`
with a programmatic entry point managed by Nx.
"""
from __future__ import annotations

import os
import sys

# Ensure the vibe-editor package root is on sys.path so that
# `import marimo` resolves to our vendored copy, not a pip-installed one.
_PACKAGE_ROOT = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, _PACKAGE_ROOT)

from marimo._server.file_router import AppFileRouter
from marimo._server.start import start
from marimo._server.tokens import AuthToken
from marimo._session.model import SessionMode

# ---------------------------------------------------------------------------
# Configuration — mirrors the old CLI flags
# ---------------------------------------------------------------------------
WORKSPACE_DIR = os.path.expanduser("~/.vt-lab")
PORT = int(os.environ.get("VIBE_EDITOR_PORT", "2728"))
HOST = os.environ.get("VIBE_EDITOR_HOST", "127.0.0.1")
ALLOW_ORIGINS = tuple(
    os.environ.get(
        "VIBE_EDITOR_ALLOW_ORIGINS",
        "http://localhost:4200",
    ).split(",")
)
# Allow all localhost variants + RFC-1918 private LAN ranges so that
# accessing the dev server from a LAN IP (e.g. 192.168.x.x) works without
# having to enumerate every possible origin.
ALLOW_ORIGIN_REGEX = os.environ.get(
    "VIBE_EDITOR_ALLOW_ORIGIN_REGEX",
    r".*",  # dev: allow all origins; restrict via env var in production
)


def main() -> None:
    # Ensure workspace directory exists
    os.makedirs(WORKSPACE_DIR, exist_ok=True)

    # Build file router pointing at the workspace directory
    file_router = AppFileRouter.infer(WORKSPACE_DIR)

    # No auth token (equivalent to --no-token)
    auth_token = AuthToken("")

    start(
        file_router=file_router,
        mode=SessionMode.EDIT,
        development_mode=False,
        quiet=False,
        include_code=True,
        ttl_seconds=None,
        headless=True,
        port=PORT,
        host=HOST,
        proxy=None,
        watch=False,
        cli_args={},
        argv=[],
        base_url="",
        allow_origins=ALLOW_ORIGINS,
        allow_origin_regex=ALLOW_ORIGIN_REGEX,
        auth_token=auth_token,
        redirect_console_to_browser=True,
        skew_protection=False,  # equivalent to --no-skew-protection
    )


if __name__ == "__main__":
    main()
