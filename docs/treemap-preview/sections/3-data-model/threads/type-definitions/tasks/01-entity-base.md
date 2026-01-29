# Task: Entity Base Interface

Core entity interface with all required fields for data model.

---

## Implementation

```typescript
// apps/preview/src/app/types/entity.ts

export interface Entity {
  /** Unique identifier (sector code or stock code) */
  code: string;

  /** Display name in Chinese */
  name: string;

  /** Capital flow in 亿元 (positive = inflow, negative = outflow) */
  capitalFlow: number;

  /** Price change percentage (e.g., 2.35 for +2.35%, -1.87 for -1.87%) */
  changePercent: number;

  /** Attention level (0-100) - controls BreathingDot animation speed */
  attentionLevel: number;

  /** Hierarchy level (0=sector, 1=industry, 2=sub-industry, 3=stock) */
  level: number;

  /** Parent entity code (undefined for L1 sectors) */
  parentCode?: string;

  /** Child entities (undefined for L4 stocks) */
  children?: Entity[];

  /** Optional: 30-day price history for Sparkline */
  sparklineData?: number[];
}
```

---

## Acceptance Criteria

✅ **Required Fields:**
- [ ] code: string (unique ID)
- [ ] name: string (Chinese display name)
- [ ] capitalFlow: number (亿元, can be negative)
- [ ] changePercent: number (%, can be negative)
- [ ] attentionLevel: number (0-100 range)
- [ ] level: number (0-3 range)

✅ **Optional Fields:**
- [ ] parentCode: string | undefined
- [ ] children: Entity[] | undefined
- [ ] sparklineData: number[] | undefined
