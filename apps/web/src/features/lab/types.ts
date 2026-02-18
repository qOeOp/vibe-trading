// ─── Lab Types ────────────────────────────────────────────

/** IC calculation method */
export type ICMethod = "rank" | "normal";

/** Winsorization method */
export type WinsorizationMethod = "mad" | "3sigma" | "percentile";

/** Universe / stock pool */
export type Universe = "全A" | "沪深300" | "中证500" | "中证1000";

/** Validation run status */
export type ValidationStatus = "idle" | "running" | "completed" | "error";

/** Overall verdict level */
export type VerdictLevel = "valid" | "marginal" | "invalid";

/** Per-step conclusion */
export type StepConclusion = "pass" | "warning" | "fail";

/** Right-panel context tab */
export type ContextPanelTab = "results" | "ai";

// ─── Marimo-Compatible Cell Types ───────────────────────
// Adapted from marimo-team/marimo frontend/src/core/cells/types.ts
// and frontend/src/core/network/types.ts

/**
 * Output channel — matches Marimo's CellChannel schema
 *
 * - "output": normal cell return value / display output
 * - "stdout": print() and sys.stdout
 * - "stderr": sys.stderr
 * - "marimo-error": runtime/syntax errors
 * - "media": rich media (images, HTML widgets)
 * - "stdin": input prompts (not used in Pyodide)
 * - "pdb": debugger (not used in Pyodide)
 */
export type OutputChannel =
  | "output"
  | "stdout"
  | "stderr"
  | "marimo-error"
  | "media"
  | "stdin"
  | "pdb";

/**
 * Known MIME types for cell output
 * Subset of Marimo's KnownMimeType — covers our Pyodide use cases
 */
export type KnownMimeType =
  | "text/plain"
  | "text/html"
  | "text/markdown"
  | "application/json"
  | "image/png"
  | "image/svg+xml"
  | "image/jpeg"
  | "application/vnd.marimo+error";

/**
 * OutputMessage — matches Marimo's CellOutput schema
 *
 * This is the canonical output format. The output-adapter.ts will
 * convert Pyodide worker messages into this format.
 */
export interface OutputMessage {
  channel: OutputChannel;
  mimetype: KnownMimeType;
  data: string | MarimoError[] | Record<string, unknown>;
  timestamp: number;
}

/**
 * MarimoError — structured error from the kernel
 */
export interface MarimoError {
  type: string;
  msg: string;
  /** Python traceback lines */
  traceback?: string[];
}

/**
 * Cell runtime status — matches Marimo's RuntimeState
 * Maps to visual states in Cell.css (.needs-run, .has-error, etc.)
 *
 * - "queued": waiting to execute (kernel has it in queue)
 * - "running": currently executing
 * - "idle": not running, no pending work
 * - "disabled-transitively": disabled because ancestor is disabled
 */
export type RuntimeState =
  | "queued"
  | "running"
  | "idle"
  | "disabled-transitively";

/**
 * CellConfig — matches Marimo's CellConfig schema
 * Per-cell configuration that persists across sessions
 */
export interface CellConfig {
  /** Whether code is hidden (collapsed) */
  hide_code: boolean;
  /** Whether cell is disabled (won't execute) */
  disabled: boolean;
}

/**
 * Outline entry for a cell (table of contents)
 */
export interface OutlineItem {
  name: string;
  level: number;
  /** Nested items */
  children?: OutlineItem[];
}

export interface CellOutline {
  items: OutlineItem[];
}

/**
 * CellData — static/serialized state of a cell
 * Adapted from Marimo's CellData interface
 */
export interface CellData {
  id: string;
  /** User-given name */
  name: string;
  /** Current editor contents */
  code: string;
  /** Whether cell has been modified since last run */
  edited: boolean;
  /** Snapshot of code that was last run */
  lastCodeRun: string | null;
  /** Execution time on session start / resume (seconds) */
  lastExecutionTime: number | null;
  /** Cell configuration */
  config: CellConfig;
}

/**
 * CellRuntimeState — dynamic runtime state of a cell
 * Adapted from Marimo's CellRuntimeState interface
 */
export interface CellRuntimeState {
  /** Cell's output (display output) */
  output: OutputMessage | null;
  /** TOC outline extracted from output */
  outline: CellOutline | null;
  /** Console outputs (stdout/stderr during execution) */
  consoleOutputs: OutputMessage[];
  /** Current runtime status */
  status: RuntimeState;
  /** Whether the cell has stale inputs (upstream changed) */
  staleInputs: boolean;
  /** Whether this cell was interrupted since last run */
  interrupted: boolean;
  /** Whether this cell was stopped (e.g. via error) */
  stopped: boolean;
  /** Whether marimo encountered an error (e.g. multiple definition) */
  errored: boolean;
  /** Run start time, as seconds since epoch */
  runStartTimestamp: number | null;
  /** Run elapsed time, in milliseconds */
  runElapsedTimeMs: number | null;
  /** Last run start timestamp */
  lastRunStartTimestamp: number | null;
}

