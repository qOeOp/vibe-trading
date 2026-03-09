# L1: UI Primitives

Ground-level building blocks. Every reusable visual element starts here.

## Layer Rule

**L1 不依赖 L2/L3**。只允许引用：

- 外部包 (Radix UI, cmdk, dnd-kit, react-day-picker, class-variance-authority)
- `@/lib/utils` (cn, format, id)
- 其他 L1 组件（组合原语，如 Command 用 Dialog）

**禁止**：

- `from '@/components/shared/'` — L2
- `from '@/components/layout/'` — L2
- `from '@/features/'` — L3

## 组件创建规范

每个 L1 组件 **必须**：

1. `"use client"` 声明（如使用 hooks/事件）
2. `data-slot="组件名"` 属性
3. 接受 `className` prop，用 `cn()` 合并
4. `...props` spread 保持扩展性
5. **命名导出**，不用 default export
6. CVA 定义变体（如有多种样式）
7. 导出类型 `XxxProps`（方便消费者 extends）

## 变体优先原则

**同一语义功能 = 同一组件 + 不同变体**。禁止为不同展示创建新组件。

例：不要创建 `PillSearchInput` + `InlineSearchInput`，应该用 `SearchInput` 的 `variant: 'pill' | 'inline'`。

## 当前组件清单

见 `@/components/registry.ts` 的 L1 section（40 个组件）。

新增组件前：

1. 先查 registry 是否已有同语义组件
2. 查是否可通过现有组件加变体实现
3. 确认不是 L2/L3 的职责（L1 是无业务语义的通用原语）
