# Codex 执行清单：UE / C++ 作品集改版

> 本文件是 Codex 的执行控制表。设计目标与信息架构以 [`docs/portfolio-restructure-plan.md`](docs/portfolio-restructure-plan.md) 为唯一依据。
>
> 当前状态：Round 5 核心原型、像素 UI 与详细 visual / motion 规范已完成，等待用户后续验收  
> 当前允许阶段：Round 5 Prototype Review — 只验收 GAME WORK 核心联动、像素界面与两份详细规范；用户确认前不扩展其他区块  
> 当前分支：`codex/redesign/interactive-portfolio`

## 1. Codex 每轮工作协议

每次开始修改前必须：

1. 完整读取本文件和 `docs/portfolio-restructure-plan.md`。
2. 检查当前分支与未提交更改，保留用户已有修改。
3. 只执行“当前允许阶段”，不得顺手进入下一阶段。
4. 先复用现有内容、素材和独立 HTML，不擅自改写项目事实。
5. 发现缺失内容时使用明确占位或记录为待补，不编造项目成果、技术细节、公司信息和链接。
6. 修改后运行与本轮相关的检查，并在浏览器中检查桌面端和移动端。
7. 向用户汇报改了什么、哪些没改、检查结果和下一轮建议，然后停止等待确认。
8. 只有用户明确确认后，才把下一轮标记为“当前允许阶段”。

## 2. 全程禁止事项

- 不删除或搬动 `public/embed` 中现有独立项目页面。
- 不删除现有图片、视频、材质或预览文件。
- 不在结构阶段更换配色和字体。
- 不在结构阶段加入大规模滚动动画、3D、Canvas 或 WebGL。
- 不把 Upcoming UE / C++ Project 伪造成已经完成的项目。
- 不让 Design / Game / Code 恢复为同等权重的首页主导航。
- 不用动画掩盖尚未确认的信息层级。
- 不一次重写整个 `src/App.tsx` 后再统一排错；应按可验证区块逐步迁移。

## 3. 固定信息架构

首页顺序不得自行改变：

1. Hero / 职业定位
2. Featured Game Development / 核心游戏开发项目
3. Unreal Systems Lab / UE 技术实验
4. Industry Experience / 实习与生产实践
5. Relevant Visual & Pipeline Work / 与 UE 开发相关的辅助能力
6. Archive / 完整作品档案入口
7. Profile / 精简履历
8. Contact / 求职行动

核心项目固定为：

- Upcoming UE / C++ Project（正式预留位）
- ECHOFLASH
- Eraser's Odyssey — 《橡皮奥德赛》

首页辅助项目固定为：

- StoneCity — 石之城
- TAJIMA Cutter — PBR 美工刀

其余视觉、网页和 AI 项目保留在 Archive，不删除原文件。

## 4. 分轮执行清单

### Round 1 — 项目盘点与统一数据清单

状态：`DONE`

目标：只建立可靠的数据层，不改变当前页面外观与顺序。

- [x] 盘点现有项目数据、素材路径、预览视频和独立 HTML 入口。
- [x] 为全部项目建立统一 TypeScript 类型与项目清单。
- [x] 字段至少包含：`id`、`title`、`track`、`tier`、`status`、`featuredOrder`、`cover`、`preview`、`detailUrl`、`existingContentPath`、`tags`、`enabled`。
- [x] 加入 Upcoming UE / C++ Project，状态为 `reserved`，未知素材与链接保持 `null`。
- [x] 保留并校验 ECHOFLASH 与 Eraser's Odyssey 的入口。
- [x] 不修改现有页面布局、配色、字体和动画。
- [x] 输出“已映射 / 缺失 / 待用户确认”的文件清单。
- [x] 运行 TypeScript 构建与 lint；若原项目已有错误，区分既有错误和本轮新增错误。

验收点：所有现有项目都能在清单中找到，且没有移动素材文件。

### Round 2 — 静态首页结构骨架

状态：`DONE`

目标：按固定信息架构重排首页，先验证阅读顺序，不制作复杂动效。

