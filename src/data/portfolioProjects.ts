/**
 * Portfolio content manifest for the redesign.
 *
 * Round 1 intentionally does not connect this file to the current UI. The
 * existing sections keep rendering from their original data until the static
 * structure is approved in Round 2.
 */

import derivedAssetManifest from './portfolioDerivedAssets.json';

export type PortfolioEntryKind = 'project' | 'experience';

export type PortfolioTrack =
  | 'game-development'
  | 'unreal-systems'
  | 'industry-experience'
  | 'visual-pipeline'
  | 'web-design'
  | 'ai-interface';

export type PortfolioTier =
  | 'flagship'
  | 'systems'
  | 'industry'
  | 'supporting'
  | 'archive';

export type PortfolioStatus = 'reserved' | 'published';

export interface PortfolioProject {
  id: string;
  entryKind: PortfolioEntryKind;
  title: string;
  track: PortfolioTrack;
  tier: PortfolioTier;
  status: PortfolioStatus;
  featuredOrder: number | null;
  cover: string | null;
  preview: string | null;
  poster?: string | null;
  detailUrl: string | null;
  existingContentPath: string | null;
  tags: string[];
  enabled: boolean;
  year: string | null;
  summary: string | null;
  assetPaths: string[];
  externalEmbedUrl?: string;
}

const webProjectDefinitions = [
  ['frontend-001', '音频工具网站 — 模块化工作站界面', ['HTML', 'CSS', 'JS', 'GSAP']],
  ['frontend-002', '创意平台网站 — 等候名单', ['HTML', 'CSS', 'JS']],
  ['frontend-003', '数据控制台 — 孟菲斯风格系统看板', ['HTML', 'CSS', 'JS']],
  ['frontend-004', '企业服务网站 — 建筑合规咨询与审批', ['HTML', 'CSS', 'JS']],
  ['frontend-005', '字体品牌网站 — EXAT 页面复现', ['HTML', 'CSS', 'JS']],
  ['frontend-006', '互动字体网站 — EXAT 动态排版实验', ['HTML', 'CSS', 'JS']],
  ['frontend-007', '创作工具网站 — 终端式智能创作系统', ['HTML', 'CSS', 'JS']],
  ['frontend-008', '开发者作品集 — 创意前端与交互项目', ['HTML', 'CSS', 'JS']],
  ['frontend-009', '系统监控平台 — 实时基础设施数据看板', ['HTML', 'CSS', 'JS', 'D3']],
  ['frontend-010', '创意开发作品集 — 代码与视觉项目', ['HTML', 'CSS', 'JS']],
] as const;

const webProjects: PortfolioProject[] = webProjectDefinitions.map(
  ([id, title, tags]) => {
    const cover = `/covers/${id}.webp`;
    const preview = `/previews/${id}.mp4`;
    const detailUrl = `/embed/${id}/index.html`;

    return {
      id,
      entryKind: 'project',
      title,
      track: 'web-design',
      tier: 'archive',
      status: 'published',
      featuredOrder: null,
      cover,
      preview,
      detailUrl,
      existingContentPath: detailUrl,
      tags: [...tags],
      enabled: true,
      year: '2026',
      summary: null,
      assetPaths: [cover, preview, detailUrl],
    };
  },
);

