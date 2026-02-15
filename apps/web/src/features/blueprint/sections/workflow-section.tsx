"use client";

import {
  GitBranch,
  AlertCircle,
  ArrowRight,
  Shield,
  Clock,
  CalendarDays,
  FlaskConical,
} from "lucide-react";
import { MineCard } from "../components/mine-card";

interface LifecycleStage {
  stage: string;
  label: string;
  desc: string;
  color: string;
}

interface ResearchStep {
  step: string;
  text: string;
  color: string;
}

interface DailyStep {
  time: string;
  text: string;
  module: string;
  highlight?: boolean;
}

interface EnsembleMethod {
  name: string;
  desc: string;
  rec: boolean;
}

interface WeeklyItem {
  category: string;
  items: string[];
  color: string;
}

interface QuarterlyItem {
  category: string;
  items: string[];
  color: string;
}

export function WorkflowSection() {
  const lifecycleStages: LifecycleStage[] = [
    { stage: "Draft", label: "草稿", desc: "因子假设已定义，尚未检验", color: "#8a8a8a" },
    { stage: "Testing", label: "检验中", desc: "正在跑 IC/IR/分位收益检验", color: "#f5a623" },
    { stage: "Validated", label: "已验证", desc: "通过统计检验，等待部署", color: "#8b5cf6" },
    { stage: "Paper", label: "模拟盘", desc: "用真实每日数据运行，不投真钱", color: "#3b82f6" },
    { stage: "Live", label: "实盘", desc: "正式产生交易信号，执行交易", color: "#26a69a" },
    { stage: "Degrading", label: "衰减中", desc: "IC 下降 / 连续回撤超限，观察中", color: "#f5a623" },
    { stage: "Retired", label: "已下线", desc: "确认失效，停止信号产生", color: "#CF304A" },
  ];

  const researchSteps: ResearchStep[] = [
    { step: "1", text: "经济学假设 — 为什么这个因子应该有效？要有逻辑，不是数据挖掘", color: "#8b5cf6" },
    { step: "2", text: "量化定义 — 用公式/代码表达因子 + 数据可行性检查", color: "#26a69a" },
    { step: "3", text: "统计检验 — IC > 0.03 且稳定？分位收益单调？换手率合理？", color: "#f5a623" },
    { step: "4", text: "条件检验 — 不同市场状态 (牛/熊/震荡) 下的因子效力分别如何？", color: "#ec4899" },
    { step: "5", text: "正交检验 — 和已知因子是否冗余？增量 IC 贡献多少？", color: "#3b82f6" },
    { step: "6", text: "组合回测 — Sharpe / MaxDD / Sortino / Calmar", color: "#F6465D" },
    { step: "7", text: "换手约束回测 — 考虑 T+1、佣金+印花税+滑点后的真实收益", color: "#64748b" },
    { step: "8", text: "容量分析 — 策略能容纳多少资金？小盘因子可能只适合小资金", color: "#f5a623" },
    { step: "9", text: "模拟盘 — 真实数据 forward test 至少 1-3 个月", color: "#26a69a" },
  ];

  const dailySteps: DailyStep[] = [
    { time: "07:00", text: "信息扫描 — 隔夜政策 · 全球映射 · A50期指 · 舆情", module: "Market" },
    { time: "08:00", text: "Dashboard — 策略隔夜重算结果 · 今日信号 · 仓位计算 · 风险预检", module: "Dashboard" },
    { time: "09:15", text: "集合竞价 — 三段式观察: 可撤单→不可撤单→撮合定价 · 发现预期差", module: "Market", highlight: true },
    { time: "09:30", text: "开盘执行 — 按信号下单 · 涨停板策略 · 大单拆分", module: "Trading" },
    { time: "盘中", text: "Risk — 持仓 P&L · 止损触发 · 板块轮动 · 北向资金 · 异常告警", module: "Risk" },
    { time: "11:30", text: "午休 — 复盘上午执行 · 调整下午计划（A 股特有 1.5h 窗口）", module: "Journal", highlight: true },
    { time: "14:57", text: "尾盘集合竞价 — 深市特有 · T+1 约束下的仓位调整", module: "Trading", highlight: true },
    { time: "15:00", text: "收盘 → 龙虎榜 · 大宗交易数据获取", module: "Market" },
    { time: "15:30", text: "自动任务 — 数据拉取→因子重算→信号更新→风险指标重算", module: "Auto" },
    { time: "晚间", text: "Journal — 执行偏差 · 情绪标注 · 信号质量回顾 · 研报阅读", module: "Journal" },
  ];

  const weeklyItems: WeeklyItem[] = [
    {
      category: "因子健康检查",
      items: [
        "IC/IR 滚动 20 日",
        "因子正交性监控",
        "条件 IC（按牛/熊/震荡分析）",
        "衰减检测: IC 跌破 0.01?",
      ],
      color: "#26a69a",
    },
    {
      category: "策略绩效",
      items: [
        "P&L 归因 (alpha vs beta vs 行业)",
        "执行偏差分析（信号→成交滑点）",
        "T+1 成本 · 换手率 · 交易成本",
      ],
      color: "#8b5cf6",
    },
    {
      category: "市场环境研判",
      items: [
        "宏观日历: MLF/LPR/社融/PMI",
        "政策窗口: 两会/经济工作会议",
        "财报季: 1月预告/4月年报/8月中报",
        "板块轮动 + HMM 市场状态",
      ],
      color: "#f5a623",
    },
  ];

  const quarterlyItems: QuarterlyItem[] = [
    {
      category: "因子库维护",
      items: [
        "因子相关性矩阵更新",
        "因子聚类（发现冗余）",
        "因子 Zoo 管理（新学术因子评估）",
        "预处理标准化审查",
      ],
      color: "#3b82f6",
    },
    {
      category: "策略组合管理",
      items: [
        "策略间相关性分析",
        "权重优化 (MVO/RP/BL)",
        "风险预算分配",
        "容量管理（资金增长适配）",
      ],
      color: "#ec4899",
    },
    {
      category: "年度归因",
      items: [
        "Alpha 来源分解",
        "运气 vs 能力 Bootstrap 检验",
        "策略衰减趋势",
        "退役决策",
      ],
      color: "#64748b",
    },
  ];

  const ensembleMethods: EnsembleMethod[] = [
    { name: "等权投票", desc: "多策略打分取平均。稳定但 alpha 被稀释", rec: false },
    { name: "信号共振", desc: "多策略一致时才交易。高确信但机会少", rec: false },
    { name: "动态加权", desc: "按长期 IC 表现分配权重。自适应但需防过拟合", rec: true },
  ];

  return (
    <div className="p-4 space-y-4">
      {/* Section header */}
      <div className="flex items-center gap-2 px-1 mb-1">
        <GitBranch className="w-4 h-4 text-mine-accent-teal" />
        <h2 className="font-semibold text-[15px] text-mine-text">A 股交易工作流</h2>
        <span className="text-[11px] text-mine-muted">三循环模型 + 策略生命周期</span>
      </div>

      {/* A-share constraints banner */}
      <div className="flex items-center gap-3 p-3 rounded-xl bg-market-up-medium/5 border border-market-up-medium/15">
        <AlertCircle className="w-4 h-4 shrink-0 text-market-up-medium" />
        <div className="flex-1">
          <span className="text-[11px] font-medium text-mine-text">A 股关键约束</span>
          <div className="flex gap-4 mt-1">
            <span className="text-[10px] text-mine-muted">
              <strong className="text-mine-text">T+1</strong> 当日买入不能当日卖出
            </span>
            <span className="text-[10px] text-mine-muted">
              <strong className="text-mine-text">涨跌停</strong> 主板±10% / 创业板科创板±20%
            </span>
            <span className="text-[10px] text-mine-muted">
              <strong className="text-mine-text">北向资金</strong> 最重要的聪明钱指标
            </span>
          </div>
        </div>
      </div>

      {/* Two Cycles */}
      <div className="grid grid-cols-2 gap-3">
        {/* Slow cycle - Research */}
        <MineCard title="慢循环 — 研究周期" subtitle="周/月级别" frosted>
          <div className="px-3 pb-3 space-y-2">
            <p className="text-[11px] text-mine-text leading-[1.6]">
              花数周打磨一个策略，反复检验直到通过所有统计门槛才允许上线。类比：训练 ML 模型。
            </p>
            {researchSteps.map((s) => (
              <div key={s.step} className="flex items-start gap-2 p-2 rounded-lg bg-mine-bg">
                <span
                  className="font-mono font-bold shrink-0 w-4 text-center text-[10px]"
                  style={{ color: s.color }}
                >
                  {s.step}
                </span>
                <span className="text-[11px] text-mine-text">{s.text}</span>
              </div>
            ))}
            <div
              className="flex items-center gap-2 p-2 rounded-lg"
              style={{ background: "rgba(207,48,74,0.03)" }}
            >
              <AlertCircle className="w-3.5 h-3.5 shrink-0 text-market-up" />
              <span className="text-[10px] text-market-up">
                禁止「随便组合策略看哪个赚钱」— 这是 overfitting，量化第一大死因
              </span>
            </div>
          </div>
        </MineCard>

        {/* Fast cycle - Execution */}
        <MineCard title="快循环 — 执行周期" subtitle="每个交易日">
          <div className="px-3 pb-3 space-y-2">
            <p className="text-[11px] text-mine-text leading-[1.6]">
              已验证的策略每天自动运行，模型不变，变的只是输入数据。类比：线上推理。
            </p>
            {dailySteps.map((s) => (
              <div
                key={s.time}
                className="flex items-center gap-2 p-2 rounded-lg"
                style={{
                  background: s.highlight ? "rgba(38,166,154,0.04)" : undefined,
                }}
              >
                <span
                  className="font-mono font-bold shrink-0 text-right text-[10px]"
                  style={{ width: 36, color: s.highlight ? "#26a69a" : "#8a8a8a" }}
                >
                  {s.time}
                </span>
                <span className="text-[11px] text-mine-text flex-1">{s.text}</span>
                <span
                  className="px-1.5 py-0.5 rounded font-mono text-[9px]"
                  style={{ background: "#26a69a10", color: "#26a69a" }}
                >
                  {s.module}
                </span>
              </div>
            ))}
          </div>
        </MineCard>
      </div>

      {/* Weekly & Quarterly Cycles */}
      <div className="grid grid-cols-2 gap-3">
        {/* Weekly */}
        <MineCard
          title="周度循环"
          subtitle="每周末复盘"
          actions={<CalendarDays className="w-3.5 h-3.5 text-mine-muted" />}
        >
          <div className="px-3 pb-3 space-y-3">
            {weeklyItems.map((w) => (
              <div key={w.category}>
                <div className="flex items-center gap-1.5 mb-1.5">
                  <div
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ background: w.color }}
                  />
                  <span className="text-[11px] font-semibold text-mine-text">
                    {w.category}
                  </span>
                </div>
                <div className="space-y-1 pl-3">
                  {w.items.map((item) => (
                    <div
                      key={item}
                      className="text-[10px] text-mine-muted flex items-start gap-1.5"
                    >
                      <span className="shrink-0 mt-[3px]">·</span>
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </MineCard>

        {/* Quarterly */}
        <MineCard
          title="季度/研究循环"
          subtitle="因子库 · 组合 · 归因"
          actions={<FlaskConical className="w-3.5 h-3.5 text-mine-muted" />}
        >
          <div className="px-3 pb-3 space-y-3">
            {quarterlyItems.map((q) => (
              <div key={q.category}>
                <div className="flex items-center gap-1.5 mb-1.5">
                  <div
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ background: q.color }}
                  />
                  <span className="text-[11px] font-semibold text-mine-text">
                    {q.category}
                  </span>
                </div>
                <div className="space-y-1 pl-3">
                  {q.items.map((item) => (
                    <div
                      key={item}
                      className="text-[10px] text-mine-muted flex items-start gap-1.5"
                    >
                      <span className="shrink-0 mt-[3px]">·</span>
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </MineCard>
      </div>

      {/* Strategy Lifecycle */}
      <div>
        <h3 className="font-semibold mb-2 px-1 text-[13px] text-mine-text">策略生命周期</h3>
        <MineCard frosted>
          <div className="p-4">
            <div className="flex items-center gap-1">
              {lifecycleStages.map((s, i) => (
                <div key={s.stage} className="flex items-center flex-1">
                  <div className="flex flex-col items-center text-center flex-1 min-w-0">
                    <div
                      className="w-7 h-7 rounded-full flex items-center justify-center mb-1"
                      style={{ background: `${s.color}15`, border: `2px solid ${s.color}` }}
                    >
                      <span
                        className="font-mono font-bold text-[8px]"
                        style={{ color: s.color }}
                      >
                        {i + 1}
                      </span>
                    </div>
                    <span className="font-semibold text-[10px] text-mine-text">{s.label}</span>
                    <span className="font-mono text-[8px]" style={{ color: s.color }}>
                      {s.stage}
                    </span>
                  </div>
                  {i < lifecycleStages.length - 1 && (
                    <ArrowRight className="w-3 h-3 shrink-0 text-mine-border" />
                  )}
                </div>
              ))}
            </div>
            <div className="mt-3 pt-3 space-y-1.5 border-t border-mine-border">
              <div className="flex items-center gap-2">
                <Shield className="w-3.5 h-3.5 shrink-0 text-market-up" />
                <span className="text-[11px] text-mine-text font-medium">
                  门禁规则：Factor Lab (研究区) → Portfolio (生产环境) 必须经过显式部署
                </span>
              </div>
              <p className="text-[10px] text-mine-muted pl-[22px]">
                只有 Live 状态的策略才会出现在 Portfolio 和 Trading 模块中。未验证的策略永远不会碰到真钱。
              </p>
            </div>
          </div>
        </MineCard>
      </div>

      {/* Multi-strategy ensemble */}
      <MineCard title="多策略集成" subtitle="Signal Aggregation">
        <div className="px-3 pb-3 space-y-2">
          <p className="text-[11px] text-mine-muted leading-[1.6]">
            同一时间可有多个策略在不同阶段并行。Live 策略的信号通过集成方式聚合为最终交易建议：
          </p>
          <div className="grid grid-cols-3 gap-2">
            {ensembleMethods.map((m) => (
              <div
                key={m.name}
                className="p-2.5 rounded-lg bg-mine-bg"
                style={{
                  border: m.rec
                    ? "1px solid rgba(38,166,154,0.25)"
                    : "1px solid transparent",
                }}
              >
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="font-semibold text-[11px] text-mine-text">{m.name}</span>
                  {m.rec && (
                    <span
                      className="px-1 py-0.5 rounded font-medium text-[8px]"
                      style={{ background: "#26a69a15", color: "#26a69a" }}
                    >
                      推荐
                    </span>
                  )}
                </div>
                <p className="text-[10px] text-mine-muted leading-[1.4]">{m.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </MineCard>

      {/* Journal concept */}
      <MineCard title="策略日记 (Journal)" subtitle="每个策略一个独立 Notebook" frosted>
        <div className="px-3 pb-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <span className="font-semibold text-[11px] text-mine-text">
                系统自动记录（客观）
              </span>
              <div className="mt-1.5 space-y-1">
                {[
                  "今日持仓变动 + 成交明细",
                  "策略信号 vs 实际执行偏差",
                  "当日因子 IC 值变化",
                  "PnL 归因 (Alpha / Beta / 行业)",
                ].map((t) => (
                  <div key={t} className="flex items-center gap-1.5 text-[10px] text-mine-muted">
                    <div className="w-1 h-1 rounded-full bg-mine-accent-teal" />
                    {t}
                  </div>
                ))}
              </div>
            </div>
            <div>
              <span className="font-semibold text-[11px] text-mine-text">
                用户手动记录（主观）
              </span>
              <div className="mt-1.5 space-y-1">
                {[
                  "今天市场的整体感觉和判断",
                  "做了哪些主观决策，为什么",
                  "为什么偏离了系统信号",
                  "当时的情绪状态（贪婪/恐惧/冷静）",
                ].map((t) => (
                  <div key={t} className="flex items-center gap-1.5 text-[10px] text-mine-muted">
                    <div className="w-1 h-1 rounded-full" style={{ background: "#8b5cf6" }} />
                    {t}
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div
            className="mt-3 p-2 rounded-lg"
            style={{ background: "rgba(245,166,35,0.03)" }}
          >
            <span className="text-[10px]" style={{ color: "#f5a623" }}>
              &#x26A0; Journal 的目的是「帮你克制住乱改策略的冲动」— 记录和观察，而不是每天动手调参数。只有累积了足够统计证据才触发策略调整。
            </span>
          </div>
        </div>
      </MineCard>
    </div>
  );
}
