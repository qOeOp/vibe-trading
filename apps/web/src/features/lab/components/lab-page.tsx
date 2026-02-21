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

/** Step arrow connector — Figma Component 1 variant=48, warm beige palette */
function StepArrow() {
  return (
    <svg
      width="48"
      height="18"
      viewBox="0 0 48 18"
      fill="none"
      className="shrink-0"
    >
      {/* Horizontal line at center — warm beige (mine-border) */}
      <path d="M0 9H48" stroke="#e0ddd8" />
      {/* Circle — white fill + subtle border, matches stepper pills */}
      <circle cx="24" cy="9" r="8" fill="white" />
      <circle cx="24" cy="9" r="8.5" stroke="#d4d4d4" fill="none" />
      {/* Double chevrons >> — warm muted */}
      <g transform="translate(16, 1)">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M4.813 4.98C4.907 4.886 5.034 4.834 5.167 4.834C5.299 4.834 5.426 4.886 5.52 4.98L7.715 7.175C7.934 7.394 8.057 7.691 8.057 8C8.057 8.309 7.934 8.606 7.715 8.825L5.52 11.02C5.474 11.068 5.419 11.106 5.358 11.132C5.297 11.158 5.231 11.172 5.165 11.173C5.098 11.173 5.032 11.161 4.971 11.135C4.91 11.11 4.854 11.073 4.807 11.026C4.76 10.979 4.723 10.923 4.698 10.862C4.672 10.801 4.66 10.735 4.66 10.668C4.661 10.602 4.675 10.536 4.701 10.475C4.727 10.414 4.765 10.359 4.813 10.313L7.008 8.118C7.039 8.087 7.057 8.044 7.057 8C7.057 7.956 7.039 7.913 7.008 7.882L4.813 5.687C4.719 5.593 4.667 5.466 4.667 5.334C4.667 5.201 4.719 5.074 4.813 4.98ZM9.48 4.98C9.574 4.886 9.701 4.834 9.834 4.834C9.966 4.834 10.093 4.886 10.187 4.98L12.382 7.175C12.601 7.394 12.724 7.691 12.724 8C12.724 8.309 12.601 8.606 12.382 8.825L10.187 11.02C10.141 11.068 10.086 11.106 10.025 11.132C9.964 11.158 9.898 11.172 9.832 11.173C9.765 11.173 9.699 11.161 9.638 11.135C9.577 11.11 9.521 11.073 9.474 11.026C9.427 10.979 9.39 10.923 9.365 10.862C9.339 10.801 9.327 10.735 9.327 10.668C9.328 10.602 9.342 10.536 9.368 10.475C9.394 10.414 9.432 10.359 9.48 10.313L11.675 8.118C11.706 8.087 11.724 8.044 11.724 8C11.724 7.956 11.706 7.913 11.675 7.882L9.48 5.687C9.386 5.593 9.334 5.466 9.334 5.334C9.334 5.201 9.386 5.074 9.48 4.98Z"
          fill="#a8a29e"
        />
      </g>
    </svg>
  );
}

