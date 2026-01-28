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
│       │   ├── HeatMapTile.tsx      # UI rendering component (glassmorphism)
│       │   ├── TileBottomPanel.tsx  # Bottom 1/3 panel with 3D transform
│       │   ├── Sparkline.tsx        # Mini trend line chart (2px stroke)
│       │   ├── BreathingDot.tsx     # Breathing indicator component
│       │   ├── DynamicBackground.tsx # Blurred color blocks background
│       │   └── SpotlightEffect.tsx  # Mouse-following highlight (optional)
│       ├── hooks/
│       │   ├── useTreeMap.ts        # Layout calculation logic (decoupled)
│       │   └── useDrillDown.ts      # 4-level drill-down state management
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

**5.3.1 useTreeMap Hook**

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

## Glassmorphism Visual Design

### Tile Gap & Crystal Aesthetics

**Tile Spacing:**
- **Gap between tiles**: `4px` (凸显晶体边缘折射感)
- Creates visual separation emphasizing glass facets
- Applied to Treemap layout algorithm

### Glass Material Properties

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

### Typography Layer

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

### Dynamic Background Environment

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

### Spotlight Effect (Optional)

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

## Advanced 3D Hover Interaction

### Hover State Transformation

**Overview:**
When user hovers over a tile, it transforms with sophisticated 3D effects:
1. Tile lifts slightly (Y-axis elevation)
2. Bottom 1/3 panel separates from tile
3. Panel rotates along Z-axis (tilts right)
4. Panel becomes transparent glass
5. Original content (capital flow + change%) hidden
6. Sparkline chart appears with breathing indicator

### 3D Elevation Effect

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

### Bottom Panel 3D Transformation

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

### Sparkline Chart Component

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

### Mock Trend Data

**Generate trend data for sparkline:**
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

### Complete Hover Interaction Flow

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

### Visual Design Summary

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

## Framer Motion Animation System

### AnimatePresence & Drill-Down Animations

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

### Stagger Animations

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

## Advanced Tile Features

### Adaptive Content Degradation

**Content Display Rules:**
```typescript
// Content visibility based on tile size
const getVisibleContent = (width: number, height: number) => {
  const area = width * height;

  if (area >= 30000) {  // Large tiles (e.g., 200x150)
    return {
      showName: true,
      showBreathingDot: true,
      showCapitalFlow: true,
      showChangePercent: true,
      fontSize: 'base'
    };
  } else if (area >= 22500) {  // Medium tiles (e.g., 150x150)
    return {
      showName: true,
      showBreathingDot: true,
      showCapitalFlow: true,
      showChangePercent: true,
      fontSize: 'sm'  // Smaller font
    };
  } else {  // Minimum tiles (150px edge)
    return {
      showName: true,
      showBreathingDot: false,  // Hide breathing dot
      showCapitalFlow: false,   // Hide capital flow
      showChangePercent: true,  // Keep change% only
      fontSize: 'xs'
    };
  }
};
```

### Variable Speed Linear Mapping

**Color intensity mapping with non-linear curve:**
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

**Tile Layout:**
- **Dimensions**:
  - Minimum: 150px × 150px (required for content display)
  - Aspect ratio: 1:1 to 1:1.618 (square to golden ratio)
  - No vertical rectangles allowed
  - Gap: 4px between tiles (glassmorphism aesthetic)
- **Top-left**: Sector icon + name
  - **Icon** (Lucide React):
    - Size: 16-18px
    - Color: `rgba(255, 255, 255, 0.9)`
    - Margin-right: 6px (gap between icon and text)
    - Stroke-width: 2px
    - Visual metaphor for sector category
  - **Name**:
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
- **Animation**: Framer Motion (drill-down animations, transitions)
- **Charts**: Recharts v3 (Treemap layout calculation only)
- **Monorepo**: Nx 22.3.3
- **Icons**: Lucide React

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

### Architecture & Code Quality
29. ✅ **Layout calculation (useTreeMap) decoupled from UI rendering (HeatMapTile)**
30. ✅ Single Responsibility Principle enforced
31. ✅ 4-level drill-down state management (useDrillDown hook)
32. ✅ Mock data for all 4 levels (L1: 电子, L2: 8 industries, L3: 7 sub-industries, L4: 15 stocks)

### Glassmorphism Visual Effects
33. ✅ Tile gap: 4px (crystal edge refraction aesthetic)
34. ✅ Backdrop-filter blur(12px) glass effect
35. ✅ Semi-transparent background with color tint
36. ✅ Linear gradient borders (glass edge simulation)
37. ✅ Inset box-shadow (surface texture)
38. ✅ Drop shadow (0 10px 20px) for depth
39. ✅ Text with shadow (floating above glass effect)
40. ✅ Dynamic background with animated color blocks (60-100px blur)
41. ✅ Spotlight effect (mouse-following, optional, configurable)

### Animation System
42. ✅ Framer Motion AnimatePresence integration
43. ✅ Drill-down animation (expand from parent coordinate)
44. ✅ Drill-up animation (reverse shrink to parent)
45. ✅ Performance optimization (disable backdrop-filter during animation)
46. ✅ Stagger animation (tiles appear with 20ms delay)

### Advanced Features
47. ✅ Adaptive content degradation (based on tile size)
48. ✅ Variable speed linear mapping (color intensity)
49. ✅ 4-level drill-down support (一级→二级→三级→股票)

### 3D Hover Interaction
50. ✅ Tile lifts on hover (Y-axis -12px elevation)
51. ✅ Enhanced shadow depth during hover
52. ✅ Bottom 1/3 panel separates from tile
53. ✅ Panel rotates along Z-axis (3deg right tilt)
54. ✅ Panel becomes transparent glass (opacity 0.3)
55. ✅ Original content (capital flow + change%) fades out
56. ✅ Sparkline chart fades in (2px stroke, smooth curve)
57. ✅ Breathing indicator dot at sparkline end (6px, 2s pulse)
58. ✅ 30-day trend data for all sectors/stocks
59. ✅ Smooth elastic transition (400ms cubic-bezier)

### Visual Enhancement - Sector Icons
60. ✅ Lucide icons for all 31 sectors (visual metaphors)
61. ✅ Icon size: 16-18px, stroke-width: 2px
62. ✅ Icon color: rgba(255, 255, 255, 0.9)
63. ✅ Icon position: Left of sector name (6px gap)
64. ✅ Adaptive icon display (hidden on smallest tiles)
65. ✅ Icon identifier stored in mock data

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
