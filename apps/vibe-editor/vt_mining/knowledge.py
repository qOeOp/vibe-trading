"""vt_mining/knowledge.py — SQLite-backed knowledge store for mining factors."""
from __future__ import annotations

import os
import sqlite3
from dataclasses import dataclass, field
from datetime import datetime, timezone
from typing import Optional

@dataclass
class MiningFactorRecord:
    """A factor discovered by mining, stored in knowledge.db."""
    id: str                      # "{task_id}_{factor_name}"
    task_id: str
    name: str
    expression: str              # factor formula / code snippet (first 500 chars)
    ic_mean: float
    ic_ir: float
    annual_return: float
    sharpe_ratio: float
    max_drawdown: float
    code_file: str               # absolute path to factor .py file
    hypothesis: str = ""
    workspace_path: Optional[str] = None  # set after Lab file association
    status: str = "INCUBATING"
    created_at: str = field(
        default_factory=lambda: datetime.now(timezone.utc).isoformat()
    )


class KnowledgeStore:
    """SQLite-backed persistence for mining factors."""

    def __init__(self, db_path: str = "") -> None:
        if not db_path:
            raise ValueError("KnowledgeStore requires a db_path (derived from workspace)")
        self.db_path = db_path
        parent = os.path.dirname(self.db_path)
        if parent:
            os.makedirs(parent, exist_ok=True)
        self._init_schema()

    def _conn(self) -> sqlite3.Connection:
        conn = sqlite3.connect(self.db_path)
        conn.row_factory = sqlite3.Row
        return conn

    def _init_schema(self) -> None:
        with self._conn() as conn:
            conn.execute("""
                CREATE TABLE IF NOT EXISTS mining_factors (
                    id             TEXT PRIMARY KEY,
                    task_id        TEXT NOT NULL,
                    name           TEXT NOT NULL,
                    expression     TEXT NOT NULL,
                    hypothesis     TEXT DEFAULT '',
                    ic_mean        REAL DEFAULT 0,
                    ic_ir          REAL DEFAULT 0,
                    annual_return  REAL DEFAULT 0,
                    sharpe_ratio   REAL DEFAULT 0,
                    max_drawdown   REAL DEFAULT 0,
                    code_file      TEXT NOT NULL,
                    workspace_path TEXT,
                    status         TEXT DEFAULT 'INCUBATING',
                    created_at     TEXT NOT NULL
                )
            """)
            conn.execute(
                "CREATE INDEX IF NOT EXISTS idx_mf_task_id ON mining_factors(task_id)"
            )
            conn.execute(
                "CREATE INDEX IF NOT EXISTS idx_mf_status ON mining_factors(status)"
            )

    def add_factor(self, record: MiningFactorRecord) -> None:
        """Insert or replace a mining factor record (upsert)."""
        with self._conn() as conn:
            conn.execute(
                """
                INSERT OR REPLACE INTO mining_factors
                    (id, task_id, name, expression, hypothesis,
                     ic_mean, ic_ir, annual_return, sharpe_ratio,
                     max_drawdown, code_file, workspace_path, status, created_at)
                VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)
                """,
                (
                    record.id, record.task_id, record.name, record.expression,
                    record.hypothesis, record.ic_mean, record.ic_ir,
                    record.annual_return, record.sharpe_ratio,
                    record.max_drawdown, record.code_file,
                    record.workspace_path, record.status, record.created_at,
                ),
            )

    def get_factor(self, factor_id: str) -> Optional[MiningFactorRecord]:
        """Return a single factor by id, or None."""
        with self._conn() as conn:
            row = conn.execute(
                "SELECT * FROM mining_factors WHERE id = ?", (factor_id,)
            ).fetchone()
        if row is None:
            return None
        return self._row_to_record(row)

    def list_factors(self, status: Optional[str] = None) -> list[MiningFactorRecord]:
        """Return all factors, optionally filtered by status."""
        with self._conn() as conn:
            if status is not None:
                rows = conn.execute(
                    "SELECT * FROM mining_factors WHERE status = ? ORDER BY created_at DESC",
                    (status,),
                ).fetchall()
            else:
                rows = conn.execute(
                    "SELECT * FROM mining_factors ORDER BY created_at DESC"
                ).fetchall()
        return [self._row_to_record(r) for r in rows]

    def update_workspace_path(self, factor_id: str, workspace_path: str) -> None:
        """Set workspace_path after Lab file association is created.

        Raises KeyError if factor_id is not found.
        """
        with self._conn() as conn:
            cursor = conn.execute(
                "UPDATE mining_factors SET workspace_path = ? WHERE id = ?",
                (workspace_path, factor_id),
            )
            if cursor.rowcount == 0:
                raise KeyError(f"Factor not found: {factor_id}")

    @staticmethod
    def _row_to_record(row: sqlite3.Row) -> MiningFactorRecord:
        return MiningFactorRecord(
            id=row["id"],
            task_id=row["task_id"],
            name=row["name"],
            expression=row["expression"],
            hypothesis=row["hypothesis"] or "",
            ic_mean=row["ic_mean"],
            ic_ir=row["ic_ir"],
            annual_return=row["annual_return"],
            sharpe_ratio=row["sharpe_ratio"],
            max_drawdown=row["max_drawdown"],
            code_file=row["code_file"],
            workspace_path=row["workspace_path"],
            status=row["status"],
            created_at=row["created_at"],
        )
