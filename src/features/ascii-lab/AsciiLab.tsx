import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
  type PointerEvent as ReactPointerEvent,
} from 'react';
import { getPortfolioProjectById } from '../../data/portfolioProjects';
import {
  ASCII_PALETTES,
  loadAsciiSource,
  renderAsciiField,
  type AsciiPalette,
  type AsciiRenderSettings,
  type AsciiVariant,
  type PointerMode,
} from './asciiEngine';
import './ascii-lab.css';

interface CanvasSize {
  width: number;
  height: number;
}

interface Telemetry {
  fps: number;
  cells: number;
  render: 'active' | 'idle';
}

interface TriggerState {
  token: number;
  origin: { x: number; y: number };
}

interface StageController {
  trigger: (origin: { x: number; y: number }) => void;
  movePointer: (x: number, y: number, velocityX: number, velocityY: number) => void;
  leavePointer: () => void;
}

const SOURCE_PROJECT = getPortfolioProjectById('game-001');
const SOURCE = SOURCE_PROJECT.cover ?? '/covers/echoflash.png';
const DEFAULT_GLYPH_RAMP = ' .,:;i1tfLCG08@';
const SPREAD_DURATION = 1000;
const POINTER_RADIUS = 160;

const useReducedMotion = () => {
  const [reduced, setReduced] = useState(() =>
    typeof window !== 'undefined'
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false,
  );

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduced(media.matches);
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);

  return reduced;
};

const useCanvasSize = (containerRef: React.RefObject<HTMLElement | null>) => {
  const [size, setSize] = useState<CanvasSize>({ width: 0, height: 0 });

  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;

    const update = () => {
      const bounds = element.getBoundingClientRect();
      setSize({
        width: Math.max(1, Math.round(bounds.width)),
        height: Math.max(1, Math.round(bounds.height)),
      });
    };
    update();
    const observer = new ResizeObserver(update);
    observer.observe(element);
    return () => observer.disconnect();
  }, [containerRef]);

  return size;
};

const getRows = (columns: number, size: CanvasSize) =>
  Math.max(12, Math.round(columns * (size.height / Math.max(1, size.width)) * 0.52));

const prepareCanvas = (canvas: HTMLCanvasElement, size: CanvasSize) => {
  const density = Math.min(2, window.devicePixelRatio || 1);
  const width = Math.max(1, Math.round(size.width * density));
  const height = Math.max(1, Math.round(size.height * density));
  if (canvas.width !== width || canvas.height !== height) {
    canvas.width = width;
    canvas.height = height;
  }
};

function StaticAsciiPreview({
  variant,
  source,
  columns,
  settings,
  label,
}: {
  variant: AsciiVariant;
  source: string;
  columns: number;
  settings: Omit<AsciiRenderSettings, 'variant'>;
  label: string;
}) {
  const frameRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const size = useCanvasSize(frameRef);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !size.width || !size.height) return;
    let disposed = false;
    const rows = getRows(columns, size);
    prepareCanvas(canvas, size);
    const context = canvas.getContext('2d', { alpha: false });
    if (!context) return;

    loadAsciiSource(source, columns, rows, size.width / size.height).then((field) => {
      if (disposed) return;
      renderAsciiField(
        context,
        field,
        { ...settings, variant },
        {
          spreadProgress: null,
          spreadOrigin: { x: 0.12, y: 0.72 },
          pointer: {
            active: false,
            x: 0,
            y: 0,
            velocityX: 0,
            velocityY: 0,
            strength: 0,
            radius: POINTER_RADIUS,
            mode: 'luminance',
          },
        },
      );
    });

    return () => {
      disposed = true;
    };
  }, [columns, settings, size, source, variant]);

  return (
    <article className="ascii-lab-compare-card">
      <header>
        <span>{label}</span>
        <span>{variant === 'characters' ? 'GLYPH' : variant === 'blocks' ? 'CELL' : 'BAYER'}</span>
      </header>
      <div ref={frameRef} className="ascii-lab-compare-canvas-frame">
        <canvas ref={canvasRef} role="img" aria-label={`${label} 渲染方式对照`} />
      </div>
    </article>
  );
}

