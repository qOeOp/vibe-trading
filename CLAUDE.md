# Vibe Trading - Claude Code Guidelines

## Project Overview

Vibe Trading is a modern, event-driven trading platform built with a multi-language monorepo architecture. The project combines TypeScript (React frontend + Express API) and Python (FastAPI microservices) with Kafka event streaming.

## Tech Stack

### TypeScript Stack
- **Frontend**: React 19, TypeScript, Vite
- **API**: Express.js with TypeScript
- **Routing**: React Router v6
- **Styling**: Tailwind CSS v4 with OKLCH color space
- **UI Components**: Radix UI primitives with custom styling
- **Charts**: Recharts v3
- **State Management**: Zustand
- **Icons**: Lucide React

### Python Stack
- **Framework**: FastAPI
- **Async**: aiokafka for Kafka integration
- **Caching**: Redis (sync and async clients)
- **Validation**: Pydantic
- **Dependency Management**: Poetry
- **Testing**: pytest with pytest-asyncio
- **Linting/Formatting**: Ruff

### Infrastructure
- **Monorepo**: Nx 22.3.3
- **Message Streaming**: Apache Kafka 7.6.0
- **Caching**: Redis 7
- **Containerization**: Docker with multi-stage builds

## Architecture

### Monorepo Structure

```
vibe-trading/
├── apps/
│   ├── web/                    # React frontend (TypeScript)
│   ├── api/                    # Express API (TypeScript)
│   ├── trading-engine/         # Python FastAPI service
│   ├── market-data/            # Python FastAPI service
│   ├── analytics/              # Python FastAPI service
│   └── ml-models/              # Python FastAPI service
└── libs/
    ├── shared-types/           # Shared TypeScript types
    └── shared-python/          # Shared Python utilities
```

### Service Communication

- **Frontend → API**: HTTP/REST
- **API → Python Services**: Kafka events
- **Python Services ↔ Python Services**: Kafka events
- **All Services → Redis**: Direct connection for caching

## Code Style and Conventions

### TypeScript File Organization

```
apps/web/src/
├── app/              # App routing and configuration
├── components/       # Shared components
│   ├── ui/          # Base UI components (buttons, inputs, etc.)
│   └── ...          # Feature-agnostic components
├── features/        # Feature modules
│   └── dashboard/
│       ├── components/  # Feature-specific components
│       ├── pages/       # Page components
│       ├── data/        # Mock data and constants
│       └── store/       # State management
└── styles.css       # Global styles
```

### Python Service Structure

```
apps/<service>/
├── src/
│   ├── __init__.py
│   ├── main.py          # FastAPI app
│   ├── config.py        # Pydantic settings
│   ├── routes/          # API routes
│   ├── services/        # Business logic
│   └── models/          # Data models
├── tests/
│   ├── __init__.py
│   ├── test_main.py
│   └── test_*.py
├── pyproject.toml       # Poetry dependencies
└── project.json         # Nx configuration
```

### Component Guidelines

1. **Component Structure**
   - Use functional components with hooks
   - Export components as named exports (not default)
   - Keep components focused and single-purpose
   - Co-locate related components in feature directories

2. **TypeScript**
   - Always use explicit types for props and function signatures
   - Avoid `any` - use `unknown` when type is truly unknown
   - Use type inference where obvious
   - Define types inline for simple props, separate interface for complex ones

3. **React Patterns**
   - Use React 19 features (no legacy patterns)
   - Prefer composition over inheritance
   - Extract complex logic into custom hooks
   - Keep JSX readable - extract complex expressions

### Styling Conventions

1. **Tailwind CSS**
   - Use Tailwind utility classes for styling
   - Follow mobile-first responsive design: `sm:`, `md:`, `lg:`, `xl:`
   - Use semantic color tokens from the design system
   - Prefer `className` composition over inline styles

2. **Color Palette (Violet Bloom Theme)**
   ```
   Primary:    #6e3ff3 (violet)
   Accent:     #df3674 (pink)
   Secondary:  #35b9e9 (cyan)
   Tertiary:   #375dfb (blue)
   Supporting: #e255f2 (magenta)
   ```

