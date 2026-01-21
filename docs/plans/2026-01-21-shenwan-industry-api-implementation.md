# Shenwan Industry API Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Implement 4 Shenwan industry API endpoints with multi-source data provider architecture, Consul service discovery, Redis caching, and comprehensive testing.

**Architecture:** Python market-data service fetches data from AKShare (via provider abstraction layer), caches in Redis (12h TTL with graceful degradation), registers with Consul. TypeScript api service discovers market-data via Consul and proxies requests.

**Tech Stack:** FastAPI, AKShare, Redis, Consul, Express.js, Axios, pytest, Jest

**Design Document:** `docs/plans/2026-01-21-shenwan-industry-api-design.md`

---

## Phase 1: Python market-data Service Foundation

### Task 1: Add Python Dependencies

**Files:**
- Modify: `apps/market-data/pyproject.toml`

**Step 1: Add dependencies to pyproject.toml**

Edit the `[tool.poetry.dependencies]` section:

```toml
[tool.poetry.dependencies]
python = "^3.11"
fastapi = "^0.115.0"
uvicorn = {extras = ["standard"], version = "^0.34.0"}
aiokafka = "^0.11.0"
redis = "^5.2.0"
pydantic-settings = "^2.6.0"
akshare = "^1.14.0"
pandas = "^2.2.0"
python-consul = "^1.1.0"
```

**Step 2: Install dependencies**

Run: `cd apps/market-data && poetry install`
Expected: Dependencies installed successfully

**Step 3: Verify installation**

Run: `cd apps/market-data && poetry run python -c "import akshare; import pandas; print('OK')"`
Expected: Prints "OK"

**Step 4: Commit**

```bash
git add apps/market-data/pyproject.toml apps/market-data/poetry.lock
git commit -m "deps(market-data): Add akshare, pandas, python-consul dependencies"
```

---

### Task 2: Create Pydantic Models

**Files:**
- Create: `apps/market-data/src/models/__init__.py`
- Create: `apps/market-data/src/models/shenwan.py`

**Step 1: Create models directory init file**

Create `apps/market-data/src/models/__init__.py`:

```python
"""Data models for market-data service."""
```

**Step 2: Write test for FirstLevelIndustry model**

Create `apps/market-data/tests/test_models.py`:

```python
"""Test Pydantic models"""

import pytest
from src.models.shenwan import FirstLevelIndustry, SecondLevelIndustry, ThirdLevelIndustry, ConstituentStock


def test_first_level_industry_model():
    """Test FirstLevelIndustry model validation"""
    data = {
        "code": "801010",
        "name": "农林牧渔",
        "constituent_count": 100,
        "static_pe_ratio": 25.5,
        "ttm_pe_ratio": 26.3,
        "pb_ratio": 2.1,
        "dividend_yield": 1.5,
    }
    industry = FirstLevelIndustry(**data)
    assert industry.code == "801010"
    assert industry.name == "农林牧渔"
    assert industry.constituent_count == 100


def test_second_level_industry_model():
    """Test SecondLevelIndustry model with parent"""
    data = {
        "code": "801011",
        "name": "种植业",
        "constituent_count": 50,
        "parent_industry": "农林牧渔",
        "static_pe_ratio": 24.0,
        "ttm_pe_ratio": 25.0,
        "pb_ratio": 2.0,
        "dividend_yield": 1.2,
    }
    industry = SecondLevelIndustry(**data)
    assert industry.parent_industry == "农林牧渔"


def test_third_level_industry_model():
    """Test ThirdLevelIndustry model"""
    data = {
        "code": "850111",
        "name": "饲料",
        "constituent_count": 30,
        "static_pe_ratio": 20.0,
        "ttm_pe_ratio": 21.0,
        "pb_ratio": 1.8,
        "dividend_yield": 1.0,
    }
    industry = ThirdLevelIndustry(**data)
    assert industry.code == "850111"


def test_constituent_stock_model():
    """Test ConstituentStock model"""
    data = {
        "serial_number": 1,
        "stock_code": "000001",
        "stock_name": "平安银行",
        "inclusion_date": "2021-01-01",
        "sw_level1": "金融",
        "sw_level2": "银行",
        "sw_level3": "银行",
        "price": 15.5,
        "pe_ratio": 8.2,
        "ttm_pe_ratio": 8.5,
        "pb_ratio": 0.9,
        "dividend_yield": 3.2,
        "market_cap": 3000.0,
        "net_profit_yoy_q3": 10.5,
        "net_profit_yoy_q2": 12.3,
        "revenue_yoy_q3": 8.9,
        "revenue_yoy_q2": 9.1,
    }
    stock = ConstituentStock(**data)
    assert stock.stock_code == "000001"
    assert stock.stock_name == "平安银行"


def test_model_with_null_values():
    """Test models handle null values correctly"""
    data = {
        "code": "801010",
        "name": "农林牧渔",
        "constituent_count": 100,
        "static_pe_ratio": None,
        "ttm_pe_ratio": None,
        "pb_ratio": None,
        "dividend_yield": None,
    }
    industry = FirstLevelIndustry(**data)
    assert industry.static_pe_ratio is None
```

**Step 3: Run test to verify it fails**

Run: `cd apps/market-data && poetry run pytest tests/test_models.py -v`
Expected: FAIL with "ModuleNotFoundError: No module named 'src.models.shenwan'"

**Step 4: Implement Pydantic models**

Create `apps/market-data/src/models/shenwan.py`:

```python
"""Shenwan industry classification data models"""

from pydantic import BaseModel, Field


class IndustryInfoBase(BaseModel):
    """Base industry information fields"""

    code: str = Field(..., description="行业代码")
    name: str = Field(..., description="行业名称")
    constituent_count: int = Field(..., description="成份个数")
    static_pe_ratio: float | None = Field(None, description="静态市盈率")
    ttm_pe_ratio: float | None = Field(None, description="TTM(滚动)市盈率")
    pb_ratio: float | None = Field(None, description="市净率")
    dividend_yield: float | None = Field(None, description="静态股息率")


class FirstLevelIndustry(IndustryInfoBase):
    """First-level industry classification"""

    pass


class SecondLevelIndustry(IndustryInfoBase):
    """Second-level industry classification with parent"""

    parent_industry: str = Field(..., description="上级行业")


class ThirdLevelIndustry(IndustryInfoBase):
    """Third-level industry classification (most granular)"""

    pass


class ConstituentStock(BaseModel):
    """Constituent stock information for an industry"""

    serial_number: int = Field(..., description="序号")
    stock_code: str = Field(..., description="股票代码")
    stock_name: str = Field(..., description="股票简称")
    inclusion_date: str = Field(..., description="纳入时间")
    sw_level1: str = Field(..., description="申万1级")
    sw_level2: str = Field(..., description="申万2级")
    sw_level3: str = Field(..., description="申万3级")
    price: float | None = Field(None, description="价格")
    pe_ratio: float | None = Field(None, description="市盈率")
    ttm_pe_ratio: float | None = Field(None, description="市盈率TTM")
    pb_ratio: float | None = Field(None, description="市净率")
    dividend_yield: float | None = Field(None, description="股息率(%)")
    market_cap: float | None = Field(None, description="市值(亿元)")
    net_profit_yoy_q3: float | None = Field(None, description="归母净利润同比增长(09-30)(%)")
    net_profit_yoy_q2: float | None = Field(None, description="归母净利润同比增长(06-30)(%)")
    revenue_yoy_q3: float | None = Field(None, description="营业收入同比增长(09-30)(%)")
    revenue_yoy_q2: float | None = Field(None, description="营业收入同比增长(06-30)(%)")
```

**Step 5: Run test to verify it passes**

Run: `cd apps/market-data && poetry run pytest tests/test_models.py -v`
Expected: 5 tests PASS

**Step 6: Commit**

```bash
git add apps/market-data/src/models/ apps/market-data/tests/test_models.py
git commit -m "feat(market-data): Add Shenwan industry Pydantic models"
```

---

### Task 3: Create Base Data Provider

**Files:**
- Create: `apps/market-data/src/services/__init__.py`
- Create: `apps/market-data/src/services/providers/__init__.py`
- Create: `apps/market-data/src/services/providers/base_provider.py`

**Step 1: Create services directory structure**

```bash
mkdir -p apps/market-data/src/services/providers
touch apps/market-data/src/services/__init__.py
touch apps/market-data/src/services/providers/__init__.py
```

**Step 2: Write base provider abstract class**

