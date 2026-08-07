import { useEffect, useRef } from 'react';

type CursorVariant = 'default' | 'view';

export function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const stateRef = useRef({
    variant: 'default' as CursorVariant,
    overIframe: false,
    hidden: true,
  });

  useEffect(() => {
    const coarsePointer = window.matchMedia('(pointer: coarse)');
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (coarsePointer.matches || reducedMotion.matches) return;

    const cursor = cursorRef.current;
    if (!cursor) return;

    const renderState = () => {
      const { hidden, overIframe, variant } = stateRef.current;
      cursor.style.opacity = hidden || overIframe ? '0' : '1';
      cursor.dataset.variant = variant;
      document.documentElement.style.cursor = overIframe ? 'auto' : 'none';
    };

    let lastIframeCheck = 0;
    const onMove = (event: MouseEvent) => {
      cursor.style.transform = `translate3d(${event.clientX}px, ${event.clientY}px, 0) translate(-50%, -50%)`;

      let stateChanged = false;
      if (stateRef.current.hidden) {
        stateRef.current.hidden = false;
        stateChanged = true;
      }

      const now = performance.now();
      if (now - lastIframeCheck > 80) {
        lastIframeCheck = now;
        const elements = document.elementsFromPoint(event.clientX, event.clientY);
        const overIframe = elements.some((element) => element.tagName === 'IFRAME');
        if (overIframe !== stateRef.current.overIframe) {
          stateRef.current.overIframe = overIframe;
          stateChanged = true;
        }
      }

      if (stateChanged) renderState();
    };

    const onOver = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      const variant = target?.closest('[data-cursor="view"]') ? 'view' : 'default';
      if (variant !== stateRef.current.variant) {
        stateRef.current.variant = variant;
        renderState();
      }
    };

    const onLeave = () => {
      stateRef.current.hidden = true;
      renderState();
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    document.addEventListener('mouseover', onOver);
    document.addEventListener('mouseleave', onLeave);
    renderState();

    return () => {
      window.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseover', onOver);
      document.removeEventListener('mouseleave', onLeave);
      document.documentElement.style.cursor = '';
    };
  }, []);

  return (
    <div
      ref={cursorRef}
      className="portfolio-cursor"
      data-portfolio-cursor="true"
      data-variant="default"
      aria-hidden="true"
    >
      <span>打开</span>
    </div>
  );
}
