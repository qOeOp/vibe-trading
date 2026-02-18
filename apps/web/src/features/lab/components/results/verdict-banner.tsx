"use client";

import { CheckCircle2, AlertTriangle, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ValidationResult, VerdictLevel, StepConclusion } from "../../types";

// ─── Verdict Config ─────────────────────────────────────

const VERDICT_CONFIG: Record<
  VerdictLevel,
  {
    icon: typeof CheckCircle2;
    label: string;
    subtitle: string;
    bg: string;
    text: string;
    border: string;
  }
> = {
  valid: {
    icon: CheckCircle2,
    label: "因子有效",
    subtitle: "可提交入库",
    bg: "bg-mine-accent-green/5",
    text: "text-mine-accent-green",
    border: "border-mine-accent-green/20",
  },
  marginal: {
    icon: AlertTriangle,
    label: "因子边际",
    subtitle: "建议优化后重新检验",
    bg: "bg-mine-accent-yellow/5",
    text: "text-mine-accent-yellow",
    border: "border-mine-accent-yellow/20",
  },
  invalid: {
    icon: XCircle,
    label: "因子无效",
    subtitle: "不建议入库",
    bg: "bg-mine-accent-red/5",
    text: "text-mine-accent-red",
    border: "border-mine-accent-red/20",
  },
};

const STEP_ICON_CONFIG: Record<
  StepConclusion,
  { icon: typeof CheckCircle2; className: string }
> = {
  pass: { icon: CheckCircle2, className: "text-mine-accent-green" },
  warning: { icon: AlertTriangle, className: "text-mine-accent-yellow" },
  fail: { icon: XCircle, className: "text-mine-accent-red" },
};

// ─── Verdict Banner ─────────────────────────────────────

export function VerdictBanner({ result }: { result: ValidationResult }) {
  const config = VERDICT_CONFIG[result.verdict];
  const Icon = config.icon;

  const { icStats, quantileReturns } = result;

  return (
    <div
      data-slot="verdict-banner"
      className={cn(
        "px-4 py-3 border-b shrink-0",
        config.bg,
        config.border,
      )}
    >
      {/* Title row */}
      <div className="flex items-center gap-2 mb-1.5">
        <Icon className={cn("w-4 h-4", config.text)} />
        <span className={cn("text-sm font-semibold", config.text)}>
          {config.label}
        </span>
        <span className="text-xs text-mine-muted">— {config.subtitle}</span>
      </div>

      {/* Key metrics */}
      <div className="flex items-center gap-4 text-[11px] text-mine-muted mb-2">
        <span>
          IC=
          <span className="font-mono tabular-nums text-mine-text">
            {icStats.icMean.toFixed(4)}
          </span>
          {icStats.icMean > 0.03 ? " > 0.03 ✓" : " < 0.03 ✗"}
        </span>
        <span>
          t=
          <span className="font-mono tabular-nums text-mine-text">
            {icStats.tStat.toFixed(2)}
          </span>
          {icStats.tStat > 2.0 ? " > 2.0 ✓" : " < 2.0 ✗"}
        </span>
        <span>
          单调性=
          <span className="font-mono tabular-nums text-mine-text">
            {quantileReturns.monotonicity.toFixed(2)}
          </span>
          {quantileReturns.monotonicity > 0.8 ? " ✓" : " ✗"}
        </span>
        <span>
          覆盖率
          <span className="font-mono tabular-nums text-mine-text">
            {" "}
            {icStats.coverageRate.toFixed(1)}%
          </span>
        </span>
      </div>

      {/* Step indicators */}
      <div className="flex items-center gap-2">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((step) => {
          const conclusion = result.stepConclusions[step];
          const stepIcon = conclusion ? STEP_ICON_CONFIG[conclusion] : null;
          const StepIcon = stepIcon?.icon;
          return (
            <span key={step} className="flex items-center gap-0.5 text-[11px] text-mine-muted">
              {step}
              {StepIcon ? (
                <StepIcon className={cn("w-3 h-3", stepIcon.className)} />
              ) : (
                <span className="text-mine-muted/30">─</span>
              )}
            </span>
          );
        })}
      </div>
    </div>
  );
}
