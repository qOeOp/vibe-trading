# Component Registry

> 所有 L1/L2 可复用组件的 source of truth。新建组件前必须查此表。

## 使用规则

1. **新建 L1/L2 组件前** → 查此表，确认没有已有组件可复用
2. **新建后** → 必须在此表注册，否则审计脚本会报错
3. **Status** → `active`(使用中) / `draft`(已创建未使用) / `deprecated`(计划移除)
4. **Pencil** → 对应 `apps/web/design/tokens.pen` 中的可复用组件（有则标组件名，无则标 `—`）

## L1: UI Primitives (`components/ui/`)

> shadcn + Radix + CVA 基础组件。

| Component                | File                            | Pencil          | Status      | Notes                               |
| ------------------------ | ------------------------------- | --------------- | ----------- | ----------------------------------- |
| AlertDialog              | alert-dialog.tsx                | Dialog          | active      |                                     |
| AnimatedBeam             | animated-beam.tsx               | AnimatedBeam    | active      | Magic UI                            |
| Avatar                   | avatar.tsx                      | Avatar          | active      |                                     |
| AvatarGroup              | avatar-group.tsx                | Avatar          | active      | 多头像组合                          |
| Badge                    | badge.tsx                       | Badge/\*        | active      |                                     |
| Button                   | button.tsx                      | Button/\*       | active      |                                     |
| ButtonGroup              | button-group.tsx                | ButtonGroup     | active      | 纯布局包装                          |
| Calendar                 | calendar.tsx                    | Calendar        | active      | 复杂交互组件                        |
| Card                     | card.tsx                        | Card            | active      |                                     |
| ~~Chart~~                | ~~chart.tsx~~                   | ~~Chart~~       | **removed** | Recharts wrapper, 0 usage — deleted |
| Checkbox                 | checkbox.tsx                    | Checkbox/\*     | active      |                                     |
| Collapsible              | collapsible.tsx                 | Collapsible     | active      |                                     |
| Command                  | command.tsx                     | Command         | active      |                                     |
| ContextMenu              | context-menu.tsx                | DropdownMenu    | active      |                                     |
| DateTimePicker           | date-time-picker.tsx            | DateTimePicker  | active      | 复杂交互组件                        |
| DayPicker                | day-picker.tsx                  | DayPicker       | active      | 复杂交互组件                        |
| Dialog                   | dialog.tsx                      | Dialog          | active      |                                     |
| DropdownMenu             | dropdown-menu.tsx               | DropdownMenu    | active      |                                     |
| Faceted                  | faceted.tsx                     | Faceted         | active      | 复杂交互组件                        |
| FileTree                 | file-tree.tsx                   | FileTree        | active      | Magic UI                            |
| Form                     | form.tsx                        | Form            | active      | 纯逻辑包装                          |
| GlowingEffect            | glowing-effect.tsx              | GlowingEffect   | active      | Aceternity, 纯动效                  |
| Input                    | input.tsx                       | Input/\*        | active      |                                     |
| InputGroup               | input-group.tsx                 | InputGroup      | active      | 纯布局包装                          |
| Kbd                      | kbd.tsx                         | Kbd             | active      |                                     |
| Label                    | label.tsx                       | Label           | active      |                                     |
| Popover                  | popover.tsx                     | Popover         | active      |                                     |
| ProgressiveBlur          | progressive-blur.tsx            | ProgressiveBlur | active      | 纯动效                              |
| QueryParamPreservingLink | query-param-preserving-link.tsx | Link            | active      | 纯逻辑包装                          |
| ResponsiveModal          | responsive-modal.tsx            | Dialog          | active      |                                     |
| ScrollArea               | scroll-area.tsx                 | ScrollArea      | active      | 纯行为组件                          |
| Select                   | select.tsx                      | Select          | active      |                                     |
| Separator                | separator.tsx                   | Divider         | active      |                                     |
| Sheet                    | sheet.tsx                       | Sheet           | active      |                                     |
| Sidebar                  | sidebar.tsx                     | Sidebar         | active      | 复杂布局组件                        |
| Skeleton                 | skeleton.tsx                    | Skeleton        | active      |                                     |
| Slider                   | slider.tsx                      | Slider          | active      |                                     |
| Sonner                   | sonner.tsx                      | Toast           | active      |                                     |
| Sortable                 | sortable.tsx                    | Sortable        | active      | dnd-kit, 纯行为                     |
| Switch                   | switch.tsx                      | Switch/\*       | active      |                                     |
| Table                    | table.tsx                       | TableRow        | active      |                                     |
| PillSearch               | (inline in factor-data-table)   | PillSearch      | active      | 药丸搜索框                          |
| FilterButton             | (DataTableFacetedFilter)        | FilterButton    | active      | 筛选器按钮                          |
| Tabs                     | tabs.tsx                        | Tab/\*          | active      |                                     |
| Textarea                 | textarea.tsx                    | Textarea        | active      |                                     |
| Toggle                   | toggle.tsx                      | Toggle/\*       | active      |                                     |
| ToggleGroup              | toggle-group.tsx                | Toggle/\*       | active      |                                     |
| Tooltip                  | tooltip.tsx                     | Tooltip         | active      |                                     |

