import { Coins, Package, Users, MessageCircle } from "lucide-react";
import { statsData } from "../data/stats";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  coins: Coins,
  box: Package,
  users: Users,
  messages: MessageCircle,
};

export function StatsCards() {
  return (
    <div
      className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 p-3 sm:p-4 lg:p-6 rounded-xl border bg-card"
      data-testid="dashboard-stats-cards"
    >
      {statsData.map((stat, index) => {
        const Icon = iconMap[stat.icon];
        const testIdSafe = stat.title.toLowerCase().replace(/\s+/g, '-');

        return (
          <div
            key={stat.id}
            className="flex items-start"
            data-testid={`dashboard-stats-card-${testIdSafe}`}
          >
            <div className="flex-1 space-y-2 sm:space-y-4 lg:space-y-6">
              <div className="flex items-center gap-1 sm:gap-1.5 text-muted-foreground">
                {Icon && <Icon className="size-3.5 sm:size-[18px]" />}
                <span className="text-[10px] sm:text-xs lg:text-sm font-medium truncate">
                  {stat.title}
                </span>
              </div>
              <p className="text-lg sm:text-xl lg:text-[28px] font-semibold leading-tight tracking-tight">
                {stat.value}
              </p>
              <div className="flex flex-wrap items-center gap-1 sm:gap-2 text-[10px] sm:text-xs lg:text-sm font-medium">
                <span
                  className={stat.isPositive ? "text-emerald-600" : "text-red-600"}
                >
                  {stat.change}
                  <span className="hidden sm:inline">{stat.changeValue}</span>
                </span>
                <span className="text-muted-foreground hidden sm:inline">vs Last Months</span>
              </div>
            </div>
            {index < statsData.length - 1 && (
              <div className="hidden lg:block w-px h-full bg-border mx-4 xl:mx-6" />
            )}
          </div>
        );
      })}
    </div>
  );
}
