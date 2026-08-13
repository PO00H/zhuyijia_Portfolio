import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from 'react';
import { ArrowLeftRight, Pause, Play, RotateCcw } from 'lucide-react';
import { getPortfolioProjectById } from '../../data/portfolioProjects';
import {
  getMediaTransitionPhase,
  loadMediaFramePair,
  renderMediaTransition,
  type MediaFramePair,
  type MediaTransitionMode,
  type MediaTransitionPhase,
} from './mediaTransitionRenderer';
import {
  renderDitherStudy,
  renderPixelMaterial,
  type PixelScene,
} from './pixelRenderer';
import './pixel-material-lab.css';

interface ResolutionOption {
  label: string;
  width: number;
  height: number;
}

const RESOLUTIONS: ResolutionOption[] = [
  { label: '96 × 54', width: 96, height: 54 },
  { label: '160 × 90', width: 160, height: 90 },
  { label: '240 × 135', width: 240, height: 135 },
];

const PROJECT_MEDIA = ['game-001', 'game-002'].map((id) => {
  const project = getPortfolioProjectById(id);
  if (!project.cover) throw new Error(`Pixel material lab project has no cover: ${id}`);
  return {
    id,
    title: project.title,
    shortTitle: id === 'game-001' ? 'ECHOFLASH' : '橡皮奥德赛',
    source: project.cover,
  };
});

const TRANSITION_PHASES: Array<{
  id: MediaTransitionPhase;
  label: string;
  range: string;
}> = [
  { id: 'quantize', label: '量化', range: '0–100ms' },
  { id: 'resolve', label: '解析', range: '100–260ms' },
  { id: 'rebuild', label: '重组', range: '260–460ms' },
  { id: 'settle', label: '稳定', range: '460–560ms' },
];

const clampInspectionProgress = (milliseconds: number) =>
  Math.min(1, Math.max(0, milliseconds / 560));

const VECTOR_CELLS = Array.from({ length: 42 }, (_, index) => ({
  left: 4 + ((index * 31) % 92),
  top: 5 + ((index * 47) % 88),
  size: [6, 8, 10, 12][index % 4],
  x: ((index * 37) % 72) - 36,
  y: ((index * 29) % 58) - 29,
  returnX: -(((index * 37) % 72) - 36) * 0.25,
  returnY: -(((index * 29) % 58) - 29) * 0.25,
  delay: (index % 9) * 16,
}));

const useReducedMotion = () => {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduced(media.matches);
    update();
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);

  return reduced;
};

function CanvasFrame({
  mode,
  resolution,
  levels,
  dither,
  fps,
  playing,
  reducedMotion,
  replayToken,
}: {
  mode: 'dither' | 'motion';
  resolution: ResolutionOption;
  levels: number;
  dither: number;
  fps: number;
  playing: boolean;
  reducedMotion: boolean;
  replayToken: number;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const elapsedRef = useRef(0);
  const previousFrameRef = useRef<number | null>(null);
  const lastPaintRef = useRef(0);
  const sceneRef = useRef<PixelScene>(0);
  const transitionRef = useRef<{ startedAt: number; from: PixelScene } | null>(null);
  const previousReplayRef = useRef(replayToken);

  useEffect(() => {
    if (mode !== 'motion' || previousReplayRef.current === replayToken) return;
    previousReplayRef.current = replayToken;
    if (reducedMotion) {
      sceneRef.current = sceneRef.current === 0 ? 1 : 0;
      transitionRef.current = null;
      return;
    }
    transitionRef.current = { startedAt: performance.now(), from: sceneRef.current };
  }, [mode, reducedMotion, replayToken]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d', { alpha: false });
    if (!canvas || !context) return;

    const settings = {
      width: resolution.width,
      height: resolution.height,
      levels,
      dither,
    };

    if (mode === 'dither') {
      renderDitherStudy(context, settings);
      return;
    }

    let animationFrame = 0;
    let disposed = false;
    const frameInterval = 1000 / fps;

    const paint = (now: number) => {
      if (disposed) return;
      const previous = previousFrameRef.current ?? now;
      previousFrameRef.current = now;

      if (playing && !reducedMotion) {
        elapsedRef.current += Math.min(40, now - previous) / 1000;
      }

      const transition = transitionRef.current;
      let progress: number | null = null;
      let forcePaint = false;
      if (transition) {
        progress = reducedMotion ? 1 : Math.min(1, (now - transition.startedAt) / 560);
        if (progress >= 1) {
          sceneRef.current = transition.from === 0 ? 1 : 0;
          transitionRef.current = null;
          progress = null;
          forcePaint = true;
        }
      }

      const shouldPaint =
        forcePaint ||
        (now - lastPaintRef.current >= frameInterval &&
          ((playing && !reducedMotion) || progress !== null));
      if (shouldPaint) {
        lastPaintRef.current = now;
        renderPixelMaterial(
          context,
          settings,
          reducedMotion ? 1.4 : elapsedRef.current,
          transition?.from ?? sceneRef.current,
          progress,
        );
      }
      animationFrame = requestAnimationFrame(paint);
    };

    renderPixelMaterial(context, settings, reducedMotion ? 1.4 : elapsedRef.current, sceneRef.current, null);
    animationFrame = requestAnimationFrame(paint);

    return () => {
      disposed = true;
      cancelAnimationFrame(animationFrame);
      previousFrameRef.current = null;
    };
  }, [
    dither,
    fps,
    levels,
    mode,
    playing,
    reducedMotion,
    replayToken,
    resolution.height,
    resolution.width,
  ]);

  return (
    <canvas
      ref={canvasRef}
      className="pixel-material-canvas"
      width={resolution.width}
      height={resolution.height}
      role="img"
      aria-label={mode === 'dither' ? '受限色阶与有序抖动静态示例' : '低分辨率动态像素渐变示例'}
    />
  );
}

