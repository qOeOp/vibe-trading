/* Copyright 2026 Marimo. All rights reserved. */
/* Stub: VT lab migration — data explorer function utils */

import type { FieldQuery } from 'compassql/build/src/query/encoding';
import { type FieldFunction, isAggregateOp, type TimeUnitOp } from './types';

type FieldQueryFunctionMixins = Pick<
  FieldQuery,
  'aggregate' | 'timeUnit' | 'bin'
>;

export function toFieldQueryFunctionMixins(
  fn: FieldFunction | undefined,
): FieldQueryFunctionMixins {
  if (!fn) {
    return {};
  }
  if (fn === 'bin') {
    return { bin: true };
  }
  if (isAggregateOp(fn)) {
    return { aggregate: fn };
  }
  return {};
}

export const QUANTITATIVE_FUNCTIONS: FieldFunction[] = [
  'bin',
  'min',
  'max',
  'mean',
  'median',
  'sum',
];

export const SINGLE_TEMPORAL_FUNCTIONS: FieldFunction[] = [
  'year',
  'month',
  'date',
  'day',
  'hours',
  'minutes',
  'seconds',
  'milliseconds',
];

export const MULTI_TEMPORAL_FUNCTIONS: FieldFunction[] = [
  'yearmonth',
  'yearmonthdate',
  'monthdate',
];

export function fromFieldQueryFunctionMixins(
  fieldQuery: FieldQueryFunctionMixins,
): FieldFunction | undefined {
  const { aggregate, bin, timeUnit } = fieldQuery;
  if (bin) {
    return 'bin';
  }
  if (aggregate) {
    return aggregate.toString() as FieldFunction;
  }
  if (timeUnit) {
    return timeUnit.toString() as FieldFunction;
  }
  return undefined;
}
