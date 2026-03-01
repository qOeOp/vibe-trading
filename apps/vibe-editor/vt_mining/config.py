"""vt_mining/config.py — Shared configuration for the mining module.

Mining artifacts (progress, factors, rounds) are stored per-user in:
    {workspace}/mining/{task_id}/

Qlib market data (daily_pv.h5) is shared infrastructure, stored at:
    ~/.vt-lab/factor_data/  (or VT_FACTOR_DATA_DIR env var)
"""
import os

# Shared Qlib market data — read-only infrastructure, NOT per-user.
# On a server this would be a mounted volume shared across all users.
FACTOR_DATA_DIR: str = os.environ.get(
    "VT_FACTOR_DATA_DIR", os.path.expanduser("~/.vt-lab/factor_data")
)

# SQLite knowledge store — per-workspace, colocated with mining results.
# Resolved at runtime from workspace path (see get_knowledge_db_path).
_DEFAULT_KNOWLEDGE_DB = "knowledge.db"


def get_mining_dir(workspace_path: str) -> str:
    """Derive mining task storage from a user's workspace path.

    Mining results live inside the workspace, colocated with the user's
    notebooks and other artifacts. Each task gets its own subdirectory.

    Layout:
        {workspace}/
        ├── factor.py          ← user's notebooks (editor)
        ├── mining/            ← mining task artifacts
        │   ├── mining_20260301_120000_000/
        │   │   ├── config.json
        │   │   ├── progress.json
        │   │   ├── factors.jsonl
        │   │   ├── rounds.json
        │   │   ├── status.json
        │   │   └── worker.log
        │   └── mining_20260301_130000_001/
        │       └── ...
        └── knowledge.db       ← per-user knowledge store
    """
    return os.path.join(workspace_path, "mining")


def get_knowledge_db_path(workspace_path: str) -> str:
    """Derive knowledge DB path from a user's workspace path."""
    return os.path.join(workspace_path, _DEFAULT_KNOWLEDGE_DB)
