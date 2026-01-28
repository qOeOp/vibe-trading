# Design Document Restructure Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Completely restructure the 2745-line design document with clear hierarchy, eliminate redundancy, fix numbering conflicts, and add comprehensive table of contents.

**Architecture:** Document will be reorganized into 14 logical sections with consistent structure. Success Criteria will be renumbered 1-77 sequentially. All Visual Design content consolidated into Section 6. Mock Data consolidated into Section 4. Code examples referenced but kept inline for context.

**Tech Stack:** Markdown, careful text editing, structural reorganization

---

## Pre-Execution Checklist

- [x] Original document backed up: `2026-01-28-treemap-preview-design.backup.md`
- [x] Audit report generated with all identified issues
- [ ] New document structure approved
- [ ] Ready to execute restructure

---

## Task 1: Create Document Header & Table of Contents

**Files:**
- Modify: `docs/plans/2026-01-28-treemap-preview-design.md` (entire file)

**Step 1: Read current document header (lines 1-20)**

Read the existing document to preserve metadata.

**Step 2: Create new header with metadata**

```markdown
# Treemap Preview Application Design

**Date:** 2026-01-28
**Status:** Approved
**Type:** New Feature - Independent Preview Application
**Version:** 2.0 (Restructured)
**Last Updated:** 2026-01-28

---
```

**Step 3: Create comprehensive table of contents**

Add full TOC with all 14 sections and subsections:

```markdown
## 📑 Table of Contents

### 1. [Overview](#1-overview)
- 1.1 Purpose & Scope
- 1.2 Design Source
- 1.3 Key Features

### 2. [System Architecture](#2-system-architecture)
- 2.1 System Flow
- 2.2 Data Flow
- 2.3 Technology Stack

### 3. [Project File Structure](#3-project-file-structure)
- 3.1 Directory Layout
- 3.2 Component Files
- 3.3 Configuration Files

### 4. [Data Model & Mock Data](#4-data-model--mock-data)
- 4.1 Type Definitions
- 4.2 Level 1: SW Industry Sectors (31 items)
- 4.3 Level 2: Sub-Industries (8 items under 电子)
- 4.4 Level 3: Tertiary Industries (7 items under 半导体)
- 4.5 Level 4: Individual Stocks (15 items under 光学光电子)
- 4.6 Sector Icon System (31 Lucide mappings)

### 5. [Code Architecture](#5-code-architecture)
- 5.1 Single Responsibility Principle
- 5.2 Component Hierarchy
- 5.3 Hooks & State Management

### 6. [Visual Design System](#6-visual-design-system)
- 6.1 Base Design (Figma Specifications)
- 6.2 Glassmorphism Effects
- 6.3 3D Hover Interaction
- 6.4 Animation System

### 7. [Layout & Dimensions](#7-layout--dimensions)
- 7.1 Page Layout
- 7.2 HeatMap Container Dimensions
- 7.3 Tile Shape & Size Constraints
- 7.4 Header Design & Scroll Effects

### 8. [Component Specifications](#8-component-specifications)
- 8.1 HeatMap
- 8.2 HeatMapHeader
- 8.3 HeatMapTile
- 8.4 TileBottomPanel
- 8.5 Sparkline
- 8.6 BreathingDot
- 8.7 Breadcrumb
- 8.8 SearchBox
- 8.9 DynamicBackground
- 8.10 SpotlightEffect

### 9. [Implementation Guide](#9-implementation-guide)
- 9.1 Data Usage & Page Setup
- 9.2 Color Calculation Functions
- 9.3 Animation Configuration
- 9.4 Theme Integration

### 10. [Development Workflow](#10-development-workflow)
- 10.1 Development Commands
- 10.2 Port Assignments
- 10.3 Build & Test Process

### 11. [Success Criteria](#11-success-criteria)
- 11.1 Functionality (1-4)
- 11.2 Visual Design (5-8)
- 11.3 Layout & Dimensions (9-16)
- 11.4 Tile Shape & Size (17-21)
- 11.5 Header Components (22-28)
- 11.6 Architecture & Code Quality (29-32)
- 11.7 Glassmorphism Effects (33-41)
- 11.8 Animation System (42-46)
- 11.9 Advanced Features (47-49)
- 11.10 3D Hover Interaction (50-59)
- 11.11 Sector Icons (60-65)
- 11.12 Header Scroll Effects (66-71)
- 11.13 Sparkline Animations (72-77)

### 12. [Design Principles](#12-design-principles)
- 12.1 Complete Independence from apps/web
- 12.2 Required Development Tools
- 12.3 Component Development Workflow

### 13. [Technical Decisions](#13-technical-decisions)
- 13.1 Why Next.js instead of Vite?
- 13.2 Why Independent App?
- 13.3 Why Recharts for Layout?

### 14. [Future Considerations](#14-future-considerations)
- 14.1 Phase 2: API Integration
- 14.2 Phase 2: Interactive Features
- 14.3 Integration into apps/web

### 15. [Non-Goals](#15-non-goals)

### 16. [Appendices](#16-appendices)
- Appendix A: Detailed Code Examples
- Appendix B: Figma Design References

---
```

