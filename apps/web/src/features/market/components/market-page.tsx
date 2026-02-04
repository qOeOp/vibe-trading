"use client";

import { TreemapPanel } from "./treemap/treemap-panel";
import { MarketDetailPanel } from "./market-detail-panel";
import { AiChatPanel } from "./ai-chat-panel";
import { AnimateIn, AnimateHeavy } from "@/components/animation";
import { ErrorBoundary, FeatureErrorFallback } from "@/components/error-boundary";

function MarketPageContent() {
  return (
    <>
      {/* AI Chat assistant - comes in from left, hidden on smaller screens */}
      <AnimateIn delay={0} from="left" className="shrink-0 hidden xl:block">
        <ErrorBoundary
          fallback={(error) => (
            <FeatureErrorFallback error={error} featureName="AI Chat" />
          )}
        >
          <AiChatPanel />
        </ErrorBoundary>
      </AnimateIn>

      {/* Center: Treemap (the star) - heavy component, loads with delay */}
      <AnimateHeavy delay={0.15} className="flex-1 min-w-0 flex flex-col">
        <ErrorBoundary
          fallback={(error) => (
            <FeatureErrorFallback error={error} featureName="Market Treemap" />
          )}
        >
          <TreemapPanel />
        </ErrorBoundary>
      </AnimateHeavy>

      {/* Right: Detail panel - comes in from right, hidden on smaller screens */}
      <AnimateIn delay={1} from="right" className="shrink-0 hidden lg:block">
        <ErrorBoundary
          fallback={(error) => (
            <FeatureErrorFallback error={error} featureName="Market Detail" />
          )}
        >
          <MarketDetailPanel />
        </ErrorBoundary>
      </AnimateIn>
    </>
  );
}

export function MarketPage() {
  return (
    <ErrorBoundary
      fallback={(error) => (
        <div className="flex-1 flex items-center justify-center">
          <FeatureErrorFallback
            error={error}
            featureName="Market"
            onRetry={() => window.location.reload()}
          />
        </div>
      )}
    >
      <MarketPageContent />
    </ErrorBoundary>
  );
}
