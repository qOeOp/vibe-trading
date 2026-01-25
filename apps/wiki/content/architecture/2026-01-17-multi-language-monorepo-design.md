# Multi-Language Monorepo Architecture Design

**Date:** 2026-01-17
**Author:** Vincent Xu
**Status:** Approved

## Overview

Transform Vibe Trading from a TypeScript-only monorepo into a multi-language monorepo supporting both TypeScript (React frontend + Node.js API) and Python (FastAPI microservices), with event-driven architecture using Apache Kafka.

## Goals

1. Support both TypeScript and Python in Nx monorepo
2. Implement microservices architecture with event-driven communication
3. Enable Docker deployment with multiple images
4. Provide comprehensive observability for all services
5. Maintain development experience and build performance

## Architecture Overview

### Technology Stack

- **Frontend**: React 19 + TypeScript + Vite
- **API Gateway**: Node.js + Express + TypeScript
- **Python Services**: FastAPI + Poetry
- **Message Broker**: Apache Kafka (with Zookeeper)
- **Cache**: Redis
- **Monorepo**: Nx 22.3.3
- **Containerization**: Docker + Docker Compose
- **Observability**: Portainer + Kafka UI + Redis Commander + Prometheus + Grafana + Loki

## Monorepo Structure

```
vibe-trading/
├── apps/
│   ├── web/                          # React frontend (existing, moved)
│   ├── api/                          # TypeScript API Gateway (existing, moved)
│   ├── trading-engine/               # Python FastAPI - Trading algorithms
│   ├── market-data/                  # Python FastAPI - Market data processing
│   ├── analytics/                    # Python FastAPI - Data analytics
│   └── ml-models/                    # Python FastAPI - ML predictions
├── libs/
│   ├── shared-types/                 # Shared TypeScript types
│   └── shared-python/                # Shared Python utilities
├── tools/
│   └── scripts/                      # Build and deployment scripts
│       ├── build-all.sh
│       ├── push-images.sh
│       ├── deploy.sh
│       └── dev.sh
├── docker/
│   ├── web.Dockerfile
│   ├── api.Dockerfile
│   ├── trading-engine.Dockerfile
│   ├── market-data.Dockerfile
│   ├── analytics.Dockerfile
│   ├── ml-models.Dockerfile
│   ├── nginx.conf
│   ├── prometheus.yml
│   └── promtail-config.yml
├── docker-compose.yml                # Development environment
├── docker-compose.prod.yml           # Production environment
├── nx.json
├── package.json                      # TypeScript dependencies
└── pyproject.toml                    # Python dependencies (optional root)
```

## Port Allocation (82xx Range)

### Application Services
- `8200` - Frontend (web)
- `8201` - API Gateway (TypeScript)
- `8202` - Trading Engine (Python)
- `8203` - Market Data (Python)
- `8204` - Analytics (Python)
- `8205` - ML Models (Python)

### Infrastructure
- `8206` - Redis
- `8207` - Kafka (internal)
- `8208` - Kafka (external)
- `8209` - Zookeeper

### Observability
- `8210` - Portainer (container management)
- `8211` - Kafka UI (message monitoring)
- `8212` - Redis Commander (cache viewer)
- `8213` - Prometheus (metrics)
- `8214` - Grafana (visualization)
- `8215` - Loki (logs)

## Nx Configuration for Python

Since Nx doesn't natively support Python, we use custom executors:

```json
{
  "name": "trading-engine",
  "sourceRoot": "apps/trading-engine/src",
  "projectType": "application",
  "targets": {
    "install": {
      "executor": "nx:run-commands",
      "options": {
        "command": "poetry install",
        "cwd": "apps/trading-engine"
      }
    },
    "serve": {
      "executor": "nx:run-commands",
      "options": {
        "command": "poetry run uvicorn src.main:app --reload --port 8202",
        "cwd": "apps/trading-engine"
      }
    },
    "test": {
      "executor": "nx:run-commands",
      "options": {
        "command": "poetry run pytest",
        "cwd": "apps/trading-engine"
      }
    },
    "lint": {
      "executor": "nx:run-commands",
      "options": {
        "command": "poetry run ruff check src/",
        "cwd": "apps/trading-engine"
      }
    },
    "docker-build": {
      "executor": "nx:run-commands",
      "options": {
        "command": "docker build -f docker/trading-engine.Dockerfile -t crpi-8qkmcs5mqpg6052i.cn-shanghai.personal.cr.aliyuncs.com/qoeop/vibe-trading-trading-engine:latest ."
      }
    }
  }
}
```

Each Python service uses Poetry for dependency management with its own `pyproject.toml`.

## Docker Strategy

### Development Environment (`docker-compose.yml`)

- Includes Kafka, Zookeeper, Redis locally
- All services build from source
- Hot reload enabled for development
- Observability tools (Portainer, Kafka UI, Redis Commander)

