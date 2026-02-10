# ngx-charts React Migration TDD Visual Testing Design

## Overview

A comprehensive TDD-driven visual testing and validation system for the ngx-charts Angular to React migration. This system ensures 1:1 visual and functional parity through automated pixel-level comparison, AI-powered visual assertions, and interaction testing.

## Problem Statement

The current React migration of ngx-charts has several issues:

### Core Issues

1. **Visual differences** - Legend positioning, colors, spacing differ from Angular original
2. **Missing features** - Some options in the demo are not functional or missing
3. **Ineffective tests** - Existing tests pass but don't catch real visual/functional gaps
4. **Demo parity gaps** - React demo missing options available in Angular demo

### Demo Page Problem Categories

| Category | Description | Example |
|----------|-------------|---------|
| **Options Missing** | Demo sidebar missing options that exist in Angular | Timeline toggle, curve selector |
| **Style Differences** | Demo page styling differs from Angular | Sidebar layout, spacing, fonts |
| **Options Not Linked** | Options exist in demo but don't affect chart | Toggle doesn't change chart behavior |
| **Data Format Issues** | Different data structure expectations | Multi-series vs single-series |

### Event/Interaction Coverage Gaps

The React migration must implement all ~129 Angular output events:

| Event Category | Count | Examples |
|----------------|-------|----------|
| Selection | 4 | select, activate, deactivate, dblclick |
| Legend | 3 | labelClick, labelActivate, labelDeactivate |
| Tooltip | 3 | show, hide, hover |
| Layout | 2 | dimensionsChanged, onDomainChange |
| Animation | 2 | countChange, countFinish |
| **Total** | **~129** | Distributed across 69 components |

## Design Goals

1. Establish a "golden baseline" from Angular ngx-charts demo
2. Create comprehensive visual tests covering ALL chart types and ALL options
3. Enable TDD workflow: write failing test → fix implementation → test passes
4. Support incremental fixes with immediate visual feedback
5. Ultimately achieve 1:1 parity with Angular demo site

---

## Architecture

### Test Strategy Hierarchy

```
┌─────────────────────────────────────────────────────────────────┐
│ L1: Pixel-Level Screenshot Comparison (Primary)                 │
│     - Playwright + pixelmatch/resemble.js                       │
│     - Strict visual regression testing                          │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼ (fallback when L1 difficult)
┌─────────────────────────────────────────────────────────────────┐
│ L2: AI Visual Assertions (Fallback)                             │
│     - Midscene aiAssert() for semantic visual checks            │
│     - "Legend should be positioned to the right of chart"       │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼ (for interactions)
┌─────────────────────────────────────────────────────────────────┐
│ L3: Interaction Testing                                         │
│     - Midscene aiAct() for hover, click, tooltip verification   │
│     - Verify interactive behaviors match Angular                │
└─────────────────────────────────────────────────────────────────┘
```

### System Components

```
┌─────────────────────────────────────────────────────────────────┐
│                    Test Orchestrator                            │
│  - Manages dual site startup (Angular + React)                  │
│  - Coordinates test execution                                   │
│  - Generates comparison reports                                 │
└─────────────────────────────────────────────────────────────────┘
           │                                    │
           ▼                                    ▼
┌─────────────────────┐            ┌─────────────────────┐
│   Angular Demo      │            │    React Demo       │
│   localhost:4200    │            │   localhost:3000    │
│   (Baseline)        │            │   (Under Test)      │
└─────────────────────┘            └─────────────────────┘
           │                                    │
           └──────────────┬─────────────────────┘
                          ▼
┌─────────────────────────────────────────────────────────────────┐
│                  Screenshot Comparator                          │
│  - Capture identical viewport from both sites                   │
│  - Pixel-level diff using pixelmatch                            │
│  - Generate visual diff images                                  │
│  - Calculate similarity percentage                              │
└─────────────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────────┐
│                   Test Report Generator                         │
│  - HTML report with side-by-side comparisons                    │
│  - Diff highlighting                                            │
│  - Pass/fail status per chart/option combination                │
└─────────────────────────────────────────────────────────────────┘
```

---

## Chart Coverage Matrix

### Chart Types (38 Total)

| Category | Chart Type | Selector | Count |
|----------|------------|----------|-------|
| **Bar Charts** | Vertical Bar | `bar-vertical` | 8 |
| | Horizontal Bar | `bar-horizontal` | |
| | Grouped Vertical (2D) | `bar-vertical-2d` | |
| | Grouped Horizontal (2D) | `bar-horizontal-2d` | |
| | Stacked Vertical | `bar-vertical-stacked` | |
| | Stacked Horizontal | `bar-horizontal-stacked` | |
| | Normalized Vertical | `bar-vertical-normalized` | |
| | Normalized Horizontal | `bar-horizontal-normalized` | |
| **Pie Charts** | Pie Chart | `pie-chart` | 3 |
| | Advanced Pie | `advanced-pie-chart` | |
| | Pie Grid | `pie-grid` | |
| **Line/Area** | Line Chart | `line-chart` | 5 |
| | Polar Chart | `polar-chart` | |
| | Area Chart | `area-chart` | |
| | Stacked Area | `area-chart-stacked` | |
| | Normalized Area | `area-chart-normalized` | |
| **Other Charts** | Bubble Chart | `bubble-chart` | 10 |
| | Box Chart | `box-plot` | |
| | Sankey | `sankey` | |
| | Force Directed Graph | `force-directed-graph` (deprecated) | |
| | Heat Map | `heat-map` | |
| | Tree Map | `tree-map` | |
| | Number Cards | `number-card` | |
| | Gauge | `gauge` | |
| | Linear Gauge | `linear-gauge` | |
| | Percent Gauge | `percent-gauge` | |
| **Demos (Custom)** | Combo Chart | `combo-chart` | 12 |
| | Calendar Heat Map | `calendar` | |
| | Status Cards | `status-demo` | |
| | Interactive TreeMap | `tree-map-demo` | |
| | Interactive Bubble | `bubble-chart-interactive-demo` | |
| | Equation Plots | `plot-demo` | |
| | Tooltip Templates | `tooltip-templates` | |
| | Sparklines | `sparkline` | |
| | Line with Reference Lines | `line-reference-lines` | |
| | Timeline Filter Bar | `timeline-filter-bar-chart-demo` | |
| | Stacked Bar Negative (V) | `bar-vertical-stacked-negative` | |
| | Stacked Bar Negative (H) | `bar-horizontal-stacked-negative` | |

