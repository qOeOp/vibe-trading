"use client";

import { StatsCards } from '../components/stats-cards';
import { WelcomeSection } from '../components/welcome-section';
import { LeadSourcesChart } from '../components/charts/lead-sources-chart';
import { RevenueFlowChart } from '../components/charts/revenue-flow-chart';
import { RecentDealsPreview } from '@/features/dashboard';

export function OverviewPage() {
  return (
    <div className="space-y-6" data-testid="page-overview">
      <WelcomeSection />

      <StatsCards />

      <div className="flex flex-col xl:flex-row gap-4 sm:gap-6">
        <LeadSourcesChart data-testid="dashboard-chart-lead-sources" />
        <RevenueFlowChart data-testid="dashboard-chart-revenue-flow" />
      </div>

      <RecentDealsPreview />
    </div>
  );
}