## L2: Layout (`components/layout/`)

> 全局布局组件。

| Component       | File                  | Pencil         | Status | Notes          |
| --------------- | --------------------- | -------------- | ------ | -------------- |
| IndexCardList   | index-card-list.tsx   | IndexCard      | active | 指数卡片列表   |
| LeftIconSidebar | left-icon-sidebar.tsx | NavItem/\*     | active | 左侧图标导航   |
| MarketTicker    | market-ticker.tsx     | MarketTag/\*   | active | 顶部行情滚动条 |
| NavPill         | nav-pill.tsx          | NavPill/\*     | active | 导航药丸按钮   |
| NavPillGroup    | nav-pill.tsx          | NavPillGroup   | active | 药丸按钮组容器 |
| PageTransition  | page-transition.tsx   | PageTransition | active | 纯动效         |
| TopBarSlot      | top-bar-slot.tsx      | TopBarSlot     | active | 纯布局插槽     |
| TopNavBar       | top-nav-bar.tsx       | NavPill/\*     | active | 顶部导航栏     |
| UserCapsule     | user-capsule.tsx      | Avatar         | active | 用户头像胶囊   |

## L2: Shared (`components/shared/`)

> 跨 feature 复用的业务组件。

### Panel System (`shared/panel/`)

| Component          | File                     | Pencil           | Status      | Notes                     |
| ------------------ | ------------------------ | ---------------- | ----------- | ------------------------- |
| PanelFrame         | panel-frame.tsx          | PanelFrame       | active      | 面板外壳                  |
| PanelFrameHeader   | panel-frame-header.tsx   | (in PanelFrame)  | active      | 面板头部                  |
| PanelFrameBody     | panel-frame-body.tsx     | (in PanelFrame)  | active      | 面板内容区                |
| PanelSection       | panel-section.tsx        | PanelSection     | active      | 内容分段（自带 border-b） |
| PanelKV            | panel-kv.tsx             | PanelKV          | active      | 键值对                    |
| PanelStatGrid      | panel-stat-grid.tsx      | PanelStatGrid    | active      | KPI 网格                  |
| PanelRow           | panel-row.tsx            | PanelRow         | active      | 纯布局包装                |
| PanelChartBox      | panel-chart-box.tsx      | PanelChartBox    | active      | 图表容器                  |
| PanelBadge         | panel-badge.tsx          | Badge/\*         | active      | 面板徽章                  |
| PanelText          | panel-text.tsx           | PanelText        | active      | 纯排版包装                |
| PanelEmpty         | panel-empty.tsx          | PanelEmpty       | active      | 空状态                    |
| ~~PanelSearchBar~~ | ~~panel-search-bar.tsx~~ | ~~Input/Search~~ | **removed** | 0 usage — deleted         |
| PanelActionButton  | panel-action-button.tsx  | Button/\*        | active      | 操作按钮                  |

