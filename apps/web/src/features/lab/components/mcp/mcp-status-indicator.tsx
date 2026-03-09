/* Copyright 2026 Marimo. All rights reserved. */

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Loader2, PlugIcon, RefreshCw } from 'lucide-react';
import { useAtomValue } from 'jotai';
import { cn } from '@/lib/utils';
import { requestClientAtom } from '@/features/lab/core/network/requests';
import type { MCPStatusResponse } from '@/features/lab/core/network/types';

type StatusTone = 'ok' | 'partial' | 'error' | 'unknown';

const POLL_MS = 30_000;

function toTone(status: MCPStatusResponse['status'] | null): StatusTone {
  if (status === 'ok') return 'ok';
  if (status === 'partial') return 'partial';
  if (status === 'error') return 'error';
  return 'unknown';
}

function toneToClassName(tone: StatusTone): string {
  if (tone === 'ok') return 'bg-emerald-500';
  if (tone === 'partial') return 'bg-amber-500';
  if (tone === 'error') return 'bg-rose-500';
  return 'bg-slate-400';
}

function buildTitle(state: {
  status: MCPStatusResponse['status'] | null;
  error: string | null;
  servers: Record<string, 'pending' | 'connected' | 'disconnected' | 'failed'>;
}): string {
  const statusLabel = state.status ?? 'unknown';
  const serverLines = Object.entries(state.servers).map(
    ([name, status]) => `${name}: ${status}`,
  );

  return [
    `MCP: ${statusLabel}`,
    state.error ? `Error: ${state.error}` : '',
    serverLines.length > 0 ? `Servers:\n${serverLines.join('\n')}` : '',
    'Click to refresh.',
  ]
    .filter(Boolean)
    .join('\n');
}

type MCPStatusIndicatorProps = {
  className?: string;
  compact?: boolean;
};

// Minimal McpStatusText used by app-config/mcp-config.tsx
export const McpStatusText: React.FC<{ status: string }> = ({ status }) => (
  <span className="text-xs text-mine-muted capitalize">{status}</span>
);

export const MCPStatusIndicator: React.FC<MCPStatusIndicatorProps> = ({
  className,
  compact = false,
}) => {
  const requestClient = useAtomValue(requestClientAtom);
  const getMcpStatus = requestClient?.getMcpStatus;
  const refreshMcp = requestClient?.refreshMcp;
  const [status, setStatus] = useState<MCPStatusResponse['status'] | null>(
    null,
  );
  const [error, setError] = useState<string | null>(null);
  const [servers, setServers] = useState<
    Record<string, 'pending' | 'connected' | 'disconnected' | 'failed'>
  >({});
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const loadStatus = useCallback(async () => {
    if (!getMcpStatus) {
      setIsLoading(false);
      setStatus(null);
      setError(null);
      setServers({});
      return;
    }

    try {
      const response = await getMcpStatus();
      setStatus(response.status);
      setError(response.error ?? null);
      setServers(response.servers ?? {});
    } catch (e) {
      setStatus('error');
      setError(e instanceof Error ? e.message : 'Failed to fetch MCP status');
      setServers({});
    } finally {
      setIsLoading(false);
    }
  }, [getMcpStatus]);

  useEffect(() => {
    void loadStatus();
    const timer = window.setInterval(() => {
      void loadStatus();
    }, POLL_MS);
    return () => window.clearInterval(timer);
  }, [loadStatus]);

  const handleRefresh = useCallback(async () => {
    if (!refreshMcp) {
      return;
    }
    setIsRefreshing(true);
    try {
      await refreshMcp();
      await loadStatus();
    } finally {
      setIsRefreshing(false);
    }
  }, [loadStatus, refreshMcp]);

  const tone = useMemo(() => toTone(status), [status]);
  const title = useMemo(
    () =>
      buildTitle({
        status,
        error,
        servers,
      }),
    [status, error, servers],
  );

  return (
    <button
      type="button"
      onClick={handleRefresh}
      title={title}
      disabled={isRefreshing || !refreshMcp}
      className={cn(
        'inline-flex items-center gap-1.5 rounded border border-mine-border/60 bg-white px-2 py-1 text-[11px] text-mine-muted hover:text-mine-text transition-colors disabled:opacity-60',
        compact && 'px-1.5 py-0.5 text-[10px]',
        className,
      )}
    >
      {isLoading || isRefreshing ? (
        <Loader2 className="h-3.5 w-3.5 animate-spin" />
      ) : (
        <PlugIcon className="h-3.5 w-3.5" />
      )}
      {!compact && <span className="font-medium">MCP</span>}
      <span
        className={cn(
          'inline-block h-1.5 w-1.5 rounded-full',
          toneToClassName(tone),
        )}
      />
      <RefreshCw
        className={cn(
          'h-3 w-3 opacity-60',
          isRefreshing && 'animate-spin opacity-100',
        )}
      />
    </button>
  );
};
