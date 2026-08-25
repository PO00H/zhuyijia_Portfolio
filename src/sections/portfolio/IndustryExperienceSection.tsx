import type { ReactNode } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { useLightbox } from '@/components/code/LightboxContext';
import { getPortfolioProjectById, type PortfolioProject } from '@/data/portfolioProjects';
import { InteractiveProjectIndex } from './InteractiveProjectIndex';
import { SectionHeading } from './SectionHeading';

function MeshySubProject({
  project,
  index,
  children,
}: {
  project: PortfolioProject;
  index: string;
  children?: ReactNode;
}) {
  const { open } = useLightbox();

  return (
    <article className="portfolio-experience-sub">
      <h4>
        <span className="portfolio-experience-sub-index">{index}</span>
        {project.title}
      </h4>
      <ul className="portfolio-tags">
        {project.tags.map((tag) => (
          <li key={tag}>{tag}</li>
        ))}
      </ul>

      <p className="portfolio-experience-sub-summary">{project.summary}</p>
      {children}

      {project.detailUrl && (
        <button
          className="portfolio-project-action"
          type="button"
          onClick={() =>
            open({ id: project.id, title: project.title, url: project.detailUrl as string })
          }
        >
          查看项目
          <ArrowUpRight aria-hidden="true" />
        </button>
      )}

      {project.externalLink && (
        <a
          className="portfolio-project-action"
          href={project.externalLink}
          target="_blank"
          rel="noopener noreferrer"
        >
          官方介绍
          <ArrowUpRight aria-hidden="true" />
        </a>
      )}
    </article>
  );
}

export function IndustryExperienceSection() {
  const meshy = getPortfolioProjectById('experience-meshy');
  const meshcraft = getPortfolioProjectById('experience-meshcraft');
  const cutout = getPortfolioProjectById('experience-cutout');
  const muse = getPortfolioProjectById('experience-muse');
  const wildfire = getPortfolioProjectById('experience-wildfire');

  const renderExpanded = (project: PortfolioProject) => {
    if (project.id === 'experience-meshy') {
      return (
        <div className="portfolio-expanded-copy portfolio-experience-expanded">
          <div className="portfolio-experience-sub-list">
            <MeshySubProject project={meshcraft} index="01" />

            <MeshySubProject project={cutout} index="02">
              <ul className="portfolio-experience-metrics">
                <li>
                  <strong>86.6 万</strong>
                  <span>封面图交付</span>
                </li>
                <li>
                  <strong>99.998%</strong>
                  <span>成功率</span>
                </li>
                <li>
                  <strong>3×</strong>
                  <span>吞吐提速</span>
                </li>
              </ul>
            </MeshySubProject>

            <MeshySubProject project={muse} index="03" />
          </div>
        </div>
      );
    }

    return (
      <div className="portfolio-expanded-copy portfolio-experience-expanded">
        <p>{project.summary}</p>
        <div className="portfolio-expanded-tags">
          {project.tags.map((tag) => (
            <span key={tag}>{tag}</span>
          ))}
        </div>
      </div>
    );
  };

  return (
    <section id="experience" className="portfolio-section portfolio-experience-section">
      <SectionHeading
        index="04"
        eyebrow="EXPERIENCE / 生产实践"
        title="实习项目经历"
        description="行业经历不是履历复述，而是生产问题、承担职责、使用技术与结果之间的证据链。点击词条展开详情。"
        variant="record"
        meta={{ label: '02 CASES', value: '2024—2026' }}
      />

      <InteractiveProjectIndex
        projects={[meshy, wildfire]}
        renderExpandedProject={renderExpanded}
        hoverPreview={false}
      />
    </section>
  );
}
