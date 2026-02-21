/* Copyright 2026 Marimo. All rights reserved. */
import type { Query } from "compassql/build/src/query";
import type { NONPOSITION_SCALE_CHANNELS as NONPOSITION_SCALE_CHANNELS_VEGA } from "vega-lite/build/channel";
import type { NamedData } from "vega-lite/build/data";
import type { TopLevel } from "vega-lite/build/spec/toplevel";
import type { FacetedUnitSpec } from "vega-lite/build/spec/unit";
import type { EncodingChannel, FieldDefinition } from "../encoding";

export interface PlotFieldInfo {
  fieldDef: FieldDefinition;
  channel: EncodingChannel;
}

export interface ResultPlot {
  fieldInfos: PlotFieldInfo[];

  /**
   * Spec to be used for rendering.
   */
  spec: TopLevelFacetedUnitSpec;
}

export interface Result {
  plots: ResultPlot[] | null;

  query: Query;

  limit: number;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-redundant-type-constituents
export type TopLevelFacetedUnitSpec = TopLevel<FacetedUnitSpec<any, any>> & {
  data: NamedData;
};

export interface ResultingCharts {
  main: Result;

  histograms: Result;

  addCategoricalField: Result;
  addQuantitativeField: Result;
  addTemporalField: Result;

  alternativeEncodings: Result;
  summaries: Result;
}

export interface QueryCreator {
  type: keyof ResultingCharts;

  limit: number;

  createQuery(query: Query): Query;
}

// Define our own because vega-lite types_unstable import path fails in Vite (module resolution issue)
export const NONPOSITION_SCALE_CHANNELS: typeof NONPOSITION_SCALE_CHANNELS_VEGA =
  [
    "color",
    "fill",
    "stroke",
    "opacity",
    "fillOpacity",
    "strokeOpacity",
    "strokeWidth",
    "size",
    "shape",
    "strokeDash",
    "angle",
    "time",
  ] as const;