function MediaTransitionCanvas({
  mode,
  from,
  to,
  resolution,
  levels,
  dither,
  fps,
  playing,
  reducedMotion,
  replayToken,
  inspectionMs,
  onSettled,
}: {
  mode: MediaTransitionMode;
  from: (typeof PROJECT_MEDIA)[number];
  to: (typeof PROJECT_MEDIA)[number];
  resolution: ResolutionOption;
  levels: number;
  dither: number;
  fps: number;
  playing: boolean;
  reducedMotion: boolean;
  replayToken: number;
  inspectionMs: number | null;
  onSettled?: () => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fromImageRef = useRef<HTMLImageElement>(null);
  const toImageRef = useRef<HTMLImageElement>(null);
  const framesRef = useRef<MediaFramePair | null>(null);
  const playingRef = useRef(playing);
  const lastStartedReplayRef = useRef(0);
  const [loadedVersion, setLoadedVersion] = useState(0);
  const [loadedMediaKey, setLoadedMediaKey] = useState('');
  const [errorMediaKey, setErrorMediaKey] = useState('');
  const [phase, setPhase] = useState<MediaTransitionPhase>('settle');
  const [elapsed, setElapsed] = useState(560);
  const mediaKey = `${from.source}|${to.source}|${resolution.width}x${resolution.height}`;
  const loadState = errorMediaKey === mediaKey
    ? 'error'
    : loadedMediaKey === mediaKey
      ? 'ready'
      : 'loading';

  useEffect(() => {
    playingRef.current = playing;
  }, [playing]);

  useEffect(() => {
    let disposed = false;
    framesRef.current = null;

    if (canvasRef.current) canvasRef.current.style.opacity = '0';
    if (fromImageRef.current) fromImageRef.current.style.opacity = '1';
    if (toImageRef.current) toImageRef.current.style.opacity = '1';

    loadMediaFramePair(from.source, to.source, {
      width: resolution.width,
      height: resolution.height,
      levels,
      dither,
    })
      .then((frames) => {
        if (disposed) return;
        framesRef.current = frames;
        setLoadedMediaKey(mediaKey);
        setLoadedVersion((current) => current + 1);
      })
      .catch(() => {
        if (!disposed) setErrorMediaKey(mediaKey);
      });

    return () => {
      disposed = true;
    };
  }, [dither, from.source, levels, mediaKey, resolution.height, resolution.width, to.source]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d', { alpha: false });
    const frames = framesRef.current;
    if (!canvas || !context || !frames) return;

    if (inspectionMs !== null) {
      const inspectionProgress = clampInspectionProgress(inspectionMs);
      renderMediaTransition(context, frames, {
        width: resolution.width,
        height: resolution.height,
        levels,
        dither,
      }, inspectionProgress, mode);
      canvas.style.opacity = inspectionProgress > 0.82
        ? String(Math.max(0, 1 - (inspectionProgress - 0.82) / 0.18))
        : '1';
      if (fromImageRef.current) {
        fromImageRef.current.style.opacity = inspectionProgress < 0.46 ? '1' : '0';
      }
      return;
    }

    if (replayToken === lastStartedReplayRef.current) {
      canvas.style.opacity = '0';
      if (fromImageRef.current) fromImageRef.current.style.opacity = '1';
      return;
    }

    lastStartedReplayRef.current = replayToken;
    let disposed = false;
    let animationFrame = 0;
    let elapsedMs = 0;
    let previousTime = performance.now();
    let lastPaint = -Infinity;
    let currentPhase: MediaTransitionPhase | null = null;
    const frameInterval = 1000 / fps;

    if (reducedMotion) {
      canvas.style.opacity = '0';
      if (fromImageRef.current) fromImageRef.current.style.opacity = '0';
      animationFrame = requestAnimationFrame(() => onSettled?.());
      return () => cancelAnimationFrame(animationFrame);
    }

    canvas.style.opacity = '1';
    if (fromImageRef.current) fromImageRef.current.style.opacity = '1';
    renderMediaTransition(context, frames, {
      width: resolution.width,
      height: resolution.height,
      levels,
      dither,
    }, 0, mode);

    const paint = (now: number) => {
      if (disposed) return;
      const delta = Math.max(0, now - previousTime);
      previousTime = now;

      if (playingRef.current) elapsedMs = Math.min(560, elapsedMs + delta);
      const progress = elapsedMs / 560;

      if (playingRef.current && now - lastPaint >= frameInterval) {
        lastPaint = now;
        renderMediaTransition(context, frames, {
          width: resolution.width,
          height: resolution.height,
          levels,
          dither,
        }, progress, mode);

        const nextPhase = getMediaTransitionPhase(progress);
        if (nextPhase !== currentPhase) {
          currentPhase = nextPhase;
          setPhase(nextPhase);
        }
        setElapsed(Math.round(elapsedMs));

        if (fromImageRef.current) {
          fromImageRef.current.style.opacity = progress < 0.46 ? '1' : '0';
        }
        canvas.style.opacity = progress > 0.82
          ? String(Math.max(0, 1 - (progress - 0.82) / 0.18))
          : '1';
      }

      if (elapsedMs >= 560) {
        canvas.style.opacity = '0';
        if (fromImageRef.current) fromImageRef.current.style.opacity = '0';
        setPhase('settle');
        setElapsed(560);
        onSettled?.();
        return;
      }

      animationFrame = requestAnimationFrame(paint);
    };

    animationFrame = requestAnimationFrame(paint);
    return () => {
      disposed = true;
      cancelAnimationFrame(animationFrame);
    };
  }, [
    dither,
    fps,
    from.source,
    inspectionMs,
    levels,
    loadedVersion,
    mode,
    onSettled,
    reducedMotion,
    replayToken,
    resolution.height,
    resolution.width,
    to.source,
  ]);

  const displayElapsed = inspectionMs ?? elapsed;
  const displayPhase = inspectionMs === null
    ? phase
    : getMediaTransitionPhase(clampInspectionProgress(inspectionMs));
  const phaseLabel = TRANSITION_PHASES.find((item) => item.id === displayPhase)?.label ?? '稳定';

  return (
    <div
      className={`pixel-material-transition-stage is-${mode}`}
      data-transition-phase={displayPhase}
      data-source-resolution={resolution.label}
    >
      <img
        ref={toImageRef}
        src={to.source}
        alt=""
        aria-hidden="true"
        className="pixel-material-transition-image is-target"
      />
      <img
        ref={fromImageRef}
        src={from.source}
        alt={from.title}
        className="pixel-material-transition-image is-source"
      />
      <canvas
        ref={canvasRef}
        className="pixel-material-transition-canvas"
        role="img"
        aria-label={mode === 'dither-matrix'
          ? `${from.shortTitle} 到 ${to.shortTitle} 的纯抖动矩阵转场`
          : `${from.shortTitle} 到 ${to.shortTitle} 的字符与抖动组合转场`}
      />
      <div className="pixel-material-transition-readout" aria-live="polite">
        <span>{phaseLabel}</span>
        <output>{String(displayElapsed).padStart(3, '0')} / 560ms</output>
      </div>
      <div className="pixel-material-transition-projects" aria-hidden="true">
        <span>{from.shortTitle}</span>
        <i>→</i>
        <span>{to.shortTitle}</span>
      </div>
      {loadState !== 'ready' && (
        <div className="pixel-material-transition-loading">
          {loadState === 'error' ? '媒体加载失败' : '读取真实项目媒体…'}
        </div>
      )}
    </div>
  );
}

