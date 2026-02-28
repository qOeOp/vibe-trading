/* Copyright 2026 Marimo. All rights reserved. */

// Stub MCP hooks — MCP server management is not yet available in VT.
// These provide the minimum interface expected by mcp-config.tsx.

export function useMCPStatus() {
  return { data: null, refetch: () => {}, isFetching: false };
}

export function useMCPRefresh() {
  return { refresh: async () => {}, isRefreshing: false };
}
