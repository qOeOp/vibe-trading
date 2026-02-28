"""Qlib data packaging API routes.

Endpoints:
- POST /api/qlib/dump — Trigger Qlib data dump
- GET /api/qlib/status — Get current Qlib data package status
"""

from __future__ import annotations

import logging
from datetime import date as date_type
from pathlib import Path
from typing import Optional

import pandas as pd
from fastapi import APIRouter, BackgroundTasks, HTTPException

from ..models.ohlcv import QlibDumpRequest, QlibDumpResult, QlibDumpStatus
from ..services.data_source_manager import DataSourceManager

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/qlib", tags=["Qlib Data"])

_data_manager: Optional[DataSourceManager] = None
_cache = None


def init_qlib_router(data_manager, cache) -> None:
    """Initialize router dependencies."""
    global _data_manager, _cache
    _data_manager = data_manager
    _cache = cache
    logger.info("Qlib router initialized")


@router.get("/status", response_model=QlibDumpStatus)
async def get_qlib_status(
    output_dir: str = "/data/qlib/cn_data",
) -> QlibDumpStatus:
    """Get status of Qlib data package."""
    base = Path(output_dir)
    if not base.exists():
        return QlibDumpStatus()

    cal_path = base / "calendars" / "day.txt"
    total_days = 0
    last_date = None
    if cal_path.exists():
        lines = cal_path.read_text().strip().split("\n")
        total_days = len(lines)
        last_date = lines[-1] if lines else None

    inst_path = base / "instruments" / "all.txt"
    total_symbols = 0
    if inst_path.exists():
        total_symbols = len(inst_path.read_text().strip().split("\n"))

    features_dir = base / "features"
    data_size_mb = 0.0
    fields = set()
    if features_dir.exists():
        for bin_file in features_dir.rglob("*.day.bin"):
            data_size_mb += bin_file.stat().st_size / (1024 * 1024)
            field_name = bin_file.stem.replace(".day", "")
            fields.add(field_name)

    return QlibDumpStatus(
        last_date=last_date,
        total_symbols=total_symbols,
        total_trading_days=total_days,
        data_size_mb=round(data_size_mb, 2),
        fields=sorted(fields),
    )


@router.post("/dump", response_model=QlibDumpResult)
async def trigger_qlib_dump(
    request: QlibDumpRequest,
    background_tasks: BackgroundTasks,
) -> QlibDumpResult:
    """Trigger Qlib data packaging."""
    if _data_manager is None:
        raise HTTPException(status_code=503, detail="Service not initialized")

    from ..services.qlib_dump import QlibDumper

    try:
        if request.symbols:
            symbols = request.symbols
        else:
            stock_list = await _data_manager.get_stock_list()
            symbols = [s.code for s in stock_list]

        if not symbols:
            return QlibDumpResult(success=False, error="No symbols to process")

        start = date_type.fromisoformat(request.start_date)
        end_str = request.end_date or date_type.today().isoformat()
        end = date_type.fromisoformat(end_str)

        all_bars = []
        for symbol in symbols:
            bars = await _data_manager.get_daily_bars(symbol, start, end)
            all_bars.extend(bars)

        if not all_bars:
            return QlibDumpResult(success=False, error="No data fetched")

        rows = []
        for bar in all_bars:
            prefix = _symbol_to_qlib(bar.symbol)
            rows.append(
                {
                    "date": bar.date,
                    "symbol": prefix,
                    "open": bar.open,
                    "close": bar.close,
                    "high": bar.high,
                    "low": bar.low,
                    "volume": bar.volume,
                    "factor": bar.adjust_factor or 1.0,
                }
            )

        df = pd.DataFrame(rows)
        calendar = sorted(
            df["date"].apply(lambda d: d.isoformat()).unique().tolist()
        )

        dumper = QlibDumper(request.output_dir)
        result = dumper.dump_dataframe(df, calendar, request.include_fields)
        return result

    except Exception as e:
        logger.error(f"Qlib dump failed: {e}", exc_info=True)
        return QlibDumpResult(success=False, error=str(e))


def _symbol_to_qlib(code: str) -> str:
    """Convert stock code to Qlib symbol. 6xx->sh, 0xx/3xx->sz, 4xx/8xx->bj"""
    code = code.strip()
    if code.startswith("6"):
        return f"sh{code}"
    elif code.startswith(("0", "3")):
        return f"sz{code}"
    elif code.startswith(("4", "8")):
        return f"bj{code}"
    return code
