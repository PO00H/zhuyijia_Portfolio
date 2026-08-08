import { useEffect, useRef, type PropsWithChildren } from 'react';
import { useGSAP } from '@gsap/react';
import { useLocation } from 'react-router-dom';

import { useReducedMotion } from '../../hooks/useReducedMotion';
import { gsap } from '../../lib/gsap';

export function RouteTransition({ children }: PropsWithChildren) {
  const location = useLocation();
  const rootRef = useRef<HTMLDivElement>(null);
  const maskRef = useRef<HTMLDivElement>(null);
  const transitionsReadyRef = useRef(false);
  const reduced = useReducedMotion();

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      transitionsReadyRef.current = true;
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  useGSAP(() => {
    const root = rootRef.current;
    const mask = maskRef.current;
    if (!root || !mask) return;

    if (reduced || !transitionsReadyRef.current) {
      gsap.set([root, mask], { clearProps: 'all' });
      return;
    }

    const timeline = gsap.timeline({ defaults: { ease: 'power3.out' } });
    timeline
      .set(mask, { scaleY: 1, transformOrigin: 'top' })
      .set(root, { autoAlpha: 0, y: 14 })
      .to(mask, { scaleY: 0, duration: 0.72, transformOrigin: 'bottom' })
      .to(root, { autoAlpha: 1, y: 0, duration: 0.58 }, '-=0.38');
  }, { scope: rootRef, dependencies: [location.key, reduced], revertOnUpdate: true });

  return (
    <>
      <div ref={maskRef} className="archive-route-mask" aria-hidden="true" />
      <div ref={rootRef} className="archive-route-stage" key={location.pathname}>{children}</div>
    </>
  );
}
