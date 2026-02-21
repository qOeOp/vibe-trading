/**
 * Stub: editor/columns/storage — Column size persistence not used in VT.
 */

export function reorderColumnSizes(_from: number, _to: number): void {
  // no-op
}

export const storageFn = {
  getColumnWidth: (_index: number): number | 'contentWidth' => {
    return 'contentWidth';
  },
  saveColumnWidth: (_index: number, _width: number | 'contentWidth') => {
    // no-op
  },
  clearStorage: () => {
    // no-op
  },
};
