# Vibe Trading

A modern, event-driven trading platform built with a multi-language monorepo architecture combining TypeScript (React + Express) and Python (FastAPI microservices) with Kafka message streaming.

## Architecture

```
┌─────────────┐
│   Browser   │
└──────┬──────┘
       │
       ↓
┌─────────────┐         ┌───────────────┐
│  Web (TS)   │────────→│   API (TS)    │
│  Next.js 15 │         │   Express     │
│  React 19   │         └───────┬───────┘
└─────────────┘                │
                               ↓
                       ┌───────────────┐
                       │     Kafka     │
                       │  Event Stream │
                       └───────┬───────┘
                               │
        ┌──────────────────────┼────────────────────────┐
        ↓                      ↓                        ↓
┌────────────────┐    ┌────────────────┐     ┌────────────────┐
│ Trading Engine │    │  Market Data   │     │   Analytics    │
│  (Python)      │    │   (Python)     │     │   (Python)     │
└────────────────┘    └────────────────┘     └────────────────┘
                               │
                               ↓
                       ┌───────────────┐
                       │   ML Models   │
                       │   (Python)    │
                       └───────────────┘
```

## Project Structure

```
vibe-trading/
├── apps/
│   ├── web/                    # React frontend (Next.js 15, static export)
│   ├── wiki/                   # Documentation site (Next.js/MDX)
│   ├── api/                    # Express API gateway (TypeScript)
│   ├── trading-engine/         # Trading logic service (Python/FastAPI)
│   ├── market-data/            # Market data processing (Python/FastAPI)
│   ├── analytics/              # Analytics service (Python/FastAPI)
│   └── ml-models/              # ML prediction service (Python/FastAPI)
│
├── libs/
│   ├── shared-types/           # Shared TypeScript types
│   └── shared-python/          # Shared Python utilities
│
├── conductor/                  # Workflow management & product docs
├── guidelines/                 # Coding guidelines (Kafka, Python, TS, ops)
├── docs/                       # Project plans & design assets
│
├── docker/                     # Dockerfiles and nginx config
├── docker-compose.yml          # Development compose
├── docker-compose.prod.yml     # Production compose
└── .env.example                # Environment variables template
```

## Frontend Features

### Pages & Routes

| Route | Feature | Description |
|-------|---------|-------------|
| `/login` | Auth | Login page |
| `/market` | Market | Sector treemap, k-line charts, market breadth, AI chat |
| `/factor` | Factor Analysis | Band chart, polar calendar, leaderboard, quantile charts |
| `/factor/home` | Factor Home | Alternative factor view |
| `/factor/library` | Factor Library | Factor discovery grid with filters |
| `/analysis` | Stock Analysis | TradingView integration, watchlist, stock details |

### ngx-charts Library

Custom D3-based chart library at `apps/web/src/lib/ngx-charts/` with 13 chart families:

| Chart Type | Description |
|------------|-------------|
| **line-chart** | Line charts with circle markers |
| **area-chart** | Area charts (standard, stacked, normalized) |
| **bar-chart** | Bar charts (vertical, horizontal, stacked) |
| **band-chart** | Box plot bands with symmetric power scale |
| **pie-chart** | Pie and donut charts |
| **gauge** | Radial and linear gauges |
| **heat-map** | Grid heatmaps |
| **tree-map** | Hierarchical rectangles |
| **bubble-chart** | Scatter plots with sized bubbles |
| **polar-chart** | Polar/radar charts |
| **number-card** | Numeric KPI cards |
| **sankey** | Flow diagrams |
| **line-race** | Animated racing line chart with leaderboard |

Built with D3.js for calculations, Framer Motion for animations, and ResizeObserver for responsive sizing.

## Services

| Service | Language | Port | Purpose |
|---------|----------|------|---------|
| **web** | TypeScript/React | 4200 (dev) / 8200 (prod) | Frontend dashboard |
| **wiki** | TypeScript/Next.js | - | Documentation site |
| **api** | TypeScript/Express | 8201 | REST API gateway |
| **trading-engine** | Python/FastAPI | 8202 | Order execution and strategy |
| **market-data** | Python/FastAPI | 8203 | Real-time market data processing |
| **analytics** | Python/FastAPI | 8204 | Trading analytics and reporting |
| **ml-models** | Python/FastAPI | 8205 | ML predictions and insights |

### Infrastructure

| Component | Port | Purpose |
|-----------|------|---------|
| **Redis** | 8206 | Caching and state management |
| **Kafka** | 8207 | Event streaming |
| **Zookeeper** | 8208 | Kafka coordination |
| **Portainer** | 8210 | Docker management UI |
| **Kafka UI** | 8211 | Kafka monitoring |
| **Redis Commander** | 8212 | Redis management UI |

