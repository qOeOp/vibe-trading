# Implementation Plan: Wiki Service Refactor (Fumadocs Migration)

## Phase 1: Framework Cleanup & Next.js Initialization [checkpoint: 4816a32]
- [x] Task: Clean up legacy Rspress files and dependencies d639d48
    - [ ] Remove `rspress.config.ts`
    - [ ] Remove `doc_build/` directory
    - [ ] Update `apps/wiki/package.json`: Remove `rspress` and add `next`, `react`, `react-dom`, `typescript`, `@types/react`, `@types/react-dom`, `@types/node`
- [x] Task: Initialize Next.js App Router structure in `apps/wiki` d639d48
    - [ ] Create `apps/wiki/app/layout.tsx` (Basic structure)
    - [ ] Create `apps/wiki/app/page.tsx` (Root landing page)
    - [ ] Add `next.config.mjs`, `tsconfig.json`, and `postcss.config.mjs` (aligned with project standards)
- [x] Task: Conductor - User Manual Verification 'Phase 1: Framework Cleanup & Next.js Initialization' (Protocol in workflow.md) 4816a32

## Phase 2: Fumadocs Core Integration & Source Provider [checkpoint: f52dded]
- [x] Task: Install Fumadocs dependencies 1025a1f
    - [ ] Run `npm install fumadocs-ui fumadocs-core fumadocs-content-collections` (or equivalent)
- [x] Task: Configure Fumadocs Source Provider 1025a1f
    - [ ] Create `apps/wiki/lib/source.ts` to define the documentation source using `loader`
    - [ ] Configure `content-collections.config.ts` for MDX processing
- [x] Task: Implement Content Mapping Logic 5f2ee61
    - [ ] Create the sidebar mapping logic using Fumadocs' `source` object
- [x] Task: Conductor - User Manual Verification 'Phase 2: Fumadocs Core Integration & Source Provider' (Protocol in workflow.md) f52dded

## Phase 3: Content Migration & MDX Layout [checkpoint: e68af5f]
- [x] Task: Migrate Documentation Files 3190e9e
    - [ ] Move content from `apps/wiki/docs/` to `apps/wiki/content/`
    - [ ] Create `meta.json` files in content folders for ordering (A/B/C logic)
- [x] Task: Implement Documentation Layout 3190e9e
    - [ ] Create `apps/wiki/app/docs/[[...slug]]/page.tsx` for dynamic routing
    - [ ] Implement `apps/wiki/app/docs/layout.tsx` using `DocsLayout` from Fumadocs
- [x] Task: Write Tests for Content Rendering 3190e9e
    - [ ] Create unit tests to verify MDX files are correctly loaded and slugs are generated
- [x] Task: Implement MDX Component Verification 3190e9e
    - [ ] Ensure custom MDX components (if any) are correctly registered and rendered
- [x] Task: Conductor - User Manual Verification 'Phase 3: Content Migration & MDX Layout' (Protocol in workflow.md) e68af5f

## Phase 4: Styling & UI Integration [checkpoint: 0661f3a]
- [x] Task: Duplicate Visual Identity from `apps/web` fb84683
    - [ ] Copy `tailwind.config.ts` values (colors, fonts, spacing) to `apps/wiki/tailwind.config.ts`
    - [ ] Synchronize `apps/wiki/app/globals.css` with `apps/web` standards
- [x] Task: Refine Documentation UI fb84683
    - [ ] Customize Fumadocs `DocsLayout` theme to match Vibe-Trading dashboard
    - [ ] Implement consistent header/footer (if applicable)
- [x] Task: Conductor - User Manual Verification 'Phase 4: Styling & UI Integration' (Protocol in workflow.md) 0661f3a

## Phase 5: Search & Feature Alignment [checkpoint: e4d0ad4]
- [x] Task: Implement Local Search 4b377f9
    - [ ] Integrate Fumadocs built-in search UI and logic
    - [ ] Verify search indexing for the migrated content
- [x] Task: Verify Accessibility Compliance 4b377f9
    - [ ] Perform accessibility audit and fix issues (Keyboard navigation, ARIA labels)
- [x] Task: Conductor - User Manual Verification 'Phase 5: Search & Feature Alignment' (Protocol in workflow.md) e4d0ad4

## Phase 6: Build, Documentation & Production Readiness
- [ ] Task: Update Project Documentation
    - [ ] Update `apps/wiki/README.md` to reflect the new architecture
    - [ ] Generate fresh MDX content for the Wiki itself based on the current project state (self-documenting)
- [ ] Task: Build Verification
    - [ ] Run `npm run build` in `apps/wiki` to verify SSG
    - [ ] Run `nx build wiki` to ensure Nx integration is correct
    - [ ] Fix any broken links or rendering issues found during build
- [ ] Task: Update Docker Configuration
    - [ ] Modify `docker/docs.Dockerfile` (or `wiki.Dockerfile`) to support the new Next.js build process
- [ ] Task: Conductor - User Manual Verification 'Phase 6: Build, Documentation & Production Readiness' (Protocol in workflow.md)
