"""Tests for data providers"""

from __future__ import annotations

from unittest.mock import patch

import pandas as pd
import pytest

from src.models.shenwan import FirstLevelIndustry
from src.services.providers.akshare_provider import AKShareProvider


@pytest.mark.asyncio
async def test_akshare_first_level_success():
    """Test successful fetch of first-level industries"""
    # Mock DataFrame that AKShare would return
    mock_df = pd.DataFrame(
        {
            "指数代码": ["801010.SI", "801020.SI"],
            "指数名称": ["农林牧渔", "采掘"],
            "成份个数": [50, 30],
            "静态市盈率": [25.5, 18.3],
            "TTM(滚动)市盈率": [26.1, 19.0],
            "市净率": [2.5, 1.8],
            "静态股息率": [1.5, 2.0],
        }
    )

    provider = AKShareProvider()

    with patch("akshare.sw_index_first_info", return_value=mock_df):
        result = await provider.get_first_level_industries()

    assert len(result) == 2
    assert isinstance(result[0], FirstLevelIndustry)
    assert result[0].code == "801010.SI"
    assert result[0].name == "农林牧渔"
    assert result[0].constituent_count == 50
    assert result[0].static_pe_ratio == 25.5


@pytest.mark.asyncio
async def test_akshare_empty_result():
    """Test handling of empty DataFrame"""
    mock_df = pd.DataFrame()  # Empty DataFrame

    provider = AKShareProvider()

    with patch("akshare.sw_index_second_info", return_value=mock_df):
        result = await provider.get_second_level_industries()

    assert result == []


@pytest.mark.asyncio
async def test_akshare_connection_error():
    """Test error handling when AKShare fails"""
    provider = AKShareProvider()

    with patch("akshare.sw_index_third_info", side_effect=Exception("Network error")):
        result = await provider.get_third_level_industries()

    # Should return empty list on error, not raise
    assert result == []


@pytest.mark.asyncio
async def test_safe_float_helper():
    """Test _safe_float helper method"""
    provider = AKShareProvider()

    # Test normal float
    assert provider._safe_float(3.14) == 3.14

    # Test integer
    assert provider._safe_float(42) == 42.0

    # Test string number
    assert provider._safe_float("3.14") == 3.14

    # Test None
    assert provider._safe_float(None) is None

    # Test pandas NA
    assert provider._safe_float(pd.NA) is None

    # Test invalid string
    assert provider._safe_float("invalid") is None
