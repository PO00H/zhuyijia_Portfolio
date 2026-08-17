import { useCallback, useEffect, useRef, useState } from 'react';
import {
  navigationItems,
  observedSections,
} from '../../sections/portfolio/navigation-sections';
import './scroll-rail.css';

interface SectionMark {
  id: string;
  number: string;
  label: string;
  position: number;
}

const SECTION_LABELS: Record<string, string> = {
  top: '顶部',
  ...Object.fromEntries(navigationItems.map((item) => [item.section, item.label])),
};

function readScrollState() {
  const doc = document.documentElement;
  const maxScroll = Math.max(1, doc.scrollHeight - window.innerHeight);
  return {
    maxScroll,
    progress: Math.min(1, Math.max(0, window.scrollY / maxScroll)),
    viewportRatio: Math.min(1, window.innerHeight / Math.max(1, doc.scrollHeight)),
  };
}

/**
 * Horizontal scroll rail docked under the top navigation: replaces the
 * native vertical scrollbar. Shows reading progress as a draggable thumb,
 * marks every home section in sync with the nav's current-section state,
 * and seeks on click / drag. Pages without home sections (archive) get a
 * plain progress rail.
 */
export function ScrollRail() {
  const railRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [viewportRatio, setViewportRatio] = useState(0);
  const [marks, setMarks] = useState<SectionMark[]>([]);
  const [activeId, setActiveId] = useState('top');
  const [hoverMark, setHoverMark] = useState<SectionMark | null>(null);

  const measure = useCallback(() => {
    const { maxScroll, progress: nextProgress, viewportRatio: nextRatio } = readScrollState();
    setProgress(nextProgress);
    setViewportRatio(nextRatio);
    setMarks(
      observedSections
        .map(({ id, number }): SectionMark | null => {
          if (id === 'top') {
            return { id, number, label: SECTION_LABELS[id], position: 0 };
          }
          const el = document.getElementById(id);
          if (!el) return null;
          return {
            id,
            number,
            label: SECTION_LABELS[id] ?? id,
            position: Math.min(1, Math.max(0, el.offsetTop / maxScroll)),
          };
        })
        .filter((mark): mark is SectionMark => mark !== null),
    );
  }, []);

  /* Follow native scroll (Lenis keeps window as the scroll root). */
  useEffect(() => {
    let frame = 0;
    const handleScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        setProgress(readScrollState().progress);
      });
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  useEffect(() => {
    /* Defer the first measure so section elements are committed to the DOM. */
    const frame = requestAnimationFrame(measure);
    window.addEventListener('resize', measure);
    window.addEventListener('load', measure);
    /* Media and fonts settle after first paint; re-measure once more. */
    const timer = window.setTimeout(measure, 1200);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('resize', measure);
      window.removeEventListener('load', measure);
      window.clearTimeout(timer);
    };
  }, [measure]);

  /* Mirror the nav's current section (it owns the IntersectionObserver). */
  useEffect(() => {
    const shell = document.querySelector('.portfolio-shell');
    if (!shell) return;
    const readActive = () => setActiveId(shell.getAttribute('data-active-section') ?? 'top');
    const frame = requestAnimationFrame(readActive);
    const observer = new MutationObserver(readActive);
    observer.observe(shell, { attributes: true, attributeFilter: ['data-active-section'] });
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, []);

  const seek = useCallback((clientX: number) => {
    const rail = railRef.current;
    if (!rail) return;
    const rect = rail.getBoundingClientRect();
    const ratio = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
    const { maxScroll } = readScrollState();
    window.scrollTo({ top: ratio * maxScroll, behavior: 'instant' as ScrollBehavior });
  }, []);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const { maxScroll } = readScrollState();
    const pageStep = window.innerHeight * 0.8;
    const targets: Record<string, number> = {
      ArrowRight: Math.min(maxScroll, window.scrollY + pageStep),
      ArrowDown: Math.min(maxScroll, window.scrollY + pageStep),
      ArrowLeft: Math.max(0, window.scrollY - pageStep),
      ArrowUp: Math.max(0, window.scrollY - pageStep),
      Home: 0,
      End: maxScroll,
    };
    const target = targets[event.key];
    if (target === undefined) return;
    event.preventDefault();
    window.scrollTo({ top: target, behavior: 'instant' as ScrollBehavior });
  };

  return (
    <div
      ref={railRef}
      className="scroll-rail"
      role="slider"
      tabIndex={0}
      aria-label="页面滚动位置"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(progress * 100)}
      aria-valuetext={`页面阅读进度 ${Math.round(progress * 100)}%`}
      onPointerDown={(event) => {
        event.currentTarget.setPointerCapture(event.pointerId);
        seek(event.clientX);
      }}
      onPointerMove={(event) => {
        if (event.buttons & 1) seek(event.clientX);
      }}
      onPointerLeave={() => setHoverMark(null)}
      onKeyDown={handleKeyDown}
    >
      <div className="scroll-rail-track" aria-hidden="true" />
      <div
        className="scroll-rail-progress"
        aria-hidden="true"
        style={{ width: `${progress * (100 - viewportRatio * 100)}%` }}
      />
      {marks.map((mark) => (
        <span
          key={mark.id}
          className={`scroll-rail-mark${mark.id === activeId ? ' is-active' : ''}`}
          style={{ left: `${mark.position * 100}%` }}
          onPointerEnter={() => setHoverMark(mark)}
          onPointerLeave={() => setHoverMark(null)}
          aria-hidden="true"
        />
      ))}
      <div
        className="scroll-rail-thumb"
        aria-hidden="true"
        style={{
          width: `${viewportRatio * 100}%`,
          left: `${progress * 100}%`,
          transform: `translateX(-${progress * 100}%)`,
        }}
      />
      {hoverMark && (
        <div
          className="scroll-rail-tooltip"
          style={{ left: `${hoverMark.position * 100}%` }}
          aria-hidden="true"
        >
          {hoverMark.number} {hoverMark.label}
        </div>
      )}
    </div>
  );
}
