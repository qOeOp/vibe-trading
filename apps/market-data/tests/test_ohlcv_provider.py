"""Tests for AKShare OHLCV provider methods"""
from __future__ import annotations

from datetime import date
from unittest.mock import patch

import pandas as pd
import pytest

from src.models.ohlcv import DailyBar, StockInfo
from src.services.providers.akshare_provider import AKShareProvider


@pytest.mark.asyncio
async def test_get_daily_bars_success():
    mock_df = pd.DataFrame({
        "日期": ["2026-02-26", "2026-02-27"],
        "开盘": [10.5, 10.8], "收盘": [10.8, 11.0],
        "最高": [11.0, 11.2], "最低": [10.3, 10.7],
        "成交量": [1_000_000, 1_200_000],
        "成交额": [10_800_000.0, 13_200_000.0],
        "振幅": [6.7, 4.6], "涨跌幅": [2.86, 1.85],
        "涨跌额": [0.3, 0.2], "换手率": [1.5, 1.8],
    })
    provider = AKShareProvider()
    with patch("akshare.stock_zh_a_hist", return_value=mock_df):
        result = await provider.get_daily_bars(
            symbol="600000", start_date=date(2026, 2, 26), end_date=date(2026, 2, 27),
        )
    assert len(result) == 2
    assert isinstance(result[0], DailyBar)
    assert result[0].symbol == "600000"
    assert result[0].open == 10.5
    assert result[0].close == 10.8
    assert result[0].volume == 1_000_000


@pytest.mark.asyncio
async def test_get_daily_bars_empty():
    provider = AKShareProvider()
    with patch("akshare.stock_zh_a_hist", return_value=pd.DataFrame()):
        result = await provider.get_daily_bars(
            symbol="600000", start_date=date(2026, 2, 26), end_date=date(2026, 2, 27),
        )
    assert result == []


@pytest.mark.asyncio
async def test_get_daily_bars_error():
    provider = AKShareProvider()
    with patch("akshare.stock_zh_a_hist", side_effect=Exception("Network error")):
        result = await provider.get_daily_bars(
            symbol="600000", start_date=date(2026, 2, 26), end_date=date(2026, 2, 27),
        )
    assert result == []


@pytest.mark.asyncio
async def test_get_stock_list_success():
    mock_df = pd.DataFrame({
        "代码": ["600000", "000001", "300001"],
        "名称": ["浦发银行", "平安银行", "特锐德"],
    })
    provider = AKShareProvider()
    with patch("akshare.stock_zh_a_spot_em", return_value=mock_df):
        result = await provider.get_stock_list()
    assert len(result) == 3
    assert isinstance(result[0], StockInfo)
    assert result[0].code == "600000"
    assert result[0].name == "浦发银行"


@pytest.mark.asyncio
async def test_get_stock_list_error():
    provider = AKShareProvider()
    with patch("akshare.stock_zh_a_spot_em", side_effect=Exception("API error")):
        result = await provider.get_stock_list()
    assert result == []
