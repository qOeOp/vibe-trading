import { MODULES } from "@/features/blueprint/data/modules";
import type { BlueprintModule } from "@/features/blueprint/data/modules";
import type { LucideIcon } from "lucide-react";

// ─── Types ───────────────────────────────────────────────

export interface ModuleTabConfig {
  id: string;
  label: string;
  href: string;
}

export interface ModuleNavConfig {
  id: string;
  icon: LucideIcon;
  label: string;
  phase: BlueprintModule["phase"];
  href: string;
  defaultTab: string;
  tabs: ModuleTabConfig[];
}

// ─── Route Generation ────────────────────────────────────
// Every Blueprint module gets a route. Every tab gets a sub-route.
// First tab of each module maps to the module root; rest → sub-routes.

function toTabId(label: string): string {
  return label
    .toLowerCase()
    .replace(/\s+&\s+/g, "-")
    .replace(/\s+/g, "-");
}

function buildModuleNav(mod: BlueprintModule): ModuleNavConfig {
  const moduleHref = `/${mod.id}`;

  const tabs: ModuleTabConfig[] = mod.topbar.map((label, i) => {
    const tabId = toTabId(label);
    const href = i === 0 ? moduleHref : `${moduleHref}/${tabId}`;
    return { id: tabId, label, href };
  });

  return {
    id: mod.id,
    icon: mod.icon,
    label: mod.label,
    phase: mod.phase,
    href: moduleHref,
    defaultTab: tabs[0]?.id ?? "",
    tabs,
  };
}

// ─── Overrides for modules with non-standard first-tab routing ──
// Factor: /factor redirects to /factor/home, so first tab href = /factor/home
const FIRST_TAB_OVERRIDES: Record<string, string> = {
  factor: "/factor/home",
};

const RAW_CONFIG: ModuleNavConfig[] = MODULES.map(buildModuleNav);

export const NAV_CONFIG: ModuleNavConfig[] = RAW_CONFIG.map((mod) => {
  const override = FIRST_TAB_OVERRIDES[mod.id];
  if (!override) return mod;
  return {
    ...mod,
    tabs: mod.tabs.map((tab, i) =>
      i === 0 ? { ...tab, href: override } : tab,
    ),
  };
});

// ─── Lookup helpers ──────────────────────────────────────

export function getModuleByRoute(
  pathname: string,
): ModuleNavConfig | undefined {
  const exact = NAV_CONFIG.find((m) => m.href === pathname);
  if (exact) return exact;

  // Prefix match (e.g. "/factor/home" → factor module)
  return NAV_CONFIG.find((m) => pathname.startsWith(m.href + "/"));
}

export function getActiveTab(
  module: ModuleNavConfig,
  pathname: string,
): string | undefined {
  const exactTab = module.tabs.find((t) => t.href === pathname);
  if (exactTab) return exactTab.id;
  return module.defaultTab;
}
