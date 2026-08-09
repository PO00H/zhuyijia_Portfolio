import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';

import { getProjectHref, getProjectPreview } from '../../data/projectMedia';
import type { PortfolioProject } from '../../data/projects';
import { gsap } from '../../lib/gsap';
import { getProjectPreviewPosition } from './projectPreviewPosition';

interface ProjectRowProps {
  number: string;
  project?: PortfolioProject;
  selected?: boolean;
  placeholder?: boolean;
}

const roleNames: Record<string, string> = {
  'Game Design': '游戏设计',
  Programming: '程序开发',
  'Pixel Art': '像素美术',
  Prototyping: '原型设计',
};

export function ProjectRow({ number, project, selected = false, placeholder = false }: ProjectRowProps) {
  const previewRef = useRef<HTMLDivElement>(null);
  const pointerPositionRef = useRef({ x: 0, y: 0 });
  const moveXRef = useRef<ReturnType<typeof gsap.quickTo> | null>(null);
  const moveYRef = useRef<ReturnType<typeof gsap.quickTo> | null>(null);
  const [previewMounted, setPreviewMounted] = useState(false);
  const [previewVisible, setPreviewVisible] = useState(false);
  const preview = project ? getProjectPreview(project) : undefined;

  useEffect(() => {
    const element = previewRef.current;
    if (!previewMounted || !element) return;

    gsap.set(element, pointerPositionRef.current);
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

  const showPreview = (event: ReactPointerEvent<HTMLLIElement>) => {
    if (!preview) return;
    pointerPositionRef.current = getProjectPreviewPosition(
      event.clientX,
      event.clientY,
      window.innerWidth,
      window.innerHeight,
    );
    setPreviewMounted(true);
    setPreviewVisible(true);
  };
  const hidePreview = () => setPreviewVisible(false);
  const movePreview = (event: ReactPointerEvent<HTMLLIElement>) => {
    if (!previewVisible) return;
    const position = getProjectPreviewPosition(event.clientX, event.clientY, window.innerWidth, window.innerHeight);
    moveXRef.current?.(position.x);
    moveYRef.current?.(position.y);
  };

  if (placeholder || !project) {
    return (
      <li className="archive-project-row-wrap is-placeholder-wrap">
        <div className={`archive-project-row is-placeholder${selected ? ' is-selected' : ''}`} data-project-placeholder="true">
          <span className="archive-project-row__number">{number}</span>
          <span className="archive-project-row__title">
            <b>待公开作品</b>
            <small>{selected ? 'NEXT GAME / 开发中' : '[COMING SOON]'}</small>
          </span>
          <span className="archive-project-row__meta">下一项个人游戏项目</span>
        </div>
      </li>
    );
  }

  const href = getProjectHref(project);
  const displayTitle = selected ? project.title.split(' — ')[0] : (project.titleZh ?? project.title);
  const subtitle = selected ? project.titleZh : project.title;
  const roles = selected
    ? project.roles.map((role) => roleNames[role] ?? role).join(' / ')
    : project.roles.join(' / ');
  const content = (
    <>
      <span className="archive-project-row__number">{number}</span>
      <span className="archive-project-row__title"><b>{displayTitle}</b><small>{subtitle}</small></span>
      {selected ? (
        <span className="archive-project-row__meta">
          <small><i>年份</i><span>{project.year}</span></small>
          <small><i>类型</i><span>{project.displayCategory}</span></small>
          <small><i>职责</i><span>{roles}</span></small>
        </span>
      ) : (
        <span className="archive-project-row__meta"><small>{project.year} / {project.displayCategory}</small><small>{roles}</small></span>
      )}
      <span className="archive-project-row__action">{selected ? '进入项目 ↗' : '查看 ↗'}</span>
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
        <a className={`archive-project-row${selected ? ' is-selected' : ''}`} href={href} data-cursor="view" data-selected-game={selected ? project.slug : undefined}>{content}</a>
      ) : (
        <Link className={`archive-project-row${selected ? ' is-selected' : ''}`} to={href} data-cursor="view" data-selected-game={selected ? project.slug : undefined}>{content}</Link>
      )}
      {preview && previewMounted && typeof document !== 'undefined'
        ? createPortal(
            <div ref={previewRef} className="archive-project-row__preview" data-selected-preview={selected ? 'true' : undefined} aria-hidden="true">
              <img src={preview} alt="" loading="lazy" />
              <span><b>{project.titleZh ?? project.title}</b><small>{displayTitle}</small></span>
            </div>,
            document.body,
          )
        : null}
    </li>
  );
}
