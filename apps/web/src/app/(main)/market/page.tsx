import { MarketPage as MarketPageClient } from "@/features/market/components/market-page";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Market Performance - Vibe Trading",
  description: "Real-time market sector heatmap and performance dashboard",
};

export default function MarketPage() {
  return <MarketPageClient />;
}
