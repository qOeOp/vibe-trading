/* Copyright 2026 Marimo. All rights reserved. */
/* Stub: VT lab migration — config button */

import React from 'react';
import { SettingsIcon } from 'lucide-react';

interface Props {
  showAppConfig?: boolean;
  disabled?: boolean;
  tooltip?: string;
}

export const ConfigButton: React.FC<Props> = ({
  disabled = false,
  tooltip = 'Settings',
}) => {
  return (
    <button
      type="button"
      disabled={disabled}
      title={tooltip}
      className="p-1 rounded hover:bg-muted disabled:opacity-50"
    >
      <SettingsIcon className="h-4 w-4" strokeWidth={1.8} />
    </button>
  );
};
