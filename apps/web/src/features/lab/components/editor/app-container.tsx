/* Copyright 2026 Marimo. All rights reserved. */

import type React from 'react';
import type { PropsWithChildren } from 'react';
import type { AppConfig } from '@/features/lab/core/config/config-schema';
import { isAppClosed } from '@/features/lab/core/websocket/connection-utils';
import type { ConnectionStatus } from '@/features/lab/core/websocket/types';
import { cn } from '@/features/lab/utils/cn';
import { WrappedWithSidebar } from './renderers/vertical-layout/sidebar/wrapped-with-sidebar';
import { useLabModeStore } from '@/features/lab/store/use-lab-mode-store';

interface Props {
  connection: ConnectionStatus;
  width: AppConfig['width'];
}

export const AppContainer: React.FC<PropsWithChildren<Props>> = ({
  width,
  connection,
  children,
}) => {
  const connectionState = connection.state;
  const isLabActive = useLabModeStore((s) => s.mode) === 'active';

  return (
    <>
      <WrappedWithSidebar>
        {/** biome-ignore lint/correctness/useUniqueElementIds: ID is used by other components to grab the DOM element */}
        <div
          id="App"
          data-config-width={width}
          data-connection-state={connectionState}
          className={cn(
            'mathjax_ignore',
            isAppClosed(connectionState) && 'disconnected',
            isLabActive ? 'bg-transparent' : 'bg-mine-page-bg',
            'w-full h-full text-textColor',
            'flex flex-col overflow-y-auto',
            isLabActive && 'scrollbar-none',
            width === 'full' && 'config-width-full',
            width === 'columns' ? 'overflow-x-auto' : 'overflow-x-hidden',
            'print:height-fit',
          )}
        >
          {children}
        </div>
      </WrappedWithSidebar>
    </>
  );
};
