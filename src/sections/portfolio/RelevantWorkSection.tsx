import { getPortfolioProjectById } from '@/data/portfolioProjects';
import { InteractiveProjectIndex } from './InteractiveProjectIndex';
import { SectionHeading } from './SectionHeading';

const textureLabels = ['BC', 'MT', 'N', 'R'];

export function RelevantWorkSection() {
  const projects = [getPortfolioProjectById('design-001'), getPortfolioProjectById('design-004')];

  return (
    <section id="relevant-work" className="portfolio-section portfolio-relevant-section">
      <SectionHeading
        index="05"
        eyebrow="RELEVANT WORK / 辅助能力"
        title="视觉与管线能力"
        description="辅助能力改为快速证据索引，不再使用与核心游戏相同尺寸的大卡片。"
      />

      <InteractiveProjectIndex
        projects={projects}
        renderExpandedProject={(project) => project.id === 'design-004' ? (
          <div className="portfolio-expanded-layout portfolio-tajima-layout">
            <div className="portfolio-tajima-stage">
              <iframe
                src={project.externalEmbedUrl}
                title="Tajima Cutter Sketchfab model"
                loading="lazy"
                allow="autoplay; fullscreen; xr-spatial-tracking"
                allowFullScreen
              />

              <div className="portfolio-tajima-textures" aria-label="Tajima Cutter PBR 贴图">
                {project.assetPaths.map((path, index) => (
                  <figure key={path}>
                    <img src={path} alt={`Tajima Cutter ${textureLabels[index]} texture`} />
                    <figcaption>{textureLabels[index]}</figcaption>
                  </figure>
                ))}
              </div>
            </div>

            <div className="portfolio-expanded-copy">
              <p className="section-label">INTERACTIVE MODEL / {project.year}</p>
              <h3>{project.title}</h3>
              <p>{project.summary}</p>
              <div className="portfolio-expanded-tags">
                {project.tags.map((tag) => <span key={tag}>{tag}</span>)}
              </div>
            </div>
          </div>
        ) : (
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
              <p className="section-label">UE ENVIRONMENT / {project.year}</p>
              <h3>{project.title}</h3>
              <p>{project.summary}</p>
              <div className="portfolio-expanded-tags">
                {project.tags.map((tag) => <span key={tag}>{tag}</span>)}
              </div>
            </div>
          </div>
        )}
      />
    </section>
  );
}
