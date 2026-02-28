"""Tests for DataSourceManager"""

from __future__ import annotations

from datetime import date
from typing import List
from unittest.mock import AsyncMock

import pytest

from src.models.shenwan import (
    ConstituentStock,
    FirstLevelIndustry,
    SecondLevelIndustry,
    ThirdLevelIndustry,
)
from src.services.data_source_manager import (
    DataSourceManager,
    DataSourceUnavailableError,
)
from src.models.ohlcv import DailyBar, StockInfo
from src.services.providers.base_provider import DataProvider


class MockProvider(DataProvider):
    """Mock provider for testing"""

    def __init__(self, should_fail: bool = False):
        self.should_fail = should_fail

    async def get_first_level_industries(self) -> List[FirstLevelIndustry]:
        if self.should_fail:
            raise Exception("Provider failed")
        return []

    async def get_second_level_industries(self) -> List[SecondLevelIndustry]:
        if self.should_fail:
            raise Exception("Provider failed")
        return []

    async def get_third_level_industries(self) -> List[ThirdLevelIndustry]:
        if self.should_fail:
            raise Exception("Provider failed")
        return []

    async def get_constituents(self, symbol: str) -> List[ConstituentStock]:
        if self.should_fail:
            raise Exception("Provider failed")
        return []

    async def get_daily_bars(
        self, symbol: str, start_date: date, end_date: date
    ) -> List[DailyBar]:
        if self.should_fail:
            raise Exception("Provider failed")
        return []

    async def get_stock_list(self) -> List[StockInfo]:
        if self.should_fail:
            raise Exception("Provider failed")
        return []


@pytest.mark.asyncio
async def test_first_provider_success():
    """Test that manager returns data from first provider on success"""
    # Arrange
    mock_data = [
        FirstLevelIndustry(
            code="801010",
            name="农林牧渔",
            constituent_count=100,
            static_pe_ratio=15.5,
            ttm_pe_ratio=16.2,
            pb_ratio=1.8,
            dividend_yield=2.5,
        )
    ]

    provider1 = MockProvider(should_fail=False)
    provider2 = MockProvider(should_fail=False)

    # Mock the first provider to return our test data
    provider1.get_first_level_industries = AsyncMock(return_value=mock_data)
    provider2.get_first_level_industries = AsyncMock(return_value=[])

    manager = DataSourceManager(providers=[provider1, provider2])

    # Act
    result = await manager.get_first_level_industries()

    # Assert
    assert result == mock_data
    provider1.get_first_level_industries.assert_called_once()
    provider2.get_first_level_industries.assert_not_called()


@pytest.mark.asyncio
async def test_fallback_to_second_provider():
    """Test that manager falls back to second provider when first fails"""
    # Arrange
    mock_data = [
        SecondLevelIndustry(
            code="801011",
            name="种植业",
            parent_industry="农林牧渔",
            constituent_count=50,
            static_pe_ratio=14.0,
            ttm_pe_ratio=15.0,
            pb_ratio=1.6,
            dividend_yield=2.2,
        )
    ]

    provider1 = MockProvider(should_fail=False)
    provider2 = MockProvider(should_fail=False)

    # Mock first provider to fail, second to succeed
    provider1.get_second_level_industries = AsyncMock(
        side_effect=Exception("Provider failed")
    )
    provider2.get_second_level_industries = AsyncMock(return_value=mock_data)

    manager = DataSourceManager(providers=[provider1, provider2])

    # Act
    result = await manager.get_second_level_industries()

    # Assert
    assert result == mock_data
    provider1.get_second_level_industries.assert_called_once()
    provider2.get_second_level_industries.assert_called_once()


@pytest.mark.asyncio
async def test_all_providers_fail():
    """Test that manager raises DataSourceUnavailableError when all providers fail"""
    # Arrange
    provider1 = MockProvider(should_fail=False)
    provider2 = MockProvider(should_fail=False)

    # Mock both providers to fail
    provider1.get_third_level_industries = AsyncMock(
        side_effect=Exception("Provider 1 failed")
    )
    provider2.get_third_level_industries = AsyncMock(
        side_effect=Exception("Provider 2 failed")
    )

    manager = DataSourceManager(providers=[provider1, provider2])

    # Act & Assert
    with pytest.raises(
        DataSourceUnavailableError, match="All data providers failed"
    ):
        await manager.get_third_level_industries()


@pytest.mark.asyncio
async def test_manager_requires_providers():
    """Test that manager validates non-empty provider list"""
    # Act & Assert
    with pytest.raises(ValueError, match="At least one provider must be configured"):
        DataSourceManager(providers=[])


@pytest.mark.asyncio
async def test_get_daily_bars_with_fallback():
    """Test daily bars fetch with provider fallback"""
    bar = DailyBar(
        symbol="600000",
        date=date(2026, 2, 27),
        open=10.5,
        close=10.8,
        high=11.0,
        low=10.3,
        volume=1_000_000.0,
    )
    provider1 = AsyncMock(spec=DataProvider)
    provider1.get_daily_bars = AsyncMock(side_effect=Exception("Provider 1 down"))
    provider1.__class__.__name__ = "Provider1"

    provider2 = AsyncMock(spec=DataProvider)
    provider2.get_daily_bars = AsyncMock(return_value=[bar])
    provider2.__class__.__name__ = "Provider2"

    manager = DataSourceManager(providers=[provider1, provider2])
    result = await manager.get_daily_bars("600000", date(2026, 2, 27), date(2026, 2, 27))
    assert len(result) == 1
    assert result[0].symbol == "600000"


@pytest.mark.asyncio
async def test_get_stock_list_with_fallback():
    """Test stock list fetch with provider fallback"""
    stock = StockInfo(code="600000", name="浦发银行")
    provider = AsyncMock(spec=DataProvider)
    provider.get_stock_list = AsyncMock(return_value=[stock])
    provider.__class__.__name__ = "MockProvider"

    manager = DataSourceManager(providers=[provider])
    result = await manager.get_stock_list()
    assert len(result) == 1
    assert result[0].code == "600000"
