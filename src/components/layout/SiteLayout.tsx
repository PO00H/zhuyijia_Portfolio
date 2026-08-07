import { Outlet } from 'react-router-dom';

import { SiteFooter } from './SiteFooter';
import { SiteHeader } from './SiteHeader';

export function SiteLayout() {
  return (
    <div className="site-shell">
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <div className="site-frame">
        <SiteHeader />
        <main id="main-content">
          <Outlet />
        </main>
        <SiteFooter />
      </div>
    </div>
  );
}
