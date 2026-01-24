import { AIAssistantPage } from "@/features/dashboard/pages/ai-assistant-page";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Assistant - Vibe Trading",
  description: "Get intelligent trading insights",
};

export default function Page() {
  return (
    // Accessibility: AIAssistantPage provides the chat interface.
    <AIAssistantPage />
  );
}
