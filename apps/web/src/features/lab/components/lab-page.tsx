'use client';

// ── Marimo CSS (must load before components) ──
import '../css/marimo-vars.css';
import '../css/index.css';
import '../css/app.css';
import '../css/outputs.css';
import '../css/cell-status.css';

// Must run at module scope (not in useEffect) — custom elements must be
// defined before the browser parses any marimo output HTML in the DOM.
import { initializePlugins } from '../plugins/plugins';
initializePlugins();

import { Provider } from 'jotai';
import { Provider as SlotzProvider } from '@marimo-team/react-slotz';
import { TooltipProvider } from '@radix-ui/react-tooltip';
import { Suspense, useCallback, useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
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
import { MineAppChrome } from './shell/mine-app-chrome';
import { EditApp } from '../core/edit-app';
import { connectionAtom } from '../core/network/connection';
import { store } from '../core/state/jotai';
import { WebSocketState } from '../core/websocket/types';
import { getSessionId } from '../core/kernel/session';
import { useLabModeStore } from '../store/use-lab-mode-store';
import { useLabFileTabStore } from '../store/use-lab-file-tab-store';

// Shell components
import { ChromeHeader, type ConnectStep } from './shell/chrome-header';
import { ActivityBar } from './shell/activity-bar';
import { LeftBar } from './shell/left-bar';
import { PanelSlot } from './shell/panel-slot';
import { CTAOverlay } from './shell/cta-overlay';
import { ContentFrame } from './shell/content-frame';
import { MineCell } from './shell/mine-cell';
import { MineCodeEditor } from './shell/mine-code-editor';
import { MineTabBar } from './shell/mine-tab-bar';
import { useRunAllCells } from './editor/cell/useRunCells';
import { useLabChromeStore } from '../store/use-lab-chrome-store';
import { ModalProvider } from './modal/ImperativeModal';

// ─── Constants ────────────────────────────────────────────

import { MARIMO_KERNEL_BASE } from '../constants';

const EASE = [0.25, 0.1, 0.25, 1] as const;
const HEARTBEAT_INTERVAL_MS = 30_000; // 30 seconds
const VT_USER_ID = 'root'; // TODO: auth — replace with real userId from auth system
const VT_SESSION_KEY = 'vt-lab-session'; // TODO: auth — include userId in key

const FRAME_SHADOW =
  '0px 12px 12px -6px rgba(41,41,41,0.04), 0px 24px 24px -12px rgba(41,41,41,0.04), 0px 48px 48px -24px rgba(41,41,41,0.04), 0px 0px 0px 1px var(--color-mine-border)';

// ─── Jotai Scope ────────────────────────────────────────
//
// Conditionally wraps children in jotai Provider with marimo store.
// When `active` is false, renders children without Provider so
// disconnected-mode panels don't hit "atom not set" errors.

function JotaiScope({
  active,
  children,
}: {
  active: boolean;
  children: React.ReactNode;
}) {
  if (active) {
    return <Provider store={store}>{children}</Provider>;
  }
  return <>{children}</>;
}

// ─── Marimo Connection Helpers ────────────────────────────

function buildRuntimeURL(notebookPath: string): string {
  const url = new URL(MARIMO_KERNEL_BASE);
  url.searchParams.set('file', notebookPath);
  return url.toString();
}

async function takeoverSession(notebookPath: string): Promise<void> {
  try {
    const url = new URL(`${MARIMO_KERNEL_BASE}/api/kernel/takeover`);
    url.searchParams.set('file', notebookPath);
    await fetch(url.toString(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Marimo-Session-Id': getSessionId(),
      },
    });
  } catch {
    // Kernel not running — will fail at WebSocket connect instead
  }
}

// ─── Marimo Editor ────────────────────────────────────────

function LabEditor() {
  const [userConfig] = useResolvedMarimoConfig();
  const [appConfig] = useAppConfig();
  return <EditApp userConfig={userConfig} appConfig={appConfig} />;
}

// ─── Static IDE Content (disconnected state) ──────────────

