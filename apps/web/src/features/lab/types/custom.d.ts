/**
 * Lab Type Declarations — Stricter lib types for lab feature
 * 迁移自 marimo:custom.d.ts L1-L27
 * 修改:
 * - 移除 SVG module declaration (VT tsconfig 已有全局 SVG 支持)
 * - 保留 Body.json stricter type (返回 unknown 而非 any)
 * - 保留 JSON.parse stricter type (返回 unknown 而非 any)
 * - 保留 Array.filter(Boolean) narrowing (移除 null/undefined)
 */

/* eslint-disable @typescript-eslint/no-explicit-any */

// Stricter lib types
interface Body {
  json<T = unknown>(): Promise<T>;
}

// Stricter lib types
interface JSON {
  parse(
    text: string,
    reviver?: (this: any, key: string, value: any) => any,
  ): unknown;

  rawJSON(value: string): unknown;
}

// Improve type inference for Array.filter with BooleanConstructor
interface Array<T> {
  filter(predicate: BooleanConstructor): NonNullable<T>[];
}

// Asset imports
declare module '*.png?inline' {
  const src: string;
  export default src;
}
declare module '*.png' {
  const src: string;
  export default src;
}