### Option Categories (16 Total)

1. **Core Visualization**: animations
2. **Color & Styling**: colorScheme, schemeType, gradient, rangeFillOpacity
3. **Axes & Labels**: showXAxis, showYAxis, showXAxisLabel, showYAxisLabel, xAxisLabel, yAxisLabel, showGridLines
4. **Legend**: showLegend, legendTitle, legendPosition
5. **Bar-Specific**: barPadding, groupPadding, noBarWhenZero, roundEdges
6. **Scale & Domain**: roundDomains, autoScale, xScaleMin/Max, yScaleMin/Max
7. **Axis Ticks**: trimXAxisTicks, trimYAxisTicks, rotateXAxisTicks, maxXAxisTickLength, maxYAxisTickLength, wrapTicks
8. **Tooltips**: tooltipDisabled, tooltipText
9. **Pie-Specific**: doughnut, arcWidth, explodeSlices, showLabels
10. **Line/Area-Specific**: curve, curveClosed, timeline, showRefLines, showRefLabels, referenceLines
11. **Heat Map-Specific**: innerPadding
12. **Bubble-Specific**: minRadius, maxRadius
13. **Gauge-Specific**: min, max, largeSegments, smallSegments, angleSpan, startAngle, showAxis, showText, units, value, previousValue, target, showLabel
14. **Box-Specific**: strokeColor, strokeWidth
15. **Margin**: margin, marginTop/Right/Bottom/Left
16. **Data Labels**: showDataLabel

### Test Matrix Size

| Category | Count | Calculation |
|----------|-------|-------------|
| **Visual Tests** | ~760 | 38 charts × ~20 options |
| **Event Tests** | ~129 | All output events |
| **Formatting Tests** | ~80 | 8 callbacks × 10 charts |
| **Theme Tests** | 76 | 38 charts × 2 themes |
| **Animation Tests** | 12 | Timing verification |
| **SSR Tests** | 38 | One per chart type |
| **Responsive Tests** | 38 | Resize behavior |
| **Edge Cases** | ~30 | iOS, overflow, wrap, etc. |
| **Total** | **~1,163** | Full coverage |

**Additional Considerations:**
- Data format variations (single/multi series, bubble, sankey, etc.)
- Custom template tests (tooltipTemplate, seriesTooltipTemplate)
- Reference line tests
- Timeline/brush selection tests

---

## Test Implementation

### Directory Structure

```
apps/web/src/lib/ngx-charts/__tests__/
├── visual-compare/
│   ├── playwright.config.ts          # Playwright configuration
│   ├── test-orchestrator.ts          # Dual-site management
│   ├── screenshot-comparator.ts      # Pixel comparison logic
│   ├── chart-test-matrix.ts          # All chart+option combinations
│   ├── midscene-helpers.ts           # AI assertion helpers
│   │
│   ├── specs/
│   │   ├── bar-charts.spec.ts
│   │   ├── line-area-charts.spec.ts
│   │   ├── pie-charts.spec.ts
│   │   ├── gauge-charts.spec.ts
│   │   ├── other-charts.spec.ts
│   │   └── interactions.spec.ts
│   │
│   ├── baselines/                    # (generated) Angular screenshots
│   │   ├── bar-vertical/
│   │   ├── area-chart/
│   │   └── ...
│   │
│   ├── current/                      # (generated) React screenshots
│   │   └── ...
│   │
│   ├── diffs/                        # (generated) Visual diff images
│   │   └── ...
│   │
│   └── reports/                      # (generated) HTML reports
│       └── visual-comparison-report.html
│
├── demo-options/
│   ├── option-definitions.ts         # All demo options with defaults
│   ├── option-applier.ts             # Apply options to demo page
│   └── data-generators.ts            # Test data for each chart type
│
└── run-visual-tests.sh               # Main test runner script
```

### Test Orchestrator

```typescript
// test-orchestrator.ts
import { spawn, ChildProcess } from 'child_process';

interface TestOrchestrator {
  angularProcess: ChildProcess | null;
  reactProcess: ChildProcess | null;

  startAngularDemo(): Promise<string>;  // Returns URL
  startReactDemo(): Promise<string>;    // Returns URL
  stopAll(): Promise<void>;
  waitForReady(url: string): Promise<void>;
}

export async function createTestOrchestrator(): Promise<TestOrchestrator> {
  // Start Angular demo on port 4200
  // Start React demo on port 3000
  // Wait for both to be ready
  // Return orchestrator instance
}
```

### Screenshot Comparator

```typescript
// screenshot-comparator.ts
import { Page } from '@playwright/test';
import pixelmatch from 'pixelmatch';
import { PNG } from 'pngjs';

interface ComparisonResult {
  match: boolean;
  similarity: number;        // 0-100%
  diffPixels: number;
  diffImagePath: string;
  angularScreenshot: string;
  reactScreenshot: string;
}

export async function compareChartScreenshots(
  angularPage: Page,
  reactPage: Page,
  chartType: string,
  options: Record<string, any>,
  threshold: number = 0.1      // 10% tolerance
): Promise<ComparisonResult> {
  // 1. Apply options to both pages
  // 2. Wait for charts to render
  // 3. Capture screenshots
  // 4. Run pixelmatch comparison
  // 5. Generate diff image
  // 6. Return result
}
```

