# Phase 3: 模块联动设计文档

**日期**: 2026-02-28
**作者**: Claude (CTO)
**状态**: 已确认，待实现

---

## 目标

Mining 挖出的因子可以持久推送到 Library，Library 中的挖掘因子可以一键在 Lab 中打开编辑，知识库数据跨任务共享。

## 背景

- Phase 1 (`feature/phase1-rdagent-integration`): vt_mining 后端 — RD-Agent 集成、任务管理、SSE 流
- Phase 2 (`feature/phase2-mining-tab`): 前端 Mining Tab — 任务列表、实时进度、FactorResultCard
- Phase 3 (本阶段): 模块联动 — Mining → Library → Lab 的完整流转

## 架构概览

```
Mining Tab              vt_mining backend         SQLite                Library Tab          Lab
[推送到Library] ──→  POST /api/library/factors ──→ knowledge.db  ◄──  GET /api/library/factors ──→ addFactor()
                                                   mining_factors
[在Lab中编辑]  ◄──────────────────────────────────────────────────────── [在Lab中编辑]
                                                                              │
                                                                              ▼
                                                               POST /api/lab/files/resolve
                                                                              │
                                                                              ▼
                                                               navigate /lab?file=~/.vt-lab/...
                                                                              │
                                                                              ▼
                                                               Lab: ?file= → expand tree + open cell
```

## 已确认设计决策

| 决策 | 选择 | 理由 |
|------|------|------|
| 推送持久化方式 | SQLite source of truth | Library 需要跨会话、跨任务保留挖掘因子 |
| mock 数据处理 | 与 mining 因子共存 | mock 因子供演示，`source` 字段区分来源 |
| Lab 跳转方式 | 同页导航 `/lab?file=...` + workspace 关联 | 保持单页应用体验；Lab 可感知要打开的文件 |

## 数据模型

### SQLite schema (`~/.vt-lab/knowledge.db`)

```sql
CREATE TABLE IF NOT EXISTS mining_factors (
  id             TEXT PRIMARY KEY,        -- "{task_id}_{factor_id}"
  task_id        TEXT NOT NULL,
  name           TEXT NOT NULL,
  expression     TEXT NOT NULL,           -- RD-Agent 生成的因子表达式
  hypothesis     TEXT,                    -- 挖掘时的假设描述
  ic_mean        REAL,
  ic_ir          REAL,
  annual_return  REAL,
  sharpe_ratio   REAL,
  max_drawdown   REAL,
  code_file      TEXT NOT NULL,           -- 绝对路径: ~/.vt-lab/mining/{date}/{hash}/factor.py
  workspace_path TEXT,                    -- Lab 关联后填入，初始 NULL
  status         TEXT DEFAULT 'INCUBATING',
  created_at     TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_mining_factors_task_id ON mining_factors(task_id);
CREATE INDEX IF NOT EXISTS idx_mining_factors_status  ON mining_factors(status);
```

### 前端 Factor 类型扩展 (library/types.ts)

现有字段已支持：
- `source: "mining_llm"` ✅
- `status: "INCUBATING"` ✅

新增字段：
```ts
// 挖掘来源元数据（source === "mining_llm" 时存在）
codeFile?: string        // factor.py 绝对路径
workspacePath?: string   // Lab workspace 关联路径（关联后才有）
taskId?: string          // 来源任务 ID
```

### API Response — LibraryFactor

`GET /api/library/factors` 和 `POST /api/library/factors` 返回的 JSON 结构需要映射到前端 `Factor` 类型：

```json
{
  "id": "task_abc123_factor_0",
  "task_id": "task_abc123",
  "name": "MomentumReversal_5d",
  "expression": "(close - delay(close, 5)) / delay(close, 5)",
  "hypothesis": "短期动量反转，基于5日收益率",
  "ic_mean": 0.024,
  "ic_ir": 0.81,
  "annual_return": 0.187,
  "sharpe_ratio": 1.42,
  "max_drawdown": -0.083,
  "code_file": "/Users/vx/.vt-lab/mining/2026-02-28/abc123/factor.py",
  "workspace_path": null,
  "status": "INCUBATING",
  "created_at": "2026-02-28T10:30:00Z"
}
```

## 后端变更

### 文件结构 (Phase 1 分支)

```
apps/vibe-editor/
├── vt_mining/
│   ├── knowledge.py          # NEW: KnowledgeStore (SQLite CRUD)
│   ├── library_routes.py     # NEW: GET/POST /api/library/factors
│   └── routes.py             # MODIFY: import + mount library_routes
├── vt_sessions/
│   ├── file_routes.py        # NEW: POST /api/lab/files/resolve
│   └── routes.py             # MODIFY: import + mount file_routes
└── router.py                 # MODIFY: mount new route modules
```

### Task 1: KnowledgeStore (`vt_mining/knowledge.py`)

```python
class KnowledgeStore:
    def __init__(self, db_path: str = "~/.vt-lab/knowledge.db"):
        self.db_path = os.path.expanduser(db_path)
        os.makedirs(os.path.dirname(self.db_path), exist_ok=True)
        self._init_schema()

    def _init_schema(self): ...
    def add_factor(self, factor: MiningFactorRecord) -> MiningFactorRecord: ...
    def get_factor(self, factor_id: str) -> MiningFactorRecord | None: ...
    def list_factors(self, status: str | None = None) -> list[MiningFactorRecord]: ...
    def update_workspace_path(self, factor_id: str, workspace_path: str): ...
```

