# ML Models Service

Machine learning predictions and model serving for Vibe Trading platform.

## Overview

This service handles:
- ML model inference and predictions
- Pattern recognition in market data
- Price prediction models
- Automated trading decision support
- Model training and updates

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
# Or: npx nx run ml-models:install
```

### Running Locally

```bash
poetry run uvicorn src.main:app --reload --port 8205
# Or: npx nx serve ml-models
```

Service available at http://localhost:8205

### Testing

```bash
poetry run pytest
# Or: npx nx test ml-models
```

## Configuration

- `KAFKA_BROKERS`: Kafka broker addresses (default: `localhost:8207`)
- `REDIS_URL`: Redis connection URL (default: `redis://localhost:8206`)
- `LOG_LEVEL`: Logging level (default: `INFO`)
- `PORT`: Service port (default: `8205`)

## Integration

This service:
- Subscribes to `market.data.*` topics for real-time data
- Publishes to `ml.predictions` and `ml.training.complete` topics
- Provides prediction endpoints for Trading Engine and Analytics
