import { Link } from 'react-router-dom';

import { getProjectHref, getProjectPreview } from '../../data/projectMedia';
import type { PortfolioProject } from '../../data/projects';
import { useReducedMotion } from '../../hooks/useReducedMotion';

interface ProjectCardProps {
  project: PortfolioProject;
  activePreview: string | null;
  onActivate: (slug: string | null) => void;
  prominent?: boolean;
}

export function ProjectCard({ project, activePreview, onActivate, prominent = false }: ProjectCardProps) {
  const preview = getProjectPreview(project);
  const active = activePreview === project.slug;
  const href = getProjectHref(project);
  const title = project.titleZh ?? project.title;
  const reduced = useReducedMotion();
  const link = project.iframeUrl ? <a href={href} data-cursor="view">查看项目 ↗</a> : <Link to={href} data-cursor="view">查看项目 ↗</Link>;

  return (
    <article className={prominent ? 'archive-card is-prominent' : 'archive-card'} data-archive-project={project.slug}>
      <div
        className="archive-card__media"
        onMouseEnter={() => !reduced && project.previewVideo && onActivate(project.slug)}
        onMouseLeave={() => active && onActivate(null)}
      >
        {active && project.previewVideo ? (
          <video src={project.previewVideo} autoPlay muted loop playsInline preload="metadata" />
        ) : preview ? (
          <img src={preview} alt={`${title}项目预览`} loading="lazy" />
        ) : (
          <span className="archive-card__empty">MEDIA / {project.slug.toUpperCase()}</span>
        )}
        {project.previewVideo ? (
          <button type="button" data-cursor="play" data-preview-src={project.previewVideo} onClick={() => onActivate(active ? null : project.slug)}>{active ? '暂停' : '播放'}</button>
        ) : null}
      </div>
      <div className="archive-card__meta"><span>{project.year}</span><span>{project.displayCategory}</span></div>
      <h3>{title}<small>{project.titleZh ? project.title : ''}</small></h3>
      <p>{project.summary}</p>
      <div className="archive-card__foot"><span>{project.tools.slice(0, 3).join(' / ')}</span>{link}</div>
    </article>
  );
}
