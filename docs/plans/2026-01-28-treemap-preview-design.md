# Treemap Preview Application Design

**Date:** 2026-01-28
**Status:** Approved
**Type:** New Feature - Independent Preview Application

## Overview

Create an independent treemap visualization page for displaying 31 SW Level-1 sector indices. The application will be built as a standalone Next.js app (`apps/preview`) for rapid style iteration, then integrated into `apps/web` once finalized.

## Design Source

**Figma:** https://www.figma.com/design/O52eqHmOTyh0tzZwpC7sl9/landing-page?node-id=524-11
![Treemap Preview](./images/treemap.png)

The design shows a heatmap visualization with:
- Sector tiles sized by market capitalization
- Color-coded by performance (Chinese market convention: **red=up, green=down**)
- Tile displays: sector name (top-left), breathing indicator (top-right), capital flow + change% (bottom-right)
- Supports light/dark theme with accessible border contrast (WCAG 2.0 AA: 3:1 minimum)

## Architecture

### System Flow

```
Browser (localhost:4300)
    ↓
apps/preview (Next.js + React)
    ↓
Mock Data (hardcoded in frontend)
    ↓
HeatMap Visualization (31 SW Level-1 Sectors)
```

### Data Flow

1. **Frontend mock data** hardcoded array of 31 SW Level-1 sectors
2. **Preview app** uses mock data directly for rendering
3. **No API calls** - pure frontend development for UI iteration
4. Pure display mode - no user interactions in initial version

**Note:** API integration will be added later. Focus is on UI design and styling first.

## Project Structure

```
apps/preview/
├── src/
│   └── app/
│       ├── layout.tsx           # Root layout with dark theme
│       ├── page.tsx             # Main treemap page
│       ├── components/
│       │   ├── HeatMap.tsx          # HeatMap container component
│       │   ├── HeatMapHeader.tsx    # Header with title, breadcrumb, search, toggles
│       │   ├── Breadcrumb.tsx       # Breadcrumb navigation component
│       │   ├── SearchBox.tsx        # Search input with inline icon button
│       │   ├── Tile.tsx             # Individual sector tile
│       │   └── BreathingDot.tsx     # Breathing indicator component
│       ├── types/
│       │   └── sector.ts        # Sector data TypeScript types
│       ├── data/
│       │   └── mockSectors.ts   # Mock data for 31 SW sectors
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
  marketCap: number;      // Market cap in 亿元 (determines tile size)
  changePercent: number;  // Change percentage (determines color)
  capitalFlow: number;    // Capital flow in 亿元 (positive=inflow, negative=outflow)
  attentionLevel: number; // Attention level 0-100 (determines breathing indicator frequency)
}
```

### Mock Data (Frontend)

**File:** `apps/preview/src/data/mockSectors.ts`

