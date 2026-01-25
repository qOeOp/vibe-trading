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
*   **Data Flow:** Market Data Service -> Kafka -> Trading/Analytics/ML -> Kafka -> API Gateway -> Frontend (WS).
*   **Python in Nx:** Uses `nx:run-commands` to wrap Poetry and Uvicorn commands.
*   **Image Naming:** Aliyun CR format (e.g., `crpi-.../vibe-trading-<service>:latest`).
