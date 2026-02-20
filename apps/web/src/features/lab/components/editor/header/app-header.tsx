/* Copyright 2026 Marimo. All rights reserved. */

import React, { type PropsWithChildren } from 'react';
import type { ConnectionStatus } from '../../../core/websocket/types';

interface Props {
  className?: string;
  connection: ConnectionStatus;
}

/**
 * Editor header container. Connection status (kernel not found, disconnected, etc.)
 * is handled by the dock's BackendConnectionStatus indicator — not displayed here.
 */
export const AppHeader: React.FC<PropsWithChildren<Props>> = ({
  className,
  children,
}) => {
  return <div className={className}>{children}</div>;
};
