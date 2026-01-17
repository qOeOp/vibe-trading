# Trading Engine Service

Trading algorithms and strategy execution service for Vibe Trading platform.

## Overview

This service handles:
- Trading strategy execution
- Order management and lifecycle
- Position tracking and risk management
- Trading signals processing from Kafka

## Technology Stack

- **Framework**: FastAPI
- **Python**: 3.11+
- **Message Broker**: Apache Kafka (via aiokafka)
- **Cache**: Redis
- **Package Manager**: Poetry

## Development

### Setup

```bash
# Install dependencies
poetry install

# Or using Nx
npx nx run trading-engine:install
```

### Running Locally

```bash
# Using Poetry
poetry run uvicorn src.main:app --reload --port 8202

# Or using Nx
npx nx serve trading-engine
```

The service will be available at http://localhost:8202

### Testing

```bash
# Run tests
poetry run pytest

# Or using Nx
npx nx test trading-engine

# With coverage
poetry run pytest --cov=src tests/
```

### Linting and Formatting

```bash
# Lint
poetry run ruff check src/ tests/

# Format
poetry run ruff format src/ tests/

# Or using Nx
npx nx lint trading-engine
npx nx format trading-engine
```

## API Endpoints

### Health Check
```
GET /health
```

Returns service health status.

### Root
```
GET /
```

Returns service information.

## Configuration

Configuration is managed through environment variables and `src/config.py`:

- `KAFKA_BROKERS`: Kafka broker addresses (default: `localhost:8207`)
- `REDIS_URL`: Redis connection URL (default: `redis://localhost:8206`)
- `LOG_LEVEL`: Logging level (default: `INFO`)
- `PORT`: Service port (default: `8202`)

## Docker

Build the Docker image:

```bash
npx nx docker-build trading-engine
```

## Integration

This service:
- Subscribes to `market.data.*` topics for market data
- Publishes to `trading.*` topics for order events
- Communicates with other services via Kafka event bus
