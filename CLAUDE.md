# Vibe Trading - Claude Code Guidelines

## Project Overview

Vibe Trading is a modern trading dashboard application built with React, TypeScript, and Nx monorepo. The project follows a feature-based architecture with clean separation of concerns.

## Tech Stack

- **Frontend**: React 19, TypeScript, Vite
- **Routing**: React Router v6
- **Styling**: Tailwind CSS v4 with OKLCH color space
- **UI Components**: Radix UI primitives with custom styling
- **Charts**: Recharts v3
- **State Management**: Zustand
- **Icons**: Lucide React
- **Monorepo**: Nx 22.3.3

## Code Style and Conventions

### File Organization

```
web/src/
├── app/              # App routing and configuration
├── components/       # Shared components
│   ├── ui/          # Base UI components (buttons, inputs, etc.)
│   └── ...          # Feature-agnostic components
├── features/        # Feature modules
│   └── dashboard/
│       ├── components/  # Feature-specific components
│       ├── pages/       # Page components
│       ├── data/        # Mock data and constants
│       └── store/       # State management
└── styles.css       # Global styles
```

### Component Guidelines

1. **Component Structure**
   - Use functional components with hooks
   - Export components as named exports (not default)
   - Keep components focused and single-purpose
   - Co-locate related components in feature directories

2. **TypeScript**
   - Always use explicit types for props and function signatures
   - Avoid `any` - use `unknown` when type is truly unknown
   - Use type inference where obvious
   - Define types inline for simple props, separate interface for complex ones

3. **React Patterns**
   - Use React 19 features (no legacy patterns)
   - Prefer composition over inheritance
   - Extract complex logic into custom hooks
   - Keep JSX readable - extract complex expressions

### Styling Conventions

1. **Tailwind CSS**
   - Use Tailwind utility classes for styling
   - Follow mobile-first responsive design: `sm:`, `md:`, `lg:`, `xl:`
   - Use semantic color tokens from the design system
   - Prefer `className` composition over inline styles

2. **Color Palette (Violet Bloom Theme)**
   ```
   Primary:    #6e3ff3 (violet)
   Accent:     #df3674 (pink)
   Secondary:  #35b9e9 (cyan)
   Tertiary:   #375dfb (blue)
   Supporting: #e255f2 (magenta)
   ```

3. **Border Radius System**
   ```
   --radius-sm:  0.425rem  (6.8px)
   --radius-md:  0.625rem  (10px)
   --radius-lg:  0.625rem  (10px)
   --radius-xl:  1.025rem  (16.4px)
   ```

### Import Conventions

1. **Import Order**
   ```typescript
   // 1. External libraries
   import { useState } from "react";
   import { Button } from "@/components/ui/button";

   // 2. Internal modules (feature-level)
   import { useStore } from "../store/use-store";

   // 3. Local imports (same directory)
   import { helper } from "./helper";

   // 4. Types
   import type { User } from "../types";
   ```

2. **Path Aliases**
   - Use `@/` for absolute imports from `src/`
   - Use relative imports for feature-internal modules
   - Use named imports (not `import *`)

### Chart Components

1. **Recharts Best Practices**
   - Always use `ResponsiveContainer` with `initialDimension` prop
   - Keep chart data separate from component logic
   - Use consistent color schemes from design system
   - Implement proper TypeScript types for chart data

2. **Chart Data Management**
   - Data should be internal to chart components (not passed as props)
   - Use state for interactive features (filters, time ranges)
   - Keep data transformations in helper functions

### Component-Specific Rules

1. **No Next.js Directives**
   - Never use `"use client"` or `"use server"` (this is a Vite project)
   - Avoid Next.js-specific imports or patterns

2. **Theme Management**
   - Dark mode is hardcoded in `main.tsx`
   - Don't use `next-themes` or external theme providers
   - Use Tailwind's dark mode classes when needed

3. **Data Props**
   - Chart components manage their own data internally
   - Don't pass data as props to chart components
   - Use composition for complex data flows

## Testing

- Use `data-testid` attributes for test selectors
- Follow naming convention: `page-{name}`, `dashboard-{component}-{name}`
- Keep test IDs descriptive and unique

## Development Commands

```bash
# Start development server
npx nx run web:serve --port=4200

# Build for production
npx nx run web:build

# Run linter
npx nx run web:lint

# Format code
npx nx format:write

# View project graph
npx nx graph
```

## Git Workflow

- Use git worktrees for feature development
- Follow conventional commit messages
- Keep commits atomic and focused
- Merge completed work to `main` branch

## Performance Considerations

1. **Component Optimization**
   - Use React.memo() for expensive components
   - Implement proper dependency arrays in hooks
   - Avoid unnecessary re-renders

2. **Bundle Size**
   - Use dynamic imports for large components
   - Avoid importing entire libraries
   - Tree-shake unused dependencies

## Accessibility

- Use semantic HTML elements
- Include ARIA labels for interactive elements
- Ensure keyboard navigation works
- Test with screen readers

## Error Handling

- Use error boundaries for component errors
- Provide user-friendly error messages
- Log errors for debugging
- Handle loading and error states

## Code Review Checklist

Before committing code, ensure:
- [ ] TypeScript types are explicit and correct
- [ ] No `any` types without justification
- [ ] Components follow single responsibility
- [ ] Imports are organized and clean
- [ ] No Next.js-specific code
- [ ] Tailwind classes are used consistently
- [ ] Responsive design is implemented
- [ ] Test IDs are added where needed
- [ ] No console.log() statements left in code
- [ ] Code is formatted with Prettier

## Common Pitfalls to Avoid

1. ❌ Using `"use client"` directive (this is not Next.js)
2. ❌ Passing data props to chart components
3. ❌ Using `next-themes` for theme management
4. ❌ Mixing inline styles with Tailwind
5. ❌ Creating components without TypeScript types
6. ❌ Using default exports
7. ❌ Hardcoding values that should be in constants
8. ❌ Not handling loading/error states

## Resources

- [React 19 Documentation](https://react.dev)
- [Tailwind CSS v4](https://tailwindcss.com)
- [Recharts Documentation](https://recharts.org)
- [Nx Documentation](https://nx.dev)
- [Radix UI](https://www.radix-ui.com)

## Contact

- **Author**: Vincent Xu
- **Email**: vincent@vibe.trading
- **GitHub**: https://github.com/qOeOp/vibe-trading
