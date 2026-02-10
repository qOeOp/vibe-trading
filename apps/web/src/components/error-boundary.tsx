'use client';

import { Component, type ReactNode } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode | ((error: Error) => ReactNode);
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Application error:', error, errorInfo);
    this.props.onError?.(error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError && this.state.error) {
      if (this.props.fallback) {
        if (typeof this.props.fallback === 'function') {
          return this.props.fallback(this.state.error);
        }
        return this.props.fallback;
      }

      return (
        <div className="flex min-h-screen items-center justify-center p-4 bg-background">
          <div className="text-center space-y-4 max-w-md">
            <div className="space-y-2">
              <h1 className="text-4xl font-bold text-foreground">Something went wrong</h1>
              <p className="text-muted-foreground">
                We encountered an unexpected error. Please refresh the page to try again.
              </p>
            </div>
            {process.env.NODE_ENV === 'development' && (
              <details className="text-left mt-4 p-4 bg-muted rounded-lg">
                <summary className="cursor-pointer font-medium text-sm">
                  Error Details (Development Only)
                </summary>
                <pre className="mt-2 text-xs overflow-auto">
                  {this.state.error.message}
                  {'\n\n'}
                  {this.state.error.stack}
                </pre>
              </details>
            )}
            <div className="flex gap-2 justify-center">
              <button
                onClick={this.handleReset}
                className="px-6 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/90 transition-colors"
              >
                Try Again
              </button>
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
              >
                Refresh Page
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export function FeatureErrorFallback({
  error,
  featureName,
  onRetry,
}: {
  error: Error;
  featureName: string;
  onRetry?: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center p-6 rounded-xl bg-destructive/5 border border-destructive/20 text-center">
      <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center mb-3">
        <svg
          className="w-6 h-6 text-destructive"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
      </div>
      <h3 className="font-semibold text-foreground mb-1">
        {featureName} failed to load
      </h3>
      <p className="text-sm text-muted-foreground mb-3">
        An error occurred while loading this feature.
      </p>
      {process.env.NODE_ENV === 'development' && (
        <p className="text-xs text-destructive/80 font-mono mb-3 max-w-xs truncate">
          {error.message}
        </p>
      )}
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-4 py-1.5 text-sm bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
        >
          Retry
        </button>
      )}
    </div>
  );
}
