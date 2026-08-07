---
title: Phase 3 Design Decisions
document_type: design_addendum
status: confirmed
owner: 朱翊嘉
updated: 2026-08-07
branch: codex/redesign/game-focused
---

# Phase 3 设计校准

## 中文主导

- 姓名、职业定位、导航、章节标题、正文和主要操作使用中文。
- 英文仅用于项目原名、技术术语和小号辅助标签。
- 文案按中文信息顺序重新组织，不从英文逐句翻译。

## 视觉与动效

- 首页不能只呈现暗色文字列表；游戏画面必须成为视觉主体。
- 保留第一版的加载片头、互动反馈和个人辨识度。
- Phase 3 完成加载片头、首屏入场、滚动进入、图片遮罩与悬停缩放。
- Phase 7 负责性能、统一节奏和移动端降级，不延后核心动效。
- 排版使用不对称项目叙事，两个重点游戏不能与普通作品等权展示。

## 两个游戏网页

- ECHOFLASH 与 Eraser’s Odyssey 的现有网页不重构。
- `public/embed/echoflash-detail/` 与 `public/embed/eraser-odyssey/` 保持原样。
- 个人网站只负责首页入口、中文摘要、职责信息和网页容器。
- `/works/:slug` 嵌入原网页，同时提供独立打开入口。

## Phase 3 验收

- 首屏首先看到“朱翊嘉 / 游戏设计师”。
- 首页只突出两个真实个人游戏项目，并使用现有封面。
- 两个项目均能进入原有网页展示。
- 首页包含简短介绍、邮箱和 About 入口。
- 关闭动效或视频不可用时，文字、封面和导航仍完整。