/** Figma spinner icon (variant=47) — radial lines in #F05023 */
function StepSpinner({ className }: { className?: string }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 15.25 15.25"
      fill="none"
      className={className}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M7.625 0C7.97 0 8.25 0.28 8.25 0.625V3.274C8.25 3.44 8.184 3.599 8.067 3.716C7.95 3.833 7.791 3.899 7.625 3.899C7.459 3.899 7.3 3.833 7.183 3.716C7.066 3.599 7 3.44 7 3.274V0.624C7 0.28 7.28 0 7.625 0ZM2.235 2.233C2.352 2.116 2.511 2.05 2.677 2.05C2.842 2.05 3.001 2.116 3.118 2.233L4.991 4.106C5.049 4.164 5.095 4.233 5.127 4.309C5.158 4.385 5.174 4.466 5.174 4.548C5.174 4.63 5.158 4.711 5.127 4.787C5.095 4.863 5.049 4.932 4.991 4.99C4.933 5.048 4.864 5.094 4.788 5.126C4.712 5.157 4.631 5.173 4.549 5.173C4.467 5.173 4.386 5.157 4.31 5.126C4.234 5.094 4.165 5.048 4.107 4.99L2.233 3.117C2.175 3.059 2.129 2.99 2.097 2.914C2.066 2.838 2.05 2.757 2.05 2.675C2.05 2.593 2.066 2.512 2.097 2.436C2.129 2.36 2.175 2.291 2.233 2.233ZM13.018 2.233C13.076 2.291 13.122 2.36 13.154 2.436C13.185 2.512 13.202 2.593 13.202 2.676C13.202 2.758 13.185 2.839 13.154 2.915C13.122 2.991 13.076 3.06 13.018 3.118L11.145 4.99C11.027 5.102 10.87 5.163 10.707 5.16C10.545 5.158 10.389 5.093 10.274 4.978C10.159 4.863 10.094 4.708 10.091 4.545C10.089 4.382 10.15 4.225 10.261 4.107L12.134 2.234C12.192 2.176 12.261 2.13 12.337 2.098C12.413 2.067 12.494 2.051 12.576 2.051C12.658 2.051 12.739 2.067 12.815 2.098C12.891 2.13 12.96 2.175 13.018 2.233ZM0 7.627C0 7.281 0.28 7.002 0.625 7.002H3.274C3.44 7.002 3.599 7.068 3.716 7.185C3.833 7.302 3.899 7.461 3.899 7.627C3.899 7.793 3.833 7.952 3.716 8.069C3.599 8.186 3.44 8.252 3.274 8.252H0.625C0.28 8.252 0 7.972 0 7.627ZM11.351 7.627C11.351 7.281 11.631 7.002 11.976 7.002H14.625C14.791 7.002 14.95 7.068 15.067 7.185C15.184 7.302 15.25 7.461 15.25 7.627C15.25 7.793 15.184 7.952 15.067 8.069C14.95 8.186 14.791 8.252 14.625 8.252H11.976C11.631 8.252 11.351 7.972 11.351 7.627ZM10.261 10.261C10.378 10.144 10.537 10.078 10.703 10.078C10.868 10.078 11.027 10.144 11.144 10.261L13.017 12.134C13.134 12.251 13.2 12.41 13.2 12.576C13.2 12.742 13.134 12.901 13.017 13.018C12.9 13.135 12.741 13.201 12.575 13.201C12.409 13.201 12.25 13.135 12.133 13.018L10.26 11.145C10.202 11.087 10.156 11.018 10.125 10.942C10.093 10.866 10.077 10.785 10.077 10.703C10.077 10.621 10.093 10.54 10.125 10.464C10.156 10.388 10.203 10.319 10.261 10.261ZM4.991 10.261C5.049 10.319 5.095 10.388 5.127 10.464C5.158 10.54 5.174 10.621 5.174 10.703C5.174 10.785 5.158 10.866 5.127 10.942C5.095 11.018 5.049 11.087 4.991 11.145L3.118 13.018C3.06 13.076 2.991 13.122 2.915 13.154C2.839 13.185 2.758 13.201 2.676 13.201C2.594 13.201 2.513 13.185 2.437 13.154C2.361 13.122 2.292 13.076 2.234 13.018C2.176 12.96 2.13 12.891 2.099 12.815C2.067 12.739 2.051 12.658 2.051 12.576C2.051 12.494 2.067 12.413 2.099 12.337C2.13 12.261 2.176 12.192 2.234 12.134L4.107 10.261C4.224 10.144 4.383 10.078 4.549 10.078C4.714 10.078 4.873 10.144 4.99 10.261H4.991ZM7.625 11.351C7.97 11.351 8.25 11.631 8.25 11.976V14.625C8.25 14.791 8.184 14.95 8.067 15.067C7.95 15.184 7.791 15.25 7.625 15.25C7.459 15.25 7.3 15.184 7.183 15.067C7.066 14.95 7 14.791 7 14.625V11.976C7 11.631 7.28 11.351 7.625 11.351Z"
        fill="#f05023"
      />
    </svg>
  );
}

