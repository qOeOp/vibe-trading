"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import type { Factor, FactorLifecycleStatus } from "../types";
import { VALID_STATUS_TRANSITIONS, STATUS_COLORS, STATUS_LABELS } from "../types";

interface StatusChangeDialogProps {
  factor: Factor;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (targetStatus: FactorLifecycleStatus, reason: string) => void;
}

export function StatusChangeDialog({
  factor,
  open,
  onOpenChange,
  onConfirm,
}: StatusChangeDialogProps) {
  const validTargets = VALID_STATUS_TRANSITIONS[factor.status];
  const [targetStatus, setTargetStatus] = useState<FactorLifecycleStatus | null>(
    validTargets.length === 1 ? validTargets[0] : null,
  );
  const [reason, setReason] = useState("");

  const canConfirm = targetStatus !== null && reason.trim().length > 0;

  const handleConfirm = () => {
    if (!canConfirm || !targetStatus) return;
    onConfirm(targetStatus, reason.trim());
    // Reset state
    setTargetStatus(validTargets.length === 1 ? validTargets[0] : null);
    setReason("");
  };

  const handleOpenChange = (next: boolean) => {
    if (!next) {
      // Reset on close
      setTargetStatus(validTargets.length === 1 ? validTargets[0] : null);
      setReason("");
    }
    onOpenChange(next);
  };

  const currentColor = STATUS_COLORS[factor.status];
  const currentLabel = STATUS_LABELS[factor.status];

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>状态变更</DialogTitle>
          <DialogDescription>
            为因子 <span className="font-semibold text-mine-text">{factor.name}</span> 选择目标状态并填写变更原因。
          </DialogDescription>
        </DialogHeader>

        <div className="px-6 py-4 space-y-4">
          {/* Current status display */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] text-mine-muted uppercase">当前</span>
              <span
                className="px-2 py-0.5 text-[11px] font-bold rounded"
                style={{ backgroundColor: `${currentColor}18`, color: currentColor }}
              >
                {currentLabel}
              </span>
            </div>
            <ArrowRight className="w-3.5 h-3.5 text-mine-muted" />
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] text-mine-muted uppercase">目标</span>
              {targetStatus ? (
                <span
                  className="px-2 py-0.5 text-[11px] font-bold rounded"
                  style={{
                    backgroundColor: `${STATUS_COLORS[targetStatus]}18`,
                    color: STATUS_COLORS[targetStatus],
                  }}
                >
                  {STATUS_LABELS[targetStatus]}
                </span>
              ) : (
                <span className="text-[11px] text-mine-muted">选择...</span>
              )}
            </div>
          </div>

          {/* Target status selection */}
          <div>
            <label className="text-[10px] text-mine-muted uppercase tracking-wide mb-1.5 block">
              目标状态
            </label>
            <div className="flex items-center gap-2">
              {validTargets.map((target) => {
                const targetColor = STATUS_COLORS[target];
                const targetLabel = STATUS_LABELS[target];
                const isSelected = targetStatus === target;
                return (
                  <button
                    key={target}
                    type="button"
                    onClick={() => setTargetStatus(target)}
                    className="px-3 py-1.5 text-[11px] font-semibold rounded-md border transition-all"
                    style={
                      isSelected
                        ? {
                            backgroundColor: targetColor,
                            borderColor: targetColor,
                            color: "#fff",
                          }
                        : {
                            backgroundColor: "transparent",
                            borderColor: "#e0ddd8",
                            color: targetColor,
                          }
                    }
                  >
                    {targetLabel}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Reason textarea */}
          <div>
            <label className="text-[10px] text-mine-muted uppercase tracking-wide mb-1.5 block">
              变更原因 <span className="text-market-up-medium">*</span>
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="请填写状态变更的原因..."
              className="w-full text-sm text-mine-text bg-mine-bg border border-mine-border rounded-lg px-3 py-2 min-h-[80px] outline-none focus:border-mine-nav-active transition-colors placeholder:text-mine-muted resize-none"
            />
          </div>

          {/* Warning note for RETIRED */}
          {targetStatus === "RETIRED" && (
            <div className="flex items-start gap-2 px-3 py-2 bg-market-up-medium/5 border border-market-up-medium/20 rounded-lg">
              <span className="text-market-up-medium text-sm mt-0.5">⚠️</span>
              <span className="text-[11px] text-mine-text leading-relaxed">
                退役操作不可逆。因子将永久停止产生交易信号。
              </span>
            </div>
          )}
        </div>

        <DialogFooter className="flex-row justify-end gap-2">
          <button
            type="button"
            onClick={() => handleOpenChange(false)}
            className="px-4 py-1.5 text-xs font-medium text-mine-muted hover:text-mine-text border border-mine-border rounded-lg transition-colors"
          >
            取消
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={!canConfirm}
            className="px-4 py-1.5 text-xs font-semibold text-white rounded-lg transition-all"
            style={{
              backgroundColor: canConfirm
                ? targetStatus
                  ? STATUS_COLORS[targetStatus]
                  : "#2d2d2d"
                : "#d0d0d0",
              cursor: canConfirm ? "pointer" : "not-allowed",
            }}
          >
            确认变更
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
