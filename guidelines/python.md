# Python & FastAPI Coding Standards

These standards apply to all Python microservices in the `apps/` directory.

## 1. Python Standards

### Style & Linting
- **PEP 8**: Strictly adhere to PEP 8.
- **Ruff**: Use Ruff for linting and formatting. Configuration is defined in the root `pyproject.toml`.
- **Docstrings**: Use Google-style docstrings for all public modules, classes, and functions.

### Type Hinting
- **Mandatory Typing**: All function signatures must be fully type-hinted.
- **Pydantic**: Use Pydantic models for data validation and configuration.
- **Strict Mode**: MyPy/Ruff should be configured to fail on missing types in public APIs.

### Naming Conventions
- **Classes**: `PascalCase` (e.g., `MarketDataService`).
- **Variables/Functions/Methods**: `snake_case` (e.g., `get_market_tick`).
- **Constants**: `UPPER_SNAKE_CASE` (e.g., `KAFKA_BOOTSTRAP_SERVERS`).
- **Files/Modules**: `snake_case` (e.g., `data_processor.py`).

---

## 2. FastAPI Standards

### Endpoint Design
- **Async by Default**: Use `async def` for all path operation functions.
- **Dependency Injection**: Leverage FastAPI's `Depends` for shared logic, database sessions, and security checks.
- **Response Models**: Always define a `response_model` for every endpoint to ensure data validation and documentation accuracy.

### Exception Handling
- **Global Exception Handlers**: Use FastAPI exception handlers to catch and format errors into a standardized JSON response.
- **HTTPException**: Use `fastapi.HTTPException` for client-facing errors with clear status codes and messages.

### Project Structure (Microservice)
```text
src/
├── main.py          # Entry point, app initialization
├── config.py        # Settings via Pydantic BaseSettings
├── api/             # API routes/endpoints
├── services/        # Business logic
├── models/          # Pydantic schemas and database models
└── core/            # Shared utilities (logging, auth)
```

## Example: Good FastAPI Endpoint
```python
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel

router = APIRouter()

class OrderResponse(BaseModel):
    order_id: str
    status: str

@router.post("/orders", response_model=OrderResponse)
async def create_order(
    order: OrderCreateSchema,
    service: TradingService = Depends(get_trading_service)
) -> OrderResponse:
    """
    Creates a new trading order.
    """
    try:
        return await service.process_order(order)
    except InsufficientFundsError as e:
        raise HTTPException(status_code=400, detail=str(e))
```