### Chart Test Matrix

```typescript
// chart-test-matrix.ts
export interface ChartTestCase {
  chartType: string;
  optionSet: string;           // e.g., "default", "with-legend-below", "no-animation"
  options: Record<string, any>;
  interactions?: InteractionTest[];
}

export const CHART_TEST_MATRIX: ChartTestCase[] = [
  // Bar Vertical - All option combinations
  {
    chartType: 'bar-vertical',
    optionSet: 'default',
    options: {
      showXAxis: true,
      showYAxis: true,
      gradient: false,
      showLegend: true,
      legendPosition: 'right',
      showXAxisLabel: true,
      xAxisLabel: 'Country',
      showYAxisLabel: true,
      yAxisLabel: 'GDP Per Capita',
      showGridLines: true,
      barPadding: 8,
      roundEdges: true,
      animations: true,
    }
  },
  {
    chartType: 'bar-vertical',
    optionSet: 'legend-below',
    options: {
      // ... same as default but legendPosition: 'below'
    }
  },
  // ... hundreds more combinations

  // Area Chart - All option combinations
  {
    chartType: 'area-chart',
    optionSet: 'default',
    options: {
      showXAxis: true,
      showYAxis: true,
      gradient: true,
      showLegend: true,
      legendPosition: 'right',
      showXAxisLabel: true,
      xAxisLabel: 'Census Date',
      showYAxisLabel: true,
      yAxisLabel: 'GDP Per Capita',
      autoScale: true,
      timeline: false,
      curve: 'linear',
    }
  },
  {
    chartType: 'area-chart',
    optionSet: 'with-timeline',
    options: {
      // ... with timeline: true
    }
  },
  // ... etc
];
```

### Playwright Test Spec Example

```typescript
// specs/area-charts.spec.ts
import { test, expect } from '@playwright/test';
import { createTestOrchestrator } from '../test-orchestrator';
import { compareChartScreenshots } from '../screenshot-comparator';
import { CHART_TEST_MATRIX } from '../chart-test-matrix';
import { PlaywrightAgent } from '@midscene/playwright';

const areaChartTests = CHART_TEST_MATRIX.filter(t =>
  t.chartType.includes('area')
);

test.describe('Area Chart Visual Parity', () => {
  let orchestrator: TestOrchestrator;
  let angularPage: Page;
  let reactPage: Page;

  test.beforeAll(async ({ browser }) => {
    orchestrator = await createTestOrchestrator();
    await orchestrator.startAngularDemo();
    await orchestrator.startReactDemo();

    const angularContext = await browser.newContext();
    const reactContext = await browser.newContext();
    angularPage = await angularContext.newPage();
    reactPage = await reactContext.newPage();
  });

  test.afterAll(async () => {
    await orchestrator.stopAll();
  });

  for (const testCase of areaChartTests) {
    test(`${testCase.chartType} - ${testCase.optionSet}`, async () => {
      // L1: Pixel comparison
      const result = await compareChartScreenshots(
        angularPage,
        reactPage,
        testCase.chartType,
        testCase.options
      );

      if (!result.match) {
        // L2: Fallback to AI assertion for specific checks
        const agent = new PlaywrightAgent(reactPage);

        // Check legend position
        if (testCase.options.legendPosition === 'right') {
          await agent.aiAssert(
            'The legend is positioned to the right side of the chart area, not below it'
          );
        }

        // Check axis labels
        if (testCase.options.showXAxisLabel) {
          await agent.aiAssert(
            `X-axis label shows "${testCase.options.xAxisLabel}"`
          );
        }
      }

      expect(result.similarity).toBeGreaterThan(95); // 95% match required
    });
  }
});
```

### Interaction Tests with Midscene

```typescript
// specs/interactions.spec.ts
import { test, expect } from '@playwright/test';
import { PlaywrightAgent } from '@midscene/playwright';

test.describe('Chart Interactions', () => {
  test('Area chart tooltip appears on hover', async ({ page }) => {
    await page.goto('http://localhost:3000/charts-demo');
    const agent = new PlaywrightAgent(page);

    // Select Area Chart from dropdown
    await agent.aiAct('Select "Area Chart" from the chart type dropdown');

    // Hover over a data point
    await agent.aiHover('a data point on the area chart');

    // Verify tooltip appears
    await agent.aiAssert('A tooltip is visible showing the data value');

    // Verify tooltip content
    const tooltipData = await agent.aiQuery({
      seriesName: 'string, the series name shown in tooltip',
      value: 'number, the numeric value shown',
      date: 'string, the date or x-axis value shown'
    });

    expect(tooltipData.seriesName).toBeTruthy();
    expect(tooltipData.value).toBeGreaterThan(0);
  });

  test('Legend click toggles series visibility', async ({ page }) => {
    await page.goto('http://localhost:3000/charts-demo');
    const agent = new PlaywrightAgent(page);

    await agent.aiAct('Select "Line Chart" from the chart type dropdown');

    // Get initial series count
    const initialState = await agent.aiQuery({
      visibleSeriesCount: 'number, count of visible line series in the chart'
    });

    // Click a legend item
    await agent.aiTap('the first legend item');

    // Verify series is hidden
    const afterClick = await agent.aiQuery({
      visibleSeriesCount: 'number, count of visible line series in the chart'
    });

    expect(afterClick.visibleSeriesCount).toBe(initialState.visibleSeriesCount - 1);
  });
});
```

### Comprehensive Event Testing Matrix

