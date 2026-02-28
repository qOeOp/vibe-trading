'use client';

import { useEffect, useMemo, useRef } from 'react';
import { cn } from '@/lib/utils';
import { CommandBlock } from './command-block';
import { GridView } from './grid-view';
import { InputBar } from './input-bar';
import { useTerminalOverlayStore } from './use-terminal-overlay';

const STORAGE_KEY = 'vt-terminal-last-login';

function formatLoginTime(date: Date): string {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];
  const d = days[date.getDay()];
  const m = months[date.getMonth()];
  const day = date.getDate();
  const h = String(date.getHours()).padStart(2, '0');
  const min = String(date.getMinutes()).padStart(2, '0');
  const sec = String(date.getSeconds()).padStart(2, '0');
  return `${d} ${m} ${day} ${h}:${min}:${sec} ${date.getFullYear()}`;
}

function WelcomeBanner() {
  const lastLogin = useMemo(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      const now = new Date();
      localStorage.setItem(STORAGE_KEY, now.toISOString());
      if (stored) {
        return formatLoginTime(new Date(stored));
      }
      return null;
    } catch {
      return null;
    }
  }, []);

  return (
    <span className="block mb-4 text-white/60 leading-relaxed">
      {lastLogin && (
        <span className="block">Last login: {lastLogin} on ttys001</span>
      )}
      <span className="block text-white/40 mt-1">
        Vibe Trading Lab · Python 3.11 (base) · marimo kernel
      </span>
    </span>
  );
}

type ReactTerminalProps = {
  onSendCommand: (text: string) => void;
  onInterrupt: () => void;
  visible: boolean;
  className?: string;
};

function ReactTerminal({
  onSendCommand,
  onInterrupt,
  visible,
  className,
}: ReactTerminalProps) {
  const blocks = useTerminalOverlayStore((s) => s.blocks);
  const promptText = useTerminalOverlayStore((s) => s.promptText);
  const mode = useTerminalOverlayStore((s) => s.mode);

  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new blocks/output arrive
  useEffect(() => {
    const el = scrollRef.current;
    if (el) {
      el.scrollTop = el.scrollHeight;
    }
  }, [blocks]);

  // Focus input when becoming visible
  useEffect(() => {
    if (visible) {
      const input = document.querySelector<HTMLInputElement>(
        '[data-slot="terminal-input"]',
      );
      input?.focus();
    }
  }, [visible]);

  if (mode === 'grid') {
    return (
      <GridView
        onKeyData={() => {
          // Grid mode keyboard forwarding is handled in terminal.tsx
        }}
        className={className}
      />
    );
  }

  return (
    <div
      data-slot="react-terminal"
      className={cn(
        'w-full h-full flex flex-col bg-zinc-900 text-white',
        className,
      )}
    >
      {/* Scrollable terminal content — MagicUI style */}
      <div ref={scrollRef} className="flex-1 min-h-0 overflow-auto p-4">
        <pre>
          <code className="grid gap-y-0 font-mono text-[13px] leading-tight tracking-tight">
            {blocks.length === 0 && <WelcomeBanner />}
            {blocks.map((block) => (
              <CommandBlock key={block.id} block={block} />
            ))}
          </code>
        </pre>
      </div>

      {/* Fixed input bar at bottom */}
      <InputBar
        prompt={promptText}
        onSubmit={onSendCommand}
        onInterrupt={onInterrupt}
      />
    </div>
  );
}

export { ReactTerminal };
