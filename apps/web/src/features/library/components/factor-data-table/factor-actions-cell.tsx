"use client";

import { useState, useCallback } from "react";
import {
  FlaskConical,
  Play,
  RotateCcw,
  Trash2,
  Activity,
  LineChart,
  Copy,
  ExternalLink,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Factor, FactorLifecycleStatus } from "@/features/library/types";
import { useLibraryStore } from "@/features/library/store/use-library-store";
import { StatusChangeDialog } from "../status-change-dialog";

// ─── Action Types ────────────────────────────────────────

interface StatusAction {
  type: "status";
  icon: LucideIcon;
  label: string;
  targetStatus: FactorLifecycleStatus;
  destructive?: boolean;
}

interface UtilAction {
  type: "util";
  icon: LucideIcon;
  label: string;
  action: "copy" | "monitor" | "backtest";
}

type ActionItem = StatusAction | UtilAction;

// ─── Action Config per Lifecycle Status ──────────────────
// shadcn table-02 pattern: always-visible outline icon buttons,
// destructive (red) for retire/trash, neutral for others.

const ACTION_CONFIG: Record<FactorLifecycleStatus, ActionItem[]> = {
  INCUBATING: [
    { type: "status", icon: FlaskConical, label: "送检", targetStatus: "PAPER_TEST" },
    { type: "status", icon: Trash2, label: "废弃", targetStatus: "RETIRED", destructive: true },
    { type: "util", icon: Copy, label: "复制表达式", action: "copy" },
  ],
  PAPER_TEST: [
    { type: "status", icon: Play, label: "上线", targetStatus: "LIVE_ACTIVE" },
    { type: "util", icon: LineChart, label: "回测", action: "backtest" },
    { type: "status", icon: Trash2, label: "废弃", targetStatus: "RETIRED", destructive: true },
    { type: "util", icon: Copy, label: "复制表达式", action: "copy" },
  ],
  LIVE_ACTIVE: [
    { type: "util", icon: Activity, label: "监控", action: "monitor" },
    { type: "util", icon: LineChart, label: "回测", action: "backtest" },
    { type: "status", icon: Trash2, label: "废弃", targetStatus: "RETIRED", destructive: true },
    { type: "util", icon: Copy, label: "复制表达式", action: "copy" },
  ],
  PROBATION: [
    { type: "status", icon: RotateCcw, label: "恢复", targetStatus: "LIVE_ACTIVE" },
    { type: "util", icon: Activity, label: "监控", action: "monitor" },
    { type: "status", icon: Trash2, label: "废弃", targetStatus: "RETIRED", destructive: true },
    { type: "util", icon: Copy, label: "复制表达式", action: "copy" },
  ],
  RETIRED: [
    { type: "util", icon: Copy, label: "复制表达式", action: "copy" },
  ],
};

// ─── Helpers ─────────────────────────────────────────────

function isDestructive(item: ActionItem): boolean {
  return item.type === "status" && item.destructive === true;
}

// ─── OpenInLabButton ─────────────────────────────────────

function OpenInLabButton({ factor }: { factor: Factor }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  if (factor.source !== "mining_llm" || !factor.codeFile) return null;

  async function handleOpen() {
    setLoading(true);
    try {
      const resp = await fetch("http://localhost:2728/api/lab/files/resolve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          factorId: factor.id,
          codeFile: factor.codeFile,
        }),
      });
      if (!resp.ok) throw new Error("resolve failed");
      const { workspacePath } = (await resp.json()) as {
        workspacePath: string;
      };
      router.push(`/lab?file=${encodeURIComponent(workspacePath)}`);
    } catch {
      setLoading(false);
    }
  }

  return (
    <button
      data-slot="open-in-lab-button"
      onClick={(e) => {
        e.stopPropagation();
        void handleOpen();
      }}
      disabled={loading}
      className={cn(
        "flex items-center gap-1 px-2 py-1 text-[10px] font-medium rounded",
        "text-mine-muted hover:text-mine-text hover:bg-mine-bg",
        "border border-transparent hover:border-mine-border transition-colors",
        "disabled:opacity-50 disabled:cursor-not-allowed",
      )}
    >
      <ExternalLink className="w-3 h-3" />
      {loading ? "打开中..." : "在 Lab 中编辑"}
    </button>
  );
}

// ─── Component ───────────────────────────────────────────

interface FactorActionsCellProps {
  factor: Factor;
}

export function FactorActionsCell({ factor }: FactorActionsCellProps) {
  const updateFactorStatus = useLibraryStore((s) => s.updateFactorStatus);

  // Per-row StatusChangeDialog state
  const [dialogOpen, setDialogOpen] = useState(false);

  const actions = ACTION_CONFIG[factor.status];

  const handleAction = useCallback(
    (item: ActionItem, e: React.MouseEvent) => {
      e.stopPropagation();

      if (item.type === "status") {
        setDialogOpen(true);
        return;
      }

      // Utility actions
      switch (item.action) {
        case "copy":
          navigator.clipboard.writeText(factor.expression);
          break;
        case "monitor":
        case "backtest":
          // P2: route to Factor/Monitor or Factor/Backtest
          break;
      }
    },
    [factor.expression],
  );

  const handleStatusConfirm = useCallback(
    (targetStatus: FactorLifecycleStatus, reason: string) => {
      updateFactorStatus(factor.id, targetStatus, reason);
      setDialogOpen(false);
    },
    [updateFactorStatus, factor.id],
  );

  return (
    <>
      <div
        data-slot="factor-actions-cell"
        className="flex items-center justify-center gap-1"
      >
        {actions.map((item) => {
          const Icon = item.icon;
          const destructive = isDestructive(item);
          return (
            <Tooltip key={item.label}>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon-sm"
                  className={cn(
                    destructive &&
                      "text-destructive hover:bg-destructive hover:text-white",
                  )}
                  onClick={(e) => handleAction(item, e)}
                  aria-label={item.label}
                >
                  <Icon />
                </Button>
              </TooltipTrigger>
              <TooltipContent>{item.label}</TooltipContent>
            </Tooltip>
          );
        })}
        <OpenInLabButton factor={factor} />
      </div>

      {/* Per-row StatusChangeDialog */}
      {dialogOpen && (
        <StatusChangeDialog
          factor={factor}
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          onConfirm={handleStatusConfirm}
        />
      )}
    </>
  );
}
