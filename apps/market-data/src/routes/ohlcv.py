"""OHLCV market data API routes.

Endpoints:
- GET /api/ohlcv/daily/{symbol} — Daily OHLCV bars for a stock
- GET /api/ohlcv/stocks — List all A-share stocks
"""

from __future__ import annotations

import logging
from datetime import date
from typing import List, Optional

from fastapi import APIRouter, HTTPException, Query

from ..cache.redis_cache import RedisCache
from ..models.ohlcv import DailyBar, StockInfo
from ..services.data_source_manager import DataSourceManager

logger = logging.getLogger(__name__)

_data_manager: Optional[DataSourceManager] = None
_cache: Optional[RedisCache] = None

router = APIRouter(prefix="/api/ohlcv", tags=["OHLCV Market Data"])


def init_ohlcv_router(data_manager: DataSourceManager, cache: RedisCache) -> None:
    """Initialize router dependencies."""
    global _data_manager, _cache
    _data_manager = data_manager
    _cache = cache
    logger.info("OHLCV router initialized")


@router.get("/daily/{symbol}", response_model=List[DailyBar])
async def get_daily_bars(
    symbol: str,
    start_date: str = Query(..., description="Start date YYYY-MM-DD"),
    end_date: str = Query(..., description="End date YYYY-MM-DD"),
) -> List[DailyBar]:
    """Fetch daily OHLCV bars for a stock."""
    if _data_manager is None:
        raise HTTPException(status_code=503, detail="Service not initialized")
    try:
        start = date.fromisoformat(start_date)
        end = date.fromisoformat(end_date)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid date format, use YYYY-MM-DD")
    try:
        return await _data_manager.get_daily_bars(symbol, start, end)
    except Exception as e:
        logger.error(f"Failed to fetch daily bars for {symbol}: {e}", exc_info=True)
        raise HTTPException(status_code=503, detail="Failed to fetch market data")


@router.get("/stocks", response_model=List[StockInfo])
async def get_stock_list() -> List[StockInfo]:
    """Fetch list of all A-share stocks."""
    if _data_manager is None:
        raise HTTPException(status_code=503, detail="Service not initialized")
    try:
        return await _data_manager.get_stock_list()
    except Exception as e:
        logger.error(f"Failed to fetch stock list: {e}", exc_info=True)
        raise HTTPException(status_code=503, detail="Failed to fetch stock list")
