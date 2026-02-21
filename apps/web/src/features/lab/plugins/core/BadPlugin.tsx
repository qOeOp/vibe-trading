/* Copyright 2026 Marimo. All rights reserved. */
import React from 'react';
import type { ZodError } from 'zod';

/**
 * Renders an error message when a plugin fails to parse its initial value.
 */
export function renderError(
  error: ZodError,
  _dataset: Record<string, unknown>,
  _shadowRoot: ShadowRoot | null,
): React.ReactElement {
  return (
    <div
      style={{
        padding: '8px',
        color: 'red',
        fontSize: '12px',
        fontFamily: 'monospace',
      }}
    >
      <strong>Plugin Error:</strong> {error.message}
    </div>
  );
}
