# Implementation Plan - Web Architecture Redesign & Next.js Migration

## Phase 1: Infrastructure & Next.js Setup [checkpoint: e0fd80e]
- [x] Task: Re-configure `apps/web` project for Next.js in Nx
    - [x] Update `apps/web/project.json` to use Next.js executors
    - [x] Create `next.config.js` and `tsconfig.json` for Next.js
    - [x] Install required dependencies (`next`, `react`, `react-dom` @v15/19)
- [x] Task: Configure Shadcn UI Pathing
    - [x] Update `components.json` to point to `src/components/ui`
    - [x] Verify tailwind.config.ts compatibility with Next.js and Tailwind v4
- [x] Task: Conductor - User Manual Verification 'Phase 1: Infrastructure & Next.js Setup' (Protocol in workflow.md)

## Phase 2: Base Application Layer [checkpoint: 368b85c]
- [x] Task: Implement Root Layout and Global Styles
    - [x] Create `apps/web/src/app/layout.tsx`
    - [x] Migrate `globals.css` to the new structure
    - [x] Set up basic metadata and viewport settings
- [x] Task: Migrate Global Utilities and Hooks
    - [x] Move utility functions to `src/lib/`
    - [x] Move global hooks to `src/hooks/`
    - [x] Update all import paths to use `@/` aliases
- [x] Task: Conductor - User Manual Verification 'Phase 2: Base Application Layer' (Protocol in workflow.md)

## Phase 3: Component Library Restructuring [checkpoint: ec0b740]
- [x] Task: Migrate Atomic UI Components
    - [x] Move existing Shadcn components to `src/components/ui`
    - [x] Refactor to ensure "pure UI" (no business logic)
- [x] Task: Migrate Shared Business Components
    - [x] Move cross-feature components to `src/components/shared`
    - [x] Implement global layout components in `src/components/layouts`
- [x] Task: Conductor - User Manual Verification 'Phase 3: Component Library Restructuring' (Protocol in workflow.md)

## Phase 4: Feature Migration - Auth & Dashboard [checkpoint: 5621e14]
- [x] Task: Migrate Auth Feature
    - [x] Implement `src/features/auth/` (components, actions, schemas, types)
    - [x] Create Next.js route group `app/(auth)/` and pages
- [x] Task: Migrate Dashboard Feature
    - [x] Implement `src/features/dashboard/` (components, hooks)
    - [x] Create Next.js route group `app/(dashboard)/` and main page
- [x] Task: Conductor - User Manual Verification 'Phase 4: Feature Migration - Auth & Dashboard' (Protocol in workflow.md)

## Phase 5: Feature Migration - Market Data [checkpoint: f3f9592]
- [x] Task: Migrate Market Feature
    - [x] Implement `src/features/market/` (charts, utils, components)
    - [x] Create Market pages in `app/(dashboard)/market`
    - [x] Ensure Highcharts/Lightweight Charts integration is functional in Next.js
- [x] Task: Conductor - User Manual Verification 'Phase 5: Feature Migration - Market Data' (Protocol in workflow.md)

## Phase 6: Monorepo Verification & Cleanup
- [~] Task: Final System Integrity Check
    - [ ] Verify `tools/scripts/build-all.sh` builds the entire monorepo successfully
    - [ ] Run all unit tests with `nx test web`
    - [ ] Execute Playwright E2E tests for visual regression
- [ ] Task: Cleanup Legacy Vite Artifacts
    - [ ] Remove `vite.config.mts`, `index.html`, and old entry points
- [ ] Task: Conductor - User Manual Verification 'Phase 6: Monorepo Verification & Cleanup' (Protocol in workflow.md)
