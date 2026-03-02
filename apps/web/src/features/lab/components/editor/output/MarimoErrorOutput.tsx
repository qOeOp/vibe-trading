/* Copyright 2026 Marimo. All rights reserved. */

import type { JSX } from 'react';
import { cn } from '@/features/lab/utils/cn';
import type { CellId } from '@/features/lab/core/cells/ids';
import type { MarimoError } from '@/features/lab/core/kernel/messages';

interface Props {
  cellId: CellId | undefined;
  errors: MarimoError[];
  className?: string;
}

export const MarimoErrorOutput = ({
  errors,
  className,
}: Props): JSX.Element => {
  return (
    <div data-slot="marimo-error-output" className={cn('space-y-2', className)}>
      {errors.map((error, idx) => (
        <ErrorBlock key={idx} error={error} />
      ))}
    </div>
  );
};

// ─── Error Block ─────────────────────────────────────────

function ErrorBlock({ error }: { error: MarimoError }) {
  const errorType = getType(error);

  switch (errorType) {
    case 'multiple-defs':
      return <MultipleDefsBlock error={error} />;
    case 'cycle':
      return <RelationBlock error={error} label="Circular dependency" />;
    case 'setup-refs':
      return <RelationBlock error={error} label="Setup dependency cycle" />;
    case 'sql-error':
      return <SqlErrorBlock error={error} />;
    default:
      return <TracebackBlock error={error} errorType={errorType} />;
  }
}

// ─── Traceback (exception / internal / unknown) ──────────

function TracebackBlock({
  error,
  errorType,
}: {
  error: MarimoError;
  errorType: string;
}) {
  const msg = getMsg(error);
  const traceback: string[] =
    'traceback' in error && Array.isArray((error as any).traceback)
      ? (error as any).traceback
      : [];
  const exceptionType =
    'exception_type' in error ? String((error as any).exception_type) : null;
  const lineno =
    'lineno' in error && typeof (error as any).lineno === 'number'
      ? (error as any).lineno
      : null;

  return (
    <div className="rounded-lg border border-market-up-medium/20 bg-market-up-medium/5 overflow-hidden">
      {/* Header */}
      <div className="px-3 py-2 bg-market-up-medium/10 border-b border-market-up-medium/20 flex items-baseline gap-2">
        <span className="text-xs font-semibold text-market-up-medium font-mono">
          {exceptionType ?? errorType}
        </span>
        {lineno != null && (
          <span className="text-[10px] text-mine-muted font-mono">
            line {lineno}
          </span>
        )}
      </div>

      {/* Message */}
      {msg && (
        <div className="px-3 py-2 text-xs text-mine-text border-b border-market-up-medium/10">
          {msg}
        </div>
      )}

      {/* Traceback */}
      {traceback.length > 0 && (
        <pre className="px-3 py-2 text-[11px] font-mono leading-relaxed text-mine-text overflow-x-auto">
          {traceback.map((line, i) => (
            <TracebackLine key={i} line={line} />
          ))}
        </pre>
      )}
    </div>
  );
}

// ─── SQL Error ───────────────────────────────────────────

function SqlErrorBlock({ error }: { error: MarimoError }) {
  const msg = getMsg(error);
  const sqlStatement =
    'sql_statement' in error ? String((error as any).sql_statement) : null;
  const sqlLine =
    'sql_line' in error && typeof (error as any).sql_line === 'number'
      ? (error as any).sql_line
      : null;
  const sqlCol =
    'sql_col' in error && typeof (error as any).sql_col === 'number'
      ? (error as any).sql_col
      : null;
  const hint = 'hint' in error ? String((error as any).hint) : null;

  return (
    <div className="rounded-lg border border-market-up-medium/20 bg-market-up-medium/5 overflow-hidden">
      <div className="px-3 py-2 bg-market-up-medium/10 border-b border-market-up-medium/20 flex items-baseline gap-2">
        <span className="text-xs font-semibold text-market-up-medium font-mono">
          SQL Error
        </span>
        {sqlLine != null && (
          <span className="text-[10px] text-mine-muted font-mono">
            line {sqlLine}
            {sqlCol != null ? `, col ${sqlCol}` : ''}
          </span>
        )}
      </div>

      {msg && (
        <div className="px-3 py-2 text-xs text-mine-text border-b border-market-up-medium/10">
          {msg}
        </div>
      )}

      {sqlStatement && (
        <pre className="px-3 py-2 text-[11px] font-mono leading-relaxed text-mine-text overflow-x-auto">
          {sqlStatement.split('\n').map((line, i) => {
            const lineNum = i + 1;
            const isErrorLine = sqlLine != null && lineNum === sqlLine;
            return (
              <div
                key={i}
                className={cn(
                  isErrorLine && 'bg-market-up-medium/10 text-market-up-medium',
                )}
              >
                <span className="text-mine-muted select-none inline-block w-6 text-right mr-2">
                  {lineNum}
                </span>
                {line}
              </div>
            );
          })}
        </pre>
      )}

      {hint && (
        <div className="px-3 py-1.5 text-[11px] text-mine-muted italic border-t border-market-up-medium/10">
          Hint: {hint}
        </div>
      )}
    </div>
  );
}