3. **Border Radius System**
   ```
   --radius-sm:  0.425rem  (6.8px)
   --radius-md:  0.625rem  (10px)
   --radius-lg:  0.625rem  (10px)
   --radius-xl:  1.025rem  (16.4px)
   ```

### Import Conventions

1. **Import Order**
   ```typescript
   // 1. External libraries
   import { useState } from "react";
   import { Button } from "@/components/ui/button";

   // 2. Internal modules (feature-level)
   import { useStore } from "../store/use-store";

   // 3. Local imports (same directory)
   import { helper } from "./helper";

   // 4. Types
   import type { User } from "../types";
   ```

2. **Path Aliases**
   - Use `@/` for absolute imports from `src/`
   - Use relative imports for feature-internal modules
   - Use named imports (not `import *`)

### Chart Components

1. **Recharts Best Practices**
   - Always use `ResponsiveContainer` with `initialDimension` prop
   - Keep chart data separate from component logic
   - Use consistent color schemes from design system
   - Implement proper TypeScript types for chart data

2. **Chart Data Management**
   - Data should be internal to chart components (not passed as props)
   - Use state for interactive features (filters, time ranges)
   - Keep data transformations in helper functions

### Component-Specific Rules

1. **No Next.js Directives**
   - Never use `"use client"` or `"use server"` (this is a Vite project)
   - Avoid Next.js-specific imports or patterns

2. **Theme Management**
   - Dark mode is hardcoded in `main.tsx`
   - Don't use `next-themes` or external theme providers
   - Use Tailwind's dark mode classes when needed

3. **Data Props**
   - Chart components manage their own data internally
   - Don't pass data as props to chart components
   - Use composition for complex data flows

## Testing

- Use `data-testid` attributes for test selectors
- Follow naming convention: `page-{name}`, `dashboard-{component}-{name}`
- Keep test IDs descriptive and unique

## Python Development Guidelines

### Code Style

1. **Type Hints**
   - Always use type hints for function parameters and return values
   - Use modern type syntax (Python 3.11+)
   - Use `from __future__ import annotations` for forward references

   ```python
   from __future__ import annotations

   async def process_order(order_id: str, amount: float) -> dict[str, Any]:
       ...
   ```

2. **Async/Await**
   - Use `async`/`await` for I/O operations (Kafka, Redis, HTTP)
   - Don't mix sync and async code
   - Use `asyncio` properly with context managers

   ```python
   async with create_producer() as producer:
       await producer.send("topic", value=message)
   ```

3. **Pydantic Models**
   - Use Pydantic for data validation
   - Define models for all API requests/responses
   - Use `BaseSettings` for configuration

   ```python
   from pydantic import BaseModel, Field
   from pydantic_settings import BaseSettings

   class OrderRequest(BaseModel):
       symbol: str = Field(..., min_length=1)
       quantity: float = Field(..., gt=0)
   ```

4. **Error Handling**
   - Use specific exception types
   - Always handle Kafka connection errors
   - Log errors with context
   - Return proper HTTP status codes

   ```python
   try:
       await producer.send("topic", value=data)
   except KafkaError as e:
       logger.error(f"Kafka error: {e}", exc_info=True)
       raise HTTPException(status_code=503, detail="Service unavailable")
   ```

### Dependency Management

1. **Poetry**
   - Use Poetry for all Python projects
   - Pin major versions, allow minor/patch updates
   - Separate dev dependencies

   ```toml
   [tool.poetry.dependencies]
   python = "^3.11"
   fastapi = "^0.115.0"

   [tool.poetry.group.dev.dependencies]
   pytest = "^8.3.0"
   ```

2. **Shared Python Library**
   - Import from `vibetrading` package
   - Use shared utilities for Kafka, Redis, logging

   ```python
   from vibetrading.kafka_utils import create_producer
   from vibetrading.logger import setup_logger
   ```

### Testing Python Services

1. **Pytest**
   - Use pytest for all tests
   - Use pytest-asyncio for async tests
   - Name test files `test_*.py`

   ```python
   import pytest
   from httpx import AsyncClient

   @pytest.mark.asyncio
   async def test_health_endpoint():
       async with AsyncClient(app=app, base_url="http://test") as client:
           response = await client.get("/health")
           assert response.status_code == 200
   ```

