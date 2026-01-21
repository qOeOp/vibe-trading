# Shenwan Industry API - Design Document

**Date:** 2026-01-21
**Author:** Claude & Vincent Xu
**Status:** Approved

## Overview

This design implements a complete Shenwan industry classification API system with 4 endpoints across two microservices (market-data and api), featuring multi-source data aggregation, Consul service discovery, Redis caching, and comprehensive testing.

## Goals

1. Implement 4 Shenwan industry API endpoints in market-data service (Python/FastAPI)
2. Create proxy endpoints in api service (TypeScript/Express) with service discovery
3. Establish multi-source data provider architecture for future extensibility
4. Integrate Consul for dynamic service discovery
5. Implement Redis caching with graceful degradation (12-hour TTL)
6. Write comprehensive unit and integration tests for all endpoints
7. Ensure system works independently even if Redis/Consul/AKShare fail

## Architecture

### High-Level Architecture

```
Express API (TypeScript)
    ↓ HTTP (discovered via Consul)
market-data Service (Python/FastAPI)
    ↓
DataSourceManager (abstraction layer)
    ↓
AKShareProvider (current implementation)
    ↓ fetches from
AKShare API
    ↓ caches in
Redis (12-hour TTL, with graceful degradation)
```

### Service Discovery Flow

```
Express API startup
    ↓
1. Register self to Consul
2. Query Consul for market-data service address
3. Get market-data URL dynamically
    ↓
Express API → market-data (discovered address)

If Consul unavailable:
    ↓
Fallback to environment variable MARKET_DATA_URL
```

### Data Provider Pattern (Future Multi-Source)

```
DataSourceManager
  ↓
[AKShareProvider, FutureProvider1, FutureProvider2, ...]
  ↓
Try providers in order until one succeeds
  ↓
First successful response returned
```

**Design Context:**
The DataSourceManager implements a provider chain pattern to support the data hub architecture. The goal is to aggregate multiple market data sources (AKShare, Tushare, Wind, etc.) and provide unified, normalized responses with automatic failover.

**Current State:** Only AKShareProvider is implemented
**Future Extension:** Add new providers by implementing DataProvider interface, no route changes needed

## API Endpoints

### market-data Service (Python FastAPI)

#### 1. GET /api/shenwan/industries/first
- **Description:** Fetch first-level Shenwan industry classifications
- **Parameters:**
  - `force_refresh` (query, optional, boolean): Force refresh from data source, bypass cache
- **Response:** List of FirstLevelIndustry
- **Cache TTL:** 12 hours

#### 2. GET /api/shenwan/industries/second
- **Description:** Fetch second-level Shenwan industry classifications
- **Parameters:**
  - `force_refresh` (query, optional, boolean): Force refresh from data source, bypass cache
- **Response:** List of SecondLevelIndustry (includes parent_industry field)
- **Cache TTL:** 12 hours

#### 3. GET /api/shenwan/industries/third
- **Description:** Fetch third-level Shenwan industry classifications (260+ categories)
- **Parameters:**
  - `force_refresh` (query, optional, boolean): Force refresh from data source, bypass cache
- **Response:** List of ThirdLevelIndustry
- **Cache TTL:** 12 hours

#### 4. GET /api/shenwan/constituents/{symbol}
- **Description:** Fetch constituent stocks for a specific third-level industry
- **Parameters:**
  - `symbol` (path, required, string): Industry code (e.g., "850111.SI")
  - `force_refresh` (query, optional, boolean): Force refresh from data source, bypass cache
- **Response:** List of ConstituentStock
- **Cache TTL:** 12 hours
- **Error Codes:**
  - 400: Invalid symbol
  - 503: Service unavailable (all data sources failed)

### api Service (TypeScript Express)

Identical endpoints that proxy to market-data service:
- GET /api/shenwan/industries/first
- GET /api/shenwan/industries/second
- GET /api/shenwan/industries/third
- GET /api/shenwan/constituents/:symbol

