# Task: Search Handler & Debounce

Debounced search handler for real-time filtering.

---

## Implementation

```typescript
import { useState, useEffect } from 'react';
import { useDebouncedValue } from '../hooks/useDebouncedValue';

// In parent component
const [searchQuery, setSearchQuery] = useState('');
const debouncedQuery = useDebouncedValue(searchQuery, 300);

useEffect(() => {
  // Filter entities based on debounced query
  const filtered = entities.filter(entity =>
    entity.name.toLowerCase().includes(debouncedQuery.toLowerCase())
  );
  setFilteredEntities(filtered);
}, [debouncedQuery, entities]);

<SearchBox value={searchQuery} onChange={setSearchQuery} />
```

```typescript
// apps/preview/src/app/hooks/useDebouncedValue.ts
export function useDebouncedValue<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}
```

---

## Acceptance Criteria

✅ **Handler:**
- [ ] onChange called on input change
- [ ] Debounce: 300ms delay
- [ ] Filtering updates after debounce
- [ ] Case-insensitive search
