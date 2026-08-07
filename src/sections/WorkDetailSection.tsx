import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { TextScrambleWithHover } from '@/components/ui/text-scramble';
import { CodeWorksGrid } from '@/components/code/CodeWorksGrid';
import { codeProjects } from '@/data/codeProjects';
import { useLightbox } from '@/components/code/LightboxContext';
import { legacyWorkDetails as workDetails, type LegacyProject as Project, type LegacyWorkDetail as WorkDetail } from '@/data/legacyProjectAdapters';

gsap.registerPlugin(ScrollTrigger);

type FilterKey = 'all' | 'design' | 'game' | 'code';

// ─── ProjectCard ────────────────────────────────────────────────────────────

function ProjectCard({
  project,
  onProjectClick,
}: {
  project: Project;
  onProjectClick?: (projectId: string) => void;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isInteracting, setIsInteracting] = useState(false);
  const [enlargedImage, setEnlargedImage] = useState<string | null>(null);
  const { open: openLightbox } = useLightbox();

  // 视频卡片：hover 播放、leave 暂停归零
  const handleMediaEnter = () => {
    setIsHovered(true);
    const v = videoRef.current;
    if (v) v.play().catch(() => {});
  };
  const handleMediaLeave = () => {
    setIsHovered(false);
    const v = videoRef.current;
    if (v) {
      v.pause();
      v.currentTime = 0.1;
    }
  };
  // 视频元素 metadata 加载后定位到 0.1s 作为"封面"
  const handleVideoMeta = () => {
    const v = videoRef.current;
    if (v && v.paused) v.currentTime = 0.1;
  };

  // 视频卡片点击：优先 bilibili 嵌入，fallback 用本地视频 URL 作为 iframe src（浏览器原生播放）
  const handleMediaClick = () => {
    if (project.bilibiliEmbedUrl) {
      openLightbox({ url: project.bilibiliEmbedUrl, title: project.title, id: project.id });
    } else if (project.videoUrl) {
      openLightbox({ url: project.videoUrl, title: project.title, id: project.id });
    }
  };

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    gsap.set(card, { y: 50, opacity: 0 });

    gsap.to(card, {
      y: 0,
      opacity: 1,
      duration: 0.6,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: card,
        start: 'top 85%',
        toggleActions: 'play none none reverse',
      },
    });

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => {
        if (trigger.vars.trigger === card) {
          trigger.kill();
        }
      });
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isInteracting) {
        setIsInteracting(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isInteracting]);

  // 媒体外框比例：默认 16/9，game 类项目可改 4/3 适配老分辨率游戏录屏
  const mediaAspect = project.mediaAspect === '4/3' ? 'aspect-[4/3]' : 'aspect-[16/9]';

  return (
    <div
      ref={cardRef}
      className={`group ${project.wide ? 'col-span-1 md:col-span-2' : 'col-span-1'}`}
      id={project.id}
    >
      <div className="flex flex-col gap-4 relative">
        {/* Project ID badge */}
        <div
          className="h-6 px-3 py-1 bg-[#FF3D00] text-white text-[10px] font-mono tracking-wider flex items-center w-fit cursor-pointer hover:bg-[#FF3D00]/80 transition-colors"
          onClick={() => onProjectClick && onProjectClick(project.id)}
        >
          <TextScrambleWithHover duration={0.5} speed={0.03} trigger={true}>
            {project.id.split('-').pop()?.toUpperCase() || project.id.toUpperCase()}
          </TextScrambleWithHover>
        </div>

        {/* Media container */}
        <div
          className={`w-full bg-[#1A1A1A]/5 border border-[#8A8A85]/20 relative overflow-hidden ${mediaAspect}
                      ${(project.videoUrl || project.bilibiliEmbedUrl) ? 'cursor-pointer' : ''}`}
          onMouseEnter={project.videoUrl ? handleMediaEnter : () => setIsHovered(true)}
          onMouseLeave={project.videoUrl ? handleMediaLeave : () => setIsHovered(false)}
          onClick={(project.videoUrl || project.bilibiliEmbedUrl) ? handleMediaClick : undefined}
          data-cursor={(project.videoUrl || project.bilibiliEmbedUrl) ? 'view' : undefined}
        >
          {project.bilibiliUrl ? (
            /* C++ 游戏卡：B站封面 + 外链跳转 */
            <a
              href={project.bilibiliUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="absolute inset-0 flex items-center justify-center group/bili"
            >
              {project.coverImage ? (
                <img
                  src={project.coverImage}
                  alt={project.title}
                  className="w-full h-full object-cover opacity-80 group-hover/bili:opacity-100 transition-opacity"
                />
              ) : (
                <div className="absolute inset-0 bg-[#1A1A1A]/10" />
              )}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/bili:opacity-100 transition-opacity duration-300">
                <span className="px-4 py-2 bg-[#FF3D00] text-white text-[11px] font-mono tracking-wider">
                  BILIBILI ↗
                </span>
              </div>
              <div className="absolute top-4 left-4 z-10">
                <span className="px-3 py-1 bg-[#FF3D00] text-white text-[10px] font-mono tracking-wider">
                  BILIBILI
                </span>
              </div>
            </a>
          ) : project.videoUrl ? (
            /* 视频卡：第一帧作为封面 + hover 播放预览 + 点击 lightbox */
            <>
              {/* 静态封面（如有） */}
              {project.coverImage && (
                <img
                  src={project.coverImage}
                  alt={project.title}
                  className="absolute inset-0 w-full h-full object-cover transition-opacity duration-300 group-hover:opacity-0"
                />
              )}
              {/* video 元素：paused 时显示第一帧，hover 时 play */}
              {/* src 末尾的 #t=0.1 是 iOS Safari 强制 decode 首帧的关键 hint —— 否则手机端没有 coverImage 时视频区域是灰色 */}
              <video
                ref={videoRef}
                src={`${project.videoUrl}#t=0.1`}
                muted
                loop
                playsInline
                preload="metadata"
                onLoadedMetadata={handleVideoMeta}
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300
                            ${project.coverImage ? 'opacity-0 group-hover:opacity-100' : ''}`}
              />
              {/* 播放图标 — 提示这是可播放的视频 */}
              <div
                className={`absolute top-4 left-4 z-10 px-3 py-1 bg-[#FF3D00] text-white text-[10px] font-mono tracking-wider
                            transition-opacity duration-300 ${isHovered ? 'opacity-0' : 'opacity-100'}`}
              >
                ▶ VIDEO
              </div>
            </>
          ) : project.modelUrl ? (
            <iframe
              title={project.title}
              src={project.modelUrl}
              className="w-full h-full border-0"
              allow="autoplay; fullscreen; xr-spatial-tracking"
              allowFullScreen
              scrolling="no"
              style={{ pointerEvents: isInteracting ? 'auto' : 'none' }}
            />
          ) : project.coverImage ? (
            /* 仅封面卡：静态封面 + 点击打开详情页 Lightbox */
            <>
              <img
                src={project.coverImage}
                alt={project.title}
                className="absolute inset-0 w-full h-full object-cover transition-opacity duration-300 group-hover:opacity-90"
              />
              <div className="absolute top-4 left-4 z-10 px-3 py-1 bg-[#FF3D00] text-white text-[10px] font-mono tracking-wider">
                ▶ VIEW
              </div>
            </>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="section-label text-[#8A8A85]/40">
                {project.id.split('-').pop()}
              </span>
            </div>
          )}

          {/* 3D model 点击交互遮罩 */}
          {!isInteracting && project.modelUrl && (
            <div
              className="absolute inset-0 bg-transparent z-20 cursor-pointer"
              onClick={() => setIsInteracting(true)}
            />
          )}

          {/* Hover 角标 */}
          <div className={`absolute top-0 right-0 w-12 h-12 border-t-2 border-r-2 border-[#FF3D00] z-30 transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`} />
          <div className={`absolute bottom-0 left-0 w-12 h-12 border-b-2 border-l-2 border-[#FF3D00] z-30 transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`} />

          {/* 3D Model badge */}
          {project.modelUrl && (
            <div className="absolute top-4 left-4 z-30 flex items-center gap-2">
              <span className="px-3 py-1 bg-[#FF3D00] text-white text-[10px] font-mono tracking-wider">
                <TextScrambleWithHover duration={0.5} speed={0.03} trigger={true}>
                  3D MODEL
                </TextScrambleWithHover>
              </span>
              <span className="px-2 py-1 bg-[#1A1A1A]/80 text-white/80 text-[9px] font-mono">
                鼠标点击交互，esc退出交互
              </span>
            </div>
          )}
        </div>

        {/* Project info + extras */}
        <div className="flex flex-col xl:flex-row xl:items-start xl:justify-between gap-6">
          <div className="flex-1">
            <div className="flex items-center gap-4 mb-2">
              <span className="work-index text-[#8A8A85]">
                <TextScrambleWithHover duration={0.5} speed={0.03} trigger={true}>
                  {project.category}
                </TextScrambleWithHover>
              </span>
              <span className="w-4 h-px bg-[#8A8A85]/30" />
              <span className="work-index text-[#8A8A85]/50">
                <TextScrambleWithHover duration={0.5} speed={0.03} trigger={true}>
                  {project.year}
                </TextScrambleWithHover>
              </span>
            </div>

            <h4 className="text-xl md:text-2xl font-medium text-[#1A1A1A] mb-3 group-hover:text-[#FF3D00] transition-colors">
              <TextScrambleWithHover duration={0.5} speed={0.03} trigger={true}>
                {project.title}
              </TextScrambleWithHover>
            </h4>

            {project.tools.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {project.tools.map((tool) => (
                  <span
                    key={tool}
                    className="text-[10px] font-mono px-3 py-1 border border-[#FF3D00] text-[#FF3D00] hover:border-[#8A8A85]/30 hover:text-[#8A8A85] transition-all cursor-default"
                  >
                    <TextScrambleWithHover duration={0.5} speed={0.03} trigger={true}>
                      {tool}
                    </TextScrambleWithHover>
                  </span>
                ))}
              </div>
            )}

            <p className="body-mono text-[#8A8A85] leading-relaxed">
              <TextScrambleWithHover duration={0.5} speed={0.03} trigger={true}>
                {project.description}
              </TextScrambleWithHover>
            </p>

            {/* Awards */}
            {project.awards && project.awards.length > 0 && (
              <div className="flex flex-col gap-3 mt-4">
                <p className="section-label text-[10px]">获奖：</p>
                <div className="flex flex-col gap-3">
                  {project.awards.map((award, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      {award.image && (
                        <img
                          src={award.image}
                          alt={award.title}
                          className="w-12 h-12 object-cover border border-[#8A8A85]/20 cursor-pointer hover:border-[#FF3D00] transition-colors"
                          onClick={() => setEnlargedImage(award.image)}
                        />
                      )}
                      <span className="body-mono text-[10px] text-[#8A8A85]">
                        <TextScrambleWithHover duration={0.5} speed={0.03} trigger={true}>
                          {award.title}
                        </TextScrambleWithHover>
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 图片放大弹窗 */}
            {enlargedImage && (
              <div
                className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center cursor-pointer"
                onClick={() => setEnlargedImage(null)}
              >
                <img
                  src={enlargedImage}
                  alt="Award"
                  className="max-w-[90vw] max-h-[90vh] object-contain"
                  onClick={(e) => e.stopPropagation()}
                />
                <button
                  className="absolute top-4 right-4 text-white text-2xl hover:text-[#FF3D00] transition-colors"
                  onClick={() => setEnlargedImage(null)}
                >
                  ×
                </button>
              </div>
            )}
          </div>

          {/* Texture maps / stylized image */}
          {(project.textureMaps || project.stylizedImage) && (
            <div className="xl:w-auto xl:flex-shrink-0">
              {project.textureMaps && (
                <>
                  <p className="section-label mb-3 text-[10px]">Texture Maps</p>
                  <div className="flex flex-wrap xl:flex-nowrap gap-2">
                    {project.textureMaps.map((map, mapIndex) => (
                      <div
                        key={mapIndex}
                        className="relative w-24 h-24 xl:w-20 xl:h-20 bg-[#1A1A1A]/5 border border-[#8A8A85]/20 overflow-hidden group/map flex-shrink-0"
                      >
                        <img
                          src={map.src}
                          alt={map.name}
                          className="w-full h-full object-cover opacity-80 group-hover/map:opacity-100 transition-opacity"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                          }}
                        />
                        <div className="absolute bottom-0 left-0 right-0 px-1 py-0.5 bg-[#1A1A1A]/80">
                          <span className="text-[8px] text-white/90 font-mono">{map.name}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {project.stylizedImage && (
                <div className={project.textureMaps ? 'mt-6' : ''}>
                  <p className="section-label mb-3 text-[10px]">{project.stylizedImage.name}</p>
                  <div
                    className="relative w-40 h-40 xl:w-48 xl:h-48 bg-[#1A1A1A]/5 border border-[#8A8A85]/20 overflow-hidden cursor-pointer hover:border-[#FF3D00] transition-colors group/stylized"
                    onClick={() => setEnlargedImage(project.stylizedImage?.src || null)}
                  >
                    <img
                      src={project.stylizedImage.src}
                      alt={project.stylizedImage.name}
                      className="w-full h-full object-cover opacity-80 group-hover/stylized:opacity-100 transition-opacity"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── WorkCategorySection ─────────────────────────────────────────────────────

function WorkCategorySection({
  work,
  onProjectClick,
}: {
  work: WorkDetail;
  onProjectClick?: (projectId: string) => void;
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    const header = headerRef.current;
    if (!section || !header) return;

    const indexEl = header.querySelector('.work-index-large');
    const titleEl = header.querySelector('.work-title-large');
    const subtitleEl = header.querySelector('.work-subtitle');

    gsap.set([indexEl, titleEl, subtitleEl], { y: 60, opacity: 0 });

    ScrollTrigger.create({
      trigger: section,
      start: 'top 70%',
      end: 'bottom 30%',
      onEnter: () => setIsInView(true),
      onLeave: () => setIsInView(false),
      onEnterBack: () => setIsInView(true),
      onLeaveBack: () => setIsInView(false),
    });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top 70%',
        toggleActions: 'play none none reverse',
      },
    });

    tl.to(indexEl, { y: 0, opacity: 1, duration: 0.5, ease: 'power2.out' })
      .to(titleEl, { y: 0, opacity: 1, duration: 0.5, ease: 'power3.out' }, '-=0.3')
      .to(subtitleEl, { y: 0, opacity: 1, duration: 0.4, ease: 'power2.out' }, '-=0.2');

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id={work.id}
      className="section-full relative flex flex-col justify-center py-24 px-6 md:px-12 lg:px-24"
      style={{ zIndex: 10 }}
    >
      <div className="max-w-[1600px] mx-auto w-full">
      {/* Section Header */}
      <div ref={headerRef} className="mb-12 md:mb-16">
        <div className="flex items-baseline gap-4 md:gap-6 mb-4">
          <span className="work-index-large work-index text-2xl md:text-3xl text-[#FF3D00] flex-shrink-0">
            <TextScrambleWithHover duration={0.5} speed={0.03} trigger={isInView}>
              {work.index}
            </TextScrambleWithHover>
          </span>
          <h2 className="hidden md:block work-title-large display-giant text-4xl md:text-6xl lg:text-7xl">
            <TextScrambleWithHover duration={1.0} speed={0.03} trigger={isInView}>
              {work.title}
            </TextScrambleWithHover>
          </h2>
          <h2 className="md:hidden work-title-large display-giant text-3xl sm:text-4xl leading-tight">
            {work.title.split(' ').map((word, i) => (
              <span key={i} className="block">
                <TextScrambleWithHover duration={0.5} speed={0.03} trigger={isInView}>
                  {word}
                </TextScrambleWithHover>
              </span>
            ))}
          </h2>
        </div>
        <p className="work-subtitle body-mono text-[#8A8A85]/70">
          <TextScrambleWithHover duration={0.5} speed={0.03} trigger={isInView}>
            {work.subtitle}
          </TextScrambleWithHover>
        </p>
      </div>

      {/* Projects grid — Code 区使用新组件，其他用 ProjectCard */}
      {work.id === 'work-code' ? (
        <CodeWorksGrid />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-12">
          {work.projects.map((project) => (
            <ProjectCard key={project.id} project={project} onProjectClick={onProjectClick} />
          ))}
        </div>
      )}

      {/* Footer row */}
      <div className="mt-12 pt-8 border-t border-[#8A8A85]/20 flex justify-between items-center">
        <span className="section-label">
          <TextScrambleWithHover duration={0.5} speed={0.03} trigger={isInView}>
            {(work.id === 'work-code' ? codeProjects.length : work.projects.length) + ' Projects'}
          </TextScrambleWithHover>
        </span>
      </div>
      </div>
    </section>
  );
}

// ─── Filter Bar ──────────────────────────────────────────────────────────────

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'design', label: 'Design' },
  { key: 'game', label: 'Game' },
  { key: 'code', label: 'Code' },
];

function FilterBar({
  active,
  onChange,
}: {
  active: FilterKey;
  onChange: (key: FilterKey) => void;
}) {
  // 项目数量：从 workDetails 派生，Code 区使用 codeProjects
  const counts: Record<FilterKey, number> = {
    design: workDetails.find((w) => w.id === 'work-design')?.projects.length ?? 0,
    game: workDetails.find((w) => w.id === 'work-game')?.projects.length ?? 0,
    code: codeProjects.length,
    all: 0,
  };
  counts.all = counts.design + counts.game + counts.code;

  return (
    <div className="px-4 sm:px-6 md:px-12 lg:px-24 py-6 md:py-8 border-b border-[#8A8A85]/20">
      <div className="max-w-[1600px] mx-auto flex items-center gap-4 sm:gap-6 flex-wrap">
      {FILTERS.map(({ key, label }) => (
        <button
          key={key}
          onClick={() => onChange(key)}
          className={`relative body-mono text-xs tracking-widest uppercase transition-colors pb-1 ${
            active === key ? 'text-[#FF3D00]' : 'text-[#8A8A85] hover:text-[#1A1A1A]'
          }`}
        >
          {label}
          <span className="ml-1.5 text-[10px] opacity-60">({counts[key]})</span>
          {active === key && (
            <span className="absolute left-0 bottom-0 w-full h-[2px] bg-[#FF3D00]" />
          )}
        </button>
      ))}
      </div>
    </div>
  );
}

// ─── WorkDetailSection (root export) ────────────────────────────────────────

export default function WorkDetailSection() {
  const [activeFilter, setActiveFilter] = useState<FilterKey>('all');

  const handleProjectClick = (projectId: string) => {
    const element = document.getElementById(projectId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const isVisible = (work: WorkDetail): boolean => {
    if (activeFilter === 'all') return true;
    return work.id === `work-${activeFilter}`;
  };

  return (
    <>
      <FilterBar active={activeFilter} onChange={setActiveFilter} />
      {workDetails.map((work) => (
        <div key={work.id} className={isVisible(work) ? '' : 'hidden'}>
          <WorkCategorySection work={work} onProjectClick={handleProjectClick} />
        </div>
      ))}
    </>
  );
}
