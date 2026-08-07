export type ProjectVisibility =
  | 'featured'
  | 'secondary'
  | 'all-works'
  | 'draft'
  | 'private'
  | 'hidden';

export type PrimaryCategory = 'game' | 'technical-art' | 'tools' | 'web';
export type LegacyGroup = 'design' | 'game' | 'code';
export type FeaturedSection = 'selected-games' | 'gameplay-lab' | 'worlds' | 'tools';

export interface TextureMap {
  name: string;
  src: string;
}

export interface ProjectAward {
  title: string;
  image: string;
}

export interface PortfolioProject {
  id: string;
  slug: string;
  title: string;
  titleZh?: string;
  year: number;
  primaryCategory: PrimaryCategory;
  legacyGroup: LegacyGroup;
  legacyIndex: number;
  displayCategory: string;
  disciplines: string[];
  featuredSections: FeaturedSection[];
  visibility: ProjectVisibility;
  status: 'complete' | 'in-progress' | 'archived';
  ownership: 'personal' | 'team';
  roles: string[];
  contribution?: string;
  tools: string[];
  summary: string;
  cover?: string;
  mobileCover?: string;
  previewVideo?: string;
  detailPath?: string;
  iframeUrl?: string;
  externalUrl?: string;
  modelUrl?: string;
  mediaAspect?: '16/9' | '4/3';
  wide?: boolean;
  textureMaps?: TextureMap[];
  awards?: ProjectAward[];
  stylizedImage?: { name: string; src: string };
  order: number;
}

