"use client";

import { AnimateHeavy } from "@/components/animation";
import { ErrorBoundary, FeatureErrorFallback } from "@/components/error-boundary";
import { LabChrome } from "./chrome/lab-chrome";

// ─── Lab Page ───────────────────────────────────────────

export function LabPage() {
  return (
    <ErrorBoundary fallback={(error) => <FeatureErrorFallback error={error} featureName="Lab" />}>
      <AnimateHeavy delay={0.1} className="flex-1 flex flex-col overflow-hidden">
        <LabChrome />
      </AnimateHeavy>
    </ErrorBoundary>
  );
}
