import { projectEntries } from '@/data/portfolioProjects';
import { ArrowUpRight } from 'lucide-react';
import { SectionHeading } from './SectionHeading';

export function ArchivePreviewSection() {
  const visualCount = projectEntries.filter((entry) => entry.track === 'visual-pipeline').length;
  const webCount = projectEntries.filter((entry) => entry.track === 'web-design').length;
  const aiCount = projectEntries.filter((entry) => entry.track === 'ai-interface').length;
  const archiveCount = visualCount + webCount + aiCount;

  return (
    <section id="archive" className="portfolio-section portfolio-archive-section">
      <SectionHeading
        index="06"
        eyebrow="Archive / 完整作品档案"
        title="ARCHIVE"
        description={`${archiveCount} 个辅助项目集中收录于独立档案，通过分类列表快速浏览，不再拉长首页。`}
      />

      <a className="portfolio-archive-entry" href="/archive" aria-label="打开完整作品档案">
        <div className="portfolio-archive-index" aria-label="档案分类摘要">
          <div>
            <span>3D / VISUAL</span>
            <strong>{visualCount.toString().padStart(2, '0')}</strong>
          </div>
          <div>
            <span>WEB DESIGN</span>
            <strong>{webCount.toString().padStart(2, '0')}</strong>
          </div>
          <div>
            <span>AI INTERFACE</span>
            <strong>{aiCount.toString().padStart(2, '0')}</strong>
          </div>
        </div>
        <span className="portfolio-archive-open">
          OPEN FULL ARCHIVE
          <ArrowUpRight aria-hidden="true" />
        </span>
      </a>
    </section>
  );
}