const technicalArtProjects: PortfolioProject[] = [
  {
    id: 'design-001',
    slug: 'stonecity',
    title: '《StoneCity》 石之城',
    titleZh: '石之城',
    year: 2025,
    primaryCategory: 'technical-art',
    legacyGroup: 'design',
    legacyIndex: 1,
    displayCategory: 'UE5 LEVEL ART',
    disciplines: ['Level Art', 'Environment Art', 'Real-time VFX'],
    featuredSections: ['worlds'],
    visibility: 'featured',
    status: 'complete',
    ownership: 'personal',
    roles: ['Level Art', 'Environment Art', 'Technical Art'],
    tools: ['UE5', 'C4D', 'NIAGARA', 'MD', 'Blender'],
    summary:
      '设计说明：本作品以 "石之城"—— 古文明 "灰岩之邦" 的废墟为核心场景，这座因透支地脉魔法而覆灭的城邦，千年后化为迷雾笼罩的石墟。动画通过四幕递进叙事：全景展现残垣断壁与石纹符文的文明遗骸，UE 环境光效强化死寂氛围；兜帽守墓者从废墟中蛰伏现身，石质纹理贴合城邦基石质感；碎石浮动与微光闪烁触发觉醒预兆，暗示地脉魔法复苏；最终守墓者展开复刻石城瓦纹的渡鸦之翼，裂痕红光呼应昔日魔法核心。作品以 "石" 为载体，用冷硬质感与锐利生机的反差，诠释 "文明余烬从未消散，以守护者形态蛰伏觉醒" 的核心立意。',
    previewVideo: '/videos/002.mp4',
    wide: true,
    awards: [
      { title: '2025第二届·AADC北美应用艺术设计奖：金奖', image: '/images/0021.jpg' },
      { title: '2025第六届·G-CROSS跨界艺术创意奖：佳作奖', image: '/images/0022.jpg' },
    ],
    order: 1,
  },
  {
    id: 'design-002',
    slug: 'peak',
    title: '《Peak》 山崖',
    titleZh: '山崖',
    year: 2025,
    primaryCategory: 'technical-art',
    legacyGroup: 'design',
    legacyIndex: 2,
    displayCategory: 'UE5 LEVEL ART',
    disciplines: ['Level Art', 'Environment Art'],
    featuredSections: [],
    visibility: 'all-works',
    status: 'complete',
    ownership: 'personal',
    roles: ['Level Art', 'Environment Art'],
    tools: ['UE5', 'C4D', 'NIAGARA'],
    summary:
      '设计说明：本作品以 "登顶释然" 为核心情绪，围绕 "攀登 — 抵达" 的叙事线展开：首帧聚焦攀登者手部抓握岩石的特写，粗糙石质、苔藓纹理呼应 UE 写实材质表现，背景虚化的山路暗示前行的崎岖；尾帧切换为山顶俯瞰视角，开阔的天际线、浮动的流云与远方层峦，搭配轻快背景音乐，释放 "突破阻碍后的松弛感"。动画通过镜头从 "聚焦局部" 到 "全景舒展" 的递进，用明亮的自然光效、通透的空气质感，弱化攀登的艰辛，强化 "向山而行、终抵辽阔" 的治愈感，诠释 "山崖不仅是目的地，更是自我突破的见证" 的核心立意。',
    previewVideo: '/videos/001.mp4',
    awards: [{ title: '2025第四届HKDADC：一等奖', image: '' }],
    order: 2,
  },
  {
    id: 'design-003',
    slug: 'blade-runner',
    title: '《Blade Runner》 银翼杀手',
    titleZh: '银翼杀手',
    year: 2025,
    primaryCategory: 'technical-art',
    legacyGroup: 'design',
    legacyIndex: 3,
    displayCategory: 'UE5 LEVEL ART',
    disciplines: ['Level Art', 'Environment Art'],
    featuredSections: [],
    visibility: 'all-works',
    status: 'complete',
    ownership: 'personal',
    roles: ['Level Art', 'Environment Art'],
    tools: ['UE5', 'C4D', 'NIAGARA'],
    summary:
      '设计说明：本作品以轻快化的赛博朋克都市为核心，命名呼应经典 IP 却重构氛围：用 UE 搭建雨夜摩天楼群，霓虹广告糅合科技冷硬与市井奇幻，车流光轨强化都市动感；轻快 BGM 中和赛博场景的疏离压抑，让冰冷钢筋间漾起轻盈律动。',
    previewVideo: '/videos/003.mp4',
    order: 3,
  },
  {
    id: 'design-004',
    slug: 'tajima-cutter',
    title: 'Tajima Cutter 美工刀',
    titleZh: '美工刀',
    year: 2025,
    primaryCategory: 'technical-art',
    legacyGroup: 'design',
    legacyIndex: 4,
    displayCategory: 'Hard Surface',
    disciplines: ['Hard Surface', 'PBR Texturing'],
    featuredSections: ['worlds'],
    visibility: 'secondary',
    status: 'complete',
    ownership: 'personal',
    roles: ['Modeling', 'Texturing'],
    tools: ['Blender', 'ZBrush', 'Marmoset Toolbag', 'Substance 3D Painter'],
    summary: 'PBR 美工刀，全套贴图制作',
    modelUrl:
      'https://sketchfab.com/models/c58dcb7624b341bb8d335f33ecd722f0/embed?autostart=1&ui_controls=1&ui_infos=0&ui_inspector=0&ui_stop=0&ui_watermark=0&ui_watermark_link=0',
    textureMaps: [
      { name: 'Base Color', src: '/textures/T_TAJIMA_BC.png' },
      { name: 'Metallic', src: '/textures/T_TAJIMA_MT.png' },
      { name: 'Normal Map', src: '/textures/T_TAJIMA_N.png' },
      { name: 'Roughness', src: '/textures/T_TAJIMA_R.png' },
    ],
    order: 4,
  },
  {
    id: 'design-005',
    slug: 'mech-prototype',
    title: 'Mech Prototype 机械原型',
    titleZh: '机械原型',
    year: 2025,
    primaryCategory: 'technical-art',
    legacyGroup: 'design',
    legacyIndex: 5,
    displayCategory: 'Hard Surface',
    disciplines: ['Hard Surface', 'Modeling'],
    featuredSections: [],
    visibility: 'all-works',
    status: 'complete',
    ownership: 'personal',
    roles: ['Modeling'],
    tools: ['Blender', 'C4D'],
    summary: '白模 多足机器人',
    modelUrl:
      'https://sketchfab.com/models/a5407920f5f24dcea82311788aa87765/embed?autostart=1&ui_controls=1&ui_infos=0&ui_inspector=0&ui_stop=0&ui_watermark=0&ui_watermark_link=0',
    order: 5,
  },
  {
    id: 'design-006',
    slug: 'stylized-lemon',
    title: '《风格化柠檬》',
    titleZh: '风格化柠檬',
    year: 2025,
    primaryCategory: 'technical-art',
    legacyGroup: 'design',
    legacyIndex: 6,
    displayCategory: 'STYLIZED',
    disciplines: ['Stylized Art', 'Shader'],
    featuredSections: [],
    visibility: 'all-works',
    status: 'complete',
    ownership: 'personal',
    roles: ['Stylized Art'],
    tools: ['Blender', 'PS'],
    summary: '风格化着色器',
    previewVideo: '/videos/blender1.mp4',
    stylizedImage: { name: '风格化着色器', src: '/images/22.png' },
    order: 6,
  },
];

