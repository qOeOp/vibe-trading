import { describe, expect, it } from 'vitest';
import { buildCellErrorSummary } from '../summary';
import type { CellId } from '@/features/lab/core/cells/ids';

const cellId = 'cell-1' as CellId;

describe('buildCellErrorSummary', () => {
  it('extracts headline from msg', () => {
    const result = buildCellErrorSummary({
      cellId,
      cellName: 'my_cell',
      errors: [{ type: 'exception', msg: 'NameError: x is not defined' }],
    });
    expect(result.headline).toBe('NameError: x is not defined');
    expect(result.errorType).toBe('exception');
    expect(result.cellName).toBe('my_cell');
    expect(result.count).toBe(1);
  });

  it('uses first line of multi-line msg', () => {
    const result = buildCellErrorSummary({
      cellId,
      cellName: '',
      errors: [{ type: 'exception', msg: 'Line 1\nLine 2\nLine 3' }],
    });
    expect(result.headline).toBe('Line 1');
  });

  it('handles multiple-defs with name field', () => {
    const result = buildCellErrorSummary({
      cellId,
      cellName: '',
      errors: [{ type: 'multiple-defs', msg: '', name: 'df' }],
    });
    expect(result.headline).toBe('Multiple definition: df');
    expect(result.errorType).toBe('multiple-defs');
  });

  it('handles cycle errors', () => {
    const result = buildCellErrorSummary({
      cellId,
      cellName: '',
      errors: [{ type: 'cycle', msg: '' }],
    });
    expect(result.headline).toBe('Circular dependency detected');
  });

  it('handles setup-refs errors', () => {
    const result = buildCellErrorSummary({
      cellId,
      cellName: '',
      errors: [{ type: 'setup-refs', msg: '' }],
    });
    expect(result.headline).toBe('Setup dependencies are cyclic');
  });

  it('handles interruption errors', () => {
    const result = buildCellErrorSummary({
      cellId,
      cellName: '',
      errors: [{ type: 'interruption', msg: '' }],
    });
    expect(result.headline).toBe('Execution interrupted');
  });

  it('handles internal errors with error_id', () => {
    const result = buildCellErrorSummary({
      cellId,
      cellName: '',
      errors: [{ type: 'internal', msg: '', error_id: 'ERR-42' }],
    });
    expect(result.headline).toBe('Internal error (ERR-42)');
  });

  it('extracts lineno hint', () => {
    const result = buildCellErrorSummary({
      cellId,
      cellName: '',
      errors: [{ type: 'exception', msg: 'err', lineno: 5 }],
    });
    expect(result.lineHint).toBe(5);
  });

  it('extracts sql_line hint', () => {
    const result = buildCellErrorSummary({
      cellId,
      cellName: '',
      errors: [{ type: 'sql-error', msg: 'bad sql', sql_line: 3 }],
    });
    expect(result.lineHint).toBe(3);
  });

  it('returns null lineHint when no line info', () => {
    const result = buildCellErrorSummary({
      cellId,
      cellName: '',
      errors: [{ type: 'exception', msg: 'err' }],
    });
    expect(result.lineHint).toBeNull();
  });

  it('counts multiple errors', () => {
    const result = buildCellErrorSummary({
      cellId,
      cellName: '',
      errors: [
        { type: 'exception', msg: 'err1' },
        { type: 'exception', msg: 'err2' },
        { type: 'exception', msg: 'err3' },
      ],
    });
    expect(result.count).toBe(3);
  });

  it('falls back to "Execution failed" for unknown type with empty msg', () => {
    const result = buildCellErrorSummary({
      cellId,
      cellName: '',
      errors: [{ type: 'something-new', msg: '' }],
    });
    expect(result.headline).toBe('Execution failed');
  });

  it('handles undefined error gracefully', () => {
    const result = buildCellErrorSummary({
      cellId,
      cellName: '',
      errors: [],
    });
    expect(result.headline).toBe('Unknown error');
    expect(result.errorType).toBe('unknown');
  });
});
