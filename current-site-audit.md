---
title: Current Portfolio Baseline Audit
document_type: technical_audit
status: complete
owner: 朱翊嘉
updated: 2026-08-07
branch: codex/redesign/game-focused
baseline_commit: af81236
---

# 当前网站基线审计

## 1. 技术基线

| 项目 | 当前状态 |
| --- | --- |
| 框架 | React 19 + TypeScript + Vite 7 |
| 样式 | Tailwind CSS 3 + 全局 CSS |
| 动效 | GSAP、ScrollTrigger、Framer Motion |
| 路由 | 无路由库；单页锚点与 `scrollIntoView` |
| 测试 | 无测试框架、无 `test` 脚本 |
| 构建路径 | Vite `base: './'` |
| HTML 标题 | `TA Portfolio` |
| 部署配置 | 仓库内未发现独立部署配置文件 |

## 2. 页面职责

| 文件 | 当前职责 | 改版关注点 |
| --- | --- | --- |
| `src/App.tsx` | 组合单页、Lightbox、加载片头与页脚 | 页脚 HOME 与 ABOUT 均指向 `#about` |
| `src/components/Preloader.tsx` | 加载计数与文字转换 | 保留概念，调整配色与回访策略 |
| `src/sections/AboutSection.tsx` | 个人资料、履历、奖项与技能 | 完整内容迁移到 `/about` |
| `src/sections/WorksIndexSection.tsx` | 三类目录与锚点跳转 | 新首页不保留三类同权目录 |
| `src/sections/WorkDetailSection.tsx` | Design/Game 数据、卡片、筛选与媒体 | 数据和呈现高度耦合 |
| `src/data/codeProjects.ts` | Web 与 NewFace 数据 | 需要并入唯一项目数据源 |
| `src/components/code/*` | Code 卡片、预览和 Lightbox | 保留价值较高，适配统一模型 |
| `src/sections/StickyNavigation.tsx` | 单页导航 | 改为独立路由 + 首页锚点 |
| `src/components/SectionSnapController.tsx` | About/Works 滚动吸附 | 新结构下重新评估 |
| `src/sections/HeroSection.tsx` | 旧 Hero | 当前未被 `App.tsx` 使用 |

项目名称和入口目前重复维护在 `WorkDetailSection.tsx`、`codeProjects.ts` 与 `WorksIndexSection.tsx`，是 Phase 1 的主要重构对象。

## 3. 媒体基线

| 类型 | 数量 | 总体积 |
| --- | ---: | ---: |
| MP4 | 21 | 9.95 MB |
| PNG | 114 | 14.41 MB |
| JPG | 2 | 1.77 MB |
| WebP | 11 | 0.17 MB |
| SVG | 2 | 小于 0.01 MB |
| 合计 | 150 | 26.31 MB |

最大文件包括 4.28 MB 的 Tajima 纹理、2.57 MB 的 Eraser's Odyssey 过程图和 2.37 MB 的项目视频。项目媒体同时使用本地视频、Bilibili、Sketchfab 与独立 HTML，需要统一降级策略。

## 4. 构建与代码检查

`npm run build` 通过：

```text
2122 modules transformed
CSS 94.76 kB / gzip 16.36 kB
JS 524.01 kB / gzip 174.61 kB
```

已有警告：主 JS chunk 超过 500 kB、一个 Tailwind cubic-bezier 类名存在歧义、Browserslist 数据过旧。

`npm run lint` 失败，共 12 个既有错误：

- 三个组件在 effect 中同步设置 state。
- Lightbox Context 与多个通用 UI 文件违反 Fast Refresh 导出规则。
- `sidebar.tsx` 在 render 期间调用 `Math.random()`。

Phase 0 不修复旧错误。后续阶段不新增错误，并在涉及对应组件时逐步清理。

## 5. Phase 1 结论

1. 先建立测试框架，再重构项目数据。
2. 统一模型覆盖 Design、Game、Web 和 AI。
3. 首页精选、All Works、详情页和导航从唯一数据源派生。
4. 第一轮迁移保留现有媒体路径，不重编码或删除文件。
5. 路由在 Phase 2 接入，Phase 1 不改变页面导航行为。