## Quick Start

### Prerequisites

- **Node.js** 20+
- **Python** 3.11+
- **Docker** and **Docker Compose**
- **Poetry** (for Python dependencies)

### Development Setup

```bash
# 1. Install dependencies
npm install

# 2. Install Python service dependencies
cd apps/trading-engine && poetry install && cd ../..
cd apps/market-data && poetry install && cd ../..
cd apps/analytics && poetry install && cd ../..
cd apps/ml-models && poetry install && cd ../..

# 3. Start development environment
docker-compose up -d

# 4. Start frontend dev server
npx nx run web:serve --port=4200
```

**Access the application:**
- Frontend: http://localhost:4200 (dev) / http://localhost:8200 (prod)
- API: http://localhost:8201/health
- Portainer: http://localhost:8210
- Kafka UI: http://localhost:8211
- Redis Commander: http://localhost:8212

### Development Commands

```bash
# TypeScript services
npx nx run web:serve          # Start frontend dev server
npx nx run web:build          # Build frontend
npx nx run api:serve          # Start API dev server
npx nx run api:build          # Build API

# Python services
npx nx run trading-engine:serve    # Start on port 8202
npx nx run market-data:serve       # Start on port 8203
npx nx run analytics:serve         # Start on port 8204
npx nx run ml-models:serve         # Start on port 8205

# Testing
npx nx run-many --target=test --all    # Run all tests
npx nx test shared-python              # Test Python utilities

# Code quality
npx nx run-many --target=lint --all    # Lint all projects
npx nx format:write                    # Format all code

# Workspace
npx nx graph                           # View project graph
npx nx reset                           # Clear Nx cache
```

## Docker Deployment

### Build & Deploy

```bash
# Build all images
./tools/scripts/build-all.sh

# Deploy with local Kafka (testing)
./tools/scripts/deploy.sh local-kafka latest

# Deploy with external Kafka (production)
export KAFKA_BROKERS=your-kafka-1:9092,your-kafka-2:9092
export REDIS_URL=redis://your-redis:6379
./tools/scripts/deploy.sh external-kafka latest

# Manual deployment
docker-compose -f docker-compose.prod.yml --profile local-kafka up -d
```

## Design System

### Theme: Mine (Warm Light)

Despite the `dark` CSS class, the actual visual appearance is a warm, light beige theme.

**Core Colors:**
```
Page background:   oklch(0.92 0.01 85)  (warm light gray)
Panel background:  #f5f3ef               (light beige)
Card background:   #ffffff               (white)
Primary text:      #1a1a1a               (near black)
Secondary text:    #8a8a8a               (medium gray)
Borders:           #e0ddd8               (warm gray)
```

**Market Colors (Chinese convention: Red=Up, Green=Down):**
```
Up/Positive:    #F6465D  (red)
Down/Negative:  #2EBD85  (green)
Flat/Unchanged: #76808E  (gray)
```

## Tech Stack

### Frontend (`apps/web`)
- React 19 with TypeScript
- Next.js 15 (static export mode)
- Tailwind CSS v4 with OKLCH colors
- Custom ngx-charts library (D3.js + Framer Motion)
- Radix UI component primitives
- AG Grid for data tables
- Zustand for state management
- Lucide React icons

### Backend (`apps/api`)
- Express.js with TypeScript
- Kafka producer/consumer
- Redis for caching

### Python Services
- FastAPI for HTTP APIs
- aiokafka for async Kafka
- Redis for state management
- Pydantic for data validation
- Poetry for dependency management

### Infrastructure
- Nx 22.3.3 for monorepo management
- Apache Kafka 7.6.0 for event streaming
- Redis 7 for caching
- Docker multi-stage builds
- Nginx for static file serving

## Git Workflow

Uses git worktrees for feature development:

```bash
git worktree add .worktrees/feature-name -b feature/feature-name
cd .worktrees/feature-name
# ... work ...
git worktree remove .worktrees/feature-name
```

Follow conventional commit messages. Keep commits atomic.

## Troubleshooting

**Docker health check failures:** All health checks use `127.0.0.1` (not `localhost`) to avoid IPv6 resolution issues in Alpine Linux containers.

**Build failures:**
```bash
npx nx reset                           # Clear Nx cache
npx nx run web:build --skip-nx-cache   # Rebuild without cache
```

**Python import errors:**
```bash
cd apps/[service] && poetry install    # Reinstall dependencies
```

## License

Private project

## Author

Vincent Xu (vincent@vibe.trading)
