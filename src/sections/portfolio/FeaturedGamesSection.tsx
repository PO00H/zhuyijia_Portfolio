import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowUpRight } from 'lucide-react';
import { useLightbox } from '@/components/code/LightboxContext';
import { getPortfolioProjectById, type PortfolioProject } from '@/data/portfolioProjects';
import { RuntimeSignalViewport, SignalPixels } from './RuntimeSignalViewport';
import type { RuntimeDitherTransitionHandle } from './RuntimeDitherTransition';
import { SectionHeading } from './SectionHeading';

gsap.registerPlugin(useGSAP, ScrollTrigger);

function ProjectTags({ tags }: { tags: string[] }) {
  return (
    <ul className="portfolio-tags" aria-label="技术标签">
      {tags.map((tag) => (
        <li key={tag}>{tag}</li>
      ))}
    </ul>
  );
}

function ProjectAction({ project }: { project: PortfolioProject }) {
  const { open } = useLightbox();

  if (!project.detailUrl) {
    return <span className="portfolio-project-status">PROJECT SLOT RESERVED</span>;
  }

  return (
    <button
      className="portfolio-project-action"
      type="button"
      onClick={() =>
        open({ id: project.id, title: project.title, url: project.detailUrl as string })
      }
    >
      查看项目
      <ArrowUpRight aria-hidden="true" />
    </button>
  );
}

function FeaturedProject({ project, index }: { project: PortfolioProject; index: number }) {
  const isReserved = project.status === 'reserved';

  return (
    <article
      className={`portfolio-featured-card ${isReserved ? 'is-reserved' : ''}`}
      data-runtime-project-index={index}
    >
      <div className="portfolio-featured-media">
        {project.cover ? (
          <img src={project.cover} alt="" />
        ) : (
          <div className="portfolio-reserved-field" aria-label="真实 UE 项目素材预留区域">
            <span>UE / C++</span>
            <small>REAL PROJECT CONTENT WILL REPLACE THIS FIELD</small>
          </div>
        )}
        <SignalPixels count={16} className="portfolio-card-pixel-layer" />
      </div>

      <div className="portfolio-featured-copy">
        <div className="portfolio-project-meta">
          <span>{project.status === 'reserved' ? 'IN DEVELOPMENT' : project.year}</span>
          <span>{project.featuredOrder?.toString().padStart(2, '0')}</span>
        </div>
        <h3>{project.title}</h3>
        {project.summary && <p>{project.summary}</p>}
        <ProjectTags tags={project.tags} />
        <ProjectAction project={project} />
      </div>
    </article>
  );
}

