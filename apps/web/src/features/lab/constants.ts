/* Lab feature constants */

export const MARIMO_KERNEL_PORT = 2728;
export const MARIMO_KERNEL_BASE = `http://localhost:${MARIMO_KERNEL_PORT}`;
export const MARIMO_COMMAND = `marimo edit --headless --port ${MARIMO_KERNEL_PORT} --no-token --allow-origins "http://localhost:4200"`;
