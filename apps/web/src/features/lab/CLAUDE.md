# L3: Lab Feature — Marimo Notebook IDE

最大的 feature 模块（383 tsx）。集成 marimo notebook 编辑器。

## Layer Rule

**L3 可引用 L0 + L1 + L2**。禁止被其他 L3 引用。

允许：

- `from '@/components/ui/'` — L1
- `from '@/components/shared/'` / `layout/` / `animation/` — L2
- `from '@/lib/'` — L0
- `from '@/hooks/'` — 全局 hooks
- `from '@/features/lab/'` — 本 feature 内部（相对路径 `./` `../`）

**禁止**：

- 其他 feature 不应 `from '@/features/lab/'`（耦合）

## Lab Internal 组件 (components/ui/)

Lab 保留了一组 marimo 上游的 UI 组件，它们有 **L1 没有的 API 扩展**：

| 组件          | L1 没有的 API                                   | 用途           |
| ------------- | ----------------------------------------------- | -------------- |
| button        | `keyboardShortcut` prop                         | 快捷键显示     |
| badge         | `<span>` 元素 + onClick 类型                    | 变量标签       |
| dialog        | `usePortal` prop                                | 非 portal 模式 |
| tooltip       | `content` 便捷 prop + TooltipRoot/TooltipPortal | 简化调用       |
| dropdown-menu | `showChevron` + `danger` variant                | 子菜单控制     |
| command       | `rootClassName` on CommandInput                 | 布局控制       |
| switch        | `size` + `icon` props                           | 小尺寸开关     |
| input         | `icon` + DebouncedInput/SearchInput             | 输入扩展       |
| toggle        | `xs` size                                       | 更小尺寸       |

**治理方向**：这些扩展 API 应逐步合并到 L1（加 prop/variant），然后迁移消费者。
当前状态：34 个 button 引用已迁到 L1，其余保持 internal。

## 已迁移到 L1 的组件

以下 lab 消费者已改为引用 `@/components/ui/`：

- Button (34 files), Popover (7), Checkbox (7), Select (5), Label (4), Dialog (5),
  Table (4), AlertDialog (2), Form (2), Kbd (5), Input (4), ScrollArea (1), Tabs (2)

## 数据层

- marimo 用 jotai atoms（`core/cells/cells.ts`）
- VT 兼容层用 zustand（`lib/marimo-compat.ts`）
- Connected mode 数据在 jotai — hooks 必须用 marimo-native `useCellActions()`/`useNotebook()`