### Production Environment (`docker-compose.prod.yml`)

**Hybrid Kafka Strategy:**
- Uses external Kafka if `KAFKA_BROKERS` env var is set
- Falls back to local Kafka if env var is missing
- Kafka/Zookeeper use Docker profiles (`--profile local-kafka`)

**Image Naming Convention:**
```
crpi-8qkmcs5mqpg6052i.cn-shanghai.personal.cr.aliyuncs.com/qoeop/vibe-trading-<service>:latest
```

Services:
- `vibe-trading-web`
- `vibe-trading-api`
- `vibe-trading-trading-engine`
- `vibe-trading-market-data`
- `vibe-trading-analytics`
- `vibe-trading-ml-models`

### Deployment Script Logic

```bash
if [ -z "$KAFKA_BROKERS" ]; then
  # No external Kafka, use local
  docker-compose -f docker-compose.prod.yml --profile local-kafka up -d
else
  # Use external Kafka
  docker-compose -f docker-compose.prod.yml up -d
fi
```

## Event-Driven Architecture (Kafka)

### Kafka Topics

```
# Market Data Streams
market.data.ticks          # Real-time tick data
market.data.klines         # Candlestick data
market.data.orderbook      # Order book updates

# Trading Events
trading.orders.create      # Order creation
trading.orders.update      # Order status updates
trading.orders.filled      # Order fills
trading.positions.update   # Position updates

# Analytics Events
analytics.indicators       # Technical indicator results
analytics.signals          # Trading signals
analytics.reports          # Analysis reports

# ML Events
ml.predictions            # ML model predictions
ml.training.complete      # Model training completion
```

### Communication Flow

```
1. Market Data Service → Kafka (market.data.*)
   ├→ Trading Engine subscribes → Execute strategies
   ├→ Analytics subscribes → Calculate indicators
   └→ ML Models subscribes → Generate predictions

2. Trading Engine → Kafka (trading.*)
   ├→ API Gateway subscribes → Notify frontend
   └→ Analytics subscribes → Performance analysis

3. Frontend ← WebSocket ← API Gateway ← Kafka
   (Real-time updates to frontend)
```

### Python FastAPI + Kafka Example

```python
from fastapi import FastAPI
from aiokafka import AIOKafkaConsumer, AIOKafkaProducer
import asyncio

app = FastAPI()

KAFKA_BROKERS = os.getenv("KAFKA_BROKERS", "localhost:8207")

@app.on_event("startup")
async def startup_event():
    global producer, consumer

    producer = AIOKafkaProducer(bootstrap_servers=KAFKA_BROKERS)
    await producer.start()

    consumer = AIOKafkaConsumer(
        'market.data.ticks',
        bootstrap_servers=KAFKA_BROKERS,
        group_id='trading-engine'
    )
    await consumer.start()

    asyncio.create_task(consume_market_data())

@app.get("/health")
async def health_check():
    return {"status": "healthy"}
```

## Shared Libraries

### TypeScript Shared Types (`libs/shared-types/`)

```typescript
export interface MarketTickEvent {
  symbol: string;
  price: number;
  volume: number;
  timestamp: number;
}

export interface OrderEvent {
  orderId: string;
  symbol: string;
  side: 'buy' | 'sell';
  price: number;
  quantity: number;
  status: 'pending' | 'filled' | 'cancelled';
}
```

### Python Shared Utilities (`libs/shared-python/`)

```python
# vibetrading/kafka_utils.py
def get_kafka_brokers() -> str:
    return os.getenv("KAFKA_BROKERS", "localhost:8207")

# vibetrading/logger.py
def setup_logger(service_name: str):
    logging.basicConfig(
        level=logging.INFO,
        format=f'[{service_name}] %(asctime)s - %(levelname)s - %(message)s'
    )
    return logging.getLogger(service_name)
```

## Favicon Configuration

Custom SVG logo in browser tab:

- **File**: `apps/web/public/favicon.svg`
- **Colors**:
  - Outer frame: `#6e3ff3` (Violet - brand primary)
  - White elements: `#fff`
  - Red accent: `#b72025` (`.st0` class)
- **HTML**: `<link rel="icon" type="image/svg+xml" href="/favicon.svg" />`
- **Nginx**: Proper MIME types and caching configured

## Build and Deployment Scripts

### Build All (`tools/scripts/build-all.sh`)

```bash
# Build frontend and API
npx nx build web --configuration=production
npx nx build api --configuration=production

# Build all Docker images
docker build -f docker/web.Dockerfile -t <registry>/vibe-trading-web:latest .
docker build -f docker/api.Dockerfile -t <registry>/vibe-trading-api:latest .
for service in trading-engine market-data analytics ml-models; do
  docker build -f docker/$service.Dockerfile -t <registry>/vibe-trading-$service:latest .
done
```

### Push Images (`tools/scripts/push-images.sh`)

