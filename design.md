---
title: Zhu Yijia Portfolio Redesign
document_type: design_spec
status: approved_for_planning
owner: 朱翊嘉
updated: 2026-08-07
---

# Zhu Yijia Portfolio 改版设计规范

## 1. 文档职责

本文档只记录网站定位、信息架构、视觉原则、交互原则和已确认决策。

- 项目、素材与公开状态见 [content-inventory.md](./content-inventory.md)。
- 开发阶段、验收方式与 Git 规则见 [implementation-plan.md](./implementation-plan.md)。
- 原始未拆分版本保存在 [design-original-2026-08-07.md](./design-original-2026-08-07.md)。
- 未经确认的履历、项目、奖项、职责和数据不得生成或公开。

## 2. 已确认决策

| 项目 | 决策 |
| --- | --- |
| 中文姓名 | 朱翊嘉 |
| 英文品牌 | Zhu Yijia |
| 主职业定位 | Game Designer |
| 辅助能力 | Technical Art、interaction、real-time worlds、tools |
| ECHOFLASH | 个人作品 |
| Eraser's Odyssey | 个人作品 |
| 页面结构 | 混合式独立路由：首页使用锚点章节，Works、About 和项目详情使用独立路由 |
| 加载片头 | 保留；结构可优化，配色跟随新版视觉系统 |
| 第三个大型游戏 | 内容完成前不渲染，不使用空卡片或虚构信息 |

## 3. 定位与目标

网站从“简历和所有作品平均展示”调整为“以游戏项目为核心的专业作品集”。访客应在短时间内理解：

1. 朱翊嘉的主定位是 Game Designer。
2. ECHOFLASH 与 Eraser's Odyssey 是当前最重要的两个大型个人游戏项目。
3. Technical Art、工具开发、前端和个人经历用于补充证明系统思维与实现能力。

网站同时服务两种浏览方式：

- 招聘者快速确认定位、重点项目、个人职责、简历和联系方式。
- 专业负责人进入项目详情，查看玩法、系统、技术实现、制作过程与复盘。

体验权重约为 70% 清晰与专业、20% 游戏画面表现力、10% 网站交互个性。

## 4. 品牌与基础信息

网站不另造工作室名称，也不把 `Portfolio` 作为主要品牌。

| 场景 | 规则 |
| --- | --- |
| 导航品牌 | 全站统一使用 `ZHU YIJIA` 或 `Zhu Yijia`，最终字体确定后只保留一种 |
| 首页主标题 | 姓名 + Game Designer 定位 |
| 默认 SEO 标题 | `Zhu Yijia — Game Designer Portfolio` |
| 项目详情标题 | `项目名称 — Zhu Yijia` |
| All Works 标题 | `All Works — Zhu Yijia` |
| About 标题 | `About — Zhu Yijia` |
| 联系方式 | 网站以邮箱为主，不直接公开手机号或微信 |
| 版权年份 | 程序读取当前年份 |

最终中英文自我介绍、求职状态和目标岗位文案仍需确认。

## 5. 信息架构

```text
Home /
├─ Hero
├─ Selected Games #selected-games
├─ Gameplay Lab #gameplay-lab
├─ Worlds & Visual Systems #worlds
├─ Tools & Interactive Systems #tools
└─ Short About / Contact #contact

All Works /works
├─ Games
├─ Technical Art
├─ Tools & Systems
└─ Web Experiments

Project Detail /works/:slug
└─ 每个成熟项目的独立详情页

About /about
├─ Introduction
├─ Experience
├─ Education
├─ Selected Awards
├─ Capabilities
├─ Contact
└─ Resume Download
```

主导航固定为 `HOME / GAMES / ALL WORKS / ABOUT / CONTACT`。

- `HOME` 返回 `/` 顶部。
- `GAMES` 进入 `/#selected-games`。
- `ALL WORKS` 进入 `/works`。
- `ABOUT` 进入 `/about`。
- `CONTACT` 进入 `/#contact`。
- Gameplay Lab、Worlds 和 Tools 不占据主导航。

## 6. 首页结构

### 6.1 Loading Intro

保留现有加载片头的姓名与 `PORTFOLIO` 转换概念。配色跟随最终视觉系统；回访时允许跳过或显著缩短；支持 `prefers-reduced-motion`；片头时长和阶段数量在实现阶段通过实际体验验证。

### 6.2 Hero

展示姓名、Game Designer 主定位、一句简短说明、Selected Games 入口、About 或 Resume 入口，以及一个代表性游戏画面。

