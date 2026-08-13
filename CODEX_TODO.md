# Codex 执行清单：UE / C++ 作品集改版

> 本文件是 Codex 的执行控制表。设计目标与信息架构以 [`docs/portfolio-restructure-plan.md`](docs/portfolio-restructure-plan.md) 为唯一依据。
>
> 当前状态：Round 9A 初版的作品媒体 ASCII 化展示对象已被否决；规范修订完成，实验页等待返工
> 当前允许阶段：Round 9A Revision — `NEXT`；本次仅更新文档并上传分支，用户再次授权前不修改实验页，也不开始 Round 9B
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

状态：`DONE`

目标：先定义动效，再实现一处代表性联动；不同时给全站堆效果。

- [x] 使用 `web-animation-design`、GSAP Core、GSAP React、ScrollTrigger、Timeline 与 Performance 规范。
- [x] 提出服务于 UE / C++ 叙事的核心联动概念：`Runtime Signal Viewport / 运行时信号窗口`；`Runtime Trace` 只保留作辅助状态参考。
- [x] 完整重写 `docs/portfolio-motion-design.md`，记录元素、触发、Before、After、持续时间、缓动、强度、移动端替代、reduced-motion、性能和渐进增强。
- [x] 用户联合验收 `portfolio-motion-design.md` 与 `portfolio-visual-direction.md`，明确授权开始原型。
- [x] 先实现一处核心项目联动原型。
- [x] 检查滚动手感、触屏行为、性能和清理逻辑。
- [x] 用户已确认核心原型；Round 5 到此结束，其他区块的扩展统一进入 Round 6。

验收点：动效帮助理解内容层级，而不是只有视觉噱头。

### Round 6 — 动效扩展、视觉评估与最终校验

状态：`DONE`

目标：完成获批动效，并最后决定是否调整配色和字体。

- [x] 只扩展用户确认过的动效语言。
- [x] 删除重复、无目的的淡入和文字打乱。
- [x] 对比保留现有配色 / 字体与候选方案，不默认更换。
- [x] 若更换视觉系统，先提供对照和理由，获批后实施。
- [x] 完成桌面、移动端、键盘、reduced-motion、性能和链接回归检查。
- [x] 更新 README 或维护说明，记录新增真实 UE 项目的替换方法。

Round 6A 审计与确认门：

- [x] 对照 Pixel Signal visual / motion 规范审计八个首页区块、全站导航和 Archive 入口。
- [x] 识别旧自定义光标、持续跟随预览和无当前状态导航与新规范的冲突。
- [x] 将拟议视觉范围、唯一新增动效、清理项和响应式降级写入 `docs/round-6a-visual-motion-proposal.md`。
- [x] 用户确认 Round 6A 提案后，才开始 Round 6B 页面实施。

Round 6B 页面实施：

- [x] 删除旧橙色自定义光标，恢复浏览器原生光标与控件自身的 hover / focus 反馈。
- [x] Systems / Relevant Work 的桌面悬浮预览只在进入词条时定位一次，不再随 `pointermove` 持续移动。
- [x] 将折叠展开时间由 200ms 收敛为 180ms，不改动原有内容结构。
- [x] 为桌面与移动导航加入当前区块 Signal、真实 01–08 编号与 `aria-current="location"`。
- [x] 将 Fusion Pixel、硬边框、静态校准标记扩展到 Hero、区块英文标题、编号、状态、标签和按钮；中文正文继续使用易读字体。
- [x] 保留浅灰 / 橙色内容表面与黑 / 酸性黄绿 GAME WORK 表面，不改项目内容、媒体、链接和 560ms 核心切换。
- [x] 完成针对性 lint、生产构建、桌面 / 手机、导航、预览锚点、Archive 与水平溢出检查。
- [x] 用户验收 Round 6B 页面实现。

Round 6C 全站 Pixel Signal 修订：

- [x] 将深色 Pixel Signal 配色完整扩展到首页全部区块与 Archive 页面。
- [x] GAME WORK 保留为全站唯一高强度 560ms 像素切换，其他区块只使用低强度状态动效。
- [x] 移除浅灰 / 橙色旧表面及持续跟随鼠标的背景效果，保留静态像素网格。
- [x] 完成桌面、手机、键盘、Reduced Motion、性能与链接回归检查。
- [x] 更新 visual / motion / Round 6A 提案与本 TODO，等待用户最终验收。

Round 6C 页面审查与信息层级收敛：

- [x] Round 2A：完成 Hero 可读性、桌面双栏重排，以及 Systems / Relevant Work 紧凑技术索引；用户已验收。
- [x] Round 2B：为实习项目经历加入轻度三栏工程记录标题；用户选择保留大标题版本并已验收。
- [x] Round 2C-A：将 Archive 改为目录封面条，加入动态总数与窄屏分类适配；用户已验收。
- [x] Round 2C-B：只处理 Profile，将其收敛为中等强度的履历入口，优先呈现教育、经历、技能和奖项；用户已验收。
- [x] Round 2C-C（`DONE`）：只处理 Contact，将其改为低强度页面收尾与求职行动区；邮箱、电话 / 微信、真实简历、GitHub 四个入口保持同级；用户已验收。
- [x] Round 2C-D（`DONE`）：2C-A、2C-B、2C-C 全部通过后，只做三个尾部区块的联合间距、导航当前状态和响应式回归，不再引入新构图语言；用户已验收。

Round 2C-B 验收点：Profile 与 Archive、GAME WORK 的视觉职责不同；HR 能快速找到履历信息；桌面和手机均无横向溢出，页面长度确实缩短。

Round 2C-C 验收点：页面结尾感明确，四个联系格层级一致；邮箱使用像素字体但不放大，简历与 GitHub 链接准确可用。

Round 2C-D 验收点：页面后半段栏目归属清楚、整体长度下降、导航状态正确，并完成桌面、平板、手机、键盘与 Reduced Motion 检查。

验收点：内容、结构、动效和视觉服务于同一个 UE / C++ 求职定位。

### Round 8 — 真实像素材质与差异化视觉验证

状态：`ROUND_8A_DONE / ROUND_8B_DONE / ROUND_8C_DONE / ROUND_8D_WAITING_FOR_REVIEW`

