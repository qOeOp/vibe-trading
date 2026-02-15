"use client";

import {
  Activity,
  AlertCircle,
  ArrowRight,
  BookOpen,
  Boxes,
  Brain,
  FlaskConical,
  LineChart,
  Shield,
  Sparkles,
  Target,
  TrendingUp,
  Wallet,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { MineCard } from "../components/mine-card";

interface LoopStep {
  step: string;
  icon: LucideIcon;
  desc: string;
  color: string;
}

export function VisionSection() {
  const loopSteps: LoopStep[] = [
    { step: "观察", icon: TrendingUp, desc: "市场在发生什么", color: "#26a69a" },
    { step: "假设", icon: Brain, desc: "基于经济学直觉提出可量化的规律", color: "#8b5cf6" },
    { step: "验证", icon: FlaskConical, desc: "用历史数据做统计检验", color: "#f5a623" },
    { step: "构建", icon: Wallet, desc: "通过检验后构建投资组合", color: "#F6465D" },
    { step: "执行", icon: LineChart, desc: "信号→下单→记录", color: "#3b82f6" },
    { step: "监控", icon: Shield, desc: "风险和因子状态追踪", color: "#ef4444" },
    { step: "复盘", icon: BookOpen, desc: "记录 + 归因 + 反思", color: "#22c55e" },
    { step: "改进", icon: Sparkles, desc: "迭代策略和交易纪律", color: "#26a69a" },
  ];

  return (
    <div className="space-y-4 p-4">
      {/* Hero card */}
      <MineCard frosted style={{ padding: 0 }}>
        <div className="p-5">
          <div className="mb-3 flex items-center gap-2">
            <div
              className="flex h-8 w-8 items-center justify-center rounded-lg"
              style={{ background: "#26a69a15", color: "#26a69a" }}
            >
              <Target className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-mine-text">
                The Alpha Factory
              </h2>
              <p className="text-[11px] text-mine-muted">
                Full-stack, end-to-end quantitative trading platform
              </p>
            </div>
          </div>
          <p className="text-[13px] leading-[1.7] text-mine-text">
            Vibe Trading
            是一个全栈、端到端的量化交易平台——将海量原始数据转化为可执行的交易信号。
            从数据采集、因子研究、策略回测、到交易执行和复盘进化的完整 pipeline，
            面向 A 股市场，为需要 truth、speed、clarity 的专业量化交易者打造。
            UI 服务于逻辑，而非反过来。
          </p>
        </div>
      </MineCard>

      {/* Core evolution loop */}
      <div>
        <h3 className="mb-2 px-1 text-[13px] font-semibold text-mine-text">
          核心进化循环
        </h3>
        <MineCard>
          <div className="p-4">
            <div className="flex items-center gap-1">
              {loopSteps.map((s, i) => (
                <div key={s.step} className="flex flex-1 items-center">
                  <div className="flex min-w-0 flex-1 flex-col items-center text-center">
                    <div
                      className="mb-1 flex h-8 w-8 items-center justify-center rounded-lg"
                      style={{ background: `${s.color}12`, color: s.color }}
                    >
                      <s.icon className="h-4 w-4" />
                    </div>
                    <span className="text-[11px] font-semibold text-mine-text">
                      {s.step}
                    </span>
                    <span className="px-0.5 text-[9px] leading-[1.3] text-mine-muted">
                      {s.desc}
                    </span>
                  </div>
                  {i < loopSteps.length - 1 && (
                    <ArrowRight className="mx-0.5 h-3 w-3 shrink-0 text-mine-border" />
                  )}
                </div>
              ))}
            </div>
            <div className="mt-3 flex items-center justify-center border-t border-mine-border pt-3">
              <span className="text-[10px] text-mine-muted">
                ↺ 循环往复 &mdash;
                每一次循环都让策略和交易纪律变得更好
              </span>
            </div>
          </div>
        </MineCard>
      </div>

      {/* Pain points */}
      <div>
        <h3 className="mb-2 px-1 text-[13px] font-semibold text-mine-text">
          解决的核心痛点
        </h3>
        <div className="grid grid-cols-2 gap-3">
          {(
            [
              {
                title: "数据碎片化",
                desc: "行情、因子、策略分散在多个工具中，无法形成统一决策视图",
                icon: Boxes,
              },
              {
                title: "因子研究门槛高",
                desc: "传统因子分析需要编程+金融双重背景，散户完全无法参与",
                icon: Brain,
              },
              {
                title: "回测与执行脱节",
                desc: "策略在回测里有效 ≠ 实盘可执行，缺少模拟盘验证过渡",
                icon: AlertCircle,
              },
              {
                title: "缺乏进化机制",
                desc: "没有系统化的复盘工具，无法识别自身行为模式和策略衰减",
                icon: Activity,
              },
            ] as const
          ).map((p) => (
            <div
              key={p.title}
              className="flex items-start gap-3 rounded-xl border border-mine-border bg-white p-3"
            >
              <div
                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg"
                style={{ background: "rgba(207,48,74,0.06)", color: "#CF304A" }}
              >
                <p.icon className="h-3.5 w-3.5" />
              </div>
              <div>
                <span className="text-xs font-semibold text-mine-text">
                  {p.title}
                </span>
                <p className="mt-0.5 text-[11px] leading-[1.5] text-mine-muted">
                  {p.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Target market & positioning */}
      <div className="flex gap-3">
        <MineCard title="目标市场" className="flex-1">
          <div className="space-y-1.5 px-3 pb-3">
            {(
              [
                "A股 (沪深主板/创业板/科创板/北交所)",
                "大宗商品 (黄金/白银/原油)",
                "国内公募基金",
              ] as const
            ).map((t, i) => (
              <div
                key={i}
                className={`flex items-center gap-2 text-[11px] ${
                  i === 0 ? "text-mine-text" : "text-mine-muted"
                }`}
              >
                <div
                  className="h-1.5 w-1.5 rounded-full"
                  style={{ background: i === 0 ? "#26a69a" : "#e0ddd8" }}
                />
                {t}
                {i === 0 && (
                  <span
                    className="rounded px-1.5 py-0.5 text-[9px] font-medium"
                    style={{ background: "#26a69a15", color: "#26a69a" }}
                  >
                    MVP
                  </span>
                )}
              </div>
            ))}
          </div>
        </MineCard>
        <MineCard title="市场定位" className="flex-1">
          <div className="space-y-1.5 px-3 pb-3">
            {(
              [
                {
                  text: "同花顺/东方财富 — 散户工具，无因子分析能力",
                  color: "text-mine-muted" as const,
                },
                {
                  text: "Wind/Bloomberg — 机构级，门槛极高，年费数万",
                  color: "text-mine-muted" as const,
                },
                {
                  text: "Vibe Trading — 同等专业深度 × 更优交互体验",
                  color: "text-mine-accent-teal" as const,
                  bold: true,
                },
              ] as const
            ).map((t, i) => (
              <div
                key={i}
                className={`flex items-center gap-2 text-[11px] ${t.color} ${
                  "bold" in t && t.bold ? "font-medium" : ""
                }`}
              >
                <div
                  className="h-1.5 w-1.5 rounded-full"
                  style={{ background: i === 2 ? "#26a69a" : "#e0ddd8" }}
                />
                {t.text}
              </div>
            ))}
          </div>
        </MineCard>
      </div>
    </div>
  );
}
