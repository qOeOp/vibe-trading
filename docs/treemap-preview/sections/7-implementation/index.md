# Section 7: Implementation

React hooks, utility functions, theme configuration, and performance optimization patterns.

---

## Threads

### [Hooks](./threads/hooks/index.md)
useTreeMap (D3 squarified layout), useDrillDown (4-level navigation, planned), useDebouncedValue.

### [Utils](./threads/utils/index.md)
Color calculation functions (getTileBackgroundColor), formatters (formatCapitalFlow, formatChangePercent), sparkline point calculation.

### [Theme](./threads/theme/index.md)
Design tokens (white background, 7-stop color ramp, continuous font scaling, Chinese market colors). See [Theme Config task](./threads/theme/tasks/01-theme-config.md) for canonical values.

### [Performance](./threads/performance/index.md)
GPU acceleration (will-change, transform3d), reduced motion support, responsive degradation, React.memo optimization.

---

## Implementation Principles

**Single Responsibility Principle:**
```typescript
// ✅ CORRECT: Layout calculation in hook
const nodes = useTreeMap({ data, width, height });

// ✅ CORRECT: UI rendering in component
{nodes.map(node => <HeatMapTile {...node} />)}

// ❌ WRONG: Mixed concerns
<HeatMapTile calculateLayout={true} />
```

**DRY Principle:**
- Color logic centralized in `utils/colorUtils.ts`
- Format functions reused across components
- Animation configs in single source of truth

**Performance First:**
- CSS animations for simple effects (ripple, draw-line)
- Framer Motion only for complex interactions (drill-down)
- Conditional rendering based on viewport size
