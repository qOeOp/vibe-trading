# Section 7: Implementation

React hooks, utility functions, theme configuration, and performance optimization patterns.

---

## Threads

### [Hooks](./threads/hooks/index.md)
useTreeMap (Recharts layout calculation), useDrillDown (4-level navigation state).

### [Utils](./threads/utils/index.md)
Color calculation functions (getTileBackgroundColor), formatters (formatCapitalFlow, formatChangePercent), sparkline point calculation.

### [Theme](./threads/theme/index.md)
Tailwind configuration, CSS custom properties, dark mode setup, color variables.

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
