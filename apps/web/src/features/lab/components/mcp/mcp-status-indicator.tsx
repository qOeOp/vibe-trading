/* Copyright 2026 Marimo. All rights reserved. */
/* Stub: VT lab migration — MCP status indicator */

import React from 'react';
import { PlugIcon } from 'lucide-react';

export const MCPStatusIndicator: React.FC<{ compact?: boolean }> = () => {
  return (
    <button type="button" className="p-1 opacity-50" title="MCP Status">
      <PlugIcon className="h-4 w-4 text-muted-foreground" />
    </button>
  );
};
