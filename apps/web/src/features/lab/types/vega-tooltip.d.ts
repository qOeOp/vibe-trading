/**
 * Type declarations for vega-tooltip package exports that can't be resolved
 * under moduleResolution: "node". This bridges the gap until the project
 * migrates to moduleResolution: "bundler".
 */
declare module 'vega-tooltip' {
  export { Handler } from 'vega-tooltip/build/index';
}
