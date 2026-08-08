import { useState } from 'react';

import { getPublicProjects } from '../../data/projects';
import { Reveal } from '../motion/Reveal';
import { ProjectCard } from './ProjectCard';
import { SectionHeading } from './SectionHeading';

export function WorldsVisual() {
  const all = getPublicProjects();
  const projects = ['stonecity', 'peak', 'tajima-cutter']
    .map((slug) => all.find((project) => project.slug === slug))
    .filter((project) => project !== undefined);
  const [activePreview, setActivePreview] = useState<string | null>(null);

  return (
    <section className="archive-paper-section" id="worlds" aria-labelledby="archive-worlds-title">
      <div className="archive-section">
        <SectionHeading number="04" label="WORLDS & VISUAL SYSTEMS" eyebrow="世界与视觉系统" title="用场景、材质与实时效果组织另一套叙事。" id="archive-worlds-title" dark />
        <Reveal className="archive-world-grid" itemSelector=":scope > article" stagger={0.15}>
          {projects.map((project, index) => (
            <ProjectCard key={project.id} project={project} activePreview={activePreview} onActivate={setActivePreview} prominent={index === 0} />
          ))}
        </Reveal>
      </div>
    </section>
  );
}