```typescript
export const mockSectors: Sector[] = [
  {
    code: "801010",
    name: "农林牧渔",
    marketCap: 12500.0,
    changePercent: 1.85,
    capitalFlow: 320.5,
    attentionLevel: 45
  },
  {
    code: "801020",
    name: "煤炭",
    marketCap: 18200.0,
    changePercent: -2.15,
    capitalFlow: -580.2,
    attentionLevel: 88
  },
  {
    code: "801030",
    name: "有色金属",
    marketCap: 22100.0,
    changePercent: 0.95,
    capitalFlow: 450.8,
    attentionLevel: 62
  },
  {
    code: "801040",
    name: "钢铁",
    marketCap: 14300.0,
    changePercent: -1.45,
    capitalFlow: -320.0,
    attentionLevel: 55
  },
  {
    code: "801050",
    name: "基础化工",
    marketCap: 25800.0,
    changePercent: 2.35,
    capitalFlow: 680.5,
    attentionLevel: 72
  },
  {
    code: "801080",
    name: "建筑",
    marketCap: 16500.0,
    changePercent: 0.65,
    capitalFlow: 210.3,
    attentionLevel: 38
  },
  {
    code: "801110",
    name: "建材",
    marketCap: 13200.0,
    changePercent: -0.85,
    capitalFlow: -180.5,
    attentionLevel: 42
  },
  {
    code: "801120",
    name: "轻工制造",
    marketCap: 11800.0,
    changePercent: 1.25,
    capitalFlow: 155.0,
    attentionLevel: 35
  },
  {
    code: "801140",
    name: "机械",
    marketCap: 19500.0,
    changePercent: 1.75,
    capitalFlow: 425.8,
    attentionLevel: 58
  },
  {
    code: "801150",
    name: "电力设备",
    marketCap: 28900.0,
    changePercent: 3.25,
    capitalFlow: 920.5,
    attentionLevel: 91
  },
  {
    code: "801160",
    name: "国防军工",
    marketCap: 15600.0,
    changePercent: -1.95,
    capitalFlow: -410.2,
    attentionLevel: 76
  },
  {
    code: "801170",
    name: "汽车",
    marketCap: 21500.0,
    changePercent: 2.85,
    capitalFlow: 650.0,
    attentionLevel: 82
  },
  {
    code: "801180",
    name: "商贸零售",
    marketCap: 12900.0,
    changePercent: 0.45,
    capitalFlow: 95.5,
    attentionLevel: 28
  },
  {
    code: "801200",
    name: "消费者服务",
    marketCap: 14800.0,
    changePercent: 1.55,
    capitalFlow: 280.0,
    attentionLevel: 48
  },
  {
    code: "801210",
    name: "家电",
    marketCap: 16200.0,
    changePercent: -0.95,
    capitalFlow: -220.5,
    attentionLevel: 52
  },
  {
    code: "801230",
    name: "纺织服装",
    marketCap: 9800.0,
    changePercent: 0.35,
    capitalFlow: 65.0,
    attentionLevel: 22
  },
  {
    code: "801710",
    name: "医药",
    marketCap: 32500.0,
    changePercent: 1.95,
    capitalFlow: 780.5,
    attentionLevel: 68
  },
  {
    code: "801720",
    name: "食品饮料",
    marketCap: 35800.0,
    changePercent: 2.15,
    capitalFlow: 850.0,
    attentionLevel: 74
  },
  {
    code: "801730",
    name: "农业",
    marketCap: 11200.0,
    changePercent: -1.25,
    capitalFlow: -195.0,
    attentionLevel: 44
  },
  {
    code: "801780",
    name: "银行",
    marketCap: 45200.0,
    changePercent: 0.85,
    capitalFlow: 520.0,
    attentionLevel: 56
  },
  {
    code: "801790",
    name: "非银行金融",
    marketCap: 28500.0,
    changePercent: 1.45,
    capitalFlow: 480.5,
    attentionLevel: 64
  },
  {
    code: "801880",
    name: "房地产",
    marketCap: 18900.0,
    changePercent: -2.85,
    capitalFlow: -720.0,
    attentionLevel: 92
  },
  {
    code: "801890",
    name: "交通运输",
    marketCap: 17200.0,
    changePercent: 0.55,
    capitalFlow: 135.5,
    attentionLevel: 40
  },
  {
    code: "801980",
    name: "电子",
    marketCap: 38500.0,
    changePercent: 3.15,
    capitalFlow: 1050.0,
    attentionLevel: 95
  },
  {
    code: "801990",
    name: "通信",
    marketCap: 14500.0,
    changePercent: 1.05,
    capitalFlow: 210.0,
    attentionLevel: 50
  },
  {
    code: "802010",
    name: "计算机",
    marketCap: 26800.0,
    changePercent: 2.65,
    capitalFlow: 720.5,
    attentionLevel: 78
  },
  {
    code: "802020",
    name: "传媒",
    marketCap: 12300.0,
    changePercent: -0.65,
    capitalFlow: -125.0,
    attentionLevel: 36
  },
  {
    code: "802030",
    name: "电力及公用事业",
    marketCap: 15800.0,
    changePercent: 0.25,
    capitalFlow: 58.0,
    attentionLevel: 25
  },
  {
    code: "802040",
    name: "石油石化",
    marketCap: 24500.0,
    changePercent: -1.75,
    capitalFlow: -520.5,
    attentionLevel: 70
  },
  {
    code: "802050",
    name: "环保",
    marketCap: 10500.0,
    changePercent: 1.35,
    capitalFlow: 165.0,
    attentionLevel: 46
  },
  {
    code: "802060",
    name: "美容护理",
    marketCap: 13800.0,
    changePercent: 0.75,
    capitalFlow: 125.5,
    attentionLevel: 32
  }
];
```

**Data Characteristics:**
- Total sectors: 31 (complete SW Level-1 classification)
- Market cap range: ¥9,800亿 to ¥45,200亿
- Change range: -2.85% to +3.25%
- Capital flow range: -¥720亿 to +¥1,050亿
- Attention level range: 22 to 95 (varied breathing frequencies)

## Component Design

### Component Hierarchy

```
App (layout.tsx + page.tsx)
  └── HeatMap.tsx (container component)
        ├── HeatMapHeader.tsx
        │     ├── Title: "Market Performance" (left)
        │     ├── Breadcrumb.tsx (below title)
        │     │     └── "一级行业 > 二级行业 > 三级行业 > 股票"
        │     ├── SearchBox.tsx (right)
        │     │     ├── Input field (rounded rectangle)
        │     │     └── Search icon (inline, clickable)
        │     └── Two Toggles (right, after search)
        │           ├── Toggle 1 (top)
        │           └── Toggle 2 (bottom)
        │
        └── Treemap visualization (Recharts)
              └── Tile.tsx × 31 (individual sector tiles)
                    ├── Sector name (top-left)
                    ├── BreathingDot.tsx (top-right, frequency based on attentionLevel)
                    ├── Capital flow + Change % (bottom-right)
                    └── Background color (gradient based on change%)
```

### HeatMap Header Design

**Header Structure:**

```
┌────────────────────────────────────────────────────────────┐
│ Market Performance              [Search...] [🔍] [T1] [T2] │
│ 一级行业 > 二级行业 > 三级行业 > 股票                       │
└────────────────────────────────────────────────────────────┘
```

**Layout Breakdown:**

**Left Section:**
- **Title**: "Market Performance"
  - Font size: 20-24px
  - Font weight: 600 (semibold)
  - Color: Theme-aware (white in dark, gray-900 in light)
- **Breadcrumb** (below title):
  - Text: "一级行业 > 二级行业 > 三级行业 > 股票"
  - Font size: 12-14px
  - Font weight: 400 (normal)
  - Color: Theme-aware (gray-400 in dark, gray-600 in light)
  - Separator: " > " (with spaces)
  - Interactive: Clickable breadcrumb items (Phase 2)

