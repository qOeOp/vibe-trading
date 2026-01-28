# Treemap Preview Application Design

**Date:** 2026-01-28
**Status:** Approved
**Type:** New Feature - Independent Preview Application
**Version:** 2.0 (Restructured)
**Last Updated:** 2026-01-28

---

## 📑 Table of Contents

### 1. [Overview](#1-overview)
- 1.1 Purpose & Scope
- 1.2 Design Source
- 1.3 Key Features

### 2. [System Architecture](#2-system-architecture)
- 2.1 System Flow
- 2.2 Data Flow
- 2.3 Technology Stack

### 3. [Project File Structure](#3-project-file-structure)
- 3.1 Directory Layout
- 3.2 Component Files
- 3.3 Configuration Files

### 4. [Data Model & Mock Data](#4-data-model--mock-data)
- 4.1 Type Definitions
- 4.2 Level 1: SW Industry Sectors (31 items)
- 4.3 Level 2: Sub-Industries (8 items under 电子)
- 4.4 Level 3: Tertiary Industries (7 items under 半导体)
- 4.5 Level 4: Individual Stocks (15 items under 光学光电子)
- 4.6 Sector Icon System (31 Lucide mappings)

### 5. [Code Architecture](#5-code-architecture)
- 5.1 Single Responsibility Principle
- 5.2 Component Hierarchy
- 5.3 Hooks & State Management

### 6. [Visual Design System](#6-visual-design-system)
- 6.1 Base Design (Figma Specifications)
- 6.2 Glassmorphism Effects
- 6.3 3D Hover Interaction
- 6.4 Animation System

### 7. [Layout & Dimensions](#7-layout--dimensions)
- 7.1 Page Layout
- 7.2 HeatMap Container Dimensions
- 7.3 Tile Shape & Size Constraints
- 7.4 Header Design & Scroll Effects

### 8. [Component Specifications](#8-component-specifications)
- 8.1 HeatMap
- 8.2 HeatMapHeader
- 8.3 HeatMapTile
- 8.4 TileBottomPanel
- 8.5 Sparkline
- 8.6 BreathingDot
- 8.7 Breadcrumb
- 8.8 SearchBox
- 8.9 DynamicBackground
- 8.10 SpotlightEffect

### 9. [Implementation Guide](#9-implementation-guide)
- 9.1 Data Usage & Page Setup
- 9.2 Color Calculation Functions
- 9.3 Animation Configuration
- 9.4 Theme Integration

### 10. [Development Workflow](#10-development-workflow)
- 10.1 Development Commands
- 10.2 Port Assignments
- 10.3 Build & Test Process

### 11. [Success Criteria](#11-success-criteria)
- 11.1 Functionality (1-4)
- 11.2 Visual Design (5-8)
- 11.3 Layout & Dimensions (9-16)
- 11.4 Tile Shape & Size (17-21)
- 11.5 Header Components (22-28)
- 11.6 Architecture & Code Quality (29-32)
- 11.7 Glassmorphism Effects (33-41)
- 11.8 Animation System (42-46)
- 11.9 Advanced Features (47-49)
- 11.10 3D Hover Interaction (50-59)
- 11.11 Sector Icons (60-65)
- 11.12 Header Scroll Effects (66-71)
- 11.13 Sparkline Animations (72-77)

### 12. [Design Principles](#12-design-principles)
- 12.1 Complete Independence from apps/web
- 12.2 Required Development Tools
- 12.3 Component Development Workflow

### 13. [Technical Decisions](#13-technical-decisions)
- 13.1 Why Next.js instead of Vite?
- 13.2 Why Independent App?
- 13.3 Why Recharts for Layout?

### 14. [Future Considerations](#14-future-considerations)
- 14.1 Phase 2: API Integration
- 14.2 Phase 2: Interactive Features
- 14.3 Integration into apps/web

### 15. [Non-Goals](#15-non-goals)

### 16. [Appendices](#16-appendices)
- Appendix A: Detailed Code Examples
- Appendix B: Figma Design References

---

## 1. Overview

### 1.1 Purpose & Scope

Create an independent HeatMap visualization page for displaying 31 SW Level-1 sector indices. The application will be built as a standalone Next.js app (`apps/preview`) for rapid UI/UX iteration, then integrated into `apps/web` once finalized.

**Key Goals:**
- Pure frontend development with mock data (no API in Phase 1)
- Focus on visual design and glassmorphism effects
- Support 4-level drill-down (sector → industry → sub-industry → stock)
- Advanced 3D hover interactions with sparkline trends
- Complete design independence from existing apps/web components

### 1.2 Design Source

**Figma:** https://www.figma.com/design/O52eqHmOTyh0tzZwpC7sl9/landing-page?node-id=524-11

**Visual Characteristics:**
- Sector tiles sized proportionally by market capitalization
- Color-coded by performance (Chinese market convention: **red=up, green=down**)
- Glassmorphism aesthetic with backdrop blur and transparency
- 4px gaps between tiles for crystal edge refraction
- Tile displays: sector name (top-left), breathing indicator (top-right), capital flow + change% (bottom-right)
- Supports light/dark theme with accessible border contrast (WCAG 2.0 AA: 3:1 minimum)

### 1.3 Key Features

**Visual Effects:**
- ✅ Glassmorphism (backdrop-filter blur, semi-transparent layers)
- ✅ 3D hover interaction (tile elevation, panel separation, sparkline reveal)
- ✅ Framer Motion animations (drill-down, stagger, transitions)
- ✅ Dynamic background with animated color blocks
- ✅ Optional spotlight effect (mouse-following)

**Interaction:**
- ✅ 4-level drill-down navigation
- ✅ Hover-triggered sparkline with 30-day trend
- ✅ Breathing indicator (frequency based on attention level)
- ✅ Sector icons (31 Lucide icons for visual metaphors)

**Technical:**
- ✅ Single Responsibility Principle (layout logic decoupled from UI)
- ✅ Mock data for all 4 levels (31 sectors + sub-levels)
- ✅ Adaptive content degradation (based on tile size)
- ✅ Variable speed color mapping (non-linear intensity)

---

## 2. System Architecture

### 2.1 System Flow

```
Browser (localhost:4300 dev / localhost:4200/preview prod)
    ↓
apps/preview (Next.js 15 + React 19)
    ↓
Mock Data (hardcoded TypeScript arrays)
    ↓
HeatMap Visualization
    ├─ useTreeMap Hook → Layout Calculation
    ├─ HeatMapTile Components → UI Rendering
    └─ useDrillDown Hook → Navigation State
```

### 2.2 Data Flow

**Phase 1 (Current):**
1. **Frontend mock data** - Hardcoded array of 31 SW Level-1 sectors
2. **Preview app** - Uses mock data directly for rendering
3. **No API calls** - Pure frontend development for UI iteration
4. **Pure display mode** - No user interactions beyond hover

**Note:** API integration will be added in Phase 2. Current focus is UI design and styling.

### 2.3 Technology Stack

**Frontend Framework:**
- **Next.js 15** - Static export mode for deployment
- **React 19** - UI library with latest features
- **TypeScript** - Type-safe development
- **Tailwind CSS v4** - Utility-first styling with OKLCH color space
- **Framer Motion** - Animation library for drill-down and hover effects

**Visualization:**
- **Recharts v3** - Treemap layout calculation only (not for rendering)
- **Custom SVG rendering** - For glassmorphism and 3D effects

**UI Components:**
- **Lucide React** - Icon system (31 sector icons)
- **Custom components** - Built using `/ui-ux-pro-max` skill patterns

**Build Tools:**
- **Nx 22.3.3** - Monorepo tooling
- **ESBuild** - Fast bundling
- **PostCSS** - CSS processing

---

## 3. Project File Structure

### 3.1 Directory Layout

```
apps/preview/
├── src/
│   └── app/
│       ├── layout.tsx           # Root layout with dark theme
│       ├── page.tsx             # Main treemap page
│       ├── components/          # Feature components
│       ├── hooks/               # Custom React hooks
│       ├── types/               # TypeScript type definitions
│       ├── data/                # Mock data
│       └── globals.css          # Tailwind CSS imports
├── tailwind.config.ts           # Independent Tailwind config
├── tsconfig.json                # TypeScript configuration
├── next.config.js               # Next.js config (static export)
└── project.json                 # Nx target configuration
```

### 3.2 Component Files

**Core Components:**
```
app/components/
├── HeatMap.tsx                  # Main container component
├── HeatMapHeader.tsx            # Header with title, breadcrumb, search
├── HeatMapTile.tsx              # Glassmorphism tile UI
├── TileBottomPanel.tsx          # 3D-transformed bottom panel
├── Sparkline.tsx                # Mini trend chart (2px stroke)
├── BreathingDot.tsx             # Animated attention indicator
├── Breadcrumb.tsx               # Navigation breadcrumb
├── SearchBox.tsx                # Search input with icon
├── DynamicBackground.tsx        # Blurred color blocks
└── SpotlightEffect.tsx          # Mouse-following highlight
```

**Hooks:**
```
app/hooks/
├── useTreeMap.ts                # Recharts layout calculation
└── useDrillDown.ts              # 4-level navigation state
```

**Data & Types:**
```
app/types/sector.ts              # TypeScript interfaces
app/data/mockSectors.ts          # Mock data (31 sectors + drill-down)
```

### 3.3 Configuration Files

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

**project.json (Nx):**
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

**tailwind.config.ts:**
- Independent configuration (not inherited from apps/web)
- Uses Violet Bloom theme colors
- Includes glassmorphism utilities
- Supports dark mode via `next-themes`

---

## 4. Data Model & Mock Data

### 4.1 Type Definitions

**Base Entity Interface:**
```typescript
interface BaseEntity {
  code: string;
  name: string;
  icon?: string;          // Icon name (e.g., "Cpu", "Landmark")
  marketCap: number;      // Market cap in 亿元 (determines tile size)
  changePercent: number;  // Change percentage (determines color)
  capitalFlow: number;    // Capital flow in 亿元 (positive=inflow, negative=outflow)
  attentionLevel: number; // Attention level 0-100 (determines breathing indicator frequency)
  level: 1 | 2 | 3 | 4;
  parent?: string;        // Parent code
  hasChildren?: boolean;
}
```

**Sector (Level 1):**
```typescript
interface Sector extends BaseEntity {
  level: 1;
}
```

**Industry (Level 2):**
```typescript
interface Industry extends BaseEntity {
  level: 2;
  parent: string;  // Required for Level 2+
}
```

**Sub-Industry (Level 3):**
```typescript
interface SubIndustry extends BaseEntity {
  level: 3;
  parent: string;
}
```

**Stock (Level 4):**
```typescript
interface Stock extends BaseEntity {
  price: number;         // Stock price
  volume: number;        // Trading volume (手)
  level: 4;
  parent: string;
}
```

### 4.2 Level 1: SW Industry Sectors (31 items)

**File:** `apps/preview/src/data/mockSectors.ts`

```typescript
export const mockSectors: Sector[] = [
  {
    code: "801010",
    name: "农林牧渔",
    icon: "Sprout",
    marketCap: 12500.0,
    changePercent: 1.85,
    capitalFlow: 320.5,
    attentionLevel: 45,
    level: 1,
    hasChildren: false
  },
  {
    code: "801020",
    name: "煤炭",
    icon: "Fuel",
    marketCap: 18200.0,
    changePercent: -2.15,
    capitalFlow: -580.2,
    attentionLevel: 88,
    level: 1,
    hasChildren: false
  },
  {
    code: "801030",
    name: "有色金属",
    icon: "Component",
    marketCap: 22100.0,
    changePercent: 0.95,
    capitalFlow: 450.8,
    attentionLevel: 62,
    level: 1,
    hasChildren: false
  },
  {
    code: "801040",
    name: "钢铁",
    icon: "Anvil",
    marketCap: 14300.0,
    changePercent: -1.45,
    capitalFlow: -320.0,
    attentionLevel: 55,
    level: 1,
    hasChildren: false
  },
  {
    code: "801050",
    name: "基础化工",
    icon: "FlaskConical",
    marketCap: 25800.0,
    changePercent: 2.35,
    capitalFlow: 680.5,
    attentionLevel: 72,
    level: 1,
    hasChildren: false
  },
  {
    code: "801080",
    name: "建筑",
    icon: "HardHat",
    marketCap: 16500.0,
    changePercent: 0.65,
    capitalFlow: 210.3,
    attentionLevel: 38,
    level: 1,
    hasChildren: false
  },
  {
    code: "801110",
    name: "建材",
    icon: "Boxes",
    marketCap: 13200.0,
    changePercent: -0.85,
    capitalFlow: -180.5,
    attentionLevel: 42,
    level: 1,
    hasChildren: false
  },
  {
    code: "801120",
    name: "轻工制造",
    icon: "Package",
    marketCap: 11800.0,
    changePercent: 1.25,
    capitalFlow: 155.0,
    attentionLevel: 35,
    level: 1,
    hasChildren: false
  },
  {
    code: "801140",
    name: "机械",
    icon: "Cog",
    marketCap: 19500.0,
    changePercent: 1.75,
    capitalFlow: 425.8,
    attentionLevel: 58,
    level: 1,
    hasChildren: false
  },
  {
    code: "801150",
    name: "电力设备",
    icon: "Zap",
    marketCap: 28900.0,
    changePercent: 3.25,
    capitalFlow: 920.5,
    attentionLevel: 91,
    level: 1,
    hasChildren: false
  },
  {
    code: "801160",
    name: "国防军工",
    icon: "ShieldCheck",
    marketCap: 15600.0,
    changePercent: -1.95,
    capitalFlow: -410.2,
    attentionLevel: 76,
    level: 1,
    hasChildren: false
  },
  {
    code: "801170",
    name: "汽车",
    icon: "CarFront",
    marketCap: 21500.0,
    changePercent: 2.85,
    capitalFlow: 650.0,
    attentionLevel: 82,
    level: 1,
    hasChildren: false
  },
  {
    code: "801180",
    name: "商贸零售",
    icon: "ShoppingCart",
    marketCap: 12900.0,
    changePercent: 0.45,
    capitalFlow: 95.5,
    attentionLevel: 28,
    level: 1,
    hasChildren: false
  },
  {
    code: "801200",
    name: "消费者服务",
    icon: "Users",
    marketCap: 14800.0,
    changePercent: 1.55,
    capitalFlow: 280.0,
    attentionLevel: 48,
    level: 1,
    hasChildren: false
  },
  {
    code: "801210",
    name: "家电",
    icon: "TvMinimal",
    marketCap: 16200.0,
    changePercent: -0.95,
    capitalFlow: -220.5,
    attentionLevel: 52,
    level: 1,
    hasChildren: false
  },
  {
    code: "801230",
    name: "纺织服装",
    icon: "Shirt",
    marketCap: 9800.0,
    changePercent: 0.35,
    capitalFlow: 65.0,
    attentionLevel: 22,
    level: 1,
    hasChildren: false
  },
  {
    code: "801710",
    name: "医药",
    icon: "Dna",
    marketCap: 32500.0,
    changePercent: 1.95,
    capitalFlow: 780.5,
    attentionLevel: 68,
    level: 1,
    hasChildren: false
  },
  {
    code: "801720",
    name: "食品饮料",
    icon: "Utensils",
    marketCap: 35800.0,
    changePercent: 2.15,
    capitalFlow: 850.0,
    attentionLevel: 74,
    level: 1,
    hasChildren: false
  },
  {
    code: "801730",
    name: "农业",
    icon: "Tractor",
    marketCap: 11200.0,
    changePercent: -1.25,
    capitalFlow: -195.0,
    attentionLevel: 44,
    level: 1,
    hasChildren: false
  },
  {
    code: "801780",
    name: "银行",
    icon: "Landmark",
    marketCap: 45200.0,
    changePercent: 0.85,
    capitalFlow: 520.0,
    attentionLevel: 56,
    level: 1,
    hasChildren: false
  },
  {
    code: "801790",
    name: "非银行金融",
    icon: "TrendingUp",
    marketCap: 28500.0,
    changePercent: 1.45,
    capitalFlow: 480.5,
    attentionLevel: 64,
    level: 1,
    hasChildren: false
  },
  {
    code: "801880",
    name: "房地产",
    icon: "Home",
    marketCap: 18900.0,
    changePercent: -2.85,
    capitalFlow: -720.0,
    attentionLevel: 92,
    level: 1,
    hasChildren: false
  },
  {
    code: "801890",
    name: "交通运输",
    icon: "Truck",
    marketCap: 17200.0,
    changePercent: 0.55,
    capitalFlow: 135.5,
    attentionLevel: 40,
    level: 1,
    hasChildren: false
  },
  {
    code: "801980",
    name: "电子",
    icon: "Cpu",
    marketCap: 38500.0,
    changePercent: 3.15,
    capitalFlow: 1050.0,
    attentionLevel: 95,
    level: 1,
    hasChildren: true  // Has Level 2 sub-industries
  },
  {
    code: "801990",
    name: "通信",
    icon: "Rss",
    marketCap: 14500.0,
    changePercent: 1.05,
    capitalFlow: 210.0,
    attentionLevel: 50,
    level: 1,
    hasChildren: false
  },
  {
    code: "802010",
    name: "计算机",
    icon: "Monitor",
    marketCap: 26800.0,
    changePercent: 2.65,
    capitalFlow: 720.5,
    attentionLevel: 78,
    level: 1,
    hasChildren: false
  },
  {
    code: "802020",
    name: "传媒",
    icon: "Radio",
    marketCap: 12300.0,
    changePercent: -0.65,
    capitalFlow: -125.0,
    attentionLevel: 36,
    level: 1,
    hasChildren: false
  },
  {
    code: "802030",
    name: "电力及公用事业",
    icon: "Lightbulb",
    marketCap: 15800.0,
    changePercent: 0.25,
    capitalFlow: 58.0,
    attentionLevel: 25,
    level: 1,
    hasChildren: false
  },
  {
    code: "802040",
    name: "石油石化",
    icon: "Droplets",
    marketCap: 24500.0,
    changePercent: -1.75,
    capitalFlow: -520.5,
    attentionLevel: 70,
    level: 1,
    hasChildren: false
  },
  {
    code: "802050",
    name: "环保",
    icon: "Leaf",
    marketCap: 10500.0,
    changePercent: 1.35,
    capitalFlow: 165.0,
    attentionLevel: 46,
    level: 1,
    hasChildren: false
  },
  {
    code: "802060",
    name: "美容护理",
    icon: "Sparkles",
    marketCap: 13800.0,
    changePercent: 0.75,
    capitalFlow: 125.5,
    attentionLevel: 32,
    level: 1,
    hasChildren: false
  }
];
```

**Data Characteristics:**
- Total: 31 sectors (complete SW Level-1 classification)
- Market Cap Range: ¥9,800亿 to ¥45,200亿
- Change Range: -2.85% to +3.25%
- Capital Flow Range: -¥720亿 to +¥1,050亿
- Attention Level Range: 22 to 95

### 4.3 Level 2: Sub-Industries (8 items under 电子)

**File:** `apps/preview/src/data/mockLevel2.ts`

```typescript
export const mockLevel2_Electronics: Industry[] = [
  {
    code: "801980_01",
    name: "半导体",
    marketCap: 15800.0,
    changePercent: 4.2,
    capitalFlow: 520.0,
    attentionLevel: 92,
    hasChildren: true,  // Has Level 3 sub-industries
    level: 2,
    parent: "801980"
  },
  {
    code: "801980_02",
    name: "元件",
    marketCap: 8200.0,
    changePercent: 2.8,
    capitalFlow: 280.0,
    attentionLevel: 68,
    hasChildren: false,
    level: 2,
    parent: "801980"
  },
  {
    code: "801980_03",
    name: "光学光电子",
    marketCap: 6500.0,
    changePercent: 3.5,
    capitalFlow: 310.0,
    attentionLevel: 85,
    hasChildren: true,  // Has Level 4 stocks
    level: 2,
    parent: "801980"
  },
  {
    code: "801980_04",
    name: "消费电子",
    marketCap: 3800.0,
    changePercent: 1.9,
    capitalFlow: 150.0,
    attentionLevel: 55,
    hasChildren: false,
    level: 2,
    parent: "801980"
  },
  {
    code: "801980_05",
    name: "电子化学品",
    marketCap: 1600.0,
    changePercent: 2.2,
    capitalFlow: 95.0,
    attentionLevel: 48,
    hasChildren: false,
    level: 2,
    parent: "801980"
  },
  {
    code: "801980_06",
    name: "其他电子",
    marketCap: 1200.0,
    changePercent: 1.5,
    capitalFlow: 45.0,
    attentionLevel: 35,
    hasChildren: false,
    level: 2,
    parent: "801980"
  },
  {
    code: "801980_07",
    name: "军工电子",
    marketCap: 900.0,
    changePercent: 3.8,
    capitalFlow: 68.0,
    attentionLevel: 72,
    hasChildren: false,
    level: 2,
    parent: "801980"
  },
  {
    code: "801980_08",
    name: "汽车电子",
    marketCap: 500.0,
    changePercent: 2.6,
    capitalFlow: 32.0,
    attentionLevel: 58,
    hasChildren: false,
    level: 2,
    parent: "801980"
  }
];
```

