import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

import { getProjectPath } from '../app/routes';
import { getPublicProjects, type PortfolioProject, type PrimaryCategory } from '../data/projects';
import { filterWorks, worksFilters, type WorksFilterId } from './worksFilter';

const categoryLabels: Record<PrimaryCategory, string> = {
  game: '游戏',
  'technical-art': '技术美术',
  tools: '工具与系统',
  web: '网页实验',
};

const archivePosters: Record<string, string> = {
  stonecity: '/posters/stonecity.jpg',
  'ik-retargeting': '/posters/ik-retargeting.jpg',
  'iterative-shrink': '/posters/iterative-shrink.jpg',
  'follow-pointer': '/posters/follow-pointer.jpg',
};

function getProjectHref(project: PortfolioProject): string {
  return project.iframeUrl ?? getProjectPath(project.slug);
}

function getProjectPreview(project: PortfolioProject): string | undefined {
  return project.cover ?? archivePosters[project.slug];
}

export function WorksPage() {
  const projects = getPublicProjects();
  const reduceMotion = useReducedMotion();
  const [activeFilter, setActiveFilter] = useState<WorksFilterId>('all');
  const [activeSlug, setActiveSlug] = useState<string | null>(null);
  const visibleProjects = useMemo(
    () => filterWorks(activeFilter, projects),
    [activeFilter, projects],
  );
  const activeProject = visibleProjects.find((project) => project.slug === activeSlug)
    ?? visibleProjects[0];
  const activePreview = activeProject ? getProjectPreview(activeProject) : undefined;

  const changeFilter = (filter: WorksFilterId) => {
    setActiveFilter(filter);
    setActiveSlug(null);
  };

  return (
    <div className="works-archive">
      <header className="works-archive__hero">
        <div className="works-archive__ledger">
          <span>ARCHIVE / {projects.length.toString().padStart(2, '0')}</span>
          <span>2025—2026</span>
          <span>个人作品</span>
        </div>
        <p>全部作品</p>
        <h1>作品<br />档案</h1>
        <div className="works-archive__intro">
          <span>按完成度与岗位相关性整理</span>
          <p>游戏、技术美术、工具与交互系统，以及经过筛选的网页实验。</p>
        </div>
      </header>

      <div className="works-filters" aria-label="作品分类">
        {worksFilters.map((filter) => {
          const count = filterWorks(filter.id, projects).length;
          return (
            <button
              key={filter.id}
              type="button"
              aria-pressed={activeFilter === filter.id}
              onClick={() => changeFilter(filter.id)}
            >
              <span>{filter.label}</span>
              <small>{count.toString().padStart(2, '0')}</small>
            </button>
          );
        })}
      </div>

      <div className="works-archive__body">
        <ol className="works-list" aria-live="polite" aria-label={`${worksFilters.find((filter) => filter.id === activeFilter)?.label}作品`}>
          <AnimatePresence initial={false} mode="popLayout">
            {visibleProjects.map((project, index) => {
              const preview = getProjectPreview(project);
              const title = project.titleZh ?? project.title;
              return (
                <motion.li
                  key={project.id}
                  layout
                  initial={reduceMotion ? false : { opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduceMotion ? undefined : { opacity: 0, y: -8 }}
                  transition={{ duration: reduceMotion ? 0 : 0.28 }}
                >
                  <Link
                    className={activeProject?.slug === project.slug ? 'works-row is-active' : 'works-row'}
                    to={getProjectHref(project)}
                    reloadDocument={Boolean(project.iframeUrl)}
                    onMouseEnter={() => setActiveSlug(project.slug)}
                    onFocus={() => setActiveSlug(project.slug)}
                    data-cursor="view"
                  >
                    <span className="works-row__number">{String(index + 1).padStart(2, '0')}</span>
                    {preview ? (
                      <span className="works-row__mobile-preview" aria-hidden="true">
                        <img src={preview} alt="" loading="lazy" />
                      </span>
                    ) : null}
                    <span className="works-row__title">{title}</span>
                    <span className="works-row__category">{categoryLabels[project.primaryCategory]}</span>
                    <span className="works-row__role">{project.roles.slice(0, 2).join(' / ')}</span>
                    <span className="works-row__year">{project.year}</span>
                    <span className="works-row__arrow" aria-hidden="true">↗</span>
                  </Link>
                </motion.li>
              );
            })}
          </AnimatePresence>
        </ol>

        <aside className="works-preview" aria-live="polite">
          <AnimatePresence mode="wait">
            <motion.div
              className="works-preview__frame"
              key={activeProject?.id ?? 'empty'}
              initial={reduceMotion ? false : { opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={reduceMotion ? undefined : { opacity: 0, scale: 0.98 }}
              transition={{ duration: reduceMotion ? 0 : 0.32 }}
            >
              {activePreview && activeProject ? (
                <img src={activePreview} alt={`${activeProject.titleZh ?? activeProject.title}项目预览`} />
              ) : (
                <span className="works-preview__placeholder">{activeProject?.primaryCategory.toUpperCase() ?? 'ARCHIVE'}</span>
              )}
              <span className="works-preview__view">VIEW</span>
            </motion.div>
          </AnimatePresence>
          {activeProject ? (
            <div className="works-preview__meta">
              <span>{activeProject.year}</span>
              <span>{categoryLabels[activeProject.primaryCategory]}</span>
              <span>{activeProject.tools.slice(0, 3).join(' / ')}</span>
            </div>
          ) : null}
        </aside>
      </div>
    </div>
  );
}
