import { useEffect, useRef } from 'react';

import { gsap } from '../lib/gsap';

const cursorLabels: Record<string, string> = {
  view: '查看',
  play: '播放',
  copy: '复制',
  read: '进入',
};

export function CustomCursor() {
  const rootRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const disabled = window.matchMedia('(hover: none), (pointer: coarse), (prefers-reduced-motion: reduce)');
    if (disabled.matches) return;

    const root = rootRef.current;
    const ring = ringRef.current;
    const dot = dotRef.current;
    const label = labelRef.current;
    if (!root || !ring || !dot || !label) return;

    root.dataset.enabled = 'true';
    const dotX = gsap.quickTo(dot, 'x', { duration: 0.08, ease: 'power3.out' });
    const dotY = gsap.quickTo(dot, 'y', { duration: 0.08, ease: 'power3.out' });
    const ringX = gsap.quickTo(ring, 'x', { duration: 0.26, ease: 'power3.out' });
    const ringY = gsap.quickTo(ring, 'y', { duration: 0.26, ease: 'power3.out' });

    const onMove = (event: PointerEvent) => {
      root.dataset.visible = 'true';
      dotX(event.clientX);
      dotY(event.clientY);
      ringX(event.clientX);
      ringY(event.clientY);
    };

    const onOver = (event: PointerEvent) => {
      const target = event.target as HTMLElement | null;
      const interactive = target?.closest<HTMLElement>('[data-cursor]');
      const variant = interactive?.dataset.cursor ?? 'default';
      root.dataset.variant = variant;
      label.textContent = cursorLabels[variant] ?? '';
    };

    const onLeave = () => { root.dataset.visible = 'false'; };
    window.addEventListener('pointermove', onMove, { passive: true });
    document.addEventListener('pointerover', onOver);
    document.addEventListener('mouseleave', onLeave);
    document.documentElement.classList.add('archive-custom-cursor');

    return () => {
      window.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerover', onOver);
      document.removeEventListener('mouseleave', onLeave);
      document.documentElement.classList.remove('archive-custom-cursor');
      gsap.killTweensOf([ring, dot]);
    };
  }, []);

  return (
    <div ref={rootRef} className="archive-cursor" data-portfolio-cursor="true" data-variant="default" data-visible="false" aria-hidden="true">
      <div ref={ringRef} className="archive-cursor__ring"><span ref={labelRef} /></div>
      <div ref={dotRef} className="archive-cursor__dot" />
    </div>
  );
}