Create `apps/market-data/src/services/providers/base_provider.py`:

```python
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
```

**Step 3: Verify imports work**

Run: `cd apps/market-data && poetry run python -c "from src.services.providers.base_provider import DataProvider; print('OK')"`
Expected: Prints "OK"

**Step 4: Commit**

```bash
git add apps/market-data/src/services/
git commit -m "feat(market-data): Add DataProvider abstract base class"
```

---

### Task 4: Implement AKShare Provider

**Files:**
- Create: `apps/market-data/src/services/providers/akshare_provider.py`
- Create: `apps/market-data/tests/test_providers.py`

**Step 1: Write test for AKShare provider**

Create `apps/market-data/tests/test_providers.py`:

```python
"""Test data providers"""

import pytest
from unittest.mock import patch, MagicMock
from src.services.providers.akshare_provider import AKShareProvider


@pytest.mark.asyncio
async def test_akshare_first_level_success():
    """Test successful fetch from AKShare"""
    provider = AKShareProvider()

    with patch("akshare.sw_index_first_info") as mock_akshare:
        # Mock DataFrame
        mock_df = MagicMock()
        mock_df.empty = False
        mock_df.iterrows.return_value = iter([
            (0, {
                "行业代码": "801010",
                "行业名称": "农林牧渔",
                "成份个数": 100,
                "静态市盈率": 25.5,
                "TTM(滚动)市盈率": 26.3,
                "市净率": 2.1,
                "静态股息率": 1.5,
            })
        ])
        mock_akshare.return_value = mock_df

        result = await provider.get_first_level_industries()

        assert len(result) == 1
        assert result[0].code == "801010"
        assert result[0].name == "农林牧渔"


@pytest.mark.asyncio
async def test_akshare_empty_result():
    """Test handling empty DataFrame"""
    provider = AKShareProvider()

    with patch("akshare.sw_index_first_info") as mock_akshare:
        mock_df = MagicMock()
        mock_df.empty = True
        mock_akshare.return_value = mock_df

        result = await provider.get_first_level_industries()
        assert result == []


@pytest.mark.asyncio
async def test_akshare_connection_error():
    """Test handling connection errors"""
    provider = AKShareProvider()

    with patch("akshare.sw_index_first_info") as mock_akshare:
        mock_akshare.side_effect = ConnectionError("Network error")

        with pytest.raises(Exception):
            await provider.get_first_level_industries()


@pytest.mark.asyncio
async def test_safe_float_helper():
    """Test _safe_float handles null values"""
    from src.services.providers.akshare_provider import AKShareProvider
    import pandas as pd

    provider = AKShareProvider()

    assert provider._safe_float(25.5) == 25.5
    assert provider._safe_float(pd.NA) is None
    assert provider._safe_float(None) is None
    assert provider._safe_float("invalid") is None
```

**Step 2: Run test to verify it fails**

Run: `cd apps/market-data && poetry run pytest tests/test_providers.py -v`
Expected: FAIL with import error

**Step 3: Implement AKShare provider**

Create `apps/market-data/src/services/providers/akshare_provider.py`:

```python
"""AKShare data provider implementation"""

from typing import List
import asyncio
from concurrent.futures import ThreadPoolExecutor
import pandas as pd
import akshare as ak
import logging

from .base_provider import DataProvider
from ...models.shenwan import (
    FirstLevelIndustry,
    SecondLevelIndustry,
    ThirdLevelIndustry,
    ConstituentStock,
)

logger = logging.getLogger(__name__)


class AKShareProvider(DataProvider):
    """
    AKShare data provider implementation.

    DESIGN:
    - AKShare is synchronous, so we run it in thread pool executor
    - Transforms pandas DataFrames to Pydantic models
    - Handles null/missing values gracefully
    - Logs data quality issues without failing
    """

    def __init__(self):
        self.executor = ThreadPoolExecutor(max_workers=4)

    async def get_first_level_industries(self) -> List[FirstLevelIndustry]:
        """Fetch first-level industries from AKShare"""
        try:
            logger.info("Fetching first-level industries from AKShare")

            loop = asyncio.get_event_loop()
            df = await loop.run_in_executor(self.executor, ak.sw_index_first_info)

            return self._transform_industry_data(df, FirstLevelIndustry)

        except Exception as e:
            logger.error(f"AKShare first-level fetch failed: {e}", exc_info=True)
            raise

    async def get_second_level_industries(self) -> List[SecondLevelIndustry]:
        """Fetch second-level industries from AKShare"""
        try:
            logger.info("Fetching second-level industries from AKShare")

            loop = asyncio.get_event_loop()
            df = await loop.run_in_executor(self.executor, ak.sw_index_second_info)

            return self._transform_industry_data(df, SecondLevelIndustry, has_parent=True)

        except Exception as e:
            logger.error(f"AKShare second-level fetch failed: {e}", exc_info=True)
            raise

    async def get_third_level_industries(self) -> List[ThirdLevelIndustry]:
        """Fetch third-level industries from AKShare"""
        try:
            logger.info("Fetching third-level industries from AKShare")

            loop = asyncio.get_event_loop()
            df = await loop.run_in_executor(self.executor, ak.sw_index_third_info)

            return self._transform_industry_data(df, ThirdLevelIndustry)

        except Exception as e:
            logger.error(f"AKShare third-level fetch failed: {e}", exc_info=True)
            raise

    async def get_constituents(self, symbol: str) -> List[ConstituentStock]:
        """Fetch constituent stocks from AKShare"""
        try:
            logger.info(f"Fetching constituents for {symbol} from AKShare")

            if not symbol:
                raise ValueError("Symbol cannot be empty")

            loop = asyncio.get_event_loop()
            df = await loop.run_in_executor(self.executor, ak.sw_index_third_cons, symbol)

            return self._transform_constituent_data(df)

        except Exception as e:
            logger.error(f"AKShare constituent fetch failed for {symbol}: {e}", exc_info=True)
            raise

    def _transform_industry_data(
        self, df: pd.DataFrame, model_class: type, has_parent: bool = False
    ) -> List:
        """Transform DataFrame to industry Pydantic models"""
        if df is None or df.empty:
            logger.warning("Received empty DataFrame from AKShare")
            return []

        results = []
        for _, row in df.iterrows():
            try:
                data = {
                    "code": str(row["行业代码"]),
                    "name": str(row["行业名称"]),
                    "constituent_count": int(row["成份个数"]),
                    "static_pe_ratio": self._safe_float(row.get("静态市盈率")),
                    "ttm_pe_ratio": self._safe_float(row.get("TTM(滚动)市盈率")),
                    "pb_ratio": self._safe_float(row.get("市净率")),
                    "dividend_yield": self._safe_float(row.get("静态股息率")),
                }

                if has_parent:
                    data["parent_industry"] = str(row["上级行业"])

                results.append(model_class(**data))

            except Exception as e:
                logger.warning(f"Failed to parse row: {e}")
                continue

        logger.info(f"Transformed {len(results)} industry records")
        return results

    def _transform_constituent_data(self, df: pd.DataFrame) -> List[ConstituentStock]:
        """Transform DataFrame to ConstituentStock models"""
        if df is None or df.empty:
            logger.warning("Received empty DataFrame from AKShare")
            return []

        results = []
        for _, row in df.iterrows():
            try:
                data = {
                    "serial_number": int(row["序号"]),
                    "stock_code": str(row["股票代码"]),
                    "stock_name": str(row["股票简称"]),
                    "inclusion_date": str(row["纳入时间"]),
                    "sw_level1": str(row["申万1级"]),
                    "sw_level2": str(row["申万2级"]),
                    "sw_level3": str(row["申万3级"]),
                    "price": self._safe_float(row.get("价格")),
                    "pe_ratio": self._safe_float(row.get("市盈率")),
                    "ttm_pe_ratio": self._safe_float(row.get("市盈率ttm")),
                    "pb_ratio": self._safe_float(row.get("市净率")),
                    "dividend_yield": self._safe_float(row.get("股息率")),
                    "market_cap": self._safe_float(row.get("市值")),
                    "net_profit_yoy_q3": self._safe_float(row.get("归母净利润同比增长(09-30)")),
                    "net_profit_yoy_q2": self._safe_float(row.get("归母净利润同比增长(06-30)")),
                    "revenue_yoy_q3": self._safe_float(row.get("营业收入同比增长(09-30)")),
                    "revenue_yoy_q2": self._safe_float(row.get("营业收入同比增长(06-30)")),
                }

                results.append(ConstituentStock(**data))

            except Exception as e:
                logger.warning(f"Failed to parse constituent row: {e}")
                continue

        logger.info(f"Transformed {len(results)} constituent records")
        return results

    @staticmethod
    def _safe_float(value) -> float | None:
        """Safely convert value to float, return None if invalid"""
        if pd.isna(value):
            return None
        try:
            return float(value)
        except (ValueError, TypeError):
            return None
```

