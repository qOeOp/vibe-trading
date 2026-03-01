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
import { PanelSection, PanelText } from '@/components/shared/panel';

// ─── System Status Panel ──────────────────────────────────

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

// ─── Sub-components ─────────────────────────────────────

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
        <div className="flex items-center gap-1.5">
          <Icon className="w-3 h-3 text-mine-muted" />
          <PanelText variant="body">{label}</PanelText>
        </div>
        <PanelText variant="value" className="text-mine-muted">
          {rounded}%
        </PanelText>
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
        <PanelText variant="hint" className="font-mono">
          {detail}
        </PanelText>
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
      <div className="flex items-center gap-1.5">
        {active ? (
          <ZapIcon className="w-3 h-3 text-amber-500" />
        ) : (
          <ZapOffIcon className="w-3 h-3 text-mine-muted" />
        )}
        <PanelText variant="body">{label}</PanelText>
      </div>
      <PanelText variant="hint" className="font-mono">
        {value}
      </PanelText>
    </div>
  );
}

// ─── System Status Panel Content ────────────────────────

function SystemStatusPanel() {
  const data = useUsageStats();
  const connectionStatus = useAtomValue(connectionStatusAtom);
  const aiEnabled = useAtomValue(aiEnabledAtom);
  const ai = useAtomValue(aiAtom);
  const [config] = useResolvedMarimoConfig();

  const isHealthy = connectionStatus === 'healthy';

  return (
    <div data-slot="system-status-panel" className="flex flex-col">
      <PanelSection title="Resources">
        <div className="flex flex-col gap-3">
          {data ? (
            <>
              <UsageBar label="CPU" icon={CpuIcon} percent={data.cpu.percent} />
              <UsageBar
                label="Memory"
                icon={MemoryStickIcon}
                percent={data.memory.percent}
                detail={`${formatBytes(data.memory.total - data.memory.available)} / ${formatBytes(data.memory.total)}`}
              />
              {data.kernel?.memory && (
                <div className="flex items-center justify-between pl-5">
                  <PanelText variant="hint">Kernel</PanelText>
                  <PanelText variant="hint" className="font-mono tabular-nums">
                    {formatBytes(data.kernel.memory)}
                  </PanelText>
                </div>
              )}
              {data.server?.memory && (
                <div className="flex items-center justify-between pl-5">
                  <PanelText variant="hint">Server</PanelText>
                  <PanelText variant="hint" className="font-mono tabular-nums">
                    {formatBytes(data.server.memory)}
                  </PanelText>
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
            <PanelText variant="hint">Waiting for data...</PanelText>
          )}
        </div>
      </PanelSection>

      <PanelSection title="Connection">
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              {isHealthy ? (
                <WifiIcon className="w-3 h-3 text-mine-accent-green" />
              ) : (
                <WifiOffIcon className="w-3 h-3 text-mine-accent-red" />
              )}
              <PanelText variant="body">Kernel</PanelText>
            </div>
            <div className="flex items-center gap-1.5">
              <StatusDot ok={isHealthy} />
              <PanelText variant="hint" className="capitalize">
                {connectionStatus}
              </PanelText>
            </div>
          </div>
        </div>
      </PanelSection>

      <PanelSection title="Runtime">
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
      </PanelSection>

      <PanelSection title="Services">
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <SparklesIcon className="w-3 h-3 text-mine-muted" />
              <PanelText variant="body">AI</PanelText>
            </div>
            <div className="flex items-center gap-1.5">
              <StatusDot ok={aiEnabled} />
              <PanelText variant="hint" className="font-mono">
                {aiEnabled ? (ai?.open_ai?.model ?? 'enabled') : 'disabled'}
              </PanelText>
            </div>
          </div>
        </div>
      </PanelSection>
    </div>
  );
}

/** Static version for disconnected mode */
function SystemStatusPanelLite() {
  return (
    <div data-slot="system-status-panel-lite" className="flex flex-col">
      <PanelSection title="Resources">
        <div className="flex flex-col gap-3">
          <UsageBar label="CPU" icon={CpuIcon} percent={0} />
          <UsageBar label="Memory" icon={MemoryStickIcon} percent={0} />
        </div>
      </PanelSection>
      <PanelSection title="Connection">
        <div className="flex items-center gap-1.5">
          <WifiOffIcon className="w-3 h-3 text-mine-muted" />
          <PanelText variant="body" className="text-mine-muted">
            Disconnected
          </PanelText>
        </div>
      </PanelSection>
    </div>
  );
}

export { SystemStatusPanel, SystemStatusPanelLite };