**Step 4: Verify TOC structure**

Check that:
- All section numbers are sequential (1-16)
- All subsections use proper nesting
- Anchor links use lowercase with hyphens
- No duplicate section names

**Step 5: Commit header and TOC**

```bash
git add docs/plans/2026-01-28-treemap-preview-design.md
git commit -m "docs(design): Add version 2.0 header and comprehensive TOC

- Add document metadata with version 2.0
- Create 16-section table of contents
- Define all subsection hierarchy
- Prepare for complete restructure

Part of design document restructure initiative."
```

---

## Task 2: Restructure Section 1 (Overview)

**Files:**
- Modify: `docs/plans/2026-01-28-treemap-preview-design.md` (Section 1)

**Step 1: Extract current overview content**

Read lines 7-20 (current overview) and lines 11-20 (design source).

**Step 2: Write consolidated Section 1**

```markdown
## 1. Overview

### 1.1 Purpose & Scope

Create an independent HeatMap visualization page for displaying 31 SW Level-1 sector indices. The application will be built as a standalone Next.js app (`apps/preview`) for rapid UI/UX iteration, then integrated into `apps/web` once finalized.

**Key Goals:**
- Pure frontend development with mock data (no API in Phase 1)
- Focus on visual design and glassmorphism effects
- Support 4-level drill-down (sector → industry → sub-industry → stock)
- Advanced 3D hover interactions with sparkline trends
- Complete design independence from existing apps/web components

### 1.2 Design Source

**Figma:** https://www.figma.com/design/O52eqHmOTyh0tzZwpC7sl9/landing-page?node-id=524-11

**Visual Characteristics:**
- Sector tiles sized proportionally by market capitalization
- Color-coded by performance (Chinese market convention: **red=up, green=down**)
- Glassmorphism aesthetic with backdrop blur and transparency
- 4px gaps between tiles for crystal edge refraction
- Tile displays: sector name (top-left), breathing indicator (top-right), capital flow + change% (bottom-right)
- Supports light/dark theme with accessible border contrast (WCAG 2.0 AA: 3:1 minimum)

### 1.3 Key Features

**Visual Effects:**
- ✅ Glassmorphism (backdrop-filter blur, semi-transparent layers)
- ✅ 3D hover interaction (tile elevation, panel separation, sparkline reveal)
- ✅ Framer Motion animations (drill-down, stagger, transitions)
- ✅ Dynamic background with animated color blocks
- ✅ Optional spotlight effect (mouse-following)

**Interaction:**
- ✅ 4-level drill-down navigation
- ✅ Hover-triggered sparkline with 30-day trend
- ✅ Breathing indicator (frequency based on attention level)
- ✅ Sector icons (31 Lucide icons for visual metaphors)

**Technical:**
- ✅ Single Responsibility Principle (layout logic decoupled from UI)
- ✅ Mock data for all 4 levels (31 sectors + sub-levels)
- ✅ Adaptive content degradation (based on tile size)
- ✅ Variable speed color mapping (non-linear intensity)

---
```

**Step 3: Delete old overview content**

Remove the fragmented overview content from original locations (lines 7-43).

**Step 4: Verify section completeness**

Check that Section 1 includes:
- Clear purpose statement
- Figma link and visual description
- Complete feature list
- No redundant information

**Step 5: Commit Section 1**

```bash
git add docs/plans/2026-01-28-treemap-preview-design.md
git commit -m "docs(design): Restructure Section 1 (Overview)

- Consolidate overview into 3 subsections
- Add comprehensive feature list
- Include Figma design characteristics
- Remove fragmented content

Part 2 of design document restructure."
```

---

## Task 3: Restructure Section 2 (System Architecture)

**Files:**
- Modify: `docs/plans/2026-01-28-treemap-preview-design.md` (Section 2)

**Step 1: Extract system architecture content**

