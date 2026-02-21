'use client';

// ── Marimo CSS (must load before components) ──
import '../css/marimo-vars.css';
import '../css/index.css';
import '../css/app.css';
import '../css/outputs.css';
import '../css/cell-status.css';

import { Provider } from 'jotai';
import { Provider as SlotzProvider } from '@marimo-team/react-slotz';
import { TooltipProvider } from '@radix-ui/react-tooltip';
import { Suspense, useCallback, useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { FlaskConical, Terminal, Check, Loader2, Copy } from 'lucide-react';
import { AnimateHeavy } from '@/components/animation';
import {
  ErrorBoundary,
  FeatureErrorFallback,
} from '@/components/error-boundary';
import { ErrorBoundary as MarimoErrorBoundary } from './editor/boundary/ErrorBoundary';
import { requestClientAtom } from '../core/network/requests';
import { resolveRequestClient } from '../core/network/resolve';
import {
  DEFAULT_RUNTIME_CONFIG,
  runtimeConfigAtom,
} from '../core/runtime/config';
import { useAppConfig, useResolvedMarimoConfig } from '../core/config/config';
import { initialModeAtom, viewStateAtom } from '../core/mode';
import { slotsController } from '../core/slots/slots';
import { AppChrome } from './editor/chrome/wrapper/app-chrome';
import { EditApp } from '../core/edit-app';
import { connectionAtom } from '../core/network/connection';
import { store } from '../core/state/jotai';
import { WebSocketState } from '../core/websocket/types';
import { getSessionId } from '../core/kernel/session';
import { useLabModeStore } from '../store/use-lab-mode-store';

const MARIMO_KERNEL_PORT = 2728;
const MARIMO_KERNEL_BASE = `http://localhost:${MARIMO_KERNEL_PORT}`;
const DEFAULT_NOTEBOOK = '/tmp/vt-lab.py';

async function fetchServerToken(): Promise<string | undefined> {
  try {
    const res = await fetch(MARIMO_KERNEL_BASE);
    const html = await res.text();
    const match = html.match(/data-token="([^"]+)"/);
    return match?.[1] ?? undefined;
  } catch {
    return undefined;
  }
}

function buildRuntimeURL(serverToken?: string): string {
  const url = new URL(MARIMO_KERNEL_BASE);
  url.searchParams.set('file', DEFAULT_NOTEBOOK);
  if (serverToken) {
    url.searchParams.set('server_token', serverToken);
  }
  return url.toString();
}

async function takeoverSession(serverToken?: string): Promise<void> {
  try {
    const url = new URL(`${MARIMO_KERNEL_BASE}/api/kernel/takeover`);
    url.searchParams.set('file', DEFAULT_NOTEBOOK);
    if (serverToken) {
      url.searchParams.set('server_token', serverToken);
    }
    await fetch(url.toString(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Marimo-Session-Id': getSessionId(),
        'Marimo-Server-Token': serverToken ?? '',
      },
    });
  } catch {
    // Kernel not running — will fail at WebSocket connect instead
  }
}

function LabEditor() {
  const [userConfig] = useResolvedMarimoConfig();
  const [appConfig] = useAppConfig();
  return <EditApp userConfig={userConfig} appConfig={appConfig} />;
}

/** Connection step definition */
type ConnectStep = 'start' | 'connecting' | 'ready';

const CONNECT_STEPS: { id: ConnectStep; label: string; sub: string }[] = [
  { id: 'start', label: 'Start Kernel', sub: '复制命令并在终端运行' },
  { id: 'connecting', label: 'Connecting', sub: '检测到 Kernel，正在建立连接' },
  { id: 'ready', label: 'Ready', sub: '初始化完成，即将进入编辑器' },
];

const MARIMO_COMMAND = `marimo edit --headless --port ${MARIMO_KERNEL_PORT} --no-token --allow-origins "http://localhost:4200"`;

const EASE = [0.25, 0.1, 0.25, 1] as const;

/**
 * Circuit-board style connector between step pills.
 * Path: drops down from pill → horizontal line → rises up to next pill.
 * Chevron arrows (>>) sit in the middle of the horizontal segment.
 */
