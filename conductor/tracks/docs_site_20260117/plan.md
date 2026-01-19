# Implementation Plan - Independent MDX-Driven Documentation Site

## Phase 1: Project Initialization & Infrastructure
- [x] Task: Create new application `apps/wiki` using Rspress (Midscene style).
    - [x] Initialize Rspress project in `apps/wiki`.
    - [ ] Install MDX dependencies (`@mdx-js/react`, etc.) or configure documentation framework (e.g., Rspress/Nextra).
    - [ ] Configure `vite.config.ts` (or equivalent) for MDX processing.
- [x] Task: Dockerize the documentation service.
    - [x] Create `docker/docs.Dockerfile`.
    - [x] Update `docker-compose.yml` to include `docs` service on port `8216`.
    - [x] Verify container build and startup.
- [ ] Task: Conductor - User Manual Verification 'Project Initialization & Infrastructure' (Protocol in workflow.md)

## Phase 2: UI Foundation & Styling (Midscene Style)
- [x] Task: Implement Base Layout.
    - [x] Create `Layout` component with Sidebar, Header, and Main Content area.
    - [x] Implement responsive behavior for mobile sidebar.
- [x] Task: Integrate Tailwind CSS & Theming.
    - [x] Configure Tailwind to match "Violet Bloom" theme (Dark mode by default).
    - [x] Apply typography styles (clean sans-serif, monospace for code).
- [x] Task: Develop Core MDX Components.
    - [x] Implement `Callout` component (Info/Warn/Tip).
    - [x] Implement `CodeBlock` with syntax highlighting (e.g., using `prism-react-renderer` or `shiki`).
    - [x] Implement `Card` component for high-level navigation.
- [ ] Task: Conductor - User Manual Verification 'UI Foundation & Styling' (Protocol in workflow.md)

## Phase 3: Content Structure & Migration
- [x] Task: Define Navigation Structure.
    - [x] Create configuration file for sidebar menu (e.g., `sidebar.json` or config object).
    - [x] Implement recursive sidebar rendering logic.
- [x] Task: Migrate Existing Documentation.
    - [x] Move/Copy content from `docs/plans` to `apps/docs/src/content/architecture`.
    - [x] Create placeholder pages for `API Reference` and `Product Guide`.
- [x] Task: Implement Search Functionality.
    - [x] Integrate a search library (e.g., `cmdk` or a lightweight fuzzy search) for documentation pages.
- [x] Task: Conductor - User Manual Verification 'Content Structure & Migration' (Protocol in workflow.md) [checkpoint: 0e4b87d]

## Phase 4: Integration & CI/CD
- [x] Task: Update Development Scripts. (3b43115)
    - [x] Update `tools/scripts/dev.sh` to optionally start the docs site.
    - [x] Update `tools/scripts/build-all.sh` to include `docs` image.
- [x] Task: Final Polish & Release. (5269427)
    - [x] Verify all internal links.
    - [x] Ensure 404 page exists.
    - [x] Optimize production build size.
- [~] Task: Conductor - User Manual Verification 'Integration & CI/CD' (Protocol in workflow.md)
