"use client";

import { Calendar, Check, Rocket } from "lucide-react";
import { MineCard } from "../components/mine-card";

const PHASES = [
  {
    phase: "Phase 1", title: "MVP · 核心框架", duration: "4 周", color: "#26a69a", status: "IN PROGRESS",
    tasks: [
      { done: true, text: "Nx Monorepo + Next.js + FastAPI 脚手架" },
      { done: true, text: "Mine Theme 设计系统 (颜色/字体/组件)" },
      { done: true, text: "Sidebar + TopBar 双层导航" },
      { done: true, text: "Market 热力图 Treemap (D3 渲染)" },
      { done: true, text: "Market Detail Panel (涨跌比/概念/资金)" },
      { done: false, text: "Factor Home: Polar Calendar + Band Chart" },
      { done: false, text: "Factor Library: 因子卡片网格 + AG Grid" },
      { done: false, text: "AKShare 数据接入 (日线 + 指数 + 板块)" },
    ],
  },
  {
    phase: "Phase 2", title: "因子工坊 + 回测引擎", duration: "6 周", color: "#8b5cf6", status: "PLANNED",
    tasks: [
      { done: false, text: "因子计算引擎 (动量/价值/质量/波动率)" },
      { done: false, text: "因子检验: IC/IR 分析, 分位收益, T检验" },
      { done: false, text: "Backtrader 回测集成 + 回测结果展示" },
      { done: false, text: "策略对比: 多策略净值曲线叠加" },
      { done: false, text: "绩效归因: Brinson 模型分解" },
      { done: false, text: "宏观指标仪表盘 (GDP/CPI/PMI)" },
    ],
  },
  {
    phase: "Phase 3", title: "AI 增强 + 执行层", duration: "8 周", color: "#f5a623", status: "FUTURE",
    tasks: [
      { done: false, text: "AI 因子 (Transformer/LSTM-based 信号)" },
      { done: false, text: "AI Chat 助手: 自然语言查询市场数据" },
      { done: false, text: "每日交易策略生成 + 推送" },
      { done: false, text: "组合优化 + 再平衡建议" },
      { done: false, text: "大宗商品模块 (黄金/白银/原油)" },
      { done: false, text: "实盘对接 (API 下单)" },
    ],
  },
];

export function RoadmapSection() {
  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center gap-2 px-1 mb-1">
        <Rocket className="w-4 h-4 text-mine-accent-teal" />
        <h2 className="font-semibold text-[15px] text-mine-text">开发路线图</h2>
      </div>
      {PHASES.map((p) => (
        <MineCard key={p.phase} className="overflow-visible">
          <div className="p-4">
            <div className="flex items-center gap-3 mb-3">
              <span className="font-mono font-bold px-2.5 py-1 rounded-lg text-[11px]"
                style={{ background: `${p.color}15`, color: p.color }}>{p.phase}</span>
              <span className="font-semibold text-sm text-mine-text">{p.title}</span>
              <span className="ml-auto flex items-center gap-1.5">
                <Calendar className="w-3 h-3 text-mine-muted" />
                <span className="text-[11px] text-mine-muted">{p.duration}</span>
              </span>
              <span className="font-mono font-bold px-2 py-0.5 rounded-full text-[9px]"
                style={{ background: `${p.color}15`, color: p.color }}>{p.status}</span>
            </div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1">
              {p.tasks.map((t, i) => (
                <div key={i} className="flex items-center gap-2 py-1">
                  <div className={`w-4 h-4 rounded flex items-center justify-center shrink-0 ${t.done ? "" : "bg-mine-bg"}`}
                    style={t.done ? { background: "#26a69a15" } : undefined}>
                    {t.done
                      ? <Check className="w-3 h-3 text-mine-accent-teal" />
                      : <div className="w-2 h-2 rounded-sm bg-mine-border" />}
                  </div>
                  <span className={`text-[11px] ${t.done ? "text-mine-text" : "text-mine-muted"}`}>{t.text}</span>
                </div>
              ))}
            </div>
          </div>
        </MineCard>
      ))}
    </div>
  );
}
