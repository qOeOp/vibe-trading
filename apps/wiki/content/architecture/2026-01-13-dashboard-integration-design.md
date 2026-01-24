# Dashboard Integration Design

**Date:** 2026-01-13
**Project:** Vibe Trading Web Application
**Objective:** 整合 dashboard-2 模板到现有项目，实现清晰的 Feature-based 架构

---

## 1. 整体架构

### 项目结构

```
web/src/
├── app/                    # 应用入口与路由配置
│   └── app.tsx            # 主路由定义
├── features/              # 功能模块（Feature-based 架构）
│   ├── auth/              # 认证功能
│   │   ├── components/    # 认证相关组件
│   │   │   ├── auth-page.tsx
│   │   │   ├── floating-paths.tsx
│   │   │   └── logo.tsx
│   │   └── index.ts       # 导出接口
│   └── dashboard/         # Dashboard 功能
│       ├── pages/         # 页面级组件
│       │   ├── overview-page.tsx
│       │   └── deals-page.tsx
│       ├── components/    # 业务组件
│       │   ├── dashboard-layout.tsx
│       │   ├── dashboard-sidebar.tsx
│       │   ├── dashboard-header.tsx
│       │   ├── stats-cards.tsx
│       │   ├── deals-table.tsx
│       │   ├── welcome-section.tsx
│       │   ├── theme-toggle.tsx
│       │   └── charts/    # 图表组件
│       │       ├── lead-sources-chart.tsx
│       │       └── revenue-flow-chart.tsx
│       ├── data/          # 数据层（Mock Data）
│       │   ├── deals.ts
│       │   └── stats.ts
│       ├── store/         # 状态管理
│       │   └── dashboard-store.ts
│       ├── hooks/         # 自定义 Hooks
│       │   └── use-mobile.ts
│       ├── types/         # TypeScript 类型定义
│       │   └── index.ts
│       └── index.ts       # 导出接口
├── components/            # 共享 UI 组件库
│   └── ui/
│       ├── auth/          # Auth 页面使用的 UI 组件
│       │   ├── button.tsx
│       │   ├── input.tsx
│       │   ├── input-group.tsx
│       │   └── textarea.tsx
│       └── dashboard/     # Dashboard 使用的 UI 组件
│           ├── avatar.tsx
│           ├── badge.tsx
│           ├── card.tsx
│           ├── table.tsx
│           ├── chart.tsx
│           ├── sidebar.tsx
│           └── ... (其他 shadcn/ui 组件)
├── lib/                   # 工具函数
│   └── utils.ts
├── styles.css             # 全局样式（主样式文件）
└── main.tsx               # 应用入口
```

### 路由架构

```
/ → AuthPage
/app → DashboardLayout (共享布局：sidebar + header)
  ├── /app/dashboard/overview → OverviewPage
  ├── /app/dashboard/deals → DealsPage
  └── /app/dashboard/analytics → AnalyticsPage (未来)
```

**导航流程**：
- AuthPage 的 "Home" 按钮 href 从 `#` 改为 `/app/dashboard/overview`
- 使用 React Router Link 组件

---

## 2. 依赖管理与样式处理

### 需要安装的依赖

```json
{
  "dependencies": {
    "recharts": "^2.15.4",
    "zustand": "^5.0.2",
    "@tanstack/react-table": "^8.21.3",
    "next-themes": "^0.4.4",
    "@radix-ui/react-avatar": "^1.1.11",
    "@radix-ui/react-checkbox": "^1.3.3",
    "@radix-ui/react-collapsible": "^1.1.12",
    "@radix-ui/react-dropdown-menu": "^2.1.16",
    "@radix-ui/react-select": "^2.2.6",
    "@radix-ui/react-separator": "^1.1.8",
    "@radix-ui/react-tooltip": "^1.2.8",
    "class-variance-authority": "^0.7.1"
  }
}
```

**跳过的依赖**：
- `vaul` - drawer 组件（如果不需要）

### 样式处理策略

1. **全局样式**：保持 `web/src/styles.css` 作为主样式文件
   - 不引入 dashboard-2 的 globals.css
   - Dashboard 组件使用 Tailwind classes

2. **CSS 变量补充**：
   - 从 dashboard-2 的 `globals.css` 提取必要的 CSS 变量
   - 添加到 `styles.css` 末尾（不覆盖现有变量）
   - 重点：`--sidebar`, `--sidebar-foreground` 等 dashboard 特有变量

3. **主题兼容性**：
   - 使用 `next-themes` 管理主题（兼容非 Next.js 项目）
   - 默认暗色主题
   - 用户可在 dashboard header 切换 Dark/Light/System

4. **资源处理**：
   - Favicon：保留现有的
   - 图片：只迁移 dashboard 必需的图片

---

