import { DealsTable } from '../components/deals-table';
import { deals } from '../data/deals';

export function DealsPage() {
  return (
    <div className="space-y-6" data-testid="page-deals">
      <div>
        <h2 className="text-2xl font-semibold">Deals</h2>
        <p className="text-muted-foreground text-sm mt-1">
          Manage and track all your deals in one place
        </p>
      </div>

      <DealsTable />
    </div>
  );
}
