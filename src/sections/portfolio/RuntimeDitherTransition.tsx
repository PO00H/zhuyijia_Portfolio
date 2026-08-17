import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
} from 'react';
import type { PortfolioProject } from '@/data/portfolioProjects';
import {
  loadMediaFramePair,
  renderMediaTransition,
  type MediaFramePair,
} from '@/features/pixel-material-lab/mediaTransitionRenderer';

interface RuntimeDitherTransitionProps {
  projects: PortfolioProject[];
}

export interface RuntimeDitherTransitionHandle {
  play: (fromIndex: number, toIndex: number) => boolean;
  cancel: () => void;
}

const TRANSITION_DURATION = 560;
const FRAME_INTERVAL = 1000 / 12;
const SETTINGS = {
  width: 160,
  height: 90,
  levels: 5,
  dither: 0.72,
};

const pairKey = (fromIndex: number, toIndex: number) =>
  `${fromIndex}->${toIndex}`;

function createReservedSignalSource() {
  const canvas = document.createElement('canvas');
  canvas.width = SETTINGS.width;
  canvas.height = SETTINGS.height;
  const context = canvas.getContext('2d', { alpha: false });

  if (!context) return '';

  context.fillStyle = '#050605';
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.strokeStyle = 'rgba(216, 255, 50, 0.14)';
  context.lineWidth = 1;

  for (let x = 4; x < canvas.width; x += 12) {
    context.beginPath();
    context.moveTo(x + 0.5, 0);
    context.lineTo(x + 0.5, canvas.height);
    context.stroke();
  }

  for (let y = 3; y < canvas.height; y += 12) {
    context.beginPath();
    context.moveTo(0, y + 0.5);
    context.lineTo(canvas.width, y + 0.5);
    context.stroke();
  }

  const blocks = [
    [58, 24, 18, 18, '#d8ff32'],
    [78, 24, 18, 18, '#48540f'],
    [98, 24, 8, 18, '#d8ff32'],
    [48, 44, 28, 18, '#48540f'],
    [78, 44, 28, 18, '#d8ff32'],
    [108, 44, 8, 18, '#48540f'],
  ] as const;

  blocks.forEach(([x, y, width, height, color]) => {
    context.fillStyle = color;
    context.fillRect(x, y, width, height);
  });

  context.fillStyle = '#d8ff32';
  context.fillRect(12, 76, 54, 2);
  context.fillStyle = '#48540f';
  context.fillRect(70, 76, 78, 2);

  return canvas.toDataURL('image/png');
}

export const RuntimeDitherTransition = forwardRef<
  RuntimeDitherTransitionHandle,
  RuntimeDitherTransitionProps
>(function RuntimeDitherTransition({ projects }, ref) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number | null>(null);
  const enabledRef = useRef(false);
  const framesRef = useRef(new Map<string, MediaFramePair>());

  const cancel = useCallback(() => {
    if (animationFrameRef.current !== null) {
      window.cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.style.opacity = '0';
    canvas.style.visibility = 'hidden';
    canvas.style.willChange = 'auto';
    canvas.dataset.runtimeDitherState = 'idle';
    delete canvas.dataset.runtimeDitherProgress;
  }, []);

  const play = useCallback((fromIndex: number, toIndex: number) => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d', { alpha: false });
    const frames = framesRef.current.get(pairKey(fromIndex, toIndex));

    if (
      !enabledRef.current ||
      !canvas ||
      !context ||
      !frames ||
      fromIndex === toIndex
    ) {
      return false;
    }

    cancel();
    canvas.style.opacity = '1';
    canvas.style.visibility = 'visible';
    canvas.style.willChange = 'opacity';
    canvas.dataset.runtimeDitherState = 'active';
    canvas.dataset.runtimeDitherFrom = String(fromIndex + 1);
    canvas.dataset.runtimeDitherTo = String(toIndex + 1);
    canvas.dataset.runtimeDitherProgress = '0';
    renderMediaTransition(context, frames, SETTINGS, 0, 'dither-matrix');

    const startedAt = performance.now();
    let lastPaint = -Infinity;

    const paint = (now: number) => {
      const progress = Math.min(1, Math.max(0, (now - startedAt) / TRANSITION_DURATION));

      if (now - lastPaint >= FRAME_INTERVAL || progress >= 1) {
        lastPaint = now;
        renderMediaTransition(context, frames, SETTINGS, progress, 'dither-matrix');
        canvas.dataset.runtimeDitherProgress = progress.toFixed(3);
        canvas.style.opacity = progress > 0.82
          ? String(Math.max(0, 1 - (progress - 0.82) / 0.18))
          : '1';
      }

      if (progress >= 1) {
        canvas.style.opacity = '0';
        canvas.style.visibility = 'hidden';
        canvas.style.willChange = 'auto';
        canvas.dataset.runtimeDitherState = 'idle';
        canvas.dataset.runtimeDitherProgress = '1.000';
        animationFrameRef.current = null;
        return;
      }

      animationFrameRef.current = window.requestAnimationFrame(paint);
    };

    animationFrameRef.current = window.requestAnimationFrame(paint);
    return true;
  }, [cancel]);

  useImperativeHandle(ref, () => ({ play, cancel }), [cancel, play]);

  useEffect(() => {
    let disposed = false;
    const media = window.matchMedia(
      '(min-width: 1100px) and (prefers-reduced-motion: no-preference)',
    );
    const reservedSource = createReservedSignalSource();
    const sources = projects.map((project) => project.cover ?? reservedSource);
    const frameStore = framesRef.current;
    frameStore.clear();

    const primeFrames = () => {
      if (!media.matches) return;

      sources.forEach((fromSource, fromIndex) => {
        sources.forEach((toSource, toIndex) => {
          if (fromIndex === toIndex || !fromSource || !toSource) return;
          const key = pairKey(fromIndex, toIndex);
          void loadMediaFramePair(fromSource, toSource, SETTINGS)
            .then((frames) => {
              if (!disposed) frameStore.set(key, frames);
            })
            .catch(() => {
              if (!disposed) frameStore.delete(key);
            });
        });
      });
    };

    const updateMode = () => {
      enabledRef.current = media.matches;
      if (media.matches) {
        primeFrames();
      } else {
        cancel();
      }
    };

    updateMode();
    media.addEventListener('change', updateMode);

    return () => {
      disposed = true;
      enabledRef.current = false;
      media.removeEventListener('change', updateMode);
      cancel();
      frameStore.clear();
    };
  }, [cancel, projects]);

  return (
    <canvas
      ref={canvasRef}
      className="portfolio-runtime-dither-canvas"
      data-runtime-dither-state="idle"
      aria-hidden="true"
    />
  );
});
