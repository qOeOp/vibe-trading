# Product Guidelines

## Visual Identity
- **Theme:** Modern Dark Mode ("Violet Bloom").
- **Aesthetic:** High-contrast, sleek dark interface with neon accents (Violet, Pink, Cyan) to minimize eye strain during long trading sessions.
- **Data Visualization:** Use crisp, high-performance charting libraries. Color-coding must be distinct and universally understood (e.g., Green/Cyan for positive, Red/Pink for negative) but consistent with the theme's palette.
- **Layout:** Modular, grid-based dashboard layout allowing users to customize their workspace.

## User Experience (UX) Principles
- **Efficiency First:** Critical actions (placing orders, cancelling trades) must be accessible within 1-2 clicks.
- **Real-time Responsiveness:** The UI must reflect market changes instantly via WebSockets without manual refreshing.
- **Cognitive Load Management:** Information density should be high but organized. Use collapsible panels and tabs to hide secondary details until needed.

## AI Persona & Voice
- **Dynamic Tone Adaptation:** The AI's voice modulates based on the calculated confidence level and probability of profit:
    - **High Confidence (>80%):** **Authoritative & Confident.** Uses direct, assertive language ("Strong Signal", "High Conviction") to prompt decisive action.
    - **Medium Confidence (50-80%):** **Clinical & Objective.** Focuses on data points, probabilities, and neutral risk assessment. Presents the trade as a calculated probability.
    - **Low Confidence / Educational (<50% or Analysis Mode):** **Educational & Collaborative.** Explains the rationale, highlights conflicting signals, and focuses on the "why" to help the user understand the market nuance.
- **Transparency:** All AI suggestions must be accompanied by the "Chain of Thought" or reasoning log to build trust.

## Design System (Existing)
- **Palette:**
    - Primary: `#6e3ff3` (Violet)
    - Accent: `#df3674` (Pink)
    - Secondary: `#35b9e9` (Cyan)
- **Typography:** Monospace fonts for data/numbers; Clean sans-serif for UI text.

---

## Engineering Guidelines (Mandatory)
All development must strictly adhere to the project's [Comprehensive Coding Guidelines](../guidelines/README.md).

### Core Pillars
1.  **[Design-First Workflow](../guidelines/workflow.md)**: Every task must start with an Analysis phase, Architecture/Sequence diagrams (Mermaid.js), and Interface definitions before implementation.
2.  **[Software Principles](../guidelines/principles.md)**: Strict adherence to SOLID, SRP, DRY, and Composition over Inheritance.
3.  **[Design Patterns](../guidelines/patterns.md)**: Identify and apply industry-standard patterns (Strategy, Repository, Factory) to solve architectural challenges.
4.  **[Language Standards](../guidelines/README.md#language-standards)**: Strict typing in TypeScript (React 19) and mandatory type hinting in Python (FastAPI).
5.  **[Operational Standards](../guidelines/ops.md)**: TDD mandate, structured logging, and standardized error handling.