2. **Test Organization**
   - Unit tests in `tests/` directory
   - Mock external services (Kafka, Redis)
   - Test error cases

### Nx Integration for Python

1. **Project Configuration**
   - Each Python service has `project.json`
   - Use `nx:run-commands` executor
   - Define targets: install, serve, test, lint, format

   ```json
   {
     "targets": {
       "serve": {
         "executor": "nx:run-commands",
         "options": {
           "command": "poetry run uvicorn src.main:app --host 0.0.0.0 --port 8001",
           "cwd": "apps/trading-engine"
         }
       }
     }
   }
   ```

2. **Running Python Services**
   ```bash
   # Start service
   npx nx run trading-engine:serve

   # Run tests
   npx nx run trading-engine:test

   # Lint code
   npx nx run trading-engine:lint

   # Format code
   npx nx run trading-engine:format
   ```

### Kafka Event Patterns

1. **Producer Pattern**
   ```python
   from vibetrading.kafka_utils import create_producer

   async def publish_trade_event(trade: Trade):
       producer = await create_producer(
           brokers=settings.kafka_brokers,
           client_id="trading-engine"
       )
       await producer.send(
           "trades.executed",
           value=trade.model_dump_json().encode()
       )
   ```

2. **Consumer Pattern**
   ```python
   from vibetrading.kafka_utils import create_consumer

   async def consume_market_data():
       consumer = await create_consumer(
           topics=["market.data.ticks"],
           group_id="trading-engine",
           brokers=settings.kafka_brokers
       )
       async for msg in consumer:
           data = json.loads(msg.value.decode())
           await process_tick(data)
   ```

### Docker Best Practices

1. **Multi-Stage Builds**
   - Use builder stage for dependencies
   - Copy only necessary files to runtime
   - Don't include dev dependencies in production

2. **Health Checks**
   - Every service must have `/health` endpoint
   - Health checks in Dockerfile and docker-compose.yml
   - **CRITICAL**: Use `127.0.0.1` instead of `localhost` in Alpine Linux containers
   - Reason: `localhost` resolves to IPv6 (`::1`) in Alpine, causing connection failures

   **Python FastAPI:**
   ```python
   @app.get("/health")
   async def health_check():
       return {"status": "healthy", "service": "trading-engine", "version": "0.1.0"}
   ```

   **TypeScript Express:**
   ```typescript
   app.get('/health', (req, res) => {
       res.status(200).send({ status: 'healthy', service: 'api' });
   });
   ```

   **Dockerfile Health Check (Alpine Linux):**
   ```dockerfile
   # Use 127.0.0.1 (IPv4) instead of localhost
   HEALTHCHECK --interval=30s --timeout=3s --start-period=30s --retries=3 \
     CMD ["sh", "-c", "wget --quiet --tries=1 --spider http://127.0.0.1:3000/health"]
   ```

   **docker-compose.yml Health Check:**
   ```yaml
   healthcheck:
     test: ["CMD", "wget", "--quiet", "--tries=1", "--spider", "http://127.0.0.1:3000/health"]
     interval: 30s
     timeout: 3s
     retries: 3
   ```

3. **Container Networking**
   - Services must listen on `0.0.0.0` for external container access
   - Use `127.0.0.1` for health checks (IPv4)
   - Never use `localhost` in Alpine Linux containers (IPv6 resolution issue)

   **Express.js:**
   ```typescript
   const host = process.env.HOST ?? '0.0.0.0';  // Listen on all interfaces
   app.listen(port, host, () => {
       console.log(`Server ready at http://${host}:${port}`);
   });
   ```

   **FastAPI (default binds to 0.0.0.0):**
   ```bash
   uvicorn src.main:app --host 0.0.0.0 --port 8001
   ```

## Development Commands

### TypeScript Services
```bash
# Start development server
npx nx run web:serve --port=4200

# Build for production
npx nx run web:build

# Run linter
npx nx run web:lint
```

### Python Services
```bash
# Serve Python service
npx nx run trading-engine:serve

# Test Python service
npx nx run trading-engine:test

# Lint Python code
npx nx run trading-engine:lint

# Format Python code
npx nx run trading-engine:format
```

### All Services
```bash
# Build all services
npx nx run-many --target=build --all

