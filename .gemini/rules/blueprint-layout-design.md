---
paths:
  - "apps/web/src/features/blueprint/**/*.tsx"
  - "apps/web/src/features/blueprint/**/*.ts"
  - "apps/web/src/features/blueprint/docs/**/*.md"
---

# Blueprint 布局设计

## 核心原则

布局从用户工作流推导，不从模板选择。不同的用户任务天然产生不同的功能区域数量和布局形式。

## 设计时必须回答的问题

1. 用户在这个 tab 的核心任务是什么？（一句话）
2. 操作步骤的自然序列是什么？
3. 哪些信息必须同时可见？哪些可以顺序查看？哪些按需展开？
4. 由此推导出几个功能区域？（不人为凑数）
5. 最后才决定布局形式

## 可用的区域类型

不是所有区域都必须是 MineCard:
- Banner 色带（预警/状态）、Config 工具栏、MineCard、Tab 切换 Card、Mini Card 组

## 完成后检查

- 能用一句话说清核心任务吗？
- Card 数量是推导出来的，还是模板决定的？
- 每个区域有且只有一个清晰职责吗？有没有收纳箱？
- 信息层级正确吗？（紧急→Banner，核心→主 Card，辅助→expandContent）
- 与同模块其他 tab 布局有合理差异吗？

---

## Markdown Doc 文件格式 (.md)

Blueprint PRD 文档存放在 `apps/web/src/features/blueprint/docs/<module>/<tab>.md`。

### 文件结构

```yaml
---
title: 页面标题
subtitle: 副标题描述
icon: LucideIconName          # 对应 icon-map.ts 中注册的图标
layout: two-column            # two-column | rows | custom
cards:
  - id: card-id               # 唯一标识，与 <!-- card: ID --> 对应
    title: 卡片标题
    subtitle: 卡片副标题
    render: markdown           # markdown (默认) | placeholder | component
    flex: 50                   # flex 比例
    row: 1                     # 行号
    badge: { icon: IconName, label: 标签, color: teal }
    expandTitle: 弹窗标题
    expandSubtitle: 弹窗副标题
    # placeholder 模式额外字段:
    # placeholderType: chart | ag-grid | treemap | editor | heatmap | radar
    # placeholderLabel: "显示文字"
    # component 模式额外字段:
    # component: ComponentRegistryKey
rows:
  - height: 520px
links:
  - from: 来源
    to: 目标
    desc: 说明
footer: 底部信息文字
---

<!-- card: card-id -->
卡片正文 markdown...

<!-- card: card-id:expand -->
弹窗额外内容 markdown...
```

### Card 分隔符

- `<!-- card: ID -->` — 卡片体内容 (MineCard children)
- `<!-- card: ID:expand -->` — 弹窗额外内容 (MineCard expandContent)
- HTML 注释在 GitHub/VSCode 中不可见，不影响阅读

### 三种渲染模式

| render | 卡片主体 | expand 弹窗 | 阶段 |
|---|---|---|---|
| `markdown` | markdown 内容 | expand 区 markdown | PRD 文档阶段 |
| `placeholder` | 虚线框占位图 | 完整 markdown 文档 | 设计确认阶段 |
| `component` | 注册的 React 组件 | 完整 markdown 文档 | 开发完成阶段 |

### 迁移步骤

1. 创建 `docs/<module>/<tab>.md` 文件
2. 在 `doc-content.tsx` 的 `MD_DOCS` 注册 dynamic import
3. 从 `CUSTOM_SECTIONS` 移除对应条目
4. 删除旧的 TSX section 文件
