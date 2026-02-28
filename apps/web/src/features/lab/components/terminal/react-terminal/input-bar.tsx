'use client';

import { useCallback, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { PromptDisplay } from './prompt-display';

type InputBarProps = {
  prompt: string;
  onSubmit: (command: string) => void;
  onInterrupt: () => void;
  className?: string;
};

function InputBar({ prompt, onSubmit, onInterrupt, className }: InputBarProps) {
  const [value, setValue] = useState('');
  const historyRef = useRef<string[]>([]);
  const historyIndexRef = useRef(-1);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      // Skip during IME composition (Chinese/Japanese/Korean input methods)
      if (e.nativeEvent.isComposing || e.keyCode === 229) return;

      if (e.key === 'Enter' && value.trim()) {
        historyRef.current.push(value);
        historyIndexRef.current = -1;
        onSubmit(value);
        setValue('');
        return;
      }

      if (e.key === 'c' && e.ctrlKey) {
        e.preventDefault();
        onInterrupt();
        setValue('');
        return;
      }

      if (e.key === 'ArrowUp') {
        e.preventDefault();
        const history = historyRef.current;
        if (history.length === 0) return;
        const newIndex =
          historyIndexRef.current === -1
            ? history.length - 1
            : Math.max(0, historyIndexRef.current - 1);
        historyIndexRef.current = newIndex;
        setValue(history[newIndex]);
        return;
      }

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        const history = historyRef.current;
        if (historyIndexRef.current === -1) return;
        const newIndex = historyIndexRef.current + 1;
        if (newIndex >= history.length) {
          historyIndexRef.current = -1;
          setValue('');
        } else {
          historyIndexRef.current = newIndex;
          setValue(history[newIndex]);
        }
        return;
      }
    },
    [value, onSubmit, onInterrupt],
  );

  return (
    <div
      data-slot="input-bar"
      className={cn(
        'flex items-center gap-2 px-4 py-2 border-t border-white/10 bg-black/20',
        className,
      )}
      onClick={() => inputRef.current?.focus()}
    >
      <PromptDisplay prompt={prompt} />
      <input
        ref={inputRef}
        data-slot="terminal-input"
        className="flex-1 bg-transparent outline-none font-mono text-[13px] leading-tight tracking-tight text-white"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        autoFocus
        spellCheck={false}
        autoComplete="off"
      />
    </div>
  );
}

export { InputBar };
