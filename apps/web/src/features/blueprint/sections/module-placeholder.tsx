'use client';

import type { BlueprintModule } from '../data/modules';
import { PHASE_COLOR } from '../data/modules';
import { Card, CardHeader, CardContent } from '@/components/ui/card';

interface ModulePlaceholderProps {
  module: BlueprintModule | undefined;
  tabIndex: number;
}

export function ModulePlaceholder({
  module,
  tabIndex,
}: ModulePlaceholderProps) {
  if (!module) return null;
  const pc = PHASE_COLOR[module.phase] || '#26a69a';
  const tabName = module.topbar[tabIndex] || module.topbar[0];
  const tabDesc = module.tabDescs?.[tabIndex] || '';

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center gap-2 px-1">
        <module.icon className="w-4 h-4" style={{ color: pc }} />
        <h2 className="font-semibold text-[15px] text-mine-text">
          {module.label}
        </h2>
        <span className="text-[11px] text-mine-muted">{module.workflow}</span>
      </div>

      <Card variant="frosted">
        <CardHeader title={tabName} subtitle={tabDesc} />
        <CardContent>
          <div className="flex-1 flex items-center justify-center py-10 px-6">
            <div className="text-center">
              <module.icon
                className="w-12 h-12 mx-auto mb-3 text-mine-border"
                strokeWidth={1}
              />
              <p className="font-medium mb-1 text-sm text-mine-muted">
                {tabName}
              </p>
              <p className="text-[11px] text-mine-border leading-[1.6] max-w-[300px] mx-auto">
                {tabDesc}
              </p>
              <span
                className="inline-block mt-3 font-mono px-2.5 py-1 rounded-lg text-[10px]"
                style={{ background: `${pc}10`, color: pc }}
              >
                {module.phase} · 待详细设计
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader
          title="Tab 概览"
          subtitle={`${module.label} 模块的 ${module.topbar.length} 个子页面`}
        />
        <CardContent className="px-3 pb-3 space-y-1.5">
          {module.topbar.map((tab, i) => (
            <div
              key={tab}
              className="flex items-start gap-3 p-2.5 rounded-lg cursor-default"
              style={{
                background: i === tabIndex ? `${pc}06` : 'var(--color-mine-bg)',
                border:
                  i === tabIndex
                    ? `1px solid ${pc}20`
                    : '1px solid transparent',
              }}
            >
              <span
                className="font-mono font-bold shrink-0 w-5 text-center text-[10px]"
                style={{
                  color: i === tabIndex ? pc : 'var(--color-mine-muted)',
                }}
              >
                {i + 1}
              </span>
              <div className="min-w-0">
                <span
                  className="font-semibold text-xs"
                  style={{
                    color: i === tabIndex ? pc : 'var(--color-mine-text)',
                  }}
                >
                  {tab}
                </span>
                <p className="text-[10px] text-mine-muted leading-[1.5] mt-0.5">
                  {module.tabDescs?.[i] || ''}
                </p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
