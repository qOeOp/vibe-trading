"use client";

import { ClipboardCheck, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLabCellStore } from "../../store/use-lab-cell-store";
import { ResultsPanel } from "../results/results-panel";
import { LabAIPanel } from "../ai-panel/lab-ai-panel";
import { DataCatalogPanel } from "../sidebar/data-catalog-panel";
import { SnippetsPanel } from "../sidebar/snippets-panel";
import { VariablesPanel } from "../sidebar/variables-panel";
import { ConsolePanel } from "../sidebar/console-panel";
import type { ContextPanelTab } from "../../types";

// ─── Tab Button ─────────────────────────────────────────

interface TabButtonProps {
  id: ContextPanelTab;
  icon: React.ElementType;
  label: string;
  dot?: boolean;
}

function TabButton({ id, icon: Icon, label, dot }: TabButtonProps) {
  const activeTab = useLabCellStore((s) => s.activePanel);
  const setTab = useLabCellStore((s) => s.setActivePanel);
  const isActive = activeTab === id;

  return (
    <button
      type="button"
      onClick={() => setTab(id)}
      className={cn(
        "relative flex items-center gap-1.5 px-3 h-full text-xs font-medium transition-colors",
        isActive
          ? "text-mine-accent-teal"
          : "text-mine-muted hover:text-mine-text",
      )}
    >
      <Icon className="w-3.5 h-3.5" />
      {label}
      {/* Notification dot */}
      {dot && (
        <span className="absolute top-2 right-1.5 w-1.5 h-1.5 rounded-full bg-mine-accent-green animate-pulse" />
      )}
      {/* Active underline */}
      {isActive && (
        <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-mine-accent-teal rounded-full" />
      )}
    </button>
  );
}

// ─── Context Panel ─────────────────────────────────────

/**
 * ContextPanel — Permanent right panel with AI/Results tabs
 *
 * Also hosts overlay sidebar panels (data catalog, snippets, etc.)
 * When a sidebar panel is active, it overlays the permanent tabs.
 */
export function ContextPanel() {
  const activeTab = useLabCellStore((s) => s.activePanel);
  const validationStatus = useLabCellStore((s) => s.validationStatus);
  const sidebarPanel = useLabCellStore((s) => s.sidebarPanel);

  // Show notification dot on results tab when validation is running
  // or completed but user is on AI tab
  const showResultsDot =
    validationStatus === "running" ||
    (validationStatus === "completed" && activeTab !== "results");

  // Sidebar overlay takes priority over permanent tabs
  if (sidebarPanel) {
    return (
      <div data-slot="context-panel" className="h-full flex flex-col bg-white">
        {sidebarPanel === "data" && <DataCatalogPanel />}
        {sidebarPanel === "snippets" && <SnippetsPanel />}
        {sidebarPanel === "variables" && <VariablesPanel />}
        {sidebarPanel === "console" && <ConsolePanel />}
      </div>
    );
  }

  return (
    <div data-slot="context-panel" className="h-full flex flex-col bg-white">
      {/* Tab bar */}
      <div className="flex items-center h-9 border-b border-mine-border/50 px-1 shrink-0">
        <TabButton id="ai" icon={Sparkles} label="AI 助手" />
        <TabButton
          id="results"
          icon={ClipboardCheck}
          label="检验结果"
          dot={showResultsDot}
        />
      </div>

      {/* Tab content */}
      <div className="flex-1 overflow-hidden">
        {activeTab === "results" && <ResultsPanel />}
        {activeTab === "ai" && <LabAIPanel />}
      </div>
    </div>
  );
}