- [x] 建立 8 个语义明确的页面区块。
- [x] Hero 明确写出 `UE / C++ Game Developer`。
- [x] Featured Game Development 紧接 Hero。
- [x] 三个 UE 小实验合并到 Unreal Systems Lab。
- [x] Industry Experience 以 Meshy.ai 为主、无端科技为次。
- [x] 05 只保留 StoneCity 与 Tajima Cutter。
- [x] Profile 不与 Industry Experience 重复大段内容。
- [x] 暂时关闭会干扰结构判断的入场动画和强制滚动效果。
- [x] 保留当前配色和字体。
- [x] 缩短 Hero，使姓名、岗位、能力概括与行动入口在紧凑首屏内成立。
- [x] 保持三个核心游戏项目为大尺寸主展示；Systems Lab 与 Relevant Work 改为紧凑交互索引。
- [x] 桌面端项目索引提供指针附近的视频 / 封面预览；所有设备点击词条均统一在下方展开或折叠内容。
- [x] Tajima Cutter 复现 Sketchfab 查看器与四张 PBR 贴图缩略图组合。

验收点：招聘方在 10 秒内能确认岗位方向，并看到核心游戏项目。

### Round 3 — Archive 与入口完整性

状态：`DONE`

目标：让首页变短，同时保证所有旧项目仍可访问。

- [x] 实现独立 `/archive` 页面或等价路由。
- [x] 收录 5 个 3D / Visual 项目。
- [x] 收录 10 个 Web Design 项目。
- [x] 收录 NewFace。
- [x] StoneCity 与 Tajima 可同时出现在首页精选和 Archive，但复用同一数据和素材。
- [x] 检查所有独立 HTML、封面和视频入口。
- [x] 首页只保留紧凑 Archive 入口与作品数量摘要。

验收点：无死链、无丢失项目、无重复素材文件。

### Asset Lab v1 — 素材裁切参数工具

状态：`DONE`

目标：在不改动原始素材的前提下，为图片和视频逐项确认统一裁切构图，并导出可供后续批处理使用的参数。

- [x] 新增仅本地使用的 `/asset-lab` 页面。
- [x] 从统一项目清单枚举图片与视频素材，去除重复路径。
- [x] 支持 16:9、4:3、1:1 比例切换。
- [x] 支持拖动、缩放、位置重置和前后素材切换。
- [x] 视频支持播放、封面帧、裁切起止时间设置。
- [x] 裁切选择保存在浏览器本地，并可标记为已确认。
- [x] 导出非破坏性的 JSON 参数，不生成、不覆盖原素材。
- [x] 完成桌面核心流程、移动端基本可用性、构建与相关 lint 检查。

验收点：用户可以连续处理素材、刷新后保留选择并成功导出 JSON；原始图片和视频没有发生变化。

### Asset Pipeline v1 — 生成并接入统一派生素材

状态：`DONE`

目标：根据用户确认的 Asset Lab JSON 非破坏性生成网页媒体，并让作品集读取派生映射。

- [x] 保存用户导出的 38 项裁切参数。
- [x] 生成 20 张 WebP 图片、18 个 H.264 MP4 视频与 18 张视频 poster。
- [x] 输出到全新的 `/public/derived/asset-lab-v1`，不覆盖原素材。
- [x] 生成 `portfolioDerivedAssets.json` 映射。
- [x] 项目清单展示层读取派生媒体，Asset Lab 继续读取原始素材。
- [x] 校验全部输出尺寸、已设置的视频时长、文件数量与源文件完整性。
- [x] 完成构建、相关 lint 与浏览器媒体路径检查。

验收点：网站使用用户确认的裁切版本；Asset Lab 仍能回到原始文件继续调整；原素材和独立 HTML 无变化。

### Round 4 — 响应式、导航与基础可用性

状态：`DONE`

目标：在动效加入前，把静态版本做到可用和稳定。

- [x] 桌面导航使用：`GAME WORK / SYSTEMS / EXPERIENCE / ARCHIVE / CONTACT`。
- [x] 移动端提供可操作菜单。
- [x] 检查常见桌面、平板和手机宽度。
- [x] 检查键盘焦点、按钮语义、媒体比例和文字溢出。
- [x] 检查构建、lint 和浏览器控制台。
- [x] 截图对比首页关键区域，等待用户确认结构。

验收点：没有复杂动效时，网站仍完整、清晰且可导航。

### Round 5 — 动效设计文档与核心原型

状态：`WAITING_FOR_REVIEW`

目标：先定义动效，再实现一处代表性联动；不同时给全站堆效果。

