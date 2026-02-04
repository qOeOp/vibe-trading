import { useState, useRef, useEffect, useCallback } from "react";

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

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

const INITIAL_MESSAGE: Message = {
  id: "welcome",
  role: "assistant",
  content: "👋 你好！我是市场分析助手，有什么想了解的？",
  timestamp: new Date(),
};

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = useCallback((text?: string) => {
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
  }, [input]);

  const clearMessages = useCallback(() => {
    setMessages([INITIAL_MESSAGE]);
  }, []);

  return {
    messages,
    input,
    setInput,
    isTyping,
    messagesEndRef,
    handleSend,
    clearMessages,
  };
}