function StepConnector({ active }: { active: boolean }) {
  const traceColor = active ? 'rgba(38,166,154,0.50)' : 'rgba(0,0,0,0.18)';
  const dotColor = active ? 'rgba(38,166,154,0.65)' : 'rgba(0,0,0,0.22)';
  return (
    <div
      className="flex items-start"
      style={{ marginTop: 14, marginLeft: -2, marginRight: -2 }}
    >
      <svg width="64" height="36" viewBox="0 0 64 36" fill="none">
        {/* Circuit trace: vertical drops + horizontal bridge */}
        <motion.path
          d="M0 2 L0 14 C0 18, 2 20, 6 20 L58 20 C62 20, 64 18, 64 14 L64 2"
          stroke={traceColor}
          strokeWidth={active ? '2' : '1.5'}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={active ? 'none' : '4 3'}
          animate={{ stroke: traceColor }}
          transition={{ duration: 0.5, ease: EASE }}
        />
        {/* Junction dots at top */}
        <motion.circle
          cx="0"
          cy="2"
          r="2.5"
          fill={dotColor}
          animate={{ fill: dotColor }}
          transition={{ duration: 0.5 }}
        />
        <motion.circle
          cx="64"
          cy="2"
          r="2.5"
          fill={dotColor}
          animate={{ fill: dotColor }}
          transition={{ duration: 0.5 }}
        />
        {/* Directional chevrons >> */}
        <motion.path
          d="M29 16L33 20L29 24"
          stroke={traceColor}
          strokeWidth="1.5"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          animate={{ opacity: active ? 0.8 : 0.35 }}
          transition={{ duration: 0.5 }}
        />
        <motion.path
          d="M35 16L39 20L35 24"
          stroke={traceColor}
          strokeWidth="1.5"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          animate={{ opacity: active ? 0.8 : 0.35 }}
          transition={{ duration: 0.5 }}
        />
      </svg>
    </div>
  );
}

/** Single step pill — refined with layered styling */
function StepPill({
  step,
  state,
  delay,
}: {
  step: (typeof CONNECT_STEPS)[number];
  state: 'done' | 'active' | 'pending';
  delay: number;
}) {
  return (
    <motion.div
      className="relative flex items-center gap-2.5 rounded-full"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: EASE, delay }}
    >
      {/* Outer glow for active state */}
      {state === 'active' && (
        <motion.div
          className="absolute -inset-[3px] rounded-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{
            background:
              'conic-gradient(from 180deg, rgba(45,45,45,0.06), rgba(38,166,154,0.08), rgba(45,45,45,0.06))',
          }}
        />
      )}

      {/* Pill body */}
      <motion.div
        className="relative flex items-center gap-2.5 px-5 py-2.5 rounded-full border"
        animate={{
          backgroundColor:
            state === 'done'
              ? 'rgba(255,255,255,0.95)'
              : state === 'active'
                ? '#ffffff'
                : 'rgba(255,255,255,0.6)',
          borderColor:
            state === 'done'
              ? 'rgba(38,166,154,0.25)'
              : state === 'active'
                ? 'rgba(45,45,45,0.15)'
                : 'rgba(0,0,0,0.10)',
        }}
        style={{
          boxShadow:
            state === 'active'
              ? '0 1px 3px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.06)'
              : state === 'done'
                ? '0 1px 2px rgba(0,0,0,0.03)'
                : 'none',
        }}
        transition={{ duration: 0.4, ease: EASE }}
      >
        {/* Status icon */}
        <div className="shrink-0">
          <AnimatePresence mode="wait">
            {state === 'done' ? (
              <motion.div
                key="done"
                className="w-[22px] h-[22px] rounded-full bg-mine-accent-teal/12 flex items-center justify-center ring-1 ring-mine-accent-teal/20"
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.5, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Check
                  className="w-3 h-3 text-mine-accent-teal"
                  strokeWidth={2.5}
                />
              </motion.div>
            ) : state === 'active' ? (
              <motion.div
                key="active"
                className="w-[22px] h-[22px] rounded-full bg-mine-nav-active/8 flex items-center justify-center ring-1 ring-mine-nav-active/15"
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.5, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Loader2
                  className="w-3 h-3 text-mine-nav-active animate-spin"
                  strokeWidth={2.5}
                  style={{ animationDuration: '1.5s' }}
                />
              </motion.div>
            ) : (
              <motion.div
                key="pending"
                className="w-[22px] h-[22px] rounded-full border border-mine-muted/25 bg-mine-muted/8"
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.5, opacity: 0 }}
                transition={{ duration: 0.3 }}
              />
            )}
          </AnimatePresence>
        </div>

        {/* Label */}
        <span
          className={`text-[13px] font-semibold whitespace-nowrap tracking-tight ${
            state === 'done'
              ? 'text-mine-accent-teal'
              : state === 'active'
                ? 'text-mine-text'
                : 'text-mine-muted/60'
          }`}
        >
          {step.label}
        </span>
      </motion.div>
    </motion.div>
  );
}

/** Full stepper with circuit-board connectors */
function ConnectionStepper({ currentStep }: { currentStep: ConnectStep }) {
  const currentIndex = CONNECT_STEPS.findIndex((s) => s.id === currentStep);
  return (
    <div className="flex items-start justify-center">
      {CONNECT_STEPS.map((step, i) => {
        const state: 'done' | 'active' | 'pending' =
          i < currentIndex ? 'done' : i === currentIndex ? 'active' : 'pending';
        return (
          <div key={step.id} className="flex items-start">
            {i > 0 && <StepConnector active={i <= currentIndex} />}
            <StepPill step={step} state={state} delay={i * 0.1} />
          </div>
        );
      })}
    </div>
  );
}

