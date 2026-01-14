import { Card } from "@/components/ui/dashboard/card";
import { Avatar, AvatarFallback } from "@/components/ui/dashboard/avatar";
import { Bot, User } from "lucide-react";

interface AIChatMessageProps {
  role: "user" | "assistant";
  content: string;
  timestamp?: string;
}

export function AIChatMessage({ role, content, timestamp }: AIChatMessageProps) {
  const isUser = role === "user";

  return (
    <div
      className={`flex gap-3 ${isUser ? "flex-row-reverse" : "flex-row"}`}
      data-testid={`ai-chat-message-${role}`}
    >
      <Avatar className="size-8 shrink-0">
        <AvatarFallback className={isUser ? "bg-primary text-primary-foreground" : "bg-muted"}>
          {isUser ? <User className="size-4" /> : <Bot className="size-4" />}
        </AvatarFallback>
      </Avatar>

      <Card className={`max-w-[80%] p-3 ${isUser ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
        <p className="text-sm whitespace-pre-wrap break-words">{content}</p>
        {timestamp && (
          <p className={`text-xs mt-1 ${isUser ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
            {timestamp}
          </p>
        )}
      </Card>
    </div>
  );
}
