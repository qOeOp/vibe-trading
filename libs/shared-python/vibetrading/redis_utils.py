"""Redis utilities for Vibe Trading services."""

import os
from typing import Optional
from redis import Redis
from redis.asyncio import Redis as AsyncRedis


def get_redis_url() -> str:
    """
    Get Redis connection URL from environment.

    Returns:
        Redis connection URL
    """
    return os.getenv("REDIS_URL", "redis://localhost:8206")


def create_redis_client(url: Optional[str] = None, **kwargs) -> Redis:
    """
    Create a synchronous Redis client.

    Args:
        url: Redis connection URL. If None, uses get_redis_url().
        **kwargs: Additional Redis client configuration

    Returns:
        Redis client instance
    """
    if url is None:
        url = get_redis_url()

    return Redis.from_url(url, decode_responses=True, **kwargs)


def create_async_redis_client(url: Optional[str] = None, **kwargs) -> AsyncRedis:
    """
    Create an asynchronous Redis client.

    Args:
        url: Redis connection URL. If None, uses get_redis_url().
        **kwargs: Additional Redis client configuration

    Returns:
        Async Redis client instance
    """
    if url is None:
        url = get_redis_url()

    return AsyncRedis.from_url(url, decode_responses=True, **kwargs)
