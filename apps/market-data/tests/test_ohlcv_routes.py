"""Tests for OHLCV and Qlib API routes."""

from datetime import date
from unittest.mock import AsyncMock, MagicMock

import pytest
from fastapi import FastAPI
from fastapi.testclient import TestClient

from src.models.ohlcv import DailyBar, StockInfo


@pytest.fixture
def mock_data_manager():
    manager = MagicMock()
    manager.get_daily_bars = AsyncMock(
        return_value=[
            DailyBar(
                symbol="600000",
                date=date(2026, 2, 27),
                open=10.5,
                close=10.8,
                high=11.0,
                low=10.3,
                volume=1e6,
            ),
        ]
    )
    manager.get_stock_list = AsyncMock(
        return_value=[
            StockInfo(code="600000", name="浦发银行"),
        ]
    )
    return manager


@pytest.fixture
def mock_cache():
    cache = MagicMock()
    cache.get_or_fetch = AsyncMock(side_effect=lambda **kwargs: kwargs["fetch_fn"]())
    return cache


def test_get_daily_bars(mock_data_manager, mock_cache):
    from src.routes.ohlcv import init_ohlcv_router, router

    app = FastAPI()
    app.include_router(router)
    init_ohlcv_router(mock_data_manager, mock_cache)
    client = TestClient(app)
    resp = client.get(
        "/api/ohlcv/daily/600000?start_date=2026-02-27&end_date=2026-02-27"
    )
    assert resp.status_code == 200
    data = resp.json()
    assert len(data) == 1
    assert data[0]["symbol"] == "600000"


def test_get_daily_bars_invalid_date(mock_data_manager, mock_cache):
    from src.routes.ohlcv import init_ohlcv_router, router

    app = FastAPI()
    app.include_router(router)
    init_ohlcv_router(mock_data_manager, mock_cache)
    client = TestClient(app)
    resp = client.get(
        "/api/ohlcv/daily/600000?start_date=bad-date&end_date=2026-02-27"
    )
    assert resp.status_code == 400


def test_get_stock_list(mock_data_manager, mock_cache):
    from src.routes.ohlcv import init_ohlcv_router, router

    app = FastAPI()
    app.include_router(router)
    init_ohlcv_router(mock_data_manager, mock_cache)
    client = TestClient(app)
    resp = client.get("/api/ohlcv/stocks")
    assert resp.status_code == 200
    data = resp.json()
    assert len(data) == 1
    assert data[0]["code"] == "600000"


def test_service_not_initialized():
    """Routes should return 503 when data manager is not initialized."""
    from src.routes import ohlcv

    # Reset global state
    ohlcv._data_manager = None
    ohlcv._cache = None

    app = FastAPI()
    app.include_router(ohlcv.router)
    client = TestClient(app)

    resp = client.get(
        "/api/ohlcv/daily/600000?start_date=2026-02-27&end_date=2026-02-27"
    )
    assert resp.status_code == 503

    resp = client.get("/api/ohlcv/stocks")
    assert resp.status_code == 503