**Right Section (horizontally aligned):**

**1. Search Box:**
- Shape: Rounded rectangle
- Border radius: 8px (matching tile radius)
- Background: Theme-aware input background
  - Dark mode: `rgba(255, 255, 255, 0.05)`
  - Light mode: `#ffffff` with border
- Border: Theme-aware
  - Dark mode: `rgba(255, 255, 255, 0.1)`
  - Light mode: `#d1d5db` (gray-300)
- Height: 40px (reference height for toggles)
- Width: 240-280px
- Padding: 12px 16px
- **Search Icon**:
  - Position: Inline at right edge inside input
  - Icon: Lucide `Search` icon
  - Size: 20px
  - Color: Theme-aware (gray-400)
  - Clickable: Yes (triggers search)
  - No visible button shape - icon is the affordance
- **Placeholder**: "Search sectors..."
- **Input styling**:
  - Font size: 14px
  - No outline on focus (use border color change)

**2. Toggle Group (垂直排列):**
- Position: Immediately after search box (8-12px gap)
- Layout: Two toggles stacked vertically
- Container height: 40px (matches search box height)
- Each toggle height: ~18px (with 4px gap between)
- Width: Auto (based on content, ~80-100px)
- Styling: Standard toggle switches
  - Background: Theme-aware
  - Active state: Primary color
  - Inactive state: Gray
- **Toggle 1** (top): Purpose TBD (e.g., "Live" mode)
- **Toggle 2** (bottom): Purpose TBD (e.g., "Compact" view)

**Header Layout (Flexbox):**
```typescript
<div className="flex items-start justify-between p-4 pb-2">
  {/* Left section */}
  <div className="flex flex-col gap-1">
    <h1 className="text-2xl font-semibold">Market Performance</h1>
    <Breadcrumb items={["一级行业", "二级行业", "三级行业", "股票"]} />
  </div>

  {/* Right section */}
  <div className="flex items-center gap-3">
    <SearchBox placeholder="Search sectors..." />
    <div className="flex flex-col gap-1 h-[40px] justify-between">
      <Toggle label="Toggle 1" />
      <Toggle label="Toggle 2" />
    </div>
  </div>
</div>
```

**Header Dimensions:**
- Height: Auto (~60-80px depending on content)
- Padding: 16px horizontal, 12px vertical
- Background: Transparent (inherits from page)
- Border bottom: Optional subtle separator
  - Dark mode: `rgba(255, 255, 255, 0.05)`
  - Light mode: `#e5e7eb` (gray-200)

### HeatMap Implementation

**Library:** Recharts `<Treemap>` component (used for treemap-style layout)

**Configuration:**
- `data`: Array of 31 sectors
- `dataKey="marketCap"`: Determines tile size
- Custom `content`: Renders `Tile` component
- Responsive sizing with constraints

**Layout & Sizing Specifications:**

**Page Layout:**
- Full-width display of HeatMap component
- No sidebar or additional UI elements
- HeatMap fills the entire viewport area

**HeatMap Container Dimensions:**
- **Total minimum width**: `920px`
- **Total maximum width**: `100vw` (full viewport width)
- **Header height**: Fixed (auto, based on content ~60-80px)
- **Treemap area height**: Dynamic based on tile count and layout
  - Treemap algorithm dynamically calculates tile positions
  - Height adjusts automatically to fit all tiles
  - **Maximum treemap height**: `580px` (excludes header)
  - **Total max height**: Header height + 580px + padding
  - **Overflow behavior**: When treemap height > 580px, apply `overflow-y: scroll`
- **Padding (Container)**: `8px` on all sides
  - **Critical**: Prevents scrollbar UI from overlapping with tiles
  - Creates visual breathing room around HeatMap
  - Ensures scrollbar doesn't obscure tile content when visible

**Tile Shape & Size Constraints:**

**⚠️ Critical: Tile aspect ratio and minimum size requirements**

**Tile Aspect Ratio:**
- **Allowed range**: Square to Golden Ratio rectangle
  - Minimum ratio: `1:1` (perfect square)
  - Maximum ratio: `1:1.618` (golden ratio, horizontal)
  - Formula: `1 ≤ (width / height) ≤ 1.618`
- **Forbidden**: Vertical rectangles (height > width)
  - Ratio `< 1` is NOT allowed
  - Prevents tall, narrow tiles that are hard to read

**Tile Minimum Dimensions:**
- **Minimum width**: `150px` (hard constraint)
- **Minimum height**: `150px` (hard constraint)
- **Rationale**: Tiles smaller than 150px cannot properly display:
  - Sector name (top-left)
  - Breathing indicator (top-right)
  - Capital flow + change% (bottom-right)
  - Adequate padding and readability

**Treemap Algorithm Constraints:**
```typescript
// Tile validation rules
const isValidTile = (width: number, height: number): boolean => {
  // Check minimum dimensions
  if (width < 150 || height < 150) return false;

  // Check aspect ratio (square to golden ratio)
  const ratio = width / height;
  if (ratio < 1 || ratio > 1.618) return false;

  return true;
};
```

**Handling All 31 Sectors:**

**⚠️ Critical Requirement: All 31 SW Level-1 sectors MUST be displayed**

