# L3: Library Feature — Factor Library

因子库管理：因子列表、详情面板、数据表、筛选。

## Layer Rule

L3 标准规则。可引用 L0 + L1 + L2，禁止被其他 L3 引用。

## 本模块组件

- `factor-data-table/` — TanStack Table 因子列表
- `factor-detail/` — 因子详情面板（使用 L2 PanelSystem）

## 注意事项

- 详情面板 **必须** 使用 `@/components/shared/panel/` 系统
- 颜色遵循 A 股语义：红=好(up), 绿=坏(down)
- 禁止裸 hex，全部使用 mine-\* 语义 token
