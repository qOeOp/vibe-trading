/* Copyright 2026 Marimo. All rights reserved. */

import { ChevronRightIcon, LoaderCircle, XIcon } from 'lucide-react';
import type { DataType } from '@/features/lab/core/kernel/messages';
import { cn } from '@/features/lab/utils/cn';
import { DATA_TYPE_ICON, getDataTypeColor } from '../datasets/icons';

export const RotatingChevron: React.FC<{ isExpanded: boolean }> = ({
  isExpanded,
}) => (
  <ChevronRightIcon
    data-slot="rotating-chevron"
    className={cn('h-3 w-3 transition-transform', isExpanded && 'rotate-90')}
  />
);

export const DatasourceLabel: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className }) => {
  return (
    <div
      data-slot="datasource-label"
      className={cn(
        'flex gap-1.5 items-center font-bold py-1.5 text-mine-muted bg-(--slate-2) text-sm',
        className,
      )}
    >
      {children}
    </div>
  );
};

export const EmptyState: React.FC<{ content: string; className?: string }> = ({
  content,
  className,
}) => {
  return (
    <div
      data-slot="empty-state"
      className={cn('text-sm text-mine-muted py-1', className)}
    >
      {content}
    </div>
  );
};

export const ErrorState: React.FC<{
  error: Error;
  className?: string;
}> = ({ error, className }) => {
  return (
    <div
      data-slot="error-state"
      className={cn(
        'text-sm bg-red-50 text-red-600 flex items-center gap-2 p-2 h-8',
        className,
      )}
    >
      <XIcon className="h-4 w-4 mt-0.5" />
      {error.message}
    </div>
  );
};

export const LoadingState: React.FC<{
  message: string;
  className?: string;
}> = ({ message, className }) => {
  return (
    <div
      data-slot="loading-state"
      className={cn(
        'text-sm bg-blue-50 text-blue-500 flex items-center gap-2 p-2 h-8',
        className,
      )}
    >
      <LoaderCircle className="h-4 w-4 animate-spin" />
      {message}
    </div>
  );
};

export const ColumnPreviewContainer: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className }) => {
  return (
    <div
      data-slot="column-preview-container"
      className={cn('flex flex-col gap-2 relative', className)}
    >
      {children}
    </div>
  );
};

export const ColumnName = ({
  columnName,
  dataType,
}: {
  columnName: React.ReactNode;
  dataType: DataType;
}) => {
  const Icon = DATA_TYPE_ICON[dataType];
  const color = getDataTypeColor(dataType);

  return (
    <div data-slot="column-name" className="flex flex-row items-center gap-1.5">
      <Icon
        className={`w-4 h-4 p-0.5 rounded-sm stroke-card-foreground ${color}`}
      />
      {columnName}
    </div>
  );
};
