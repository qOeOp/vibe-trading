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
import {
  FlaskConical,
  Terminal,
  Check,
  Loader2,
  Copy,
  FileCode2,
  Database,
  BarChart3,
  ChevronRight,
  Lock,
  Share,
  Plus,
  Columns2,
  ChevronDown,
  File,
  Play,
} from 'lucide-react';
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

const MARIMO_COMMAND = `marimo edit --headless --port ${MARIMO_KERNEL_PORT} --no-token --allow-origins "http://localhost:4200"`;

const EASE = [0.25, 0.1, 0.25, 1] as const;

/** Browser-style device frame — AlignUI landing page pattern */
function DeviceFrame() {
  const FILE_TREE = [
    { name: 'vt-lab.py', active: true },
    { name: 'backtest.py', active: false },
    { name: 'factor_lib.py', active: false },
    { name: 'universe.py', active: false },
  ];

  return (
    <div
      data-slot="device-frame"
      className="w-full max-w-[600px] rounded-xl border border-black/8 overflow-hidden"
      style={{
        boxShadow: '0 8px 40px rgba(0,0,0,0.10), 0 2px 8px rgba(0,0,0,0.04)',
      }}
    >
      {/* ── Browser chrome: traffic lights + address bar + actions ── */}
      <div className="flex items-center gap-3 px-3.5 py-2 bg-[#f5f5f5] border-b border-black/5">
        <div className="flex items-center gap-1.5">
          <div className="w-[10px] h-[10px] rounded-full bg-[#ff5f57]" />
          <div className="w-[10px] h-[10px] rounded-full bg-[#febc2e]" />
          <div className="w-[10px] h-[10px] rounded-full bg-[#28c840]" />
        </div>
        {/* Address bar */}
        <div className="flex-1 flex items-center justify-center gap-1.5 bg-white rounded-md px-3 py-1 border border-black/6">
          <Lock className="w-3 h-3 text-[#999]" strokeWidth={2} />
          <span className="text-[11px] text-[#666] font-medium">
            vibe-trading.app/lab
          </span>
        </div>
        {/* Window actions */}
        <div className="flex items-center gap-1.5">
          <Share className="w-3 h-3 text-[#bbb]" strokeWidth={1.5} />
          <Plus className="w-3 h-3 text-[#bbb]" strokeWidth={1.5} />
          <Columns2 className="w-3 h-3 text-[#bbb]" strokeWidth={1.5} />
        </div>
      </div>

      {/* ── Tab bar ── */}
      <div className="flex items-center bg-[#2d2d2d] px-2 pt-1.5 border-b border-white/5">
        <div className="flex items-center gap-1 px-3 py-1.5 bg-[#1e1e1e] rounded-t-md text-[11px] text-[#ccc] font-medium">
          <FileCode2 className="w-3 h-3 text-[#888]" strokeWidth={1.5} />
          vt-lab.py
        </div>
        <div className="flex items-center gap-1 px-3 py-1.5 text-[11px] text-[#666] font-medium">
          <Play className="w-3 h-3 text-[#555]" strokeWidth={1.5} />
          preview
        </div>
      </div>

      {/* ── Body: file tree + code area ── */}
      <div className="flex bg-[#1e1e1e]">
        {/* File tree sidebar */}
        <div className="w-[140px] shrink-0 border-r border-white/5 pt-2 pb-3">
          <div className="flex items-center gap-1 px-3 py-1 text-[11px] text-[#888] font-medium">
            <ChevronDown className="w-3 h-3" strokeWidth={2} />
            notebooks
          </div>
          {FILE_TREE.map((f) => (
            <div
              key={f.name}
              className={`flex items-center gap-1.5 px-3 py-1 ml-2 text-[11px] ${
                f.active ? 'text-[#e0e0e0] bg-white/5 rounded' : 'text-[#666]'
              }`}
            >
              <File className="w-3 h-3 shrink-0" strokeWidth={1.5} />
              <span className="truncate">{f.name}</span>
            </div>
          ))}
        </div>

        {/* Code area */}
        <div className="flex-1 min-w-0 relative">
          <div className="px-4 pt-3 pb-0 font-mono text-[12px] leading-[20px]">
            {/* Line 1 */}
            <div className="flex">
              <span className="w-6 shrink-0 text-right mr-3 text-[#555] select-none">
                1
              </span>
              <span>
                <span className="text-purple-400">import</span>
                <span className="text-[#d4d4d4]"> ak</span>
              </span>
            </div>
            {/* Line 2 */}
            <div className="flex">
              <span className="w-6 shrink-0 text-right mr-3 text-[#555] select-none">
                2
              </span>
              <span>
                <span className="text-[#9cdcfe]">df</span>
                <span className="text-[#d4d4d4]"> = </span>
                <span className="text-[#9cdcfe]">ak</span>
                <span className="text-[#d4d4d4]">.</span>
                <span className="text-[#dcdcaa]">stock_zh_a_hist</span>
                <span className="text-[#d4d4d4]">(</span>
                <span className="text-[#ce9178]">&quot;000001&quot;</span>
                <span className="text-[#d4d4d4]">)</span>
              </span>
            </div>
            {/* Line 3 */}
            <div className="flex">
              <span className="w-6 shrink-0 text-right mr-3 text-[#555] select-none">
                3
              </span>
              <span>
                <span className="text-[#9cdcfe]">factor</span>
                <span className="text-[#d4d4d4]"> = </span>
                <span className="text-[#9cdcfe]">df</span>
                <span className="text-[#d4d4d4]">[</span>
                <span className="text-[#ce9178]">&apos;close&apos;</span>
                <span className="text-[#d4d4d4]">].</span>
                <span className="text-[#dcdcaa]">pct_change</span>
                <span className="text-[#d4d4d4]">(20)</span>
              </span>
            </div>
            {/* Line 4 — empty */}
            <div className="flex">
              <span className="w-6 shrink-0 text-right mr-3 text-[#555] select-none">
                4
              </span>
              <span>&nbsp;</span>
            </div>
            {/* Line 5 */}
            <div className="flex">
              <span className="w-6 shrink-0 text-right mr-3 text-[#555] select-none">
                5
              </span>
              <span>
                <span className="text-[#9cdcfe]">mo</span>
                <span className="text-[#d4d4d4]">.</span>
                <span className="text-[#9cdcfe]">ui</span>
                <span className="text-[#d4d4d4]">.</span>
                <span className="text-[#dcdcaa]">table</span>
                <span className="text-[#d4d4d4]">(</span>
                <span className="text-[#9cdcfe]">df</span>
                <span className="text-[#d4d4d4]">.</span>
                <span className="text-[#dcdcaa]">head</span>
                <span className="text-[#d4d4d4]">())</span>
              </span>
            </div>
          </div>

          {/* DataFrame table preview */}
          <div className="px-4 pt-3 pb-4">
            <div className="rounded border border-white/8 overflow-hidden">
              <div className="bg-white/5 px-2.5 py-1 flex items-center gap-2 text-[10px] text-[#777] font-medium border-b border-white/5">
                <span>DataFrame</span>
                <span className="text-[#555]">2640 × 5</span>
              </div>
              <table className="w-full text-[11px] font-mono border-collapse">
                <thead>
                  <tr className="text-[#888] border-b border-white/8">
                    <th className="py-1 px-2 text-left font-medium">date</th>
                    <th className="py-1 px-2 text-right font-medium">open</th>
                    <th className="py-1 px-2 text-right font-medium">close</th>
                    <th className="py-1 px-2 text-right font-medium">high</th>
                    <th className="py-1 px-2 text-right font-medium">low</th>
                  </tr>
                </thead>
                <tbody className="text-[#c0c0c0]">
                  <tr className="border-b border-white/5">
                    <td className="py-1 px-2">2024-01-02</td>
                    <td className="py-1 px-2 text-right">9.82</td>
                    <td className="py-1 px-2 text-right">9.91</td>
                    <td className="py-1 px-2 text-right">9.95</td>
                    <td className="py-1 px-2 text-right">9.78</td>
                  </tr>
                  <tr className="border-b border-white/5">
                    <td className="py-1 px-2">2024-01-03</td>
                    <td className="py-1 px-2 text-right">9.88</td>
                    <td className="py-1 px-2 text-right">9.75</td>
                    <td className="py-1 px-2 text-right">9.92</td>
                    <td className="py-1 px-2 text-right">9.71</td>
                  </tr>
                  <tr>
                    <td className="py-1 px-2">2024-01-04</td>
                    <td className="py-1 px-2 text-right">9.73</td>
                    <td className="py-1 px-2 text-right">9.80</td>
                    <td className="py-1 px-2 text-right">9.85</td>
                    <td className="py-1 px-2 text-right">9.68</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Gradient fade at bottom */}
          <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[#1e1e1e] to-transparent pointer-events-none" />
        </div>
      </div>
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
  const [commandOpen, setCommandOpen] = useState(false);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(MARIMO_COMMAND);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, []);

  return (
    <div
      data-slot="connect-screen"
      className="flex-1 flex flex-col items-center justify-start pt-[8vh] px-8 gap-6"
    >
      {/* ═══ Device Frame ═══ */}
      <motion.div
        initial={{ opacity: 0, y: 20, filter: 'blur(8px)' }}
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        transition={{ duration: 0.7, ease: EASE }}
      >
        <DeviceFrame />
      </motion.div>

      {/* ═══ CTA Area ═══ */}
      <motion.div
        className="flex flex-col items-center gap-4 max-w-lg w-full"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: EASE, delay: 0.2 }}
      >
        {/* Icon + heading + CTA button */}
        <div className="flex flex-col items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-mine-nav-active/8 flex items-center justify-center">
            <FlaskConical
              className="w-5 h-5 text-mine-nav-active"
              strokeWidth={1.5}
            />
          </div>
          <h1 className="text-lg font-bold text-mine-text">Try live editor</h1>
          <p className="text-sm text-mine-muted">
            连接本地 Kernel 开始因子研究
          </p>
          {/* Dark CTA button — Figma AlignUI style */}
          <AnimatePresence mode="wait">
            {step === 'start' && !error && (
              <motion.div
                key="cta"
                className="flex items-center gap-2 px-5 py-2.5 bg-mine-nav-active text-white text-sm font-medium rounded-lg shadow-sm mt-1"
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
              >
                <div className="relative w-2 h-2 mr-1">
                  <div className="absolute inset-0 rounded-full bg-white/40 animate-ping" />
                  <div className="absolute inset-0 rounded-full bg-white/70" />
                </div>
                Waiting for kernel
                <ChevronRight className="w-4 h-4 opacity-60" strokeWidth={2} />
              </motion.div>
            )}
            {step === 'connecting' && (
              <motion.div
                key="connecting-btn"
                className="flex items-center gap-2 px-5 py-2.5 bg-mine-accent-teal text-white text-sm font-medium rounded-lg shadow-sm mt-1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
              >
                <Loader2
                  className="w-4 h-4 animate-spin"
                  strokeWidth={2}
                  style={{ animationDuration: '1.5s' }}
                />
                Connecting...
              </motion.div>
            )}
            {step === 'ready' && (
              <motion.div
                key="ready-btn"
                className="flex items-center gap-2 px-5 py-2.5 bg-mine-accent-green text-white text-sm font-medium rounded-lg shadow-sm mt-1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
              >
                <Check className="w-4 h-4" strokeWidth={2} />
                Entering editor...
              </motion.div>
            )}
            {error && (
              <motion.div
                key="error-cta"
                className="flex flex-col items-center gap-2 mt-1"
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                <p className="text-xs text-mine-accent-red">{error}</p>
                <button
                  type="button"
                  onClick={onRetry}
                  className="flex items-center gap-1.5 px-4 py-2 bg-mine-nav-active text-white text-sm font-medium rounded-lg hover:bg-mine-nav-active/90 transition-colors cursor-pointer"
                >
                  Retry
                  <ChevronRight
                    className="w-4 h-4 opacity-60"
                    strokeWidth={2}
                  />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Collapsible terminal command */}
        <details
          className="w-full max-w-md"
          open={commandOpen}
          onToggle={(e) =>
            setCommandOpen((e.target as HTMLDetailsElement).open)
          }
        >
          <summary className="flex items-center justify-center gap-1.5 text-xs text-mine-muted cursor-pointer hover:text-mine-text transition-colors select-none">
            <Terminal className="w-3 h-3" strokeWidth={1.5} />
            <span>启动命令</span>
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
                  {MARIMO_COMMAND}
                </code>
                <button
                  type="button"
                  onClick={handleCopy}
                  className="shrink-0 flex items-center gap-1.5 px-2.5 py-1 rounded-md
                             bg-white/10 hover:bg-white/15 text-[10px] text-[#a3a3a3]
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
        </details>
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
