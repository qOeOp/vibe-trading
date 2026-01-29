# Treemap Preview Application Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build independent Next.js preview app displaying 31 SW Level-1 sector indices with glassmorphism, 3D hover, and drill-down navigation.

**Architecture:** Next.js 15 static export app with Recharts for layout calculation, custom SVG rendering for glassmorphism effects, Framer Motion for animations, and complete independence from apps/web.

**Tech Stack:** Next.js 15, React 19, TypeScript, Tailwind CSS v4, Framer Motion, Recharts v3, Lucide React

**Design Source:** /Users/vx/WebstormProjects/vibe-trading/docs/plans/2026-01-28-treemap-preview-design.md (3,792 lines, complete specifications)

---

## Task 1: Scaffold Next.js Application

**Files:**
- Create: `apps/preview/` (entire directory structure)
- Create: `apps/preview/project.json`
- Create: `apps/preview/next.config.js`
- Create: `apps/preview/tailwind.config.ts`
- Create: `apps/preview/tsconfig.json`
- Create: `apps/preview/src/app/layout.tsx`
- Create: `apps/preview/src/app/page.tsx`
- Create: `apps/preview/src/app/globals.css`

**Step 1: Generate Nx Next.js app**

Run: `npx nx g @nx/next:app preview --style=css --appDir=true`