```typescript
// specs/events.spec.ts
import { test, expect, Page } from '@playwright/test';

/**
 * Tests all ~129 Angular output events are properly implemented in React
 */

const CHART_EVENTS = {
  // Core selection events (all charts)
  selection: ['select', 'activate', 'deactivate'],

  // Legend events
  legend: ['labelClick', 'labelActivate', 'labelDeactivate'],

  // Tooltip events
  tooltip: ['show', 'hide', 'hover'],

  // Layout events
  layout: ['dimensionsChanged', 'onDomainChange'],

  // Animation events
  animation: ['countChange', 'countFinish'],
};

test.describe('Selection Events', () => {
  test('select event fires on bar click', async ({ page }) => {
    await page.goto('/charts-demo?chart=bar-vertical');

    const selectEvent = page.waitForEvent('console', msg =>
      msg.text().includes('select:')
    );

    await page.click('[data-testid="bar-0"]');

    const event = await selectEvent;
    expect(event).toBeTruthy();
  });

  test('activate event fires on hover', async ({ page }) => {
    await page.goto('/charts-demo?chart=bar-vertical');

    const activateEvent = page.waitForEvent('console', msg =>
      msg.text().includes('activate:')
    );

    await page.hover('[data-testid="bar-0"]');

    const event = await activateEvent;
    expect(event).toBeTruthy();
  });

  test('deactivate event fires on mouse leave', async ({ page }) => {
    await page.goto('/charts-demo?chart=bar-vertical');

    await page.hover('[data-testid="bar-0"]');

    const deactivateEvent = page.waitForEvent('console', msg =>
      msg.text().includes('deactivate:')
    );

    await page.hover('body'); // Move away

    const event = await deactivateEvent;
    expect(event).toBeTruthy();
  });
});

test.describe('Tooltip Behavior', () => {
  test('tooltip flips when near edge', async ({ page }) => {
    await page.goto('/charts-demo?chart=bar-vertical');

    // Hover near right edge bar
    await page.hover('[data-testid="bar-last"]');

    // Tooltip should flip to left side
    const tooltip = page.locator('.ngx-charts-tooltip-content');
    await expect(tooltip).toHaveClass(/position-left/);
  });

  test('tooltip hides with correct delay', async ({ page }) => {
    await page.goto('/charts-demo?chart=bar-vertical');

    await page.hover('[data-testid="bar-0"]');
    await expect(page.locator('.ngx-charts-tooltip-content')).toBeVisible();

    await page.hover('body');

    // Should still be visible briefly (300ms hide delay)
    await expect(page.locator('.ngx-charts-tooltip-content')).toBeVisible();

    // After 300ms+ should be hidden
    await page.waitForTimeout(350);
    await expect(page.locator('.ngx-charts-tooltip-content')).not.toBeVisible();
  });
});

test.describe('Formatting Callbacks', () => {
  test('xAxisTickFormatting is called', async ({ page }) => {
    // Custom formatter that prefixes with "$"
    await page.goto('/charts-demo?chart=bar-vertical&xAxisFormat=currency');

    const ticks = page.locator('.x-axis .tick text');
    const firstTick = await ticks.first().textContent();

    expect(firstTick).toMatch(/^\$/); // Starts with $
  });

  test('valueFormatting works in gauge', async ({ page }) => {
    await page.goto('/charts-demo?chart=gauge&valueFormat=percent');

    const valueText = page.locator('.gauge .value-text');
    const value = await valueText.textContent();

    expect(value).toMatch(/%$/); // Ends with %
  });
});

test.describe('Custom Tooltip Templates', () => {
  test('tooltipTemplate renders custom content', async ({ page }) => {
    await page.goto('/charts-demo?chart=bar-vertical&customTooltip=true');

    await page.hover('[data-testid="bar-0"]');

    const tooltip = page.locator('.ngx-charts-tooltip-content');

    // Custom template should have special class
    await expect(tooltip).toHaveClass(/custom-tooltip/);

    // Should contain custom elements
    await expect(tooltip.locator('.custom-value')).toBeVisible();
  });

  test('seriesTooltipTemplate for multi-series', async ({ page }) => {
    await page.goto('/charts-demo?chart=line-chart&seriesTooltip=true');

    // Hover on tooltip area (not single point)
    await page.hover('.tooltip-area');

    const tooltip = page.locator('.ngx-charts-tooltip-content');

    // Should show all series in tooltip
    const seriesItems = tooltip.locator('.tooltip-item');
    await expect(seriesItems).toHaveCount({ min: 2 }); // Multi-series
  });
});
```

---

## Demo Page Parity

### Angular Demo Options to Implement in React

The React demo must support ALL options from Angular demo. Current gaps identified:

#### Missing in React Demo (from screenshots):

1. **Timeline option** - Not visible in React OPTIONS section
2. **Trim X/Y Axis Ticks** - Missing checkboxes
3. **Max X/Y Axis Tick Length** - Missing inputs
4. **Line Interpolation dropdown** - Missing curve selector
5. **Minimum/Maximum X-Scale value** - Missing inputs
6. **Minimum/Maximum Y-Scale value** - Missing inputs

#### Demo Page Structure

Both Angular and React demos should have identical sidebar structure:

```
CHART TYPE: [Dropdown - 25 options]
THEME: [Dropdown - Light/Dark]

▼ DATA
  [JSON Editor]
  □ Real-time

▼ DIMENSIONS
  □ Fit Container
  Width: [Input]
  Height: [Input]

▼ COLOR SCHEME
  [Dropdown - 15 schemes]

▼ OPTIONS
  □ Animations
  □ Show X Axis
  □ Show Y Axis
  □ Show Grid Lines
  □ Round Domains
  □ Use Gradients
  □ Show Legend
  □ Disable tooltip
  Legend Title: [Input]
  Legend Position: [Dropdown]
  □ Show X Axis Label
  X Axis Label: [Input]
  □ Show Y Axis Label
  Y Axis Label: [Input]
  □ Trim X Axis Ticks
  Max X Axis Tick Length: [Input]
  □ Trim Y Axis Ticks
  Max Y Axis Tick Length: [Input]
  □ Auto Scale
  □ Timeline
  Line Interpolation: [Dropdown]
  Minimum X-Scale value: [Input]
  Maximum X-Scale value: [Input]
  Minimum Y-Scale value: [Input]
  Maximum Y-Scale value: [Input]

  [Chart-specific options...]

▼ DOCUMENTATION
  [Link to docs]
```

