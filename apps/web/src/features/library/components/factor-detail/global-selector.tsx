'use client';

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { useLibraryStore } from '@/features/library/store/use-library-store';
import {
  UNIVERSE_POOLS,
  HORIZON_KEYS,
  HORIZON_LABELS,
  getConfigKey,
  type UniversePool,
  type HorizonKey,
  type Factor,
  type ComputeStatus,
} from '@/features/library/types';
import { getBestPool } from '@/features/library/utils/get-best-pool';

// ─── Status Dot ──────────────────────────────────────────

function StatusDot({
  status,
  isBest,
}: {
  status?: ComputeStatus;
  isBest: boolean;
}) {
  if (isBest) {
    return (
      <span
        data-slot="best-dot"
        className="ml-0.5 inline-block h-1 w-1 rounded-full bg-mine-accent-teal"
      />
    );
  }
  if (status === 'loading') {
    return (
      <span
        data-slot="loading-dot"
        className="ml-0.5 inline-block h-1 w-1 animate-pulse rounded-full bg-mine-accent-yellow"
      />
    );
  }
  if (status === 'error') {
    return (
      <span
        data-slot="error-dot"
        className="ml-0.5 inline-block h-1 w-1 rounded-full bg-mine-accent-red"
      />
    );
  }
  return null;
}

// ─── Global Selector ─────────────────────────────────────

interface GlobalSelectorProps extends React.ComponentProps<'div'> {
  factor: Factor;
}

export function GlobalSelector({
  factor,
  className,
  ...props
}: GlobalSelectorProps) {
  const selectedPool = useLibraryStore((s) => s.selectedPool);
  const selectedHorizon = useLibraryStore((s) => s.selectedHorizon);
  const setPool = useLibraryStore((s) => s.setPool);
  const setHorizon = useLibraryStore((s) => s.setHorizon);

  const bestPool = getBestPool(factor.universeProfile);

  return (
    <div
      data-slot="global-selector"
      className={cn(
        'sticky top-0 z-10 space-y-1.5 border-b border-mine-border bg-white px-4 pt-2.5 pb-1.5',
        className,
      )}
      {...props}
    >
      {/* Pool Tabs */}
      <div className="space-y-1">
        <span className="text-[9px] font-semibold tracking-wider text-mine-muted uppercase">
          Stock Pool
        </span>
        <Tabs
          value={selectedPool}
          onValueChange={(v) => setPool(v as UniversePool)}
        >
          <TabsList className="w-full">
            {UNIVERSE_POOLS.map((pool) => {
              const key = getConfigKey(pool, selectedHorizon);
              const sliceStatus = factor.configStatus?.[key];
              const worstStatus = getWorstStatus(sliceStatus);
              const isBest = pool === bestPool;

              return (
                <TabsTrigger key={pool} value={pool} className="text-[10px]">
                  {pool}
                  <StatusDot
                    status={worstStatus}
                    isBest={isBest && pool !== selectedPool}
                  />
                </TabsTrigger>
              );
            })}
          </TabsList>
        </Tabs>
      </div>

      {/* Horizon Tabs */}
      <div className="space-y-1">
        <span className="text-[9px] font-semibold tracking-wider text-mine-muted uppercase">
          Horizon
        </span>
        <Tabs
          value={selectedHorizon}
          onValueChange={(v) => setHorizon(v as HorizonKey)}
        >
          <TabsList className="h-8 w-full">
            {HORIZON_KEYS.map((hz) => {
              const key = getConfigKey(selectedPool, hz);
              const sliceStatus = factor.configStatus?.[key];
              const worstStatus = getWorstStatus(sliceStatus);

              return (
                <TabsTrigger key={hz} value={hz} className="text-[10px]">
                  {HORIZON_LABELS[hz]}
                  {worstStatus && worstStatus !== 'ready' && (
                    <StatusDot status={worstStatus} isBest={false} />
                  )}
                </TabsTrigger>
              );
            })}
          </TabsList>
        </Tabs>
      </div>
    </div>
  );
}

// ─── Helpers ─────────────────────────────────────────────

/** Return the worst status between signal and portfolio (error > loading > ready) */
function getWorstStatus(sliceStatus?: {
  signalStatus: ComputeStatus;
  portfolioStatus: ComputeStatus;
}): ComputeStatus | undefined {
  if (!sliceStatus) return undefined;
  if (
    sliceStatus.signalStatus === 'error' ||
    sliceStatus.portfolioStatus === 'error'
  )
    return 'error';
  if (
    sliceStatus.signalStatus === 'loading' ||
    sliceStatus.portfolioStatus === 'loading'
  )
    return 'loading';
  return 'ready';
}
