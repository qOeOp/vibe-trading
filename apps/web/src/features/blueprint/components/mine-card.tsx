"use client";

import { useState } from "react";
import { Maximize2 } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import type { ReactNode, CSSProperties } from "react";

interface MineCardProps {
  title?: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
  frosted?: boolean;
  actions?: ReactNode;
  style?: CSSProperties;
  expandable?: boolean;
  expandTitle?: string;
  expandSubtitle?: string;
  /** Additional content shown only in the expanded modal (after children) */
  expandContent?: ReactNode;
}

export function MineCard({
  title,
  subtitle,
  children,
  className,
  frosted,
  actions,
  style,
  expandable,
  expandTitle,
  expandSubtitle,
  expandContent,
}: MineCardProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div
        className={cn(
          "flex flex-col overflow-hidden rounded-xl",
          frosted
            ? "bg-white/40 backdrop-blur-2xl border border-white/60 shadow-[0_8px_32px_rgba(0,0,0,0.08)]"
            : "bg-white border border-mine-border shadow-[0_1px_2px_rgba(0,0,0,0.05)]",
          className,
        )}
        style={style}
      >
        {title && (
          <div
            className={cn(
              "flex items-center gap-4 px-3 py-2 rounded-t-xl bg-white",
              frosted
                ? "border-b border-white/40"
                : "border-b border-mine-border/50",
            )}
          >
            <div className="shrink-0">
              <h3 className="font-semibold text-sm leading-tight text-mine-text">
                {title}
              </h3>
              {subtitle && (
                <p className="text-[11px] text-mine-muted">{subtitle}</p>
              )}
            </div>
            {(actions || expandable) && (
              <div className="flex-1 min-w-0 flex items-center justify-end gap-1.5">
                {actions}
                {expandable && (
                  <button
                    onClick={() => setOpen(true)}
                    className="shrink-0 p-1 rounded-md text-mine-muted hover:text-mine-text hover:bg-mine-bg transition-colors"
                    aria-label="Expand card"
                  >
                    <Maximize2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            )}
          </div>
        )}
        <div
          className={cn(
            "flex-1 min-h-0 overflow-y-auto",
            title && "pt-1.5",
          )}
        >
          {children}
        </div>
      </div>

      {expandable && (
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{expandTitle || title}</DialogTitle>
              {(expandSubtitle || subtitle) && (
                <DialogDescription>
                  {expandSubtitle || subtitle}
                </DialogDescription>
              )}
            </DialogHeader>
            <div className="flex-1 overflow-y-auto px-6 py-4">
              {children}
              {expandContent}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