export function FeaturedGamesSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const activeTimelineRef = useRef<gsap.core.Timeline | null>(null);
  const ditherTransitionRef = useRef<RuntimeDitherTransitionHandle>(null);
  const projects = [
    getPortfolioProjectById('ue-project-upcoming'),
    getPortfolioProjectById('game-001'),
    getPortfolioProjectById('game-002'),
  ];

  useGSAP(
    () => {
      const root = sectionRef.current;

      if (!root) {
        return;
      }

      const media = gsap.matchMedia();

      media.add(
        '(min-width: 1100px) and (prefers-reduced-motion: no-preference)',
        () => {
          try {
            const entries = Array.from(
              root.querySelectorAll<HTMLElement>('[data-runtime-project-index]'),
            );
            const layers = Array.from(
              root.querySelectorAll<HTMLElement>('[data-runtime-media-index]'),
            );
            const diagnosticPanels = Array.from(
              root.querySelectorAll<HTMLElement>('[data-runtime-diagnostic-index]'),
            );
            const railSegments = Array.from(
              root.querySelectorAll<HTMLElement>('[data-runtime-rail-index]'),
            );
            if (
              entries.length !== projects.length ||
              layers.length !== projects.length ||
              diagnosticPanels.length !== projects.length
            ) {
              root.removeAttribute('data-runtime-signal');
              return;
            }

            root.dataset.runtimeSignal = 'ready';
            let activeIndex = -1;
            let keyboardFocusLockUntil = 0;

            const updateActiveState = (nextIndex: number) => {
              root.dataset.runtimeActive = String(nextIndex + 1);

              entries.forEach((entry, index) => {
                if (index === nextIndex) {
                  entry.setAttribute('aria-current', 'true');
                } else {
                  entry.removeAttribute('aria-current');
                }
              });

              railSegments.forEach((segment, index) => {
                segment.toggleAttribute('data-active', index === nextIndex);
              });
            };

            const showImmediately = (nextIndex: number) => {
              activeTimelineRef.current?.kill();
              activeTimelineRef.current = null;
              ditherTransitionRef.current?.cancel();
              activeIndex = nextIndex;
              updateActiveState(nextIndex);
              gsap.set(layers, {
                autoAlpha: (index) => (index === nextIndex ? 1 : 0),
                scale: (index) => (index === nextIndex ? 1 : 0.992),
              });
              gsap.set(diagnosticPanels, {
                autoAlpha: (index) => (index === nextIndex ? 1 : 0),
                y: 0,
              });
            };

            const activate = (nextIndex: number, animate = true) => {
              if (animate && performance.now() < keyboardFocusLockUntil) {
                return;
              }

              if (nextIndex === activeIndex) {
                return;
              }

              if (!animate || activeIndex < 0) {
                showImmediately(nextIndex);
                return;
              }

              activeTimelineRef.current?.kill();
              const previousIndex = activeIndex;
              const ditherStarted = ditherTransitionRef.current?.play(
                previousIndex,
                nextIndex,
              ) ?? false;
              activeIndex = nextIndex;
              updateActiveState(nextIndex);

              const incomingLayer = layers[nextIndex];
              const incomingDiagnostics = diagnosticPanels[nextIndex];
              const outgoingLayers = layers.filter((_, index) => index !== nextIndex);
              const outgoingDiagnostics = diagnosticPanels.filter(
                (_, index) => index !== nextIndex,
              );

              const timeline = gsap.timeline({
                defaults: { overwrite: 'auto' },
                onComplete: () => {
                  gsap.set(layers, { willChange: 'auto' });
                  activeTimelineRef.current = null;
                },
              });

              activeTimelineRef.current = timeline;
              timeline
                .addLabel('handoff', 0)
                .addLabel('diagnostics', 0.16)
                .addLabel('settled', 0.56)
                .set(layers, { willChange: 'transform, opacity' }, 'handoff')
                .to(
                  outgoingDiagnostics,
                  { autoAlpha: 0, y: -4, duration: 0.12, ease: 'power1.out' },
                  'handoff',
                )
                .fromTo(
                  incomingDiagnostics,
                  { autoAlpha: 0, y: 4 },
                  {
                    autoAlpha: 1,
                    y: 0,
                    duration: 0.18,
                    ease: 'power2.out',
                    immediateRender: false,
                  },
                  'diagnostics',
                );

              if (ditherStarted) {
                timeline
                  .set(outgoingLayers, { autoAlpha: 0, scale: 1 }, 'handoff')
                  .set(incomingLayer, { autoAlpha: 1, scale: 1 }, 'handoff');
              } else {
                timeline
                  .set(incomingLayer, { autoAlpha: 0, scale: 0.992 }, 'handoff')
                  .to(
                    incomingLayer,
                    {
                      autoAlpha: 1,
                      scale: 1,
                      duration: 0.4,
                      ease: 'power2.inOut',
                    },
                    'handoff',
                  )
                  .to(
                    outgoingLayers,
                    {
                      autoAlpha: 0,
                      scale: 0.992,
                      duration: 0.4,
                      ease: 'power2.inOut',
                    },
                    'handoff',
                  );
              }

              timeline.call(() => undefined, [], 'settled');
            };

            const activationLine = window.innerHeight * 0.58;
            const initialIndex = entries.reduce(
              (current, entry, index) =>
                entry.getBoundingClientRect().top <= activationLine ? index : current,
              0,
            );
            showImmediately(initialIndex);

            entries.forEach((entry, index) => {
              ScrollTrigger.create({
                trigger: entry,
                start: 'top 58%',
                end: 'bottom 58%',
                onEnter: () => activate(index),
                onEnterBack: () => activate(index),
              });
            });

            const focusHandlers = entries.map((entry, index) => {
              const handler = () => {
                keyboardFocusLockUntil = performance.now() + 450;
                activate(index, false);
              };
              entry.addEventListener('focusin', handler);
              return { entry, handler };
            });

            let refreshFrame: number | null = null;
            let refreshCancelled = false;

            void document.fonts.ready.then(() => {
              if (!refreshCancelled) {
                refreshFrame = window.requestAnimationFrame(() => ScrollTrigger.refresh());
              }
            });

            return () => {
              refreshCancelled = true;
              if (refreshFrame !== null) {
                window.cancelAnimationFrame(refreshFrame);
              }
              activeTimelineRef.current?.kill();
              activeTimelineRef.current = null;
              ditherTransitionRef.current?.cancel();
              focusHandlers.forEach(({ entry, handler }) =>
                entry.removeEventListener('focusin', handler),
              );
              entries.forEach((entry) => entry.removeAttribute('aria-current'));
              root.removeAttribute('data-runtime-signal');
              root.removeAttribute('data-runtime-active');
            };
          } catch {
            root.removeAttribute('data-runtime-signal');
            root.removeAttribute('data-runtime-active');
            return;
          }
        },
      );

      media.add(
        '(min-width: 721px) and (max-width: 1099px) and (prefers-reduced-motion: no-preference)',
        () => {
          const entries = Array.from(
            root.querySelectorAll<HTMLElement>('[data-runtime-project-index]'),
          );
          const tabletTimelines = new Set<gsap.core.Timeline>();

          entries.forEach((entry) => {
            const localPixels = Array.from(
              entry.querySelectorAll<HTMLElement>('.portfolio-card-pixel-layer [data-signal-pixel]'),
            );

            ScrollTrigger.create({
              trigger: entry,
              start: 'top 82%',
              once: true,
              onEnter: () => {
                const tabletTimeline = gsap
                  .timeline({
                    onComplete: () => tabletTimelines.delete(tabletTimeline),
                  })
                  .fromTo(
                    localPixels,
                    { autoAlpha: 0, scale: 0.45, x: 0, y: 0 },
                    {
                      autoAlpha: 0.72,
                      scale: 1,
                      x: (_, element) =>
                        Number((element as HTMLElement).dataset.signalX ?? 0) * 0.35,
                      y: (_, element) =>
                        Number((element as HTMLElement).dataset.signalY ?? 0) * 0.35,
                      duration: 0.14,
                      ease: 'power2.inOut',
                      stagger: { amount: 0.04, from: 'edges' },
                    },
                  )
                  .to(localPixels, {
                    autoAlpha: 0,
                    scale: 0.45,
                    x: 0,
                    y: 0,
                    duration: 0.16,
                    ease: 'power2.inOut',
                  });
                tabletTimelines.add(tabletTimeline);
              },
            });
          });

          return () => tabletTimelines.forEach((timeline) => timeline.kill());
        },
      );

      return () => {
        activeTimelineRef.current?.kill();
        activeTimelineRef.current = null;
        media.revert();
        root.removeAttribute('data-runtime-signal');
        root.removeAttribute('data-runtime-active');
      };
    },
    { scope: sectionRef },
  );

  return (
    <section
      id="game-work"
      className="portfolio-section portfolio-game-section"
      ref={sectionRef}
    >
      <div className="portfolio-game-inner">
        <SectionHeading
          index="02"
          eyebrow="GAME WORK / 核心项目"
          title="核心游戏开发"
          description="先展示能够证明编程、系统设计与完整游戏生产能力的项目。真实 UE / C++ 项目将在同一结构中直接替换预留内容。"
        />

        <div className="portfolio-runtime-layout">
          <RuntimeSignalViewport
            projects={projects}
            ditherTransitionRef={ditherTransitionRef}
          />

          <div className="portfolio-featured-grid">
            {projects.map((project, index) => (
              <FeaturedProject key={project.id} project={project} index={index} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
