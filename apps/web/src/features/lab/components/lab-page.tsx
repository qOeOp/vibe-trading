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
  ChevronRight,
  Lock,
  Share,
  Plus,
  Columns2,
  ChevronDown,
  File,
  Play,
  Code2,
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

/** Step arrow connector SVG — AlignUI stepper pattern */
function StepArrow({ muted }: { muted?: boolean }) {
  return (
    <svg
      width="48"
      height="18"
      viewBox="0 0 48 18"
      fill="none"
      className="shrink-0"
    >
      <path
        d="M0 9h42m0 0-5-4.5M42 9l-5 4.5"
        stroke={muted ? '#e0e0e0' : '#ccc'}
        strokeWidth="1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Connection stepper — AlignUI pill style (798:1649) */
function ConnectionStepper({ step }: { step: ConnectStep }) {
  const stepIndex = step === 'start' ? 0 : step === 'connecting' ? 1 : 2;

  const steps = [
    { label: 'Start kernel', icon: Terminal },
    { label: 'Connecting', icon: Loader2 },
    { label: 'Ready', icon: Check },
  ];

  return (
    <div
      data-slot="connection-stepper"
      className="flex items-center justify-center gap-1"
    >
      {steps.map((s, i) => {
        const isActive = i === stepIndex;
        const isDone = i < stepIndex;
        const Icon = s.icon;
        return (
          <div key={s.label} className="flex items-center gap-1">
            {i > 0 && <StepArrow muted={!isDone && !isActive} />}
            <div
              className={`flex items-center gap-2 h-[44px] px-4 rounded-full text-[14px] font-semibold tracking-[-0.28px] leading-5 transition-all duration-300 ${
                isActive
                  ? 'bg-white text-[#525252] shadow-[0px_4px_8px_rgba(41,41,41,0.06),0px_2px_4px_rgba(41,41,41,0.04),0px_1px_2px_rgba(41,41,41,0.04)]'
                  : isDone
                    ? 'bg-white text-[#525252] shadow-[0px_4px_8px_rgba(41,41,41,0.06),0px_2px_4px_rgba(41,41,41,0.04),0px_1px_2px_rgba(41,41,41,0.04)]'
                    : 'bg-[#f2f2f2] text-[#8f8f8f]'
              }`}
              style={
                !isActive && !isDone
                  ? {
                      boxShadow:
                        'inset 0px 0px 0px 0px white, inset 0px 0px 0px 1px #e0e0e0',
                    }
                  : isActive || isDone
                    ? {
                        boxShadow:
                          '0px 4px 8px rgba(41,41,41,0.06), 0px 2px 4px rgba(41,41,41,0.04), 0px 1px 2px rgba(41,41,41,0.04), inset 0px -0.5px 0.5px rgba(41,41,41,0.08)',
                      }
                    : undefined
              }
            >
              <Icon
                className={`w-4 h-4 ${
                  isActive && step === 'connecting' ? 'animate-spin' : ''
                }`}
                strokeWidth={2}
                style={
                  isActive && step === 'connecting'
                    ? { animationDuration: '1.5s' }
                    : undefined
                }
              />
              {s.label}
            </div>
          </div>
        );
      })}
    </div>
  );
}

/**
 * Browser-style device frame — AlignUI pattern
 * Matches Figma nodes: 798:1155 (shadow/border), 798:864 (chrome bar)
 */
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
      className="w-full max-w-[600px] rounded-[26px] overflow-hidden relative"
      style={{
        boxShadow:
          '0px 12px 12px -6px rgba(41,41,41,0.04), 0px 24px 24px -12px rgba(41,41,41,0.04), 0px 48px 48px -24px rgba(41,41,41,0.04), 0px 0px 0px 1px #0f0f0f',
      }}
    >
      {/* Inner highlight — Figma inset shadow */}
      <div
        className="absolute inset-0 rounded-[inherit] pointer-events-none z-10"
        style={{
          boxShadow: 'inset 0px 1px 2px rgba(255,255,255,0.12)',
        }}
      />

      {/* ── Browser chrome (798:864) ── */}
      <div className="flex items-center px-6 py-4 bg-[#f7f7f7]">
        {/* Traffic lights — with inner shadow matching Figma */}
        <div className="flex-1 flex items-center gap-2">
          {[{ bg: '#ed6a5e' }, { bg: '#f4bf4e' }, { bg: '#61c655' }].map(
            (dot, i) => (
              <div
                key={i}
                className="w-[10px] h-[10px] rounded-full"
                style={{
                  backgroundColor: dot.bg,
                  boxShadow: 'inset 0px 0.75px 0.75px rgba(0,0,0,0.16)',
                }}
              />
            ),
          )}
        </div>
        {/* Address bar — center */}
        <div className="flex items-center gap-1 shrink-0">
          <Lock className="w-[14px] h-[14px] text-[#8f8f8f]" strokeWidth={2} />
          <span className="text-[14px] text-[#8f8f8f] font-medium tracking-[-0.08px]">
            vibe-trading.app/lab
          </span>
        </div>
        {/* Window actions — right */}
        <div className="flex-1 flex items-center justify-end gap-4">
          <Share className="w-[18px] h-[18px] text-[#ccc]" strokeWidth={1.5} />
          <Plus className="w-[18px] h-[18px] text-[#ccc]" strokeWidth={1.5} />
          <Columns2
            className="w-[18px] h-[18px] text-[#ccc]"
            strokeWidth={1.5}
          />
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
      className="flex-1 flex flex-col items-center justify-start pt-[6vh] px-8 gap-6"
    >
      {/* ═══ Connection Stepper (798:1649) ═══ */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: EASE }}
      >
        <ConnectionStepper step={step} />
      </motion.div>

      {/* ═══ Device Frame (798:1155 + 798:864) ═══ */}
      <motion.div
        initial={{ opacity: 0, y: 20, filter: 'blur(8px)' }}
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        transition={{ duration: 0.7, ease: EASE, delay: 0.1 }}
      >
        <DeviceFrame />
      </motion.div>

      {/* ═══ CTA Area (798:1138) ═══ */}
      <motion.div
        className="flex flex-col items-center gap-4 max-w-lg w-full relative"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: EASE, delay: 0.25 }}
      >
        {/* Circular icon — 64px outer ring + 48px inner circle (Figma exact) */}
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

        {/* Heading — 19.2px semibold #3D3D3D */}
        <h1 className="text-[19px] font-semibold text-[#3d3d3d] tracking-[-0.4px] leading-7">
          Try live editor
        </h1>

        {/* Description — 13.8px regular #717784 */}
        <p className="text-[14px] text-[#717784] tracking-[-0.08px]">
          Click on the button to use the code editor
        </p>

        {/* CTA button — dark pill, AlignUI style (798:1138) */}
        <div className="pt-2">
          <AnimatePresence mode="wait">
            {step === 'start' && !error && (
              <motion.div
                key="cta"
                className="flex items-center gap-0.5 h-8 pl-3.5 pr-1.5 bg-[#2e2e2e] text-white text-sm font-medium rounded-[11px] relative"
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                style={{
                  boxShadow:
                    '0px 16px 8px rgba(31,31,31,0.01), 0px 12px 6px rgba(31,31,31,0.04), 0px 4px 4px rgba(31,31,31,0.07), 0px 1.5px 3px rgba(31,31,31,0.08), 0px 0px 0px 1px #0f0f0f, inset 0px 1px 2px rgba(255,255,255,0.12)',
                }}
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
                style={{
                  boxShadow:
                    '0px 16px 8px rgba(31,31,31,0.01), 0px 12px 6px rgba(31,31,31,0.04), 0px 4px 4px rgba(31,31,31,0.07), 0px 1.5px 3px rgba(31,31,31,0.08), 0px 0px 0px 1px #0f0f0f, inset 0px 1px 2px rgba(255,255,255,0.12)',
                }}
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
                style={{
                  boxShadow:
                    '0px 16px 8px rgba(31,31,31,0.01), 0px 12px 6px rgba(31,31,31,0.04), 0px 4px 4px rgba(31,31,31,0.07), 0px 1.5px 3px rgba(31,31,31,0.08), 0px 0px 0px 1px #0f0f0f, inset 0px 1px 2px rgba(255,255,255,0.12)',
                }}
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