### Task 2: Library Routes (`vt_mining/library_routes.py`)

```
GET  /api/library/factors          → list_factors()，支持 ?status= 过滤
POST /api/library/factors          → add_factor()，body: DiscoveredFactor
GET  /api/library/factors/{id}     → get_factor()
```

### Task 3: File Resolve Route (`vt_sessions/file_routes.py`)

```
POST /api/lab/files/resolve
  body: { "code_file": str, "factor_id": str }

  逻辑:
  1. 查 KnowledgeStore：已有 workspace_path → 直接返回
  2. 没有 → 从 code_file 解析 {date}/{hash}/factor.py
  3. 复制到 ~/.vt-lab/workspace/{date}/{factor_name}/factor.py
  4. 更新 KnowledgeStore.workspace_path
  5. 返回 { "workspace_path": str }
```

## 前端变更

### 文件结构 (Phase 2 分支)

```
apps/web/src/
├── features/library/
│   ├── types.ts                          # MODIFY: 新增 codeFile/workspacePath/taskId 字段
│   ├── store/use-library-store.ts        # MODIFY: addFactor + fetchMiningFactors
│   └── components/factor-data-table/    # MODIFY: 新增"在Lab中编辑"操作列
├── features/factor/mining/
│   └── components/task-detail-panel.tsx # MODIFY: 推送按钮接线
└── features/lab/
    └── components/lab-page.tsx          # MODIFY: ?file= query param 处理
```

### Task 4: Library store 扩展

```ts
// use-library-store.ts 新增
addFactor: (factor: Factor) => void
fetchMiningFactors: () => Promise<void>   // GET /api/library/factors → addFactor()
```

`fetchMiningFactors` 在 Library 页面 `useEffect` 挂载时调用一次，去重逻辑：已存在 `id` 则跳过。

### Task 5: Mining 推送按钮 + Library 操作列

**Mining `TaskDetailPanel` — 推送按钮**:
```
点击 → POST /api/library/factors →
  成功 → addFactor(response) → 按钮变为"已推送到Library ✓"(disabled)
  失败 → 显示错误 toast
```

**Library FactorDataTable — 操作列** (仅 `source === "mining_llm"` 的行显示):
```
[在Lab中编辑] 按钮 →
  POST /api/lab/files/resolve { code_file, factor_id } →
  成功 → router.push(`/lab?file=${encodeURIComponent(workspace_path)}`)
  失败 → toast 错误
```

### Task 6: Lab ?file= query param

**`lab-page.tsx`** — 读取 `?file=` URL 参数：

```
useSearchParams() → fileParam
fileParam 存在 →
  等待 kernel 连接成功后 →
  向 marimo iframe 发送消息 openFile(fileParam)
  OR
  调用 marimo 的 open_file API (待确认 marimo 支持哪种方式)
```

marimo 文件打开方案（两选一，实现时确认）：
- A: `GET /api/kernel/open?file=...` — marimo 内部 API
- B: 通过 Lab file tree 的 `useMarimoFileTree()` 选中节点 → 触发 open

file tree 展开：resolve 后的 workspace_path → 解析出目录层级 → 调用 file tree 的 `expandPath(dir)` action。

## 任务列表

| # | 任务 | 分支 | 估算 |
|---|------|------|------|
| 1 | KnowledgeStore: SQLite init + CRUD | Phase 1 | 1h |
| 2 | `/api/library/factors` GET/POST 路由 | Phase 1 | 1h |
| 3 | `/api/lab/files/resolve` POST 路由 + workspace 复制 | Phase 1 | 1.5h |
| 4 | Library store: addFactor + fetchMiningFactors | Phase 2 | 1h |
| 5 | Mining 推送按钮 + Library"在Lab中编辑"按钮 | Phase 2 | 1.5h |
| 6 | Lab ?file= query param → auto-open + tree expand | Phase 2 | 2h |

**执行顺序**: 任务 1→2→3 (后端，Phase 1 分支) 然后 4→5→6 (前端，Phase 2 分支)。
前端 4-5 可以先 mock API，等后端就绪后联调。

## 验收标准 (Layer 4 from 设计文档)

- [ ] Mining tab 点"推送到Library" → Library 中出现新因子（INCUBATING）
- [ ] Library 中挖掘因子 `source` 显示为 "mining_llm"
- [ ] 刷新页面后挖掘因子仍在 Library（SQLite 持久化）
- [ ] Library 中挖掘因子显示正确路径引用和指标（ic_mean/ic_ir/SR/MDD）
- [ ] Library 点"在Lab中编辑" → `/lab` 页面打开且 file tree 展开到因子文件
- [ ] 知识库 SQLite 写入成功（`~/.vt-lab/knowledge.db` 可查询）

## 未解决事项

1. **Lab openFile 机制**: marimo 是否有 `/api/kernel/open` 端点，还是需要通过 file tree jotai atom 触发？实现 Task 6 时先查 marimo 源码确认。
2. **重复推送处理**: 同一 `factor_id` 第二次推送是报错还是 upsert？建议 upsert（幂等）。
3. **mock 数据 ic/IR 字段对齐**: `DiscoveredFactor` 的 `icMean/icIr` vs Library `Factor` 的 `icStats` — 需要在 Task 4 的 addFactor 中做字段映射，mock 掉 Library 要求的其余字段（icSparkline、quantileReturns 等）。
