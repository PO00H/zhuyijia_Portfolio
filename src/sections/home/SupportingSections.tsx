import { useState } from 'react';
import { Link } from 'react-router-dom';

import { getProjectPath } from '../../app/routes';
import { getFeaturedProjects, type PortfolioProject } from '../../data/projects';
import { toggleActiveMedia } from './supportMediaState';

const confirmedWorldSlugs = new Set(['stonecity', 'tajima-cutter']);
const confirmedToolSlugs = new Set(['newface']);

const supportCopy: Record<string, string> = {
  stonecity: '以 UE5 构建“灰岩之邦”遗迹，通过环境、光效与实时特效组织四幕觉醒叙事。',
  'tajima-cutter': 'PBR 美工刀模型与全套贴图制作。',
  newface: '节点式 AI 工作站，支持 BYOK 实时运行。',
};

interface SectionHeadingProps {
  description: string;
  id: string;
  number: string;
  title: string;
  titleEn: string;
}

function SectionHeading({ description, id, number, title, titleEn }: SectionHeadingProps) {
  return (
    <header className="support-section__heading">
      <span className="section-number">{number}</span>
      <div>
        <p className="eyebrow">{title} / {titleEn}</p>
        <h2 id={id}>{description}</h2>
      </div>
    </header>
  );
}

interface OnDemandPreviewProps {
  active: boolean;
  iframeUrl?: string;
  label: string;
  onToggle: () => void;
  previewId: string;
  videoUrl?: string;
}

function OnDemandPreview({
  active,
  iframeUrl,
  label,
  onToggle,
  previewId,
  videoUrl,
}: OnDemandPreviewProps) {
  const source = videoUrl ?? iframeUrl;
  const mediaType = videoUrl ? '短视频' : '交互式 3D';

  if (!source) return null;

  return (
    <div className={`support-preview ${active ? 'is-active' : ''}`}>
      {active ? (
        <>
          <button className="support-preview__close" type="button" onClick={onToggle}>
            关闭预览
          </button>
          {videoUrl ? (
            <video
              id={previewId}
              src={videoUrl}
              autoPlay
              controls
              muted
              playsInline
              preload="metadata"
              aria-label={`${label}${mediaType}`}
            />
          ) : (
            <iframe
              id={previewId}
              src={iframeUrl}
              title={`${label}${mediaType}`}
              loading="lazy"
              allow="autoplay; fullscreen; xr-spatial-tracking"
              sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
              allowFullScreen
            />
          )}
        </>
      ) : (
        <button
          className="support-preview__trigger"
          type="button"
          data-cursor="view"
          data-preview-src={source}
          aria-controls={previewId}
          aria-expanded="false"
          onClick={onToggle}
        >
          <span>{mediaType}</span>
          <strong>{videoUrl ? '播放实验' : '加载模型'}</strong>
        </button>
      )}
    </div>
  );
}

interface GameplayItemProps {
  activeMediaId: string | null;
  index: number;
  onToggleMedia: (id: string) => void;
  project: PortfolioProject;
}

function GameplayItem({ activeMediaId, index, onToggleMedia, project }: GameplayItemProps) {
  return (
    <article
      className="lab-item"
      data-support-kind="gameplay"
      data-support-project={project.slug}
    >
      <div className="lab-item__meta">
        <span>0{index + 1}</span>
        <span>{project.year}</span>
      </div>
      <OnDemandPreview
        active={activeMediaId === project.id}
        label={project.titleZh ?? project.title}
        onToggle={() => onToggleMedia(project.id)}
        previewId={`support-preview-${project.id}`}
        videoUrl={project.previewVideo}
      />
      <div className="lab-item__copy">
        <h3>{project.titleZh ?? project.title}</h3>
        <p>{project.summary}</p>
        <ul aria-label="技术标签">
          {project.tools.slice(0, 3).map((tool) => <li key={tool}>{tool}</li>)}
        </ul>
      </div>
    </article>
  );
}

interface WorldItemProps {
  activeMediaId: string | null;
  onToggleMedia: (id: string) => void;
  project: PortfolioProject;
}

