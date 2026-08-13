import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
} from 'react';
import {
  DEFAULT_MOTION_STUDY_SETTINGS,
  renderVerticalBreathingFrame,
  type MotionStudyPalette,
  type MotionStudySettings,
} from './asciiEngine';
import './ascii-lab.css';

const DESKTOP_FPS = 12;
const MOBILE_FPS = 10;
const DOT_EVENT_DURATION = 1100;
const DEFAULT_DOT_EVENT_ORIGIN = { x: 0.43, y: 0.56 };

const prefersReducedMotion = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export function AsciiLab() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dotEventStartedAtRef = useRef<number | null>(null);
  const dotEventOriginRef = useRef(DEFAULT_DOT_EVENT_ORIGIN);
  const [settings, setSettings] = useState<MotionStudySettings>(DEFAULT_MOTION_STUDY_SETTINGS);
  const [palettePreset, setPalettePreset] = useState('saved');

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext('2d', { alpha: false });
    if (!context) return;

    let frameId = 0;
    let disposed = false;
    let lastPaintedAt = -Infinity;
    let startTime = performance.now();
    let reducedMotion = prefersReducedMotion();
    let visible = true;

    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const compactQuery = window.matchMedia('(max-width: 720px)');

    const resize = () => {
      const density = Math.min(window.devicePixelRatio || 1, compactQuery.matches ? 1 : 1.5);
      const width = Math.max(1, Math.round(window.innerWidth * density));
      const height = Math.max(1, Math.round(window.innerHeight * density));

      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
      }

      renderVerticalBreathingFrame(context, {
        width,
        height,
        elapsedSeconds: reducedMotion ? 0.7 : (performance.now() - startTime) / 1000,
        compact: compactQuery.matches,
        settings,
        dotEventProgress: null,
        dotEventOrigin: dotEventOriginRef.current,
      });
    };

    const stop = () => {
      if (frameId) cancelAnimationFrame(frameId);
      frameId = 0;
    };

    const tick = (now: number) => {
      if (disposed) return;

      const targetFps = compactQuery.matches ? MOBILE_FPS : DESKTOP_FPS;
      if (now - lastPaintedAt >= 1000 / targetFps) {
        const dotEventProgress = dotEventStartedAtRef.current === null
          ? null
          : Math.min(1, (now - dotEventStartedAtRef.current) / DOT_EVENT_DURATION);
        renderVerticalBreathingFrame(context, {
          width: canvas.width,
          height: canvas.height,
          elapsedSeconds: (now - startTime) / 1000,
          compact: compactQuery.matches,
          settings,
          dotEventProgress,
          dotEventOrigin: dotEventOriginRef.current,
        });
        if (dotEventProgress === 1) dotEventStartedAtRef.current = null;
        lastPaintedAt = now;
      }

      frameId = requestAnimationFrame(tick);
    };

    const start = () => {
      if (frameId || reducedMotion || !visible || document.visibilityState === 'hidden') return;
      frameId = requestAnimationFrame(tick);
    };

    const handleVisibility = () => {
      if (document.visibilityState === 'hidden') stop();
      else start();
    };

    const handleMotionPreference = () => {
      reducedMotion = motionQuery.matches;
      if (reducedMotion) {
        stop();
        resize();
      } else {
        startTime = performance.now();
        start();
      }
    };

    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) start();
      else stop();
    });

    resize();
    observer.observe(canvas);
    window.addEventListener('resize', resize);
    document.addEventListener('visibilitychange', handleVisibility);
    motionQuery.addEventListener('change', handleMotionPreference);
    compactQuery.addEventListener('change', resize);
    start();

    return () => {
      disposed = true;
      stop();
      observer.disconnect();
      window.removeEventListener('resize', resize);
      document.removeEventListener('visibilitychange', handleVisibility);
      motionQuery.removeEventListener('change', handleMotionPreference);
      compactQuery.removeEventListener('change', resize);
    };
  }, [settings]);

  const updatePalette = (key: keyof MotionStudyPalette, value: string) => {
    setPalettePreset('custom');
    setSettings((current) => ({
      ...current,
      palette: { ...current.palette, [key]: value },
    }));
  };

  const applyPalettePreset = (preset: string) => {
    const palettes: Record<string, MotionStudyPalette> = {
      saved: { paper: '#e0e0e0', coral: '#28b6c3', cyan: '#2d929b' },
      reference: { paper: '#fafbf8', coral: '#ee8f89', cyan: '#2d929b' },
      mist: { paper: '#fbfaf7', coral: '#d99aa4', cyan: '#6e9fa6' },
      mineral: { paper: '#f5f2eb', coral: '#bd746c', cyan: '#477984' },
    };
    setPalettePreset(preset);
    if (palettes[preset]) {
      setSettings((current) => ({ ...current, palette: palettes[preset] }));
    }
  };

  const updateDensity = (value: string) => {
    setSettings((current) => ({ ...current, density: Number(value) }));
  };

  const updateFisheye = (value: string) => {
    setSettings((current) => ({ ...current, fisheye: Number(value) }));
  };

  const playDotEvent = (origin = DEFAULT_DOT_EVENT_ORIGIN) => {
    if (prefersReducedMotion()) return;
    dotEventOriginRef.current = origin;
    dotEventStartedAtRef.current = performance.now();
  };

  const handleCanvasPointerDown = (event: ReactPointerEvent<HTMLCanvasElement>) => {
    if (event.pointerType === 'mouse' && event.button !== 0) return;

    const bounds = event.currentTarget.getBoundingClientRect();
    playDotEvent({
      x: Math.max(0, Math.min(1, (event.clientX - bounds.left) / bounds.width)),
      y: Math.max(0, Math.min(1, (event.clientY - bounds.top) / bounds.height)),
    });
  };

  const shellStyle = {
    '--study-paper': settings.palette.paper,
  } as CSSProperties;

  return (
    <main className="motion-study-01" style={shellStyle}>
      <canvas
        ref={canvasRef}
        onPointerDown={handleCanvasPointerDown}
        aria-label="红、青、白三色规则点阵进行方向相位交换与点击事件的全屏动态研究"
        role="img"
      />

      <aside className="motion-study-controls" aria-label="Motion Study 06 参数">
        <details open>
          <summary>
            <span>Motion Study 06</span>
            <small>点击定位</small>
          </summary>

          <div className="motion-study-controls-body">
            <label>
              <span>环面</span>
              <select
                value={settings.geometry}
                onChange={(event) => setSettings((current) => ({
                  ...current,
                  geometry: event.target.value as MotionStudySettings['geometry'],
                }))}
              >
                <option value="flat">普通（无环面）</option>
                <option value="shallow">浅弧面</option>
                <option value="inset">柔性内收</option>
                <option value="saddle">鞍形曲面</option>
                <option value="twist">缓慢扭转</option>
              </select>
            </label>

            <label>
              <span>方向</span>
              <select
                value={settings.direction}
                onChange={(event) => setSettings((current) => ({
                  ...current,
                  direction: event.target.value as MotionStudySettings['direction'],
                }))}
              >
                <option value="top-to-bottom">上 → 下</option>
                <option value="bottom-to-top">下 → 上</option>
                <option value="left-to-right">左 → 右</option>
                <option value="right-to-left">右 → 左</option>
                <option value="top-left-to-bottom-right">左上 → 右下</option>
                <option value="top-right-to-bottom-left">右上 → 左下</option>
              </select>
            </label>

            <label className="motion-study-density">
              <span>点阵密度 <output>{Math.round(settings.density * 100)}%</output></span>
              <input
                type="range"
                min="0.65"
                max="1.5"
                step="0.05"
                value={settings.density}
                onInput={(event) => updateDensity(event.currentTarget.value)}
                onChange={(event) => updateDensity(event.currentTarget.value)}
              />
            </label>

            <label className="motion-study-density">
              <span>内突强度 <output>{Math.round(settings.fisheye * 100)}%</output></span>
              <input
                type="range"
                min="0"
                max="0.18"
                step="0.01"
                value={settings.fisheye}
                onInput={(event) => updateFisheye(event.currentTarget.value)}
                onChange={(event) => updateFisheye(event.currentTarget.value)}
              />
            </label>

            <label>
              <span>配色</span>
              <select value={palettePreset} onChange={(event) => applyPalettePreset(event.target.value)}>
                <option value="saved">已保存青灰</option>
                <option value="reference">参考红青白</option>
                <option value="mist">雾粉灰青</option>
                <option value="mineral">矿物砖红</option>
                {palettePreset === 'custom' && <option value="custom">自定义</option>}
              </select>
            </label>

            <div className="motion-study-colors" aria-label="自定义颜色">
              {([
                ['coral', '红'],
                ['cyan', '青'],
                ['paper', '底'],
              ] as const).map(([key, label]) => (
                <label key={key}>
                  <span>{label}</span>
                  <input
                    type="color"
                    value={settings.palette[key]}
                    onChange={(event) => updatePalette(key, event.target.value)}
                  />
                </label>
              ))}
            </div>

            <button
              className="motion-study-event-trigger"
              type="button"
              onClick={() => playDotEvent()}
            >
              中心重播（键盘替代）
            </button>
          </div>
        </details>
      </aside>
    </main>
  );
}