- **No grouping/clustering**: Cannot use "Others" category to combine small sectors
- **No exclusions**: All 31 sectors must appear, regardless of market cap size
- **Minimum size enforcement**: Every tile MUST meet 150px × 150px minimum
- **Container sizing strategy**:
  - HeatMap container dimensions (920px width, max 580px height) are designed to accommodate all 31 sectors at minimum 150px × 150px size
  - Treemap algorithm distributes tiles based on market cap proportions
  - If any tile would be < 150px, the container may need to expand (within max height limit) or tiles redistribute

**Implementation Strategy:**
```typescript
// Validate all tiles meet minimum size
const validateAllTiles = (tiles: TileData[]): boolean => {
  return tiles.every(tile => tile.width >= 150 && tile.height >= 150);
};

// If validation fails, adjust container or algorithm parameters
// All 31 sectors must remain visible
```

**Mock Data Validation:**
- Current mock data has market cap range: ¥9,800亿 to ¥45,200亿
- Smallest sector: 美容护理 (¥13,800亿)
- Largest sector: 银行 (¥45,200亿)
- Ratio: ~1:4.6 (manageable for 150px minimum tiles)

**Scaling Support:**
- Component supports zoom/scale transformations
- Maintains minimum width of 920px at all zoom levels
- Tile constraints apply at all zoom levels (150px minimum after scaling)
- Scroll container adapts to scaled content

**Implementation Example:**
```typescript
<div className="w-full min-w-[920px] max-h-[580px] overflow-y-auto p-2">
  {/* p-2 = 8px padding on all sides (Tailwind) */}
  <ResponsiveContainer width="100%" height="auto" minHeight={400}>
    <Treemap
      data={sectors}
      dataKey="marketCap"
      aspectRatio={1.618}  // Golden ratio maximum
      isAnimationActive={false}
      content={<CustomTile />}
    />
  </ResponsiveContainer>
</div>
```

**Why 8px Padding?**
1. **Scrollbar overlap prevention**: When `overflow-y: scroll` is active, the scrollbar appears on the right edge. Without padding, tiles can extend to the edge and be partially obscured by the scrollbar UI.
2. **Visual breathing room**: Creates consistent spacing around the entire HeatMap visualization.
3. **Browser consistency**: Different browsers render scrollbars differently (overlay vs. always visible). 8px padding ensures tiles are never hidden regardless of browser behavior.
4. **Accessibility**: Provides clear visual separation between interactive scrollbar and tile content.

**Custom Tile Renderer with Constraints:**
```typescript
// apps/preview/src/components/Tile.tsx
interface TileProps {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  // ... sector data
}

export function Tile({ x, y, width, height, ...props }: TileProps) {
  // Validate tile dimensions
  if (!width || !height || width < 150 || height < 150) {
    // CRITICAL: Log warning but DO NOT skip rendering
    // All 31 sectors MUST be displayed
    console.error(`Tile below minimum size: ${width}x${height}px. Adjusting layout needed.`);

    // Force minimum size (fallback - should be handled by container sizing)
    width = Math.max(width, 150);
    height = Math.max(height, 150);
  }

  // Validate aspect ratio (square to golden ratio)
  const ratio = width / height;
  if (ratio < 1 || ratio > 1.618) {
    console.warn(`Tile aspect ratio ${ratio.toFixed(2)} outside preferred range 1-1.618`);
    // Still render - all sectors must show
  }

  return (
    <g transform={`translate(${x}, ${y})`}>
      {/* Tile content rendering - always render, never skip */}
    </g>
  );
}
```

**⚠️ Important:** Tile renderer never returns `null`. All 31 sectors must render, even if constraints are violated (which indicates container sizing needs adjustment).

### Visual Design (from Figma)

**Color Scheme (Chinese Market Convention):**

**⚠️ Important: Chinese market uses RED for UP, GREEN for DOWN (opposite of Western markets)**

- **Positive/Up (Red)**:
  - Medium (base): `#D52CA2` ⭐ **Primary red for moderate gains**
  - Deep (high gains): Darker red gradient
  - Light (low gains): Lighter red gradient
  - Used when `changePercent > 0`
  - Color intensity varies based on change% magnitude

- **Negative/Down (Green)**:
  - Medium (base): `#039160` ⭐ **Primary green for moderate losses**
  - Deep (high losses): Darker green gradient
  - Light (low losses): Lighter green gradient
  - Used when `changePercent < 0`
  - Color intensity varies based on change% magnitude

**Theme Support:**

**Dark Mode (Default):**
- Background: `#0a0f0d` (dark charcoal)
- Borders: `#374151` (gray-700, provides 4.5:1 contrast with background)
- Text: `#ffffff` (white)
- Border width: 2px
- Border radius: 4px (small rounded corners)

**Light Mode:**
- Background: `#f9fafb` (gray-50)
- Borders: `#d1d5db` (gray-300, provides 3.5:1 contrast with background)
- Text: `#111827` (gray-900)
- Border width: 2px
- Border radius: 4px (small rounded corners)

**Accessibility Requirements:**
- Border-to-background contrast ratio: **≥ 3:1** (WCAG 2.0 AA)
- Text-to-background contrast ratio: **≥ 4.5:1** (WCAG 2.0 AA for normal text)
- Tile color gradients maintain sufficient contrast in both themes

**Tile Layout:**
- **Dimensions**:
  - Minimum: 150px × 150px (required for content display)
  - Aspect ratio: 1:1 to 1:1.618 (square to golden ratio)
  - No vertical rectangles allowed
