# Marimo → VT 前端迁移清单 — 总索引

> 生成时间: 2026-02-19
> Marimo 源码: `/Users/vx/WebstormProjects/marimo/frontend/src/`
> VT 目标: `/Users/vx/WebstormProjects/vibe-trading/apps/web/src/features/lab/`

---

## 文件统计

| 清单文件                      | Marimo 目录                                    | 文件数             | 行数     |
| ----------------------------- | ---------------------------------------------- | ------------------ | -------- |
| `01-components-editor.md`     | `components/editor/`                           | ~223               | 1520     |
| `02-components-other.md`      | `components/` (除 editor)                      | ~270               | 1979     |
| `03-core.md`                  | `core/`                                        | ~259 (非测试)      | 1762     |
| `04-hooks-utils-theme-css.md` | `hooks/` + `utils/` + `theme/` + `css/` + root | ~188               | 927      |
| `05-plugins.md`               | `plugins/`                                     | ~155               | 1180     |
| **合计**                      |                                                | **~1095 (非测试)** | **8368** |

全量统计（含测试）: 1239 files

---

## 已迁移文件 (Batch 1 + Batch 2)

| VT 文件                                     | Marimo 源                                           | 批次  |
| ------------------------------------------- | --------------------------------------------------- | ----- |
| `components/cell/toolbar-item.tsx`          | `components/editor/cell/toolbar.tsx`                | B1    |
| `hooks/use-cell-action-buttons.tsx`         | `components/editor/actions/useCellActionButton.tsx` | B1    |
| `components/cell/cell-actions-dropdown.tsx` | `components/editor/cell/cell-actions.tsx`           | B1    |
| `lib/scroll-cell-into-view.ts`              | `core/cells/scrollCellIntoView.ts`                  | B1    |
| `components/cell/notebook-cell.tsx`         | `components/editor/cell/Cell.tsx` (partial)         | B1+B2 |
| `components/ui/context-menu.tsx`            | shadcn/ui (new)                                     | B2    |
| `hooks/use-event-listener.ts`               | `hooks/useEventListener.ts`                         | B2    |
| `hooks/use-hotkey.ts`                       | `core/hotkeys/hotkeys.ts` (partial)                 | B2    |
| `components/cell/cell-context-menu.tsx`     | `components/editor/cell/cell-context-menu.tsx`      | B2    |
| `components/lab-workspace.tsx`              | (integration)                                       | B2    |

---

## Phase 2 决策分类

### ❌ REMOVE — 不迁移的大类

| 类别            | 涉及目录                                                  | 原因                        |
| --------------- | --------------------------------------------------------- | --------------------------- |
| Python 后端通信 | `core/kernel/`, `core/websocket/`, `core/network/`        | VT 无 Python kernel         |
| WASM 运行时     | `core/wasm/`                                              | VT 不在浏览器运行 Python    |
| VSCode 集成     | `core/vscode/`                                            | VT 不是 VSCode 扩展         |
| Islands 模式    | `core/islands/`                                           | VT 不用 islands 架构        |
| Python 插件渲染 | `plugins/` 大部分                                         | VT 的 output 渲染不同       |
| Home/Pages      | `components/home/`, `components/pages/`                   | VT 有自己的路由             |
| 静态 HTML 导出  | `components/static-html/`, `core/static/`, `core/export/` | VT 不需要                   |
| 实时协作        | `core/rtc/`                                               | VT 暂不需要                 |
| 数据库/数据源   | `components/databases/`, `components/datasources/`        | VT 有自己的数据层           |
| Slides 模式     | `components/slides/`                                      | VT 不需要幻灯片             |
| Debugger        | `components/debugger/`, `core/debugger/`                  | VT 暂不需要 Python debugger |
| Tracing         | `components/tracing/`                                     | VT 不需要                   |
| i18n            | `core/i18n/`                                              | VT 暂不需要国际化           |
| Secrets         | `core/secrets/`                                           | VT 不需要密钥管理           |
| Packages        | `core/packages/`                                          | VT 不管理 Python 包         |
| Scratchpad      | `components/scratchpad/`                                  | VT 不需要草稿板             |
| Terminal        | `components/terminal/`                                    | VT 不需要终端               |
| MCP             | `components/mcp/`                                         | VT 不需要 MCP 协议          |
| Run 模式        | `core/run-app.tsx`, `components/editor/renderers/`        | VT 不需要只读模式           |