When prompted:
- Would you like to use the App Router? → Yes
- Test runner? → None (we'll add later)
- E2E test runner? → None

Expected: Creates `apps/preview/` with basic structure

**Step 2: Verify app structure**

Run: `ls -la apps/preview/`

Expected: See `src/`, `project.json`, `next.config.js`, `tsconfig.json`

**Step 3: Update project.json for port 4300**

Edit `apps/preview/project.json`:

```json
{
  "name": "preview",
  "$schema": "../../node_modules/nx/schemas/project-schema.json",
  "sourceRoot": "apps/preview/src",
  "projectType": "application",
  "tags": [],
  "targets": {
    "serve": {
      "executor": "@nx/next:server",
      "defaultConfiguration": "development",
      "options": {
        "buildTarget": "preview:build",
        "dev": true,
        "port": 4300
      }
    },
    "build": {
      "executor": "@nx/next:build",
      "outputs": ["{options.outputPath}"],
      "defaultConfiguration": "production",
      "options": {
        "outputPath": "dist/apps/preview"
      }
    },
    "lint": {
      "executor": "@nx/eslint:lint"
    }
  }
}
```

**Step 4: Update next.config.js for static export**

Edit `apps/preview/next.config.js`:

```javascript
//@ts-check

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { composePlugins, withNx } = require('@nx/next');

/**
 * @type {import('@nx/next/plugins/with-nx').WithNxOptions}
 **/
const nextConfig = {
  output: 'export',
  images: { unoptimized: true },
  nx: {
    svgr: false,
  },
};

const plugins = [
  withNx,
];

module.exports = composePlugins(...plugins)(nextConfig);
```

**Step 5: Create Tailwind config with glassmorphism utilities**

Create `apps/preview/tailwind.config.ts`:

```typescript
import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      // Conservative finance color scheme
      // Only use red/green for price changes
      // All other colors: black/white/gray tones
      borderRadius: {
        'sm': '0.425rem',
        'md': '0.625rem',
        'lg': '0.625rem',
        'xl': '1.025rem',
      },
      backdropBlur: {
        'xs': '2px',
        'sm': '4px',
        'md': '8px',
        'lg': '12px',
        'xl': '20px',
        '2xl': '32px',
      },
      animation: {
        'ripple': 'ripple 3s linear infinite',
        'draw-line': 'draw-line 0.4s ease-out forwards',
      },
      keyframes: {
        ripple: {
          '0%': { scale: '0', opacity: '0.8' },
          '70%': { scale: '0', opacity: '0.8' },
          '100%': { scale: '3', opacity: '0' },
        },
        'draw-line': {
          'to': { strokeDashoffset: '0' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
```

**Step 6: Create layout.tsx with dark theme**

Edit `apps/preview/src/app/layout.tsx`:

```typescript
import './globals.css';

export const metadata = {
  title: 'Treemap Preview - Vibe Trading',
  description: '31 SW Level-1 Sector Indices Visualization',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN" className="dark">
      <body className="bg-gray-950 text-white antialiased" style={{ colorScheme: 'dark' }}>
        {children}
      </body>
    </html>
  );
}
```

**Step 7: Create globals.css with animations**

Edit `apps/preview/src/app/globals.css`:

```css
@import 'tailwindcss';

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
  }
}

/* Glassmorphism utilities */
.glass {
  backdrop-filter: blur(12px);
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.glass-tile {
  backdrop-filter: blur(8px);
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
}

/* Custom animations */
@keyframes ripple {
  0% {
    scale: 0;
    opacity: 0.8;
  }
  70% {
    scale: 0;
    opacity: 0.8;
  }
  100% {
    scale: 3;
    opacity: 0;
  }
}

@keyframes draw-line {
  to {
    stroke-dashoffset: 0;
  }
}

@keyframes spotlight {
  0% {
    opacity: 0;
    scale: 0.8;
  }
  50% {
    opacity: 1;
    scale: 1;
  }
  100% {
    opacity: 0.6;
    scale: 1;
  }
}
```

**Step 8: Create placeholder page.tsx**

Edit `apps/preview/src/app/page.tsx`:

```typescript
export default function PreviewPage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <h1 className="text-4xl font-bold">Treemap Preview</h1>
    </div>
  );
}
```

**Step 9: Test dev server**

Run: `npx nx serve preview`

Expected: Server starts on http://localhost:4300, shows "Treemap Preview"

**Step 10: Commit**

```bash
git add apps/preview/
git commit -m "$(cat <<'EOF'
feat(preview): scaffold Next.js app with glassmorphism config

- Create apps/preview with Next.js 15 + React 19
- Configure port 4300 for dev server
- Add Tailwind config with violet bloom theme colors
- Add glassmorphism utilities and custom animations
- Configure static export mode
- Add dark theme layout

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>
EOF
)"
```

---

## Task 2: Define TypeScript Types

**Files:**
- Create: `apps/preview/src/app/types/sector.ts`

**Step 1: Create type definitions file**

Create `apps/preview/src/app/types/sector.ts`:

```typescript
/**
 * Base entity interface for all levels
 */
export interface BaseEntity {
  code: string;
  name: string;
  icon?: string;
  marketCap: number;
  changePercent: number;
  capitalFlow: number;
  attentionLevel: number;
  level: 1 | 2 | 3 | 4;
  parent?: string;
  hasChildren?: boolean;
}

/**
 * Level 1: SW Industry Sector
 */
export interface Sector extends BaseEntity {
  level: 1;
}

/**
 * Level 2: Sub-Industry
 */
export interface Industry extends BaseEntity {
  level: 2;
  parent: string;
}

/**
 * Level 3: Tertiary Industry
 */
export interface SubIndustry extends BaseEntity {
  level: 3;
  parent: string;
}

/**
 * Level 4: Individual Stock
 */
export interface Stock extends BaseEntity {
  price: number;
  volume: number;
  level: 4;
  parent: string;
}

/**
 * Union type for all entities
 */
export type Entity = Sector | Industry | SubIndustry | Stock;

/**
 * Treemap node with layout coordinates
 */
export interface TreemapNode {
  entity: Entity;
  x: number;
  y: number;
  width: number;
  height: number;
}

/**
 * Drill-down navigation state
 */
export interface DrillDownState {
  currentLevel: 1 | 2 | 3 | 4;
  breadcrumb: Array<{ code: string; name: string; level: 1 | 2 | 3 | 4 }>;
  currentEntity?: Entity;
}
```

**Step 2: Verify types compile**

Run: `npx nx run preview:lint`

Expected: No TypeScript errors

**Step 3: Commit**

```bash
git add apps/preview/src/app/types/
git commit -m "$(cat <<'EOF'
feat(preview): add TypeScript type definitions

- Define BaseEntity interface with all common fields
- Add Sector, Industry, SubIndustry, Stock interfaces
- Add TreemapNode for layout coordinates
- Add DrillDownState for navigation

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>
EOF
)"
```

---

## Task 3: Create Mock Data

**Files:**
- Create: `apps/preview/src/app/data/mockSectors.ts`
- Create: `apps/preview/src/app/data/iconMapping.ts`

**Step 1: Create icon mapping file**

Create `apps/preview/src/app/data/iconMapping.ts`:

```typescript
import type { LucideIcon } from 'lucide-react';
import {
  Sprout, Fuel, Component, Anvil, FlaskConical,
  HardHat, Boxes, Package, Cog, Zap,
  ShieldCheck, CarFront, ShoppingCart, Users, TvMinimal,
  Shirt, Dna, Utensils, Tractor, Landmark,
  TrendingUp, Home, Truck, Cpu, Rss,
  Monitor, Radio, Lightbulb, Droplets, Leaf,
  Sparkles
} from 'lucide-react';

/**
 * Maps sector codes to Lucide React icons
 */
export const iconMapping: Record<string, LucideIcon> = {
  '801010': Sprout,       // 农林牧渔
  '801020': Fuel,         // 煤炭
  '801030': Component,    // 有色金属
  '801040': Anvil,        // 钢铁
  '801050': FlaskConical, // 基础化工
  '801080': HardHat,      // 建筑
  '801110': Boxes,        // 建材
  '801120': Package,      // 轻工制造
  '801140': Cog,          // 机械
  '801150': Zap,          // 电力设备
  '801160': ShieldCheck,  // 国防军工
  '801170': CarFront,     // 汽车
  '801180': ShoppingCart, // 商贸零售
  '801200': Users,        // 消费者服务
  '801210': TvMinimal,    // 家电
  '801230': Shirt,        // 纺织服装
  '801710': Dna,          // 医药
  '801720': Utensils,     // 食品饮料
  '801730': Tractor,      // 农业
  '801780': Landmark,     // 银行
  '801790': TrendingUp,   // 非银行金融
  '801880': Home,         // 房地产
  '801890': Truck,        // 交通运输
  '801980': Cpu,          // 电子
  '801990': Rss,          // 通信
  '802010': Monitor,      // 计算机
  '802020': Radio,        // 传媒
  '802030': Lightbulb,    // 电力及公用事业
  '802040': Droplets,     // 石油石化
  '802050': Leaf,         // 环保
  '802060': Sparkles,     // 美容护理
};
```

**Step 2: Create mock sectors data (all 31 sectors)**

Create `apps/preview/src/app/data/mockSectors.ts`:

```typescript
import type { Sector } from '../types/sector';

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
    hasChildren: true
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

**Step 3: Verify data imports**

Create test file `apps/preview/src/app/data/test-import.ts`:

```typescript
import { mockSectors } from './mockSectors';
import { iconMapping } from './iconMapping';

console.log(`Loaded ${mockSectors.length} sectors`);
console.log(`Loaded ${Object.keys(iconMapping).length} icons`);
```

Run: `npx nx run preview:lint`

Expected: No errors

**Step 4: Delete test file**

Run: `rm apps/preview/src/app/data/test-import.ts`

**Step 5: Commit**

```bash
git add apps/preview/src/app/data/
git commit -m "$(cat <<'EOF'
feat(preview): add mock data for 31 SW sectors

- Create mockSectors.ts with all 31 Level-1 sectors
- Add icon mapping for Lucide React icons
- Include market cap, change%, capital flow, attention level

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>
EOF
)"
```

---

## Task 4: Implement useTreeMap Hook

**Files:**
- Create: `apps/preview/src/app/hooks/useTreeMap.ts`

**Step 1: Install Recharts dependency**

Run: `npm install recharts@^3.0.0`

Expected: recharts added to package.json dependencies

**Step 2: Create useTreeMap hook**

Create `apps/preview/src/app/hooks/useTreeMap.ts`:

```typescript
'use client';