- [x] 使用 `web-animation-design`、GSAP Core、GSAP React、ScrollTrigger、Timeline 与 Performance 规范。
- [x] 提出服务于 UE / C++ 叙事的核心联动概念：`Runtime Signal Viewport / 运行时信号窗口`；`Runtime Trace` 只保留作辅助状态参考。
- [x] 完整重写 `docs/portfolio-motion-design.md`，记录元素、触发、Before、After、持续时间、缓动、强度、移动端替代、reduced-motion、性能和渐进增强。
- [x] 用户联合验收 `portfolio-motion-design.md` 与 `portfolio-visual-direction.md`，明确授权开始原型。
- [x] 先实现一处核心项目联动原型。
- [x] 检查滚动手感、触屏行为、性能和清理逻辑。
- [ ] 用户确认原型后，才扩展到其他区块。

验收点：动效帮助理解内容层级，而不是只有视觉噱头。

### Round 6 — 动效扩展、视觉评估与最终校验

状态：`BLOCKED_BY_REVIEW`

目标：完成获批动效，并最后决定是否调整配色和字体。

- [ ] 只扩展用户确认过的动效语言。
- [ ] 删除重复、无目的的淡入和文字打乱。
- [ ] 对比保留现有配色 / 字体与候选方案，不默认更换。
- [ ] 若更换视觉系统，先提供对照和理由，获批后实施。
- [ ] 完成桌面、移动端、键盘、reduced-motion、性能和链接回归检查。
- [ ] 更新 README 或维护说明，记录新增真实 UE 项目的替换方法。

验收点：内容、结构、动效和视觉服务于同一个 UE / C++ 求职定位。

## 5. 状态更新规则

可用状态：

- `NEXT`：本轮允许执行。
- `IN_PROGRESS`：Codex 正在执行。
- `WAITING_FOR_REVIEW`：本轮完成，等待用户检查。
- `DONE`：用户已确认。
- `BLOCKED_BY_REVIEW`：前一轮尚未确认，不得开始。
- `BLOCKED_BY_CONTENT`：缺少必须由用户提供的真实素材或信息。

每轮结束时，Codex必须在本文件末尾追加一条简短记录：

```text
YYYY-MM-DD — Round N — WAITING_FOR_REVIEW
修改：
检查：
未修改：
需要用户确认：
```

## 6. 用户每轮如何下达任务

无需重复粘贴完整方案。每轮只需发送类似下面的一句话：

```text
请完整读取 CODEX_TODO.md 和 docs/portfolio-restructure-plan.md，只执行当前标记为 NEXT 的阶段。完成检查后更新 TODO 状态并停下来等我验收，不要提前做下一轮。
```

如果本轮效果不满意，继续在同一轮提出修改；不要把下一轮任务混入当前 prompt。

## 7. 执行日志

2026-08-11 — Round 1 — WAITING_FOR_REVIEW  
修改：新增统一清单 `src/data/portfolioProjects.ts`，映射 23 个项目和 2 段行业经历；新增 `docs/project-file-inventory.md`。  
检查：生产构建通过；新清单 lint 通过；51 个已声明本地路径全部存在；桌面与手机页面无水平溢出、控制台无错误。完整 lint 仍有实施前已存在的 12 个错误，本轮没有新增。  
未修改：页面组件、当前渲染数据源、布局、配色、字体、动画、素材文件和独立 HTML。  
需要用户确认：清单分级与缺失项记录是否准确；确认后才能将 Round 1 标为 `DONE` 并开放 Round 2。

2026-08-11 — Round 2 — WAITING_FOR_REVIEW  
修改：按固定顺序建立 8 个静态首页区块；GAME 上提；合并 Systems Lab；建立主次分明的行业经历；首页辅助项目只保留 StoneCity 与 Tajima；Archive 仅提供下一阶段入口说明；移除首页预加载、强制吸附滚动和旧 GSAP 入场链路。  
检查：生产构建通过；本轮新增与修改文件 lint 通过；桌面浏览器确认 8 个区块顺序、核心项目与行业经历层级，控制台无错误；手机检查发现约 17px 横向溢出后已通过收紧标题和 Grid 最小宽度修正。完整 lint 仍为原有 12 个错误，本轮无新增。  
未修改：原素材位置、独立 HTML、项目事实、现有配色与字体；未创建 Archive 路由，未加入正式动效。  
需要用户确认：首页信息顺序、核心项目尺寸关系、Systems Lab 合并方式、Industry Experience 主次关系与整体静态阅读节奏。

