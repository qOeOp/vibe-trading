"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import {
  Send,
  Bot,
  User,
  Sparkles,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useLabCellStore } from "@/features/lab/store/use-lab-cell-store";

// ─── Quick Prompt Pills — 4 Categories ──────────────────

interface PromptCategory {
  label: string;
  prompts: string[];
}

const PROMPT_CATEGORIES: PromptCategory[] = [
  {
    label: "因子构建",
    prompts: [
      "解释这个因子的经济学逻辑",
      "检查是否有前视偏差",
      "推荐类似因子变体",
      "帮我简化表达式",
      "数据频率和对齐建议",
    ],
  },
  {
    label: "检验分析",
    prompts: [
      "IC 0.03 在 A 股算什么水平?",
      "分位收益不单调怎么办?",
      "IC 衰减太快说明什么?",
      "如何提高 IR?",
      "覆盖率偏低的原因",
    ],
  },
  {
    label: "代码调试",
    prompts: [
      "这段表达式有语法错误吗?",
      "如何处理 NaN 和 inf?",
      "优化计算性能",
      "横截面 vs 时序操作区别",
    ],
  },
  {
    label: "研究参考",
    prompts: [
      "推荐相关学术论文",
      "这个因子的行业暴露如何?",
      "与 Barra 因子的相关性",
      "因子拥挤度分析方法",
      "A 股特有的因子陷阱",
    ],
  },
];

// ─── Context-Aware Mock Responses ────────────────────────

