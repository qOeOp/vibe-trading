"""Shenwan industry classification API routes.

This module exposes 4 REST API endpoints for Shenwan industry data:
- GET /api/shenwan/industries/first - First-level industries
- GET /api/shenwan/industries/second - Second-level industries
- GET /api/shenwan/industries/third - Third-level industries
- GET /api/shenwan/constituents/{symbol} - Constituent stocks for an industry

Features:
- Response models (Pydantic) for type safety and OpenAPI docs
- Cache integration with force_refresh support
- Error handling (400 for bad requests, 503 for service unavailable)
- Dependency injection pattern (module globals set at startup)

Dependencies:
- _data_manager: DataSourceManager for fetching data
- _cache: RedisCache for caching with TTL and backup

Usage:
    # In main.py startup event
    from .routes.shenwan import router as shenwan_router, init_router

    init_router(data_manager, cache)
    app.include_router(shenwan_router)
"""

from __future__ import annotations

import logging
from typing import List, Optional

from fastapi import APIRouter, HTTPException, Query

from ..cache.redis_cache import RedisCache
from ..models.shenwan import (
    ConstituentStock,
    FirstLevelIndustry,
    SecondLevelIndustry,
    ThirdLevelIndustry,
)
from ..services.data_source_manager import DataSourceManager

logger = logging.getLogger(__name__)

# Module globals for dependency injection (set at startup)
_data_manager: Optional[DataSourceManager] = None
_cache: Optional[RedisCache] = None

# Create router with prefix and tags
router = APIRouter(
    prefix="/api/shenwan",
    tags=["Shenwan Industries"],
)


def init_router(data_manager: DataSourceManager, cache: RedisCache) -> None:
    """
    Initialize router dependencies.

    This must be called during FastAPI startup event to inject
    the data manager and cache instances.

    Args:
        data_manager: DataSourceManager instance for fetching data
        cache: RedisCache instance for caching
    """
    global _data_manager, _cache
    _data_manager = data_manager
    _cache = cache
    logger.info("Shenwan router initialized with dependencies")


@router.get(
    "/industries/first",
    response_model=List[FirstLevelIndustry],
    summary="Get first-level Shenwan industries",
    description="Fetch all first-level (top-level) Shenwan industry classifications with metrics.",
)
async def get_first_level_industries(
    force_refresh: bool = Query(
        False,
        description="Force refresh cache and fetch fresh data from source"
    )
) -> List[FirstLevelIndustry]:
    """
    Get first-level Shenwan industry classifications.

    Returns industry data including code, name, constituent count,
    and financial metrics (PE ratio, PB ratio, dividend yield).

    Args:
        force_refresh: If True, bypass cache and fetch fresh data

    Returns:
        List of FirstLevelIndustry models

    Raises:
        HTTPException 503: If service is unavailable or data fetch fails
    """
    if _data_manager is None or _cache is None:
        logger.error("Router not initialized - data_manager or cache is None")
        raise HTTPException(
            status_code=503,
            detail="Service not initialized"
        )

    try:
        industries = await _cache.get_or_fetch(
            cache_key="shenwan:first_level",
            fetch_fn=_data_manager.get_first_level_industries,
            model_class=FirstLevelIndustry,
            force_refresh=force_refresh,
        )
        return industries

    except Exception as e:
        logger.error(f"Failed to fetch first-level industries: {e}", exc_info=True)
        raise HTTPException(
            status_code=503,
            detail="Failed to fetch industry data"
        )