Read lines 22-42 (current Architecture section).

**Step 2: Rename and reorganize**

Rename `## Architecture` → `## 2. System Architecture` (to distinguish from Code Architecture).

**Step 3: Write System Architecture section**

```markdown
## 2. System Architecture

### 2.1 System Flow

```
Browser (localhost:4300 dev / localhost:4200/preview prod)
    ↓
apps/preview (Next.js 15 + React 19)
    ↓
Mock Data (hardcoded TypeScript arrays)
    ↓
HeatMap Visualization
    ├─ useTreeMap Hook → Layout Calculation
    ├─ HeatMapTile Components → UI Rendering
    └─ useDrillDown Hook → Navigation State
```

### 2.2 Data Flow

**Phase 1 (Current):**
1. **Frontend mock data** - Hardcoded array of 31 SW Level-1 sectors
2. **Preview app** - Uses mock data directly for rendering
3. **No API calls** - Pure frontend development for UI iteration
4. **Pure display mode** - No user interactions beyond hover

**Note:** API integration will be added in Phase 2. Current focus is UI design and styling.

### 2.3 Technology Stack

**Frontend Framework:**
- **Next.js 15** - Static export mode for deployment
- **React 19** - UI library with latest features
- **TypeScript** - Type-safe development
- **Tailwind CSS v4** - Utility-first styling with OKLCH color space
- **Framer Motion** - Animation library for drill-down and hover effects

**Visualization:**
- **Recharts v3** - Treemap layout calculation only (not for rendering)
- **Custom SVG rendering** - For glassmorphism and 3D effects

**UI Components:**
- **Lucide React** - Icon system (31 sector icons)
- **Custom components** - Built using `/ui-ux-pro-max` skill patterns

**Build Tools:**
- **Nx 22.3.3** - Monorepo tooling
- **ESBuild** - Fast bundling
- **PostCSS** - CSS processing

---
```

**Step 4: Remove old Architecture section**

Delete lines 22-42 (old Architecture section).

**Step 5: Commit Section 2**

```bash
git add docs/plans/2026-01-28-treemap-preview-design.md
git commit -m "docs(design): Restructure Section 2 (System Architecture)

- Rename from 'Architecture' to 'System Architecture'
- Add comprehensive tech stack details
- Clarify system and data flow
- Distinguish from Code Architecture section

Part 3 of design document restructure."
```

---

## Task 4: Consolidate Section 4 (Data Model & Mock Data)

**Files:**
- Modify: `docs/plans/2026-01-28-treemap-preview-design.md` (Section 4)

**Step 1: Extract all mock data sections**

Read:
- Lines 78-356: Current "Data Model" section
- Lines 540-779: Current "4-Level Drill-Down Mock Data"
- Lines 357-539: Current "Sector Icon System"

**Step 2: Consolidate into unified Section 4**

Structure:
```markdown
## 4. Data Model & Mock Data

### 4.1 Type Definitions
[TypeScript interfaces]

### 4.2 Level 1: SW Industry Sectors (31 items)
[Complete 31-sector data]

### 4.3 Level 2: Sub-Industries (8 items under 电子)
[8 industries data]

### 4.4 Level 3: Tertiary Industries (7 items under 半导体)
[7 sub-industries data]

### 4.5 Level 4: Individual Stocks (15 items under 光学光电子)
[15 stocks data]

### 4.6 Sector Icon System (31 Lucide mappings)
[Icon mappings table and implementation]
```

**Step 3: Merge duplicate BaseEntity definitions**

Keep only one definition of BaseEntity, Sector, Industry, SubIndustry, Stock types.

**Step 4: Remove duplicate mock data**

Ensure each level (1-4) appears only once in Section 4.

**Step 5: Add data characteristics summary**

At end of 4.2, add:
```markdown
**Data Characteristics:**
- Total: 31 sectors (complete SW Level-1 classification)
- Market Cap Range: ¥9,800亿 to ¥45,200亿
- Change Range: -2.85% to +3.25%
- Capital Flow Range: -¥720亿 to +¥1,050亿
- Attention Level Range: 22 to 95
```

**Step 6: Commit Section 4**

```bash
git add docs/plans/2026-01-28-treemap-preview-design.md
git commit -m "docs(design): Consolidate Section 4 (Data Model & Mock Data)

- Merge duplicate mock data sections
- Organize into 4-level hierarchy
- Add sector icon mappings as 4.6
- Remove redundant type definitions
- Add data characteristics summary

Part 4 of design document restructure."
```