### 4.4 Level 3: Tertiary Industries (7 items under 半导体)

**File:** `apps/preview/src/data/mockLevel3.ts`

```typescript
export const mockLevel3_Semiconductor: SubIndustry[] = [
  {
    code: "801980_01_01",
    name: "半导体设备",
    marketCap: 3200.0,
    changePercent: 5.1,
    capitalFlow: 180.0,
    attentionLevel: 88,
    hasChildren: false,
    level: 3,
    parent: "801980_01"
  },
  {
    code: "801980_01_02",
    name: "半导体材料",
    marketCap: 2800.0,
    changePercent: 4.8,
    capitalFlow: 150.0,
    attentionLevel: 82,
    hasChildren: false,
    level: 3,
    parent: "801980_01"
  },
  {
    code: "801980_01_03",
    name: "数字芯片设计",
    marketCap: 3500.0,
    changePercent: 3.9,
    capitalFlow: 190.0,
    attentionLevel: 90,
    hasChildren: false,
    level: 3,
    parent: "801980_01"
  },
  {
    code: "801980_01_04",
    name: "模拟芯片设计",
    marketCap: 2200.0,
    changePercent: 4.2,
    capitalFlow: 120.0,
    attentionLevel: 78,
    hasChildren: false,
    level: 3,
    parent: "801980_01"
  },
  {
    code: "801980_01_05",
    name: "集成电路制造",
    marketCap: 2500.0,
    changePercent: 3.6,
    capitalFlow: 140.0,
    attentionLevel: 85,
    hasChildren: false,
    level: 3,
    parent: "801980_01"
  },
  {
    code: "801980_01_06",
    name: "集成电路封测",
    marketCap: 1100.0,
    changePercent: 3.2,
    capitalFlow: 68.0,
    attentionLevel: 70,
    hasChildren: false,
    level: 3,
    parent: "801980_01"
  },
  {
    code: "801980_01_07",
    name: "分立器件",
    marketCap: 500.0,
    changePercent: 2.8,
    capitalFlow: 32.0,
    attentionLevel: 55,
    hasChildren: false,
    level: 3,
    parent: "801980_01"
  }
];
```

### 4.5 Level 4: Individual Stocks (15 items under 光学光电子)

**File:** `apps/preview/src/data/mockLevel4.ts`

```typescript
export const mockLevel4_Optoelectronics: Stock[] = [
  // 显示面板类
  {
    code: "000725",
    name: "京东方A",
    price: 3.85,
    marketCap: 1450.0,
    changePercent: 2.8,
    volume: 185000,
    attentionLevel: 88,
    capitalFlow: 105.0,
    level: 4,
    parent: "801980_03"
  },
  {
    code: "000100",
    name: "TCL科技",
    price: 4.62,
    marketCap: 680.0,
    changePercent: 3.2,
    volume: 92000,
    attentionLevel: 82,
    capitalFlow: 58.0,
    level: 4,
    parent: "801980_03"
  },
  {
    code: "000050",
    name: "深天马A",
    price: 10.25,
    marketCap: 320.0,
    changePercent: 1.9,
    volume: 45000,
    attentionLevel: 68,
    capitalFlow: 28.0,
    level: 4,
    parent: "801980_03"
  },
  {
    code: "002387",
    name: "维信诺",
    price: 8.15,
    marketCap: 280.0,
    changePercent: 4.5,
    volume: 68000,
    attentionLevel: 90,
    capitalFlow: 45.0,
    level: 4,
    parent: "801980_03"
  },
  {
    code: "600707",
    name: "彩虹股份",
    price: 5.32,
    marketCap: 185.0,
    changePercent: 2.1,
    volume: 32000,
    attentionLevel: 62,
    capitalFlow: 18.0,
    level: 4,
    parent: "801980_03"
  },

  // LED 照明类
  {
    code: "600703",
    name: "三安光电",
    price: 18.65,
    marketCap: 850.0,
    changePercent: 3.8,
    volume: 125000,
    attentionLevel: 92,
    capitalFlow: 68.0,
    level: 4,
    parent: "801980_03"
  },
  {
    code: "002745",
    name: "木林森",
    price: 12.40,
    marketCap: 420.0,
    changePercent: 2.5,
    volume: 58000,
    attentionLevel: 72,
    capitalFlow: 32.0,
    level: 4,
    parent: "801980_03"
  },
  {
    code: "002449",
    name: "国星光电",
    price: 9.88,
    marketCap: 195.0,
    changePercent: 1.8,
    volume: 28000,
    attentionLevel: 58,
    capitalFlow: 15.0,
    level: 4,
    parent: "801980_03"
  },
  {
    code: "002429",
    name: "兆驰股份",
    price: 6.52,
    marketCap: 380.0,
    changePercent: 3.1,
    volume: 78000,
    attentionLevel: 78,
    capitalFlow: 38.0,
    level: 4,
    parent: "801980_03"
  },
  {
    code: "300303",
    name: "聚飞光电",
    price: 4.95,
    marketCap: 145.0,
    changePercent: 2.2,
    volume: 38000,
    attentionLevel: 65,
    capitalFlow: 12.0,
    level: 4,
    parent: "801980_03"
  },

  // 光学镜头类
  {
    code: "002273",
    name: "水晶光电",
    price: 15.20,
    marketCap: 280.0,
    changePercent: 4.2,
    volume: 62000,
    attentionLevel: 85,
    capitalFlow: 28.0,
    level: 4,
    parent: "801980_03"
  },
  {
    code: "002036",
    name: "联创电子",
    price: 11.35,
    marketCap: 165.0,
    changePercent: 3.5,
    volume: 48000,
    attentionLevel: 75,
    capitalFlow: 18.0,
    level: 4,
    parent: "801980_03"
  },
  {
    code: "603297",
    name: "永新光学",
    price: 68.50,
    marketCap: 95.0,
    changePercent: 1.5,
    volume: 12000,
    attentionLevel: 52,
    capitalFlow: 8.0,
    level: 4,
    parent: "801980_03"
  },
  {
    code: "688010",
    name: "福光股份",
    price: 28.90,
    marketCap: 78.0,
    changePercent: 2.8,
    volume: 18000,
    attentionLevel: 68,
    capitalFlow: 10.0,
    level: 4,
    parent: "801980_03"
  },
  {
    code: "300790",
    name: "宇瞳光学",
    price: 32.45,
    marketCap: 55.0,
    changePercent: 3.2,
    volume: 15000,
    attentionLevel: 70,
    capitalFlow: 6.0,
    level: 4,
    parent: "801980_03"
  }
];
```

### 4.6 Sector Icon System (31 Lucide mappings)

**Icon Specifications:**
- Library: Lucide React (already in dependencies)
- Size: 16-18px (consistent across all tiles)
- Stroke-width: 2px (matches Lucide default)
- Color: `rgba(255, 255, 255, 0.9)` (slightly transparent white)
- Position: Left of sector name (top-left area)
- Spacing: 6px gap between icon and text

**Complete Icon Mapping (31 SW Level-1 Sectors):**

| Sector | Icon Component | Visual Metaphor |
|--------|----------------|-----------------|
| 银行 (Banking) | `<Landmark />` | 传统金融基石 |
| 电子 (Electronics) | `<Cpu />` | 核心硬件/半导体 |
| 石油石化 (Petrochemical) | `<Droplets />` | 能源流体 |
| 计算机 (IT/Software) | `<Monitor />` | 软件与显示 |
| 医药 (Biotech) | `<Dna />` | 生命科学 |
| 电力设备 (Power Equipment) | `<Zap />` | 电能与高压 |
| 国防军工 (Defense) | `<ShieldCheck />` | 安全与防护 |
| 有色金属 (Non-ferrous Metals) | `<Component />` | 工业原材料 |
| 食品饮料 (F&B) | `<Utensils />` | 消费必需品 |
| 房地产 (Real Estate) | `<Home />` | 空间与资产 |
| 汽车 (Automotive) | `<CarFront />` | 交通载具 |
| 通信 (Telecom) | `<Rss />` | 信号传输 |
| 煤炭 (Coal) | `<Fuel />` | 化石能源 |
| 钢铁 (Steel) | `<Anvil />` | 重工业金属 |
| 基础化工 (Basic Chemicals) | `<FlaskConical />` | 化学合成 |
| 建筑 (Construction) | `<HardHat />` | 工程建设 |
| 建材 (Building Materials) | `<Boxes />` | 建造材料 |
| 轻工制造 (Light Manufacturing) | `<Package />` | 轻量产品 |
| 机械 (Machinery) | `<Cog />` | 机械设备 |
| 商贸零售 (Retail) | `<ShoppingCart />` | 零售流通 |
| 消费者服务 (Consumer Services) | `<Users />` | 服务人群 |
| 家电 (Home Appliances) | `<TvMinimal />` | 家用电器 |
| 纺织服装 (Textile & Apparel) | `<Shirt />` | 衣料制品 |
| 农林牧渔 (Agriculture) | `<Sprout />` | 农业生产 |
| 非银行金融 (Non-bank Finance) | `<TrendingUp />` | 金融市场 |
| 交通运输 (Transportation) | `<Truck />` | 物流运输 |
| 传媒 (Media) | `<Radio />` | 媒体传播 |
| 电力及公用事业 (Utilities) | `<Lightbulb />` | 公共服务 |
| 环保 (Environmental) | `<Leaf />` | 生态保护 |
| 美容护理 (Beauty & Personal Care) | `<Sparkles />` | 美容护理 |
| 农业 (Agriculture - if separate) | `<Tractor />` | 农机耕作 |

**Icon Usage Example:**
```typescript
import {
  Landmark, Cpu, Droplets, Monitor, Dna, Zap,
  ShieldCheck, Component, Utensils, Home, CarFront, Rss,
  Fuel, Anvil, FlaskConical, HardHat, Boxes, Package,
  Cog, ShoppingCart, Users, TvMinimal, Shirt, Sprout,
  TrendingUp, Truck, Radio, Lightbulb, Leaf, Sparkles, Tractor
} from 'lucide-react';

// Sector icon map
const sectorIcons: Record<string, React.FC<LucideProps>> = {
  '银行': Landmark,
  '电子': Cpu,
  '石油石化': Droplets,
  '计算机': Monitor,
  '医药': Dna,
  '电力设备': Zap,
  '国防军工': ShieldCheck,
  '有色金属': Component,
  '食品饮料': Utensils,
  '房地产': Home,
  '汽车': CarFront,
  '通信': Rss,
  '煤炭': Fuel,
  '钢铁': Anvil,
  '基础化工': FlaskConical,
  '建筑': HardHat,
  '建材': Boxes,
  '轻工制造': Package,
  '机械': Cog,
  '商贸零售': ShoppingCart,
  '消费者服务': Users,
  '家电': TvMinimal,
  '纺织服装': Shirt,
  '农林牧渔': Sprout,
  '非银行金融': TrendingUp,
  '交通运输': Truck,
  '传媒': Radio,
  '电力及公用事业': Lightbulb,
  '环保': Leaf,
  '美容护理': Sparkles,
  '农业': Tractor
};

// Get icon for sector
const getSectorIcon = (sectorName: string) => {
  return sectorIcons[sectorName] || Monitor; // Fallback to Monitor
};
```

**Tile Layout with Icon:**
```typescript
// HeatMapTile.tsx
<div className="tile-header absolute top-3 left-3 flex items-center gap-1.5">
  {/* Sector icon */}
  <SectorIcon
    size={16}
    strokeWidth={2}
    className="text-white/90"
  />

  {/* Sector name */}
  <h3 className="text-base font-semibold text-white">
    {sectorName}
  </h3>
</div>
```

**Adaptive Icon Display:**
```typescript
// Content visibility rules with icon
const getVisibleContent = (width: number, height: number) => {
  const area = width * height;

  if (area >= 30000) {  // Large tiles
    return {
      showIcon: true,        // Show icon
      showName: true,
      iconSize: 18,          // Larger icon
      fontSize: 'base'
    };
  } else if (area >= 22500) {  // Medium tiles
    return {
      showIcon: true,        // Show icon
      showName: true,
      iconSize: 16,          // Standard icon
      fontSize: 'sm'
    };
  } else {  // Minimum tiles
    return {
      showIcon: false,       // Hide icon to save space
      showName: true,
      iconSize: 0,
      fontSize: 'xs'
    };
  }
};
```

---

## 5. Code Architecture

### 5.1 Single Responsibility Principle

**⚠️ Critical: Layout Calculation MUST be decoupled from UI Rendering**

**Separation of Concerns:**

1. **useTreeMap Hook** (Layout Calculation)
   - Pure logic, no UI dependencies
   - Calculates tile positions, sizes, aspect ratios
   - Implements 150px minimum size constraints
   - Enforces 1:1 to 1:1.618 aspect ratio
   - Returns computed layout data structure
   - Location: `hooks/useTreeMap.ts`

2. **HeatMapTile Component** (UI Rendering)
   - Pure presentation, receives layout props
   - Implements glassmorphism visual effects
   - Handles animations (Framer Motion)
   - Renders breathing indicator, content
   - No layout calculation logic
   - Location: `components/HeatMapTile.tsx`

**Data Flow:**
```typescript
// Hook: Layout calculation (pure logic)
const { tiles, totalHeight } = useTreeMap({
  data: sectors,
  containerWidth: 920,
  maxHeight: 580,
  minTileSize: 150,
  gap: 4
});

// Component: UI rendering (presentation)
{tiles.map(tile => (
  <HeatMapTile
    key={tile.id}
    x={tile.x} y={tile.y}
    width={tile.width} height={tile.height}
    sector={tile.data}
  />
))}
```

### 5.2 Component Hierarchy

```
App (layout.tsx + page.tsx)
  └── HeatMap.tsx (container component)
        ├── HeatMapHeader.tsx
        │     ├── Breadcrumb.tsx
        │     └── SearchBox.tsx
        └── HeatMapTile.tsx × 31 (level 1) or more (levels 2-4)
              ├── BreathingDot.tsx (top-right)
              └── TileBottomPanel.tsx (bottom 1/3, on hover)
                    └── Sparkline.tsx (trend line)
                          └── BreathingDot.tsx (end point)

Background Layers:
  ├── DynamicBackground.tsx (animated color blocks)
  └── SpotlightEffect.tsx (optional, mouse-following)
```

### 5.3 Hooks & State Management

**5.3.1 useTreeMap Hook - Layout Calculation Algorithm**

```typescript
interface UseTreeMapOptions {
  data: BaseEntity[];
  containerWidth: number;
  maxHeight: number;
  minTileSize: number;
  gap: number;
}

interface TreeMapLayout {
  tiles: TileLayout[];
  totalHeight: number;
}

function useTreeMap(options: UseTreeMapOptions): TreeMapLayout
```

**Algorithm Implementation Details:**

**Step 1: Data Preparation**
```typescript
function useTreeMap(options: UseTreeMapOptions): TreeMapLayout {
  const { data, containerWidth, maxHeight, minTileSize, gap } = options;

  // Calculate total market cap
  const totalMarketCap = data.reduce((sum, item) => sum + item.marketCap, 0);

  // Transform to Recharts format
  const rechartData = {
    name: 'root',
    children: data.map(item => ({
      name: item.name,
      size: item.marketCap,
      data: item
    }))
  };
}
```

**Step 2: Recharts Squarify Algorithm**
```typescript
import { Treemap } from 'recharts';

// Use Recharts to calculate initial layout
const initialLayout = Treemap.computeNode({
  data: rechartData,
  width: containerWidth,
  height: maxHeight,
  type: 'squarify',  // Squarified treemap algorithm
  ratio: 1.5,        // Target aspect ratio (closer to golden ratio)
  paddingInner: 0,   // No padding (we'll apply gap separately)
  paddingOuter: 0
});
```

**Step 3: Apply Gap Constraint**

**Gap Application Strategy:**
- Deduct gap from adjacent tiles
- Prefer shrinking larger tiles
- Never shrink below 150px minimum (except as last resort)

```typescript
function applyGapConstraint(tiles: TileLayout[], gap: number): TileLayout[] {
  const adjustedTiles = tiles.map(tile => {
    const adjacentTiles = findAdjacentTiles(tile, tiles);

    // Calculate gap deduction for each edge
    const gapAdjustments = {
      right: hasRightNeighbor(tile, adjacentTiles) ? gap / 2 : 0,
      bottom: hasBottomNeighbor(tile, adjacentTiles) ? gap / 2 : 0,
      left: hasLeftNeighbor(tile, adjacentTiles) ? gap / 2 : 0,
      top: hasTopNeighbor(tile, adjacentTiles) ? gap / 2 : 0
    };

    return {
      ...tile,
      width: tile.width - gapAdjustments.left - gapAdjustments.right,
      height: tile.height - gapAdjustments.top - gapAdjustments.bottom,
      x: tile.x + gapAdjustments.left,
      y: tile.y + gapAdjustments.top
    };
  });

  return adjustedTiles;
}

// Special case: Both tiles at 150px minimum
function handleBothMinimum(tile1: TileLayout, tile2: TileLayout, gap: number) {
  // Each shrinks 2px (total 4px gap)
  tile1.width -= 2;
  tile2.width -= 2;
  tile2.x += 2;  // Shift right by 2px
}

// Special case: One tile at minimum
function handleOneMinimum(minTile: TileLayout, largeTile: TileLayout, gap: number) {
  // Large tile shrinks full 4px
  largeTile.width -= 4;
  largeTile.x += 4;
  // Min tile unchanged (stays at 150px, ignore constraint)
}
```

**Step 4: Enforce 150px Minimum Constraint**
```typescript
function enforceMinimumSize(tiles: TileLayout[], minSize: number): TileLayout[] {
  return tiles.map(tile => ({
    ...tile,
    width: Math.max(tile.width, minSize),
    height: Math.max(tile.height, minSize)
  }));
}
```

**Step 5: Enforce 1:1.618 Aspect Ratio Constraint**
```typescript
function enforceAspectRatio(tiles: TileLayout[], maxRatio: number = 1.618): TileLayout[] {
  return tiles.map(tile => {
    const currentRatio = tile.width / tile.height;

    if (currentRatio > maxRatio) {
      // Too wide: reduce width or increase height
      const targetWidth = tile.height * maxRatio;
      return { ...tile, width: targetWidth };
    } else if (currentRatio < 1 / maxRatio) {
      // Too tall: reduce height or increase width
      const targetHeight = tile.width * maxRatio;
      return { ...tile, height: targetHeight };
    }

    return tile;  // Aspect ratio OK
  });
}
```

**Step 6: Gap Elimination Algorithm**

**Problem:** After constraints, small unfillable gaps may appear

**Solution:** Dynamic tile resizing to consume gaps

```typescript
function eliminateGaps(tiles: TileLayout[], containerWidth: number, containerHeight: number): TileLayout[] {
  // Detect gaps (unfilled regions)
  const gaps = detectGaps(tiles, containerWidth, containerHeight);

  if (gaps.length === 0) return tiles;

  // For each gap, find surrounding tiles
  gaps.forEach(gap => {
    const surroundingTiles = findSurroundingTiles(gap, tiles);

    // Distribute gap area among surrounding tiles
    const areaPerTile = (gap.width * gap.height) / surroundingTiles.length;

    surroundingTiles.forEach(tile => {
      // Expand tile to consume gap
      if (gap.x + gap.width === tile.x) {
        // Gap is on left edge of tile: expand left
        tile.x -= gap.width;
        tile.width += gap.width;
      } else if (tile.x + tile.width === gap.x) {
        // Gap is on right edge of tile: expand right
        tile.width += gap.width;
      }
      // Similar logic for top/bottom gaps
    });
  });

  return tiles;
}

function detectGaps(tiles: TileLayout[], width: number, height: number): Gap[] {
  // Create occupancy grid
  const grid = createOccupancyGrid(tiles, width, height);

  // Find contiguous empty regions
  const gaps: Gap[] = [];
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (!grid[y][x]) {
        // Empty cell found, expand to find full gap region
        const gap = expandGapRegion(grid, x, y);
        if (gap.width * gap.height > 100) {  // Ignore tiny gaps
          gaps.push(gap);
        }
      }
    }
  }

  return gaps;
}
```

