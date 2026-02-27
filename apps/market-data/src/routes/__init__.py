"""API routes package."""

from .shenwan import router as shenwan_router, init_router
from .ohlcv import router as ohlcv_router, init_ohlcv_router
from .qlib import router as qlib_router, init_qlib_router

__all__ = [
    "shenwan_router",
    "init_router",
    "ohlcv_router",
    "init_ohlcv_router",
    "qlib_router",
    "init_qlib_router",
]
