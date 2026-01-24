"""AKShare data provider implementation"""

from __future__ import annotations

import asyncio
import logging
from concurrent.futures import ThreadPoolExecutor
from typing import Any, List, Type

import akshare as ak
import pandas as pd

from ...models.shenwan import (
    ConstituentStock,
    FirstLevelIndustry,
    SecondLevelIndustry,
    ThirdLevelIndustry,
)
from .base_provider import DataProvider

logger = logging.getLogger(__name__)


class AKShareProvider(DataProvider):
    """
    AKShare data provider for Shenwan industry classifications.

    Uses ThreadPoolExecutor to run synchronous AKShare calls in async context.
    """

    def __init__(self, max_workers: int = 4):
        """
        Initialize AKShare provider.

        Args:
            max_workers: Maximum number of threads for executor
        """
        self.executor = ThreadPoolExecutor(max_workers=max_workers)

    async def get_first_level_industries(self) -> List[FirstLevelIndustry]:
        """
        Fetch first-level industry classifications from AKShare.

        Returns:
            List of FirstLevelIndustry models
        """
        try:
            logger.info("Fetching first-level industries from AKShare")

            # Run sync AKShare call in executor
            loop = asyncio.get_event_loop()
            df = await loop.run_in_executor(self.executor, ak.sw_index_first_info)

            if df.empty:
                logger.warning("AKShare returned empty DataFrame for first-level industries")
                return []

            # Transform DataFrame to Pydantic models
            result = self._transform_industry_data(df, FirstLevelIndustry, has_parent=False)
            logger.info(f"Successfully fetched {len(result)} first-level industries")
            return result

        except Exception as e:
            logger.error(f"Error fetching first-level industries: {e}", exc_info=True)
            return []

    async def get_second_level_industries(self) -> List[SecondLevelIndustry]:
        """
        Fetch second-level industry classifications from AKShare.

        Returns:
            List of SecondLevelIndustry models
        """
        try:
            logger.info("Fetching second-level industries from AKShare")

            # Run sync AKShare call in executor
            loop = asyncio.get_event_loop()
            df = await loop.run_in_executor(self.executor, ak.sw_index_second_info)

            if df.empty:
                logger.warning("AKShare returned empty DataFrame for second-level industries")
                return []

            # Transform DataFrame to Pydantic models
            result = self._transform_industry_data(df, SecondLevelIndustry, has_parent=True)
            logger.info(f"Successfully fetched {len(result)} second-level industries")
            return result

        except Exception as e:
            logger.error(f"Error fetching second-level industries: {e}", exc_info=True)
            return []

    async def get_third_level_industries(self) -> List[ThirdLevelIndustry]:
        """
        Fetch third-level industry classifications from AKShare.

        Returns:
            List of ThirdLevelIndustry models
        """
        try:
            logger.info("Fetching third-level industries from AKShare")

            # Run sync AKShare call in executor
            loop = asyncio.get_event_loop()
            df = await loop.run_in_executor(self.executor, ak.sw_index_third_info)

            if df.empty:
                logger.warning("AKShare returned empty DataFrame for third-level industries")
                return []

            # Transform DataFrame to Pydantic models
            result = self._transform_industry_data(df, ThirdLevelIndustry, has_parent=False)
            logger.info(f"Successfully fetched {len(result)} third-level industries")
            return result

        except Exception as e:
            logger.error(f"Error fetching third-level industries: {e}", exc_info=True)
            return []

    async def get_constituents(self, symbol: str) -> List[ConstituentStock]:
        """
        Fetch constituent stocks for an industry from AKShare.

        Args:
            symbol: Industry symbol (e.g., "801010.SI")

        Returns:
            List of ConstituentStock models
        """
        if not symbol:
            logger.warning("Empty symbol provided for constituents fetch")
            return []

        try:
            logger.info(f"Fetching constituents for industry {symbol} from AKShare")

            # Run sync AKShare call in executor
            loop = asyncio.get_event_loop()
            df = await loop.run_in_executor(self.executor, ak.sw_index_third_cons, symbol)

            if df.empty:
                logger.warning(f"AKShare returned empty DataFrame for constituents of {symbol}")
                return []

            # Transform DataFrame to Pydantic models
            result = self._transform_constituent_data(df)
            logger.info(f"Successfully fetched {len(result)} constituents for {symbol}")
            return result

        except Exception as e:
            logger.error(f"Error fetching constituents for {symbol}: {e}", exc_info=True)
            return []

    def _transform_industry_data(
        self,
        df: pd.DataFrame,
        model_class: Type[FirstLevelIndustry | SecondLevelIndustry | ThirdLevelIndustry],
        has_parent: bool = False,
    ) -> List[FirstLevelIndustry | SecondLevelIndustry | ThirdLevelIndustry]:
        """
        Transform industry DataFrame to Pydantic models.

        Args:
            df: DataFrame from AKShare
            model_class: Pydantic model class to instantiate
            has_parent: Whether this industry level has parent_industry field

        Returns:
            List of industry models
        """
        result = []

        for _, row in df.iterrows():
            try:
                # Base fields for all industry levels
                data = {
                    "code": row["行业代码"],
                    "name": row["行业名称"],
                    "constituent_count": int(row["成份个数"]),
                    "static_pe_ratio": self._safe_float(row.get("静态市盈率")),
                    "ttm_pe_ratio": self._safe_float(row.get("TTM(滚动)市盈率")),
                    "pb_ratio": self._safe_float(row.get("市净率")),
                    "dividend_yield": self._safe_float(row.get("静态股息率")),
                }

                # Add parent_industry field for second-level
                if has_parent:
                    data["parent_industry"] = row["上级行业"]

                result.append(model_class(**data))

            except Exception as e:
                logger.warning(f"Failed to parse industry row: {e}, row data: {row.to_dict()}")
                continue

        return result

    def _transform_constituent_data(self, df: pd.DataFrame) -> List[ConstituentStock]:
        """
        Transform constituent DataFrame to Pydantic models.

        Args:
            df: DataFrame from AKShare

        Returns:
            List of ConstituentStock models
        """
        result = []

        for _, row in df.iterrows():
            try:
                data = {
                    "serial_number": int(row["序号"]),
                    "stock_code": row["股票代码"],
                    "stock_name": row["股票简称"],
                    "inclusion_date": row["纳入时间"],
                    "sw_level1": row["申万1级"],
                    "sw_level2": row["申万2级"],
                    "sw_level3": row["申万3级"],
                    "price": self._safe_float(row.get("价格")),
                    "pe_ratio": self._safe_float(row.get("市盈率")),
                    "ttm_pe_ratio": self._safe_float(row.get("市盈率TTM")),
                    "pb_ratio": self._safe_float(row.get("市净率")),
                    "dividend_yield": self._safe_float(row.get("股息率(%)")),
                    "market_cap": self._safe_float(row.get("市值(亿元)")),
                    "net_profit_yoy_q3": self._safe_float(row.get("归母净利润同比增长(09-30)(%)")),
                    "net_profit_yoy_q2": self._safe_float(row.get("归母净利润同比增长(06-30)(%)")),
                    "revenue_yoy_q3": self._safe_float(row.get("营业收入同比增长(09-30)(%)")),
                    "revenue_yoy_q2": self._safe_float(row.get("营业收入同比增长(06-30)(%)")),
                }

                result.append(ConstituentStock(**data))

            except Exception as e:
                logger.warning(f"Failed to parse constituent row: {e}, row data: {row.to_dict()}")
                continue

        return result

    def _safe_float(self, value: Any) -> float | None:
        """
        Safely convert value to float, handling pd.NA and None.

        Args:
            value: Value to convert

        Returns:
            Float value or None if conversion fails or value is NA/None
        """
        if value is None or pd.isna(value):
            return None

        try:
            return float(value)
        except (ValueError, TypeError):
            return None

    def __del__(self):
        """Cleanup executor on deletion"""
        if hasattr(self, "executor"):
            self.executor.shutdown(wait=False)
