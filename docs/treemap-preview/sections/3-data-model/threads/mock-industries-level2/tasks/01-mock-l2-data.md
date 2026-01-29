# Task: Mock L2 Data

8 industry entities under 电子 sector.

---

## Implementation

```typescript
// apps/preview/src/app/data/mockIndustriesL2.ts

export const mockIndustriesL2: Entity[] = [
  { code: '8010801', name: '半导体', capitalFlow: 45.6, changePercent: 3.12, attentionLevel: 82, level: 1, parentCode: '801080' },
  { code: '8010802', name: '集成电路', capitalFlow: 52.3, changePercent: 3.45, attentionLevel: 88, level: 1, parentCode: '801080' },
  { code: '8010803', name: '光学光电子', capitalFlow: 28.9, changePercent: 2.67, attentionLevel: 74, level: 1, parentCode: '801080' },
  { code: '8010804', name: '电子元件', capitalFlow: 34.2, changePercent: 2.89, attentionLevel: 76, level: 1, parentCode: '801080' },
  { code: '8010805', name: '消费电子', capitalFlow: 41.7, changePercent: 3.21, attentionLevel: 79, level: 1, parentCode: '801080' },
  { code: '8010806', name: '电子化学品', capitalFlow: 18.5, changePercent: 2.34, attentionLevel: 68, level: 1, parentCode: '801080' },
  { code: '8010807', name: '印刷电路板', capitalFlow: 23.1, changePercent: 2.56, attentionLevel: 71, level: 1, parentCode: '801080' },
  { code: '8010808', name: '其他电子', capitalFlow: 12.4, changePercent: 1.89, attentionLevel: 62, level: 1, parentCode: '801080' },
];
```

**Parent:** 电子 (801080)  
**Count:** 8 industries