// ─── Multiple Definitions ────────────────────────────────

function MultipleDefsBlock({ error }: { error: MarimoError }) {
  const name = 'name' in error ? String((error as any).name) : null;
  const msg = getMsg(error);

  return (
    <div className="rounded-lg border border-mine-accent-yellow/30 bg-mine-accent-yellow/5 overflow-hidden">
      <div className="px-3 py-2 bg-mine-accent-yellow/10 border-b border-mine-accent-yellow/20 flex items-baseline gap-2">
        <span className="text-xs font-semibold text-mine-accent-yellow font-mono">
          Multiple definitions
        </span>
        {name && (
          <code className="text-xs font-mono text-mine-text">{name}</code>
        )}
      </div>
      {msg && <div className="px-3 py-2 text-xs text-mine-text">{msg}</div>}
    </div>
  );
}

// ─── Relation (cycle / setup-refs) ───────────────────────

function RelationBlock({
  error,
  label,
}: {
  error: MarimoError;
  label: string;
}) {
  const msg = getMsg(error);

  return (
    <div className="rounded-lg border border-mine-accent-yellow/30 bg-mine-accent-yellow/5 overflow-hidden">
      <div className="px-3 py-2 bg-mine-accent-yellow/10 border-b border-mine-accent-yellow/20">
        <span className="text-xs font-semibold text-mine-accent-yellow font-mono">
          {label}
        </span>
      </div>
      {msg && (
        <div className="px-3 py-2 text-xs text-mine-text whitespace-pre-wrap">
          {msg}
        </div>
      )}
    </div>
  );
}

// ─── Traceback Line (colorized) ──────────────────────────

function TracebackLine({ line }: { line: string }) {
  // File references: "  File "xxx", line N"
  const fileMatch = line.match(/^(\s*File\s+")([^"]+)(",\s+line\s+)(\d+)/);
  if (fileMatch) {
    return (
      <div>
        <span className="text-mine-muted">{fileMatch[1]}</span>
        <span className="text-mine-accent-teal">{fileMatch[2]}</span>
        <span className="text-mine-muted">{fileMatch[3]}</span>
        <span className="text-mine-accent-yellow">{fileMatch[4]}</span>
        <span className="text-mine-muted">
          {line.slice(fileMatch[0].length)}
        </span>
      </div>
    );
  }

  // Final error line (e.g., "ValueError: ...")
  if (/^\w+Error:/.test(line) || /^\w+Exception:/.test(line)) {
    return <div className="text-market-up-medium font-semibold">{line}</div>;
  }

  // Code pointer lines (e.g., "    ^^^^")
  if (/^\s*\^+\s*$/.test(line)) {
    return <div className="text-market-up-medium">{line}</div>;
  }

  return <div>{line}</div>;
}

// ─── Helpers ─────────────────────────────────────────────

function getType(error: MarimoError): string {
  if ('type' in error && typeof error.type === 'string') {
    return error.type;
  }
  return 'unknown';
}

function getMsg(error: MarimoError): string | null {
  if ('msg' in error && typeof error.msg === 'string' && error.msg.trim()) {
    return error.msg;
  }
  return null;
}