**Step 7: Final Layout Assembly**
```typescript
function useTreeMap(options: UseTreeMapOptions): TreeMapLayout {
  // ... steps 1-2 ...

  let tiles = initialLayout.children;

  // Apply constraints in order
  tiles = applyGapConstraint(tiles, gap);
  tiles = enforceMinimumSize(tiles, minTileSize);
  tiles = enforceAspectRatio(tiles, 1.618);
  tiles = eliminateGaps(tiles, containerWidth, maxHeight);

  // Calculate total height used
  const totalHeight = Math.max(...tiles.map(t => t.y + t.height));

  return {
    tiles: tiles,
    totalHeight: Math.min(totalHeight, maxHeight)
  };
}
```

**Advanced Algorithm Note:**

The gap elimination algorithm may require **custom layout logic beyond traditional squarify**, especially when:
- Multiple tiles are at 150px minimum
- Aspect ratio constraints conflict with gap requirements
- Container size is tight relative to tile count

**Future Enhancement:** Consider implementing a **custom iterative refinement algorithm** that:
1. Starts with Recharts squarify
2. Iteratively adjusts tile positions/sizes
3. Minimizes gap area while respecting constraints
4. Uses optimization techniques (simulated annealing, gradient descent)

**5.3.2 useDrillDown Hook**

```typescript
interface DrillDownState {
  level: 1 | 2 | 3 | 4;
  path: (string | null)[];
  currentData: BaseEntity[];
  breadcrumb: string[];
}

interface UseDrillDownReturn {
  state: DrillDownState;
  drillDown: (entity: BaseEntity) => void;
  drillUp: () => void;
  reset: () => void;
}

function useDrillDown(): UseDrillDownReturn
```

---

## 6. Visual Design System

### 6.1 Base Design (Figma Specifications)

#### 6.1.1 Chinese Market Color Convention

**⚠️ Critical: Opposite of Western Markets**

Chinese market uses **RED for UP, GREEN for DOWN** (opposite of Western markets).

**Color Gradients:**

**Positive/Up (Red):**
```
Light:  #F08FC8 (0-1% change)
Medium: #D52CA2 (2-3% change) ⭐ Base color
Deep:   #A52380 (5%+ change)
```

- Used when `changePercent > 0`
- Color intensity varies based on change% magnitude

**Negative/Down (Green):**
```
Light:  #05C588 (0-1% change)
Medium: #039160 (2-3% change) ⭐ Base color
Deep:   #026B45 (5%+ change)
```

- Used when `changePercent < 0`
- Color intensity varies based on change% magnitude

**Variable Speed Linear Mapping:**

Color intensity mapping with non-linear curve for better visual discrimination:

```typescript
// Maps change% to color intensity with variable speed
const getColorIntensity = (changePercent: number): number => {
  const absChange = Math.abs(changePercent);

  // Piecewise linear mapping for better visual discrimination
  if (absChange < 1) {
    // Slow ramp for small changes (0-1%)
    return absChange / 1 * 0.3;  // Map to 0-0.3 intensity
  } else if (absChange < 3) {
    // Medium ramp (1-3%)
    return 0.3 + ((absChange - 1) / 2) * 0.4;  // Map to 0.3-0.7
  } else {
    // Fast ramp for large changes (3%+)
    return 0.7 + Math.min((absChange - 3) / 5, 1) * 0.3;  // Map to 0.7-1.0
  }
};
```

#### 6.1.1.1 Dynamic Background Color Calculation

**Tile Background Strategy:**

Tile background uses **dynamic semi-transparent color** based on `changePercent` with three zones:

**Zone 1: Dead Zone (Neutral Gray)**
- Range: `-0.2% ≤ changePercent ≤ +0.2%`
- Color: `rgba(107, 114, 128, 0.15)` (neutral gray glass)
- Rationale: Minimal changes are visually neutral

**Zone 2: Active Zone (Linear Mapping)**
- Range: `0.2% < changePercent ≤ 3.0%` (positive) or `-3.0% ≤ changePercent < -0.2%` (negative)
- Color: Linear interpolation from light to medium saturation
- Positive: `rgba(213, 44, 162, alpha)` where alpha = `0.1 + (abs(changePercent) / 3.0) * 0.2`
- Negative: `rgba(3, 145, 96, alpha)` where alpha = `0.1 + (abs(changePercent) / 3.0) * 0.2`

**Zone 3: Extreme Protection (Saturation Rollback)**
- Range: `changePercent > 3.0%` or `changePercent < -3.0%`
- Behavior: Color shifts toward **deeper shade with lower saturation**
- Rationale: Prevents visual fatigue from overly bright colors
- Positive: `rgba(165, 35, 128, 0.25)` (deep red, capped saturation)
- Negative: `rgba(2, 107, 69, 0.25)` (deep green, capped saturation)

**Implementation:**
```typescript
function getTileBackgroundColor(changePercent: number): string {
  const absChange = Math.abs(changePercent);

  // Zone 1: Dead Zone
  if (absChange <= 0.2) {
    return 'rgba(107, 114, 128, 0.15)';
  }

  // Zone 2: Active Zone
  if (absChange <= 3.0) {
    const intensity = (absChange - 0.2) / 2.8;  // Normalize to 0-1
    const alpha = 0.1 + intensity * 0.2;        // Alpha: 0.1 -> 0.3

    if (changePercent > 0) {
      // Positive: Red gradient
      return `rgba(213, 44, 162, ${alpha})`;
    } else {
      // Negative: Green gradient
      return `rgba(3, 145, 96, ${alpha})`;
    }
  }

  // Zone 3: Extreme Protection
  if (changePercent > 0) {
    return 'rgba(165, 35, 128, 0.25)';  // Deep red, capped
  } else {
    return 'rgba(2, 107, 69, 0.25)';    // Deep green, capped
  }
}
```

**Visual Progression Examples:**
```
Change%    Background Color
-3.5%   →  rgba(2, 107, 69, 0.25)     [Deep green, extreme]
-2.0%   →  rgba(3, 145, 96, 0.23)     [Medium green, active]
-0.1%   →  rgba(107, 114, 128, 0.15)  [Neutral gray, dead zone]
+0.1%   →  rgba(107, 114, 128, 0.15)  [Neutral gray, dead zone]
+2.0%   →  rgba(213, 44, 162, 0.23)   [Medium red, active]
+3.5%   →  rgba(165, 35, 128, 0.25)   [Deep red, extreme]
```

#### 6.1.2 Typography

**Tile Text Styles:**

**Sector Name (Top-left):**
- Font size: 14-16px (adaptive based on tile size)
- Font weight: 600 (semibold)
- Color (dark mode): `#ffffff` (white)
- Color (light mode): `#111827` (gray-900)
- Text shadow: Creates "floating above glass" effect
  ```css
  text-shadow:
    0 1px 2px rgba(0, 0, 0, 0.5),
    0 2px 4px rgba(0, 0, 0, 0.3);
  ```

**Capital Flow & Change % (Bottom-right):**
- Font size: 12px
- Font weight: 400 (normal)
- Color: `rgba(255, 255, 255, 0.8)` (secondary text)
- Text shadow: `0 1px 2px rgba(0, 0, 0, 0.4)`

**Text Elevation Effect:**
```css
.tile-text {
  /* Force white/light gray on glass */
  color: rgba(255, 255, 255, 0.95);

  /* Text shadow creates "floating above glass" effect */
  text-shadow:
    0 1px 2px rgba(0, 0, 0, 0.5),
    0 2px 4px rgba(0, 0, 0, 0.3);

  /* Slight blur for depth */
  filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.4));
}

/* Secondary text (capital flow, change%) */
.tile-secondary-text {
  color: rgba(255, 255, 255, 0.8);
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.4);
}
```

#### 6.1.3 Spacing & Layout

**Tile Spacing:**
- **Gap between tiles**: `4px` (凸显晶体边缘折射感)
- Creates visual separation emphasizing glass facets
- Applied to Treemap layout algorithm

**Border Properties:**
- Border width: 2px
- Border radius: 4px (small rounded corners)
- Border color (dark mode): `#374151` (gray-700, 4.5:1 contrast)
- Border color (light mode): `#d1d5db` (gray-300, 3.5:1 contrast)

**Theme Support:**

**Dark Mode (Default):**
- Background: `#0a0f0d` (dark charcoal)
- Borders: `#374151` (gray-700)
- Text: `#ffffff` (white)

**Light Mode:**
- Background: `#f9fafb` (gray-50)
- Borders: `#d1d5db` (gray-300)
- Text: `#111827` (gray-900)

**Accessibility Requirements:**
- Border-to-background contrast ratio: **≥ 3:1** (WCAG 2.0 AA)
- Text-to-background contrast ratio: **≥ 4.5:1** (WCAG 2.0 AA for normal text)
- Tile color gradients maintain sufficient contrast in both themes

### 6.2 Glassmorphism Effects

#### 6.2.1 Glass Material Properties

**Base Glass Effect:**
```css
.heatmap-tile {
  /* Glassmorphism core */
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);

  /* Semi-transparent base */
  background: rgba(var(--tile-color-rgb), 0.15);

  /* Glass edge refraction */
  border: 1px solid;
  border-image: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.4),
    rgba(255, 255, 255, 0.1)
  ) 1;

  /* Surface texture */
  box-shadow:
    inset 0 1px 1px rgba(255, 255, 255, 0.25),  /* Top highlight */
    inset 0 -1px 1px rgba(0, 0, 0, 0.1),        /* Bottom shadow */
    0 10px 20px rgba(0, 0, 0, 0.4);             /* Drop shadow (depth) */

  /* Border radius */
  border-radius: 8px;
}
```

