import { useState, type PointerEvent } from 'react';
import { Link } from 'react-router-dom';

import { getProjectPath } from '../../app/routes';
import { getFeaturedProjects, type PortfolioProject } from '../../data/projects';
import { toggleActiveMedia } from './supportMediaState';

const confirmedWorldSlugs = new Set(['stonecity', 'tajima-cutter']);
const confirmedToolSlugs = new Set(['newface']);

const posterBySlug: Record<string, string> = {
  'ik-retargeting': '/posters/ik-retargeting.jpg',
  'iterative-shrink': '/posters/iterative-shrink.jpg',
  'follow-pointer': '/posters/follow-pointer.jpg',
  stonecity: '/posters/stonecity.jpg',
};

const supportCopy: Record<string, string> = {
  'ik-retargeting': '验证不同骨骼之间的动作适配与 IK 重定向流程。',
  'iterative-shrink': '通过蓝图迭代改变尺度，观察空间与操作反馈的变化。',
  'follow-pointer': '建立指针、空间目标与角色反馈之间的实时关系。',
  stonecity: '以 UE5 构建“灰岩之邦”遗迹，通过环境、光效与实时特效组织四幕觉醒叙事。',
  'tajima-cutter': '完成硬表面建模与 PBR 贴图流程，交互模型按需加载。',
  newface: '节点式 AI 工作站，把模型调用、输入与结果组织为可见的工作流。',
};

interface ArchiveHeadingProps {
  description: string;
  id: string;
  number: string;
  title: string;
  titleEn: string;
}

function ArchiveHeading({ description, id, number, title, titleEn }: ArchiveHeadingProps) {
  return (
    <header className="capability-heading">
      <div className="capability-heading__index">
        <span>{number}</span>
        <span>{titleEn}</span>
      </div>
      <div className="capability-heading__copy">
        <p>{title}</p>
        <h2 id={id}>{description}</h2>
      </div>
    </header>
  );
}

interface OnDemandPreviewProps {
  active: boolean;
  iframeUrl?: string;
  label: string;
  onClose: () => void;
  onToggle: () => void;
  poster?: string;
  previewId: string;
  videoUrl?: string;
}

function OnDemandPreview({
  active,
  iframeUrl,
  label,
  onClose,
  onToggle,
  poster,
  previewId,
  videoUrl,
}: OnDemandPreviewProps) {
  const source = videoUrl ?? iframeUrl;
  const mediaType = videoUrl ? '短视频' : '交互模型';

  if (!source) return null;

  const activateOnHover = (event: PointerEvent<HTMLButtonElement>) => {
    if (videoUrl && event.pointerType === 'mouse') onToggle();
  };

  return (
    <div
      className={active ? 'archive-media is-active' : 'archive-media'}
      onPointerLeave={active && videoUrl ? onClose : undefined}
    >
      {active ? (
        <>
          <button className="archive-media__close" type="button" onClick={onClose}>
            关闭
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
          className="archive-media__trigger"
          type="button"
          data-cursor="view"
          data-preview-src={source}
          aria-controls={previewId}
          aria-expanded="false"
          onClick={onToggle}
          onPointerEnter={activateOnHover}
        >
          {poster ? <img src={poster} alt={`${label}静态预览`} loading="lazy" /> : null}
          <span className="archive-media__shade" aria-hidden="true" />
          <span className="archive-media__type">{mediaType}</span>
          <strong>{videoUrl ? '播放' : '加载 3D'}</strong>
        </button>
      )}
    </div>
  );
}

interface MediaItemProps {
  activeMediaId: string | null;
  onCloseMedia: () => void;
  onToggleMedia: (id: string) => void;
  project: PortfolioProject;
}

function GameplayItem({ activeMediaId, onCloseMedia, onToggleMedia, project }: MediaItemProps) {
  return (
    <article className="lab-archive__item" data-support-kind="gameplay" data-support-project={project.slug}>
      <div className="lab-archive__meta">
        <span>{project.year}</span>
        <span>{project.displayCategory}</span>
      </div>
      <OnDemandPreview
        active={activeMediaId === project.id}
        label={project.titleZh ?? project.title}
        onClose={onCloseMedia}
        onToggle={() => onToggleMedia(project.id)}
        poster={posterBySlug[project.slug]}
        previewId={`support-preview-${project.id}`}
        videoUrl={project.previewVideo}
      />
      <div className="lab-archive__copy">
        <h3>{project.titleZh ?? project.title}</h3>
        <p>{supportCopy[project.slug] ?? project.summary}</p>
        <span>{project.tools.slice(0, 3).join(' / ')}</span>
      </div>
    </article>
  );
}

