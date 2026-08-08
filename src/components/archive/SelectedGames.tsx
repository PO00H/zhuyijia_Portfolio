import { useRef } from 'react';
import { useGSAP } from '@gsap/react';

import { getFeaturedProjects } from '../../data/projects';
import { gsap } from '../../lib/gsap';
import '../../styles/selected-games.css';
import { ProjectRow } from './ProjectRow';

export function SelectedGames() {
  const games = getFeaturedProjects('selected-games');
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLElement>(null);
  const listRef = useRef<HTMLOListElement>(null);

  useGSAP(() => {
    gsap.from(headerRef.current, {
      opacity: 0,
      y: 30,
      duration: 0.8,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top 80%',
      },
    });

    const rows = listRef.current?.children;
    if (!rows?.length) return;
    gsap.from(rows, {
      opacity: 0,
      y: 40,
      duration: 0.8,
      stagger: 0.15,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: listRef.current,
        start: 'top 85%',
      },
    });
  }, { scope: sectionRef });

  return (
    <section ref={sectionRef} className="archive-section archive-selected" id="selected-games" aria-labelledby="archive-selected-title">
      <header ref={headerRef} className="archive-selected__header">
        <div className="archive-selected__index" aria-hidden="true">
          <small>[SELECTED GAMES]</small>
          <span>02</span>
        </div>
        <div className="archive-selected__heading">
          <p>个人游戏作品 / SOLO WORKS</p>
          <h2 id="archive-selected-title">精选游戏</h2>
        </div>
        <div className="archive-selected__intro">
          <b>{String(games.length).padStart(2, '0')} 个完整项目</b>
          <p>从机制原型、程序实现到像素美术均由个人独立完成。悬停查看画面，点击进入原项目网页。</p>
        </div>
      </header>

      <ol ref={listRef} className="archive-project-list">
        {games.map((project, index) => (
          <ProjectRow key={project.id} number={String(index + 1).padStart(2, '0')} project={project} selected />
        ))}
        <ProjectRow number={String(games.length + 1).padStart(2, '0')} placeholder selected />
      </ol>
    </section>
  );
}
