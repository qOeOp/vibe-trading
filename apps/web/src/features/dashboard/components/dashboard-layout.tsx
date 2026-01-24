
import { SidebarProvider } from '@/components/ui/sidebar';
import { DashboardSidebar } from './dashboard-sidebar';
import { DashboardHeader } from './dashboard-header';

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider className="bg-sidebar">
      <DashboardSidebar />
      <div className="h-svh overflow-hidden lg:p-2 w-full">
        <div className="lg:border lg:rounded-md overflow-hidden flex flex-col bg-background h-full w-full">
          <DashboardHeader />
          <main className="flex-1 overflow-auto p-6" data-testid="dashboard-main-content">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
