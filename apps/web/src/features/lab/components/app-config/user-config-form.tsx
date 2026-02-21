/* Copyright 2026 Marimo. All rights reserved. */
/* Stub: VT lab migration — user config form */

import React from 'react';
import type { FieldValues, UseFormReturn } from 'react-hook-form';

export function getDirtyValues<T extends FieldValues>(
  values: T,
  dirtyFields: Partial<Record<keyof T, unknown>>,
): Partial<T> {
  const result: Partial<T> = {};
  for (const key of Object.keys(dirtyFields) as Array<keyof T>) {
    const dirty = dirtyFields[key];
    const value = values[key];
    if (value === undefined) {
      continue;
    }
    if (dirty === true) {
      result[key] = value;
    } else if (typeof dirty === 'object' && dirty !== null) {
      result[key] = value;
    }
  }
  return result;
}

export const UserConfigForm: React.FC = () => {
  return (
    <div className="p-4">
      <p className="text-muted-foreground">
        User configuration not available in VT lab.
      </p>
    </div>
  );
};
