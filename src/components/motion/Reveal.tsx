import { useRef, type PropsWithChildren } from 'react';
import { useGSAP } from '@gsap/react';

import { useReducedMotion } from '../../hooks/useReducedMotion';
import { gsap } from '../../lib/gsap';

interface RevealProps extends PropsWithChildren {
  className?: string;
  itemSelector?: string;
  stagger?: number;
}

export function Reveal({ children, className, itemSelector = ':scope > *', stagger = 0.1 }: RevealProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useGSAP(() => {
    const items = rootRef.current?.querySelectorAll(itemSelector);
    if (!items?.length || reduced) return;

    gsap.from(items, {
      autoAlpha: 0,
      y: 36,
      duration: 0.85,
      stagger,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: rootRef.current,
        start: 'top 84%',
        once: true,
      },
    });
  }, { scope: rootRef, dependencies: [reduced, itemSelector, stagger] });

  return <div ref={rootRef} className={className}>{children}</div>;
}
