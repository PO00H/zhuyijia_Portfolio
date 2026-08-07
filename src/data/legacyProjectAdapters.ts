import {
  getLegacyWorkGroups,
  getPublicProjects,
  type PortfolioProject,
  type ProjectAward,
  type TextureMap,
} from './projects';

export interface LegacyProject {
  id: string;
  title: string;
  category: string;
  year: string;
  description: string;
  tools: string[];
  wide?: boolean;
  modelUrl?: string;
  videoUrl?: string;
  bilibiliEmbedUrl?: string;
  bilibiliUrl?: string;
  coverImage?: string;
  mediaAspect?: '16/9' | '4/3';
  textureMaps?: TextureMap[];
  awards?: ProjectAward[];
  stylizedImage?: { name: string; src: string };
}

export interface LegacyWorkDetail {
  id: string;
  index: string;
  title: string;
  subtitle: string;
  projects: LegacyProject[];
}

function toLegacyProject(project: PortfolioProject): LegacyProject {
  return {
    id: project.id,
    title: project.title,
    category: project.displayCategory,
    year: String(project.year),
    description: project.summary,
    tools: project.tools,
    wide: project.wide,
    modelUrl: project.modelUrl,
    videoUrl: project.previewVideo,
    bilibiliEmbedUrl: project.iframeUrl,
    bilibiliUrl: project.externalUrl,
    coverImage: project.cover,
    mediaAspect: project.mediaAspect,
    textureMaps: project.textureMaps,
    awards: project.awards,
    stylizedImage: project.stylizedImage,
  };
}

export const legacyWorkDetails: LegacyWorkDetail[] = getLegacyWorkGroups().map((group) => ({
  ...group,
  projects: group.projects.map(toLegacyProject),
}));

export interface LegacySubItem {
  id: string;
  label: string;
  targetId: string;
}

export interface LegacyWorkCategory {
  index: string;
  title: string;
  mobileTitle: string[];
  subItems: LegacySubItem[];
  targetId: string;
}

const detailCategories = legacyWorkDetails.slice(0, 2).map<LegacyWorkCategory>((group) => ({
  index: group.index,
  title: group.title,
  mobileTitle: [group.title],
  targetId: group.id,
  subItems: group.projects.map((project, index) => ({
    id: project.id,
    label: `${String(index + 1).padStart(3, '0')} ${project.title}`,
    targetId: project.id,
  })),
}));

export const legacyWorkCategories: LegacyWorkCategory[] = [
  ...detailCategories,
  {
    index: '03',
    title: 'CODE',
    mobileTitle: ['CODE'],
    targetId: 'work-code',
    subItems: [
      { id: 'code-001', label: '001 网页设计', targetId: 'code-web' },
      { id: 'code-002', label: '002 AI 交互界面', targetId: 'code-ai' },
    ],
  },
];

export interface CodeProject {
  id: string;
  title: string;
  year: string;
  tags: string[];
  cover?: string;
  hoverVideo?: string;
  iframeUrl: string;
  wide?: boolean;
}

function toCodeProject(project: PortfolioProject): CodeProject {
  if (!project.iframeUrl) {
    throw new Error(`Code project ${project.id} is missing iframeUrl`);
  }

  return {
    id: project.id,
    title: project.title,
    year: String(project.year),
    tags: project.tools,
    cover: project.cover,
    hoverVideo: project.previewVideo,
    iframeUrl: project.iframeUrl,
    wide: project.wide,
  };
}

const codeProjects = getPublicProjects()
  .filter((project) => project.legacyGroup === 'code')
  .sort((a, b) => a.legacyIndex - b.legacyIndex);

export const webProjects: CodeProject[] = codeProjects
  .filter((project) => project.primaryCategory === 'web')
  .map(toCodeProject);

export const aiProjects: CodeProject[] = codeProjects
  .filter((project) => project.primaryCategory === 'tools')
  .map(toCodeProject);

export const legacyCodeProjects: CodeProject[] = [...webProjects, ...aiProjects];
