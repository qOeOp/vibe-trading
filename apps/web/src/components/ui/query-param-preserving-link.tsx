/* Stub: VT lab migration — query param preserving link */
'use client';

import React from 'react';

interface QueryParamPreservingLinkProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  to?: string;
}

export const QueryParamPreservingLink = React.forwardRef<
  HTMLAnchorElement,
  QueryParamPreservingLinkProps
>(({ to, href, children, ...props }, ref) => {
  const resolvedHref = to || href || '#';
  return (
    <a ref={ref} href={resolvedHref} {...props}>
      {children}
    </a>
  );
});

QueryParamPreservingLink.displayName = 'QueryParamPreservingLink';
