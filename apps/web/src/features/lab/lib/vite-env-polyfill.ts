/**
 * Polyfill for Vite's import.meta.env in Next.js/Turbopack context.
 * Marimo code was originally built with Vite, which provides import.meta.env
 * at build time. Next.js doesn't provide this, so we polyfill it here.
 *
 * MUST be imported before any Marimo code that references import.meta.env.
 */
if (typeof import.meta.env === 'undefined') {
  // @ts-expect-error — polyfill for Vite's import.meta.env
  import.meta.env = {
    DEV: process.env.NODE_ENV === 'development',
    PROD: process.env.NODE_ENV === 'production',
    MODE: process.env.NODE_ENV ?? 'development',
    BASE_URL: '/',
  };
} else {
  // import.meta.env exists but may be missing MODE/DEV/PROD
  if (!('MODE' in import.meta.env)) {
    // @ts-expect-error — augmenting existing env
    import.meta.env.MODE = process.env.NODE_ENV ?? 'development';
  }
  if (!('DEV' in import.meta.env)) {
    // @ts-expect-error — augmenting existing env
    import.meta.env.DEV = process.env.NODE_ENV === 'development';
  }
  if (!('PROD' in import.meta.env)) {
    // @ts-expect-error — augmenting existing env
    import.meta.env.PROD = process.env.NODE_ENV === 'production';
  }
}
