import { LabPage as LabPageClient } from "@/features/lab";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Factor Lab - Vibe Trading",
  description:
    "Factor research workbench for building and validating alpha factors",
};

export default function FactorLabRoute() {
  return <LabPageClient />;
}
