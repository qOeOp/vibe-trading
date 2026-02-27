"""Tests for Qlib binary dump utility"""
import numpy as np
import pandas as pd
import pytest
from pathlib import Path
from src.services.qlib_dump import QlibDumper


@pytest.fixture
def tmp_qlib_dir(tmp_path):
    return str(tmp_path / "qlib_data")


@pytest.fixture
def sample_ohlcv_df():
    dates = pd.date_range("2026-02-25", "2026-02-27", freq="B")
    return pd.DataFrame({
        "date": dates,
        "symbol": ["sh600000"] * len(dates),
        "open": [10.5, 10.8, 11.0],
        "close": [10.8, 11.0, 10.9],
        "high": [11.0, 11.2, 11.1],
        "low": [10.3, 10.7, 10.8],
        "volume": [1e6, 1.2e6, 0.9e6],
        "factor": [1.0, 1.0, 1.0],
    })


def test_write_calendar(tmp_qlib_dir):
    dates = ["2026-02-25", "2026-02-26", "2026-02-27"]
    dumper = QlibDumper(tmp_qlib_dir)
    dumper.write_calendar(dates)
    cal_path = Path(tmp_qlib_dir) / "calendars" / "day.txt"
    assert cal_path.exists()
    lines = cal_path.read_text().strip().split("\n")
    assert lines == dates


def test_write_instruments(tmp_qlib_dir):
    instruments = {
        "sh600000": ("2005-01-04", "2026-02-27"),
        "sz000001": ("2005-01-04", "2026-02-27"),
    }
    dumper = QlibDumper(tmp_qlib_dir)
    dumper.write_instruments("all", instruments)
    inst_path = Path(tmp_qlib_dir) / "instruments" / "all.txt"
    assert inst_path.exists()
    lines = inst_path.read_text().strip().split("\n")
    assert len(lines) == 2
    assert "sh600000\t2005-01-04\t2026-02-27" in lines


def test_write_feature_bin(tmp_qlib_dir):
    dumper = QlibDumper(tmp_qlib_dir)
    values = np.array([10.5, 10.8, 11.0], dtype=np.float32)
    start_index = 100
    dumper.write_feature_bin("sh600000", "close", start_index, values)
    bin_path = Path(tmp_qlib_dir) / "features" / "sh600000" / "close.day.bin"
    assert bin_path.exists()
    data = np.fromfile(str(bin_path), dtype="<f4")
    assert data[0] == 100.0
    assert len(data) == 4
    np.testing.assert_array_almost_equal(data[1:], values, decimal=5)


def test_dump_dataframe(tmp_qlib_dir, sample_ohlcv_df):
    dumper = QlibDumper(tmp_qlib_dir)
    calendar = ["2026-02-25", "2026-02-26", "2026-02-27"]
    fields = ["open", "close", "high", "low", "volume", "factor"]
    result = dumper.dump_dataframe(sample_ohlcv_df, calendar, fields)
    assert result.success is True
    assert result.symbols_processed == 1
    assert result.trading_days == 3
    base = Path(tmp_qlib_dir)
    assert (base / "calendars" / "day.txt").exists()
    assert (base / "features" / "sh600000" / "close.day.bin").exists()
    assert (base / "features" / "sh600000" / "volume.day.bin").exists()


def test_dump_dataframe_multi_symbol(tmp_qlib_dir):
    dates = pd.date_range("2026-02-25", "2026-02-27", freq="B")
    df = pd.DataFrame({
        "date": list(dates) * 2,
        "symbol": ["sh600000"] * 3 + ["sz000001"] * 3,
        "open": [10.5, 10.8, 11.0, 20.1, 20.3, 20.5],
        "close": [10.8, 11.0, 10.9, 20.3, 20.5, 20.2],
        "high": [11.0, 11.2, 11.1, 20.5, 20.7, 20.6],
        "low": [10.3, 10.7, 10.8, 20.0, 20.1, 20.0],
        "volume": [1e6, 1.2e6, 0.9e6, 2e6, 2.1e6, 1.8e6],
        "factor": [1.0] * 6,
    })
    dumper = QlibDumper(tmp_qlib_dir)
    calendar = ["2026-02-25", "2026-02-26", "2026-02-27"]
    result = dumper.dump_dataframe(df, calendar, ["open", "close", "high", "low", "volume", "factor"])
    assert result.success is True
    assert result.symbols_processed == 2
    base = Path(tmp_qlib_dir)
    assert (base / "features" / "sh600000" / "close.day.bin").exists()
    assert (base / "features" / "sz000001" / "close.day.bin").exists()
