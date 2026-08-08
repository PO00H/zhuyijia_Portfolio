import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react';
import { Link } from 'react-router-dom';

import { getProjectHref, getProjectPreview } from '../../data/projectMedia';
import type { PortfolioProject } from '../../data/projects';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { gsap } from '../../lib/gsap';

interface ProjectRowProps {
  number: string;
  project?: PortfolioProject;
  selected?: boolean;
  placeholder?: boolean;
}

export function ProjectRow({ number, project, selected = false, placeholder = false }: ProjectRowProps) {
  const previewRef = useRef<HTMLDivElement>(null);
  const moveXRef = useRef<ReturnType<typeof gsap.quickTo> | null>(null);
  const moveYRef = useRef<ReturnType<typeof gsap.quickTo> | null>(null);
  const [previewMounted, setPreviewMounted] = useState(false);
  const [previewVisible, setPreviewVisible] = useState(false);
  const reduced = useReducedMotion();
  const preview = project ? getProjectPreview(project) : undefined;

  useEffect(() => {
    const element = previewRef.current;
    if (!previewMounted || !element) return;

    moveXRef.current = gsap.quickTo(element, 'x', { duration: 0.4, ease: 'power3.out' });
    moveYRef.current = gsap.quickTo(element, 'y', { duration: 0.4, ease: 'power3.out' });
    const tween = previewVisible
      ? gsap.fromTo(element,
          { opacity: 0, scale: 0.95 },
          { opacity: 1, scale: 1, duration: 0.3, ease: 'back.out(1.2)', overwrite: 'auto' },
        )
      : gsap.to(element, {
          opacity: 0,
          scale: 0.95,
          duration: 0.2,
          ease: 'power2.in',
          overwrite: 'auto',
          onComplete: () => setPreviewMounted(false),
        });

    return () => {
      tween.kill();
      moveXRef.current = null;
      moveYRef.current = null;
      gsap.killTweensOf(element);
    };
  }, [previewMounted, previewVisible]);

  const showPreview = () => {
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (!preview || reduced || !finePointer) return;
    setPreviewMounted(true);
    setPreviewVisible(true);
  };
  const hidePreview = () => setPreviewVisible(false);
  const movePreview = (event: ReactPointerEvent<HTMLLIElement>) => {
    if (!previewVisible) return;
    moveXRef.current?.(event.clientX + 20);
    moveYRef.current?.(event.clientY - 60);
  };

  if (placeholder || !project) {
    return (
      <li className="archive-project-row is-placeholder" data-project-placeholder="true">
        <span className="archive-project-row__number">{number}</span>
        <span className="archive-project-row__title"><b>待公开作品</b><small>[COMING SOON]</small></span>
        <span className="archive-project-row__meta">下一项个人游戏项目</span>
      </li>
    );
  }

  const href = getProjectHref(project);
  const content = (
    <>
      <span className="archive-project-row__number">{number}</span>
      <span className="archive-project-row__title"><b>{project.titleZh ?? project.title}</b><small>{project.title}</small></span>
      <span className="archive-project-row__meta"><small>{project.year} / {project.displayCategory}</small><small>{project.roles.join(' / ')}</small></span>
      <span className="archive-project-row__action">查看 ↗</span>
      {preview ? <span className="archive-project-row__mobile"><img src={preview} alt="" loading="lazy" /></span> : null}
    </>
  );
  return (
    <li
      className="archive-project-row-wrap"
      onPointerEnter={showPreview}
      onPointerLeave={hidePreview}
      onPointerMove={movePreview}
    >
      {project.iframeUrl ? (
        <a className="archive-project-row" href={href} data-cursor="view" data-selected-game={selected ? project.slug : undefined}>{content}</a>
      ) : (
        <Link className="archive-project-row" to={href} data-cursor="view" data-selected-game={selected ? project.slug : undefined}>{content}</Link>
      )}
      {preview && previewMounted ? (
        <div ref={previewRef} className="archive-project-row__preview" aria-hidden="true">
          <img src={preview} alt="" loading="lazy" />
          <span>{project.titleZh ?? project.title}</span>
        </div>
      ) : null}
    </li>
  );
}
