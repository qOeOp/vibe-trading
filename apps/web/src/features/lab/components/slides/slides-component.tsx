/* Copyright 2026 Marimo. All rights reserved. */
/* Stub: VT lab migration — slides component (lazy loaded, not needed in VT) */

import React, { type PropsWithChildren } from 'react';

interface SlidesComponentProps {
  className?: string;
  forceKeyboardNavigation?: boolean;
  index?: string | null;
  height?: string | number | null;
  wrapAround?: boolean;
}

const SlidesComponent = ({
  className,
  children,
}: PropsWithChildren<SlidesComponentProps>) => {
  return <div className={className}>{children}</div>;
};

export default SlidesComponent;
