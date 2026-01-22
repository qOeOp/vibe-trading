"""Tests for Redis cache layer with graceful degradation"""

from __future__ import annotations

from datetime import timedelta
from typing import List
from unittest.mock import AsyncMock, MagicMock

import pytest
import redis

from src.cache.redis_cache import RedisCache
from src.models.shenwan import FirstLevelIndustry


# Test data fixture
@pytest.fixture
def sample_industries() -> List[FirstLevelIndustry]:
    """Sample industry data for testing"""
    return [
        FirstLevelIndustry(
            code="801010",
            name="农林牧渔",
            constituent_count=100,
            static_pe_ratio=25.5,
            ttm_pe_ratio=24.8,
            pb_ratio=2.3,
            dividend_yield=1.5,
        ),
        FirstLevelIndustry(
            code="801020",
            name="采掘",
            constituent_count=50,
            static_pe_ratio=15.2,
            ttm_pe_ratio=14.9,
            pb_ratio=1.8,
            dividend_yield=2.1,
        ),
    ]


@pytest.fixture
def mock_redis() -> MagicMock:
    """Mock Redis client"""
    mock = MagicMock(spec=redis.Redis)
    return mock


@pytest.fixture
def mock_fetch_fn(sample_industries: List[FirstLevelIndustry]) -> AsyncMock:
    """Mock data fetch function"""
    fetch_fn = AsyncMock()
    fetch_fn.return_value = sample_industries
    return fetch_fn


async def test_cache_hit(
    mock_redis: MagicMock,
    mock_fetch_fn: AsyncMock,
    sample_industries: List[FirstLevelIndustry],
):
    """Test cache returns data on hit"""
    # Setup: Redis returns cached data
    cached_json = "[" + ",".join(ind.model_dump_json() for ind in sample_industries) + "]"
    mock_redis.get.return_value = cached_json.encode()

    cache = RedisCache(mock_redis)

    # Execute
    result = await cache.get_or_fetch(
        cache_key="test:industries",
        fetch_fn=mock_fetch_fn,
        model_class=FirstLevelIndustry,
    )

    # Verify
    assert len(result) == 2
    assert result[0].code == "801010"
    assert result[0].name == "农林牧渔"
    assert result[1].code == "801020"

    # Fetch function should NOT be called on cache hit
    mock_fetch_fn.assert_not_called()

    # Redis.get should be called with primary key
    mock_redis.get.assert_called_once_with("test:industries:data")


async def test_cache_miss_fetch(
    mock_redis: MagicMock,
    mock_fetch_fn: AsyncMock,
    sample_industries: List[FirstLevelIndustry],
):
    """Test cache fetches and stores on miss"""
    # Setup: Redis returns None (cache miss)
    mock_redis.get.return_value = None

    cache = RedisCache(mock_redis)

    # Execute
    result = await cache.get_or_fetch(
        cache_key="test:industries",
        fetch_fn=mock_fetch_fn,
        model_class=FirstLevelIndustry,
        ttl=timedelta(hours=12),
    )

    # Verify
    assert len(result) == 2
    assert result[0].code == "801010"

    # Fetch function should be called once
    mock_fetch_fn.assert_called_once()

    # Redis should be called: get (primary), setex (primary with TTL), set (backup)
    assert mock_redis.get.call_count == 1
    assert mock_redis.setex.call_count == 1
    assert mock_redis.set.call_count == 1

    # Verify primary cache write (with TTL)
    setex_call = mock_redis.setex.call_args
    assert setex_call[0][0] == "test:industries:data"
    assert setex_call[0][1] == int(timedelta(hours=12).total_seconds())

    # Verify backup cache write (no TTL)
    set_call = mock_redis.set.call_args
    assert set_call[0][0] == "test:industries:backup"


async def test_redis_unavailable(
    mock_fetch_fn: AsyncMock,
    sample_industries: List[FirstLevelIndustry],
):
    """Test cache works without Redis (graceful degradation)"""
    # Setup: No Redis client (None)
    cache = RedisCache(None)

    # Execute
    result = await cache.get_or_fetch(
        cache_key="test:industries",
        fetch_fn=mock_fetch_fn,
        model_class=FirstLevelIndustry,
    )

    # Verify
    assert len(result) == 2
    assert result[0].code == "801010"

    # Fetch function should be called directly
    mock_fetch_fn.assert_called_once()


async def test_serve_stale_on_fetch_failure(
    mock_redis: MagicMock,
    sample_industries: List[FirstLevelIndustry],
):
    """Test serving backup when fetch fails"""
    # Setup: Primary cache miss, fetch fails, backup available
    mock_redis.get.side_effect = [
        None,  # First call: primary cache miss
        ("[" + ",".join(ind.model_dump_json() for ind in sample_industries) + "]").encode(),
        # Second call: backup cache hit
    ]

    # Mock fetch function that fails
    fetch_fn = AsyncMock()
    fetch_fn.side_effect = Exception("Data source unavailable")

    cache = RedisCache(mock_redis)

    # Execute
    result = await cache.get_or_fetch(
        cache_key="test:industries",
        fetch_fn=fetch_fn,
        model_class=FirstLevelIndustry,
    )

    # Verify
    assert len(result) == 2
    assert result[0].code == "801010"

    # Fetch function should be called once (and fail)
    fetch_fn.assert_called_once()

    # Redis.get should be called twice: primary key, then backup key
    assert mock_redis.get.call_count == 2
    mock_redis.get.assert_any_call("test:industries:data")
    mock_redis.get.assert_any_call("test:industries:backup")