export const sourcePortfolioProjects: PortfolioProject[] = [
  {
    id: 'ue-project-upcoming',
    entryKind: 'project',
    title: 'Upcoming UE / C++ Project',
    track: 'game-development',
    tier: 'flagship',
    status: 'reserved',
    featuredOrder: 1,
    cover: null,
    preview: null,
    detailUrl: null,
    existingContentPath: null,
    tags: ['Unreal Engine', 'C++'],
    enabled: true,
    year: null,
    summary: null,
    assetPaths: [],
  },
  {
    id: 'game-001',
    entryKind: 'project',
    title: 'ECHOFLASH — 盲剑客：《白夜瞬闪》',
    track: 'game-development',
    tier: 'flagship',
    status: 'published',
    featuredOrder: 2,
    cover: '/covers/echoflash.png',
    preview: '/previews/echoflash.mp4',
    detailUrl: '/embed/echoflash-detail/index.html',
    existingContentPath: '/embed/echoflash-detail/index.html',
    tags: ['C++17', 'EasyX', 'OOP', 'FSM', 'CCD', 'AABB', 'Object Pool'],
    enabled: true,
    year: '2026',
    summary:
      '被夺去双眼的剑客，以声波辨位、蓄力一闪，在黑暗中完成必杀。未使用游戏引擎，物理、渲染、AI 与状态调度均为自研。',
    assetPaths: [
      '/covers/echoflash.png',
      '/previews/echoflash.mp4',
      '/embed/echoflash-detail/index.html',
    ],
  },
  {
    id: 'game-002',
    entryKind: 'project',
    title: "Eraser's Odyssey — 《橡皮奥德赛》",
    track: 'game-development',
    tier: 'flagship',
    status: 'published',
    featuredOrder: 3,
    cover: '/covers/eraser-odyssey.png',
    preview: null,
    detailUrl: '/embed/eraser-odyssey/index.html',
    existingContentPath: '/embed/eraser-odyssey/index.html',
    tags: ['Game Design', 'Pixel Art', 'Aseprite', 'Godot', 'Procreate'],
    enabled: true,
    year: '2025',
    summary:
      '文具生态的轻度策略 Roguelike，以三分钟“收集、合成、战斗”循环组织玩法、像素美术管线与 Godot 原型。',
    assetPaths: [
      '/covers/eraser-odyssey.png',
      '/embed/eraser-odyssey/index.html',
    ],
  },
  {
    id: 'game-003',
    entryKind: 'project',
    title: '《IK 重定向》',
    track: 'unreal-systems',
    tier: 'systems',
    status: 'published',
    featuredOrder: 1,
    cover: null,
    preview: '/videos/UE1.mp4',
    detailUrl: '/videos/UE1.mp4',
    existingContentPath: '/videos/UE1.mp4',
    tags: ['UE5', 'Blueprint', 'Blender', 'Mixamo'],
    enabled: true,
    year: '2025',
    summary: '骨骼 IK 重定向。',
    assetPaths: ['/videos/UE1.mp4'],
  },
  {
    id: 'game-004',
    entryKind: 'project',
    title: '《迭代缩小》',
    track: 'unreal-systems',
    tier: 'systems',
    status: 'published',
    featuredOrder: 2,
    cover: null,
    preview: '/videos/UE2.mp4',
    detailUrl: '/videos/UE2.mp4',
    existingContentPath: '/videos/UE2.mp4',
    tags: ['UE5', 'Blueprint', 'Blender'],
    enabled: true,
    year: '2025',
    summary: '蓝图交互实验。',
    assetPaths: ['/videos/UE2.mp4'],
  },
  {
    id: 'game-005',
    entryKind: 'project',
    title: '《跟随指针》',
    track: 'unreal-systems',
    tier: 'systems',
    status: 'published',
    featuredOrder: 3,
    cover: null,
    preview: '/videos/UE3.mp4',
    detailUrl: '/videos/UE3.mp4',
    existingContentPath: '/videos/UE3.mp4',
    tags: ['UE5', 'Blueprint', 'Blender'],
    enabled: true,
    year: '2025',
    summary: '蓝图交互实验。',
    assetPaths: ['/videos/UE3.mp4'],
  },
  {
    id: 'experience-meshy',
    entryKind: 'experience',
    title: '北京格拉菲克斯 — Meshy.ai',
    track: 'industry-experience',
    tier: 'industry',
    status: 'published',
    featuredOrder: 1,
    cover: null,
    preview: null,
    detailUrl: null,
    existingContentPath: null,
    tags: ['Tools Development', 'Blender', 'PBR', 'UV', 'API Integration'],
    enabled: true,
    year: '2026',
    summary:
      '三维美术部门技术美术实习：研发部门工具箱，处理材质、资产与 API 接入，搭建 Blender PBR 与 UV 顶点组合插件。现有履历记录产研提效 30%。',
    assetPaths: [],
  },
  {
    id: 'experience-wildfire',
    entryKind: 'experience',
    title: '浙江无端科技有限公司',
    track: 'industry-experience',
    tier: 'industry',
    status: 'published',
    featuredOrder: 2,
    cover: null,
    preview: null,
    detailUrl: null,
    existingContentPath: null,
    tags: ['Game Interaction', 'UX Research', 'Player Feedback', 'Competitive Analysis'],
    enabled: true,
    year: '2024',
    summary:
      '游戏交互实习：参与交互体验调研、玩家反馈分析、竞品拆解，并为研发团队提供交互逻辑与界面表现的迭代建议。',
    assetPaths: [],
  },
  {
    id: 'design-001',
    entryKind: 'project',
    title: 'StoneCity — 石之城',
    track: 'visual-pipeline',
    tier: 'supporting',
    status: 'published',
    featuredOrder: 1,
    cover: null,
    preview: '/videos/002.mp4',
    detailUrl: '/videos/002.mp4',
    existingContentPath: '/videos/002.mp4',
    tags: ['UE5', 'C4D', 'Niagara', 'Marvelous Designer', 'Blender'],
    enabled: true,
    year: '2025',
    summary: '以“石之城”废墟为核心场景的 UE5 环境叙事与动画作品。',
    assetPaths: ['/videos/002.mp4', '/images/0021.jpg', '/images/0022.jpg'],
  },
  {
    id: 'design-004',
    entryKind: 'project',
    title: 'TAJIMA Cutter — PBR 美工刀',
    track: 'visual-pipeline',
    tier: 'supporting',
    status: 'published',
    featuredOrder: 2,
    cover: null,
    preview: null,
    detailUrl:
      'https://sketchfab.com/models/c58dcb7624b341bb8d335f33ecd722f0/embed',
    existingContentPath: null,
    tags: ['Blender', 'ZBrush', 'Marmoset Toolbag', 'Substance 3D Painter', 'PBR'],
    enabled: true,
    year: '2025',
    summary: 'PBR 美工刀，全套贴图制作。',
    assetPaths: [
      '/textures/T_TAJIMA_BC.png',
      '/textures/T_TAJIMA_MT.png',
      '/textures/T_TAJIMA_N.png',
      '/textures/T_TAJIMA_R.png',
    ],
    externalEmbedUrl:
      'https://sketchfab.com/models/c58dcb7624b341bb8d335f33ecd722f0/embed?autostart=1&ui_controls=1&ui_infos=0&ui_inspector=0&ui_stop=0&ui_watermark=0&ui_watermark_link=0',
  },
  {
    id: 'design-002',
    entryKind: 'project',
    title: 'Peak — 山崖',
    track: 'visual-pipeline',
    tier: 'archive',
    status: 'published',
    featuredOrder: null,
    cover: null,
    preview: '/videos/001.mp4',
    detailUrl: '/videos/001.mp4',
    existingContentPath: '/videos/001.mp4',
    tags: ['UE5', 'C4D', 'Niagara'],
    enabled: true,
    year: '2025',
    summary: '围绕“攀登、抵达”叙事线展开的 UE5 环境动画。',
    assetPaths: ['/videos/001.mp4'],
  },
  {
    id: 'design-003',
    entryKind: 'project',
    title: 'Blade Runner — 银翼杀手',
    track: 'visual-pipeline',
    tier: 'archive',
    status: 'published',
    featuredOrder: null,
    cover: null,
    preview: '/videos/003.mp4',
    detailUrl: '/videos/003.mp4',
    existingContentPath: '/videos/003.mp4',
    tags: ['UE5', 'C4D', 'Niagara'],
    enabled: true,
    year: '2025',
    summary: '以轻快化赛博朋克都市为主题的 UE5 场景作品。',
    assetPaths: ['/videos/003.mp4'],
  },
  {
    id: 'design-006',
    entryKind: 'project',
    title: 'Stylized Lemon — 风格化练习',
    track: 'visual-pipeline',
    tier: 'archive',
    status: 'published',
    featuredOrder: null,
    cover: null,
    preview: '/videos/blender1.mp4',
    detailUrl: '/videos/blender1.mp4',
    existingContentPath: '/videos/blender1.mp4',
    tags: ['Blender', 'Photoshop', 'Stylized Shader'],
    enabled: true,
    year: '2025',
    summary: '风格化着色器实验。',
    assetPaths: ['/videos/blender1.mp4', '/images/22.png'],
  },
  ...webProjects,
  {
    id: 'ai-001',
    entryKind: 'project',
    title: 'NewFace — 分支式 AI 推演画布',
    track: 'ai-interface',
    tier: 'archive',
    status: 'published',
    featuredOrder: null,
    cover: '/covers/newface.webp',
    preview: null,
    detailUrl: '/embed/newface/index.html',
    existingContentPath: '/embed/newface/index.html',
    tags: ['React Flow', 'LLM', 'Canvas', 'BYOK'],
    enabled: true,
    year: '2026',
    summary: null,
    assetPaths: ['/covers/newface.webp', '/embed/newface/index.html'],
  },
];

