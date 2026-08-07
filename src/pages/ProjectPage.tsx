import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

import { getProjectPath, sitePaths } from '../app/routes';
import { getPublicProjects, type PortfolioProject } from '../data/projects';

const archivePosters: Record<string, string> = {
  stonecity: '/posters/stonecity.jpg',
  'ik-retargeting': '/posters/ik-retargeting.jpg',
  'iterative-shrink': '/posters/iterative-shrink.jpg',
  'follow-pointer': '/posters/follow-pointer.jpg',
};

function getProjectHref(project: PortfolioProject): string {
  return project.iframeUrl ?? getProjectPath(project.slug);
}

export function ProjectPage() {
  const { slug } = useParams();
  const projects = getPublicProjects();
  const projectIndex = projects.findIndex((candidate) => candidate.slug === slug);
  const project = projectIndex >= 0 ? projects[projectIndex] : undefined;
  const [openVideoSlug, setOpenVideoSlug] = useState<string | null>(null);
  const [openModelSlug, setOpenModelSlug] = useState<string | null>(null);
  const originalGameUrl = project?.primaryCategory === 'game'
    && project.featuredSections.includes('selected-games')
    ? project.iframeUrl
    : undefined;

  const neighboringProjects = projectIndex < 0
    ? { previous: undefined, next: undefined }
    : {
        previous: projects[(projectIndex - 1 + projects.length) % projects.length],
        next: projects[(projectIndex + 1) % projects.length],
      };

  useEffect(() => {
    if (originalGameUrl) window.location.replace(originalGameUrl);
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
        <p>原项目网页 / ORIGINAL PRESENTATION</p>
        <h1>正在打开原项目网页</h1>
        <span>如果页面没有自动跳转，请使用下方入口。</span>
        <a href={originalGameUrl}>直接打开项目 ↗</a>
      </div>
    );
  }

  const videoOpen = openVideoSlug === project.slug;
  const modelOpen = openModelSlug === project.slug;
  const ownershipLabel = project.ownership === 'personal' ? '个人作品' : '团队作品';
  const preview = project.cover ?? archivePosters[project.slug];
  const hasInteractivePresentation = Boolean(project.iframeUrl);

  return (
    <article className="project-case">
      <header className="project-case__hero">
        <div className="project-case__ledger">
          <span>{project.year} / {ownershipLabel}</span>
          <span>{project.displayCategory}</span>
          <span>PROJECT ARCHIVE</span>
        </div>
        <p>{project.primaryCategory.replace('-', ' ').toUpperCase()}</p>
        <h1>
          {project.titleZh ?? project.title}
          {project.titleZh ? <small>{project.title}</small> : null}
        </h1>
        <div className="project-case__summary">
          <span>{project.status === 'complete' ? '已完成' : '进行中'}</span>
          {project.summary ? <p>{project.summary}</p> : null}
        </div>
      </header>

      <section className="project-case__facts" aria-label="项目概览">
        <div><span>01</span><dt>个人职责</dt><dd>{project.roles.join(' / ')}</dd></div>
        <div><span>02</span><dt>能力方向</dt><dd>{project.disciplines.join(' / ')}</dd></div>
        <div><span>03</span><dt>工具与技术</dt><dd>{project.tools.join(' / ')}</dd></div>
      </section>

      {project.previewVideo ? (
        <section className="project-case__media" aria-labelledby="project-media-title">
          <div className="project-case__section-label"><span>01 / MEDIA</span><h2 id="project-media-title">项目画面</h2></div>
          <div className="project-case__media-frame">
            {videoOpen ? (
              <>
                <button type="button" onClick={() => setOpenVideoSlug(null)}>关闭视频</button>
                <video src={project.previewVideo} controls autoPlay playsInline preload="metadata" />
              </>
            ) : (
              <button type="button" className="project-case__media-trigger" onClick={() => setOpenVideoSlug(project.slug)}>
                {preview ? <img src={preview} alt={`${project.titleZh ?? project.title}静态预览`} /> : null}
                <span>播放视频</span>
              </button>
            )}
          </div>
        </section>
      ) : preview ? (
        <section className="project-case__media" aria-labelledby="project-media-title">
          <div className="project-case__section-label"><span>01 / MEDIA</span><h2 id="project-media-title">项目画面</h2></div>
          <div className="project-case__media-frame"><img src={preview} alt={`${project.titleZh ?? project.title}项目画面`} loading="eager" /></div>
        </section>
      ) : null}

      {project.modelUrl ? (
        <section className="project-model" aria-labelledby="project-model-title">
          <div className="project-case__section-label"><span>02 / 3D MODEL</span><h2 id="project-model-title">交互模型</h2></div>
          <div className="project-model__frame">
            {modelOpen ? (
              <>
                <button type="button" onClick={() => setOpenModelSlug(null)}>关闭模型</button>
                <iframe
                  src={project.modelUrl}
                  title={`${project.titleZh ?? project.title}交互模型`}
                  loading="lazy"
                  allow="autoplay; fullscreen; xr-spatial-tracking"
                  sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
                  allowFullScreen
                />
              </>
            ) : (
              <button type="button" className="project-model__trigger" onClick={() => setOpenModelSlug(project.slug)}>
                <b>3D</b><span>加载交互模型</span>
              </button>
            )}
          </div>
        </section>
      ) : null}

      {project.textureMaps?.length ? (
        <section className="project-textures" aria-labelledby="project-textures-title">
          <div className="project-case__section-label"><span>03 / MATERIALS</span><h2 id="project-textures-title">PBR 纹理通道</h2></div>
          <div className="project-textures__grid">
            {project.textureMaps.map((texture) => (
              <figure key={texture.name}>
                <img src={texture.src} alt={`${project.titleZh ?? project.title}${texture.name}纹理`} loading="lazy" />
                <figcaption>{texture.name}</figcaption>
              </figure>
            ))}
          </div>
        </section>
      ) : null}

      {project.awards?.length ? (
        <section className="project-awards" aria-labelledby="project-awards-title">
          <div className="project-case__section-label"><span>04 / RESULT</span><h2 id="project-awards-title">项目结果</h2></div>
          <ol>
            {project.awards.map((award, index) => (
              <li key={`${award.title}-${index}`}><span>{String(index + 1).padStart(2, '0')}</span><strong>{award.title}</strong></li>
            ))}
          </ol>
        </section>
      ) : null}

      {hasInteractivePresentation ? (
        <section className="project-presentation" aria-labelledby="project-presentation-title">
          <span>INTERACTIVE PRESENTATION</span>
          <div><h2 id="project-presentation-title">查看原有完整展示与交互。</h2><a href={project.iframeUrl}>打开独立网页 ↗</a></div>
        </section>
      ) : null}

      <nav className="project-case__pagination" aria-label="项目翻页">
        {neighboringProjects.previous ? (
          <Link to={getProjectHref(neighboringProjects.previous)} reloadDocument={Boolean(neighboringProjects.previous.iframeUrl)}><span>上一个</span><strong>{neighboringProjects.previous.titleZh ?? neighboringProjects.previous.title}</strong></Link>
        ) : null}
        <Link className="project-case__back" to={sitePaths.works}>返回全部作品</Link>
        {neighboringProjects.next ? (
          <Link to={getProjectHref(neighboringProjects.next)} reloadDocument={Boolean(neighboringProjects.next.iframeUrl)}><span>下一个</span><strong>{neighboringProjects.next.titleZh ?? neighboringProjects.next.title}</strong></Link>
        ) : null}
      </nav>
    </article>
  );
}
