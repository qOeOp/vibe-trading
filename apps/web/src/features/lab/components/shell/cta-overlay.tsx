'use client';

import { useCallback, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Terminal,
  Check,
  Loader2,
  Copy,
  Code2,
  ChevronRight,
} from 'lucide-react';
import type { ConnectStep } from './chrome-header';

const EASE = [0.25, 0.1, 0.25, 1] as const;

const SERVER_COMMAND = 'nx run vibe-editor:serve';

const CTA_BUTTON_SHADOW =
  '0px 16px 8px rgba(31,31,31,0.01), 0px 12px 6px rgba(31,31,31,0.04), 0px 4px 4px rgba(31,31,31,0.07), 0px 1.5px 3px rgba(31,31,31,0.08), 0px 0px 0px 1px #0f0f0f, inset 0px 1px 2px rgba(255,255,255,0.12)';

// ─── CTA Overlay ──────────────────────────────────────────

type CTAOverlayProps = {
  step: ConnectStep;
  error: string | null;
  onRetry: () => void;
};

function CTAOverlay({ step, error, onRetry }: CTAOverlayProps) {
  const [copied, setCopied] = useState(false);
  const [commandOpen, setCommandOpen] = useState(false);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(SERVER_COMMAND);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, []);

  return (
    <>
      {/* Progressive blur overlay at device frame bottom */}
      <div
        className="absolute bottom-0 left-0 right-0 h-[200px] pointer-events-none z-20"
        style={{
          background:
            'linear-gradient(to top, var(--color-mine-page-bg) 0%, var(--color-mine-page-bg) 20%, transparent 100%)',
        }}
      />

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
            <Code2 className="w-6 h-6 text-[#f05023]" strokeWidth={1.5} />
          </div>
        </div>

        {/* Heading */}
        <h1 className="mt-4 text-[19px] font-semibold text-mine-text tracking-[-0.4px] leading-7">
          Try live editor
        </h1>

        {/* Description */}
        <p className="mt-1 text-[14px] text-mine-muted tracking-[-0.08px]">
          正在自动连接编辑器后端...
        </p>

        {/* CTA button */}
        <div className="mt-6 pointer-events-auto">
          <AnimatePresence mode="wait">
            {step === 'start' && !error && (
              <motion.div
                key="cta"
                className="flex items-center gap-0.5 h-8 pl-3.5 pr-1.5 bg-[#2e2e2e] text-white text-sm font-medium rounded-[11px] relative"
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                style={{ boxShadow: CTA_BUTTON_SHADOW }}
              >
                <div className="relative w-1.5 h-1.5 mr-1.5">
                  <div className="absolute inset-0 rounded-full bg-white/40 animate-ping" />
                  <div className="absolute inset-0 rounded-full bg-white/70" />
                </div>
                <span className="leading-5 tracking-[-0.08px]">
                  Waiting for kernel
                </span>
                <ChevronRight
                  className="w-5 h-5 opacity-60"
                  strokeWidth={1.5}
                />
              </motion.div>
            )}
            {step === 'connecting' && (
              <motion.div
                key="connecting-btn"
                className="flex items-center gap-0.5 h-8 pl-3.5 pr-1.5 bg-[#2e2e2e] text-white text-sm font-medium rounded-[11px] relative"
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
                className="flex items-center gap-0.5 h-8 pl-3.5 pr-1.5 bg-[#2e2e2e] text-white text-sm font-medium rounded-[11px] relative"
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
                  className="flex items-center gap-0.5 h-8 pl-3.5 pr-1.5 bg-[#2e2e2e] text-white text-sm font-medium rounded-[11px] hover:bg-[#3a3a3a] transition-colors cursor-pointer"
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

        {/* Collapsible server command (for manual start) */}
        <details
          className="w-full max-w-md pointer-events-auto mt-2"
          open={commandOpen}
          onToggle={(e) =>
            setCommandOpen((e.target as HTMLDetailsElement).open)
          }
        >
          <summary className="flex items-center justify-center gap-1.5 text-xs text-mine-muted cursor-pointer hover:text-mine-text transition-colors select-none">
            <Terminal className="w-3 h-3" strokeWidth={1.5} />
            <span>手动启动服务</span>
          </summary>
          <div className="mt-2">
            <div
              className="rounded-lg overflow-hidden border border-black/10"
              style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.08)' }}
            >
              <div className="flex items-start gap-3 bg-[#1e1e1e] px-3 py-3">
                <span className="text-[12px] text-[#6ee7b7] font-mono shrink-0 leading-[20px]">
                  $
                </span>
                <code className="flex-1 text-[12px] font-mono text-[#d4d4d4] leading-[20px] select-all break-all">
                  {SERVER_COMMAND}
                </code>
                <button
                  type="button"
                  onClick={handleCopy}
                  className="shrink-0 flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/10 hover:bg-white/15 text-[10px] text-[#a3a3a3] hover:text-white transition-colors cursor-pointer font-medium"
                >
                  {copied ? (
                    <>
                      <Check className="w-3 h-3" strokeWidth={2} />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" strokeWidth={2} />
                      Copy
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </details>
      </motion.div>
    </>
  );
}

export { CTAOverlay };
