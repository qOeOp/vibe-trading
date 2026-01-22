"""Abstract base class for data providers"""

from abc import ABC, abstractmethod
from typing import List

from ...models.shenwan import (
    FirstLevelIndustry,
    SecondLevelIndustry,
    ThirdLevelIndustry,
    ConstituentStock,
)


class DataProvider(ABC):
    """
    Abstract base class for data providers.

    This enables the data hub architecture with multiple data sources.
    Each provider implements fetching from a specific source (AKShare, Tushare, etc.)
    """

    @abstractmethod
    async def get_first_level_industries(self) -> List[FirstLevelIndustry]:
        """Fetch first-level industry classifications"""
        pass

    @abstractmethod
    async def get_second_level_industries(self) -> List[SecondLevelIndustry]:
        """Fetch second-level industry classifications"""
        pass

    @abstractmethod
    async def get_third_level_industries(self) -> List[ThirdLevelIndustry]:
        """Fetch third-level industry classifications"""
        pass

    @abstractmethod
    async def get_constituents(self, symbol: str) -> List[ConstituentStock]:
        """Fetch constituent stocks for an industry"""
        pass