function StoneCityFeature({ activeMediaId, onCloseMedia, onToggleMedia, project }: MediaItemProps) {
  return (
    <article className="world-feature" data-support-project={project.slug}>
      <OnDemandPreview
        active={activeMediaId === project.id}
        label={project.titleZh ?? project.title}
        onClose={onCloseMedia}
        onToggle={() => onToggleMedia(project.id)}
        poster={posterBySlug[project.slug]}
        previewId={`support-preview-${project.id}`}
        videoUrl={project.previewVideo}
      />
      <div className="world-feature__copy">
        <div>
          <span>WORLD 01 / {project.year}</span>
          <span>个人作品</span>
        </div>
        <h3>{project.titleZh ?? project.title}</h3>
        <p>{supportCopy[project.slug] ?? project.summary}</p>
        <Link to={getProjectPath(project.slug)}>查看项目档案 ↗</Link>
      </div>
    </article>
  );
}

function TajimaFeature({ activeMediaId, onCloseMedia, onToggleMedia, project }: MediaItemProps) {
  return (
    <article className="world-object" data-support-project={project.slug}>
      <div className="world-object__number" aria-hidden="true">3D</div>
      <div className="world-object__body">
        <span>WORLD 02 / {project.year}</span>
        <h3>{project.titleZh ?? project.title}</h3>
        <p>{supportCopy[project.slug] ?? project.summary}</p>
        <OnDemandPreview
          active={activeMediaId === project.id}
          iframeUrl={project.modelUrl}
          label={project.titleZh ?? project.title}
          onClose={onCloseMedia}
          onToggle={() => onToggleMedia(project.id)}
          previewId={`support-preview-${project.id}`}
        />
        <Link to={getProjectPath(project.slug)}>查看材质与项目信息 ↗</Link>
      </div>
    </article>
  );
}

export function SupportingSections() {
  const [activeMediaId, setActiveMediaId] = useState<string | null>(null);
  const gameplayProjects = getFeaturedProjects('gameplay-lab');
  const worldProjects = getFeaturedProjects('worlds').filter((project) => confirmedWorldSlugs.has(project.slug));
  const toolProjects = getFeaturedProjects('tools').filter((project) => confirmedToolSlugs.has(project.slug));
  const stoneCity = worldProjects.find((project) => project.slug === 'stonecity');
  const tajima = worldProjects.find((project) => project.slug === 'tajima-cutter');
  const newFace = toolProjects[0];

  const handleToggleMedia = (requestedId: string) => {
    setActiveMediaId((currentId) => toggleActiveMedia(currentId, requestedId));
  };

  const closeMedia = () => setActiveMediaId(null);

  return (
    <div className="supporting-archive">
      <section className="capability-strip capability-strip--lab" id="gameplay-lab" aria-labelledby="gameplay-lab-title">
        <ArchiveHeading
          description="把一个交互问题，快速做成可以操作的原型。"
          id="gameplay-lab-title"
          number="02"
          title="玩法实验室"
          titleEn="GAMEPLAY LAB"
        />
        <div className="lab-archive">
          {gameplayProjects.map((project) => (
            <GameplayItem
              activeMediaId={activeMediaId}
              key={project.id}
              onCloseMedia={closeMedia}
              onToggleMedia={handleToggleMedia}
              project={project}
            />
          ))}
        </div>
      </section>

      <section className="capability-strip capability-strip--worlds" id="worlds" aria-labelledby="worlds-title">
        <ArchiveHeading
          description="场景、材质与实时效果，是游戏世界的另一套叙事系统。"
          id="worlds-title"
          number="03"
          title="世界与视觉系统"
          titleEn="WORLDS & VISUAL SYSTEMS"
        />
        {stoneCity ? (
          <StoneCityFeature
            activeMediaId={activeMediaId}
            onCloseMedia={closeMedia}
            onToggleMedia={handleToggleMedia}
            project={stoneCity}
          />
        ) : null}
        {tajima ? (
          <TajimaFeature
            activeMediaId={activeMediaId}
            onCloseMedia={closeMedia}
            onToggleMedia={handleToggleMedia}
            project={tajima}
          />
        ) : null}
      </section>

      {newFace ? (
        <section className="capability-strip capability-strip--tools" id="tools" aria-labelledby="tools-title">
          <ArchiveHeading
            description="把复杂流程，整理成清楚而可运行的界面。"
            id="tools-title"
            number="04"
            title="工具与交互系统"
            titleEn="TOOLS & INTERACTIVE SYSTEMS"
          />
          <a
            className="tool-archive"
            href={newFace.iframeUrl ?? getProjectPath(newFace.slug)}
            data-cursor="view"
            data-support-project={newFace.slug}
          >
            <div className="tool-archive__frame">
              {newFace.cover ? <img src={newFace.cover} alt="NewFace 节点式 AI 工作站界面" loading="lazy" /> : null}
              <span>打开独立网页 ↗</span>
            </div>
            <div className="tool-archive__copy">
              <span>TOOL 01 / {newFace.year} / 个人作品</span>
              <h3>NewFace</h3>
              <p>{supportCopy[newFace.slug] ?? newFace.summary}</p>
              <div>{newFace.roles.join(' / ')}</div>
            </div>
          </a>
        </section>
      ) : null}
    </div>
  );
}
