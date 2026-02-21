/**
 * static-implements — TypeScript decorator for static interface enforcement
 * 迁移自 marimo:utils/staticImplements.ts L1-L7
 * 修改: 无（完整迁移）
 */

export function staticImplements<T>() {
  return <U extends T>(_constructor: U) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    _constructor;
  };
}
