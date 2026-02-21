/**
 * Type declarations for @marimo-team/codemirror-sql subpaths.
 * Bridges moduleResolution: "node" gap.
 */
declare module '@marimo-team/codemirror-sql/dialects' {
  export {
    DuckDBDialect,
    BigQueryDialect,
  } from '@marimo-team/codemirror-sql/dist/dialects/index';
}

declare module '@marimo-team/codemirror-sql/data/common-keywords.json' {
  const data: Record<string, unknown>;
  export default data;
}

declare module '@marimo-team/codemirror-sql/data/duckdb-keywords.json' {
  const data: Record<string, unknown>;
  export default data;
}