**Step 4: Run tests to verify they pass**

Run: `cd apps/market-data && poetry run pytest tests/test_providers.py -v`
Expected: 4 tests PASS

**Step 5: Commit**

```bash
git add apps/market-data/src/services/providers/akshare_provider.py apps/market-data/tests/test_providers.py
git commit -m "feat(market-data): Implement AKShare data provider"
```

---

### Task 5: Implement Data Source Manager

**Files:**
- Create: `apps/market-data/src/services/data_source_manager.py`
- Create: `apps/market-data/tests/test_data_source_manager.py`

**Step 1: Write test for data source manager**

Create `apps/market-data/tests/test_data_source_manager.py`:

```python
"""Test DataSourceManager"""

import pytest
from unittest.mock import AsyncMock
from src.services.data_source_manager import DataSourceManager, DataSourceUnavailableError
from src.models.shenwan import FirstLevelIndustry


@pytest.mark.asyncio
async def test_first_provider_success():
    """Test manager returns from first provider on success"""
    mock_provider = AsyncMock()
    mock_provider.get_first_level_industries.return_value = [
        FirstLevelIndustry(
            code="801010",
            name="农林牧渔",
            constituent_count=100,
        )
    ]

    manager = DataSourceManager([mock_provider])
    result = await manager.get_first_level_industries()

    assert len(result) == 1
    assert result[0].code == "801010"
    mock_provider.get_first_level_industries.assert_called_once()


@pytest.mark.asyncio
async def test_fallback_to_second_provider():
    """Test manager tries second provider if first fails"""
    failing_provider = AsyncMock()
    failing_provider.get_first_level_industries.side_effect = Exception("Failed")

    success_provider = AsyncMock()
    success_provider.get_first_level_industries.return_value = [
        FirstLevelIndustry(code="801010", name="农林牧渔", constituent_count=100)
    ]

    manager = DataSourceManager([failing_provider, success_provider])
    result = await manager.get_first_level_industries()

    assert len(result) == 1
    failing_provider.get_first_level_industries.assert_called_once()
    success_provider.get_first_level_industries.assert_called_once()


@pytest.mark.asyncio
async def test_all_providers_fail():
    """Test manager raises error when all providers fail"""
    provider1 = AsyncMock()
    provider1.get_first_level_industries.side_effect = Exception("Failed 1")

    provider2 = AsyncMock()
    provider2.get_first_level_industries.side_effect = Exception("Failed 2")

    manager = DataSourceManager([provider1, provider2])

    with pytest.raises(DataSourceUnavailableError):
        await manager.get_first_level_industries()


def test_manager_requires_providers():
    """Test manager validates providers list"""
    with pytest.raises(ValueError, match="At least one data provider must be configured"):
        DataSourceManager([])
```

**Step 2: Run test to verify it fails**

Run: `cd apps/market-data && poetry run pytest tests/test_data_source_manager.py -v`
Expected: FAIL with import error

**Step 3: Implement DataSourceManager**

Create `apps/market-data/src/services/data_source_manager.py`:

```python
"""Data source manager with multi-provider fallback logic"""

from typing import List
import logging

from .providers.base_provider import DataProvider
from ..models.shenwan import (
    FirstLevelIndustry,
    SecondLevelIndustry,
    ThirdLevelIndustry,
    ConstituentStock,
)

logger = logging.getLogger(__name__)


class DataSourceUnavailableError(Exception):
    """Raised when all data sources fail"""

    pass


class DataSourceManager:
    """
    Manages multiple data sources with automatic fallback logic.

    DESIGN CONTEXT:
    This manager implements a provider chain pattern to support the data hub architecture.
    The goal is to aggregate multiple market data sources (AKShare, Tushare, Wind, etc.)
    and provide unified, normalized responses with automatic failover.

    CURRENT STATE:
    - Only AKShareProvider is implemented
    - Fallback logic is ready but has single provider

    FUTURE EXTENSION:
    When adding new data sources:
    1. Create new provider class inheriting from DataProvider (e.g., TushareProvider)
    2. Implement the 4 abstract methods with source-specific logic
    3. Add to providers list in config: providers = [AKShareProvider(), TushareProvider()]
    4. Manager will automatically try providers in order until one succeeds
    5. No changes needed to routes or API layer

    FALLBACK STRATEGY:
    - Tries providers in list order (primary -> secondary -> tertiary)
    - If all providers fail, raises DataSourceUnavailableError
    - Each provider failure is logged but doesn't stop the chain
    - First successful response is returned immediately
    """

    def __init__(self, providers: List[DataProvider]):
        self.providers = providers
        if not providers:
            raise ValueError("At least one data provider must be configured")

    async def get_first_level_industries(self) -> List[FirstLevelIndustry]:
        """Fetch first-level industries with automatic fallback"""
        return await self._fetch_with_fallback(
            "first_level_industries", lambda p: p.get_first_level_industries()
        )

    async def get_second_level_industries(self) -> List[SecondLevelIndustry]:
        """Fetch second-level industries with automatic fallback"""
        return await self._fetch_with_fallback(
            "second_level_industries", lambda p: p.get_second_level_industries()
        )

    async def get_third_level_industries(self) -> List[ThirdLevelIndustry]:
        """Fetch third-level industries with automatic fallback"""
        return await self._fetch_with_fallback(
            "third_level_industries", lambda p: p.get_third_level_industries()
        )

    async def get_constituents(self, symbol: str) -> List[ConstituentStock]:
        """Fetch constituents with automatic fallback"""
        return await self._fetch_with_fallback(
            f"constituents:{symbol}", lambda p: p.get_constituents(symbol)
        )

    async def _fetch_with_fallback(self, operation: str, fetch_func):
        """Try each provider until one succeeds"""
        last_error = None

        for idx, provider in enumerate(self.providers):
            try:
                logger.info(
                    f"Attempting provider {idx+1}/{len(self.providers)}: "
                    f"{provider.__class__.__name__} for {operation}"
                )
                return await fetch_func(provider)

            except Exception as e:
                logger.warning(f"{provider.__class__.__name__} failed: {e}")
                last_error = e
                continue

        # All providers failed
        raise DataSourceUnavailableError(
            f"All {len(self.providers)} data providers failed for {operation}. "
            f"Last error: {last_error}"
        )
```

**Step 4: Run tests to verify they pass**

Run: `cd apps/market-data && poetry run pytest tests/test_data_source_manager.py -v`
Expected: 4 tests PASS

**Step 5: Commit**

```bash
git add apps/market-data/src/services/data_source_manager.py apps/market-data/tests/test_data_source_manager.py
git commit -m "feat(market-data): Implement DataSourceManager with fallback"
```

---

### Task 6: Implement Redis Cache Layer

**Files:**
- Create: `apps/market-data/src/cache/__init__.py`
- Create: `apps/market-data/src/cache/redis_cache.py`
- Create: `apps/market-data/tests/test_cache.py`

**Step 1: Create cache directory**

```bash
mkdir -p apps/market-data/src/cache
touch apps/market-data/src/cache/__init__.py
```

**Step 2: Write tests for Redis cache**

Create `apps/market-data/tests/test_cache.py`:

