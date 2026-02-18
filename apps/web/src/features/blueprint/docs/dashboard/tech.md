---
title: 技术栈
subtitle: Frontend · Backend · Monorepo 结构
icon: Code2
layout: rows
cards:
  - id: frontend
    title: Frontend
    subtitle: apps/web (Next.js) · React 19 · Tailwind CSS 4 · ngx-charts
    render: markdown
    flex: 50
    row: 1
    badge: { icon: Monitor, label: Web, color: teal }
    expandTitle: Frontend 技术栈 — 详细说明
    expandSubtitle: 框架选型理由 + 组件库 + 图表方案
  - id: backend
    title: Backend
    subtitle: apps/api + Python services · Express · FastAPI · Docker
    render: markdown
    flex: 50
    row: 1
    badge: { icon: Server, label: API, color: purple }
    expandTitle: Backend 技术栈 — 详细说明
    expandSubtitle: 服务架构 + 存储方案 + 基础设施
  - id: monorepo
    title: Monorepo 结构
    subtitle: Nx Workspace · 9 个项目目录
    render: markdown
    flex: 100
    row: 2
    badge: { icon: Layers, label: Nx, color: blue }
    expandTitle: Monorepo 结构 — 完整目录说明
    expandSubtitle: 各项目职责 + 依赖关系 + 构建配置
rows:
  - height: auto
  - height: auto
links:
  - from: apps/web
    to: Market/Sector
    desc: Next.js 前端入口
  - from: apps/api
    to: Trading/Orders
    desc: Express API 网关
  - from: Python Services
    to: Factor/Lab
    desc: 计算引擎支撑
footer: >-
  Frontend: React 19 + Next.js 15 + Tailwind CSS 4 ·
  Backend: Express + FastAPI + Redis · Infra: Nx + Docker Compose
---

<!-- card: frontend -->

## Framework
- React 19
- Next.js 15 (App Router)
- TypeScript

## Styling
- Tailwind CSS 4
- Shadcn/UI
- tw-animate-css

## Charts
- ngx-charts (custom React port)
- D3.js
- Recharts

## Architecture
- Nx Monorepo
- Feature-based modules
- Lucide Icons

<!-- card: frontend:expand -->

## 前端技术选型理由

**React 19 + Next.js 15**: App Router 模式, 支持 Server Components + Static Export, 适合量化面板的大量静态 + 少量实时场景

**Tailwind CSS 4**: OKLCH 色彩空间, 原子化 CSS, 与 Mine 主题系统深度集成

**ngx-charts**: 从 Angular ngx-charts 移植的 React 版本, 基于 D3.js + Framer Motion 动画, 支持 BandChart/PolarCalendar/LineRace 等自定义图表

**Shadcn/UI**: Radix UI 原语 + Tailwind 样式, 18 个基础组件 (Button, Dialog, Select 等)

<!-- card: backend -->

## API Layer
- Express.js (TypeScript)
- FastAPI (Python)
- REST + WebSocket

## Data Processing
- Pandas / NumPy
- AKShare / BaoStock
- Backtrader

## Storage
- SQLite (MVP)
- PostgreSQL (Prod)
- Redis (Cache)

## Infrastructure
- Docker Compose
- Nginx
- Celery + Redis

<!-- card: backend:expand -->

## 后端架构说明

**双语言策略**: TypeScript (Express) 做 API 网关 + 路由层, Python (FastAPI) 做计算密集型服务. Kafka 连接两层.

**存储分层**:
- SQLite: MVP 阶段快速迭代, 单文件部署
- PostgreSQL: 生产环境, 支持并发和复杂查询
- Redis: 热数据缓存 (实时行情/因子最新值), Celery 任务队列

**Backtrader**: Python 回测引擎, 支持自定义策略和多时间维度

<!-- card: monorepo -->

## 项目目录

| 目录 | 说明 |
|---|---|
| `apps/web` | Next.js 前端应用 |
| `apps/api` | Express API 网关 |
| `apps/market-data` | 行情数据服务 (Python) |
| `apps/analytics` | 分析计算服务 (Python) |
| `apps/ml-models` | ML 模型服务 (Python) |
| `apps/trading-engine` | 交易引擎 (Python) |
| `apps/wiki` | 文档站 (Fumadocs) |
| `libs/shared-types` | TypeScript 类型定义 |
| `libs/shared-python` | Python 公共库 |

<!-- card: monorepo:expand -->

## 项目依赖关系

```
apps/web → libs/shared-types → apps/api
apps/api → Kafka → apps/market-data
                  → apps/analytics
                  → apps/ml-models
                  → apps/trading-engine
All Python apps → libs/shared-python
```

## Nx 构建配置

- `npx nx run web:build` — 前端静态构建
- `npx nx run api:serve` — API 网关启动
- `npx nx run trading-engine:serve` — Python 服务启动
- `npx nx graph` — 查看项目依赖图