---

## Task 5: Restructure Section 5 (Code Architecture)

**Files:**
- Modify: `docs/plans/2026-01-28-treemap-preview-design.md` (Section 5)

**Step 1: Extract code architecture content**

Read lines 780-852 (current "Architecture Design" section).

**Step 2: Rename and reorganize**

Rename `## Architecture Design` → `## 5. Code Architecture`.

**Step 3: Write Code Architecture section**

```markdown
## 5. Code Architecture

### 5.1 Single Responsibility Principle

**⚠️ Critical: Layout Calculation MUST be decoupled from UI Rendering**

**Separation of Concerns:**

1. **useTreeMap Hook** (Layout Calculation)
   - Pure logic, no UI dependencies
   - Calculates tile positions, sizes, aspect ratios
   - Implements 150px minimum size constraints
   - Enforces 1:1 to 1:1.618 aspect ratio
   - Returns computed layout data structure
   - Location: `hooks/useTreeMap.ts`

2. **HeatMapTile Component** (UI Rendering)
   - Pure presentation, receives layout props
   - Implements glassmorphism visual effects
   - Handles animations (Framer Motion)
   - Renders breathing indicator, content
   - No layout calculation logic
   - Location: `components/HeatMapTile.tsx`

**Data Flow:**
```typescript
// Hook: Layout calculation (pure logic)
const { tiles, totalHeight } = useTreeMap({
  data: sectors,
  containerWidth: 920,
  maxHeight: 580,
  minTileSize: 150,
  gap: 4
});

// Component: UI rendering (presentation)
{tiles.map(tile => (
  <HeatMapTile
    key={tile.id}
    x={tile.x} y={tile.y}
    width={tile.width} height={tile.height}
    sector={tile.data}
  />
))}
```

### 5.2 Component Hierarchy

```
App (layout.tsx + page.tsx)
  └── HeatMap.tsx (container component)
        ├── HeatMapHeader.tsx
        │     ├── Breadcrumb.tsx
        │     └── SearchBox.tsx
        └── HeatMapTile.tsx × 31 (level 1) or more (levels 2-4)
              ├── BreathingDot.tsx (top-right)
              └── TileBottomPanel.tsx (bottom 1/3, on hover)
                    └── Sparkline.tsx (trend line)
                          └── BreathingDot.tsx (end point)

Background Layers:
  ├── DynamicBackground.tsx (animated color blocks)
  └── SpotlightEffect.tsx (optional, mouse-following)
```

### 5.3 Hooks & State Management

**5.3.1 useTreeMap Hook**

```typescript
interface UseTreeMapOptions {
  data: BaseEntity[];
  containerWidth: number;
  maxHeight: number;
  minTileSize: number;
  gap: number;
}

interface TreeMapLayout {
  tiles: TileLayout[];
  totalHeight: number;
}

function useTreeMap(options: UseTreeMapOptions): TreeMapLayout
```

**5.3.2 useDrillDown Hook**

```typescript
interface DrillDownState {
  level: 1 | 2 | 3 | 4;
  path: (string | null)[];
  currentData: BaseEntity[];
  breadcrumb: string[];
}

interface UseDrillDownReturn {
  state: DrillDownState;
  drillDown: (entity: BaseEntity) => void;
  drillUp: () => void;
  reset: () => void;
}

function useDrillDown(): UseDrillDownReturn
```

---
```

**Step 4: Delete old Architecture Design section**

Remove lines 780-852.

**Step 5: Commit Section 5**

```bash
git add docs/plans/2026-01-28-treemap-preview-design.md
git commit -m "docs(design): Restructure Section 5 (Code Architecture)

- Rename from 'Architecture Design' to 'Code Architecture'
- Clarify SRP requirements for layout vs UI
- Add complete component hierarchy diagram
- Document hook interfaces and responsibilities

Part 5 of design document restructure."
```

---

## Task 6: Consolidate Section 6 (Visual Design System)

**Files:**
- Modify: `docs/plans/2026-01-28-treemap-preview-design.md` (Section 6)

**Step 1: Extract all visual design content**

Read:
- Lines 1212-1252: "Visual Design (from Figma)"
- Lines 1253-1382: "Glassmorphism Visual Design"
- Lines 1383-1784: "Advanced 3D Hover Interaction"
- Lines 1785-1873: "Framer Motion Animation System"
- Lines 1765-1784: "Visual Design Summary"

**Step 2: Create unified Section 6 structure**

Consolidate all visual design content into one section with subsections:

