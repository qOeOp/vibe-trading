# Operational Standards

This document covers the "Day 2" concerns of software: Testing, Logging, and Error Handling.

## 1. Testing (TDD Mandate)

All code changes must follow the Test-Driven Development (TDD) cycle.

### Test Pyramid
- **Unit Tests (>80% coverage)**: Mandatory for all new business logic.
- **Integration Tests**: Required for Kafka producers/consumers and API endpoints.
- **E2E Tests**: Required for critical user flows (e.g., Auth, Placing an Order).

### Tooling
- **Frontend/API**: Jest
- **Python**: Pytest

---

## 2. Structured Logging

Logs are for machines to parse and humans to read.

### Guidelines
- **No `print()`**: Use the project's standard logger (`vibetrading.logger` in Python).
- **Log Levels**:
    - `DEBUG`: Verbose information for development.
    - `INFO`: Normal operational events (e.g., "Order processed").
    - `WARNING`: Unexpected events that don't stop the system (e.g., "Kafka retry").
    - `ERROR`: Events that require immediate attention (e.g., "Database connection failed").
- **Context**: Always include relevant IDs in log messages (e.g., `user_id`, `order_id`).

---

## 3. Error Handling

### Backend (Python/FastAPI)
- **Standardized Response**: All errors should return a consistent JSON structure.
```json
{
  "error": {
    "code": "INSUFFICIENT_FUNDS",
    "message": "User has insufficient balance for this trade.",
    "request_id": "uuid-v4"
  }
}
```
- **Fail Fast**: Validate inputs at the boundary (Pydantic/Zod) and fail immediately.

### Frontend (React)
- **Error Boundaries**: Use React Error Boundaries to prevent a single component crash from taking down the entire app.
- **Toast Notifications**: Use non-intrusive toast notifications for non-fatal errors.
- **Global Error State**: Use the `api-gateway` WebSocket connection to broadcast critical system errors to the UI.

## 4. Observability
- **Correlation IDs**: All requests should carry a correlation ID (Request ID) across microservices via Kafka headers and HTTP headers for distributed tracing.