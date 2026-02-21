/**
 * Stub: static/virtual-file-tracker — Virtual file tracking not used in VT.
 */

const instance = {
  track(_data: unknown): void {
    // no-op
  },
  removeForCellId(_cellId: string): void {
    // no-op
  },
  filenames(): string[] {
    return [];
  },
  getTrackedFiles(): string[] {
    return [];
  },
};

export const VirtualFileTracker = {
  INSTANCE: instance,
  track(_url: string): void {
    // no-op
  },
  getTrackedFiles(): string[] {
    return [];
  },
};
