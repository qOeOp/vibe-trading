import { LibraryPage as LibraryPageClient } from "@/features/library";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Factor Library - Vibe Trading",
  description: "Browse and manage quantitative trading factors",
};

export default function FactorLibraryPage() {
  return <LibraryPageClient />;
}