### ✅ KEEP — 需要迁移的大类

| 类别              | 涉及目录                                   | 优先级 |
| ----------------- | ------------------------------------------ | ------ |
| CodeMirror 扩展   | `core/codemirror/` (~92 非测试)            | 🔴 高  |
| Cell 管理         | `core/cells/` (~18 非测试)                 | 🔴 高  |
| 编辑器 Cell 组件  | `components/editor/cell/`                  | 🔴 高  |
| 编辑器 Actions    | `components/editor/actions/`               | 🔴 高  |
| 热键系统          | `core/hotkeys/`                            | 🟡 中  |
| DOM 工具          | `core/dom/`                                | 🟡 中  |
| UI 原语           | `components/ui/`                           | 🟡 中  |
| 通用 Hooks        | `hooks/`                                   | 🟡 中  |
| 工具函数          | `utils/`                                   | 🟡 中  |
| 主题/CSS          | `theme/`, `css/`                           | 🟡 中  |
| Find-Replace      | `components/find-replace/`                 | 🟢 低  |
| Shortcuts 面板    | `components/shortcuts/`                    | 🟢 低  |
| Variables 面板    | `components/variables/`, `core/variables/` | 🟢 低  |
| 依赖图            | `components/dependency-graph/`             | 🟢 低  |
| 数据表格          | `components/data-table/`                   | 🟢 低  |
| Editor Chrome     | `components/editor/chrome/`                | 🟢 低  |
| Editor Output     | `components/editor/output/`                | 🟢 低  |
| Editor Navigation | `components/editor/navigation/`            | 🟢 低  |

### ⚠️ ADAPT — 需要适配的模式

| 适配点      | Marimo 方式                 | VT 方式               |
| ----------- | --------------------------- | --------------------- |
| 状态管理    | Jotai atoms                 | Zustand stores        |
| 日志        | `@/utils/Logger`            | `console.*`           |
| 剪贴板      | `@/utils/copy`              | `navigator.clipboard` |
| Toast       | `@/utils/toast`             | VT toast (待补)       |
| 路由        | React Router                | Next.js App Router    |
| CSS         | Tailwind v3                 | Tailwind v4           |
| WebSocket   | 真实 kernel                 | Mock/无               |
| CellId 工具 | `core/cells/ids.ts`         | 简化 string ID        |
| VFS         | `@/utils/virtualFileSystem` | 不需要                |

---

## Phase 3 迁移顺序

```
Wave 1: 基础设施（无 marimo 内部依赖）
  ├── utils/ 工具函数
  ├── hooks/ React hooks
  ├── theme/ + css/ 样式
  └── components/ui/ UI 原语补充

Wave 2: 核心层
  ├── core/cells/ Cell 状态管理
  ├── core/hotkeys/ 热键系统（补全）
  ├── core/codemirror/ CodeMirror 扩展
  ├── core/state/ 全局状态
  └── core/dom/ DOM 工具

Wave 3: 编辑器组件
  ├── components/editor/cell/ Cell 组件
  ├── components/editor/actions/ Action 系统
  ├── components/editor/chrome/ 编辑器外壳
  ├── components/editor/output/ 输出渲染
  └── components/editor/navigation/ 导航

Wave 4: 功能组件
  ├── components/find-replace/
  ├── components/shortcuts/
  ├── components/variables/
  ├── components/dependency-graph/
  └── components/data-table/

Wave 5: AI + 高级功能
  ├── core/ai/
  ├── components/ai/
  └── components/chat/
```

---

## 注意事项

1. **copy-paste 原则**: 从 Marimo 源码直接复制，每个文件标注来源行号
2. **删减标注**: 每处修改必须在注释中说明 Marimo 原始行号和修改原因
3. **构建验证**: 每波迁移后 `nx run web:build` 验证
4. **不重复造轮子**: 已迁移的文件（Batch 1/2）不重复迁移