```markdown
## 6. Visual Design System

### 6.1 Base Design (Figma Specifications)

#### 6.1.1 Chinese Market Color Convention

**⚠️ Critical: Opposite of Western Markets**

- **Red (#D52CA2)** = Positive/Up = Bull market
- **Green (#039160)** = Negative/Down = Bear market

**Color Gradients:**
```
Red (Positive):
  Light: #F08FC8 (0-1% change)
  Medium: #D52CA2 (2-3% change) ⭐ Base color
  Deep: #A52380 (5%+ change)

Green (Negative):
  Light: #05C588 (0-1% change)
  Medium: #039160 (2-3% change) ⭐ Base color
  Deep: #026B45 (5%+ change)
```

#### 6.1.2 Typography

**Tile Text Hierarchy:**
- **Sector Name** (top-left):
  - Font size: 14-16px
  - Font weight: 600 (semi-bold)
  - Color: `rgba(255, 255, 255, 0.95)` (dark mode)
  - Color: `#111827` (light mode)
  - Text shadow: `0 1px 2px rgba(0,0,0,0.5)`

- **Capital Flow + Change%** (bottom-right):
  - Font size: 12px (capital flow), 10px (change%)
  - Font weight: 400 (normal)
  - Color: Theme-aware with text shadow

#### 6.1.3 Spacing & Layout

- **Tile Gap**: 4px (crystal edge refraction aesthetic)
- **Tile Padding**: 8-12px
- **Border Radius**: 8px (glass corners)
- **Container Padding**: 8px (prevents scrollbar overlap)

### 6.2 Glassmorphism Effects

#### 6.2.1 Glass Material Properties

**Base Glass Effect:**
```css
.heatmap-tile {
  /* Core glassmorphism */
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);

  /* Semi-transparent base */
  background: rgba(var(--tile-color-rgb), 0.15);

  /* Glass edge refraction */
  border: 1px solid;
  border-image: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.4),
    rgba(255, 255, 255, 0.1)
  ) 1;

  /* Surface texture */
  box-shadow:
    inset 0 1px 1px rgba(255, 255, 255, 0.25),
    inset 0 -1px 1px rgba(0, 0, 0, 0.1),
    0 10px 20px rgba(0, 0, 0, 0.4);

  border-radius: 8px;
}
```

**Color-Specific Tint:**
- Red tiles: `rgba(213, 44, 162, 0.15)`
- Green tiles: `rgba(3, 145, 96, 0.15)`
- Neutral: `rgba(107, 114, 128, 0.15)`

#### 6.2.2 Typography Layer

**Text Elevation Effect:**
```css
.tile-text {
  color: rgba(255, 255, 255, 0.95);
  text-shadow:
    0 1px 2px rgba(0, 0, 0, 0.5),
    0 2px 4px rgba(0, 0, 0, 0.3);
  filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.4));
}
```

Creates "floating above glass" effect.

#### 6.2.3 Dynamic Background Environment

**Layered Architecture:**
```
┌─────────────────────────────────┐
│ HeatMap Tiles (foreground)      │ ← Glass with content
├─────────────────────────────────┤
│ Color Blocks (mid-layer)        │ ← 60-100px blur
├─────────────────────────────────┤
│ Base Background (back-layer)    │ ← Solid dark
└─────────────────────────────────┘
```

**DynamicBackground Component:**
- Animated gradient blobs
- Colors: Red, Green, Purple (market sentiment)
- Blur: 60-100px
- Animation: 20s morphing

#### 6.2.4 Spotlight Effect (Optional)

**Configuration:**
```typescript
interface SpotlightConfig {
  enabled: boolean;
  size: number;        // 200-400px radius
  intensity: number;   // 0-1 brightness
  color: string;
  blend: 'screen' | 'overlay';
}
```

Mouse-following radial gradient overlay.

### 6.3 3D Hover Interaction

[Continue with complete 3D hover content...]

### 6.4 Animation System

[Continue with Framer Motion content...]

---
```

**Step 3: Remove duplicate visual design sections**

Delete:
- Lines 1212-1252 (old Visual Design)
- Lines 1253-1382 (old Glassmorphism)
- Lines 1765-1784 (Visual Design Summary)

Keep only the consolidated Section 6.

**Step 4: Cross-reference components**

Add notes like: "See Section 8.3 for HeatMapTile implementation details"

**Step 5: Commit Section 6**

```bash
git add docs/plans/2026-01-28-treemap-preview-design.md
git commit -m "docs(design): Consolidate Section 6 (Visual Design System)