```bash
for image in web api trading-engine market-data analytics ml-models; do
  docker push <registry>/vibe-trading-$image:latest
done
```

### Deploy (`tools/scripts/deploy.sh`)

```bash
if [ -z "$KAFKA_BROKERS" ]; then
  docker-compose -f docker-compose.prod.yml --profile local-kafka up -d
else
  docker-compose -f docker-compose.prod.yml up -d
fi
```

### Development (`tools/scripts/dev.sh`)

```bash
# Start infrastructure
docker-compose up -d kafka redis

# Start services
npx nx serve web --port=8200 &
npx nx serve api &
cd apps/trading-engine && poetry run uvicorn src.main:app --reload --port 8202 &
```

## Observability Strategy (Progressive)

### Phase 1: Basic Monitoring (Immediate)

- **Portainer**: Container management and logs
- **Kafka UI**: Message flow visualization
- **Redis Commander**: Cache inspection

### Phase 2: Metrics Collection (After Stabilization)

- **Prometheus**: Metrics scraping
- **Grafana**: Dashboards and visualization

### Phase 3: Log Aggregation (Complete Solution)

- **Loki**: Log aggregation
- **Promtail**: Log collection from containers

All observability tools are optional and can be added progressively.

## Environment Variables

### `.env.example`

```bash
# Kafka
KAFKA_BROKERS=kafka:9092  # or external cluster

# Redis
REDIS_URL=redis://redis:6379

# API
NODE_ENV=development
API_PORT=8201

# Python Services
TRADING_ENGINE_PORT=8202
MARKET_DATA_PORT=8203
ANALYTICS_PORT=8204
ML_MODELS_PORT=8205

# Logging
LOG_LEVEL=INFO
```

### Configuration Loading

**Python (Pydantic Settings):**
```python
class Settings(BaseSettings):
    kafka_brokers: str = "localhost:8207"
    redis_url: str = "redis://localhost:8206"
    log_level: str = "INFO"
    port: int = 8202

    class Config:
        env_file = ".env"
```

**TypeScript:**
```typescript
export const config = {
  kafkaBrokers: process.env.KAFKA_BROKERS?.split(',') || ['localhost:8207'],
  redisUrl: process.env.REDIS_URL || 'redis://localhost:8206',
  port: parseInt(process.env.API_PORT || '8201'),
};
```

## Testing Strategy

### Frontend Tests
```bash
npx nx test web
```

### TypeScript API Tests
```bash
npx nx test api
```

### Python Service Tests
```bash
npx nx run trading-engine:test
# or
cd apps/trading-engine && poetry run pytest
```

### Run All Tests
```bash
npx nx run-many --target=test --all
```

## Migration Path from Current Structure

1. **Move existing projects to `apps/`**
   - `web/` → `apps/web/`
   - `api/` → `apps/api/`

2. **Create Python service skeletons**
   - `apps/trading-engine/`, `apps/market-data/`, etc.
   - Add `pyproject.toml` to each
   - Add `project.json` with Nx targets

3. **Add Docker infrastructure**
   - Create all Dockerfiles in `docker/`
   - Create `docker-compose.yml` and `docker-compose.prod.yml`

4. **Setup shared libraries**
   - `libs/shared-types/` for TypeScript
   - `libs/shared-python/` for Python utilities

5. **Add build scripts**
   - `tools/scripts/build-all.sh`
   - `tools/scripts/deploy.sh`
   - `tools/scripts/dev.sh`

6. **Update documentation**
   - README.md with new architecture
   - CLAUDE.md with development guidelines

## Implementation Phases

1. **Phase 1**: Restructure monorepo (move to `apps/`)
2. **Phase 2**: Add Python service skeletons
3. **Phase 3**: Create Dockerfiles
4. **Phase 4**: Setup docker-compose with Kafka
5. **Phase 5**: Add observability tools (Phase 1)
6. **Phase 6**: Update favicon and HTML
7. **Phase 7**: Add build scripts
8. **Phase 8**: Update documentation
9. **Phase 9**: Verify build and tests

## Success Criteria

- [ ] All services build successfully
- [ ] Docker Compose starts all services
- [ ] Frontend accessible at http://localhost:8200
- [ ] API Gateway responds at http://localhost:8201/health
- [ ] All Python services respond to health checks
- [ ] Kafka UI shows connected brokers
- [ ] All existing tests pass
- [ ] README and CLAUDE.md reflect new architecture

## Future Considerations

- Database integration (PostgreSQL)
- Authentication/Authorization
- CI/CD pipeline (GitHub Actions)
- Production Kafka cluster configuration
- Rate limiting and circuit breakers
- API versioning strategy
- WebSocket implementation for real-time frontend updates

## References

- Nx Documentation: https://nx.dev
- FastAPI: https://fastapi.tiangolo.com
- Apache Kafka: https://kafka.apache.org
- Docker Compose: https://docs.docker.com/compose
- Poetry: https://python-poetry.org