## 3. 组件迁移与改造

### UI 组件迁移（components/ui/dashboard/）

**直接复制**（无需修改或轻微修改）：
- avatar.tsx
- badge.tsx
- card.tsx
- separator.tsx
- skeleton.tsx
- tooltip.tsx
- checkbox.tsx
- collapsible.tsx

**需要调整导入路径**：
- table.tsx - 更新 `@/lib/utils` 导入
- chart.tsx - recharts 封装
- sidebar.tsx - 复杂组件
- select.tsx, dropdown-menu.tsx, sheet.tsx

**需要合并的组件**：
- button.tsx - 保留 auth/button.tsx，dashboard 共用
- input.tsx - 同上

### Feature 组件改造

1. **dashboard-layout.tsx**（新建）：
   - 包装 sidebar 和主内容区域
   - 使用 React Router 的 `<Outlet />` 渲染子路由
   - 提供 SidebarProvider context

2. **dashboard-sidebar.tsx**：
   - 移除 Next.js Link，改用 React Router `NavLink`
   - 菜单项链接更新为完整路径
   - 添加 test-id

3. **dashboard-header.tsx**：
   - 移除 Next.js 依赖
   - 集成 ThemeToggle
   - 添加 test-id

4. **图表组件**（charts/）：
   - lead-sources-chart.tsx - 无需修改
   - revenue-flow-chart.tsx - 无需修改
   - 添加 test-id

5. **其他组件**：
   - stats-cards.tsx - 添加 test-id
   - deals-table.tsx - 添加 test-id
   - welcome-section.tsx - 添加 test-id

6. **主题组件**：
   - theme-toggle.tsx - 零修改，直接复制

---

## 4. 路由配置与页面实现

### 路由配置（app/app.tsx）

```tsx
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthPage } from '@/features/auth';
import { DashboardLayout } from '@/features/dashboard/components/dashboard-layout';
import { OverviewPage, DealsPage } from '@/features/dashboard';

function App() {
  return (
    <Routes>
      <Route path="/" element={<AuthPage />} />

      <Route path="/app" element={<DashboardLayout />}>
        <Route index element={<Navigate to="/app/dashboard/overview" replace />} />

        <Route path="dashboard">
          <Route path="overview" element={<OverviewPage />} />
          <Route path="deals" element={<DealsPage />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
```

### 页面组件

1. **OverviewPage**：
   - 包含：WelcomeSection, StatsCards, Charts
   - 导入 mock data
   - 添加 `data-testid="page-overview"`

2. **DealsPage**：
   - 包含：DealsTable
   - 导入 mock data
   - 添加 `data-testid="page-deals"`

3. **AuthPage 更新**：
   ```tsx
   <Button asChild data-testid="auth-home-link">
     <Link to="/app/dashboard/overview">
       <ChevronLeftIcon />
       Home
     </Link>
   </Button>
   ```

---

## 5. Test ID 策略

### 命名规范

BEM 风格：`{feature}-{component}-{element}-{descriptor}`

### 覆盖范围

**交互元素**：
- 按钮：`data-testid="auth-login-button-google"`
- 链接：`data-testid="auth-home-link"`
- 输入框：`data-testid="auth-email-input"`

**导航元素**：
- 侧边栏：`data-testid="dashboard-sidebar-nav-overview"`

**数据展示**：
- 统计卡片：`data-testid="dashboard-stats-card-revenue"`
- 表格：`data-testid="dashboard-deals-table"`
- 表格行：`data-testid="dashboard-deals-row-{id}"`
- 图表：`data-testid="dashboard-chart-lead-sources"`

**容器元素**：
- 页面：`data-testid="page-overview"`

---

## 6. 状态管理与数据流

### Zustand Store

```typescript
// features/dashboard/store/dashboard-store.ts
interface DashboardState {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  dateRange: { from: Date; to: Date };
  setDateRange: (range: { from: Date; to: Date }) => void;
  selectedDeals: string[];
  toggleDealSelection: (dealId: string) => void;
  clearSelection: () => void;
}
```

### Mock Data 组织

```
features/dashboard/data/
├── deals.ts      # Deal 接口和 mockDeals 数组
└── stats.ts      # Stats 接口和 mockStats 对象
```

### 数据流向

```
Mock Data (data/)
    ↓
Dashboard Pages (pages/)
    ↓
Components (components/)
    ↓
UI Components (components/ui/dashboard/)
    ↓
User Interaction
    ↓
Zustand Store (store/)
    ↓
Re-render Components
```

### API 集成预留

```typescript
// 现在
import { mockDeals } from '@/features/dashboard/data/deals';
const deals = mockDeals;

// 未来
import { useDealsQuery } from '@/features/dashboard/hooks/use-deals-query';
const { data: deals } = useDealsQuery();
```