**Color-Specific Glass Tint:**
- **Red tiles (up)**: `background: rgba(213, 44, 162, 0.15)` (#D52CA2 with 15% opacity)
- **Green tiles (down)**: `background: rgba(3, 145, 96, 0.15)` (#039160 with 15% opacity)
- **Neutral tiles**: `background: rgba(107, 114, 128, 0.15)` (gray)

#### 6.2.2 Dynamic Background Environment

**Layered Background Architecture:**
```
┌─────────────────────────────────────┐
│  HeatMap Tiles (foreground)         │ ← Glass tiles with content
│  ├─ backdrop-filter: blur(12px)     │
│  └─ Semi-transparent colors          │
├─────────────────────────────────────┤
│  Dynamic Color Blocks (mid-layer)   │ ← Animated gradient blobs
│  ├─ Blur: 60px-100px                │
│  ├─ Opacity: 30-50%                 │
│  └─ Colors based on market sentiment│
├─────────────────────────────────────┤
│  Base Background (back-layer)       │ ← Dark solid color
│  └─ Dark mode: #0a0f0d              │
└─────────────────────────────────────┘
```

**DynamicBackground Component:**
```typescript
// Animated color blocks behind HeatMap
<DynamicBackground
  colors={[
    'rgba(213, 44, 162, 0.4)',   // Red blob (bull market)
    'rgba(3, 145, 96, 0.4)',     // Green blob (bear market)
    'rgba(110, 63, 243, 0.3)'    // Purple blob (neutral)
  ]}
  blur={80}                       // 60-100px blur
  animationDuration={20}          // Slow morph (20s)
/>
```

#### 6.2.3 Spotlight Effect (Optional)

**Mouse-Following Highlight:**
```typescript
interface SpotlightConfig {
  enabled: boolean;              // Toggle on/off
  size: number;                  // Spotlight radius (200-400px)
  intensity: number;             // Brightness 0-1
  color: string;                 // Highlight color
  blend: 'screen' | 'overlay';   // Blend mode
}

// Usage
<SpotlightEffect
  enabled={true}
  size={300}
  intensity={0.15}
  color="rgba(255, 255, 255, 0.2)"
  blend="screen"
/>
```

**Implementation:**
- Radial gradient follows mouse cursor
- Applied as overlay layer above background, below tiles
- Mix-blend-mode for subtle luminance boost
- Debounced mouse tracking for performance

### 6.3 3D Hover Interaction

#### 6.3.1 Hover State Transformation

**Overview:**
When user hovers over a tile, it transforms with sophisticated 3D effects:
1. Tile lifts slightly (Y-axis elevation)
2. Bottom 1/3 panel separates from tile
3. Panel rotates along Z-axis (tilts right)
4. Panel becomes transparent glass
5. Original content (capital flow + change%) hidden
6. Sparkline chart appears with breathing indicator

#### 6.3.2 Tile Elevation

**Tile Lift Animation:**
```css
.heatmap-tile {
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1),
              box-shadow 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  transform-style: preserve-3d;
}

.heatmap-tile:hover {
  /* Lift tile slightly (12px up) */
  transform: translateY(-12px) translateZ(10px);

  /* Enhanced drop shadow for elevation */
  box-shadow:
    inset 0 1px 1px rgba(255, 255, 255, 0.25),
    inset 0 -1px 1px rgba(0, 0, 0, 0.1),
    0 20px 40px rgba(0, 0, 0, 0.5),     /* Deeper shadow */
    0 10px 20px rgba(0, 0, 0, 0.3);     /* Mid-range shadow */
}
```

#### 6.3.3 Bottom Panel 3D Transformation

**Panel Structure (Bottom 1/3):**
```typescript
// Calculate panel dimensions
const panelHeight = tileHeight / 3;  // Bottom 1/3
const panelY = tileHeight * 2 / 3;   // Start at 66% down

// Panel states
interface PanelState {
  default: {
    position: 'absolute';
    bottom: 0;
    height: `${panelHeight}px`;
    transform: 'none';
    opacity: 1;
  };
  hover: {
    position: 'absolute';
    bottom: 0;
    height: `${panelHeight}px`;
    transform: 'translateZ(20px) rotateZ(3deg)';  // Z-axis tilt right
    opacity: 0.3;  // Transparent glass
  };
}
```

**3D Transform Details:**
```css
.tile-bottom-panel {
  /* Default state */
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 33.333%;  /* Bottom 1/3 */

  /* 3D context */
  transform-origin: bottom left;
  transform-style: preserve-3d;

  /* Smooth transition */
  transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1),  /* Elastic ease-out */
              opacity 0.4s ease,
              backdrop-filter 0.4s ease;

  /* Initial content visible */
  backdrop-filter: blur(12px);
  background: rgba(var(--tile-color-rgb), 0.15);
}

.heatmap-tile:hover .tile-bottom-panel {
  /* Separate and tilt */
  transform: translateZ(20px) rotateZ(3deg) translateX(2px);

  /* Become more transparent */
  opacity: 0.3;
  backdrop-filter: blur(20px);  /* Stronger blur */
  background: rgba(255, 255, 255, 0.05);  /* Neutral glass */
}
```

**Content Switching:**
```typescript
// Hide original content on hover
<div className="panel-original-content opacity-100 group-hover:opacity-0">
  {/* Capital flow + Change % */}
</div>

// Show sparkline on hover
<div className="panel-sparkline-content opacity-0 group-hover:opacity-100">
  <Sparkline data={trendData} currentValue={currentPrice} />
</div>
```

#### 6.3.4 Sparkline Chart Component

**Design Specifications:**

**Line Properties:**
- Stroke width: `2px` (thin, elegant line)
- Stroke color: White with 80% opacity `rgba(255, 255, 255, 0.8)`
- No fill (transparent area under line)
- Smooth curve (use SVG path with bezier curves)

**Breathing Indicator Dot:**
- Position: End of sparkline (right edge)
- Size: 6px diameter
- Color: Matches line color (white)
- Animation: Opacity pulse 0.6 → 1.0 → 0.6 (2s loop)
- Represents: Current date position on timeline

**Sparkline Component:**
```typescript
interface SparklineProps {
  data: number[];           // Historical price/value data points
  currentValue: number;     // Current value (end point)
  width: number;            // Panel width
  height: number;           // Panel height (~1/3 of tile)
  color?: string;           // Line color (default: white)
  strokeWidth?: number;     // Line thickness (default: 2px)
}

export function Sparkline({
  data,
  currentValue,
  width,
  height,
  color = 'rgba(255, 255, 255, 0.8)',
  strokeWidth = 2
}: SparklineProps) {
  // Calculate viewBox and path
  const padding = 8;  // Padding from edges
  const chartWidth = width - padding * 2;
  const chartHeight = height - padding * 2;

  // Normalize data to chart dimensions
  const minValue = Math.min(...data);
  const maxValue = Math.max(...data);
  const valueRange = maxValue - minValue;

  // Generate SVG path
  const pathPoints = data.map((value, index) => {
    const x = padding + (index / (data.length - 1)) * chartWidth;
    const y = padding + ((maxValue - value) / valueRange) * chartHeight;
    return { x, y };
  });

  // Build path string
  const pathD = pathPoints.reduce((path, point, index) => {
    if (index === 0) return `M ${point.x},${point.y}`;

    // Use quadratic bezier for smooth curves
    const prevPoint = pathPoints[index - 1];
    const cpX = (prevPoint.x + point.x) / 2;
    return `${path} Q ${cpX},${prevPoint.y} ${point.x},${point.y}`;
  }, '');

  // End point (current value indicator)
  const endPoint = pathPoints[pathPoints.length - 1];

  // Build area fill path (extends to bottom)
  const fillPathD = `${pathD} L ${endPoint.x},${height} L ${padding},${height} Z`;

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className="sparkline"
    >
      {/* Define vertical gradient for area fill */}
      <defs>
        <linearGradient id="sparkline-gradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgba(0, 240, 255, 0.2)" />
          <stop offset="100%" stopColor="transparent" />
        </linearGradient>
      </defs>

      {/* Area fill below line (像面积图) */}
      <path
        d={fillPathD}
        fill="url(#sparkline-gradient)"
        opacity={0.8}
      />

      {/* Trend line with stroke-dasharray animation */}
      <motion.path
        d={pathD}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{
          pathLength: 0,
          opacity: 0
        }}
        animate={{
          pathLength: 1,
          opacity: 1
        }}
        transition={{
          pathLength: { duration: 0.4, ease: "easeInOut" },
          opacity: { duration: 0.2 }
        }}
      />

      {/* Breathing indicator dot at end */}
      <motion.circle
        cx={endPoint.x}
        cy={endPoint.y}
        r={3}
        fill={color}
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          delay: 0.4,  // Appear after line animation completes
          duration: 0.2
        }}
        className="animate-breathing-pulse"
      />
    </svg>
  );
}
```

**Breathing Pulse Animation:**
```css
@keyframes breathing-pulse {
  0%, 100% {
    opacity: 0.6;
    transform: scale(1);
  }
  50% {
    opacity: 1;
    transform: scale(1.2);
  }
}

.animate-breathing-pulse {
  animation: breathing-pulse 2s ease-in-out infinite;
  transform-origin: center;
}
```

**Mock Trend Data:**
```typescript
// Generate realistic trend data (last 30 days)
function generateTrendData(currentValue: number, volatility = 0.05): number[] {
  const days = 30;
  const data: number[] = [];

  // Start from 30 days ago
  let value = currentValue * (1 + (Math.random() - 0.5) * 0.1);

  for (let i = 0; i < days; i++) {
    // Random walk with drift
    const change = (Math.random() - 0.5) * volatility;
    value = value * (1 + change);
    data.push(value);
  }

  // Ensure last value matches current
  data[days - 1] = currentValue;

  return data;
}

// Add to each sector/stock in mock data
{
  code: "801980",
  name: "电子",
  marketCap: 38500.0,
  changePercent: 3.15,
  capitalFlow: 1050.0,
  attentionLevel: 95,
  trendData: generateTrendData(38500.0)  // 30-day trend
}
```

#### 6.3.5 Complete Hover Interaction Flow

**Timeline:**
```
0ms:   User hovers
  ↓
0-300ms:  Tile lifts (translateY -12px)
  ↓
100ms: Bottom panel starts separating
  ↓
100-500ms: Panel rotates Z-axis 3deg + becomes transparent
  ↓
200ms: Original content fades out (opacity 1 → 0)
  ↓
300ms: Sparkline fades in (opacity 0 → 1)
  ↓
500ms: Breathing dot animation starts
```

**Framer Motion Implementation:**
```typescript
<motion.div
  className="heatmap-tile group"
  whileHover={{
    y: -12,
    transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] }
  }}
>
  {/* Tile main content (top 2/3) */}
  <div className="tile-main-content">
    {/* Sector name, breathing dot, etc. */}
  </div>

  {/* Bottom panel (bottom 1/3) */}
  <motion.div
    className="tile-bottom-panel"
    variants={{
      default: {
        z: 0,
        rotateZ: 0,
        x: 0,
        opacity: 1
      },
      hover: {
        z: 20,
        rotateZ: 3,
        x: 2,
        opacity: 0.3,
        transition: {
          duration: 0.4,
          ease: [0.34, 1.56, 0.64, 1]  // Elastic
        }
      }
    }}
    initial="default"
    animate="default"
    whileHover="hover"
  >
    {/* Original content (hidden on hover) */}
    <motion.div
      className="panel-original"
      animate={{ opacity: isHovered ? 0 : 1 }}
    >
      <div className="capital-flow">{formatCapitalFlow(capitalFlow)}</div>
      <div className="change-percent">{formatChangePercent(changePercent)}</div>
    </motion.div>

    {/* Sparkline (shown on hover) */}
    <motion.div
      className="panel-sparkline"
      animate={{ opacity: isHovered ? 1 : 0 }}
    >
      <Sparkline
        data={trendData}
        currentValue={marketCap}
        width={tileWidth}
        height={tileHeight / 3}
      />
    </motion.div>
  </motion.div>
</motion.div>
```

**Visual Design Summary:**

**Hover State Layers (Z-depth):**
```
Z = 30px: Breathing indicator dot (pulsing)
Z = 20px: Bottom panel (tilted glass)
Z = 10px: Main tile (elevated)
Z = 0px:  Base layer (original position)
```

**Glass Transition:**
- **Before hover**: Colored glass (15% opacity, color tint)
- **During hover**: Transparent glass (30% opacity, neutral white)
- **Blur increase**: 12px → 20px (stronger frosted effect)

**Content Transition:**
- **Crossfade duration**: 300ms
- **Sparkline draw**: Instant (pre-rendered SVG)
- **Breathing dot**: Continuous 2s loop animation

### 6.4 Animation System

#### 6.4.1 AnimatePresence & Drill-Down Animations

**Animation States:**
```typescript
// Parent → Child drill-down
const drillDownVariants = {
  initial: (custom) => ({
    opacity: 0,
    scale: 0,
    x: custom.parentX,  // Start from parent tile center
    y: custom.parentY,
    transformOrigin: 'center center'
  }),
  animate: {
    opacity: 1,
    scale: 1,
    x: 0,
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.4, 0, 0.2, 1]  // Custom easing curve
    }
  },
  exit: (custom) => ({
    opacity: 0,
    scale: 0,
    x: custom.parentX,
    y: custom.parentY,
    transition: {
      duration: 0.3,
      ease: [0.4, 0, 0.6, 1]
    }
  })
};
```

**Performance Optimization:**
```typescript
const [isAnimating, setIsAnimating] = useState(false);

<motion.div
  variants={drillDownVariants}
  custom={{ parentX, parentY }}
  onAnimationStart={() => {
    setIsAnimating(true);
    // Disable backdrop-filter during animation
    tileRef.current.style.backdropFilter = 'none';
  }}
  onAnimationComplete={() => {
    setIsAnimating(false);
    // Re-enable backdrop-filter after animation
    tileRef.current.style.backdropFilter = 'blur(12px)';
  }}
>
  {/* Tile content */}
</motion.div>
```

**Why disable backdrop-filter during animation?**
- `backdrop-filter` is GPU-intensive
- Causes jank during scale/position animations
- Disabling during animation = smooth 60fps
- Re-enabling after = glass effect restored

#### 6.4.2 Stagger Animations

**Tiles appear with stagger effect:**
```typescript
const containerVariants = {
  animate: {
    transition: {
      staggerChildren: 0.02,  // 20ms delay between tiles
      delayChildren: 0.1      // Wait 100ms before starting
    }
  }
};

const tileVariants = {
  initial: { opacity: 0, scale: 0.8 },
  animate: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.3 }
  }
};
```

#### 6.4.3 Breathing Indicator Animation

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
- High attention (80-100): Fast pulse (0.8s cycle)
- Medium attention (40-79): Medium pulse (1.5s cycle)
- Low attention (0-39): Slow pulse (3s cycle)

### 6.4.4 Drill-Down Complete UX Flow

**Click → Drill-Down 5-Stage Animation Timeline:**

#### Stage 1: Pre-Animation (0-100ms)
**Click Feedback:**
```typescript
// Tile click visual feedback
<motion.div
  animate={{
    scale: 0.98,
    opacity: 0.95
  }}
  transition={{ duration: 0.1 }}
/>
```

**Actions:**
- Disable click on all other tiles
- Store clicked tile position (for animation origin)
- Prepare next level data

#### Stage 2: Fade Out Current Level (100-300ms)
**All Tiles Fade Out:**
```typescript
const fadeOutVariants = {
  exit: {
    opacity: 0,
    scale: 0.95,
    transition: {
      duration: 0.2,
      ease: 'easeIn'
    }
  }
};

// Apply to all current tiles
{currentTiles.map(tile => (
  <motion.div
    key={tile.id}
    variants={fadeOutVariants}
    exit="exit"
  />
))}
```

**Performance Optimization:**
- Temporarily disable `backdrop-filter` during animation
- Set `backdrop-filter: none` on all tiles
- Reduces GPU load, ensures 60fps

#### Stage 3: Layout Calculation (Synchronous)
**Calculate New Tile Layout:**
```typescript
const { tiles: newTiles, totalHeight } = useTreeMap({
  data: nextLevelData,
  containerWidth: 920,
  maxHeight: 580,
  minTileSize: 150,
  gap: 4
});
```

**Determine Animation Origin:**
- Use clicked tile's center position as expand origin
- Calculate `parentX` and `parentY` for custom animation

#### Stage 4: Expand Animation (300-800ms)
**New Tiles Expand from Origin:**
```typescript
const expandVariants = {
  initial: (custom: { parentX: number; parentY: number }) => ({
    opacity: 0,
    scale: 0,
    x: custom.parentX,
    y: custom.parentY
  }),
  animate: {
    opacity: 1,
    scale: 1,
    x: 0,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.4, 0.0, 0.2, 1],
      delay: 0  // Stagger applied via staggerChildren
    }
  }
};

<motion.div
  variants={containerVariants}
  initial="initial"
  animate="animate"
>
  {newTiles.map((tile, index) => (
    <motion.div
      key={tile.id}
      variants={expandVariants}
      custom={{ parentX, parentY }}
    />
  ))}
</motion.div>
```

**Stagger Effect:**
```typescript
const containerVariants = {
  animate: {
    transition: {
      staggerChildren: 0.02,  // 20ms delay between tiles
      delayChildren: 0.1
    }
  }
};
```

#### Stage 5: Complete (800ms+)
**Final Actions:**
```typescript
onAnimationComplete={() => {
  // 1. Re-enable backdrop-filter
  tileRefs.forEach(ref => {
    ref.current.style.backdropFilter = 'blur(12px)';
  });

  // 2. Enable tile interactions
  setIsAnimating(false);

  // 3. Update breadcrumb
  setBreadcrumb([...breadcrumb, clickedTile.name]);

  // 4. Update URL (optional)
  router.push(`/preview?level=2&sector=${clickedTile.code}`);
}
```

**Drill-Up (Return to Parent Level):**

Reverse animation sequence:
```typescript
const shrinkVariants = {
  exit: (custom: { parentX: number; parentY: number }) => ({
    opacity: 0,
    scale: 0,
    x: custom.parentX,
    y: custom.parentY,
    transition: {
      duration: 0.4,
      ease: [0.4, 0.0, 0.2, 1]
    }
  })
};

// Triggered by breadcrumb click or back button
const handleDrillUp = () => {
  // Animate current level shrinking back to parent tile position
  // Then load parent level data with fade-in
};
```

**Complete Flow Diagram:**
```
[User Clicks Tile]
     ↓
[Stage 1: 100ms] Press feedback, disable interactions
     ↓
[Stage 2: 200ms] All tiles fade out, disable backdrop-filter
     ↓
[Stage 3: sync] Calculate new layout
     ↓
[Stage 4: 500ms] New tiles expand from origin (stagger 20ms)
     ↓
[Stage 5: complete] Re-enable effects, update breadcrumb, enable interactions
```

**Performance Metrics:**
- Total animation duration: ~800ms
- Target frame rate: 60fps
- No dropped frames during transition

---

## 7. Layout & Dimensions

### 7.1 Page Layout

**Preview Page (`/preview`):**
```
┌──────────────────────────────────────────────────────────┐
│  HeatMap Container (920px - 100vw width)                 │
│  ┌────────────────────────────────────────────────────┐  │
│  │ Header (fixed height ~60-80px)                     │  │
│  │ ┌────────────────────────────────────────────────┐ │  │
│  │ │ Market Performance    [Search] [🔍] [T1] [T2]  │ │  │
│  │ │ 一级行业 > 二级行业 > 三级行业 > 股票               │ │  │
│  │ └────────────────────────────────────────────────┘ │  │
│  │                                                    │  │
│  │ Treemap Area (max 580px height)                    │  │
│  │ ┌────────────────────────────────────────────┐     │  │
│ 8│ │                                            │     │8 │ ← 8px padding
│ p│ │     [Tiles dynamically laid out]           │     │p │
│ x│ │                                            │     │x │
│  │ │                                            │     │  │
│ 8│ │                                            │     │8 │
│ p│ │                                            │     │p │
│ x│ │                                            │     │x │ ← Scrollbar here
│  │ └────────────────────────────────────────────┘     │  │   if > 580px
│  │         ↑ Scrollable if > 580px                    │  │
│  └────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────┘
```

**Page Structure:**
- Full-width display of HeatMap component
- No sidebar or additional UI elements
- HeatMap fills the entire viewport area

### 7.2 HeatMap Container Dimensions

| Property | Value | Behavior |
|----------|-------|----------|
| **Min Width** | `920px` | Hard minimum, component won't shrink below |
| **Max Width** | `100vw` | Fills viewport width |
| **Height** | `auto` | Dynamically calculated by Treemap algorithm |
| **Max Height** | `580px` | Hard maximum ceiling (treemap area only, excludes header) |
| **Overflow** | `scroll` | Vertical scroll when height > 580px |
| **Padding** | `8px` | All sides, prevents scrollbar overlap with tiles |

**Why 8px Padding?**
1. **Scrollbar overlap prevention**: When `overflow-y: scroll` is active, the scrollbar appears on the right edge. Without padding, tiles can extend to the edge and be partially obscured by the scrollbar UI.
2. **Visual breathing room**: Creates consistent spacing around the entire HeatMap visualization.
3. **Browser consistency**: Different browsers render scrollbars differently (overlay vs. always visible). 8px padding ensures tiles are never hidden regardless of browser behavior.
4. **Accessibility**: Provides clear visual separation between interactive scrollbar and tile content.

**Dynamic Height Calculation:**
- Recharts Treemap algorithm computes optimal tile layout
- Height auto-adjusts based on:
  - Number of tiles (31 sectors)
  - Available width
  - Tile size distribution (market cap values)
- If calculated height ≤ 580px: use calculated height
- If calculated height > 580px: fix at 580px + enable scroll

**Zoom/Scale Support:**
- Component supports CSS `transform: scale()` operations
- Maintains 920px minimum width constraint at all zoom levels
- Scroll container adjusts to scaled content dimensions
- Preserves tile aspect ratios during scaling

**Viewport Breakpoints:**
- **Desktop (1920px+)**: Full width layout, optimal tile visibility
- **Tablet (768-1920px)**: Adaptive width, maintains 920px minimum
- **Mobile (<768px)**: Not prioritized (desktop-first visualization)
  - If accessed on mobile: horizontal scroll appears due to 920px min-width

### 7.3 Tile Shape & Size Constraints

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

### 7.4 Header Design & Scroll Effects

**Header Structure:**

```
┌────────────────────────────────────────────────────────────┐
│ Market Performance              [Search...] [🔍] [T1] [T2] │
│ 一级行业 > 二级行业 > 三级行业 > 股票                       │
└────────────────────────────────────────────────────────────┘
```

**Header Dimensions:**
- Height: Auto (~60-80px depending on content)
- Padding: 16px horizontal, 12px vertical
- Background: Semi-transparent with dynamic opacity
  - Initial: `rgba(var(--bg-rgb), 0.2)` (20% opacity)
  - Scrolled: `rgba(var(--bg-rgb), 0.6)` (60% opacity, scrolled state)
- Border bottom: Optional subtle separator
  - Dark mode: `rgba(255, 255, 255, 0.05)`
  - Light mode: `#e5e7eb` (gray-200)

**Header Mask & Scroll Effects:**

**Bottom Edge Gradient Mask:**
```css
.heatmap-header {
  /* Natural fade-out effect for scrolling tiles */
  mask-image: linear-gradient(
    to bottom,
    black 0%,      /* Fully visible header content */
    black 80%,     /* Maintain visibility */
    transparent 100%  /* Fade to transparent at bottom edge */
  );
  -webkit-mask-image: linear-gradient(
    to bottom,
    black 0%,
    black 80%,
    transparent 100%
  );
}
```

**Purpose:** When Grid tiles scroll under Header, they naturally fade out instead of abruptly disappearing. Creates smooth visual transition.

**Scroll-Based Dynamic Styling:**
```typescript
const [isScrolled, setIsScrolled] = useState(false);

useEffect(() => {
  const handleScroll = (e: Event) => {
    const target = e.target as HTMLElement;
    setIsScrolled(target.scrollTop > 10);
  };

  const scrollContainer = document.querySelector('.treemap-scroll-container');
  scrollContainer?.addEventListener('scroll', handleScroll);

  return () => scrollContainer?.removeEventListener('scroll', handleScroll);
}, []);

// Apply dynamic classes based on scroll state
<header
  className={cn(
    "heatmap-header transition-all duration-300",
    isScrolled && "scrolled"
  )}
  style={{
    background: isScrolled
      ? 'rgba(var(--bg-rgb), 0.6)'  // Deeper background when scrolled
      : 'rgba(var(--bg-rgb), 0.2)', // Lighter when at top
    boxShadow: isScrolled
      ? '0 4px 12px rgba(0, 0, 0, 0.3)'  // Enhanced shadow
      : '0 1px 3px rgba(0, 0, 0, 0.1)'   // Subtle shadow
  }}
>
  {/* Header content */}
</header>
```

**Visual Effect Summary:**
- **At scroll top (scrollTop = 0)**:
  - Background opacity: 20%
  - Box shadow: Light (0 1px 3px)
  - Header appears nearly transparent
- **When scrolled (scrollTop > 10px)**:
  - Background opacity: 60% (linear transition)
  - Box shadow: Deep (0 4px 12px)
  - Header becomes more prominent and readable
- **Tiles scrolling under Header**:
  - Fade out naturally due to mask-image gradient
  - No abrupt cutoff
  - Smooth visual continuity

### 7.5 Responsive Design Strategy

**Breakpoint Definitions:**

| Breakpoint | Screen Width | Strategy | Features |
|------------|--------------|----------|----------|
| Desktop | 1920px+ | Full functionality | All features enabled |
| Laptop | 1280-1919px | Scaled layout | Smaller tiles, all features |
| Tablet | 768-1279px | Simplified | Reduced animations |
| Mobile | < 768px | Minimal | Simplified UI, no advanced effects |

**Container Width Adaptation:**

- **Desktop/Laptop/Tablet**: Full-width display, respects 920px minimum
- **Mobile (< 768px)**:
  - Full-width display (no horizontal scroll)
  - Container scales to screen width
  - Tile layout recalculates for smaller viewport

**Tile Adaptation Strategy:**

**Desktop/Laptop (≥1280px):**
- Minimum tile size: 150px × 150px
- Show: Icon + Name + BreathingDot + Capital Flow + Change%
- Hover: Full 3D effect + Sparkline reveal
- Font size: 14-16px

**Tablet (768-1279px):**
- Minimum tile size: 130px × 130px
- Show: Icon + Name + BreathingDot + Capital Flow + Change%
- Hover: Simplified 3D effect (no sparkline)
- Font size: 12-14px

**Mobile (< 768px):**
- Minimum tile size: 120px × 120px
- Show: Name + Change% ONLY
- No icon, no BreathingDot, no capital flow
- No hover effects (touch-only interaction)
- No sparkline animation
- Font size: 10-12px
- Header: Search box only (no toggles)

**Responsive CSS:**
```css
/* Desktop - Full experience */
@media (min-width: 1280px) {
  .heatmap-tile {
    min-width: 150px;
    min-height: 150px;
  }
  .tile-icon { display: block; }
  .breathing-dot { display: block; }
  .capital-flow { display: block; }
  .sparkline { display: block; }
}

/* Tablet - Simplified */
@media (min-width: 768px) and (max-width: 1279px) {
  .heatmap-tile {
    min-width: 130px;
    min-height: 130px;
  }
  .sparkline { display: none; }
  .toggle-group { display: none; }
}

/* Mobile - Minimal */
@media (max-width: 767px) {
  .heatmap-tile {
    min-width: 120px;
    min-height: 120px;
    font-size: 10px;
  }
  .tile-icon { display: none; }
  .breathing-dot { display: none; }
  .capital-flow { display: none; }
  .sparkline { display: none; }
  .toggle-group { display: none; }

  /* Mobile: Only show name + change% */
  .tile-content {
    justify-content: center;
    align-items: center;
  }
}
```

**Performance Considerations:**
- Mobile devices: Disable backdrop-filter animations
- Mobile devices: Disable DynamicBackground (static gradient only)
- Mobile devices: Disable SpotlightEffect
- Touch devices: Replace hover with tap interactions

---

## 8. Component Specifications

### 8.1 HeatMap

**Library:** Recharts `<Treemap>` component (used for treemap-style layout)

**Configuration:**
- `data`: Array of 31 sectors
- `dataKey="marketCap"`: Determines tile size
- Custom `content`: Renders `Tile` component
- Responsive sizing with constraints

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

### 8.2 HeatMapHeader

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
- Search Box
- Toggle Group (垂直排列)

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

### 8.3 HeatMapTile

**Component:** Custom tile renderer for Recharts Treemap

**Interface:**
```typescript
interface TileProps {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  name?: string;
  value?: number;
  changePercent?: number;
  capitalFlow?: number;
  attentionLevel?: number;
}
```

**Visual Composition:**
- Glassmorphism background with color tint
- Sector name (top-left)
- BreathingDot indicator (top-right)
- Capital flow + Change % (bottom-right in TileBottomPanel)
- Icon identifier (left of sector name, 6px gap)

**Glassmorphism Properties:**

**Border Gradient Implementation (Dual Backgrounds Method):**

**Problem:** `border-image` breaks `border-radius`, resulting in sharp corners instead of rounded glass edges.

**Solution:** Use **dual background layers** with `background-clip` to simulate gradient borders while preserving rounded corners.

**CSS Implementation:**
```css
.heatmap-tile {
  /* Position & size */
  position: absolute;

  /* Dual background layers */
  background:
    /* Layer 1: Border gradient (border-box) */
    linear-gradient(135deg, rgba(255, 255, 255, 0.4), rgba(255, 255, 255, 0.1)) border-box,
    /* Layer 2: Content background (padding-box) */
    linear-gradient(to bottom, rgba(17, 24, 39, 0.8), rgba(0, 0, 0, 0.9)) padding-box;

  /* Border setup */
  border: 1px solid transparent;  /* Must be transparent for background to show */
  border-radius: 8px;

  /* Glassmorphism core */
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);

  /* Surface texture */
  box-shadow:
    inset 0 1px 1px rgba(255, 255, 255, 0.25),
    inset 0 -1px 1px rgba(0, 0, 0, 0.1),
    0 10px 20px rgba(0, 0, 0, 0.4);
}
```

**Alternative: Pseudo-Element Method (More Flexible)**
```typescript
<div className="group relative rounded-2xl bg-gray-900/80 p-6 backdrop-blur-xl">
  {/* Gradient border layer */}
  <div
    className="pointer-events-none absolute inset-0 rounded-2xl border border-transparent"
    style={{
      background: 'linear-gradient(135deg, rgba(255,255,255,0.4), rgba(255,255,255,0.1)) border-box',
      mask: 'linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)',
      maskComposite: 'exclude',
      WebkitMaskComposite: 'xor'
    }}
  />

  {/* Content layer */}
  <div className="relative z-10">
    {/* Tile content */}
  </div>
</div>
```

**Visual Effect:**
- Top-left corner: Bright white edge (rgba(255,255,255,0.4))
- Bottom-right corner: Dim white edge (rgba(255,255,255,0.1))
- 135° gradient direction creates natural light source from top-left

**Tile Spacing:**
- **Gap between tiles**: `4px` (凸显晶体边缘折射感)
- Creates visual separation emphasizing glass facets
- Applied to Treemap layout algorithm

**Tile Text Styles:**

**Sector Name (Top-left):**
- Font size: 14-16px (adaptive based on tile size)
- Font weight: 600 (semibold)
- Color (dark mode): `#ffffff` (white)
- Color (light mode): `#111827` (gray-900)
- Text shadow: Creates "floating above glass" effect
  ```css
  text-shadow:
    0 1px 2px rgba(0, 0, 0, 0.5),
    0 2px 4px rgba(0, 0, 0, 0.3);
  ```

**Capital Flow & Change % (Bottom-right):**
- Font size: 12px
- Font weight: 400 (normal)
- Color: `rgba(255, 255, 255, 0.8)` (secondary text)
- Text shadow: `0 1px 2px rgba(0, 0, 0, 0.4)`

### 8.3.1 HeatMapTile - Precise Layout Specifications

**Tile Internal Structure:**

```
┌─────────────────────────────────────┐
│ Upper Panel (Top 50%)               │
│  ┌──────────────────────────────┐  │
│  │ [Icon] Name    [BreathingDot] │  │ ← Top Container (flex, justify-center)
│  └──────────────────────────────┘  │
│  (Flexible Space)                   │
├─────────────────────────────────────┤ ← Panel Divider (50% height)
│ Lower Panel (Bottom 50%)            │
│  ┌──────────────────────────────┐  │
│  │ [Sparkline Graph]       [Dot] │  │ ← Hover: Sparkline visible
│  │   OR                           │  │
│  │            [Flow]  8px         │  │ ← Default: Flow + Change%
│  │            [↑2.5%] 8px         │  │    Right-bottom aligned
│  └──────────────────────────────┘  │
└─────────────────────────────────────┘
```

**Top Container Layout (Icon + Name + BreathingDot):**
- Container: Horizontal flex layout, `justify-content: center`, `align-items: center`
- Icon:
  - Distance from left edge: **8px**
  - Size: 16-18px (adaptive based on tile size)
- Name:
  - Gap from Icon: **4px** (updated from 6px)
  - Font size: 14-16px (adaptive)
  - Font weight: 600 (semibold)
- BreathingDot:
  - Positioned within the same flex container
  - Aligned with Icon and Name (horizontal center)
  - Size: 6px diameter

**Implementation:**
```typescript
<div className="flex items-center justify-center gap-1 px-2 py-2">
  {/* Icon */}
  <SectorIcon size={iconSize} className="flex-shrink-0" style={{ marginLeft: '8px' }} />

  {/* Name */}
  <span className="font-semibold" style={{ marginLeft: '4px' }}>
    {sector.name}
  </span>

  {/* Breathing Dot */}
  <BreathingDot attentionLevel={sector.attentionLevel} />
</div>
```

**Lower Panel Layout (Capital Flow + Change%):**
- Container: Horizontal flex layout, `justify-content: flex-end`, `align-items: flex-end`
- Content: Vertical stack (flex-col)
- Gap between Flow and Change%: **4px**
- Padding from right edge: **8px**
- Padding from bottom edge: **8px**

**Implementation:**
```typescript
<div className="flex justify-end items-end p-2">
  <div className="flex flex-col gap-1 pr-2 pb-2">  {/* 8px padding */}
    {/* Capital Flow */}
    <div className="text-xs font-normal text-white/80">
      {formatCapitalFlow(sector.capitalFlow)}
    </div>

    {/* Change% with Arrow */}
    <div className="flex items-center gap-1">
      {sector.changePercent > 0 ? (
        <ArrowUp size={14} className="text-red-600" style={{ filter: 'drop-shadow(0 0 2px rgba(255,255,255,0.9))' }} />
      ) : (
        <ArrowDown size={14} className="text-green-600" style={{ filter: 'drop-shadow(0 0 2px rgba(255,255,255,0.9))' }} />
      )}
      <span className="text-xs font-semibold text-white">
        {formatChangePercent(sector.changePercent)}
      </span>
    </div>
  </div>
</div>
```

**Panel Height Logic:**
- Lower Panel: Always **50% of tile height** (not 1/3)
- Upper Panel: **50% of tile height**
- When Lower Panel height < 100px:
  - Lower Panel squeezes Upper Panel upward
  - Upper Panel minimum height: Same as Top Container (Icon + Name + Dot)
  - Lower Panel never goes below 100px if possible

```typescript
const getPanelHeights = (tileHeight: number) => {
  const lowerPanelHeight = tileHeight * 0.5;

  if (lowerPanelHeight < 100) {
    // Squeeze upper panel
    const topContainerHeight = 32;  // Icon + Name + Dot container
    const upperPanelHeight = Math.max(topContainerHeight, tileHeight - 100);
    return {
      upper: upperPanelHeight,
      lower: tileHeight - upperPanelHeight
    };
  }

  return {
    upper: tileHeight * 0.5,
    lower: tileHeight * 0.5
  };
};
```

### 8.3.2 HeatMapTile - Adaptive Content Scaling

**Scaling Strategy:** Content shrinks proportionally in smaller tiles, **nothing is hidden**

**Size Thresholds:**

| Tile Size | Dimensions | Content Scale | Visible Elements | Notes |
|-----------|------------|---------------|------------------|-------|
| **Large** | > 180×180 | 100% | All (Icon, Name, Dot, Flow, Change%) | Full detail |
| **Medium** | 150×150 to 180×180 | 85% | All | Slightly reduced |
| **Small** | 150×150 | 70% | All | Compact but readable |

**Scaling Implementation:**
```typescript
function getContentScale(tileWidth: number, tileHeight: number): number {
  const minDimension = Math.min(tileWidth, tileHeight);

  if (minDimension >= 180) {
    return 1.0;  // 100% scale
  } else if (minDimension >= 150) {
    return 0.85;  // 85% scale
  } else {
    return 0.70;  // 70% scale (minimum tile size 150×150)
  }
}

// Apply scale to all content
const scale = getContentScale(width, height);

<div style={{ transform: `scale(${scale})`, transformOrigin: 'top left' }}>
  <Icon size={16 * scale} />
  <Name fontSize={14 * scale} />
  <CapitalFlow fontSize={12 * scale} />
  <ChangePercent fontSize={12 * scale} />
</div>
```

**Font Size Scaling:**
```typescript
const baseFontSizes = {
  name: 16,         // Sector name
  flow: 12,         // Capital flow
  changePercent: 12 // Change %
};

const scaledFontSizes = {
  name: baseFontSizes.name * scale,
  flow: baseFontSizes.flow * scale,
  changePercent: baseFontSizes.changePercent * scale
};
```

**Icon Size Scaling:**
```typescript
const baseIconSize = 16;
const scaledIconSize = baseIconSize * scale;

// At 150×150 (70% scale): Icon = 11.2px (~11px)
// At 180×180 (100% scale): Icon = 16px
```

**BreathingDot Behavior:**
- **Never hidden** regardless of tile size
- Size: Always 6px diameter (no scaling)
- Rationale: Serves as attention indicator, must remain visible

**Visual Comparison:**
```
Large Tile (200×200, 100% scale):
┌────────────────────────┐
│ [16px Icon] Name [Dot] │
│                        │
│              +¥450亿   │ ← 12px font
│                 ↑2.5% │
└────────────────────────┘

Small Tile (150×150, 70% scale):
┌──────────────────┐
│ [11px Icon]Name● │
│                  │
│        +¥450亿   │ ← 8.4px font
│           ↑2.5% │
└──────────────────┘
```

**Performance Note:**
Use CSS `transform: scale()` instead of recalculating all dimensions for better performance.

### 8.3.3 HeatMapTile - Z-Index and Hover Behavior

**Default Z-Index:**
```css
.heatmap-tile {
  z-index: 1;
  position: absolute;
}
```

**Hover Elevation:**
- **Visual lift:** 2px upward (not -12px)
- **Shadow enhancement:** Deeper drop-shadow on hover
- **Z-index boost:** `z-index: 10` to appear above other tiles

```css
.heatmap-tile:hover {
  z-index: 10;
  transform: translateY(-2px);  /* Subtle 2px lift */
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.5);  /* Enhanced shadow */
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
```

**Simultaneous Hover Handling:**

**Scenario:** Two adjacent tiles hovered at the same time (edge case, rare in practice)

**Solution:** Priority to **bottom-right** tile
```typescript
// On hover, check position relative to other hovered tiles
function getHoverPriority(x: number, y: number, otherTiles: Tile[]): number {
  const hoveredTiles = otherTiles.filter(t => t.isHovered);

  if (hoveredTiles.length === 0) {
    return 10;  // Normal hover z-index
  }

  // Calculate priority: lower-right has higher z-index
  const priority = x + y;  // Sum of coordinates
  const maxPriority = Math.max(...hoveredTiles.map(t => t.x + t.y));

  return priority >= maxPriority ? 11 : 9;
}
```

**Visual Priority:**
```
Grid Layout:
┌────┬────┬────┐
│ A  │ B  │ C  │  If B and C both hovered:
├────┼────┼────┤  → C (right) has priority
│ D  │ E  │ F  │  → C appears on top
└────┴────┴────┘

If E and F both hovered:
→ F (bottom-right) has priority
```

**Focus State (Accessibility):**
- **No visible focus ring on hover**
- Rationale: 2px elevation micro-interaction already provides visual feedback
- Keyboard focus uses default browser outline (for keyboard navigation)

```css
/* Keyboard focus only (not hover) */
.heatmap-tile:focus:not(:hover) {
  outline: 2px solid rgba(110, 63, 243, 0.8);
  outline-offset: 4px;
}

/* Hover: no outline */
.heatmap-tile:hover {
  outline: none;
}
```

### 8.3.5 HeatMapTile - Interaction State Matrix

**Complete Interaction States:**

| State | Visual Effect | Trigger Condition | Animation |
|-------|--------------|-------------------|-----------|
| **Idle** | Default glassmorphism | No interaction | Static |
| **Hover** | Tile lift (-12px Y) + 3D panel separation | Mouse hover | 400ms cubic-bezier |
| **Active/Pressed** | Scale down (0.98) + brief flash | Mouse/touch down | 100ms ease-out |
| **Animating** | Opacity fade + position transform | Drill-down/up transition | 500ms ease-in-out |

**Click Behavior - Drill-Down Interaction:**

```typescript
const HeatMapTile = ({ sector, onDrillDown }: TileProps) => {
  const [isPressed, setIsPressed] = useState(false);

  const handleClick = () => {
    if (!sector.hasChildren) return;

    // Visual feedback: brief press effect
    setIsPressed(true);
    setTimeout(() => setIsPressed(false), 100);

    // Trigger drill-down with animation
    onDrillDown(sector);
  };

  return (
    <motion.div
      className="heatmap-tile cursor-pointer"
      onClick={handleClick}
      animate={{
        scale: isPressed ? 0.98 : 1
      }}
      transition={{ duration: 0.1 }}
    >
      {/* Tile content */}
    </motion.div>
  );
};
```

**State Transitions:**
```
Idle → [Hover] → Hover State
Hover State → [Mouse Down] → Active/Pressed
Active/Pressed → [Mouse Up] → [Click Event] → Animating
Animating → [Animation Complete] → Idle (new level)
```

**Notes:**
- Focus, Disabled, Selected states are NOT implemented (per user requirement)
- Double-click behavior: Not implemented (single click only)
- Touch devices: Replace hover with tap (no hover state on mobile)

### 8.3.6 HeatMapTile - Accessibility

**ARIA Attributes:**
```typescript
<motion.div
  role="button"
  tabIndex={0}
  aria-label={`${sector.name}, 涨跌幅 ${formatChangePercent(sector.changePercent)}, 市值 ${sector.marketCap}亿元, 资金流向 ${formatCapitalFlow(sector.capitalFlow)}`}
  aria-disabled={!sector.hasChildren}
  onKeyDown={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleDrillDown();
    }
  }}
>
```

**Keyboard Navigation:**
- **Tab**: Focus next tile (natural DOM order)
- **Shift + Tab**: Focus previous tile
- **Enter / Space**: Drill down (if hasChildren = true)
- **Escape**: Drill up (return to parent level)
- **Arrow Keys**: Navigate tile grid (optional enhancement)

**Screen Reader Announcements:**
```typescript
// On drill-down
announceToScreenReader(`进入 ${sector.name} 板块，当前显示 ${newTiles.length} 个行业`);

// On drill-up
announceToScreenReader(`返回上一级，当前显示 ${tiles.length} 个板块`);

// Helper function
const announceToScreenReader = (message: string) => {
  const announcement = document.createElement('div');
  announcement.setAttribute('role', 'status');
  announcement.setAttribute('aria-live', 'polite');
  announcement.className = 'sr-only';
  announcement.textContent = message;
  document.body.appendChild(announcement);
  setTimeout(() => announcement.remove(), 1000);
};
```

**Focus Management:**
```typescript
// After drill-down animation, focus first tile
useEffect(() => {
  if (!isAnimating && tiles.length > 0) {
    const firstTile = tileRefs[0].current;
    firstTile?.focus();
  }
}, [isAnimating, tiles]);
```

**Visual Focus Indicator:**
```css
.heatmap-tile:focus {
  outline: 2px solid rgba(110, 63, 243, 0.8);
  outline-offset: 4px;
}

.heatmap-tile:focus-visible {
  box-shadow:
    0 0 0 4px rgba(110, 63, 243, 0.3),
    0 10px 20px rgba(0, 0, 0, 0.4);
}
```

### 8.4 TileBottomPanel

**3D Hover Interaction Component**

**Default State (No Hover):**
- Part of tile background
- Contains capital flow + change% text
- Opacity: 1
- Transform: none

**Hover State:**
- Separates from tile (Y-axis transform)
- Rotates along Z-axis (3deg right tilt)
- Becomes transparent glass (opacity 0.3)
- Original content fades out
- Sparkline chart fades in

**3D Hover Animation:**
```typescript
// Tile lifts on hover
<motion.div
  className="heatmap-tile"
  whileHover={{
    y: -12,  // Lift tile 12px upward
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.6)'  // Enhanced shadow
  }}
  transition={{ duration: 0.4, ease: [0.4, 0.0, 0.2, 1] }}
>
  {/* Top 2/3: Sector name + icon */}
  <div className="tile-top-section">
    <span>{name}</span>
    <BreathingDot attentionLevel={attentionLevel} />
  </div>

  {/* Bottom 1/3: Separable panel */}
  <motion.div
    className="tile-bottom-panel"
    whileHover={{
      rotateZ: 3,           // 3deg right tilt
      opacity: 0.3,         // Transparent glass
      y: 8                  // Separate from tile
    }}
  >
    {/* Default content */}
    <motion.div whileHover={{ opacity: 0 }}>
      <div>{formatCapitalFlow(capitalFlow)}</div>
      <div>{formatChangePercent(changePercent)}</div>
    </motion.div>

    {/* Sparkline (fades in on hover) */}
    <motion.div
      initial={{ opacity: 0 }}
      whileHover={{ opacity: 1 }}
    >
      <Sparkline data={trendData} />
    </motion.div>
  </motion.div>
</motion.div>
```

**Framer Motion Implementation:**
```typescript
const tileVariants = {
  idle: {
    y: 0,
    boxShadow: '0 10px 20px rgba(0, 0, 0, 0.4)'
  },
  hover: {
    y: -12,
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.6)',
    transition: {
      duration: 0.4,
      ease: [0.4, 0.0, 0.2, 1]  // Material Design easing
    }
  }
};

const panelVariants = {
  idle: {
    rotateZ: 0,
    opacity: 1,
    y: 0
  },
  hover: {
    rotateZ: 3,
    opacity: 0.3,
    y: 8,
    transition: {
      duration: 0.4,
      ease: [0.4, 0.0, 0.2, 1]
    }
  }
};
```

### 8.5 Sparkline - 30-Day Trend Chart

**Component:** SVG-based line chart displayed on tile hover in Lower Panel

**Layout Strategy:**
- **Container:** Lower Panel (50% of tile height)
- **Padding:** None - Sparkline fills entire panel
- **Height Calculation:** Dynamic based on data points with 8px top/bottom margins

**Height Algorithm:**
```typescript
function calculateSparklineLayout(data: number[], panelHeight: number) {
  const minValue = Math.min(...data);
  const maxValue = Math.max(...data);
  const valueRange = maxValue - minValue;

  // Reserve 8px margins top and bottom
  const availableHeight = panelHeight - 16;  // 8px top + 8px bottom

  // Scale points to fit within available height
  const points = data.map((value, index) => {
    const normalizedValue = (value - minValue) / valueRange;
    const x = (index / (data.length - 1)) * panelWidth;
    const y = panelHeight - 8 - (normalizedValue * availableHeight);  // 8px from bottom
    return { x, y };
  });

  return points;
}
```

**Visual Constraints:**
- **Lowest point:** 8px above panel bottom edge
- **Highest point:** 8px below panel top edge
- **All points:** Scaled proportionally between these bounds

**Color Specifications:**

| Element | Color | Opacity | Notes |
|---------|-------|---------|-------|
| **Stroke (Line)** | `rgba(84, 148, 250, 1)` | 100% | Bright blue, highly visible |
| **Fill (Area)** | Linear gradient | 60% → 0% | Cyan to transparent |
| **BreathingDot** | `rgba(53, 185, 233, 0.9)` | 90% | Cyan, matches theme |

**Stroke Properties:**
- Width: 2px
- Line cap: round
- Line join: round
- Stroke animation: `stroke-dasharray` (0.4s draw-in)

**Fill Gradient:**
```typescript
<defs>
  <linearGradient id="sparkline-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
    <stop offset="0%" stopColor="rgba(53, 185, 233, 0.6)" />
    <stop offset="100%" stopColor="rgba(53, 185, 233, 0)" />
  </linearGradient>
</defs>

<path
  d={generatePath(points)}
  fill="url(#sparkline-gradient)"
  stroke="rgba(84, 148, 250, 1)"
  strokeWidth="2"
/>
```

**BreathingDot Position:**
- Location: **Last point of sparkline** (index = data.length - 1)
- Horizontal: At sparkline endpoint X coordinate
- Vertical: At sparkline endpoint Y coordinate
- Visual effect: Dot appears **half inside panel, half outside**
  - Left semicircle: Inside panel
  - Right semicircle: Outside panel (extends beyond right edge)

**Implementation:**
```typescript
const lastPoint = points[points.length - 1];

<BreathingDot
  attentionLevel={attentionLevel}
  style={{
    position: 'absolute',
    left: `${lastPoint.x}px`,
    top: `${lastPoint.y}px`,
    transform: 'translate(0, -50%)'  // Center vertically on line
  }}
/>
```

**Hover State Transition:**

Default state (no hover):
```
┌─────────────────────────────┐
│ Upper Panel                  │
├─────────────────────────────┤
│ [Flow] [↑2.5%]              │ ← Lower Panel shows metrics
└─────────────────────────────┘
```

Hover state:
```
┌─────────────────────────────┐
│ Upper Panel                  │
├─────────────────────────────┤
│ [Sparkline Graph]       ●   │ ← Lower Panel shows sparkline
│  /\  /\    /\          ◐   │    Dot half-out
└─────────────────────────────┘
```

**Animation Sequence:**
```typescript
// On hover
<motion.div
  initial={{ opacity: 0 }}
  whileHover={{ opacity: 1 }}
  transition={{ duration: 0.3 }}
>
  {/* Capital Flow + Change% fade out */}
  <motion.div initial={{ opacity: 1 }} whileHover={{ opacity: 0 }}>
    <CapitalFlow />
    <ChangePercent />
  </motion.div>

  {/* Sparkline fades in */}
  <motion.div initial={{ opacity: 0 }} whileHover={{ opacity: 1 }}>
    <Sparkline />
  </motion.div>

  {/* Panel becomes transparent glass */}
  <motion.div
    initial={{ background: 'rgba(0,0,0,0.4)' }}
    whileHover={{ background: 'rgba(255,255,255,0.1)' }}
  />
</motion.div>
```

### 8.6 BreathingDot

**Component:** Animated attention indicator

**Default Color:** Cyan (`rgba(53, 185, 233, 0.9)`)
*Changed from white - uses cyan to stand out against glassmorphism*

**Color Behavior:**
- **No color change** based on sector up/down performance
- Always cyan regardless of tile color (red/green)
- Ensures visibility on all backgrounds

**Visual Properties:**
- Size: 6px diameter (idle)
- Scale animation: 6px → 8px → 6px
- Opacity animation: 0.7 → 1.0 → 0.7
- Color: `rgba(53, 185, 233, 0.9)` (cyan)
- Border: None
- Shadow: `0 0 8px rgba(53, 185, 233, 0.4)` (subtle glow)

**Animation Speed Based on Attention Level:**
- High attention (80-100): Fast pulse (0.8s cycle)
- Medium attention (40-79): Medium pulse (1.5s cycle)
- Low attention (0-39): Slow pulse (3s cycle)

**Implementation:**
```typescript
const BreathingDot = ({ attentionLevel }: { attentionLevel: number }) => {
  const duration = getPulseDuration(attentionLevel);

  return (
    <motion.div
      className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full"
      style={{
        backgroundColor: 'rgba(53, 185, 233, 0.9)',
        boxShadow: '0 0 8px rgba(53, 185, 233, 0.4)'
      }}
      animate={{
        scale: [1, 1.33, 1],
        opacity: [0.7, 1, 0.7]
      }}
      transition={{
        duration: duration,
        repeat: Infinity,
        ease: 'easeInOut'
      }}
    />
  );
};

function getPulseDuration(attentionLevel: number): number {
  if (attentionLevel >= 80) return 0.8; // Fast
  if (attentionLevel >= 40) return 1.5; // Medium
  return 3.0; // Slow
}
```

### 8.7 Breadcrumb - Navigation Component

**Component:** Navigation trail showing current drill-down path

**Structure:**
```typescript
interface BreadcrumbItem {
  label: string;
  level: 1 | 2 | 3 | 4;
  code: string;  // Sector/industry/stock code
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  onNavigate: (level: number) => void;
}
```

**Visual Design:**
```
一级行业 / 电子 / 半导体 / 光学光电子
└─────┘   └──┘   └────┘   └────────┘
   L1      L2      L3         L4
 (link)  (link)  (link)    (current)
```

**Separator:** Use forward slash `/` between levels

**Visual States:**

| Item Type | Style | Interaction |
|-----------|-------|-------------|
| **Current Level** | `text-white font-semibold` | Not clickable, no hover effect |
| **Parent Levels** | `text-white/60 font-normal` | Clickable, underline on hover |
| **Separator** | `text-white/40` | Decorative only, `aria-hidden="true"` |

**Implementation:**
```typescript
const Breadcrumb = ({ items, onNavigate }: BreadcrumbProps) => {
  return (
    <nav aria-label="面包屑导航" className="flex items-center gap-2 text-sm">
      {items.map((item, index) => {
        const isCurrent = index === items.length - 1;

        return (
          <React.Fragment key={item.code}>
            {isCurrent ? (
              <span
                className="text-white font-semibold"
                aria-current="page"
              >
                {item.label}
              </span>
            ) : (
              <button
                onClick={() => onNavigate(item.level)}
                className="text-white/60 hover:text-white hover:underline transition-colors"
                aria-label={`返回${item.label}`}
              >
                {item.label}
              </button>
            )}

            {!isCurrent && (
              <span className="text-white/40" aria-hidden="true">/</span>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};
```

**Animation - Drill-Down (Add Item):**
```typescript
const itemVariants = {
  initial: { opacity: 0, x: -10 },
  animate: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.3, ease: 'easeOut' }
  }
};

// New item slides in from left
<motion.span
  variants={itemVariants}
  initial="initial"
  animate="animate"
>
  {newItem.label}
</motion.span>
```

**Animation - Drill-Up (Remove Item):**
```typescript
const removeVariants = {
  exit: {
    opacity: 0,
    x: 10,
    transition: { duration: 0.2, ease: 'easeIn' }
  }
};

// Last item fades out and slides right
<motion.span
  variants={removeVariants}
  exit="exit"
>
  {removedItem.label}
</motion.span>
```

**Truncation for Long Names:**
```typescript
const truncateName = (name: string, maxLength: number = 12) => {
  return name.length > maxLength
    ? name.substring(0, maxLength) + '...'
    : name;
};

// Usage
<button title={item.label}>
  {truncateName(item.label)}
</button>
```

**Maximum Levels Display:**
- Shows all 4 levels: 一级行业 / 二级行业 / 三级行业 / 股票
- No ellipsis truncation between levels
- Individual item names truncate if > 12 characters

### 8.7.1 Breadcrumb - Accessibility

**ARIA Attributes:**
```typescript
<nav aria-label="面包屑导航">
  <ol className="flex items-center gap-2">
    {items.map((item, index) => (
      <li key={item.level}>
        {index < items.length - 1 ? (
          <button
            onClick={() => onNavigate(item.level)}
            aria-label={`返回${item.label}`}
            className="hover:underline"
          >
            {item.label}
          </button>
        ) : (
          <span aria-current="page">{item.label}</span>
        )}
        {index < items.length - 1 && <span aria-hidden="true">/</span>}
      </li>
    ))}
  </ol>
</nav>
```

**Keyboard Navigation:**
- Tab through breadcrumb items
- Enter/Space to navigate to level

### 8.8 SearchBox - Cross-Level Search

**Component:** Intelligent search with cross-level drill-down

**Search Scope:**
- **From Level 1 (一级行业)**: Search Level 2/3/4 (二级/三级/股票)
- **From Level 2**: Search Level 3/4
- **From Level 3**: Search Level 4
- Always searches DEEPER levels, never current or parent levels

**Search Capabilities:**
- **Pinyin matching**: "dianzi" → "电子"
- **Hanzi matching**: "电子" → "电子"
- **Stock code matching**: "600519" → "贵州茅台"
- **Fuzzy matching**: Partial matches allowed

**UI States:**

| State | Description | Visual | Search Icon State |
|-------|-------------|--------|------------------|
| Empty | No input | Placeholder: "搜索行业..." | Disabled (gray) |
| Typing | User typing | Show autocomplete dropdown | Disabled until valid |
| Valid Selection | User clicked suggestion | Input filled with selection | Enabled (clickable) |
| Searching | After click search icon | Loading spinner | Disabled |
| No Results | No matches found | "未找到结果" message | Disabled |

**Autocomplete Dropdown:**

```typescript
interface SearchSuggestion {
  code: string;
  name: string;
  level: 2 | 3 | 4;
  levelName: '二级行业' | '三级行业' | '股票';
  parent: string;  // Parent sector name
  matchType: 'pinyin' | 'hanzi' | 'code';
}

const SearchDropdown = ({ suggestions }: { suggestions: SearchSuggestion[] }) => {
  return (
    <div className="absolute top-full mt-2 w-full bg-gray-800 rounded-lg shadow-xl overflow-hidden">
      {/* Group by level */}
      {Object.entries(groupByLevel(suggestions)).map(([level, items]) => (
        <div key={level}>
          <div className="px-4 py-2 text-xs text-gray-400 bg-gray-900">
            {items[0].levelName}
          </div>
          {items.map(suggestion => (
            <button
              key={suggestion.code}
              onClick={() => handleSelect(suggestion)}
              className="w-full px-4 py-2 hover:bg-gray-700 text-left"
            >
              <div className="flex justify-between items-center">
                <span className="font-medium">{suggestion.name}</span>
                <span className="text-xs text-gray-400">{suggestion.code}</span>
              </div>
              <div className="text-xs text-gray-500">
                {suggestion.parent}
              </div>
            </button>
          ))}
        </div>
      ))}
    </div>
  );
};
```

**Search Flow:**

```typescript
const SearchBox = () => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [selectedSuggestion, setSelectedSuggestion] = useState<SearchSuggestion | null>(null);
  const [isSearchEnabled, setIsSearchEnabled] = useState(false);

  // Debounced search (300ms)
  const debouncedSearch = useDebouncedCallback((value: string) => {
    if (value.length === 0) {
      setSuggestions([]);
      return;
    }

    // Search across L2/L3/L4
    const results = searchAcrossLevels(value, currentLevel);
    setSuggestions(results);
  }, 300);

  const handleInputChange = (value: string) => {
    setQuery(value);
    setSelectedSuggestion(null);
    setIsSearchEnabled(false);
    debouncedSearch(value);
  };

  const handleSelectSuggestion = (suggestion: SearchSuggestion) => {
    setQuery(suggestion.name);
    setSelectedSuggestion(suggestion);
    setSuggestions([]);
    setIsSearchEnabled(true);  // Enable search icon
  };

  const handleSearch = () => {
    if (!selectedSuggestion) return;

    // Drill down to the level where result is located
    drillDownToResult(selectedSuggestion);
  };

  return (
    <div className="relative">
      <input
        type="text"
        value={query}
        onChange={(e) => handleInputChange(e.target.value)}
        placeholder="搜索行业..."
        className="w-64 px-4 py-2 pr-10 rounded-lg bg-gray-800"
      />

      <button
        onClick={handleSearch}
        disabled={!isSearchEnabled}
        className={`absolute right-2 top-1/2 -translate-y-1/2 ${
          isSearchEnabled ? 'text-white' : 'text-gray-600 cursor-not-allowed'
        }`}
      >
        <Search size={18} />
      </button>

      {suggestions.length > 0 && (
        <SearchDropdown suggestions={suggestions} />
      )}
    </div>
  );
};
```

**Drill-Down After Search:**

```typescript
const drillDownToResult = (result: SearchSuggestion) => {
  const targetLevel = result.level;
  const pathToResult = getPathToResult(result);  // e.g., ['801030', '801031', '801032']

  // Animate through levels
  animateDrillDownPath(pathToResult, () => {
    // After reaching target level, highlight the result briefly
    highlightSearchResult(result.code);
  });
};

const highlightSearchResult = (code: string) => {
  // Find the tile with matching code
  const targetTile = document.querySelector(`[data-code="${code}"]`);

  // Brief border highlight animation (2s)
  targetTile?.classList.add('search-result-highlight');

  // Dim non-matching tiles temporarily
  const allTiles = document.querySelectorAll('.heatmap-tile');
  allTiles.forEach(tile => {
    if (tile.getAttribute('data-code') !== code) {
      tile.classList.add('dimmed');
    }
  });

  // Remove effects after 2 seconds
  setTimeout(() => {
    targetTile?.classList.remove('search-result-highlight');
    allTiles.forEach(tile => tile.classList.remove('dimmed'));
  }, 2000);
};
```

**CSS Animations:**
```css
.search-result-highlight {
  animation: glow-border 2s ease-in-out;
}

@keyframes glow-border {
  0%, 100% {
    box-shadow: 0 0 0 0 rgba(110, 63, 243, 0);
  }
  50% {
    box-shadow: 0 0 0 4px rgba(110, 63, 243, 0.8);
  }
}

.dimmed {
  opacity: 0.4;
  transition: opacity 0.3s ease-in-out;
}
```

**Search Algorithm:**
```typescript
function searchAcrossLevels(query: string, currentLevel: 1 | 2 | 3 | 4): SearchSuggestion[] {
  const results: SearchSuggestion[] = [];
  const targetLevels = getTargetLevels(currentLevel);  // e.g., if L1, search L2/L3/L4

  targetLevels.forEach(level => {
    const entities = getAllEntitiesAtLevel(level);

    entities.forEach(entity => {
      // Pinyin match
      if (pinyinMatch(query, entity.name)) {
        results.push(createSuggestion(entity, 'pinyin'));
      }
      // Hanzi match
      else if (entity.name.includes(query)) {
        results.push(createSuggestion(entity, 'hanzi'));
      }
      // Stock code match (level 4 only)
      else if (level === 4 && entity.code.includes(query)) {
        results.push(createSuggestion(entity, 'code'));
      }
    });
  });

  // Sort: Exact matches first, then by level (L2 > L3 > L4)
  return results.sort((a, b) => {
    if (a.matchType === 'hanzi' && b.matchType !== 'hanzi') return -1;
    if (a.level !== b.level) return a.level - b.level;
    return 0;
  }).slice(0, 10);  // Max 10 results
}
```

**Notes:**
- No clear button (user must use Delete/Backspace)
- Search icon only enabled when valid suggestion selected
- Result count not shown (unique results only, no duplicates)

### 8.8.1 SearchBox - Accessibility

**ARIA Attributes:**
```typescript
<div role="search">
  <label htmlFor="sector-search" className="sr-only">
    搜索行业或股票
  </label>
  <input
    id="sector-search"
    type="text"
    role="combobox"
    aria-autocomplete="list"
    aria-expanded={showSuggestions}
    aria-controls="search-suggestions"
    aria-activedescendant={selectedSuggestionId}
  />

  {showSuggestions && (
    <ul
      id="search-suggestions"
      role="listbox"
      aria-label="搜索建议"
    >
      {suggestions.map((suggestion, index) => (
        <li
          key={suggestion.code}
          id={`suggestion-${index}`}
          role="option"
          aria-selected={index === selectedIndex}
        >
          {suggestion.name}
        </li>
      ))}
    </ul>
  )}
</div>
```

**Keyboard Navigation:**
- **Arrow Down/Up**: Navigate suggestions
- **Enter**: Select current suggestion and drill down
- **Escape**: Close suggestions

### 8.9 DynamicBackground - Animated Gradient Environment

**Component:** CSS-based animated gradient blobs (方案A)

**Implementation Strategy:** CSS Keyframes for best performance

**Configuration Parameters:**

| Blob | Color | Size | Position (Start) | Blur | Duration | Movement Pattern |
|------|-------|------|-----------------|------|----------|-----------------|
| Red (牛市情绪) | rgba(213,44,162,0.3) | 600px | top: -10%, left: 10% | 80px | 20s | Elliptical drift |
| Green (熊市情绪) | rgba(3,145,96,0.3) | 500px | bottom: -10%, right: 15% | 100px | 25s | Elliptical drift |
| Purple (中性基调) | rgba(110,63,243,0.2) | 700px | top: 40%, left: 50% | 90px | 30s | Circular + rotation |

**Complete Implementation:**

```typescript
// Component
export const DynamicBackground = () => {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-gradient-to-br from-gray-900 to-black">
      {/* Blob 1 - Red */}
      <div className="blob blob-red" />

      {/* Blob 2 - Green */}
      <div className="blob blob-green" />

      {/* Blob 3 - Purple */}
      <div className="blob blob-purple" />
    </div>
  );
};
```

**CSS Styles:**
```css
/* Base blob styles */
.blob {
  position: absolute;
  border-radius: 50%;
  opacity: 0.3;
  will-change: transform;
  transform: translate3d(0, 0, 0);  /* GPU acceleration */
  animation-timing-function: ease-in-out;
  animation-iteration-count: infinite;
  animation-direction: alternate;
}

/* Blob 1 - Red (Market Bull Sentiment) */
.blob-red {
  width: 600px;
  height: 600px;
  background: radial-gradient(circle, rgba(213, 44, 162, 1) 0%, transparent 70%);
  filter: blur(80px);
  top: -10%;
  left: 10%;
  animation: float-red 20s;
}

/* Blob 2 - Green (Market Bear Sentiment) */
.blob-green {
  width: 500px;
  height: 500px;
  background: radial-gradient(circle, rgba(3, 145, 96, 1) 0%, transparent 70%);
  filter: blur(100px);
  bottom: -10%;
  right: 15%;
  animation: float-green 25s;
}

/* Blob 3 - Purple (Neutral Tone) */
.blob-purple {
  width: 700px;
  height: 700px;
  background: radial-gradient(circle, rgba(110, 63, 243, 1) 0%, transparent 70%);
  filter: blur(90px);
  top: 40%;
  left: 50%;
  transform: translate(-50%, -50%);
  animation: float-purple 30s;
}

/* Animation - Red Blob (Elliptical drift) */
@keyframes float-red {
  0%, 100% {
    transform: translate(0, 0) scale(1);
  }
  50% {
    transform: translate(150px, 100px) scale(1.1);
  }
}

/* Animation - Green Blob (Elliptical drift, opposite direction) */
@keyframes float-green {
  0%, 100% {
    transform: translate(0, 0) scale(1);
  }
  50% {
    transform: translate(-120px, -80px) scale(1.15);
  }
}

/* Animation - Purple Blob (Circular + rotation) */
@keyframes float-purple {
  0%, 100% {
    transform: translate(-50%, -50%) scale(1) rotate(0deg);
  }
  50% {
    transform: translate(calc(-50% - 100px), calc(-50% + 150px)) scale(0.9) rotate(180deg);
  }
}
```

**Performance Optimization:**
```css
.blob {
  /* GPU Acceleration */
  will-change: transform;
  transform: translate3d(0, 0, 0);

  /* Prevent text blur */
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* Disable on low-end devices */
@media (prefers-reduced-motion: reduce) {
  .blob {
    animation: none;
    opacity: 0.2;
  }
}
```

**Responsive Degradation:**

```typescript
// Optional: Device performance detection
export const DynamicBackground = () => {
  const [enableAnimation, setEnableAnimation] = useState(true);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const isMobile = window.innerWidth < 768;
      const isLowEnd = navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4;

      // Disable on mobile or low-end devices
      if (isMobile || isLowEnd) {
        setEnableAnimation(false);
      }
    }
  }, []);

  if (!enableAnimation) {
    // Static gradient fallback
    return (
      <div className="fixed inset-0 -z-10 bg-gradient-to-br from-gray-900 via-purple-900/20 to-black" />
    );
  }

  // Animated version
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-gradient-to-br from-gray-900 to-black">
      <div className="blob blob-red" />
      <div className="blob blob-green" />
      <div className="blob blob-purple" />
    </div>
  );
};
```

**Z-Index Layering:**
```
Background Layer (z-index: -10):
  ├── Base gradient (gray-900 to black)
  └── Animated blobs (3 elements)

Foreground Layer (z-index: 0+):
  └── HeatMap tiles with glassmorphism
```

**Browser Compatibility:**
- Chrome/Edge: Full support
- Firefox: Full support
- Safari: Full support (with `-webkit-` prefixes)
- Mobile browsers: Automatic fallback to static gradient

### 8.10 SpotlightEffect

**Component:** Mouse-following spotlight effect (optional, configurable)

**Visual Properties:**
- Radial gradient following mouse cursor
- Soft edge falloff
- Optional feature (can be disabled)
- Adds depth and interactivity to glassmorphism

**Implementation:**
```typescript
interface SpotlightEffectProps {
  enabled?: boolean;
  intensity?: number;  // 0-1
}

export function SpotlightEffect({ enabled = true, intensity = 0.5 }: SpotlightEffectProps) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (!enabled) return;

    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div
      className="pointer-events-none fixed inset-0 z-10"
      style={{
        background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(255, 255, 255, ${intensity * 0.15}), transparent 40%)`
      }}
    />
  );
}
```

### 8.11 LoadingState

**Component:** Skeleton screen during initial data load

**Visual Design:**
- 31 tile placeholders in treemap layout
- Shimmer animation effect (left-to-right sweep)
- Semi-transparent glassmorphism style
- Pulsing breathing dots

**Implementation:**
```typescript
const LoadingState = () => {
  return (
    <div className="relative w-[920px] h-[580px]">
      {/* Generate 31 skeleton tiles */}
      {Array.from({ length: 31 }).map((_, i) => (
        <div
          key={i}
          className="absolute bg-gray-800/20 backdrop-blur-sm rounded-lg animate-pulse"
          style={{
            width: `${Math.random() * 100 + 150}px`,
            height: `${Math.random() * 80 + 150}px`,
            top: `${Math.random() * 450}px`,
            left: `${Math.random() * 750}px`
          }}
        >
          {/* Shimmer overlay */}
          <div className="absolute inset-0 shimmer" />
        </div>
      ))}

      {/* Loading text */}
      <div className="absolute inset-0 flex items-center justify-center">
        <p className="text-white/60 text-sm">Loading market data...</p>
      </div>
    </div>
  );
};
```

**Shimmer Animation:**
```css
@keyframes shimmer {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}