function TransitionStudyCard({
  index,
  mode,
  title,
  description,
  from,
  to,
  resolution,
  levels,
  dither,
  fps,
  playing,
  reducedMotion,
  replayToken,
  inspectionMs,
  onSettled,
}: {
  index: string;
  mode: MediaTransitionMode;
  title: string;
  description: string;
  from: (typeof PROJECT_MEDIA)[number];
  to: (typeof PROJECT_MEDIA)[number];
  resolution: ResolutionOption;
  levels: number;
  dither: number;
  fps: number;
  playing: boolean;
  reducedMotion: boolean;
  replayToken: number;
  inspectionMs: number | null;
  onSettled?: () => void;
}) {
  return (
    <article className="pixel-material-transition-card">
      <header>
        <span>{index}</span>
        <div>
          <p>{mode === 'dither-matrix' ? 'OPTION A / SELECTED' : 'REFERENCE B / ASCII'}</p>
          <h3>{title}</h3>
        </div>
      </header>
      <MediaTransitionCanvas
        mode={mode}
        from={from}
        to={to}
        resolution={resolution}
        levels={levels}
        dither={dither}
        fps={fps}
        playing={playing}
        reducedMotion={reducedMotion}
        replayToken={replayToken}
        inspectionMs={inspectionMs}
        onSettled={onSettled}
      />
      <div className="pixel-material-transition-timeline" aria-label="560 毫秒转场阶段">
        {TRANSITION_PHASES.map((item) => (
          <div key={item.id}>
            <span>{item.label}</span>
            <small>{item.range}</small>
          </div>
        ))}
      </div>
      <p>{description}</p>
      <dl>
        <div>
          <dt>SOURCE</dt>
          <dd>{resolution.label} / 项目原色</dd>
        </div>
        <div>
          <dt>MATRIX</dt>
          <dd>{mode === 'dither-matrix' ? 'Bayer 4×4' : 'Bayer 4×4 + 64×36 Glyph'}</dd>
        </div>
        <div>
          <dt>SETTLED</dt>
          <dd>清晰真实媒体</dd>
        </div>
      </dl>
    </article>
  );
}

