/**
 * Stub: @marimo-team/llm-info — Local replacement for Marimo's private package.
 */

export const ROLES = [
  'chat',
  'edit',
  'rerank',
  'embed',
  'autocomplete',
] as const;
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
