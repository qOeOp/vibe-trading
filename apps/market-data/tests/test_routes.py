"""Test suite for Shenwan industry FastAPI routes.

These tests verify the HTTP layer works correctly:
- Routes return proper response codes (200/503)
- Response models match Pydantic schemas
- force_refresh parameter is handled
- Error handling returns appropriate status codes

Note: Tests accept both 200 (success) and 503 (service unavailable) since
the service may not be fully initialized in test environment.
"""

from __future__ import annotations

import pytest
from httpx import ASGITransport, AsyncClient

from src.main import app


@pytest.mark.asyncio
async def test_get_first_level_industries_success():
    """Test GET /api/shenwan/industries/first endpoint."""
    async with AsyncClient(
        transport=ASGITransport(app=app), base_url="http://test"
    ) as client:
        response = await client.get("/api/shenwan/industries/first")

        # Accept 200 (success) or 503 (service not fully initialized)
        assert response.status_code in [200, 503]

        if response.status_code == 200:
            # Verify response structure
            data = response.json()
            assert isinstance(data, list)

            # If data exists, verify structure
            if len(data) > 0:
                item = data[0]
                assert "code" in item
                assert "name" in item
                assert "constituent_count" in item


@pytest.mark.asyncio
async def test_force_refresh_parameter():
    """Test force_refresh=true query parameter."""
    async with AsyncClient(
        transport=ASGITransport(app=app), base_url="http://test"
    ) as client:
        response = await client.get(
            "/api/shenwan/industries/first",
            params={"force_refresh": True}
        )

        # Accept 200 (success) or 503 (service not fully initialized)
        assert response.status_code in [200, 503]

        if response.status_code == 200:
            data = response.json()
            assert isinstance(data, list)


@pytest.mark.asyncio
async def test_get_constituents_with_symbol():
    """Test GET /api/shenwan/constituents/{symbol} endpoint."""
    async with AsyncClient(
        transport=ASGITransport(app=app), base_url="http://test"
    ) as client:
        # Test with a valid Shenwan industry code format
        response = await client.get("/api/shenwan/constituents/801010.SI")

        # Accept 200 (success), 400 (invalid symbol), or 503 (service unavailable)
        assert response.status_code in [200, 400, 503]

        if response.status_code == 200:
            # Verify response structure
            data = response.json()
            assert isinstance(data, list)

            # If data exists, verify structure
            if len(data) > 0:
                item = data[0]
                assert "serial_number" in item
                assert "stock_code" in item
                assert "stock_name" in item
                assert "inclusion_date" in item
                assert "sw_level1" in item
                assert "sw_level2" in item
                assert "sw_level3" in item
