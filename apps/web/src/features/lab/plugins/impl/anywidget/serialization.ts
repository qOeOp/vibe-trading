/**
 * Stub: anywidget/serialization — Widget binary serialization not used in VT.
 */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function decodeFromWire(_data: any): any {
  return _data;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function serializeBuffersToBase64(_data: any): {
  state: Record<string, unknown>;
  buffers: string[];
  bufferPaths: string[][];
} {
  return { state: _data ?? {}, buffers: [], bufferPaths: [] };
}
