"""Tests for OHLCV data models"""

from datetime import date

from src.models.ohlcv import DailyBar, StockInfo, QlibDumpStatus


def test_daily_bar_creation():
    bar = DailyBar(
        symbol="600000",
        date=date(2026, 2, 27),
        open=10.5,
        close=10.8,
        high=11.0,
        low=10.3,
        volume=1_000_000.0,
        amount=10_800_000.0,
        change_pct=2.86,
        turnover=1.5,
        adjust_factor=1.0,
    )
    assert bar.symbol == "600000"
    assert bar.close == 10.8
    assert bar.volume == 1_000_000.0


def test_daily_bar_optional_fields():
    bar = DailyBar(
        symbol="600000",
        date=date(2026, 2, 27),
        open=10.5,
        close=10.8,
        high=11.0,
        low=10.3,
        volume=1_000_000.0,
    )
    assert bar.amount is None
    assert bar.change_pct is None
    assert bar.turnover is None
    assert bar.adjust_factor is None


def test_stock_info_creation():
    info = StockInfo(code="600000", name="浦发银行")
    assert info.code == "600000"
    assert info.name == "浦发银行"


def test_qlib_dump_status():
    status = QlibDumpStatus(
        last_date="2026-02-27",
        total_symbols=5000,
        total_trading_days=4800,
        data_size_mb=2400.5,
        fields=["open", "close", "high", "low", "volume", "factor"],
    )
    assert status.total_symbols == 5000
    assert "close" in status.fields
