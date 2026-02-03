"use client";

import { memo, useState, useCallback, useEffect, useRef, ChangeEvent } from "react";
import { Search, X, SlidersHorizontal } from "lucide-react";

// ============ Types ============

interface SearchBoxProps {
  /** Current search value */
  value: string;
  /** Callback when search value changes (after debounce) */
  onChange: (value: string) => void;
  /** Placeholder text */
  placeholder?: string;
  /** Debounce delay in milliseconds */
  debounceMs?: number;
  /** Optional className for styling */
  className?: string;
  /** Whether the search is in loading state */
  isLoading?: boolean;
}

// ============ Constants ============

const DEFAULT_DEBOUNCE_MS = 300;
const DEFAULT_PLACEHOLDER = "搜索板块/股票...";

// ============ Hook: useDebounce ============

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}

// ============ Component ============

export const SearchBox = memo(function SearchBox({
  value,
  onChange,
  placeholder = DEFAULT_PLACEHOLDER,
  debounceMs = DEFAULT_DEBOUNCE_MS,
  className = "",
  isLoading = false,
}: SearchBoxProps) {
  const [inputValue, setInputValue] = useState(value);
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Debounce the input value
  const debouncedValue = useDebounce(inputValue, debounceMs);

  // Sync external value changes
  useEffect(() => {
    setInputValue(value);
  }, [value]);

  // Trigger onChange when debounced value changes
  useEffect(() => {
    if (debouncedValue !== value) {
      onChange(debouncedValue);
    }
  }, [debouncedValue, value, onChange]);

  const handleInputChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  }, []);

  const handleClear = useCallback(() => {
    setInputValue("");
    onChange("");
    inputRef.current?.focus();
  }, [onChange]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Escape") {
        handleClear();
      }
    },
    [handleClear]
  );

  const handleFocus = useCallback(() => setIsFocused(true), []);
  const handleBlur = useCallback(() => setIsFocused(false), []);

  return (
    <div
      className={`
        relative flex items-center gap-2
        h-9 px-3
        bg-white rounded-full shadow-sm
        transition-shadow duration-200
        ${isFocused ? "shadow-md ring-1 ring-mine-text/10" : ""}
        ${className}
      `}
    >
      {/* Search Icon */}
      <div className="flex-shrink-0">
        {isLoading ? (
          <div className="w-4 h-4 border-2 border-mine-muted border-t-transparent rounded-full animate-spin motion-reduce:animate-none" />
        ) : (
          <Search className="w-4 h-4 text-mine-muted" />
        )}
      </div>

      {/* Input */}
      <input
        ref={inputRef}
        type="search"
        name="treemap-search"
        autoComplete="off"
        value={inputValue}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onFocus={handleFocus}
        onBlur={handleBlur}
        placeholder={placeholder}
        className="
          flex-1 min-w-0
          text-sm text-mine-text
          bg-transparent
          border-none
          placeholder:text-mine-muted
          focus:outline-none
        "
        aria-label="Search"
      />

      {/* Clear Button - only show when there's input */}
      {inputValue ? (
        <button
          type="button"
          onClick={handleClear}
          className="
            flex-shrink-0
            p-0.5
            text-mine-muted hover:text-mine-text
            rounded-full
            focus:outline-none focus-visible:ring-2 focus-visible:ring-mine-text/20
            transition-colors
          "
          aria-label="Clear search"
        >
          <X className="w-4 h-4" />
        </button>
      ) : (
        /* Filter Icon - show when no input */
        <button
          type="button"
          className="
            flex-shrink-0
            p-0.5
            text-mine-muted hover:text-mine-text
            rounded-full
            focus:outline-none focus-visible:ring-2 focus-visible:ring-mine-text/20
            transition-colors
          "
          aria-label="Filter options"
        >
          <SlidersHorizontal className="w-4 h-4" />
        </button>
      )}
    </div>
  );
});

// ============ Utility Functions ============

/**
 * Filter items by search query (case-insensitive)
 */
export function filterBySearch<T extends { name: string }>(
  items: T[],
  query: string
): T[] {
  if (!query.trim()) {
    return items;
  }

  const normalizedQuery = query.trim().toLowerCase();
  return items.filter((item) =>
    item.name.toLowerCase().includes(normalizedQuery)
  );
}

/**
 * Highlight matching text in a string
 */
export function highlightMatch(text: string, query: string): string {
  if (!query.trim()) {
    return text;
  }

  const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi");
  return text.replace(regex, "<mark>$1</mark>");
}
