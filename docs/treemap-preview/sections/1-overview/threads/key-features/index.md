# Thread: Key Features

Core functionality and unique features of the application.

---

## Task: [Feature List](./tasks/01-feature-list.md)

**Core Features:**
1. 4-level drill-down hierarchy
2. Squarified treemap layout (ratio(1), S=1.35 horizontal bias)
3. 7-stop solid color ramp (Binance-style)
4. Sparkline on hover
5. Water ripple expansion (small tiles → W/d×H/d, d=min(4,√n))
6. Cross-level search
7. Breadcrumb navigation

---

## Feature Highlights

### Visual Features
- **Solid Tiles:** Opaque colors from 7-stop ramp with box-shadow hover glow
- **3D Hover:** -2px lift with shadow enhancement
- **7-Stop Colors:** Discrete stops from deep green to deep red
- **Sparklines:** 30-day price trend on hover (draw animation)
- **Water Ripple:** Small tiles expand to W/d×H/d, d=min(4,√n) on hover

### Interaction Features
- **Drill-Down:** Click tile → load children → animate
- **Drill-Up:** Click breadcrumb → load parent level
- **Search:** Real-time filter with 300ms debounce
- **Hover Details:** Sparkline appears on tiles >120×80px

### Data Features
- **Capital Flow:** Positive (inflow) / Negative (outflow)
- **Change %:** Price movement with 2 decimal precision
- **Icons:** 31 unique Lucide icons for sectors

---

## Unique Selling Points

1. **Chinese Market Optimized:** Red=up convention, 申万 classification
2. **Water Ripple Expansion:** Surrounding tiles compress smoothly for sparkline display
3. **Performance:** 60fps with 31 simultaneous animations
4. **Professional Design:** Clean solid tiles, no visual noise
