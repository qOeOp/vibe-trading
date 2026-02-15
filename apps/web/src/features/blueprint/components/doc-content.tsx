"use client";

import { useEffect, useState } from "react";
import { useDocModeState } from "../context/doc-mode-context";
import { MODULES } from "../data/modules";

import { VisionSection } from "../sections/vision-section";
import { WorkflowSection } from "../sections/workflow-section";
import { RoadmapSection } from "../sections/roadmap-section";
// Factor, Market & Dashboard (data/tech) sections migrated to markdown (see MD_DOCS below)
import { ScreenerWireframe } from "../sections/screener-wireframe";
import { ModulePlaceholder } from "../sections/module-placeholder";
import { BlueprintSection } from "./blueprint-section";
import { parseBlueprintDoc } from "../lib/parse-blueprint-doc";
import type { BlueprintDoc } from "../lib/parse-blueprint-doc";

/* ================================================================ */
/*  Layer 1: Custom JSX sections (Category B + non-migrated A)      */
/* ================================================================ */

const CUSTOM_SECTIONS: Record<string, Record<number, React.ComponentType>> = {
  dashboard: {
    0: VisionSection,
    1: WorkflowSection,
    2: RoadmapSection,
    // 3 (data) & 4 (tech) migrated to markdown (see MD_DOCS below)
  },
  // factor: all tabs migrated to markdown (see MD_DOCS below)
  // market: all tabs migrated to markdown (see MD_DOCS below)
  screener: {
    0: ScreenerWireframe,
  },
};

/* ================================================================ */
/*  Layer 2: Markdown-driven docs (.md → BlueprintSection)          */
/* ================================================================ */

/**
 * Registry of .md files keyed by module → tab index.
 * Each entry is a dynamic import that resolves to a raw markdown string.
 *
 * To migrate a section from TSX to markdown:
 * 1. Create .md file in docs/<module>/<tab>.md
 * 2. Register it here
 * 3. Remove the entry from CUSTOM_SECTIONS
 */
const MD_DOCS: Record<string, Record<number, () => Promise<string>>> = {
  factor: {
    0: () => import("../docs/factor/home.md").then((m) => m.default),
    1: () => import("../docs/factor/monitor.md").then((m) => m.default),
    2: () => import("../docs/factor/library.md").then((m) => m.default),
    3: () => import("../docs/factor/lab.md").then((m) => m.default),
    4: () => import("../docs/factor/backtest.md").then((m) => m.default),
    5: () => import("../docs/factor/mining.md").then((m) => m.default),
  },
  dashboard: {
    3: () => import("../docs/dashboard/data.md").then((m) => m.default),
    4: () => import("../docs/dashboard/tech.md").then((m) => m.default),
  },
  market: {
    0: () => import("../docs/market/sector.md").then((m) => m.default),
    1: () => import("../docs/market/auction.md").then((m) => m.default),
    2: () => import("../docs/market/news.md").then((m) => m.default),
    3: () => import("../docs/market/macro.md").then((m) => m.default),
    4: () => import("../docs/market/industry.md").then((m) => m.default),
    5: () => import("../docs/market/capital.md").then((m) => m.default),
    6: () => import("../docs/market/sentiment.md").then((m) => m.default),
  },
};

/* ================================================================ */
/*  Markdown doc loader                                             */
/* ================================================================ */

function MarkdownDocLoader({
  loader,
}: {
  loader: () => Promise<string>;
}) {
  const [doc, setDoc] = useState<BlueprintDoc | null>(null);

  useEffect(() => {
    let cancelled = false;
    loader().then((raw) => {
      if (!cancelled) {
        setDoc(parseBlueprintDoc(raw));
      }
    });
    return () => {
      cancelled = true;
    };
  }, [loader]);

  if (!doc) {
    return (
      <div className="flex items-center justify-center h-64 text-sm text-mine-muted">
        Loading...
      </div>
    );
  }

  return <BlueprintSection doc={doc} />;
}

/* ================================================================ */
/*  Main Router                                                     */
/* ================================================================ */

/**
 * Three-tier routing for all module tabs:
 * 1. Custom JSX component (Category B + non-migrated sections)
 * 2. Markdown doc (.md → BlueprintSection generic renderer)
 * 3. ModulePlaceholder (tabs without content yet)
 */
export function DocContent() {
  const { activeModule, activeTab } = useDocModeState();
  const mod = MODULES.find((m) => m.id === activeModule);

  // 1. Custom JSX component
  const Custom = CUSTOM_SECTIONS[activeModule]?.[activeTab];
  if (Custom) return <Custom />;

  // 2. Markdown doc
  const mdLoader = MD_DOCS[activeModule]?.[activeTab];
  if (mdLoader) return <MarkdownDocLoader loader={mdLoader} />;

  // 3. Placeholder
  return <ModulePlaceholder module={mod} tabIndex={activeTab} />;
}
