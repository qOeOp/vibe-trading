'use client';

import dynamic from 'next/dynamic';

const LabPageClient = dynamic(
  () => import('@/features/lab').then((m) => ({ default: m.LabPage })),
  { ssr: false },
);

export default function FactorLabRoute() {
  return <LabPageClient />;
}
