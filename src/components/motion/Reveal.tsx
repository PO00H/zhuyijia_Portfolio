import { useRef, type PropsWithChildren } from 'react';
import { useGSAP } from '@gsap/react';

import { gsap } from '../../lib/gsap';

interface RevealProps extends PropsWithChildren {
  className?: string;
  itemSelector?: string;
  stagger?: number;
}

export function Reveal({ children, className, itemSelector = ':scope > *', stagger = 0.15 }: RevealProps) {
  const rootRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const items = rootRef.current?.querySelectorAll(itemSelector);
    if (!items?.length) return;

    gsap.from(items, {
      opacity: 0,
      y: 40,
      duration: 0.8,
      stagger,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: rootRef.current,
        start: 'top 85%',
      },
    });
  }, { scope: rootRef, dependencies: [itemSelector, stagger], revertOnUpdate: true });

  return <div ref={rootRef} className={className}>{children}</div>;
}