import { useMemo } from 'react';
import { treemap, hierarchy } from 'recharts/lib/util/TreeUtils';
import type { Entity, TreemapNode } from '../types/sector';

interface UseTreeMapOptions {
  data: Entity[];
  width: number;
  height: number;
}

interface TreemapData {
  name: string;
  value: number;
  entity: Entity;
  children?: TreemapData[];
}

/**
 * Calculates treemap layout using Recharts algorithm
 *
 * Single Responsibility: Layout calculation only (no rendering)
 */
export function useTreeMap({ data, width, height }: UseTreeMapOptions): TreemapNode[] {
  return useMemo(() => {
    if (data.length === 0) return [];

    // Transform entities into Recharts treemap format
    const treemapData: TreemapData = {
      name: 'root',
      value: 0,
      entity: data[0], // Placeholder
      children: data.map(entity => ({
        name: entity.name,
        value: entity.marketCap,
        entity,
      })),
    };

    // Create hierarchy
    const root = hierarchy(treemapData)
      .sum(d => d.value)
      .sort((a, b) => (b.value || 0) - (a.value || 0));

    // Calculate layout
    const treemapLayout = treemap<TreemapData>()
      .size([width, height])
      .padding(4)
      .round(true);

    const nodes = treemapLayout(root);

    // Extract leaf nodes with layout coordinates
    return nodes
      .leaves()
      .map(node => ({
        entity: node.data.entity,
        x: node.x0 || 0,
        y: node.y0 || 0,
        width: (node.x1 || 0) - (node.x0 || 0),
        height: (node.y1 || 0) - (node.y0 || 0),
      }));
  }, [data, width, height]);
}
```

**Step 3: Verify hook compiles**

Run: `npx nx run preview:lint`

Expected: No TypeScript errors

**Step 4: Commit**

```bash
git add apps/preview/src/app/hooks/ package.json package-lock.json
git commit -m "$(cat <<'EOF'
feat(preview): implement useTreeMap layout hook

