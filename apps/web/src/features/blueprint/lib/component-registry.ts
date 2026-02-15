import { lazy } from "react";

/**
 * Registry of React components that can be referenced by name
 * from .md frontmatter via `render: component` + `component: "Name"`.
 *
 * All entries use React.lazy for code-splitting.
 */
export const COMPONENT_REGISTRY: Record<
  string,
  React.LazyExoticComponent<React.ComponentType>
> = {
  // Category B wireframes (existing TSX sections)
  ScreenerWireframe: lazy(() =>
    import("../sections/screener-wireframe").then((m) => ({
      default: m.ScreenerWireframe,
    })),
  ),

  // Future real components will be registered here, e.g.:
  // FactorZooStats: lazy(() => import('@/features/factor/components/factor-zoo-stats')),
};