All support `force_refresh` query parameter.

## Data Models

### Pydantic Models (Python)

```python
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
    pass

class SecondLevelIndustry(IndustryInfoBase):
    parent_industry: str = Field(..., description="上级行业")

class ThirdLevelIndustry(IndustryInfoBase):
    pass

class ConstituentStock(BaseModel):
    """Constituent stock information"""
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

### TypeScript Interfaces

```typescript
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
```

## Component Design

### 1. Data Source Abstraction Layer (Python)

**base_provider.py:**
```python
from abc import ABC, abstractmethod
from typing import List

class DataProvider(ABC):
    """Abstract base class for data providers"""

    @abstractmethod
    async def get_first_level_industries(self) -> List[FirstLevelIndustry]:
        pass

    @abstractmethod
    async def get_second_level_industries(self) -> List[SecondLevelIndustry]:
        pass

    @abstractmethod
    async def get_third_level_industries(self) -> List[ThirdLevelIndustry]:
        pass

    @abstractmethod
    async def get_constituents(self, symbol: str) -> List[ConstituentStock]:
        pass
```

**akshare_provider.py:**
- Implements DataProvider interface
- Uses ThreadPoolExecutor to run synchronous akshare calls
- Transforms pandas DataFrame to Pydantic models
- Handles null values with `_safe_float()` helper
- Maps Chinese column names to English field names
- Logs data quality issues without failing

**data_source_manager.py:**
- Manages list of providers with fallback logic
- Tries each provider in order until one succeeds
- Logs failures but continues to next provider
- Raises DataSourceUnavailableError if all fail
- Includes comprehensive documentation for future extensions

### 2. Redis Caching Layer (Python)

**redis_cache.py:**
- Optional dependency - service works without Redis
- Dual-key strategy:
  - Primary key: data with 12-hour TTL
  - Backup key: data without expiration (for fallback)
- `get_or_fetch()` method with graceful degradation:
  - Check cache (unless force_refresh)
  - On miss: fetch from data source
  - On fetch success: update both keys
  - On fetch failure: serve from backup key
  - On Redis failure: continue without cache
- All Redis operations wrapped in try-except
- Never propagates Redis errors to caller

### 3. FastAPI Routes (Python)

**routes/shenwan.py:**
- 4 endpoints for industry data
- Dependency injection pattern (manager and cache)
- `force_refresh` query parameter support
- Proper HTTP status codes:
  - 200: Success
  - 400: Invalid input (bad symbol)
  - 503: Service unavailable (all sources failed)
- Comprehensive OpenAPI documentation
- Detailed error logging

### 4. Service Discovery (TypeScript)

**service-discovery.client.ts:**
- Consul client for service registration and discovery
- 30-second cache for discovered addresses (reduce Consul queries)
- `discoverService()` method with fallback:
  - Check cache first
  - Query Consul for healthy instances
  - Cache result
  - Fallback to environment variable if Consul fails
- `registerService()` method:
  - Registers with health check endpoint
  - Auto-deregisters on SIGTERM/SIGINT
- Graceful degradation if Consul unavailable

**market-data.client.ts:**
- Lazy initialization with service discovery
- `ensureClient()` method discovers address on first use
- Invalidates cache on connection failures (triggers re-discovery)
- 10-second request timeout
- Error interceptor for logging and cache invalidation
- Type-safe methods for all 4 endpoints

### 5. Express Routes (TypeScript)

**routes/shenwan.routes.ts:**
- 4 proxy endpoints matching market-data service
- Extracts `force_refresh` query parameter
- Forwards requests to market-data service
- Error handler that:
  - Forwards errors from market-data (preserve status codes)
  - Returns 503 if market-data unreachable
  - Returns 500 for unknown errors
- Clean error messages for clients

## Infrastructure

### Consul Configuration

**docker-compose.yml additions:**
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
```

