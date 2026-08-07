import { Link } from 'react-router-dom';

import { sitePaths } from '../app/routes';

export function NotFoundPage() {
  return (
    <div className="page-stack">
      <header className="page-intro">
        <p className="eyebrow">404</p>
        <h1>页面不存在</h1>
        <Link className="text-link" to={sitePaths.home}>返回首页</Link>
      </header>
    </div>
  );
}
