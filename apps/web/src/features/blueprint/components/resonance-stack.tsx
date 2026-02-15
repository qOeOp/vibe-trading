"use client";

import { RESONANCE_DIMS } from "../data/modules";

interface ResonanceStackProps {
  signals: { key: string; state: "bull" | "neutral" | "bear" }[];
}

export function ResonanceStack({ signals }: ResonanceStackProps) {
  const litCount = signals.filter((s) => s.state === "bull").length;
  return (
    <div className="flex flex-col items-center gap-0.5" style={{ width: 52 }}>
      <div
        className="font-mono font-bold text-lg"
        style={{
          color:
            litCount >= 4 ? "#CF304A" : litCount >= 2 ? "#f5a623" : "#8a8a8a",
        }}
      >
        {litCount}
        <span className="text-[10px] text-mine-muted">/6</span>
      </div>
      <div className="flex flex-col-reverse gap-[2px]">
        {RESONANCE_DIMS.map((dim) => {
          const sig = signals.find((s) => s.key === dim.key);
          const st = sig?.state || "neutral";
          return (
            <div
              key={dim.key}
              title={`${dim.label}: ${st}`}
              className="transition-all duration-300"
              style={{
                width: 36,
                height: 5,
                borderRadius: 2,
                background:
                  st === "bull"
                    ? dim.color
                    : st === "bear"
                      ? "rgba(207,48,74,0.25)"
                      : "#e0ddd8",
                opacity: st === "neutral" ? 0.4 : 1,
                boxShadow:
                  st === "bull" ? `0 0 6px ${dim.color}50` : "none",
              }}
            />
          );
        })}
      </div>
      <span className="font-mono text-[8px] text-mine-muted">共振</span>
    </div>
  );
}
