import { useMemo, useRef, useState } from 'react';
import { useGSAP } from '@gsap/react';

import { ProjectRow } from '../components/archive/ProjectRow';
import { getPublicProjects } from '../data/projects';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { gsap } from '../lib/gsap';
import { filterWorks, worksFilters, type WorksFilterId } from './worksFilter';

export function WorksPage() {
  const projects = getPublicProjects();
  const [filter, setFilter] = useState<WorksFilterId>('all');
  const listRef = useRef<HTMLOListElement>(null);
  const reduced = useReducedMotion();
  const filtered = useMemo(() => filterWorks(filter, projects), [filter, projects]);

  useGSAP(() => {
    if (reduced) return;
    const rows = listRef.current?.children;
    if (!rows?.length) return;
    gsap.fromTo(rows, { autoAlpha: 0, y: 18 }, {
      autoAlpha: 1,
      y: 0,
      duration: .55,
      stagger: .035,
      ease: 'power3.out',
      overwrite: 'auto',
    });
  }, { scope: listRef, dependencies: [filter, reduced] });

  return (
    <article className="archive-works archive-paper-page">
      <header className="archive-page-hero">
        <div className="archive-page-hero__ledger"><span>ARCHIVE / {projects.length}</span><span>2025—2026</span><span>个人作品</span></div>
        <p>[ALL WORKS]</p>
        <h1>全部<br />作品</h1>
        <div className="archive-page-hero__statement"><span>游戏设计为主线</span><p>按项目类型浏览游戏、技术美术、工具系统与网页实验。</p></div>
      </header>

      <div className="archive-filters" aria-label="作品分类">
        {worksFilters.map((item) => {
          const count = filterWorks(item.id, projects).length;
          return (
            <button key={item.id} type="button" aria-pressed={filter === item.id} onClick={() => setFilter(item.id)}>
              <span>{item.label}</span><small>{String(count).padStart(2, '0')}</small>
            </button>
          );
        })}
      </div>

      <ol ref={listRef} className="archive-project-list archive-works__list" aria-live="polite" aria-label={`${worksFilters.find((item) => item.id === filter)?.label ?? '全部'}作品`}>
        {filtered.map((project, index) => <ProjectRow key={project.id} number={String(index + 1).padStart(2, '0')} project={project} />)}
      </ol>
    </article>
  );
}
