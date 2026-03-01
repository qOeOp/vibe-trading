---
title: Library Factor Database
subtitle: Lifecycle MGMT · Row Grouping · ⌘ Multi-select · Factor Details · Batch ACT.
icon: Library
layout: two-column
cards:
  - id: grid
    title: Factor Overview
    subtitle: TanStack Table · tablecn Toolbar · Row Grouping · Inline Actions
    render: markdown
    flex: 65
    row: 1
    badge: { icon: Table2, label: TanStack, color: purple }
    expandTitle: Factor Overview — Documentation
    expandSubtitle: Column Spec · Row Grouping · DnD · Interaction · Batch ACT.
  - id: detail
    title: Factor Detail Panel
    subtitle: Info · Radar · Stats · 13 Industry Standard IC Charts · Status MGMT
    render: markdown
    flex: 35
    row: 1
    badge: { icon: PanelRight, label: Select to View, color: purple }
    expandTitle: Factor Detail Panel — Documentation
    expandSubtitle: V-Score · Radar · Rolling IC · Cum. IC · Monthly Heatmap · Quantile Returns · Cum. Returns · LS Equity · LS Spread · IC Decay · IC Histogram · Q-Q Plot · IC by Industry · Rank AC · Turnover
rows:
  - height: h-full
links:
  - from: Factor Detail
    to: Lab tab
    desc: Re-validate factor efficacy
  - from: Factor
    to: Backtest tab
    desc: Launch strategy backtest
  - from: Stock Factors
    to: Analysis/Factors
    desc: View per-stock factor perspective
  - from: Factor Status
    to: Monitor tab
    desc: View factor health monitoring
  - from: Book Link
    to: Portfolio/Books
    desc: View book configuration
footer: >-
  Layout: Factor Grid (flex-65) + Detail Panel (flex-35) ·
  Data Model: Refer to Home tab — Factor Entity
---

Library is the archive and management center for factors. All factors validated in Lab are stored here for retrieval, versioning, and status changes. Library manages CRUD operations while Lab and Monitor handle analysis.

<!-- card: grid -->

## Page Structure

```
┌─ GroupingZone (always visible) ──────────────────────────────────────────┐
│ GROUP  [CAT. x] [STAT. x]                          [EXPAND] [COLLAP] [CLEAR] │
├──────────────────────────────────────────────────────────────────────────┤
│ [Search factors...]  [Sort #1]                                    [View] │ <- DataTableAdvancedToolbar
├──────────────────────────────────────────────────────────────────────────┤
│ TYPE| FACTOR      |CAT.|SRC | IC  | PEAK | IR |WIN%|T.O.|CAP.|TREND|STAT|ACT│
|-----|-------------|----|----|-----|------|----|----|----|----|-----|----|---|
│  > MANUAL (42 factors)                            avg IC +0.045  IR 1.23 │   │
│ [B]| ^Sm-Cap Mom  |MOM.|MANU|+0.042|CSI300|1.35| 58%| 22%|1.2B|~~~~~|LIVE|[A]│
│ [B]| vLg-Cap Mom  |MOM.|MANU|-0.015|      |0.82| 45%| 18%|0.8B|~~~~~|PROB|[A]│
├──────────────────────────────────────────────────────────────────────────┤
│ 0 of 50 selected    Rows per page 20                         Page 1/3    │
└──────────────────────────────────────────────────────────────────────────┘
```

**^/v Direction**: Arrow before factor name. ^ = Positive factor (higher value -> higher return), v = Negative factor.

## TanStack Table Columns (13 + 1 hidden)

| # | Name | field | width% | Align | Group | Sort | Description |
|---|------|-------|--------|-------|-------|------|-------------|
| 1 | TYPE | type | 3% | left | No | No | Box/Boxes Icons (Leaf/Composite) |
| 2 | FACTOR | name | 22% | left | No | Yes | Dir Arrow (^/v) + Bold Name + Gray Version |
| 3 | CAT. | category | 6% | left | Yes | Yes | 9-color rounded badge |
| 4 | SRC | source | 6% | left | Yes | Yes | Colored text label |
| 5 | IC | ic | 5% | right | No | Yes | `+0.042` 3-decimals, Pos Green/Neg Red |
| 6 | PEAK | peak | 6% | right | No | No | PeakBadge: Universe + IC badge |
| 7 | IR | ir | 5% | right | No | Yes | `1.35` 2-decimals, >=1.5 Bold |
| 8 | WIN% | winRate | 5% | right | No | Yes | Integer percentage |
| 9 | T.O. | turnover | 5% | right | No | Yes | Integer percentage |
| 10 | CAP. | capacity | 5% | right | No | Yes | K/M/B adaptive |
| 11 | TREND | icTrend | 8% | left | No | No | SparklineSVG (Responsive sparkline) |
| 12 | STAT | status | 7% | left | Yes | Yes | 5-color status badge |
| 13 | ACT | actions | 12% | right | No | No | Shadcn table-02 style: Icon buttons |

