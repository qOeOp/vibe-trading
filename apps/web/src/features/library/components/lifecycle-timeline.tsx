"use client";

import React, { useRef } from "react";
import { AnimatedBeam } from "@/components/ui/animated-beam";
import {
  FACTOR_LIFECYCLE_STATUSES,
  STATUS_COLORS,
  STATUS_LABELS,
} from "../types";
import type { FactorLifecycleStatus } from "../types";

// ─── Lifecycle Timeline with Animated Beams ─────────────

const NODE_COUNT = FACTOR_LIFECYCLE_STATUSES.length; // 5

interface LifecycleTimelineProps {
  status: FactorLifecycleStatus;
}

/** Beam color for reached segments — green energy flow */
const BEAM_START = "#4caf50";
const BEAM_END = "#2EBD85";

export function LifecycleTimeline({ status }: LifecycleTimelineProps) {
  const currentIndex = FACTOR_LIFECYCLE_STATUSES.indexOf(status);
  const containerRef = useRef<HTMLDivElement>(null);

  // Fixed-count refs (NODE_COUNT is constant = 5, safe for hooks)
  const ref0 = useRef<HTMLDivElement>(null);
  const ref1 = useRef<HTMLDivElement>(null);
  const ref2 = useRef<HTMLDivElement>(null);
  const ref3 = useRef<HTMLDivElement>(null);
  const ref4 = useRef<HTMLDivElement>(null);
  const nodeRefs = [ref0, ref1, ref2, ref3, ref4];

  return (
    <div
      ref={containerRef}
      className="relative flex items-center w-full mt-3 px-1"
    >
      {FACTOR_LIFECYCLE_STATUSES.map((s, i) => {
        const isReached = i <= currentIndex;
        const isCurrent = i === currentIndex;
        const color = STATUS_COLORS[s];
        const label = STATUS_LABELS[s];
        const isLast = i === FACTOR_LIFECYCLE_STATUSES.length - 1;

        return (
          <React.Fragment key={s}>
            {/* Node */}
            <div className="flex flex-col items-center gap-0.5 relative z-10">
              <div
                ref={nodeRefs[i]}
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
            {/* Spacer — connector gap between nodes */}
            {!isLast && <div className="flex-1" />}
          </React.Fragment>
        );
      })}

      {/* Animated beams for reached segments */}
      {FACTOR_LIFECYCLE_STATUSES.map((_, i) => {
        if (i >= FACTOR_LIFECYCLE_STATUSES.length - 1) return null;
        const isReachedSegment = i < currentIndex;

        if (isReachedSegment) {
          return (
            <AnimatedBeam
              key={`beam-${i}`}
              containerRef={containerRef}
              fromRef={nodeRefs[i]}
              toRef={nodeRefs[i + 1]}
              pathColor="#4caf50"
              pathOpacity={0.15}
              pathWidth={2}
              gradientStartColor={BEAM_START}
              gradientStopColor={BEAM_END}
              duration={3}
              delay={i * 0.4}
              curvature={0}
            />
          );
        }

        // Static gray line for unreached segments — rendered via beam with no animation colors
        return (
          <AnimatedBeam
            key={`beam-${i}`}
            containerRef={containerRef}
            fromRef={nodeRefs[i]}
            toRef={nodeRefs[i + 1]}
            pathColor="#e0ddd8"
            pathOpacity={0.6}
            pathWidth={1.5}
            gradientStartColor="transparent"
            gradientStopColor="transparent"
            duration={999}
            curvature={0}
          />
        );
      })}
    </div>
  );
}
