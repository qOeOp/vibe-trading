/**
 * Pyodide Worker Singleton
 *
 * Provides a single shared Web Worker instance for both:
 * - Python code execution (EXEC messages)
 * - Python syntax linting (LINT messages)
 *
 * This avoids loading two separate Pyodide instances (~10MB each).
 * The worker is lazily created on first access and terminated
 * when `dispose()` is called (typically on page unmount).
 */

let worker: Worker | null = null;
let refCount = 0;

/** Get or create the shared Pyodide worker. Increments ref count. */
export function acquireWorker(): Worker {
  refCount++;
  if (!worker) {
    worker = new Worker("/pyodide-worker.js");
  }
  return worker;
}

/**
 * Get the worker without incrementing ref count.
 * Returns null if not yet created.
 */
export function getWorker(): Worker | null {
  return worker;
}

/**
 * Release a reference. When all references are released,
 * the worker is terminated.
 */
export function releaseWorker(): void {
  refCount = Math.max(0, refCount - 1);
  if (refCount === 0 && worker) {
    worker.terminate();
    worker = null;
  }
}
