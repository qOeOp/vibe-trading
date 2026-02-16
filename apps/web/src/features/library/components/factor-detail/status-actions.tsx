"use client";

import { useState, useCallback } from "react";
import { ArrowRight } from "lucide-react";
import { DetailSection } from "@/components/shared/detail-panel";
import { useLibraryStore } from "../../store/use-library-store";
import { StatusChangeDialog } from "../status-change-dialog";
import type { Factor, FactorLifecycleStatus } from "../../types";
import { VALID_STATUS_TRANSITIONS, STATUS_COLORS, STATUS_LABELS } from "../../types";

interface StatusActionsSectionProps {
  factor: Factor;
}

export function StatusActionsSection({ factor }: StatusActionsSectionProps) {
  const validTransitions = VALID_STATUS_TRANSITIONS[factor.status];
  const updateFactorStatus = useLibraryStore((s) => s.updateFactorStatus);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [justChanged, setJustChanged] = useState(false);

  const handleConfirm = useCallback(
    (targetStatus: FactorLifecycleStatus, reason: string) => {
      updateFactorStatus(factor.id, targetStatus, reason);
      setDialogOpen(false);
      setJustChanged(true);
      setTimeout(() => setJustChanged(false), 1500);
    },
    [factor.id, updateFactorStatus],
  );

  if (validTransitions.length === 0) return null;

  return (
    <DetailSection title="状态变更">
      {justChanged && (
        <span className="text-[10px] font-medium text-mine-accent-green animate-pulse mb-2 block">
          已变更
        </span>
      )}
      <div className="flex items-center gap-2">
        {validTransitions.map((target) => {
          const targetColor = STATUS_COLORS[target];
          const targetLabel = STATUS_LABELS[target];
          return (
            <button
              key={target}
              type="button"
              onClick={() => setDialogOpen(true)}
              className="flex items-center gap-1 px-2.5 py-1 text-[10px] font-semibold rounded border transition-colors hover:opacity-80"
              style={{ borderColor: targetColor, color: targetColor }}
              title={`变更为 ${targetLabel}`}
            >
              <ArrowRight className="w-3 h-3" />
              {targetLabel}
            </button>
          );
        })}
      </div>

      <StatusChangeDialog
        factor={factor}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onConfirm={handleConfirm}
      />
    </DetailSection>
  );
}