2026-08-11 — Round 2 Revision — WAITING_FOR_REVIEW  
修改：根据验收意见将核心项目、Systems Lab、Industry Experience、Relevant Work 与 Profile 统一改为纵向单列；媒体在上、信息在下；图片与视频优先完整显示，不再依赖横向拼接或强制裁切。  
检查：生产构建与本轮 lint 通过；桌面端所有主要内容网格均为单列；手机端单列宽度 336px，页面宽度 384px，无横向溢出；浏览器控制台无错误。  
未修改：内容顺序、项目事实、素材路径、配色、字体、Archive 和动效阶段。  
需要用户确认：新的纵向阅读节奏是否可以作为后续 Archive 与动效设计的结构基准。

2026-08-11 — Round 2 Hierarchy Revision — WAITING_FOR_REVIEW  
修改：保留三个核心游戏项目的大尺寸纵向展示；缩短 Hero；将 Systems Lab 和 Relevant Work 改为横向名称索引，桌面悬停 / 聚焦显示指针附近的视频或封面，触屏采用行内预览；Tajima Cutter 恢复 Sketchfab 查看器并在角落叠放四张 PBR 缩略图。计划中同时明确 Round 3 的 Archive 使用分类筛选、高密度名称列表与固定预览区，但尚未实现。  
检查：生产构建与本轮组件 lint 通过；桌面端预览跟随、视频来源、Tajima 查看器和四张贴图均已验证，控制台无错误；手机宽度 384px 时页面宽度同为 384px，无横向溢出，项目行自动收为两列。  
未修改：三个核心项目的内容与入口、项目事实、素材位置、配色、字体；未创建 Archive 路由，未进入正式全站动效阶段。  
需要用户确认：Hero 高度与信息密度、核心项目和辅助索引的层级差、悬停预览的大小与位置、Tajima 复现方式是否可作为 Round 2 最终结构基准。

2026-08-11 — Round 2 Disclosure Revision — WAITING_FOR_REVIEW  
修改：统一 Systems Lab、StoneCity 和 Tajima Cutter 的点击行为；所有项目词条点击后均在原位置下方展开，再次点击折叠，同时只允许同一区块展开一个项目。移除 Systems 与 StoneCity 的弹出查看界面，悬停预览继续保留为快速浏览提示。  
检查：生产构建与相关组件 lint 通过；逐项验证 IK、迭代缩小、StoneCity 和 Tajima 均正确展开，项目切换会折叠前一项；Tajima 的 Sketchfab 与四张 PBR 贴图保持完整；桌面端和 384px 手机宽度均无横向溢出，手机展开内容自动改为单列。  
未修改：核心三个游戏项目、Archive、项目事实、素材位置、配色和字体。  
需要用户确认：统一后的词条展开方式与展开内容信息量是否合适。

2026-08-11 — Asset Lab v1 — WAITING_FOR_REVIEW  
修改：新增仅开发环境开放的 `/asset-lab`；从统一清单枚举并去重 38 个图片 / 视频素材；实现 16:9、4:3、1:1 裁切框、拖动、缩放、位置控制、视频播放与封面帧、双端裁切范围、前后切换、筛选、确认状态、本地持久化和 JSON 导出。新增概念图与实现对照图。  
检查：生产构建和 Asset Lab 相关 lint 通过；桌面 1536×1024 对照概念图检查三栏结构、配色、字体、媒体视口、检查器与时间轴；384px 手机宽度无横向溢出；图片 / 视频切换、确认状态刷新保留、双裁切手柄和 Export JSON 均已验证。  
未修改：所有原始图片、视频和独立 HTML；没有生成派生文件，没有把裁切参数接入首页，也没有进入 Archive 或正式动效阶段。  
需要用户确认：资产枚举是否符合预期、三种比例是否足够、裁切视口与参数面板是否顺手；确认后再决定是否开发 FFmpeg / 图片批量输出阶段。

2026-08-11 — Asset Pipeline v1 — WAITING_FOR_REVIEW  
修改：导入用户确认的 38 项 JSON；新增可复用的图片 / FFmpeg 批处理与验证脚本；在 `/public/derived/asset-lab-v1` 生成 20 张裁切 WebP、18 个无声 H.264 MP4 和 18 张视频 poster；新增派生映射并让作品集媒体读取该映射，Asset Lab 继续读取原始清单。  
检查：56 个输出文件全部存在，总计 19.94 MB；图片、视频和 poster 尺寸全部匹配 16:9 / 4:3 / 1:1 配置，已设置的视频裁切时长误差小于 0.25 秒；源文件处理前后哈希一致；构建、相关 lint 和浏览器路径检查通过，首页 Systems 展开视频使用 `/derived/asset-lab-v1/game-003/UE1-crop.mp4`。  
未修改：所有原始图片、视频、贴图、独立 HTML 和项目事实；没有删除旧素材。  
需要用户确认：统一裁切后的核心项目、Systems Lab、Relevant Work 与后续 Archive 素材构图是否满意。

