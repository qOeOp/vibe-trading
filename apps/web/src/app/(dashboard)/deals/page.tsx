import { DealsPage } from "@/features/dashboard/pages/deals-page";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Deals - Vibe Trading",
  description: "Manage your deals",
};

export default function Page() {
  return (
    // Accessibility: DealsPage renders the deals management content.
    <DealsPage />
  );
}