const gameProjects: PortfolioProject[] = [
  {
    id: 'game-001',
    slug: 'echoflash',
    title: 'ECHOFLASH — 盲剑客：《白夜瞬闪》',
    titleZh: '白夜瞬闪',
    year: 2026,
    primaryCategory: 'game',
    legacyGroup: 'game',
    legacyIndex: 1,
    displayCategory: 'C++ / EasyX',
    disciplines: ['Game Design', 'Programming', 'Pixel Art'],
    featuredSections: ['selected-games'],
    visibility: 'featured',
    status: 'complete',
    ownership: 'personal',
    roles: ['Game Design', 'Programming', 'Pixel Art'],
    tools: ['C++17', 'EasyX', 'OOP', 'FSM', 'CCD', 'AABB', 'Object Pool'],
    summary:
      '被夺去双眼的剑客，以声波辨位、蓄力一闪，在黑暗中完成必杀。基于完全面向对象架构的高难度像素动作游戏，未使用任何引擎，物理、渲染、AI 与状态调度全自研。',
    cover: '/covers/echoflash.png',
    previewVideo: '/previews/echoflash.mp4',
    iframeUrl: '/embed/echoflash-detail/index.html',
    detailPath: '/works/echoflash',
    mediaAspect: '4/3',
    wide: true,
    order: 1,
  },
  {
    id: 'game-002',
    slug: 'erasers-odyssey',
    title: "Eraser's Odyssey — 《橡皮奥德赛》",
    titleZh: '橡皮奥德赛',
    year: 2025,
    primaryCategory: 'game',
    legacyGroup: 'game',
    legacyIndex: 2,
    displayCategory: 'Game Design · Pixel Art',
    disciplines: ['Game Design', 'Pixel Art', 'Prototyping'],
    featuredSections: ['selected-games'],
    visibility: 'featured',
    status: 'complete',
    ownership: 'personal',
    roles: ['Game Design', 'Pixel Art', 'Prototyping'],
    tools: ['Game Design', 'Pixel Art', 'Aseprite', 'Godot', 'Procreate'],
    summary:
      '文具生态的轻度策略 Roguelike。橡皮小人在放大的儿童书房里经历 3 分钟“收集→合成→战斗”循环，把文具特性系统化映射为弹幕、清除和控制等玩法机制。',
    cover: '/covers/eraser-odyssey.png',
    iframeUrl: '/embed/eraser-odyssey/index.html',
    detailPath: '/works/erasers-odyssey',
    mediaAspect: '4/3',
    wide: true,
    order: 2,
  },
  {
    id: 'game-003',
    slug: 'ik-retargeting',
    title: '《IK 重定向》',
    titleZh: 'IK 重定向',
    year: 2025,
    primaryCategory: 'game',
    legacyGroup: 'game',
    legacyIndex: 3,
    displayCategory: 'UE5 Blueprint',
    disciplines: ['Technical Animation', 'Blueprint'],
    featuredSections: ['gameplay-lab'],
    visibility: 'secondary',
    status: 'complete',
    ownership: 'personal',
    roles: ['Blueprint Development'],
    tools: ['UE5', 'Blender', 'mixamo'],
    summary: '骨骼 IK 重定向',
    previewVideo: '/videos/UE1.mp4',
    order: 3,
  },
  {
    id: 'game-004',
    slug: 'iterative-shrink',
    title: '《迭代缩小》',
    titleZh: '迭代缩小',
    year: 2025,
    primaryCategory: 'game',
    legacyGroup: 'game',
    legacyIndex: 4,
    displayCategory: 'UE5 Blueprint',
    disciplines: ['Interaction', 'Blueprint'],
    featuredSections: ['gameplay-lab'],
    visibility: 'secondary',
    status: 'complete',
    ownership: 'personal',
    roles: ['Blueprint Development'],
    tools: ['UE5', 'Blender'],
    summary: '蓝图交互',
    previewVideo: '/videos/UE2.mp4',
    order: 4,
  },
  {
    id: 'game-005',
    slug: 'follow-pointer',
    title: '《跟随指针》',
    titleZh: '跟随指针',
    year: 2025,
    primaryCategory: 'game',
    legacyGroup: 'game',
    legacyIndex: 5,
    displayCategory: 'UE5 Blueprint',
    disciplines: ['Interaction', 'Blueprint'],
    featuredSections: ['gameplay-lab'],
    visibility: 'secondary',
    status: 'complete',
    ownership: 'personal',
    roles: ['Blueprint Development'],
    tools: ['UE5', 'Blender'],
    summary: '蓝图交互',
    previewVideo: '/videos/UE3.mp4',
    order: 5,
  },
];

