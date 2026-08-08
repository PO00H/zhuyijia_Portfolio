import { useEffect, useRef, useState } from 'react';
import { useGSAP } from '@gsap/react';
import { Link, useParams } from 'react-router-dom';

import { sitePaths } from '../app/routes';
import { getProjectHref, getProjectPreview } from '../data/projectMedia';
import { getPublicProjects, type PortfolioProject } from '../data/projects';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { gsap } from '../lib/gsap';

function ProjectLink({ project, children, className }: { project: PortfolioProject; children: React.ReactNode; className?: string }) {
  const href = getProjectHref(project);
  return project.iframeUrl ? <a className={className} href={href}>{children}</a> : <Link className={className} to={href}>{children}</Link>;
}

export function ProjectPage() {
  const { slug } = useParams();
  const projects = getPublicProjects();
  const projectIndex = projects.findIndex((candidate) => candidate.slug === slug);
  const project = projectIndex >= 0 ? projects[projectIndex] : undefined;
  const [openVideoSlug, setOpenVideoSlug] = useState<string | null>(null);
  const [openModelSlug, setOpenModelSlug] = useState<string | null>(null);
  const rootRef = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const originalGameUrl = project?.primaryCategory === 'game' && project.featuredSections.includes('selected-games') ? project.iframeUrl : undefined;

  useEffect(() => {
    if (originalGameUrl) window.location.replace(originalGameUrl);
  }, [originalGameUrl]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  useGSAP(() => {
    if (reduced || !project) return;
    gsap.from('.archive-project__cover', { opacity: 0, scale: 0.95, duration: 1.2, ease: 'power3.out' });
    gsap.from('.archive-project__content > *', { opacity: 0, y: 40, duration: 0.8, stagger: 0.15, delay: 0.4, ease: 'power3.out' });
  }, { scope: rootRef, dependencies: [project?.slug, reduced], revertOnUpdate: true });

  if (!project) {
    return <div className="archive-project-missing"><span>[404 / PROJECT]</span><h1>项目不存在</h1><Link to={sitePaths.works}>返回全部作品 ↗</Link></div>;
  }

  if (originalGameUrl) {
    return (
      <div className="archive-project-redirect" role="status">
        <span>[ORIGINAL WEB PRESENTATION]</span><h1>正在打开原项目网页</h1><p>两个游戏保留原有完整网页与交互，不在作品集外壳里重构。</p><a href={originalGameUrl}>直接打开项目 ↗</a>
      </div>
    );
  }

  const preview = getProjectPreview(project);
  const previous = projects[(projectIndex - 1 + projects.length) % projects.length];
  const next = projects[(projectIndex + 1) % projects.length];
  const title = project.titleZh ?? project.title;
  const videoOpen = openVideoSlug === project.slug;
  const modelOpen = openModelSlug === project.slug;

  return (
    <article ref={rootRef} className="archive-project">
      <header className="archive-project__hero">
        <div className="archive-project__ledger"><span>{project.year} / 个人作品</span><span>{project.displayCategory}</span><span>PROJECT ARCHIVE</span></div>
        <p>[{project.primaryCategory.replace('-', ' ').toUpperCase()}]</p>
        <h1>{title}{project.titleZh ? <small>{project.title}</small> : null}</h1>
        <div className="archive-project__lead"><span>{project.status === 'complete' ? '已完成' : '进行中'}</span><p>{project.summary}</p></div>
      </header>

      {preview ? <figure className="archive-project__cover"><img src={preview} alt={`${title}项目主视觉`} /></figure> : null}

      <div className="archive-project__content">
        <dl className="archive-project__facts" aria-label="项目概览">
          <div><span>01</span><dt>个人职责</dt><dd>{project.roles.join(' / ')}</dd></div>
          <div><span>02</span><dt>能力方向</dt><dd>{project.disciplines.join(' / ')}</dd></div>
          <div><span>03</span><dt>工具与技术</dt><dd>{project.tools.join(' / ')}</dd></div>
        </dl>

        <section className="archive-project__overview">
          <span>[项目概览 / OVERVIEW]</span><div><h2>{title}</h2><p>{project.summary}</p>{project.contribution ? <p>{project.contribution}</p> : null}</div>
        </section>

        {project.previewVideo ? (
          <section className="archive-project__media" aria-labelledby="archive-media-title">
            <header><span>[01 / MEDIA]</span><h2 id="archive-media-title">项目画面</h2></header>
            <div>
              {videoOpen ? (
                <><button type="button" onClick={() => setOpenVideoSlug(null)}>关闭视频</button><video src={project.previewVideo} controls autoPlay playsInline preload="metadata" /></>
              ) : (
                <button type="button" className="archive-project__media-trigger" onClick={() => setOpenVideoSlug(project.slug)} data-cursor="play">
                  {preview ? <img src={preview} alt={`${title}视频封面`} /> : null}<span>播放项目视频</span>
                </button>
              )}
            </div>
          </section>
        ) : null}

        {project.modelUrl ? (
          <section className="archive-project__media" aria-labelledby="archive-model-title">
            <header><span>[02 / 3D MODEL]</span><h2 id="archive-model-title">交互模型</h2></header>
            <div>
              {modelOpen ? (
                <><button type="button" onClick={() => setOpenModelSlug(null)}>关闭模型</button><iframe src={project.modelUrl} title={`${title}交互模型`} loading="lazy" allow="autoplay; fullscreen; xr-spatial-tracking" sandbox="allow-scripts allow-same-origin allow-forms allow-popups" allowFullScreen /></>
              ) : (
                <button type="button" className="archive-project__model-trigger" onClick={() => setOpenModelSlug(project.slug)} data-cursor="view"><b>3D</b><span>加载交互模型</span></button>
              )}
            </div>
          </section>
        ) : null}

        {project.textureMaps?.length ? (
          <section className="archive-project__textures">
            <header><span>[03 / MATERIALS]</span><h2>PBR 纹理通道</h2></header>
            <div>{project.textureMaps.map((texture) => <figure key={texture.name}><img src={texture.src} alt={`${title}${texture.name}纹理`} loading="lazy" /><figcaption>{texture.name}</figcaption></figure>)}</div>
          </section>
        ) : null}

        {project.awards?.length ? (
          <section className="archive-project__awards">
            <header><span>[04 / RESULT]</span><h2>项目结果</h2></header>
            <ol>{project.awards.map((award, index) => <li key={`${award.title}-${index}`}><span>{String(index + 1).padStart(2, '0')}</span><strong>{award.title}</strong></li>)}</ol>
          </section>
        ) : null}

        {project.iframeUrl ? (
          <section className="archive-project__presentation"><span>[INTERACTIVE PRESENTATION]</span><div><h2>查看原有完整展示与交互。</h2><a href={project.iframeUrl}>打开独立网页 ↗</a></div></section>
        ) : null}

        <nav className="archive-project__pagination" aria-label="项目翻页">
          <ProjectLink project={previous} className="is-previous"><span>上一个</span><strong>{previous.titleZh ?? previous.title}</strong></ProjectLink>
          <Link className="archive-project__back" to={sitePaths.works}>全部作品</Link>
          <ProjectLink project={next} className="is-next"><span>下一个</span><strong>{next.titleZh ?? next.title}</strong></ProjectLink>
        </nav>
      </div>
    </article>
  );
}
