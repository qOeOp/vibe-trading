'use client';

import {
  type ChangeEvent,
  type ComponentProps,
  forwardRef,
  memo,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { Loader2, Search, X } from 'lucide-react';
import { cn } from '@/lib/utils';

// ─── Variants ─────────────────────────────────────────────

const searchInputVariants = cva(
  'relative flex items-center gap-2 bg-white transition-shadow duration-200',
  {
    variants: {
      variant: {
        /** Pill: rounded-full with shadow, used in treemap / data-table toolbars */
        pill: 'h-8 px-3 rounded-full shadow-sm',
        /** Inline: rectangular with border, used in filter bars */
        inline:
          'h-8 px-3 rounded-lg border border-mine-border focus-within:border-mine-nav-active',
        /** Default: slightly taller pill for standalone use */
        default: 'h-9 px-3 rounded-full shadow-sm',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

// ─── Hook: useDebounce ────────────────────────────────────

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}

// ─── Types ────────────────────────────────────────────────

interface SearchInputProps
  extends VariantProps<typeof searchInputVariants>,
    Omit<ComponentProps<'input'>, 'onChange' | 'value' | 'type'> {
  /** Current search value (controlled) */
  value: string;
  /** Callback when value changes — called after debounce if debounceMs > 0 */
  onChange: (value: string) => void;
  /** Debounce delay in ms. Set 0 to disable debounce. @default 0 */
  debounceMs?: number;
  /** Show loading indicator instead of search icon */
  isLoading?: boolean;
  /** Additional className for the wrapper */
  className?: string;
}

// ─── Component ────────────────────────────────────────────

const SearchInput = memo(
  forwardRef<HTMLInputElement, SearchInputProps>(function SearchInput(
    {
      value,
      onChange,
      variant,
      debounceMs = 0,
      isLoading = false,
      className,
      placeholder = 'Search...',
      ...props
    },
    forwardedRef,
  ) {
    const internalRef = useRef<HTMLInputElement>(null);
    const inputRef =
      (forwardedRef as React.RefObject<HTMLInputElement>) ?? internalRef;
    const [localValue, setLocalValue] = useState(value);
    const [isFocused, setIsFocused] = useState(false);

    const isDebounced = debounceMs > 0;
    const debouncedValue = useDebounce(
      localValue,
      isDebounced ? debounceMs : 0,
    );

    // Sync external value → local
    useEffect(() => {
      setLocalValue(value);
    }, [value]);

    // Fire onChange on debounced value change
    useEffect(() => {
      if (isDebounced && debouncedValue !== value) {
        onChange(debouncedValue);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [debouncedValue]);

    const handleChange = useCallback(
      (e: ChangeEvent<HTMLInputElement>) => {
        const next = e.target.value;
        setLocalValue(next);
        if (!isDebounced) {
          onChange(next);
        }
      },
      [isDebounced, onChange],
    );

    const handleClear = useCallback(() => {
      setLocalValue('');
      onChange('');
      inputRef.current?.focus();
    }, [onChange, inputRef]);

    const handleKeyDown = useCallback(
      (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Escape') {
          handleClear();
        }
        props.onKeyDown?.(e);
      },
      [handleClear, props],
    );

    const displayValue = isDebounced ? localValue : value;

    // Focus ring for pill/default variants
    const focusRing =
      variant !== 'inline' && isFocused
        ? 'shadow-md ring-1 ring-mine-text/10'
        : '';

    return (
      <div
        data-slot="search-input"
        className={cn(searchInputVariants({ variant }), focusRing, className)}
      >
        {/* Search / Loading icon */}
        <div className="shrink-0">
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin text-mine-muted" />
          ) : (
            <Search className="h-3.5 w-3.5 text-mine-muted" />
          )}
        </div>

        {/* Input */}
        <input
          ref={inputRef}
          type="search"
          autoComplete="off"
          value={displayValue}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          className="min-w-0 flex-1 border-none bg-transparent p-0 text-sm text-mine-text placeholder:text-mine-muted focus:outline-none focus:ring-0"
          aria-label={typeof placeholder === 'string' ? placeholder : 'Search'}
          {...props}
        />

        {/* Clear button */}
        {displayValue ? (
          <button
            type="button"
            onClick={handleClear}
            className="shrink-0 rounded-full p-0.5 text-mine-muted transition-colors hover:text-mine-text focus:outline-none focus-visible:ring-2 focus-visible:ring-mine-text/20"
            aria-label="Clear search"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        ) : null}
      </div>
    );
  }),
);

export { SearchInput, searchInputVariants };
