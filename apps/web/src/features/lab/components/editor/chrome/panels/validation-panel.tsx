/* VT Factor Validation Panel — integrated into Marimo sidebar */

import React, { useState } from 'react';
import { FlaskConicalIcon } from 'lucide-react';
import { PanelEmptyState } from './empty-state';
import { StepICStats } from '../../../results/step-ic-stats';
import { StepQuantileReturns } from '../../../results/step-quantile-returns';
import { StepICDecay } from '../../../results/step-ic-decay';
import { StepOrthogonality } from '../../../results/step-orthogonality';
import { StepConditionalIC } from '../../../results/step-conditional-ic';
import { StepAttribution } from '../../../results/step-attribution';
import { StepTurnover } from '../../../results/step-turnover';
import { StepOperations } from '../../../results/step-operations';
import type { ValidationResult } from '../../../../types';
import { useValidationResult } from '../../../../store/use-validation-store';

const STEPS = [
  { key: 'ic-stats', label: 'IC 统计' },
  { key: 'quantile', label: '分组收益' },
  { key: 'ic-decay', label: 'IC 衰减' },
  { key: 'orthogonality', label: '正交检验' },
  { key: 'conditional-ic', label: '条件 IC' },
  { key: 'attribution', label: '归因分析' },
  { key: 'turnover', label: '换手成本' },
] as const;

type StepKey = (typeof STEPS)[number]['key'];

function StepContent({
  stepKey,
  result,
}: {
  stepKey: StepKey;
  result: ValidationResult;
}) {
  switch (stepKey) {
    case 'ic-stats':
      return <StepICStats icStats={result.icStats} />;
    case 'quantile':
      return <StepQuantileReturns quantileReturns={result.quantileReturns} />;
    case 'ic-decay':
      return <StepICDecay icDecay={result.icDecay} />;
    case 'orthogonality':
      return <StepOrthogonality orthogonality={result.orthogonality} />;
    case 'conditional-ic':
      return <StepConditionalIC conditionalIC={result.conditionalIC} />;
    case 'attribution':
      return <StepAttribution attribution={result.attribution} />;
    case 'turnover':
      return (
        <StepTurnover
          turnover={result.turnover}
          grossIC={result.icStats.icMean}
        />
      );
    default:
      return null;
  }
}

const ValidationPanel: React.FC = () => {
  const result = useValidationResult();
  const [activeStep, setActiveStep] = useState<StepKey>('ic-stats');

  if (!result) {
    return (
      <PanelEmptyState
        title="无验证结果"
        description="在 notebook 中运行因子验证代码后，结果将在此显示。"
        icon={<FlaskConicalIcon />}
      />
    );
  }

  return (
    <div data-slot="validation-panel" className="flex flex-col h-full">
      {/* Step tabs */}
      <div className="flex gap-1 px-2 py-1.5 border-b overflow-x-auto shrink-0">
        {STEPS.map((step) => (
          <button
            key={step.key}
            type="button"
            onClick={() => setActiveStep(step.key)}
            className={`px-2 py-1 text-[11px] rounded-md whitespace-nowrap transition-colors ${
              activeStep === step.key
                ? 'bg-muted font-medium text-foreground'
                : 'text-muted-foreground hover:bg-muted/50'
            }`}
          >
            {step.label}
          </button>
        ))}
      </div>

      {/* Step content */}
      <div className="flex-1 overflow-auto p-3">
        <StepContent stepKey={activeStep} result={result} />
      </div>

      {/* Operations footer */}
      <div className="border-t px-3 shrink-0">
        <StepOperations verdict={result.verdict} />
      </div>
    </div>
  );
};

export default ValidationPanel;
