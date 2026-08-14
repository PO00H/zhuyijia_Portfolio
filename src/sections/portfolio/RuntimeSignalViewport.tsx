import { useEffect, useRef, type CSSProperties, type Ref } from 'react';
import type { PortfolioProject } from '@/data/portfolioProjects';
import {
  RuntimeDitherTransition,
  type RuntimeDitherTransitionHandle,
} from './RuntimeDitherTransition';

interface RuntimeSignalViewportProps {
  projects: PortfolioProject[];
  ditherTransitionRef: Ref<RuntimeDitherTransitionHandle>;
}

interface SignalPixelsProps {
  count: number;
  className: string;
}

const SIGNAL_PIXEL_LAYOUT = Array.from({ length: 42 }, (_, index) => {
  const edge = index % 4;
  const run = (index * 29) % 88;
  const left = edge === 0 ? 3 : edge === 2 ? 93 : 6 + run;
  const top = edge === 1 ? 4 : edge === 3 ? 92 : 6 + run;

  return {
    left,
    top,
    size: [4, 6, 8, 10][index % 4],
    x: ((index * 37) % 81) - 40,
    y: ((index * 43) % 65) - 32,
  };
});

export function SignalPixels({ count, className }: SignalPixelsProps) {
  return (
    <div className={className} aria-hidden="true">
      {SIGNAL_PIXEL_LAYOUT.slice(0, count).map((pixel, index) => (
        <span
          key={`${pixel.left}-${pixel.top}-${index}`}
          data-signal-pixel=""
          data-signal-x={pixel.x}
          data-signal-y={pixel.y}
          style={
            {
              left: `${pixel.left}%`,
              top: `${pixel.top}%`,
              width: `${pixel.size}px`,
              height: `${pixel.size}px`,
            } as CSSProperties
          }
        />
      ))}
    </div>
  );
}

function ReservedSignal({ project }: { project: PortfolioProject }) {
  return (
    <div className="portfolio-runtime-reserved">
      <div className="portfolio-runtime-reserved-mark" />
      <p>BUILD TARGET RESERVED</p>
      <span>{project.tags.join(' / ')}</span>
    </div>
  );
}

export function RuntimeSignalViewport({
  projects,
  ditherTransitionRef,
}: RuntimeSignalViewportProps) {
  const frameRef = useRef<HTMLElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);

  /* Compute the sticky threshold so the box parks with its centre at the
     screen centre (the area below the 64px fixed nav): top = centre − half
     the box height. Native sticky does the rest — natural scroll-in,
     park-on-reach, natural hand-off to the column bottom on exit. Runs only
     on geometry changes (resize / media load), never on scroll. */
  useEffect(() => {
    const frame = frameRef.current;
    const box = boxRef.current;
    if (!frame || !box) return;

    const desktopQuery = window.matchMedia('(min-width: 1100px)');

    const apply = () => {
      const section = frame.closest<HTMLElement>('.portfolio-game-section');
      if (!desktopQuery.matches || !section || section.dataset.runtimeSignal !== 'ready') {
        frame.style.top = '';
        return;
      }
      const centre = (window.innerHeight + 64) / 2;
      frame.style.top = `${(centre - box.offsetHeight / 2).toFixed(1)}px`;
    };

    apply();
    const resizeObserver = new ResizeObserver(apply);
    resizeObserver.observe(box);
    window.addEventListener('resize', apply);
    window.addEventListener('load', apply);
    desktopQuery.addEventListener('change', apply);
    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', apply);
      window.removeEventListener('load', apply);
      desktopQuery.removeEventListener('change', apply);
    };
  }, []);

  return (
    <aside ref={frameRef} className="portfolio-runtime-viewport" aria-hidden="true">
      <div ref={boxRef} className="portfolio-runtime-viewport-box">
        <header className="portfolio-runtime-chrome">
          <span>RUNTIME SIGNAL VIEWPORT</span>
          <span>GAME_WORK.SYS</span>
        </header>

        <div className="portfolio-runtime-stage">
          {projects.map((project, index) => (
            <div
              className="portfolio-runtime-media-layer"
              data-runtime-media-index={index}
              key={project.id}
            >
              {project.cover ? (
                <img src={project.cover} alt="" />
              ) : (
                <ReservedSignal project={project} />
              )}
            </div>
          ))}

          <RuntimeDitherTransition ref={ditherTransitionRef} projects={projects} />
          <div className="portfolio-runtime-crt" />
          <span className="portfolio-runtime-corner is-top-left" />
          <span className="portfolio-runtime-corner is-bottom-right" />
        </div>

        <div className="portfolio-runtime-diagnostics">
          <div className="portfolio-runtime-diagnostic-label">
            <span>SIGNAL / ACTIVE TARGET</span>
            <small>REAL PROJECT MEDIA</small>
          </div>

          <div className="portfolio-runtime-diagnostic-panels">
            {projects.map((project, index) => (
              <div
                className="portfolio-runtime-diagnostic-panel"
                data-runtime-diagnostic-index={index}
                key={project.id}
              >
                <span>STATUS</span>
                <strong>{project.status === 'reserved' ? 'IN DEVELOPMENT' : 'PUBLISHED'}</strong>
                <span>YEAR</span>
                <strong>{project.year ?? '—'}</strong>
                <span>STACK</span>
                <strong>{project.tags.join(' / ')}</strong>
              </div>
            ))}
          </div>
        </div>

        <div className="portfolio-runtime-rail">
          {projects.map((project, index) => (
            <span data-runtime-rail-index={index} key={project.id}>
              {String(index + 1).padStart(2, '0')}
            </span>
          ))}
        </div>
      </div>
    </aside>
  );
}