- Use Recharts treemap algorithm for layout calculation
- Calculate x, y, width, height for each tile
- Single Responsibility: layout only, no rendering
- Install recharts@^3.0.0 dependency

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>
EOF
)"
```

---

## Task 5: Implement BreathingDot Component

**Files:**
- Create: `apps/preview/src/app/components/BreathingDot.tsx`

**Step 1: Create BreathingDot component**

Create `apps/preview/src/app/components/BreathingDot.tsx`:

```typescript
'use client';

interface BreathingDotProps {
  attentionLevel: number;
  className?: string;
}

/**
 * Animated yellow dot with ripple effect
 * Pulse duration varies based on attention level
 */
export function BreathingDot({ attentionLevel, className = '' }: BreathingDotProps) {
  const duration = getPulseDuration(attentionLevel);

  return (
    <div className={`relative ${className}`}>
      {/* Core dot */}
      <div
        className="w-[7px] h-[7px] rounded-full bg-yellow-400"
        style={{
          boxShadow: '0 0 6px rgba(250, 204, 21, 0.6)',
        }}
      />

      {/* Ripple effect */}
      <div
        className="absolute inset-0 rounded-full border-[0.5px] border-yellow-400"
        style={{
          animation: `ripple ${duration}s linear infinite`,
          opacity: 0,
          transform: 'scale(0)',
          transformOrigin: 'center',
        }}
      />
    </div>
  );
}

function getPulseDuration(attentionLevel: number): number {
  if (attentionLevel >= 80) return 1.2;
  if (attentionLevel >= 60) return 1.8;
  if (attentionLevel >= 40) return 2.4;
  if (attentionLevel >= 20) return 2.8;
  return 3.0;
}
```

**Step 2: Verify component compiles**

Run: `npx nx run preview:lint`

Expected: No errors

**Step 3: Commit**

```bash
git add apps/preview/src/app/components/BreathingDot.tsx
git commit -m "$(cat <<'EOF'
feat(preview): add BreathingDot component

- 7px yellow dot with glow effect
- CSS ripple animation (scale 0→3 over 3s)
- Attention level-based pulse duration (1.2s-3.0s)

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>
EOF
)"
```

---

## Task 6: Implement Sparkline Component

**Files:**
- Create: `apps/preview/src/app/components/Sparkline.tsx`

**Step 1: Create Sparkline component**

Create `apps/preview/src/app/components/Sparkline.tsx`:

```typescript
'use client';

