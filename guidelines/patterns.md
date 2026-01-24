# Architectural Design Patterns

This document details the common design patterns used across Vibe Trading to solve recurring architectural challenges.

## 1. Strategy Pattern
Use the Strategy Pattern to define a family of algorithms, encapsulate each one, and make them interchangeable.

**Use Case**: Implementing different trading strategies (e.g., Momentum, Mean Reversion, Arbitrage).

**Example (Python)**:
```python
from abc import ABC, abstractmethod

class TradingStrategy(ABC):
    @abstractmethod
    def decide(self, market_data): ...

class MomentumStrategy(TradingStrategy):
    def decide(self, market_data):
        # Implementation for momentum
        return "BUY"

class StrategyExecutor:
    def __init__(self, strategy: TradingStrategy):
        self._strategy = strategy

    def execute(self, data):
        return self._strategy.decide(data)
```

---

## 2. Repository Pattern
Use the Repository Pattern to mediate between the domain and data mapping layers. This decouples the business logic from data access details.

**Use Case**: Managing order persistence or market data snapshots.

**Example (Python)**:
```python
class OrderRepository(ABC):
    @abstractmethod
    def save(self, order): ...
    @abstractmethod
    def get_by_id(self, order_id): ...

class MongoOrderRepository(OrderRepository):
    # Implementation using MongoDB
    pass

class PostgresOrderRepository(OrderRepository):
    # Implementation using PostgreSQL
    pass
```

---

## 3. Factory Pattern
Use the Factory Pattern to create objects without specifying the exact class of object that will be created.

**Use Case**: Dynamically selecting an execution service or a machine learning model based on configuration.

**Example (TypeScript)**:
```typescript
interface ExchangeClient {
  placeOrder(order: Order): Promise<void>;
}

class BinanceClient implements ExchangeClient { ... }
class KrakenClient implements ExchangeClient { ... }

class ExchangeFactory {
  static getClient(exchangeName: string): ExchangeClient {
    if (exchangeName === 'binance') return new BinanceClient();
    if (exchangeName === 'kraken') return new KrakenClient();
    throw new Error('Unsupported exchange');
  }
}
```

---

## 4. Observer Pattern (Pub/Sub)
Used heavily via Kafka and WebSockets.
- **Microservices**: Services observe Kafka topics and react to events.
- **Frontend**: Components observe store changes (Zustand) or WebSocket streams.

## 5. Dependency Injection (DI)
Mandatory for decoupling.
- **FastAPI**: Use the `Depends()` system.
- **React**: Use Context API or specialized libraries if needed (though Props/Hooks often suffice).