function InteractiveAsciiStage({
  source,
  columns,
  fps,
  pointerMode,
  settings,
  trigger,
  reducedMotion,
  onTelemetry,
}: {
  source: string;
  columns: number;
  fps: number;
  pointerMode: PointerMode;
  settings: Omit<AsciiRenderSettings, 'variant'>;
  trigger: TriggerState;
  reducedMotion: boolean;
  onTelemetry: (telemetry: Telemetry) => void;
}) {
  const frameRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const controllerRef = useRef<StageController | null>(null);
  const lastPointerRef = useRef<{ x: number; y: number; at: number } | null>(null);
  const consumedTriggerRef = useRef(0);
  const size = useCanvasSize(frameRef);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !size.width || !size.height) return;
    let disposed = false;
    let animationFrame = 0;
    let settleFrame = 0;
    let lastPaint = 0;
    let spreadStartedAt: number | null = null;
    let spreadOrigin = trigger.origin;
    let pointerLastMovedAt = -Infinity;
    let pointerX = 0.5;
    let pointerY = 0.5;
    let pointerVelocityX = 0;
    let pointerVelocityY = 0;
    let paintedFrames = 0;
    let measuredAt = performance.now();
    let latestFps = 0;
    const rows = getRows(columns, size);
    const cells = columns * rows;
    prepareCanvas(canvas, size);
    const context = canvas.getContext('2d', { alpha: false });
    if (!context) return;

    const emitTelemetry = (render: Telemetry['render'], now: number, force = false) => {
      if (render === 'active' && (force || now - measuredAt >= 450)) {
        latestFps = Math.round((paintedFrames * 1000) / Math.max(1, now - measuredAt));
        paintedFrames = 0;
        measuredAt = now;
      }
      if (render === 'idle') latestFps = 0;
      onTelemetry({ fps: latestFps, cells, render });
    };

    loadAsciiSource(source, columns, rows, size.width / size.height).then((field) => {
      if (disposed) return;

      const paint = (now: number, spreadProgress: number | null, pointerStrength: number) => {
        renderAsciiField(
          context,
          field,
          { ...settings, variant: 'characters' },
          {
            spreadProgress,
            spreadOrigin,
            pointer: {
              active: pointerStrength > 0,
              x: pointerX,
              y: pointerY,
              velocityX: pointerVelocityX,
              velocityY: pointerVelocityY,
              strength: pointerStrength,
              radius: POINTER_RADIUS * Math.min(2, window.devicePixelRatio || 1),
              mode: pointerMode,
            },
          },
        );
        paintedFrames += 1;
        lastPaint = now;
      };

      const stop = (now: number) => {
        animationFrame = 0;
        spreadStartedAt = null;
        emitTelemetry('idle', now, true);
        cancelAnimationFrame(settleFrame);
        settleFrame = requestAnimationFrame((settleNow) => {
          if (!disposed) paint(settleNow, null, 0);
        });
      };

      const tick = (now: number) => {
        if (disposed) return;
        if (document.visibilityState === 'hidden') {
          animationFrame = 0;
          return;
        }

        const spreadProgress = spreadStartedAt === null
          ? null
          : Math.min(1, (now - spreadStartedAt) / SPREAD_DURATION);
        const pointerAge = now - pointerLastMovedAt;
        const pointerStrength = reducedMotion
          ? 0
          : pointerAge < 120
            ? 1
            : Math.max(0, 1 - (pointerAge - 120) / 220);
        const spreadActive = !reducedMotion && spreadProgress !== null && spreadProgress < 1;
        const pointerActive = pointerStrength > 0;
        const frameInterval = 1000 / fps;

        if (now - lastPaint >= frameInterval) {
          paint(now, spreadActive ? spreadProgress : null, pointerStrength);
          emitTelemetry('active', now);
        }

        if (spreadActive || pointerActive) {
          animationFrame = requestAnimationFrame(tick);
        } else {
          stop(now);
        }
      };

      const startLoop = () => {
        if (!animationFrame) {
          measuredAt = performance.now();
          paintedFrames = 0;
          animationFrame = requestAnimationFrame(tick);
          emitTelemetry('active', measuredAt, true);
        }
      };

      controllerRef.current = {
        trigger: (origin) => {
          spreadOrigin = origin;
          if (reducedMotion) {
            paint(performance.now(), null, 0);
            emitTelemetry('idle', performance.now(), true);
            return;
          }
          spreadStartedAt = performance.now();
          startLoop();
        },
        movePointer: (x, y, velocityX, velocityY) => {
          if (reducedMotion) return;
          pointerX = x;
          pointerY = y;
          pointerVelocityX = velocityX;
          pointerVelocityY = velocityY;
          pointerLastMovedAt = performance.now();
          startLoop();
        },
        leavePointer: () => {
          pointerLastMovedAt = performance.now() - 120;
          startLoop();
        },
      };

      emitTelemetry('idle', performance.now(), true);
      settleFrame = requestAnimationFrame((settleNow) => {
        if (!disposed) paint(settleNow, null, 0);
      });
      if (trigger.token > consumedTriggerRef.current) {
        consumedTriggerRef.current = trigger.token;
        controllerRef.current.trigger(trigger.origin);
      }
    });

    const onVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        cancelAnimationFrame(animationFrame);
        animationFrame = 0;
      }
    };
    document.addEventListener('visibilitychange', onVisibilityChange);

    return () => {
      disposed = true;
      cancelAnimationFrame(animationFrame);
      cancelAnimationFrame(settleFrame);
      controllerRef.current = null;
      document.removeEventListener('visibilitychange', onVisibilityChange);
    };
  }, [columns, fps, onTelemetry, pointerMode, reducedMotion, settings, size, source, trigger.origin, trigger.token]);

  useEffect(() => {
    if (trigger.token <= consumedTriggerRef.current) return;
    const controller = controllerRef.current;
    if (!controller) return;
    consumedTriggerRef.current = trigger.token;
    controller.trigger(trigger.origin);
  }, [trigger]);

  const handlePointerMove = (event: ReactPointerEvent<HTMLCanvasElement>) => {
    if (reducedMotion || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / Math.max(1, bounds.width);
    const y = (event.clientY - bounds.top) / Math.max(1, bounds.height);
    const now = performance.now();
    const previous = lastPointerRef.current;
    const elapsed = Math.max(16, now - (previous?.at ?? now - 16));
    const velocityX = previous ? (x - previous.x) / elapsed : 0;
    const velocityY = previous ? (y - previous.y) / elapsed : 0;
    lastPointerRef.current = { x, y, at: now };
    controllerRef.current?.movePointer(x, y, velocityX, velocityY);
  };

  return (
    <div ref={frameRef} className="ascii-lab-stage-frame">
      <canvas
        ref={canvasRef}
        role="img"
        aria-label="由 ECHOFLASH 项目封面亮度与边缘驱动的可交互 ASCII 字符场"
        onPointerMove={handlePointerMove}
        onPointerLeave={() => {
          lastPointerRef.current = null;
          controllerRef.current?.leavePointer();
        }}
      />
      <div className="ascii-lab-stage-note" aria-hidden="true">
        <span>REAL MEDIA → LUMINANCE / EDGE → GLYPH</span>
        <span>{columns} COL · {fps} FPS CAP</span>
      </div>
    </div>
  );
}

