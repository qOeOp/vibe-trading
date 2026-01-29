# Treemap Preview Application

**Status:** In Development
**Version:** 3.0 (Modular Structure)
**Last Updated:** 2026-01-29

---

## Overview

Independent Next.js application for visualizing 31 SW Level-1 sector indices with glassmorphism effects, 4-level drill-down navigation, and Chinese market color conventions (red=up, green=down).

**Design Source:** [Figma - Landing Page](https://www.figma.com/design/O52eqHmOTyh0tzZwpC7sl9/landing-page?node-id=524-11)

---

## Sections

### 1. [Overview](./sections/1-overview/index.md)
Project purpose, design source, and key features overview.

### 2. [Architecture](./sections/2-architecture/index.md)
System architecture, data flow, and technology stack specifications.

### 3. [Data Model](./sections/3-data-model/index.md)
TypeScript type definitions, mock data for all 4 levels, and icon mappings.

### 4. [Layout](./sections/4-layout/index.md)
Page layout structure, container dimensions, tile constraints, and responsive strategy.

### 5. [Components](./sections/5-components/index.md)
Detailed specifications for all UI components (HeatMap, Tile, Sparkline, etc.).

### 6. [Visual Design](./sections/6-visual-design/index.md)
Color system, glassmorphism effects, 3D hover interactions, and animation specifications.

### 7. [Implementation](./sections/7-implementation/index.md)
React hooks, utility functions, theme configuration, and performance optimizations.

### 8. [Development](./sections/8-development/index.md)
Project setup, development commands, testing strategies, and build processes.

---

## Quick Start

```bash
# Start development server
npx nx serve preview

# Build for production
npx nx build preview

# Access URL
http://localhost:4300
```

---

## Design Principles

1. **Independence**: Complete decoupling from `apps/web`
2. **DRY**: No content duplication, use references
3. **SRP**: Clear separation of layout logic from UI rendering
4. **Accessibility**: WCAG 2.0 AA compliance (3:1 contrast minimum)
5. **Finance Aesthetics**: Conservative black/white/gray tones, red/green for price changes only

---

## Navigation Guide

This documentation follows a hierarchical structure:

**Section** → **Thread** → **Task**

- **Section**: Major functional area (e.g., Components, Visual Design)
- **Thread**: Specific topic within a section (e.g., HeatMapTile, Glassmorphism)
- **Task**: Smallest executable unit with Design + Implementation + Acceptance Criteria

Each level has an `index.md` with references to child items.