- **Top-left**: Sector name
  - Dark mode: `#ffffff` (white, 14-16px, font-weight: 600)
  - Light mode: `#111827` (gray-900, 14-16px, font-weight: 600)
  - Requires minimum 150px width for proper display
- **Top-right**: Breathing indicator dot (animated, frequency based on attentionLevel)
  - High attention (80-100): Fast pulse (0.8s cycle)
  - Medium attention (40-79): Medium pulse (1.5s cycle)
  - Low attention (0-39): Slow pulse (3s cycle)
  - Size: 8px × 8px (fits in 150px minimum tile)
- **Bottom-right**:
  - Capital flow (12px, format: "±¥XXX亿" with arrow icon)
    - Positive flow: Red color (matching market convention)
    - Negative flow: Green color (matching market convention)
  - Change percentage (10px, format: "+2.5%")
    - Color matches tile background gradient
  - Requires minimum 150px width to avoid text truncation
- **Padding**: 8-12px (accounts for in minimum 150px dimension)
- **Border**: Theme-aware with accessible contrast (≥3:1)

**Color Intensity Calculation:**
```typescript
// Map change% to color intensity (0-5% range)
const intensity = Math.min(Math.abs(changePercent) / 5, 1);

// Color progression examples:
// +0.5%  → Light red (#F08FC8)
// +2.5%  → Medium red (#D52CA2) ⭐
// +5.0%  → Deep red (#A52380)

// -0.5%  → Light green (#05C588)
// -2.5%  → Medium green (#039160) ⭐
// -5.0%  → Deep green (#026B45)
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

**Theme Management:**
- Use `next-themes` for light/dark mode toggle
- Default theme: `dark`
- Theme persistence: localStorage
- Apply theme class to root `<html>` element
- Use Tailwind `dark:` prefix for dark mode styles

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

### Data Usage & Page Implementation

```typescript
// apps/preview/src/app/page.tsx
import { mockSectors } from '@/data/mockSectors';
import { HeatMap } from '@/components/HeatMap';

export default function PreviewPage() {
  return (
    <main className="min-h-screen bg-gray-50 dark:bg-[#0a0f0d] p-0 m-0">
      {/* Full-width container */}
      <div className="w-full min-w-[920px]">
        <HeatMap data={mockSectors} />
      </div>
    </main>
  );
}
```

```typescript
// apps/preview/src/components/HeatMap.tsx
import { Treemap, ResponsiveContainer } from 'recharts';
import { HeatMapHeader } from './HeatMapHeader';
import { Tile } from './Tile';
import type { Sector } from '@/types/sector';

interface HeatMapProps {
  data: Sector[];
}

export function HeatMap({ data }: HeatMapProps) {
  return (
    <div className="w-full min-w-[920px]">
      {/* Header */}
      <HeatMapHeader />

      {/* Treemap visualization area */}
      <div className="max-h-[580px] overflow-y-auto p-2">
        {/*
          p-2 = 8px padding on all sides
          Prevents scrollbar from overlapping with tiles when overflow occurs
          max-h-[580px] applies to treemap area only (excludes header)
        */}
        <ResponsiveContainer width="100%" height="auto" minHeight={400}>
          <Treemap
            data={data}
            dataKey="marketCap"
            stroke="#fff"
            fill="#8884d8"
            content={<Tile />}
          />
        </ResponsiveContainer>
      </div>
    </div>
  );
}
```

```typescript
// apps/preview/src/components/HeatMapHeader.tsx
import { Breadcrumb } from './Breadcrumb';
import { SearchBox } from './SearchBox';
import { Search } from 'lucide-react';

export function HeatMapHeader() {
  return (
    <div className="flex items-start justify-between p-4 pb-2 border-b border-gray-200 dark:border-white/5">
      {/* Left section */}
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
          Market Performance
        </h1>
        <Breadcrumb
          items={["一级行业", "二级行业", "三级行业", "股票"]}
          separator=" > "
        />
      </div>

      {/* Right section */}
      <div className="flex items-center gap-3">
        <SearchBox placeholder="Search sectors..." />

        {/* Toggle group - vertically stacked */}
        <div className="flex flex-col gap-1 h-[40px] justify-between">
          <Toggle label="Toggle 1" size="sm" />
          <Toggle label="Toggle 2" size="sm" />
        </div>
      </div>
    </div>
  );
}
```

```typescript
// apps/preview/src/components/SearchBox.tsx
import { Search } from 'lucide-react';
import { useState } from 'react';

interface SearchBoxProps {
  placeholder?: string;
  onSearch?: (query: string) => void;
}

export function SearchBox({ placeholder = "Search...", onSearch }: SearchBoxProps) {
  const [query, setQuery] = useState('');

  const handleSearch = () => {
    if (onSearch) {
      onSearch(query);
    }
  };

  return (
    <div className="relative w-[260px]">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        placeholder={placeholder}
        className="
          w-full h-[40px] px-4 pr-10
          bg-white/5 dark:bg-white/5
          border border-gray-300 dark:border-white/10
          rounded-lg
          text-sm text-gray-900 dark:text-white
          placeholder:text-gray-500 dark:placeholder:text-gray-400
          focus:outline-none focus:border-primary-500
          transition-colors
        "
      />
      {/* Inline search icon button */}
      <button
        onClick={handleSearch}
        className="
          absolute right-3 top-1/2 -translate-y-1/2
          text-gray-400 hover:text-gray-600 dark:hover:text-gray-300
          transition-colors
        "
        aria-label="Search"
      >
        <Search size={20} />
      </button>
    </div>
  );
}
```

```typescript
// apps/preview/src/components/Breadcrumb.tsx
interface BreadcrumbProps {
  items: string[];
  separator?: string;
}