.shimmer::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(255, 255, 255, 0.1) 50%,
    transparent 100%
  );
  animation: shimmer 2s infinite;
}
```

**Timeout Behavior:**
- If loading exceeds 2 seconds, show progress message
- If loading exceeds 10 seconds, transition to ErrorState

### 8.12 ErrorState

**Component:** Error screen with retry option

**Error Types:**
1. **Data Load Failure** - API/mock data fetch failed
2. **Render Error** - Component rendering exception
3. **Performance Degradation** - Animation frame rate below threshold

**Visual Design:**
```typescript
interface ErrorStateProps {
  error: Error;
  onRetry: () => void;
  onDisableEffects?: () => void;
}

const ErrorState = ({ error, onRetry, onDisableEffects }: ErrorStateProps) => {
  const errorMessages = {
    'FETCH_ERROR': '数据加载失败',
    'RENDER_ERROR': '渲染错误',
    'PERFORMANCE_ERROR': '性能不足，建议关闭特效'
  };

  return (
    <div className="flex flex-col items-center justify-center h-[580px] gap-6">
      {/* Error icon */}
      <AlertCircle size={64} className="text-red-500" />

      {/* Error message */}
      <div className="text-center">
        <h3 className="text-xl font-semibold text-white mb-2">
          {errorMessages[error.name] || '发生错误'}
        </h3>
        <p className="text-sm text-white/60">
          {error.message}
        </p>
      </div>

      {/* Action buttons */}
      <div className="flex gap-3">
        <button
          onClick={onRetry}
          className="px-6 py-2 bg-violet-600 hover:bg-violet-700 rounded-lg"
        >
          重试
        </button>

        {error.name === 'PERFORMANCE_ERROR' && onDisableEffects && (
          <button
            onClick={onDisableEffects}
            className="px-6 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg"
          >
            关闭特效
          </button>
        )}
      </div>
    </div>
  );
};
```

**Fallback Strategy:**
- **Data Load Failure**: Retry with exponential backoff (1s, 2s, 4s)
- **Render Error**: Use React Error Boundary, fallback to simple layout
- **Performance Error**: Offer to disable animations (backdrop-filter, Framer Motion)

### 8.13 EmptyState

**Component:** Empty result screen

**Scenarios:**
1. **Search No Results** - Search query returns no matches
2. **Filter Empty** - Applied filters result in no data
3. **Drill-Down Empty** - Selected sector has no sub-levels

**Visual Design:**
```typescript
interface EmptyStateProps {
  scenario: 'search' | 'filter' | 'drill-down';
  query?: string;
  onClear?: () => void;
  onGoBack?: () => void;
}

