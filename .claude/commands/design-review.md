审查最近修改的前端代码是否符合 Mine 主题设计规范。

步骤：

1. 运行 `git diff --name-only` 获取已修改文件列表，筛选 `apps/web/src/` 下的 `.tsx` 文件
2. 读取 `.claude/rules/component-design-system.md` 中的 §9 常见错误清单
3. 逐文件检查以下违规：
   - 卡片使用了玻璃拟态（`bg-white/5 backdrop-blur`）而非 `bg-white shadow-sm border border-mine-border rounded-xl`
   - 数值缺少 `font-mono tabular-nums`
   - 使用了硬编码 hex 颜色而非语义 token（如 `#2EBD85` 应为 `text-market-down-medium`）
   - 缺少 `data-slot` 属性
   - 使用了 default export（page.tsx/layout.tsx 除外）
   - 缺少 hover 态
   - 加载状态使用了 spinner 而非 Skeleton
4. 输出违规报告，按严重程度排序