/** Python source for cell 1 (imports & factor definitions) */
const CELL_1_CODE = `import marimo as mo
import numpy as np
import pandas as pd
import plotly.graph_objects as go

np.random.seed(42)

# ─── Factor definitions ────────────────────────────────
FACTORS = {
    "Mom_20D": {"cat": "动量", "ic_mu": 0.032, "ic_std": 0.028, "turnover": 0.42, "capacity": 85},
    "EP":      {"cat": "价值", "ic_mu": 0.045, "ic_std": 0.035, "turnover": 0.15, "capacity": 120},
    "ROE_TTM": {"cat": "质量", "ic_mu": 0.038, "ic_std": 0.022, "turnover": 0.18, "capacity": 95},
    "Vol_20D": {"cat": "波动率", "ic_mu": -0.025, "ic_std": 0.030, "turnover": 0.35, "capacity": 70},
    "North_Flow": {"cat": "资金流", "ic_mu": 0.028, "ic_std": 0.032, "turnover": 0.55, "capacity": 45},
}`;

/** Python source for cell 2 (helper functions) */
const CELL_2_CODE = `def gen_ic_series(mu, std, n=240):
    """Mean-reverting IC series via AR(1)"""
    ic = np.zeros(n)
    ic[0] = mu
    for i in range(1, n):
        ic[i] = 0.7 * ic[i - 1] + 0.3 * mu + std * np.random.randn()
    return ic

def gen_quintile_returns(ic_mu, n=240):
    """5-quantile cumulative returns driven by factor IC"""
    spreads = np.linspace(-1, 1, 5) * abs(ic_mu) * 8
    daily = np.zeros((n, 5))
    for q in range(5):
        daily[:, q] = spreads[q] / 240 + np.random.randn(n) * 0.015
    return np.cumsum(daily, axis=0)

def gen_ic_decay(ic_mu):
    """IC decay from T+1 to T+20"""
    lags = np.arange(1, 21)
    return ic_mu * np.exp(-0.12 * lags) + np.random.randn(20) * 0.003

POOL_NAMES = ["全A", "沪深300", "中证500", "中证1000"]
POOL_SCALES = [1.0, 0.75, 1.15, 1.30]`;

/** Editor cells — center column content when disconnected */
function StaticEditorContent() {
  return (
    <ContentFrame
      header={<MineTabBar />}
      className="flex-1 min-w-0"
      bodyClassName="overflow-y-auto p-2"
    >
      {/* Cell 1: imports & factor definitions */}
      <MineCell disabled className="mt-1">
        <MineCodeEditor code={CELL_1_CODE} readOnly />
      </MineCell>

      {/* Cell 2: helper functions */}
      <MineCell flex disabled className="mt-1">
        <MineCodeEditor code={CELL_2_CODE} readOnly />
      </MineCell>
    </ContentFrame>
  );
}

// ─── Action Bridge (jotai → zustand) ─────────────────────

function ActionBridge() {
  const runAll = useRunAllCells();
  const toggleSidebar = useLabChromeStore((s) => s.toggleSidebar);
  const setActions = useLabModeStore((s) => s.setActions);

  useEffect(() => {
    setActions({
      runAll,
      openSettings: toggleSidebar,
    });
    return () => setActions({ runAll: null, openSettings: null });
  }, [runAll, toggleSidebar, setActions]);

  return null;
}

// ─── Live IDE Content (connected state) ───────────────────

function LiveIDEBody({ sessionKey }: { sessionKey: number }) {
  return (
    <Provider key={sessionKey} store={store}>
      <MarimoErrorBoundary>
        <Suspense>
          <SlotzProvider controller={slotsController}>
            <TooltipProvider>
              <ModalProvider>
                <ActionBridge />
                <MineAppChrome>
                  <LabEditor />
                </MineAppChrome>
              </ModalProvider>
            </TooltipProvider>
          </SlotzProvider>
        </Suspense>
      </MarimoErrorBoundary>
    </Provider>
  );
}

// ─── Lab Orchestrator (unified shell) ─────────────────────

