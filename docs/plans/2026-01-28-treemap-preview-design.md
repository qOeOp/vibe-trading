# Treemap Preview Application Design

**Date:** 2026-01-28
**Status:** Approved
**Type:** New Feature - Independent Preview Application

## Overview

Create an independent treemap visualization page for displaying 31 SW Level-1 sector indices. The application will be built as a standalone Next.js app (`apps/preview`) for rapid style iteration, then integrated into `apps/web` once finalized.

## Design Source

**Figma:** https://www.figma.com/design/O52eqHmOTyh0tzZwpC7sl9/landing-page?node-id=524-11

The design shows a treemap visualization with:
- Company/sector cards sized by market capitalization
- Color-coded by performance (green=up, red=down)
- Card displays: name, market cap value, change percentage badge
- Dark background with white borders between cards

## Architecture

### System Flow

```
Browser (localhost:4300 dev / localhost:4200/preview prod)
    ↓ HTTP GET
apps/preview (Next.js + React)
    ↓ HTTP GET /api/preview/sectors
apps/api (Express.js :8201)
    ↓ HTTP GET /sectors
apps/market-data (FastAPI :8203)
    ↓ Returns mock data
31 SW Level-1 Sector Indices
```

### Data Flow

1. **market-data service** generates mock data for 31 SW Level-1 sectors
2. **Express API** proxies the request from preview to market-data
3. **Preview app** fetches data and renders treemap visualization
4. Pure display mode - no user interactions in initial version

## Project Structure

```
apps/preview/
├── src/
│   └── app/
│       ├── layout.tsx           # Root layout with dark theme
│       ├── page.tsx             # Main treemap page
│       ├── components/
│       │   ├── Treemap.tsx      # Treemap container component
│       │   └── SectorCard.tsx   # Individual sector card
│       ├── types/
│       │   └── sector.ts        # Sector data TypeScript types
│       ├── api/
│       │   └── sectors.ts       # API client with data transformation
│       └── globals.css          # Tailwind CSS imports
├── tailwind.config.ts           # Independent Tailwind config
├── tsconfig.json                # TypeScript configuration
├── next.config.js               # Next.js config (static export)
└── project.json                 # Nx target configuration
```

## Data Model

### Sector Interface (TypeScript)

```typescript
interface Sector {
  code: string;           // Sector code, e.g., "801010"
  name: string;           // Sector name, e.g., "农林牧渔"
  marketCap: number;      // Market cap in 亿元 (determines card size)
  changePercent: number;  // Change percentage (determines color)
  changeAmount: number;   // Change amount in 亿元
}
```

### API Response (Python market-data)

```python
GET /sectors
Response: {
  "data": [
    {
      "code": "801010",
      "name": "农林牧渔",
      "market_cap": 12000.0,
      "change_percent": 2.5,
      "change_amount": 300.0
    },
    // ... 30 more sectors
  ],
  "timestamp": "2026-01-28T10:30:00Z"
}
```

### SW Level-1 Sectors (31 total)

农林牧渔、煤炭、有色金属、钢铁、基础化工、建筑、建材、轻工制造、机械、电力设备、国防军工、汽车、商贸零售、消费者服务、家电、纺织服装、医药、食品饮料、农业、银行、非银行金融、房地产、交通运输、电子、通信、计算机、传媒、电力及公用事业、石油石化、环保、美容护理

## Component Design

### Component Hierarchy

```
App (layout.tsx + page.tsx)
  └── Treemap.tsx (data fetching & layout calculation)
        └── SectorCard.tsx × 31 (individual sector cards)
              ├── Sector name (top-left)
              ├── Market cap value (bottom-left)
              ├── Change % badge (top-right)
              └── Background color (gradient based on change%)
```

### Treemap Implementation

**Library:** Recharts `<Treemap>` component

**Configuration:**
- `data`: Array of 31 sectors
- `dataKey="marketCap"`: Determines card size
- Custom `content`: Renders `SectorCard` component
- Responsive container with full viewport dimensions

### Visual Design (from Figma)

