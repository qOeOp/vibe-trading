/* Copyright 2026 Marimo. All rights reserved. */

// @ts-expect-error — path-to-regexp v8 removed named type exports
import { match } from 'path-to-regexp';

type ParamData = Record<string, string | string[]>;
type MatchFunction<T> = (path: string) => false | Match<T>;
type Match<T> = { params: T; path: string; index: number };

export class TinyRouter {
  private routes: {
    template: string;
    pathFunction: MatchFunction<ParamData>;
  }[];

  constructor(templates: string[]) {
    this.routes = templates.map((template) => {
      return {
        template,
        pathFunction: match(template),
      };
    });
  }

  match(location: Location): [Match<ParamData>, template: string] | false {
    for (const { pathFunction, template } of this.routes) {
      const match =
        pathFunction(location.hash) || pathFunction(location.pathname);
      if (match) {
        return [match, template];
      }
    }

    return false;
  }
}