# Test all services
npx nx run-many --target=test --all

# Format all code
npx nx format:write

# View project graph
npx nx graph
```

## Git Workflow

- Use git worktrees for feature development
- Follow conventional commit messages
- Keep commits atomic and focused
- Merge completed work to `main` branch

## Performance Considerations

1. **Component Optimization**
   - Use React.memo() for expensive components
   - Implement proper dependency arrays in hooks
   - Avoid unnecessary re-renders

2. **Bundle Size**
   - Use dynamic imports for large components
   - Avoid importing entire libraries
   - Tree-shake unused dependencies

## Accessibility

- Use semantic HTML elements
- Include ARIA labels for interactive elements
- Ensure keyboard navigation works
- Test with screen readers

## Error Handling

- Use error boundaries for component errors
- Provide user-friendly error messages
- Log errors for debugging
- Handle loading and error states

## Code Review Checklist

### TypeScript Code
- [ ] TypeScript types are explicit and correct
- [ ] No `any` types without justification
- [ ] Components follow single responsibility
- [ ] Imports are organized and clean
- [ ] No Next.js-specific code
- [ ] Tailwind classes are used consistently
- [ ] Responsive design is implemented
- [ ] Test IDs are added where needed
- [ ] No console.log() statements left in code
- [ ] Code is formatted with Prettier

### Python Code
- [ ] Type hints on all functions
- [ ] Pydantic models for data validation
- [ ] Async/await used correctly
- [ ] Error handling with specific exceptions
- [ ] Kafka errors handled gracefully
- [ ] Tests use pytest-asyncio for async code
- [ ] Code formatted with Ruff
- [ ] No print() statements (use logger)
- [ ] Dependencies added to pyproject.toml
- [ ] Health endpoint exists and returns 200

## Common Pitfalls to Avoid

### TypeScript Pitfalls
1. ❌ Using `"use client"` directive (this is not Next.js)
2. ❌ Passing data props to chart components
3. ❌ Using `next-themes` for theme management
4. ❌ Mixing inline styles with Tailwind
5. ❌ Creating components without TypeScript types
6. ❌ Using default exports
7. ❌ Hardcoding values that should be in constants
8. ❌ Not handling loading/error states

### Python Pitfalls
1. ❌ Missing type hints on functions
2. ❌ Mixing sync and async code
3. ❌ Not handling Kafka connection errors
4. ❌ Using print() instead of logger
5. ❌ Not using Pydantic for validation
6. ❌ Hardcoding configuration (use pydantic-settings)
7. ❌ Missing health check endpoints
8. ❌ Not testing async code with pytest-asyncio
9. ❌ Installing packages without Poetry
10. ❌ Not using shared utilities from libs/shared-python

### Docker Pitfalls
1. ❌ Using `localhost` in health checks (use `127.0.0.1` in Alpine Linux)
2. ❌ Services listening on `localhost` instead of `0.0.0.0` in containers
3. ❌ Not setting adequate `start-period` for health checks (min 30s)
4. ❌ Missing health endpoints in services
5. ❌ Using `npm ci` without synced package-lock.json (use `npm install` in containers)
6. ❌ Forgetting to expose ports in Dockerfile
7. ❌ Not handling IPv6 resolution issues in Alpine containers

## Resources

### TypeScript/Frontend
- [React 19 Documentation](https://react.dev)
- [Tailwind CSS v4](https://tailwindcss.com)
- [Recharts Documentation](https://recharts.org)
- [Radix UI](https://www.radix-ui.com)

### Python/Backend
- [FastAPI Documentation](https://fastapi.tiangolo.com)
- [Pydantic Documentation](https://docs.pydantic.dev)
- [aiokafka Documentation](https://aiokafka.readthedocs.io)
- [Poetry Documentation](https://python-poetry.org/docs)

### Infrastructure
- [Nx Documentation](https://nx.dev)
- [Apache Kafka Documentation](https://kafka.apache.org/documentation)
- [Redis Documentation](https://redis.io/docs)
- [Docker Best Practices](https://docs.docker.com/develop/dev-best-practices)

## Contact

- **Author**: Vincent Xu
- **Email**: vincent@vibe.trading
- **GitHub**: https://github.com/qOeOp/vibe-trading
