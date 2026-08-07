# 朱翊嘉游戏作品集完整重构 Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 依据完整提示词，将现有站点半重建为中文主导、游戏项目优先、具有编辑档案层级与克制动效的多页面作品集。

**Architecture:** 保留统一 `projects.ts` 数据、现有媒体、原游戏网页和 React Router；重写新版外壳、首页、All Works、About 和非游戏项目档案页。交互状态拆成可测试的纯函数，媒体仅在用户表达兴趣后挂载。

**Tech Stack:** React 19、TypeScript、React Router、Framer Motion、Lenis、CSS、Vitest。

### Task 1: 锁定页面结构与内容边界

**Files:**
- Modify: `src/app/AppRouter.test.tsx`
- Modify: `src/data/projects.test.ts`
- Create: `src/pages/WorksPage.test.ts`

1. 写首页、导航、两项精选游戏、未确认内容隐藏、All Works 分类和 About 隐私边界测试。
2. 运行目标测试，确认因为新结构尚未实现而失败。
3. 不修改测试预期，进入最小实现。

### Task 2: 重构全局外壳与加载片头

**Files:**
- Modify: `src/components/layout/SiteHeader.tsx`
- Modify: `src/components/layout/SiteFooter.tsx`
- Modify: `src/components/Preloader.tsx`
- Modify: `src/components/preloaderSequence.ts`
- Modify: `src/components/preloaderSequence.test.ts`
- Modify: `src/styles/tokens.css`
- Modify: `src/styles/shell.css`
- Modify: `src/styles/typography.css`

1. 先写移动菜单、中文品牌和短加载时序的失败测试。
2. 将导航重构为桌面横向导航与移动全屏菜单，支持 Escape 和清楚焦点。
3. 将加载片头缩短为中文优先的品牌揭示，并保留一次性会话逻辑。
4. 统一暖灰、近黑、米白、朱红 token 和四级字体比例。
5. 运行目标测试确认通过。

### Task 3: 重构 Hero 与 Selected Games

**Files:**
- Create: `src/sections/home/SelectedGames.tsx`
- Create: `src/sections/home/SelectedGames.test.tsx`
- Create: `src/sections/home/selectedGameState.ts`
- Modify: `src/pages/HomePage.tsx`
- Create: `src/styles/redesign-home.css`

1. 写失败测试：中文主标题、两条项目目录、直接原网页链接、初始无视频、键盘焦点可激活预览。
2. 实现暖灰无媒体 Hero。
3. 实现桌面单一悬停封面与移动端静态缩略图。
4. 为当前行、其他行、`VIEW` 状态和降低动效提供明确视觉状态。
5. 运行目标测试确认通过。

### Task 4: 重构支持能力章节

**Files:**
- Modify: `src/sections/home/SupportingSections.tsx`
- Modify: `src/sections/home/SupportingSections.test.tsx`
- Modify: `src/sections/home/SupportingSections.security.test.ts`
- Create: `src/styles/redesign-support.css`

1. 保持现有按需媒体安全测试先行。
2. 将玩法实验改为紧凑档案条目，将 StoneCity 与美工刀组织为暖灰视觉章节，将 NewFace 改为单一工具代表。
3. 保持一次只挂载一个视频或 iframe，移动端不自动播放。
4. 运行目标测试确认通过。

### Task 5: 建立 All Works 档案页

**Files:**
- Create: `src/pages/worksFilter.ts`
- Create: `src/pages/worksFilter.test.ts`
- Modify: `src/pages/WorksPage.tsx`
- Create: `src/styles/redesign-works.css`

1. 写分类映射、数量与排序的失败测试。
2. 实现五类筛选、动态数量、列表元数据和单一预览区。
3. 键盘聚焦复用悬停状态；没有封面的项目使用文字档案状态。
4. 运行目标测试确认通过。

### Task 6: 建立 About 与项目档案页

**Files:**
- Create: `src/data/profile.ts`
- Create: `src/data/profile.test.ts`
- Modify: `src/pages/AboutPage.tsx`
- Modify: `src/pages/ProjectPage.tsx`
- Create: `src/styles/redesign-pages.css`

1. 写隐私字段缺失、履历分组和原游戏网页保留的失败测试。
2. 从旧版迁移已存在的经历、教育、奖项和能力，不新增未经确认内容。
3. 两个核心游戏继续直接进入原网页；其他项目使用统一档案模板。
4. 运行目标测试确认通过。

### Task 7: 动效、响应式和可访问性收口

**Files:**
- Modify: `src/styles/interactions.css`
- Modify: `src/styles/redesign-home.css`
- Modify: `src/styles/redesign-support.css`
- Modify: `src/styles/redesign-works.css`
- Modify: `src/styles/redesign-pages.css`
- Modify: `src/main.tsx`

1. 补充移动菜单、焦点、触控、媒体失败和降低动效测试。
2. 统一进入动画、悬停反馈、页面切换和媒体裁切。
3. 在 48rem 以下重排，不只缩小桌面布局。
4. 删除新版不再使用的旧样式入口，但不删除旧网站与资源。

### Task 8: 验证与交付

**Files:**
- Verify: all changed files

1. 运行目标测试与完整测试。
2. 运行新增文件 ESLint 与生产构建。
3. 检查首页、`/works`、`/about`、两个游戏原网页和 NewFace 返回 HTTP 200。
4. 在浏览器检查桌面与移动端；若浏览器连接不可用，明确记录限制并将本地页面打开给用户验收。
5. 确认原游戏嵌入目录无改动，备份文件未跟踪且未暂存。
6. 提交并推送 `codex/redesign/game-focused`，不合并、不发布。
