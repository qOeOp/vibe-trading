import { StatsCards } from '../components/stats-cards';
import { WelcomeSection } from '../components/welcome-section';
import { LeadSourcesChart } from '../components/charts/lead-sources-chart';
import { RevenueFlowChart } from '../components/charts/revenue-flow-chart';
import { RecentDealsPreview } from '../components/recent-deals-preview';
import { leadSourcesData, revenueFlowData } from '../data/stats';

export function OverviewPage() {
  return (
    <div className="space-y-6" data-testid="page-overview">
      <WelcomeSection />

      <StatsCards />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <LeadSourcesChart
          data={leadSourcesData}
          data-testid="dashboard-chart-lead-sources"
        />
        <RevenueFlowChart
          data={revenueFlowData}
          data-testid="dashboard-chart-revenue-flow"
        />
      </div>

      <RecentDealsPreview />
    </div>
  );
}
