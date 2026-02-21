/**
 * Type declarations for vega-lite package exports that can't be resolved
 * under moduleResolution: "node". This bridges the gap until the project
 * migrates to moduleResolution: "bundler".
 */
declare module 'vega-lite' {
  export type { TopLevelSpec } from 'vega-lite/build/index';
}
