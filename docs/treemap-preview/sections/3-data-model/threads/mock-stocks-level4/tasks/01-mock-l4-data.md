# Task: Mock L4 Data

15 stock entities under 光学光电子 sub-industry.

---

## Implementation

```typescript
// apps/preview/src/app/data/mockStocksL4.ts

export const mockStocksL4: Entity[] = [
  { code: '600000', name: '浦发银行', capitalFlow: 2.8, changePercent: 1.23, attentionLevel: 65, level: 3, parentCode: '8010803' },
  { code: '600001', name: '邯郸钢铁', capitalFlow: -1.2, changePercent: -0.87, attentionLevel: 42, level: 3, parentCode: '8010803' },
  { code: '600002', name: '齐鲁石化', capitalFlow: 1.5, changePercent: 0.95, attentionLevel: 58, level: 3, parentCode: '8010803' },
  { code: '600003', name: '东北高速', capitalFlow: 0.8, changePercent: 0.45, attentionLevel: 38, level: 3, parentCode: '8010803' },
  { code: '600004', name: '白云机场', capitalFlow: 3.2, changePercent: 1.67, attentionLevel: 72, level: 3, parentCode: '8010803' },
  { code: '600005', name: '武钢股份', capitalFlow: -0.9, changePercent: -0.56, attentionLevel: 45, level: 3, parentCode: '8010803' },
  { code: '600006', name: '东风汽车', capitalFlow: 2.1, changePercent: 1.34, attentionLevel: 68, level: 3, parentCode: '8010803' },
  { code: '600007', name: '中国国贸', capitalFlow: 1.3, changePercent: 0.78, attentionLevel: 52, level: 3, parentCode: '8010803' },
  { code: '600008', name: '首创股份', capitalFlow: 0.7, changePercent: 0.34, attentionLevel: 41, level: 3, parentCode: '8010803' },
  { code: '600009', name: '上海机场', capitalFlow: 4.5, changePercent: 2.12, attentionLevel: 79, level: 3, parentCode: '8010803' },
  { code: '600010', name: '包钢股份', capitalFlow: -1.8, changePercent: -1.23, attentionLevel: 48, level: 3, parentCode: '8010803' },
  { code: '600011', name: '华能国际', capitalFlow: 2.6, changePercent: 1.45, attentionLevel: 61, level: 3, parentCode: '8010803' },
  { code: '600012', name: '皖通高速', capitalFlow: 1.1, changePercent: 0.67, attentionLevel: 49, level: 3, parentCode: '8010803' },
  { code: '600013', name: '华夏银行', capitalFlow: 3.7, changePercent: 1.89, attentionLevel: 74, level: 3, parentCode: '8010803' },
  { code: '600014', name: '中储股份', capitalFlow: 0.9, changePercent: 0.56, attentionLevel: 46, level: 3, parentCode: '8010803' },
];
```

**Parent:** 光学光电子 (8010803)  
**Count:** 15 stocks
