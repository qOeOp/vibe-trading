"""
Data models for VT session management.

Thin layer on top of marimo's SessionManager — we track userId→workspace
mapping, marimo handles actual kernel lifecycle.
"""
from __future__ import annotations

import time
from dataclasses import dataclass, field
from enum import Enum
from typing import Optional


class SessionStatus(str, Enum):
    """High-level session state visible to the frontend."""
    CREATED = "created"       # Fresh session, workspace just allocated
    RECONNECTED = "reconnected"  # Existing session found for this userId
    ACTIVE = "active"         # Reserved: future WebSocket-aware state tracking
    IDLE = "idle"             # Reserved: future WebSocket-aware state tracking
    CLOSED = "closed"         # Session terminated


@dataclass
class VTSession:
    """
    VT-level session metadata. Wraps around marimo's internal Session.

    Does NOT duplicate marimo's session state — only tracks VT-specific
    concerns: which user owns this session, where their workspace lives,
    and which notebook is open.
    """
    user_id: str
    workspace_path: str
    notebook_path: str
    session_id: Optional[str] = None  # marimo's session ID (assigned on WS connect)
    status: SessionStatus = SessionStatus.CREATED
    created_at: float = field(default_factory=time.time)
    last_active_at: float = field(default_factory=time.time)

    def touch(self) -> None:
        """Update last_active_at timestamp."""
        self.last_active_at = time.time()

    def to_dict(self) -> dict:
        """Serialize for API response."""
        return {
            "userId": self.user_id,
            "workspacePath": self.workspace_path,
            "notebookPath": self.notebook_path,
            "sessionId": self.session_id,
            "status": self.status.value,
            "createdAt": self.created_at,
            "lastActiveAt": self.last_active_at,
        }
