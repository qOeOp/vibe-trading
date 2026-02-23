'use client';

import { motion, AnimatePresence } from 'motion/react';
import { Check, Loader2, ChevronRight } from 'lucide-react';
import type { ConnectStep } from './chrome-header';

const EASE = [0.25, 0.1, 0.25, 1] as const;

const CTA_BUTTON_SHADOW =
  '0px 16px 8px rgba(31,31,31,0.01), 0px 12px 6px rgba(31,31,31,0.04), 0px 4px 4px rgba(31,31,31,0.07), 0px 1.5px 3px rgba(31,31,31,0.08), 0px 0px 0px 1px #0f0f0f, inset 0px 1px 2px rgba(255,255,255,0.12)';

// ─── Progressive Blur (11-layer Align UI technique) ─────
// Each layer: 52px tall, offset 26px apart (50% overlap),
// masked with a top-opaque → bottom-transparent gradient.
// Blur descends 5.5px → 0.5px from bottom to top.
const BLUR_MASK =
  'linear-gradient(to bottom, black 0%, black 50%, transparent 100%)';

const BLUR_LAYERS = [5.5, 5, 4.5, 4, 3.5, 3, 2.5, 2, 1.5, 1, 0.5] as const;

// ─── CTA Overlay ──────────────────────────────────────────

type CTAOverlayProps = {
  step: ConnectStep;
  error: string | null;
  onConnect: () => void;
  onRetry: () => void;
};

function CTAOverlay({ step, error, onConnect, onRetry }: CTAOverlayProps) {
  return (
    <div data-slot="cta-overlay" className="contents">
      {/* Progressive blur — 11 stacked backdrop-blur layers with gradient masks */}
      <div
        data-slot="progressive-blur"
        className="absolute bottom-0 left-0 right-0 h-[286px] pointer-events-none z-20 overflow-hidden"
      >
        {/* Background color gradient (transparent → mine-bg at 65%) */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(to bottom, rgba(247,247,247,0) 0%, var(--color-mine-bg) 65%)',
          }}
        />
        {/* 11 blur layers — strongest (5.5px) at bottom, weakest (0.5px) at top */}
        {BLUR_LAYERS.map((blur, i) => (
          <div
            key={blur}
            className="absolute left-0 right-0 h-[52px]"
            style={{
              bottom: `${i * 26 - 26}px`,
              backdropFilter: `blur(${blur}px)`,
              WebkitBackdropFilter: `blur(${blur}px)`,
              maskImage: BLUR_MASK,
              WebkitMaskImage: BLUR_MASK,
            }}
          />
        ))}
      </div>

      {/* CTA content floating over the blur */}
      <motion.div
        className="absolute bottom-8 left-0 right-0 z-30 flex flex-col items-center"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: EASE, delay: 0.25 }}
      >
        {/* Circular icon — 64px outer ring + 48px inner circle */}
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center overflow-hidden"
          style={{
            boxShadow:
              'inset 0px 0px 0px 0px white, inset 0px 0px 0px 1px #ebebeb',
          }}
        >
          <div
            className="w-12 h-12 rounded-full bg-white flex items-center justify-center"
            style={{
              boxShadow:
                '0px 4px 8px rgba(116,27,2,0.06), 0px 2px 4px rgba(116,27,2,0.04), 0px 1px 2px rgba(116,27,2,0.04), inset 0px -0.5px 0.5px rgba(240,80,35,0.08)',
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/brackets.gif" alt="" className="w-6 h-6" />
          </div>
        </div>

        {/* Heading */}
        <h1 className="mt-4 text-[19px] font-semibold text-mine-text tracking-[-0.4px] leading-7">
          Try live editor
        </h1>

        {/* Description */}
        <p className="mt-1 text-[14px] text-mine-muted tracking-[-0.08px]">
          Click on the button to use the code editor
        </p>

        {/* CTA button */}
        <div className="mt-6 pointer-events-auto">
          <AnimatePresence mode="wait">
            {step === 'start' && !error && (
              <motion.button
                key="cta"
                type="button"
                onClick={onConnect}
                className="flex items-center gap-0.5 h-8 pl-3.5 pr-1.5 bg-mine-nav-active text-white text-sm font-medium rounded-[11px] relative cursor-pointer hover:bg-mine-nav-active/90 transition-colors"
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                style={{ boxShadow: CTA_BUTTON_SHADOW }}
              >
                <span className="leading-5 tracking-[-0.08px]">Try live</span>
                <ChevronRight
                  className="w-5 h-5 opacity-60"
                  strokeWidth={1.5}
                />
              </motion.button>
            )}
            {step === 'connecting' && (
              <motion.div
                key="connecting-btn"
                className="flex items-center gap-0.5 h-8 pl-3.5 pr-1.5 bg-mine-nav-active text-white text-sm font-medium rounded-[11px] relative"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                style={{ boxShadow: CTA_BUTTON_SHADOW }}
              >
                <Loader2
                  className="w-4 h-4 animate-spin mr-1"
                  strokeWidth={2}
                  style={{ animationDuration: '1.5s' }}
                />
                <span className="leading-5 tracking-[-0.08px]">
                  Connecting...
                </span>
              </motion.div>
            )}
            {step === 'ready' && (
              <motion.div
                key="ready-btn"
                className="flex items-center gap-0.5 h-8 pl-3.5 pr-1.5 bg-mine-nav-active text-white text-sm font-medium rounded-[11px] relative"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                style={{ boxShadow: CTA_BUTTON_SHADOW }}
              >
                <Check className="w-4 h-4 mr-1" strokeWidth={2} />
                <span className="leading-5 tracking-[-0.08px]">
                  Entering editor...
                </span>
                <ChevronRight
                  className="w-5 h-5 opacity-60"
                  strokeWidth={1.5}
                />
              </motion.div>
            )}
            {error && (
              <motion.div
                key="error-cta"
                className="flex flex-col items-center gap-2"
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                <p className="text-xs text-mine-accent-red">{error}</p>
                <button
                  type="button"
                  onClick={onRetry}
                  className="flex items-center gap-0.5 h-8 pl-3.5 pr-1.5 bg-mine-nav-active text-white text-sm font-medium rounded-[11px] hover:bg-mine-nav-active/90 transition-colors cursor-pointer"
                  style={{
                    boxShadow:
                      '0px 4px 4px rgba(31,31,31,0.07), 0px 1.5px 3px rgba(31,31,31,0.08), 0px 0px 0px 1px #0f0f0f, inset 0px 1px 2px rgba(255,255,255,0.12)',
                  }}
                >
                  Retry
                  <ChevronRight
                    className="w-5 h-5 opacity-60"
                    strokeWidth={1.5}
                  />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}

export { CTAOverlay };
