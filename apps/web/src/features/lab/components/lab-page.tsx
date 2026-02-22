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

const MARIMO_KERNEL_PORT = 2728;
const MARIMO_KERNEL_BASE = `http://localhost:${MARIMO_KERNEL_PORT}`;
const DEFAULT_NOTEBOOK = '/tmp/vt-lab.py';
const EASE = [0.25, 0.1, 0.25, 1] as const;

const FRAME_SHADOW =
  '0px 12px 12px -6px rgba(41,41,41,0.04), 0px 24px 24px -12px rgba(41,41,41,0.04), 0px 48px 48px -24px rgba(41,41,41,0.04), 0px 0px 0px 1px #d4d4d4';

// ─── Marimo Connection Helpers ────────────────────────────

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

/** Static IDE content — shown when disconnected */
function StaticIDEBody() {
  const fileTreeVisible = useLabModeStore((s) => s.fileTreeVisible);

  return (
    <>
      {/* Column 1: File tree (toggle via chrome header Menu) */}
      {fileTreeVisible && <MineFileTree />}

      {/* Column 2: Editor (tabs + cells) */}
      <div className="flex-1 min-w-0 flex flex-col ml-2 gap-2 overflow-y-auto">
        <MineTabBar />

        {/* Cell 1: imports & setup */}
        <MineCell disabled>
          <MineCodeEditor code={CELL_1_CODE} readOnly />
        </MineCell>

        {/* Cell 2: main logic */}
        <MineCell flex disabled>
          <MineCodeEditor code={CELL_2_CODE} readOnly />
        </MineCell>
      </div>

      {/* Column 3: Factor analytics sidebar */}
      <div className="w-[400px] shrink-0 overflow-y-auto relative bg-white rounded-lg shadow-sm ml-2">
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
  const fileTreeVisible = useLabModeStore((s) => s.fileTreeVisible);
  const bridgedActions = useLabModeStore((s) => s.actions);
  const [error, setError] = useState<string | null>(null);
  const [sessionKey, setSessionKey] = useState(0);
  const [connectStep, setConnectStep] = useState<ConnectStep>('start');
  const [activePanel, setActivePanel] = useState<string | null>(null);
  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const connectingRef = useRef(false);
  const manualDisconnectRef = useRef(false);

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
      if (pollingRef.current) clearInterval(pollingRef.current);
    };
  }, []);

  // Auto-detect kernel: poll every 2s when on step 'start'
  useEffect(() => {
    if (labMode !== 'idle' || connectStep !== 'start') return;
    if (manualDisconnectRef.current) return;

    const checkKernel = async () => {
      if (connectingRef.current || manualDisconnectRef.current) return;
      try {
        const res = await fetch(MARIMO_KERNEL_BASE, {
          method: 'HEAD',
          signal: AbortSignal.timeout(1500),
        });
        if (res.ok) {
          connectingRef.current = true;
          if (pollingRef.current) clearInterval(pollingRef.current);
          doConnect();
        }
      } catch {
        // Not running yet — keep polling
      }
    };

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
      setConnectStep('connected');
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

  const handleDisconnect = useCallback(() => {
    if (isConnected) {
      manualDisconnectRef.current = true;
      if (pollingRef.current) clearInterval(pollingRef.current);
      store.set(connectionAtom, { state: WebSocketState.NOT_STARTED });
      store.set(runtimeConfigAtom, DEFAULT_RUNTIME_CONFIG);
      setLabMode('idle');
    } else {
      manualDisconnectRef.current = false;
      doConnect();
    }
  }, [isConnected, setLabMode, doConnect]);

  return (
    <div
      data-slot="lab-shell"
      className="flex-1 flex flex-col overflow-hidden relative"
    >
      {/* ═══ Device Frame (fills all available height) ═══ */}
      <motion.div
        className="flex-1 min-h-0 relative pt-3"
        initial={{ opacity: 0, y: 20, filter: 'blur(8px)' }}
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        transition={{ duration: 0.7, ease: EASE }}
      >
        <div
          className="h-full overflow-hidden rounded-t-[26px] relative flex flex-col font-sans"
          style={{ boxShadow: FRAME_SHADOW }}
        >
          {/* Inner highlight */}
          <div
            className="absolute inset-0 rounded-[inherit] pointer-events-none z-10"
            style={{ boxShadow: 'inset 0px 1px 2px rgba(255,255,255,0.12)' }}
          />

          {/* Chrome header — always present */}
          <ChromeHeader
            step={connectStep}
            isConnected={isConnected}
            onToggleFileTree={toggleFileTree}
            onRunAll={bridgedActions.runAll ?? undefined}
            onDisconnect={handleDisconnect}
            onOpenSettings={bridgedActions.openSettings ?? undefined}
          />

          {/* IDE Body — always present container */}
          <div className="flex bg-[#f7f7f7] flex-1 min-h-0 pl-2">
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
                  <StaticIDEBody />
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
