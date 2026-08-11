import { getPortfolioProjectById } from '@/data/portfolioProjects';
import { SectionHeading } from './SectionHeading';

export function IndustryExperienceSection() {
  const meshy = getPortfolioProjectById('experience-meshy');
  const wildfire = getPortfolioProjectById('experience-wildfire');

  return (
    <section id="experience" className="portfolio-section portfolio-experience-section">
      <SectionHeading
        index="04"
        eyebrow="Industry Experience / 实习与生产实践"
        title="INDUSTRY EXPERIENCE"
        description="行业经历不是履历复述，而是生产问题、承担职责、使用技术与结果之间的证据链。"
      />

      <div className="portfolio-experience-layout">
        <article className="portfolio-experience-primary">
          <div className="portfolio-experience-title-row">
            <div>
              <p className="section-label">26.04 — 26.08 · PRIMARY CASE</p>
              <h3>{meshy.title}</h3>
              <p className="portfolio-experience-role">Technical Art Intern / Tools & Pipeline</p>
            </div>
            <strong>30%</strong>
          </div>

          <dl className="portfolio-evidence-grid">
            <div>
              <dt>问题</dt>
              <dd>三维产品生产中存在重复操作，以及材质与资产处理效率问题。</dd>
            </div>
            <div>
              <dt>职责 / 系统</dt>
              <dd>研发三维产品部门工具箱，参与生产流程建设。</dd>
            </div>
            <div>
              <dt>技术</dt>
              <dd>材质与资产自动处理、API 接入、Blender PBR 与 UV 顶点组合插件。</dd>
            </div>
            <div>
              <dt>结果</dt>
              <dd>现有履历记录产研协同效率提升 30%。</dd>
            </div>
          </dl>
        </article>

        <article className="portfolio-experience-secondary">
          <p className="section-label">24.06 — 24.08 · GAME TEAM</p>
          <h3>{wildfire.title}</h3>
          <p className="portfolio-experience-role">Game Interaction Intern / UX Research</p>
          <p>{wildfire.summary}</p>
          <ul className="portfolio-tags">
            {wildfire.tags.map((tag) => (
              <li key={tag}>{tag}</li>
            ))}
          </ul>
        </article>
      </div>
    </section>
  );
}
