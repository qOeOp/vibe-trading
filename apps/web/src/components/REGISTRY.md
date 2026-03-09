# Component Registry

> 所有 L1/L2 可复用组件的 Single Source of Truth。新建组件前必须查此表。

## 使用规则

1. **新建 L1/L2 组件前** → 查此表，确认没有已有组件可复用
2. **新建后** → 必须在此表注册，否则审计脚本会报错
3. **Status** → `active`(使用中) / `draft`(已创建未使用) / `deprecated`(计划移除)

## L1: UI Primitives (`components/ui/`)

> shadcn + Radix + CVA 基础组件。

| Component                | File                            | Status      | Notes                                                                    |
| ------------------------ | ------------------------------- | ----------- | ------------------------------------------------------------------------ |
| AlertDialog              | alert-dialog.tsx                | active      |                                                                          |
| AnimatedBeam             | animated-beam.tsx               | active      | Magic UI                                                                 |
| Avatar                   | avatar.tsx                      | active      |                                                                          |
| AvatarGroup              | avatar-group.tsx                | active      | 多头像组合                                                               |
| Badge                    | badge.tsx                       | active      |                                                                          |
| Button                   | button.tsx                      | active      |                                                                          |
| ButtonGroup              | button-group.tsx                | active      | 纯布局包装                                                               |
| Calendar                 | calendar.tsx                    | active      | 复杂交互组件                                                             |
| Card                     | card.tsx                        | active      | 超集: variant(default/frosted) + expandable + CardHeader structured mode |
| ~~Chart~~                | ~~chart.tsx~~                   | **removed** | Recharts wrapper, 0 usage — deleted                                      |
| Checkbox                 | checkbox.tsx                    | active      |                                                                          |
| Collapsible              | collapsible.tsx                 | active      |                                                                          |
| Command                  | command.tsx                     | active      |                                                                          |
| ContextMenu              | context-menu.tsx                | active      |                                                                          |
| DateTimePicker           | date-time-picker.tsx            | active      | 复杂交互组件                                                             |
| DayPicker                | day-picker.tsx                  | active      | 复杂交互组件                                                             |
| Dialog                   | dialog.tsx                      | active      |                                                                          |
| DropdownMenu             | dropdown-menu.tsx               | active      |                                                                          |
| Faceted                  | faceted.tsx                     | active      | 复杂交互组件                                                             |
| FileTree                 | file-tree.tsx                   | active      | Magic UI                                                                 |
| Form                     | form.tsx                        | active      | 纯逻辑包装                                                               |
| GlowingEffect            | glowing-effect.tsx              | active      | Aceternity, 纯动效                                                       |
| Input                    | input.tsx                       | active      |                                                                          |
| InputGroup               | input-group.tsx                 | active      | 纯布局包装                                                               |
| Kbd                      | kbd.tsx                         | active      |                                                                          |
| Label                    | label.tsx                       | active      |                                                                          |
| Popover                  | popover.tsx                     | active      |                                                                          |
| ProgressiveBlur          | progressive-blur.tsx            | active      | 纯动效                                                                   |
| QueryParamPreservingLink | query-param-preserving-link.tsx | active      | 纯逻辑包装                                                               |
| ResponsiveModal          | responsive-modal.tsx            | active      |                                                                          |
| ScrollArea               | scroll-area.tsx                 | active      | 纯行为组件                                                               |
| Select                   | select.tsx                      | active      |                                                                          |
| Separator                | separator.tsx                   | active      |                                                                          |
| Sheet                    | sheet.tsx                       | active      |                                                                          |
| Sidebar                  | sidebar.tsx                     | active      | 复杂布局组件                                                             |
| Skeleton                 | skeleton.tsx                    | active      |                                                                          |
| Slider                   | slider.tsx                      | active      |                                                                          |
| Sonner                   | sonner.tsx                      | active      |                                                                          |
| Sortable                 | sortable.tsx                    | active      | dnd-kit, 纯行为                                                          |
| Switch                   | switch.tsx                      | active      |                                                                          |
| Table                    | table.tsx                       | active      |                                                                          |
| PillSearch               | (inline in factor-data-table)   | active      | 药丸搜索框                                                               |
| FilterButton             | (DataTableFacetedFilter)        | active      | 筛选器按钮                                                               |
| Tabs                     | tabs.tsx                        | active      |                                                                          |
| Textarea                 | textarea.tsx                    | active      |                                                                          |
| Toggle                   | toggle.tsx                      | active      |                                                                          |
| ToggleGroup              | toggle-group.tsx                | active      |                                                                          |
| Toolbar                  | toolbar.tsx                     | active      | Radix Toolbar: Button/Separator/Link/ToggleGroup                         |
| Tooltip                  | tooltip.tsx                     | active      |                                                                          |

