"use client";

import { cn } from "@/lib/utils";
import { useLabCellStore } from "../../store/use-lab-cell-store";
import { X } from "lucide-react";

interface VariableInfo {
  name: string;
  definedBy: string; // cell name or id
  usedBy: string[];  // cell names or ids
}

/**
 * VariablesPanel — Shows current namespace variables
 *
 * Displays all variables defined across cells with their
 * defining cell and consumer cells. Derived from the cells'
 * `defines` and `uses` arrays (populated by AST analysis).
 */
export function VariablesPanel() {
  const setSidebarPanel = useLabCellStore((s) => s.setSidebarPanel);
  const cells = useLabCellStore((s) => s.cells);

  // Build variable map from cell defines/uses
  const variables: VariableInfo[] = [];
  const variableMap = new Map<string, VariableInfo>();

  for (const cell of cells) {
    for (const varName of cell.defines) {
      if (!variableMap.has(varName)) {
        const info: VariableInfo = {
          name: varName,
          definedBy: cell.name || cell.id.slice(0, 8),
          usedBy: [],
        };
        variableMap.set(varName, info);
        variables.push(info);
      } else {
        // Update if later cell redefines (last writer wins display)
        variableMap.get(varName)!.definedBy =
          cell.name || cell.id.slice(0, 8);
      }
    }
  }

  // Populate usedBy
  for (const cell of cells) {
    for (const varName of cell.uses) {
      const info = variableMap.get(varName);
      if (info) {
        info.usedBy.push(cell.name || cell.id.slice(0, 8));
      }
    }
  }

  return (
    <div
      data-slot="variables-panel"
      className="flex flex-col h-full bg-white"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-mine-border/50">
        <span className="text-xs font-medium text-mine-muted uppercase tracking-wide">
          变量检查器
        </span>
        <button
          type="button"
          onClick={() => setSidebarPanel(null)}
          className="text-mine-muted hover:text-mine-text transition-colors"
          aria-label="关闭"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {variables.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 px-4">
            <p className="text-xs text-mine-muted text-center">
              运行 cell 后，变量会出现在这里
            </p>
            <p className="text-[10px] text-mine-muted/60 text-center mt-1">
              AST 分析会自动检测定义和引用
            </p>
          </div>
        ) : (
          <div className="divide-y divide-mine-border/30">
            {variables.map((v) => (
              <div
                key={v.name}
                data-slot="variable-row"
                className="px-4 py-2 hover:bg-mine-bg/30 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-medium text-mine-accent-teal">
                    {v.name}
                  </span>
                </div>
                <div className="flex items-center gap-3 mt-1 text-[10px] text-mine-muted">
                  <span>
                    定义:{" "}
                    <span className="font-mono text-mine-text">
                      {v.definedBy}
                    </span>
                  </span>
                  {v.usedBy.length > 0 && (
                    <span>
                      引用:{" "}
                      <span className="font-mono text-mine-text">
                        {v.usedBy.join(", ")}
                      </span>
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer stats */}
      <div className="px-4 py-2 border-t border-mine-border/50 text-[10px] text-mine-muted">
        共 {variables.length} 个变量 · {cells.length} 个 cells
      </div>
    </div>
  );
}
