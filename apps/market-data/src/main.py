"""Market Data FastAPI service with Consul registration."""

from __future__ import annotations

import logging
from contextlib import asynccontextmanager
from typing import AsyncGenerator

from fastapi import FastAPI

from .cache.redis_cache import RedisCache
from .config import settings
from .routes import init_router, shenwan_router
from .services.data_source_manager import DataSourceManager
from .services.providers.akshare_provider import AKShareProvider

# Graceful import degradation for optional dependencies
try:
    import consul.aio
    CONSUL_AVAILABLE = True
except ImportError:
    CONSUL_AVAILABLE = False
    consul = None

try:
    import redis.asyncio as redis
    REDIS_AVAILABLE = True
except ImportError:
    REDIS_AVAILABLE = False
    redis = None

logger = logging.getLogger(__name__)

# Global instances (initialized in lifespan)
data_manager: DataSourceManager | None = None
cache: RedisCache | None = None
consul_client: consul.aio.Consul | None = None


async def get_redis_client() -> redis.Redis | None:
    """Create async Redis client with graceful degradation."""
    if not REDIS_AVAILABLE:
        logger.warning("redis.asyncio not available, Redis features disabled")
        return None

    try:
        client = redis.from_url(
            settings.redis_url,
            encoding="utf-8",
            decode_responses=False,  # We handle decoding manually
        )
        # Test connection
        await client.ping()
        logger.info(f"Redis connection established: {settings.redis_url}")
        return client
    except Exception as e:
        logger.warning(f"Redis connection failed, using graceful degradation: {e}")
        return None


async def register_with_consul() -> None:
    """Register service with Consul."""
    global consul_client

    if not CONSUL_AVAILABLE:
        logger.warning("python-consul not available, Consul registration disabled")
        return

    try:
        consul_client = consul.aio.Consul(
            host=settings.consul_host,
            port=settings.consul_port,
        )

        service_id = f"market-data-{settings.service_host}"
        service_port = 8002  # Hardcoded for now, should match uvicorn port

        # Register service with health check
        await consul_client.agent.service.register(
            name=settings.service_name,
            service_id=service_id,
            address=settings.service_host,
            port=service_port,
            check={
                "http": f"http://{settings.service_host}:{service_port}/health",
                "interval": "10s",
                "timeout": "3s",
            },
        )

        logger.info(
            f"Registered with Consul: {service_id} at {settings.service_host}:{service_port}"
        )

    except Exception as e:
        logger.warning(f"Consul registration failed: {e}")
        consul_client = None


async def deregister_from_consul() -> None:
    """Deregister service from Consul."""
    global consul_client

    if consul_client is None:
        return

    try:
        service_id = f"market-data-{settings.service_host}"
        await consul_client.agent.service.deregister(service_id)
        logger.info(f"Deregistered from Consul: {service_id}")
    except Exception as e:
        logger.warning(f"Consul deregistration failed: {e}")


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncGenerator[None, None]:
    """Modern lifespan context manager for startup/shutdown."""
    global data_manager, cache

    # Startup
    logger.info("Market Data service starting up...")

    try:
        # Initialize Redis client
        redis_client = await get_redis_client()

        # Initialize cache
        cache = RedisCache(redis_client)

        # Initialize data manager with AKShare provider
        akshare_provider = AKShareProvider()
        data_manager = DataSourceManager(providers=[akshare_provider])

        # Initialize routes with dependencies
        init_router(data_manager, cache)

        # Register with Consul
        await register_with_consul()

        logger.info("Market Data service startup complete")

    except Exception as e:
        logger.error(f"Startup error: {e}", exc_info=True)
        # Don't prevent startup, routes will return 503

    yield

    # Shutdown
    logger.info("Market Data service shutting down...")

    try:
        # Deregister from Consul
        await deregister_from_consul()

        # Close Redis connection
        if redis_client is not None:
            await redis_client.aclose()
            logger.info("Redis connection closed")

    except Exception as e:
        logger.error(f"Shutdown error: {e}", exc_info=True)


# FastAPI app with lifespan
app = FastAPI(
    title="Market Data",
    description="Vibe Trading - Market data processing and distribution",
    version="0.1.0",
    lifespan=lifespan,
)

# Include routers
app.include_router(shenwan_router)


@app.get("/health")
async def health_check() -> dict[str, str]:
    """Health check endpoint."""
    return {
        "status": "healthy",
        "service": settings.service_name,
        "version": "0.1.0",
    }


@app.get("/")
async def root() -> dict[str, str]:
    """Root endpoint."""
    return {
        "service": "Market Data",
        "description": "Market data processing and distribution",
    }