function WorldItem({ activeMediaId, onToggleMedia, project }: WorldItemProps) {
  const isStoneCity = project.slug === 'stonecity';

  return (
    <article
      className={`world-item ${isStoneCity ? 'world-item--primary' : 'world-item--secondary'}`}
      data-support-project={project.slug}
    >
      <OnDemandPreview
        active={activeMediaId === project.id}
        iframeUrl={isStoneCity ? undefined : project.modelUrl}
        label={project.titleZh ?? project.title}
        onToggle={() => onToggleMedia(project.id)}
        previewId={`support-preview-${project.id}`}
        videoUrl={isStoneCity ? project.previewVideo : undefined}
      />
      <div className="world-item__copy">
        <p className="support-item__meta">{project.year} / 个人作品</p>
        <h3>{project.titleZh ?? project.title}</h3>
        <p>{supportCopy[project.slug] ?? project.summary}</p>
        <Link className="text-link" to={getProjectPath(project.slug)}>
          查看项目信息
        </Link>
      </div>
    </article>
  );
}

export function SupportingSections() {
  const [activeMediaId, setActiveMediaId] = useState<string | null>(null);
  const gameplayProjects = getFeaturedProjects('gameplay-lab');
  const worldProjects = getFeaturedProjects('worlds').filter((project) =>
    confirmedWorldSlugs.has(project.slug));
  const toolProjects = getFeaturedProjects('tools').filter((project) =>
    confirmedToolSlugs.has(project.slug));
  const newFace = toolProjects[0];

  const handleToggleMedia = (requestedId: string) => {
    setActiveMediaId((currentId) => toggleActiveMedia(currentId, requestedId));
  };

  return (
    <div className="supporting-sections">
      <section className="support-section support-section--lab" id="gameplay-lab" aria-labelledby="gameplay-lab-title">
        <SectionHeading
          description="把一个交互问题，快速做成可以操作的原型。"
          id="gameplay-lab-title"
          number="02"
          title="玩法实验室"
          titleEn="GAMEPLAY LAB"
        />
        <div className="lab-grid">
          {gameplayProjects.map((project, index) => (
            <GameplayItem
              activeMediaId={activeMediaId}
              index={index}
              key={project.id}
              onToggleMedia={handleToggleMedia}
              project={project}
            />
          ))}
        </div>
      </section>

      <section className="support-section support-section--worlds" id="worlds" aria-labelledby="worlds-title">
        <SectionHeading
          description="用场景、材质与实时效果，建立可进入的视觉世界。"
          id="worlds-title"
          number="03"
          title="世界与视觉系统"
          titleEn="WORLDS & VISUAL SYSTEMS"
        />
        <div className="worlds-grid">
          {worldProjects.map((project) => (
            <WorldItem
              activeMediaId={activeMediaId}
              key={project.id}
              onToggleMedia={handleToggleMedia}
              project={project}
            />
          ))}
        </div>
      </section>

      {newFace ? (
        <section className="support-section support-section--tools" id="tools" aria-labelledby="tools-title">
          <SectionHeading
            description="把复杂流程整理成清楚、可以运行的工作界面。"
            id="tools-title"
            number="04"
            title="工具与交互系统"
            titleEn="TOOLS & INTERACTIVE SYSTEMS"
          />
          <a
            className="tool-feature"
            href={newFace.iframeUrl ?? getProjectPath(newFace.slug)}
            data-cursor="view"
            data-support-project={newFace.slug}
          >
            {newFace.cover ? (
              <div className="tool-feature__media">
                <img src={newFace.cover} alt="NewFace 节点式 AI 工作站界面" loading="lazy" />
              </div>
            ) : null}
            <div className="tool-feature__copy">
              <p className="support-item__meta">{newFace.year} / 个人作品</p>
              <h3>{newFace.title}</h3>
              <p>{supportCopy[newFace.slug] ?? newFace.summary}</p>
              <span className="text-link">打开独立网页</span>
            </div>
          </a>
        </section>
      ) : null}
    </div>
  );
}
