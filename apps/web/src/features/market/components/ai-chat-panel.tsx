"use client";

import { useState, useRef, useEffect } from "react";
import {
  Send,
  Bot,
  User,
  Sparkles,
  TrendingUp,
  AlertCircle,
  Newspaper,
  MessageCircle,
  Zap,
  FileText,
  Megaphone,
  BookOpen,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getLatestNews, type NewsItem } from "../data/mock-news";

// ============ Types ============
interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

type TabType = "news" | "chat";

// ============ News Tab ============
const NEWS_TYPE_CONFIG = {
  flash: { icon: Zap, label: "快讯", color: "text-amber-500" },
  news: { icon: Newspaper, label: "新闻", color: "text-blue-500" },
  announcement: { icon: Megaphone, label: "公告", color: "text-purple-500" },
  research: { icon: BookOpen, label: "研报", color: "text-green-500" },
};

function NewsTab() {
  const news = getLatestNews(12);

  return (
    <div className="flex-1 overflow-y-auto">
      {news.map((item, idx) => (
        <NewsItemRow key={item.id} item={item} isLast={idx === news.length - 1} />
      ))}
    </div>
  );
}

function NewsItemRow({ item, isLast }: { item: NewsItem; isLast: boolean }) {
  const config = NEWS_TYPE_CONFIG[item.type];

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={`${config.label}: ${item.title}`}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          // TODO: handle news item click
        }
      }}
      className={cn(
        "px-3 py-2.5 hover:bg-mine-bg/50 cursor-pointer transition-colors",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-mine-accent-teal/50 focus-visible:ring-inset",
        !isLast && "border-b border-mine-border/30"
      )}
    >
      {/* Time + Type */}
      <div className="flex items-center gap-2 mb-1">
        <span className="text-[10px] text-mine-muted font-mono tabular-nums">{item.time}</span>
        <span className={cn("flex items-center gap-0.5 text-[10px]", config.color)}>
          <config.icon className="w-3 h-3" />
          {config.label}
        </span>
        {item.importance === "high" && (
          <span className="px-1 py-0.5 rounded text-[9px] font-medium bg-market-up-medium/10 text-market-up-medium">
            重要
          </span>
        )}
      </div>

      {/* Title */}
      <p className="text-xs text-mine-text leading-relaxed line-clamp-2">
        {item.title}
      </p>

      {/* Tags + Source */}
      <div className="flex items-center gap-2 mt-1.5">
        {item.tags?.slice(0, 2).map((tag) => (
          <span
            key={tag}
            className="px-1.5 py-0.5 rounded text-[9px] bg-mine-accent-teal/10 text-mine-accent-teal"
          >
            {tag}
          </span>
        ))}
        <span className="text-[10px] text-mine-muted ml-auto">{item.source}</span>
      </div>

      {/* Related stocks */}
      {item.stocks && item.stocks.length > 0 && (
        <div className="flex items-center gap-1 mt-1">
          <span className="text-[9px] text-mine-muted">相关:</span>
          {item.stocks.map((stock) => (
            <span
              key={stock}
              className="text-[10px] text-market-up-medium cursor-pointer hover:underline"
            >
              {stock}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

// ============ Chat Tab ============
const QUICK_PROMPTS = [
  { icon: TrendingUp, text: "今日市场怎么样?" },
  { icon: Sparkles, text: "哪些板块值得关注?" },
  { icon: AlertCircle, text: "有什么风险提示?" },
];

const MOCK_RESPONSES: Record<string, string> = {
  "今日市场怎么样?": `📊 **今日市场概览**

大盘呈现普涨格局，上证指数上涨1.21%，创业板涨幅更大达2.14%。

**亮点：**
• 涨停47家，封板率83%
• AI算力、华为概念领涨
• 北向资金净流入超50亿

**注意：**
• 房地产、煤炭板块走弱`,

  "哪些板块值得关注?": `🔥 **今日热门板块**

1. **AI算力** +5.82%
   龙头：中科曙光

2. **华为概念** +4.56%
   龙头：润和软件

3. **机器人** +3.89%
   龙头：汇川技术`,

  "有什么风险提示?": `⚠️ **风险提示**

1. AI算力连涨多日，注意回调
2. 今日12只跌停
3. 炸板率17%，追涨需谨慎`,
};

function ChatTab() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "👋 你好！我是市场分析助手，有什么想了解的？",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = (text?: string) => {
    const messageText = text || input.trim();
    if (!messageText) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: messageText,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      const response =
        MOCK_RESPONSES[messageText] ||
        `基于当前市场数据：
• 大盘整体偏强
• 热点在科技成长
• 资金面相对宽松`;

      const assistantMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: response,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMsg]);
      setIsTyping(false);
    }, 600);
  };

  return (
    <>
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3 min-h-0">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={cn("flex gap-2", msg.role === "user" && "flex-row-reverse")}
          >
            <div
              className={cn(
                "w-5 h-5 rounded-full flex items-center justify-center shrink-0",
                msg.role === "assistant" ? "bg-mine-accent-teal/10" : "bg-mine-muted/10"
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
                "max-w-[190px] px-2.5 py-1.5 rounded-xl text-[11px] leading-relaxed",
                msg.role === "assistant"
                  ? "bg-mine-bg text-mine-text"
                  : "bg-mine-accent-teal text-white"
              )}
            >
              <div className="whitespace-pre-wrap">{msg.content}</div>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex gap-2">
            <div className="w-5 h-5 rounded-full bg-mine-accent-teal/10 flex items-center justify-center">
              <Bot className="w-3 h-3 text-mine-accent-teal" />
            </div>
            <div className="bg-mine-bg px-2.5 py-1.5 rounded-xl">
              <div className="flex gap-1">
                <span className="w-1 h-1 bg-mine-muted rounded-full animate-bounce motion-reduce:animate-none" />
                <span className="w-1 h-1 bg-mine-muted rounded-full animate-bounce motion-reduce:animate-none [animation-delay:0.1s]" />
                <span className="w-1 h-1 bg-mine-muted rounded-full animate-bounce motion-reduce:animate-none [animation-delay:0.2s]" />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick prompts */}
      <div className="px-2 py-1.5 border-t border-mine-border/30">
        <div className="flex flex-wrap gap-1">
          {QUICK_PROMPTS.map((prompt) => (
            <button
              key={prompt.text}
              onClick={() => handleSend(prompt.text)}
              aria-label={`快捷提问: ${prompt.text}`}
              className="flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-mine-bg text-[9px] text-mine-muted hover:bg-mine-accent-teal/10 hover:text-mine-accent-teal transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-mine-accent-teal/50"
            >
              <prompt.icon className="w-2.5 h-2.5" />
              {prompt.text}
            </button>
          ))}
        </div>
      </div>

      {/* Input */}
      <div className="px-2 py-2 border-t border-mine-border/50">
        <div className="flex items-center gap-1.5">
          <input
            type="text"
            name="chat-input"
            autoComplete="off"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="问我任何问题..."
            aria-label="输入问题"
            className="flex-1 bg-mine-bg rounded-lg px-2.5 py-1.5 text-[11px] text-mine-text placeholder:text-mine-muted outline-none focus:ring-1 focus:ring-mine-accent-teal/30"
          />
          <Button
            size="icon"
            aria-label="发送消息"
            className="w-6 h-6 rounded-lg bg-mine-accent-teal hover:bg-mine-accent-teal/90"
            onClick={() => handleSend()}
            disabled={!input.trim()}
          >
            <Send className="w-3 h-3" />
          </Button>
        </div>
      </div>
    </>
  );
}