const MOCK_RESPONSES: [RegExp, string[]][] = [
  [
    /经济学|逻辑|假设/,
    [
      "量价相关性因子的经济学逻辑：当成交量放大伴随价格上涨时，反映市场情绪过度乐观。历史数据显示这种同步走高后存在均值回归效应。\n\n参考：Chordia & Subrahmanyam (2004) 的研究表明，成交量异常与未来短期收益呈负相关。",
      "因子的经济学假设是因子有效性的根基。建议从以下三个角度检验假设的合理性：\n1. 行为金融解释（投资者非理性）\n2. 风险补偿解释（承担了某种系统性风险）\n3. 制度摩擦解释（交易限制导致定价偏差）",
    ],
  ],
  [
    /前视|偏差|look.?ahead/i,
    [
      "检查前视偏差的关键点：\n1. 数据是否使用了报告日而非公告日？财报数据需要用 announce_date 对齐\n2. 因子计算是否用了未来数据？如 ts_corr 的窗口起点\n3. 股票池筛选是否用了事后信息？如用当前成分股回测历史\n\n建议：在 helpers.py 中加入数据延迟验证函数。",
    ],
  ],
  [
    /IC|ir|0\.03|水平/i,
    [
      "IC=0.03 在 A 股全市场的参考水平：\n- IC > 0.05：优秀（前 10% 因子）\n- IC 0.03~0.05：良好（可入库候选）\n- IC 0.02~0.03：一般（需结合其他指标）\n- IC < 0.02：偏弱\n\nIR（IC/IC标准差）比绝对 IC 更重要。IR > 0.5 表示因子信号稳定。建议关注 IC 的月度分布是否有明显的尾部异常。",
      "A 股市场的 IC 基准取决于股票池：\n- 全 A（4000+股）：IC > 0.03 即可\n- 沪深300：因子拥挤度高，IC > 0.025 已属不错\n- 中证1000：小票效应强，IC > 0.04 较理想\n\nt 统计量 > 2.0 是标准门槛，但实际操作中 t > 2.5 更安全。",
    ],
  ],
  [
    /单调|分位|不单调/,
    [
      "分位收益不单调的常见原因：\n1. 因子方向错误 — 尝试取负值\n2. 非线性效应 — 极端值组（Q1/Q5）有效但中间组混乱\n3. 行业偏差 — 因子本质是行业暴露的代理\n4. 样本量不足 — 某些分组股票数偏少\n\n解决方案：先做行业中性化，再检查分位组的行业分布是否均匀。",
    ],
  ],
  [
    /衰减|decay|半衰期/,
    [
      "IC 衰减曲线的诊断要点：\n- 半衰期 < 3 天：高频因子，换手成本可能吞噬收益\n- 半衰期 5~10 天：中频因子，适合周度调仓\n- 半衰期 > 20 天：低频因子，月度调仓即可\n\n如果衰减太快但 IC 很高，考虑降低调仓频率或加入换手约束。衰减曲线应平滑下降，如果出现跳变可能是数据问题。",
    ],
  ],
  [
    /NaN|inf|缺失|空值/,
    [
      "处理 NaN/Inf 的最佳实践：\n```python\n# 1. 先诊断缺失模式\nprint(df.isnull().sum() / len(df))\n\n# 2. Inf 转 NaN\ndf = df.replace([np.inf, -np.inf], np.nan)\n\n# 3. 行业内中位数填充\ndf['factor'] = df.groupby('industry')['factor'].transform(\n    lambda x: x.fillna(x.median())\n)\n```\n\n注意：不要用 0 填充因子值，这会引入人为的中性偏差。",
    ],
  ],
  [
    /性能|优化|加速|慢/,
    [
      "因子计算性能优化建议：\n1. 向量化替代循环 — 用 pandas rolling/groupby 而非 for loop\n2. NumPy 广播 — 避免逐行操作\n3. 预计算中间变量 — 多次使用的 ts_corr 缓存结果\n4. 减少数据类型精度 — float64 → float32\n\n你的 main.py 中 compute_factor 看起来已经是向量化的，性能应该不错。如果数据量超过 100 万行，考虑用 polars 替代 pandas。",
    ],
  ],
  [
    /论文|参考|文献|学术/,
    [
      "量价因子相关经典文献：\n1. Chordia & Subrahmanyam (2004) - 成交量与横截面收益\n2. Grinblatt & Han (2005) - 处置效应与动量\n3. Hou & Moskowitz (2005) - 市场摩擦与价格延迟\n4. Amihud (2002) - 非流动性与预期收益\n\nA 股特色研究：\n- 刘俏等 (2019) - A 股因子动物园\n- 方正金工团队 - 量价因子系列报告",
    ],
  ],
  [
    /Barra|风格|暴露|相关性/,
    [
      "因子与 Barra 风格因子的关系分析：\n\n量价相关性因子通常与以下 Barra 因子有相关性：\n- Momentum：中等正相关（~0.15-0.25）\n- Liquidity：较强正相关（~0.20-0.35）\n- Volatility：弱正相关（~0.05-0.15）\n\n如果正交检验显示与这些因子相关性 > 0.25，建议：\n1. 做因子中性化（在 helpers.py 中加回归剔除）\n2. 检查残差 IC 是否仍然显著\n3. 关注 alpha IC（纯独立贡献部分）",
    ],
  ],
  [
    /拥挤|crowding/i,
    [
      "因子拥挤度分析方法：\n1. 配对相关性：同类因子间的平均相关系数是否在上升\n2. 换手率集中度：因子推荐的股票池换手率是否异常\n3. 估值维度：因子选中的股票是否估值过高\n4. 资金流向：北向资金是否持续增配因子暴露\n\n简单的拥挤度指标：\n```python\ncrowding = rank_corr(your_factor, market_consensus_factor)\n```\n如果 > 0.6，该因子可能已经拥挤。",
    ],
  ],
  [
    /横截面|截面|时序|区别/,
    [
      "横截面 vs 时序操作的区别：\n\n横截面操作（cross-section）：在同一时间点对所有股票排序\n- rank()：截面排名（每天排一次）\n- zscore()：截面标准化\n\n时序操作（time-series）：对单只股票的历史序列计算\n- ts_corr()：时序相关性\n- ts_std()：时序标准差\n\n常见错误：把时序函数误用在截面上。例如 ts_corr(close, volume, 20) 是对每只股票分别计算 20 天窗口的量价相关性，然后 rank() 在截面上排序。",
    ],
  ],
  [
    /陷阱|A股|特有/,
    [
      "A 股特有的因子陷阱：\n1. T+1 限制：无法当日反转，短期反转因子实际 T+2 才能交易\n2. 涨跌停板：涨停板次日打开时的异常收益容易造成前视偏差\n3. ST/退市：需严格过滤，否则极端值扭曲因子\n4. 北向资金效应：外资持股集中的沪深300成分股有独特因子结构\n5. 打新收益污染：新股上市初期的超额收益会污染量化因子收益\n6. 市值断层：A 股小盘效应显著（但正在衰减），需要市值中性化",
    ],
  ],
];

const FALLBACK_RESPONSES = [
  "这个问题很好。让我从因子研究的角度来分析：因子的核心价值在于其经济学解释力和样本外预测能力。建议你先明确因子的理论基础，再看统计检验结果。",
  "基于你的因子表达式，我有几点建议：\n1. 确保数据对齐没有前视偏差\n2. 检查因子在不同市场环境下的稳定性\n3. 关注扣除交易成本后的净收益\n\n具体细节可以从 IC 衰减曲线和分位收益的单调性来判断。",
  "因子研究的一个重要原则：样本内的好结果不等于样本外有效。建议关注 IC 的时间序列稳定性（标准差要小）、在不同股票池的适用性、以及与已知因子的正交程度。",
];

function getMockResponse(query: string): string {
  for (const [pattern, responses] of MOCK_RESPONSES) {
    if (pattern.test(query)) {
      return responses[Math.floor(Math.random() * responses.length)];
    }
  }
  return FALLBACK_RESPONSES[Math.floor(Math.random() * FALLBACK_RESPONSES.length)];
}

// ─── AI Panel ───────────────────────────────────────────