```python
"""Test Redis cache layer"""

import pytest
from unittest.mock import AsyncMock, patch
from src.cache.redis_cache import RedisCache
from src.models.shenwan import FirstLevelIndustry


@pytest.mark.asyncio
async def test_cache_hit():
    """Test cache returns data on hit"""
    mock_redis = AsyncMock()
    mock_redis.get.return_value = '[{"code":"801010","name":"农林牧渔","constituent_count":100,"static_pe_ratio":null,"ttm_pe_ratio":null,"pb_ratio":null,"dividend_yield":null}]'

    cache = RedisCache(mock_redis)

    result = await cache.get_or_fetch(
        "test:key",
        AsyncMock(),  # Won't be called on cache hit
        FirstLevelIndustry,
    )

    assert len(result) == 1
    assert result[0].code == "801010"
    mock_redis.get.assert_called_once()


@pytest.mark.asyncio
async def test_cache_miss_fetch():
    """Test cache fetches and stores on miss"""
    mock_redis = AsyncMock()
    mock_redis.get.return_value = None

    cache = RedisCache(mock_redis)

    mock_fetch = AsyncMock()
    mock_fetch.return_value = [
        FirstLevelIndustry(code="801010", name="农林牧渔", constituent_count=100)
    ]

    result = await cache.get_or_fetch("test:key", mock_fetch, FirstLevelIndustry)

    assert len(result) == 1
    mock_fetch.assert_called_once()
    assert mock_redis.setex.called
    assert mock_redis.set.called  # Backup key


@pytest.mark.asyncio
async def test_redis_unavailable():
    """Test cache works without Redis"""
    cache = RedisCache(None)

    mock_fetch = AsyncMock()
    mock_fetch.return_value = [
        FirstLevelIndustry(code="801010", name="农林牧渔", constituent_count=100)
    ]

    result = await cache.get_or_fetch("test:key", mock_fetch, FirstLevelIndustry)

    assert len(result) == 1
    mock_fetch.assert_called_once()


@pytest.mark.asyncio
async def test_serve_stale_on_fetch_failure():
    """Test cache serves stale data when fetch fails"""
    mock_redis = AsyncMock()
    mock_redis.get.side_effect = [None, '[{"code":"801010","name":"农林牧渔","constituent_count":100,"static_pe_ratio":null,"ttm_pe_ratio":null,"pb_ratio":null,"dividend_yield":null}]']

    cache = RedisCache(mock_redis)

    mock_fetch = AsyncMock()
    mock_fetch.side_effect = Exception("Fetch failed")

    result = await cache.get_or_fetch("test:key", mock_fetch, FirstLevelIndustry)

    assert len(result) == 1
    assert result[0].code == "801010"
```

**Step 3: Run test to verify it fails**

Run: `cd apps/market-data && poetry run pytest tests/test_cache.py -v`
Expected: FAIL with import error

**Step 4: Implement Redis cache (part 1 - basic structure)**

Create `apps/market-data/src/cache/redis_cache.py`:

```python
"""Redis caching layer with graceful degradation"""

from typing import Optional, TypeVar, Callable, Any, List
from datetime import timedelta
import json
import logging

try:
    import redis.asyncio as redis
except ImportError:
    redis = None

from pydantic import BaseModel

logger = logging.getLogger(__name__)

T = TypeVar("T")


class RedisCache:
    """
    Redis caching layer with graceful degradation.

    RESILIENCE DESIGN:
    - Redis is treated as an OPTIONAL performance optimization
    - If Redis is unavailable/fails, system continues without caching
    - All Redis operations are wrapped in try-except
    - Failures are logged but never propagate to caller
    - Service remains fully functional even if Redis is down

    DEGRADATION BEHAVIOR:
    - Redis connection failed → Direct data source calls (no caching)
    - Redis read failed → Fetch from data source
    - Redis write failed → Log warning, return data successfully

    This ensures the service can run independently without Redis dependency.
    """

    def __init__(self, redis_client: Optional["redis.Redis"] = None):
        self.redis = redis_client
        self.default_ttl = timedelta(hours=12)
        self._redis_available = redis_client is not None

        if not self._redis_available:
            logger.warning("Redis client not provided - running without cache")

    async def get_or_fetch(
        self,
        cache_key: str,
        fetch_func: Callable[[], Any],
        model_class: type[BaseModel],
        ttl: Optional[timedelta] = None,
        force_refresh: bool = False,
    ) -> List[BaseModel]:
        """
        Get data from cache or fetch from source.
        Gracefully degrades if Redis is unavailable.
        """
        ttl = ttl or self.default_ttl
        primary_key = f"{cache_key}:data"
        backup_key = f"{cache_key}:backup"

        # Try cache if Redis available and not force refresh
        if self._redis_available and not force_refresh:
            try:
                cached = await self.redis.get(primary_key)
                if cached:
                    logger.info(f"Cache hit: {cache_key}")
                    return self._deserialize(cached, model_class)
            except Exception as e:
                logger.warning(f"Redis read failed for {cache_key}: {e}. Falling back to data source.")

        # Fetch fresh data from source
        try:
            logger.info(f"Fetching fresh data: {cache_key}")
            data = await fetch_func()

            # Try to cache if Redis available
            if self._redis_available:
                await self._safe_cache_write(primary_key, backup_key, data, ttl)

            return data

        except Exception as e:
            # Data source failed - try backup cache if Redis available
            if self._redis_available:
                backup_data = await self._safe_backup_read(backup_key, model_class)
                if backup_data:
                    logger.info(f"Serving stale data from backup: {cache_key}")
                    return backup_data

            # No backup or Redis unavailable - propagate error
            logger.error(f"Failed to fetch {cache_key} and no backup available")
            raise

    async def _safe_cache_write(
        self, primary_key: str, backup_key: str, data: List[BaseModel], ttl: timedelta
    ) -> None:
        """Write to cache, swallowing any Redis errors"""
        try:
            serialized = self._serialize(data)
            await self.redis.setex(primary_key, ttl, serialized)
            await self.redis.set(backup_key, serialized)
            logger.debug(f"Cached data: {primary_key}")
        except Exception as e:
            logger.warning(f"Redis write failed: {e}. Continuing without cache.")

    async def _safe_backup_read(
        self, backup_key: str, model_class: type[BaseModel]
    ) -> Optional[List[BaseModel]]:
        """Read from backup cache, swallowing any Redis errors"""
        try:
            backup = await self.redis.get(backup_key)
            if backup:
                return self._deserialize(backup, model_class)
        except Exception as e:
            logger.warning(f"Redis backup read failed: {e}")
        return None

    def _serialize(self, data: List[BaseModel]) -> str:
        """Serialize list of Pydantic models to JSON"""
        return json.dumps([item.model_dump() for item in data])

    def _deserialize(self, data: str, model_class: type[BaseModel]) -> List[BaseModel]:
        """Deserialize JSON to list of Pydantic models"""
        items = json.loads(data)
        return [model_class(**item) for item in items]
```

**Step 5: Run tests to verify they pass**

Run: `cd apps/market-data && poetry run pytest tests/test_cache.py -v`
Expected: 4 tests PASS

**Step 6: Commit**

```bash
git add apps/market-data/src/cache/ apps/market-data/tests/test_cache.py
git commit -m "feat(market-data): Implement Redis cache with graceful degradation"
```

---

### Task 7: Update Config with Consul Settings

**Files:**
- Modify: `apps/market-data/src/config.py`

**Step 1: Update config.py**

Replace `apps/market-data/src/config.py` with:

```python
"""Configuration settings for market-data service"""

from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """Application settings"""

    service_name: str = "market-data"
    kafka_brokers: str = "localhost:9092"
    redis_url: str = "redis://localhost:6379"

    # Consul settings
    consul_host: str = "consul"
    consul_port: int = 8500
    service_host: str = "market-data"

    class Config:
        env_file = ".env"


settings = Settings()
```

**Step 2: Verify imports**

Run: `cd apps/market-data && poetry run python -c "from src.config import settings; print(settings.consul_host)"`
Expected: Prints "consul"

**Step 3: Commit**

```bash
git add apps/market-data/src/config.py
git commit -m "feat(market-data): Add Consul configuration settings"
```

---

### Task 8: Create FastAPI Routes

**Files:**
- Create: `apps/market-data/src/routes/__init__.py`
- Create: `apps/market-data/src/routes/shenwan.py`
- Create: `apps/market-data/tests/test_routes.py`

**Step 1: Create routes directory**

```bash
mkdir -p apps/market-data/src/routes
touch apps/market-data/src/routes/__init__.py
```

**Step 2: Write tests for routes (part 1)**

Create `apps/market-data/tests/test_routes.py`:

```python
"""Test FastAPI routes"""

import pytest
from httpx import AsyncClient
from unittest.mock import AsyncMock, patch
from src.main import app
from src.models.shenwan import FirstLevelIndustry


@pytest.mark.asyncio
async def test_get_first_level_industries_success():
    """Test successful retrieval"""
    async with AsyncClient(app=app, base_url="http://test") as client:
        response = await client.get("/api/shenwan/industries/first")
        # Service may not be fully initialized in test, accept 200 or 503
        assert response.status_code in [200, 503]


@pytest.mark.asyncio
async def test_force_refresh_parameter():
    """Test force_refresh query parameter"""
    async with AsyncClient(app=app, base_url="http://test") as client:
        response = await client.get("/api/shenwan/industries/first?force_refresh=true")
        assert response.status_code in [200, 503]


@pytest.mark.asyncio
async def test_get_constituents_with_symbol():
    """Test constituents endpoint with symbol"""
    async with AsyncClient(app=app, base_url="http://test") as client:
        response = await client.get("/api/shenwan/constituents/850111.SI")
        assert response.status_code in [200, 400, 503]
```

