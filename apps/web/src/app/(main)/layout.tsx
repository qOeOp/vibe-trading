"use client";

import { TopNavBar } from "@/components/layout/top-nav-bar";
import { LeftIconSidebar } from "@/components/layout/left-icon-sidebar";
import { UserCapsule } from "@/components/layout/user-capsule";
import { PageTransition } from "@/components/layout/page-transition";
import { TopBarSlotProvider } from "@/components/layout/top-bar-slot";
import { ChartTooltipProvider } from "@/lib/ngx-charts";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <TopBarSlotProvider>
      <ChartTooltipProvider>
        <div className="h-screen w-screen min-w-0 bg-mine-page-bg flex">
          <div className="flex flex-col items-center pt-3 pb-4 px-3 gap-3 shrink-0 min-h-0">
            <UserCapsule />
            <LeftIconSidebar />
          </div>

          <div className="flex-1 flex flex-col overflow-hidden">
            <TopNavBar />

            <div className="flex-1 flex gap-4 pr-4 pb-4 overflow-hidden">
              <PageTransition>{children}</PageTransition>
            </div>
          </div>
        </div>
      </ChartTooltipProvider>
    </TopBarSlotProvider>
  );
}
