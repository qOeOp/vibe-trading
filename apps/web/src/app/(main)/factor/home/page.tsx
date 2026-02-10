import { FactorPage as FactorPageClient } from "@/features/factor";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Factor Analysis - Vibe Trading",
  description: "Quantitative factor analysis with Alphalens-style tear sheets",
};

export default function FactorHomePage() {
  return <FactorPageClient />;
}
