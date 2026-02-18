// ─── Output Adapter ──────────────────────────────────────
// Bridges Pyodide CellOutput → Marimo OutputMessage format
//
// The legacy CellOutput from the Pyodide worker uses:
//   { stream: "stdout" | "stderr" | "result", text: string, timestamp: number }
//
// The Marimo-compatible OutputMessage uses:
//   { channel, mimetype, data, timestamp }
//
// This adapter converts between the two formats.

import type {
  CellOutput,
  OutputMessage,
  OutputChannel,
  KnownMimeType,
  MarimoError,
} from "../types";

// ─── Legacy → Marimo ─────────────────────────────────────

/**
 * Convert a legacy CellOutput to a Marimo-compatible OutputMessage
 */
export function adaptCellOutput(output: CellOutput): OutputMessage {
  const channelMap: Record<CellOutput["stream"], OutputChannel> = {
    stdout: "stdout",
    stderr: "stderr",
    result: "output",
  };

  const channel = channelMap[output.stream] ?? "output";

  // For result stream, try to detect HTML content
  if (output.stream === "result") {
    const mimetype = detectMimeType(output.text);
    return {
      channel,
      mimetype,
      data: output.text,
      timestamp: output.timestamp,
    };
  }

  return {
    channel,
    mimetype: "text/plain",
    data: output.text,
    timestamp: output.timestamp,
  };
}

/**
 * Convert a raw Pyodide result string into an OutputMessage.
 * Detects HTML, JSON, and image data.
 */
export function adaptPyodideResult(text: string): OutputMessage {
  const mimetype = detectMimeType(text);
  return {
    channel: "output",
    mimetype,
    data: text,
    timestamp: Date.now(),
  };
}

/**
 * Convert a Pyodide error into a Marimo-compatible error OutputMessage
 */
export function adaptError(
  error: string,
  traceback?: string,
): OutputMessage {
  const errors: MarimoError[] = [
    {
      type: "RuntimeError",
      msg: error,
      ...(traceback ? { traceback: traceback.split("\n") } : {}),
    },
  ];

  return {
    channel: "marimo-error",
    mimetype: "application/vnd.marimo+error",
    data: errors,
    timestamp: Date.now(),
  };
}

/**
 * Convert stdout/stderr text to OutputMessage
 */
export function adaptConsoleOutput(
  stream: "stdout" | "stderr",
  text: string,
  cellId?: string,
): OutputMessage {
  return {
    channel: stream,
    mimetype: "text/plain",
    data: text,
    timestamp: Date.now(),
  };
}

// ─── Batch Conversion ────────────────────────────────────

/**
 * Convert an array of legacy CellOutputs to OutputMessages
 */
export function adaptCellOutputs(outputs: CellOutput[]): OutputMessage[] {
  return outputs.map(adaptCellOutput);
}

// ─── MIME Detection ──────────────────────────────────────

/**
 * Heuristic MIME type detection for Pyodide output strings
 */
function detectMimeType(text: string): KnownMimeType {
  const trimmed = text.trim();

  // HTML detection
  if (
    trimmed.startsWith("<") &&
    (trimmed.startsWith("<!") ||
      trimmed.startsWith("<div") ||
      trimmed.startsWith("<table") ||
      trimmed.startsWith("<html") ||
      trimmed.startsWith("<img") ||
      trimmed.startsWith("<svg") ||
      trimmed.startsWith("<style") ||
      trimmed.startsWith("<p") ||
      trimmed.startsWith("<h1") ||
      trimmed.startsWith("<h2") ||
      trimmed.startsWith("<h3") ||
      trimmed.startsWith("<span") ||
      trimmed.startsWith("<pre") ||
      trimmed.startsWith("<figure") ||
      trimmed.startsWith("<iframe"))
  ) {
    return "text/html";
  }

  // SVG detection
  if (trimmed.startsWith("<svg") || trimmed.startsWith("<?xml")) {
    return "image/svg+xml";
  }

  // JSON detection
  if (
    (trimmed.startsWith("{") && trimmed.endsWith("}")) ||
    (trimmed.startsWith("[") && trimmed.endsWith("]"))
  ) {
    try {
      JSON.parse(trimmed);
      return "application/json";
    } catch {
      // Not valid JSON, fall through
    }
  }

  // Base64 image detection (data URI)
  if (trimmed.startsWith("data:image/png;base64,")) {
    return "image/png";
  }
  if (trimmed.startsWith("data:image/jpeg;base64,")) {
    return "image/jpeg";
  }
  if (trimmed.startsWith("data:image/svg+xml;base64,")) {
    return "image/svg+xml";
  }

  // Markdown detection (starts with # heading)
  if (/^#{1,6}\s/.test(trimmed)) {
    return "text/markdown";
  }

  return "text/plain";
}
