# Analytics Service

Data analytics and reporting service for Vibe Trading platform.

## Overview

This service handles:
- Technical indicator calculations
- Trading signal generation
- Performance analytics and metrics
- Historical data analysis
- Report generation

## Technology Stack

- **Framework**: FastAPI
- **Python**: 3.11+
- **Message Broker**: Apache Kafka (via aiokafka)
- **Cache**: Redis
- **Package Manager**: Poetry

## Development

### Setup

```bash
poetry install
# Or: npx nx run analytics:install
```

### Running Locally

```bash
poetry run uvicorn src.main:app --reload --port 8204
# Or: npx nx serve analytics
```

Service available at http://localhost:8204

### Testing

```bash
poetry run pytest
# Or: npx nx test analytics
```

## Configuration

- `KAFKA_BROKERS`: Kafka broker addresses (default: `localhost:8207`)
- `REDIS_URL`: Redis connection URL (default: `redis://localhost:8206`)
- `LOG_LEVEL`: Logging level (default: `INFO`)
- `PORT`: Service port (default: `8204`)

## Integration

This service:
- Subscribes to `market.data.*` and `trading.*` topics
- Publishes to `analytics.*` topics (indicators, signals, reports)
- Provides analytics data to frontend via API Gateway
