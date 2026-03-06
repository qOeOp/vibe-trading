import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { SourceBlock } from './source-block';
import type { Factor } from '@/features/library/types';

// ═══════════════════════════════════════════════════════════════
// 覆盖矩阵: SourceBlock
// ═══════════════════════════════════════════════════════════════
// | #   | 场景             | 验收标准                          | 测试用例                                  | 类型     |
// |-----|------------------|-----------------------------------|-------------------------------------------|----------|
// | S-1 | 文件路径渲染     | 显示 factor.workspacePath          | 渲染完整文件路径文本                       | Unit     |
// | S-2 | 文件路径渲染     | 路径用 monospace 字体              | 路径元素具备 font-mono class              | Unit     |
// | S-3 | 长路径截断       | 单行截断 + ellipsis                | 超长路径容器有 truncate class             | Unit     |
// | S-4 | 路径 Tooltip     | hover 时显示完整路径               | 元素具有 title 属性包含完整路径            | Unit     |
// | S-5 | 跳转按钮存在     | 右侧有跳转 icon 按钮              | 渲染 ExternalLink 按钮                    | Unit     |
// | S-6 | 跳转按钮点击     | 点击触发导航 (stub)                | 点击按钮调用跳转回调                       | Integ    |
// | S-7 | FileCode icon    | 左侧显示文件 icon                 | 渲染 FileCode icon                        | Unit     |
// | S-8 | data-slot        | 组件有 data-slot="source-block"    | data-slot 属性正确设置                     | Unit     |
// | S-9 | className 合并   | 外部 className 被合并到容器        | 传入自定义 className 能生效               | Unit     |
// | S-10| 空路径边界       | workspacePath 为空字符串时不崩溃    | 空 workspacePath 正常渲染                 | Edge     |
// ═══════════════════════════════════════════════════════════════

/** Minimal Factor mock — only fields SourceBlock actually uses */
function createMockFactor(overrides: Partial<Factor> = {}): Factor {
  return {
    id: 'test-factor-1',
    name: 'Vol Adj Momentum',
    version: '1.0.0',
    category: '动能',
    factorType: 'leaf',
    expectedDirection: 'positive',
    source: 'manual',
    status: 'INCUBATING',
    ic: 0.035,
    ir: 1.2,
    icTstat: 2.5,
    turnover: 45,
    capacity: 500000,
    createdAt: '2026-01-15T10:00:00Z',
    createdBy: 'Vincent',
    tags: ['动量', '波动率'],
    icTrend: [],
    winRate: 58,
    ic60d: 0.03,
    ic120d: 0.028,
    quantileReturns: [0.02, 0.01, 0, -0.01, -0.02],
    icTimeSeries: [],
    benchmarkConfig: {
      universe: '全A',
      icMethod: 'RankIC',
      winsorization: 'MAD',
      rebalanceDays: 5,
      quantiles: 5,
    },
    icDistribution: {
      icMean: 0.035,
      icStd: 0.02,
      icPositiveCount: 140,
      icNegativeCount: 100,
      icSignificantRatio: 0.6,
      icPositiveSignificantRatio: 0.4,
      icNegativeSignificantRatio: 0.2,
      icPValue: 0.001,
      icSkewness: 0.1,
      icKurtosis: -0.2,
    },
    icDecayProfile: [],
    universeProfile: [],
    rankTestRetention: 0.85,
    binaryTestRetention: 0.72,
    vScore: 1.5,
    icHalfLife: 8,
    coverageRate: 0.95,
    longShortReturn: 12.5,
    longShortEquityCurve: [],
    longSideReturnRatio: 0.65,
    icHistogramBins: [],
    quantileCumulativeReturns: [[], [], [], [], []],
    icMonthlyHeatmap: [],
    icByIndustry: [],
    rankAutoCorrelation: [],
    quantileTurnover: { top: [], bottom: [] },
    statusHistory: [],
    workspacePath: 'factors/vol_adj_momentum/factor.py',
    hypothesis: '经波动率调整的20日动量因子。',
    ...overrides,
  } as Factor;
}

describe('SourceBlock', () => {
  describe('文件路径渲染', () => {
    it('renders the full workspace path from factor.workspacePath', () => {
      const factor = createMockFactor({
        workspacePath: 'factors/vol_adj_momentum/factor.py',
      });
      render(<SourceBlock factor={factor} />);
      expect(
        screen.getByText('factors/vol_adj_momentum/factor.py'),
      ).toBeInTheDocument();
    });

    it('renders the path in monospace font', () => {
      const factor = createMockFactor();
      render(<SourceBlock factor={factor} />);
      const pathEl = screen.getByText(factor.workspacePath);
      expect(pathEl.className).toMatch(/font-mono/);
    });

    it('truncates long paths with ellipsis (truncate class)', () => {
      const factor = createMockFactor({
        workspacePath:
          'factors/very/deeply/nested/directory/structure/with/long/name/factor.py',
      });
      render(<SourceBlock factor={factor} />);
      const pathEl = screen.getByText(factor.workspacePath);
      expect(pathEl.className).toMatch(/truncate/);
    });

    it('shows full path as tooltip on hover', () => {
      const path = 'factors/deeply/nested/long_name/factor.py';
      const factor = createMockFactor({ workspacePath: path });
      render(<SourceBlock factor={factor} />);
      const pathEl = screen.getByText(path);
      expect(pathEl).toHaveAttribute('title', path);
    });
  });

  describe('跳转按钮', () => {
    it('renders an ExternalLink jump button', () => {
      const factor = createMockFactor();
      render(<SourceBlock factor={factor} />);
      const btn = screen.getByTitle('在 Lab 中打开');
      expect(btn).toBeInTheDocument();
      expect(btn.tagName).toBe('BUTTON');
    });

    it('calls navigation handler when jump button is clicked', () => {
      const handler = vi.fn();
      const factor = createMockFactor({
        workspacePath: 'factors/my_factor/factor.py',
      });
      render(<SourceBlock factor={factor} onNavigateToLab={handler} />);
      fireEvent.click(screen.getByTitle('在 Lab 中打开'));
      expect(handler).toHaveBeenCalledOnce();
      expect(handler).toHaveBeenCalledWith('factors/my_factor/factor.py');
    });
  });

  describe('图标与结构', () => {
    it('renders a FileCode icon on the left', () => {
      const factor = createMockFactor();
      const { container } = render(<SourceBlock factor={factor} />);
      // Lucide renders SVG — the FileCode icon is the first child SVG
      const svgs = container.querySelectorAll('svg');
      // Should have at least 2 SVGs: FileCode + ExternalLink
      expect(svgs.length).toBeGreaterThanOrEqual(2);
    });

    it('has data-slot="source-block" attribute', () => {
      const factor = createMockFactor();
      const { container } = render(<SourceBlock factor={factor} />);
      const el = container.querySelector('[data-slot="source-block"]');
      expect(el).toBeInTheDocument();
    });

    it('merges external className with cn()', () => {
      const factor = createMockFactor();
      const { container } = render(
        <SourceBlock factor={factor} className="mt-4" />,
      );
      const el = container.querySelector('[data-slot="source-block"]');
      expect(el?.className).toMatch(/mt-4/);
    });
  });

  describe('边界情况', () => {
    it('renders gracefully when workspacePath is empty string', () => {
      const factor = createMockFactor({ workspacePath: '' });
      const { container } = render(<SourceBlock factor={factor} />);
      const el = container.querySelector('[data-slot="source-block"]');
      expect(el).toBeInTheDocument();
    });
  });
});
