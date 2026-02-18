"use client";

import { useState, useCallback } from "react";
import {
  Play,
  PlayCircle,
  SkipForward,
  Settings,
  ChevronDown,
  Code,
  Workflow,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useLabCellStore } from "../store/use-lab-cell-store";
import { useCellExecution } from "../hooks/use-cell-execution";
import { generateMockValidation, hashCode } from "../data/mock-validation";
import type { ICMethod, WinsorizationMethod, Universe } from "../types";

// ─── Mode Selector ──────────────────────────────────────

function ModeSelector() {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-mine-text hover:bg-mine-bg rounded-lg transition-colors"
      >
        <Code className="w-3.5 h-3.5" />
        代码模式
        <ChevronDown className="w-3 h-3 text-mine-muted" />
      </button>
      {open && (
        <div className="absolute top-full left-0 mt-1 bg-white shadow-md border border-mine-border rounded-lg py-1 min-w-[140px] z-50">
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="w-full text-left px-3 py-1.5 text-xs text-mine-text hover:bg-mine-bg transition-colors flex items-center gap-2"
          >
            <Code className="w-3.5 h-3.5" />
            代码
          </button>
          <button
            type="button"
            disabled
            className="w-full text-left px-3 py-1.5 text-xs text-mine-muted/50 cursor-not-allowed flex items-center gap-2"
          >
            <Workflow className="w-3.5 h-3.5" />
            工作流
            <span className="ml-auto px-1 py-0.5 text-[9px] bg-mine-muted/10 text-mine-muted rounded">
              P2
            </span>
          </button>
        </div>
      )}
    </div>
  );
}

// ─── Factor Name Input ──────────────────────────────────

function FactorNameInput() {
  const factorName = useLabCellStore((s) => s.factorName);
  const setFactorName = useLabCellStore((s) => s.setFactorName);

  return (
    <input
      type="text"
      value={factorName}
      onChange={(e) => setFactorName(e.target.value)}
      className="w-[160px] px-2 py-1 text-sm font-medium text-mine-text bg-transparent border border-transparent hover:border-mine-border focus:border-mine-accent-teal/30 focus:ring-1 focus:ring-mine-accent-teal/20 rounded-md outline-none transition-all"
      aria-label="因子名称"
    />
  );
}

// ─── Validation Config Popover ──────────────────────────

function ValidationConfigPopover() {
  const config = useLabCellStore((s) => s.validationConfig);
  const setConfig = useLabCellStore((s) => s.setValidationConfig);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          className="flex items-center gap-1.5 px-2 py-1.5 text-xs font-medium text-mine-muted hover:text-mine-text hover:bg-mine-bg rounded-lg transition-colors"
          aria-label="检验参数"
        >
          <Settings className="w-3.5 h-3.5" />
          参数
        </button>
      </PopoverTrigger>
      <PopoverContent
        className="w-[280px] p-0"
        align="start"
        sideOffset={8}
      >
        <div className="px-3 py-2.5 border-b border-mine-border/50">
          <h4 className="text-xs font-medium text-mine-text">检验参数配置</h4>
        </div>
        <div className="p-3 space-y-3">
          {/* IC Method */}
          <ConfigRow label="IC 方法">
            <div className="flex gap-1">
              {(["rank", "normal"] as ICMethod[]).map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setConfig({ icMethod: m })}
                  className={cn(
                    "px-2 py-0.5 text-[11px] rounded-md transition-all",
                    config.icMethod === m
                      ? "bg-mine-nav-active text-white"
                      : "text-mine-muted hover:text-mine-text hover:bg-mine-bg",
                  )}
                >
                  {m === "rank" ? "Rank IC" : "Normal IC"}
                </button>
              ))}
            </div>
          </ConfigRow>

          {/* Winsorization */}
          <ConfigRow label="去极值">
            <div className="flex gap-1">
              {(["mad", "3sigma", "percentile"] as WinsorizationMethod[]).map(
                (m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setConfig({ winsorization: m })}
                    className={cn(
                      "px-2 py-0.5 text-[11px] rounded-md transition-all",
                      config.winsorization === m
                        ? "bg-mine-nav-active text-white"
                        : "text-mine-muted hover:text-mine-text hover:bg-mine-bg",
                    )}
                  >
                    {m === "mad" ? "MAD" : m === "3sigma" ? "3σ" : "百分位"}
                  </button>
                ),
              )}
            </div>
          </ConfigRow>

          {/* Quantile Groups */}
          <ConfigRow label="分位组数">
            <div className="flex gap-1">
              {([5, 10] as const).map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setConfig({ quantileGroups: n })}
                  className={cn(
                    "px-2 py-0.5 text-[11px] rounded-md transition-all",
                    config.quantileGroups === n
                      ? "bg-mine-nav-active text-white"
                      : "text-mine-muted hover:text-mine-text hover:bg-mine-bg",
                  )}
                >
                  {n}组
                </button>
              ))}
            </div>
          </ConfigRow>

          {/* Universe */}
          <ConfigRow label="股票池">
            <select
              value={config.universe}
              onChange={(e) =>
                setConfig({ universe: e.target.value as Universe })
              }
              className="px-2 py-0.5 text-[11px] text-mine-text bg-mine-bg border border-mine-border rounded-md outline-none"
            >
              <option value="全A">全A</option>
              <option value="沪深300">沪深300</option>
              <option value="中证500">中证500</option>
              <option value="中证1000">中证1000</option>
            </select>
          </ConfigRow>

          {/* Filter ST */}
          <ConfigRow label="过滤 ST">
            <button
              type="button"
              onClick={() => setConfig({ filterST: !config.filterST })}
              className={cn(
                "w-8 h-4 rounded-full transition-colors relative",
                config.filterST ? "bg-mine-accent-teal" : "bg-mine-border",
              )}
            >
              <span
                className={cn(
                  "absolute top-0.5 w-3 h-3 rounded-full bg-white shadow-sm transition-transform",
                  config.filterST ? "translate-x-4" : "translate-x-0.5",
                )}
              />
            </button>
          </ConfigRow>
        </div>
      </PopoverContent>
    </Popover>
  );
}

function ConfigRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-[11px] text-mine-muted shrink-0">{label}</span>
      {children}
    </div>
  );
}

// ─── Pyodide Status Indicator ───────────────────────────

function PyodideStatusDot() {
  const status = useLabCellStore((s) => s.pyodideStatus);

  if (status === "ready") return null;

  return (
    <div className="flex items-center gap-1.5 text-[10px] text-mine-muted">
      <span
        className={cn(
          "w-1.5 h-1.5 rounded-full",
          status === "loading" && "bg-mine-accent-yellow animate-pulse",
          status === "error" && "bg-mine-accent-red",
        )}
      />
      {status === "loading" && "Python 加载中..."}
      {status === "error" && "Python 加载失败"}
    </div>
  );
}

// ─── Main Toolbar ───────────────────────────────────────

export function LabToolbar() {
  const validationStatus = useLabCellStore((s) => s.validationStatus);
  const setActivePanel = useLabCellStore((s) => s.setActivePanel);
  const setValidationStatus = useLabCellStore(
    (s) => s.setValidationStatus,
  );
  const setValidationResult = useLabCellStore(
    (s) => s.setValidationResult,
  );
  const { executeAllCells } = useCellExecution();

  const isRunning = validationStatus === "running";

  const handleRunAll = useCallback(() => {
    executeAllCells();
  }, [executeAllCells]);

  const handleValidate = useCallback(() => {
    // Run all cells, generate mock validation, switch to results
    setValidationStatus("running");
    setValidationResult(null);
    setActivePanel("results");

    executeAllCells();

    // Generate mock validation results after a delay
    // (simulates real validation pipeline)
    setTimeout(() => {
      try {
        const cells = useLabCellStore.getState().cells;
        const expression = cells.map((c) => c.code).join("\n");
        const seed = hashCode(expression);
        const result = generateMockValidation(seed);
        setValidationResult(result);
        setValidationStatus("completed");
      } catch {
        setValidationStatus("error");
      }
    }, 1200 + Math.random() * 800);
  }, [executeAllCells, setActivePanel, setValidationStatus, setValidationResult]);

  return (
    <div
      data-slot="lab-toolbar"
      className="flex items-center gap-1 h-11 px-2 bg-white shadow-sm border border-mine-border rounded-xl shrink-0"
    >
      <ModeSelector />

      <div className="w-px h-5 bg-mine-border/50" />

      <FactorNameInput />

      <div className="w-px h-5 bg-mine-border/50" />

      <ValidationConfigPopover />

      <PyodideStatusDot />

      <div className="flex-1" />

      {/* Run All Cells */}
      <Button
        size="sm"
        variant="ghost"
        onClick={handleRunAll}
        className="gap-1.5 text-xs font-medium text-mine-text hover:bg-mine-bg rounded-lg"
        title="执行所有 cells (Cmd+Shift+Enter)"
      >
        <PlayCircle className="w-3.5 h-3.5" />
        全部执行
      </Button>

      {/* Validate */}
      <Button
        size="sm"
        onClick={handleValidate}
        disabled={isRunning}
        className={cn(
          "gap-1.5 text-xs font-medium rounded-lg",
          isRunning
            ? "bg-mine-accent-green/70 text-white"
            : "bg-mine-accent-green text-white hover:bg-mine-accent-green/90",
        )}
      >
        <Play className={cn("w-3.5 h-3.5", isRunning && "animate-pulse")} />
        {isRunning ? "检验中..." : "开始检验"}
      </Button>

      {/* Backtest (disabled) */}
      <Button
        size="sm"
        variant="ghost"
        disabled
        className="gap-1.5 text-xs text-mine-muted/50 cursor-not-allowed"
        title="Backtest 模块即将上线"
      >
        <SkipForward className="w-3.5 h-3.5" />
        直接回测
      </Button>
    </div>
  );
}
