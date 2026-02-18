"use client";

import {
  FolderOpen,
  Package,
  GitBranch,
  List,
  AlertCircle,
  Terminal,
  TerminalSquare,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  useLabChromeStore,
  type SidebarPanelType,
  type DeveloperPanelTab,
} from "../../store/use-lab-chrome-store";
import { useLabCellStore } from "../../store/use-lab-cell-store";

// ─── Sidebar Items ──────────────────────────────────────

interface SidebarItem {
  panel: NonNullable<SidebarPanelType>;
  icon: React.ElementType;
  label: string;
}

interface DeveloperItem {
  tab: DeveloperPanelTab;
  icon: React.ElementType;
  label: string;
}

const SIDEBAR_ITEMS: SidebarItem[] = [
  { panel: "files", icon: FolderOpen, label: "文件浏览" },
  { panel: "variables", icon: Package, label: "变量" },
  { panel: "dependencies", icon: GitBranch, label: "依赖图" },
  { panel: "outline", icon: List, label: "大纲" },
];

const DEVELOPER_ITEMS: DeveloperItem[] = [
  { tab: "errors", icon: AlertCircle, label: "错误" },
  { tab: "logs", icon: Terminal, label: "日志" },
  { tab: "terminal", icon: TerminalSquare, label: "终端" },
];

// ─── Icon Button ─────────────────────────────────────────

function SidebarIconButton({
  icon: Icon,
  label,
  isActive,
  badge,
  onClick,
}: {
  icon: React.ElementType;
  label: string;
  isActive: boolean;
  badge?: number;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={label}
      className={cn(
        "relative flex items-center justify-center w-8 h-8 rounded-lg transition-colors",
        isActive
          ? "bg-mine-nav-active text-white shadow-sm"
          : "text-mine-muted hover:text-mine-text hover:bg-mine-bg",
      )}
    >
      <Icon className="w-4 h-4" />
      {/* Error badge */}
      {badge != null && badge > 0 && (
        <span className="absolute -top-0.5 -right-0.5 min-w-[14px] h-[14px] flex items-center justify-center text-[9px] font-bold text-white bg-mine-accent-red rounded-full px-0.5">
          {badge > 99 ? "99+" : badge}
        </span>
      )}
    </button>
  );
}

// ─── Lab Sidebar ─────────────────────────────────────────

/**
 * LabSidebar — Left icon rail with 7 panel icons
 *
 * Layout: vertical icon column, 40px wide
 * Top group: Files, Variables, Dependencies, Outline
 * Bottom group: Errors (with badge), Logs, Terminal
 */
export function LabSidebar() {
  const selectedPanel = useLabChromeStore((s) => s.selectedPanel);
  const isSidebarOpen = useLabChromeStore((s) => s.isSidebarOpen);
  const openSidebarPanel = useLabChromeStore((s) => s.openSidebarPanel);
  const isDeveloperPanelOpen = useLabChromeStore(
    (s) => s.isDeveloperPanelOpen,
  );
  const selectedDeveloperTab = useLabChromeStore(
    (s) => s.selectedDeveloperTab,
  );
  const openDeveloperPanel = useLabChromeStore((s) => s.openDeveloperPanel);
  const closeDeveloperPanel = useLabChromeStore(
    (s) => s.closeDeveloperPanel,
  );

  // Count errors across all cells
  const cellIds = useLabCellStore((s) => s.cellIds);
  const cellRuntime = useLabCellStore((s) => s.cellRuntime);
  const errorCount = cellIds.filter((id) => cellRuntime[id]?.errored).length;

  const handleDeveloperClick = (tab: DeveloperPanelTab) => {
    if (isDeveloperPanelOpen && selectedDeveloperTab === tab) {
      closeDeveloperPanel();
    } else {
      openDeveloperPanel(tab);
    }
  };

  return (
    <div
      data-slot="lab-sidebar"
      className="flex flex-col items-center w-10 py-2 gap-1 shrink-0 border-r border-mine-border/50"
    >
      {/* Top group: sidebar panels */}
      <div className="flex flex-col items-center gap-1">
        {SIDEBAR_ITEMS.map((item) => (
          <SidebarIconButton
            key={item.panel}
            icon={item.icon}
            label={item.label}
            isActive={isSidebarOpen && selectedPanel === item.panel}
            onClick={() => openSidebarPanel(item.panel)}
          />
        ))}
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Separator */}
      <div className="w-5 h-px bg-mine-border/50 my-1" />

      {/* Bottom group: developer panels */}
      <div className="flex flex-col items-center gap-1">
        {DEVELOPER_ITEMS.map((item) => (
          <SidebarIconButton
            key={item.tab}
            icon={item.icon}
            label={item.label}
            isActive={
              isDeveloperPanelOpen && selectedDeveloperTab === item.tab
            }
            badge={item.tab === "errors" ? errorCount : undefined}
            onClick={() => handleDeveloperClick(item.tab)}
          />
        ))}
      </div>
    </div>
  );
}
