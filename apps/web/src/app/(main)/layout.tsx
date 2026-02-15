"use client";

import { TopBarSlotProvider } from "@/components/layout/top-bar-slot";
import { ChartTooltipProvider } from "@/lib/ngx-charts";
import { DocModeProvider } from "@/features/blueprint/context/doc-mode-context";
import { DocModeShell } from "@/features/blueprint/components/doc-mode-shell";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DocModeProvider>
      <TopBarSlotProvider>
        <ChartTooltipProvider>
          <DocModeShell>{children}</DocModeShell>
        </ChartTooltipProvider>
      </TopBarSlotProvider>
    </DocModeProvider>
  );
}
