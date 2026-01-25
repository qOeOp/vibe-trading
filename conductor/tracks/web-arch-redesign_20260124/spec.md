# Track: Web Architecture Redesign & Next.js Migration

## 1. Overview
This track involves a comprehensive architectural redesign of the `apps/web` frontend application. The primary goals are to migrate the existing Vite-based Single Page Application (SPA) to **Next.js 15 (App Router)** and implement a **Feature-Sliced Design** directory structure. This restructuring aims to improve code cohesion, enforce the Single Responsibility Principle (SRP), and optimize the codebase for scalability and AI-assisted development.

## 2. Technical Stack Changes
- **Framework:** Migrate from **Vite (React SPA)** to **Next.js 15 (App Router)**.
- **Language:** TypeScript (Strict Mode).
- **Styling:** Tailwind CSS.
- **UI Library:** Shadcn UI (Radix Primitives).
- **State/Data:** React 19 Server Components & Server Actions (replacing client-side only fetching where appropriate).

## 3. Directory Structure Specification
The new structure inside `apps/web/src` will strictly adhere to the following schema:

```text
apps/web/src/
├── app/                       # Next.js App Router (Routing and Layout)
│   ├── (auth)/                # Route Group: Auth
│   ├── (dashboard)/           # Route Group: Dashboard
│   ├── layout.tsx             # Root Layout
│   └── globals.css
├── components/                # Global Common Components
│   ├── ui/                    # Shadcn Atomic Components (Button, Card...)
│   ├── shared/                # Cross-Feature Shared Components
│   └── layouts/               # Global Layout Components
├── features/                  # Business Domains (Feature-Sliced)
│   ├── auth/                  # e.g., components/, actions/, schemas/, types.ts
│   ├── dashboard/             # e.g., components/, hooks/
│   └── market/                # e.g., components/, utils/, types.ts
├── lib/                       # Global Utilities (db, api-client, utils)
└── hooks/                     # Global Hooks
```

## 4. Migration Strategy (Replace)
- The existing `apps/web` configuration (Vite) will be replaced with a Next.js configuration compatible with the Nx monorepo.
- Existing components will be refactored and moved into the new `features/` or `components/` directories.
- Routing will be migrated from React Router (if used) to Next.js file-system routing.

## 5. Coding Standards & Principles
- **Single Responsibility Principle (SRP):** Components must be small and focused.
- **Colocation:** Business logic, state, and specific components must reside within their respective `features/<name>` directory.
- **Atomic Design:** Generic UI components belong in `components/ui` and should not contain business logic.
- **Naming Conventions:** Kebab-case for files, PascalCase for components, Named Exports only.

## 6. Acceptance Criteria
1.  **Monorepo Integrity:** The full project build script (`tools/scripts/build-all.sh`) executes successfully, ensuring the migration does not break other applications or libraries.
2.  **Next.js Implementation:** The `apps/web` application successfully builds (`nx build web`) and runs (`nx serve web`) as a Next.js application.
3.  **Visual & Functional Regression:** Existing pages and features (Dashboard, Market Data, etc.) render correctly and function as before.
    - Verified via manual visual inspection or regression testing.
    - Verified via Playwright E2E tests (if applicable/existing tests are adapted).
4.  **Test Suite Compliance:** All existing unit tests are migrated/adapted and pass (`nx test web`).
5.  **Shadcn Configured:** `components.json` is correctly configured to point to `apps/web/src/components/ui`.
