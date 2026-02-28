'use client';

import { Suspense } from 'react';
import dynamic from 'next/dynamic';

const LabPageClient = dynamic(
  () => import('@/features/lab').then((m) => ({ default: m.LabPage })),
  { ssr: false },
);

// Suspense boundary is required here so that useSearchParams() inside LabPage
// works correctly in Next.js static export mode. The boundary must be at the
// page level (above the component that calls useSearchParams).
export default function FactorLabRoute() {
  return (
    <Suspense fallback={<div className="flex-1 animate-pulse bg-mine-bg" />}>
      <LabPageClient />
    </Suspense>
  );
}
