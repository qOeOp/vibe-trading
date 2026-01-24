# Technology Stack

All development must strictly adhere to the project's [Comprehensive Coding Guidelines](../guidelines/README.md).

## Frontend
- **Framework:** React 19 (TypeScript)
- **Documentation:** Fumadocs (Next.js 15, MDX-based SSG via Content Collections)
- **Build Tool:** Vite (for web), Next.js (for wiki)
- **Styling:** Tailwind CSS v4
- **Component Libraries:**
    - Radix UI / Shadcn UI (Base components)
    - SquareUI (Specialized UI components)
- **Data Visualization & Grids:**
    - Highcharts (Advanced financial charting)
    - Lightweight Charts (Performance-optimized trading charts)
    - AG Grid (High-performance data grids for order books/positions)
    - Recharts v3 (General analytics)
- **State Management:** Zustand

## Backend (API Gateway)
- **Runtime:** Node.js
- **Framework:** Express.js (TypeScript)
- **Communication:** REST API, WebSocket (for real-time frontend updates)

## Backend (Microservices)
- **Runtime:** Python 3.11+
- **Framework:** FastAPI
- **Data Validation:** Pydantic
- **Messaging Client:** aiokafka (Async Kafka client)

## Infrastructure & Data
- **Message Broker:** Apache Kafka (Event streaming backbone)
- **Cache / State Store:** Redis (Fast access for market data/session state)
- **Containerization:** Docker, Docker Compose
- **Reverse Proxy:** Nginx (Static file serving & routing)

## Development Tools
- **Monorepo Manager:** Nx (Managing JS/TS and Python projects)
- **Python Package Manager:** Poetry
- **Node Package Manager:** npm / pnpm
- **Linting & Formatting:** ESLint, Prettier, Black/Ruff (Python)
