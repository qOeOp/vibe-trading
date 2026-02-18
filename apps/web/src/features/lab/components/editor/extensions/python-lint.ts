import { linter, lintGutter } from "@codemirror/lint";
import type { Diagnostic } from "@codemirror/lint";
import type { Extension } from "@codemirror/state";
import type { EditorView } from "@codemirror/view";
import type { LintDiagnostic } from "../../../types";

// ─── Python Linter (via Pyodide Worker) ──────────────────
//
// Sends code to the Pyodide Web Worker for `ast.parse()`
// syntax checking (~1ms). Returns CodeMirror Diagnostics.

const LINT_TIMEOUT = 3000; // 3s max wait

/** Unique request counter for lint messages */
let lintCounter = 0;

/**
 * Creates a CodeMirror linter extension that validates Python syntax
 * by delegating to the Pyodide Web Worker's `ast.parse()`.
 *
 * @param getWorker - Returns the Pyodide Worker instance (or null if not ready)
 * @param onLintCount - Called with the number of diagnostics after each lint pass
 */
export function pythonLinter(
  getWorker: () => Worker | null,
  onLintCount?: (count: number) => void,
): Extension {
  return [
    linter(
      async (view: EditorView): Promise<Diagnostic[]> => {
        const worker = getWorker();
        if (!worker) {
          onLintCount?.(0);
          return [];
        }

        const code = view.state.doc.toString();
        if (!code.trim()) {
          onLintCount?.(0);
          return [];
        }

        const id = `lint_${Date.now()}_${++lintCounter}`;

        return new Promise<Diagnostic[]>((resolve) => {
          const timeout = setTimeout(() => {
            cleanup();
            onLintCount?.(0);
            resolve([]);
          }, LINT_TIMEOUT);

          function handler(event: MessageEvent) {
            const msg = event.data;
            if (msg.type === "LINT_RESULT" && msg.id === id) {
              cleanup();
              const diagnostics = convertDiagnostics(view, msg.diagnostics);
              onLintCount?.(diagnostics.length);
              resolve(diagnostics);
            }
          }

          function cleanup() {
            clearTimeout(timeout);
            worker!.removeEventListener("message", handler);
          }

          worker.addEventListener("message", handler);
          worker.postMessage({ type: "LINT", code, id });
        });
      },
      { delay: 500 },
    ),
    lintGutter(),
  ];
}

/**
 * Convert worker LintDiagnostic (line/col based) → CodeMirror Diagnostic (offset based)
 */
function convertDiagnostics(
  view: EditorView,
  diagnostics: LintDiagnostic[],
): Diagnostic[] {
  const doc = view.state.doc;
  const result: Diagnostic[] = [];

  for (const d of diagnostics) {
    // Clamp line numbers to valid range
    const startLine = Math.min(Math.max(1, d.line), doc.lines);
    const endLine = Math.min(Math.max(1, d.endLine), doc.lines);

    const lineInfo = doc.line(startLine);
    const endLineInfo = doc.line(endLine);

    // Convert 1-based col to 0-based offset
    const from = lineInfo.from + Math.min(Math.max(0, d.col - 1), lineInfo.length);
    let to = endLineInfo.from + Math.min(Math.max(0, d.endCol - 1), endLineInfo.length);

    // Ensure `to` is at least `from` (CodeMirror requires from <= to)
    if (to <= from) to = Math.min(from + 1, lineInfo.to);

    result.push({
      from,
      to,
      severity: d.severity,
      message: d.message,
    });
  }

  return result;
}