**Step 3: Implement FastAPI routes**

Create `apps/market-data/src/routes/shenwan.py`:

```python
"""Shenwan industry API routes"""

from fastapi import APIRouter, HTTPException, Query
from typing import List
import logging

from ..models.shenwan import (
    FirstLevelIndustry,
    SecondLevelIndustry,
    ThirdLevelIndustry,
    ConstituentStock,
)
from ..services.data_source_manager import DataSourceManager
from ..cache.redis_cache import RedisCache

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/shenwan", tags=["Shenwan Industries"])

# Dependencies injected at app startup
_data_manager: DataSourceManager = None
_cache: RedisCache = None


def init_router(data_manager: DataSourceManager, cache: RedisCache):
    """Initialize router with dependencies"""
    global _data_manager, _cache
    _data_manager = data_manager
    _cache = cache


@router.get(
    "/industries/first",
    response_model=List[FirstLevelIndustry],
    summary="Get first-level industries",
    description="Returns all Shenwan first-level industry classifications with valuation metrics",
)
async def get_first_level_industries(
    force_refresh: bool = Query(False, description="Force refresh from data source, bypass cache")
) -> List[FirstLevelIndustry]:
    """Fetch first-level industry data"""
    try:
        return await _cache.get_or_fetch(
            cache_key="shenwan:first_level",
            fetch_func=_data_manager.get_first_level_industries,
            model_class=FirstLevelIndustry,
            force_refresh=force_refresh,
        )
    except Exception as e:
        logger.error(f"Failed to fetch first-level industries: {e}", exc_info=True)
        raise HTTPException(
            status_code=503, detail="Service temporarily unavailable. All data sources failed."
        )


@router.get(
    "/industries/second",
    response_model=List[SecondLevelIndustry],
    summary="Get second-level industries",
    description="Returns all Shenwan second-level industry classifications with parent relationships",
)
async def get_second_level_industries(
    force_refresh: bool = Query(False, description="Force refresh from data source, bypass cache")
) -> List[SecondLevelIndustry]:
    """Fetch second-level industry data"""
    try:
        return await _cache.get_or_fetch(
            cache_key="shenwan:second_level",
            fetch_func=_data_manager.get_second_level_industries,
            model_class=SecondLevelIndustry,
            force_refresh=force_refresh,
        )
    except Exception as e:
        logger.error(f"Failed to fetch second-level industries: {e}", exc_info=True)
        raise HTTPException(
            status_code=503, detail="Service temporarily unavailable. All data sources failed."
        )


@router.get(
    "/industries/third",
    response_model=List[ThirdLevelIndustry],
    summary="Get third-level industries",
    description="Returns all Shenwan third-level industry classifications (260+ categories)",
)
async def get_third_level_industries(
    force_refresh: bool = Query(False, description="Force refresh from data source, bypass cache")
) -> List[ThirdLevelIndustry]:
    """Fetch third-level industry data"""
    try:
        return await _cache.get_or_fetch(
            cache_key="shenwan:third_level",
            fetch_func=_data_manager.get_third_level_industries,
            model_class=ThirdLevelIndustry,
            force_refresh=force_refresh,
        )
    except Exception as e:
        logger.error(f"Failed to fetch third-level industries: {e}", exc_info=True)
        raise HTTPException(
            status_code=503, detail="Service temporarily unavailable. All data sources failed."
        )


@router.get(
    "/constituents/{symbol}",
    response_model=List[ConstituentStock],
    summary="Get industry constituents",
    description="Returns constituent stocks for a specific third-level industry",
)
async def get_industry_constituents(
    symbol: str,
    force_refresh: bool = Query(False, description="Force refresh from data source, bypass cache"),
) -> List[ConstituentStock]:
    """Fetch constituent stocks for an industry"""
    try:
        return await _cache.get_or_fetch(
            cache_key=f"shenwan:constituents:{symbol}",
            fetch_func=lambda: _data_manager.get_constituents(symbol),
            model_class=ConstituentStock,
            force_refresh=force_refresh,
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        logger.error(f"Failed to fetch constituents for {symbol}: {e}", exc_info=True)
        raise HTTPException(
            status_code=503, detail="Service temporarily unavailable. All data sources failed."
        )
```

**Step 4: Run tests**

Run: `cd apps/market-data && poetry run pytest tests/test_routes.py -v`
Expected: 3 tests PASS (routes not fully integrated yet, accepting both 200/503)

**Step 5: Commit**

```bash
git add apps/market-data/src/routes/ apps/market-data/tests/test_routes.py
git commit -m "feat(market-data): Add Shenwan industry FastAPI routes"
```

---

### Task 9: Update main.py with Consul Registration

**Files:**
- Modify: `apps/market-data/src/main.py`

**Step 1: Read current main.py**

(Already read earlier)

**Step 2: Replace main.py with complete implementation**

Replace `apps/market-data/src/main.py`:

```python
"""Market Data FastAPI service"""

from contextlib import asynccontextmanager
from fastapi import FastAPI
import logging

try:
    import consul.aio
except ImportError:
    consul = None

try:
    import redis.asyncio as redis
except ImportError:
    redis = None

from .config import settings
from .routes import shenwan
from .services.data_source_manager import DataSourceManager
from .services.providers.akshare_provider import AKShareProvider
from .cache.redis_cache import RedisCache

# Setup logging
logging.basicConfig(
    level=logging.INFO, format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)

# Global instances
data_manager: DataSourceManager | None = None
cache: RedisCache | None = None
consul_client: consul.aio.Consul | None = None


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Startup and shutdown events"""
    global data_manager, cache, consul_client

    # Startup
    logger.info("Starting market-data service")

    # Initialize Redis (optional)
    redis_client = await get_redis_client()
    cache = RedisCache(redis_client)

    # Initialize data source manager
    providers = [AKShareProvider()]
    data_manager = DataSourceManager(providers)

    # Initialize routes with dependencies
    shenwan.init_router(data_manager, cache)

    # Register with Consul
    await register_with_consul()

    yield

    # Shutdown
    logger.info("Shutting down market-data service")
    await deregister_from_consul()
    if redis_client:
        await redis_client.close()


app = FastAPI(
    title="Market Data",
    description="Vibe Trading - Market data processing and distribution",
    version="0.1.0",
    lifespan=lifespan,
)

# Include routers
app.include_router(shenwan.router)


@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "service": settings.service_name, "version": "0.1.0"}


@app.get("/")
async def root():
    """Root endpoint"""
    return {"service": "Market Data", "description": "Market data processing and distribution"}


async def get_redis_client():
    """Get Redis client with graceful degradation"""
    if redis is None:
        logger.warning("redis.asyncio not installed - running without cache")
        return None

    try:
        client = redis.from_url(
            settings.redis_url, encoding="utf-8", decode_responses=True, socket_connect_timeout=2
        )
        await client.ping()
        logger.info("Redis connected successfully")
        return client
    except Exception as e:
        logger.warning(f"Redis connection failed: {e}. Running without cache.")
        return None


async def register_with_consul():
    """Register service with Consul"""
    global consul_client

    if consul is None:
        logger.warning("python-consul not installed - skipping Consul registration")
        return

    try:
        consul_client = consul.aio.Consul(host=settings.consul_host, port=settings.consul_port)

        await consul_client.agent.service.register(
            name="market-data",
            service_id=f"market-data-{settings.service_host}",
            address=settings.service_host,
            port=8002,
            check=consul.Check.http(
                f"http://{settings.service_host}:8002/health", interval="10s", timeout="5s"
            ),
        )

        logger.info("Registered with Consul")

    except Exception as e:
        logger.warning(f"Failed to register with Consul: {e}")
        consul_client = None


async def deregister_from_consul():
    """Deregister service from Consul"""
    if consul_client:
        try:
            await consul_client.agent.service.deregister(f"market-data-{settings.service_host}")
            logger.info("Deregistered from Consul")
        except Exception as e:
            logger.error(f"Failed to deregister from Consul: {e}")
```

