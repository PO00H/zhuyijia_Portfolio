import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';

import { sitePaths } from '../app/routes';
import { getPublicProjects } from '../data/projects';

export function ProjectPage() {
  const { slug } = useParams();
  const project = getPublicProjects().find((candidate) => candidate.slug === slug);
  const originalGameUrl = project?.primaryCategory === 'game'
    && project.featuredSections.includes('selected-games')
    ? project.iframeUrl
    : undefined;

  useEffect(() => {
    if (originalGameUrl) {
      window.location.replace(originalGameUrl);
    }
  }, [originalGameUrl]);

  if (!project) {
    return (
      <div className="page-stack">
        <header className="page-intro">
          <p className="eyebrow">404 / 项目</p>
          <h1>项目不存在</h1>
          <Link className="text-link" to={sitePaths.works}>返回全部作品</Link>
        </header>
      </div>
    );
  }

  if (originalGameUrl) {
    return (
      <div className="project-redirect" role="status">
        <p className="eyebrow">原项目网页 / ORIGINAL PRESENTATION</p>
        <h1>正在打开原项目网页</h1>
        <p>如果页面没有自动跳转，请使用下方入口。</p>
        <a className="text-link" href={originalGameUrl}>直接打开项目</a>
      </div>
    );
  }

  const ownershipLabel = project.ownership === 'personal' ? '个人作品' : '团队作品';

  return (
    <article className="page-stack project-page">
      <header className="page-intro project-page__intro">
        <p className="eyebrow">{project.year} / {ownershipLabel}</p>
        <h1>
          {project.titleZh ?? project.title}
          {project.titleZh && <small>{project.title}</small>}
        </h1>
        {project.summary && <p>{project.summary}</p>}
      </header>

      <dl className="project-facts">
        <div>
          <dt>个人职责</dt>
          <dd>{project.roles.join(' / ')}</dd>
        </div>
        <div>
          <dt>能力方向</dt>
          <dd>{project.disciplines.join(' / ')}</dd>
        </div>
        <div>
          <dt>工具与技术</dt>
          <dd>{project.tools.join(' / ')}</dd>
        </div>
      </dl>

      {project.iframeUrl && (
        <section className="project-webframe" aria-labelledby="project-webframe-title">
          <div className="project-webframe__bar">
            <div>
              <p className="eyebrow">原项目网页 / ORIGINAL WEB PRESENTATION</p>
              <h2 id="project-webframe-title">保留原有展示与交互</h2>
            </div>
            <a
              className="text-link"
              href={project.iframeUrl}
              target="_blank"
              rel="noreferrer"
            >
              打开独立展示 ↗
            </a>
          </div>
          <iframe
            className="project-webframe__iframe"
            src={project.iframeUrl}
            title={`${project.title}互动展示`}
            loading="eager"
            allow="autoplay; fullscreen"
            allowFullScreen
          />
        </section>
      )}

      <Link className="text-link" to={sitePaths.works}>返回全部作品</Link>
    </article>
  );
}
