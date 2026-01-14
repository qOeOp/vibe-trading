# Vibe Trading

A modern trading dashboard application built with React, TypeScript, and Nx monorepo.

## 🚀 Features

### Dashboard
- **AI Assistant**: Interactive chat interface with gradient styling
- **Overview Page**:
  - Stats cards with key metrics
  - Lead sources pie chart (Recharts)
  - Revenue flow charts (bar/line/area)
  - Recent deals preview
- **Deals Management**: Full-featured deals table with filtering, search, and pagination
- **Analytics**: Coming soon

### Tech Stack
- **Frontend**: React 19, TypeScript, Vite
- **Routing**: React Router v6
- **Styling**: Tailwind CSS v4 with OKLCH color space
- **UI Components**: Radix UI primitives with custom styling
- **Charts**: Recharts v3
- **State Management**: Zustand
- **Icons**: Lucide React
- **Monorepo**: Nx 22.3.3

## 📦 Project Structure

```
vibe-trading/
├── web/                    # Main web application
│   ├── src/
│   │   ├── app/           # App routing
│   │   ├── components/    # Shared components
│   │   │   ├── auth-page.tsx
│   │   │   ├── ui/        # Base UI components
│   │   │   └── ...
│   │   ├── features/      # Feature modules
│   │   │   └── dashboard/
│   │   │       ├── components/
│   │   │       ├── pages/
│   │   │       ├── data/
│   │   │       └── store/
│   │   └── styles.css
│   └── package.json
└── dashboard-2/           # Reference template (Next.js)
```

## 🛠️ Development

### Prerequisites
- Node.js 20+
- npm or pnpm

### Setup

```bash
# Install dependencies
npm install

# Start development server
npx nx run web:serve --port=4200
```

Visit http://localhost:4200

### Available Commands

```bash
# Development
npx nx run web:serve          # Start dev server
npx nx run web:build          # Build for production
npx nx run web:test           # Run tests (if configured)

# Code Quality
npx nx run web:lint           # Lint code
npx nx format:write           # Format code

# Nx utilities
npx nx graph                  # View project graph
npx nx list                   # List installed plugins
```

## 🎨 Design System

### Color Palette (Violet Bloom Theme)
- Primary: `#6e3ff3` (violet)
- Accent: `#df3674` (pink)
- Secondary: `#35b9e9` (cyan)
- Tertiary: `#375dfb` (blue)
- Supporting: `#e255f2` (magenta)

### Border Radius
- Base: `0.625rem` (10px)
- Cards: `1.025rem` (16.4px)

## 📝 Recent Updates

### Latest Changes (January 2026)
- ✅ Fixed Recharts v3 initialization warnings using `initialDimension` API
- ✅ Updated AI Assistant sidebar with Sparkles icon and gradient text
- ✅ Fixed Auth page Home button navigation to `/app/dashboard/overview`
- ✅ Changed Overview layout from grid to flex for responsive design
- ✅ Added missing React dependencies to web package
- ✅ Corrected all component import paths
- ✅ Added default dashboard route redirect
- ✅ Integrated dashboard-2 features with custom architecture

## 🔄 Git Workflow

This project uses git worktrees for feature development:

```bash
# List worktrees
git worktree list

# Create new worktree
git worktree add .worktrees/feature-name -b feature/feature-name

# Remove worktree
git worktree remove .worktrees/feature-name
```

Active branches:
- `main`: Production-ready code
- `feature/dashboard-integration`: Integration work (merged)
- `feature/dashboard-refinement`: UI refinements (merged)

## 🐛 Known Issues

- React Router v7 migration warnings (non-blocking)
- Chrome extension console messages (external)

## 📄 License

Private project

## 👤 Author

Vincent Xu (vincent@vibe.trading)

---

Built with ❤️ using Nx and React