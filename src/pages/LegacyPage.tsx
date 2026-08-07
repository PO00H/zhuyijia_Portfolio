import { lazy, Suspense } from 'react';

const PreviousPortfolio = lazy(() => import('../App'));

export function LegacyPage() {
  return (
    <Suspense fallback={<p className="legacy-loading">Loading previous portfolio</p>}>
      <PreviousPortfolio />
    </Suspense>
  );
}
