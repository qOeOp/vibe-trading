# Section 2: Architecture

System architecture, data flow patterns, and technology stack for the Treemap Preview application.

---

## Threads

### [System Flow](./threads/system-flow/index.md)
Application flow from browser to data rendering, component hierarchy.

### [Data Flow](./threads/data-flow/index.md)
Phase 1 mock data flow, future API integration plans.

### [Tech Stack](./threads/tech-stack/index.md)
Frontend framework, visualization libraries, UI components, and build tools.

---

## Architecture Overview

```
Browser (localhost:4300)
    ↓
Next.js 15 App (Static Export)
    ↓
Mock Data (TypeScript arrays)
    ↓
HeatMap Visualization
    ├─ useTreeMap Hook → Layout Calculation (Recharts)
    ├─ HeatMapTile × 31 → UI Rendering (Custom SVG)
    └─ useDrillDown Hook → Navigation State
```

**Key Principle:** Single Responsibility - Layout calculation decoupled from UI rendering.