---

## Execution Workflow

### Development Mode (Watch)

```bash
# Terminal 1: Start Angular demo
cd ngx-charts-e241d94221430000a8fddaa9eb4d8f2878ed8a38
npm install && npm start
# Runs on http://localhost:4200

# Terminal 2: Start React demo
npm run dev
# Runs on http://localhost:3000

# Terminal 3: Run visual tests in watch mode
npm run test:visual -- --watch
```

### Full Test Run (Pre-commit)

```bash
# Runs all visual comparison tests
npm run test:visual:full

# Output:
# ✓ bar-vertical - default (2.3s)
# ✓ bar-vertical - legend-below (1.8s)
# ✗ area-chart - default (2.1s)
#   → Similarity: 87% (required: 95%)
#   → Diff: Legend position mismatch
# ...
#
# 487/500 tests passed
# 13 failures - see report at ./reports/visual-comparison-report.html
```

### TDD Iteration Cycle

```
1. Run test → FAIL (e.g., "area-chart legend position")
2. View diff image → See legend is below instead of right
3. Fix React component → Update Legend positioning logic
4. Run test → PASS
5. Commit fix
6. Repeat for next failure
```

---

## Report Generation

### HTML Report Structure

```html
<!-- visual-comparison-report.html -->
<html>
<head>
  <title>ngx-charts Visual Comparison Report</title>
</head>
<body>
  <h1>Visual Comparison Report</h1>
  <p>Generated: 2026-02-06 10:30:00</p>
  <p>Pass: 487/500 (97.4%)</p>

  <h2>Failures</h2>

  <div class="test-result failed">
    <h3>area-chart - default</h3>
    <div class="comparison">
      <div class="angular">
        <h4>Angular (Expected)</h4>
        <img src="baselines/area-chart/default.png" />
      </div>
      <div class="diff">
        <h4>Difference</h4>
        <img src="diffs/area-chart/default-diff.png" />
      </div>
      <div class="react">
        <h4>React (Actual)</h4>
        <img src="current/area-chart/default.png" />
      </div>
    </div>
    <div class="details">
      <p>Similarity: 87%</p>
      <p>Diff Pixels: 12,450</p>
      <p>Issue: Legend positioned below chart instead of right</p>
    </div>
  </div>

  <!-- More failures... -->

  <h2>Passed Tests</h2>
  <!-- Collapsible list of passed tests -->
</body>
</html>
```

---

## Implementation Phases

### Phase 1: Infrastructure Setup (Day 1-2)
- [ ] Set up test directory structure
- [ ] Implement TestOrchestrator for dual-site management
- [ ] Implement ScreenshotComparator with pixelmatch
- [ ] Create initial chart-test-matrix.ts with 5 test cases
- [ ] Verify basic comparison works for 1 chart type
- [ ] Set up animation timing test infrastructure

### Phase 2: Test Matrix Expansion (Day 3-5)
- [ ] Complete chart-test-matrix.ts for all 38 chart types
- [ ] Add all ~200 @Input option combinations
- [ ] Generate initial baseline screenshots from Angular
- [ ] Run full comparison, document all failures
- [ ] Create event testing infrastructure for ~129 events

### Phase 3: React Fixes - Visual Parity (Day 6-9)
- [ ] Fix Legend positioning (right vs below)
- [ ] Fix tooltip behavior (timing, flip, iOS)
- [ ] Fix axis label visibility and positioning
- [ ] Fix gradient rendering
- [ ] Fix animation timings (600ms chart, 750ms pie, etc.)
- [ ] Fix grid panel alternating styles

### Phase 4: React Fixes - Functionality (Day 10-13)
- [ ] Implement all missing @Input properties
- [ ] Fix curve interpolation options
- [ ] Fix timeline feature with brush selection
- [ ] Fix scale min/max options
- [ ] Implement all formatting callbacks
- [ ] Implement custom tooltip templates

### Phase 5: Event & Interaction Tests (Day 14-16)
- [ ] Implement all ~129 event handlers
- [ ] Test hover/tooltip behaviors with correct timing
- [ ] Test legend click/toggle interactions
- [ ] Test activate/deactivate on series
- [ ] Test dimensionsChanged events
- [ ] Test countChange/countFinish for animations

### Phase 6: Edge Cases & SSR (Day 17-18)
- [ ] Test SSR compatibility (Next.js static export)
- [ ] Test iOS Safari tooltip timing
- [ ] Test tooltip overflow/flip behavior
- [ ] Test long label wrapping
- [ ] Test visibility observer lazy rendering
- [ ] Test window resize responsiveness

### Phase 7: Demo Page & Theme (Day 19-21)
- [ ] Add all missing sidebar options to React demo
- [ ] Link all options to chart behavior
- [ ] Implement dark/light theme switching
- [ ] Match Angular demo CSS styling
- [ ] Ensure 1:1 parity with Angular demo layout
- [ ] Final visual review and sign-off

---

## Success Criteria

### Core Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| **Visual Parity** | 95%+ | Pixel similarity per chart |
| **Feature Completeness** | 100% | All ~200 @Input properties work |
| **Event Coverage** | 100% | All ~129 events fire correctly |
| **Demo Parity** | 100% | All options visible and functional |
| **Test Coverage** | 1000+ | Automated test cases passing |

### Detailed Criteria

1. **Visual Parity** (95%+ pixel similarity)
   - All 38 chart types render identically
   - All 16 color schemes produce correct colors
   - All legend positions match (right, below, left, above)
   - Grid lines, axes, labels positioned correctly
   - Animations have correct timing (within 50ms tolerance)