2026-08-11 — Asset Pipeline v1 Typography Revision — WAITING_FOR_REVIEW  
修改：收紧展开详情标题的响应式字号上限，并加入 `word-break: keep-all`、平衡换行与极端长词兜底规则，避免中文项目名在单个汉字之间形成难看的孤行。  
检查：1920px 宽度下《StoneCity》石之城保持单行，字号 45.12px；384px 页面宽度下保持单行，字号 25.6px；两种宽度均无横向溢出；构建与相关 lint 通过。  
未修改：项目名称、正文、媒体、整体网格、配色和字体。  
需要用户确认：详情栏长标题的新字号和断行节奏是否合适。

2026-08-11 — Asset Lab / Pipeline v1 — DONE  
确认：用户暂时验收通过 Asset Lab、统一派生素材接入与长标题排版修订。  
状态：Asset Lab v1 与 Asset Pipeline v1 标记为 `DONE`；Round 3 标记为 `NEXT`。  
未执行：未开始 Archive 实现，也未改动 Round 4 及后续阶段。

2026-08-11 — Round 3 — WAITING_FOR_REVIEW  
修改：新增独立 `/archive` 页面，接入 5 个 3D / Visual、10 个 Web Design 与 NewFace；桌面采用分类筛选、高密度列表和固定预览区，手机采用词条下方行内预览；首页 Archive 收紧为 16 项数量摘要与单一入口；视频复用 Asset Pipeline poster，未复制素材。用户在验收修订中移除 1 个外部模型项目及其 Sketchfab 映射。  
检查：生产构建与本轮相关 lint 通过；保留项目的 Archive 源素材路径存在，15 个本地发布入口 HTTP 状态均为 200；Tajima Sketchfab 模型在线可访问；1280px 桌面和 384px 手机的筛选、键盘选择、预览、长标题及无横向溢出检查通过；浏览器控制台无警告或错误。完整 lint 仍有 16 个既有错误，均位于本轮未修改的旧组件与通用 UI 文件。  
未修改：原始图片、视频、贴图、独立 HTML、项目事实、现有配色和字体；未进入 Round 4 导航与基础可用性阶段，也未加入正式动效。  
需要用户确认：Archive 的首屏尺度、分类筛选、桌面固定预览、手机行内预览，以及首页紧凑入口是否可作为 Round 3 最终结果。

2026-08-11 — Round 3 Archive Naming Revision — WAITING_FOR_REVIEW  
修改：按用户确认的新版命名文档，将 5 个 3D / Visual、10 个网站应用与 NewFace 共 16 个标题同步到统一项目清单；兼容数据和旧版项目索引同步改名；修复命名文档表格格式并标记为 v4 已应用。  
检查：确认 16 个项目 ID 与最终名称一一对应；生产构建与相关 lint 通过。  
未修改：独立 HTML、图片、视频、封面、链接、项目说明、配色、字体与动效。  
需要用户确认：Archive 与首页精选中的新标题是否符合预期。

2026-08-11 — Round 3 Archive Alignment Revision — WAITING_FOR_REVIEW  
修改：首页 Archive 摘要的三个分类格与下方入口统一使用同一响应式水平内边距；移除首格左侧和末格右侧的归零特例，使模块内部左右留白对称。  
检查：桌面端分类标题与入口文字左基线一致，左右内边距均为 19.52px；384px 手机端统一为 16px，三列保持等宽且无横向溢出；生产构建与相关 lint 通过。  
未修改：Archive 页面结构、项目名称、数量、配色、字体、交互和媒体。  
需要用户确认：首页 Archive 摘要区的新对齐方式是否可作为 Round 3 最终排版。

2026-08-11 — Round 3 — DONE  
确认：用户通过 Round 3 的项目文本、入口、命名与首页 Archive 对齐修订。  
状态：Round 3 标记为 `DONE`，开放并执行 Round 4。  
未执行：未进入 Round 5 动效设计与核心原型。