## L2: Layout (`components/layout/`)

> 全局布局组件。

| Component       | File                  | Status | Notes          |
| --------------- | --------------------- | ------ | -------------- |
| IndexCardList   | index-card-list.tsx   | active | 指数卡片列表   |
| LeftIconSidebar | left-icon-sidebar.tsx | active | 左侧图标导航   |
| MarketTicker    | market-ticker.tsx     | active | 顶部行情滚动条 |
| NavPill         | nav-pill.tsx          | active | 导航药丸按钮   |
| NavPillGroup    | nav-pill.tsx          | active | 药丸按钮组容器 |
| PageTransition  | page-transition.tsx   | active | 纯动效         |
| TopBarSlot      | top-bar-slot.tsx      | active | 纯布局插槽     |
| TopNavBar       | top-nav-bar.tsx       | active | 顶部导航栏     |
| UserCapsule     | user-capsule.tsx      | active | 用户头像胶囊   |

## L2: Shared (`components/shared/`)

> 跨 feature 复用的业务组件。

### Panel System (`shared/panel/`)

| Component          | File                     | Status      | Notes                     |
| ------------------ | ------------------------ | ----------- | ------------------------- |
| PanelFrame         | panel-frame.tsx          | active      | 面板外壳                  |
| PanelFrameHeader   | panel-frame-header.tsx   | active      | 面板头部                  |
| PanelFrameBody     | panel-frame-body.tsx     | active      | 面板内容区                |
| PanelSection       | panel-section.tsx        | active      | 内容分段（自带 border-b） |
| PanelKV            | panel-kv.tsx             | active      | 键值对                    |
| PanelStatGrid      | panel-stat-grid.tsx      | active      | KPI 网格                  |
| PanelRow           | panel-row.tsx            | active      | 纯布局包装                |
| PanelChartBox      | panel-chart-box.tsx      | active      | 图表容器                  |
| PanelBadge         | panel-badge.tsx          | active      | 面板徽章                  |
| PanelText          | panel-text.tsx           | active      | 纯排版包装                |
| PanelEmpty         | panel-empty.tsx          | active      | 空状态                    |
| ~~PanelSearchBar~~ | ~~panel-search-bar.tsx~~ | **removed** | 0 usage — deleted         |
| PanelActionButton  | panel-action-button.tsx  | active      | 操作按钮                  |

### Factor Metrics (`shared/factor-metrics/`)

| Component        | File                   | Status | Notes        |
| ---------------- | ---------------------- | ------ | ------------ |
| FactorMetricGrid | factor-metric-grid.tsx | active | 因子指标网格 |
| FactorMetricItem | factor-metric-item.tsx | active | 单个指标项   |
| DistributionBar  | distribution-bar.tsx   | active | 分布条       |
| ThresholdBar     | threshold-bar.tsx      | active | 阈值条       |

### Other Shared

| Component     | File               | Status | Notes      |
| ------------- | ------------------ | ------ | ---------- |
| FloatingPaths | floating-paths.tsx | active | 纯装饰 SVG |
| Logo          | logo.tsx           | active | 品牌 Logo  |

## L2: Animation (`components/animation/`)

| Component | File           | Status | Notes        |
| --------- | -------------- | ------ | ------------ |
| AnimateIn | animate-in.tsx | active | 纯动效包装器 |

---

## 统计

- L1 UI Primitives: 48 (+1: Toolbar)
- L2 Layout: 9
- L2 Shared: 18 (-1: PanelSearchBar removed)
- L2 Animation: 1
- **Total L1/L2: 76**

## 变更日志

| Date       | Action         | Component                                                                                                                              | By   |
| ---------- | -------------- | -------------------------------------------------------------------------------------------------------------------------------------- | ---- |
| 2026-03-05 | 初始注册表创建 | 全部 74 个 L1/L2                                                                                                                       | Lead |
| 2026-03-06 | 组件库审计清理 | -3 代码组件 (Chart/PanelSearchBar/MarketBadge). 77→75 L1/L2                                                                            | Lead |
| 2026-03-08 | 去 Pencil 简化 | 移除 Pencil 列，REGISTRY.md 成为 Single Source of Truth。删除 design-system.md / design-sync.md，简化 team.md / coordination.md 工作流 | Lead |
| 2026-03-09 | Card 超集统一  | MineCard/ChartCard 删除，13 处手写 card shell → L1 Card。Card 加 expandable + CardHeader structured mode                               | Lead |
| 2026-03-09 | 新增 Toolbar   | 基于 @radix-ui/react-toolbar，batch-toolbar 首个消费者                                                                                 | Lead |
| 2026-03-09 | NewTaskDialog  | 手写 modal → L1 Dialog                                                                                                                 | Lead |
