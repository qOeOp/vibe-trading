/* Copyright 2026 Marimo. All rights reserved. */
/* Copied from Marimo: plugins/core/builder.ts */

import type { JSX } from 'react';
import type { ZodType } from 'zod';
import type { IPlugin, IPluginProps } from '../types';
import type { FunctionSchemas, PluginFunctions } from './rpc';

type Renderer<S, D, F> = (props: IPluginProps<S, D, F>) => JSX.Element;

export function createPlugin<S>(
  tagName: string,
  opts: {
    cssStyles?: string[];
  } = {},
) {
  return {
    withData<D>(validator: ZodType<D>) {
      return {
        withFunctions<F extends PluginFunctions>(
          functions: FunctionSchemas<F>,
        ) {
          return {
            renderer(renderer: Renderer<S, D, F>): IPlugin<S, D, F> {
              return {
                ...opts,
                tagName,
                validator,
                functions,
                render: renderer,
              };
            },
          };
        },
        renderer(renderer: Renderer<S, D, unknown>): IPlugin<S, D> {
          return {
            ...opts,
            tagName,
            validator,
            render: renderer,
          };
        },
      };
    },
  };
}
