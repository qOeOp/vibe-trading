# Task: Mock L3 Data

7 sub-industry entities under 半导体 industry.

---

## Implementation

```typescript
// apps/preview/src/app/data/mockSubIndustriesL3.ts

export const mockSubIndustriesL3: Entity[] = [
  { code: '80108011', name: '半导体材料', capitalFlow: 15.8, changePercent: 3.45, attentionLevel: 85, level: 2, parentCode: '8010801' },
  { code: '80108012', name: '半导体设备', capitalFlow: 18.2, changePercent: 3.67, attentionLevel: 88, level: 2, parentCode: '8010801' },
  { code: '80108013', name: '芯片设计', capitalFlow: 12.6, changePercent: 3.21, attentionLevel: 82, level: 2, parentCode: '8010801' },
  { code: '80108014', name: '芯片制造', capitalFlow: 21.4, changePercent: 3.89, attentionLevel: 90, level: 2, parentCode: '8010801' },
  { code: '80108015', name: '芯片封测', capitalFlow: 9.7, changePercent: 2.98, attentionLevel: 78, level: 2, parentCode: '8010801' },
  { code: '80108016', name: '功率半导体', capitalFlow: 11.3, changePercent: 3.12, attentionLevel: 80, level: 2, parentCode: '8010801' },
  { code: '80108017', name: '模拟芯片', capitalFlow: 8.5, changePercent: 2.87, attentionLevel: 76, level: 2, parentCode: '8010801' },
];
```

**Parent:** 半导体 (8010801)  
**Count:** 7 sub-industries
