"""Redis cache layer with graceful degradation and dual-key strategy"""

from __future__ import annotations

import json
import logging
from datetime import timedelta
from typing import Callable, List, Optional, Type, TypeVar

import redis
from pydantic import BaseModel

logger = logging.getLogger(__name__)

T = TypeVar("T", bound=BaseModel)


class RedisCache:
    """
    Redis cache with graceful degradation and dual-key strategy.

    Features:
    - Dual-key strategy: primary (with TTL) + backup (no expiration)
    - Graceful degradation: Works perfectly even if Redis is down
    - Serves stale data if data source fails
    - All Redis operations wrapped in try/except

    Key naming:
    - Primary: {cache_key}:data (with TTL)
    - Backup: {cache_key}:backup (no expiration, for stale serving)
    """

    def __init__(self, redis_client: Optional[redis.Redis]):
        """
        Initialize Redis cache.

        Args:
            redis_client: Redis client or None for graceful degradation
        """
        self.redis_client = redis_client

    async def get_or_fetch(
        self,
        cache_key: str,
        fetch_fn: Callable[[], List[T]],
        model_class: Type[T],
        ttl: timedelta = timedelta(hours=12),
        force_refresh: bool = False,
    ) -> List[T]:
        """
        Get data from cache or fetch from source with dual-key strategy.

        Strategy:
        1. Try primary cache (with TTL)
        2. If miss, fetch from source
        3. Write to both primary (with TTL) and backup (no expiration)
        4. If fetch fails, try backup key (stale data)
        5. If all fails, raise exception

        Args:
            cache_key: Base cache key (without suffix)
            fetch_fn: Async function to fetch data if cache misses
            model_class: Pydantic model class for deserialization
            ttl: Time-to-live for primary cache (default: 12 hours)
            force_refresh: Bypass cache and force fetch

        Returns:
            List of Pydantic model instances

        Raises:
            Exception: If both fetch and backup cache fail
        """
        # If Redis unavailable, fetch directly (graceful degradation)
        if self.redis_client is None:
            logger.warning("Redis unavailable, fetching directly from source")
            return await fetch_fn()

        primary_key = f"{cache_key}:data"
        backup_key = f"{cache_key}:backup"

        # Try primary cache (unless force refresh)
        if not force_refresh:
            cached_data = await self._safe_cache_read(primary_key)
            if cached_data:
                logger.info(f"Cache hit: {primary_key}")
                return self._deserialize(cached_data, model_class)

        # Cache miss or force refresh - fetch from source
        try:
            logger.info(f"Cache miss: {primary_key}, fetching from source")
            data = await fetch_fn()

            # Write to both primary and backup
            serialized = self._serialize(data)
            await self._safe_cache_write(primary_key, serialized, ttl)
            await self._safe_backup_write(backup_key, serialized)

            return data

        except Exception as fetch_error:
            # Fetch failed - try backup cache (stale data)
            logger.warning(f"Fetch failed: {fetch_error}, attempting backup cache: {backup_key}")
            backup_data = await self._safe_backup_read(backup_key)
            if backup_data:
                logger.info(f"Serving stale data from backup: {backup_key}")
                return self._deserialize(backup_data, model_class)

            # Both fetch and backup failed - raise exception
            logger.error(f"Both fetch and backup failed for key: {cache_key}")
            raise

    async def _safe_cache_read(self, key: str) -> Optional[str]:
        """
        Safely read from primary cache.

        Args:
            key: Cache key to read

        Returns:
            Cached value or None if miss/error
        """
        if self.redis_client is None:
            return None

        try:
            value = await self.redis_client.get(key)
            if value:
                return value.decode("utf-8")
            return None
        except Exception as e:
            logger.warning(f"Redis read error for key {key}: {e}")
            return None

    async def _safe_cache_write(self, key: str, value: str, ttl: timedelta) -> None:
        """
        Safely write to primary cache with TTL.

        Args:
            key: Cache key
            value: Serialized value
            ttl: Time-to-live
        """
        if self.redis_client is None:
            return

        try:
            ttl_seconds = int(ttl.total_seconds())
            await self.redis_client.setex(key, ttl_seconds, value)
            logger.debug(f"Cached with TTL {ttl_seconds}s: {key}")
        except Exception as e:
            logger.warning(f"Redis write error for key {key}: {e}")

    async def _safe_backup_write(self, key: str, value: str) -> None:
        """
        Safely write to backup cache (no expiration).

        Args:
            key: Backup cache key
            value: Serialized value
        """
        if self.redis_client is None:
            return

        try:
            await self.redis_client.set(key, value)
            logger.debug(f"Backup cached: {key}")
        except Exception as e:
            logger.warning(f"Redis backup write error for key {key}: {e}")

    async def _safe_backup_read(self, key: str) -> Optional[str]:
        """
        Safely read from backup cache.

        Args:
            key: Backup cache key

        Returns:
            Cached value or None if miss/error
        """
        if self.redis_client is None:
            return None

        try:
            value = await self.redis_client.get(key)
            if value:
                return value.decode("utf-8")
            return None
        except Exception as e:
            logger.warning(f"Redis backup read error for key {key}: {e}")
            return None

    def _serialize(self, data: List[T]) -> str:
        """
        Serialize list of Pydantic models to JSON string.

        Args:
            data: List of Pydantic model instances

        Returns:
            JSON string
        """
        # Use model_dump_json() for each item and combine into array
        json_items = [item.model_dump_json() for item in data]
        return "[" + ",".join(json_items) + "]"

    def _deserialize(self, json_str: str, model_class: Type[T]) -> List[T]:
        """
        Deserialize JSON string to list of Pydantic models.

        Args:
            json_str: JSON string
            model_class: Pydantic model class

        Returns:
            List of Pydantic model instances
        """
        json_data = json.loads(json_str)
        return [model_class.model_validate(item) for item in json_data]
