# Technology Stack

All development must strictly adhere to the project's [Comprehensive Coding Guidelines](../guidelines/README.md).

## Frontend
- **Framework:** React 19 (TypeScript), Next.js 15 (App Router, static export)
- **Documentation:** Fumadocs (Next.js 15, MDX-based SSG via Content Collections)
- **Styling:** Tailwind CSS v4 (OKLCH color space, Mine theme)
- **Component Libraries:**
    - Radix UI / Shadcn UI (Base components)
    - Lucide React (Icons)
- **Data Visualization & Grids:**
    - ngx-charts (Custom D3.js + Framer Motion chart library, 13 chart types)
    - AG Grid (High-performance data grids)
    - Recharts v3 (Legacy, used in some market components)
- **Animation:** Framer Motion
- **State Management:** Zustand
- **Validation:** Zod

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
- **Monorepo Manager:** Nx 22.3.3 (Managing JS/TS and Python projects)
- **Python Package Manager:** Poetry
- **Node Package Manager:** npm
- **Linting & Formatting:** ESLint, Prettier, Ruff (Python)
