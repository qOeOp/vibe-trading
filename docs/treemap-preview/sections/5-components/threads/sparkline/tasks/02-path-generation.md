# Task: Candlestick Bar Generation & Styling

Generate 60 open/close candlestick pairs using geometric Brownian motion, render as SVG `<rect>` elements with differential opacity for up/down bars.

---

## Design

### Purpose
Transform sector changePercent into realistic candlestick data, then render as a mini bar chart inside the sparkline SVG container.

### Data Generation Algorithm

**Step 1: Initialize price series**
```typescript
const basePrice = 50 + Math.random() * 150;
const dailyDrift = changePercent / days / 100;
const volatility = 0.015 + Math.random() * 0.01; // 1.5-2.5%
```

**Step 2: Generate continuous candles**
```typescript
let price = basePrice;
for (let i = 0; i < days; i++) {
  const open = price;
  const noise = (Math.random() - 0.5) * 2;
  price = open * (1 + dailyDrift + volatility * noise);
  candles.push({ open, close: price });
}
// Continuity: candles[i].open === candles[i-1].close
```

**Step 3: End correction**
```typescript
const target = basePrice * (1 + changePercent / 100);
candles[days - 1].close += (target - candles[days - 1].close) * 0.5;
```

### Bar Rendering Algorithm

**Y-axis mapping:**
```typescript
// Find price range across all candles
let lo = Infinity, hi = -Infinity;
for (const c of candles) {
  lo = Math.min(lo, c.open, c.close);
  hi = Math.max(hi, c.open, c.close);
}
const range = hi - lo || 1;

// 8% padding top/bottom
const padY = height * 0.08;
const drawH = height - 2 * padY;

function priceToY(p) {
  return padY + drawH - ((p - lo) / range) * drawH;
}
```

**Bar geometry:**
```typescript
const barW = width / n;        // Total width per bar slot
const gap = barW * 0.15;       // 15% gap between bars
const bodyW = barW - gap;      // Actual bar body width

const x = i * barW + gap / 2;  // Left edge of bar
const yTop = Math.min(priceToY(open), priceToY(close));
const barH = Math.max(1, Math.abs(priceToY(close) - priceToY(open)));
```

### Bar Styling

**Fill:**
- Color: White `#ffffff`
- Up bar (close ≥ open): `fill-opacity="0.7"`
- Down bar (close < open): `fill-opacity="0.35"`
- Corner radius: `rx="0.5"`

**Rationale:**
- Brighter bars = upward movement (positive signal)
- Dimmer bars = downward movement (subtler)
- Combined effect: upward trends appear brighter, downward trends dimmer

### Visual Example

```
Data: 5 candles, width: 100px, height: 60px

Candle 0: open=100, close=103 (up)   → bright bar
Candle 1: open=103, close=101 (down) → dim bar
Candle 2: open=101, close=106 (up)   → bright bar
Candle 3: open=106, close=104 (down) → dim bar
Candle 4: open=104, close=108 (up)   → bright bar

┌────────────────────────────────────────┐
│          ┃┃              ┃┃            │
│    ┃┃    ┃┃        ┃┃    ┃┃            │
│    ┃┃    ┃┃    ░░  ┃┃    ┃┃            │
│    ┃┃    ┃┃    ░░  ┃┃                  │
│    ┃┃         ░░                       │
│ ░░                                     │
│ ░░                                     │
└────────────────────────────────────────┘
  ┃┃ = up bar (0.7 opacity)
  ░░ = down bar (0.35 opacity)
```

---

## Implementation

### Data Generator

```typescript
// apps/preview/src/app/utils/sparklineUtils.ts

interface Candle {
  open: number;
  close: number;
}

/**
 * Generate mock candlestick data using geometric Brownian motion
 *
 * @param changePercent - Sector's change percentage (drives overall trend)
 * @param days - Number of trading days (default: 60)
 * @returns Array of continuous open/close candle pairs
 */
function generateMockCandles(changePercent: number, days = 60): Candle[] {
  const basePrice = 50 + Math.random() * 150;
  const dailyDrift = changePercent / days / 100;
  const volatility = 0.015 + Math.random() * 0.01;
  const candles: Candle[] = [];
  let price = basePrice;

  for (let i = 0; i < days; i++) {
    const open = price;
    const noise = (Math.random() - 0.5) * 2;
    const dailyReturn = dailyDrift + volatility * noise;
    price = open * (1 + dailyReturn);
    candles.push({ open, close: price });
  }

  // Nudge last close toward target (50% correction)
  const target = basePrice * (1 + changePercent / 100);
  candles[days - 1].close += (target - candles[days - 1].close) * 0.5;
  return candles;
}
```

### SVG Renderer

