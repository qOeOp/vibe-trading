/* Copyright 2026 Marimo. All rights reserved. */

import { BotIcon } from 'lucide-react';
import * as React from 'react';
import type { ProviderId } from '@/features/lab/core/ai/ids/ids';
import { cn } from '@/features/lab/utils/cn';
import type { ExternalAgentId } from '../chat/acp/state';

export interface AiProviderIconProps
  extends React.HTMLAttributes<HTMLImageElement> {
  provider: ProviderId | ExternalAgentId | 'openai-compatible';
  className?: string;
}

/**
 * Renders an AI provider icon. Falls back to BotIcon since VT
 * doesn't bundle the original @marimo-team/llm-info SVG icons.
 */
export const AiProviderIcon: React.FC<AiProviderIconProps> = ({
  provider,
  className = '',
  ...props
}) => {
  // All providers use the generic bot icon in VT
  void props;
  return <BotIcon className={cn('h-4 w-4', className)} />;
};
