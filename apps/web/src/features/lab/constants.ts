/* Lab feature constants */

export const MARIMO_KERNEL_PORT = 2728;
export const MARIMO_KERNEL_BASE = `http://localhost:${MARIMO_KERNEL_PORT}`;
export const MARIMO_COMMAND = `marimo edit ~/.vt-lab --headless --port ${MARIMO_KERNEL_PORT} --no-token --no-skew-protection --allow-origins "http://localhost:4200"`;

/** Fixed workspace directory name (created under ~/) */
export const VT_WORKSPACE_DIR = '.vt-lab';

/** Default notebook created on first connect */
export const VT_WELCOME_NOTEBOOK = 'welcome.py';
