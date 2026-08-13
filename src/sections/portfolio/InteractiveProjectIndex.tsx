import {
  Fragment,
  useEffect,
  useRef,
  useState,
  type ReactNode,
  type PointerEvent as ReactPointerEvent,
} from 'react';
import { createPortal } from 'react-dom';
import { ChevronDown } from 'lucide-react';
import type { PortfolioProject } from '@/data/portfolioProjects';

interface InteractiveProjectIndexProps {
  projects: PortfolioProject[];
  renderExpandedProject: (project: PortfolioProject) => ReactNode;
}

function ProjectPreviewMedia({
  project,
  reducedMotion,
}: {
  project: PortfolioProject;
  reducedMotion: boolean;
}) {
  if (project.id === 'design-004') {
    return (
      <div className="portfolio-floating-textures">
        {project.assetPaths.map((path) => (
          <img key={path} src={path} alt="" />
        ))}
      </div>
    );
  }

  if (project.preview) {
    return (
      <video
        key={project.preview}
        src={project.preview}
        poster={project.poster ?? undefined}
        autoPlay={!reducedMotion}
        muted
        loop
        playsInline
        preload="metadata"
      />
    );
  }

  if (project.cover) {
    return <img src={project.cover} alt="" />;
  }

  return <div className="portfolio-floating-empty">NO PREVIEW</div>;
}

export function InteractiveProjectIndex({
  projects,
  renderExpandedProject,
}: InteractiveProjectIndexProps) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [intentId, setIntentId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [reducedMotion, setReducedMotion] = useState(() =>
    typeof window === 'undefined'
      ? false
      : window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  );
  const previewRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const previewTimerRef = useRef<number | null>(null);
  const pointerRef = useRef({ x: 0, y: 0 });

  const clearPreviewTimer = () => {
    if (previewTimerRef.current) window.clearTimeout(previewTimerRef.current);
    previewTimerRef.current = null;
  };

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleChange = (event: MediaQueryListEvent) => setReducedMotion(event.matches);
    media.addEventListener('change', handleChange);
    return () => {
      media.removeEventListener('change', handleChange);
      clearPreviewTimer();
    };
  }, []);

  const positionPreview = (x: number, y: number) => {
    const preview = previewRef.current;
    if (!preview) return;

    const previewWidth = Math.min(400, window.innerWidth - 48);
    const previewHeight = 286;
    const offset = 32;
    const preferredX = x + offset;
    const nextX = Math.min(
      Math.max(offset, preferredX),
      window.innerWidth - previewWidth - offset,
    );
    const nextY = Math.min(
      Math.max(offset, y + 18),
      window.innerHeight - previewHeight - offset,
    );

    preview.style.transform = `translate3d(${nextX}px, ${nextY}px, 0)`;
  };

  const positionCursor = (x: number, y: number) => {
    pointerRef.current = { x, y };
    const cursor = cursorRef.current;
    if (cursor) cursor.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    if (activeId) positionPreview(x, y);
  };

  const handlePointerEnter = (
    event: ReactPointerEvent<HTMLButtonElement>,
    project: PortfolioProject,
  ) => {
    if (event.pointerType !== 'mouse') return;
    clearPreviewTimer();
    setActiveId(null);
    setIntentId(project.id);
    positionCursor(event.clientX, event.clientY);
    previewTimerRef.current = window.setTimeout(() => {
      setActiveId(project.id);
      positionPreview(pointerRef.current.x, pointerRef.current.y);
      previewTimerRef.current = null;
    }, reducedMotion ? 0 : 1000);
  };

  const dismissPreview = () => {
    clearPreviewTimer();
    setIntentId(null);
    setActiveId(null);
  };

  const activeProject = projects.find((project) => project.id === activeId) ?? null;

  return (
    <div className="portfolio-interactive-index" onPointerLeave={dismissPreview}>
      <div className="portfolio-index-labels" aria-hidden="true">
        <span>PROJECT</span>
        <span>FOCUS</span>
        <span>YEAR</span>
      </div>

      <div className="portfolio-index-rows">
        {projects.map((project, index) => {
          const isExpanded = expandedId === project.id;

          return (
            <Fragment key={project.id}>
              <button
                type="button"
                className={`portfolio-index-row ${activeId === project.id ? 'is-active' : ''} ${isExpanded ? 'is-expanded' : ''}`}
                aria-expanded={isExpanded}
                aria-controls={`portfolio-project-${project.id}`}
                onPointerEnter={(event) => handlePointerEnter(event, project)}
                onPointerMove={(event) => {
                  if (event.pointerType === 'mouse') positionCursor(event.clientX, event.clientY);
                }}
                onFocus={(event) => {
                  clearPreviewTimer();
                  setIntentId(null);
                  setActiveId(project.id);
                  const bounds = event.currentTarget.getBoundingClientRect();
                  positionPreview(bounds.right - 24, bounds.top + bounds.height / 2);
                }}
                onBlur={dismissPreview}
                onClick={() => setExpandedId(isExpanded ? null : project.id)}
              >
                <span className="portfolio-index-project">
                  <small>{(index + 1).toString().padStart(2, '0')}</small>
                  <strong>{project.title}</strong>
                </span>
                <span className="portfolio-index-focus">{project.tags.slice(0, 2).join(' · ')}</span>
                <span className="portfolio-index-year">{project.year}</span>
                <ChevronDown aria-hidden="true" />
              </button>

              {isExpanded && (
                <div
                  id={`portfolio-project-${project.id}`}
                  className="portfolio-expanded-project"
                >
                  {renderExpandedProject(project)}
                </div>
              )}
            </Fragment>
          );
        })}
      </div>

      {createPortal(
        <>
          <div
            key={intentId ?? 'idle'}
            ref={cursorRef}
            className={`portfolio-preview-cursor ${intentId ? 'is-visible' : ''} ${activeProject ? 'is-complete' : ''}`}
            aria-hidden="true"
          >
            <svg viewBox="0 0 32 32">
              <circle className="portfolio-preview-cursor-track" cx="16" cy="16" r="12" />
              <circle className="portfolio-preview-cursor-progress" cx="16" cy="16" r="12" />
            </svg>
          </div>

          <div
            ref={previewRef}
            className={`portfolio-floating-preview ${activeProject ? 'is-visible' : ''}`}
            aria-hidden="true"
          >
            {activeProject && (
              <>
                <div className="portfolio-floating-media">
                  <ProjectPreviewMedia project={activeProject} reducedMotion={reducedMotion} />
                </div>
                <div className="portfolio-floating-caption">
                  <span>{activeProject.title}</span>
                  <small>CLICK TO EXPAND</small>
                </div>
              </>
            )}
          </div>
        </>,
        document.body,
      )}

    </div>
  );
}
