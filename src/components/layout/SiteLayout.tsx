import { Outlet } from 'react-router-dom';

import { CustomCursor } from '../CustomCursor';
import { Preloader } from '../Preloader';
import { SmoothScroll } from '../SmoothScroll';
import { RouteTransition } from '../motion/RouteTransition';
import { SiteFooter } from './SiteFooter';
import { SiteHeader } from './SiteHeader';

export function SiteLayout() {
  return (
    <div className="archive-shell">
      <SmoothScroll />
      <CustomCursor />
      <Preloader />
      <a className="archive-skip-link" href="#main-content">跳到主要内容</a>
      <SiteHeader />
      <RouteTransition>
        <main id="main-content" className="archive-route"><Outlet /></main>
      </RouteTransition>
      <SiteFooter />
    </div>
  );
}