2. **Feature Completeness** (100% @Input coverage)
   - All base chart options: scheme, animations, view, customColors
   - All axis options: ticks, labels, formatting, reference lines
   - All legend options: title, position, horizontal
   - All chart-specific options (bar, pie, gauge, etc.)
   - All formatting callbacks function correctly

3. **Event Coverage** (100% of ~129 events)
   - Core: select, activate, deactivate for all interactive elements
   - Legend: click, activate, deactivate on legend items
   - Tooltip: show, hide, hover with correct timing
   - Layout: dimensionsChanged emitted after axis render
   - Animation: countChange, countFinish for gauge/cards

4. **Demo Parity** (1:1 with Angular)
   - All sidebar options present
   - All options linked to chart behavior
   - Same styling and layout
   - Theme switching works identically

5. **Edge Cases Handled**
   - SSR compatibility (no DOM errors)
   - iOS Safari tooltip timing
   - Tooltip overflow/flip behavior
   - Long label wrapping
   - Zero values handled correctly

---

## Dependencies

### Required Packages

```json
{
  "devDependencies": {
    "@playwright/test": "^1.40.0",
    "@midscene/playwright": "^1.0.0",
    "pixelmatch": "^5.3.0",
    "pngjs": "^7.0.0"
  }
}
```

### Environment Requirements

- Node.js 18+
- Angular CLI (for running Angular demo)
- Midscene API key (for AI assertions)

---

## Risks and Mitigations

| Risk | Mitigation |
|------|------------|
| Angular demo version drift | Pin to specific commit hash |
| Flaky pixel comparisons | Use tolerance threshold, retry logic |
| AI assertion costs | Use L2 only when L1 fails |
| Long test execution time | Parallelize across chart types |
| Cross-platform rendering differences | Run tests in Docker container |

---

## Appendix A: Complete @Input Inventory

Based on comprehensive scan of Angular ngx-charts source code: **~1,030+ @Input decorators across 71 component files**.

### Base Chart Component (All Charts Inherit)

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `results` | `any` | - | Chart data array (cloned on each update) |
| `view` | `[number, number]` | `[600, 400]` | Chart dimensions [width, height] |
| `scheme` | `string \| Color` | `'cool'` | Color scheme name |
| `schemeType` | `ScaleType` | `Ordinal` | Scale type (Ordinal, Linear, Time) |
| `customColors` | `any` | - | Custom color mapping (function or array) |
| `animations` | `boolean` | `true` | Enable/disable animations |

### Axis Components

**X-Axis:**
| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `xScale` | `any` | - | D3 scale for X-axis |
| `dims` | `ViewDimensions` | - | Chart dimensions |
| `trimTicks` | `boolean` | - | Trim long tick labels |
| `rotateTicks` | `boolean` | `true` | Rotate tick labels |
| `maxTickLength` | `number` | - | Maximum tick label length |
| `tickFormatting` | `function` | - | Custom tick formatter |
| `showGridLines` | `boolean` | `false` | Show grid lines |
| `showLabel` | `boolean` | - | Show axis label |
| `labelText` | `string` | - | Axis label text |
| `ticks` | `any[]` | - | Custom tick values |
| `xAxisTickCount` | `number` | - | Number of ticks |
| `xOrient` | `Orientation` | `Bottom` | Axis position |
| `referenceLines` | `any[]` | - | Reference line data |
| `showRefLines` | `boolean` | - | Show reference lines |
| `showRefLabels` | `boolean` | - | Show reference labels |
| `xAxisOffset` | `number` | `0` | Offset from edge |
| `wrapTicks` | `boolean` | `false` | Wrap long tick labels |

**Y-Axis:** (Similar to X-Axis with `yOrient` default: `Left`)

### Legend Components

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `data` | `string[]` | - | Legend items |
| `title` | `string` | - | Legend title |
| `colors` | `ColorHelper` | - | Color mapping |
| `height` | `number` | - | Container height |
| `width` | `number` | - | Container width |
| `activeEntries` | `any` | - | Active entries |
| `horizontal` | `boolean` | `false` | Horizontal layout |

### Tooltip Directive

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `tooltipCssClass` | `string` | `''` | Additional CSS classes |
| `tooltipTitle` | `string` | - | Tooltip title |
| `tooltipAppendToBody` | `boolean` | `true` | Portal rendering |
| `tooltipSpacing` | `number` | `10` | Distance from host |
| `tooltipDisabled` | `boolean` | - | Disable tooltip |
| `tooltipShowCaret` | `boolean` | `true` | Show pointer arrow |
| `tooltipPlacement` | `PlacementTypes` | `Top` | Position (Top/Bottom/Left/Right) |
| `tooltipAlignment` | `PlacementTypes` | `Center` | Horizontal alignment |
| `tooltipType` | `StyleTypes` | `popover` | Style type (popover/tooltip) |
| `tooltipCloseOnClickOutside` | `boolean` | `true` | Close on outside click |
| `tooltipCloseOnMouseLeave` | `boolean` | `true` | Close on mouse leave |
| `tooltipHideTimeout` | `number` | `300` | Hide delay (ms) |
| `tooltipShowTimeout` | `number` | `100` | Show delay (ms) |
| `tooltipTemplate` | `TemplateRef` | - | Custom template |
| `tooltipShowEvent` | `ShowTypes` | `all` | Trigger events |
| `tooltipContext` | `any` | - | Template context |
| `tooltipImmediateExit` | `boolean` | - | Skip hide delay |

### Bar Chart Specific

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `barPadding` | `number` | `8` | Padding between bars |
| `groupPadding` | `number` | `16` | Padding between groups (2D) |
| `roundEdges` | `boolean` | `true` | Round bar corners |
| `noBarWhenZero` | `boolean` | `true` | Hide bar when value is 0 |
| `showDataLabel` | `boolean` | `false` | Show data value labels |
| `dataLabelFormatting` | `function` | - | Data label formatter |