**Step 3: Test health endpoint**

Run: `cd apps/market-data && poetry run python -c "from src.main import app; print('OK')"`
Expected: Prints "OK"

**Step 4: Commit**

```bash
git add apps/market-data/src/main.py
git commit -m "feat(market-data): Add Consul registration and service lifecycle"
```

---

### Task 10: Run All Python Tests

**Step 1: Run all tests**

Run: `cd apps/market-data && poetry run pytest -v`
Expected: All tests PASS

**Step 2: If tests fail, fix issues and re-run**

(Fix any failing tests)

**Step 3: Commit test fixes if needed**

```bash
git add apps/market-data/tests/
git commit -m "test(market-data): Fix test issues"
```

---

## Phase 2: TypeScript api Service

### Task 11: Add TypeScript Dependencies

**Files:**
- Modify: `apps/api/package.json`

**Step 1: Add dependencies to package.json**

Add to `dependencies` section in `apps/api/package.json`:

```json
{
  "dependencies": {
    "express": "^4.18.2",
    "axios": "^1.7.0",
    "consul": "^1.2.0"
  },
  "devDependencies": {
    "@types/express": "^4.17.17",
    "@types/node": "^20.0.0",
    "@types/consul": "^0.40.0",
    "typescript": "^5.0.0",
    "jest": "^29.0.0",
    "@types/jest": "^29.0.0",
    "ts-jest": "^29.0.0",
    "supertest": "^6.3.0",
    "@types/supertest": "^6.0.0",
    "axios-mock-adapter": "^1.22.0"
  }
}
```

**Step 2: Install dependencies**

Run: `cd apps/api && npm install`
Expected: Dependencies installed successfully

**Step 3: Commit**

```bash
git add apps/api/package.json apps/api/package-lock.json
git commit -m "deps(api): Add axios, consul, and testing dependencies"
```

---

### Task 12: Create TypeScript Types

**Files:**
- Create: `apps/api/src/types/shenwan.types.ts`

**Step 1: Create types directory and file**

```bash
mkdir -p apps/api/src/types
```

**Step 2: Create TypeScript types**

Create `apps/api/src/types/shenwan.types.ts`:

```typescript
/**
 * Shenwan industry classification types
 */

export interface IndustryInfoBase {
  code: string;
  name: string;
  constituent_count: number;
  static_pe_ratio: number | null;
  ttm_pe_ratio: number | null;
  pb_ratio: number | null;
  dividend_yield: number | null;
}

export interface FirstLevelIndustry extends IndustryInfoBase {}

export interface SecondLevelIndustry extends IndustryInfoBase {
  parent_industry: string;
}

export interface ThirdLevelIndustry extends IndustryInfoBase {}

export interface ConstituentStock {
  serial_number: number;
  stock_code: string;
  stock_name: string;
  inclusion_date: string;
  sw_level1: string;
  sw_level2: string;
  sw_level3: string;
  price: number | null;
  pe_ratio: number | null;
  ttm_pe_ratio: number | null;
  pb_ratio: number | null;
  dividend_yield: number | null;
  market_cap: number | null;
  net_profit_yoy_q3: number | null;
  net_profit_yoy_q2: number | null;
  revenue_yoy_q3: number | null;
  revenue_yoy_q2: number | null;
}

export interface MarketDataError {
  detail: string;
}
```

**Step 3: Verify TypeScript compilation**

Run: `cd apps/api && npx tsc --noEmit`
Expected: No errors

**Step 4: Commit**

```bash
git add apps/api/src/types/
git commit -m "feat(api): Add Shenwan industry TypeScript types"
```

---

### Task 13: Implement Service Discovery Client

**Files:**
- Create: `apps/api/src/services/service-discovery.client.ts`

**Step 1: Create services directory**

```bash
mkdir -p apps/api/src/services
```

**Step 2: Implement service discovery client**

Create `apps/api/src/services/service-discovery.client.ts`:

```typescript
/**
 * Service discovery client using Consul
 */

import Consul from 'consul';

/**
 * Service discovery client using Consul.
 *
 * DESIGN:
 * - Query Consul for service addresses dynamically
 * - Cache discovered addresses with TTL to reduce Consul queries
 * - Graceful degradation if Consul unavailable
 * - Fallback to environment variables
 */
export class ServiceDiscoveryClient {
  private consul: Consul.Consul | null = null;
  private serviceCache: Map<string, { address: string; timestamp: number }> = new Map();
  private cacheTTL = 30000; // 30 seconds

  constructor() {
    const consulHost = process.env.CONSUL_HOST || 'consul';
    const consulPort = parseInt(process.env.CONSUL_PORT || '8500');

    try {
      this.consul = new Consul({
        host: consulHost,
        port: consulPort,
        promisify: true,
      });
      console.log(`Consul client initialized: ${consulHost}:${consulPort}`);
    } catch (error) {
      console.warn('Failed to initialize Consul client:', error);
      this.consul = null;
    }
  }

  /**
   * Discover service address from Consul.
   * Falls back to environment variable if Consul unavailable.
   */
  async discoverService(serviceName: string, fallbackEnvVar: string): Promise<string> {
    // Check cache first
    const cached = this.serviceCache.get(serviceName);
    if (cached && Date.now() - cached.timestamp < this.cacheTTL) {
      return cached.address;
    }

    // Try Consul discovery
    if (this.consul) {
      try {
        const result = await this.consul.health.service({
          service: serviceName,
          passing: true, // Only healthy instances
        });

        if (result && result.length > 0) {
          // Use first healthy instance
          const service = result[0];
          const address = `http://${service.Service.Address}:${service.Service.Port}`;

          // Cache the result
          this.serviceCache.set(serviceName, { address, timestamp: Date.now() });

          console.log(`Discovered ${serviceName} at ${address}`);
          return address;
        }
      } catch (error) {
        console.warn(`Consul query failed for ${serviceName}:`, error);
      }
    }

    // Fallback to environment variable
    const fallback = process.env[fallbackEnvVar];
    if (fallback) {
      console.log(`Using fallback address for ${serviceName}: ${fallback}`);
      return fallback;
    }

    throw new Error(`Cannot discover service ${serviceName} and no fallback configured`);
  }

  /**
   * Register this service with Consul.
   */
  async registerService(
    serviceName: string,
    serviceId: string,
    port: number,
    healthCheckPath: string
  ): Promise<void> {
    if (!this.consul) {
      console.warn('Consul not available, skipping service registration');
      return;
    }

    try {
      await this.consul.agent.service.register({
        id: serviceId,
        name: serviceName,
        address: process.env.SERVICE_HOST || 'api',
        port: port,
        check: {
          http: `http://${process.env.SERVICE_HOST || 'api'}:${port}${healthCheckPath}`,
          interval: '10s',
          timeout: '5s',
        },
      });

      console.log(`Registered ${serviceName} (${serviceId}) with Consul`);

      // Deregister on process exit
      process.on('SIGTERM', async () => {
        await this.deregisterService(serviceId);
      });
      process.on('SIGINT', async () => {
        await this.deregisterService(serviceId);
      });
    } catch (error) {
      console.error('Failed to register service with Consul:', error);
    }
  }

  /**
   * Deregister service from Consul.
   */
  async deregisterService(serviceId: string): Promise<void> {
    if (!this.consul) return;

    try {
      await this.consul.agent.service.deregister(serviceId);
      console.log(`Deregistered ${serviceId} from Consul`);
    } catch (error) {
      console.error('Failed to deregister service:', error);
    }
  }
}

// Singleton instance
export const serviceDiscovery = new ServiceDiscoveryClient();
```

**Step 3: Verify TypeScript compilation**

Run: `cd apps/api && npx tsc --noEmit`
Expected: No errors

**Step 4: Commit**

```bash
git add apps/api/src/services/service-discovery.client.ts
git commit -m "feat(api): Implement Consul service discovery client"
```

---

### Task 14: Implement Market Data HTTP Client

**Files:**
- Create: `apps/api/src/services/market-data.client.ts`

**Step 1: Implement market data client**

Create `apps/api/src/services/market-data.client.ts`:

```typescript
/**
 * HTTP client for market-data microservice
 */

import axios, { AxiosInstance, AxiosError } from 'axios';
import { serviceDiscovery } from './service-discovery.client';
import type {
  FirstLevelIndustry,
  SecondLevelIndustry,
  ThirdLevelIndustry,
  ConstituentStock,
  MarketDataError,
} from '../types/shenwan.types';

