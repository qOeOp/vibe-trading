# TypeScript & React Coding Standards

These standards apply to all TypeScript code in the `web` and `api` applications.

## 1. TypeScript Standards

### Strict Typing
- **No `any`**: The use of `any` is strictly prohibited. Use `unknown` if the type is truly unknown, and perform type narrowing.
- **Explicit Returns**: Always define the return type of exported functions.
- **Interfaces over Types**: Prefer `interface` for object definitions to allow for declaration merging, use `type` for unions or aliases.

### Naming Conventions
- **Classes/Interfaces/Types**: `PascalCase` (e.g., `UserService`).
- **Variables/Functions**: `camelCase` (e.g., `calculateTotal`).
- **Constants**: `UPPER_SNAKE_CASE` (e.g., `MAX_RETRY_ATTEMPTS`).
- **Files**: `kebab-case` (e.g., `auth-provider.tsx`).

### Functional Programming
- **Immutability**: Use `const` by default. Avoid mutating arrays; use `map`, `filter`, `reduce`.
- **Pure Functions**: Logic should be extracted into pure, testable functions whenever possible.

---

## 2. React Standards (React 19)

### Component Design
- **Functional Components**: Class components are prohibited.
- **Composition over Props Drilling**: Use Component Composition or Context/Zustand for state sharing.
- **Container/Presentational**: Separate logic (hooks) from UI (JSX).

### Hooks
- **Rules of Hooks**: Strictly follow the official Rules of Hooks.
- **Custom Hooks**: Extract complex logic into custom hooks (e.g., `useOrderBook`).
- **`use` Hook**: Leverage React 19's `use` for consuming promises and context where applicable.

### Styling (Tailwind CSS v4)
- **Utility-First**: Use Tailwind classes for styling.
- **Class Variance Authority (CVA)**: Use `cva` for components with multiple variants (e.g., buttons).

### Performance
- **Memoization**: Use `useMemo` and `useCallback` judiciously to prevent unnecessary re-renders in performance-critical areas (like market data grids).

## Example: Good Component
```tsx
interface PriceDisplayProps {
  price: number;
  currency: string;
}

/**
 * Pure presentational component for displaying prices.
 */
export const PriceDisplay = ({ price, currency }: PriceDisplayProps): JSX.Element => {
  const formattedPrice = useMemo(() => formatCurrency(price, currency), [price, currency]);

  return (
    <span className="font-mono text-lg font-bold text-green-500">
      {formattedPrice}
    </span>
  );
};
```