import { MiningPage } from '@/features/factor/mining';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Mining - Factor - Vibe Trading',
};

export default function FactorMiningPage() {
  return <MiningPage />;
}