/** Connection stepper — 1:1 from Figma 798:1649 */
function ConnectionStepper({ step }: { step: ConnectStep }) {
  const stepIndex = step === 'start' ? 0 : step === 'connecting' ? 1 : 2;

  const steps = [
    { label: 'Start kernel' },
    { label: 'Connecting' },
    { label: 'Ready' },
  ];

  return (
    <div
      data-slot="connection-stepper"
      className="flex items-center justify-center gap-1"
    >
      {steps.map((s, i) => {
        const isActive = i === stepIndex;
        const isDone = i < stepIndex;
        return (
          <div key={s.label} className="flex items-center gap-1">
            {i > 0 && <StepArrow />}
            <div
              className={`flex items-center gap-3 h-[44px] pl-[15px] pr-4 rounded-full text-[14px] font-semibold tracking-[-0.28px] leading-5 relative ${
                isActive || isDone
                  ? 'bg-white text-[#525252]'
                  : 'bg-[#f2f2f2] text-[#8f8f8f]'
              }`}
              style={
                isActive || isDone
                  ? {
                      boxShadow:
                        '0px 4px 8px rgba(41,41,41,0.06), 0px 2px 4px rgba(41,41,41,0.04), 0px 1px 2px rgba(41,41,41,0.04)',
                    }
                  : undefined
              }
            >
              {/* Inset border */}
              <div
                className="absolute inset-0 rounded-full pointer-events-none"
                style={{
                  boxShadow:
                    isActive || isDone
                      ? 'inset 0px -0.5px 0.5px rgba(41,41,41,0.08)'
                      : 'inset 0px 0px 0px 1px #e0ddd8',
                }}
              />
              {/* Step icon: spinner when active, check when done, terminal/icon when pending */}
              {isActive ? (
                <StepSpinner className="w-4 h-4 shrink-0 animate-spin" />
              ) : isDone ? (
                <Check className="w-4 h-4 shrink-0" strokeWidth={2} />
              ) : (
                <Terminal className="w-4 h-4 shrink-0" strokeWidth={2} />
              )}
              {s.label}
            </div>
          </div>
        );
      })}
    </div>
  );
}

/** Code lines for the device frame preview */
const CODE_LINES = [
  {
    num: 1,
    tokens: [
      { t: 'keyword', v: 'import' },
      { t: 'plain', v: ' marimo ' },
      { t: 'keyword', v: 'as' },
      { t: 'plain', v: ' mo' },
    ],
  },
  {
    num: 2,
    tokens: [
      { t: 'keyword', v: 'import' },
      { t: 'plain', v: ' akshare ' },
      { t: 'keyword', v: 'as' },
      { t: 'plain', v: ' ak' },
    ],
  },
  {
    num: 3,
    tokens: [
      { t: 'keyword', v: 'import' },
      { t: 'plain', v: ' pandas ' },
      { t: 'keyword', v: 'as' },
      { t: 'plain', v: ' pd' },
    ],
  },
  { num: 4, tokens: [] },
  {
    num: 5,
    tokens: [
      { t: 'var', v: 'df' },
      { t: 'plain', v: ' = ' },
      { t: 'var', v: 'ak' },
      { t: 'plain', v: '.' },
      { t: 'fn', v: 'stock_zh_a_hist' },
      { t: 'plain', v: '(' },
      { t: 'str', v: '"000001"' },
      { t: 'plain', v: ')' },
    ],
  },
  {
    num: 6,
    tokens: [
      { t: 'var', v: 'factor' },
      { t: 'plain', v: ' = ' },
      { t: 'var', v: 'df' },
      { t: 'plain', v: '[' },
      { t: 'str', v: "'close'" },
      { t: 'plain', v: '].' },
      { t: 'fn', v: 'pct_change' },
      { t: 'plain', v: '(20)' },
    ],
  },
  { num: 7, tokens: [] },
  { num: 8, tokens: [{ t: 'comment', v: '# 计算 IC 衰减' }] },
  {
    num: 9,
    tokens: [
      { t: 'var', v: 'ic_series' },
      { t: 'plain', v: ' = ' },
      { t: 'var', v: 'factor' },
      { t: 'plain', v: '.' },
      { t: 'fn', v: 'corr' },
      { t: 'plain', v: '(' },
      { t: 'var', v: 'df' },
      { t: 'plain', v: '[' },
      { t: 'str', v: "'close'" },
      { t: 'plain', v: '].' },
      { t: 'fn', v: 'shift' },
      { t: 'plain', v: '(-1))' },
    ],
  },
  { num: 10, tokens: [] },
  {
    num: 11,
    tokens: [
      { t: 'var', v: 'mo' },
      { t: 'plain', v: '.' },
      { t: 'var', v: 'ui' },
      { t: 'plain', v: '.' },
      { t: 'fn', v: 'table' },
      { t: 'plain', v: '(' },
      { t: 'var', v: 'df' },
      { t: 'plain', v: '.' },
      { t: 'fn', v: 'head' },
      { t: 'plain', v: '())' },
    ],
  },
];

const TOKEN_COLORS: Record<string, string> = {
  keyword: 'text-[#8b5cf6]',
  var: 'text-[#1e3a5f]',
  fn: 'text-[#b45309]',
  str: 'text-[#16a34a]',
  comment: 'text-[#9ca3af]',
  plain: 'text-[#374151]',
};

