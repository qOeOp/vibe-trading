# L3: Market Feature — 市场数据

热力图、行情详情、市场 widget。

## Layer Rule

L3 标准规则。可引用 L0 + L1 + L2，禁止被其他 L3 引用。

## 本模块组件

- `treemap/` — 市场热力图 (D3 hierarchy)
- `detail/` — 个股详情
- `shared/` — 模块内共享 (SectionHeader, ProgressBar, ChangeIndicator)
- `widgets/` — 市场小组件

## 注意事项

- D3 需要 v7+（通过 npm overrides 强制）
- A 股色彩：红=涨=好，绿=跌=坏
