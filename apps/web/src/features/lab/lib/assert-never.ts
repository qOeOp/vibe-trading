/**
 * assertNever — Type-safe exhaustiveness check for discriminated unions
 * 迁移自 marimo:utils/assertNever.ts L1-L20
 * 修改: Logger 引用改为 ./logger
 */

import { invariant } from './invariant';
import { Logger } from './logger';

/**
 * Type-safe exhaustiveness check for discriminated unions.
 */
export function assertNever(x: never): never {
  invariant(false, `Unexpected object: ${x}`);
}

/**
 * Like assertNever, but logs the unexpected object to the console.
 * Useful for exhaustiveness checks but without throwing an error.
 */
export function logNever(x: never): void {
  Logger.warn(`Unexpected object: ${JSON.stringify(x)}`);
  // biome-ignore lint/correctness/noVoidTypeReturn: <explanation>
  return x;
}