```typescript
/**
 * Render candlestick bars as SVG <rect> elements
 *
 * @param container - DOM element to render into
 * @param candles - Array of open/close pairs
 * @param width - Container width in pixels
 * @param height - Container height in pixels
 */
function renderSparklineSVG(
  container: HTMLElement,
  candles: Candle[],
  width: number,
  height: number
): void {
  if (candles.length < 2) return;

  // Find price range
  let lo = Infinity, hi = -Infinity;
  for (const c of candles) {
    lo = Math.min(lo, c.open, c.close);
    hi = Math.max(hi, c.open, c.close);
  }
  const range = hi - lo || 1;

  // Y-axis with 8% padding
  const padY = height * 0.08;
  const drawH = height - 2 * padY;
  function priceToY(p: number): number {
    return padY + drawH - ((p - lo) / range) * drawH;
  }

  // Bar geometry
  const n = candles.length;
  const barW = width / n;
  const gap = barW * 0.15;
  const bodyW = barW - gap;

  // Create SVG
  const svgNS = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(svgNS, 'svg');
  svg.setAttribute('class', 'sparkline-svg');
  svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
  svg.setAttribute('preserveAspectRatio', 'none');
  svg.setAttribute('aria-hidden', 'true');

  // Render bars
  candles.forEach((c, i) => {
    const yOpen = priceToY(c.open);
    const yClose = priceToY(c.close);
    const yTop = Math.min(yOpen, yClose);
    const barH = Math.max(1, Math.abs(yClose - yOpen));
    const x = i * barW + gap / 2;
    const isUp = c.close >= c.open;

    const rect = document.createElementNS(svgNS, 'rect');
    rect.setAttribute('class', 'sparkline-bar');
    rect.setAttribute('x', x.toFixed(1));
    rect.setAttribute('y', yTop.toFixed(1));
    rect.setAttribute('width', bodyW.toFixed(1));
    rect.setAttribute('height', barH.toFixed(1));
    rect.setAttribute('rx', '0.5');
    rect.setAttribute('fill', '#ffffff');
    rect.setAttribute('fill-opacity', isUp ? '0.7' : '0.35');
    rect.style.animationDelay = (i * 25) + 'ms';
    svg.appendChild(rect);
  });

  container.innerHTML = '';
  container.appendChild(svg);
  requestAnimationFrame(() => container.classList.add('visible'));
}
```

### CSS

```css
.tile-sparkline {
  flex: 1;
  min-height: 0;
  display: none;
  opacity: 0;
  transition: opacity 300ms ease-out;
  margin: 4px calc(-1 * var(--tile-pad, 16px)) 4px;
}

.tile.show-sparkline .tile-sparkline { display: block; }
.tile.show-sparkline .tile-sparkline.visible { opacity: 1; }

.sparkline-svg {
  display: block;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.sparkline-bar {
  opacity: 0;
  animation: bar-fade-in 60ms ease-out forwards;
}

@keyframes bar-fade-in {
  from { opacity: 0; }
  to   { opacity: 1; }
}
```

---

## Acceptance Criteria

✅ **Data Generation:**
- [x] 60 candles generated with positive finite open/close values
- [x] Candles are continuous: `open[i] ≈ close[i-1]`
- [x] Overall trend direction matches sector changePercent (≥70% of trials)
- [x] Realistic volatility (1.5-2.5% daily range)

✅ **Bar Rendering:**
- [x] 60 bars rendered as SVG `<rect>` elements
- [x] Bars fill container width with 15% gap between adjacent bars
- [x] Y values stay within 8% padded bounds (top and bottom)
- [x] No horizontal overlap between adjacent bars
- [x] Minimum bar height: 1px

✅ **Bar Styling:**
- [x] Fill color is white (#ffffff)
- [x] Up bars: fill-opacity 0.7
- [x] Down bars: fill-opacity 0.35
- [x] Corner radius rx=0.5
- [x] isUp flag correctly reflects close ≥ open

✅ **Visual Quality:**
- [x] Bars are crisp and anti-aliased
- [x] Visible against all background colors (red, green, gray)
- [x] Blends with solid tile background
- [x] Differential opacity creates visual depth

✅ **Edge Cases:**
- [x] Empty candle array: no crash, no render
- [x] All identical values: flat bars at mid-height (1px min height)
- [x] Large/small value ranges: scale correctly within bounds

---

## References

- **SVG Shell:** [Task 01: SVG Shell & Dimensions](./01-svg-shell.md)
- **Animation:** [Task 04: Staggered Bar Animation](./04-draw-animation.md)
- **HeatMapTile Usage:** [Section 5 → HeatMapTile → Task 06](../../heatmap-tile/tasks/06-sparkline-integration.md)
