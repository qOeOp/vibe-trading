---
paths:
  - "apps/web/src/features/**"
  - "apps/web/src/features/blueprint/docs/**/*.md"
---

# Doc-First 工作流

## 铁律

**任何功能改动（新增 / 重构 / 删除）必须先更新 Blueprint doc，再写代码。**

违反此规则 = 技术债。代码领先于文档意味着 PRD 失去了 source of truth 地位，后续所有设计决策都在没有参照系的情况下进行。

## 流程

### 新功能

1. 在 `blueprint/docs/<module>/<tab>.md` 中写 card 定义、交互规格、CSS 规格、MVP/P2 分期
2. Vincent 确认 doc
3. 实现代码
4. 代码完成后将 card `render` 从 `markdown` 推进到 `placeholder` 或 `component`

### 改动已有功能

1. **先**更新 doc 中受影响的段落（新布局、新交互、废弃的组件标注）
2. Vincent 确认变更范围
3. 改代码
4. 代码与 doc 对照检查

### 删除功能

1. 在 doc 中标注废弃原因和替代方案
2. 代码清理
3. 更新 MVP/P2 分期表

## 检查清单

每次提交前自问：
- [ ] 这次改动涉及的 Blueprint doc 是否已同步？
- [ ] Frontmatter（cards / rows / layout）是否反映当前布局？
- [ ] 列定义 / 交互规格 / 颜色映射是否与代码一致？
- [ ] MVP/P2 分期表是否准确？

## 渲染模式递进

```
markdown → placeholder → component
```

不跳级。markdown 阶段 = PRD 讨论；placeholder 阶段 = 设计确认（虚线框 + expand 文档）；component 阶段 = 代码实现完成。