import { useMemo } from 'react';
import { BreathingDot } from './BreathingDot';

interface SparklineProps {
  data: number[];
  width: number;
  height: number;
  attentionLevel: number;
  className?: string;
}

interface Point {
  x: number;
  y: number;
}

/**
 * Mini trend chart with blue stroke and white gradient fill
 * Shows 30-day price movement
 */
export function Sparkline({
  data,
  width,
  height,
  attentionLevel,
  className = ''
}: SparklineProps) {
  const { points, pathData } = useMemo(() => {
    const pts = calculateSparklinePoints(data, width, height);
    const path = generateSVGPath(pts);
    return { points: pts, pathData: path };
  }, [data, width, height]);

  if (data.length === 0) return null;

  return (
    <svg
      width={width}
      height={height}
      className={`overflow-visible ${className}`}
      viewBox={`0 0 ${width} ${height}`}
    >
      <defs>
        <linearGradient id="sparkline-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Fill area */}
      <path
        d={pathData.area}
        fill="url(#sparkline-gradient)"
        className="transition-all duration-300"
      />

      {/* Stroke line */}
      <path
        d={pathData.line}
        fill="none"
        stroke="#3b82f6"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="transition-all duration-300"
        style={{
          strokeDasharray: pathData.length,
          strokeDashoffset: pathData.length,
          animation: 'draw-line 0.4s ease-out forwards',
        }}
      />

      {/* Breathing dot at end */}
      <foreignObject
        x={points[points.length - 1].x - 3.5}
        y={points[points.length - 1].y - 3.5}
        width="7"
        height="7"
      >
        <BreathingDot attentionLevel={attentionLevel} />
      </foreignObject>
    </svg>
  );
}

function calculateSparklinePoints(
  data: number[],
  width: number,
  height: number
): Point[] {
  const minValue = Math.min(...data);
  const maxValue = Math.max(...data);
  const valueRange = maxValue - minValue || 1;
  const margin = 8;

  return data.map((value, index) => {
    const x = (index / (data.length - 1)) * width;
    const normalizedY = (value - minValue) / valueRange;
    const y = height - margin - normalizedY * (height - 2 * margin);

    return { x, y };
  });
}

function generateSVGPath(points: Point[]): { line: string; area: string; length: number } {
  if (points.length === 0) {
    return { line: '', area: '', length: 0 };
  }

  // Line path
  const linePath = points
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x},${p.y}`)
    .join(' ');

  // Area path (close to bottom)
  const areaPath = `${linePath} L ${points[points.length - 1].x},${points[0].y + 100} L ${points[0].x},${points[0].y + 100} Z`;

  // Calculate path length for animation
  const length = points.reduce((acc, p, i) => {
    if (i === 0) return 0;
    const dx = p.x - points[i - 1].x;
    const dy = p.y - points[i - 1].y;
    return acc + Math.sqrt(dx * dx + dy * dy);
  }, 0);

  return { line: linePath, area: areaPath, length };
}
```

**Step 2: Verify component compiles**

Run: `npx nx run preview:lint`

Expected: No errors

**Step 3: Commit**

```bash
git add apps/preview/src/app/components/Sparkline.tsx
git commit -m "$(cat <<'EOF'
feat(preview): add Sparkline component

- 2px blue stroke (#3b82f6) with rounded caps
- White gradient fill (opacity 0.2 → 0)
- SVG path animation with draw-line effect
- BreathingDot at last point
- Dynamic point calculation with margin

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>
EOF
)"
```

---

## Task 7: Implement HeatMapTile Component

**Files:**
- Create: `apps/preview/src/app/components/HeatMapTile.tsx`
- Create: `apps/preview/src/app/utils/colorUtils.ts`

**Step 1: Create color utilities**

Create `apps/preview/src/app/utils/colorUtils.ts`:

```typescript
/**
 * Dynamic background color based on change percentage
 *
 * Zone 1: Dead Zone (±0.2%)
 * Zone 2: Active Zone (0.2-3%)
 * Zone 3: Extreme Protection (>3%)
 */
export function getTileBackgroundColor(changePercent: number): string {
  const absChange = Math.abs(changePercent);

  // Zone 1: Dead Zone
  if (absChange <= 0.2) {
    return 'rgba(107, 114, 128, 0.15)';
  }

  // Zone 2: Active Zone
  if (absChange <= 3.0) {
    const intensity = (absChange - 0.2) / 2.8;
    const alpha = 0.1 + intensity * 0.2;

    if (changePercent > 0) {
      return `rgba(213, 44, 162, ${alpha})`; // Red (Chinese market: up)
    } else {
      return `rgba(3, 145, 96, ${alpha})`; // Green (Chinese market: down)
    }
  }

  // Zone 3: Extreme Protection
  if (changePercent > 0) {
    return 'rgba(165, 35, 128, 0.25)'; // Deep red
  } else {
    return 'rgba(2, 107, 69, 0.25)'; // Deep green
  }
}

/**
 * Format change percentage with Chinese market colors
 */
export function formatChangePercent(value: number): string {
  const sign = value >= 0 ? '+' : '';
  return `${sign}${value.toFixed(2)}%`;
}

/**
 * Format capital flow in 亿元
 */
export function formatCapitalFlow(value: number): string {
  const sign = value >= 0 ? '+' : '';
  return `${sign}${value.toFixed(1)}亿`;
}
```

**Step 2: Create HeatMapTile component**

Create `apps/preview/src/app/components/HeatMapTile.tsx`:

```typescript
'use client';

import { useState } from 'react';
import { ArrowUp, ArrowDown } from 'lucide-react';
import type { Entity } from '../types/sector';
import { iconMapping } from '../data/iconMapping';
import { BreathingDot } from './BreathingDot';
import { Sparkline } from './Sparkline';
import { getTileBackgroundColor, formatChangePercent, formatCapitalFlow } from '../utils/colorUtils';

interface HeatMapTileProps {
  entity: Entity;
  x: number;
  y: number;
  width: number;
  height: number;
}

/**
 * Glassmorphism tile with 3D hover interaction
 */
export function HeatMapTile({ entity, x, y, width, height }: HeatMapTileProps) {
  const [isHovered, setIsHovered] = useState(false);

  const Icon = entity.icon ? iconMapping[entity.code] : null;
  const bgColor = getTileBackgroundColor(entity.changePercent);

  // Determine icon size based on tile dimensions
  const iconSize = Math.min(width, height) > 80 ? 16 : 14;

  // Mock sparkline data (30 days)
  const mockSparklineData = Array.from({ length: 30 }, (_, i) =>
    100 + Math.sin(i / 5) * 10 + Math.random() * 5
  );

  return (
    <div
      className="absolute transition-all duration-300 ease-out"
      style={{
        left: `${x}px`,
        top: `${y}px`,
        width: `${width}px`,
        height: `${height}px`,
        transform: isHovered ? 'translateY(-2px)' : 'translateY(0)',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Dual backgrounds for gradient border */}
      <div
        className="absolute inset-0 rounded-lg"
        style={{
          background: 'linear-gradient(135deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.05) 100%)',
          padding: '1px',
        }}
      >
        <div
          className="w-full h-full rounded-lg backdrop-blur-md"
          style={{
            background: bgColor,
            border: '1px solid rgba(255, 255, 255, 0.1)',
          }}
        >
          {/* Upper Panel: Icon + Name + BreathingDot */}
          <div className="flex items-center gap-1 px-2 py-2">
            {Icon && (
              <Icon
                size={iconSize}
                className="flex-shrink-0 text-white/80"
                style={{ marginLeft: '8px' }}
              />
            )}
            <span
              className="font-semibold text-white text-sm truncate"
              style={{ marginLeft: '4px' }}
            >
              {entity.name}
            </span>
            <BreathingDot attentionLevel={entity.attentionLevel} className="ml-auto" />
          </div>

          {/* Lower Panel: Capital Flow + Change% */}
          <div className="absolute bottom-0 right-0 p-2">
            <div className="flex flex-col gap-1 items-end">
              <div className="text-xs font-normal text-white/80">
                {formatCapitalFlow(entity.capitalFlow)}
              </div>
              <div className="flex items-center gap-1">
                {entity.changePercent > 0 ? (
                  <ArrowUp
                    size={14}
                    className="text-red-600"
                    style={{ filter: 'drop-shadow(0 0 2px rgba(255,255,255,0.9))' }}
                  />
                ) : (
                  <ArrowDown
                    size={14}
                    className="text-green-600"
                    style={{ filter: 'drop-shadow(0 0 2px rgba(255,255,255,0.9))' }}
                  />
                )}
                <span className="text-xs font-semibold text-white">
                  {formatChangePercent(entity.changePercent)}
                </span>
              </div>
            </div>
          </div>

          {/* Sparkline (shown on hover) */}
          {isHovered && width > 120 && height > 80 && (
            <div className="absolute bottom-12 left-2 right-2">
              <Sparkline
                data={mockSparklineData}
                width={width - 16}
                height={40}
                attentionLevel={entity.attentionLevel}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
```