---

## Selection Interactions

| Action | Behavior |
|--------|----------|
| Click Row | Select factor -> Update detail panel (toggle) |
| Cmd+Click | Multi-select (toggle single factor in/out) |
| Shift+Click | Range select (anchor -> target) |

---

## Inline Batch Toolbar

Appears when >= 2 factors selected, inside the name cell of the last clicked row:

```
Sm-Cap Mom v2.1  [3 selected | Compare · Export · Change Status | X]
```

---

## Row Actions (FactorActionsCell)

| Action | Icon | INC | PAPER | LIVE | PROB | RET | Resulting Status |
|--------|------|-----|-------|------|------|-----|------------------|
| Test | Flask | Yes | | | | | -> PAPER_TEST |
| Deploy | Play | | Yes | | | | -> LIVE_ACTIVE |
| Resume | Reset | | | | Yes | | -> LIVE_ACTIVE |
| Retire | Trash | Yes | Yes | Yes | Yes | | -> RETIRED |

<!-- card: detail -->

## Section A: Info

```
┌─────────────────────────────────────┐
│ Sm-Cap Mom                     v2.1 │ <- Factor Name + Version
│ [MOM.] [leaf] [MANUAL] [^ Pos]      │ <- Cat + Type + Src + Dir
│ Univ: All-A | Pre: Ind-Neutral      │ <- Universe + Neutralization
│ Outlier: Winz | IC Window: 20D      │ <- Pre-processing + Window
├─────────────────────────────────────┤
│ V-Score: [+0.5 Fair]                │ <- Valuation (Color coded)
│ ┌─ Radar Chart (5D Profile) ──────┐ │
│ │  Returns / Stability / Efficiency│ │
│ │  Capacity / Freshness           │ │
│ └─────────────────────────────────┘ │
├─────────────────────────────────────┤
│ expression (Code, Collapsible):     │
│ rank(ts_mean(volume,20)) /          │
│ rank(close)                         │
├─────────────────────────────────────┤
│ *INC-*PAPER-*LIVE-oPROB-oRET        │ <- Lifecycle Timeline
│                 ^ Current           │
├─────────────────────────────────────┤
│ [Copy ID]  [Change Status v]        │
└─────────────────────────────────────┘
```

---

## Section B: Statistics

```
┌─────────────────────────────────────┐
│  IC(20d)   IC(60d)   IC(120d)       │ <- 3-horizon IC, 2x3 grid
│  +0.042    +0.038    +0.035         │    Green/Red, 3 decimals
│  IR        t-stat    WIN%           │
│  1.35      2.80      58%            │
├─────────────────────────────────────┤
│  T.O: 22% | CAP: 1.2B | Cost: ~0.3% │ <- Summary Row
└─────────────────────────────────────┘
```

---

## Section C: IC Deep Dive (13 Charts)

### C1: IC Rolling MA

```
┌─────────────────────────────────────┐
│ IC Rolling MA         20D/60D/120D  │
│ ┌────────────────────────────────┐  │
│ │  --- 20D MA (Blue, thin)       │  │
│ │  --- 60D MA (Indigo, med)      │  │
│ │  ### 120D MA (Purp, thick+fill)│  │
│ │  - - PROBATION Threshold (Red) │  │
│ └────────────────────────────────┘  │
│ legend: -- 20D  -- 60D  ## 120D     │
└─────────────────────────────────────┘
```

---

### C2: IC Cumulative

```
┌─────────────────────────────────────┐
│ IC Cumulative                       │
│ ┌────────────────────────────────┐  │
│ │        /--\                    │  │
│ │   /---/    \/-------           │  │
│ │ /   ########## (Area Fill)     │  │
│ │----------------------- y=0     │  │
│ └────────────────────────────────┘  │
└─────────────────────────────────────┘
```