export function LabAIPanel() {
  const messages = useLabCellStore((s) => s.aiMessages);
  const addMessage = useLabCellStore((s) => s.addAIMessage);

  const [input, setInput] = useState("");
  const [showAllPills, setShowAllPills] = useState(messages.length <= 2);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  const handleSend = useCallback(
    (text?: string) => {
      const content = (text ?? input).trim();
      if (!content) return;

      // Add user message
      addMessage({
        id: `user-${Date.now()}`,
        role: "user",
        content,
        timestamp: Date.now(),
      });

      // Mock assistant response — keyword-matched contextual reply
      setTimeout(() => {
        addMessage({
          id: `assistant-${Date.now()}`,
          role: "assistant",
          content: getMockResponse(content),
          timestamp: Date.now(),
        });
      }, 600 + Math.random() * 600);

      setInput("");
      // Reset textarea height
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }
    },
    [input, addMessage],
  );

  // Handle textarea key events: Enter=send, Shift+Enter=newline
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    },
    [handleSend],
  );

  // Auto-resize textarea
  const handleTextareaChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setInput(e.target.value);
      // Auto-resize: reset then set to scrollHeight
      const el = e.target;
      el.style.height = "auto";
      el.style.height = `${Math.min(el.scrollHeight, 80)}px`;
    },
    [],
  );

  // Determine which categories to show
  const visibleCategories = showAllPills
    ? PROMPT_CATEGORIES
    : PROMPT_CATEGORIES.slice(0, 2);

  return (
    <div
      data-slot="lab-ai-panel"
      className="h-full flex flex-col bg-white"
    >
      {/* Header */}
      <div className="flex items-center px-3 py-2 border-b border-mine-border/50 shrink-0">
        <Sparkles className="w-3.5 h-3.5 text-mine-accent-teal shrink-0" />
        <span className="text-xs font-medium text-mine-text ml-1.5">
          Alpha 因子顾问
        </span>
        <span className="ml-auto text-[9px] text-mine-muted/50">
          LLM 只做解读，不修改因子
        </span>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3 min-h-0">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={cn(
              "flex gap-2",
              msg.role === "user" && "flex-row-reverse",
            )}
          >
            <div
              className={cn(
                "w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5",
                msg.role === "assistant"
                  ? "bg-mine-accent-teal/10"
                  : "bg-mine-muted/10",
              )}
            >
              {msg.role === "assistant" ? (
                <Bot className="w-3 h-3 text-mine-accent-teal" />
              ) : (
                <User className="w-3 h-3 text-mine-muted" />
              )}
            </div>
            <div
              className={cn(
                "max-w-[85%] px-2.5 py-1.5 rounded-xl text-[11px] leading-relaxed",
                msg.role === "assistant"
                  ? "bg-mine-bg text-mine-text"
                  : "bg-mine-accent-teal text-white",
              )}
            >
              <div className="whitespace-pre-wrap">{msg.content}</div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompts — Categorized */}
      <div className="px-2 py-1.5 border-t border-mine-border/30 shrink-0 overflow-y-auto max-h-[180px]">
        <div className="space-y-2">
          {visibleCategories.map((cat) => (
            <div key={cat.label}>
              <span className="text-[9px] text-mine-muted uppercase tracking-wider font-medium px-1">
                {cat.label}
              </span>
              <div className="flex flex-wrap gap-1 mt-1">
                {cat.prompts.map((prompt) => (
                  <button
                    key={prompt}
                    type="button"
                    onClick={() => handleSend(prompt)}
                    className="px-1.5 py-0.5 rounded-md bg-mine-bg text-[9px] text-mine-muted hover:bg-mine-accent-teal/10 hover:text-mine-accent-teal transition-colors truncate max-w-[200px]"
                    title={prompt}
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
        {PROMPT_CATEGORIES.length > 2 && (
          <button
            type="button"
            onClick={() => setShowAllPills(!showAllPills)}
            className="flex items-center gap-0.5 mt-1.5 px-1 text-[9px] text-mine-muted/60 hover:text-mine-accent-teal transition-colors"
          >
            {showAllPills ? (
              <>
                <ChevronUp className="w-2.5 h-2.5" />
                收起
              </>
            ) : (
              <>
                <ChevronDown className="w-2.5 h-2.5" />
                展开更多
              </>
            )}
          </button>
        )}
      </div>

      {/* Input */}
      <div className="px-2 py-2 border-t border-mine-border/50 shrink-0">
        <div className="flex items-end gap-1.5">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={handleTextareaChange}
            onKeyDown={handleKeyDown}
            placeholder="描述你的因子问题..."
            rows={1}
            className="flex-1 bg-mine-bg rounded-lg px-2.5 py-1.5 text-[11px] text-mine-text placeholder:text-mine-muted outline-none focus:ring-1 focus:ring-mine-accent-teal/30 resize-none overflow-hidden min-h-[32px] max-h-[80px]"
          />
          <button
            type="button"
            onClick={() => handleSend()}
            disabled={!input.trim()}
            className="w-7 h-7 flex items-center justify-center rounded-lg bg-mine-accent-teal hover:bg-mine-accent-teal/90 text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors shrink-0"
          >
            <Send className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
}
