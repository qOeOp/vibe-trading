"use client";

import React from "react";
import {
  FACTOR_LIFECYCLE_STATUSES,
  STATUS_COLORS,
  STATUS_LABELS,
} from "../types";
import type { FactorLifecycleStatus } from "../types";

// ─── Lifecycle Timeline ──────────────────────────────────

interface LifecycleTimelineProps {
  status: FactorLifecycleStatus;
}

export function LifecycleTimeline({ status }: LifecycleTimelineProps) {
  const currentIndex = FACTOR_LIFECYCLE_STATUSES.indexOf(status);

  return (
    <div className="flex items-center w-full mt-3 px-1">
      {FACTOR_LIFECYCLE_STATUSES.map((s, i) => {
        const isReached = i <= currentIndex;
        const isCurrent = i === currentIndex;
        const color = STATUS_COLORS[s];
        const label = STATUS_LABELS[s];
        const isLast = i === FACTOR_LIFECYCLE_STATUSES.length - 1;

        return (
          <React.Fragment key={s}>
            {/* Node */}
            <div className="flex flex-col items-center gap-0.5 relative">
              <div
                className="rounded-full transition-all"
                style={
                  isReached
                    ? {
                        width: isCurrent ? 14 : 10,
                        height: isCurrent ? 14 : 10,
                        backgroundColor: color,
                        boxShadow: isCurrent
                          ? `0 0 0 2px white, 0 0 0 4px ${color}40`
                          : undefined,
                      }
                    : {
                        width: 10,
                        height: 10,
                        border: "1.5px solid #e0ddd8",
                        backgroundColor: "white",
                      }
                }
              />
              <span
                className="text-[8px] font-medium whitespace-nowrap"
                style={{ color: isReached ? color : "#8a8a8a" }}
              >
                {label}
              </span>
              {isCurrent && (
                <span
                  className="text-[7px] leading-none -mt-0.5"
                  style={{ color }}
                >
                  ▲
                </span>
              )}
            </div>
            {/* Connector line */}
            {!isLast && (
              <div
                className="flex-1 mx-0.5"
                style={{
                  height: 1.5,
                  backgroundColor: i < currentIndex ? "#4caf50" : "#e0ddd8",
                }}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}
