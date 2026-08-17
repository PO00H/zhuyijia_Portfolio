import { Fragment, useMemo, useState } from 'react';
import { ArrowLeft, ArrowUpRight } from 'lucide-react';
import { useLightbox } from '@/components/code/LightboxContext';
import {
  projectEntries,
  type PortfolioProject,
  type PortfolioTrack,
} from '@/data/portfolioProjects';
import { PortfolioDitherBackground } from '@/sections/portfolio/PortfolioDitherBackground';
import './archive-page.css';

type ArchiveFilter = 'all' | 'visual-pipeline' | 'web-design' | 'ai-interface';

const archiveTracks: PortfolioTrack[] = ['visual-pipeline', 'web-design', 'ai-interface'];

const archiveProjects = projectEntries.filter((project) =>
  archiveTracks.includes(project.track),
);

const filters: { id: ArchiveFilter; label: string; shortLabel: string }[] = [
  { id: 'all', label: '全部作品', shortLabel: '全部' },
  { id: 'visual-pipeline', label: '三维 / 视觉', shortLabel: '三维' },
  { id: 'web-design', label: '网站应用', shortLabel: '网站' },
  { id: 'ai-interface', label: 'AI 界面', shortLabel: 'AI' },
];

const trackLabels: Record<PortfolioTrack, string> = {
  'game-development': '游戏开发',
  'unreal-systems': 'UE 技术实验',
  'industry-experience': '实习经历',
  'visual-pipeline': '三维 / 视觉',
  'web-design': '网站应用',
  'ai-interface': 'AI 界面',
};

function getProjectUrl(project: PortfolioProject) {
  return project.detailUrl ?? project.externalEmbedUrl ?? null;
}

function ArchiveVideo({ project }: { project: PortfolioProject }) {
  const [isReady, setIsReady] = useState(false);
  const reducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  return (
    <div className="archive-video-stage">
      {project.poster && <img src={project.poster} alt="" />}
      <video
        className={isReady || !project.poster ? 'is-ready' : ''}
        src={project.preview ?? undefined}
        autoPlay={!reducedMotion}
        muted
        loop
        playsInline
        preload="metadata"
        onCanPlay={() => setIsReady(true)}
      />
    </div>
  );
}

function ArchiveMedia({ project }: { project: PortfolioProject }) {
  if (project.externalEmbedUrl) {
    return (
      <iframe
        key={project.externalEmbedUrl}
        src={project.externalEmbedUrl}
        title={`${project.title} 3D preview`}
        allow="autoplay; fullscreen; xr-spatial-tracking"
        allowFullScreen
      />
    );
  }

  if (project.preview) {
    return <ArchiveVideo key={project.preview} project={project} />;
  }

  if (project.cover) {
    return <img key={project.cover} src={project.cover} alt={`${project.title} 项目封面`} />;
  }

  const imageAssets = project.assetPaths.filter((path) =>
    /\.(avif|jpe?g|png|webp)$/i.test(path),
  );

  if (imageAssets.length > 0) {
    return (
      <div className="archive-texture-grid">
        {imageAssets.slice(0, 4).map((path) => (
          <img key={path} src={path} alt="" />
        ))}
      </div>
    );
  }

  return <div className="archive-media-empty">暂无预览</div>;
}

function ProjectPreview({ project, mobile = false }: { project: PortfolioProject; mobile?: boolean }) {
  const { open } = useLightbox();
  const projectUrl = getProjectUrl(project);

  return (
    <article className={`archive-preview ${mobile ? 'archive-preview-mobile' : ''}`}>
      <div className="archive-preview-media">
        <ArchiveMedia project={project} />
      </div>

      <div className="archive-preview-meta">
        <span>{trackLabels[project.track]}</span>
        <span>{project.year ?? '—'}</span>
      </div>

      <h2>{project.title}</h2>
      {project.summary && <p>{project.summary}</p>}

      <div className="archive-preview-footer">
        <ul aria-label="项目技术标签">
          {project.tags.map((tag) => (
            <li key={tag}>{tag}</li>
          ))}
        </ul>

        {projectUrl && (
          <button
            type="button"
            onClick={() => open({ id: project.id, title: project.title, url: projectUrl })}
          >
            查看项目
            <ArrowUpRight aria-hidden="true" />
          </button>
        )}
      </div>
    </article>
  );
}

