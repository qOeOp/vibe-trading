/* Copyright 2026 Marimo. All rights reserved. */
import type { PropsWithChildren } from 'react';
import type { AppConfig } from '../../../../core/config/config-schema';
import { cn } from '../../../../utils/cn';
import { useLabMode } from '../../../../components/lab-mode-context';

interface Props {
  className?: string;
  innerClassName?: string;
  appConfig: AppConfig;
  invisible?: boolean;
}

export const VerticalLayoutWrapper: React.FC<PropsWithChildren<Props>> = ({
  invisible,
  appConfig,
  className,
  children,
  innerClassName,
}) => {
  const { isLabMode } = useLabMode();

  return (
    <div
      className={cn(
        isLabMode
          ? 'px-2 pb-4'
          : 'px-1 sm:px-16 md:px-20 xl:px-24 print:px-0 print:pb-0 pb-24 sm:pb-12',
        className,
      )}
    >
      <div
        className={cn(
          isLabMode
            ? 'max-w-full'
            : cn(
                'm-auto',
                'pb-24 sm:pb-12',
                appConfig.width === 'compact' &&
                  'max-w-(--content-width) min-w-[400px]',
                appConfig.width === 'medium' &&
                  'max-w-(--content-width-medium) min-w-[400px]',
                appConfig.width === 'columns' && 'w-fit',
                appConfig.width === 'full' && 'max-w-full',
              ),
          // Hide the cells for a fake loading effect, to avoid flickering
          invisible && 'invisible',
          innerClassName,
        )}
      >
        {children}
      </div>
    </div>
  );
};