export function Breadcrumb({ items, separator = " > " }: BreadcrumbProps) {
  return (
    <nav className="flex items-center text-sm text-gray-600 dark:text-gray-400">
      {items.map((item, index) => (
        <span key={index}>
          {item}
          {index < items.length - 1 && <span className="mx-1">{separator}</span>}
        </span>
      ))}
    </nav>
  );
}
```

### Color Calculation

**Chinese Market Convention: Red = UP, Green = DOWN**

**Base Colors:**
- Red (up) medium: `#D52CA2`
- Green (down) medium: `#039160`

```typescript
function getSectorColor(changePercent: number, theme: 'light' | 'dark' = 'dark'): string {
  // Chinese market: positive change = RED, negative change = GREEN

  if (changePercent > 0) {
    // UP = RED gradient based on intensity
    const intensity = Math.min(Math.abs(changePercent) / 5, 1); // 0-1 scale, max at 5%

    if (theme === 'dark') {
      // Dark mode: gradient from medium red (#D52CA2) to lighter/darker
      if (intensity < 0.5) {
        // Low gain: lighter red
        return interpolateColor('#F08FC8', '#D52CA2', intensity * 2);
      } else {
        // High gain: deeper red
        return interpolateColor('#D52CA2', '#A52380', (intensity - 0.5) * 2);
      }
    } else {
      // Light mode: adjusted for contrast
      if (intensity < 0.5) {
        return interpolateColor('#E87DB8', '#D52CA2', intensity * 2);
      } else {
        return interpolateColor('#D52CA2', '#B52390', (intensity - 0.5) * 2);
      }
    }
  } else if (changePercent < 0) {
    // DOWN = GREEN gradient based on intensity
    const intensity = Math.min(Math.abs(changePercent) / 5, 1); // 0-1 scale, max at 5%

    if (theme === 'dark') {
      // Dark mode: gradient from medium green (#039160) to lighter/darker
      if (intensity < 0.5) {
        // Low loss: lighter green
        return interpolateColor('#05C588', '#039160', intensity * 2);
      } else {
        // High loss: deeper green
        return interpolateColor('#039160', '#026B45', (intensity - 0.5) * 2);
      }
    } else {
      // Light mode: adjusted for contrast
      if (intensity < 0.5) {
        return interpolateColor('#04B876', '#039160', intensity * 2);
      } else {
        return interpolateColor('#039160', '#027650', (intensity - 0.5) * 2);
      }
    }
  } else {
    // No change = neutral gray
    return theme === 'light' ? '#9ca3af' : '#6b7280';
  }
}

// Helper function to interpolate between two hex colors
function interpolateColor(color1: string, color2: string, factor: number): string {
  const c1 = hexToRgb(color1);
  const c2 = hexToRgb(color2);

  const r = Math.round(c1.r + (c2.r - c1.r) * factor);
  const g = Math.round(c1.g + (c2.g - c1.g) * factor);
  const b = Math.round(c1.b + (c2.b - c1.b) * factor);

  return rgbToHex(r, g, b);
}
```

**Color Gradient Strategy:**
- **0-2.5% change**: Gradient from light to medium color
- **2.5-5% change**: Gradient from medium to deep color
- **> 5% change**: Deep color (maximum intensity)
- Medium colors (`#D52CA2` for red, `#039160` for green) appear at ~2.5% change

### Data Formatting

```typescript
// Format capital flow: 450.0 → "+¥450亿" or -300.0 → "-¥300亿"
function formatCapitalFlow(value: number): string {
  const sign = value >= 0 ? '+' : '';
  return `${sign}¥${Math.abs(value).toFixed(0)}亿`;
}

// Format change: 2.5 → "+2.5%"
function formatChangePercent(value: number): string {
  const sign = value >= 0 ? '+' : '';
  return `${sign}${value.toFixed(2)}%`;
}

// Calculate breathing animation duration based on attention level
function getBreathingDuration(attentionLevel: number): number {
  if (attentionLevel >= 80) return 0.8; // Fast
  if (attentionLevel >= 40) return 1.5; // Medium
  return 3.0; // Slow
}
```

### Breathing Indicator Animation

**Component:** `BreathingDot.tsx`

```typescript
interface BreathingDotProps {
  attentionLevel: number; // 0-100
}

// CSS animation with Tailwind
<div
  className="w-2 h-2 rounded-full bg-white/90"
  style={{
    animation: `breathing ${getBreathingDuration(attentionLevel)}s ease-in-out infinite`
  }}
/>

// Tailwind animation keyframe (in globals.css)
@keyframes breathing {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.3; transform: scale(0.8); }
}
```

**Visual Design:**
- Dot size: 8px × 8px
- Color (dark mode): `#ffffff` with 90% opacity
- Color (light mode): `#111827` with 80% opacity
- Position: Absolute top-right corner (8-12px from edges)
- Animation: Fade + scale pulse effect
- No glow/shadow (clean minimal design)