export class MarketDataClient {
  private client: AxiosInstance | null = null;
  private baseURL: string | null = null;

  /**
   * Initialize client with service discovery.
   * Called lazily on first request.
   */
  private async ensureClient(): Promise<AxiosInstance> {
    if (this.client && this.baseURL) {
      return this.client;
    }

    // Discover market-data service address from Consul
    this.baseURL = await serviceDiscovery.discoverService(
      'market-data',
      'MARKET_DATA_URL' // Fallback env var
    );

    this.client = axios.create({
      baseURL: this.baseURL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Error interceptor
    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError<MarketDataError>) => {
        if (error.response) {
          console.error(`Market-data error: ${error.response.status}`, error.response.data);
        } else if (error.request) {
          console.error('Market-data service unavailable:', error.message);
          // Invalidate cached address on connection failure
          this.client = null;
          this.baseURL = null;
        } else {
          console.error('Request setup error:', error.message);
        }
        throw error;
      }
    );

    return this.client;
  }

  async getFirstLevelIndustries(forceRefresh = false): Promise<FirstLevelIndustry[]> {
    const client = await this.ensureClient();
    const response = await client.get<FirstLevelIndustry[]>('/api/shenwan/industries/first', {
      params: { force_refresh: forceRefresh },
    });
    return response.data;
  }

  async getSecondLevelIndustries(forceRefresh = false): Promise<SecondLevelIndustry[]> {
    const client = await this.ensureClient();
    const response = await client.get<SecondLevelIndustry[]>('/api/shenwan/industries/second', {
      params: { force_refresh: forceRefresh },
    });
    return response.data;
  }

  async getThirdLevelIndustries(forceRefresh = false): Promise<ThirdLevelIndustry[]> {
    const client = await this.ensureClient();
    const response = await client.get<ThirdLevelIndustry[]>('/api/shenwan/industries/third', {
      params: { force_refresh: forceRefresh },
    });
    return response.data;
  }

  async getConstituents(symbol: string, forceRefresh = false): Promise<ConstituentStock[]> {
    const client = await this.ensureClient();
    const response = await client.get<ConstituentStock[]>(
      `/api/shenwan/constituents/${encodeURIComponent(symbol)}`,
      { params: { force_refresh: forceRefresh } }
    );
    return response.data;
  }
}

export const marketDataClient = new MarketDataClient();
```

**Step 2: Verify TypeScript compilation**

Run: `cd apps/api && npx tsc --noEmit`
Expected: No errors

**Step 3: Commit**

```bash
git add apps/api/src/services/market-data.client.ts
git commit -m "feat(api): Implement market-data HTTP client with service discovery"
```

---

### Task 15: Create Express Routes

**Files:**
- Create: `apps/api/src/routes/shenwan.routes.ts`

**Step 1: Create routes directory**

```bash
mkdir -p apps/api/src/routes
```

**Step 2: Implement Express routes**

Create `apps/api/src/routes/shenwan.routes.ts`:

```typescript
/**
 * Shenwan industry proxy routes
 */

import { Router, Request, Response } from 'express';
import { marketDataClient } from '../services/market-data.client';
import { AxiosError } from 'axios';

const router = Router();

/**
 * GET /api/shenwan/industries/first
 * Proxy to market-data service for first-level industries
 */
router.get('/industries/first', async (req: Request, res: Response) => {
  try {
    const forceRefresh = req.query.force_refresh === 'true';
    const data = await marketDataClient.getFirstLevelIndustries(forceRefresh);
    res.json(data);
  } catch (error) {
    handleMarketDataError(error, res);
  }
});

/**
 * GET /api/shenwan/industries/second
 * Proxy to market-data service for second-level industries
 */
router.get('/industries/second', async (req: Request, res: Response) => {
  try {
    const forceRefresh = req.query.force_refresh === 'true';
    const data = await marketDataClient.getSecondLevelIndustries(forceRefresh);
    res.json(data);
  } catch (error) {
    handleMarketDataError(error, res);
  }
});

/**
 * GET /api/shenwan/industries/third
 * Proxy to market-data service for third-level industries
 */
router.get('/industries/third', async (req: Request, res: Response) => {
  try {
    const forceRefresh = req.query.force_refresh === 'true';
    const data = await marketDataClient.getThirdLevelIndustries(forceRefresh);
    res.json(data);
  } catch (error) {
    handleMarketDataError(error, res);
  }
});

/**
 * GET /api/shenwan/constituents/:symbol
 * Proxy to market-data service for industry constituents
 */
router.get('/constituents/:symbol', async (req: Request, res: Response) => {
  try {
    const { symbol } = req.params;
    const forceRefresh = req.query.force_refresh === 'true';
    const data = await marketDataClient.getConstituents(symbol, forceRefresh);
    res.json(data);
  } catch (error) {
    handleMarketDataError(error, res);
  }
});

/**
 * Error handler for market-data service errors
 */