- Merge 3+ visual design sections into unified system
- Add Base Design (Figma specs)
- Add Glassmorphism effects (complete)
- Add 3D Hover interaction (complete)
- Add Animation system (complete)
- Remove duplicate content

Part 6 of design document restructure."
```

---

## Task 7: Restructure Sections 7-10 (Layout, Components, Implementation, Workflow)

**Files:**
- Modify: `docs/plans/2026-01-28-treemap-preview-design.md` (Sections 7-10)

**Step 1: Extract and organize Section 7 (Layout & Dimensions)**

Read current scattered layout content and consolidate.

**Step 2: Extract and organize Section 8 (Component Specifications)**

Create individual subsections for each of the 10 components.

**Step 3: Extract and organize Section 9 (Implementation Guide)**

Consolidate implementation details from various sections.

**Step 4: Extract and organize Section 10 (Development Workflow)**

Combine development commands, ports, and process.

**Step 5: Commit Sections 7-10**

```bash
git add docs/plans/2026-01-28-treemap-preview-design.md
git commit -m "docs(design): Restructure Sections 7-10

Section 7: Layout & Dimensions
- Page layout specifications
- HeatMap dimensions (920px min, 580px max)
- Tile constraints (150px min, 1:1-1:1.618 ratio)
- Header design with scroll effects

Section 8: Component Specifications
- 10 component subsections (8.1-8.10)
- Each with props, behavior, implementation

Section 9: Implementation Guide
- Data usage patterns
- Color calculation functions
- Animation configuration
- Theme integration

Section 10: Development Workflow
- Commands (serve, build, lint, test)
- Port assignments (4300, 8201, 8203)
- Build and test process

Part 7 of design document restructure."
```

---

## Task 8: Renumber Success Criteria (Section 11)

**Files:**
- Modify: `docs/plans/2026-01-28-treemap-preview-design.md` (Section 11)

**Step 1: Extract all success criteria**

Read lines 2526-2636 (current Success Criteria).

**Step 2: Create sequential numbering 1-77**

Reorganize into 13 subsections with sequential numbering:

```markdown
## 11. Success Criteria

### 11.1 Functionality (1-4)

1. ✅ Independent app runs on port 4300
2. ✅ Displays 31 SW Level-1 sectors correctly
3. ✅ Tile sizes proportional to market cap
4. ✅ Mock data renders without errors

### 11.2 Visual Design (5-8)

5. ✅ Matches Figma visual design (layout, typography, spacing)
6. ✅ **Chinese market colors**: RED for up, GREEN for down (verified)
7. ✅ Light/dark theme toggle works correctly
8. ✅ Breathing indicator animates at correct frequency

### 11.3 Layout & Dimensions (9-16)

9. ✅ Page displays HeatMap in full-width layout
10. ✅ HeatMap minimum width: 920px (enforced)
11. ✅ HeatMap maximum height: 580px (enforced)
12. ✅ HeatMap container padding: 8px all sides (enforced)
13. ✅ Vertical scroll appears when height > 580px
14. ✅ Scrollbar does NOT overlap with tiles (8px padding prevents)
15. ✅ Height dynamically adjusts based on tile layout
16. ✅ Component supports scaling/zoom operations

### 11.4 Tile Shape & Size (17-21)

17. ✅ All tiles have aspect ratio between 1:1 and 1:1.618 (verified)
18. ✅ No vertical rectangles (width always ≥ height)
19. ✅ All tiles meet minimum width: 150px (verified)
20. ✅ All tiles meet minimum height: 150px (verified)
21. ✅ Tile content is readable and properly displayed

### 11.5 Header Components (22-28)

22. ✅ Header displays "Market Performance" title (left aligned)
23. ✅ Breadcrumb navigation below title
24. ✅ Search box with inline icon (rounded rectangle)
25. ✅ Search icon clickable, no visible button shape
26. ✅ Two toggles vertically stacked after search box
27. ✅ Toggle group height matches search box (40px)
28. ✅ Header layout responsive and properly aligned

### 11.6 Architecture & Code Quality (29-32)

29. ✅ Layout calculation (useTreeMap) decoupled from UI (HeatMapTile)
30. ✅ Single Responsibility Principle enforced
31. ✅ 4-level drill-down state management (useDrillDown)
32. ✅ Mock data for all 4 levels complete

### 11.7 Glassmorphism Effects (33-41)

