# Vibe Trading

A modern, event-driven trading platform built with a multi-language monorepo architecture combining TypeScript (React + Express) and Python (FastAPI microservices) with Kafka message streaming.

## 🏗️ Architecture

```
┌─────────────┐
│   Browser   │
└──────┬──────┘
       │
       ↓
┌─────────────┐         ┌───────────────┐
│  Web (TS)   │────────→│   API (TS)    │
│  React 19   │         │   Express     │
└─────────────┘         └───────┬───────┘
                                │
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

## 📦 Project Structure

```
vibe-trading/
├── apps/
│   ├── web/                    # React frontend (TypeScript)
│   ├── api/                    # Express API (TypeScript)
│   ├── trading-engine/         # Trading logic service (Python/FastAPI)
│   ├── market-data/            # Market data processing (Python/FastAPI)
│   ├── analytics/              # Analytics service (Python/FastAPI)
│   └── ml-models/              # ML prediction service (Python/FastAPI)
│
├── libs/
│   ├── shared-types/           # Shared TypeScript types
│   └── shared-python/          # Shared Python utilities
│
├── docker/
│   ├── web.Dockerfile
│   ├── api.Dockerfile
│   ├── trading-engine.Dockerfile
│   ├── market-data.Dockerfile
│   ├── analytics.Dockerfile
│   ├── ml-models.Dockerfile
│   └── nginx.conf
│
├── tools/scripts/
│   ├── build-all.sh            # Build all Docker images
│   ├── push-images.sh          # Push images to registry
│   ├── deploy.sh               # Deploy with Docker Compose
│   └── dev.sh                  # Development environment
│
├── docker-compose.yml          # Development compose
├── docker-compose.prod.yml     # Production compose
└── .env.example                # Environment variables template
```

## 🚀 Services

| Service | Language | Port | Purpose |
|---------|----------|------|---------|
| **web** | TypeScript/React | 8200 | Frontend dashboard |
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

## 🛠️ Quick Start

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
./tools/scripts/dev.sh

# Or manually with docker-compose
docker-compose up -d
```

**Access the application:**
- Frontend: http://localhost:8200
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
```

## 🐳 Docker Deployment

### Build Images

```bash
# Build all images
./tools/scripts/build-all.sh

# Build with custom registry and tag
./tools/scripts/build-all.sh my-registry.com latest

# Build single service
docker build -f docker/web.Dockerfile -t vibe-trading-web:latest .
```

### Deploy to Production

#### Option 1: With Local Kafka (Recommended for Testing)

```bash
./tools/scripts/deploy.sh local-kafka latest
```

#### Option 2: With External Kafka (Production)

```bash
# Set Kafka brokers
export KAFKA_BROKERS=your-kafka-1:9092,your-kafka-2:9092
export REDIS_URL=redis://your-redis:6379

./tools/scripts/deploy.sh external-kafka latest
```

#### Manual Deployment

```bash
# With local Kafka
docker-compose -f docker-compose.prod.yml --profile local-kafka up -d

# With external Kafka (set KAFKA_BROKERS and REDIS_URL first)
docker-compose -f docker-compose.prod.yml up -d
```

### Push Images to Registry

```bash
# Push all images
./tools/scripts/push-images.sh

# Push to custom registry
./tools/scripts/push-images.sh my-registry.com v1.0.0
```

## 🔧 Environment Configuration

Copy `.env.example` to `.env` and configure:

```bash
# Docker Registry
DOCKER_REGISTRY=crpi-8qkmcs5mqpg6052i.cn-shanghai.personal.cr.aliyuncs.com/qoeop
IMAGE_TAG=latest

# Infrastructure
KAFKA_BROKERS=kafka:9092          # or your external Kafka
REDIS_URL=redis://redis:6379       # or your external Redis

# Application
NODE_ENV=production
```

## 📊 Monitoring & Observability

### Portainer (http://localhost:8210)
- Docker container management
- Resource monitoring
- Log viewing

### Kafka UI (http://localhost:8211)
- Topic management
- Message browsing
- Consumer group monitoring

### Redis Commander (http://localhost:8212)
- Key-value browsing
- Redis stats
- Command execution

## 🧪 Testing

```bash
# Run all tests
npx nx run-many --target=test --all

# Test specific service
npx nx test web
npx nx test api
npx nx test shared-python
npx nx test trading-engine

# Watch mode
npx nx test web --watch
```

## 🎨 Design System

### Color Palette (Violet Bloom Theme)
- **Primary**: `#6e3ff3` (violet)
- **Accent**: `#df3674` (pink)
- **Secondary**: `#35b9e9` (cyan)
- **Tertiary**: `#375dfb` (blue)
- **Supporting**: `#e255f2` (magenta)

### Border Radius
- Small: `0.425rem` (6.8px)
- Medium: `0.625rem` (10px)
- Large: `0.625rem` (10px)
- XLarge: `1.025rem` (16.4px)

## 🔄 Git Workflow

This project uses git worktrees for feature development:

```bash
# List worktrees
git worktree list

# Create new worktree
git worktree add .worktrees/feature-name -b feature/feature-name

# Work in worktree
cd .worktrees/feature-name

# Remove worktree (after merging)
git worktree remove .worktrees/feature-name
```

## 🐛 Troubleshooting

### Docker Issues

**Services not starting:**
```bash
# Check logs
docker-compose logs [service-name]

# Restart services
docker-compose restart

# Clean rebuild
docker-compose down -v
docker-compose build --no-cache
docker-compose up -d
```

**Port conflicts:**
```bash
# Check what's using ports
lsof -i :8200
lsof -i :8207

# Change ports in docker-compose.yml if needed
```

### Python Services

**Import errors:**
```bash
# Reinstall dependencies
cd apps/[service] && poetry install
```

**Module not found:**
```bash
# Ensure shared library is installed
cd libs/shared-python && poetry install
```

### TypeScript Services

**Build failures:**
```bash
# Clear Nx cache
npx nx reset

# Rebuild
npx nx run web:build --skip-nx-cache
```

## 📚 Tech Stack Details

### Frontend (apps/web)
- React 19 with TypeScript
- Vite for fast builds
- Tailwind CSS v4 with OKLCH colors
- Radix UI components
- Recharts v3 for data visualization
- Zustand for state management
- React Router v6

### Backend (apps/api)
- Express.js with TypeScript
- Kafka producer/consumer
- Redis for caching
- REST API endpoints

### Python Services
- FastAPI for HTTP APIs
- aiokafka for async Kafka
- Redis for state management
- Pydantic for data validation
- Poetry for dependency management

### Infrastructure
- Kafka 7.6.0 for event streaming
- Redis 7 for caching
- Docker multi-stage builds
- Nginx for static file serving
- Nx 22.3.3 for monorepo management

## 📄 License

Private project

## 👤 Author

Vincent Xu (vincent@vibe.trading)

## 🤝 Contributing

This is a private project. For internal team members:
1. Create a feature branch using git worktree
2. Make changes following CLAUDE.md guidelines
3. Ensure all tests pass
4. Create a pull request to main

---

Built with ❤️ using Nx, React, TypeScript, Python, and FastAPI
