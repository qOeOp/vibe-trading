# Specification: Independent MDX-Driven Documentation Site

## 1. Overview
Develop a standalone, decoupled documentation website for Vibe Trading. This site will serve as the central hub for architectural diagrams, API references, product specifications, and user guides. It must be MDX-driven to allow for rich content authoring and share the same visual aesthetic as the [Midscene](https://github.com/web-infra-dev/midscene/tree/main/apps/site) documentation.

## 2. Technical Requirements

### 2.1 Architecture
- **Type:** Microservice (Frontend).
- **Port:** `8216` (External), mapped internally as needed.
- **Framework:** React-based Static Site Generator (SSG) or Documentation Framework.
    - *Recommendation:* **Rspress** (used by Midscene) or **Nextra** / **VitePress**. Given the project uses Vite/Nx, a generic React+Vite app with MDX is possible, but a dedicated framework like Rspress provides the "Midscene style" out of the box.
- **Independence:** Must run independently of the main `web` dashboard.
- **Deployment:** Dockerized (`docs.Dockerfile`).

### 2.2 Core Features
- **MDX Support:** Full support for writing content in `.mdx` with React component embedding.
- **Navigation:**
    - Sidebar navigation (auto-generated from file structure or config).
    - Table of contents (TOC) for individual pages.
- **Search:** Client-side full-text search.
- **Theming:** Dark/Light mode support, matching Vibe Trading's "Violet Bloom" aesthetic (High contrast dark mode).

### 2.3 Content Scope
- **Architecture:** System diagrams, data flow (Kafka/Redis), microservice boundaries.
- **API References:** REST API endpoints, WebSocket event schemas.
- **Product Design:** Feature specifications, UX guidelines, User personas.
- **User Manual:** "How-to" guides for trading, backtesting, and AI features.

## 3. Design & UX
- **Style Inspiration:** [Midscene Documentation](https://midscenejs.com/).
- **Key Elements:**
    - Clean typography (Sans-serif).
    - Distinct code blocks with syntax highlighting.
    - "Callout" blocks (Info, Warning, Tip).
    - Responsive layout (Mobile-friendly sidebar).

## 4. Deliverables
- `apps/docs` (New Nx application).
- `docker/docs.Dockerfile`.
- `tools/scripts/dev.sh` update (to include docs site).
- Initial content migration (from `docs/` folder).
