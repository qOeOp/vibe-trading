在 ngx-charts 库中添加或修改图表组件 "$ARGUMENTS"。

步骤：

1. 读取 `apps/web/src/lib/ngx-charts/` 下现有图表的目录结构，理解 ngx-charts 的架构模式
2. 查看一个类似图表的实现作为参考（如 line-chart 或 bar-chart）
3. 遵循 ngx-charts 架构：
   - `BaseChart` 包装器（ResizeObserver）
   - `useXChart(config)` hook 返回 `{dims, xScale, yScale, transform}`
   - `<motion.path>` 动画，initial/animate/exit 都必须有 `d` 属性
   - `useChartTooltip()` tooltip 集成
4. 创建/修改图表组件，确保数据通过 props 传入（不在图表内做数据转换）
5. 如果是新图表，在对应 feature 目录创建数据 hook
