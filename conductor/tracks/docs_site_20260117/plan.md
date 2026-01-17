# Implementation Plan - Independent MDX-Driven Documentation Site

## Phase 1: Project Initialization & Infrastructure
- [ ] Task: Create new Nx React application `apps/docs` configured for MDX support.
    - [ ] Generate standard Nx React app.
    - [ ] Install MDX dependencies (`@mdx-js/react`, etc.) or configure documentation framework (e.g., Rspress/Nextra).
    - [ ] Configure `vite.config.ts` (or equivalent) for MDX processing.
- [ ] Task: Dockerize the documentation service.
    - [ ] Create `docker/docs.Dockerfile`.
    - [ ] Update `docker-compose.yml` to include `docs` service on port `8216`.
    - [ ] Verify container build and startup.
- [ ] Task: Conductor - User Manual Verification 'Project Initialization & Infrastructure' (Protocol in workflow.md)

## Phase 2: UI Foundation & Styling (Midscene Style)
- [ ] Task: Implement Base Layout.
    - [ ] Create `Layout` component with Sidebar, Header, and Main Content area.
    - [ ] Implement responsive behavior for mobile sidebar.
- [ ] Task: Integrate Tailwind CSS & Theming.
    - [ ] Configure Tailwind to match "Violet Bloom" theme (Dark mode by default).
    - [ ] Apply typography styles (clean sans-serif, monospace for code).
- [ ] Task: Develop Core MDX Components.
    - [ ] Implement `Callout` component (Info/Warn/Tip).
    - [ ] Implement `CodeBlock` with syntax highlighting (e.g., using `prism-react-renderer` or `shiki`).
    - [ ] Implement `Card` component for high-level navigation.
- [ ] Task: Conductor - User Manual Verification 'UI Foundation & Styling' (Protocol in workflow.md)

## Phase 3: Content Structure & Migration
- [ ] Task: Define Navigation Structure.
    - [ ] Create configuration file for sidebar menu (e.g., `sidebar.json` or config object).
    - [ ] Implement recursive sidebar rendering logic.
- [ ] Task: Migrate Existing Documentation.
    - [ ] Move/Copy content from `docs/plans` to `apps/docs/src/content/architecture`.
    - [ ] Create placeholder pages for `API Reference` and `Product Guide`.
- [ ] Task: Implement Search Functionality.
    - [ ] Integrate a search library (e.g., `cmdk` or a lightweight fuzzy search) for documentation pages.
- [ ] Task: Conductor - User Manual Verification 'Content Structure & Migration' (Protocol in workflow.md)

## Phase 4: Integration & CI/CD
- [ ] Task: Update Development Scripts.
    - [ ] Update `tools/scripts/dev.sh` to optionally start the docs site.
    - [ ] Update `tools/scripts/build-all.sh` to include `docs` image.
- [ ] Task: Final Polish & Release.
    - [ ] Verify all internal links.
    - [ ] Ensure 404 page exists.
    - [ ] Optimize production build size.
- [ ] Task: Conductor - User Manual Verification 'Integration & CI/CD' (Protocol in workflow.md)
