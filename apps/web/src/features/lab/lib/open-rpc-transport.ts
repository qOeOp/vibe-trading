/**
 * Re-export Transport base class from @open-rpc/client-js.
 *
 * The package bundles Transport internally but doesn't re-export it.
 * We extract it from WebSocketTransport's prototype chain at runtime,
 * and re-declare the type for TypeScript.
 */
import { WebSocketTransport } from '@open-rpc/client-js';
import type { EventEmitter } from 'events';

// Inline type — @open-rpc/client-js doesn't export subpaths at runtime
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type JSONRPCRequestData = any;

type TransportEventName = 'pending' | 'notification' | 'response' | 'error';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type TransportEventHandler = (...args: any[]) => void;

/**
 * Abstract Transport base class from @open-rpc/client-js.
 */
export declare abstract class TransportType {
  constructor();
  abstract connect(): Promise<unknown>;
  abstract close(): void;
  abstract sendData(
    data: JSONRPCRequestData,
    timeout?: number | null,
  ): Promise<unknown>;
  subscribe(event: TransportEventName, handler: TransportEventHandler): void;
  unsubscribe(
    event?: TransportEventName,
    handler?: TransportEventHandler,
  ): EventEmitter | undefined;
}

// Extract the Transport class from WebSocketTransport's prototype chain
export const Transport: typeof TransportType = Object.getPrototypeOf(
  WebSocketTransport,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
) as any;