### Pie Chart Specific

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `labels` | `boolean` | `false` | Show labels with leader lines |
| `explodeSlices` | `boolean` | `false` | Explode slices effect |
| `doughnut` | `boolean` | `false` | Render as doughnut |
| `arcWidth` | `number` | `0.25` | Doughnut ring width |
| `labelFormatting` | `function` | - | Custom label formatter |
| `trimLabels` | `boolean` | `true` | Trim long labels |
| `maxLabelLength` | `number` | `10` | Max label length |
| `tooltipText` | `function` | - | Tooltip text formatter |
| `margins` | `number[]` | - | Custom margins [T,R,B,L] |

### Gauge Specific

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `min` | `number` | `0` | Minimum value |
| `max` | `number` | `100` | Maximum value |
| `textValue` | `string` | - | Override display text |
| `units` | `string` | - | Unit label (%, km/h, etc.) |
| `bigSegments` | `number` | `10` | Major tick segments |
| `smallSegments` | `number` | `5` | Minor tick segments |
| `showAxis` | `boolean` | `true` | Show axis labels/ticks |
| `startAngle` | `number` | `-120` | Starting angle (degrees) |
| `angleSpan` | `number` | `240` | Total angle span |
| `axisTickFormatting` | `function` | - | Axis tick formatter |
| `valueFormatting` | `function` | - | Value formatter |
| `showText` | `boolean` | `true` | Show center text |
| `margin` | `number[]` | - | Custom margins |

### Heat Map Specific

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `innerPadding` | `number \| number[]` | `8` | Padding between cells |
| `min` | `number` | - | Minimum value (color scale) |
| `max` | `number` | - | Maximum value (color scale) |
| `tooltipText` | `function` | - | Tooltip formatter |

### Line/Area Specific

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `autoScale` | `boolean` | `false` | Auto-scale Y-axis |
| `timeline` | `boolean` | `false` | Show timeline slider |
| `curve` | `CurveFactory` | `curveLinear` | Line interpolation |
| `rangeFillOpacity` | `number` | - | Range fill opacity |
| `baseValue` | `'auto' \| number` | `'auto'` | Area chart base value |
| `xScaleMin` | `number` | - | Min X-axis value |
| `xScaleMax` | `number` | - | Max X-axis value |
| `yScaleMin` | `number` | - | Min Y-axis value |
| `yScaleMax` | `number` | - | Max Y-axis value |

---

## Appendix B: Animation Timing Reference

Precise animation timings from Angular ngx-charts CSS/SCSS and TypeScript:

### CSS Keyframe Animations

| Animation | Duration | Easing | Delay | Description |
|-----------|----------|--------|-------|-------------|
| Chart fade-in | 600ms | linear | 20% (120ms) | Overall chart appearance |
| Pie label fade | 750ms | ease-in | - | Pie chart labels |
| Pie leader line | 3000ms | linear | - | Leader line stroke draw |
| Interactive hover | 100ms | ease-in-out | - | Bar/cell/arc opacity |
| Tooltip appear | 300ms | - | - | Tooltip fade + transform |
| Legend hover | 200ms | - | - | Legend item color change |

### JavaScript/D3 Animations

| Animation | Duration | Easing | Description |
|-----------|----------|--------|-------------|
| Area path morph | 750ms | - | D3 transition for path |
| Count up | configurable | easeOutExpo | Robert Penner's easing |
| Tooltip anchor line | 250ms | - | Opacity 0 → 0.7 |
| Bar loading | varies | - | Path morphing animation |

### Animation Control

```typescript
// Animations auto-disabled on SSR
if (isPlatformServer(this.platformId)) {
  this.animations = false;
}
```

---

## Appendix C: Base Infrastructure Behaviors

Hidden behaviors in base components that React must replicate:

### SSR Detection

Multiple components check `isPlatformServer(PLATFORM_ID)`:
- Disables all animations
- Prevents DOM access that would fail server-side
- **TDD Test**: Verify React components work with SSR (Next.js)

### Visibility Observer

Lazy rendering pattern for initially hidden elements:
```typescript
// Checks offsetHeight > 0 && offsetWidth > 0
// Polling-based: 100ms intervals
// Runs outside Angular zone, triggers zone.run() on visibility
```
- **TDD Test**: Verify charts render correctly when scrolled into view

### Window Resize Handler

```typescript
// 200ms debounce on window resize
// Recalculates dimensions from parent container
// Triggers complete chart re-render
```
- **TDD Test**: Verify responsive behavior on viewport changes

### Data Cloning

```typescript
// Clones data on each update
// Preserves: name, value, series, extra, source, target
// Formats Date values to locale strings
```
- **TDD Test**: Verify external data mutations don't affect chart

### Default Dimensions

```typescript
// Fallback dimensions when view not specified:
width: 600, height: 400
// Auto-detects from parent container element
```

### Dimension Change Events

Axis components emit `dimensionsChanged` after measuring:
```typescript
// X-axis: labelOffset = height + 25 + 5
// Y-axis: labelOffset = 65 (Right) or 15 (Left)
```
- **TDD Test**: Verify axes don't clip with long labels

---

## Appendix D: CSS/Theme System

### Light Theme Defaults (Base)

```scss
.ngx-charts {
  .gridline-path {
    stroke: #ddd;
    stroke-width: 1;
  }
  .refline-path {
    stroke: #a8b2c7;
    stroke-width: 1;
    stroke-dasharray: 5;
  }
  .reference-area {
    fill-opacity: 0.05;
    fill: #000;
  }
  .grid-panel.odd rect {
    fill: rgba(0, 0, 0, 0.05);
  }
}
```

### Dark Theme Variables

