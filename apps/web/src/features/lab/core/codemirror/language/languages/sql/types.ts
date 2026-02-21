/** 迁移自 marimo:core/kernel/messages.ts (SQL-relevant types only) */

/**
 * ADAPTATION:
 * - Extracted from Marimo's kernel/messages.ts — only the types needed
 *   by the SQL completion/rendering system.
 * - In Marimo these come from the kernel protocol. In VT they are
 *   standalone type definitions.
 */

export type DataType =
  | 'boolean'
  | 'date'
  | 'time'
  | 'datetime'
  | 'number'
  | 'integer'
  | 'string'
  | 'unknown';

export interface DataTableColumn {
  name: string;
  type: DataType;
  external_type: string;
  sample_values?: unknown[];
}

export interface DataTable {
  name: string;
  type: 'table' | 'view';
  source: string;
  source_type: 'local' | 'duckdb' | 'connection' | 'catalog';
  columns: DataTableColumn[];
  variable_name?: string;
  engine?: string;
  num_columns?: number;
  num_rows?: number;
  primary_keys?: string[];
  indexes?: string[];
}

export interface DatabaseSchema {
  name: string;
  tables: DataTable[];
}

export interface Database {
  name: string;
  dialect: string;
  engine?: string;
  schemas: DatabaseSchema[];
}

export interface DataSourceConnection {
  name: string;
  dialect: string;
  source: string;
  default_database?: string;
  default_schema?: string;
  databases: Database[];
}

/**
 * Connection name type alias.
 * In Marimo this is a branded string from datasets/engines.
 */
export type ConnectionName = string;