function RangeControl({
  label,
  value,
  minimum,
  maximum,
  step,
  display,
  onChange,
}: {
  label: string;
  value: number;
  minimum: number;
  maximum: number;
  step: number;
  display: string;
  onChange: (value: number) => void;
}) {
  return (
    <label className="ascii-lab-range-control">
      <span><b>{label}</b><output>{display}</output></span>
      <input
        type="range"
        min={minimum}
        max={maximum}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.currentTarget.value))}
      />
    </label>
  );
}

export function AsciiLab() {
  const reducedMotion = useReducedMotion();
  const [paletteId, setPaletteId] = useState<AsciiPalette['id']>('warm');
  const [glyphRamp, setGlyphRamp] = useState(DEFAULT_GLYPH_RAMP);
  const [columns, setColumns] = useState(() =>
    typeof window !== 'undefined' && window.matchMedia('(max-width: 720px)').matches ? 48 : 96,
  );
  const [contrast, setContrast] = useState(1.2);
  const [edge, setEdge] = useState(0.35);
  const [density, setDensity] = useState(0.72);
  const [fps, setFps] = useState(18);
  const [pointerMode, setPointerMode] = useState<PointerMode>('luminance');
  const [trigger, setTrigger] = useState<TriggerState>(() => ({
    token: reducedMotion ? 0 : 1,
    origin: { x: 0.12, y: 0.72 },
  }));
  const [telemetry, setTelemetry] = useState<Telemetry>({ fps: 0, cells: 0, render: 'idle' });
  const palette = ASCII_PALETTES.find((candidate) => candidate.id === paletteId) ?? ASCII_PALETTES[0];

  const commonSettings = useMemo(() => ({
    palette,
    glyphRamp,
    contrast,
    edge,
    density,
  }), [contrast, density, edge, glyphRamp, palette]);

  const handleTelemetry = useCallback((next: Telemetry) => {
    setTelemetry((current) => (
      current.fps === next.fps
      && current.cells === next.cells
      && current.render === next.render
        ? current
        : next
    ));
  }, []);

  const replay = (origin: TriggerState['origin']) => {
    setTrigger((current) => ({ token: current.token + 1, origin }));
  };

  const replayFromKeyboard = (
    event: KeyboardEvent<HTMLButtonElement>,
    origin: TriggerState['origin'],
  ) => {
    if (event.key !== 'Enter' && event.key !== ' ') return;
    event.preventDefault();
    replay(origin);
  };

  return (
    <main className="ascii-lab-shell">
      <header className="ascii-lab-topbar">
        <div>
          <span className="ascii-lab-kicker">ASCII MATERIAL / INTERACTION LAB</span>
          <h1>字符终端材质与交互实验</h1>
        </div>
        <div className="ascii-lab-round-state">
          <span>ROUND 9A</span>
          <span>LOCAL ONLY</span>
        </div>
      </header>

      <section className="ascii-lab-workbench" aria-labelledby="ascii-stage-title">
        <div className="ascii-lab-stage-panel">
          <header className="ascii-lab-panel-heading">
            <div>
              <span>LIVE SOURCE / ECHOFLASH</span>
              <h2 id="ascii-stage-title">高功率字符蔓延</h2>
            </div>
            <p>紫色只标记正在传播的前沿；完成后回到低饱和终端稳定态。</p>
          </header>
          <InteractiveAsciiStage
            source={SOURCE}
            columns={columns}
            fps={fps}
            pointerMode={pointerMode}
            settings={commonSettings}
            trigger={trigger}
            reducedMotion={reducedMotion}
            onTelemetry={handleTelemetry}
          />
        </div>

        <aside className="ascii-lab-controls" aria-label="ASCII 字符场参数">
          <fieldset>
            <legend>PALETTE / 色板</legend>
            <div className="ascii-lab-palette-grid">
              {ASCII_PALETTES.map((candidate) => (
                <label key={candidate.id} data-checked={candidate.id === paletteId ? 'true' : 'false'}>
                  <input
                    type="radio"
                    name="ascii-palette"
                    value={candidate.id}
                    checked={candidate.id === paletteId}
                    onChange={() => setPaletteId(candidate.id)}
                  />
                  <span
                    className="ascii-lab-palette-chip"
                    style={{ background: candidate.highlight, borderColor: candidate.event }}
                    aria-hidden="true"
                  />
                  <span>{candidate.label}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <label className="ascii-lab-text-control">
            <span>GLYPH RAMP / 字符坡度</span>
            <input
              type="text"
              value={glyphRamp}
              maxLength={32}
              spellCheck={false}
              onChange={(event) => setGlyphRamp(event.currentTarget.value || DEFAULT_GLYPH_RAMP)}
            />
          </label>

          <div className="ascii-lab-range-stack">
            <RangeControl label="COLUMNS" value={columns} minimum={40} maximum={120} step={4} display={`${columns}`} onChange={setColumns} />
            <RangeControl label="CONTRAST" value={contrast} minimum={0.7} maximum={1.8} step={0.05} display={contrast.toFixed(2)} onChange={setContrast} />
            <RangeControl label="EDGE" value={edge} minimum={0} maximum={0.8} step={0.05} display={edge.toFixed(2)} onChange={setEdge} />
            <RangeControl label="DENSITY" value={density} minimum={0.35} maximum={1} step={0.05} display={`${Math.round(density * 100)}%`} onChange={setDensity} />
          </div>

          <fieldset>
            <legend>FPS CAP</legend>
            <div className="ascii-lab-segmented">
              {[12, 18, 24].map((value) => (
                <label key={value} data-checked={fps === value ? 'true' : 'false'}>
                  <input type="radio" name="ascii-fps" checked={fps === value} onChange={() => setFps(value)} />
                  <span>{value}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <fieldset>
            <legend>POINTER MODE / 鼠标模式</legend>
            <div className="ascii-lab-segmented ascii-lab-segmented-wide">
              {(['luminance', 'flow', 'repel'] as PointerMode[]).map((mode) => (
                <label key={mode} data-checked={pointerMode === mode ? 'true' : 'false'}>
                  <input type="radio" name="pointer-mode" checked={pointerMode === mode} onChange={() => setPointerMode(mode)} />
                  <span>{mode.toUpperCase()}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <div className="ascii-lab-trigger-grid">
            <button
              type="button"
              onClick={() => replay({ x: 0.12, y: 0.72 })}
              onKeyDown={(event) => replayFromKeyboard(event, { x: 0.12, y: 0.72 })}
            >
              AUTO ONCE <span>↻</span>
            </button>
            <button
              type="button"
              className="ascii-lab-trigger-event"
              onClick={() => replay({ x: 0.84, y: 0.78 })}
              onKeyDown={(event) => replayFromKeyboard(event, { x: 0.84, y: 0.78 })}
            >
              CTA TRIGGER <span>↗</span>
            </button>
          </div>

          <p className="ascii-lab-control-note">
            {reducedMotion
              ? '系统已启用减少动态：传播与鼠标字符场关闭，保留完成态。'
              : '将鼠标移入主画面测试局部字符响应；停止移动后 220ms 内回落并停绘。'}
          </p>
        </aside>
      </section>

      <section className="ascii-lab-comparison" aria-labelledby="ascii-comparison-title">
        <header>
          <div>
            <span>ONE SOURCE / THREE MEDIA</span>
            <h2 id="ascii-comparison-title">同源渲染方式对照</h2>
          </div>
          <p>Characters 是目标语言；Block Chars 与 Dither 只用于辨认边界。</p>
        </header>
        <div className="ascii-lab-compare-grid">
          <StaticAsciiPreview variant="characters" source={SOURCE} columns={Math.min(72, columns)} settings={commonSettings} label="CHARACTERS" />
          <StaticAsciiPreview variant="blocks" source={SOURCE} columns={Math.min(72, columns)} settings={commonSettings} label="BLOCK CHARS" />
          <StaticAsciiPreview variant="dither" source={SOURCE} columns={Math.min(72, columns)} settings={commonSettings} label="DITHER" />
        </div>
      </section>

      <footer className="ascii-lab-telemetry" aria-label="实时渲染状态">
        <div><span>FPS</span><strong>{telemetry.fps}</strong></div>
        <div><span>CELLS</span><strong>{telemetry.cells}</strong></div>
        <div><span>RENDER</span><strong data-state={telemetry.render}>{telemetry.render.toUpperCase()}</strong></div>
        <div><span>POINTER</span><strong>{reducedMotion ? 'OFF / REDUCED' : pointerMode.toUpperCase()}</strong></div>
      </footer>
    </main>
  );
}
