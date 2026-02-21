/**
 * Type declarations bridging @open-rpc/client-js/build/* -> dist/*
 * The package ships types under dist/, but marimo imports from build/.
 */
declare module '@open-rpc/client-js/build/Request' {
  export type {
    JSONRPCRequestData,
    IJSONRPCData,
    IBatchRequest,
    IJSONRPCRequest,
    IJSONRPCError,
    IJSONRPCResponse,
    IJSONRPCNotification,
    IJSONRPCNotificationResponse,
  } from '@open-rpc/client-js/dist/Request';
}

declare module '@open-rpc/client-js/build/transports/Transport' {
  export {
    Transport,
    type TransportEventChannel,
  } from '@open-rpc/client-js/dist/transports/Transport';
}