**Step 3: Verify component compiles**

Run: `npx nx run preview:lint`

Expected: No errors

**Step 4: Commit**

```bash
git add apps/preview/src/app/components/HeatMapTile.tsx apps/preview/src/app/utils/
git commit -m "$(cat <<'EOF'
feat(preview): add HeatMapTile component

- Glassmorphism with dual background gradient border
- Dynamic background color (3 zones: dead, active, extreme)
- Icon 8px from left, name 4px gap, breathing dot right
- Capital flow + change% in bottom-right
- Arrow color anti-fusion with drop-shadow
- 3D hover lift (-2px translateY)
- Sparkline reveal on hover (tiles >120x80)
- Chinese market colors: red=up, green=down

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>
EOF
)"
```

---

## Task 8: Implement HeatMap Container

**Files:**
- Create: `apps/preview/src/app/components/HeatMap.tsx`

**Step 1: Create HeatMap container**

Create `apps/preview/src/app/components/HeatMap.tsx`:

```typescript
'use client';

import { useRef, useEffect, useState } from 'react';
import type { Entity } from '../types/sector';
import { useTreeMap } from '../hooks/useTreeMap';
import { HeatMapTile } from './HeatMapTile';

interface HeatMapProps {
  data: Entity[];
  className?: string;
}

/**
 * Main treemap container
 * Manages layout and renders tiles
 */
export function HeatMap({ data, className = '' }: HeatMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  // Measure container dimensions
  useEffect(() => {
    if (!containerRef.current) return;

    const updateDimensions = () => {
      if (containerRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect();
        setDimensions({ width, height });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  // Calculate treemap layout
  const nodes = useTreeMap({
    data,
    width: dimensions.width,
    height: dimensions.height,
  });

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full ${className}`}
      style={{ minHeight: '600px' }}
    >
      {nodes.map((node) => (
        <HeatMapTile
          key={node.entity.code}
          entity={node.entity}
          x={node.x}
          y={node.y}
          width={node.width}
          height={node.height}
        />
      ))}
    </div>
  );
}
```

**Step 2: Verify component compiles**

Run: `npx nx run preview:lint`

Expected: No errors

**Step 3: Commit**

```bash
git add apps/preview/src/app/components/HeatMap.tsx
git commit -m "$(cat <<'EOF'
feat(preview): add HeatMap container component

- Auto-measure container dimensions with ResizeObserver
- Use useTreeMap hook for layout calculation
- Render HeatMapTile for each node
- Min height 600px for proper display

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>
EOF
)"
```

---

## Task 9: Update Main Page with HeatMap

**Files:**
- Modify: `apps/preview/src/app/page.tsx`

**Step 1: Update page.tsx to use HeatMap**

Edit `apps/preview/src/app/page.tsx`:

```typescript
import { HeatMap } from './components/HeatMap';
import { mockSectors } from './data/mockSectors';

