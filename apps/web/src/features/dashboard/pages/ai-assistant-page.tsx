"use client";

import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  const [error, setError] = useState<string | null>(null);
  const [failedMessage, setFailedMessage] = useState<Message | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: input.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);
    setError(null);

    try {
      // Placeholder API call - replace with actual AI service
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const assistantMessage: Message = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: "I'm a placeholder response. Connect me to your AI service to enable real conversations!",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, assistantMessage]);
      setFailedMessage(null); // Clear failed message on success
    } catch (err) {
      // Provide specific error messages based on error type
      let errorMessage = "An unexpected error occurred";

      if (err instanceof TypeError && err.message.includes('fetch')) {
        errorMessage = "Unable to connect to the server. Please check your internet connection.";
      } else if (err instanceof DOMException && err.name === 'AbortError') {
        errorMessage = "Request timed out. Please try again.";
      } else if (err instanceof Response) {
        switch (err.status) {
          case 401:
            errorMessage = "Your session has expired. Please sign in again.";
            break;
          case 429:
            errorMessage = "Too many requests. Please wait a moment and try again.";
            break;
          case 500:
          case 502:
          case 503:
            errorMessage = "The server is experiencing issues. Please try again later.";
            break;
          default:
            errorMessage = `Server error (${err.status}). Please try again.`;
        }
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }

      console.error('AI Assistant error:', {
        error: err,
        timestamp: new Date().toISOString(),
        userMessage: userMessage.content
      });

      setError(errorMessage);
      setFailedMessage(userMessage); // Save for retry
    } finally {
      setIsLoading(false);
      textareaRef.current?.focus();
    }
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
    setError(null);
    setFailedMessage(null);
  };

  const handleRetry = () => {
    if (!failedMessage) return;
    setInput(failedMessage.content);
    setError(null);
    setFailedMessage(null);
    // Focus will be set after handleSend completes via the finally block
    setTimeout(() => handleSend(), 0);
  };

  const handleDismissError = () => {
    setError(null);
    setFailedMessage(null);
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
          {error && (
            <div className="mb-3 p-3 bg-destructive/10 text-destructive text-sm rounded-lg flex justify-between items-start gap-3">
              <span className="flex-1">{error}</span>
              <div className="flex gap-2 shrink-0">
                {failedMessage && (
                  <Button size="sm" variant="outline" onClick={handleRetry}>
                    Retry
                  </Button>
                )}
                <Button size="sm" variant="ghost" onClick={handleDismissError}>
                  Dismiss
                </Button>
              </div>
            </div>
          )}
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