---

### C3: IC Monthly Heatmap

```
┌─────────────────────────────────────┐
│ IC Monthly Heatmap             3Y   │
│ ┌────────────────────────────────┐  │
│ │     Jan Feb Mar ... Nov Dec    │  │
│ │ 2024  O   O   X  ...  O   X    │  │
│ │ 2025  O   #   O  ...  X   O    │  │
│ │ 2026  O   X                    │  │
│ └────────────────────────────────┘  │
└─────────────────────────────────────┘
```

---

### C4: Quantile Returns

```
┌─────────────────────────────────────┐
│ Quantile Returns      Q1(W) -> Q5(B)│
│ ┌────────────────────────────────┐  │
│ │  ##                    ####   │  │
│ │ -Q1--Q2--Q3--Q4--Q5---- y=0   │  │
│ │  (R) (LR)(G) (LG)(G)          │  │
│ └────────────────────────────────┘  │
└─────────────────────────────────────┘
```

---

### C5: Quantile Cum. Returns

```
┌─────────────────────────────────────┐
│ Quantile Cum. Returns         Q1-Q5 │
│ ┌────────────────────────────────┐  │
│ │ --- Q5 (Green, Up)             │  │
│ │ --- Q4 (Light Green)           │  │
│ │ --- Q3 (Gray, Base)            │  │
│ │ --- Q2 (Light Red)             │  │
│ │ --- Q1 (Red, Down)             │  │
│ │ - - Benchmark y=1.0            │  │
│ └────────────────────────────────┘  │
│ legend: -- Q1 -- Q2 -- Q3 -- Q4 -- Q5│
└─────────────────────────────────────┘
```

---

### C6: Long-Short Equity

```
┌─────────────────────────────────────┐
│ Long-Short Equity                   │
│ ┌────────────────────────────────┐  │
│ │           /\    /-------       │  │
│ │      /---/  \--/    ^+12.3%    │  │
│ │ ----/                          │  │
│ │ - - - - - - - - - - - (y=1.0)  │  │
│ └────────────────────────────────┘  │
│ Ann: +12.3% | MDD: -8.5% | Sharpe: 1.82 │
└─────────────────────────────────────┘
```

---

### C10: IC Q-Q Plot

```
┌─────────────────────────────────────┐
│ IC Q-Q Plot          Normality Test │
│ ┌────────────────────────────────┐  │
│ │     .  . .                     │  │
│ │   . .  /                       │  │
│ │  . . /   (45 deg diagonal)     │  │
│ │ . / .                          │  │
│ │/ . .                           │  │
│ └────────────────────────────────┘  │
└─────────────────────────────────────┘
```

---

### C11: IC by Industry

```
┌─────────────────────────────────────┐
│ IC by Industry               SW L1  │
│ ┌────────────────────────────────┐  │
│ │ ### ## # #### ## # ## # ...    │  │
│ │ Bank Secu Food Medi Comp ...   │  │
│ └────────────────────────────────┘  │
└─────────────────────────────────────┘
```

<!-- card: detail:expand -->

## Component Architecture

Detail Panel is a standalone `FactorDetailPanel` component. The panel uses the unified panel primitives from `@/components/shared/panel`:

- **Outer shell**: `PanelFrame` + `PanelFrameHeader` + `PanelFrameBody` (the factor panel is rendered inline in library-page, not inside PanelSlot, so it provides its own PanelFrame)
- **Sections**: `PanelSection` (replaces old `DetailSection`)
- **Stats**: `PanelStatGrid` + `PanelStatItem` (replaces old `DetailStatGrid`/`DetailStatItem`)
- **Key-Value**: `PanelKV` (replaces old `DetailKV`)
- **Identity header**: `PanelSection noBorder` (replaces old `DetailHeader`)

### V-Score Thresholds

| Range | Label | Color |
|-------|-------|-------|
| < -1 | Undervalued | Blue |
| -1 to 1 | Fair | Green |
| > +1 | Overvalued | Orange |

---

## Theme Compliance

All table header text and drag-handle icons must use Mine theme tokens (`text-mine-text`, `text-mine-muted`) instead of dark-theme colors (`text-white`, `text-white/70`, `text-white/30`). The table renders on a light background; dark-theme text classes produce invisible or low-contrast text.