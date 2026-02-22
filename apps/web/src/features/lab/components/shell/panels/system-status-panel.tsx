'use client';

import { useState } from 'react';
import { useAtomValue } from 'jotai';
import {
  CpuIcon,
  MemoryStickIcon,
  MicrochipIcon,
  WifiIcon,
  WifiOffIcon,
  ZapIcon,
  ZapOffIcon,
  SparklesIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { connectionAtom } from '@/features/lab/core/network/connection';
import { useRequestClient } from '@/features/lab/core/network/requests';
import { isWasm } from '@/features/lab/core/wasm/utils';
import { WebSocketState } from '@/features/lab/core/websocket/types';
import { useAsyncData } from '@/features/lab/hooks/useAsyncData';
import { useInterval } from '@/features/lab/hooks/useInterval';
import {
  useResolvedMarimoConfig,
  aiAtom,
  aiEnabledAtom,
} from '@/features/lab/core/config/config';
import { connectionStatusAtom } from '@/features/lab/components/editor/chrome/wrapper/footer-items/backend-status';

// ─── System Status Panel ──────────────────────────────────
//
// Right sidebar panel showing system metrics, runtime config,
// and service statuses. Replaces the crowded dock items.

/** Hook: polls /api/usage every 10s */
function useUsageStats() {
  const [nonce, setNonce] = useState(0);
  const connection = useAtomValue(connectionAtom);
  const { getUsageStats } = useRequestClient();

  useInterval(() => setNonce((n) => n + 1), {
    delayMs: 10_000,
    whenVisible: true,
  });

  const { data } = useAsyncData(async () => {
    if (isWasm()) return null;
    if (connection.state !== WebSocketState.OPEN) return null;
    try {
      return await getUsageStats();
    } catch {
      return null;
    }
  }, [nonce, connection.state]);

  return data;
}

// ─── Sub-components ──────────────────────────────────────

function StatusSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div
      data-slot="status-section"
      className="px-4 py-3 border-b border-mine-border/30 last:border-b-0"
    >
      <div className="text-[10px] text-mine-muted uppercase tracking-wider font-medium mb-2">
        {title}
      </div>
      {children}
    </div>
  );
}

function UsageBar({
  label,
  icon: Icon,
  percent,
  detail,
  colorClass,
}: {
  label: string;
  icon: React.ElementType;
  percent: number;
  detail?: string;
  colorClass?: string;
}) {
  const rounded = Math.round(percent);
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-xs text-mine-text">
          <Icon className="w-3.5 h-3.5 text-mine-muted" />
          <span>{label}</span>
        </div>
        <span className="text-xs font-mono tabular-nums text-mine-muted">
          {rounded}%
        </span>
      </div>
      <div className="h-1.5 w-full bg-mine-border/30 rounded-full overflow-hidden">
        <div
          className={cn(
            'h-full rounded-full transition-all duration-500',
            colorClass ?? 'bg-mine-accent-teal',
            rounded > 80 && 'bg-mine-accent-red',
            rounded > 60 && rounded <= 80 && 'bg-mine-accent-yellow',
          )}
          style={{ width: `${rounded}%` }}
        />
      </div>
      {detail && (
        <span className="text-[10px] text-mine-muted font-mono">{detail}</span>
      )}
    </div>
  );
}

function formatBytes(bytes: number): string {
  if (bytes > 1024 * 1024 * 1024) {
    return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
  }
  return `${Math.round(bytes / (1024 * 1024))} MB`;
}

function StatusDot({ ok }: { ok: boolean }) {
  return (
    <div
      className={cn(
        'w-2 h-2 rounded-full shrink-0',
        ok ? 'bg-mine-accent-green' : 'bg-mine-accent-red',
      )}
    />
  );
}

// ─── Main Panel ──────────────────────────────────────────

