'use client';

import { useMemo } from 'react';
import { AnsiUp } from 'ansi_up';

const ansiUp = new AnsiUp();

function AnsiText({ text, className }: { text: string; className?: string }) {
  const html = useMemo(() => ansiUp.ansi_to_html(text), [text]);

  return (
    <span
      data-slot="ansi-text"
      className={className}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

export { AnsiText };
