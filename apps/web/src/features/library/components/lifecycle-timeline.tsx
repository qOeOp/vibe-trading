"use client";

import React, { useRef } from "react";
import {
  FlaskConical,
  ScrollText,
  Zap,
  Eye,
  Archive,
} from "lucide-react";
import { AnimatedBeam } from "@/components/ui/animated-beam";
import {
  FACTOR_LIFECYCLE_STATUSES,
  STATUS_COLORS,
  STATUS_LABELS,
} from "../types";
import type { FactorLifecycleStatus } from "../types";

// ─── Status Icons ───────────────────────────────────────

const STATUS_ICONS: Record<FactorLifecycleStatus, React.ElementType> = {
  INCUBATING: FlaskConical,
  PAPER_TEST: ScrollText,
  LIVE_ACTIVE: Zap,
  PROBATION: Eye,
  RETIRED: Archive,
};

/** Beam color for reached segments — green energy flow */
const BEAM_START = "#4caf50";
const BEAM_END = "#2EBD85";

// ─── Lifecycle Timeline with Animated Beams ─────────────

interface LifecycleTimelineProps {
  status: FactorLifecycleStatus;
}

export function LifecycleTimeline({ status }: LifecycleTimelineProps) {
  const currentIndex = FACTOR_LIFECYCLE_STATUSES.indexOf(status);
  const containerRef = useRef<HTMLDivElement>(null);

  // Fixed-count refs — beam anchor points (one per node, all on the same row)
  const ref0 = useRef<HTMLDivElement>(null);
  const ref1 = useRef<HTMLDivElement>(null);
  const ref2 = useRef<HTMLDivElement>(null);
  const ref3 = useRef<HTMLDivElement>(null);
  const ref4 = useRef<HTMLDivElement>(null);
  const nodeRefs = [ref0, ref1, ref2, ref3, ref4];

  return (
    <div ref={containerRef} className="relative w-full mt-3 px-1">
      {/* Row 1: Icon nodes — all on the same horizontal line for beam alignment */}
      <div className="flex items-center justify-between">
        {FACTOR_LIFECYCLE_STATUSES.map((s, i) => {
          const isReached = i <= currentIndex;
          const isCurrent = i === currentIndex;
          const color = STATUS_COLORS[s];
          const Icon = STATUS_ICONS[s];

          return (
            <div
              key={s}
              ref={nodeRefs[i]}
              className="relative z-10 flex items-center justify-center rounded-full transition-all"
              style={
                isReached
                  ? {
                      width: isCurrent ? 28 : 22,
                      height: isCurrent ? 28 : 22,
                      backgroundColor: "white",
                      border: `1.5px solid ${color}`,
                      boxShadow: isCurrent
                        ? `0 0 0 2px white, 0 0 0 4px ${color}30`
                        : undefined,
                    }
                  : {
                      width: 22,
                      height: 22,
                      border: "1.5px solid #e0ddd8",
                      backgroundColor: "white",
                    }
              }
            >
              <Icon
                className="transition-colors"
                style={{
                  width: isCurrent ? 14 : 11,
                  height: isCurrent ? 14 : 11,
                  color: isReached ? color : "#c0bdb8",
                }}
                strokeWidth={isReached ? 2 : 1.5}
              />
            </div>
          );
        })}
      </div>

      {/* Row 2: Labels below icons */}
      <div className="flex items-start justify-between mt-1">
        {FACTOR_LIFECYCLE_STATUSES.map((s, i) => {
          const isReached = i <= currentIndex;
          const isCurrent = i === currentIndex;
          const color = STATUS_COLORS[s];
          const label = STATUS_LABELS[s];

          // Match the width of the icon above for alignment
          const nodeW = isCurrent ? 28 : 22;

          return (
            <div
              key={s}
              className="flex flex-col items-center"
              style={{ width: nodeW }}
            >
              <span
                className="text-[8px] font-medium whitespace-nowrap"
                style={{ color: isReached ? color : "#8a8a8a" }}
              >
                {label}
              </span>
              {isCurrent && (
                <span
                  className="text-[7px] leading-none"
                  style={{ color }}
                >
                  ▲
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* Beam connections — anchored to icon row (same Y line) */}
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
              pathOpacity={0.12}
              pathWidth={2}
              gradientStartColor={BEAM_START}
              gradientStopColor={BEAM_END}
              duration={3}
              delay={i * 0.4}
              curvature={0}
            />
          );
        }

        return (
          <AnimatedBeam
            key={`beam-${i}`}
            containerRef={containerRef}
            fromRef={nodeRefs[i]}
            toRef={nodeRefs[i + 1]}
            pathColor="#e0ddd8"
            pathOpacity={0.5}
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
