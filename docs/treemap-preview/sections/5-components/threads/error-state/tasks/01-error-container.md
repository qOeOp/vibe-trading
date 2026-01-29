# Task: Error Container & Icon

Centered container with red warning icon for error state display.

---

## Implementation

```typescript
import { AlertCircle } from 'lucide-react';

export function ErrorState({ title = '加载失败', message = '请检查网络连接后重试', onRetry, className }: ErrorStateProps) {
  return (
    <div className={`error-state ${className}`}>
      <AlertCircle size={48} className="text-red-500" />
      {/* Messages: Task 02 */}
      {/* Button: Task 03 */}
    </div>
  );
}
```

```css
.error-state {
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