**Color Scheme:**
- **Positive (Green)**: `#0d7d5e` (deep) to `#1aa179` (medium)
  - OKLCH: `oklch(0.45-0.55 0.15 150)` with intensity based on change%
- **Negative (Red)**: `#7d1f2e` (deep) to `#a52a3a` (medium)
  - OKLCH: `oklch(0.35-0.45 0.18 15)` with intensity based on change%
- **Background**: `#0a0f0d` (dark)
- **Borders**: `#ffffff` (white), 2px
- **Border Radius**: Small rounded corners

**Card Layout:**
- **Top-left**: Sector name (white, 14-16px, font-weight: 600)
- **Bottom-left**: Market cap value (white, 12px, format: "$XXX.XXB")
- **Top-right**: Change % badge (small rounded rect, semi-transparent bg)
- **Padding**: 8-12px

**Color Intensity Calculation:**
```typescript
// Map change% to color intensity (0-5% range)
const intensity = Math.min(Math.abs(changePercent) / 5, 1);
```

## Technical Stack

### Framework & Libraries

- **Framework**: Next.js 15 (static export mode)
- **UI Library**: React 19
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4 (OKLCH color space)
- **Charts**: Recharts v3 (Treemap component)
- **Monorepo**: Nx 22.3.3

### Configuration Files

**next.config.js:**
```javascript
module.exports = {
  output: 'export',
  images: { unoptimized: true },
  async rewrites() {
    return [{
      source: '/api/:path*',
      destination: 'http://localhost:8201/api/:path*'
    }]
  }
}
```

**project.json:**
```json
{
  "name": "preview",
  "targets": {
    "serve": {
      "executor": "@nx/next:server",
      "options": {
        "buildTarget": "preview:build",
        "dev": true,
        "port": 4300
      }
    },
    "build": {
      "executor": "@nx/next:build",
      "options": {
        "outputPath": "dist/apps/preview"
      }
    }
  }
}
```

## Implementation Details

### Data Fetching

```typescript
// apps/preview/src/api/sectors.ts
export async function fetchSectors(): Promise<Sector[]> {
  const response = await fetch('/api/preview/sectors');
  const data = await response.json();

  // Transform Python snake_case to TypeScript camelCase
  return data.data.map(sector => ({
    code: sector.code,
    name: sector.name,
    marketCap: sector.market_cap,
    changePercent: sector.change_percent,
    changeAmount: sector.change_amount
  }));
}
```

### Color Calculation

```typescript
function getSectorColor(changePercent: number): string {
  if (changePercent > 0) {
    const intensity = Math.min(changePercent / 5, 1);
    return `oklch(${0.45 + intensity * 0.1} 0.15 150)`;
  } else {
    const intensity = Math.min(Math.abs(changePercent) / 5, 1);
    return `oklch(${0.35 + intensity * 0.1} 0.18 15)`;
  }
}
```

### Data Formatting

```typescript
// Format market cap: 12000.0 → "$1200.00B"
function formatMarketCap(value: number): string {
  return `$${(value / 10).toFixed(2)}B`;
}

// Format change: 2.5 → "+2.5%"
function formatChangePercent(value: number): string {
  const sign = value >= 0 ? '+' : '';
  return `${sign}${value.toFixed(2)}%`;
}
```

## Development Workflow

### Development Commands

```bash
# Start preview app (independent development)
npx nx run preview:serve
# → Access at http://localhost:4300

# Start dependencies
npx nx run api:serve           # Port 8201
npx nx run market-data:serve   # Port 8203

# Build preview app
npx nx run preview:build
```

### Development Ports

| Service | Port | Purpose |
|---------|------|---------|
| preview (dev) | 4300 | Preview app development server |
| api | 8201 | Express API gateway |
| market-data | 8203 | Python FastAPI mock data |

## Future Integration into apps/web

Once styling is finalized, integrate into main web app:

### Step 1: Copy Code

```bash
mkdir -p apps/web/src/app/preview
cp -r apps/preview/src/app/* apps/web/src/app/preview/
```

### Step 2: Adjust Imports