function StudyCard({
  index,
  eyebrow,
  title,
  description,
  children,
  facts,
}: {
  index: string;
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
  facts: Array<[string, string]>;
}) {
  return (
    <article className="pixel-material-study-card">
      <header>
        <span>{index}</span>
        <div>
          <p>{eyebrow}</p>
          <h2>{title}</h2>
        </div>
      </header>
      <div className="pixel-material-frame">{children}</div>
      <p className="pixel-material-card-description">{description}</p>
      <dl>
        {facts.map(([term, value]) => (
          <div key={term}>
            <dt>{term}</dt>
            <dd>{value}</dd>
          </div>
        ))}
      </dl>
    </article>
  );
}

export function PixelMaterialLab() {
  const [resolutionIndex, setResolutionIndex] = useState(1);
  const [levels, setLevels] = useState(5);
  const [dither, setDither] = useState(0.72);
  const [fps, setFps] = useState(12);
  const [playing, setPlaying] = useState(true);
  const [replayToken, setReplayToken] = useState(0);
  const [vectorReplayToken, setVectorReplayToken] = useState(0);
  const [activeProjectIndex, setActiveProjectIndex] = useState(0);
  const [inspectionMs, setInspectionMs] = useState<number | null>(null);
  const reducedMotion = useReducedMotion();
  const resolution = RESOLUTIONS[resolutionIndex];
  const fromProject = PROJECT_MEDIA[activeProjectIndex];
  const toProject = PROJECT_MEDIA[activeProjectIndex === 0 ? 1 : 0];

  const status = useMemo(
    () => reducedMotion ? 'REDUCED MOTION · STATIC' : playing ? `${fps} FPS · RUNNING` : 'PAUSED',
    [fps, playing, reducedMotion],
  );

  const replay = useCallback(() => {
    setInspectionMs(null);
    setReplayToken((current) => current + 1);
    setVectorReplayToken((current) => current + 1);
  }, []);

  const swapProjectOrder = useCallback(() => {
    setInspectionMs(null);
    setActiveProjectIndex((current) => current === 0 ? 1 : 0);
  }, []);

  const settleProjectTransition = useCallback(() => {
    setActiveProjectIndex((current) => current === 0 ? 1 : 0);
  }, []);

  return (
    <main className="pixel-material-lab">
      <header className="pixel-material-lab-nav">
        <a href="/">ZHU YIJIA</a>
        <span>ROUND 8C / A SELECTED</span>
        <a href="/">返回作品集</a>
      </header>

      <section className="pixel-material-intro" aria-labelledby="pixel-material-title">
        <div className="pixel-material-intro-index">08B</div>
        <div>
          <p>PIXEL MATERIAL LAB / 真实媒体转场实验</p>
          <h1 id="pixel-material-title">
            <span>同一份项目媒体，</span>
            <span>验证连续像素交接。</span>
          </h1>
        </div>
        <p className="pixel-material-intro-copy">
          Round 8C 已选择纯 Dither Matrix。A / B 对照继续保留，A 的旧画面与新画面现在
          在同一矩阵内逐像素直接交接，不再经过全黑断层。
        </p>
      </section>

      <section className="pixel-material-controls" aria-label="像素材质参数">
        <div className="pixel-material-control-group is-resolution">
          <span>内部画布</span>
          <div>
            {RESOLUTIONS.map((option, index) => (
              <button
                key={option.label}
                type="button"
                className={resolutionIndex === index ? 'is-active' : ''}
                aria-pressed={resolutionIndex === index}
                onClick={() => setResolutionIndex(index)}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        <label className="pixel-material-control-group">
          <span>色阶 <output>{levels}</output></span>
          <input
            type="range"
            min="3"
            max="6"
            step="1"
            value={levels}
            onChange={(event) => setLevels(Number(event.target.value))}
          />
        </label>

        <label className="pixel-material-control-group">
          <span>抖动强度 <output>{Math.round(dither * 100)}%</output></span>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={dither}
            onChange={(event) => setDither(Number(event.target.value))}
          />
        </label>

        <div className="pixel-material-control-group is-fps">
          <span>更新帧率</span>
          <div>
            {[6, 12, 24].map((value) => (
              <button
                key={value}
                type="button"
                className={fps === value ? 'is-active' : ''}
                aria-pressed={fps === value}
                onClick={() => setFps(value)}
              >
                {value}
              </button>
            ))}
          </div>
        </div>

        <div className="pixel-material-playback">
          <span>{status}</span>
          <button
            type="button"
            onClick={() => setPlaying((current) => !current)}
            disabled={reducedMotion}
          >
            {playing ? <Pause aria-hidden="true" /> : <Play aria-hidden="true" />}
            {playing ? '暂停' : '播放'}
          </button>
          <button type="button" onClick={replay}>
            <RotateCcw aria-hidden="true" />
            重播 560ms
          </button>
          <button type="button" onClick={swapProjectOrder}>
            <ArrowLeftRight aria-hidden="true" />
            交换项目顺序
          </button>
        </div>
      </section>

      <section className="pixel-material-studies" aria-label="三种像素材质实现对照">
        <StudyCard
          index="01"
          eyebrow="CURRENT METHOD"
          title="矢量方块"
          description="独立 DOM 方块叠在连续渐变之上。轮廓是像素化的，但光影本身仍由浏览器平滑插值。"
          facts={[
            ['RENDER', 'HTML / CSS'],
            ['PIXEL ROLE', '装饰'],
            ['DEPTH', '连续渐变'],
          ]}
        >
          <div className="pixel-material-vector-stage">
            <div className="pixel-material-vector-orb is-one" />
            <div className="pixel-material-vector-orb is-two" />
            <div className="pixel-material-vector-cells" key={vectorReplayToken} aria-hidden="true">
              {VECTOR_CELLS.map((cell, index) => (
                <i
                  key={index}
                  style={{
                    left: `${cell.left}%`,
                    top: `${cell.top}%`,
                    width: `${cell.size}px`,
                    height: `${cell.size}px`,
                    '--cell-x': `${cell.x}px`,
                    '--cell-y': `${cell.y}px`,
                    '--cell-return-x': `${cell.returnX}px`,
                    '--cell-return-y': `${cell.returnY}px`,
                    '--cell-delay': `${cell.delay}ms`,
                  } as CSSProperties}
                />
              ))}
            </div>
          </div>
        </StudyCard>

        <StudyCard
          index="02"
          eyebrow="RASTER STUDY"
          title="抖动色阶"
          description="先计算低分辨率亮度，再压缩色阶并用 Bayer 网点补偿中间色；每个颗粒都属于主体本身。"
          facts={[
            ['RENDER', `${resolution.label} Canvas`],
            ['PIXEL ROLE', '材质'],
            ['DEPTH', `${levels} 色阶 / Dither`],
          ]}
        >
          <CanvasFrame
            mode="dither"
            resolution={resolution}
            levels={levels}
            dither={dither}
            fps={fps}
            playing={playing}
            reducedMotion={reducedMotion}
            replayToken={replayToken}
          />
        </StudyCard>

        <StudyCard
          index="03"
          eyebrow="MOTION TARGET"
          title="像素渐变 MG"
          description="光影、轮廓与抖动图案按低帧率共同更新；重播时旧场景离散，新场景在同一晶格中重新显影。"
          facts={[
            ['RENDER', `${resolution.label} Canvas`],
            ['PIXEL ROLE', '材质＋运动'],
            ['EVENT', '560ms Rebuild'],
          ]}
        >
          <CanvasFrame
            mode="motion"
            resolution={resolution}
            levels={levels}
            dither={dither}
            fps={fps}
            playing={playing}
            reducedMotion={reducedMotion}
            replayToken={replayToken}
          />
        </StudyCard>
      </section>

      <section className="pixel-material-pipeline" aria-label="像素材质生成流程">
        {[
          ['01', '几何亮度场'],
          ['02', '低分辨率采样'],
          ['03', '受限色阶'],
          ['04', '有序抖动'],
          ['05', '最近邻放大'],
        ].map(([index, label]) => (
          <div key={index}>
            <span>{index}</span>
            <strong>{label}</strong>
          </div>
        ))}
      </section>

      <section className="pixel-material-transition-intro" aria-labelledby="pixel-transition-title">
        <div>
          <span>ROUND 8C</span>
          <p>SELECTED A / CONTINUOUS HANDOFF</p>
        </div>
        <h2 id="pixel-transition-title">方案 A 连续交接验证</h2>
        <p>
          A 已接入 GAME WORK；B 只保留为实验参考。请重点检查 560ms 中间是否仍出现整帧黑场，以及稳定后真实媒体是否清晰回归。
        </p>
        <div className="pixel-material-transition-actions">
          <button type="button" onClick={replay}>
            <RotateCcw aria-hidden="true" />
            同步重播 560ms
          </button>
          <button type="button" onClick={swapProjectOrder}>
            <ArrowLeftRight aria-hidden="true" />
            当前起点：{fromProject.shortTitle}
          </button>
          <button
            type="button"
            className={inspectionMs === 380 ? 'is-active' : ''}
            aria-pressed={inspectionMs === 380}
            onClick={() => setInspectionMs((current) => current === 380 ? null : 380)}
          >
            {inspectionMs === 380 ? '回到稳定媒体' : '冻结 380ms 对照帧'}
          </button>
        </div>
      </section>

      <section className="pixel-material-transition-grid" aria-label="已选 Dither 与 ASCII 参考方案">
        <TransitionStudyCard
          index="A"
          mode="dither-matrix"
          title="纯 Dither Matrix"
          description="只有低分辨率采样、项目原色量化和移动 Bayer 阈值。画面在矩阵中离散并重组，不出现额外字符语义。"
          from={fromProject}
          to={toProject}
          resolution={resolution}
          levels={levels}
          dither={dither}
          fps={fps}
          playing={playing}
          reducedMotion={reducedMotion}
          replayToken={replayToken}
          inspectionMs={inspectionMs}
          onSettled={settleProjectTransition}
        />
        <TransitionStudyCard
          index="B"
          mode="ascii-reveal"
          title="ASCII Reveal + Dither"
          description="解析阶段把同一画面的明暗和颜色压缩到 64×36 字符晶格；字符只在中段出现，重组完成后完全离场。"
          from={fromProject}
          to={toProject}
          resolution={resolution}
          levels={levels}
          dither={dither}
          fps={fps}
          playing={playing}
          reducedMotion={reducedMotion}
          replayToken={replayToken}
          inspectionMs={inspectionMs}
        />
      </section>

      <section className="pixel-material-transition-review" aria-label="Round 8C 验收问题">
        <span>REVIEW GATE</span>
        <h2>只判断三件事</h2>
        <ol>
          <li>旧项目与新项目是否在同一矩阵里连续交接，没有硬黑断层？</li>
          <li>560ms 内是否仍能辨认两份真实项目媒体的关系？</li>
          <li>动效结束后，Canvas 是否完全退场并恢复清晰媒体？</li>
        </ol>
      </section>

      <footer className="pixel-material-lab-footer">
        <p>ROUND 8C 已把优化后的方案 A 接入 GAME WORK；实验页继续保留参数与历史方案对照。</p>
        <a href="/">返回作品集 ↗</a>
      </footer>
    </main>
  );
}
