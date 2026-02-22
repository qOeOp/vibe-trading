'use client';

import { Menu, Settings, Power, Play } from 'lucide-react';
import { cn } from '@/lib/utils';

// ─── Connection Step Types ────────────────────────────────

export type ConnectStep = 'start' | 'connecting' | 'ready' | 'connected';

// ─── Figma SVG Components ─────────────────────────────────

/** Step arrow connector — Figma Component 1 variant=48 */
function StepArrow() {
  return (
    <svg
      width="48"
      height="18"
      viewBox="0 0 48 18"
      fill="none"
      className="shrink-0"
    >
      <path d="M0 9H48" stroke="#c8c4be" />
      <circle cx="24" cy="9" r="8" fill="white" />
      <circle cx="24" cy="9" r="8.5" stroke="#d4d4d4" fill="none" />
      <g transform="translate(16, 1)">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M4.813 4.98C4.907 4.886 5.034 4.834 5.167 4.834C5.299 4.834 5.426 4.886 5.52 4.98L7.715 7.175C7.934 7.394 8.057 7.691 8.057 8C8.057 8.309 7.934 8.606 7.715 8.825L5.52 11.02C5.474 11.068 5.419 11.106 5.358 11.132C5.297 11.158 5.231 11.172 5.165 11.173C5.098 11.173 5.032 11.161 4.971 11.135C4.91 11.11 4.854 11.073 4.807 11.026C4.76 10.979 4.723 10.923 4.698 10.862C4.672 10.801 4.66 10.735 4.66 10.668C4.661 10.602 4.675 10.536 4.701 10.475C4.727 10.414 4.765 10.359 4.813 10.313L7.008 8.118C7.039 8.087 7.057 8.044 7.057 8C7.057 7.956 7.039 7.913 7.008 7.882L4.813 5.687C4.719 5.593 4.667 5.466 4.667 5.334C4.667 5.201 4.719 5.074 4.813 4.98ZM9.48 4.98C9.574 4.886 9.701 4.834 9.834 4.834C9.966 4.834 10.093 4.886 10.187 4.98L12.382 7.175C12.601 7.394 12.724 7.691 12.724 8C12.724 8.309 12.601 8.606 12.382 8.825L10.187 11.02C10.141 11.068 10.086 11.106 10.025 11.132C9.964 11.158 9.898 11.172 9.832 11.173C9.765 11.173 9.699 11.161 9.638 11.135C9.577 11.11 9.521 11.073 9.474 11.026C9.427 10.979 9.39 10.923 9.365 10.862C9.339 10.801 9.327 10.735 9.327 10.668C9.328 10.602 9.342 10.536 9.368 10.475C9.394 10.414 9.432 10.359 9.48 10.313L11.675 8.118C11.706 8.087 11.724 8.044 11.724 8C11.724 7.956 11.706 7.913 11.675 7.882L9.48 5.687C9.386 5.593 9.334 5.466 9.334 5.334C9.334 5.201 9.386 5.074 9.48 4.98Z"
          fill="#b8b8b8"
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

/** Done step icon — green filled circle with white check, same size as spinner */
function StepDone() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      className="shrink-0"
    >
      <circle cx="8" cy="8" r="7.5" fill="#4caf50" />
      <path
        d="M5 8.2L7 10.2L11 6.2"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Pending step icon — empty circle matching Figma */
function StepCircle() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      className="shrink-0"
    >
      <circle cx="8" cy="8" r="5.5" stroke="#b8b8b8" strokeWidth="1" />
    </svg>
  );
}

// ─── Connection Stepper ───────────────────────────────────

const STEPS = [
  { label: 'Initialize the compute kernel' },
  { label: 'Establish WebSocket connection' },
  { label: 'Load the editor workspace' },
];

