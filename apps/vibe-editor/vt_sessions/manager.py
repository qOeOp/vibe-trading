"""
VT Session Manager — thin layer on top of marimo's SessionManager.

Responsibilities:
- userId → workspace mapping
- Workspace directory bootstrapping
- Session metadata tracking (which user owns which session)
- Reconnect support (userId lookup when sessionId is unknown)

Does NOT:
- Manage kernel lifecycle (marimo's SessionManager does that)
- Handle WebSocket connections (marimo's ws_endpoint does that)
- Store notebook state (marimo's Session does that)
"""
from __future__ import annotations

import asyncio
import logging
import time
from typing import Optional

from .models import VTSession, SessionStatus
from .workspace import ensure_workspace

logger = logging.getLogger(__name__)

# Sessions idle longer than this are automatically cleaned up
IDLE_TIMEOUT_SECONDS = 30 * 60  # 30 minutes


class VTSessionManager:
    """
    Manages VT-level session metadata.

    Concurrency-safe because all methods are synchronous (no await points),
    so they execute atomically within a single asyncio event loop tick.
    If any method becomes async in the future, add asyncio.Lock.
    """

    def __init__(
        self,
        workspace_base: str | None = None,
        idle_timeout: float = IDLE_TIMEOUT_SECONDS,
    ) -> None:
        # userId → VTSession (one session per user for now)
        self._sessions: dict[str, VTSession] = {}
        self._workspace_base = workspace_base
        self._idle_timeout = idle_timeout
        self._cleanup_task: Optional[asyncio.Task[None]] = None

    def connect(self, user_id: str) -> VTSession:
        """
        Connect a user to their session.

        If an existing session exists for this userId, return it (reconnect).
        Otherwise, bootstrap workspace and create a new session.

        Args:
            user_id: User identifier. Currently "root" for single-user mode.
                     # TODO: auth — validate user_id against auth system

        Returns:
            VTSession with workspace paths and status
        """
        # Check for existing session
        existing = self._sessions.get(user_id)
        if existing is not None:
            existing.status = SessionStatus.RECONNECTED
            existing.touch()
            logger.info(
                "Reconnected user %s to existing session (workspace=%s)",
                user_id,
                existing.workspace_path,
            )
            return existing

        # New session — bootstrap workspace
        workspace_path, notebook_path = ensure_workspace(
            user_id, self._workspace_base
        )

        session = VTSession(
            user_id=user_id,
            workspace_path=workspace_path,
            notebook_path=notebook_path,
            status=SessionStatus.CREATED,
        )
        self._sessions[user_id] = session

        logger.info(
            "Created new session for user %s (workspace=%s, notebook=%s)",
            user_id,
            workspace_path,
            notebook_path,
        )
        return session

    def get_session(self, user_id: str) -> Optional[VTSession]:
        """Get session for a user, or None if not connected."""
        return self._sessions.get(user_id)

    def disconnect(self, user_id: str) -> bool:
        """
        Disconnect a user's session.

        Removes VT session metadata. Does NOT stop marimo kernel —
        that's handled by marimo's own session cleanup (TTL, etc.).

        Workspace files are preserved on disk for future reconnection.

        Returns:
            True if session existed and was removed, False otherwise.
        """
        session = self._sessions.pop(user_id, None)
        if session is None:
            return False

        session.status = SessionStatus.CLOSED
        logger.info("Disconnected user %s session", user_id)
        return True

    def get_status(self, user_id: str) -> Optional[dict]:
        """Get serialized session status for API response.

        Does NOT update last_active_at — only heartbeat and connect
        should extend the idle timeout. This prevents monitoring tools
        from inadvertently keeping sessions alive.
        """
        session = self._sessions.get(user_id)
        if session is None:
            return None
        return session.to_dict()

    def heartbeat(self, user_id: str) -> bool:
        """
        Record heartbeat from frontend.

        Updates last_active_at timestamp, preventing idle timeout cleanup.

        Returns:
            True if session exists, False otherwise.
        """
        session = self._sessions.get(user_id)
        if session is None:
            return False
        session.touch()
        return True

    def cleanup_idle_sessions(self) -> list[str]:
        """
        Remove sessions that have been idle longer than idle_timeout.

        Called periodically by the background cleanup task.
        Workspace files are NOT deleted — only VT session metadata is removed.

        Returns:
            List of removed userIds.
        """
        now = time.time()
        to_remove: list[str] = []

        for user_id, session in self._sessions.items():
            idle_seconds = now - session.last_active_at
            if idle_seconds > self._idle_timeout:
                to_remove.append(user_id)

        for user_id in to_remove:
            self._sessions.pop(user_id, None)

        if to_remove:
            logger.info("Cleaned up %d idle sessions: %s", len(to_remove), to_remove)

        return to_remove

    async def start_cleanup_loop(self) -> None:
        """Start background task that periodically cleans up idle sessions."""
        if self._cleanup_task is not None:
            return  # Already running

        async def _loop() -> None:
            while True:
                await asyncio.sleep(60)  # Check every minute
                try:
                    self.cleanup_idle_sessions()
                except Exception:
                    logger.exception("Error in idle session cleanup")

        self._cleanup_task = asyncio.create_task(_loop())
        logger.info("Started idle session cleanup loop (timeout=%ds)", self._idle_timeout)

    def stop_cleanup_loop(self) -> None:
        """Stop the background cleanup task."""
        if self._cleanup_task is not None:
            self._cleanup_task.cancel()
            self._cleanup_task = None

    @property
    def active_sessions(self) -> dict[str, VTSession]:
        """All active sessions (for monitoring/admin)."""
        return dict(self._sessions)
