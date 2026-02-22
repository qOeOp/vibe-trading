"use client";

import { useState } from "react";
import { ChevronDown, CheckCircle2, AlertTriangle, XCircle } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "@/lib/utils";
import type { StepConclusion } from "@/features/lab/types";

// ─── Conclusion Badge ───────────────────────────────────

const CONCLUSION_CONFIG: Record<
  StepConclusion,
  { icon: typeof CheckCircle2; label: string; className: string }
> = {
  pass: {
    icon: CheckCircle2,
    label: "通过",
    className: "text-mine-accent-green bg-mine-accent-green/10",
  },
  warning: {
    icon: AlertTriangle,
    label: "注意",
    className: "text-mine-accent-yellow bg-mine-accent-yellow/10",
  },
  fail: {
    icon: XCircle,
    label: "不通过",
    className: "text-mine-accent-red bg-mine-accent-red/10",
  },
};

// ─── Validation Step ────────────────────────────────────

interface ValidationStepProps {
  number: number;
  title: string;
  conclusion?: StepConclusion;
  defaultOpen?: boolean;
  children: React.ReactNode;
}

export function ValidationStep({
  number,
  title,
  conclusion,
  defaultOpen = false,
  children,
}: ValidationStepProps) {
  const [open, setOpen] = useState(defaultOpen);
  const config = conclusion ? CONCLUSION_CONFIG[conclusion] : null;

  return (
    <div
      data-slot="validation-step"
      className="border-b border-mine-border/50 last:border-b-0"
    >
      {/* Header */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-2 px-4 py-2.5 hover:bg-mine-bg/30 transition-colors"
      >
        {/* Step number */}
        <span className="w-5 h-5 rounded-full bg-mine-bg flex items-center justify-center text-[10px] font-medium text-mine-muted shrink-0">
          {number}
        </span>

        {/* Title */}
        <span className="text-xs font-medium text-mine-text">{title}</span>

        {/* Conclusion badge */}
        {config && (
          <span
            className={cn(
              "flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-medium",
              config.className,
            )}
          >
            <config.icon className="w-3 h-3" />
            {config.label}
          </span>
        )}

        <div className="flex-1" />

        {/* Chevron */}
        <ChevronDown
          className={cn(
            "w-3.5 h-3.5 text-mine-muted transition-transform",
            open && "rotate-180",
          )}
        />
      </button>

      {/* Content */}
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
