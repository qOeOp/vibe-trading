"use client";

import { useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import { ChevronRight, ChevronDown, Copy, Check } from "lucide-react";

// ─── JSON Output ─────────────────────────────────────────

interface JsonOutputProps {
  data: string | Record<string, unknown> | unknown[];
  className?: string;
}

/**
 * JsonOutput — renders JSON with collapsible tree view
 *
 * Adapted from Marimo's JsonOutput (simplified, no Vega support)
 * Uses <details> for collapsible nodes, syntax-highlighted values
 */
export function JsonOutput({ data, className }: JsonOutputProps) {
  const [copied, setCopied] = useState(false);

  const parsed = useMemo(() => {
    if (typeof data === "string") {
      try {
        return JSON.parse(data);
      } catch {
        return data;
      }
    }
    return data;
  }, [data]);

  const rawString = useMemo(() => {
    return typeof data === "string" ? data : JSON.stringify(data, null, 2);
  }, [data]);

  const handleCopy = () => {
    navigator.clipboard.writeText(rawString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div data-slot="json-output" className={cn("relative group/json", className)}>
      {/* Copy button */}
      <button
        type="button"
        onClick={handleCopy}
        className={cn(
          "absolute top-2 right-2 z-10",
          "p-1 rounded-md transition-all",
          "opacity-0 group-hover/json:opacity-100",
          "bg-white border border-mine-border shadow-sm",
          "text-mine-muted hover:text-mine-text",
        )}
        title="Copy JSON"
      >
        {copied ? <Check className="w-3.5 h-3.5 text-mine-accent-green" /> : <Copy className="w-3.5 h-3.5" />}
      </button>

      {/* JSON tree */}
      <div className="p-3 font-mono text-xs leading-relaxed overflow-x-auto">
        <JsonNode value={parsed} depth={0} />
      </div>
    </div>
  );
}

// ─── JSON Tree Node ──────────────────────────────────────

interface JsonNodeProps {
  value: unknown;
  depth: number;
  keyName?: string;
}

function JsonNode({ value, depth, keyName }: JsonNodeProps) {
  if (value === null) {
    return (
      <span>
        {keyName && <span className="text-mine-muted">{`"${keyName}": `}</span>}
        <span className="text-mine-muted italic">null</span>
      </span>
    );
  }

  if (typeof value === "boolean") {
    return (
      <span>
        {keyName && <span className="text-mine-muted">{`"${keyName}": `}</span>}
        <span className="text-[#6366f1]">{String(value)}</span>
      </span>
    );
  }

  if (typeof value === "number") {
    return (
      <span>
        {keyName && <span className="text-mine-muted">{`"${keyName}": `}</span>}
        <span className="text-mine-accent-teal">{value}</span>
      </span>
    );
  }

  if (typeof value === "string") {
    return (
      <span>
        {keyName && <span className="text-mine-muted">{`"${keyName}": `}</span>}
        <span className="text-mine-section-green">{`"${value}"`}</span>
      </span>
    );
  }

  if (Array.isArray(value)) {
    if (value.length === 0) {
      return (
        <span>
          {keyName && <span className="text-mine-muted">{`"${keyName}": `}</span>}
          {"[]"}
        </span>
      );
    }

    return (
      <CollapsibleNode
        keyName={keyName}
        label={`Array(${value.length})`}
        bracket={["[", "]"]}
        depth={depth}
      >
        {value.map((item, i) => (
          <div key={i} className="ml-4">
            <JsonNode value={item} depth={depth + 1} />
            {i < value.length - 1 && ","}
          </div>
        ))}
      </CollapsibleNode>
    );
  }

  if (typeof value === "object") {
    const entries = Object.entries(value as Record<string, unknown>);
    if (entries.length === 0) {
      return (
        <span>
          {keyName && <span className="text-mine-muted">{`"${keyName}": `}</span>}
          {"{}"}
        </span>
      );
    }

    return (
      <CollapsibleNode
        keyName={keyName}
        label={`Object(${entries.length})`}
        bracket={["{", "}"]}
        depth={depth}
      >
        {entries.map(([key, val], i) => (
          <div key={key} className="ml-4">
            <JsonNode value={val} depth={depth + 1} keyName={key} />
            {i < entries.length - 1 && ","}
          </div>
        ))}
      </CollapsibleNode>
    );
  }

  return <span>{String(value)}</span>;
}

// ─── Collapsible Node ────────────────────────────────────

interface CollapsibleNodeProps {
  keyName?: string;
  label: string;
  bracket: [string, string];
  depth: number;
  children: React.ReactNode;
}

function CollapsibleNode({ keyName, label, bracket, depth, children }: CollapsibleNodeProps) {
  const defaultOpen = depth < 2;

  return (
    <details open={defaultOpen}>
      <summary className="cursor-pointer list-none inline-flex items-center gap-0.5 hover:bg-mine-bg/50 rounded-sm -ml-4 pl-4">
        <ChevronIcon />
        {keyName && <span className="text-mine-muted">{`"${keyName}": `}</span>}
        <span className="text-mine-muted text-[10px]">{label}</span>
        <span className="ml-0.5">{bracket[0]}</span>
      </summary>
      {children}
      <span>{bracket[1]}</span>
    </details>
  );
}

function ChevronIcon() {
  return (
    <>
      <ChevronRight className="w-3 h-3 text-mine-muted details-open:hidden" />
      <ChevronDown className="w-3 h-3 text-mine-muted hidden details-open:inline" />
    </>
  );
}
