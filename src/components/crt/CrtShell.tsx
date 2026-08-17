import { useEffect, useRef } from 'react';
import './crt-shell.css';

/**
 * CRT display shell: a fixed, non-interactive 1980s lab-monitor frame.
 * The bezel ring is a masked gradient (matte warm plastic), the glass layer
 * carries the junction depth, corner darkening and the outer reflection.
 * The only interaction is a near-imperceptible reflection drift (<= 3px)
 * that eases back when the pointer leaves; disabled under reduced motion.
 */
export function CrtShell() {
  const glassRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const glass = glassRef.current;
    if (!glass) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let frameId = 0;

    const handlePointerMove = (event: PointerEvent) => {
      if (frameId) return;
      frameId = requestAnimationFrame(() => {
        frameId = 0;
        const x = (event.clientX / Math.max(1, window.innerWidth) - 0.5) * 2;
        const y = (event.clientY / Math.max(1, window.innerHeight) - 0.5) * 2;
        glass.style.setProperty('--crt-reflect-x', `${(x * 3).toFixed(2)}px`);
        glass.style.setProperty('--crt-reflect-y', `${(y * 3).toFixed(2)}px`);
      });
    };

    const resetReflection = () => {
      if (frameId) {
        cancelAnimationFrame(frameId);
        frameId = 0;
      }
      glass.style.setProperty('--crt-reflect-x', '0px');
      glass.style.setProperty('--crt-reflect-y', '0px');
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    document.documentElement.addEventListener('pointerleave', resetReflection);
    window.addEventListener('blur', resetReflection);

    return () => {
      if (frameId) cancelAnimationFrame(frameId);
      window.removeEventListener('pointermove', handlePointerMove);
      document.documentElement.removeEventListener('pointerleave', resetReflection);
      window.removeEventListener('blur', resetReflection);
    };
  }, []);

  return (
    <div className="crt-shell" aria-hidden="true">
      <div ref={glassRef} className="crt-shell-glass" />
      <div className="crt-shell-bezel" />
      <div className="crt-shell-corner crt-corner-tl" />
      <div className="crt-shell-corner crt-corner-tr" />
      <div className="crt-shell-corner crt-corner-bl" />
      <div className="crt-shell-corner crt-corner-br" />
      <div className="crt-shell-folds">
        <div className="crt-shell-fold crt-fold-tl" />
        <div className="crt-shell-fold crt-fold-tr" />
        <div className="crt-shell-fold crt-fold-bl" />
        <div className="crt-shell-fold crt-fold-br" />
      </div>
      <div ref={glassRef} className="crt-shell-glass" />
      <div className="crt-shell-glare" />
      <div className="crt-shell-power" />
    </div>
  );
}
