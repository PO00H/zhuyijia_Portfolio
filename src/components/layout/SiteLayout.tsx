import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Outlet, useLocation } from 'react-router-dom';

import { CustomCursor } from '../CustomCursor';
import { SmoothScroll } from '../SmoothScroll';
import { SiteFooter } from './SiteFooter';
import { SiteHeader } from './SiteHeader';

const routeEase = [0.22, 1, 0.36, 1] as const;

export function SiteLayout() {
  const location = useLocation();
  const reduceMotion = useReducedMotion();

  return (
    <div className="site-shell">
      <SmoothScroll />
      <CustomCursor />
      <a className="skip-link" href="#main-content">
        跳到主要内容
      </a>
      <div className="site-frame">
        <SiteHeader />
        <AnimatePresence mode="wait" initial={false}>
          <motion.main
            id="main-content"
            className="site-route"
            key={location.pathname}
            initial={reduceMotion ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduceMotion ? undefined : { opacity: 0, y: -10 }}
            transition={{ duration: reduceMotion ? 0 : 0.48, ease: routeEase }}
          >
            <Outlet />
          </motion.main>
        </AnimatePresence>
        <SiteFooter />
      </div>
    </div>
  );
}
