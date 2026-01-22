"""Cache layer with Redis support and graceful degradation"""

from .redis_cache import RedisCache

__all__ = ["RedisCache"]