2026-08-11 — Round 4 — WAITING_FOR_REVIEW  
修改：保留桌面端 `GAME WORK / SYSTEMS / EXPERIENCE / ARCHIVE / CONTACT` 五项导航；新增真正可操作的移动菜单、菜单开关语义、自动聚焦、Esc 返回、点击外部与跨断点关闭；首页和 Archive 新增“跳到主要内容”；为首页锚点加入吸顶导航偏移。  
检查：在 384、768、1024、1440px 宽度检查首页，并在 384px 检查 Archive；移动菜单点击与 Esc 流程、锚点落点、44px 以上开关、54px 菜单词条、16:9 Archive 媒体、长文字与水平溢出均通过；可见按钮和链接均有名称，图片均有 alt，iframe 均有 title；桌面与手机关键区域截图通过，浏览器控制台无警告或错误；TypeScript、生产构建与本轮相关 lint 通过。完整 lint 仍有 16 个既有错误，均位于本轮未修改的旧组件、通用 UI 和旧 hooks。  
未修改：项目事实、项目顺序、独立 HTML、图片、视频、配色、字体和正式动效；Round 5 仍保持锁定。  
需要用户确认：桌面导航、移动菜单、首页与 Archive 的响应式静态版本是否可作为 Round 4 最终结果。

2026-08-11 — Round 4 — DONE  
确认：用户通过桌面导航、移动菜单、首页与 Archive 的响应式和基础可用性验收。  
状态：Round 4 标记为 `DONE`；Round 5 进入准备阶段。  
未执行：尚未实现任何正式 GSAP 原型，也未进入 Round 6。

2026-08-11 — Round 5 Preparation — IN_PROGRESS  
修改：完整读取动效规范并新增 `docs/portfolio-motion-design.md`；确定 `Runtime Trace / 运行时轨迹` 核心概念，记录五个同属一套原型的触发、结果、时长、缓动、强度、移动端替代与 reduced-motion 降级。  
检查：确认 GSAP、`@gsap/react` 已安装；检查现有 GAME WORK 组件边界、CSS、桌面页面结构和滚动长度；原型限定在核心游戏区。  
未修改：页面组件、样式、项目内容、媒体、配色、字体和当前交互；尚未写入 GSAP 原型。  
需要用户确认：是否采用 `Runtime Trace` 作为 Round 5 唯一代表性联动，并据此开始原型实现。

2026-08-11 — Round 5 Visual Direction — IN_PROGRESS  
修改：下载并完整分析 `tait-crt-interface-skill` 的提示词、色板与样式规则；核对用户两张参考图和月之暗面官方招聘站；新增 `docs/portfolio-visual-direction.md`，提出 `Pixel Signal / 像素信号场` 视觉方向和 `Runtime Signal Viewport / 运行时信号窗口` 原型候选；将未获采纳的 `Runtime Trace` 文档标记为暂停。  
检查：明确图二负责现代黑底与荧光像素、月之暗面负责滚动聚合/拆散、tait 只负责局部 CRT 栅格和诊断层级；区分可转译网页的规则与文生图专用规则。  
未修改：页面组件、样式、配色、字体、媒体、项目内容和当前交互；未运行下载技能中的图像处理脚本；尚未实现 GSAP 原型。  
需要用户确认：是否采用候选色彩方向与 `Runtime Signal Viewport`，确认后再重写正式动效登记表。

2026-08-11 — Round 5 Design Gate — WAITING_FOR_REVIEW  
修改：完整重写 `docs/portfolio-motion-design.md`，将核心概念改为 `Runtime Signal Viewport / 运行时信号窗口`；定义桌面共享粘滞媒体窗口、三个真实项目状态、560ms 像素拆散 / 聚合时间线、辅助诊断信息、平板与手机静态替代、reduced-motion、渐进增强、性能预算和原型文件边界。  
检查：逐项对齐 `docs/portfolio-visual-direction.md`、固定信息架构与现有 `FeaturedGamesSection.tsx`；确认预留 UE 项目不伪造媒体，ECHOFLASH 与 Eraser's Odyssey 仅复用现有真实素材；核对 GSAP React、ScrollTrigger、Timeline、Performance 与网页动效规范。  
未修改：网页组件、CSS、项目清单、配色、字体、图片、视频、独立 HTML、当前交互与其他七个首页区块；尚未实现 Round 5 原型。  
需要用户确认：联合验收两份文档中的核心概念、GAME WORK 局部候选配色、桌面 / 移动端分工和首版技术边界；确认后才开始 Round 5 原型。