/** CTA button shared styles */
const CTA_BUTTON_SHADOW =
  '0px 16px 8px rgba(31,31,31,0.01), 0px 12px 6px rgba(31,31,31,0.04), 0px 4px 4px rgba(31,31,31,0.07), 0px 1.5px 3px rgba(31,31,31,0.08), 0px 0px 0px 1px #0f0f0f, inset 0px 1px 2px rgba(255,255,255,0.12)';

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
      className="flex-1 flex flex-col overflow-hidden relative"
    >
      {/* ═══ Row 1: Connection Stepper ═══ */}
      <motion.div
        className="pt-6 pb-4 shrink-0 flex justify-center"
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: EASE }}
      >
        <ConnectionStepper step={step} />
      </motion.div>

      {/* ═══ Row 2: Device Frame (fills remaining height) ═══ */}
      <motion.div
        className="flex-1 min-h-0 relative"
        initial={{ opacity: 0, y: 20, filter: 'blur(8px)' }}
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        transition={{ duration: 0.7, ease: EASE, delay: 0.1 }}
      >
        <div
          className="h-full overflow-hidden rounded-t-[26px] relative"
          style={{
            boxShadow:
              '0px 12px 12px -6px rgba(41,41,41,0.04), 0px 24px 24px -12px rgba(41,41,41,0.04), 0px 48px 48px -24px rgba(41,41,41,0.04), 0px 0px 0px 1px #d4d4d4',
          }}
        >
          {/* Inner highlight */}
          <div
            className="absolute inset-0 rounded-[inherit] pointer-events-none z-10"
            style={{ boxShadow: 'inset 0px 1px 2px rgba(255,255,255,0.12)' }}
          />

          {/* Browser chrome */}
          <div className="flex items-center px-6 py-4 bg-[#f7f7f7]">
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
            <div className="flex items-center gap-1 shrink-0">
              <Lock
                className="w-[14px] h-[14px] text-[#8f8f8f]"
                strokeWidth={2}
              />
              <span className="text-[14px] text-[#8f8f8f] font-medium tracking-[-0.08px]">
                vibe-trading.app/lab
              </span>
            </div>
            <div className="flex-1 flex items-center justify-end gap-4">
              <Share
                className="w-[18px] h-[18px] text-[#ccc]"
                strokeWidth={1.5}
              />
              <Plus
                className="w-[18px] h-[18px] text-[#ccc]"
                strokeWidth={1.5}
              />
              <Columns2
                className="w-[18px] h-[18px] text-[#ccc]"
                strokeWidth={1.5}
              />
            </div>
          </div>

          {/* Tab bar */}
          <div className="flex bg-[#fafafa] border-b border-[#e5e5e5]">
            <div className="flex items-center gap-1.5 px-5 py-2.5 text-[13px] text-[#525252] font-mono font-medium bg-white border-b-2 border-b-[#f05023]">
              <FileCode2 className="w-4 h-4 text-[#737373]" strokeWidth={1.5} />
              vt-lab
              <span className="ml-1 text-[10px] text-[#a3a3a3] bg-[#f5f5f5] px-1.5 py-0.5 rounded font-sans">
                V1.0
              </span>
            </div>
            <div className="flex items-center gap-1.5 px-5 py-2.5 text-[13px] text-[#a3a3a3] font-mono font-medium border-l border-[#e5e5e5]">
              <Code2 className="w-4 h-4 text-[#b3b3b3]" strokeWidth={1.5} />
              vt-lab.py
            </div>
            <div className="flex items-center gap-1.5 px-5 py-2.5 text-[13px] text-[#a3a3a3] font-mono font-medium border-l border-[#e5e5e5]">
              <Play className="w-4 h-4 text-[#b3b3b3]" strokeWidth={1.5} />
              preview
            </div>
          </div>

          {/* IDE Body — fills remaining height */}
          <div className="flex bg-white h-[calc(100%-90px)]">
            {/* Left panel: file tree */}
            <div className="w-[200px] shrink-0 border-r border-[#e5e5e5] overflow-hidden">
              <div className="pt-5 px-5">
                <div>
                  <div className="flex items-center gap-1.5 py-1 text-[13px] text-[#525252] font-medium">
                    <ChevronDown
                      className="w-4 h-4 text-[#a3a3a3]"
                      strokeWidth={2}
                    />
                    notebooks
                  </div>
                  <div className="ml-5 mt-1 border-l border-[#e5e5e5] pl-3">
                    {[
                      { name: 'vt-lab.py', active: true },
                      { name: 'backtest.py', active: false },
                      { name: 'factor_lib.py', active: false },
                      { name: 'universe.py', active: false },
                      { name: 'ic_analysis.py', active: false },
                      { name: 'risk_model.py', active: false },
                    ].map((f) => (
                      <div
                        key={f.name}
                        className={`flex items-center gap-1.5 py-1 text-[13px] ${
                          f.active
                            ? 'text-[#1a1a1a] font-medium'
                            : 'text-[#a3a3a3]'
                        }`}
                      >
                        {f.active && (
                          <div className="w-0.5 h-4 bg-[#f05023] rounded-full -ml-[13.5px] mr-2" />
                        )}
                        <File className="w-4 h-4 shrink-0" strokeWidth={1.5} />
                        <span className="truncate font-mono">{f.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Center panel: code editor */}
            <div className="flex-1 min-w-0 border-r border-[#e5e5e5] relative overflow-hidden">
              <div className="pt-4 font-mono text-[13px] leading-[22px]">
                {CODE_LINES.map((line) => (
                  <div
                    key={line.num}
                    className={`flex px-4 ${line.num === 1 ? 'bg-[#f05023]/[0.04]' : ''}`}
                  >
                    <span className="w-8 shrink-0 text-right mr-4 text-[#c0c0c0] select-none">
                      {line.num}
                    </span>
                    <span>
                      {line.tokens.length === 0 && '\u00A0'}
                      {line.tokens.map((tok, i) => (
                        <span key={i} className={TOKEN_COLORS[tok.t]}>
                          {tok.v}
                        </span>
                      ))}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right panel: preview (DataFrame) */}
            <div className="w-[320px] shrink-0 overflow-hidden relative">
              <div className="p-4">
                <div className="rounded-lg border border-[#e5e5e5] overflow-hidden">
                  <div className="bg-[#fafafa] px-3 py-1.5 flex items-center gap-2 text-[11px] text-[#737373] font-medium border-b border-[#e5e5e5]">
                    <span>DataFrame</span>
                    <span className="text-[#a3a3a3]">2640 × 5</span>
                  </div>
                  <table className="w-full text-[12px] font-mono border-collapse">
                    <thead>
                      <tr className="text-[#737373] border-b border-[#e5e5e5]">
                        <th className="py-1.5 px-2.5 text-left font-medium">
                          date
                        </th>
                        <th className="py-1.5 px-2.5 text-right font-medium">
                          open
                        </th>
                        <th className="py-1.5 px-2.5 text-right font-medium">
                          close
                        </th>
                        <th className="py-1.5 px-2.5 text-right font-medium">
                          high
                        </th>
                        <th className="py-1.5 px-2.5 text-right font-medium">
                          low
                        </th>
                      </tr>
                    </thead>
                    <tbody className="text-[#525252]">
                      {[
                        ['2024-01-02', '9.82', '9.91', '9.95', '9.78'],
                        ['2024-01-03', '9.88', '9.75', '9.92', '9.71'],
                        ['2024-01-04', '9.73', '9.80', '9.85', '9.68'],
                        ['2024-01-05', '9.79', '9.86', '9.90', '9.74'],
                        ['2024-01-08', '9.85', '9.92', '9.96', '9.81'],
                        ['2024-01-09', '9.90', '9.84', '9.93', '9.79'],
                        ['2024-01-10', '9.83', '9.88', '9.91', '9.80'],
                        ['2024-01-11', '9.87', '9.95', '9.98', '9.83'],
                      ].map((row, i) => (
                        <tr key={i} className="border-b border-[#f0f0f0]">
                          <td className="py-1.5 px-2.5">{row[0]}</td>
                          <td className="py-1.5 px-2.5 text-right">{row[1]}</td>
                          <td className="py-1.5 px-2.5 text-right">{row[2]}</td>
                          <td className="py-1.5 px-2.5 text-right">{row[3]}</td>
                          <td className="py-1.5 px-2.5 text-right">{row[4]}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ═══ Progressive blur overlay at device frame bottom (795:3292 ref) ═══ */}
        <div
          className="absolute bottom-0 left-0 right-0 h-[200px] pointer-events-none z-20"
          style={{
            background:
              'linear-gradient(to top, var(--color-mine-page-bg) 0%, var(--color-mine-page-bg) 20%, transparent 100%)',
          }}
        />
      </motion.div>

      {/* ═══ Row 3: CTA floating over the blur (795:3292) ═══ */}
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
        <h1 className="mt-4 text-[19px] font-semibold text-[#3d3d3d] tracking-[-0.4px] leading-7">
          Try live editor
        </h1>

        {/* Description */}
        <p className="mt-1 text-[14px] text-[#717784] tracking-[-0.08px]">
          Click on the button to use the code editor
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

        {/* Collapsible terminal command */}
        <details
          className="w-full max-w-md pointer-events-auto mt-2"
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