### Factor Metrics (`shared/factor-metrics/`)

| Component        | File                   | Pencil          | Status | Notes        |
| ---------------- | ---------------------- | --------------- | ------ | ------------ |
| FactorMetricGrid | factor-metric-grid.tsx | PanelStatGrid   | active | 因子指标网格 |
| FactorMetricItem | factor-metric-item.tsx | PanelStatItem   | active | 单个指标项   |
| DistributionBar  | distribution-bar.tsx   | DistributionBar | active | 分布条       |
| ThresholdBar     | threshold-bar.tsx      | ThresholdBar    | active | 阈值条       |

### Other Shared

| Component     | File               | Pencil        | Status | Notes      |
| ------------- | ------------------ | ------------- | ------ | ---------- |
| FloatingPaths | floating-paths.tsx | FloatingPaths | active | 纯装饰 SVG |
| Logo          | logo.tsx           | Logo          | active | 品牌 Logo  |

## L2: Animation (`components/animation/`)

| Component | File           | Pencil    | Status | Notes        |
| --------- | -------------- | --------- | ------ | ------------ |
| AnimateIn | animate-in.tsx | AnimateIn | active | 纯动效包装器 |

---

## 统计

- L1 UI Primitives: 47 (-1: Chart removed)
- L2 Layout: 9
- L2 Shared: 18 (-1: PanelSearchBar removed)
- L2 Animation: 1
- **Total L1/L2: 75**
- **Pencil 覆盖: 75/75 (100%)**
- Pencil 可复用组件总数: 69 (was 85; -2 deleted, -14 downgraded to non-reusable visual examples)
- Pencil non-reusable visual examples: 14 (state pairs: Tab/Inactive, NavPill/Inactive, NavItem/Inactive, Checkbox/Unchecked, Switch/Off, Toggle/Off; color variants: Badge/Testing+Validated+Live+Retired, StatusDot/Warning+Error, MarketTag/Down+Flat)
- Pencil L3/feature 组件 (不计入 L1/L2): FactorDetailPanel

## 变更日志

| Date       | Action                | Component                                                                                                                                                                                                                           | By   |
| ---------- | --------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---- |
| 2026-03-05 | 初始注册表创建        | 全部 74 个 L1/L2                                                                                                                                                                                                                    | Lead |
| 2026-03-05 | Pencil 组件库建立     | 45 可复用组件 in tokens.pen                                                                                                                                                                                                         | Lead |
| 2026-03-05 | Figma → Pencil 迁移   | 全表列名更新                                                                                                                                                                                                                        | Lead |
| 2026-03-05 | 覆盖率提升 41% → 89%  | +16 组件 (Dialog/Sheet/Toast/Command/Toggle/Slider/Label/Textarea/DropdownMenu/Popover/Collapsible/NavPill/IndexCard/Logo)                                                                                                          | Lead |
| 2026-03-05 | 覆盖率提升 89% → 100% | +22 组件 (ButtonGroup/Calendar/Chart/DateTimePicker/DayPicker/Faceted/FileTree/Form/GlowingEffect/InputGroup/ProgressiveBlur/Link/ScrollArea/Sidebar/Sortable/PageTransition/TopBarSlot/PanelRow/PanelText/FloatingPaths/AnimateIn) | Lead |
| 2026-03-06 | Library Pencil 审计   | +2 组件 (PillSearch/FilterButton), DataTable 修复 (layout/toolbar/column widths), MarketTicker 自适应宽度, TopNavBar spacer 移除                                                                                                    | Lead |
| 2026-03-06 | 社区规范升级          | +NavPillGroup, 变量 dot-notation 迁移 (42→45), metadata/slot 标注全量 85 组件, drift 脚本增强                                                                                                                                       | Lead |
| 2026-03-06 | 组件库审计清理        | -3 代码组件 (Chart/PanelSearchBar/MarketBadge), -2 Pencil 删除 (Chart/Input-Search), -14 Pencil 降级 non-reusable (6 状态对 + 8 颜色变体). 85→69 reusable, 77→75 L1/L2                                                              | Lead |
