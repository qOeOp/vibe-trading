"""OHLCV market data models for daily bars and Qlib data packaging."""

import datetime

from pydantic import BaseModel, Field


class DailyBar(BaseModel):
    """Single daily OHLCV bar for a stock."""

    symbol: str = Field(..., description="股票代码 (e.g., '600000')")
    date: datetime.date = Field(..., description="交易日期")
    open: float = Field(..., description="开盘价")
    close: float = Field(..., description="收盘价")
    high: float = Field(..., description="最高价")
    low: float = Field(..., description="最低价")
    volume: float = Field(..., description="成交量")
    amount: float | None = Field(None, description="成交额")
    change_pct: float | None = Field(None, description="涨跌幅(%)")
    turnover: float | None = Field(None, description="换手率(%)")
    adjust_factor: float | None = Field(None, description="后复权因子")


class StockInfo(BaseModel):
    """Basic stock identification info."""

    code: str = Field(..., description="股票代码")
    name: str = Field(..., description="股票名称")


class QlibDumpRequest(BaseModel):
    """Request parameters for Qlib data dump."""

    symbols: list[str] | None = Field(None, description="股票代码列表 (None=全A股)")
    start_date: str = Field("2005-01-01", description="起始日期 YYYY-MM-DD")
    end_date: str | None = Field(None, description="截止日期 (None=今天)")
    output_dir: str = Field("/data/qlib/cn_data", description="Qlib 输出目录")
    include_fields: list[str] = Field(
        default=["open", "close", "high", "low", "volume", "factor"],
        description="要包含的字段",
    )


class QlibDumpStatus(BaseModel):
    """Status of Qlib data package."""

    last_date: str | None = Field(None, description="最新数据日期")
    total_symbols: int = Field(0, description="股票总数")
    total_trading_days: int = Field(0, description="交易日总数")
    data_size_mb: float = Field(0.0, description="数据包大小(MB)")
    fields: list[str] = Field(default_factory=list, description="包含的字段")


class QlibDumpResult(BaseModel):
    """Result of a Qlib dump operation."""

    success: bool
    symbols_processed: int = 0
    trading_days: int = 0
    output_dir: str = ""
    error: str | None = None
