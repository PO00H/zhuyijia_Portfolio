---
title: Zhu Yijia Portfolio Redesign Implementation Plan
document_type: implementation_plan
status: ready_for_audit
owner: 朱翊嘉
updated: 2026-08-07
branch: codex/redesign/game-focused
---

# 改版实施计划

## 1. 目标与依据

在保留现有素材、可用交互、部署配置和提交历史的前提下，将网站改为以 Game Designer 为主定位的多页面作品集。

- [design.md](./design.md)：定位、结构、视觉与交互规则。
- [content-inventory.md](./content-inventory.md)：项目、素材、公开状态和缺失内容。

## 2. Git 规则

- 开发分支：`codex/redesign/game-focused`
- 基线分支：`feat/eraser-odyssey`
- 不直接修改 `main` 或线上稳定版本。
- 未确认用途的资源不删除。
- `echoflash-detail-index.html.bak` 等现有未跟踪备份不纳入改版提交。
- 每次提交只完成一个明确阶段。

推荐提交粒度：

```text
docs: split redesign specification and confirm decisions
chore: inventory existing routes and media
refactor: centralize portfolio project data
feat: add redesign shell and routing
feat: build game-focused home
feat: add gameplay lab and supporting sections
feat: add all works and about pages
feat: migrate project case studies
perf: optimize responsive media loading
test: verify navigation accessibility and responsive behavior
```

## 3. 技术架构

采用混合式独立路由：

- 首页 `/` 使用纵向章节与锚点。
- `/works` 使用独立 All Works 页面。
- `/about` 使用独立 About / Resume 页面。
- `/works/:slug` 使用统一项目详情模板。
- 首页章节使用 `/#selected-games`、`/#gameplay-lab`、`/#worlds`、`/#tools` 和 `/#contact`。

实现时优先采用 `react-router-dom` 管理内部路由，并确认部署环境支持 SPA fallback。若部署环境无法配置 fallback，再评估静态路径方案，不在组件中手写分散的路径判断。

建议目录：

```text
src/
├─ app/
│  ├─ AppRouter.tsx
│  └─ routes.ts
├─ pages/
│  ├─ HomePage.tsx
│  ├─ WorksPage.tsx
│  ├─ AboutPage.tsx
│  └─ ProjectPage.tsx
├─ sections/
│  ├─ home/
│  └─ project/
├─ components/
│  ├─ layout/
│  ├─ media/
│  └─ motion/
├─ data/
│  └─ projects.ts
└─ styles/
   └─ tokens.css
```

目录可根据代码盘点调整，但项目数据必须保持唯一来源。

## 4. 实施阶段

### Phase 0：当前版本基线

- 记录当前页面、组件、媒体、外部链接、动效和部署方式。
- 运行现有构建与基础检查。
- 记录已知问题，不在盘点阶段顺手重构。

完成条件：形成可核对的代码与媒体盘点，当前网站仍可构建。

### Phase 1：项目数据化

- 建立 `PortfolioProject` 类型和统一项目数据。
- 迁移 Design、Game、Code 与 `codeProjects.ts` 的重复数据。
- 加入 `visibility`、`ownership`、`roles`、`disciplines` 和首页章节字段。
- 保持现有文案含义，不生成新履历或项目事实。

完成条件：首页、筛选和详情入口从同一份数据派生。

### Phase 2：路由与新版外壳

- 建立 `/`、`/works`、`/about` 和 `/works/:slug`。
- 新建统一导航、页脚、页面容器、网格与设计 token。
- 修复 HOME 与 ABOUT 指向相同位置的问题。
- 更新页面标题、描述、图标与社交分享基础信息。

完成条件：所有页面可直接访问、刷新和互相导航。

### Phase 3：首页核心内容

- 调整并保留 Loading Intro，使配色匹配新版系统。
- 完成 Hero。
- 完成 ECHOFLASH 与 Eraser's Odyssey 两个 Selected Games 章节。
- 第三个游戏保持数据存在但不渲染。
- 完成 Short About / Contact。

完成条件：访客在约 30 秒内理解定位、找到两个大型个人项目和联系方式。

### Phase 4：首页支持内容

- 建立 Gameplay Lab。
- 建立 Worlds & Visual Systems。
- 建立 Tools & Interactive Systems。
- 未确认精选项目和保密内容不渲染。

完成条件：支持内容不与 Selected Games 竞争视觉权重。

### Phase 5：All Works 与 About

- 建立 `/works` 分类、筛选、数量统计和项目入口。
- 建立 `/about`，迁移教育、经历、奖项、技能、联系方式和简历入口。
- 删除公开页面上的年龄、户籍、手机号和微信。

完成条件：首页不再承担完整简历和全部作品目录。

### Phase 6：项目详情迁移

- 建立统一 Case Study 模板。
- 优先扩充 ECHOFLASH 与 Eraser's Odyssey。
- 迁移有价值的视频、Bilibili、Sketchfab 和嵌入演示。
- 明确个人作品、目标、系统、迭代、结果与复盘。

完成条件：两个重点游戏项目可以独立证明 Game Designer 能力。

### Phase 7：媒体与动效优化

- 同一时间最多播放一个预览视频。
- 视频按需加载、离开视口暂停、页面后台暂停。
- 移动端使用静态封面或低成本媒体。
- 生成合理尺寸的 WebP / AVIF 图片。
- 统一进入、悬停、筛选和页面转场。
- 支持 `prefers-reduced-motion`。

完成条件：关闭动画或媒体失败时，导航与项目信息仍然完整。

### Phase 8：验收与上线准备

- 检查桌面和移动端布局。
- 检查键盘操作、焦点、视频控制和替代文本。
- 检查所有内部路由、锚点、外部链接和直接刷新。
- 检查页面标题、描述、图标、分享信息和简历下载。
- 确认正式入口切换方式。
- 新版验收前不删除旧资源和旧首页实现。

完成条件：满足 [design.md](./design.md) 的验收标准，且生产构建通过。

## 5. 每阶段验证

每个阶段至少执行：

```powershell
npm run build
npm run lint
```

涉及页面或交互的阶段额外检查：

- 桌面宽屏、普通笔记本、平板和手机宽度。
- 鼠标、触屏和键盘操作。
- 直接访问和刷新 `/works`、`/about`、`/works/:slug`。
- 降低动效模式。
- 视频、图片或三维不可用时的降级。

如果现有代码本身存在 lint 错误，先记录基线，再区分旧问题与新增问题。

## 6. 暂停条件

遇到以下情况时暂停相关页面，不自行填补：

- 第三个大型游戏资料不完整。
- Meshy.ai 内容的保密边界不明确。
- 项目职责、AI 辅助或第三方资源归属不明确。
- 简历、联系方式或项目文案尚未确认。
- Peak、Blade Runner 或网页代表项目尚未选择。

框架可以继续开发，但未确认区域保持不渲染。

## 7. 完成定义

- 主定位明确为 Game Designer。
- ECHOFLASH 与 Eraser's Odyssey 明确为个人作品并拥有完整详情。
- 首页、All Works、About 和项目详情职责清晰。
- 所有公开项目来自统一数据源。
- 加载片头保留并匹配最终视觉系统。
- 网站在桌面、移动端、降低动效和媒体失败状态下均可浏览。
- 未确认内容没有以占位卡、虚构文案或虚构数据出现。
- 构建、导航、主要交互和外部链接完成验证。