export function ArchivePage() {
  const [activeFilter, setActiveFilter] = useState<ArchiveFilter>('all');
  const filteredProjects = useMemo(
    () =>
      activeFilter === 'all'
        ? archiveProjects
        : archiveProjects.filter((project) => project.track === activeFilter),
    [activeFilter],
  );
  const [selectedId, setSelectedId] = useState(archiveProjects[0]?.id ?? '');
  const selectedProject =
    filteredProjects.find((project) => project.id === selectedId) ?? filteredProjects[0];

  const selectFilter = (filter: ArchiveFilter) => {
    setActiveFilter(filter);
    const firstProject =
      filter === 'all'
        ? archiveProjects[0]
        : archiveProjects.find((project) => project.track === filter);
    if (firstProject) setSelectedId(firstProject.id);
  };

  return (
    <div className="archive-shell">
      <PortfolioDitherBackground />
      <header className="archive-navigation">
        <a className="archive-brand" href="/">
          <span>ZHU YIJIA</span>
          <small>作品档案</small>
        </a>
        <a className="archive-back" href="/">
          <ArrowLeft aria-hidden="true" />
          返回首页
        </a>
      </header>

      <main id="archive-main-content" className="archive-main site-main" tabIndex={-1}>
        <section className="archive-intro" aria-labelledby="archive-title">
          <div className="archive-intro-meta">
            <span>完整索引 / 2025—2026</span>
            <span>{archiveProjects.length.toString().padStart(2, '0')} 个项目</span>
          </div>
          <h1 id="archive-title">作品档案</h1>
          <p>
            完整作品索引。首页只保留与 UE / C++ 求职最相关的项目，这里集中收录视觉、网页与 AI 界面实验。
          </p>
        </section>

        <nav className="archive-filters" aria-label="作品分类筛选">
          {filters.map((filter) => {
            const count =
              filter.id === 'all'
                ? archiveProjects.length
                : archiveProjects.filter((project) => project.track === filter.id).length;

            return (
              <button
                key={filter.id}
                type="button"
                className={activeFilter === filter.id ? 'is-active' : ''}
                aria-pressed={activeFilter === filter.id}
                onClick={() => selectFilter(filter.id)}
              >
                <span className="archive-filter-label">{filter.label}</span>
                <span className="archive-filter-short">{filter.shortLabel}</span>
                <small>{count.toString().padStart(2, '0')}</small>
              </button>
            );
          })}
        </nav>

        <section className="archive-browser" aria-label="作品档案浏览器">
          <div className="archive-list">
            <div className="archive-list-labels" aria-hidden="true">
              <span>编号 / 项目</span>
              <span>类型</span>
              <span>年份</span>
            </div>

            <div className="archive-list-rows">
              {filteredProjects.map((project, index) => {
                const isSelected = selectedProject?.id === project.id;

                return (
                  <Fragment key={project.id}>
                    <button
                      type="button"
                      className={`archive-project-row ${isSelected ? 'is-selected' : ''}`}
                      aria-pressed={isSelected}
                      onPointerEnter={(event) => {
                        if (event.pointerType === 'mouse') setSelectedId(project.id);
                      }}
                      onFocus={() => setSelectedId(project.id)}
                      onClick={() => setSelectedId(project.id)}
                    >
                      <span className="archive-project-name">
                        <small>{(index + 1).toString().padStart(2, '0')}</small>
                        <strong>{project.title}</strong>
                      </span>
                      <span className="archive-project-track">{trackLabels[project.track]}</span>
                      <span className="archive-project-year">{project.year ?? '—'}</span>
                      <ArrowUpRight aria-hidden="true" />
                    </button>

                    {isSelected && (
                      <div className="archive-mobile-preview">
                        <ProjectPreview project={project} mobile />
                      </div>
                    )}
                  </Fragment>
                );
              })}
            </div>
          </div>

          <aside className="archive-desktop-preview" aria-live="polite">
            {selectedProject && (
              <ProjectPreview key={selectedProject.id} project={selectedProject} />
            )}
          </aside>
        </section>
      </main>

      <footer className="archive-footer">
        <span>ZHU YIJIA / UE &amp; C++ GAME DEVELOPER</span>
        <a href="/">RETURN HOME</a>
      </footer>
    </div>
  );
}