```scss
// Backgrounds
$color-bg-darkest: #13141b;
$color-bg-darker: #1b1e27;
$color-bg-dark: #232837;
$color-bg-med: #2f3646;
$color-bg-light: #455066;
$color-bg-lighter: #5b6882;

// Text
$color-text-dark: #72809b;
$color-text-med-dark: #919db5;
$color-text-med: #a0aabe;
$color-text-med-light: #d9dce1;
$color-text-light: #f0f1f6;
$color-text-lighter: #fff;
```

### Tooltip Types

**Popover (Light):**
```scss
$popover-bg: #fff;
$popover-color: #060709;
$popover-border: #72809b;
```

**Tooltip (Dark):**
```scss
$tooltip-bg: rgba(0, 0, 0, 0.75);
$tooltip-color: #fff;
```

### SVG-Specific Patterns

- `stroke-dasharray` for dashed lines
- `stroke-dashoffset` animation for line drawing
- `opacity` transitions for hover states
- `translate3d` for GPU-accelerated positioning

---

## Appendix E: Hidden Edge Case Behaviors

Behaviors not obvious from component inputs:

### Tooltip Placement Flip

Automatically flips placement if tooltip would go off-screen:
```typescript
// Check bounds against viewport
// Flip from Top → Bottom if needed
// Flip from Left → Right if needed
```

### iOS Safari Handling

```typescript
// Adds 400ms to tooltip delay for iOS devices
// Detected via user agent check
// Addresses touch-and-hold tooltip differences
```

### Percentage Display Mode

Tooltip area can show percentage deltas:
```typescript
// Shows d1 - d0 formatted as percentage
// Uses showPercentage input flag
```

### Min/Max Range Symbols

Circle and tooltip display:
```typescript
// Uses ≥ symbol for minimum values
// Uses ≤ symbol for maximum values
```

### Label Text Wrapping

Ticks helper wraps on word boundaries:
```typescript
// Configurable maxLineLength
// Configurable maxLines
// Adds ellipsis when truncated
```

### Timeline Brush Selection

```typescript
// Brush 'end' event returns pixel selection
// Converts to data domain values
// Emits onDomainChange with [min, max]
```

### Data Label Height Tracking

Bar charts track label dimensions:
```typescript
// Emits size + index
// Parent adjusts axis offset
// Prevents label overflow
```

### Custom Colors Function

ColorHelper supports multiple formats:
```typescript
// String: color scheme name
// Array: [color1, color2, ...]
// Function: (value) => color
```

---

## Appendix F: Complete Events & Callbacks Inventory

### Output Events (~129 total across all components)

**Core Selection Events:**
| Event | Payload | Components |
|-------|---------|------------|
| `select` | `DataItem` | All charts |
| `activate` | `{name: StringOrNumberOrDate}` | All charts |
| `deactivate` | `{name: StringOrNumberOrDate}` | All charts |
| `dblclick` | `DataItem` | Bar, Pie |

**Legend Events:**
| Event | Payload | Components |
|-------|---------|------------|
| `labelClick` | `LegendEntry` | Legend |
| `labelActivate` | `LegendEntry` | Legend |
| `labelDeactivate` | `LegendEntry` | Legend |

**Tooltip Events:**
| Event | Payload | Components |
|-------|---------|------------|
| `show` | - | TooltipDirective |
| `hide` | - | TooltipDirective |
| `hover` | `{value: any}` | TooltipArea |

**Layout Events:**
| Event | Payload | Components |
|-------|---------|------------|
| `dimensionsChanged` | `ViewDimensions` | X-Axis, Y-Axis |
| `onDomainChange` | `[min, max]` | Timeline |

**Animation Events:**
| Event | Payload | Components |
|-------|---------|------------|
| `countChange` | `number` | CountDirective |
| `countFinish` | - | CountDirective |

### Formatting Callbacks

| Callback | Input | Return | Used In |
|----------|-------|--------|---------|
| `xAxisTickFormatting` | tick value | string | All X-axis charts |
| `yAxisTickFormatting` | tick value | string | All Y-axis charts |
| `axisTickFormatting` | tick value | string | Gauge |
| `valueFormatting` | value | string | Gauge, Number Card |
| `nameFormatting` | name | string | Advanced Pie |
| `percentageFormatting` | percent | string | Advanced Pie |
| `labelFormatting` | label | string | Pie |
| `dataLabelFormatting` | value | string | Bar charts |
| `tooltipText` | item | string | Various |

### Custom Templates

| Template | Data Context | Used In |
|----------|--------------|---------|
| `tooltipTemplate` | `{model, series, name, value, ...}` | 22+ chart components |
| `seriesTooltipTemplate` | `{series[], timestamp}` | Line, Area (multi-series) |

---

## Appendix G: Updated Test Matrix

### Revised Test Count Estimates

| Category | Count | Details |
|----------|-------|---------|
| Chart Types | 38 | All variants from demo |
| @Input Properties | ~200 unique | Relevant to visual output |
| Option Combinations | ~760 | Chart × relevant options |
| Animation Tests | 12 | Each timing verified |
| Interaction Tests | ~50 | Hover, click, tooltip |
| Theme Tests | 76 | 38 charts × 2 themes |
| SSR Tests | 38 | One per chart type |
| Responsive Tests | 38 | Resize behavior |
| Edge Case Tests | ~30 | iOS, overflow, wrap, etc. |
| **Total** | **~1,000+** | Full coverage |

### Priority Matrix for TDD

**P0 - Must Pass (Visual Parity):**
- All 38 chart types render correctly
- All color schemes work
- All axis configurations work
- Legend positioning correct

**P1 - Should Pass (Functionality):**
- All ~200 @Input properties functional
- All formatting callbacks work
- Custom tooltip templates work
- Theme switching works

**P2 - Nice to Have (Edge Cases):**
- SSR compatibility
- iOS Safari timing
- Tooltip flip behavior
- Label wrapping edge cases

---

## Appendix H: Full Option Reference

See the extracted Demo Options Matrix in the exploration results for complete option details per chart type.