@router.get(
    "/industries/second",
    response_model=List[SecondLevelIndustry],
    summary="Get second-level Shenwan industries",
    description="Fetch all second-level Shenwan industry classifications with parent industry and metrics.",
)
async def get_second_level_industries(
    force_refresh: bool = Query(
        False,
        description="Force refresh cache and fetch fresh data from source"
    )
) -> List[SecondLevelIndustry]:
    """
    Get second-level Shenwan industry classifications.

    Returns industry data including code, name, parent industry,
    constituent count, and financial metrics.

    Args:
        force_refresh: If True, bypass cache and fetch fresh data

    Returns:
        List of SecondLevelIndustry models

    Raises:
        HTTPException 503: If service is unavailable or data fetch fails
    """
    if _data_manager is None or _cache is None:
        logger.error("Router not initialized - data_manager or cache is None")
        raise HTTPException(
            status_code=503,
            detail="Service not initialized"
        )

    try:
        industries = await _cache.get_or_fetch(
            cache_key="shenwan:second_level",
            fetch_fn=_data_manager.get_second_level_industries,
            model_class=SecondLevelIndustry,
            force_refresh=force_refresh,
        )
        return industries

    except Exception as e:
        logger.error(f"Failed to fetch second-level industries: {e}", exc_info=True)
        raise HTTPException(
            status_code=503,
            detail="Failed to fetch industry data"
        )


@router.get(
    "/industries/third",
    response_model=List[ThirdLevelIndustry],
    summary="Get third-level Shenwan industries",
    description="Fetch all third-level (most granular) Shenwan industry classifications with metrics.",
)
async def get_third_level_industries(
    force_refresh: bool = Query(
        False,
        description="Force refresh cache and fetch fresh data from source"
    )
) -> List[ThirdLevelIndustry]:
    """
    Get third-level Shenwan industry classifications.

    Returns the most granular industry classification data including
    code, name, constituent count, and financial metrics.

    Args:
        force_refresh: If True, bypass cache and fetch fresh data

    Returns:
        List of ThirdLevelIndustry models

    Raises:
        HTTPException 503: If service is unavailable or data fetch fails
    """
    if _data_manager is None or _cache is None:
        logger.error("Router not initialized - data_manager or cache is None")
        raise HTTPException(
            status_code=503,
            detail="Service not initialized"
        )

    try:
        industries = await _cache.get_or_fetch(
            cache_key="shenwan:third_level",
            fetch_fn=_data_manager.get_third_level_industries,
            model_class=ThirdLevelIndustry,
            force_refresh=force_refresh,
        )
        return industries

    except Exception as e:
        logger.error(f"Failed to fetch third-level industries: {e}", exc_info=True)
        raise HTTPException(
            status_code=503,
            detail="Failed to fetch industry data"
        )


@router.get(
    "/constituents/{symbol}",
    response_model=List[ConstituentStock],
    summary="Get constituent stocks for an industry",
    description="Fetch all constituent stocks for a specific Shenwan industry classification.",
)
async def get_constituents(
    symbol: str,
    force_refresh: bool = Query(
        False,
        description="Force refresh cache and fetch fresh data from source"
    )
) -> List[ConstituentStock]:
    """
    Get constituent stocks for a Shenwan industry.

    Returns detailed stock information for all constituents in the
    specified industry, including stock code, name, inclusion date,
    classifications, price, financial metrics, and growth rates.

    Args:
        symbol: Industry symbol (e.g., "801010.SI" for Agriculture)
        force_refresh: If True, bypass cache and fetch fresh data

    Returns:
        List of ConstituentStock models

    Raises:
        HTTPException 400: If symbol is invalid
        HTTPException 503: If service is unavailable or data fetch fails
    """
    if _data_manager is None or _cache is None:
        logger.error("Router not initialized - data_manager or cache is None")
        raise HTTPException(
            status_code=503,
            detail="Service not initialized"
        )

    try:
        # Create symbol-specific cache key
        cache_key = f"shenwan:constituents:{symbol}"

        # Fetch with cache
        constituents = await _cache.get_or_fetch(
            cache_key=cache_key,
            fetch_fn=lambda: _data_manager.get_constituents(symbol),
            model_class=ConstituentStock,
            force_refresh=force_refresh,
        )
        return constituents

    except ValueError as e:
        # Invalid symbol or data validation error
        logger.warning(f"Invalid symbol or data error for {symbol}: {e}")
        raise HTTPException(
            status_code=400,
            detail=f"Invalid symbol or data: {str(e)}"
        )

    except Exception as e:
        # Service unavailable or data fetch error
        logger.error(f"Failed to fetch constituents for {symbol}: {e}", exc_info=True)
        raise HTTPException(
            status_code=503,
            detail="Failed to fetch constituent data"
        )
