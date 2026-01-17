# Shared Python Utilities

Shared Python utilities and helpers for Vibe Trading platform services.

## Overview

This library provides common utilities used across all Python microservices:
- Kafka connection and management utilities
- Logging configuration
- Redis client utilities
- Common helper functions

## Installation

```bash
# Using Poetry
poetry add vibetrading-shared --path ../shared-python

# Or install in development
cd libs/shared-python
poetry install
```

## Usage

### Kafka Utilities

```python
from vibetrading.kafka_utils import create_producer, create_consumer

# Create producer
producer = await create_producer(
    brokers="localhost:8207",
    client_id="trading-engine"
)

# Create consumer
consumer = await create_consumer(
    topics=["market.data.ticks"],
    group_id="trading-engine",
    brokers="localhost:8207"
)
```

### Logging

```python
from vibetrading.logger import setup_logger

# Setup logger for your service
logger = setup_logger("trading-engine", level="INFO")

logger.info("Service started")
logger.error("An error occurred", exc_info=True)
```

### Redis Utilities

```python
from vibetrading.redis_utils import create_redis_client, create_async_redis_client

# Synchronous client
redis_client = create_redis_client()
redis_client.set("key", "value")

# Async client
async_redis = create_async_redis_client()
await async_redis.set("key", "value")
```

## Available Modules

### `kafka_utils`
- `get_kafka_brokers()` - Get broker addresses from environment
- `parse_kafka_brokers(brokers)` - Parse broker string to list
- `create_producer(**kwargs)` - Create Kafka producer
- `create_consumer(topics, group_id, **kwargs)` - Create Kafka consumer

### `logger`
- `setup_logger(service_name, level, format_string)` - Configure logger
- `get_logger(name)` - Get logger instance

### `redis_utils`
- `get_redis_url()` - Get Redis URL from environment
- `create_redis_client(**kwargs)` - Create sync Redis client
- `create_async_redis_client(**kwargs)` - Create async Redis client

## Development

### Testing

```bash
poetry run pytest
# Or using Nx
npx nx test shared-python
```

### Linting

```bash
poetry run ruff check vibetrading/ tests/
# Or using Nx
npx nx lint shared-python
```

### Formatting

```bash
poetry run ruff format vibetrading/ tests/
# Or using Nx
npx nx format shared-python
```

## Environment Variables

The utilities read these environment variables:
- `KAFKA_BROKERS` - Kafka broker addresses (default: `localhost:8207`)
- `REDIS_URL` - Redis connection URL (default: `redis://localhost:8206`)

## Integration with Services

To use in your service, add as a dependency in `pyproject.toml`:

```toml
[tool.poetry.dependencies]
vibetrading-shared = {path = "../../libs/shared-python", develop = true}
```

Then import in your code:

```python
from vibetrading.kafka_utils import create_producer
from vibetrading.logger import setup_logger
```
