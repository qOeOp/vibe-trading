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
import { Suspense, useCallback, useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { FlaskConical } from 'lucide-react';
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

function ConnectScreen({
  onConnect,
  error,
}: {
  onConnect: () => void;
  error: string | null;
}) {
  return (
    <div className="flex-1 flex items-center justify-center">
      <motion.div
        className="text-center space-y-6 max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="space-y-2">
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 rounded-2xl bg-mine-nav-active flex items-center justify-center">
              <FlaskConical className="w-6 h-6 text-white" strokeWidth={1.5} />
            </div>
          </div>
          <h2 className="text-lg font-semibold text-mine-text">Factor Lab</h2>
          <p className="text-sm text-mine-muted leading-relaxed">
            交互式因子研究环境。连接本地 Marimo kernel 开始实验。
          </p>
        </div>

        <div className="space-y-3">
          <p className="text-xs text-mine-muted/80">
            在终端运行以下命令启动 kernel：
          </p>
          <code className="block text-xs bg-mine-bg border border-mine-border p-3 rounded-lg font-mono text-mine-text text-left">
            marimo edit --headless --port {MARIMO_KERNEL_PORT} --no-token \
            {'\n'}
            {'  '}--allow-origins &quot;http://localhost:4200&quot;
          </code>
        </div>

        {error && (
          <motion.p
            className="text-xs text-mine-accent-red"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {error}
          </motion.p>
        )}

        <motion.button
          className="px-6 py-2.5 rounded-full bg-mine-nav-active text-white text-sm font-medium
                     hover:bg-mine-nav-active/90 transition-colors cursor-pointer"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onConnect}
        >
          Connect
        </motion.button>
      </motion.div>
    </div>
  );
}

/**
 * Orchestrates the Lab lifecycle:
 * idle → connecting → active
 * active → (disconnect) → idle
 *
 * No longer uses portal — editor renders inline in the content area.
 * Shell collapse/expand is driven by the global labMode store.
 */
function LabOrchestrator() {
  const labMode = useLabModeStore((s) => s.mode);
  const setLabMode = useLabModeStore((s) => s.setMode);
  const [error, setError] = useState<string | null>(null);
  const [sessionKey, setSessionKey] = useState(0);

  // Reset labMode when this component unmounts (navigating away from lab)
  useEffect(() => {
    return () => {
      // Disconnect kernel and reset mode on unmount
      store.set(connectionAtom, { state: WebSocketState.NOT_STARTED });
      store.set(runtimeConfigAtom, DEFAULT_RUNTIME_CONFIG);
      useLabModeStore.getState().setMode('idle');
    };
  }, []);

  // Marimo injects <base href="http://localhost:2728/"> which hijacks
  // all relative URL resolution, breaking Next.js chunk loading (401).
  // Fix: monitor and correct <base> tag to keep it pointing at our origin.
  useEffect(() => {
    if (labMode !== 'active') return;

    const correctBase = () => {
      const base = document.querySelector('base');
      if (base && !base.href.startsWith(window.location.origin)) {
        base.href = `${window.location.origin}/`;
      }
    };

    // Fix immediately
    correctBase();

    // Watch for marimo re-injecting the <base> tag
    const observer = new MutationObserver(() => correctBase());
    observer.observe(document.head, {
      childList: true,
      subtree: true,
      attributes: true,
    });

    return () => {
      observer.disconnect();
      // Remove the <base> tag entirely on cleanup
      const base = document.querySelector('base');
      if (base) base.remove();
    };
  }, [labMode]);

  const connect = useCallback(async () => {
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

      setSessionKey((k) => k + 1);
      setLabMode('active');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to connect');
      setLabMode('idle');
    }
  }, [setLabMode]);

  const handleDisconnect = useCallback(() => {
    store.set(connectionAtom, { state: WebSocketState.NOT_STARTED });
    store.set(runtimeConfigAtom, DEFAULT_RUNTIME_CONFIG);
    setLabMode('idle');
  }, [setLabMode]);

  if (labMode === 'idle' || labMode === 'connecting') {
    return (
      <>
        <ConnectScreen onConnect={connect} error={error} />
        {labMode === 'connecting' && (
          <div className="flex-1 flex items-center justify-center absolute inset-0">
            <motion.p
              className="text-mine-muted text-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              正在连接...
            </motion.p>
          </div>
        )}
      </>
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