33. ✅ Tile gap: 4px (crystal edge aesthetic)
34. ✅ Backdrop-filter blur(12px) glass effect
35. ✅ Semi-transparent background with color tint
36. ✅ Linear gradient borders (glass edge simulation)
37. ✅ Inset box-shadow (surface texture)
38. ✅ Drop shadow (0 10px 20px) for depth
39. ✅ Text with shadow (floating above glass)
40. ✅ Dynamic background (60-100px blur)
41. ✅ Spotlight effect (optional, configurable)

### 11.8 Animation System (42-46)

42. ✅ Framer Motion AnimatePresence integration
43. ✅ Drill-down animation (expand from parent)
44. ✅ Drill-up animation (reverse shrink)
45. ✅ Performance optimization (disable backdrop-filter during animation)
46. ✅ Stagger animation (20ms delay between tiles)

### 11.9 Advanced Features (47-49)

47. ✅ Adaptive content degradation (based on tile size)
48. ✅ Variable speed linear mapping (color intensity)
49. ✅ 4-level drill-down support (一级→二级→三级→股票)

### 11.10 3D Hover Interaction (50-59)

50. ✅ Tile lifts on hover (-12px Y-axis)
51. ✅ Enhanced shadow depth during hover
52. ✅ Bottom 1/3 panel separates from tile
53. ✅ Panel rotates along Z-axis (3deg right tilt)
54. ✅ Panel becomes transparent glass (0.3 opacity)
55. ✅ Original content fades out (capital flow + change%)
56. ✅ Sparkline chart fades in (2px stroke)
57. ✅ Breathing indicator dot at sparkline end (6px, 2s pulse)
58. ✅ 30-day trend data for all sectors/stocks
59. ✅ Smooth elastic transition (400ms cubic-bezier)

### 11.11 Sector Icons (60-65)

60. ✅ Lucide icons for all 31 sectors (visual metaphors)
61. ✅ Icon size: 16-18px, stroke-width: 2px
62. ✅ Icon color: rgba(255, 255, 255, 0.9)
63. ✅ Icon position: Left of sector name (6px gap)
64. ✅ Adaptive icon display (hidden on smallest tiles)
65. ✅ Icon identifier stored in mock data

### 11.12 Header Scroll Effects (66-71)

66. ✅ Header bottom edge gradient mask (80-100% fade)
67. ✅ Tiles fade naturally when scrolling under header
68. ✅ Background opacity transitions (0.2 → 0.6)
69. ✅ Shadow enhances during scroll (subtle → deep)
70. ✅ Smooth 300ms transition between states
71. ✅ Scroll state tracked and applied correctly

### 11.13 Sparkline Animations (72-77)

72. ✅ Area fill gradient (cyan → transparent)
73. ✅ Stroke-dasharray animation (0.4s draw)
74. ✅ Line draws from left to right
75. ✅ Breathing dot appears after line (0.4s delay)
76. ✅ Dot scale animation (0 → 1)
77. ✅ Continuous breathing pulse (2s cycle)

---
```

**Step 3: Verify no duplicate numbers**

Check that all numbers 1-77 appear exactly once.

**Step 4: Delete old Success Criteria section**

Remove lines 2526-2636 (old section with numbering conflicts).

**Step 5: Commit Section 11**

```bash
git add docs/plans/2026-01-28-treemap-preview-design.md
git commit -m "docs(design): Renumber Success Criteria 1-77 sequentially

- Fix all numbering conflicts
- Organize into 13 logical subsections
- Ensure each number 1-77 appears exactly once
- No duplicate or skipped numbers

Part 8 of design document restructure. Critical fix complete."
```

---

## Task 9: Restructure Sections 12-16 (Final Sections)

**Files:**
- Modify: `docs/plans/2026-01-28-treemap-preview-design.md` (Sections 12-16)

**Step 1: Reorganize Section 12 (Design Principles)**

Extract content from lines 2650-2695 and restructure.

**Step 2: Reorganize Section 13 (Technical Decisions)**

Extract content from lines 2696-2718 and restructure.

**Step 3: Create Section 14 (Future Considerations)**

Consolidate "Future Integration" and "Phase 2" content.

**Step 4: Update Section 15 (Non-Goals)**

Extract from lines 2637-2648, add documentation about what's excluded.

**Step 5: Create Section 16 (Appendices)**

Add:
- Appendix A: Cross-reference to code examples in document
- Appendix B: Figma design references

**Step 6: Commit Sections 12-16**

```bash
git add docs/plans/2026-01-28-treemap-preview-design.md
git commit -m "docs(design): Complete restructure with Sections 12-16

