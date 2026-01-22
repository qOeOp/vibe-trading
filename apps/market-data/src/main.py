"""Market Data FastAPI service."""

from fastapi import FastAPI
from .config import settings
from .routes import shenwan_router, init_router
from .cache.redis_cache import RedisCache
from .services.data_source_manager import DataSourceManager
from .services.providers.akshare_provider import AKShareProvider
import redis
import logging

logger = logging.getLogger(__name__)

app = FastAPI(
    title="Market Data",
    description="Vibe Trading - Market data processing and distribution",
    version="0.1.0",
)


@app.on_event("startup")
async def startup_event():
    """Initialize dependencies and include routers on startup."""
    try:
        # Initialize Redis client
        redis_client = None
        try:
            redis_client = redis.Redis(
                host=settings.redis_host,
                port=settings.redis_port,
                db=settings.redis_db,
                decode_responses=False,  # We handle decoding manually
            )
            # Test connection
            redis_client.ping()
            logger.info("Redis connection established")
        except Exception as e:
            logger.warning(f"Redis connection failed, using graceful degradation: {e}")
            redis_client = None

        # Initialize cache
        cache = RedisCache(redis_client)

        # Initialize data manager with AKShare provider
        akshare_provider = AKShareProvider()
        data_manager = DataSourceManager(providers=[akshare_provider])

        # Initialize Shenwan router with dependencies
        init_router(data_manager, cache)

        logger.info("Market Data service startup complete")

    except Exception as e:
        logger.error(f"Startup failed: {e}", exc_info=True)
        # Don't prevent startup, routes will return 503


# Include routers
app.include_router(shenwan_router)


@app.get("/health")
async def health_check():
    """Health check endpoint."""
    return {
        "status": "healthy",
        "service": settings.service_name,
        "version": "0.1.0",
    }


@app.get("/")
async def root():
    """Root endpoint."""
    return {
        "service": "Market Data",
        "description": "Market data processing and distribution",
    }
