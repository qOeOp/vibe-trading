"use client";

import {
  Panel,
  Group,
  Separator,
} from "react-resizable-panels";
import { cn } from "@/lib/utils";
import { useLabChromeStore } from "../../store/use-lab-chrome-store";
import { LabSidebar } from "./lab-sidebar";
import { LabFooter } from "./lab-footer";
import { LabToolbar } from "../lab-toolbar";
import { CellsWorkspace } from "../lab-workspace";
import { ContextPanel } from "../context-panel/context-panel";

// Sidebar panels (lazy-ish — they're small)
import { FileExplorerPanel } from "../panels/file-explorer-panel";
import { VariablePanel } from "../panels/variable-panel";
import { DependencyGraphPanel } from "../panels/dependency-graph-panel";
import { OutlinePanel } from "../panels/outline-panel";

// Developer panels
import { ErrorPanel } from "../panels/error-panel";
import { LogsPanel } from "../panels/logs-panel";
import { TerminalPanel } from "../panels/terminal-panel";

// CSS
import "../../css/cell.css";
import "../../css/outputs.css";
import "../../css/codemirror.css";

// ─── Sidebar Content ─────────────────────────────────────

function SidebarContent() {
  const selectedPanel = useLabChromeStore((s) => s.selectedPanel);

  switch (selectedPanel) {
    case "files":
      return <FileExplorerPanel />;
    case "variables":
      return <VariablePanel />;
    case "dependencies":
      return <DependencyGraphPanel />;
    case "outline":
      return <OutlinePanel />;
    default:
      return null;
  }
}

// ─── Developer Panel ─────────────────────────────────────

function DeveloperPanelContent() {
  const selectedTab = useLabChromeStore((s) => s.selectedDeveloperTab);

  switch (selectedTab) {
    case "errors":
      return <ErrorPanel />;
    case "logs":
      return <LogsPanel />;
    case "terminal":
      return <TerminalPanel />;
    default:
      return <ErrorPanel />;
  }
}

// ─── Lab Chrome ──────────────────────────────────────────

/**
 * LabChrome — The main layout shell for the Lab page
 *
 * Layout:
 * ┌─────────────────────────────────────────────────────────┐
 * │ LabSidebar │ SidebarPanel │ Main Content  │ Context     │
 * │ (40px)     │ (0~260px)    │               │ (0~360px)   │
 * │            │              │ ┌───────────┐ │             │
 * │            │              │ │ Toolbar   │ │             │
 * │            │              │ │ Cells     │ │             │
 * │            │              │ │           │ │             │
 * │            │              │ ├───────────┤ │             │
 * │            │              │ │ DevPanel  │ │             │
 * │            │              │ └───────────┘ │             │
 * ├─────────────────────────────────────────────────────────┤
 * │ Footer                                                  │
 * └─────────────────────────────────────────────────────────┘
 */
export function LabChrome() {
  const isSidebarOpen = useLabChromeStore((s) => s.isSidebarOpen);
  const isDeveloperPanelOpen = useLabChromeStore(
    (s) => s.isDeveloperPanelOpen,
  );
  const isContextPanelOpen = useLabChromeStore(
    (s) => s.isContextPanelOpen,
  );

  return (
    <div
      data-slot="lab-chrome"
      className="h-full flex flex-col bg-mine-page-bg overflow-hidden"
    >
      {/* Main horizontal layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left icon rail (fixed width) */}
        <LabSidebar />

        {/* Resizable panels */}
        <Group orientation="horizontal" className="flex-1">
          {/* Sidebar panel (collapsible) */}
          {isSidebarOpen && (
            <>
              <Panel
                defaultSize={20}
                minSize={15}
                maxSize={30}
                className="bg-white border-r border-mine-border/50"
              >
                <SidebarContent />
              </Panel>
              <Separator
                className={cn(
                  "w-px bg-mine-border/30",
                  "hover:bg-mine-accent-teal/30 active:bg-mine-accent-teal/50",
                  "transition-colors",
                )}
              />
            </>
          )}

          {/* Main content area */}
          <Panel defaultSize={isSidebarOpen ? 55 : 65} minSize={30}>
            <Group orientation="vertical">
              {/* Body: toolbar + cells */}
              <Panel defaultSize={isDeveloperPanelOpen ? 70 : 100} minSize={30}>
                <div className="h-full flex flex-col overflow-hidden px-2 pt-2">
                  <LabToolbar />
                  <div className="flex-1 overflow-hidden mt-2">
                    <CellsWorkspace />
                  </div>
                </div>
              </Panel>

              {/* Developer panel (collapsible) */}
              {isDeveloperPanelOpen && (
                <>
                  <Separator
                    className={cn(
                      "h-px bg-mine-border/30",
                      "hover:bg-mine-accent-teal/30 active:bg-mine-accent-teal/50",
                      "transition-colors",
                    )}
                  />
                  <Panel
                    defaultSize={30}
                    minSize={15}
                    maxSize={50}
                    className="bg-white border-t border-mine-border/50"
                  >
                    <DeveloperPanelContent />
                  </Panel>
                </>
              )}
            </Group>
          </Panel>

          {/* Context panel (collapsible) */}
          {isContextPanelOpen && (
            <>
              <Separator
                className={cn(
                  "w-px bg-mine-border/30",
                  "hover:bg-mine-accent-teal/30 active:bg-mine-accent-teal/50",
                  "transition-colors",
                )}
              />
              <Panel
                defaultSize={25}
                minSize={15}
                maxSize={40}
                className="border-l border-mine-border/50"
              >
                <ContextPanel />
              </Panel>
            </>
          )}
        </Group>
      </div>

      {/* Footer */}
      <LabFooter />
    </div>
  );
}
