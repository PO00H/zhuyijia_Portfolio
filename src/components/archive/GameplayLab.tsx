import { useState } from 'react';

import { getFeaturedProjects } from '../../data/projects';
import { Reveal } from '../motion/Reveal';
import { ProjectCard } from './ProjectCard';
import { SectionHeading } from './SectionHeading';

export function GameplayLab() {
  const projects = getFeaturedProjects('gameplay-lab').slice(0, 3);
  const [activePreview, setActivePreview] = useState<string | null>(null);

  return (
    <section className="archive-section archive-lab" id="gameplay-lab" aria-labelledby="archive-lab-title">
      <SectionHeading number="03" label="GAMEPLAY LAB" eyebrow="玩法实验室" title="把一个交互问题，快速做成可操作的原型。" id="archive-lab-title" />
      <Reveal className="archive-card-grid archive-card-grid--three" itemSelector=":scope > article" stagger={0.15}>
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} activePreview={activePreview} onActivate={setActivePreview} />
        ))}
      </Reveal>
    </section>
  );
}