首屏不展示年龄、户籍、完整教育、完整奖项、软件清单和电话。画面优先使用经过压缩的静态图或短视频，不使用持续运行的 WebGL 背景。

### 6.3 Selected Games

当前展示两个大型个人项目：ECHOFLASH《白夜瞬闪》和 Eraser's Odyssey《橡皮奥德赛》。每个章节展示名称、类型、年份、个人职责、少量标签、封面和详情入口。第三个项目的数据接口提前保留，但资料完成前不渲染。

### 6.4 Gameplay Lab

将 IK 重定向、迭代缩小和跟随指针整合为紧凑实验区。每项只展示短说明、技术标签、封面和按需播放的短视频，不与大型项目竞争视觉权重。

### 6.5 Worlds & Visual Systems

用于证明 Level Art、环境构建、模型、材质和实时视觉能力。StoneCity 作为首要作品；Peak 与 Blade Runner 择一进入首页；Tajima Cutter 作为次级精选。

### 6.6 Tools & Interactive Systems

首页优先展示 NewFace、确认可公开后的 Meshy.ai 工具，以及一个成熟网页代表项目。没有真实公开素材时不显示空项目。

### 6.7 Short About / Contact

只保留简短介绍、当前状态、一至两条重点经历、邮箱、About 入口和简历下载入口。完整履历迁移至 `/about`。

## 7. All Works

All Works 是经过筛选的完整目录，不是旧项目仓库。

- 默认顺序：Games、Technical Art、Tools & Systems、Web Experiments。
- 显示年份、名称、主分类、本人职责和关键技术。
- 分类数量由项目数据自动计算。
- 重复、较弱、未完成或无法说明个人贡献的项目可以隐藏，但暂不删除源文件。

## 8. 大型游戏项目详情

```text
Hero / Gameplay Video
Overview
My Role
Gameplay Loop
Design Goals
Core Systems
Interaction & Feedback
Technical Implementation
Development Process
Result
Reflection / Post-mortem
Previous / Next Project
```

没有真实内容的章节不显示。详情必须明确这是个人作品、解决的问题、方案理由、迭代过程、最终影响，以及 AI 或第三方资源的使用边界（如适用）。

## 9. 视觉方向

> 暗色数字档案 × 游戏画面 × 编辑型排版

- 近黑背景，暖灰或米白文字，少量朱红或橙红作为状态色。
- 强调色只用于项目编号、筛选、交互状态和重点链接。
- 依靠网格、比例、字体层级、编号、间距和动效建立一致性。
- 不采用蓝紫科技渐变、玻璃拟态、大量发光或模板化未来科技风格。
- 最终字体、字号、色值和网格在重点项目封面确认后确定。

## 10. 动效原则

保留并统一标题进入、图片遮罩、封面轻微缩放、悬停预览、导航展开、页面遮罩转场和少量速度差。不采用全页 WebGL、持续粒子、多个自动播放背景视频、图片序列首屏、过度视差和移动端复杂自定义光标。

## 11. 性能与可访问性

- 同一时间最多播放一个项目预览视频。
- 列表媒体进入视口或悬停时才加载或播放，离开后暂停。
- 移动端默认使用静态封面；长视频由用户主动播放。
- 图片提供 WebP 或 AVIF 及合理尺寸；原始纹理和奖状不在首页加载。
- 动效优先使用 `transform` 和 `opacity`。
- 关闭动画、视频未播放或三维加载失败时，信息与导航仍然完整。
- 键盘焦点不能只依赖颜色；视频提供暂停方式；图片使用有意义的替代文本。

## 12. 验收标准

- 很快识别姓名和 Game Designer 主定位。
- 在约 30 秒内找到两个重点游戏项目及其个人职责。
- 能进入项目详情、All Works、About、简历和联系方式。
- 首页不出现完整履历、完整软件列表或十个网页项目。
- 移动端、降低动效或媒体加载失败时仍可完成主要浏览。

## 13. 待确认事项

- 第三个大型游戏项目的内容和发布时间。
- 两个现有大型游戏项目在首页的最终排序。
- Peak 与 Blade Runner 哪一个进入首页。
- 哪一个网页项目作为首页代表。
- Meshy.ai 项目的可公开边界。
- 最终中英文自我介绍与求职状态。
- 最终字体、色值、字号、姓名排版和分享图。
- 三维模型交互是否保留及其移动端降级方式。
- 简历文件、下载地址与中英文版本。
