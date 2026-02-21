/* Copyright 2026 Marimo. All rights reserved. */
/* Stub: VT lab migration — MarimoTracebackOutput */

import type { JSX } from 'react';
import type { CellId } from '../../../core/cells/ids';
import { renderHTML } from '../../../plugins/core/RenderHTML';

interface Props {
  cellId: CellId | undefined;
  traceback: string;
  onRefactorWithAI?: (opts: {
    prompt: string;
    triggerImmediately: boolean;
  }) => void;
}

export const MarimoTracebackOutput = ({ traceback }: Props): JSX.Element => {
  const htmlTraceback = renderHTML({ html: traceback });
  return (
    <div className="flex flex-col gap-2 min-w-full w-fit">
      <div className="text-muted-foreground px-4 pt-2 text-xs overflow-auto">
        {htmlTraceback}
      </div>
    </div>
  );
};
