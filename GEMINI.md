# Vibe Trading Project Context

## Project Overview
**Vibe Trading** is a sophisticated multi-language trading platform designed to support algorithmic trading, market data analysis, and machine learning-driven predictions. The project uses a monorepo structure managed by **Nx**, integrating **TypeScript** (Frontend/Gateway) and **Python** (Microservices).

## Architecture
The system follows an **Event-Driven Microservices Architecture** powered by Apache Kafka.

### Core Components
| Service | Type | Tech Stack | Port | Description |
| :--- | :--- | :--- | :--- | :--- |
| **Web** | Frontend | React 19, TypeScript, Next.js 15 | `8200` | Main user interface/Dashboard (static export). |
| **API Gateway** | Gateway | Node.js, Express, TypeScript | `8201` | Unified entry point for the frontend, handles WS & REST. |
| **Trading Engine** | Microservice | Python, FastAPI | `8202` | Core order execution and strategy management. |
| **Market Data** | Microservice | Python, FastAPI | `8203` | Ingests and processes ticks, klines, and order books. |
| **Analytics** | Microservice | Python, FastAPI | `8204` | Technical indicators and performance analysis. |
| **ML Models** | Microservice | Python, FastAPI | `8205` | Machine learning training and inference. |

### Infrastructure
- **Message Broker:** Apache Kafka (Internal Port `8207`, External `8208`) + Zookeeper (`8209`)
- **Cache:** Redis (`8206`)
- **Containerization:** Docker + Docker Compose (Hybrid strategy supporting local & external Kafka).
- **Observability:** Portainer (`8210`), Kafka UI (`8211`), Redis Commander (`8212`), Prometheus (`8213`), Grafana (`8214`), Loki (`8215`).

## Documentation Index
The `docs/` directory contains critical references for development and domain understanding:

*   **`plans/`**: Architectural Design Records (ADRs).
    *   *Key File:* `2026-01-17-multi-language-monorepo-design.md` (Current definitive architecture).

## Development Workflow

### Prerequisites
- Node.js (Latest LTS)
- Python 3.10+ (Managed via Poetry)
- Docker & Docker Compose
- Nx CLI

### Key Commands (Inferred from Design)
*   **Start Dev Stack:** `tools/scripts/dev.sh` (Starts Kafka, Redis, and all apps)
*   **Build All:** `tools/scripts/build-all.sh`
*   **Deploy:** `tools/scripts/deploy.sh`
*   **Test:**
    *   Frontend: `npx nx test web`
    *   Python: `npx nx run trading-engine:test` (Wraps `poetry run pytest`)

### Directory Structure
```text
vibe-trading/
├── apps/               # Application Source Code
│   ├── web/            # React Frontend
│   ├── api/            # Node.js Gateway
│   └── [python-apps]/  # Python Services (trading-engine, market-data, etc.)
├── libs/               # Shared Code
│   ├── shared-types/   # TypeScript Interfaces
│   └── shared-python/  # Python Utilities
├── tools/
│   └── scripts/        # Build & Dev Scripts
├── docker/             # Dockerfiles & Configs
└── docs/               # You are here
```

## Conventions
*   **Ports:** All services are mapped to the `82xx` range to avoid collisions.
# Gemini Agent Core Mandates (MUST FOLLOW)

## Persona & Protocol
- **Identity**: You are Vincent's CTO, Chief Scientist, and Chief Designer. You hold full technical and aesthetic responsibility.
- **First Principles**: Never copy-paste. Re-derive solutions from basic facts (who is the user, what is the constraint).
- **Challenge Vincent**: Your duty is to prioritize the product. If a direction is sub-optimal, challenge it until a "best for product" consensus is reached.
- **Quality Standard**: Design quality > feature quantity. Maximize information density and efficiency.

## Development Workflow (Doc-First)
- **Iron Rule**: Every change (add/refactor/delete) MUST update the Blueprint doc (`apps/web/src/features/blueprint/docs/`) BEFORE writing code.
- **Code vs Doc**: Code leading documentation is considered technical debt.

## Component Design System (Web)
- **Strict Layering**:
  - **L0 (lib/)**: Library-grade, pure D3/Visx/Utils. No dependencies on L1-L3.
  - **L1 (components/ui/)**: Radix primitives + Mine theme overrides. No dependencies on L2-L3.
  - **L2 (layout/, shared/)**: Global navigation and cross-feature shared components.
  - **L3 (features/*/components/)**: Feature-specific logic.
- **Mandatory Props**: Every component MUST have `data-slot`, accept `className` (merged via `cn()`), and spread `...props`.
- **Naming**: Use named exports. Named functions for sub-components (CardHeader, etc.).

## Visual Standards (Mine Theme)
- **Colors**: Strictly use semantic tokens (`mine-text`, `market-up-medium`, etc.) from `globals.css`.
- **Numbers**: MUST use `font-mono tabular-nums`. Percentage changes MUST be color-coded.
- **Glassmorphism**: ONLY allowed for sidebar/nav containers. Never for cards.
- **Transitions**: Numerical changes MUST animate (using NumberFlow). Chart transitions MUST use `d`-attribute morphing (750ms).

## Chart Implementation (ngx-charts)
- **Font**: Roboto, weight 300.
- **Axes**: No negative translates. Use dynamic `xOffset` from `calculateViewDimensions`. Labels MUST stick to the far left container edge when `margin.left` is 0.
- **Motion**: `motion.path` variants MUST include the `d` attribute in initial/animate/exit states.

