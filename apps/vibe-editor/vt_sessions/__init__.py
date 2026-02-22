"""
VT Sessions — session management layer for vibe-editor.

Thin wrapper on top of marimo's SessionManager, handling:
- userId → workspace mapping
- Workspace bootstrapping (directory + welcome notebook)
- REST API for session connect/disconnect/status
"""
from .manager import VTSessionManager
from .models import VTSession, SessionStatus
from .workspace import ensure_workspace

__all__ = [
    "VTSessionManager",
    "VTSession",
    "SessionStatus",
    "ensure_workspace",
]