function SystemStatusPanel() {
  const data = useUsageStats();
  const connectionStatus = useAtomValue(connectionStatusAtom);
  const aiEnabled = useAtomValue(aiEnabledAtom);
  const ai = useAtomValue(aiAtom);
  const [config] = useResolvedMarimoConfig();

  const isHealthy = connectionStatus === 'healthy';

  return (
    <div data-slot="system-status-panel" className="flex flex-col">
      {/* Resources */}
      <StatusSection title="资源">
        <div className="flex flex-col gap-3">
          {data ? (
            <>
              <UsageBar label="CPU" icon={CpuIcon} percent={data.cpu.percent} />
              <UsageBar
                label="内存"
                icon={MemoryStickIcon}
                percent={data.memory.percent}
                detail={`${formatBytes(data.memory.total - data.memory.available)} / ${formatBytes(data.memory.total)}`}
              />
              {data.kernel?.memory && (
                <div className="flex items-center justify-between text-[10px] text-mine-muted pl-5">
                  <span>Kernel</span>
                  <span className="font-mono tabular-nums">
                    {formatBytes(data.kernel.memory)}
                  </span>
                </div>
              )}
              {data.server?.memory && (
                <div className="flex items-center justify-between text-[10px] text-mine-muted pl-5">
                  <span>Server</span>
                  <span className="font-mono tabular-nums">
                    {formatBytes(data.server.memory)}
                  </span>
                </div>
              )}
              {data.gpu &&
                data.gpu.map((gpu) => (
                  <UsageBar
                    key={gpu.index}
                    label={`GPU ${gpu.index}`}
                    icon={MicrochipIcon}
                    percent={gpu.memory.percent}
                    detail={`${formatBytes(gpu.memory.used)} / ${formatBytes(gpu.memory.total)} — ${gpu.name}`}
                    colorClass="bg-emerald-500"
                  />
                ))}
            </>
          ) : (
            <span className="text-xs text-mine-muted">等待数据...</span>
          )}
        </div>
      </StatusSection>

      {/* Connection */}
      <StatusSection title="连接">
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs text-mine-text">
              {isHealthy ? (
                <WifiIcon className="w-3.5 h-3.5 text-mine-accent-green" />
              ) : (
                <WifiOffIcon className="w-3.5 h-3.5 text-mine-accent-red" />
              )}
              <span>Kernel</span>
            </div>
            <div className="flex items-center gap-1.5">
              <StatusDot ok={isHealthy} />
              <span className="text-[10px] text-mine-muted capitalize">
                {connectionStatus}
              </span>
            </div>
          </div>
        </div>
      </StatusSection>

      {/* Runtime */}
      <StatusSection title="运行时">
        <div className="flex flex-col gap-2">
          <RuntimeRow
            label="On startup"
            value={config.runtime.auto_instantiate ? 'autorun' : 'lazy'}
            active={config.runtime.auto_instantiate}
          />
          <RuntimeRow
            label="On cell change"
            value={config.runtime.on_cell_change}
            active={config.runtime.on_cell_change === 'autorun'}
          />
          {!isWasm() && (
            <RuntimeRow
              label="Module reload"
              value={config.runtime.auto_reload}
              active={config.runtime.auto_reload === 'autorun'}
            />
          )}
        </div>
      </StatusSection>

      {/* Services */}
      <StatusSection title="服务">
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs text-mine-text">
              <SparklesIcon className="w-3.5 h-3.5 text-mine-muted" />
              <span>AI</span>
            </div>
            <div className="flex items-center gap-1.5">
              <StatusDot ok={aiEnabled} />
              <span className="text-[10px] text-mine-muted font-mono">
                {aiEnabled ? (ai?.open_ai?.model ?? 'enabled') : 'disabled'}
              </span>
            </div>
          </div>
        </div>
      </StatusSection>
    </div>
  );
}

function RuntimeRow({
  label,
  value,
  active,
}: {
  label: string;
  value: string;
  active: boolean;
}) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-1.5 text-xs text-mine-text">
        {active ? (
          <ZapIcon className="w-3.5 h-3.5 text-amber-500" />
        ) : (
          <ZapOffIcon className="w-3.5 h-3.5 text-mine-muted" />
        )}
        <span>{label}</span>
      </div>
      <span className="text-[10px] text-mine-muted font-mono">{value}</span>
    </div>
  );
}

/** Static version for disconnected mode */
function SystemStatusPanelLite() {
  return (
    <div data-slot="system-status-panel-lite" className="flex flex-col">
      <StatusSection title="资源">
        <div className="flex flex-col gap-3">
          <UsageBar label="CPU" icon={CpuIcon} percent={0} />
          <UsageBar label="内存" icon={MemoryStickIcon} percent={0} />
        </div>
      </StatusSection>
      <StatusSection title="连接">
        <div className="flex items-center gap-1.5 text-xs text-mine-muted">
          <WifiOffIcon className="w-3.5 h-3.5" />
          <span>未连接</span>
        </div>
      </StatusSection>
    </div>
  );
}

export { SystemStatusPanel, SystemStatusPanelLite };