2026-08-11 — Round 5 Core Prototype — WAITING_FOR_REVIEW  
修改：在 GAME WORK 内实现 `Runtime Signal Viewport`；桌面使用 65/35 共享粘滞媒体窗口与三项目条目，项目跨过阅读中心时通过单一 560ms GSAP 时间线切换真实媒体、有限像素信号和真实诊断字段；GAME WORK 局部试用黑、酸性黄绿与灰白视觉系统。平板和手机保留完整纵向项目，平板仅有一次低强度像素边缘反馈。  
检查：构建与本轮 lint 通过；在 1440、1100、1024、768、384px 检查布局和水平溢出；快速向下、向上滚动能切到最新项目，键盘聚焦即时切换且像素层保持静止；跨 1100px 断点后共享窗口、ScrollTrigger 和增强属性正确清理；最终浏览器控制台无警告或错误。reduced-motion 通过代码与样式路径核对为完全静态纵向结构。  
未修改：项目清单与项目事实、原始或派生媒体、项目入口和 lightbox；Hero、Systems、Experience、Relevant Work、Archive、Profile、Contact、全站导航、全站字体与其他区块配色均未修改；未进入 Round 6。  
需要用户确认：GAME WORK 的黑色舞台、共享窗口比例、项目切换手感、诊断信息密度，以及平板 / 手机纵向降级是否通过；确认前不把 Pixel Signal 扩展到其他区块。

2026-08-11 — Round 5 Pixel UI / Typography Revision — WAITING_FOR_REVIEW  
修改：保留已通过的黑、酸性黄绿与灰白配色及 560ms 项目切换；在 GAME WORK 局部接入 OFL-1.1 的 Fusion Pixel 12px 简体中文比例字体，将英文主标题、中英项目短标题、编号、状态、标签、按钮和诊断栏纳入像素字系统；以 12px 网格、6px 半格、阶梯角、棋盘状态段和硬边窗口栏强化复古像素 UI。未增加用户否定的右侧常驻像素主体。  
检查：生产构建与 GAME WORK 相关 lint 通过；字体文件和许可证存在，浏览器确认字体真实加载；1440px 与 1100px 启用共享窗口，1024px 与 384px 使用纵向结构，均无水平溢出；中英文像素字、24px 手机项目标题、44px 以上触控目标和项目切换后的像素退场均通过；浏览器控制台无警告或错误。  
未修改：其他七个首页区块、全站字体、项目事实、媒体、入口、lightbox、项目顺序和现有动效时长；未进入 Round 6。  
需要用户确认：GAME WORK 的像素字比例、标题尺度、阶梯角与诊断窗口密度是否形成目标中的“图二现代像素 + 图一 CRT UI”风格；确认前不扩展到全站。

2026-08-11 — Round 5 Visual / Motion Documentation Refinement — WAITING_FOR_REVIEW  
修改：将视觉方向细化为可执行规范，补充颜色、字体、12px 网格、间距、窗口层级、组件映射、媒体处理、响应式规则、风格密度与验收清单；检索并分析 GitHub / Reddit 的像素 UI、Sprite、CRT 和像素作品集案例，将动效规范更新为 v3，明确采用统一整数像素尺度与现有 560ms 切换，限制采用 hover 单次像素图标与 Sprite mask，拒绝持续故障、长加载、全屏 Canvas、自定义鼠标和每像素加载。  
检查：两份文档与现有 Runtime Signal Viewport 实现、已通过配色、Fusion Pixel 字体、桌面 / 移动端分工和 Reduced motion 路径逐项对齐；生产构建与本分支新增 / 修改页面的定向 lint 通过。完整 lint 仍有 16 个既有错误，均位于本轮未修改的旧光标、预加载器、通用 UI 与旧 hook；本轮未新增错误。研究结论按信息作用、触发、频率、媒体可读性、输入一致、降级、性能和清理八项标准记录。  
未修改：网页组件、CSS、项目事实、媒体、入口、项目顺序、现有 560ms 动效和其他七个首页区块；未进入 Round 6。  
需要用户确认：下次继续时联合验收 visual v2、motion v3 与 GAME WORK 当前原型；确认前不扩展像素语言或新增动效。
