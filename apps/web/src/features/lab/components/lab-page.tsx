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

/** Decorative bracket border (798:1672) — connects device frame to CTA */
function BracketDecoration() {
  return (
    <svg
      className="w-full max-w-[786px]"
      viewBox="0 0 786 54"
      fill="none"
      preserveAspectRatio="xMidYMid meet"
    >
      <path
        d="M1 0 C1 26, 26 53, 53 53 L340 53 C353 53, 365 48, 373 39 L386 26 C390 22, 396 22, 400 26 L413 39 C421 48, 433 53, 446 53 L733 53 C760 53, 785 26, 785 0"
        stroke="#e0e0e0"
        strokeWidth="1"
        fill="none"
      />
    </svg>
  );
}

/**
 * Full-width browser-style device frame — AlignUI pattern
 * Matches Figma: 798:862 (1133×620), 798:1155 (shadow), 798:864 (chrome)
 * Three-panel IDE: file tree | code editor | preview
 */
function DeviceFrame() {
  const FILE_TREE = [
    {
      folder: 'notebooks',
      files: [
        { name: 'vt-lab.py', active: true },
        { name: 'backtest.py', active: false },
        { name: 'factor_lib.py', active: false },
        { name: 'universe.py', active: false },
        { name: 'ic_analysis.py', active: false },
        { name: 'risk_model.py', active: false },
      ],
    },
  ];

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
    keyword: 'text-purple-400',
    var: 'text-[#9cdcfe]',
    fn: 'text-[#dcdcaa]',
    str: 'text-[#ce9178]',
    comment: 'text-[#6a9955]',
    plain: 'text-[#d4d4d4]',
  };

  return (
    <div
      data-slot="device-frame"
      className="w-full rounded-[26px] overflow-hidden relative"
      style={{
        boxShadow:
          '0px 12px 12px -6px rgba(41,41,41,0.04), 0px 24px 24px -12px rgba(41,41,41,0.04), 0px 48px 48px -24px rgba(41,41,41,0.04), 0px 0px 0px 1px #0f0f0f',
      }}
    >
      {/* Inner highlight */}
      <div
        className="absolute inset-0 rounded-[inherit] pointer-events-none z-10"
        style={{ boxShadow: 'inset 0px 1px 2px rgba(255,255,255,0.12)' }}
      />

      {/* ── Browser chrome (798:864) ── */}
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
          <Lock className="w-[14px] h-[14px] text-[#8f8f8f]" strokeWidth={2} />
          <span className="text-[14px] text-[#8f8f8f] font-medium tracking-[-0.08px]">
            vibe-trading.app/lab
          </span>
        </div>
        <div className="flex-1 flex items-center justify-end gap-4">
          <Share className="w-[18px] h-[18px] text-[#ccc]" strokeWidth={1.5} />
          <Plus className="w-[18px] h-[18px] text-[#ccc]" strokeWidth={1.5} />
          <Columns2
            className="w-[18px] h-[18px] text-[#ccc]"
            strokeWidth={1.5}
          />
        </div>
      </div>

      {/* ── Tab bar — 3 tabs like Figma: project | code | preview ── */}
      <div className="flex bg-[#1e1e1e] border-b border-white/5">
        <div className="flex items-center gap-1.5 px-5 py-2.5 text-[13px] text-[#ccc] font-mono font-medium">
          <FileCode2 className="w-4 h-4 text-[#888]" strokeWidth={1.5} />
          vt-lab
          <span className="ml-1 text-[10px] text-[#555] bg-white/8 px-1.5 py-0.5 rounded font-sans">
            V1.0
          </span>
        </div>
        <div className="flex items-center gap-1.5 px-5 py-2.5 text-[13px] text-[#888] font-mono font-medium border-l border-white/5">
          <Code2 className="w-4 h-4 text-[#666]" strokeWidth={1.5} />
          vt-lab.py
        </div>
        <div className="flex items-center gap-1.5 px-5 py-2.5 text-[13px] text-[#666] font-mono font-medium border-l border-white/5">
          <Play className="w-4 h-4 text-[#555]" strokeWidth={1.5} />
          preview
        </div>
      </div>

      {/* ── Body: 3-panel IDE layout ── */}
      <div className="flex bg-[#1e1e1e] h-[420px]">
        {/* Left panel: file tree */}
        <div className="w-[200px] shrink-0 border-r border-white/5 overflow-hidden">
          <div className="pt-5 px-5">
            {FILE_TREE.map((group) => (
              <div key={group.folder}>
                <div className="flex items-center gap-1.5 py-1 text-[13px] text-[#ccc] font-medium">
                  <ChevronDown
                    className="w-4 h-4 text-[#888]"
                    strokeWidth={2}
                  />
                  {group.folder}
                </div>
                <div className="ml-5 mt-1 border-l border-white/8 pl-3">
                  {group.files.map((f) => (
                    <div
                      key={f.name}
                      className={`flex items-center gap-1.5 py-1 text-[13px] ${
                        f.active ? 'text-[#e0e0e0] font-medium' : 'text-[#666]'
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
            ))}
          </div>
        </div>

        {/* Center panel: code editor */}
        <div className="flex-1 min-w-0 border-r border-white/5 relative overflow-hidden">
          <div className="pt-4 font-mono text-[13px] leading-[22px]">
            {CODE_LINES.map((line) => (
              <div
                key={line.num}
                className={`flex px-4 ${line.num === 1 ? 'bg-white/3' : ''}`}
              >
                <span className="w-8 shrink-0 text-right mr-4 text-[#555] select-none">
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

          {/* Gradient fade at bottom */}
          <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#1e1e1e] to-transparent pointer-events-none" />
        </div>

        {/* Right panel: preview (DataFrame output) */}
        <div className="w-[320px] shrink-0 overflow-hidden relative">
          <div className="p-4">
            <div className="rounded-lg border border-white/8 overflow-hidden">
              <div className="bg-white/5 px-3 py-1.5 flex items-center gap-2 text-[11px] text-[#777] font-medium border-b border-white/5">
                <span>DataFrame</span>
                <span className="text-[#555]">2640 × 5</span>
              </div>
              <table className="w-full text-[12px] font-mono border-collapse">
                <thead>
                  <tr className="text-[#888] border-b border-white/8">
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
                <tbody className="text-[#c0c0c0]">
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
                    <tr key={i} className="border-b border-white/5">
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

          {/* Gradient fade at bottom */}
          <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#1e1e1e] to-transparent pointer-events-none" />
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
      className="flex-1 flex flex-col items-center overflow-hidden relative"
    >
      {/* ═══ Connection Stepper (798:1649) ═══ */}
      <motion.div
        className="pt-6 pb-4"
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: EASE }}
      >
        <ConnectionStepper step={step} />
      </motion.div>

      {/* ═══ Full-width Device Frame (798:862) ═══ */}
      <motion.div
        className="w-full px-6"
        initial={{ opacity: 0, y: 20, filter: 'blur(8px)' }}
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        transition={{ duration: 0.7, ease: EASE, delay: 0.1 }}
      >
        <DeviceFrame />
      </motion.div>

      {/* ═══ Bracket decoration (798:1672) + CTA (798:1138) ═══ */}
      <motion.div
        className="flex flex-col items-center w-full -mt-6 relative z-10"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: EASE, delay: 0.25 }}
      >
        {/* Bracket decoration (798:1672) */}
        <BracketDecoration />

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