function ConnectionStepper({ step }: { step: ConnectStep }) {
  const stepIndex =
    step === 'start' ? 0 : step === 'connecting' ? 1 : step === 'ready' ? 2 : 3;

  return (
    <div
      data-slot="connection-stepper"
      className="flex items-center justify-center gap-1"
    >
      {STEPS.map((s, i) => {
        const isActive = i === stepIndex;
        const isDone = i < stepIndex;
        return (
          <div key={s.label} className="flex items-center gap-1">
            {i > 0 && <StepArrow />}
            <div
              className={cn(
                'flex items-center gap-3 h-[36px] pl-3 pr-3.5 rounded-full text-[12.5px] font-semibold tracking-[-0.28px] leading-5 relative whitespace-nowrap',
                isActive || isDone
                  ? 'bg-white text-[#525252]'
                  : 'bg-[#eeeeee] text-[#8f8f8f]',
              )}
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
                      : 'inset 0px 0px 0px 1px #e0e0e0',
                }}
              />
              {/* Step icon */}
              {isActive ? (
                <StepSpinner className="w-4 h-4 shrink-0 animate-spin" />
              ) : isDone ? (
                <StepDone />
              ) : (
                <StepCircle />
              )}
              {s.label}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── Chrome Header ────────────────────────────────────────

type ChromeHeaderProps = {
  step: ConnectStep;
  isConnected?: boolean;
  onToggleFileTree?: () => void;
  onRunAll?: () => void;
  onDisconnect?: () => void;
  onOpenSettings?: () => void;
  className?: string;
};

function ChromeHeader({
  step,
  isConnected = false,
  onToggleFileTree,
  onRunAll,
  onDisconnect,
  onOpenSettings,
  className,
  ...props
}: ChromeHeaderProps & React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="chrome-header"
      className={cn('flex items-center px-4 py-2 bg-[#f7f7f7]', className)}
      {...props}
    >
      {/* Left: editor control icons */}
      <div className="flex items-center gap-3 shrink-0">
        <button
          type="button"
          onClick={onToggleFileTree}
          className="hover:opacity-70 transition-opacity"
          title="Toggle file tree"
        >
          <Menu
            className="w-[18px] h-[18px] text-mine-muted"
            strokeWidth={1.5}
          />
        </button>
        <button
          type="button"
          onClick={isConnected ? onOpenSettings : undefined}
          className={cn(
            'transition-opacity',
            isConnected ? 'hover:opacity-70' : 'opacity-40 cursor-not-allowed',
          )}
          disabled={!isConnected}
          title={isConnected ? 'Settings' : 'Connect to open settings'}
        >
          <Settings
            className="w-[18px] h-[18px] text-mine-muted"
            strokeWidth={1.5}
          />
        </button>
        <button
          type="button"
          onClick={onDisconnect}
          className="hover:opacity-70 transition-opacity"
          title={isConnected ? 'Disconnect' : 'Connect'}
        >
          <Power
            className="w-[18px] h-[18px] text-mine-accent-red"
            strokeWidth={1.5}
          />
        </button>
      </div>

      {/* Center: connection stepper */}
      <div className="flex-1 flex justify-center">
        <ConnectionStepper step={step} />
      </div>

      {/* Right: run icon — width matches activity bar column (36px + gap) */}
      <div
        className="shrink-0 flex items-center justify-center"
        style={{ width: 54, marginRight: -16 }}
      >
        <button
          type="button"
          onClick={isConnected ? onRunAll : undefined}
          className={cn(
            'transition-all',
            isConnected
              ? 'hover:scale-110 cursor-pointer'
              : 'opacity-40 cursor-not-allowed',
          )}
          disabled={!isConnected}
          title={isConnected ? 'Run all cells' : 'Connect to run cells'}
        >
          <Play
            className="w-5 h-5 text-mine-accent-green"
            strokeWidth={2}
            fill="currentColor"
          />
        </button>
      </div>
    </div>
  );
}

export { ChromeHeader, ConnectionStepper };