---

## 7. 主题处理与工具函数

### 主题管理

使用 `next-themes` 包（兼容非 Next.js 项目）：

```tsx
// main.tsx
import { ThemeProvider } from 'next-themes';

root.render(
  <StrictMode>
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ThemeProvider>
  </StrictMode>
);
```

**配置**：
- 默认：暗色主题
- 支持：Dark / Light / System
- 持久化：localStorage
- 切换位置：Dashboard Header

### 工具函数

合并 `lib/utils.ts`：
- 保留现有的 `cn` 函数
- 添加 dashboard-2 的其他工具函数（如有）

### Hooks

```
dashboard-2/hooks/use-mobile.ts
  → features/dashboard/hooks/use-mobile.ts
```

---

## 8. TypeScript 类型定义

### 类型组织

```typescript
// features/dashboard/types/index.ts

export interface Deal {
  id: string;
  company: string;
  contact: string;
  amount: number;
  stage: 'prospect' | 'qualified' | 'proposal' | 'negotiation' | 'closed-won' | 'closed-lost';
  probability: number;
  closeDate: Date;
  source: string;
  assignedTo: string;
}

export interface DashboardStats {
  totalRevenue: number;
  revenueChange: number;
  activeDeals: number;
  dealsChange: number;
  conversionRate: number;
  conversionChange: number;
  avgDealSize: number;
  avgDealChange: number;
}

export interface LeadSourceData {
  source: string;
  value: number;
  fill: string;
}

export interface RevenueFlowData {
  month: string;
  revenue: number;
  deals: number;
}

export interface NavItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string | number;
  disabled?: boolean;
}
```

### 组件 Props 类型

```typescript
export interface StatsCardsProps {
  stats: DashboardStats;
  loading?: boolean;
  'data-testid'?: string;
}

export interface DealsTableProps {
  deals: Deal[];
  onRowClick?: (deal: Deal) => void;
  onSelectionChange?: (selectedIds: string[]) => void;
  'data-testid'?: string;
}
```

---

## 9. 构建配置与性能优化

### 配置调整

1. **tsconfig.json** - 路径别名：
   ```json
   {
     "compilerOptions": {
       "baseUrl": ".",
       "paths": {
         "@/*": ["src/*"]
       }
     }
   }
   ```

2. **Tailwind 配置**：
   ```js
   content: [
     './src/**/*.{ts,tsx}',
     './src/features/**/*.{ts,tsx}',
   ]
   ```

### 代码分割

**路由级懒加载**：
```tsx
const AuthPage = lazy(() => import('@/features/auth').then(m => ({ default: m.AuthPage })));
const DashboardLayout = lazy(() => import('@/features/dashboard/components/dashboard-layout'));
const OverviewPage = lazy(() => import('@/features/dashboard').then(m => ({ default: m.OverviewPage })));
const DealsPage = lazy(() => import('@/features/dashboard').then(m => ({ default: m.DealsPage })));
```

### 性能优化

- React.memo 优化频繁渲染组件
- useMemo 缓存计算结果
- useCallback 稳定回调函数
- 虚拟滚动（未来，如数据量大）

---

## 10. 文件迁移清单

### UI 组件（→ web/src/components/ui/dashboard/）

```
✓ avatar.tsx
✓ badge.tsx
✓ card.tsx
✓ table.tsx
✓ chart.tsx
✓ sidebar.tsx
✓ skeleton.tsx
✓ select.tsx
✓ dropdown-menu.tsx
✓ separator.tsx
✓ tooltip.tsx
✓ checkbox.tsx
✓ collapsible.tsx
✓ sheet.tsx
```

### Dashboard 组件（→ web/src/features/dashboard/components/）

```
✓ sidebar.tsx → dashboard-sidebar.tsx
✓ header.tsx → dashboard-header.tsx
✓ content.tsx → (拆分到各个 page)
✓ stats-cards.tsx
✓ deals-table.tsx
✓ welcome-section.tsx
✓ lead-sources-chart.tsx → charts/lead-sources-chart.tsx
✓ revenue-flow-chart.tsx → charts/revenue-flow-chart.tsx
```

### 主题组件（→ web/src/features/dashboard/components/）

```
✓ theme-toggle.tsx
```

### 数据与 Store（→ web/src/features/dashboard/）

```
✓ mock-data/deals.ts → data/deals.ts
✓ mock-data/stats.ts → data/stats.ts
✓ store/dashboard-store.ts → store/dashboard-store.ts
```

### Hooks（→ web/src/features/dashboard/hooks/）

```
✓ hooks/use-mobile.ts
```

### 导入路径示例

