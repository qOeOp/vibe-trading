"""Qlib binary data dump utility.

Converts pandas DataFrames to Qlib's binary format:
- calendars/day.txt — trading calendar
- instruments/{name}.txt — stock list with date ranges
- features/{symbol}/{field}.day.bin — float32 binary arrays

Binary format per .bin file:
    [float32 start_index] [float32 value_0] [float32 value_1] ...

Where start_index is the position of the stock's first trading day in the calendar.
"""

from __future__ import annotations

import logging
from pathlib import Path
from typing import Dict, List, Tuple

import numpy as np
import pandas as pd

from ..models.ohlcv import QlibDumpResult

logger = logging.getLogger(__name__)


class QlibDumper:
    """Writes DataFrames to Qlib binary format."""

    def __init__(self, output_dir: str):
        self.output_dir = Path(output_dir)

    def write_calendar(self, dates: List[str]) -> None:
        """Write trading calendar file."""
        cal_dir = self.output_dir / "calendars"
        cal_dir.mkdir(parents=True, exist_ok=True)
        (cal_dir / "day.txt").write_text("\n".join(dates) + "\n")

    def write_instruments(self, name: str, instruments: Dict[str, Tuple[str, str]]) -> None:
        """Write instruments file. instruments = {symbol: (start_date, end_date)}"""
        inst_dir = self.output_dir / "instruments"
        inst_dir.mkdir(parents=True, exist_ok=True)
        lines = [f"{symbol}\t{start}\t{end}" for symbol, (start, end) in sorted(instruments.items())]
        (inst_dir / f"{name}.txt").write_text("\n".join(lines) + "\n")

    def write_feature_bin(self, symbol: str, field: str, start_index: int, values: np.ndarray) -> None:
        """Write a single feature binary file."""
        feat_dir = self.output_dir / "features" / symbol
        feat_dir.mkdir(parents=True, exist_ok=True)
        bin_path = feat_dir / f"{field}.day.bin"
        header = np.array([start_index], dtype="<f4")
        data = values.astype("<f4")
        np.concatenate([header, data]).tofile(str(bin_path))

    def dump_dataframe(self, df: pd.DataFrame, calendar: List[str], fields: List[str]) -> QlibDumpResult:
        """Dump a full OHLCV DataFrame to Qlib binary format.

        Expected DataFrame columns: date, symbol, + field columns (open, close, etc.)
        """
        try:
            cal_index = {d: i for i, d in enumerate(calendar)}
            self.write_calendar(calendar)

            symbols_processed = 0
            instruments: Dict[str, Tuple[str, str]] = {}

            for symbol, group in df.groupby("symbol"):
                group = group.sort_values("date")
                dates = [d.strftime("%Y-%m-%d") if hasattr(d, "strftime") else str(d) for d in group["date"]]

                first_date = dates[0]
                if first_date not in cal_index:
                    logger.warning(f"First date {first_date} for {symbol} not in calendar, skipping")
                    continue

                start_idx = cal_index[first_date]
                last_date = dates[-1]
                last_idx = cal_index.get(last_date, start_idx + len(dates) - 1)
                array_len = last_idx - start_idx + 1

                date_to_row = {d: i for i, d in enumerate(dates)}

                for field in fields:
                    if field not in group.columns:
                        continue
                    values = np.full(array_len, np.nan, dtype=np.float32)
                    for d, row_idx in date_to_row.items():
                        if d in cal_index:
                            pos = cal_index[d] - start_idx
                            values[pos] = float(group.iloc[row_idx][field])
                    self.write_feature_bin(str(symbol), field, start_idx, values)

                instruments[str(symbol)] = (first_date, last_date)
                symbols_processed += 1

            self.write_instruments("all", instruments)

            return QlibDumpResult(
                success=True,
                symbols_processed=symbols_processed,
                trading_days=len(calendar),
                output_dir=str(self.output_dir),
            )
        except Exception as e:
            logger.error(f"Qlib dump failed: {e}", exc_info=True)
            return QlibDumpResult(success=False, error=str(e))
