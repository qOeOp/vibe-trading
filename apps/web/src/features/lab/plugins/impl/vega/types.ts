/* Copyright 2026 Marimo. All rights reserved. */

import type { Field } from "vega-lite/build/channeldef";
import type { Encoding } from "vega-lite/build/encoding";
import type {
  GenericUnitSpec,
  TopLevelUnitSpec,
} from "vega-lite/build/spec/unit";

export type { TopLevelSpec as VegaLiteSpec } from "vega-lite";
export type { SingleDefUnitChannel } from "vega-lite/build/channel";
export type { Field } from "vega-lite/build/channeldef";
export type { SharedCompositeEncoding } from "vega-lite/build/compositemark/index";
export type { DataFormat } from "vega-lite/build/data";
export type { AnyMark, MarkDef } from "vega-lite/build/mark";
export type {
  SelectionParameter,
  SelectionType,
} from "vega-lite/build/selection";
export type { GenericFacetSpec } from "vega-lite/build/spec/facet";
export type { LayerSpec } from "vega-lite/build/spec/layer";
export type {
  FacetedUnitSpec,
  UnitSpec,
} from "vega-lite/build/spec/unit";

export type VegaLiteUnitSpec = TopLevelUnitSpec<Field>;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type GenericVegaSpec = GenericUnitSpec<any, any, any>;
export type EncodingType = keyof Encoding<Field>;
export type Encodings = Encoding<Field>;

// import type { Mark } from "vega-lite/build/mark";
// Mark has issues with types so we manually define
export const Mark = {
  arc: "arc",
  area: "area",
  bar: "bar",
  image: "image",
  line: "line",
  point: "point",
  rect: "rect",
  rule: "rule",
  text: "text",
  tick: "tick",
  trail: "trail",
  circle: "circle",
  square: "square",
  geoshape: "geoshape",
} as const;
export type Mark = keyof typeof Mark;
