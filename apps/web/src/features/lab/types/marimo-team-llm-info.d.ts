/**
 * Type declarations for @marimo-team/llm-info (private package).
 * Minimal types extracted from marimo/packages/llm-info/src/index.ts
 */
declare module '@marimo-team/llm-info' {
  export const ROLES: readonly [
    'chat',
    'edit',
    'rerank',
    'embed',
    'autocomplete',
  ];
  export type Role = (typeof ROLES)[number];

  export interface AiModel {
    name: string;
    model: string;
    description: string;
    providers: string[];
    roles: Role[];
    thinking: boolean;
  }

  export interface AiProvider {
    name: string;
    id: string;
    description: string;
    url: string;
  }
}

// SVG icon imports (resolved as inline strings via ?inline)
declare module '@marimo-team/llm-info/icons/anthropic.svg?inline' {
  const src: string;
  export default src;
}
declare module '@marimo-team/llm-info/icons/aws.svg?inline' {
  const src: string;
  export default src;
}
declare module '@marimo-team/llm-info/icons/azure.svg?inline' {
  const src: string;
  export default src;
}
declare module '@marimo-team/llm-info/icons/deepseek.svg?inline' {
  const src: string;
  export default src;
}
declare module '@marimo-team/llm-info/icons/github.svg?inline' {
  const src: string;
  export default src;
}
declare module '@marimo-team/llm-info/icons/googlegemini.svg?inline' {
  const src: string;
  export default src;
}
declare module '@marimo-team/llm-info/icons/ollama.svg?inline' {
  const src: string;
  export default src;
}
declare module '@marimo-team/llm-info/icons/openai.svg?inline' {
  const src: string;
  export default src;
}
declare module '@marimo-team/llm-info/icons/opencode-logo-light.svg?inline' {
  const src: string;
  export default src;
}
declare module '@marimo-team/llm-info/icons/openrouter.svg?inline' {
  const src: string;
  export default src;
}
declare module '@marimo-team/llm-info/icons/weightsandbiases.svg?inline' {
  const src: string;
  export default src;
}

// JSON data imports
declare module '@marimo-team/llm-info/models.json' {
  import type { AiModel } from '@marimo-team/llm-info';
  export const models: AiModel[];
}
declare module '@marimo-team/llm-info/providers.json' {
  import type { AiProvider } from '@marimo-team/llm-info';
  export const providers: AiProvider[];
}
