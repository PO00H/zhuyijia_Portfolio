import { useState } from 'react';

import { getPublicProjects } from '../../data/projects';
import { Reveal } from '../motion/Reveal';
import { ProjectCard } from './ProjectCard';
import { SectionHeading } from './SectionHeading';

export function ToolsSystems() {
  const all = getPublicProjects();
  const projects = ['newface', 'synthwave-os']
    .map((slug) => all.find((project) => project.slug === slug))
    .filter((project) => project !== undefined);
  const [activePreview, setActivePreview] = useState<string | null>(null);

  return (
    <section className="archive-section archive-tools" id="tools" aria-labelledby="archive-tools-title">
      <SectionHeading number="05" label="TOOLS & INTERACTIVE SYSTEMS" eyebrow="工具与交互系统" title="把复杂流程整理成清楚、可运行的界面。" id="archive-tools-title" />
      <Reveal className="archive-card-grid archive-card-grid--two" itemSelector=":scope > article" stagger={0.15}>
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} activePreview={activePreview} onActivate={setActivePreview} />
        ))}
      </Reveal>
    </section>
  );
}
