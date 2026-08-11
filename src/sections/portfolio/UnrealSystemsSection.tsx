import { getPortfolioProjectById } from '@/data/portfolioProjects';
import { InteractiveProjectIndex } from './InteractiveProjectIndex';
import { SectionHeading } from './SectionHeading';

export function UnrealSystemsSection() {
  const projects = ['game-003', 'game-004', 'game-005'].map(getPortfolioProjectById);

  return (
    <section id="systems" className="portfolio-section portfolio-systems-section">
      <SectionHeading
        index="03"
        eyebrow="Unreal Systems Lab / UE 技术实验"
        title="SYSTEMS LAB"
        description="三个练习作为紧凑的 Unreal 技术证据索引。悬停快速预览，点击在当前词条下展开内容。"
      />

      <InteractiveProjectIndex
        projects={projects}
        renderExpandedProject={(project) => (
          <div className="portfolio-expanded-layout">
            {project.preview && (
              <video
                src={project.preview}
                poster={project.poster ?? undefined}
                controls
                playsInline
                preload="metadata"
              />
            )}
            <div className="portfolio-expanded-copy">
              <p className="section-label">UNREAL SYSTEM STUDY / {project.year}</p>
              <h3>{project.title}</h3>
              <p>{project.summary}</p>
              <div className="portfolio-expanded-tags">
                {project.tags.map((tag) => <span key={tag}>{tag}</span>)}
              </div>
            </div>
          </div>
        )}
      />

      <div className="portfolio-systems-capabilities">
        <span>Animation / IK</span>
        <span>Blueprint Interaction</span>
        <span>Gameplay Prototyping</span>
        <span>Unreal Workflow</span>
      </div>
    </section>
  );
}
