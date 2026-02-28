'use client';

import { useMemo } from 'react';
import { AnsiText } from './ansi-text';
import { AnimatedSpan } from './animated-span';
import { PromptDisplay } from './prompt-display';
import type { CommandBlock as CommandBlockType } from './use-terminal-overlay';

function CommandBlock({ block }: { block: CommandBlockType }) {
  const output = useMemo(
    () => block.outputChunks.join(''),
    [block.outputChunks],
  );

  const trimmedOutput = output.replace(/\n$/, '');

  return (
    <AnimatedSpan className="border-t border-white/10 pt-2 mt-2 first:border-t-0 first:pt-0 first:mt-0">
      {/* Command line */}
      <span className="font-semibold">
        <PromptDisplay prompt={block.prompt} /> {block.command}
      </span>

      {/* Output lines */}
      {trimmedOutput && (
        <span className="text-white">
          <AnsiText text={trimmedOutput} />
        </span>
      )}

      {/* Running indicator */}
      {block.status === 'running' && !trimmedOutput && (
        <span className="text-white animate-pulse">...</span>
      )}
    </AnimatedSpan>
  );
}

export { CommandBlock };
