import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/dashboard/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { AIChatMessage } from "../components/ai-chat-message";
import { Bot, Send, Trash2 } from "lucide-react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

export function AIAssistantPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    // Placeholder API call - replace with actual AI service
    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "I'm a placeholder response. Connect me to your AI service to enable real conversations!",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 1000);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleClear = () => {
    setMessages([]);
    setInput("");
  };

  return (
    <div className="h-full flex flex-col" data-testid="page-ai-assistant">
      <Card className="flex-1 flex flex-col h-full">
        <CardHeader className="flex-row items-center justify-between border-b pb-4">
          <div>
            <h2 className="text-2xl font-semibold">AI Assistant</h2>
            <p className="text-muted-foreground text-sm mt-1">
              Ask questions and get intelligent responses
            </p>
          </div>
          {messages.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClear}
              data-testid="ai-chat-clear-button"
            >
              <Trash2 className="size-4" />
              Clear
            </Button>
          )}
        </CardHeader>

        <CardContent className="flex-1 overflow-y-auto min-h-0 py-4" data-testid="ai-chat-messages">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-3">
              <div className="rounded-full bg-muted p-6">
                <Bot className="size-12 text-muted-foreground" />
              </div>
              <div className="space-y-1">
                <h3 className="font-semibold text-lg">Start a conversation</h3>
                <p className="text-sm text-muted-foreground max-w-sm">
                  Ask me anything about your trading data, market insights, or get help with your deals.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((message) => (
                <AIChatMessage
                  key={message.id}
                  role={message.role}
                  content={message.content}
                  timestamp={message.timestamp}
                />
              ))}
              {isLoading && (
                <div className="flex gap-3">
                  <div className="size-8 shrink-0 rounded-full bg-muted animate-pulse" />
                  <div className="h-12 w-32 bg-muted rounded-xl animate-pulse" />
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </CardContent>

        <div className="border-t p-4">
          <div className="flex gap-2">
            <Textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your message... (Shift+Enter for new line)"
              className="min-h-[60px] max-h-[200px] resize-none"
              disabled={isLoading}
              data-testid="ai-chat-input"
            />
            <Button
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              size="icon"
              className="shrink-0"
              data-testid="ai-chat-send-button"
            >
              <Send className="size-4" />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Press Enter to send, Shift+Enter for new line
          </p>
        </div>
      </Card>
    </div>
  );
}
