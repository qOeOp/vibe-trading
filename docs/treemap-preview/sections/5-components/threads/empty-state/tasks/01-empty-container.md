# Task: Empty Container & Icon

Centered container with gray search icon for empty state display.

---

## Implementation

```typescript
import { Search } from 'lucide-react';

export function EmptyState({ title = '无匹配结果', message = '请尝试其他关键词', className }: EmptyStateProps) {
  return (
    <div className={`empty-state ${className}`}>
      <Search size={48} className="text-gray-500" />
      {/* Messages: Task 02 */}
    </div>
  );
}
```

```css
.empty-state {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  background: rgba(17, 24, 39, 0.6);
  backdrop-filter: blur(4px);
  min-height: 400px;
}
```
