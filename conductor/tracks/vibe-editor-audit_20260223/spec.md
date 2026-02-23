# Specification: Vibe Editor Feature & Architecture Audit (from Marimo)

## Overview
A comprehensive audit and mapping of the `vibe-editor` microservice and its corresponding frontend modules in the `web` application. This audit focuses on understanding the functional state, architectural integrity, and integration gaps of the editor components migrated from Marimo.

## Goals
1. **Feature Inventory:** List all UI features in the frontend editor and all logic/endpoints in the `vibe-editor` backend.
2. **Integration Mapping:** Document 1:1 connections between frontend interactions and backend behaviors.
3. **Gap Analysis:** Identify frontend features with no backend logic, and backend features not yet exposed to the frontend.
4. **Architectural Assessment:** Identify redundant, conflicting, or sub-optimal architectures resulting from the Marimo migration.
5. **Issue & Opportunity Log:** Document bugs, vulnerabilities, and potential for future feature expansion.

## Scope

### Frontend (React / `web` app)
- **Component Audit:** `apps/web/src/features/lab/editor/` and related shared components.
- **Event Handling:** Identify all interactive elements (buttons, inputs, menus) and their current handlers.
- **Rendering Logic:** Audit how Python execution results (tables, plots, logs) are rendered.

### Backend (FastAPI / `vibe-editor` service)
- **API Surface:** Map all endpoints in `apps/vibe-editor/`.
- **Core Logic:** Audit the Python execution engine, state management, and file system integration.
- **Marimo Migration Legacy:** Identify code/logic that is no longer relevant or conflicts with the "Vibe Trading" vision.

### System Lifecycle & Architecture
- **Boot Sequence:** How the editor starts, loads files, and initializes the Python kernel.
- **Reactive Flow:** How code execution triggers updates across the frontend and backend.
- **Data Serialization:** Audit how objects are shared between the Python process and the web client.

## Functional Requirements (Audit Output)
1. **Detailed Feature List:** A categorized list of all editor functions.
2. **Interaction Map:** A table showing `Frontend Action -> Backend Endpoint -> Expected Result`.
3. **Architecture Report:** A critique of the current design, highlighting "marimo-isms" that don't fit the project.
4. **Vulnerability & Issue Log:** A list of technical debt, bugs, and security concerns.
5. **Improvement Roadmap:** Recommendations for refactoring, fixing, and expanding the editor.

## Acceptance Criteria
- A single, structured Markdown document containing all findings.
- Clear identification of "dead" or "unconnected" code paths.
- Mapping of the complete system lifecycle (load, execute, save, exit).
- Identification of architectural conflicts between the migrated code and the Vibe Trading monorepo standards.

## Out of Scope
- Implementing the fixes or refactors (this is a discovery and planning task).
- Performance benchmarking (unless critical bottlenecks are identified).
