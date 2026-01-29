# Task: Search Input Container

Container with search icon and input field.

---

## Implementation

```typescript
import { Search } from 'lucide-react';

export function SearchBox({ value, onChange, placeholder = '搜索板块、行业、股票...', className }: SearchBoxProps) {
  return (
    <div className={`search-box ${className}`}>
      <Search size={16} className="search-icon" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="search-input"
      />
    </div>
  );
}
```

```css
.search-box {
  position: relative;
  width: 200px;
  height: 32px;
}

.search-icon {
  position: absolute;
  left: 8px;
  top: 50%;
  transform: translateY(-50%);
  color: #9ca3af;  /* gray-400 */
  pointer-events: none;
}
```

---

## Acceptance Criteria

✅ **Container:**
- [ ] Width: 200px
- [ ] Height: 32px
- [ ] Search icon: 16px, gray-400, left-aligned
