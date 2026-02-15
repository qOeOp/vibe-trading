import type { Factor } from "../types";

const EXPORT_HEADERS = [
  "id",
  "name",
  "version",
  "category",
  "status",
  "ic",
  "ir",
  "turnover",
  "capacity",
  "winRate",
  "createdAt",
  "createdBy",
] as const;

function downloadBlob(
  content: string,
  filename: string,
  mimeType: string,
): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function exportAsCSV(factors: Factor[]): void {
  const rows = factors.map((f) =>
    EXPORT_HEADERS.map((h) => {
      const val = f[h as keyof Factor];
      if (typeof val === "string") return `"${val.replace(/"/g, '""')}"`;
      return String(val ?? "");
    }).join(","),
  );
  const csv = [EXPORT_HEADERS.join(","), ...rows].join("\n");
  downloadBlob(csv, "factors.csv", "text/csv");
}

export function exportAsJSON(factors: Factor[]): void {
  const data = factors.map((f) => ({
    id: f.id,
    name: f.name,
    version: f.version,
    category: f.category,
    status: f.status,
    ic: f.ic,
    ir: f.ir,
    turnover: f.turnover,
    capacity: f.capacity,
    winRate: f.winRate,
    createdAt: f.createdAt,
    createdBy: f.createdBy,
  }));
  downloadBlob(
    JSON.stringify(data, null, 2),
    "factors.json",
    "application/json",
  );
}
