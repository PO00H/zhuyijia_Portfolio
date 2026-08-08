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
    gsap.set(label, { opacity: 0, scale: 0.5 });
    const dotX = gsap.quickTo(dot, 'x', { duration: 0.1, ease: 'power3' });
    const dotY = gsap.quickTo(dot, 'y', { duration: 0.1, ease: 'power3' });
    const ringX = gsap.quickTo(ring, 'x', { duration: 0.25, ease: 'power3' });
    const ringY = gsap.quickTo(ring, 'y', { duration: 0.25, ease: 'power3' });
    let currentVariant = 'default';

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
      if (variant === currentVariant) return;
      currentVariant = variant;
      root.dataset.variant = variant;
      label.textContent = cursorLabels[variant] ?? '';

      if (variant !== 'default') {
        gsap.to(ring, {
          scale: 2.5,
          borderWidth: '0.5px',
          backgroundColor: 'rgba(214, 83, 54, 0.1)',
          duration: 0.3,
          ease: 'power2.out',
          overwrite: 'auto',
        });
        gsap.to(label, {
          opacity: 1,
          scale: 1,
          duration: 0.3,
          delay: 0.1,
          ease: 'power2.out',
          overwrite: 'auto',
        });
        gsap.to(dot, { opacity: 0, duration: 0.2, overwrite: 'auto' });
      } else {
        gsap.to(ring, {
          scale: 1,
          borderWidth: '1px',
          backgroundColor: 'transparent',
          duration: 0.3,
          ease: 'power2.out',
          overwrite: 'auto',
        });
        gsap.to(label, {
          opacity: 0,
          scale: 0.5,
          duration: 0.2,
          ease: 'power2.in',
          overwrite: 'auto',
        });
        gsap.to(dot, { opacity: 1, duration: 0.2, delay: 0.1, overwrite: 'auto' });
      }
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
      gsap.killTweensOf([ring, dot, label]);
    };
  }, []);

  return (
    <div ref={rootRef} className="archive-cursor" data-portfolio-cursor="true" data-variant="default" data-visible="false" aria-hidden="true">
      <div ref={ringRef} className="archive-cursor__ring"><span ref={labelRef} /></div>
      <div ref={dotRef} className="archive-cursor__dot" />
    </div>
  );
}