/**
 * NotebookState — the shape of the overall notebook state
 * Adapted from Marimo's NotebookState (simplified for vertical layout)
 */
export interface NotebookState {
  /** Ordered list of cell IDs */
  cellIds: string[];
  /** Map of cell ID → static cell data */
  cellData: Record<string, CellData>;
  /** Map of cell ID → runtime state */
  cellRuntime: Record<string, CellRuntimeState>;
  /** Cell to scroll to after reorder */
  scrollKey: string | null;
  /** Deleted cell history for undo */
  history: DeletedCellEntry[];
}

/**
 * Entry in the undo history for deleted cells
 */
export interface DeletedCellEntry {
  name: string;
  code: string;
  index: number;
  config: CellConfig;
}

// ─── Factory Functions ──────────────────────────────────

export const DEFAULT_CELL_CONFIG: CellConfig = {
  hide_code: false,
  disabled: false,
};

export function createCellData(
  partial: Partial<CellData> & { id: string },
): CellData {
  return {
    name: "",
    code: "",
    edited: false,
    lastCodeRun: null,
    lastExecutionTime: null,
    config: { ...DEFAULT_CELL_CONFIG },
    ...partial,
  };
}

export function createCellRuntimeState(
  partial?: Partial<CellRuntimeState>,
): CellRuntimeState {
  return {
    output: null,
    outline: null,
    consoleOutputs: [],
    status: "idle",
    staleInputs: false,
    interrupted: false,
    stopped: false,
    errored: false,
    runStartTimestamp: null,
    runElapsedTimeMs: null,
    lastRunStartTimestamp: null,
    ...partial,
  };
}

// ─── Legacy Cell Types (backward compat) ────────────────
// These are still used by the existing store. They will be
// replaced by CellData + CellRuntimeState in Phase 2.3.

/** @deprecated Use RuntimeState instead */
export type CellStatus = "idle" | "running" | "done" | "error" | "stale";

/** @deprecated Use OutputMessage instead */
export interface CellOutput {
  stream: "stdout" | "stderr" | "result";
  text: string;
  timestamp: number;
}

/**
 * LabCell — legacy single cell type (combines data + runtime)
 * @deprecated Will be split into CellData + CellRuntimeState in Phase 2.3
 */
export interface LabCell {
  id: string;
  name: string;
  code: string;
  outputs: CellOutput[];
  status: CellStatus;
  executionOrder: number | null;
  defines: string[];
  uses: string[];
}

/** Right sidebar overlay panel types */
export type SidebarPanel = "data" | "snippets" | "variables" | "console" | null;

// ─── Legacy Types (deprecated, kept for backward compat) ──

/** @deprecated Use LabCell instead */
export type EditorTab = "code" | "notes" | "preprocessing";

/** @deprecated No longer used in cell-based architecture */
export interface EditorStats {
  line: number;
  col: number;
  chars: number;
  lines: number;
  fileName: string;
}

/** @deprecated Use LabCell instead */
export interface LabFile {
  id: string;
  name: string;
  content: string;
  language: "python";
  isDirty: boolean;
}

// ─── Validation Config ───────────────────────────────────

export interface ValidationConfig {
  icMethod: ICMethod;
  winsorization: WinsorizationMethod;
  quantileGroups: 5 | 10;
  holdingPeriods: number[];
  universe: Universe;
  filterST: boolean;
}

export const DEFAULT_VALIDATION_CONFIG: ValidationConfig = {
  icMethod: "rank",
  winsorization: "mad",
  quantileGroups: 5,
  holdingPeriods: [1, 5, 10, 21],
  universe: "全A",
  filterST: true,
};

// ─── Preprocessing Pipeline ──────────────────────────────

export interface PreprocessConfig {
  winsorize: boolean;
  standardize: boolean;
  industryNeutral: boolean;
  capNeutral: boolean;
}

export const DEFAULT_PREPROCESS_CONFIG: PreprocessConfig = {
  winsorize: true,
  standardize: true,
  industryNeutral: true,
  capNeutral: true,
};

// ─── Validation Result Types ─────────────────────────────

export interface ICStats {
  icMean: number;
  icStd: number;
  ir: number;
  icPositiveRatio: number;
  tStat: number;
  icSkewness: number;
  icKurtosis: number;
  coverageRate: number;
  icTimeSeries: number[];
}

export interface QuantileGroup {
  label: string;
  avgReturn: number;
}

export interface LongShortPoint {
  date: string;
  value: number;
}

export interface QuantileReturns {
  groups: QuantileGroup[];
  monotonicity: number;
  longShortReturn: number;
  longShortMaxDD: number;
  longShortIR: number;
  longShortCurve: LongShortPoint[];
}

export interface ICDecayLag {
  lag: number;
  ic: number;
}

