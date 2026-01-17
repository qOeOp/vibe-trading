# Market Data Service

Market data processing and distribution service for Vibe Trading platform.

## Overview

This service handles:
- Real-time market data ingestion
- Tick data processing and normalization
- Candlestick (K-line) generation
- Order book updates
- Market data distribution via Kafka

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
# Or: npx nx run market-data:install
```

### Running Locally

```bash
poetry run uvicorn src.main:app --reload --port 8203
# Or: npx nx serve market-data
```

Service available at http://localhost:8203

### Testing

```bash
poetry run pytest
# Or: npx nx test market-data
```

## Configuration

- `KAFKA_BROKERS`: Kafka broker addresses (default: `localhost:8207`)
- `REDIS_URL`: Redis connection URL (default: `redis://localhost:8206`)
- `LOG_LEVEL`: Logging level (default: `INFO`)
- `PORT`: Service port (default: `8203`)

## Integration

This service:
- Publishes to `market.data.*` topics (ticks, klines, orderbook)
- Consumed by Trading Engine, Analytics, and ML Models services
