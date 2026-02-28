'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { CreateTaskConfig, MiningMode } from '../types';

const MODE_OPTIONS: Array<{
  value: MiningMode;
  label: string;
  description: string;
}> = [
  {
    value: 'factor',
    label: '自主因子发现',
    description: '从零开始自动生成因子假设',
  },
  {
    value: 'factor_report',
    label: '研报因子提取',
    description: '从 PDF 研报中提取因子',
  },
  {
    value: 'quant',
    label: '联合优化',
    description: '因子 + 模型联合 Thompson Sampling',
  },
];

const LLM_OPTIONS = [
  { value: 'deepseek/deepseek-chat', label: 'DeepSeek-V3 (推荐)' },
  { value: 'gpt-4o', label: 'GPT-4o' },
  { value: 'claude-sonnet-4-6', label: 'Claude Sonnet 4.6' },
];

const DEFAULT_CONFIG: CreateTaskConfig = {
  mode: 'factor',
  maxLoops: 10,
  llmModel: 'deepseek/deepseek-chat',
  universe: 'csi300',
  dateRange: {
    // Matches ~/.qlib/qlib_data/cn_data coverage (2008-12-29 → 2020-09-25)
    trainStart: '2008-01-01',
    trainEnd: '2014-12-31',
    validStart: '2015-01-01',
    validEnd: '2016-12-31',
    testStart: '2017-01-01',
    testEnd: '2020-09-25',
  },
  dedupThreshold: 0.99, // deduplication similarity threshold — advanced parameter, not exposed in UI
};

interface NewTaskDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (config: CreateTaskConfig) => Promise<void>;
  className?: string;
}

function FormField({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-[10px] text-mine-muted uppercase tracking-wider font-medium">
        {label}
      </span>
      {children}
    </label>
  );
}

function TextInput({
  value,
  onChange,
  type = 'text',
}: {
  value: string | number;
  onChange: (v: string) => void;
  type?: React.HTMLInputTypeAttribute;
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={cn(
        'h-8 px-2.5 text-xs bg-mine-bg border border-mine-border rounded-md',
        'text-mine-text focus:outline-none focus:ring-1 focus:ring-mine-accent-teal',
        'font-mono tabular-nums',
      )}
    />
  );
}

