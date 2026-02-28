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
import { PanelSection, PanelText, usePanelV2 } from '../../panel-primitives';

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

// ─── Sub-components (shared) ─────────────────────────────

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
          <PanelText variant="content">{label}</PanelText>
        </div>
        <PanelText variant="mono" className="text-mine-muted">
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
        <PanelText variant="sub" className="font-mono">
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
        <PanelText variant="content">{label}</PanelText>
      </div>
      <PanelText variant="sub" className="font-mono">
        {value}
      </PanelText>
    </div>
  );
}

// ─── V2 (primitives) ────────────────────────────────────

function SystemStatusPanelV2() {
  const data = useUsageStats();
  const connectionStatus = useAtomValue(connectionStatusAtom);
  const aiEnabled = useAtomValue(aiEnabledAtom);
  const ai = useAtomValue(aiAtom);
  const [config] = useResolvedMarimoConfig();
  const [isV2, toggleV2] = usePanelV2('system-status');

  const isHealthy = connectionStatus === 'healthy';

  return (
    <div data-slot="system-status-panel" className="flex flex-col">
      {/* V2 toggle in first section */}
      <PanelSection
        title="Resources"
        titleRight={
          <button
            type="button"
            onClick={toggleV2}
            className="text-mine-accent-teal hover:text-mine-accent-teal/80 p-0.5 rounded transition-colors"
            title="Switch to v1 (old)"
          >
            <span className="text-[8px] font-mono">v1</span>
          </button>
        }
      >
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
                  <PanelText variant="sub">Kernel</PanelText>
                  <PanelText variant="sub" className="font-mono tabular-nums">
                    {formatBytes(data.kernel.memory)}
                  </PanelText>
                </div>
              )}
              {data.server?.memory && (
                <div className="flex items-center justify-between pl-5">
                  <PanelText variant="sub">Server</PanelText>
                  <PanelText variant="sub" className="font-mono tabular-nums">
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
            <PanelText variant="sub">Waiting for data...</PanelText>
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
              <PanelText variant="content">Kernel</PanelText>
            </div>
            <div className="flex items-center gap-1.5">
              <StatusDot ok={isHealthy} />
              <PanelText variant="sub" className="capitalize">
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
              <PanelText variant="content">AI</PanelText>
            </div>
            <div className="flex items-center gap-1.5">
              <StatusDot ok={aiEnabled} />
              <PanelText variant="sub" className="font-mono">
                {aiEnabled ? (ai?.open_ai?.model ?? 'enabled') : 'disabled'}
              </PanelText>
            </div>
          </div>
        </div>
      </PanelSection>
    </div>
  );
}

// ─── V1 (original) ──────────────────────────────────────

function StatusSectionV1({
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

function SystemStatusPanelV1() {
  const data = useUsageStats();
  const connectionStatus = useAtomValue(connectionStatusAtom);
  const aiEnabled = useAtomValue(aiEnabledAtom);
  const ai = useAtomValue(aiAtom);
  const [config] = useResolvedMarimoConfig();
  const [, toggleV2] = usePanelV2('system-status');

  const isHealthy = connectionStatus === 'healthy';

  return (
    <div data-slot="system-status-panel" className="flex flex-col">
      <StatusSectionV1 title="Resources">
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-end">
            <button
              type="button"
              onClick={toggleV2}
              className="text-mine-muted/40 hover:text-mine-muted p-0.5 rounded transition-colors"
              title="Switch to v2 (new)"
            >
              <span className="text-[8px] font-mono">v2</span>
            </button>
          </div>
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
            <span className="text-xs text-mine-muted">Waiting for data...</span>
          )}
        </div>
      </StatusSectionV1>

      <StatusSectionV1 title="Connection">
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
      </StatusSectionV1>

      <StatusSectionV1 title="Runtime">
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
      </StatusSectionV1>

      <StatusSectionV1 title="Services">
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
      </StatusSectionV1>
    </div>
  );
}

// ─── Switch ─────────────────────────────────────────────

function SystemStatusPanel() {
  const [isV2] = usePanelV2('system-status');
  return isV2 ? <SystemStatusPanelV2 /> : <SystemStatusPanelV1 />;
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
          <PanelText variant="content" className="text-mine-muted">
            Disconnected
          </PanelText>
        </div>
      </PanelSection>
    </div>
  );
}

export { SystemStatusPanel, SystemStatusPanelLite };
