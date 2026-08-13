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
        eyebrow="作品索引 / ARCHIVE"
        title="完整作品档案"
        description="辅助项目集中收录于独立档案，通过分类列表快速浏览，不再拉长首页。"
        variant="catalog"
        meta={{ label: '收录项目', value: archiveCount.toString().padStart(2, '0') }}
      />

      <a className="portfolio-archive-entry" href="/archive" aria-label="打开完整作品档案">
        <div className="portfolio-archive-index" aria-label="档案分类摘要">
          <div>
            <span>三维 / 视觉</span>
            <strong>{visualCount.toString().padStart(2, '0')}</strong>
          </div>
          <div>
            <span>网站应用</span>
            <strong>{webCount.toString().padStart(2, '0')}</strong>
          </div>
          <div>
            <span>AI 界面</span>
            <strong>{aiCount.toString().padStart(2, '0')}</strong>
          </div>
        </div>
        <span className="portfolio-archive-open">
          打开完整档案
          <ArrowUpRight aria-hidden="true" />
        </span>
      </a>
    </section>
  );
}
