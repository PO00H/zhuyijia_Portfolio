import { useRef } from 'react';
import { useGSAP } from '@gsap/react';

import { getFeaturedProjects } from '../../data/projects';
import { gsap } from '../../lib/gsap';
import { ProjectRow } from './ProjectRow';
import { SectionHeading } from './SectionHeading';

export function SelectedGames() {
  const games = getFeaturedProjects('selected-games');
  const listRef = useRef<HTMLOListElement>(null);

  useGSAP(() => {
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
  }, { scope: listRef });

  return (
    <section className="archive-section archive-selected" id="selected-games" aria-labelledby="archive-selected-title">
      <SectionHeading number="02" label="SELECTED GAMES" eyebrow="精选游戏" title="从玩法命题出发，独立完成的游戏。" id="archive-selected-title" />
      <ol ref={listRef} className="archive-project-list">
        {games.map((project, index) => <ProjectRow key={project.id} number={`0${index + 1}`} project={project} selected />)}
        <ProjectRow number="03" placeholder />
      </ol>
    </section>
  );
}
