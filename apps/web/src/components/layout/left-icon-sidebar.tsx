"use client";

import {
  LayoutGrid,
  TrendingUp,
  BarChart3,
  FlaskConical,
  Gauge,
  Gem,
  Wallet,
  LineChart,
  Users,
  Wrench,
  Shield,
  Bell,
  Settings,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

interface SidebarItem {
  icon: LucideIcon;
  label: string;
  href?: string;
}

const icons: SidebarItem[] = [
  { icon: LayoutGrid, label: "Dashboard", href: "/" },
  { icon: TrendingUp, label: "Market", href: "/market" },
  { icon: BarChart3, label: "Analysis", href: "/analysis" },
  { icon: FlaskConical, label: "Factor", href: "/factor" },
  { icon: Gauge, label: "Indicators" },
  { icon: Gem, label: "Watchlist" },
  { icon: Wallet, label: "Portfolio" },
  { icon: LineChart, label: "Trading" },
  { icon: Users, label: "Social" },
  { icon: Wrench, label: "Tools" },
  { icon: Shield, label: "Security" },
  { icon: Bell, label: "Alerts" },
  { icon: Settings, label: "Settings" },
];

export function LeftIconSidebar() {
  const router = useRouter();
  const pathname = usePathname();

  const isActive = (href?: string) => {
    if (!href) return false;
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <div className="flex flex-col w-[52px] flex-1 min-h-0 items-center justify-center">
      <div className="flex flex-col items-center gap-1 py-1 px-1.5 rounded-full bg-white/40 backdrop-blur-2xl border border-white/60 shadow-[0_8px_32px_rgba(0,0,0,0.08)] max-h-full overflow-y-auto scrollbar-none">
        {icons.map(({ icon: Icon, label, href }) => (
          <button
            type="button"
            key={label}
            disabled={!href}
            onClick={() => href && router.push(href)}
            className={cn(
              "flex items-center justify-center w-10 h-10 rounded-full transition-all",
              isActive(href)
                ? "bg-mine-nav-active text-white shadow-sm"
                : href
                  ? "text-mine-text hover:bg-white/80 cursor-pointer"
                  : "text-mine-muted/50 cursor-default",
            )}
            title={label}
            aria-label={label}
          >
            <Icon className="w-[18px] h-[18px]" strokeWidth={1.5} />
          </button>
        ))}
      </div>
    </div>
  );
}