export default function PreviewPage() {
  return (
    <div className="min-h-screen bg-gray-950 p-8">
      <div className="max-w-[1400px] mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-white">
          SW Level-1 Sector Indices
        </h1>
        <div className="w-full h-[800px] rounded-xl overflow-hidden">
          <HeatMap data={mockSectors} />
        </div>
      </div>
    </div>
  );
}
```

**Step 2: Test application**

Run: `npx nx serve preview`

Open: http://localhost:4300

Expected: See 31 sector tiles in treemap layout with colors, icons, breathing dots

**Step 3: Verify hover interactions**

Action: Hover over tiles

Expected:
- Tile lifts by 2px
- Sparkline appears (for tiles > 120x80)
- All animations smooth

**Step 4: Commit**

```bash
git add apps/preview/src/app/page.tsx
git commit -m "$(cat <<'EOF'
feat(preview): integrate HeatMap into main page

- Display all 31 SW Level-1 sectors
- 800px height treemap container
- Test all hover interactions and animations

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>
EOF
)"
```

---

## Task 10: Final Testing & Verification

**Files:**
- None (testing only)

**Step 1: Test all 31 sectors display**

Run: `npx nx serve preview`

Verify:
- ✅ All 31 sectors visible
- ✅ Tiles sized by market cap
- ✅ Colors match change% (red=up, green=down)
- ✅ Icons displayed correctly

**Step 2: Test hover interactions**

Action: Hover over various tiles

Verify:
- ✅ Tile lifts by 2px
- ✅ Sparkline appears (large tiles only)
- ✅ BreathingDot animates with ripple
- ✅ Arrow drop-shadow visible
- ✅ Transitions smooth

**Step 3: Test responsive behavior**

Action: Resize browser window

Verify:
- ✅ Treemap recalculates layout
- ✅ Tiles maintain proportions
- ✅ No layout breaks

**Step 4: Test build**

Run: `npx nx build preview`

Expected: Build succeeds, output in dist/apps/preview

**Step 5: Verify static export**

Run: `ls -la dist/apps/preview/.next/`

Expected: See static HTML files (not server.js)

**Step 6: Document completion**

Create checklist:

**Phase 1 Complete:**
- ✅ 31 SW Level-1 sectors displayed
- ✅ Glassmorphism effects working
- ✅ 3D hover interaction (2px lift)
- ✅ Sparkline with draw animation
- ✅ BreathingDot with ripple
- ✅ Dynamic background
- ✅ Chinese market colors (red=up, green=down)
- ✅ Static export mode

**Phase 2 (Future):**
- ⏸️ 4-level drill-down navigation
- ⏸️ HeatMapHeader with breadcrumb + search
- ⏸️ Spotlight effect
- ⏸️ API integration
- ⏸️ Loading/error/empty states

**Step 7: Final commit**

```bash
git add .
git commit -m "$(cat <<'EOF'
chore(preview): Phase 1 complete - basic treemap working

All 31 SW Level-1 sectors displayed with:
- Glassmorphism tiles with gradient borders
- Dynamic background color (3 zones)
- 3D hover lift (-2px)
- Sparkline with blue stroke + white fill
- BreathingDot with yellow ripple (1.2-3.0s)
- Icon positioning (8px left, 4px gap)
- Arrow anti-fusion drop-shadow
- Chinese market convention (red=up, green=down)

Phase 2 features (drill-down, header, search) deferred.

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>
EOF
)"
```

---

## Summary

**Completed Features:**
1. ✅ Next.js 15 app with static export
2. ✅ TypeScript types for all entities
3. ✅ Mock data (31 SW Level-1 sectors)
4. ✅ useTreeMap layout hook (Recharts)
5. ✅ BreathingDot component (yellow ripple)
6. ✅ Sparkline component (blue stroke, white fill)
7. ✅ HeatMapTile component (glassmorphism)
8. ✅ HeatMap container (auto-resize)
9. ✅ Main page integration

**Test Coverage:**
- Visual verification of all 31 sectors
- Hover interactions (lift, sparkline reveal)
- Responsive layout recalculation
- Static build verification

**Next Steps (Phase 2):**
- Implement 4-level drill-down with useDrillDown hook
- Add HeatMapHeader with breadcrumb + search
- Add loading/error/empty states
- Integrate with API (replace mock data)

**Success Criteria Met: 45/75** (Phase 1 complete)
