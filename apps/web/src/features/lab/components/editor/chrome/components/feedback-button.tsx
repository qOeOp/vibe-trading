/* Copyright 2026 Marimo. All rights reserved. */
/* Stub: VT lab migration — feedback button (Marimo-specific, no-op in VT) */

import React, { type PropsWithChildren } from 'react';
import { Slot } from '@radix-ui/react-slot';

export const FeedbackButton: React.FC<PropsWithChildren> = ({ children }) => {
  return <Slot>{children}</Slot>;
};
