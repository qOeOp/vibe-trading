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
import { motion, AnimatePresence } from 'motion/react';
import { AnimateHeavy } from '@/components/animation';
import { StatisticsSection } from '@/features/library/components/factor-detail/statistics-section';
import { QuantileCumulativeReturnsSection } from '@/features/library/components/factor-detail/charts/quantile-cumulative-returns';
import { getLibraryFactors } from '@/features/library/data/mock-library';
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
import { SidePanel } from './shell/side-panel';
import { CTAOverlay } from './shell/cta-overlay';
import { MineCell } from './shell/mine-cell';
import { MineCodeEditor } from './shell/mine-code-editor';
import { MineFileTree } from './shell/mine-file-tree';
import { MineTabBar } from './shell/mine-tab-bar';
import { useRunAllCells } from './editor/cell/useRunCells';
import { useChromeActions } from './editor/chrome/state';

// ─── Constants ────────────────────────────────────────────

import { MARIMO_KERNEL_BASE } from '../constants';

const EASE = [0.25, 0.1, 0.25, 1] as const;
const HEARTBEAT_INTERVAL_MS = 30_000; // 30 seconds
const VT_USER_ID = 'root'; // TODO: auth — replace with real userId from auth system
const VT_SESSION_KEY = 'vt-lab-session'; // TODO: auth — include userId in key

const FRAME_SHADOW =
  '0px 12px 12px -6px rgba(41,41,41,0.04), 0px 24px 24px -12px rgba(41,41,41,0.04), 0px 48px 48px -24px rgba(41,41,41,0.04), 0px 0px 0px 1px #d4d4d4';

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

const PREVIEW_FACTOR = getLibraryFactors()[0];

function FactorPreviewPanel() {
  return (
    <div data-slot="factor-preview-panel">
      <StatisticsSection factor={PREVIEW_FACTOR} />
      <QuantileCumulativeReturnsSection factor={PREVIEW_FACTOR} />
    </div>
  );
}

/** Python source for cell 1 (imports & data) */
const CELL_1_CODE = `import marimo as mo
import akshare as ak
import pandas as pd

df = ak.stock_zh_a_hist("000001")
factor = df['close'].pct_change(20)

# 计算 IC 衰减`;

/** Python source for cell 2 (analysis) */
const CELL_2_CODE = `ic_series = factor.corr(df['close'].shift(-1))

mo.ui.table(df.head())`;

/** File tree — shown in disconnected left column */
function StaticFileTree() {
  const fileTreeVisible = useLabModeStore((s) => s.fileTreeVisible);
  if (!fileTreeVisible) return null;
  return <MineFileTree />;
}

/** Editor cells + factor sidebar — center column content when disconnected */
function StaticEditorContent() {
  return (
    <>
      {/* Editor (tabs + cells) */}
      <div className="flex-1 min-w-0 flex flex-col overflow-y-auto relative">
        <MineTabBar />

        {/* Cell 1: imports & setup */}
        <MineCell disabled className="mt-1">
          <MineCodeEditor code={CELL_1_CODE} readOnly />
        </MineCell>

        {/* Cell 2: main logic */}
        <MineCell flex disabled className="mt-1">
          <MineCodeEditor code={CELL_2_CODE} readOnly />
        </MineCell>
      </div>

      {/* Factor analytics sidebar */}
      <div className="w-[400px] shrink-0 overflow-y-auto relative bg-white rounded-lg shadow-sm">
        <FactorPreviewPanel />
      </div>
    </>
  );
}

// ─── Action Bridge (jotai → zustand) ─────────────────────

function ActionBridge() {
  const runAll = useRunAllCells();
  const { toggleSidebarPanel } = useChromeActions();
  const setActions = useLabModeStore((s) => s.setActions);

  useEffect(() => {
    setActions({
      runAll,
      openSettings: toggleSidebarPanel,
    });
    return () => setActions({ runAll: null, openSettings: null });
  }, [runAll, toggleSidebarPanel, setActions]);

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
              <ActionBridge />
              <MineAppChrome>
                <LabEditor />
              </MineAppChrome>
            </TooltipProvider>
          </SlotzProvider>
        </Suspense>
      </MarimoErrorBoundary>
    </Provider>
  );
}

// ─── Lab Orchestrator (unified shell) ─────────────────────

function LabOrchestrator() {
  const labMode = useLabModeStore((s) => s.mode);
  const setLabMode = useLabModeStore((s) => s.setMode);
  const toggleFileTree = useLabModeStore((s) => s.toggleFileTree);
  const bridgedActions = useLabModeStore((s) => s.actions);
  const [error, setError] = useState<string | null>(null);
  const [sessionKey, setSessionKey] = useState(0);
  const [connectStep, setConnectStep] = useState<ConnectStep>('start');
  const [activePanel, setActivePanel] = useState<string | null>(null);
  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const connectingRef = useRef(false);

  const isConnected = labMode === 'active';

  const handlePanelToggle = useCallback((panelId: string) => {
    setActivePanel((prev) => (prev === panelId ? null : panelId));
  }, []);

  const handlePanelClose = useCallback(() => {
    setActivePanel(null);
  }, []);

  // Reset connectStep when labMode goes back to idle
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
          doConnect(session.workspacePath, session.notebookPath);
        }
      } catch {
        // Service not running yet — keep polling
      }
    };

    tryConnect();
    pollingRef.current = setInterval(tryConnect, 2000);
  }, [labMode, doConnect]);

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
          className="h-full overflow-hidden rounded-[26px] relative flex flex-col font-sans"
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
            onToggleFileTree={toggleFileTree}
            onRunAll={bridgedActions.runAll ?? undefined}
            onDisconnect={handleDisconnect}
            onOpenSettings={bridgedActions.openSettings ?? undefined}
          />

          {/* IDE Body — 3-column layout */}
          <div className="flex bg-mine-bg flex-1 min-h-0 gap-2 p-2 pt-0">
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
                  className="flex-1 min-w-0 flex gap-2"
                  initial={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <StaticFileTree />
                  <StaticEditorContent />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Side panel — push-aside, between editor and activity bar */}
            <SidePanel
              panelId={activePanel}
              onClose={handlePanelClose}
              isConnected={isConnected}
            />

            {/* Activity bar — always present */}
            <ActivityBar
              activePanel={activePanel}
              onPanelToggle={handlePanelToggle}
            />
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