## Development Workflow

### Development Commands

```bash
# Start preview app (independent development)
npx nx run preview:serve
# → Access at http://localhost:4300

# Build preview app
npx nx run preview:build

# Lint code
npx nx run preview:lint

# Type check
npx nx run preview:type-check
```

### Development Ports

| Service | Port | Purpose |
|---------|------|---------|
| preview (dev) | 4300 | Preview app development server |

**Note:** No backend services required - pure frontend development with mock data.

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

## Future: API Integration (Not in Phase 1)

**Phase 1 (Current):** Use frontend mock data only
**Phase 2 (Future):** Add real-time data integration

### Future API Architecture

When ready to integrate real data:

1. **market-data service** provides `/sectors` endpoint
2. **Express API** proxies to market-data
3. **Preview app** fetches from `/api/preview/sectors`
4. **Mock data** replaced with live updates

This design document focuses on **Phase 1 UI development** with hardcoded mock data.

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

## Chinese Market Conventions

**⚠️ Critical: This application follows Chinese stock market color conventions**

### Color Semantics (Opposite of Western Markets)

| Direction | China | West |
|-----------|-------|------|
| **Price Up** | 🔴 **RED** | 🟢 Green |
| **Price Down** | 🟢 **GREEN** | 🔴 Red |
| **No Change** | ⚪ Gray | ⚪ Gray |

### Implementation Guidelines

1. **Never** assume red = bad, green = good
2. **Always** check `changePercent` sign, not color semantics
3. **Capital flow colors** also follow this convention:
   - Positive flow (inflow): Red
   - Negative flow (outflow): Green
4. **User education**: Consider adding a legend/tooltip explaining colors for international users

### Cultural Context

- Red is an auspicious color in Chinese culture → used for gains
- Green has neutral/cooling connotation → used for losses
- This convention is standardized across all Chinese stock exchanges (SSE, SZSE, HKEX)

## Layout & Responsive Design

### Page Structure

**Preview Page (`/preview`):**
```
┌──────────────────────────────────────────────────────────┐
│  HeatMap Container (920px - 100vw width)                 │
│  ┌────────────────────────────────────────────────────┐  │
│  │ Header (fixed height ~60-80px)                     │  │
│  │ ┌────────────────────────────────────────────────┐ │  │
│  │ │ Market Performance    [Search] [🔍] [T1] [T2] │ │  │
│  │ │ 一级行业 > 二级行业 > 三级行业 > 股票          │ │  │
│  │ └────────────────────────────────────────────────┘ │  │
│  │                                                    │  │
│  │ Treemap Area (max 580px height)                   │  │
│  │ ┌────────────────────────────────────────────┐    │  │
│ 8│ │                                            │    │8 │ ← 8px padding
│ p│ │     [Tiles dynamically laid out]           │    │p │
│ x│ │                                            │    │x │
│  │ │                                            │    │  │
│ 8│ │                                            │    │8 │
│ p│ │                                            │    │p │
│ x│ │                                            │    │x │ ← Scrollbar here
│  │ └────────────────────────────────────────────┘    │  │   if > 580px
│  │         ↑ Scrollable if > 580px                   │  │
│  └────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────┘
```

### HeatMap Dimensions

| Property | Value | Behavior |
|----------|-------|----------|
| **Min Width** | `920px` | Hard minimum, component won't shrink below |
| **Max Width** | `100vw` | Fills viewport width |
| **Height** | `auto` | Dynamically calculated by Treemap algorithm |
| **Max Height** | `580px` | Hard maximum ceiling |
| **Overflow** | `scroll` | Vertical scroll when height > 580px |
| **Padding** | `8px` | All sides, prevents scrollbar overlap with tiles |

### Scaling Behavior

**Zoom/Scale Support:**
- Component supports CSS `transform: scale()` operations
- Maintains 920px minimum width constraint at all zoom levels
- Scroll container adjusts to scaled content dimensions
- Preserves tile aspect ratios during scaling

**Dynamic Height Calculation:**
- Recharts Treemap algorithm computes optimal tile layout
- Height auto-adjusts based on:
  - Number of tiles (31 sectors)
  - Available width
  - Tile size distribution (market cap values)
- If calculated height ≤ 580px: use calculated height
- If calculated height > 580px: fix at 580px + enable scroll

### Viewport Breakpoints

- **Desktop (1920px+)**: Full width layout, optimal tile visibility
- **Tablet (768-1920px)**: Adaptive width, maintains 920px minimum
- **Mobile (<768px)**: Not prioritized (desktop-first visualization)
  - If accessed on mobile: horizontal scroll appears due to 920px min-width

## Success Criteria

### Functionality
1. ✅ Independent app runs on port 4300
2. ✅ Displays 31 SW Level-1 sectors correctly
3. ✅ Tile sizes proportional to market cap
4. ✅ Data fetches correctly from market-data service via API

### Visual Design
5. ✅ Matches Figma visual design (layout, typography, spacing)
6. ✅ **Chinese market colors**: RED for up, GREEN for down (verified)
7. ✅ Light/dark theme toggle works correctly
8. ✅ Breathing indicator animates at correct frequency