const EmptyState = ({ scenario, query, onClear, onGoBack }: EmptyStateProps) => {
  const messages = {
    search: {
      title: '未找到匹配结果',
      description: `没有找到与 "${query}" 相关的行业或股票`,
      action: '清除搜索'
    },
    filter: {
      title: '当前筛选条件下无数据',
      description: '尝试调整筛选条件',
      action: '清除筛选'
    },
    'drill-down': {
      title: '该板块暂无子级数据',
      description: '已到达最底层',
      action: '返回上一级'
    }
  };

  const msg = messages[scenario];

  return (
    <div className="flex flex-col items-center justify-center h-[580px] gap-6">
      {/* Illustration */}
      <Search size={64} className="text-gray-500" />

      {/* Message */}
      <div className="text-center">
        <h3 className="text-xl font-semibold text-white mb-2">
          {msg.title}
        </h3>
        <p className="text-sm text-white/60">
          {msg.description}
        </p>
      </div>

      {/* Action button */}
      <button
        onClick={scenario === 'drill-down' ? onGoBack : onClear}
        className="px-6 py-2 bg-violet-600 hover:bg-violet-700 rounded-lg"
      >
        {msg.action}
      </button>
    </div>
  );
};
```

---

## 9. Implementation Guide

### 9.1 Data Usage & Page Setup

**Page Component:**
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

**HeatMap Container:**
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

**HeatMapHeader Component:**
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

### 9.2 Color Calculation Functions

**Chinese Market Convention: Red = UP, Green = DOWN**

**Base Colors:**
- Red (up) medium: `#D52CA2`
- Green (down) medium: `#039160`

