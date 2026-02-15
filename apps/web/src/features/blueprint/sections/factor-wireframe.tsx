"use client";

import { FlaskConical, Info } from "lucide-react";
import { MineCard } from "../components/mine-card";

function StatRow({ label, value, color }: { label: string; value: string; color?: string }) {
  return (
    <div className="flex justify-between items-center py-1.5 border-b border-mine-border/30">
      <span className="text-[10px] text-mine-muted">{label}</span>
      <span className="font-mono text-[11px] font-medium" style={{ color: color || "#1a1a1a" }}>{value}</span>
    </div>
  );
}

export function FactorWireframe() {
  return (
    <div className="p-4 space-y-3">
      <div className="flex items-center gap-2 px-1 mb-1">
        <FlaskConical className="w-4 h-4 text-mine-accent-teal" />
        <h2 className="font-semibold text-[15px] text-mine-text">Factor 页面</h2>
        <span className="text-[11px] text-mine-muted">两栏布局 — Ranking + Polar | Daily Returns + Metrics</span>
      </div>
      <div className="flex gap-3" style={{ height: 520 }}>
        {/* Left Column */}
        <div className="shrink-0 flex flex-col gap-3" style={{ width: 320 }}>
          <div className="rounded-xl overflow-hidden flex flex-col shrink-0 bg-white border border-mine-border shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
            <div className="px-3 py-2 border-b border-mine-border/50">
              <h3 className="font-semibold text-xs text-mine-text">Strategy Ranking</h3>
              <p className="text-[10px] text-mine-muted">2024 annual performance</p>
            </div>
            <div>
              {[
                { rank: 1, name: "ML Multi-Factor", ret: "+42.3%", sharpe: "2.14" },
                { rank: 2, name: "Momentum 12M", ret: "+35.7%", sharpe: "1.87" },
                { rank: 3, name: "Value PE", ret: "+28.1%", sharpe: "1.52" },
                { rank: 4, name: "Quality ROE", ret: "+21.6%", sharpe: "1.34" },
                { rank: 5, name: "Low Volatility", ret: "+12.4%", sharpe: "0.98" },
              ].map((s) => (
                <div key={s.rank} className="flex items-center gap-2 px-3 py-1.5 border-b border-mine-border/20 cursor-pointer">
                  <span className="font-mono font-bold text-[10px] text-mine-muted w-4">#{s.rank}</span>
                  <span className="font-medium flex-1 truncate text-[11px] text-mine-text">{s.name}</span>
                  <span className="font-mono font-semibold text-[11px] text-market-up-medium">{s.ret}</span>
                  <span className="font-mono text-[10px] text-mine-muted">SR {s.sharpe}</span>
                </div>
              ))}
            </div>
          </div>
          <MineCard title="Polar Calendar" subtitle="Click sector to drill down" frosted className="flex-1 min-h-0"
            actions={<span className="font-mono text-[11px] text-mine-muted">2024 · 10 strategies</span>}>
            <div className="flex-1 flex items-center justify-center">
              <svg viewBox="0 0 200 200" style={{ width: "85%", height: "85%" }}>
                {Array.from({ length: 12 }).map((_, i) => {
                  const vals = [0.6, 0.7, 0.5, 0.8, 0.65, 0.75, 0.55, 0.85, 0.7, 0.6, 0.45, 0.9];
                  const v = vals[i]; const innerR = 30; const outerR = innerR + 55 * v;
                  const a1 = ((i * 30 - 90 - 14) * Math.PI) / 180;
                  const a2 = ((i * 30 - 90 + 14) * Math.PI) / 180;
                  const color = v > 0.7 ? "#CF304A" : v > 0.5 ? "#76808E" : "#0B8C5F";
                  return (
                    <path key={i}
                      d={`M${100+innerR*Math.cos(a1)},${100+innerR*Math.sin(a1)} L${100+outerR*Math.cos(a1)},${100+outerR*Math.sin(a1)} A${outerR},${outerR} 0 0,1 ${100+outerR*Math.cos(a2)},${100+outerR*Math.sin(a2)} L${100+innerR*Math.cos(a2)},${100+innerR*Math.sin(a2)} A${innerR},${innerR} 0 0,0 ${100+innerR*Math.cos(a1)},${100+innerR*Math.sin(a1)} Z`}
                      fill={color} opacity={0.7} />
                  );
                })}
                {["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"].map((m, i) => {
                  const a = (i * 30 - 90) * Math.PI / 180;
                  return (
                    <text key={m} x={100+95*Math.cos(a)} y={100+95*Math.sin(a)}
                      textAnchor="middle" dominantBaseline="middle"
                      className="fill-mine-muted" style={{ fontSize: 7, fontFamily: "Inter" }}>{m}</text>
                  );
                })}
                <text x="100" y="100" textAnchor="middle" dominantBaseline="middle"
                  className="fill-mine-text" style={{ fontSize: 14, fontWeight: 600, fontFamily: "Inter" }}>2024</text>
              </svg>
            </div>
          </MineCard>
        </div>

        {/* Right Column */}
        <div className="flex-1 min-w-0 flex flex-col gap-3">
          <MineCard title="Daily Returns" subtitle="5-Year History" frosted className="flex-1 min-h-0"
            actions={<span className="text-[11px] text-mine-muted">Median band with strategy overlays</span>}>
            <div className="flex-1 min-h-0 px-2">
              <svg viewBox="0 0 600 200" className="w-full h-full" preserveAspectRatio="none">
                <path d="M0,120 C100,100 200,130 300,110 C400,90 500,120 600,105 L600,95 C500,80 400,60 300,70 C200,85 100,55 0,75 Z" fill="#26a69a" opacity={0.1} />
                <path d="M0,97 C100,78 200,107 300,90 C400,75 500,100 600,100" fill="none" stroke="#26a69a" strokeWidth={1.5} opacity={0.6} />
                <path d="M0,85 C100,60 200,120 300,75 C400,55 500,90 600,70" fill="none" stroke="#8b5cf6" strokeWidth={2} />
                <line x1="0" y1="100" x2="600" y2="100" stroke="#e0ddd8" strokeWidth={0.5} strokeDasharray="4,4" />
              </svg>
            </div>
          </MineCard>
          <div className="flex gap-3 shrink-0" style={{ height: 150 }}>
            <div className="rounded-xl overflow-hidden flex flex-col bg-white border border-mine-border shadow-[0_1px_2px_rgba(0,0,0,0.05)]" style={{ flex: "0.8", minWidth: 0 }}>
              <div className="px-3 py-2 shrink-0 border-b border-mine-border/50">
                <h3 className="font-semibold leading-tight text-sm text-mine-text">Strategy Metrics</h3>
              </div>
              <div className="flex-1 min-h-0 overflow-y-auto px-3 py-1">
                <div className="grid grid-cols-2 gap-x-4">
                  <StatRow label="Alpha" value="+8.42%" color="#F6465D" />
                  <StatRow label="Sharpe" value="2.14" color="#F6465D" />
                  <StatRow label="Max DD" value="-12.3%" color="#2EBD85" />
                  <StatRow label="Volatility" value="18.7%" />
                  <StatRow label="Mean IC" value="0.0521" color="#F6465D" />
                  <StatRow label="Turnover" value="23.4%" />
                </div>
              </div>
            </div>
            <MineCard title="Holding Composition" frosted className="flex-1 min-w-0">
              <div className="flex-1 min-h-0 flex items-end px-2 pb-2 gap-0.5">
                {Array.from({ length: 20 }).map((_, i) => {
                  const colors = ["#2563eb", "#8b5cf6", "#f59e0b", "#22c55e", "#ef4444", "#06b6d4"];
                  const heights = [65,70,60,55,72,68,62,58,75,63,67,71,59,64,73,66,69,57,74,61];
                  return (
                    <div key={i} className="flex-1 flex flex-col" style={{ height: `${heights[i]}%` }}>
                      {colors.slice(0, 3 + (i % 3)).map((c, j) => (
                        <div key={j} style={{ flex: 1 + (i + j) % 2 * 0.5, background: c, opacity: 0.7, minHeight: 2 }} />
                      ))}
                    </div>
                  );
                })}
              </div>
            </MineCard>
            <MineCard title="Sector Performance" frosted style={{ flex: "0.8", minWidth: 0 }}
              actions={
                <div className="flex items-center gap-1 p-0.5 rounded-lg bg-mine-bg">
                  <span className="px-2 py-0.5 rounded-md font-medium text-[10px] bg-mine-nav-active text-white">IC</span>
                  <span className="px-2 py-0.5 rounded-md font-medium text-[10px] text-mine-muted">Return</span>
                </div>
              }>
              <div className="flex-1 min-h-0 flex items-end px-2 pb-2 gap-1">
                {[
                  { name: "金融", val: 0.08 }, { name: "科技", val: 0.12 }, { name: "消费", val: 0.05 },
                  { name: "医药", val: -0.03 }, { name: "能源", val: 0.07 }, { name: "材料", val: -0.01 },
                ].map((s) => (
                  <div key={s.name} className="flex-1 flex flex-col items-center gap-0.5">
                    <div className="w-full rounded-t" style={{ height: `${Math.abs(s.val) * 500}%`, background: s.val >= 0 ? "#F6465D" : "#2EBD85", opacity: 0.7, minHeight: 4 }} />
                    <span className="text-[8px] text-mine-muted">{s.name}</span>
                  </div>
                ))}
              </div>
            </MineCard>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2 px-1 text-[10px] text-mine-muted">
        <Info className="w-3 h-3 shrink-0" />
        <span>两栏布局: Left w-420 (Ranking + PolarCalendar) | Right flex-1 (DailyReturns hero + bottom-row h-170) · TopBar 注入 Library tab</span>
      </div>
    </div>
  );
}
