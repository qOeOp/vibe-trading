import { KLineChart } from "@/features/market/components/k-line-chart";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Market Data - Vibe Trading",
  description: "Real-time market analysis",
};

export default function MarketPage() {
  return (
    <div className="space-y-6">
      <div>
        {/* Accessibility: Clear page heading */}
        <h1 className="text-3xl font-bold tracking-tight">Market Data</h1>
        <p className="text-muted-foreground">
          Monitor real-time market action and technical indicators.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <div className="col-span-4">
          <KLineChart />
        </div>
        <div className="col-span-3">
          <div className="h-full rounded-xl bg-muted/50 border border-dashed flex items-center justify-center">
            <p className="text-muted-foreground">Order Book Placeholder</p>
          </div>
        </div>
      </div>
    </div>
  );
}
