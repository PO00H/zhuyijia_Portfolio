import { lazy, Suspense } from 'react';

const PreviousPortfolio = lazy(() => import('../App'));

export function LegacyPage() {
  return (
    <Suspense fallback={<p className="legacy-loading">正在加载旧版作品集</p>}>
      <PreviousPortfolio />
    </Suspense>
  );
}
