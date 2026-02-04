import { AnalysisPage as AnalysisPageClient } from "@/features/analysis/components/analysis-page";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Stock Analysis - Vibe Trading",
  description: "Individual stock analysis with candlestick charts and watchlist",
};

export default function AnalysisPage() {
  return <AnalysisPageClient />;
}
