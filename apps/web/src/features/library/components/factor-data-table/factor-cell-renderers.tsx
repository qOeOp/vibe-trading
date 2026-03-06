import {
  CircleDot,
  CircleDashed,
  CirclePlay,
  CirclePause,
  CircleOff,
  Flame,
  TrendingUp,
  Gem,
  Sprout,
  Shield,
  Droplets,
  Activity,
  Ruler,
  Brain,
  Pickaxe,
  Cpu,
  Bot,
  Pen,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import type { Factor } from '@/features/library/types';
import { SOURCE_LABELS } from '@/features/library/types';
import type {
  FactorCategory,
  FactorLifecycleStatus,
  FactorSource,
} from '@/features/library/types';

// ─── Name Cell ──────────────────────────────────────────

export function NameCell({
  factor,
  showToolbar,
  toolbarNode,
}: {
  factor: Factor;
  showToolbar: boolean;
  toolbarNode?: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-2 min-w-0">
      <div className="flex flex-col min-w-0">
        <span className="text-sm font-medium text-foreground truncate">
          {factor.name}
        </span>
        <span className="text-xs text-muted-foreground font-mono truncate">
          {factor.version}
        </span>
      </div>
      {showToolbar && toolbarNode}
    </div>
  );
}

// ─── Category Badge (tablecn outline Badge + icon) ──────

/** Category → lucide icon mapping */
const CATEGORY_ICONS: Record<
  string,
  React.FC<React.SVGProps<SVGSVGElement>>
> = {
  动能: Flame,
  股息率: TrendingUp,
  价值: Gem,
  成长: Sprout,
  品质: Shield,
  流动性: Droplets,
  波动度: Activity,
  规模: Ruler,
  情绪: Brain,
};

export function CategoryBadge({ category }: { category: FactorCategory }) {
  const Icon = CATEGORY_ICONS[category];
  return (
    <Badge variant="outline" className="py-1 max-w-full">
      {Icon && <Icon />}
      <span className="capitalize truncate">{category}</span>
    </Badge>
  );
}

// ─── Status Badge (tablecn outline Badge + icon) ────────

/** Status → lucide icon mapping */
const STATUS_ICONS: Record<
  FactorLifecycleStatus,
  React.FC<React.SVGProps<SVGSVGElement>>
> = {
  INCUBATING: CircleDashed,
  PAPER_TEST: CircleDot,
  LIVE_ACTIVE: CirclePlay,
  PROBATION: CirclePause,
  RETIRED: CircleOff,
};

const STATUS_LABELS: Record<FactorLifecycleStatus, string> = {
  INCUBATING: 'INC',
  PAPER_TEST: 'PAPER',
  LIVE_ACTIVE: 'LIVE',
  PROBATION: 'PROB',
  RETIRED: 'RET',
};

export function StatusBadge({ status }: { status: FactorLifecycleStatus }) {
  const Icon = STATUS_ICONS[status];
  const label = STATUS_LABELS[status] ?? status;
  return (
    <Badge variant="outline" className="py-1 max-w-full">
      <Icon />
      <span className="capitalize truncate">{label}</span>
    </Badge>
  );
}

// ─── Source Badge (tablecn outline Badge + icon) ─────────

/** Source → lucide icon mapping */
const SOURCE_ICONS: Record<
  FactorSource,
  React.FC<React.SVGProps<SVGSVGElement>>
> = {
  manual: Pen,
  mining_gplearn: Pickaxe,
  mining_pysr: Cpu,
  mining_llm: Bot,
};

export function SourceBadge({ source }: { source: FactorSource }) {
  const Icon = SOURCE_ICONS[source];
  const label = SOURCE_LABELS[source] ?? source;
  return (
    <Badge variant="outline" className="py-1 max-w-full">
      {Icon && <Icon />}
      <span className="capitalize truncate">{label}</span>
    </Badge>
  );
}

// ─── Peak Cell (two-line: universe name + IC value) ─────

export function PeakCell({ factor }: { factor: Factor }) {
  const profile = factor.universeProfile;
  if (!profile || profile.length === 0) return null;

  const defaultPool = factor.benchmarkConfig.universe;
  const best = profile.reduce((a, b) =>
    Math.abs(b.ic) > Math.abs(a.ic) ? b : a,
  );

  if (best.universe === defaultPool) return null;

  const icStr = `${best.ic >= 0 ? '+' : ''}${best.ic.toFixed(3)}`;

  return (
    <div className="flex flex-col items-center gap-0 min-w-0">
      <span className="text-[11px] text-muted-foreground leading-tight truncate max-w-full">
        {best.universe}
      </span>
      <span
        className={`text-sm font-mono tabular-nums leading-tight ${
          best.ic >= 0 ? 'text-market-down-medium' : 'text-market-up-medium'
        }`}
      >
        {icStr}
      </span>
    </div>
  );
}
