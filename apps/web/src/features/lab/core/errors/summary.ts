/* Copyright 2026 Marimo. All rights reserved. */

import type { CellId } from '@/features/lab/core/cells/ids';
import type { MarimoError } from '@/features/lab/core/kernel/messages';

export interface CellErrorSummary {
  cellId: CellId;
  cellName: string;
  errorType: string;
  headline: string;
  lineHint: number | null;
  updatedAt: number;
  count: number;
}

export function buildCellErrorSummary(opts: {
  cellId: CellId;
  cellName: string;
  errors: MarimoError[];
  updatedAt?: number | null;
}): CellErrorSummary {
  const firstError = opts.errors[0];
  const errorType = getErrorType(firstError);

  return {
    cellId: opts.cellId,
    cellName: opts.cellName,
    errorType,
    headline: getErrorHeadline(firstError),
    lineHint: getLineHint(firstError),
    updatedAt: opts.updatedAt ?? 0,
    count: opts.errors.length,
  };
}

function getErrorType(error: MarimoError | undefined): string {
  if (!error || !('type' in error)) {
    return 'unknown';
  }
  const value = error.type;
  return typeof value === 'string' ? value : 'unknown';
}

function getErrorHeadline(error: MarimoError | undefined): string {
  if (!error) {
    return 'Unknown error';
  }

  if ('msg' in error && typeof error.msg === 'string' && error.msg.trim()) {
    return firstLine(error.msg);
  }

  if (error.type === 'multiple-defs' && 'name' in error) {
    return `Multiple definition: ${error.name}`;
  }

  if (error.type === 'cycle') {
    return 'Circular dependency detected';
  }

  if (error.type === 'setup-refs') {
    return 'Setup dependencies are cyclic';
  }

  if (error.type === 'interruption') {
    return 'Execution interrupted';
  }

  if (error.type === 'internal' && 'error_id' in error) {
    return `Internal error (${error.error_id})`;
  }

  return 'Execution failed';
}

function getLineHint(error: MarimoError | undefined): number | null {
  if (!error) {
    return null;
  }

  if ('lineno' in error && typeof error.lineno === 'number') {
    return error.lineno;
  }
  if ('sql_line' in error && typeof error.sql_line === 'number') {
    return error.sql_line;
  }
  if ('node_lineno' in error && typeof error.node_lineno === 'number') {
    return error.node_lineno;
  }

  return null;
}

function firstLine(message: string): string {
  return message.trim().split('\n')[0] ?? message.trim();
}
