export type MiningLang = 'zh' | 'en';
export type MiningMode = 'factor' | 'factor_report' | 'quant';
export type TaskStatus =
  | 'PENDING'
  | 'RUNNING'
  | 'COMPLETED'
  | 'FAILED'
  | 'CANCELLED';

export interface DateRange {
  trainStart: string;
  trainEnd: string;
  validStart: string;
  validEnd: string;
  testStart: string;
  testEnd: string;
}

export interface CreateTaskConfig {
  mode: MiningMode;
  maxLoops: number;
  llmModel: string;
  universe: string;
  dateRange: DateRange;
  dedupThreshold: number;
  seedFactors?: string[];
  reportFiles?: string[];
}

export interface TaskProgress {
  currentLoop: number;
  maxLoops: number;
  factorsDiscovered: number;
  factorsAccepted: number;
  factorsRejected: number;
  bestIc: number;
  bestIr: number;
  elapsedSeconds: number;
  estimatedRemainingSeconds: number;
  currentHypothesis: string;
  currentStep: string;
}

export interface FactorMetrics {
  ic: number;
  icir: number;
  rankIc: number;
  rankIcir: number;
  turnover: number;
  arr: number;
  sharpe: number;
  maxDrawdown: number;
}

export interface DiscoveredFactor {
  name: string;
  code: string;
  metrics: FactorMetrics;
  generation: number;
  /** Round-level hypothesis under which this factor was generated */
  hypothesis: string;
  /** LLM's reasoning behind the hypothesis */
  reason: string;
  /** Natural-language description, e.g. "[Momentum Factor] 10-day price momentum..." */
  description: string;
  /** LaTeX math formula */
  formulation: string;
  /** Variable definitions (raw string) */
  variables: string;
  dedupScore: number;
  accepted: boolean;
}

export interface MiningRound {
  roundIndex: number;
  hypothesis: string;
  reason: string;
  conciseReason?: string;
  conciseObservation?: string;
  conciseJustification?: string;
  conciseKnowledge?: string;
  timestamp?: number;
}

export interface MiningTask {
  taskId: string;
  status: TaskStatus;
  mode: MiningMode;
  config: CreateTaskConfig;
  progress: TaskProgress;
  factors: DiscoveredFactor[];
  createdAt: number;
  startedAt?: number;
  completedAt?: number;
  errorMessage?: string;
}

export interface IterationEvent {
  loop: number;
  hypothesis: string;
  status: 'start' | 'coding' | 'evaluating' | 'done';
}

export interface FactorFoundEvent {
  name: string;
  ic: number;
  accepted: boolean;
  reason?: string;
}

export interface CompleteEvent {
  taskId: string;
  factorsAccepted: number;
}

export type StreamEvent =
  | { type: 'iteration'; data: IterationEvent }
  | { type: 'factor_found'; data: FactorFoundEvent }
  | { type: 'complete'; data: CompleteEvent };

export interface LogEntry {
  id: string;
  timestamp: number;
  type:
    | 'iteration'
    | 'factor_accepted'
    | 'factor_rejected'
    | 'complete'
    | 'error';
  message: string;
}
