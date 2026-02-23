# Implementation Plan - Vibe Editor Audit

## Phase 1: Context & Setup
- [ ] Task: Review existing migration documentation and project READMEs to establish a baseline understanding.
    - [ ] Read `VIBE_EDITOR_MIGRATION_REPORT.md` (if available) and `apps/vibe-editor/README.md`.
    - [ ] Read `apps/web/src/features/lab/editor/README.md` (if available).
- [ ] Task: Create initial `VIBE_EDITOR_FULL_AUDIT.md` structure.
    - [ ] Initialize the file with the agreed-upon sections (Overview, Feature Inventory, etc.).
- [ ] Task: Conductor - User Manual Verification 'Context & Setup' (Protocol in workflow.md)

## Phase 2: Frontend Component Audit
- [ ] Task: Audit UI Components in `apps/web/src/features/lab/editor`.
    - [ ] List all interactive components (Buttons, Inputs, Menus).
    - [ ] Document the `onClick` / `onChange` handlers for each component.
- [ ] Task: Audit Frontend State Management.
    - [ ] Identify Zustand stores or React Contexts used by the editor.
    - [ ] Map state updates to user actions.
- [ ] Task: Audit Output Rendering.
    - [ ] Identify how the frontend renders Python outputs (HTML, images, stdout).
- [ ] Task: Conductor - User Manual Verification 'Frontend Component Audit' (Protocol in workflow.md)

## Phase 3: Backend Service Audit
- [ ] Task: Audit `apps/vibe-editor` API Surface.
    - [ ] List all HTTP endpoints (GET/POST) in `main.py` and routers.
    - [ ] List all WebSocket message types handled.
- [ ] Task: Audit Core Logic & Kernel Management.
    - [ ] Analyze how the Python kernel is started and managed.
    - [ ] Analyze how code is executed and results are captured.
- [ ] Task: Audit File System Integration.
    - [ ] Document how files are read, written, and saved.
- [ ] Task: Conductor - User Manual Verification 'Backend Service Audit' (Protocol in workflow.md)

## Phase 4: Integration & Gap Analysis
- [ ] Task: Map Frontend Interactions to Backend Handlers.
    - [ ] Create a matrix: `Frontend Action` -> `Network Request` -> `Backend Handler`.
- [ ] Task: Identify Dead & Legacy Code.
    - [ ] Flag code paths in `vibe-editor` that are never triggered by the current frontend.
    - [ ] Flag frontend features that do not have working backend support.
- [ ] Task: Conductor - User Manual Verification 'Integration & Gap Analysis' (Protocol in workflow.md)

## Phase 5: Final Reporting & Architecture Critique
- [ ] Task: Compile Final Audit Report.
    - [ ] Aggregate findings into `VIBE_EDITOR_FULL_AUDIT.md`.
- [ ] Task: Draft Architecture Critique & Roadmap.
    - [ ] Document architectural conflicts (Marimo patterns vs. Vibe patterns).
    - [ ] Propose specific refactoring steps and feature expansions.
- [ ] Task: Conductor - User Manual Verification 'Final Reporting' (Protocol in workflow.md)
