"use client";

import { Upload, SkipForward, RefreshCw, ArrowLeftRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import type { VerdictLevel } from "../../types";

// ─── Step Operations ────────────────────────────────────

export function StepOperations({ verdict }: { verdict: VerdictLevel }) {
  const canSubmit = verdict === "valid";

  return (
    <div data-slot="step-operations" className="flex items-center gap-2 py-2">
      {/* Submit to Library */}
      <Button
        size="sm"
        disabled={!canSubmit}
        className={cn(
          "gap-1.5 text-xs font-medium rounded-lg",
          canSubmit
            ? "bg-mine-accent-green text-white hover:bg-mine-accent-green/90"
            : "bg-mine-muted/10 text-mine-muted cursor-not-allowed",
        )}
        title={canSubmit ? "提交因子到 Library" : "需要因子通过检验才能入库"}
      >
        <Upload className="w-3.5 h-3.5" />
        提交入库
      </Button>

      {/* Direct Backtest (disabled P2) */}
      <Button
        size="sm"
        variant="outline"
        disabled
        className="gap-1.5 text-xs text-mine-muted/50 cursor-not-allowed"
        title="Backtest 模块即将上线"
      >
        <SkipForward className="w-3.5 h-3.5" />
        直接回测
      </Button>

      {/* Re-iterate */}
      <Button
        size="sm"
        variant="outline"
        className="gap-1.5 text-xs"
        onClick={() => {
          // Scroll to editor (simple: focus on expression)
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
      >
        <RefreshCw className="w-3.5 h-3.5" />
        重新迭代
      </Button>

      {/* Compare Run (disabled P2) */}
      <Button
        size="sm"
        variant="outline"
        disabled
        className="gap-1.5 text-xs text-mine-muted/50 cursor-not-allowed"
        title="对比运行将在 P2 版本中实现"
      >
        <ArrowLeftRight className="w-3.5 h-3.5" />
        对比运行
        <span className="px-1 py-0.5 text-[8px] bg-mine-muted/10 text-mine-muted rounded ml-0.5">
          P2
        </span>
      </Button>
    </div>
  );
}
