# Shared Types Library

Shared TypeScript types and interfaces for Vibe Trading platform.

## Overview

This library contains common TypeScript types used across:
- Frontend (React web app)
- API Gateway (TypeScript/Express)
- Any future TypeScript services

## Usage

### In Applications

Import types in your TypeScript code:

```typescript
import {
  MarketTickEvent,
  OrderEvent,
  ApiResponse
} from '@vibe-trading/shared-types';

// Use in your code
const tick: MarketTickEvent = {
  symbol: 'BTC/USD',
  price: 50000,
  volume: 1.5,
  timestamp: Date.now()
};
```

### In API Gateway

```typescript
import { ApiResponse, OrderEvent } from '@vibe-trading/shared-types';

app.post('/orders', (req, res) => {
  const order: OrderEvent = req.body;
  const response: ApiResponse<OrderEvent> = {
    success: true,
    data: order,
    timestamp: Date.now()
  };
  res.json(response);
});
```

## Available Types

### Kafka Events
- `MarketTickEvent` - Real-time price ticks
- `KlineEvent` - Candlestick data
- `OrderBookEvent` - Order book updates
- `OrderEvent` - Order lifecycle events
- `PositionEvent` - Position updates
- `IndicatorEvent` - Technical indicators
- `SignalEvent` - Trading signals
- `PredictionEvent` - ML predictions

### API Types
- `ApiResponse<T>` - Standard API response wrapper
- `HealthResponse` - Health check response

### Configuration Types
- `KafkaConfig` - Kafka connection config
- `RedisConfig` - Redis connection config

## Development

### Building

```bash
npx nx build shared-types
```

### Linting

```bash
npx nx lint shared-types
```

## Notes

- All types are exported from `src/index.ts`
- Use semantic versioning when updating types
- Breaking changes should be coordinated across all consuming services
