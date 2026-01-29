# Task: Color Specifications

Complete color system including base palette and dynamic 3-zone algorithm.

---

## Base Palette

```typescript
const colors = {
  // Backgrounds
  background: '#111827',        // gray-900 (main container)
  surfaceGlass: 'rgba(17, 24, 39, 0.6)',  // semi-transparent overlays

  // Text
  textPrimary: '#ffffff',       // white (main text)
  textSecondary: '#9ca3af',     // gray-400 (secondary text)
  textTertiary: '#6b7280',      // gray-500 (separators)

  // Price Indicators (Chinese Market Convention)
  priceUp: {
    light: 'rgba(213, 44, 162, 0.1-0.3)',   // Red gradient (active zone)
    dark: 'rgba(165, 35, 128, 0.25)',        // Deep red (extreme cap)
  },
  priceDown: {
    light: 'rgba(3, 145, 96, 0.1-0.3)',      // Green gradient (active zone)
    dark: 'rgba(2, 107, 69, 0.25)',          // Deep green (extreme cap)
  },
  priceNeutral: 'rgba(107, 114, 128, 0.15)', // Gray (dead zone)

  // UI Accents
  focus: '#6366f1',             // indigo-500 (focus borders, active states)
  error: '#ef4444',             // red-500 (error states)
  warning: '#f59e0b',           // amber-500 (BreathingDot - #facc15)
};
```

---

## 3-Zone Dynamic Color Algorithm

See complete implementation in:  
[Section 5 → HeatMapTile → Task 05: Dynamic Color System](../../../../5-components/threads/heatmap-tile/tasks/05-dynamic-color.md)

**Formula:**
```typescript
if (abs(changePercent) <= 0.2) return 'rgba(107, 114, 128, 0.15)';  // Dead
if (abs(changePercent) <= 3.0) {
  const intensity = (abs(changePercent) - 0.2) / 2.8;
  const alpha = 0.1 + intensity * 0.2;
  return changePercent > 0 ? `rgba(213, 44, 162, ${alpha})` : `rgba(3, 145, 96, ${alpha})`;
}
return changePercent > 0 ? 'rgba(165, 35, 128, 0.25)' : 'rgba(2, 107, 69, 0.25)';  // Extreme
```

---

## Acceptance Criteria

✅ **Base Palette:**
- [ ] All base colors documented
- [ ] Hex values and RGBA variants specified
- [ ] Chinese market convention (red=up) enforced

✅ **Dynamic System:**
- [ ] 3 zones clearly defined
- [ ] Alpha scaling linear in active zone
- [ ] Extreme cap prevents saturation
- [ ] Algorithm implementation available
