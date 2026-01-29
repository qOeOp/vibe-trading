# Task: State Management

Centralized state for hierarchy level, breadcrumb path, search, loading, and error states.

---

## Implementation

```typescript
export function HeatMapContainer(props: HeatMapContainerProps) {
  // Hierarchy state
  const [currentLevel, setCurrentLevel] = useState(0);
  const [breadcrumbPath, setBreadcrumbPath] = useState<BreadcrumbItem[]>([
    { label: '申万一级板块', level: 0 }
  ]);

  // Data state
  const [entities, setEntities] = useState<Entity[]>([]);
  const [filteredEntities, setFilteredEntities] = useState<Entity[]>([]);

  // UI state
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // ... handlers (Task 03, 05)
}
```

---

## Acceptance Criteria

✅ **State:**
- [ ] currentLevel: 0-3 (sector, industry, sub-industry, stock)
- [ ] breadcrumbPath: Array of hierarchy items
- [ ] entities: Current level data
- [ ] filteredEntities: Search-filtered data
- [ ] isLoading: Boolean loading state
- [ ] error: String or null
- [ ] searchQuery: String search input
- [ ] viewMode: 'grid' | 'list'
