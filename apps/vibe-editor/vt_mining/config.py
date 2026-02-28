"""vt_mining/config.py — Shared configuration for the mining module."""
import os

# Base directory for mining task artifacts (progress.json, factors.jsonl, etc.)
MINING_BASE_DIR: str = os.environ.get(
    "VT_MINING_DIR", os.path.expanduser("~/.vt-lab/mining")
)

# SQLite knowledge store for persisted factor records
KNOWLEDGE_DB_PATH: str = os.environ.get(
    "VT_KNOWLEDGE_DB", os.path.expanduser("~/.vt-lab/knowledge.db")
)