// ============ Main Panel ============
export function AiChatPanel() {
  const [activeTab, setActiveTab] = useState<TabType>("news");

  return (
    <div className="w-[280px] flex flex-col rounded-xl bg-white shadow-sm border border-mine-border overflow-hidden">
      {/* Tab Header */}
      <div className="flex border-b border-mine-border/50">
        <button
          onClick={() => setActiveTab("news")}
          aria-selected={activeTab === "news"}
          role="tab"
          className={cn(
            "flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 text-xs font-medium transition-colors",
            "focus:outline-none focus-visible:ring-2 focus-visible:ring-mine-accent-teal/50 focus-visible:ring-inset",
            activeTab === "news"
              ? "text-mine-accent-teal border-b-2 border-mine-accent-teal bg-mine-accent-teal/5"
              : "text-mine-muted hover:text-mine-text hover:bg-mine-bg/50"
          )}
        >
          <Newspaper className="w-3.5 h-3.5" />
          新闻流
        </button>
        <button
          onClick={() => setActiveTab("chat")}
          aria-selected={activeTab === "chat"}
          role="tab"
          className={cn(
            "flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 text-xs font-medium transition-colors",
            "focus:outline-none focus-visible:ring-2 focus-visible:ring-mine-accent-teal/50 focus-visible:ring-inset",
            activeTab === "chat"
              ? "text-mine-accent-teal border-b-2 border-mine-accent-teal bg-mine-accent-teal/5"
              : "text-mine-muted hover:text-mine-text hover:bg-mine-bg/50"
          )}
        >
          <MessageCircle className="w-3.5 h-3.5" />
          AI 助手
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === "news" ? <NewsTab /> : <ChatTab />}
    </div>
  );
}
