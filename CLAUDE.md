# Vibe Trading - Claude Code Guidelines

## Tech Stack

- **Frontend**: React 19, Next.js 15 (static export, `output: 'export'`), TypeScript
- **Styling**: Tailwind CSS v4 (OKLCH, `@theme` CSS directives, no tailwind.config.js)
- **UI**: Radix UI + CVA + `cn()` from `@/lib/utils`
- **Charts**: ngx-charts (D3 + Framer Motion), xycharts (visx), Recharts (legacy)
- **State**: Zustand | **Validation**: Zod | **Animation**: Framer Motion | **Icons**: Lucide
- **Testing**: Vitest + React Testing Library (单测), Playwright (E2E), pytest (Python)
- **Monorepo**: Nx 22.3 | **Backend** (未激活): FastAPI + Kafka + Redis — 规范见 `guidelines/`

## Architecture

```
apps/web/src/
├── app/                  # Next.js App Router — (auth)/, (main)/
├── components/
│   ├── ui/              # L1: shadcn primitives (Radix + CVA)
│   ├── layout/          # L2: sidebar, nav, ticker
│   ├── animation/       # L2: AnimateIn, AnimateHeavy
│   └── shared/          # L2: detail-panel 等跨 feature 组件
├── features/            # L3: feature modules (market, factor, library, lab, journal...)
├── lib/                 # L0: library-grade 代码
│   ├── ngx-charts/      # D3 chart library (13 chart types)
│   ├── xycharts/        # visx chart components
│   ├── data-table/      # TanStack Table wrapper
│   └── utils.ts, format.ts, id.ts
└── hooks/               # Global hooks
```

**Layer rules**: L0 不依赖 L1/L2/L3 → L1 不依赖 L2/L3 → L2 可依赖 L0+L1 → L3 可依赖所有

## Key Rules (删除任一条 Claude 会犯错)

### Imports & Exports

- `@/` for cross-feature imports; relative `./` `../` only within same feature
- Named exports everywhere; `default export` only for `page.tsx` / `layout.tsx`
- Import order: external libs → internal modules → local → types

### Next.js Static Export

- `"use client"` for all interactive components (hooks, events, browser APIs)
- No SSR, no API routes, no middleware, no ISR — static export 模式
- `images: { unoptimized: true }` required

### Components

- Every component: `data-slot` attribute + accept `className` via `cn()` + spread `...props`
- Cards: `bg-white shadow-sm border border-mine-border rounded-xl` — 不用 glassmorphism
- Glassmorphism (`backdrop-blur`) ONLY for: left sidebar, top nav pills, ticker
- Numbers: `font-mono tabular-nums` + market color coding (红涨绿跌)
- All clickable elements must have hover state

### Theme (Mine)

- Light theme on warm beige (`mine-page-bg`). `dark` class in HTML but visual is light
- Use semantic tokens (`mine-text`, `mine-muted`, `mine-border`) not hex values
- Market colors: red=up (`market-up-medium`), green=down (`market-down-medium`) — A股惯例
- Detail panels: must use `@/components/shared/detail-panel` primitives
- Full design spec: `.claude/rules/component-design-system.md`

### 颜色纪律（强制）

**禁止裸 hex**（`#2EBD85`、`text-[#CF304A]`、`bg-[#f5f3ef]`）。所有颜色必须用语义色 token 或 Tailwind 色板：

1. 先查 `globals.css` 的 `@theme` 块是否有对应 token → 有则用（`text-mine-muted`、`bg-market-up-medium`）
2. 没有 → 在 `globals.css` `@theme` 中新增语义 token，再引用
3. Tailwind 内置色板（`bg-zinc-900`、`text-white/80`、`border-white/10`）可直接用
4. 唯一例外：ANSI 色表、D3 绑定等需要 JS 原始值的标准映射

### ngx-charts

- Architecture: `BaseChart` → render fn `({width, height})` → inner `Content` component
- Hook: `useXChart(config)` → `{dims, xScale, yScale, transform, updateXAxisHeight, updateYAxisWidth}`
- `motion.path` must include `d` in ALL variants (initial, animate, exit)
- Data: feature hooks transform raw data → chart-ready props. Keep transforms in feature layer

### Testing

- 新功能和 bugfix 优先写测试（`*.test.ts`/`*.test.tsx`），使用 Vitest + React Testing Library
- 运行测试：`npx nx run web:test`
- E2E 测试在 `apps/web/e2e/`（Playwright Python）

### Blueprint (Doc Mode)

- MineCard MUST have height constraints (`max-h-[420px]`); cards scroll, not stretch
- Spec: `.claude/rules/blueprint-layout-design.md`

## Dev Commands

```bash
npx nx run web:serve --port=4200    # Dev server
npx nx run web:test                 # Unit tests (Vitest)
npx nx run web:lint                 # Lint
```

### Production Build (IMPORTANT)

**ALWAYS** use `NEXT_BUILD_DIR=.next-prod` to avoid lock contention with the dev server:

```bash
# ✅ Correct — uses .next-prod, won't conflict with dev server
cd apps/web && NEXT_BUILD_DIR=.next-prod npx next build

# ✅ Also correct — Nx target with env already set
npx nx run web:build:production

# ❌ NEVER do this — will lock-contend with dev server on .next/
npx next build
```

## Quantitative Domain

Authority source: `quant-domain/` — 因子生命周期、构建/评价/预处理、回测方法论、市场微观结构

## Compaction Directives

When compressing context, ALWAYS preserve:

1. Current task status and what's been completed
2. List of files modified in this session
3. Key technical decisions made
4. doc-first session tracking state (if active)
