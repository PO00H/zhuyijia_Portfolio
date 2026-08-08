import { useRef } from 'react';
import { useGSAP } from '@gsap/react';

import { useReducedMotion } from '../../hooks/useReducedMotion';
import { gsap } from '../../lib/gsap';

interface SectionHeadingProps {
  number: string;
  label: string;
  title: string;
  eyebrow: string;
  dark?: boolean;
  id?: string;
}

export function SectionHeading({ number, label, title, eyebrow, dark = false, id }: SectionHeadingProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useGSAP(() => {
    if (reduced || !rootRef.current) return;
    gsap.from(rootRef.current, {
      y: 30,
      opacity: 0,
      duration: 0.8,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: rootRef.current,
        start: 'top 80%',
      },
    });
  }, { scope: rootRef, dependencies: [reduced], revertOnUpdate: true });

  return (
    <div ref={rootRef} className={dark ? 'archive-section-heading is-dark' : 'archive-section-heading'}>
      <div className="archive-section-heading__index"><span>{number}</span><small>[{label}]</small></div>
      <div className="archive-section-heading__copy">
        <p>{eyebrow}</p>
        <h2 id={id}>{title}</h2>
      </div>
    </div>
  );
}
