/**
 * Vite-style import.meta.env declarations for Marimo migrated code.
 * In Next.js, these map to process.env equivalents at build time.
 */
interface ImportMetaEnv {
  DEV: boolean;
  PROD: boolean;
  MODE: string;
  BASE_URL: string;
  VITE_MARIMO_VERSION?: string;
  [key: string]: string | boolean | undefined;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