export function NewTaskDialog({
  open,
  onClose,
  onSubmit,
  className,
  ...props
}: NewTaskDialogProps & Omit<React.ComponentProps<'div'>, 'onSubmit'>) {
  const [config, setConfig] = useState<CreateTaskConfig>(DEFAULT_CONFIG);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open) setConfig(DEFAULT_CONFIG);
  }, [open]);

  if (!open) return null;

  const handleSubmit = async () => {
    setSubmitting(true);
    setError(null);
    try {
      await onSubmit(config);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : '提交失败，请重试');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div
        data-slot="new-task-dialog"
        className={cn(
          'w-120 bg-white rounded-xl shadow-md border border-mine-border overflow-hidden',
          className,
        )}
        {...props}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-mine-border/50">
          <h2 className="text-sm font-semibold text-mine-text">新建挖掘任务</h2>
          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-mine-bg text-mine-muted hover:text-mine-text transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="px-4 py-4 space-y-4 max-h-[70vh] overflow-y-auto">
          {/* Mode selection */}
          <FormField label="挖掘模式">
            <div className="grid grid-cols-3 gap-2">
              {MODE_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setConfig((c) => ({ ...c, mode: opt.value }))}
                  className={cn(
                    'flex flex-col gap-1 px-2.5 py-2 rounded-lg border text-left transition-colors',
                    config.mode === opt.value
                      ? 'bg-mine-nav-active border-mine-nav-active text-white'
                      : 'bg-mine-bg border-mine-border hover:border-mine-nav-active/50',
                  )}
                >
                  <span
                    className={cn(
                      'text-xs font-medium',
                      config.mode === opt.value
                        ? 'text-white'
                        : 'text-mine-text',
                    )}
                  >
                    {opt.label}
                  </span>
                  <span
                    className={cn(
                      'text-[10px] leading-snug',
                      config.mode === opt.value
                        ? 'text-white/70'
                        : 'text-mine-muted',
                    )}
                  >
                    {opt.description}
                  </span>
                </button>
              ))}
            </div>
          </FormField>

          {/* LLM model */}
          <FormField label="LLM 模型">
            <select
              value={config.llmModel}
              onChange={(e) =>
                setConfig((c) => ({ ...c, llmModel: e.target.value }))
              }
              className={cn(
                'h-8 px-2.5 text-xs bg-mine-bg border border-mine-border rounded-md',
                'text-mine-text focus:outline-none focus:ring-1 focus:ring-mine-accent-teal',
              )}
            >
              {LLM_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </FormField>

          {/* Loops + universe */}
          <div className="grid grid-cols-2 gap-3">
            <FormField label="迭代轮数">
              <TextInput
                value={config.maxLoops}
                onChange={(v) =>
                  setConfig((c) => ({ ...c, maxLoops: parseInt(v) || 10 }))
                }
                type="number"
              />
            </FormField>
            <FormField label="股票池">
              <select
                value={config.universe}
                onChange={(e) =>
                  setConfig((c) => ({ ...c, universe: e.target.value }))
                }
                className={cn(
                  'h-8 px-2.5 text-xs bg-mine-bg border border-mine-border rounded-md',
                  'text-mine-text focus:outline-none focus:ring-1 focus:ring-mine-accent-teal',
                )}
              >
                <option value="csi300">沪深300</option>
                <option value="csi500">中证500</option>
                <option value="all">全 A 股</option>
              </select>
            </FormField>
          </div>

          {/* Date ranges */}
          <div className="space-y-2">
            <span className="text-[10px] text-mine-muted uppercase tracking-wider font-medium">
              日期范围
            </span>
            <div className="grid grid-cols-2 gap-2">
              <FormField label="训练开始">
                <TextInput
                  value={config.dateRange.trainStart}
                  onChange={(v) =>
                    setConfig((c) => ({
                      ...c,
                      dateRange: { ...c.dateRange, trainStart: v },
                    }))
                  }
                />
              </FormField>
              <FormField label="训练结束">
                <TextInput
                  value={config.dateRange.trainEnd}
                  onChange={(v) =>
                    setConfig((c) => ({
                      ...c,
                      dateRange: { ...c.dateRange, trainEnd: v },
                    }))
                  }
                />
              </FormField>
              <FormField label="验证开始">
                <TextInput
                  value={config.dateRange.validStart}
                  onChange={(v) =>
                    setConfig((c) => ({
                      ...c,
                      dateRange: { ...c.dateRange, validStart: v },
                    }))
                  }
                />
              </FormField>
              <FormField label="验证结束">
                <TextInput
                  value={config.dateRange.validEnd}
                  onChange={(v) =>
                    setConfig((c) => ({
                      ...c,
                      dateRange: { ...c.dateRange, validEnd: v },
                    }))
                  }
                />
              </FormField>
              <FormField label="测试开始">
                <TextInput
                  value={config.dateRange.testStart}
                  onChange={(v) =>
                    setConfig((c) => ({
                      ...c,
                      dateRange: { ...c.dateRange, testStart: v },
                    }))
                  }
                />
              </FormField>
              <FormField label="测试结束">
                <TextInput
                  value={config.dateRange.testEnd}
                  onChange={(v) =>
                    setConfig((c) => ({
                      ...c,
                      dateRange: { ...c.dateRange, testEnd: v },
                    }))
                  }
                />
              </FormField>
            </div>
          </div>
        </div>

        {/* Footer */}
        {error && (
          <p className="text-xs text-market-up-medium px-4 pb-2">{error}</p>
        )}
        <div className="flex items-center justify-end gap-2 px-4 py-3 border-t border-mine-border/50">
          <button
            onClick={onClose}
            className="px-3 py-1.5 text-xs text-mine-muted hover:text-mine-text rounded-lg hover:bg-mine-bg transition-colors"
          >
            取消
          </button>
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className={cn(
              'px-4 py-1.5 text-xs font-medium rounded-lg',
              'bg-mine-nav-active text-white hover:bg-mine-nav-active/90',
              'disabled:opacity-50 transition-colors',
            )}
          >
            {submitting ? '提交中...' : '开始挖掘'}
          </button>
        </div>
      </div>
    </div>
  );
}