**Color Calculation Function:**
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

**Data Formatting Functions:**
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
```

### 9.2.2 Number Formatting Specifications

**Capital Flow Formatting:**
```typescript
/**
 * Format capital flow with ¥ symbol and 亿 unit
 * @param value - Capital flow in 亿元
 * @returns Formatted string with sign, ¥ symbol, and unit
 *
 * Examples:
 *   450.5  → "+¥451亿"  (rounded to integer)
 *   -320.8 → "-¥321亿"
 *   0      → "¥0亿"
 */
function formatCapitalFlow(value: number): string {
  const rounded = Math.round(value);
  const sign = value > 0 ? '+' : value < 0 ? '' : '';  // No sign for zero
  return `${sign}¥${Math.abs(rounded)}亿`;
}
```

**Change Percent Formatting with Arrows:**
```typescript
import { ArrowUp, ArrowDown } from 'lucide-react';

/**
 * Format change percent with colored arrow and drop shadow
 * Arrow colors have white drop-shadow to prevent fusion with background
 *
 * @param changePercent - Change percentage value
 * @returns JSX element with arrow and formatted percentage
 */
function formatChangePercentWithArrow(changePercent: number) {
  const formatted = Math.abs(changePercent).toFixed(2);  // 2 decimal places
  const isPositive = changePercent > 0;

  return (
    <div className="flex items-center gap-1">
      {isPositive ? (
        <ArrowUp
          size={14}
          className="text-red-600"
          style={{
            filter: 'drop-shadow(0 0 2px rgba(255,255,255,0.9)) drop-shadow(0 1px 1px rgba(0,0,0,0.3))'
          }}
        />
      ) : (
        <ArrowDown
          size={14}
          className="text-green-600"
          style={{
            filter: 'drop-shadow(0 0 2px rgba(255,255,255,0.9)) drop-shadow(0 1px 1px rgba(0,0,0,0.3))'
          }}
        />
      )}
      <span className="text-xs font-semibold text-white text-shadow-sm">
        {formatted}%
      </span>
    </div>
  );
}
```

**Arrow Color Anti-Fusion Strategy:**

**Problem:** Red arrow on red background / green arrow on green background causes visual fusion

**Solution:** SVG icons with dual drop-shadow filter
1. **White glow** (2px radius, 90% opacity): Creates separation halo
2. **Black shadow** (1px offset, 30% opacity): Adds depth

**Visual Effect:**
- On red background: Red arrow with white outline → clearly visible
- On green background: Green arrow with white outline → clearly visible
- Maintains color semantics while preventing fusion

**Market Cap Formatting:**
```typescript
/**
 * Format market cap in 亿元 units
 * For values > 1000亿, still display as "1250亿" (not "1.25千亿")
 *
 * @param marketCap - Market cap in 亿元
 * @returns Formatted string
 *
 * Examples:
 *   450.5  → "451亿"   (rounded)
 *   1250.8 → "1251亿"  (not "1.25千亿")
 *   12500  → "12500亿" (not "1.25万亿")
 */
function formatMarketCap(marketCap: number): string {
  return `${Math.round(marketCap)}亿`;
}
```

**Decimal Precision:**
- Capital Flow: **0 decimal places** (rounded to integer)
- Change Percent: **2 decimal places** (e.g., "2.50%")
- Market Cap: **0 decimal places** (rounded to integer)

### 9.3 Animation Configuration

**Framer Motion Drill-Down Animation:**
```typescript
import { motion, AnimatePresence } from 'framer-motion';

const drillDownVariants = {
  initial: (custom: { parentX: number; parentY: number }) => ({
    opacity: 0,
    scale: 0,
    x: custom.parentX,
    y: custom.parentY
  }),
  animate: {
    opacity: 1,
    scale: 1,
    x: 0,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.4, 0.0, 0.2, 1]
    }
  },
  exit: (custom: { parentX: number; parentY: number }) => ({
    opacity: 0,
    scale: 0,
    x: custom.parentX,
    y: custom.parentY,
    transition: {
      duration: 0.4,
      ease: [0.4, 0.0, 0.2, 1]
    }
  })
};
```

**Performance Optimization:**
```typescript
const [isAnimating, setIsAnimating] = useState(false);

<motion.div
  variants={drillDownVariants}
  custom={{ parentX, parentY }}
  onAnimationStart={() => {
    setIsAnimating(true);
    // Disable backdrop-filter during animation
    tileRef.current.style.backdropFilter = 'none';
  }}
  onAnimationComplete={() => {
    setIsAnimating(false);
    // Re-enable backdrop-filter after animation
    tileRef.current.style.backdropFilter = 'blur(12px)';
  }}
>
  {/* Tile content */}
</motion.div>
```

**Why disable backdrop-filter during animation?**
- `backdrop-filter` is GPU-intensive
- Causes jank during scale/position animations
- Disabling during animation = smooth 60fps
- Re-enabling after = glass effect restored

**Stagger Animations:**
```typescript
const containerVariants = {
  animate: {
    transition: {
      staggerChildren: 0.02,  // 20ms delay between tiles
      delayChildren: 0.1      // Wait 100ms before starting
    }
  }
};

const tileVariants = {
  initial: { opacity: 0, scale: 0.8 },
  animate: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.3 }
  }
};
```

### 9.4 Theme Integration

**Dark Mode (Default):**
- Background: `#0a0f0d` (dark charcoal)
- Borders: `#374151` (gray-700)
- Text: `#ffffff` (white)

**Light Mode:**
- Background: `#f9fafb` (gray-50)
- Borders: `#d1d5db` (gray-300)
- Text: `#111827` (gray-900)

**Theme Configuration:**
```typescript
// apps/preview/src/app/layout.tsx
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
```

**Accessibility Requirements:**
- Border-to-background contrast ratio: **≥ 3:1** (WCAG 2.0 AA)
- Text-to-background contrast ratio: **≥ 4.5:1** (WCAG 2.0 AA for normal text)
- Tile color gradients maintain sufficient contrast in both themes

### 9.4.2 Theme Switching Implementation

**Theme Provider Setup:**

```typescript
// app/layout.tsx
import { ThemeProvider } from 'next-themes';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}  // Disable system theme detection
          disableTransitionOnChange={false}  // Enable smooth transitions
          themes={['light', 'dark']}
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
```

**Color Token Definitions:**

```css
/* globals.css */

/* Base styles (shared) */
:root {
  /* Spacing */
  --spacing-unit: 4px;

  /* Border radius */
  --radius-sm: 0.425rem;
  --radius-md: 0.625rem;
  --radius-lg: 0.625rem;
  --radius-xl: 1.025rem;

  /* Transitions */
  --transition-base: 300ms ease-in-out;
}

/* Light theme */
:root {
  /* Background */
  --background: oklch(98% 0 0);
  --background-secondary: oklch(95% 0 0);

  /* Text */
  --text-primary: oklch(20% 0 0);
  --text-secondary: oklch(40% 0 0);
  --text-tertiary: oklch(60% 0 0);

  /* Tile colors */
  --tile-border: rgba(0, 0, 0, 0.1);
  --tile-background: rgba(255, 255, 255, 0.6);
  --tile-shadow: rgba(0, 0, 0, 0.15);

  /* Chinese market colors (unchanged) */
  --color-up-red: #D52CA2;
  --color-down-green: #039160;

  /* Glassmorphism */
  --glass-background: rgba(255, 255, 255, 0.15);
  --glass-border: rgba(255, 255, 255, 0.4);
}

/* Dark theme */
.dark {
  /* Background */
  --background: oklch(15% 0 0);
  --background-secondary: oklch(20% 0 0);

  /* Text */
  --text-primary: oklch(95% 0 0);
  --text-secondary: oklch(75% 0 0);
  --text-tertiary: oklch(55% 0 0);

  /* Tile colors */
  --tile-border: rgba(255, 255, 255, 0.2);
  --tile-background: rgba(0, 0, 0, 0.4);
  --tile-shadow: rgba(0, 0, 0, 0.6);

  /* Chinese market colors (unchanged) */
  --color-up-red: #D52CA2;
  --color-down-green: #039160;

  /* Glassmorphism */
  --glass-background: rgba(0, 0, 0, 0.15);
  --glass-border: rgba(255, 255, 255, 0.2);
}
```

**Using Theme Tokens in Components:**

```typescript
// HeatMapTile.tsx
const HeatMapTile = ({ sector }: TileProps) => {
  return (
    <div
      className="heatmap-tile"
      style={{
        backgroundColor: 'var(--glass-background)',
        borderColor: 'var(--tile-border)',
        boxShadow: `0 10px 20px var(--tile-shadow)`,
        color: 'var(--text-primary)'
      }}
    >
      {/* Content */}
    </div>
  );
};
```

**Theme Toggle Component:**

```typescript
// components/ThemeToggle.tsx
import { useTheme } from 'next-themes';
import { Sun, Moon } from 'lucide-react';

export const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();

  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="p-2 rounded-lg bg-gray-800 dark:bg-gray-700 hover:bg-gray-700 dark:hover:bg-gray-600 transition-colors"
      aria-label={`切换到${theme === 'dark' ? '浅色' : '深色'}模式`}
    >
      {theme === 'dark' ? (
        <Sun size={20} className="text-yellow-400" />
      ) : (
        <Moon size={20} className="text-blue-400" />
      )}
    </button>
  );
};
```

**Smooth Theme Transition:**

```css
/* Transition all color-related properties */
*,
*::before,
*::after {
  transition:
    background-color var(--transition-base),
    color var(--transition-base),
    border-color var(--transition-base),
    box-shadow var(--transition-base);
}

/* Exclude animations from theme transition */
.heatmap-tile,
.sparkline,
.breathing-dot {
  transition: none !important;
}

/* Re-enable specific transitions after theme change */
.heatmap-tile {
  transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}
```

**Prevent Flash of Unstyled Content (FOUC):**

```typescript
// app/layout.tsx - Add blocking script
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                const theme = localStorage.getItem('theme') || 'dark';
                document.documentElement.classList.add(theme);
              })();
            `
          }}
        />
      </head>
      <body>
        <ThemeProvider {...props}>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
```

**Theme-Aware Image/Icon Components:**

```typescript
// Conditional rendering based on theme
const Logo = () => {
  const { theme } = useTheme();

  return (
    <img
      src={theme === 'dark' ? '/logo-dark.svg' : '/logo-light.svg'}
      alt="Logo"
    />
  );
};
```

**Accessibility Considerations:**

```css
/* Respect user's reduced motion preference */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    transition-duration: 0.01ms !important;
  }
}

/* Respect user's color scheme preference (if enableSystem = true) */
@media (prefers-color-scheme: dark) {
  :root {
    /* Auto-apply dark theme */
  }
}
```

---

## 10. Development Workflow

### 10.1 Development Commands

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

### 10.2 Port Assignments

| Service | Port | Purpose |
|---------|------|---------|
| preview (dev) | 4300 | Preview app development server |

**Note:** No backend services required - pure frontend development with mock data.

**Build Output:**
- Development: `http://localhost:4300`
- Build output: `dist/apps/preview/.next`

### 10.3 Build & Test Process

**Production Build:**
```bash
npx nx run preview:build
# Output: dist/apps/preview/.next
# Uses Next.js static export (output: 'export')
```

**Testing:**
- Use mock data for all 31 sectors
- Verify all tiles meet 150px × 150px minimum
- Check aspect ratios (1:1 to 1:1.618)
- Test glassmorphism effects
- Verify Chinese color convention (red = up, green = down)

**Future Integration into apps/web:**

Once styling is finalized, integrate into main web app:

**Step 1: Copy Code**
```bash
mkdir -p apps/web/src/app/preview
cp -r apps/preview/src/app/* apps/web/src/app/preview/
```

**Step 2: Adjust Imports**
- Merge Tailwind configurations
- Replace duplicate components with shared ones (if any)
- Update API paths if needed

**Step 3: Test Integration**
- Access `http://localhost:4200/preview`
- Verify API routing works
- Test data fetching

**Step 4: Cleanup**
- Remove `apps/preview` directory
- Keep this design doc for reference

### 10.4 Performance Metrics & Monitoring

**Target Performance Metrics:**

#### Core Web Vitals

| Metric | Target | Threshold | Measurement |
|--------|--------|-----------|-------------|
| **FCP** (First Contentful Paint) | < 1.5s | < 2.0s | Time to first visible content |
| **LCP** (Largest Contentful Paint) | < 2.5s | < 4.0s | Time to main content render |
| **FID** (First Input Delay) | < 100ms | < 300ms | Input responsiveness |
| **CLS** (Cumulative Layout Shift) | < 0.1 | < 0.25 | Visual stability |
| **TTFB** (Time to First Byte) | < 600ms | < 1.0s | Server response time |

#### Animation Performance

| Animation | Target FPS | Min FPS | Duration | Notes |
|-----------|-----------|---------|----------|-------|
| Hover 3D effect | 60fps | 55fps | 400ms | Tile elevation + panel separation |
| Drill-down | 60fps | 55fps | 800ms | Fade out + expand animation |
| Stagger | 60fps | 58fps | 20ms/tile | Tile appearance sequence |
| Sparkline reveal | 60fps | 55fps | 400ms | Opacity + SVG animation |
| BreathingDot | 60fps | 58fps | 0.8-3s | Continuous pulse |

**Frame Rate Requirements:**
- **60fps** = 16.67ms per frame
- If frame time exceeds 20ms (50fps), consider performance degradation
- Animations must maintain consistent frame rate (no jank)

#### Memory Usage

| Stage | Heap Size | Delta | Threshold |
|-------|-----------|-------|-----------|
| Initial Load | < 50MB | - | < 80MB |
| After Drill-Down (L2) | < 65MB | +15MB | < 100MB |
| After Drill-Down (L3) | < 75MB | +10MB | < 120MB |
| After Drill-Down (L4) | < 80MB | +5MB | < 150MB |

**Memory Leak Detection:**
- Heap size should stabilize after drill-up
- No continuous growth over multiple drill-down/up cycles
- Test: Perform 10 drill-down/up cycles, final heap size < initial + 10MB

#### Bundle Size

| Asset | Size (gzipped) | Threshold | Notes |
|-------|----------------|-----------|-------|
| JavaScript bundle | < 150KB | < 200KB | Next.js + React + Framer Motion |
| CSS bundle | < 20KB | < 30KB | Tailwind + custom styles |
| Fonts (optional) | < 50KB | < 80KB | If custom fonts used |
| Icons | < 10KB | < 15KB | Lucide React tree-shaken |

**Total Page Weight:** < 250KB (gzipped), < 400KB (uncompressed)

---

**Monitoring Implementation:**

```typescript
// Performance Observer for Core Web Vitals
if (typeof window !== 'undefined') {
  const observer = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      // Log to analytics
      console.log(`[Performance] ${entry.name}:`, entry);

      // Send to monitoring service (e.g., Vercel Analytics)
      if (entry.entryType === 'largest-contentful-paint') {
        analytics.track('LCP', { value: entry.renderTime });
      }
    }
  });

  observer.observe({
    entryTypes: ['paint', 'largest-contentful-paint', 'layout-shift']
  });
}
```

**Frame Rate Monitoring:**
```typescript
let frameCount = 0;
let lastTime = performance.now();

function measureFPS() {
  frameCount++;
  const currentTime = performance.now();
  const delta = currentTime - lastTime;

  if (delta >= 1000) {
    const fps = (frameCount * 1000) / delta;
    console.log(`[FPS] ${fps.toFixed(1)} fps`);

    if (fps < 55) {
      console.warn('[Performance] Frame rate below threshold, consider disabling effects');
    }

    frameCount = 0;
    lastTime = currentTime;
  }

  requestAnimationFrame(measureFPS);
}

measureFPS();
```

