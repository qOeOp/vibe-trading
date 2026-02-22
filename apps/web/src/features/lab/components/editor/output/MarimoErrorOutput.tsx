/* Copyright 2026 Marimo. All rights reserved. */
/* Stub: VT lab migration — MarimoErrorOutput */

import type { JSX } from 'react';
import type { CellId } from '@/features/lab/core/cells/ids';
import type { MarimoError } from '@/features/lab/core/kernel/messages';

interface Props {
  cellId: CellId | undefined;
  errors: MarimoError[];
  className?: string;
}

export const MarimoErrorOutput = ({
  errors,
  className,
}: Props): JSX.Element => {
  return (
    <div className={className}>
      {errors.map((error, idx) => (
        <pre key={idx} className="text-sm text-destructive whitespace-pre-wrap">
          {'msg' in error ? (error as any).msg : JSON.stringify(error)}
        </pre>
      ))}
    </div>
  );
};
