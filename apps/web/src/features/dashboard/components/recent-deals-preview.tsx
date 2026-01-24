import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { DealsTable } from "./deals-table";

export function RecentDealsPreview() {
  return (
    <div className="space-y-4" data-testid="dashboard-recent-deals">
      <DealsTable
        limit={10}
        showPagination={false}
        showFilters={false}
      />

      <div className="flex justify-center">
        <Button
          variant="ghost"
          asChild
          className="gap-2"
        >
          <Link
            href="/deals"
            data-testid="dashboard-view-all-deals-link"
          >
            View All Deals
            <ArrowRight className="size-4" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