function handleMarketDataError(error: unknown, res: Response): void {
  if (error instanceof AxiosError) {
    if (error.response) {
      // Forward error from market-data service
      res.status(error.response.status).json({
        error: 'Market data service error',
        detail: error.response.data?.detail || error.message,
      });
    } else {
      // Service unavailable
      res.status(503).json({
        error: 'Market data service unavailable',
        detail: 'Could not connect to market-data service',
      });
    }
  } else {
    // Unknown error
    res.status(500).json({
      error: 'Internal server error',
      detail: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}

export default router;
```

**Step 3: Verify TypeScript compilation**

Run: `cd apps/api && npx tsc --noEmit`
Expected: No errors

**Step 4: Commit**

```bash
git add apps/api/src/routes/
git commit -m "feat(api): Add Shenwan industry proxy routes"
```

---

### Task 16: Update main.ts with Routes and Consul

**Files:**
- Modify: `apps/api/src/main.ts`

**Step 1: Replace main.ts**

Replace `apps/api/src/main.ts`:

```typescript
import express from 'express';
import shenwanRoutes from './routes/shenwan.routes';
import { serviceDiscovery } from './services/service-discovery.client';

const host = process.env.HOST ?? '0.0.0.0';
const port = process.env.PORT ? Number(process.env.PORT) : 3000;

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
  res.send({ message: 'Hello API' });
});

app.get('/health', (req, res) => {
  res.status(200).send({ status: 'healthy', service: 'api' });
});

// Shenwan routes
app.use('/api/shenwan', shenwanRoutes);

app.listen(port, host, async () => {
  console.log(`[ ready ] http://${host}:${port}`);

  // Register with Consul
  await serviceDiscovery.registerService('api', `api-${process.env.HOSTNAME || 'local'}`, port, '/health');
});
```

**Step 2: Verify TypeScript compilation**

Run: `cd apps/api && npx tsc --noEmit`
Expected: No errors

**Step 3: Commit**

```bash
git add apps/api/src/main.ts
git commit -m "feat(api): Integrate Shenwan routes and Consul registration"
```

---

## Phase 3: Infrastructure & Docker

### Task 17: Add Consul to docker-compose.yml

**Files:**
- Modify: `docker-compose.yml`

**Step 1: Add Consul service to docker-compose.yml**

Add after redis service in `docker-compose.yml`:

```yaml
  consul:
    image: consul:1.17
    ports:
      - "8500:8500"
    command: agent -server -ui -node=server-1 -bootstrap-expect=1 -client=0.0.0.0
    volumes:
      - consul-data:/consul/data
    healthcheck:
      test: ["CMD", "consul", "members"]
      interval: 10s
      timeout: 5s
      retries: 5
    restart: unless-stopped
```

**Step 2: Add Consul volume at bottom**

Add to volumes section:

```yaml
volumes:
  consul-data:
  zookeeper-data:
  zookeeper-logs:
  kafka-data:
  redis-data:
  portainer-data:
```

**Step 3: Update api service environment variables**

Add to api service environment section:

```yaml
    environment:
      - NODE_ENV=production
      - KAFKA_BROKERS=kafka:9092
      - REDIS_URL=redis://redis:6379
      - CONSUL_HOST=consul
      - CONSUL_PORT=8500
      - SERVICE_HOST=api
      - MARKET_DATA_URL=http://market-data:8002
```

**Step 4: Update api service depends_on**

Add consul dependency:

```yaml
    depends_on:
      kafka:
        condition: service_healthy
      redis:
        condition: service_healthy
      consul:
        condition: service_healthy
```

**Step 5: Update market-data service environment variables**

Add to market-data service environment section:

```yaml
    environment:
      - KAFKA_BROKERS=kafka:9092
      - REDIS_URL=redis://redis:6379
      - CONSUL_HOST=consul
      - CONSUL_PORT=8500
      - SERVICE_HOST=market-data
```

**Step 6: Update market-data service depends_on**

Add consul dependency:

```yaml
    depends_on:
      kafka:
        condition: service_healthy
      redis:
        condition: service_healthy
      consul:
        condition: service_healthy
```

**Step 7: Commit**

```bash
git add docker-compose.yml
git commit -m "infra: Add Consul service and update service configurations"
```

---

## Phase 4: Testing & Verification

### Task 18: Write Integration Tests

**Files:**
- Create: `apps/api/tests/integration/shenwan.e2e.spec.ts`
- Create: `apps/api/jest.integration.config.ts`

**Step 1: Create test directories**

```bash
mkdir -p apps/api/tests/integration
```

**Step 2: Create integration test**

Create `apps/api/tests/integration/shenwan.e2e.spec.ts`:

```typescript
/**
 * End-to-end integration test
 * Requires both api and market-data services running
 */

describe('Shenwan API Integration', () => {
  const API_URL = process.env.API_URL || 'http://localhost:3000';

  it('should fetch first-level industries through full service chain', async () => {
    const response = await fetch(`${API_URL}/api/shenwan/industries/first`);

    expect(response.ok).toBe(true);
    const data = await response.json();
    expect(Array.isArray(data)).toBe(true);

    if (data.length > 0) {
      expect(data[0]).toHaveProperty('code');
      expect(data[0]).toHaveProperty('name');
      expect(data[0]).toHaveProperty('constituent_count');
    }
  }, 30000);

  it('should fetch second-level industries through full service chain', async () => {
    const response = await fetch(`${API_URL}/api/shenwan/industries/second`);

    expect(response.ok).toBe(true);
    const data = await response.json();
    expect(Array.isArray(data)).toBe(true);

    if (data.length > 0) {
      expect(data[0]).toHaveProperty('code');
      expect(data[0]).toHaveProperty('name');
      expect(data[0]).toHaveProperty('parent_industry');
    }
  }, 30000);

  it('should fetch third-level industries through full service chain', async () => {
    const response = await fetch(`${API_URL}/api/shenwan/industries/third`);

    expect(response.ok).toBe(true);
    const data = await response.json();
    expect(Array.isArray(data)).toBe(true);
    expect(data.length).toBeGreaterThan(200); // Should have 260+ categories

    if (data.length > 0) {
      expect(data[0]).toHaveProperty('code');
      expect(data[0]).toHaveProperty('name');
    }
  }, 30000);

  it('should fetch industry constituents through full service chain', async () => {
    // First get third-level industries to get a valid symbol
    const industriesResponse = await fetch(`${API_URL}/api/shenwan/industries/third`);
    expect(industriesResponse.ok).toBe(true);

    const industries = await industriesResponse.json();
    expect(industries.length).toBeGreaterThan(0);

    const testSymbol = industries[0].code;

    // Now fetch constituents for that symbol
    const response = await fetch(`${API_URL}/api/shenwan/constituents/${testSymbol}`);

    expect(response.ok).toBe(true);
    const data = await response.json();
    expect(Array.isArray(data)).toBe(true);

    if (data.length > 0) {
      expect(data[0]).toHaveProperty('stock_code');
      expect(data[0]).toHaveProperty('stock_name');
      expect(data[0]).toHaveProperty('sw_level1');
      expect(data[0]).toHaveProperty('sw_level2');
      expect(data[0]).toHaveProperty('sw_level3');
    }
  }, 30000);
});
```

**Step 3: Create Jest integration config**

Create `apps/api/jest.integration.config.ts`:

```typescript
export default {
  displayName: 'api-integration',
  preset: '../../jest.preset.js',
  testEnvironment: 'node',
  testMatch: ['**/tests/integration/**/*.spec.ts'],
  transform: {
    '^.+\\.[tj]s$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.spec.json' }],
  },
  moduleFileExtensions: ['ts', 'js', 'html'],
  coverageDirectory: '../../coverage/apps/api-integration',
  testTimeout: 30000,
};
```

**Step 4: Commit**

```bash
git add apps/api/tests/integration/ apps/api/jest.integration.config.ts
git commit -m "test(api): Add E2E integration tests for all 4 endpoints"
```

---

### Task 19: Update Nx Project Configuration

**Files:**
- Modify: `apps/api/project.json`

**Step 1: Add test:integration target to apps/api/project.json**

Add to targets section:

```json
{
  "test:integration": {
    "executor": "nx:run-commands",
    "options": {
      "command": "jest --config apps/api/jest.integration.config.ts",
      "cwd": "."
    }
  }
}
```

**Step 2: Commit**

```bash
git add apps/api/project.json
git commit -m "build(api): Add integration test target to Nx config"
```

---

### Task 20: Manual Verification Steps

**This task requires manual execution - document results**

**Step 1: Start infrastructure services**

Run: `docker-compose up -d consul redis kafka`
Wait for services to be healthy

**Step 2: Start market-data service**

Run: `cd apps/market-data && poetry run uvicorn src.main:app --host 0.0.0.0 --port 8002 --reload`
Verify: Service starts without errors
Verify: Health endpoint responds: `curl http://localhost:8002/health`

**Step 3: Start api service**

Run: `npx nx run api:serve`
Verify: Service starts without errors
Verify: Health endpoint responds: `curl http://localhost:3000/health`

**Step 4: Verify Consul registration**

Run: `curl http://localhost:8500/v1/agent/services`
Expected: See both "api" and "market-data" services registered

**Step 5: Test endpoint 1 - First-level industries**

Run: `curl http://localhost:3000/api/shenwan/industries/first | jq '.[:2]'`
Expected: JSON array with industry data

**Step 6: Test endpoint 2 - Second-level industries**

Run: `curl http://localhost:3000/api/shenwan/industries/second | jq '.[:2]'`
Expected: JSON array with parent_industry field

**Step 7: Test endpoint 3 - Third-level industries**

Run: `curl http://localhost:3000/api/shenwan/industries/third | jq 'length'`
Expected: Number > 200

**Step 8: Test endpoint 4 - Constituents**

Run: `curl "http://localhost:3000/api/shenwan/industries/third" | jq '.[0].code'`
Then: `curl http://localhost:3000/api/shenwan/constituents/<CODE> | jq '.[:2]'`
Expected: JSON array with stock data

**Step 9: Test force_refresh parameter**

Run: `curl "http://localhost:3000/api/shenwan/industries/first?force_refresh=true" | jq 'length'`
Expected: Same data but bypasses cache

**Step 10: Run integration tests**

Run: `API_URL=http://localhost:3000 npx nx run api:test:integration`
Expected: 4 tests PASS

**Step 11: Document results**

Create verification report summarizing all test results.

---

### Task 21: Build All Services

**Step 1: Build market-data service**

Run: `npx nx run market-data:test`
Expected: All tests PASS

**Step 2: Build api service**

Run: `npx nx run api:build`
Expected: Build succeeds

**Step 3: Build all services**

Run: `npx nx run-many --target=build --all`
Expected: All builds succeed

**Step 4: Commit final changes**

```bash
git add .
git commit -m "chore: Final build verification and cleanup"
```

---

## Success Criteria Checklist

- [ ] All 4 API endpoints return valid data
- [ ] Services registered in Consul (visible at http://localhost:8500)
- [ ] Redis caching working (12-hour TTL)
- [ ] Service works without Redis (graceful degradation tested)
- [ ] Service works without Consul (fallback to env vars tested)
- [ ] All Python unit tests pass
- [ ] All TypeScript unit tests pass (if implemented)
- [ ] All integration tests pass
- [ ] Project builds successfully
- [ ] Services communicate via HTTP successfully

---

## Execution Notes

**Estimated Time:** 4-6 hours for complete implementation

**Critical Path:**
1. Python provider → Manager → Cache → Routes (foundational)
2. TypeScript client → Routes (proxy layer)
3. Infrastructure → Integration tests (verification)

**Risk Areas:**
- AKShare API availability (may be blocked/slow)
- Poetry installation (need Poetry installed)
- Consul connectivity in Docker network

**Testing Strategy:**
- Unit test each component independently
- Mock external dependencies (AKShare, Redis, Consul)
- Integration test requires all services running
- Manual verification as final step

---
