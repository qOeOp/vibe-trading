/* Copyright 2026 Marimo. All rights reserved. */
/* Stub: VT lab migration — any-language code editor (lazy loaded) */

import React from 'react';
import type { ReactCodeMirrorProps } from '@uiw/react-codemirror';
import type { ResolvedTheme } from '@/features/lab/theme/useTheme';

export const LANGUAGE_MAP: Record<string, string | undefined> = {
  python: 'py',
  javascript: 'js',
  typescript: 'ts',
  shell: 'sh',
  bash: 'sh',
};

const AnyLanguageCodeMirror: React.FC<
  ReactCodeMirrorProps & {
    language: string | undefined;
    theme: ResolvedTheme;
    showCopyButton?: boolean;
  }
> = ({ language, showCopyButton, extensions = [], ...props }) => {
  return (
    <div className="relative w-full">
      <pre className="font-mono text-sm p-2 bg-muted rounded">
        {props.value || ''}
      </pre>
    </div>
  );
};

export default AnyLanguageCodeMirror;