const derivedAssetBySource = new Map(
  derivedAssetManifest.assets.map((asset) => [asset.source, asset]),
);

const resolveDerivedMedia = (path: string | null) =>
  path ? (derivedAssetBySource.get(path)?.derived ?? path) : null;

const resolveDerivedPoster = (path: string | null) =>
  path ? (derivedAssetBySource.get(path)?.poster ?? null) : null;

export const portfolioProjects: PortfolioProject[] = sourcePortfolioProjects.map((project) => ({
  ...project,
  cover: resolveDerivedMedia(project.cover),
  preview: resolveDerivedMedia(project.preview),
  poster: resolveDerivedPoster(project.preview),
  assetPaths: project.assetPaths.map((path) => resolveDerivedMedia(path) ?? path),
}));

export const projectEntries = portfolioProjects.filter(
  (entry) => entry.entryKind === 'project',
);

export const experienceEntries = portfolioProjects.filter(
  (entry) => entry.entryKind === 'experience',
);

export const enabledPortfolioProjects = portfolioProjects.filter(
  (entry) => entry.enabled,
);

export const getPortfolioProjectsByTier = (tier: PortfolioTier) =>
  enabledPortfolioProjects.filter((entry) => entry.tier === tier);

export const getPortfolioProjectsByTrack = (track: PortfolioTrack) =>
  enabledPortfolioProjects.filter((entry) => entry.track === track);

export const getPortfolioProjectById = (id: string) => {
  const entry = portfolioProjects.find((project) => project.id === id);

  if (!entry) {
    throw new Error(`Portfolio entry not found: ${id}`);
  }

  return entry;
};
