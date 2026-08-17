import { useEffect, useRef } from 'react';
import {
  DEFAULT_MOTION_STUDY_SETTINGS,
  renderVerticalBreathingFrame,
  type MotionStudySettings,
} from '@/features/ascii-lab/asciiEngine';
import { liveDitherPalette } from '@/lib/live-theme';
import './portfolio-dither-background.css';

const DESKTOP_FPS = 12;
const MOBILE_FPS = 10;
const CLICK_EVENT_DURATION = 1800;
const DESKTOP_EVENT_FPS = 24;
const MOBILE_EVENT_FPS = 18;

const PORTFOLIO_DITHER_SETTINGS: MotionStudySettings = {
  ...DEFAULT_MOTION_STUDY_SETTINGS,
  geometry: 'flat',
  direction: 'top-right-to-bottom-left',
  density: 1.05,
  fisheye: 0.08,
  /* Shared by reference with the color tuner: mutations apply next frame. */
  palette: liveDitherPalette,
};

interface PortfolioDitherBackgroundProps {
  /** Render a single static frame instead of the live breathing loop.
   *  Useful for the boot overlay, where the low-FPS loop would make the
   *  whole sequence feel choppy. */
  frozen?: boolean;
}

export function PortfolioDitherBackground({ frozen = false }: PortfolioDitherBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext('2d', { alpha: false });
    if (!context) return;

    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const compactQuery = window.matchMedia('(max-width: 720px)');
    let frameId = 0;
    let lastPaintedAt = -Infinity;
    let reducedMotion = motionQuery.matches;
    let windowFocused = document.hasFocus();
    let disposed = false;
    let startTime = performance.now();
    let eventStartedAt: number | null = null;
    let eventOrigin = { x: 0.5, y: 0.5 };
    let resizeTimeout: ReturnType<typeof setTimeout> | null = null;

    const paint = (elapsedSeconds: number, now = performance.now()) => {
      const eventProgress = eventStartedAt === null
        ? null
        : Math.min(1, (now - eventStartedAt) / CLICK_EVENT_DURATION);

      renderVerticalBreathingFrame(context, {
        width: canvas.width,
        height: canvas.height,
        elapsedSeconds,
        compact: compactQuery.matches,
        settings: PORTFOLIO_DITHER_SETTINGS,
        dotEventProgress: eventProgress,
        dotEventOrigin: eventOrigin,
        dotEventIntensity: 1.2,
        dotEventMode: 'wave',
      });

      if (eventProgress === 1) {
        eventStartedAt = null;
      }
    };

    const resize = () => {
      if (resizeTimeout) clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        resizeTimeout = null;
        // The coarse CSS-pixel grid is part of the approved dither material.
        // Size follows the canvas box (inset by the CRT bezel), not the window.
        const width = Math.max(1, Math.round(canvas.clientWidth));
        const height = Math.max(1, Math.round(canvas.clientHeight));

        if (canvas.width !== width || canvas.height !== height) {
          canvas.width = width;
          canvas.height = height;
        }

        paint(reducedMotion ? 0.7 : (performance.now() - startTime) / 1000);
      }, 120);
    };

    const stop = () => {
      if (frameId) cancelAnimationFrame(frameId);
      frameId = 0;
    };

    const tick = (now: number) => {
      if (disposed) return;

      const targetFps = eventStartedAt === null
        ? compactQuery.matches ? MOBILE_FPS : DESKTOP_FPS
        : compactQuery.matches ? MOBILE_EVENT_FPS : DESKTOP_EVENT_FPS;
      if (now - lastPaintedAt >= 1000 / targetFps) {
        paint((now - startTime) / 1000, now);
        lastPaintedAt = now;
      }

      frameId = requestAnimationFrame(tick);
    };

    const start = () => {
      if (frameId || reducedMotion || document.visibilityState === 'hidden' || !windowFocused) return;
      frameId = requestAnimationFrame(tick);
    };

    const handleVisibility = () => {
      if (document.visibilityState === 'hidden') stop();
      else start();
    };

    const handleFocus = () => {
      windowFocused = true;
      start();
    };

    const handleBlur = () => {
      windowFocused = false;
      stop();
    };

    const handleMotionPreference = () => {
      reducedMotion = motionQuery.matches;
      if (reducedMotion) {
        stop();
        paint(0.7);
      } else {
        startTime = performance.now();
        start();
      }
    };

    const handlePointerDown = (event: PointerEvent) => {
      if (reducedMotion || event.button > 0) return;
      // Map the click into the canvas box so the wave origin stays accurate
      // now that the canvas is inset by the CRT bezel.
      const rect = canvas.getBoundingClientRect();
      eventOrigin = {
        x: Math.max(0, Math.min(1, (event.clientX - rect.left) / Math.max(1, rect.width))),
        y: Math.max(0, Math.min(1, (event.clientY - rect.top) / Math.max(1, rect.height))),
      };
      eventStartedAt = performance.now();
      start();
    };

    resize();
    if (frozen) {
      // Frozen mode: paint once and leave the canvas static. No animation
      // loop, event listeners or resize handling — the boot overlay is short.
      return;
    }

    window.addEventListener('resize', resize);
    window.addEventListener('focus', handleFocus);
    window.addEventListener('blur', handleBlur);
    window.addEventListener('pointerdown', handlePointerDown, { passive: true });
    document.addEventListener('visibilitychange', handleVisibility);
    motionQuery.addEventListener('change', handleMotionPreference);
    compactQuery.addEventListener('change', resize);
    start();

    return () => {
      disposed = true;
      stop();
      if (resizeTimeout) clearTimeout(resizeTimeout);
      window.removeEventListener('resize', resize);
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('blur', handleBlur);
      window.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('visibilitychange', handleVisibility);
      motionQuery.removeEventListener('change', handleMotionPreference);
      compactQuery.removeEventListener('change', resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="portfolio-dither-background" aria-hidden="true" />;
}
