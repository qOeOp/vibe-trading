import { DashboardLayout } from "@/features/dashboard/components/dashboard-layout";

export default function RootDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // Accessibility: DashboardLayout contains the <main> landmark.
    <DashboardLayout>{children}</DashboardLayout>
  );
}