function LabOrchestrator() {
  const searchParams = useSearchParams();
  // `file` param is an encoded absolute path to a .py notebook (e.g. from Library "在Lab中编辑")
  const fileParam = searchParams.get('file') ?? null;

  const labMode = useLabModeStore((s) => s.mode);
  const setLabMode = useLabModeStore((s) => s.setMode);
  const leftPanel = useLabModeStore((s) => s.leftPanel);
  const rightPanel = useLabModeStore((s) => s.rightPanel);
  const togglePanel = useLabModeStore((s) => s.togglePanel);
  const bridgedActions = useLabModeStore((s) => s.actions);
  const [error, setError] = useState<string | null>(null);
  const [sessionKey, setSessionKey] = useState(0);
  const [connectStep, setConnectStep] = useState<ConnectStep>('start');
  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const connectingRef = useRef(false);

  const isConnected = labMode === 'active';

  const handleCloseRight = useCallback(() => {
    const rp = useLabModeStore.getState().rightPanel;
    if (rp) togglePanel(rp);
  }, [togglePanel]);

  // Reset connectStep when labMode goes back to idle
  useEffect(() => {
    if (labMode === 'idle') {
      setConnectStep('start');
      setError(null);
      connectingRef.current = false;
      autoConnectFiredRef.current = false;
    }
  }, [labMode]);

  // Reset labMode when this component unmounts (navigating away from lab)
  useEffect(() => {
    return () => {
      store.set(connectionAtom, { state: WebSocketState.NOT_STARTED });
      store.set(runtimeConfigAtom, DEFAULT_RUNTIME_CONFIG);
      useLabModeStore.getState().setMode('idle');
      useLabFileTabStore.getState().reset();
      if (pollingRef.current) clearInterval(pollingRef.current);
    };
  }, []);

  // Heartbeat: keep session alive while connected
  useEffect(() => {
    if (labMode !== 'active') return;

    const heartbeat = setInterval(() => {
      fetch(`${MARIMO_KERNEL_BASE}/api/sessions/heartbeat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: VT_USER_ID }), // TODO: auth
        signal: AbortSignal.timeout(5000),
      }).catch(() => {
        // Server unreachable — will be caught by WebSocket disconnect
      });
    }, HEARTBEAT_INTERVAL_MS);

    return () => clearInterval(heartbeat);
  }, [labMode]);

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

  const doConnect = useCallback(
    async (workspacePath: string, notebookPath: string) => {
      setConnectStep('connecting');
      setLabMode('connecting');
      setError(null);

      try {
        // Workspace already bootstrapped by /api/sessions/connect
        useLabModeStore.getState().setWorkspace(workspacePath, notebookPath);

        await takeoverSession(notebookPath);

        store.set(initialModeAtom, 'edit');
        store.set(viewStateAtom, { mode: 'edit', cellAnchor: null });
        store.set(runtimeConfigAtom, {
          url: buildRuntimeURL(notebookPath),
          lazy: false,
          serverToken: '',
        });
        store.set(requestClientAtom, resolveRequestClient());

        // Show "Ready" step briefly before transitioning
        setConnectStep('ready');
        await new Promise((r) => setTimeout(r, 800));

        // Persist session info for fast reconnect after page refresh
        try {
          localStorage.setItem(
            VT_SESSION_KEY,
            JSON.stringify({ userId: VT_USER_ID, workspacePath, notebookPath }),
          );
        } catch {
          // localStorage unavailable — non-fatal
        }

        setSessionKey((k) => k + 1);
        setLabMode('active');
        setConnectStep('connected');
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Failed to connect');
        setConnectStep('start');
        setLabMode('idle');
        connectingRef.current = false;
      }
    },
    [setLabMode],
  );

  // Manual connect: user clicks CTA → poll until backend responds
  // If `fileParam` is present (from ?file= query), use it as the notebookPath
  // override so the specified notebook opens instead of the default workspace one.
  const handleConnect = useCallback(() => {
    if (connectingRef.current || labMode !== 'idle') return;
    setConnectStep('connecting');

    const tryConnect = async () => {
      if (connectingRef.current) return; // guard against overlapping poll responses
      try {
        const res = await fetch(`${MARIMO_KERNEL_BASE}/api/sessions/connect`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: VT_USER_ID }), // TODO: auth
          signal: AbortSignal.timeout(2000),
        });
        if (res.ok) {
          const session: { workspacePath: string; notebookPath: string } =
            await res.json();
          connectingRef.current = true;
          if (pollingRef.current) clearInterval(pollingRef.current);
          // Override notebookPath with ?file= param when present.
          // Validate: must end with .py and must not contain path traversal sequences.
          const notebookPath =
            fileParam && fileParam.endsWith('.py') && !fileParam.includes('..')
              ? fileParam
              : session.notebookPath;
          doConnect(session.workspacePath, notebookPath);
        }
      } catch {
        // Service not running yet — keep polling
      }
    };

    tryConnect();
    pollingRef.current = setInterval(tryConnect, 2000);
  }, [labMode, doConnect, fileParam]);

  // Auto-connect when ?file= param is present so the specified notebook opens
  // without requiring the user to click the CTA manually.
  const autoConnectFiredRef = useRef(false);
  useEffect(() => {
    if (fileParam && labMode === 'idle' && !autoConnectFiredRef.current) {
      autoConnectFiredRef.current = true;
      handleConnect();
    }
  }, [fileParam, labMode, handleConnect]);

  const handleRetry = useCallback(() => {
    setError(null);
    setConnectStep('start');
    connectingRef.current = false;
  }, []);

  const handleDisconnect = useCallback(() => {
    if (isConnected) {
      if (pollingRef.current) clearInterval(pollingRef.current);
      store.set(connectionAtom, { state: WebSocketState.NOT_STARTED });
      store.set(runtimeConfigAtom, DEFAULT_RUNTIME_CONFIG);
      useLabFileTabStore.getState().reset();

      // Notify backend of disconnect (fire-and-forget)
      fetch(`${MARIMO_KERNEL_BASE}/api/sessions/disconnect`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: VT_USER_ID }), // TODO: auth
      }).catch(() => undefined);
      try {
        localStorage.removeItem(VT_SESSION_KEY);
      } catch {
        // localStorage unavailable
      }

      connectingRef.current = false;
      setLabMode('idle');
    }
  }, [isConnected, setLabMode]);

  return (
    <div
      data-slot="lab-shell"
      className="flex-1 flex flex-col overflow-hidden relative"
    >
      {/* ═══ Device Frame (fills all available height) ═══ */}
      <motion.div
        className="flex-1 min-h-0 relative py-3"
        initial={{ opacity: 0, y: 20, filter: 'blur(8px)' }}
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        transition={{ duration: 0.7, ease: EASE }}
      >
        <div
          className="h-full overflow-hidden rounded-[28px] bg-mine-hover relative flex flex-col font-sans"
          style={{ boxShadow: FRAME_SHADOW }}
        >
          {/* Inner highlight */}
          <div
            className="absolute inset-0 rounded-[inherit] pointer-events-none z-10"
            style={{ boxShadow: 'inset 0px 1px 2px rgba(255,255,255,0.12)' }}
          />

          {/* Chrome header — full width */}
          <ChromeHeader
            step={connectStep}
            isConnected={isConnected}
            onRunAll={bridgedActions.runAll ?? undefined}
            onDisconnect={handleDisconnect}
            onOpenSettings={bridgedActions.openSettings ?? undefined}
          />

          {/* IDE Body — LeftBar | PanelSlot(left) | content | PanelSlot(right) | ActivityBar */}
          <div className="flex bg-mine-hover flex-1 min-h-0 gap-2 p-2 pt-0">
            {/* Left icon bar */}
            <LeftBar />

            {/* Left panel slot — unified across connected/disconnected.
                Wrapped in jotai Provider when connected so panel content
                (e.g. ConnectedFileTree) can access requestClientAtom. */}
            <JotaiScope active={isConnected}>
              <PanelSlot
                side="left"
                panelId={leftPanel}
                isConnected={isConnected}
                onClose={() => {
                  if (leftPanel) togglePanel(leftPanel);
                }}
              />
            </JotaiScope>

            <AnimatePresence mode="wait">
              {isConnected ? (
                <motion.div
                  key="live"
                  className="flex-1 min-w-0 flex"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <LiveIDEBody sessionKey={sessionKey} />
                </motion.div>
              ) : (
                <motion.div
                  key="static"
                  className="flex-1 min-w-0 flex"
                  initial={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <StaticEditorContent />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Right panel slot — unified across connected/disconnected */}
            <JotaiScope active={isConnected}>
              <PanelSlot
                side="right"
                panelId={rightPanel}
                isConnected={isConnected}
                onClose={handleCloseRight}
              />
            </JotaiScope>

            {/* Activity bar — always present */}
            <ActivityBar />
          </div>
        </div>

        {/* ═══ CTA Overlay — only when disconnected ═══ */}
        <AnimatePresence>
          {!isConnected && (
            <motion.div
              key="cta"
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <CTAOverlay
                step={connectStep}
                error={error}
                onConnect={handleConnect}
                onRetry={handleRetry}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

// ─── Page Export ───────────────────────────────────────────

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
