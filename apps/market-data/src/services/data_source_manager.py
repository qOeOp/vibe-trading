"""Data source manager with fallback logic for multiple providers.

This module implements the provider chain pattern for the data hub architecture.
It enables multi-source data fetching with automatic fallback when a provider fails.

Design Context:
    The market-data service acts as a data hub that can aggregate data from multiple
    financial data providers (AKShare, Tushare, Wind, etc.). This manager orchestrates
    provider calls with fallback logic to ensure high availability.

Current State:
    - Only AKShare provider is currently implemented
    - Infrastructure is ready for multi-provider support
    - Fallback mechanism is fully functional and tested

Future Extension Steps:
    To add a new data provider (e.g., Tushare):

    1. Create provider implementation:
       - Create apps/market-data/src/services/providers/tushare_provider.py
       - Implement DataProvider abstract base class
       - Implement all four required methods:
         * get_first_level_industries()
         * get_second_level_industries()
         * get_third_level_industries()
         * get_constituents(symbol)

    2. Write provider tests:
       - Add test cases in apps/market-data/tests/test_providers.py
       - Mock external API calls
       - Test error handling

    3. Update manager initialization:
       - Instantiate new provider in API routes or config
       - Add to providers list when creating DataSourceManager
       - Providers are tried in order, first success wins

    4. No changes needed to DataSourceManager itself!
       - The fallback logic is provider-agnostic
       - Simply add providers to the list at initialization

Fallback Strategy:
    - Providers are tried in the order they appear in the list
    - First successful response is returned immediately
    - If a provider fails, a warning is logged and the next provider is tried
    - If all providers fail, DataSourceUnavailableError is raised
    - Each operation (get industries, get constituents) has independent fallback

Example Usage:
    ```python
    # Single provider (current)
    akshare = AKShareProvider()
    manager = DataSourceManager(providers=[akshare])

    # Multi-provider (future)
    akshare = AKShareProvider()
    tushare = TushareProvider()
    manager = DataSourceManager(providers=[akshare, tushare])  # AKShare tried first

    # Fetch with automatic fallback
    industries = await manager.get_first_level_industries()
    ```
"""

from __future__ import annotations

import logging
from typing import Callable, List

from ..models.shenwan import (
    ConstituentStock,
    FirstLevelIndustry,
    SecondLevelIndustry,
    ThirdLevelIndustry,
)
from .providers.base_provider import DataProvider

logger = logging.getLogger(__name__)


class DataSourceUnavailableError(Exception):
    """Raised when all configured data providers fail to fetch data."""

    pass


class DataSourceManager:
    """
    Manager that orchestrates multiple data providers with automatic fallback.

    This class implements the provider chain pattern, trying providers in order
    until one succeeds. This ensures high availability even when individual
    providers experience downtime or errors.

    Attributes:
        providers: List of DataProvider instances to try in order
    """

    def __init__(self, providers: List[DataProvider]):
        """
        Initialize data source manager with provider list.

        Args:
            providers: List of DataProvider instances to use (tried in order)

        Raises:
            ValueError: If providers list is empty
        """
        if not providers:
            raise ValueError("At least one provider must be configured")

        self.providers = providers
        logger.info(f"DataSourceManager initialized with {len(providers)} provider(s)")

    async def get_first_level_industries(self) -> List[FirstLevelIndustry]:
        """
        Fetch first-level industry classifications with fallback.

        Returns:
            List of FirstLevelIndustry models from first successful provider

        Raises:
            DataSourceUnavailableError: If all providers fail
        """
        return await self._fetch_with_fallback(
            operation="get_first_level_industries",
            fetch_func=lambda provider: provider.get_first_level_industries(),
        )

    async def get_second_level_industries(self) -> List[SecondLevelIndustry]:
        """
        Fetch second-level industry classifications with fallback.

        Returns:
            List of SecondLevelIndustry models from first successful provider

        Raises:
            DataSourceUnavailableError: If all providers fail
        """
        return await self._fetch_with_fallback(
            operation="get_second_level_industries",
            fetch_func=lambda provider: provider.get_second_level_industries(),
        )

    async def get_third_level_industries(self) -> List[ThirdLevelIndustry]:
        """
        Fetch third-level industry classifications with fallback.

        Returns:
            List of ThirdLevelIndustry models from first successful provider

        Raises:
            DataSourceUnavailableError: If all providers fail
        """
        return await self._fetch_with_fallback(
            operation="get_third_level_industries",
            fetch_func=lambda provider: provider.get_third_level_industries(),
        )

    async def get_constituents(self, symbol: str) -> List[ConstituentStock]:
        """
        Fetch constituent stocks for an industry with fallback.

        Args:
            symbol: Industry symbol (e.g., "801010.SI")

        Returns:
            List of ConstituentStock models from first successful provider

        Raises:
            DataSourceUnavailableError: If all providers fail
        """
        return await self._fetch_with_fallback(
            operation=f"get_constituents({symbol})",
            fetch_func=lambda provider: provider.get_constituents(symbol),
        )

    async def _fetch_with_fallback(
        self,
        operation: str,
        fetch_func: Callable[[DataProvider], List],
    ) -> List:
        """
        Execute fetch operation with provider fallback logic.

        This method implements the core fallback strategy:
        1. Try each provider in order
        2. Return immediately on first success
        3. Log warning and try next on failure
        4. Raise error if all fail

        Args:
            operation: Human-readable operation name for logging
            fetch_func: Lambda that calls the provider method

        Returns:
            Result from first successful provider

        Raises:
            DataSourceUnavailableError: If all providers fail
        """
        last_error = None

        for i, provider in enumerate(self.providers, 1):
            provider_name = provider.__class__.__name__
            try:
                logger.info(
                    f"Attempting {operation} from provider {i}/{len(self.providers)}: {provider_name}"
                )

                result = await fetch_func(provider)

                logger.info(
                    f"Successfully fetched {operation} from {provider_name} "
                    f"(returned {len(result)} items)"
                )
                return result

            except Exception as e:
                last_error = e
                logger.warning(
                    f"Provider {provider_name} failed for {operation}: {e}",
                    exc_info=True,
                )

                # Continue to next provider
                continue

        # All providers failed
        error_message = (
            f"All data providers failed for operation: {operation}. "
            f"Last error: {last_error}"
        )
        logger.error(error_message)
        raise DataSourceUnavailableError(error_message)