### Header Components
22. ✅ Header displays "Market Performance" title (left aligned)
23. ✅ Breadcrumb navigation below title ("一级行业 > 二级行业 > 三级行业 > 股票")
24. ✅ Search box with inline icon (right aligned, rounded rectangle)
25. ✅ Search icon clickable, no visible button shape
26. ✅ Two toggles vertically stacked after search box
27. ✅ Toggle group height matches search box height (40px)
28. ✅ Header layout responsive and properly aligned

### Layout & Dimensions
9. ✅ Page displays HeatMap in full-width layout
10. ✅ HeatMap minimum width: 920px (enforced)
11. ✅ HeatMap maximum height: 580px (enforced)
12. ✅ HeatMap container padding: 8px all sides (enforced)
13. ✅ Vertical scroll appears when height > 580px
14. ✅ Scrollbar does NOT overlap with tiles (8px padding prevents)
15. ✅ Height dynamically adjusts based on tile layout
16. ✅ Component supports scaling/zoom operations

### Tile Shape & Size
15. ✅ All tiles have aspect ratio between 1:1 and 1:1.618 (verified)
16. ✅ No vertical rectangles (width always ≥ height)
17. ✅ All tiles meet minimum width: 150px (verified)
18. ✅ All tiles meet minimum height: 150px (verified)
19. ✅ Tile content is readable and properly displayed
20. ✅ **All 31 sectors displayed** (no grouping, no exclusions)
21. ✅ **No "Others" category** (every sector shown individually)

### Accessibility (WCAG 2.0 AA)
9. ✅ Border-to-background contrast ≥ 3:1 in both themes
10. ✅ Text-to-background contrast ≥ 4.5:1 in both themes
11. ✅ Color is not the only means of conveying information (use text labels)
12. ✅ Tile gradients maintain sufficient contrast

### Code Quality
13. ✅ Clean, maintainable code structure
14. ✅ TypeScript types are explicit and correct
15. ✅ Components follow single responsibility principle
16. ✅ **Zero imports from apps/web** (complete independence)
17. ✅ Components built using `/ui-ux-pro-max` skill patterns
18. ✅ Design specs extracted from Figma using MCP tools
19. ✅ Easy integration path into apps/web

### Performance
17. ✅ Fast iteration for style adjustments
18. ✅ Smooth breathing animations (no jank)
19. ✅ Responsive to theme changes

## Non-Goals

- ❌ Docker deployment (development only, no production docker needed)
- ❌ User authentication
- ❌ Data persistence
- ❌ Real market data integration (mock only)
- ❌ Mobile responsiveness (desktop-first)
- ❌ Complex interactions (Phase 1)
- ❌ **Reusing components from apps/web** (design independently)
- ❌ **Matching apps/web style patterns** (fresh design approach)
- ❌ **Grouping sectors into "Others" category** (all 31 must show individually)
- ❌ **Excluding small market cap sectors** (all sectors required)

## Design Independence & Component Philosophy

### ⚠️ Critical: Complete Design Independence from apps/web

**The preview app components must be designed independently without being influenced by apps/web components.**

**Design Principles:**
1. **No code sharing** with apps/web during Phase 1
2. **No style inheritance** from apps/web's Tailwind config
3. **No component reuse** from apps/web/components
4. **Clean slate** - design components from scratch based on Figma
5. **Fresh perspective** - not constrained by existing patterns

**Rationale:**
- Allows for innovative UI/UX without legacy constraints
- Faster iteration without worrying about breaking web
- Pure implementation of Figma design vision
- Better component API design from ground up
- Can be selectively integrated later (not wholesale copy)

### Required Development Tools

**🎨 UI/UX Design Tool:**
```bash
/ui-ux-pro-max
```
- **Use when:** Building any component (HeatMap, Tile, BreathingDot)
- **Purpose:** Professional UI/UX design with best practices
- **Features:** 50 styles, 21 palettes, component patterns, accessibility

**📐 Figma Integration Tool:**
```bash
/figma or Figma MCP tools
```
- **Use when:** Extracting component specs from Figma design
- **Purpose:** Get accurate measurements, colors, spacing from design
- **Features:** Screenshot, design context, variable definitions

### Component Development Workflow

1. **Extract from Figma** → Use Figma MCP tools to get exact specs
2. **Design component** → Use `/ui-ux-pro-max` skill for implementation
3. **Implement** → Build with React + Tailwind (independent config)
4. **Iterate** → Refine based on visual comparison with Figma
5. **No web imports** → Zero dependencies on apps/web

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
- **Design freedom**: Not constrained by web's component patterns

### Why Recharts for treemap?

- **Already in stack**: No new dependencies
- **React-first**: Native React component
- **Flexible**: Custom rendering with Tile component
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
3. Set up preview Next.js application structure
4. **Use Figma MCP tools** to extract detailed component specs
5. Implement mock data (31 SW sectors)
6. **Use `/ui-ux-pro-max` skill** to build HeatMapHeader component
7. **Use `/ui-ux-pro-max` skill** to build SearchBox component
8. **Use `/ui-ux-pro-max` skill** to build Breadcrumb component
9. **Use `/ui-ux-pro-max` skill** to build HeatMap container component
10. **Use `/ui-ux-pro-max` skill** to build Tile component
11. **Use `/ui-ux-pro-max` skill** to build BreathingDot component
12. Add light/dark theme support with next-themes
13. Style refinement iterations (compare with Figma)
14. Integration into apps/web (selective, not wholesale)
