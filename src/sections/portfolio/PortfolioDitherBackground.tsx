import { useEffect, useRef } from 'react';
import {
  DEFAULT_MOTION_STUDY_SETTINGS,
  renderVerticalBreathingFrame,
  type MotionStudySettings,
} from '@/features/ascii-lab/asciiEngine';
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
  palette: {
    paper: '#e0e0e0',
    coral: '#28b6c3',
    cyan: '#2d929b',
  },
};

export function PortfolioDitherBackground() {
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
      // The coarse CSS-pixel grid is part of the approved dither material.
      const pixelRatio = 1;
      const width = Math.max(1, Math.round(window.innerWidth * pixelRatio));
      const height = Math.max(1, Math.round(window.innerHeight * pixelRatio));

      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
      }

      paint(reducedMotion ? 0.7 : (performance.now() - startTime) / 1000);
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
      eventOrigin = {
        x: Math.max(0, Math.min(1, event.clientX / Math.max(1, window.innerWidth))),
        y: Math.max(0, Math.min(1, event.clientY / Math.max(1, window.innerHeight))),
      };
      eventStartedAt = performance.now();
      start();
    };

    resize();
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
