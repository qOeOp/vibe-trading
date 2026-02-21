/* Copyright 2026 Marimo. All rights reserved. */
/* Stub: VT lab migration — WASM bridge not used in VT */

import type { EditRequests, RunRequests } from '../network/types';
import type { IConnectionTransport } from '../websocket/transports/transport';

export class PyodideBridge {
  static get INSTANCE(): PyodideBridge {
    const KEY = '_marimo_private_PyodideBridge';
    if (!(window as any)[KEY]) {
      (window as any)[KEY] = new PyodideBridge();
    }
    return (window as any)[KEY] as PyodideBridge;
  }

  public initialized = Promise.resolve();
}

export function createPyodideConnection(): IConnectionTransport {
  throw new Error('WASM bridge not available in VT');
}
