# Event-Driven Patterns (Kafka)

Kafka is the backbone of Vibe Trading. Adhering to these patterns ensures system reliability, data consistency, and scalability.

## 1. Producer Standards

### Idempotency
- **Enable Idempotence**: All producers must set `enable.idempotence=true` to prevent duplicate messages during retries.
- **Message Keys**: Always use a meaningful key (e.g., `order_id`, `symbol`) for messages to ensure that all events for a specific entity are processed in the same order by consumers.

### Schema Management
- **Schema Registry**: Use the Schema Registry to manage event schemas (Avro preferred, JSON Schema as alternative).
- **Backward Compatibility**: Never make breaking changes to schemas. Only add optional fields or remove optional fields.

---

## 2. Consumer Standards

### Idempotent Consumers
- **De-duplication**: Consumers must be able to handle the same message multiple times without unintended side effects. Use a database unique constraint or a "processed_events" table.
- **Atomic Commits**: Ensure that offset commits and database updates happen atomically where possible.

### Error Handling & DLQ
- **Retry Logic**: Implement exponential backoff for transient errors (e.g., network timeout).
- **Dead Letter Queue (DLQ)**: If a message fails after maximum retries or is malformed (poison pill), it must be sent to a DLQ topic (e.g., `orders.dlq`) for manual investigation. Never stop the consumer due to a single bad message.

---

## 3. Event Design

### Event vs. Command
- **Events**: Facts that have happened (Past tense: `OrderPlaced`, `TradeExecuted`). Use these for broadcasting state changes.
- **Commands**: Requests to perform an action (Imperative: `PlaceOrder`, `CancelTrade`). Use these for point-to-point communication via Kafka.

### Payload Structure
- **Metadata**: Every event must include a standard metadata header.
```json
{
  "header": {
    "event_id": "uuid-v4",
    "timestamp": "ISO-8601",
    "source": "trading-engine",
    "version": "1.0"
  },
  "payload": {
    "order_id": "123",
    "action": "BUY"
  }
}
```

## 4. Performance & Scaling
- **Consumer Groups**: Use consumer groups for horizontal scaling.
- **Partitioning**: Design partitioning keys to balance load while maintaining order for related entities.