```tsx
// UI 组件
import { Card } from '@/components/ui/dashboard/card';
import { Button } from '@/components/ui/auth/button';

// Dashboard 组件
import { DashboardSidebar } from '@/features/dashboard/components/dashboard-sidebar';
import { StatsCards } from '@/features/dashboard/components/stats-cards';

// 数据
import { mockDeals } from '@/features/dashboard/data/deals';

// Store
import { useDashboardStore } from '@/features/dashboard/store/dashboard-store';

// 工具函数
import { cn } from '@/lib/utils';
```

---

## 11. 实施步骤

### Phase 1: 准备工作（~30分钟）

1. 安装依赖
2. 创建目录结构
3. 备份现有代码（git commit）

### Phase 2: 样式与配置（~20分钟）

4. 更新样式文件（添加 CSS 变量到 styles.css）
5. 配置主题 Provider
6. 更新 Tailwind 配置

### Phase 3: UI 组件迁移（~1小时）

7. 迁移 UI 组件到 components/ui/dashboard/
8. 合并工具函数

### Phase 4: 数据与状态（~30分钟）

9. 迁移 Mock Data
10. 创建类型定义
11. 迁移 Store
12. 迁移 Hooks

### Phase 5: Dashboard 组件（~2小时）

13. 迁移主题组件
14. 创建 DashboardLayout
15. 迁移 Sidebar（改造路由）
16. 迁移 Header
17. 迁移业务组件（添加 test-id）

### Phase 6: 页面创建（~1小时）

18. 创建 OverviewPage
19. 创建 DealsPage
20. 创建 barrel exports

### Phase 7: 路由配置（~30分钟）

21. 更新 AuthPage（Home 按钮）
22. 配置路由（app.tsx）

### Phase 8: 验证与调试（~1小时）

23. 本地运行验证
24. 功能验证清单
25. 样式调整
26. 构建验证

### Phase 9: 文档与提交（~30分钟）

27. 创建/更新 README
28. Git 提交

**总估计时间：6-8 小时**

---

## 12. 验证清单

### 认证页面
- [ ] 访问 `/` 能看到 AuthPage
- [ ] Home 按钮跳转到 `/app/dashboard/overview`
- [ ] 页面样式正常
- [ ] 动画效果正常

### Dashboard 布局
- [ ] 侧边栏正常显示
- [ ] Header 正常显示
- [ ] 主题切换工作正常
- [ ] 侧边栏折叠/展开正常
- [ ] 响应式布局正常

### Overview 页面
- [ ] 访问路径正常
- [ ] WelcomeSection 显示
- [ ] 统计卡片显示正确
- [ ] 图表渲染正常
- [ ] test-id 存在

### Deals 页面
- [ ] 访问路径正常
- [ ] 表格显示数据
- [ ] 排序功能正常
- [ ] 分页功能正常
- [ ] test-id 存在

### 导航功能
- [ ] 侧边栏导航正常
- [ ] 当前页面高亮
- [ ] 浏览器前进/后退正常

### 主题功能
- [ ] 默认暗色主题
- [ ] 可切换亮色/系统主题
- [ ] 刷新后主题保持
- [ ] 所有组件样式正确

### 构建与性能
- [ ] 构建成功
- [ ] 无 TypeScript 错误
- [ ] 无 console 警告
- [ ] Bundle 大小合理

---

## 13. 潜在风险与缓解

| 风险 | 缓解措施 |
|------|---------|
| 样式冲突 | 只添加新 CSS 变量，不覆盖现有 |
| 依赖版本冲突 | 检查兼容性，使用 npm ls |
| 路由冲突 | 如 /app 已被使用，改为 /dashboard |
| Tailwind 类名冲突 | 通过 CSS 变量控制，非硬编码 |
| 构建体积增大 | 使用懒加载，按需导入 |
| 移动端适配问题 | 测试响应式，调整 breakpoint |

---

## 14. 架构优势

✅ **Feature-based 结构** - 明确的功能边界
✅ **分层清晰** - Pages → Components → UI → Data
✅ **高可维护性** - 组件解耦，职责单一
✅ **可扩展性强** - 易于添加新功能
✅ **测试友好** - 完整的 test-id 支持
✅ **性能优化** - 懒加载、代码分割
✅ **类型安全** - 完整的 TypeScript 定义
✅ **样式隔离** - 保护现有样式，避免冲突
✅ **未来兼容** - 预留 API 集成接口

---

## 15. 未来扩展

- [ ] 连接后端 API（替换 mock data）
- [ ] 实现用户认证流程
- [ ] 添加 Analytics 页面
- [ ] 添加单元测试
- [ ] 添加 E2E 测试
- [ ] 实现数据过滤和搜索
- [ ] 添加导出功能
- [ ] 国际化支持

---

**设计完成日期：** 2026-01-13
**批准状态：** ✅ 已批准
**下一步：** 准备实施