- Merge Tailwind configurations
- Replace duplicate components with shared ones (if any)
- Update API paths if needed

### Step 3: Test Integration

- Access `http://localhost:4200/preview`
- Verify API routing works
- Test data fetching

### Step 4: Cleanup

- Remove `apps/preview` directory
- Keep this design doc for reference

## API Implementation

### 1. market-data Service (Python)

**File:** `apps/market-data/src/routes/sectors.py`

```python
from fastapi import APIRouter
from datetime import datetime

router = APIRouter()

@router.get("/sectors")
async def get_sectors():
    # Mock data for 31 SW Level-1 sectors
    sectors = [
        {
            "code": "801010",
            "name": "农林牧渔",
            "market_cap": 12000.0,
            "change_percent": 2.5,
            "change_amount": 300.0
        },
        # ... 30 more sectors
    ]

    return {
        "data": sectors,
        "timestamp": datetime.utcnow().isoformat() + "Z"
    }
```

### 2. Express API Proxy

**File:** `apps/api/src/routes/preview.ts`

```typescript
import express from 'express';
import axios from 'axios';

const router = express.Router();

router.get('/preview/sectors', async (req, res) => {
  try {
    const response = await axios.get(
      `${process.env.MARKET_DATA_URL || 'http://localhost:8203'}/sectors`
    );
    res.json(response.data);
  } catch (error) {
    res.status(503).json({ error: 'Market data service unavailable' });
  }
});

export default router;
```

## Interaction Design

### Phase 1: Pure Display (Current)

- Static treemap visualization
- No hover effects
- No click interactions
- No filters or controls
- Focus: Style refinement and visual accuracy

### Phase 2: Future Enhancements (Post-Integration)

- Hover tooltips with detailed sector info
- Click to drill down into sector constituents
- Time range selector (1D, 1W, 1M, etc.)
- Real-time updates via WebSocket
- Export/share functionality

## Responsive Design

- **Desktop (1920px+)**: Full treemap layout
- **Tablet (768-1920px)**: Adaptive scaling
- **Mobile (<768px)**: Not prioritized (desktop-first visualization)

## Success Criteria

1. ✅ Independent app runs on port 4300
2. ✅ Matches Figma visual design (colors, layout, typography)
3. ✅ Displays 31 SW Level-1 sectors correctly
4. ✅ Card sizes proportional to market cap
5. ✅ Colors accurately reflect sector performance
6. ✅ Clean, maintainable code structure
7. ✅ Easy integration path into apps/web
8. ✅ Fast iteration for style adjustments

## Non-Goals

- ❌ Docker deployment (development only, no production docker needed)
- ❌ User authentication
- ❌ Data persistence
- ❌ Real market data integration (mock only)
- ❌ Mobile responsiveness (desktop-first)
- ❌ Complex interactions (Phase 1)

## Technical Decisions

### Why Next.js instead of Vite?

- **Consistency**: apps/web uses Next.js, same tech stack
- **Easy integration**: Can directly copy code to apps/web later
- **No rewrite needed**: Same framework = smooth migration

### Why independent app instead of /preview page in apps/web?

- **Isolation**: No risk of breaking existing web app
- **Fast iteration**: Independent build/serve cycles
- **Clean separation**: Clear boundary during development
- **Easy cleanup**: Remove when integrated

### Why Recharts for treemap?

- **Already in stack**: No new dependencies
- **React-first**: Native React component
- **Flexible**: Custom rendering with SectorCard
- **Proven**: Used in existing dashboards

## Timeline Estimate

Not provided - focus on implementation tasks, not time predictions.

## Related Documentation

- Figma Design: https://www.figma.com/design/O52eqHmOTyh0tzZwpC7sl9/landing-page?node-id=524-11
- CLAUDE.md: Project guidelines and conventions
- SW Industry Classification: 申万一级行业分类标准

---

**Next Steps:**
1. Set up git worktree for isolated development
2. Create implementation plan with detailed tasks
3. Implement market-data endpoint
4. Implement Express API proxy
5. Build preview Next.js application
6. Style refinement iterations
7. Integration into apps/web