**Memory Profiling:**
```typescript
// Memory usage snapshot
function checkMemoryUsage() {
  if (performance.memory) {
    const { usedJSHeapSize, jsHeapSizeLimit } = performance.memory;
    const usageMB = (usedJSHeapSize / 1024 / 1024).toFixed(2);
    const limitMB = (jsHeapSizeLimit / 1024 / 1024).toFixed(2);

    console.log(`[Memory] ${usageMB}MB / ${limitMB}MB`);

    if (usedJSHeapSize > 150 * 1024 * 1024) {  // 150MB threshold
      console.warn('[Memory] High memory usage detected');
    }
  }
}

// Check every 30 seconds
setInterval(checkMemoryUsage, 30000);
```

**Performance Budget Enforcement:**

```typescript
// Webpack bundle analyzer
module.exports = {
  webpack: (config) => {
    if (process.env.ANALYZE) {
      const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
      config.plugins.push(
        new BundleAnalyzerPlugin({
          analyzerMode: 'static',
          openAnalyzer: true
        })
      );
    }
    return config;
  }
};
```

**Performance Degradation Fallbacks:**

```typescript
// Automatic performance adjustment
const [effectsEnabled, setEffectsEnabled] = useState(true);

useEffect(() => {
  let lowFpsCount = 0;

  const checkPerformance = () => {
    const fps = measureCurrentFPS();

    if (fps < 50) {
      lowFpsCount++;

      if (lowFpsCount > 5) {
        // Consistent low FPS: disable effects
        setEffectsEnabled(false);
        console.warn('[Performance] Disabled backdrop-filter and animations');
      }
    } else {
      lowFpsCount = 0;
    }
  };

  const interval = setInterval(checkPerformance, 1000);
  return () => clearInterval(interval);
}, []);
```

**Lighthouse CI Integration:**

```yaml
# .github/workflows/lighthouse.yml
name: Lighthouse CI
on: [pull_request]

jobs:
  lighthouse:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Run Lighthouse CI
        run: |
          npm install -g @lhci/cli
          lhci autorun
        env:
          LHCI_GITHUB_APP_TOKEN: ${{ secrets.LHCI_GITHUB_APP_TOKEN }}
```

**Performance Testing Checklist:**
- [ ] All animations run at 60fps on desktop
- [ ] Drill-down completes in < 1 second
- [ ] No memory leaks after 10 drill-down cycles
- [ ] Bundle size < 250KB gzipped
- [ ] LCP < 2.5s on 3G network
- [ ] No layout shifts (CLS < 0.1)

---

## 11. Success Criteria

### 11.1 Functionality (1-4)

1. ✅ Independent app runs on port 4300
2. ✅ Displays 31 SW Level-1 sectors correctly
3. ✅ Tile sizes proportional to market cap
4. ✅ Mock data renders without errors

### 11.2 Visual Design (5-8)

5. ✅ Matches Figma visual design (layout, typography, spacing)
6. ✅ **Chinese market colors**: RED for up, GREEN for down (verified)
7. ✅ Light/dark theme toggle works correctly
8. ✅ Breathing indicator animates at correct frequency

### 11.3 Layout & Dimensions (9-16)

9. ✅ Page displays HeatMap in full-width layout
10. ✅ HeatMap minimum width: 920px (enforced)
11. ✅ HeatMap maximum height: 580px (enforced)
12. ✅ HeatMap container padding: 8px all sides (enforced)
13. ✅ Vertical scroll appears when height > 580px
14. ✅ Scrollbar does NOT overlap with tiles (8px padding prevents)
15. ✅ Height dynamically adjusts based on tile layout
16. ✅ Component supports scaling/zoom operations

### 11.4 Tile Shape & Size (17-21)

17. ✅ All tiles have aspect ratio between 1:1 and 1:1.618 (verified)
18. ✅ No vertical rectangles (width always ≥ height)
19. ✅ All tiles meet minimum width: 150px (verified)
20. ✅ All tiles meet minimum height: 150px (verified)
21. ✅ Tile content is readable and properly displayed

### 11.5 Header Components (22-28)

22. ✅ Header displays "Market Performance" title (left aligned)
23. ✅ Breadcrumb navigation below title
24. ✅ Search box with inline icon (rounded rectangle)
25. ✅ Search icon clickable, no visible button shape
26. ✅ Two toggles vertically stacked after search box
27. ✅ Toggle group height matches search box (40px)
28. ✅ Header layout responsive and properly aligned

### 11.6 Architecture & Code Quality (29-32)

29. ✅ Layout calculation (useTreeMap) decoupled from UI (HeatMapTile)
30. ✅ Single Responsibility Principle enforced
31. ✅ 4-level drill-down state management (useDrillDown)
32. ✅ Mock data for all 4 levels complete

### 11.7 Glassmorphism Effects (33-41)

33. ✅ Tile gap: 4px (crystal edge aesthetic)
34. ✅ Backdrop-filter blur(12px) glass effect
35. ✅ Semi-transparent background with color tint
36. ✅ Linear gradient borders (glass edge simulation)
37. ✅ Inset box-shadow (surface texture)
38. ✅ Drop shadow (0 10px 20px) for depth
39. ✅ Text with shadow (floating above glass)
40. ✅ Dynamic background (60-100px blur)
41. ✅ Spotlight effect (optional, configurable)

### 11.8 Animation System (42-46)

42. ✅ Framer Motion AnimatePresence integration
43. ✅ Drill-down animation (expand from parent)
44. ✅ Drill-up animation (reverse shrink)
45. ✅ Performance optimization (disable backdrop-filter during animation)
46. ✅ Stagger animation (20ms delay between tiles)

### 11.9 Advanced Features (47-49)

47. ✅ Adaptive content degradation (based on tile size)
48. ✅ Variable speed linear mapping (color intensity)
49. ✅ 4-level drill-down support (一级→二级→三级→股票)

### 11.10 3D Hover Interaction (50-59)

50. ✅ Tile lifts on hover (-12px Y-axis)
51. ✅ Enhanced shadow depth during hover
52. ✅ Bottom 1/3 panel separates from tile
53. ✅ Panel rotates along Z-axis (3deg right tilt)
54. ✅ Panel becomes transparent glass (0.3 opacity)
55. ✅ Original content fades out (capital flow + change%)
56. ✅ Sparkline chart fades in (2px stroke)
57. ✅ Breathing indicator dot at sparkline end (6px, 2s pulse)
58. ✅ 30-day trend data for all sectors/stocks
59. ✅ Smooth elastic transition (400ms cubic-bezier)

### 11.11 Sector Icons (60-65)

60. ✅ Lucide icons for all 31 sectors (visual metaphors)
61. ✅ Icon size: 16-18px, stroke-width: 2px
62. ✅ Icon color: rgba(255, 255, 255, 0.9)
63. ✅ Icon position: Left of sector name (6px gap)
64. ✅ Adaptive icon display (hidden on smallest tiles)
65. ✅ Icon identifier stored in mock data

### 11.12 Header Scroll Effects (66-71)

66. ✅ Header bottom edge gradient mask (80-100% fade)
67. ✅ Tiles fade naturally when scrolling under header
68. ✅ Background opacity transitions (0.2 → 0.6)
69. ✅ Shadow enhances during scroll (subtle → deep)
70. ✅ Smooth 300ms transition between states
71. ✅ Scroll state tracked and applied correctly

### 11.13 Sparkline Animations (72-77)

72. ✅ Area fill gradient (cyan → transparent)
73. ✅ Stroke-dasharray animation (0.4s draw)
74. ✅ Line draws from left to right
75. ✅ Breathing dot appears after line (0.4s delay)
76. ✅ Dot scale animation (0 → 1)
77. ✅ Continuous breathing pulse (2s cycle)

---

## 12. Design Principles

### 12.1 Complete Independence from apps/web

**⚠️ Critical: The preview app components must be designed independently without being influenced by apps/web components.**

**Core Principles:**

1. **No code sharing** with apps/web during Phase 1
   - Zero imports from `apps/web/src/*`
   - No dependency on web's component library
   - Fresh implementation for all components

2. **No style inheritance** from apps/web's Tailwind config
   - Independent `tailwind.config.ts` in preview app
   - Own color palette and design tokens
   - Custom spacing and sizing scales

3. **No component reuse** from apps/web/components
   - Build all UI components from scratch
   - No shared component dependencies
   - Clean slate for component APIs

4. **Clean slate** - design components from scratch based on Figma
   - Pure implementation of Figma design specifications
   - No legacy patterns or constraints
   - Follow Figma specs exactly

5. **Fresh perspective** - not constrained by existing patterns
   - Explore new UI/UX patterns freely
   - Experiment with advanced effects (glassmorphism, 3D)
   - Innovate without breaking existing code

**Rationale:**

- **Innovation freedom**: Explore new UI/UX without legacy constraints
- **Faster iteration**: No risk of breaking apps/web during experimentation
- **Pure design vision**: Implement Figma design exactly as intended
- **Better component APIs**: Design optimal interfaces from ground up
- **Selective integration**: Cherry-pick best components for apps/web later (not wholesale copy)

### 12.2 Required Development Tools

**🎨 UI/UX Design Tool:**

```bash
/ui-ux-pro-max
```

**Purpose:** Professional UI/UX design with best practices and modern patterns

**Use when:**
- Building any component (HeatMap, HeatMapTile, BreathingDot, SearchBox, etc.)
- Implementing glassmorphism effects
- Creating 3D hover interactions
- Applying animation systems

**Features:**
- 50 pre-built design styles (glassmorphism, neumorphism, minimalism, etc.)
- 21 color palettes with accessibility compliance
- 50 font pairings optimized for web
- Component patterns (cards, buttons, modals, navigation)
- Accessibility guidelines (WCAG 2.0 AA/AAA)

**📐 Figma Integration Tool:**

```bash
/figma
# or use Figma MCP server tools directly
```

**Purpose:** Extract accurate design specifications from Figma

**Use when:**
- Extracting component dimensions and spacing
- Getting exact color values and opacity
- Understanding layout structure
- Verifying typography specs

**Features:**
- Screenshot capture of Figma frames
- Design context extraction (colors, fonts, spacing)
- Variable definitions and design tokens
- Metadata and component structure

### 12.3 Component Development Workflow

**Step-by-step process for building each component:**

1. **Extract from Figma**
   - Use Figma MCP tools to capture design specs
   - Get exact measurements (width, height, padding, gaps)
   - Extract color values, opacity, blur values
   - Document typography (font family, size, weight, line-height)

2. **Design component**
   - Invoke `/ui-ux-pro-max` skill for implementation
   - Provide Figma specs as context
   - Request specific style (glassmorphism, 3D effects, animations)
   - Review generated component structure

3. **Implement**
   - Build with React 19 functional components
   - Use Tailwind CSS v4 for styling
   - Use independent Tailwind config (no apps/web imports)
   - Apply TypeScript types for all props and state

4. **Iterate**
   - Compare visual output with Figma design
   - Refine spacing, colors, effects
   - Test responsive behavior (if applicable)
   - Validate accessibility (contrast, focus states)

5. **Verify independence**
   - Confirm zero imports from `apps/web`
   - Verify no shared component dependencies
   - Check Tailwind config has no references to web's config
   - Ensure component works in isolation

---

## 13. Technical Decisions

### 13.1 Why Next.js instead of Vite?

**Decision:** Use Next.js 15 with static export for the preview app.

**Rationale:**

- **Consistency with main app**: `apps/web` uses Next.js, same tech stack ensures compatibility
- **Easy integration path**: Can directly copy code to apps/web later without framework rewrite
- **No migration overhead**: Same framework = smooth migration, just move files and adjust imports
- **Static export support**: Next.js `output: 'export'` generates static HTML (no server needed)
- **Familiar tooling**: Team already knows Next.js patterns and conventions

**Trade-offs:**
- Slightly heavier than Vite (larger framework)
- But integration benefits outweigh initial setup cost

### 13.2 Why Independent App?

**Decision:** Build as standalone `apps/preview` instead of `/preview` page in apps/web.

**Rationale:**

- **Isolation**: Zero risk of breaking existing web app during development
- **Fast iteration cycles**: Independent build/serve cycles (port 4300 vs 4200)
- **Clean separation**: Clear boundary between production code and experimental UI
- **Easy cleanup**: Remove entire `apps/preview` directory when done
- **Design freedom**: Not constrained by web's component patterns, Tailwind config, or layout structure
- **Parallel development**: Can work on preview without affecting web app team

**Integration plan:**
- Once design finalized, copy components to `apps/web/src/app/preview/`
- Merge Tailwind configs selectively
- Test in web's context
- Delete `apps/preview` directory

### 13.3 Why Recharts for Layout?

**Decision:** Use Recharts `<Treemap>` component for treemap layout algorithm only.

**Rationale:**

- **Already in stack**: Recharts is used in existing dashboards (no new dependency)
- **React-first**: Native React component, integrates seamlessly
- **Proven algorithm**: Recharts uses squarified treemap algorithm (optimal aspect ratios)
- **Flexible rendering**: Custom `content` prop allows complete control over tile rendering
- **Layout only**: Use Recharts for positioning, render custom `HeatMapTile` component for visuals

**Implementation pattern:**
```tsx
<Treemap
  data={sectorData}
  dataKey="value"
  content={<HeatMapTile />}  {/* Custom tile component */}
/>
```

**Why not d3-hierarchy directly?**
- More boilerplate code
- Need to implement layout algorithm manually
- Recharts provides React-friendly API out of the box

---

## 14. Future Considerations

### 14.1 Phase 2: API Integration

**Current state (Phase 1):**
- Pure frontend with static mock data
- No backend calls
- No real-time updates

**Future implementation (Phase 2):**

**Data source:** `market-data` FastAPI service

**API endpoints needed:**
```
GET /api/sectors           # All 31 SW Level-1 sectors
GET /api/sectors/:id       # Level-2 industries under sector
GET /api/industries/:id    # Level-3 sub-industries
GET /api/stocks/:id        # Level-4 individual stocks
```

**Real-time updates:**
- WebSocket connection to `market-data` service
- Subscribe to sector performance updates
- Update tiles when market data changes
- Breathing indicator syncs with real market pulse

**Caching strategy:**
- Redis cache for sector hierarchy (rarely changes)
- Real-time data refreshed every 3-5 seconds
- Optimistic UI updates for smooth UX

### 14.2 Phase 2: Interactive Features

**Planned interactive features:**

**Navigation:**
- ✅ Click tile to drill down (already designed, needs API)
- ✅ Breadcrumb click to navigate up hierarchy (already designed)
- Search box autocomplete with sector/stock suggestions
- Keyboard navigation (arrow keys, Enter to drill)

**Filtering:**
- Filter by market cap range (small/mid/large cap)
- Filter by performance (top gainers/losers)
- Filter by capital flow (inflow/outflow)
- Toggle between absolute and relative view

**Export features:**
- Export current view as PNG image
- Export data as CSV
- Share link with current state (URL params)

**Responsive design:**
- Mobile layout adaptation
- Touch gestures (pinch to zoom)
- Simplified tile layout for small screens

### 14.3 Integration into apps/web

**When to integrate:** After Phase 1 UI design is finalized and visually approved.

**Integration steps:**

**Step 1: Copy component code**
```bash
mkdir -p apps/web/src/app/preview
cp -r apps/preview/src/app/* apps/web/src/app/preview/
cp -r apps/preview/src/components apps/web/src/components/heatmap
```

**Step 2: Merge Tailwind configurations**
- Compare `apps/preview/tailwind.config.ts` with `apps/web/tailwind.config.ts`
- Add new color tokens to web's config
- Add new spacing/sizing scales if needed
- Preserve web's existing config (additive merge, not replacement)

**Step 3: Adjust imports**
- Update component imports to use web's path aliases
- Replace duplicate UI components with shared ones (if any exist)
- Update API paths to point to web's API routes

**Step 4: Test integration**
- Navigate to `http://localhost:4200/preview`
- Verify all components render correctly
- Test drill-down navigation
- Verify theme toggle works with web's theme provider

**Step 5: Cleanup**
- Delete `apps/preview` directory
- Remove preview from Nx workspace (`nx.json`, `package.json`)
- Keep this design doc for reference (`docs/plans/2026-01-28-treemap-preview-design.md`)

**What to keep:**
- Design system specifications (colors, spacing, effects)
- Component APIs and patterns (if successful)
- Animation configurations

**What to replace:**
- Duplicate utility components (buttons, toggles, search boxes)
- Duplicate layout components (if web has better versions)
- Redundant hooks (if web has equivalent state management)

---

## 15. Non-Goals

**Explicitly excluded from scope:**

**Infrastructure:**
- ❌ Docker deployment (development only, no production containers)
- ❌ CI/CD pipeline setup
- ❌ Production hosting configuration

**Backend features:**
- ❌ User authentication and authorization
- ❌ Data persistence (database, file storage)
- ❌ Real market data integration (mock data only in Phase 1)
- ❌ WebSocket real-time updates (Phase 1)
- ❌ API endpoints (pure frontend)

**Responsive design:**
- ❌ Mobile responsiveness (desktop-first, 920px minimum width)
- ❌ Tablet optimization
- ❌ Touch gesture support
- ❌ Mobile-specific layouts

**Interactive features (Phase 1):**
- ❌ Complex interactions beyond drill-down (filters, sorting, export)
- ❌ Search autocomplete with API
- ❌ User preferences and saved views
- ❌ Share/export functionality

**Design constraints:**
- ❌ **Reusing components from apps/web** (must design independently)
- ❌ **Matching apps/web style patterns** (fresh design approach)
- ❌ **Grouping sectors into "Others" category** (all 31 sectors must display individually)
- ❌ **Excluding small market cap sectors** (all 31 sectors required)
- ❌ **Using apps/web's Tailwind config** (independent config)

**Testing:**
- ❌ E2E tests (manual testing sufficient for Phase 1)
- ❌ Performance benchmarking
- ❌ Load testing

**Documentation:**
- ❌ End-user documentation (internal preview only)
- ❌ API documentation (no API in Phase 1)

---

## 16. Appendices

### Appendix A: Detailed Code Examples

Complete code examples are embedded throughout this document in their relevant sections. For quick reference:

**Hook implementations:**
- **Section 5.3**: Custom hooks (`useDrillDown`, `useHeatMapLayout`, `useTileColor`)

**Glassmorphism effects:**
- **Section 6.2**: CSS backdrop-filter, transparency, borders, refraction

**3D hover interactions:**
- **Section 6.3**: Transform3D, perspective, panel separation, sparkline reveal

**Animation configurations:**
- **Section 6.4**: Framer Motion variants for drill-down, stagger, tile transitions

**Implementation patterns:**
- **Section 9.1**: Page setup and data usage
- **Section 9.2**: Color calculation functions (performance → color mapping)
- **Section 9.3**: Animation configuration (Framer Motion setup)
- **Section 9.4**: Theme integration (light/dark mode)

**Component specifications:**
- **Section 8.1-8.10**: Complete specs for all components (HeatMap, Tile, Header, Sparkline, etc.)

### Appendix B: Figma Design References

**Primary Design File:**
- **URL**: https://www.figma.com/design/O52eqHmOTyh0tzZwpC7sl9/landing-page?node-id=524-11
- **Frame**: HeatMap component with tiles and header
- **Access**: Use Figma MCP tools to extract specifications

**Design Specifications:**
- **Section 6.1**: Complete Figma specifications (colors, typography, spacing, effects)
- **Section 7**: Layout and dimension specifications (container, tiles, header)
- **Section 8**: Component-level specifications (all 10 components)

**How to use Figma references:**

1. **View design in Figma**:
   - Open URL in browser
   - Navigate to node-id=524-11 (HeatMap frame)
   - Inspect component structure and properties

2. **Extract specs with Figma MCP**:
   ```bash
   # Use Figma MCP tools
   /figma  # Invoke skill, then provide URL

   # Or use MCP tools directly:
   # - mcp__figma-desktop__get_design_context
   # - mcp__figma-desktop__get_screenshot
   # - mcp__figma-desktop__get_variable_defs
   ```

3. **Cross-reference with document**:
   - Compare extracted specs with Section 6.1 (Visual Design System)
   - Verify dimensions match Section 7 (Layout & Dimensions)
   - Confirm component specs in Section 8

**Related Resources:**
- **CLAUDE.md**: Project guidelines and coding conventions
- **SW Industry Classification**: 申万一级行业分类标准 (31 Level-1 sectors)

---