function ConnectScreen({
  step,
  error,
  onRetry,
}: {
  step: ConnectStep;
  error: string | null;
  onRetry: () => void;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(MARIMO_COMMAND);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, []);

  const currentStepData = CONNECT_STEPS.find((s) => s.id === step);

  return (
    <div
      data-slot="connect-screen"
      className="flex-1 flex flex-col items-center justify-start pt-[12vh] px-8 gap-8"
    >
      {/* ═══ Stepper ═══ */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: EASE }}
      >
        <ConnectionStepper currentStep={step} />
      </motion.div>

      {/* ═══ Center content ═══ */}
      <motion.div
        className="flex flex-col items-center gap-6 max-w-lg w-full"
        initial={{ opacity: 0, y: 20, filter: 'blur(8px)' }}
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        transition={{ duration: 0.7, ease: EASE, delay: 0.15 }}
      >
        {/* Icon + title */}
        <div className="flex flex-col items-center gap-3">
          <div className="w-14 h-14 rounded-2xl bg-mine-nav-active/8 flex items-center justify-center">
            <FlaskConical
              className="w-7 h-7 text-mine-nav-active"
              strokeWidth={1.5}
            />
          </div>
          <h1 className="text-xl font-bold text-mine-text">Factor Lab</h1>
          <AnimatePresence mode="wait">
            <motion.p
              key={step}
              className="text-sm text-mine-muted text-center"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.3 }}
            >
              {currentStepData?.sub}
            </motion.p>
          </AnimatePresence>
        </div>

        {/* Terminal command block */}
        <div className="w-full">
          <div
            className="rounded-xl overflow-hidden border border-black/10"
            style={{ boxShadow: '0 4px 24px rgba(0,0,0,0.12)' }}
          >
            {/* Terminal header */}
            <div className="flex items-center gap-2 px-4 py-2 bg-[#2d2d2d] border-b border-white/5">
              <Terminal
                className="w-3.5 h-3.5 text-[#737373]"
                strokeWidth={1.5}
              />
              <span className="text-[11px] text-[#737373] font-medium">
                Terminal
              </span>
            </div>
            {/* Command body */}
            <div className="flex items-start gap-3 bg-[#1e1e1e] px-4 py-4">
              <span className="text-[13px] text-[#6ee7b7] font-mono shrink-0 leading-[22px]">
                $
              </span>
              <code className="flex-1 text-[13px] font-mono text-[#d4d4d4] leading-[22px] select-all break-all">
                {MARIMO_COMMAND}
              </code>
              <button
                type="button"
                onClick={handleCopy}
                className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg
                           bg-white/10 hover:bg-white/15 text-[11px] text-[#a3a3a3]
                           hover:text-white transition-colors cursor-pointer font-medium"
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

        {/* Status indicator */}
        <AnimatePresence mode="wait">
          {step === 'start' && !error && (
            <motion.div
              key="waiting"
              className="flex items-center gap-2 text-mine-muted"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="relative w-2 h-2">
                <div className="absolute inset-0 rounded-full bg-mine-muted/30 animate-ping" />
                <div className="absolute inset-0 rounded-full bg-mine-muted/50" />
              </div>
              <span className="text-xs">等待 Kernel 启动...</span>
            </motion.div>
          )}
          {step === 'connecting' && (
            <motion.div
              key="connecting"
              className="flex items-center gap-2 text-mine-nav-active"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Loader2
                className="w-3.5 h-3.5 animate-spin"
                strokeWidth={2}
                style={{ animationDuration: '1.5s' }}
              />
              <span className="text-xs font-medium">正在建立连接...</span>
            </motion.div>
          )}
          {error && (
            <motion.div
              key="error"
              className="flex flex-col items-center gap-2"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              <p className="text-xs text-mine-accent-red">{error}</p>
              <button
                type="button"
                onClick={onRetry}
                className="text-xs text-mine-accent-teal hover:underline cursor-pointer"
              >
                重试
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

/**
 * Orchestrates the Lab lifecycle with auto-detection:
 *
 * Step 1 (start): Show command, poll kernel every 2s
 * Step 2 (connecting): Kernel detected, establish session
 * Step 3 (ready): Brief flash, then transition to editor
 *
 * Shell collapse/expand is driven by the global labMode store.
 */
function LabOrchestrator() {
  const labMode = useLabModeStore((s) => s.mode);
  const setLabMode = useLabModeStore((s) => s.setMode);
  const [error, setError] = useState<string | null>(null);
  const [sessionKey, setSessionKey] = useState(0);
  const [connectStep, setConnectStep] = useState<ConnectStep>('start');
  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const connectingRef = useRef(false);

  // Reset connectStep when labMode goes back to idle (e.g. user clicked Disconnect)
  useEffect(() => {
    if (labMode === 'idle') {
      setConnectStep('start');
      setError(null);
      connectingRef.current = false;
    }
  }, [labMode]);

  // Reset labMode when this component unmounts (navigating away from lab)
  useEffect(() => {
    return () => {
      store.set(connectionAtom, { state: WebSocketState.NOT_STARTED });
      store.set(runtimeConfigAtom, DEFAULT_RUNTIME_CONFIG);
      useLabModeStore.getState().setMode('idle');
      if (pollingRef.current) clearInterval(pollingRef.current);
    };
  }, []);

  // Auto-detect kernel: poll every 2s when on step 'start'
  useEffect(() => {
    if (labMode !== 'idle' || connectStep !== 'start') return;

    const checkKernel = async () => {
      if (connectingRef.current) return;
      try {
        const res = await fetch(MARIMO_KERNEL_BASE, {
          method: 'HEAD',
          signal: AbortSignal.timeout(1500),
        });
        if (res.ok) {
          // Kernel is alive — auto-connect
          connectingRef.current = true;
          if (pollingRef.current) clearInterval(pollingRef.current);
          doConnect();
        }
      } catch {
        // Not running yet — keep polling
      }
    };

    // Check immediately, then every 2s
    checkKernel();
    pollingRef.current = setInterval(checkKernel, 2000);

    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current);
    };
  }, [labMode, connectStep]); // eslint-disable-line react-hooks/exhaustive-deps

  // Marimo <base> tag fix
  useEffect(() => {
    if (labMode !== 'active') return;

    const correctBase = () => {
      const base = document.querySelector('base');
      if (base && !base.href.startsWith(window.location.origin)) {
        base.href = `${window.location.origin}/`;
      }
    };

    correctBase();
    const observer = new MutationObserver(() => correctBase());
    observer.observe(document.head, {
      childList: true,
      subtree: true,
      attributes: true,
    });

    return () => {
      observer.disconnect();
      const base = document.querySelector('base');
      if (base) base.remove();
    };
  }, [labMode]);

  const doConnect = useCallback(async () => {
    setConnectStep('connecting');
    setLabMode('connecting');
    setError(null);

    try {
      const serverToken = await fetchServerToken();
      await takeoverSession(serverToken);

      store.set(initialModeAtom, 'edit');
      store.set(viewStateAtom, { mode: 'edit', cellAnchor: null });
      store.set(runtimeConfigAtom, {
        url: buildRuntimeURL(serverToken),
        lazy: false,
        serverToken,
      });
      store.set(requestClientAtom, resolveRequestClient());

      // Show "Ready" step briefly before transitioning
      setConnectStep('ready');
      await new Promise((r) => setTimeout(r, 800));

      setSessionKey((k) => k + 1);
      setLabMode('active');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to connect');
      setConnectStep('start');
      setLabMode('idle');
      connectingRef.current = false;
    }
  }, [setLabMode]);

  const handleRetry = useCallback(() => {
    setError(null);
    setConnectStep('start');
    connectingRef.current = false;
  }, []);

  if (labMode === 'idle' || labMode === 'connecting') {
    return (
      <ConnectScreen step={connectStep} error={error} onRetry={handleRetry} />
    );
  }

  // labMode === 'active' — render editor inline (no portal)
  return (
    <motion.div
      data-slot="lab-editor-inline"
      className="flex-1 flex flex-col overflow-hidden bg-mine-page-bg relative"
      initial={{ clipPath: 'circle(0% at 50% 50%)' }}
      animate={{ clipPath: 'circle(150% at 50% 50%)' }}
      transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
    >
      <Provider key={sessionKey} store={store}>
        <MarimoErrorBoundary>
          <Suspense>
            <SlotzProvider controller={slotsController}>
              <TooltipProvider>
                <AppChrome>
                  <LabEditor />
                </AppChrome>
              </TooltipProvider>
            </SlotzProvider>
          </Suspense>
        </MarimoErrorBoundary>
      </Provider>
    </motion.div>
  );
}

export function LabPage() {
  return (
    <ErrorBoundary
      fallback={(error) => (
        <FeatureErrorFallback error={error} featureName="Lab" />
      )}
    >
      <AnimateHeavy
        delay={0.1}
        className="flex-1 flex flex-col overflow-hidden h-full relative"
      >
        <LabOrchestrator />
      </AnimateHeavy>
    </ErrorBoundary>
  );
}
