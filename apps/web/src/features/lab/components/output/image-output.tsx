"use client";

import { cn } from "@/lib/utils";
import type { KnownMimeType } from "../../types";

// ─── Image Output ────────────────────────────────────────

interface ImageOutputProps {
  data: string;
  mimetype: KnownMimeType;
  className?: string;
}

/**
 * ImageOutput — renders base64-encoded images and SVGs
 *
 * Adapted from Marimo's ImageOutput.tsx
 * Handles data URIs and raw base64 data
 */
export function ImageOutput({ data, mimetype, className }: ImageOutputProps) {
  // Build src — handle both data URIs and raw base64
  const src = data.startsWith("data:")
    ? data
    : `data:${mimetype};base64,${data}`;

  if (mimetype === "image/svg+xml" && !data.startsWith("data:")) {
    // For raw SVG markup, render inline
    return (
      <div
        data-slot="image-output"
        className={cn("output-image max-w-full overflow-auto", className)}
        dangerouslySetInnerHTML={{ __html: data }}
      />
    );
  }

  return (
    <div data-slot="image-output" className={cn("output-image", className)}>
      <img
        src={src}
        alt="Cell output"
        className="max-w-full h-auto rounded-md"
        loading="lazy"
      />
    </div>
  );
}
