# Task: Icon Mapping Implementation

TypeScript implementation with tree-shaking support and fallback handling.

---

## Implementation

```typescript
// apps/preview/src/app/data/iconMapping.ts

import {
  Wheat, Pickaxe, Flask, Factory, Gem,
  Cpu, Refrigerator, Coffee, Shirt, Package,
  Pill, Zap, Truck, Home, ShoppingCart,
  Palmtree, Grid3x3, Hammer, PaintBucket, Lightbulb,
  Cog, Shield, Monitor, Radio, Smartphone,
  Landmark, Car, CreditCard, Fuel, Droplets,
  CircuitBoard
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

/**
 * Mapping of SW Level-1 sector codes to Lucide React icons
 */
export const iconMapping: Record<string, LucideIcon> = {
  '801010': Wheat,        // 农林牧渔
  '801020': Pickaxe,      // 采掘
  '801030': Flask,        // 化工
  '801040': Factory,      // 钢铁
  '801050': Gem,          // 有色金属
  '801080': Cpu,          // 电子
  '801110': Refrigerator, // 家用电器
  '801120': Coffee,       // 食品饮料
  '801130': Shirt,        // 纺织服装
  '801140': Package,      // 轻工制造
  '801150': Pill,         // 医药生物
  '801160': Zap,          // 公用事业
  '801170': Truck,        // 交通运输
  '801180': Home,         // 房地产
  '801200': ShoppingCart, // 商业贸易
  '801210': Palmtree,     // 休闲服务
  '801230': Grid3x3,      // 综合
  '801710': Hammer,       // 建筑材料
  '801720': PaintBucket,  // 建筑装饰
  '801730': Lightbulb,    // 电气设备
  '801740': Cog,          // 机械设备
  '801750': Shield,       // 国防军工
  '801760': Monitor,      // 计算机
  '801770': Radio,        // 传媒
  '801780': Smartphone,   // 通信
  '801790': Landmark,     // 银行
  '801880': Car,          // 汽车
  '801890': CreditCard,   // 非银金融
  '801950': Fuel,         // 煤炭
  '802040': Droplets,     // 石油石化
  '801980': CircuitBoard, // 电子 (alt, if code repeats)
};

/**
 * Fallback icon for unknown sector codes
 */
export const fallbackIcon: LucideIcon = CircuitBoard;

/**
 * Get icon for sector code with fallback
 */
export function getIcon(code: string): LucideIcon {
  return iconMapping[code] || fallbackIcon;
}
```

---

## Usage

```typescript
// In HeatMapTile component
import { getIcon } from '../data/iconMapping';

const Icon = getIcon(entity.code);

<Icon size={iconSize} className="text-white/90" />
```

---

## Acceptance Criteria

✅ **Implementation:**
- [ ] All 31 icons imported from lucide-react
- [ ] iconMapping Record type correct
- [ ] fallbackIcon defined
- [ ] getIcon helper function works
- [ ] Tree-shaking supported (named imports)

✅ **Performance:**
- [ ] Only used icons bundled (tree-shaking)
- [ ] No full lucide-react import
