/* Copyright 2026 Marimo. All rights reserved. */
/* Stub: VT lab migration — chart signal types */

import type { SignalListenerHandler } from 'vega-typings';

export interface SignalListener {
  signalName: string;
  handler: SignalListenerHandler;
}
