"use client";

import { TreemapPanel } from "./treemap/treemap-panel";
import { MarketDetailPanel } from "./market-detail-panel";
import { AiChatPanel } from "./ai-chat-panel";

export function MarketPage() {
  return (
    <>
      {/* AI Chat assistant */}
      <AiChatPanel />

      {/* Center: Treemap (the star) */}
      <TreemapPanel />

      {/* Right: Detail panel */}
      <MarketDetailPanel />
    </>
  );
}
