import { OverviewPage } from "@/features/dashboard/pages/overview-page";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard - Vibe Trading",
  description: "Trading Overview",
};

export default function DashboardPage() {
  return (
    // Accessibility: OverviewPage renders the primary dashboard content.
    <OverviewPage />
  );
}
