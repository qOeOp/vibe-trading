/**
 * assertExists — Assert that a value is not null or undefined
 * 迁移自 marimo:utils/assertExists.ts L1-L12
 * 修改: 无（完整迁移）
 */

export function assertExists<T>(
  x: T | null | undefined,
  message?: string,
): asserts x is T {
  if (x === undefined || x === null) {
    if (message) {
      throw new Error(message);
    }
    throw new Error(`Expected value but got ${x}`);
  }
}