**Service Environment Variables:**
- CONSUL_HOST=consul
- CONSUL_PORT=8500
- SERVICE_HOST=<service-name>
- MARKET_DATA_URL=http://market-data:8002 (fallback)

### Service Registration

**Python (FastAPI lifespan):**
```python
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: register with Consul
    await consul_client.agent.service.register(
        name="market-data",
        service_id=f"market-data-{settings.service_host}",
        address=settings.service_host,
        port=8002,
        check=consul.Check.http(
            f"http://{settings.service_host}:8002/health",
            interval="10s"
        )
    )

    yield

    # Shutdown: deregister
    await consul_client.agent.service.deregister(service_id)
```

**TypeScript (on app.listen):**
```typescript
app.listen(port, host, async () => {
    await serviceDiscovery.registerService(
        'api',
        `api-${process.env.HOSTNAME || 'local'}`,
        port,
        '/health'
    );
});
```

## Testing Strategy

### Unit Tests (Python)

**test_routes.py:**
- Test successful data retrieval for all 4 endpoints
- Test `force_refresh` parameter
- Test invalid symbol (400 error)
- Test data source failure (503 error)
- Test Redis unavailable (graceful degradation)
- Test concurrent requests

**test_providers.py:**
- Test AKShare provider success
- Test empty results handling
- Test connection errors
- Mock akshare functions

**test_cache.py:**
- Test cache hit/miss
- Test TTL expiration
- Test backup cache fallback
- Test Redis unavailable

**test_data_source_manager.py:**
- Test provider fallback logic
- Test all providers failing
- Test first provider success

### Unit Tests (TypeScript)

**market-data.client.spec.ts:**
- Test successful data fetch for all 4 endpoints
- Test service unavailable error
- Test `force_refresh` parameter passing
- Test 503 error handling
- Mock axios

**shenwan.routes.spec.ts:**
- Test route responses (200/503)
- Test symbol validation
- Test concurrent requests
- Use supertest

### Integration Tests (TypeScript)

**shenwan.e2e.spec.ts:**
- Test all 4 endpoints through full service chain
- Verify Express API → market-data → AKShare → Redis flow
- Validate response data structure
- Test with real services running
- 30-second timeout for real API calls

## Dependencies

### Python (pyproject.toml)

New dependencies:
```toml
[tool.poetry.dependencies]
akshare = "^1.14.0"
pandas = "^2.2.0"
consul = "^1.1.0"
```

### TypeScript (package.json)

New dependencies:
```json
{
  "dependencies": {
    "axios": "^1.7.0",
    "consul": "^1.2.0"
  },
  "devDependencies": {
    "@types/consul": "^0.40.0",
    "axios-mock-adapter": "^1.22.0"
  }
}
```

## File Structure

```
apps/market-data/
├── src/
│   ├── main.py                      # FastAPI app with Consul registration
│   ├── config.py                    # Settings with Consul config
│   ├── routes/
│   │   └── shenwan.py              # 4 Shenwan endpoints
│   ├── services/
│   │   ├── data_source_manager.py  # Multi-source abstraction
│   │   └── providers/
│   │       ├── base_provider.py    # Abstract base class
│   │       └── akshare_provider.py # AKShare implementation
│   ├── models/
│   │   └── shenwan.py              # Pydantic models
│   └── cache/
│       └── redis_cache.py          # Redis with graceful degradation
├── tests/
│   ├── test_routes.py
│   ├── test_providers.py
│   ├── test_cache.py
│   └── test_data_source_manager.py
└── pyproject.toml

apps/api/
├── src/
│   ├── main.ts                     # Express app with Consul registration
│   ├── types/
│   │   └── shenwan.types.ts        # TypeScript interfaces
│   ├── services/
│   │   ├── service-discovery.client.ts
│   │   └── market-data.client.ts
│   └── routes/
│       └── shenwan.routes.ts       # 4 proxy endpoints
├── tests/
│   ├── unit/
│   │   ├── market-data.client.spec.ts
│   │   └── shenwan.routes.spec.ts
│   └── integration/
│       └── shenwan.e2e.spec.ts
└── package.json
```

