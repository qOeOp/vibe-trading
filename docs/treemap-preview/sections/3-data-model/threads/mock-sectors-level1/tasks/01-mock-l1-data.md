# Task: Mock L1 Data

Complete array of 31 sector entities for root level visualization.

---

## Implementation

```typescript
// apps/preview/src/app/data/mockSectorsL1.ts

import type { Entity } from '../types/entity';

export const mockSectorsL1: Entity[] = [
  { code: '801010', name: '农林牧渔', capitalFlow: 12.5, changePercent: 1.23, attentionLevel: 45, level: 0 },
  { code: '801020', name: '采掘', capitalFlow: -8.3, changePercent: -0.87, attentionLevel: 62, level: 0 },
  { code: '801030', name: '化工', capitalFlow: 25.7, changePercent: 2.15, attentionLevel: 58, level: 0 },
  { code: '801040', name: '钢铁', capitalFlow: -15.2, changePercent: -1.45, attentionLevel: 41, level: 0 },
  { code: '801050', name: '有色金属', capitalFlow: 18.9, changePercent: 1.67, attentionLevel: 55, level: 0 },
  { code: '801080', name: '电子', capitalFlow: 145.8, changePercent: 3.24, attentionLevel: 89, level: 0 },
  { code: '801110', name: '家用电器', capitalFlow: 32.4, changePercent: 1.98, attentionLevel: 51, level: 0 },
  { code: '801120', name: '食品饮料', capitalFlow: 78.6, changePercent: 2.56, attentionLevel: 72, level: 0 },
  { code: '801130', name: '纺织服装', capitalFlow: -12.5, changePercent: -1.12, attentionLevel: 38, level: 0 },
  { code: '801140', name: '轻工制造', capitalFlow: 15.3, changePercent: 0.89, attentionLevel: 44, level: 0 },
  { code: '801150', name: '医药生物', capitalFlow: 95.2, changePercent: 2.87, attentionLevel: 81, level: 0 },
  { code: '801160', name: '公用事业', capitalFlow: 8.7, changePercent: 0.45, attentionLevel: 36, level: 0 },
  { code: '801170', name: '交通运输', capitalFlow: -18.9, changePercent: -1.34, attentionLevel: 47, level: 0 },
  { code: '801180', name: '房地产', capitalFlow: -45.6, changePercent: -2.67, attentionLevel: 68, level: 0 },
  { code: '801200', name: '商业贸易', capitalFlow: 12.8, changePercent: 0.76, attentionLevel: 42, level: 0 },
  { code: '801210', name: '休闲服务', capitalFlow: 22.3, changePercent: 1.54, attentionLevel: 49, level: 0 },
  { code: '801230', name: '综合', capitalFlow: 6.5, changePercent: 0.32, attentionLevel: 35, level: 0 },
  { code: '801710', name: '建筑材料', capitalFlow: -9.8, changePercent: -0.95, attentionLevel: 43, level: 0 },
  { code: '801720', name: '建筑装饰', capitalFlow: 7.2, changePercent: 0.68, attentionLevel: 40, level: 0 },
  { code: '801730', name: '电气设备', capitalFlow: 52.3, changePercent: 2.34, attentionLevel: 64, level: 0 },
  { code: '801740', name: '机械设备', capitalFlow: 28.9, changePercent: 1.76, attentionLevel: 52, level: 0 },
  { code: '801750', name: '国防军工', capitalFlow: 34.7, changePercent: 2.12, attentionLevel: 59, level: 0 },
  { code: '801760', name: '计算机', capitalFlow: 67.5, changePercent: 2.98, attentionLevel: 76, level: 0 },
  { code: '801770', name: '传媒', capitalFlow: -23.4, changePercent: -1.87, attentionLevel: 54, level: 0 },
  { code: '801780', name: '通信', capitalFlow: 41.2, changePercent: 1.89, attentionLevel: 61, level: 0 },
  { code: '801790', name: '银行', capitalFlow: 125.6, changePercent: 1.45, attentionLevel: 71, level: 0 },
  { code: '801880', name: '汽车', capitalFlow: 56.8, changePercent: 2.43, attentionLevel: 66, level: 0 },
  { code: '801890', name: '非银金融', capitalFlow: 89.3, changePercent: 2.01, attentionLevel: 69, level: 0 },
  { code: '801950', name: '煤炭', capitalFlow: -32.7, changePercent: -2.15, attentionLevel: 57, level: 0 },
  { code: '802040', name: '石油石化', capitalFlow: -27.5, changePercent: -1.76, attentionLevel: 53, level: 0 },
  { code: '801980', name: '电子', capitalFlow: 145.8, changePercent: 3.24, attentionLevel: 89, level: 0 },
];
```

---

## Data Characteristics

- **Capital Flow Range:** -45.6亿 to +145.8亿
- **Change % Range:** -2.67% to +3.24%
- **Attention Range:** 35 to 89
- **Distribution:** Mix of positive/negative flows, realistic market conditions

---

## Acceptance Criteria

✅ **Data Quality:**
- [ ] All 31 sectors included
- [ ] Realistic value ranges
- [ ] Chinese names correct
- [ ] Sector codes match SW Level-1 standard