Section 12: Design Principles
- Independence from apps/web
- Required tools (/ui-ux-pro-max, Figma MCP)
- Component development workflow

Section 13: Technical Decisions
- Why Next.js vs Vite
- Why independent app
- Why Recharts for layout

Section 14: Future Considerations
- Phase 2: API integration
- Phase 2: Interactive features
- Integration into apps/web

Section 15: Non-Goals
- Complete list of excluded features
- Rationale for exclusions

Section 16: Appendices
- Code example references
- Figma design links

Part 9 (FINAL) of design document restructure."
```

---

## Task 10: Final Verification & Quality Check

**Files:**
- Modify: `docs/plans/2026-01-28-treemap-preview-design.md` (entire document)

**Step 1: Run structure verification**

Check:
- [ ] All 16 sections present (1-16)
- [ ] All TOC links work (test anchor navigation)
- [ ] All Success Criteria numbered 1-77 sequentially
- [ ] No duplicate section names
- [ ] No orphaned content

**Step 2: Run redundancy check**

Search for:
- Duplicate "Architecture" headers → Should be only System & Code
- Duplicate "Visual Design" content → Should be only Section 6
- Duplicate Mock Data → Should be only Section 4
- Duplicate type definitions → Should be only in 4.1

**Step 3: Verify cross-references**

Check that:
- Section 6 references Section 8 for components
- Section 9 references earlier sections for context
- Success Criteria reference correct section numbers

**Step 4: Count final document size**

```bash
wc -l docs/plans/2026-01-28-treemap-preview-design.md
```

Expected: ~2000-2200 lines (down from 2745, ~20-25% reduction).

**Step 5: Final commit**

```bash
git add docs/plans/2026-01-28-treemap-preview-design.md
git commit -m "docs(design): Complete version 2.0 restructure

SUMMARY:
- Added comprehensive TOC with 16 sections
- Fixed all Success Criteria numbering (1-77 sequential)
- Renamed Architecture sections (System vs Code)
- Consolidated Visual Design into Section 6
- Merged Mock Data into Section 4
- Removed ~20-25% redundancy
- Improved logical flow and cross-references

Document is now well-structured, easy to navigate, and ready
for implementation with /ui-ux-pro-max skill.

Version 2.0 restructure complete.
"
```

**Step 6: Delete backup if successful**

```bash
# Only if restructure is successful and verified
rm docs/plans/2026-01-28-treemap-preview-design.backup.md
```

---

## Post-Execution Checklist

After all tasks complete:

- [ ] Document size reduced by ~20-25%
- [ ] All 16 sections properly structured
- [ ] TOC added with working anchor links
- [ ] Success Criteria 1-77 sequential (no conflicts)
- [ ] No duplicate section names
- [ ] All redundancy removed
- [ ] Cross-references added
- [ ] Backup deleted (if successful)
- [ ] Ready for implementation phase

---

## Execution Strategy

**Estimated Total Time:** 3-4 hours

**Task Breakdown:**
- Tasks 1-2: 30 minutes (Header + Overview)
- Task 3: 20 minutes (System Architecture)
- Task 4: 60 minutes (Data consolidation)
- Task 5: 30 minutes (Code Architecture)
- Task 6: 90 minutes (Visual Design consolidation)
- Task 7: 60 minutes (Sections 7-10)
- Task 8: 45 minutes (Success Criteria renumbering)
- Task 9: 30 minutes (Sections 12-16)
- Task 10: 15 minutes (Verification)

**Recommended Approach:** Execute in order, commit after each task for rollback safety.

---

## Notes for Executor

1. **Be Precise**: Use exact line numbers when deleting old content
2. **Preserve Code**: Keep all code examples inline for context
3. **Check Anchors**: Verify TOC links use lowercase-with-hyphens format
4. **No Content Loss**: If unsure about deleting content, keep it
5. **Commit Often**: After each task for easy rollback
6. **Test Links**: Click TOC links to verify they work
7. **Count Numbers**: Success Criteria must be 1-77 with no gaps

---

## Success Definition

Document restructure is complete when:
- ✅ All 10 tasks executed successfully
- ✅ All verification checks pass
- ✅ Document size reduced appropriately
- ✅ No numbering conflicts remain
- ✅ Logical structure is clear and consistent
- ✅ Ready for implementation phase with no blockers

---

**READY FOR EXECUTION**

Use `superpowers:executing-plans` skill to implement this plan task-by-task.
