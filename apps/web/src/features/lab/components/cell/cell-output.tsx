"use client";

import { useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import type { CellOutput as CellOutputType } from "@/features/lab/types";

interface CellOutputProps {
  outputs: CellOutputType[];
  className?: string;
}

/**
 * CellOutput — Renders cell execution output
 *
 * Dark background terminal-style area showing stdout/stderr/result.
 * Auto-scrolls to bottom on new output. Max height with scroll.
 */
export function CellOutput({ outputs, className }: CellOutputProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom on new output
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [outputs.length]);

  if (outputs.length === 0) return null;

  return (
    <div
      data-slot="cell-output"
      className={cn(
        "bg-[#1e1e1e] rounded-b-[10px] max-h-[200px] overflow-y-auto",
        "font-mono text-xs leading-relaxed",
        "scrollbar-thin",
        className,
      )}
      ref={scrollRef}
    >
      <div className="px-3 py-2">
        {outputs.map((output, i) => (
          <div
            key={i}
            className={cn(
              "whitespace-pre-wrap break-all",
              output.stream === "stdout" && "text-gray-300",
              output.stream === "stderr" && "text-red-400",
              output.stream === "result" && "text-green-400",
            )}
          >
            {output.stream === "result" && (
              <span className="text-gray-500 select-none">{">>> "}</span>
            )}
            {output.text}
          </div>
        ))}
      </div>
    </div>
  );
}
