"use client";

import { useLabCellStore } from "@/features/lab/store/use-lab-cell-store";
import { VerdictBanner } from "./verdict-banner";
import { ValidationStep } from "./validation-step";
import { StepICStats } from "./step-ic-stats";
import { StepQuantileReturns } from "./step-quantile-returns";
import { StepICDecay } from "./step-ic-decay";
import { StepOrthogonality } from "./step-orthogonality";
import { StepConditionalIC } from "./step-conditional-ic";
import { StepAttribution } from "./step-attribution";
import { StepTurnover } from "./step-turnover";
import { StepOperations } from "./step-operations";

// ─── Validation Flow Steps ──────────────────────────────

const FLOW_STEPS = [
  { num: 1, name: "IC/IR 统计", threshold: "IC>0.03" },
  { num: 2, name: "分位收益", threshold: "单调性>0.8" },
  { num: 3, name: "IC 衰减", threshold: "半衰期>5d" },
  { num: 4, name: "正交检验", threshold: "相关性<0.25" },
  { num: 5, name: "条件 IC", threshold: "稳定性>0.4" },
  { num: 6, name: "因子归因", threshold: "alpha IC>0.02" },
  { num: 7, name: "换手成本", threshold: "成本侵蚀<50%" },
  { num: 8, name: "综合判定", threshold: "" },
] as const;

// ─── Skeleton Loading ───────────────────────────────────

function ResultsSkeleton() {
  return (
    <div data-slot="results-panel" className="h-full flex flex-col overflow-hidden">
      {/* Verdict banner skeleton */}
      <div className="px-4 py-3 border-b border-mine-border/30 shrink-0">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-4 h-4 rounded-full bg-mine-border/40 animate-pulse" />
          <div className="w-20 h-4 rounded bg-mine-border/40 animate-pulse" />
          <div className="w-32 h-3 rounded bg-mine-border/30 animate-pulse" />
        </div>
        <div className="flex gap-4">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className="w-16 h-3 rounded bg-mine-border/30 animate-pulse"
              style={{ animationDelay: `${i * 100}ms` }}
            />
          ))}
        </div>
      </div>

      {/* Step skeletons */}
      {[0, 1, 2, 3].map((i) => (
        <div
          key={i}
          className="px-4 py-3 border-b border-mine-border/20"
        >
          <div className="flex items-center gap-2 mb-2">
            <div
              className="w-5 h-5 rounded-full bg-mine-border/30 animate-pulse"
              style={{ animationDelay: `${(i + 1) * 150}ms` }}
            />
            <div
              className="w-24 h-3.5 rounded bg-mine-border/30 animate-pulse"
              style={{ animationDelay: `${(i + 1) * 150}ms` }}
            />
            <div className="flex-1" />
            <div
              className="w-12 h-4 rounded-full bg-mine-border/20 animate-pulse"
              style={{ animationDelay: `${(i + 1) * 150}ms` }}
            />
          </div>
          {i < 2 && (
            <div className="space-y-2 pl-7">
              <div
                className="w-full h-16 rounded-md bg-mine-border/20 animate-pulse"
                style={{ animationDelay: `${(i + 2) * 150}ms` }}
              />
              <div className="grid grid-cols-4 gap-2">
                {[0, 1, 2, 3].map((j) => (
                  <div
                    key={j}
                    className="h-10 rounded-md bg-mine-border/15 animate-pulse"
                    style={{ animationDelay: `${(i + j + 2) * 100}ms` }}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// ─── Results Panel ──────────────────────────────────────

export function ResultsPanel() {
  const status = useLabCellStore((s) => s.validationStatus);
  const result = useLabCellStore((s) => s.validationResult);

  // Idle state — 8-step flow preview
  if (status === "idle" && !result) {
    return (
      <div
        data-slot="results-panel"
        className="h-full flex items-center justify-center"
      >
        <div className="w-full max-w-[260px] space-y-3">
          <div className="space-y-1">
            {FLOW_STEPS.map((step) => (
              <div
                key={step.num}
                className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg hover:bg-mine-bg/50 transition-colors"
              >
                <span className="w-5 h-5 rounded-full bg-mine-bg flex items-center justify-center text-[10px] font-medium text-mine-muted shrink-0">
                  {step.num}
                </span>
                <span className="text-xs text-mine-text flex-1">
                  {step.name}
                </span>
                {step.threshold && (
                  <span className="text-[10px] font-mono tabular-nums text-mine-muted/60">
                    {step.threshold}
                  </span>
                )}
              </div>
            ))}
          </div>
          <p className="text-center text-[10px] text-mine-muted/50 pt-1">
            <kbd className="px-1 py-0.5 rounded bg-mine-bg text-[9px] font-mono">
              &#8984;Enter
            </kbd>{" "}
            或点击「开始检验」运行
          </p>
        </div>
      </div>
    );
  }

  // Running state — skeleton loading
  if (status === "running") {
    return <ResultsSkeleton />;
  }

  // Error state
  if (status === "error") {
    return (
      <div
        data-slot="results-panel"
        className="h-full flex items-center justify-center"
      >
        <div className="text-center space-y-2">
          <p className="text-sm text-market-up-medium">检验出错</p>
          <p className="text-xs text-mine-muted">请检查因子表达式是否正确</p>
        </div>
      </div>
    );
  }

  // Completed — show results
  if (!result) return null;

  return (
    <div
      data-slot="results-panel"
      className="h-full flex flex-col overflow-y-auto"
    >
      {/* Verdict Banner */}
      <VerdictBanner result={result} />

      {/* Step 1: IC/IR Statistics */}
      <ValidationStep
        number={1}
        title="IC/IR 统计"
        conclusion={result.stepConclusions[1]}
        defaultOpen
      >
        <StepICStats icStats={result.icStats} />
      </ValidationStep>

      {/* Step 2: Quantile Returns */}
      <ValidationStep
        number={2}
        title="分位收益"
        conclusion={result.stepConclusions[2]}
        defaultOpen
      >
        <StepQuantileReturns quantileReturns={result.quantileReturns} />
      </ValidationStep>

      {/* Step 3: IC Decay */}
      <ValidationStep
        number={3}
        title="IC 衰减"
        conclusion={result.stepConclusions[3]}
        defaultOpen
      >
        <StepICDecay icDecay={result.icDecay} />
      </ValidationStep>

      {/* Step 4: Orthogonality Test */}
      <ValidationStep
        number={4}
        title="正交检验"
        conclusion={result.stepConclusions[4]}
      >
        <StepOrthogonality orthogonality={result.orthogonality} />
      </ValidationStep>

      {/* Step 5: Conditional IC Analysis */}
      <ValidationStep
        number={5}
        title="条件 IC 分析"
        conclusion={result.stepConclusions[5]}
      >
        <StepConditionalIC conditionalIC={result.conditionalIC} />
      </ValidationStep>

      {/* Step 6: Factor Attribution */}
      <ValidationStep
        number={6}
        title="因子归因"
        conclusion={result.stepConclusions[6]}
      >
        <StepAttribution attribution={result.attribution} />
      </ValidationStep>

      {/* Step 7: Turnover & Cost */}
      <ValidationStep
        number={7}
        title="换手率与成本"
        conclusion={result.stepConclusions[7]}
      >
        <StepTurnover
          turnover={result.turnover}
          grossIC={result.icStats.icMean}
        />
      </ValidationStep>

      {/* Step 8: Operations */}
      <ValidationStep
        number={8}
        title="操作"
        conclusion={result.stepConclusions[8]}
        defaultOpen
      >
        <StepOperations verdict={result.verdict} />
      </ValidationStep>
    </div>
  );
}