目标：在不直接重做首页的前提下，验证低分辨率采样、受限色阶、有序抖动和逐帧像素重组是否能形成区别于现有 DOM 方块的真实像素材质。

Round 8A — Pixel Material Lab：

- [x] 新增仅本地开发环境可访问的 `/pixel-lab`。
- [x] 同屏比较现有矢量方块、静态抖动色阶与动态像素 MG 三种实现。
- [x] 允许调整内部分辨率、色阶数量、抖动强度与更新帧率。
- [x] 方案 A 只把当前 Acid Lime 作为激活色，不把参考图色板视为网站最终配色。
- [x] 动态 Canvas 必须以低分辨率位图计算、最近邻放大，不使用大量 DOM 方块冒充像素渐变。
- [x] 提供 560ms 转场重播、暂停和 Reduced Motion 静态降级。
- [x] 完成桌面、手机、键盘、性能、构建与定向 lint 检查。
- [x] 用户确认默认参数为 160×90、5 色阶、72% 抖动、12 FPS，并通过 Round 8A 实验页验收。

Round 8B — ASCII / Dither A-B 转场实验：

- 将 [ASCII Magic](https://www.ascii-magic.com/) 设为高权重实现与展示参考，重点参考“现代可读 UI 包裹真实字符 / 抖动媒体”的关系，不复制其产品编辑器密度、品牌、字体或配色。
- 先在 `/pixel-lab` 比较“纯 Dither Matrix 重组”与“Dither + 短时 ASCII Reveal”两种 560ms 方案；用户选定后才接入 GAME WORK。
- ASCII / Dither 只在项目切换过程中短暂出现，稳定状态必须回到清晰真实媒体；Hero、Archive 和其他区块不增加常驻字符主体或循环材质动画。
- 最终网站配色继续留待单独讨论，ASCII Magic 与风格图的色系均只作参考。
- [x] 使用 ECHOFLASH 与 Eraser's Odyssey 的现有真实媒体建立切换样本。
- [x] 方案 A 实现纯 Dither Matrix 的 560ms 量化、解析、重组与稳定过程。
- [x] 方案 B 实现 Dither + 短时 ASCII Reveal，并由媒体亮度驱动字符而非随机装饰。
- [x] 两种方案并排、共用默认参数，提供同步重播、交换项目素材和 380ms 冻结对照控制。
- [x] 手机改为纵向比较；Reduced Motion 直接显示稳定媒体或静态量化帧。
- [x] 完成构建、定向 lint、桌面交互、响应式规则、键盘、性能和首页回归检查。

Round 8C — 方案 A 连续交接与 GAME WORK 接入：

- [x] 用户选择方案 A：纯 Dither Matrix；方案 B 只保留为实验页历史参考。
- [x] 将“旧媒体先挖空、新媒体再显影”改为旧 / 新像素在同一 Bayer 矩阵内直接交接，消除整帧硬黑断层。
- [x] 将 160×90、5 色阶、72% 抖动、12 FPS、560ms 的方案 A 接入桌面 GAME WORK 共享媒体窗口。
- [x] 移除共享媒体窗口的 32 个 DOM 装饰方块；正式切换只使用单个低分辨率 Canvas，稳定后完全隐藏。
- [x] Upcoming 预留项目只生成抽象系统占位帧，不伪造项目截图；ECHOFLASH 与《橡皮奥德赛》继续使用真实派生封面。
- [x] Canvas 未预载完成时使用无黑场的重叠淡化兜底；键盘切换、1100px 以下与 Reduced Motion 保持既有静态 / 即时降级。
- [x] 完成生产构建、定向 lint、实验页 380ms 帧、桌面正反向切换、快速滚动中断、稳定清理和首页溢出检查。

Round 8D — 静态低分辨率材质原型（`REJECTED / REVERTED`）：

- [x] 用户明确否决静态像素材质、章节进度带、Runtime 静态颗粒与“像素方格模拟像素”的方向。
- [x] 删除 `StaticPixelMaterial` 及其栏目标题、GAME WORK 和 CSS 接入；保留 Round 8C 已验收的动态切换作为临时基线。
- [x] 视觉与动效规范从 Pixel Signal 重写为 ASCII Terminal Draft，不再把静态像素带作为未来规范。
- [x] 新增 ASCII 全站研究与分轮计划；在新原型通过前不继续扩大像素改造。

Round 9A — ASCII Material & Interaction Lab Revision（`NEXT`）：

- [x] 只新增本地 `/ascii-lab`，不修改正式首页。
- [ ] 移除 ECHOFLASH 和其他作品媒体的 ASCII 转换，把实验源替换为程序化网站布局字符场。
- [ ] 使用同一个网站场比较 Characters、Block Characters 与当前 Dither，确认字符和像素的媒介差异。
- [x] 提供暖琥珀、冷青灰、灰紫三套低饱和终端色板，以及字符坡度、网格、对比度和边缘参数。
- [ ] 在新网站字符场上复核高功率字符蔓延的 AUTO ONCE / CTA TRIGGER 对照。
- [ ] 在新网站字符场上复核鼠标 LUMINANCE / FLOW / REPEL 三种局部交互。
- [ ] 重新完成真实 FPS、字符格数量、停绘、手机、键盘、Reduced Motion 和清理检查。

Round 9B — Hero + 章节状态小范围原型（`BLOCKED_BY_REVIEW`）：

- [ ] 仅在 9A 通过后，把选定字符场接入 Hero。
- [ ] 只给 GAME WORK 与 Systems 两个标题接入 ASCII 章节填充，其他栏目保持原状做对照。
- [ ] 让导航、标题与正文共用同一 active section 状态。

Round 9C — GAME WORK 媒体安全的 ASCII 外围联动（`BLOCKED_BY_REVIEW`）：

- [ ] 仅在 9B 通过后，让真实媒体干净交接；不得采样、字符化或用 ASCII 覆盖封面与视频。
- [ ] ASCII 只联动共享窗口边框、状态轨、编号和邻近空白，并保留 Round 8C 的无黑帧、快速中断与 Reduced Motion 原则。

Round 9D — 全站视觉扩展（`BLOCKED_BY_REVIEW`）：

- [ ] 仅在 9C 通过后扩展栏目状态、低强度 hover / focus 与最终低饱和色板。
- [ ] Archive、Profile、Contact 保持招聘可扫描，不复制 GAME WORK 的高强度动效。

Round 9E — CRT 外壳与性能收尾（`BLOCKED_BY_REVIEW`）：

- [ ] 最后测试轻鱼眼、四角阴影、低强度扫描线与字符磷光。
- [ ] 完成桌面 / 平板 / 手机、低性能、无 WebGL2、Reduced Motion、打印与事件清理回归。

Round 8A 验收点：用户能直观看出矢量方块与真实像素渐变的区别，并确认像素材质、颗粒大小、色阶和运动方向是否值得接入首页。

Round 8B 验收点：比较 A / B 的真实像素 MG 感、ASCII 主体可辨识度、560ms 四阶段节奏和稳定媒体回归；用户选择 A、B 或混合比例前不进入正式 GAME WORK。

Round 8C 验收点：三个项目之间切换时没有整帧硬黑断层；像素材质来自真实媒体而非 DOM 装饰方块；560ms 后 Canvas 完全退场、项目媒体与诊断状态一致；手机、键盘与 Reduced Motion 不被迫播放 Canvas 转场。

Round 9A 验收点：实验对象是网站界面 / 背景字符场而不是游戏封面；近看是字符、远看形成结构；三套低饱和色板有明确差异；高功率蔓延有起点、前沿、尾迹与稳定态；鼠标交互只影响局部字符场；静止后停止绘制；正式首页尚未被改动。

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

2026-08-12 — Round 5 Pixel Cutout Revision — WAITING_FOR_REVIEW
修改：删除 Runtime Signal Viewport 标题条、项目技术标签与“查看项目”按钮右上角的纯装饰裁切缺口，恢复完整矩形边框；同步修订视觉规范，由字体、12px 网格、状态段和媒体角标承担像素识别，不再让交互控件出现无语义黑块。
检查：生产构建与 GAME WORK 相关 lint 通过；桌面计算样式确认标题条、技术标签和按钮均为 clip-path: none、0 圆角完整矩形；390px 手机逐项查看标签与按钮，边框完整且页面无水平溢出。当前 5173 页面未出现新增控制台问题；日志中仅有昨日另一 5180 预览地址留下的旧 GSAP 记录。
未修改：项目内容、媒体、入口、现有 560ms 切换、底部当前项目状态点、GAME WORK 之外的区块与 Round 6。
需要用户确认：三个位置的黑色缺口是否已清除，完整矩形是否更清楚。

2026-08-12 — Round 5 Hover / Mobile Spacing Revision — WAITING_FOR_REVIEW
修改：统一桌面项目条目的标题、技术标签与边线 hover / focus-within 反馈，消除标题原有 150ms 延迟造成的“标签先亮”错觉；手机端为标签组与项目按钮增加 12px 间距。
检查：生产构建与 GAME WORK 相关 lint 通过；桌面端把鼠标移入项目条目后 20ms 内，标题、首个标签与底边均同步变为 Acid Lime；390px 手机端实测标签与按钮间距为 12px、按钮高度为 44px，页面宽度 384px 且无水平溢出。
未修改：滚动触发范围、560ms 项目切换、项目内容、媒体、入口、其他首页区块与 Round 6。
需要用户确认：桌面项目条目是否同步变亮，手机标签与按钮之间的间距是否足够。

2026-08-12 — Round 5 — DONE
确认：用户通过 Runtime Signal Viewport、560ms 项目切换、局部像素视觉与字体、黑色裁切缺口清理、桌面 hover 同步和手机标签 / 按钮间距验收。
状态：Round 5 标记为 DONE；Round 6 标记为 NEXT，但本次不自动开始。
未执行：未扩展其他区块的像素语言或动效，未进行全站配色 / 字体评估，也未提交本轮尚未提交的修订。

2026-08-12 — Round 6A — WAITING_FOR_REVIEW
修改：完成全站视觉与动效审计，新建 `docs/round-6a-visual-motion-proposal.md`；提出“GAME WORK 保留完整 Pixel Signal、其他区块扩展轻量像素控制层”的方案，并把导航当前区块 Signal 登记为 Round 6 唯一新增动效。
检查：浏览器核对桌面 1183px 与手机 390px 页面；确认导航没有当前区块状态，自定义橙色光标持续跟随鼠标，Systems / Relevant 悬浮预览会在 `pointermove` 中逐帧更新位置；确认 GAME WORK 和其他七个区块分别使用 Fusion Pixel 与 Inter 两套视觉语言。
未修改：网页组件、CSS、项目内容、媒体、入口、现有 560ms 切换、区块结构与 Archive 页面；未进入 Round 6B。
需要用户确认：像素控制层的范围、双表面配色、删除自定义光标、悬浮预览固定锚点，以及导航当前区块 Signal。

2026-08-12 — Round 6B — WAITING_FOR_REVIEW
修改：按已确认提案删除旧自定义光标；将 Systems / Relevant 悬浮预览改为进入时单次定位；折叠时间收敛为 180ms；加入导航当前区块 Signal、真实区块编号和移动端当前编号；把轻量 Fusion Pixel 控制层扩展到首页非正文控件与 Archive 控件。
检查：本轮相关文件 ESLint 通过；生产构建通过；`git diff --check` 通过；浏览器核对 1440px 桌面与 390px 手机，导航状态、菜单、预览固定锚点、七个非 GAME WORK 区块、Archive 页面和水平溢出均符合提案。
未修改：项目名称与事实、页面顺序、媒体素材、独立 HTML、项目链接、GAME WORK 已通过的 560ms Pixel Signal、浅灰 / 橙与黑 / 酸性黄绿双表面配色。
需要用户确认：像素控制层的范围与阅读感、导航当前区块 Signal、原生光标、固定锚点预览和移动端菜单是否通过；确认前不进入 Round 6C。

2026-08-12 — Round 6B — DONE
确认：用户通过轻量像素控制层、双表面配色、导航当前区块 Signal、原生光标、固定锚点预览与移动端表现验收。
状态：Round 6B 标记为 `DONE`；Round 6C 标记为 `NEXT`，本次不自动执行最终回归或维护说明。

2026-08-12 — Round 6C — WAITING_FOR_REVIEW
修改：把桌面核心转场动态像素由 42 个收敛到规范上限 32 个，移除悬浮预览的常驻 `will-change`；重写项目 README，并新增 `docs/adding-real-ue-project.md`，记录真实 UE 项目替换字段、素材路径、Asset Lab 版本边界、验收步骤和可直接交给 Codex 的执行指令；同步把 visual / motion 文档标记为已实施并完成回归。
检查：生产构建、本轮相关 ESLint 与 `git diff --check` 通过；1440px 桌面和 390px 手机无横向溢出，导航当前状态、移动菜单、项目折叠、核心详情开关、Archive 分类和响应式预览正常；减弱动效的 GSAP、CSS 与视频降级路径齐全；动画稳定后动态像素全部退场、无遗留 `will-change`，手机动态像素为 0；51 个声明本地路径和 38 个派生映射文件全部存在，21 个本地发布入口返回 200，Tajima Sketchfab 模型在线可访问；浏览器无错误日志。完整 lint 仍有 15 个既有错误，集中在未挂载旧组件、通用 UI、旧 hook 与既有 Lightbox 规则，本轮未新增。
未修改：项目名称与事实、首页顺序、原始素材、独立 HTML、既有项目链接、浅灰 / 橙与黑 / 酸性黄绿双表面配色、Fusion Pixel 字体、560ms 核心切换和已验收交互。
需要用户确认：Round 6C 的最终页面状态、性能收敛和 UE 项目维护说明是否通过；确认后再把 Round 6 整体标记为 `DONE`，本轮不提交 Git。

2026-08-12 — Round 6C Full Signal Revision — WAITING_FOR_REVIEW
修改：按用户追加授权将 GAME WORK 的 Void Black / Surface Black / Signal White / Signal Gray / Acid Lime 配色完整扩展到首页八个区块、全站导航与 Archive；非 GAME 标题统一为硬边信号窗和 12px 状态段；当前区块状态段以 180ms 低强度反馈随滚动切换；Archive 加入 180ms 预览替换；按钮使用 120ms 颜色与轻按反馈；旧橙色鼠标追踪点阵替换为无监听器的静态 12px / 48px Signal 网格。同步更新 visual v3、motion v4 与 Round 6A 历史提案的覆盖关系。
检查：生产构建通过；本轮涉及的 TS / TSX 文件 ESLint 通过；`git diff --check` 通过；浏览器确认 Hero、Systems、Experience、Archive 的统一深色配色、滚动当前状态、Archive 分类与预览切换、0px 桌面水平溢出和无错误日志。Reduced Motion 会关闭全站 transition / animation，手机保持既有纵向结构、44px 触控目标与无悬浮预览降级。完整 lint 仍为 15 个既有错误，未新增。
未修改：项目名称与事实、首页区块顺序、原始素材、独立 HTML、项目入口、Fusion Pixel 字体、GAME WORK 的 560ms 核心切换及已验收的折叠 / 预览结构；未提交 Git。
需要用户确认：全站深色层级是否比原双表面更统一；非 GAME 标题窗与滚动 Signal 强度是否合适；Archive 深色高密度阅读是否清楚。后续意见继续在本轮修订，不提前进入下一阶段。

2026-08-12 — Round 6C Review Revision 2 — WAITING_FOR_REVIEW
修改：保留资料占位、Upcoming 默认项目、现有配色和 GAME WORK 核心动效；桌面与移动导航改为 02—08 七个中文精确入口，取消 Experience / Archive 对其他区块的合并高亮；首页七个区块和 Archive 改为中文主标题、英文次级系统标识，并同步中文化高频操作标签。非 GAME 区块改用“较大的上一节边界 + 较小的标题到内容间距”，当前区块标题窗以 150ms 颜色与背景反馈建立标题—内容归属；桌面 Experience 与 Profile 改为双栏紧凑结构。ECHOFLASH 的“13 项工业级技术亮点”改为“13 项核心技术实现”；Meshy.ai 删除缺少测量口径的 30% 大号数字与结果描述，改为可验证的工具流程表述。
检查：生产构建、本轮相关 ESLint 与 `git diff --check` 通过；1280×720 首页高度由约 9046px 降至 7213px（缩短约 20%），GAME WORK 保持 1779px，其余区块按重要性收紧；桌面七个导航入口与 `aria-current` 一一对应，Experience 当前标题窗、导航和 `data-active-section` 同步；390×844 手机菜单含七个入口、44px 开关、0px 横向溢出，六至七字中文区块标题保持单行；Archive 中文层级和分类在 1280px 下无溢出；浏览器无错误或警告。
未修改：Resume / GitHub / Demo 占位、求职时间与地点信息、Upcoming 默认项目、项目内容与素材、独立 HTML 入口、当前黑 / 酸性黄绿配色、七个标题窗的基本构图、Fusion Pixel 字体、560ms 核心切换；未提交 Git。
待试清单：① 讨论当前酸性黄绿是否与 Meshy.ai 或常见 AI 终端风格过近，再做两套局部配色样片，不直接全站换色；② 只选一个辅助区块试验不同于 GAME WORK 的标题构图，确认有效后再决定是否扩展。以上两项本轮不执行。
需要用户确认：中文信息比例、七入口导航、区块归属感、桌面页面密度和两处技术措辞是否通过。

2026-08-12 — Round 6C Review Revision 3 — WAITING_FOR_REVIEW
修改：将 Tajima Cutter 展开内容改为与 StoneCity 共用同一个左右结构和参数：桌面 `1.6fr / 0.7fr`、相同 `clamp(1.5rem, 4vw, 4rem)` 间距与相同内边距；左侧保留 Sketchfab 16:9 模型窗口及右下角四张 PBR 缩略图，右侧统一显示项目类型、年份、标题、说明和标签。手机继续使用单列上下结构，PBR 缩略图移到模型下方。
检查：生产构建、RelevantWorkSection ESLint 与 `git diff --check` 通过；1280×720 实测 StoneCity 与 Tajima 的左右列宽均为 726px / 318px、间距均为 51.2px、展开高度均为 460px；Tajima 模型窗口为 16:9，四张 PBR 缩略图完整；390×844 为 304px 单列、0px 横向溢出，浏览器无错误或警告。
未修改：项目名称、素材、Sketchfab 地址、PBR 贴图、折叠交互、悬浮预览、配色与其他区块；未提交 Git。
需要用户确认：Tajima 与 StoneCity 的桌面左右比例、右侧文字密度，以及手机单列顺序是否通过。

2026-08-12 — Round 6C Review Revision 4 — WAITING_FOR_REVIEW
修改：首页顶部品牌在 Hero 当前状态下取消边框与底色，只保留姓名和 `UE / C++` 的 Acid Lime 文字；键盘 `focus-visible` 轮廓继续保留。栏目导航的当前区块框选状态不变。
设计审查：1440×900 首页约 7742px，390×844 约 9265px；首屏职业定位、中文导航、GAME WORK 核心视觉、响应式降级和 Archive 分流已形成清楚主线。待讨论问题按优先级记录为：① 桌面 GAME WORK 项目说明仅 10.56px 且灰度偏低；② 桌面 Hero 右侧留白没有承担信息作用；③ 七个区块标题窗同构，削弱段落个性并接近常见黑底酸绿终端风格；④ 桌面仍约 8.6 屏，Profile / Contact 和 GAME WORK 还有密度优化空间；⑤ 非当前导航为 12px 低对比文字，远距离扫读稍弱。本轮只分析，不自动修改这些项目。
检查：1440×900 实测品牌文字为 `rgb(216, 255, 50)`、边框透明、背景透明；390×844 无横向溢出，菜单按钮 44px，Hero 约一屏；其他当前栏目仍使用既有框选状态。
未修改：主页面内容、区块结构、字体、配色、正文尺寸、导航栏目状态、动效、项目素材与入口；未提交 Git。
需要用户确认：左上角纯亮绿状态是否通过；再从本轮设计审查项目中选择下一项修改。

2026-08-12 — Round 6C Review Revision 5 — WAITING_FOR_REVIEW
修改：完成第一轮可读性修复与桌面 Hero 重排。GAME WORK 项目说明、系统 / 实习 / 辅助项目正文、实习证据和履历正文统一提升至 14px；GAME WORK 说明色由深灰提升为 66% Signal White；Meshy.ai 的“工具链”桌面字号收敛至 54px。桌面 Hero 改为左侧职业标题、右侧原有说明与按钮的双栏结构，不新增图形或内容，高度由约 726px 收到 612px；删除 `BEIJING · WENZHOU`。手机保持原纵向顺序。
检查：生产构建、PortfolioHero ESLint 与 `git diff --check` 通过；1440×900 Hero 两栏实测约 793px / 382px、间距 115.2px、0px 横向溢出；GAME WORK、实习证据与履历正文实测均为 14px。390×844 Hero 保持单列，约 817px 高、0px 横向溢出，地点文字不存在，浏览器无错误或警告。
未修改：主页面配色、像素字体、项目结构、素材、入口、导航栏目状态、标题窗构图、560ms 核心动效和手机信息顺序；未提交 Git。
需要用户确认：桌面 Hero 左右比例与高度、正文可读性和“工具链”缩小后的层级是否通过。

2026-08-12 — Round 6C Review Revision 5 — DONE
确认：用户通过第一轮可读性修复、桌面 Hero 双栏重排与地点文字删除。

2026-08-12 — Round 6C Review Round 2A — DONE
修改：Hero 左侧 `UE / C++` 与“游戏开发”两行绿色大字改用独立网格间距，桌面约 13px、手机 8px。按“不要一次重做全部标题”的待试策略，只把 UE 技术实验与视觉和管线能力改为紧凑横向技术索引：编号缩小，中文标题与英文系统标签位于左侧，说明位于右侧；GAME WORK、实习、Archive、Profile 与 Contact 标题构图不变。
检查：生产构建与 `git diff --check` 通过；1440×900 下两个原型标题窗均为 161px 高，中文标题保持单行，视觉与管线区约 581px，0px 横向溢出；当前导航和标题状态同步。390×844 保持原单列标题结构，Hero 约 825px、0px 横向溢出，浏览器无错误或警告。
未修改：配色、项目内容、媒体、入口、折叠与预览结构、GAME WORK 标题与 560ms 动效、其他五个标题构图；未提交 Git。
确认：用户通过 Hero 两行间距，以及 UE 技术实验 / 视觉与管线能力的紧凑横向标题。

2026-08-12 — Round 6C Review Round 2B — DONE
修改：只将“实习项目经历”标题改为工程记录式三栏构图。桌面端保留原有大标题，以“04 编号 / 中文主标题与说明 / 02 CASES 与 2024—2026 事实字段”建立轻度差异，并取消当前栏目大面积底色；手机端回落为单列，事实字段独立成一行。曾试做的 128px 紧凑履历条因变化过强，已按用户要求撤销。GAME WORK、两处已通过的技术索引以及 Archive / Profile / Contact 均未改动。
检查：恢复后的桌面三栏与手机单列均无水平溢出；生产构建、相关 ESLint 与 `git diff --check` 已在本轮通过。
确认：用户选择保留最初的轻度三栏方案，Round 2B 标记为 DONE；下一步只规划 Round 2C，不自动实施。

2026-08-12 — Round 6C Review Round 2C-A — DONE
修改：将 Archive 从通用大章节标题改为目录封面条。桌面以“06 编号 / 中文标题与用途 / 动态收录总数”组成紧凑目录头，并让三类项目数量直接连接在标题下方；中文“作品索引”前置。手机端保持单列标题，三类分类改为名称在上、数量在下，避免窄屏文字纵向断裂。未修改项目数量来源、Archive 链接、配色、字体、动效、Profile、Contact 和其他区块。
检查：生产构建、相关 ESLint 与 `git diff --check` 通过；1280×720 桌面下 Archive 区块由约 548px 收到 419px，390×844 手机下为 520px且无水平溢出；768px 平板下 Archive 自身无溢出。桌面与手机浏览器均无错误或警告。
确认：用户通过目录封面条、动态总数、三类数量和“打开完整档案”的浏览顺序；Round 2C-A 标记为 DONE，允许开始 Round 2C-B。

2026-08-12 — Round 6C Review Round 2C-B — WAITING_FOR_REVIEW
修改：将 Profile 从通用大章节标题改为中等强度的简历摘要板。桌面标题由“07 编号 / 中文标题 / 招聘判断说明 / 04 个履历模块”组成；中文“履历摘要”前置，动态字段只表达现有四类内容。同步收紧四块履历卡片的间距、内边距和列表行距，不改教育、经历、技能与奖项事实及顺序。手机端保持四块单列和完整说明。
检查：1280×720 桌面下标题由约 226px 收到 168px、履历网格由约 603px 收到 502px、Profile 区块由约 1003px 收到 829px；390×844 手机下四块均为 336px 单列且无水平溢出；桌面与手机浏览器无错误或警告。
未修改：Profile 内容事实和顺序、配色、字体、链接、Archive、Contact、其他首页区块与动效。
需要用户确认：简历摘要板是否与 Archive 和 GAME WORK 形成合适层级；标题说明、04 模块与四块履历内容是否容易快速扫描。确认前不进入 Round 2C-C。

2026-08-12 — Round 6C Review Round 2C-B — DONE
确认：用户暂时通过简历摘要板、04 模块字段与四块履历内容密度；Round 2C-B 标记为 DONE，允许开始 Round 2C-C。

2026-08-12 — Round 6C Review Round 2C-C — WAITING_FOR_REVIEW
修改：将 Contact 从通用大章节标题改为低强度的投递终端。桌面标题改为“08 编号 / 中文联系标题 / 求职方向说明”的 120px 横向收尾条；邮箱成为唯一高优先级行动，辅助信息压缩为电话/微信、简历、代码/演示三个事实字段，待补状态继续保留。手机邮箱只允许在 `@` 前换行，避免拆开域名；未新增虚假简历、GitHub 或 Demo 链接。
检查：生产构建、相关 ESLint 与 `git diff --check` 通过；1280×720 桌面下 Contact 区块由约 805px 收到 543px、内容面板由约 331px 收到 231px且无水平溢出；390×844 手机下 Contact 自身无水平溢出，邮箱显示为账号与完整 `@qq.com` 两行；768px 平板下 Contact 自身无溢出，浏览器均无错误或警告。平板全页仍有约 37px 既有溢出，来源不在 Contact，登记到 2C-D 联合回归处理。
未修改：邮箱、电话、待补状态、配色、字体、Profile、Archive、其他首页区块与动效。
需要用户确认：标题是否足够弱化、邮箱是否成为清楚的唯一主行动、三个辅助字段和页面结尾是否易于理解。确认前不进入 Round 2C-D。

2026-08-12 — Round 6C Review Round 2C-C Contact Data Revision — WAITING_FOR_REVIEW
修改：接入用户提供的 `朱翊嘉个人简历.pdf`，网站下载名与显示名统一为“朱翊嘉个人简历”；代码 / 演示入口接入 `https://github.com/PO00H`。Contact 从“主邮箱 + 三个次级字段”改为邮箱、电话 / 微信、简历、代码 / 演示四个完全同级的格子；邮箱值改用 Fusion Pixel 像素字体并取消大号强调。
检查：生产构建、Contact 定向 ESLint 与 `git diff --check` 通过；本地简历资源返回 `200 application/pdf` 且字节数与源文件一致；1280×720 下四格均为 286.5×112px、无内容溢出，邮箱计算字体为 Fusion Pixel 14px，页面无新增横向溢出。
未修改：联系标题、求职说明、电话号码、配色、其他首页区块与动效。
需要用户确认：四个联系格是否形成正确的同级关系，邮箱字号与像素字是否清楚，简历和 GitHub 的名称是否符合预期。确认前不进入 Round 2C-D。

2026-08-12 — Round 6C Review Round 2C-C — DONE
确认：用户通过四个同级联系格、像素字体邮箱、真实简历与 GitHub 入口；Round 2C-C 标记为 `DONE`，Round 2C-D 标记为 `NEXT`。
追加修改：Hero 原“简历 · 文件待补”占位改为“下载个人简历”链接，复用 Contact 已验证的 `朱翊嘉个人简历.pdf`，不改变按钮层级与 Hero 排版。

2026-08-12 — Round 6C Review Round 2C-D — WAITING_FOR_REVIEW
修改：完成 Archive、Profile、Contact 三段联合收尾。保留三个已验收构图，只在 721–959px 收紧 Systems / Relevant Work 技术索引列宽，并让 Profile 标题在平板回落为不带硬最小列宽的紧凑结构，修复已登记的平板横向溢出来源；平板与手机进一步统一收紧尾部三段上下间距。全站键盘焦点描边由遗留橙色统一为 Pixel Signal Acid Lime。
检查：桌面 Archive、Profile、Contact 当前导航与 `aria-current` 一一对应，三段连续边界无重复空白；1280×720 无水平溢出，尾部总高度保持约 1672px。键盘可依次到达 Archive、邮箱、简历、GitHub 与返回顶部，焦点均为 2px Acid Lime。Reduced Motion 路径核对为：GSAP 仅在 `no-preference` 启动，预览视频不自动播放，全站 transition / animation 关闭。生产构建、相关 ESLint、`git diff --check`、Archive 与简历 HTTP 链接均通过；简历返回 `200 application/pdf`。
未修改：Archive、Profile、Contact 已验收的信息构图、内容事实、四格层级、项目媒体与入口、配色、字体、GAME WORK 560ms 核心动效及其他区块内容。
需要用户确认：平板与手机尾部密度、桌面三段衔接、亮绿键盘焦点以及导航当前栏目是否可以作为 Round 2C 最终结果。确认前不继续下一阶段或提交 Git。

2026-08-12 — Round 6C Review Round 2C-D — DONE
确认：用户通过尾部三段联合间距、平板响应式修复、导航当前状态、亮绿键盘焦点与 Reduced Motion 回归。Round 2C-D 与 Round 6 整体标记为 `DONE`。
状态：下一阶段保持讨论中；未创建 `NEXT`，未继续修改页面，未提交 Git。

2026-08-12 — Round 8A — WAITING_FOR_REVIEW
修改：新增仅开发环境可访问的 `/pixel-lab`；同屏建立矢量方块、静态受限色阶 / Bayer 抖动与动态像素 MG 三种对照。Canvas 以 96×54、160×90 或 240×135 内部分辨率逐像素生成受限色板位图并最近邻放大；提供 3–6 色阶、抖动强度、6 / 12 / 24 FPS、播放 / 暂停与 560ms 场景重组控制。方案 A 只复用当前 Acid Lime 激活色，不锁定参考图色板。
检查：生产构建与本轮定向 ESLint 通过；1440×900 桌面为三列同屏对照、0px 横向溢出，两张 Canvas 默认内部尺寸均为 160×90 且计算样式为 `image-rendering: pixelated`；参数切换可把动态 Canvas 改为 240×135 / 24 FPS，560ms 重组与暂停按钮正常。390×844 手机为单列、0px 横向溢出、按钮最小 44px、Canvas 显示尺寸 305×171；首页与 Archive 回归打开正常，浏览器无错误日志。Reduced Motion 使用静态帧并关闭 DOM 方块动画。
未修改：首页八区块、GAME WORK 既有 560ms 转场、项目数据、媒体、链接、最终配色、字体、Archive 与已验收响应式结构；未进入 Round 8B，未提交 Git。
需要用户确认：三种材料差异是否清楚；160×90、5 色阶、72% 抖动、12 FPS 的默认颗粒是否合适；动态对象的体积、移动速度和 560ms 重组方向是否值得接入 GAME WORK。

2026-08-12 — Round 8A — DONE
确认：用户认可实验页默认参数 160×90、5 色阶、72% 抖动与 12 FPS，并把 ASCII Magic 作为 Round 8 高权重参考。Round 8A 标记为 `DONE`；Round 8B 只登记“纯 Dither Matrix / Dither + ASCII Reveal”对照原型候选，尚未获准执行，也未接入首页。

2026-08-12 — Round 8B — WAITING_FOR_REVIEW
修改：只扩展本地 `/pixel-lab`。接入 ECHOFLASH 与《橡皮奥德赛》现有派生封面，新增同参数并排 A / B：A 使用项目原色量化与移动 Bayer 4×4 阈值，B 在同一 Dither 时间线上叠加由媒体亮度和颜色驱动的 64×36 ASCII 字符晶格。两边共用 160×90、5 色阶、72% 与 12 FPS，均按量化、解析、重组、稳定四阶段完成 560ms 转场；加入同步重播、暂停 / 恢复、交换项目顺序与 380ms 冻结对照，稳定后 Canvas 完全退场。
检查：生产构建、Pixel Lab 三个 TS / TSX 文件定向 ESLint 与 `git diff --check` 通过；1280×720 桌面 A / B 各 636px 并排、0px 水平溢出，真实封面、阶段读数、380ms 对照和项目顺序同步。暂停 300ms 后两边均停在同一 383ms，恢复后完成并回到 `560 / 560ms`、Canvas opacity 0；交换顺序会同步更新两栏。CSS 已在 760px 以下把 A / B 改为纵向并保持 44px 控件，Reduced Motion 单独隐藏动态 Canvas、直接保留稳定媒体。首页代码、页面区块与正式 GAME WORK 未修改；生产构建中的既有 Tailwind ambiguous class 警告未由本轮新增。
未修改：首页八区块、Runtime Signal Viewport 现有 DOM 方块转场、最终配色、字体、项目事实、项目入口、Archive 和原始媒体；未提交 Git。
需要用户确认：在 `/pixel-lab` 选择 A、B 或混合比例，并判断 ASCII 主体可辨识度、560ms 节奏和稳定媒体回归。确认前不进入正式 GAME WORK 接入。

2026-08-12 — Round 8B — DONE
确认：用户选择方案 A“纯 Dither Matrix”，认为它更克制且项目辨识度更高；方案 B 只保留为实验参考。用户指出 A 在旧 / 新画面交界处存在硬黑断层，并授权开始 Round 8C 优化与正式接入。

2026-08-12 — Round 8C — WAITING_FOR_REVIEW
修改：将 A 的两段式“挖空 / 显影”改为同一 Bayer 晶格中的逐像素直接交接，任一时刻每个像素都来自旧媒体或新媒体；把 160×90、5 色阶、72% 抖动、12 FPS、560ms 的单 Canvas 转场接入桌面 GAME WORK，替换共享窗口中 32 个 DOM 装饰方块。ECHOFLASH 与《橡皮奥德赛》读取现有真实封面；Upcoming 只使用抽象系统占位帧。Canvas 未就绪时改用重叠淡化兜底，键盘、窄屏与 Reduced Motion 保持静态或即时切换。
检查：生产构建通过；Round 8 相关 TS / TSX 定向 ESLint 无错误和警告；实验页 380ms 帧不再全黑。桌面捕捉到 ECHOFLASH →《橡皮奥德赛》与真实媒体 → Upcoming 的中段直接交接；结束后 `data-runtime-dither-state=idle`、Canvas opacity 0 / visibility hidden、共享窗口 DOM 动态像素数为 0、当前项目状态正确、页面水平溢出为 0。连续快速切换三次后仍稳定落到最后项目且无残留 Canvas。
未修改：最终配色、字体、首页结构、项目事实、项目入口、原始 / 派生媒体、Archive 与 GAME WORK 之外的动效；没有把 ASCII 方案接入正式网站，也未提交 Git。
需要用户确认：实际滚动时黑场是否已经消失；逐像素交接方向和颗粒密度是否舒服；560ms 后真实媒体回归是否足够干净。确认前不进入 Round 8D 或扩展其他区块。

2026-08-12 — Round 8C — DONE
确认：用户认可方案 A 的切换方向，并指出 Round 8 不能只构思动效；Round 8C 标记为 `DONE`，授权开始 Round 8D 静态像素材质原型。

2026-08-12 — Round 8D — WAITING_FOR_REVIEW
修改：新增一次性绘制的 `StaticPixelMaterial`。所有栏目标题用 48×6 Canvas 建立与 02–08 编号对应的章节进度材质带，替换原右上角重复矢量方块；GAME WORK 的 Runtime 标题片、诊断栏与当前 01 / 02 / 03 轨道分别使用 80×16、72×24 与 56×16 的静态有序抖动色阶。第一版右侧椭圆像素团已收敛为横向进度带，不新增像素球体、人物或其他常驻主体。同步更新 visual v6、motion v7 与视觉对照记录。
检查：生产构建、三个 Round 8D TS / TSX 文件定向 ESLint 与 `git diff --check` 通过；应用内浏览器确认所有 Canvas 使用 `image-rendering: pixelated`、当前栏目材质可见度随导航一致、GAME WORK 与 Archive 均无水平溢出。项目滚动切换后当前轨道静态材质与项目编号一致，560ms 动态 Canvas 最终回到 `idle`、opacity 0、visibility hidden。对照图二与最终浏览器截图已通过本地图像检查；生产构建仍只有既有 Tailwind ambiguous class 警告。
未修改：Hero 与全站文案、信息结构、版式尺寸、项目事实、媒体、入口、字体、当前配色语义和 Round 8C 交接参数；没有生成新概念图、没有引入新的动效循环，也未提交 Git。最终色板仍待独立讨论。
需要用户确认：章节进度材质带是否像“阅读状态”而非装饰；Runtime 标题片、诊断栏与当前轨道的颗粒是否足够明显但不抢媒体；这套静态材质是否值得在 Round 8E 继续扩展。确认前停止。

2026-08-12 — Round 8D — REJECTED / REVERTED
确认：用户否决静态像素材质，明确把视觉方向从 Pixel / Dither 改为可交互 ASCII Terminal，并要求低饱和复古终端配色、Claude Fable 式高功率蔓延参考、章节字符填充、鼠标字符场与未来的 GAME WORK ASCII 交接。
回退：删除 `StaticPixelMaterial` 文件及其 SectionHeading、Runtime Signal Viewport 与 CSS 接入，恢复 Round 8D 之前的栏目标题和 GAME WORK 控制层；Round 8C 已验收的动态 Dither 交接仅作为临时可用基线保留，待 ASCII 原型通过后再替换，避免在无验证方案时破坏可用切换。
规划：重写 `portfolio-visual-direction.md` 与 `portfolio-motion-design.md` 为 ASCII Draft；新增 `docs/ascii-terminal-redesign-plan.md`，记录 ASCII Magic、GitHub、Reddit 与 Claude Fable 参考结论，并把 Round 9A–9E 加入分轮执行清单。
检查：生产构建、SectionHeading / Runtime Signal Viewport / Round 8C Transition 定向 ESLint 与 `git diff --check` 通过；构建只保留既有 Tailwind ambiguous class 警告。正式首页回退效果、静态材质残留与 Round 8C 交接状态已做浏览器回归。
未修改：项目事实、媒体、链接、首页信息结构、中文内容、已验收响应式结构和 Round 8C 动态交接参数；未开始 `/ascii-lab`，未替换正式配色，未加入鱼眼或 CRT 后处理，未提交 Git。
需要用户确认：是否按 Round 9A 默认方案开始仅本地 ASCII Lab——暖琥珀主色 + 低饱和紫事件色、AUTO ONCE / CTA TRIGGER 对照、LUMINANCE / FLOW / REPEL 鼠标模式对照；确认前不进入实现。

2026-08-12 — Round 9A — WAITING_FOR_REVIEW
修改：新增仅开发环境可访问的 `/ascii-lab` 与 Canvas 2D 字符采样引擎；使用 ECHOFLASH 真实派生封面的亮度和 Sobel 边缘生成字符场；同屏实现 Characters / Block Chars / Dither 对照，三套低饱和色板、字符坡度、40–120 列、对比度、边缘、密度与 12 / 18 / 24 FPS 控制；实现 AUTO ONCE / CTA TRIGGER 不规则紫色前沿，以及 LUMINANCE / FLOW / REPEL 局部鼠标模式。新增 Round 9A 概念、桌面、手机与活动前沿验收图。
检查：定向 ESLint、生产构建与 `git diff --check` 通过；桌面默认 96 列、运行中实测约 17 FPS、结束后 0 FPS / IDLE；鼠标停止后 220ms 回落并停绘；键盘 Enter 可触发 CTA；390×844 手机默认 48 列、按钮 44px、三种媒介纵向排列且无水平溢出；Reduced Motion 代码路径直接显示完成态并关闭传播与鼠标场；页面隐藏与组件卸载会取消动画帧和监听器。
未修改：正式首页八个区块、GAME WORK Round 8C Dither 临时基线、项目事实、媒体、链接、正式配色、鱼眼、扫描线和 CRT 外壳；未开始 Round 9B。
需要用户确认：近看字符 / 远看形体是否成立；暖琥珀稳定态和灰紫传播前沿是否合适；三种鼠标模式选哪一种；AUTO ONCE 与 CTA TRIGGER 未来保留哪一种。确认前停止。

2026-08-12 — Round 9A Direction Correction — NEXT
确认：用户明确作品媒体不需要 ASCII 化；目标是网站视觉与动效采用 ASCII Terminal 语言，游戏封面、项目截图、演示视频和 Sketchfab 内容保持原貌。Claude Fable 式高功率蔓延继续作为动效行为参考，紫色只作为候选事件色，不锁定最终配色。
文档：同步修订 `docs/ascii-terminal-redesign-plan.md`、`docs/portfolio-visual-direction.md` 与 `docs/portfolio-motion-design.md`；Round 9C 从“媒体字符交接”改为“真实媒体干净交接 + 外围 ASCII 状态联动”。
状态：Round 9A 初版保留为历史实验记录但不通过验收；下一次只返工 `/ascii-lab` 的展示对象和对应检查，用户再次授权前不进入 Round 9B。