export interface MultiPeriodStat {
  period: number;
  icMean: number;
  icStd: number;
  ir: number;
  icSkew: number;
  icKurt: number;
  icNegRatio: number;
}

export interface ICDecay {
  lags: ICDecayLag[];
  halfLife: number;
  multiPeriodStats: MultiPeriodStat[];
}

// ─── Orthogonality Test (Step 4) ─────────────────────────

export interface OrthogonalFactor {
  name: string;
  correlation: number;
  pValue: number;
}

export interface OrthogonalityTest {
  knownFactors: OrthogonalFactor[];
  maxCorrelation: number;
  residualIC: number;
  independenceRatio: number;
}

// ─── Conditional IC Analysis (Step 5) ────────────────────

export interface ConditionalICGroup {
  condition: string;
  icMean: number;
  icStd: number;
  sampleRatio: number;
}

export interface ConditionalICAnalysis {
  byMarketRegime: ConditionalICGroup[];
  byVolatility: ConditionalICGroup[];
  byLiquidity: ConditionalICGroup[];
  stabilityScore: number;
}

// ─── Factor Attribution (Step 6) ─────────────────────────

export interface AttributionExposure {
  name: string;
  exposure: number;
  contribution: number;
}

export interface IndustryWeight {
  industry: string;
  weight: number;
}

export interface FactorAttribution {
  styleExposures: AttributionExposure[];
  industryExposures: IndustryWeight[];
  alphaIC: number;
  r2: number;
  specificRisk: number;
}

// ─── Turnover & Cost (Step 7) ────────────────────────────

export interface TurnoverByPeriod {
  period: string;
  turnover: number;
  cost: number;
}

export interface TurnoverAnalysis {
  dailyTurnover: number;
  annualTurnover: number;
  estimatedCostBps: number;
  netICAfterCost: number;
  breakEvenCost: number;
  byPeriod: TurnoverByPeriod[];
  turnoverTimeSeries: number[];
  costDecayRatio: number;
}

// ─── Full Validation Result ──────────────────────────────

export interface ValidationResult {
  icStats: ICStats;
  quantileReturns: QuantileReturns;
  icDecay: ICDecay;
  orthogonality: OrthogonalityTest;
  conditionalIC: ConditionalICAnalysis;
  attribution: FactorAttribution;
  turnover: TurnoverAnalysis;
  verdict: VerdictLevel;
  stepConclusions: Record<number, StepConclusion>;
}

// ─── Pyodide Worker Types (Cell-Based) ──────────────────

/** Messages sent TO the Pyodide Web Worker */
export type PyodideWorkerInMessage =
  | { type: "INIT" }
  | { type: "INJECT_VT_DATA" }
  | { type: "ANALYZE"; code: string; cellId: string }
  | { type: "EXEC_CELL"; code: string; cellId: string }
  | { type: "EXEC"; code: string; id: string }
  | { type: "LINT"; code: string; id: string };

/** AST analysis result for a cell */
export interface AnalyzeResult {
  defines: string[];
  uses: string[];
}

/** Messages received FROM the Pyodide Web Worker */
export type PyodideWorkerOutMessage =
  | { type: "INIT_START" }
  | { type: "INIT_DONE"; duration: number }
  | { type: "INIT_ERROR"; error: string }
  | { type: "VT_DATA_INJECTED" }
  | { type: "VT_DATA_ERROR"; error: string }
  | { type: "ANALYZE_DONE"; cellId: string; result: AnalyzeResult }
  | { type: "ANALYZE_ERROR"; cellId: string; error: string }
  | { type: "STDOUT"; text: string; cellId: string }
  | { type: "STDERR"; text: string; cellId: string }
  | { type: "CELL_DONE"; cellId: string; duration: number }
  | { type: "CELL_ERROR"; cellId: string; error: string; traceback?: string }
  | { type: "STDOUT"; text: string; id: string }
  | { type: "STDERR"; text: string; id: string }
  | { type: "EXEC_DONE"; id: string; duration: number }
  | { type: "EXEC_ERROR"; id: string; error: string; traceback?: string }
  | { type: "LINT_RESULT"; id: string; diagnostics: LintDiagnostic[] };

/** A lint diagnostic from Python ast.parse() */
export interface LintDiagnostic {
  line: number;
  col: number;
  endLine: number;
  endCol: number;
  severity: "error" | "warning";
  message: string;
}

/** Pyodide runtime status (includes legacy values for backward compat) */
export type PyodideStatus =
  | "loading"
  | "ready"
  | "error"
  | "idle"
  | "initializing"
  | "executing";

/** A single line of console output from Python execution */
export interface ConsoleOutputLine {
  stream: "stdout" | "stderr";
  text: string;
  timestamp: number;
  cellId?: string;
  cellName?: string;
}

// ─── AI Panel Message ────────────────────────────────────

export interface AIChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: number;
}
