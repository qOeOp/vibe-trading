"use client";

import { Brain, Gem, Info } from "lucide-react";
import { ResonanceStack } from "../components/resonance-stack";
import { RESONANCE_DIMS, MOCK_SCREENER } from "../data/modules";

export function ScreenerWireframe() {
  return (
    <div className="p-4 space-y-3">
      <div className="flex items-center gap-2 px-1 mb-1">
        <Gem className="w-4 h-4 text-mine-accent-teal" />
        <h2 className="font-semibold text-[15px] text-mine-text">Screener · Factor Picks</h2>
        <span className="text-[11px] text-mine-muted">六维共振选股 — 多正交维度信号叠加提升胜率</span>
      </div>

      <div className="rounded-xl overflow-hidden bg-white border border-mine-border">
        <div className="px-4 py-2.5 flex items-center gap-4 border-b border-mine-border">
          <span className="font-medium text-xs text-mine-text">六维共振模型</span>
          <div className="flex items-center gap-3 ml-auto">
            {RESONANCE_DIMS.map((d) => (
              <div key={d.key} className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-sm" style={{ background: d.color }} />
                <span className="text-[10px] text-mine-muted">{d.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="flex items-center px-4 py-2 border-b border-mine-border" style={{ background: "rgba(224,221,216,0.19)" }}>
            <span className="text-[10px] font-semibold text-mine-muted" style={{ width: 40 }}>#</span>
            <span className="text-[10px] font-semibold text-mine-muted" style={{ width: 140 }}>股票</span>
            <span className="text-[10px] font-semibold text-mine-muted text-center" style={{ width: 60 }}>共振塔</span>
            <span className="text-[10px] font-semibold text-mine-muted text-center" style={{ width: 60 }}>评分</span>
            <span className="text-[10px] font-semibold text-mine-muted text-center" style={{ width: 60 }}>胜率</span>
            <span className="text-[10px] font-semibold text-mine-muted text-center" style={{ width: 60 }}>盈亏比</span>
            <span className="text-[10px] font-semibold text-mine-muted text-center" style={{ width: 60 }}>Kelly</span>
            <span className="text-[10px] font-semibold text-mine-muted text-center flex-1">维度明细</span>
          </div>

          {MOCK_SCREENER.map((stock, idx) => (
            <div key={stock.code} className="flex items-center px-4 py-3 transition-colors"
              style={{
                borderBottom: idx < MOCK_SCREENER.length - 1 ? "1px solid rgba(224,221,216,0.25)" : "none",
                background: idx === 0 ? "rgba(38,166,154,0.04)" : "transparent",
              }}>
              <span className="font-mono font-bold text-sm" style={{ width: 40, color: idx === 0 ? "#CF304A" : idx < 3 ? "#f5a623" : "#8a8a8a" }}>
                {idx + 1}
              </span>
              <div style={{ width: 140 }}>
                <div className="font-semibold text-[13px] text-mine-text">{stock.name}</div>
                <div className="font-mono text-[10px] text-mine-muted">{stock.code}</div>
              </div>
              <div className="flex justify-center" style={{ width: 60 }}>
                <ResonanceStack signals={stock.signals} />
              </div>
              <div className="text-center" style={{ width: 60 }}>
                <span className="font-mono font-bold text-base"
                  style={{ color: stock.score >= 85 ? "#CF304A" : stock.score >= 70 ? "#f5a623" : "#8a8a8a" }}>
                  {stock.score}
                </span>
              </div>
              <span className="font-mono text-xs text-mine-text text-center" style={{ width: 60 }}>{stock.winRate}</span>
              <span className="font-mono text-xs text-mine-text text-center" style={{ width: 60 }}>{stock.rr}</span>
              <span className="font-mono text-xs font-semibold text-mine-accent-teal text-center" style={{ width: 60 }}>{stock.kelly}</span>
              <div className="flex-1 flex gap-[3px] flex-wrap justify-center">
                {RESONANCE_DIMS.map((dim) => {
                  const sig = stock.signals.find((s) => s.key === dim.key);
                  const st = sig?.state || "neutral";
                  return (
                    <div key={dim.key} className="flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px]"
                      title={dim.desc}
                      style={{
                        background: st === "bull" ? `${dim.color}15` : st === "bear" ? "rgba(207,48,74,0.06)" : "rgba(224,221,216,0.31)",
                        color: st === "bull" ? dim.color : st === "bear" ? "#CF304A" : "#8a8a8a",
                        fontWeight: st === "bull" ? 600 : 400,
                      }}>
                      {st === "bull" ? "▲" : st === "bear" ? "▼" : "—"} {dim.short}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-xl p-4 bg-white border border-mine-border">
        <div className="flex items-start gap-2 mb-2">
          <Brain className="w-4 h-4 shrink-0 mt-0.5 text-mine-accent-teal" />
          <span className="font-semibold text-[13px] text-mine-text">共振原理</span>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {[
            { title: "正交性 = 信息增量", desc: "六个维度测量不同信息源。量化因子看统计规律，Price Action看价格微观结构，情绪看市场心理，聪明钱看机构意图，事件看催化剂，Regime看宏观环境。相关性低，共振时信息叠加。" },
            { title: "共振层数 → 置信度", desc: "单维度信号胜率~55%。3维共振≈65%。5维以上共振是极稀有事件，但一旦出现，历史胜率通常>75%。平台自动统计每个共振组合的历史表现。" },
            { title: "反共振 = 风控信号", desc: "当多维度互相矛盾（因子看多但聪明钱在撒、情绪过热但PA在阻力位），这是警告信号。反共振时降低仓位或观望，避免进入高不确定性交易。" },
          ].map((item, i) => (
            <div key={i} className="rounded-lg p-3 bg-mine-page-bg">
              <div className="font-semibold mb-1.5 text-[11px] text-mine-text">{item.title}</div>
              <div className="text-[10px] text-mine-muted leading-[1.5]">{item.desc}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-2 px-2 py-1.5 rounded-lg text-[10px] text-mine-muted" style={{ background: "rgba(38,166,154,0.03)" }}>
        <Info className="w-3 h-3 shrink-0" />
        <span>布局: 信号列表 (sortable by 共振层数/评分/Kelly) · 点击行展开: 六维雷达图 + 各维度信号详情 + AI综合分析摘要 · 右上角: 共振过滤器 ({"≥"}N维)</span>
      </div>
    </div>
  );
}
