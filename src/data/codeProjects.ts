// Code 区项目数据
// 分两组渲染：
//   webProjects   — 网页设计 10 个（001 + 005 wide，其他两两一组）
//   aiProjects    — AI 交互界面（独立分组，目前为占位，等真实内容补入）

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

export const webProjects: CodeProject[] = [
  {
    id: 'frontend-001',
    title: '音频工具网站 — 模块化工作站界面',
    year: '2026',
    tags: ['HTML', 'CSS', 'JS', 'GSAP'],
    cover: '/covers/frontend-001.webp',
    hoverVideo: '/previews/frontend-001.mp4',
    iframeUrl: '/embed/frontend-001/index.html',
    wide: true,
  },
  {
    id: 'frontend-002',
    title: '创意平台网站 — 等候名单',
    year: '2026',
    tags: ['HTML', 'CSS', 'JS'],
    cover: '/covers/frontend-002.webp',
    hoverVideo: '/previews/frontend-002.mp4',
    iframeUrl: '/embed/frontend-002/index.html',
  },
  {
    id: 'frontend-003',
    title: '数据控制台 — 孟菲斯风格系统看板',
    year: '2026',
    tags: ['HTML', 'CSS', 'JS'],
    cover: '/covers/frontend-003.webp',
    hoverVideo: '/previews/frontend-003.mp4',
    iframeUrl: '/embed/frontend-003/index.html',
  },
  {
    id: 'frontend-004',
    title: '企业服务网站 — 建筑合规咨询与审批',
    year: '2026',
    tags: ['HTML', 'CSS', 'JS'],
    cover: '/covers/frontend-004.webp',
    hoverVideo: '/previews/frontend-004.mp4',
    iframeUrl: '/embed/frontend-004/index.html',
  },
  {
    id: 'frontend-005',
    title: '字体品牌网站 — EXAT 页面复现',
    year: '2026',
    tags: ['HTML', 'CSS', 'JS'],
    cover: '/covers/frontend-005.webp',
    hoverVideo: '/previews/frontend-005.mp4',
    iframeUrl: '/embed/frontend-005/index.html',
  },
  {
    id: 'frontend-006',
    title: '互动字体网站 — EXAT 动态排版实验',
    year: '2026',
    tags: ['HTML', 'CSS', 'JS'],
    cover: '/covers/frontend-006.webp',
    hoverVideo: '/previews/frontend-006.mp4',
    iframeUrl: '/embed/frontend-006/index.html',
    wide: true,
  },
  {
    id: 'frontend-007',
    title: '创作工具网站 — 终端式智能创作系统',
    year: '2026',
    tags: ['HTML', 'CSS', 'JS'],
    cover: '/covers/frontend-007.webp',
    hoverVideo: '/previews/frontend-007.mp4',
    iframeUrl: '/embed/frontend-007/index.html',
  },
  {
    id: 'frontend-008',
    title: '开发者作品集 — 创意前端与交互项目',
    year: '2026',
    tags: ['HTML', 'CSS', 'JS'],
    cover: '/covers/frontend-008.webp',
    hoverVideo: '/previews/frontend-008.mp4',
    iframeUrl: '/embed/frontend-008/index.html',
  },
  {
    id: 'frontend-009',
    title: '系统监控平台 — 实时基础设施数据看板',
    year: '2026',
    tags: ['HTML', 'CSS', 'JS', 'D3'],
    cover: '/covers/frontend-009.webp',
    hoverVideo: '/previews/frontend-009.mp4',
    iframeUrl: '/embed/frontend-009/index.html',
  },
  {
    id: 'frontend-010',
    title: '创意开发作品集 — 代码与视觉项目',
    year: '2026',
    tags: ['HTML', 'CSS', 'JS'],
    cover: '/covers/frontend-010.webp',
    hoverVideo: '/previews/frontend-010.mp4',
    iframeUrl: '/embed/frontend-010/index.html',
  },
];

// AI 组：NewFace —— 分支式 AI 推演画布（BYOK 实时运行）
export const aiProjects: CodeProject[] = [
  {
    id: 'ai-001',
    title: 'NewFace — 分支式 AI 推演画布',
    year: '2026',
    tags: ['React Flow', 'LLM', 'Canvas', 'BYOK'],
    cover: '/covers/newface.webp',
    iframeUrl: '/embed/newface/index.html',
    wide: true,
  },
];

// 兼容：旧的统一 export
export const codeProjects = [...webProjects, ...aiProjects];
