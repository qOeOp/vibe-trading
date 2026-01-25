# Specification: Wiki Service Refactor (Fumadocs Migration)

## 1. Overview
The current Wiki microservice is built on `repress`, which is disconnected from the main project's TypeScript/Next.js ecosystem. This track involves removing `repress`, integrating `Fumadocs` as the core documentation framework, and ensuring the Wiki is technically and visually integrated with the Vibe-Trading monorepo.

**Primary Reference:** [Fumadocs Documentation](https://www.fumadocs.dev/docs)

## 2. Functional Requirements
### 2.1 Framework Transition
- Remove all `repress` dependencies, legacy configurations, and routing logic from `apps/wiki`.
- Initialize a Next.js application within `apps/wiki` using the App Router.
- Integrate `fumadocs-ui`, `fumadocs-core`, and `content-collections` (following the Fumadocs standard setup).

### 2.2 Content Migration
- Preserve and migrate existing `.md` and `.mdx` files to the new `apps/wiki/content` directory.
- Implement sidebar management using the **Hybrid** approach: Folder structure defines nesting, while `meta.json` files handle ordering and display names as per [Fumadocs Organising Files](https://www.fumadocs.dev/docs/ui/blocks/sidebar#organizing-files) guide.

### 2.3 Visual Integration
- Synchronize UI/UX with the main `web` application.
- **Implementation Strategy:** Duplicate relevant Tailwind configurations, theme variables, and global CSS from `apps/web` to `apps/wiki` to ensure consistent branding (colors, typography, spacing).

### 2.4 Features
- **Local Search:** Implement Fumadocs' built-in local search functionality.
- **MDX Components:** Verify and optimize the rendering of custom MDX components.
- **Public Access:** The Wiki will be publicly accessible (no authentication required).

## 3. Non-Functional Requirements
- **Performance:** Ensure high-performance SSG (Static Site Generation) for documentation pages.
- **Accessibility:** Adhere to WCAG 2.2 Level AA standards for the documentation interface.
- **Maintainability:** Follow the SRP (Single Responsibility Principle) by modularizing Fumadocs layout, search, and logic.

## 4. Acceptance Criteria
- [ ] Clean removal of `repress` with no residual framework code.
- [ ] Technical stack fully aligned with Next.js 15+ and TypeScript.
- [ ] All original documentation content is rendered correctly without data loss.
- [ ] Visual style is indistinguishable from the main project dashboard.
- [ ] Local search is functional and responsive.
- [ ] Successful production build (`next build`) and containerized deployment verification.

## 5. Out of Scope
- Integration of a Centralized Authentication system (as per user preference for public access).
- Migration to a shared UI library (opting for config duplication for simplicity in this phase).
