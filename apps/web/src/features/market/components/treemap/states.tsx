"use client";

import { memo } from "react";
import { Loader2, AlertCircle, BarChart3, RefreshCw, Search } from "lucide-react";

// ============ Loading State ============

interface LoadingStateProps {
  message?: string;
  className?: string;
}

export const LoadingState = memo(function LoadingState({
  message = "加载中...",
  className = "",
}: LoadingStateProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center gap-3 p-8 ${className}`}
      role="status"
      aria-live="polite"
    >
      <Loader2 className="w-8 h-8 text-mine-muted animate-spin motion-reduce:animate-none" />
      <span className="text-sm text-mine-muted">{message}</span>
    </div>
  );
});

// ============ Error State ============

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  className?: string;
}

export const ErrorState = memo(function ErrorState({
  title = "加载失败",
  message = "无法加载数据，请稍后重试",
  onRetry,
  className = "",
}: ErrorStateProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center gap-4 p-8 ${className}`}
      role="alert"
    >
      <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-100">
        <AlertCircle className="w-6 h-6 text-red-500" />
      </div>
      <div className="text-center">
        <h3 className="text-base font-medium text-mine-text">{title}</h3>
        <p className="mt-1 text-sm text-mine-muted">{message}</p>
      </div>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="
            flex items-center gap-2 px-4 py-2
            text-sm font-medium
            text-white bg-primary-500
            rounded-md
            hover:bg-primary-600
            focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2
            transition-colors
          "
        >
          <RefreshCw className="w-4 h-4" />
          重试
        </button>
      )}
    </div>
  );
});

// ============ Empty State ============

interface EmptyStateProps {
  icon?: "chart" | "search";
  title?: string;
  message?: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export const EmptyState = memo(function EmptyState({
  icon = "chart",
  title = "暂无数据",
  message = "当前没有可显示的数据",
  actionLabel,
  onAction,
  className = "",
}: EmptyStateProps) {
  const IconComponent = icon === "search" ? Search : BarChart3;

  return (
    <div
      className={`flex flex-col items-center justify-center gap-4 p-8 ${className}`}
    >
      <div className="flex items-center justify-center w-16 h-16 rounded-full bg-gray-100">
        <IconComponent className="w-8 h-8 text-mine-muted" />
      </div>
      <div className="text-center">
        <h3 className="text-base font-medium text-mine-text">{title}</h3>
        <p className="mt-1 text-sm text-mine-muted">{message}</p>
      </div>
      {actionLabel && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="
            px-4 py-2
            text-sm font-medium
            text-primary-600
            border border-primary-300
            rounded-md
            hover:bg-primary-50
            focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2
            transition-colors
          "
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
});

// ============ No Results State ============

interface NoResultsStateProps {
  query: string;
  onClear?: () => void;
  className?: string;
}

export const NoResultsState = memo(function NoResultsState({
  query,
  onClear,
  className = "",
}: NoResultsStateProps) {
  return (
    <EmptyState
      icon="search"
      title="无搜索结果"
      message={`未找到与 "${query}" 相关的内容`}
      actionLabel={onClear ? "清除搜索" : undefined}
      onAction={onClear}
      className={className}
    />
  );
});

// ============ Skeleton Grid ============

interface SkeletonGridProps {
  count?: number;
  className?: string;
}

export const SkeletonGrid = memo(function SkeletonGrid({
  count = 12,
  className = "",
}: SkeletonGridProps) {
  return (
    <div className={`grid grid-cols-4 gap-2 p-2 ${className}`}>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="
            aspect-[4/3]
            rounded-lg
            bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200
            animate-pulse
            motion-reduce:animate-none
          "
          style={{
            animationDelay: `${i * 100}ms`,
          }}
        />
      ))}
    </div>
  );
});
