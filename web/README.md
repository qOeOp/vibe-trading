# Vibe Trading Web Application

## Project Architecture

### Technology Stack
- React 18
- TypeScript
- React Router v6
- Tailwind CSS v4
- shadcn/ui
- Zustand (state management)
- Recharts (charts)
- @tanstack/react-table (tables)
- next-themes (theme management)

### Directory Structure

```
web/src/
├── app/                    # Application entry & routing
│   └── app.tsx            # Main route definitions
├── features/              # Feature-based architecture
│   ├── auth/              # Authentication feature
│   │   ├── components/    # Auth components
│   │   │   ├── auth-page.tsx
│   │   │   ├── floating-paths.tsx
│   │   │   └── logo.tsx
│   │   └── index.ts       # Barrel exports
│   └── dashboard/         # Dashboard feature
│       ├── pages/         # Page-level components
│       │   ├── overview-page.tsx
│       │   └── deals-page.tsx
│       ├── components/    # Business components
│       │   ├── dashboard-layout.tsx
│       │   ├── dashboard-sidebar.tsx
│       │   ├── dashboard-header.tsx
│       │   ├── stats-cards.tsx
│       │   ├── deals-table.tsx
│       │   ├── welcome-section.tsx
│       │   ├── theme-toggle.tsx
│       │   └── charts/
│       │       ├── lead-sources-chart.tsx
│       │       └── revenue-flow-chart.tsx
│       ├── data/          # Data layer (Mock Data)
│       │   ├── deals.ts
│       │   └── stats.ts
│       ├── store/         # State management
│       │   └── dashboard-store.ts
│       ├── hooks/         # Custom hooks
│       │   └── use-mobile.ts
│       ├── types/         # TypeScript types
│       │   └── index.ts
│       └── index.ts       # Barrel exports
├── components/            # Shared UI components
│   └── ui/
│       ├── auth/          # Auth-specific UI
│       │   ├── button.tsx
│       │   ├── input.tsx
│       │   ├── input-group.tsx
│       │   └── textarea.tsx
│       └── dashboard/     # Dashboard-specific UI
│           ├── avatar.tsx
│           ├── badge.tsx
│           ├── card.tsx
│           ├── table.tsx
│           ├── chart.tsx
│           ├── sidebar.tsx
│           └── ... (shadcn/ui components)
├── lib/                   # Utility functions
│   └── utils.ts
├── styles.css             # Global styles
└── main.tsx               # Application entry

```

## Architecture Design Principles

### 1. Feature-Based Architecture
Each feature is a self-contained module with all related code:
- **pages/**: Route entry components
- **components/**: Business logic components
- **data/**: Data layer (currently mock, future API)
- **store/**: State management
- **hooks/**: Custom React hooks
- **types/**: TypeScript definitions

### 2. Layered Design

#### Page Layer (`features/{feature}/pages/`)
- Route entry points
- Compose business components
- Handle page-level data and state

Example:
```tsx
// features/dashboard/pages/overview-page.tsx
export function OverviewPage() {
  return (
    <div data-testid="page-overview">
      <WelcomeSection />
      <StatsCards />
      <LeadSourcesChart />
      <RevenueFlowChart />
    </div>
  );
}
```

#### Component Layer (`features/{feature}/components/`)
- Reusable business components
- Contain business logic
- Accept props, render UI

Example:
```tsx
// features/dashboard/components/stats-cards.tsx
export function StatsCards() {
  const stats = statsData;
  return <div>{/* Render stats cards */}</div>;
}
```

#### UI Layer (`components/ui/`)
- Pure presentational components
- No business logic
- Highly reusable
- Organized by feature: `ui/auth/`, `ui/dashboard/`

#### Data Layer (`features/{feature}/data/`)
- Currently: Mock Data
- Future: API service layer

Current:
```tsx
// features/dashboard/data/deals.ts
export const deals: Deal[] = [...]
```

Future:
```tsx
// features/dashboard/services/deals-service.ts
export async function fetchDeals() {
  return api.get<Deal[]>('/api/deals');
}
```

#### State Layer (`features/{feature}/store/`)
- Zustand for global state
- Feature-scoped stores

```tsx
export const useDashboardStore = create<DashboardState>((set) => ({
  searchQuery: "",
  setSearchQuery: (query) => set({ searchQuery: query }),
}));
```

### 3. Routing Architecture

```
/ → AuthPage
/app → DashboardLayout (shared layout: sidebar + header)
  ├── /app/dashboard/overview → OverviewPage
  ├── /app/dashboard/deals → DealsPage
  └── /app/dashboard/analytics → AnalyticsPage (future)
```

### 4. Theme System
- Uses `next-themes` (works with non-Next.js projects)
- Default: Dark theme
- Supports: Dark / Light / System
- User can toggle in Dashboard Header

### 5. Testing Strategy
All functional components include `data-testid` attributes:

**Naming convention**: `{feature}-{component}-{element}-{descriptor}`

Examples:
- `auth-login-button-google`
- `dashboard-sidebar-nav-overview`
- `dashboard-stats-card-revenue`
- `dashboard-deals-table`

## Development Guide

### Adding a New Page
1. Create page component in `features/{feature}/pages/`
2. Add route in `app/app.tsx`
3. Add navigation link in sidebar
4. Include `data-testid="page-{name}"`

### Adding a New Component
1. Determine type: UI component vs business component
2. **UI component** → `components/ui/{feature}/`
3. **Business component** → `features/{feature}/components/`
4. Add TypeScript types to `features/{feature}/types/`
5. Add `data-testid` attributes

### API Integration (Future)
When backend ready:
1. Create `features/{feature}/services/` directory
2. Implement API call functions
3. Create React Query hooks (optional)
4. Replace mock data imports with API hooks

### Styling
- **Global styles**: `src/styles.css`
- **Tailwind classes**: In components
- **New CSS variables**: Add to `src/styles.css`

## Running the Project

```bash
# Install dependencies
npm install

# Development
nx serve web

# Production build
nx build web

# Run tests
nx test web
```

## Dependencies

### Core
- `react-router-dom`: Routing
- `zustand`: State management
- `next-themes`: Theme switching

### UI
- `@radix-ui/*`: Accessible UI primitives
- `lucide-react`: Icons
- `recharts`: Charts
- `@tanstack/react-table`: Advanced tables

### Utilities
- `tailwind-merge`: Merge Tailwind classes
- `clsx`: Conditional classes
- `class-variance-authority`: Component variants

## Future Enhancements
- [ ] Connect backend API
- [ ] Implement authentication flow
- [ ] Add Analytics page
- [ ] Add unit tests
- [ ] Add E2E tests
- [ ] Add data filtering/search
- [ ] Add export functionality
- [ ] Internationalization

---

**Architecture**: Feature-based with clear separation of concerns  
**Theme**: Violet-bloom (from styles.css)  
**Default Theme**: Dark mode
