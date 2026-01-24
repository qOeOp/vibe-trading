# Specification: Comprehensive Coding Guidelines & Best Practices

## 1. Overview
Establish a strict, comprehensive, and industry-standard "Coding Guidelines" documentation suite for the Vibe Trading project. This document will serve as the single source of truth for engineering standards, enforcing best practices from top-tier tech companies (e.g., Google, Meta) tailored to our specific stack (Nx, TypeScript/React, Python/FastAPI, Kafka).

The guidelines will not just be about syntax, but about the **software design lifecycle**: enforcing a "Design-First" approach (Diagrams -> Interfaces -> Code) and strict adherence to architectural principles (SOLID, Design Patterns).

## 2. Functional Requirements

### 2.1. Structure & Location
- Create a dedicated directory: `docs/guidelines/`.
- **Index File:** `docs/guidelines/README.md` (The entry point).
- **Integration:** Update `conductor/product-guidelines.md` to reference and enforce these new standards.

### 2.2. Content Categories (Strict Enforcement)
The documentation must cover the following distinct areas:

#### A. Core Language & Style Standards
- **TypeScript (Frontend/Gateway):**
    - Strict typing (no `any`).
    - Functional programming preference.
    - Naming conventions (Google TS Style Guide adaptation).
- **Python (Microservices):**
    - PEP 8 adherence.
    - Type hinting (Pydantic/MyPy strict mode).
    - Async patterns (FastAPI/Aiokafka specifics).

#### B. Software Design & Workflow (The "Design-First" Mandate)
- **Development Lifecycle:**
    1.  **Analysis:** Identify applicable Design Patterns.
    2.  **Visual Design:** Create Architecture/Sequence Diagrams (Mermaid.js).
    3.  **Contract Definition:** Define Interfaces/ABCs (Abstract Base Classes) *before* implementation.
    4.  **Implementation:** Coding the logic.
- **Principles:**
    - **SOLID:** Mandatory application in class/module design.
    - **Single Responsibility Principle (SRP):** Strict enforcement at function and module levels.
    - **DRY / KISS / YAGNI.**

#### C. Architecture & Patterns
- **Backend Patterns:** Repository Pattern, Dependency Injection, Factory Pattern (for Strategy/Model selection).
- **Event-Driven Patterns:** Idempotency, Event Schema Evolution, Dead Letter Handling.
- **Frontend Patterns:** Component Composition, Container/Presentational separation, Custom Hooks for logic.

#### D. Quality & Operations
- **Testing:** TDD mandate, Test Pyramid (Unit vs. Integration vs. E2E).
- **Observability:** Structured Logging context, Tracing standards.
- **Error Handling:** Global exception handling strategies, standardized error responses.

### 2.3. Tone & Rigor
- The language must be **prescriptive** ("Must", "Required") rather than suggestive ("Should", "Could").
- Examples must show "Bad vs. Good" implementations.

## 3. Acceptance Criteria
- [ ] `docs/guidelines/` directory created with granular markdown files (e.g., `typescript.md`, `python.md`, `design-patterns.md`, `workflow.md`).
- [ ] "Design-First" workflow clearly documented with examples of required diagrams.
- [ ] Python and TypeScript sections reference/adapt industry standards (Google/AirBnB).
- [ ] SOLID and Design Patterns section provides concrete examples relevant to Trading/FinTech (e.g., Strategy Pattern for Order Execution).
- [ ] `conductor/product-guidelines.md` updated to link to these new standards.