## Implementation Phases

### Phase 1: Python market-data Service
1. Add dependencies (akshare, pandas, consul)
2. Create Pydantic models
3. Implement base_provider.py
4. Implement akshare_provider.py
5. Implement data_source_manager.py
6. Implement redis_cache.py
7. Create FastAPI routes
8. Update main.py with Consul registration
9. Update config.py
10. Write unit tests
11. Verify: `npx nx run market-data:test`

### Phase 2: TypeScript api Service
1. Add dependencies (axios, consul)
2. Create TypeScript types
3. Implement service-discovery.client.ts
4. Implement market-data.client.ts
5. Create Express routes
6. Update main.ts with Consul registration
7. Write unit tests
8. Verify: `npx nx run api:test`

### Phase 3: Integration & Infrastructure
1. Add Consul to docker-compose.yml
2. Update service environment variables
3. Write integration tests
4. Run services and test
5. Verify: `npx nx run api:test:integration`

### Phase 4: Verification
1. Test all 4 endpoints
2. Verify Consul registration (UI at localhost:8500)
3. Verify Redis caching
4. Test resilience scenarios (Redis down, Consul down, AKShare failure)
5. Build all: `npx nx run-many --target=build --all`

## Success Criteria

- ✅ All 4 endpoints return valid data
- ✅ Services registered in Consul successfully
- ✅ Redis caching working (12-hour TTL)
- ✅ Service works without Redis (graceful degradation)
- ✅ Service works without Consul (env var fallback)
- ✅ All unit tests pass
- ✅ All integration tests pass
- ✅ Project builds successfully
- ✅ Services communicate via HTTP successfully

## Resilience Design

### Redis Failure
- Service continues without caching
- All Redis operations wrapped in try-except
- Logs warnings but never fails requests

### Consul Failure
- Falls back to environment variable MARKET_DATA_URL
- Logs warnings but continues operation
- Service discovery cache provides temporary buffer

### AKShare Failure
- Serves stale data from backup Redis cache
- Logs errors with context
- Returns 503 if no backup available
- Future: tries next provider in chain

### Multiple Failures
- If Redis + AKShare fail: Returns 503 (no stale data available)
- If Consul + Redis fail: Works with env var + no cache
- If all fail: Returns meaningful 503 error to client

## Security Considerations

- No API keys exposed in code
- Environment variables for all sensitive config
- Health check endpoints public (required for Consul)
- Service-to-service communication within Docker network
- No external ports exposed except via API gateway

## Performance Considerations

- Redis caching reduces AKShare API load
- 12-hour TTL balances freshness and performance
- Service discovery cache (30s) reduces Consul queries
- Thread pool executor prevents event loop blocking
- Async/await throughout for I/O operations

## Monitoring & Observability

- Health check endpoints for all services
- Consul UI shows service health status
- Comprehensive logging with context
- Error rates trackable via logs
- Response time observable via client logs

## Future Enhancements

1. **Multi-Source Support:** Add Tushare, Wind, Bloomberg providers
2. **Advanced Caching:** Redis Cluster for high availability
3. **Rate Limiting:** Protect AKShare from excessive calls
4. **Metrics:** Prometheus integration for detailed monitoring
5. **Circuit Breaker:** Fail fast when provider consistently fails
6. **Load Balancing:** Multiple market-data instances with Consul
7. **API Versioning:** Support multiple API versions
8. **WebSocket Streaming:** Real-time updates for industry data changes

## References

- [AKShare Documentation - Shenwan Industry](https://akshare.akfamily.xyz/data/index/index.html#id50)
- [Consul Service Discovery](https://www.consul.io/docs/discovery)
- [FastAPI Lifespan Events](https://fastapi.tiangolo.com/advanced/events/)
- [Express.js Best Practices](https://expressjs.com/en/advanced/best-practice-performance.html)