const webProjectDefinitions = [
  ['frontend-001', 'synthwave-os', 'Synthwave OS', ['HTML', 'CSS', 'JS', 'GSAP'], true],
  ['frontend-002', 'waitlist-join-now', 'Waitlist — Join Now', ['HTML', 'CSS', 'JS'], false],
  ['frontend-003', 'synth-dashboard', 'Synth Dashboard — Memphis Console', ['HTML', 'CSS', 'JS'], false],
  ['frontend-004', 'outsource-consultants', 'Outsource Consultants', ['HTML', 'CSS', 'JS'], false],
  ['frontend-005', 'exat-hot-type', 'Exat — Hot Type Replica', ['HTML', 'CSS', 'JS'], false],
  ['frontend-006', 'exat-typeface-one', 'Exat Typeface I', ['HTML', 'CSS', 'JS'], true],
  ['frontend-007', 'exat-typeface-two', 'Exat Typeface II', ['HTML', 'CSS', 'JS'], false],
  ['frontend-008', 'dev-engineer-frontend', 'Dev.Engineer — Frontend', ['HTML', 'CSS', 'JS'], false],
  ['frontend-009', 'nexus-analytics', 'Nexus Analytics — 数据可视化', ['HTML', 'CSS', 'JS', 'D3'], false],
  ['frontend-010', 'yijia-zhu-portfolio', 'Yijia.Zhu — Portfolio', ['HTML', 'CSS', 'JS'], false],
] as const;

const webProjects: PortfolioProject[] = webProjectDefinitions.map(
  ([id, slug, title, tools, wide], index) => ({
    id,
    slug,
    title,
    year: 2026,
    primaryCategory: 'web',
    legacyGroup: 'code',
    legacyIndex: index + 1,
    displayCategory: 'Web Experiment',
    disciplines: ['Frontend Development', 'Interaction Design'],
    featuredSections: [],
    visibility: 'all-works',
    status: 'complete',
    ownership: 'personal',
    roles: ['Design', 'Frontend Development'],
    tools: [...tools],
    summary: '',
    cover: `/covers/${id}.webp`,
    previewVideo: `/previews/${id}.mp4`,
    iframeUrl: `/embed/${id}/index.html`,
    wide,
    order: index + 1,
  }),
);

const toolProjects: PortfolioProject[] = [
  {
    id: 'ai-001',
    slug: 'newface',
    title: 'NewFace — 节点式 AI 工作站',
    year: 2026,
    primaryCategory: 'tools',
    legacyGroup: 'code',
    legacyIndex: 11,
    displayCategory: 'AI Interface',
    disciplines: ['Tool Design', 'Interaction Design', 'Frontend Development'],
    featuredSections: ['tools'],
    visibility: 'featured',
    status: 'complete',
    ownership: 'personal',
    roles: ['Product Design', 'Frontend Development'],
    tools: ['React Flow', 'LLM', 'Canvas', 'BYOK'],
    summary: '节点式 AI 工作站，支持 BYOK 实时运行。',
    cover: '/covers/newface.webp',
    iframeUrl: '/embed/newface/index.html',
    wide: true,
    order: 1,
  },
];

export const portfolioProjects: PortfolioProject[] = [
  ...technicalArtProjects,
  ...gameProjects,
  ...webProjects,
  ...toolProjects,
];

const publicVisibilities = new Set<ProjectVisibility>(['featured', 'secondary', 'all-works']);

export function getPublicProjects(): PortfolioProject[] {
  return portfolioProjects.filter((project) => publicVisibilities.has(project.visibility));
}

export function getFeaturedProjects(section: FeaturedSection): PortfolioProject[] {
  return getPublicProjects()
    .filter((project) => project.featuredSections.includes(section))
    .sort((a, b) => a.order - b.order);
}

export interface LegacyWorkGroup {
  id: `work-${LegacyGroup}`;
  index: string;
  title: string;
  subtitle: string;
  projects: PortfolioProject[];
}

const legacyGroupMeta: Array<Omit<LegacyWorkGroup, 'projects'>> = [
  { id: 'work-design', index: '01', title: 'DESIGN', subtitle: '视觉设计' },
  { id: 'work-game', index: '02', title: 'GAME', subtitle: '游戏开发' },
  { id: 'work-code', index: '03', title: 'CODE', subtitle: '前端开发' },
];

export function getLegacyWorkGroups(): LegacyWorkGroup[] {
  return legacyGroupMeta.map((group) => {
    const legacyGroup = group.id.replace('work-', '') as LegacyGroup;
    return {
      ...group,
      projects: getPublicProjects()
        .filter((project) => project.legacyGroup === legacyGroup)
        .sort((a, b) => a.legacyIndex - b.legacyIndex),
    };
  });
}
