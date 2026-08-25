# Codex 执行清单：UE / C++ 作品集改版

> 本文件保留分轮实施记录。当前唯一可执行的设计、动效与信息架构规范是 [`docs/portfolio-design-system.md`](docs/portfolio-design-system.md)；下方历史日志中的旧提案、旧阶段状态和旧文档路径仅用于追溯。
>
> 当前状态：Round 10（CRT 显示器外壳 + 开机序列 + 联合回归）整体已验收；设计规范 v2 生效；开机序列每次加载重播
> 当前允许阶段：无 `NEXT`，下一阶段由用户明确指定；不进入旧 Round 9B–9E
> 当前分支：`codex/redesign/interactive-portfolio`

## 1. Codex 每轮工作协议

每次开始修改前必须：

1. 完整读取本文件顶部状态和 `docs/portfolio-design-system.md`；涉及真实 UE 项目时再读取 `docs/adding-real-ue-project.md`。
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
- 不恢复已否决的终端网站、线路图、CTA 扩散、随机流体或酸性黄绿 Pixel Signal 方向。
- 不把真实项目图片、视频、截图或 Sketchfab 转换为 ASCII / Dither / 像素画面。
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

Round 9A — ASCII Material & Interaction Lab Revision（`SUPERSEDED / PAUSED`）：

- [x] 只新增本地 `/ascii-lab`，不修改正式首页。
- [x] 删除抽象网站线路图和三渲染器参数工作台，把真实首页导航、Hero 标题、说明、CTA、能力条和 02–08 区块关系直接复用为清晰 DOM。
- [x] 该版本保留为实验历史；靛蓝 / 沙金 / 陶土 / 苔绿流场、鼠标聚拢和 CTA 传播均不再是可执行方向。
- [x] 删除大参数面板，只保留一条只读状态说明；视觉主体回到真实 Hero，而非算法调试器。
- [x] 加入真实 GAME WORK 结构与三个项目索引；ECHOFLASH / Eraser's Odyssey 封面始终由普通 DOM 图片显示，媒体区域 Canvas 数为 0。
- [x] 完成 1440×980 桌面与 390×844 手机、CTA / 项目切换、Reduced Motion、页面隐藏 / 离屏停绘与浏览器检查；桌面稳定态约 12 FPS，手机 12 FPS 上限。
- [x] 保留 FeaturedGamesSection 的 GSAP / TypeScript 显式类型构建修复；生产构建通过。

Motion Study 01 — Vertical Breathing（`WAITING_FOR_REVIEW`）：

- [x] 只制作独立循环背景小样：红、青、白 Dithering，弧形网格，上下相位交换。
- [x] 不使用胶囊轮廓、网站 DOM、鼠标、CTA、鱼眼或项目媒体。
- [x] 桌面与手机端均为单个全屏 Canvas；无页面滚动、无交互元素，Reduced Motion 显示静态相位。
- [ ] 用户验收：是否像全屏背景呼吸，而不是加载、粒子或独立漂浮物。

Motion Study 02–03 — Horizontal / Diagonal Direction（`DONE`）：

- [x] 在同一小样中暴露左→右、右→左与两条对角方向，保持点阵材质与周期不变。
- [x] 用户已调选并保存右上→左下；默认组合为浅弧面、105% 密度和青灰配色。
- [x] 用户确认右上→左下为最终背景方向。

Motion Study 04 — Cell Bloom Event（`DONE`）：

- [x] 只测试背景方格单元的局部放大、结晶、断裂与干净回落。
- [x] 固定浅弧面、右上→左下、105% 密度和已保存青灰配色。
- [x] 不加入网站、项目媒体、CTA、鱼眼或持续鼠标场。

Motion Study 05 — Fisheye（`DONE`）：

- [x] 仅在 Study 04 通过后测试背景轻鱼眼；DOM 永不变形。
- [x] 用户验收中心内突方向与 8% 默认强度；最终冻结为普通无环面、右上→左下、105% 密度、8% 内突和已保存青灰配色。

Motion Study 06 — Click-Origin Cell Bloom（`DONE`）：

- [x] 点击全屏 Canvas 时，将已有同源格内缩放事件定位到点击处。
- [x] 单元仍以自身中心缩放、最大不越格；不加入跟随、吸引、排斥、拖尾或扩散。
- [x] 保留中心重播按钮作为键盘替代；Reduced Motion 下不播放事件。
- [x] 用户验收点击位置、事件范围与回落自然；正式首页接入前先通过配色门。

首页背景接入 01 — Palette Integration Gate（`BLOCKED_BY_REVIEW`）：

- [x] 审计正式首页背景：`.portfolio-shell`、导航及多处区块使用不透明黑 / 深绿表面，浅灰青色点阵直接置底将不可见。
- [ ] 用户选择：A. 正式首页转为浅灰青色基础表面，沿用已通过的小样配色；B. 保留黑色首页，将点阵场重映射为深色版本。
- [ ] 选择前不修改首页颜色、区块表面或项目媒体。

### Round 10 — CRT 显示器外壳与开机序列（V2 风格方向）

状态：`NEXT`（用户已验收计划与四项关键决策，允许从 Round 10A 开始）

故事：整个网站是一块复古未来显像管显示器的"屏幕内容"。显示器外壳由代码绘制，四周围合；关机状态为黑底，开机后为白底复古未来界面。艺术气质参考《人生切割术》Lumon Terminal（奶油暖灰壳、深色屏幕包边、青绿发光），边框结构与宽度以 `参考/边框参考1.png` 为准。

已确认决策：

- 打字机阶段：白底深字，与开机后的主站同底。
- 开机序列：每会话播放一次（sessionStorage），任意点击 / 按键可跳过；Reduced Motion 直接进主站。
- Archive 与首页共用同一外壳，但只在首页首次访问播开机序列。
- 手机端使用极窄边框（约 8–12px），开机序列保留简化版。

参考素材映射（均在 `参考/` 目录，仅作视觉依据，不进代码库）：

- `边框配色参考——人生切割术.jpg`：外壳气质与配色关系。
- `边框参考1.png`：边框宽度、圆角、四边内阴影与角落小字位的主要依据。
- `封面加载界面最后TV息屏动效截图参考.png`：CRT 收线（压成水平亮线再收成中心亮点）；开机动画为其逆向。
- `封面参考1.png`、`加载动效参考.gif`：打字机节奏、块状光标、故障位移与点阵纹理质感。

Round 10A — CRT 外壳：

- [ ] 新增固定全视口边框层，`pointer-events: none`，桌面四边固定边距（约 28–40px，按边框参考1 比例调准），四角圆角；手机 8–12px。
- [ ] 曲面三件套全部用 CSS 合成：四边内暗角、顶部轻微反光条、屏幕圆角裁切；不使用图片素材。
- [ ] 配色：奶油暖灰外壳 + 深色屏幕包边，与现有 `#f3f5f3` / 青灰体系衔接。
- [ ] 把导航、Dither Canvas、03/05 Portal 预览的停靠范围收进屏幕区（统一 CSS 变量管理边框厚度）。
- [ ] 窗口滚动保持不变；内容滚动到边缘时没入边框下方，配合暗角形成"画面消失在玻璃边缘"的错觉。
- [ ] 验收：桌面三种宽度与 390px 手机无横向溢出；导航当前状态、锚点落点、悬浮预览视口钳制全部回归。

Round 10B — 开机序列 Overlay：

- [x] 状态机：黑屏 0.2s → 开机（中心亮点 → 水平亮线 → 纵向展开为白屏，约 500ms，仅 transform / opacity / clip-path）→ 打字机逐字打出 `ZHU YIJIA PORTFOLIO` 与 `UE / C++ GAME DEVELOPER`（块状光标全程闪烁）→ 打完后光标再闪 5 次 → 带 2–3 处水平位移故障的逆向收线 → 撤场进入主站。
- [x] Overlay 只覆盖屏幕区，不影响边框；打字与闪烁用 Fusion Pixel 像素字体。
- [x] 点击 / Esc / 任意键跳过；Reduced Motion 完全不出现。播放频率：用户已决定每次加载重播，不启用 sessionStorage 每会话一次。
- [x] 开机动画是纯仪式，不表达加载进度；不加音效。
- [x] 验收：完整播放、中途跳过、重复访问不播、Reduced Motion 直达主站、手机简化版、撤场后三套既有动效（背景呼吸与点击波 / 03/05 预览 / GAME WORK 560ms 交接）无残留影响。

Round 10C — 联合回归与规范更新：

- [x] 桌面、390px 手机、键盘、触屏、Reduced Motion 全回归；性能检查（外壳零常驻重绘）。
- [x] 更新 `docs/portfolio-design-system.md`：CRT 外壳与开机故事正式写入规范，并明确它在开机序列范围内取代"禁止黑底终端 / 故障效果"的旧条款（主站内容区仍执行浅色体系与既有禁令）。
- [x] 更新 README 与本文件执行日志。

Round 10 验收点：打开网站先看到一台"关机的显示器"，开机、打字、故障息屏后进入完整主站；边框在全站滚动中稳定不动；真实项目媒体保持原样；跳过与 Reduced Motion 路径可靠。

Round 8A 验收点：用户能直观看出矢量方块与真实像素渐变的区别，并确认像素材质、颗粒大小、色阶和运动方向是否值得接入首页。

Round 8B 验收点：比较 A / B 的真实像素 MG 感、ASCII 主体可辨识度、560ms 四阶段节奏和稳定媒体回归；用户选择 A、B 或混合比例前不进入正式 GAME WORK。

Round 8C 验收点：三个项目之间切换时没有整帧硬黑断层；像素材质来自真实媒体而非 DOM 装饰方块；560ms 后 Canvas 完全退场、项目媒体与诊断状态一致；手机、键盘与 Reduced Motion 不被迫播放 Canvas 转场。

Motion Study 验收点：不评价网站布局；只判断规则 ASCII/Dither 单元、红青白色场、背景呼吸节奏与方向是否成立。真实媒体和正式页面均不参与实验。

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

2026-08-13 — Round 9A Revision — WAITING_FOR_REVIEW
修改：删除 ASCII Lab 对项目清单、ECHOFLASH 封面和其他作品媒体的读取；字符引擎改为程序生成的网站布局场，由顶部状态栏、主内容场、侧栏模块、底部章节轨与一条弯曲信号路径共同生成亮度和边缘。主画面与 Characters / Block Chars / Dither 三栏对照全部复用同一个网站场；界面文案明确“网站采用 ASCII，作品媒体保持原貌”。
检查：定向 ESLint、生产构建与 `git diff --check` 通过；桌面默认 96 列、3360 字符格，鼠标运行时实测约 17 FPS，离开后回到 0 FPS / IDLE；AUTO ONCE、CTA 按钮和键盘 Enter 均可触发传播；LUMINANCE、FLOW、REPEL 三种模式均进入 ACTIVE；390×844 手机默认 48 列、1248 字符格、按钮 44px、无横向溢出；页面资源清单为 0 张图片、0 段视频。Reduced Motion 代码路径直接关闭传播和鼠标场、保留完成态；页面隐藏与卸载继续取消动画帧和监听器。浏览器无错误或警告；构建只保留既有 Tailwind ambiguous class 警告。
未修改：正式首页八个区块、GAME WORK Round 8C 临时 Dither 基线、项目事实、作品图片 / 视频 / Sketchfab、链接、正式配色、鱼眼、扫描线与 CRT 外壳；未开始 Round 9B。
需要用户确认：程序化字符场远看是否足够像“网站界面与运行状态”而不是项目图片；Characters 是否明显优于 Block Chars / Dither；高功率前沿强度、三套色板、AUTO / CTA 与三种鼠标模式下一步分别保留哪一种。确认前停止。

2026-08-13 — Round 9A Complete Website Field Revision — WAITING_FOR_REVIEW
修改：删除上一版抽象线路图、三渲染器对照和右侧大参数面板；`/ascii-lab` 直接复用正式首页的导航、姓名、UE / C++ 职业标题、中文说明、两项 CTA、能力条、GAME WORK 项目结构与 02–08 章节关系作为可读 DOM。Hero 右侧改为独立 `C++` 字符信号场；CTA、项目选择和重播按钮会从局部种子触发字符前沿，并沿导航、窗口外框和章节状态带传播。三套色板和三种鼠标模式只保留为紧凑原型选项。
媒体边界：ECHOFLASH 与 Eraser's Odyssey 使用现有真实派生封面，项目窗口内是普通 `<img>`；媒体区域 Canvas / Video 数为 0，ASCII Canvas 只有 Hero 右侧一处，不读取项目素材。
检查：定向 ESLint、`git diff --check` 与生产构建通过；1280×720 桌面和 390×844 手机均无水平溢出，手机 CTA 为 46px、项目索引按钮为 92px；CTA 能跳至 02 并触发 ACTIVE，项目索引能切换真实封面，约 1 秒后回到 `IDLE`；桌面 3948 格、手机 1200 格；浏览器控制台无警告或错误。构建仅保留既有 Browserslist 数据提示和 Tailwind ambiguous class 警告。
未修改：正式首页、Round 8C GAME WORK 临时 Dither 基线、项目事实与顺序、原始 / 派生媒体、独立 HTML、最终配色、鱼眼、扫描线和 CRT 外壳；保留 `FeaturedGamesSection.tsx` 的 GSAP / TypeScript 显式类型修复；未进入 Round 9B，未提交 Git、未合并 main、未创建 PR。
需要用户确认：完整首屏是否已经像一个正在运行的作品集网站；Hero 右侧 `C++` 字符场、暖琥珀 / 低饱和紫传播、CTA 因果和章节状态带强度是否通过。确认前停止。

2026-08-13 — Round 9A Dot Field Reference Revision — WAITING_FOR_REVIEW
覆盖修订：按用户最新点状 ASCII 参考，移除 `C++` 雕塑、字符线路图、终端窗口和可选参数工作台。实验页改为白底现代编辑排版；Hero 留白中的 Canvas 使用“低分辨率四色综合流动色块 + 规则圆点亮度 / 边缘采样”双层材质，点径与疏密共同形成远观抽象色块、近观规则点阵的效果。
交互：桌面鼠标只影响局部涟漪与聚拢；CTA 触发一次带前沿的点阵 / 色块传播；稳定态以 12 FPS 上限缓慢漂移，离屏、页面隐藏与 Reduced Motion 停绘，手机使用 48 列与 12 FPS 上限。
媒体边界：真实导航、Hero 文案、按钮、GAME WORK 与 02–08 关系仍为清晰 DOM；ECHOFLASH 与 Eraser's Odyssey 继续使用普通 `<img>`，不进入点阵 / ASCII 管线。
检查：1440×980 桌面与 390×844 手机实机浏览器验证通过；CTA 传播、项目索引与原始项目封面显示正常；`npm run build` 通过，仅有既有 Browserslist 与 Tailwind ambiguous class 提示。保留 `FeaturedGamesSection.tsx` 的 GSAP / TypeScript 显式类型修复。
未修改：正式首页、项目事实与媒体、Round 9B 及以后阶段；未提交、未合并、未创建 PR。等待用户对点阵密度、四色关系和 CTA 强度验收。

2026-08-13 — Visual / Motion Direction Consolidation — NEXT
确认：用户已满意现有网站布局，暂停所有一比一网站改版和旧 Round 9A 实现。新的视觉母语言为 ASCII + Dithering 动态背景：ArcMatrix 的红青白弧形矩阵与方向性呼吸作为常驻背景；点阵海报的大小圆点只用于低频专门事件；轻鱼眼只作用于背景。
删除规则：终端网站、假窗口 / FPS / C++ 雕塑 / 线路图、暖琥珀与紫色功率蔓延、CTA 向右加载扩散、鼠标吸引/排斥、章节字符填充、随机四色流体、酸性黄绿 Pixel Signal 以及其余冲突的执行规则均已从当前规范移除或归档。
文档：`portfolio-visual-direction.md` 与 `portfolio-motion-design.md` 现为唯一有效规范；`ascii-terminal-redesign-plan.md` 与 `round-6a-visual-motion-proposal.md` 仅保留历史链接，不得执行。
下一步：只允许 Motion Study 01——红青白、全屏、无胶囊轮廓的 Vertical Breathing 独立小样；不接正式首页，不含鼠标、CTA、鱼眼或项目媒体。

2026-08-13 — Motion Study 01 / Vertical Breathing — WAITING_FOR_REVIEW
实现：将仅开发环境开放的 `/ascii-lab` 收敛为单个全屏 Canvas。红、青两组弧形点阵以 4.2 秒周期上下交换，白色通过 Bayer 阈值形成内部相位缝隙；颜色按离散单元选择，不使用模糊渐变。点阵延伸到画面四边，不形成胶囊或独立漂浮物轮廓。
首次验收修订：按用户“渐变稀疏、过渡不自然”的反馈缩小网格间距；把单一可见阈值拆为“留白覆盖率”与“红青归属”两套错位 Bayer 阈值。过渡区保持连续的最低点阵密度，红青通过白色占空比逐步换相，不再由两片色带夹出大块空白。
逐帧对照修订：根据用户提供的九帧对照确认参考核心不是平直网格渐变，而是矩阵坐标本身的中心收束与上下弧形扇开。小样改为单调弧形投影，避免行列交叉产生摩尔纹；颜色改为“全局主色翻转 + 对向颜色纵向锥形穿过 + 中间上下分色”，不再使用水平双波瓣。
第二次验收修订：用户确认点阵密度正确，但否决人为强化的纵向锥形穿过。保留弧形矩阵与密度，删除中心锥形遮罩；颜色只做整片主色与平缓上下换相，不再出现尖锥或穿刺感。
参数实验：按用户要求在 `/ascii-lab` 增加可折叠轻量控制板，暴露四类单变量：浅弧 / 内收 / 鞍形 / 扭转环面，65%–150% 点阵密度，参考 / 雾粉 / 矿物三套低饱和配色及红青底色自定义，六种上下 / 左右 / 对角方向。控制板仅用于实验页，不接入正式网站；仍无鼠标场、CTA、鱼眼或项目媒体。
参数保存：按用户截图与页面实时值，将浅弧面、右上→左下、105% 密度、`#28b6c3 / #2d929b / #e0e0e0` 保存为 Motion Study 01 默认组合，并新增“已保存青灰”预设；刷新页面后自动恢复此组合。
Motion Study 02–03：用户指出方向已在参数实验中完成调整；因此取消重复制作 Horizontal / Diagonal 独立页面，将二者合并为同一方向参数比较。当前读取并确认的选择是右上→左下，其他条件沿用已保存组合；等待方向验收后才允许进入 Study 04 大小圆点事件。
Motion Study 02–03 验收：用户确认右上→左下为最终背景方向。冻结基准为浅弧面、右上→左下、105% 密度、`#28b6c3 / #2d929b / #e0e0e0`；下一步仅允许 Motion Study 04 大小圆点事件层，本轮未开始制作。
Motion Study 04 实现：在冻结背景上新增一次性 1100ms 方格结晶事件；400ms 从原点阵连续变化、120ms 稳定停留、580ms 回落并完全融回当前背景相位。验收修订将事件改为与背景同源：不再叠加独立图层，也不再发生方形到圆形的轮廓切换；由背景中已经通过 Bayer 覆盖阈值的同一批方格采样单元，在原位置保持直角方形并放大或缩小，再回到原 Dither 单元。每个单元锁定同一个原始中心点，无方向位移；最大边长严格限制为自身网格框，不越格、不重叠。颜色、弧面坐标与红青相位全部继承背景场。正式首页、鼠标场、CTA、鱼眼和项目媒体均未改；Study 05 继续锁定，等待用户验收本事件。
Motion Study 04 验收：用户确认格内固定中心缩放版本明显改善，并授权进入下一步；Study 04 标记为 `DONE`。
Motion Study 05 实现：只在 Canvas 的采样坐标中加入径向鱼眼，DOM、参数面板、点击范围与布局均不参与变形。实验页暴露 0%–18% 单变量滑杆，0% 为原始对照、默认 8% 为轻微曲率、18% 为明显上限；环面选择新增“普通（无环面）”平直坐标对照。首次验收指出映射方向做成了内凹；现已反转为中心向观看者内突、边缘向中心收拢，并将控件改名为“内突强度”。反向后将径向映射系数收敛到 45%，避免默认 8% 产生过强边缘收缩。用户确认保存当前参数并开始下一步；Study 05 标记为 `DONE`，冻结普通无环面、右上→左下、105% 密度、8% 内突与已保存青灰配色。
Motion Study 06 实现：在冻结参数上将 Study 04 的同源格内缩放事件改为点击定位。鼠标或触控点击 Canvas 时只更新一次归一化事件中心；被选中的原有 Dither 方格保持自身中心、直角形态和格内最大尺寸，1100ms 后融回当前呼吸相位。没有持续 `pointermove`、吸引 / 排斥、拖尾或向外传播。保留中心重播按钮作为键盘替代，Reduced Motion 下不播放。正式首页、网站 DOM、CTA 与项目媒体未改；等待用户验收点击位置、事件范围与回落。
Motion Study 06 验收：用户确认点击定位版本通过；Study 06 标记为 `DONE`。首页接入审计确认现有 `.portfolio-shell`、导航与多个区块是不透明黑 / 深绿表面，已通过的浅灰青色点阵放在底层会被完全遮挡。下一步先选择“首页转浅色并沿用冻结色板”或“保留黑色并重映射点阵色板”，选择前不改正式首页。
边界：页面无网站 DOM、文案、按钮、鼠标监听、CTA、鱼眼或项目媒体；正式首页及其布局未改。Reduced Motion 保留静态相位；页面隐藏、离屏与组件卸载会停止绘制；桌面 12 FPS，手机 10 FPS 并降低像素密度。
检查：1280×720 桌面与 390×844 手机浏览器验证均为 1 个全屏 Canvas、0 个交互元素、0 横向或纵向溢出；生产构建通过，仅保留既有 Browserslist 与 Tailwind ambiguous class 提示。Motion Study 02–05 继续锁定，等待用户只验收“是否像全屏背景呼吸”。

2026-08-13 — 正式网站接入 01 / 方案 A — WAITING_FOR_REVIEW
选择：用户通过 Motion Study 06，并选择方案 A——保留已满意的首页与 Archive 布局，只把整体配色替换为“复古未来像素清新”浅色体系，同时接入已冻结的青灰 Dither 呼吸背景。
修改：首页与 Archive 共用固定 Canvas 背景；页面底色、导航、章节表面、按钮、当前状态和 Archive 筛选统一为浅灰白、主青、深青与深墨文字。旧黑 / 深绿 / 酸性黄绿不再承担正式页面视觉语义。真实项目封面、视频、截图与 Sketchfab 保持原样，不被点阵化或重绘。
动效边界：正式页面只启用自主低速呼吸，不启用实验页点击事件、鼠标反馈或 CTA 联动；Canvas 不接收指针。桌面 12 FPS、手机 10 FPS，CSS 像素分辨率绘制；页面隐藏、窗口失焦和卸载停止，Reduced Motion 显示静态相位。
检查：相关 TS / TSX 定向 ESLint 通过；生产构建通过，仅保留既有 Browserslist 数据提示与 Tailwind ambiguous class 警告。已用本机浏览器检查 1440×900 首页、390×844 首页和 1440×900 Archive；浅色层级、青色交互状态、移动端结构和真实项目预览均正常。
未修改：首页信息结构、文字、项目顺序、项目媒体与入口、Round 8C 已通过的项目媒体交接、Round 9B 及以后内容；未提交 Git、未合并 main、未创建 PR。
需要用户确认：全站浅色青灰体系是否符合“复古未来像素清新”；背景 Dither 的可见度是否合适；确认前不增加新动效。

2026-08-13 — 正式网站接入 01 / 用户验收修订 1 — WAITING_FOR_REVIEW
反馈：用户指出顶部导航没有随页面移动、左上角出现无用蓝色按钮、背景呼吸不明显且点击反馈过弱。
修复：将首页与 Archive 导航从受通用层级规则覆盖的 sticky 改为真正固定在视口顶部，并为页面保留对应 64px / 手机 58px 内容起始空间；从两页 DOM 中移除误露出的“跳到主要内容”蓝色链接。正式背景稳定态透明度由桌面 10% 提升至 18%、手机 7.5% 提升至 14%，使两个呼吸相位的点阵密度与青灰迁移可见。
点击：正式背景启用一次性点击定位回声；以实际点击位置为中心，提高选中点阵比例与局部作用范围，点击期画布可见度为桌面 30% / 手机 24%，约 1350ms 后融回当前呼吸相位。Canvas 继续 `pointer-events: none`，通过窗口被动监听响应，不阻挡按钮、导航、滚动或项目媒体；Reduced Motion 下不播放。
检查：桌面与手机截图确认顶部多余空带和蓝色控件均已消失，导航位于视口顶边；700ms 与 2800ms 两个相位截图可见点阵场方向与密度变化。相关 ESLint、`git diff --check` 与生产构建通过；构建只保留既有 Browserslist 数据提示和 Tailwind ambiguous class 警告。等待用户实机体感验收。

2026-08-13 — 正式背景强度对照 80% — WAITING_FOR_REVIEW
反馈：用户在 18% 桌面 / 14% 手机稳定态下仍无法明显感知背景，要求直接提高到 80% 进行对照。
修改：只调整共享 Dither Canvas 的可见度；桌面、手机与 Reduced Motion 静态相位统一为 80%，点击期间为 95%。颜色、方向、密度、周期、点击范围、1350ms 回落、布局、文字与项目媒体均不变；该数值仅用于本轮视觉判断，未冻结为最终值。

2026-08-13 — 点击交互径向波修订 — WAITING_FOR_REVIEW
反馈：用户认可 80% 背景可见度，希望点击交互改成非常自然顺滑的波动渐变。
修改：正式网站点击事件从随机选中方格的格内放大，改为同一 Dither 场中的径向权重波。波前以实际点击点为中心，用连续高斯带改变点阵覆盖率、单元尺寸与红青权重；尾部使用更宽、更弱的反向权重逐渐融回当前呼吸相位。没有 CSS 模糊圆环、硬边遮罩或额外 DOM 图层，也不再把整张 Canvas 从 80% 突然提高到 95%。
节奏：事件延长到约 1800ms；前 10% 平滑建立，约 68% 后开始长尾衰减。稳定态保持桌面 12 FPS / 手机 10 FPS；事件期间临时提高到桌面 24 FPS / 手机 18 FPS，结束后自动回落。Reduced Motion 继续不触发点击波。
检查：应用内浏览器在页面中段实际点击并捕捉建立、扩展、回落三个时刻；波前连续、无硬圆环，最终恢复原呼吸场，控制台无错误或警告。相关 ESLint、`git diff --check` 与生产构建通过；构建只保留既有 Browserslist 数据提示和 Tailwind ambiguous class 警告。等待用户体感验收。

2026-08-13 — 正式网站细节收尾 / 支线发布 — DONE
导航：将左侧品牌标识整体下移并与右侧导航标签共用垂直中线；手机端品牌与 MENU 同步校正。390×844 实测两者中心差为 0px。
项目索引：03 / 05 的快速预览改为指针意图触发。鼠标进入词条后显示环形进度指针，连续停留 1000ms 后圆环正好完成并显示预览；提前离开或切换词条会取消。预览固定在指针右侧 32px、跟随移动，并通过 Portal 脱离页面层叠上下文，以最高页面层级显示。
预览动效：打开时使用 280ms、6 阶的像素块裁切展开，并叠加一次 8px Dither 网格退场；不改写、不点阵化真实视频。Reduced Motion 取消分阶段展开并立即完成圆环，触屏不显示悬浮预览。
字体：正式首页、Archive 与悬浮预览统一使用 Fusion Pixel 像素字体族；真实项目媒体保持原样。
检查：应用内浏览器桌面验证 500ms 时仅有进度环、1000ms 后才有预览；预览位于指针右侧并跟随，层级为 2147483000。手机导航中线、像素字体和无横向溢出均通过。生产构建、定向 ESLint 与 `git diff --check` 通过后发布到开发支线；未进入 Round 9B，未合并 main，未创建 PR。

2026-08-13 — 中文像素字体覆盖修复 — DONE
问题：Hero 正文、项目摘要、实习说明、教育与奖项列表仍显示为非像素字体。原因不是 Fusion Pixel 缺少简体中文字形，而是这些组件原有的高优先级 `JetBrains Mono` 声明覆盖了上一轮的通用字体规则。
修复：将简体中文 Fusion Pixel 字体声明提升到全局加载层，并把正式首页、Archive 与浮动预览的最终字体锁定设为最高优先级。页面 DOM 文本统一使用 Fusion Pixel；项目图片、视频、截图、Sketchfab 与独立嵌入作品仍保持自身字体和原始画面。

2026-08-13 — Docs 规范整合 — DONE
结果：将已经实施的结构、ASCII + Dithering 视觉、背景呼吸、同源点击波、03 / 05 预览、Fusion Pixel 字体、导航与响应式边界合并为 `docs/portfolio-design-system.md`，并把它设为当前唯一可执行规范。`docs/adding-real-ue-project.md` 继续作为唯一专项维护指南。
清理：删除已实施的结构计划、拆分的旧视觉 / 动效稿、两份废止提案、项目盘点快照、Archive 命名草案，以及未被引用且代表已否决方向的 6 张实验截图。删除内容均仍可从 Git 历史恢复。
约束：历史日志只用于追溯，不能覆盖新规范；下一阶段仍须用户明确指定，不进入旧 Round 9B–9E，不改 main。

2026-08-14 — P1 暗色垫层移除与 Archive 修订 — DONE
修改：移除 `App.tsx` 中 Pixel Signal 时代遗留的深色容器与 `DotGridBackground` 挂载，`body` 底色改为审批过的 `#f3f5f3`；Archive 三个内容区块补齐与首页相同的全宽罩层（`box-shadow 100vmax` + `clip-path`）；移除 Archive 大面积 `backdrop-filter` 模糊层（卡顿主因），筛选按钮与项目词条更新为主站青色体系（实底按钮、青色激活描边、浅青 hover），删除酸性黄绿与深色死规则；Archive 与主站全部像素文字取消加粗（700/800 → 400）；Archive 列表、筛选条与预览面板补齐与首页一致的左侧内边距；筛选条获得与区块相同的 0.74 全宽底色。字体加载优化：删除 Google Fonts 的 Inter / JetBrains Mono 外部导入，`index.html` 为 Fusion Pixel 加 `preload`，全站字体加载收敛为单一本地 648KB 像素字体。
检查：`git diff --check`、生产构建、相关 ESLint 通过；新增本地截图工具 `tmp/shots/shot.mjs`（playwright-core 驱动系统 Edge，不进项目依赖），已用 1440 桌面 / 2560 超宽 / 390 手机截图自检首页与 Archive。
确认：用户验收通过浅色基底、Archive 流畅度与按钮体系、字重、内边距与字体加载优化。

2026-08-14 — Round 10 计划 — DONE / 10A NEXT
确认：用户验收 Round 10 计划与四项关键决策（白底深字、每会话一次可跳过、Archive 同一外壳、手机极窄边框）。
状态：Round 10 标记为 `NEXT`，允许开始 Round 10A 外壳实现。

2026-08-14 — Round 10A — WAITING_FOR_REVIEW
修改：新增 `src/components/crt/` CRT 显示器外壳——哑光暖灰塑料边框（环形 mask 渐变 + 噪点）、四角塑料角件（`--crt-plastic` 共享材质 + fixed 附着）、逐角可调折角阴影（暗端/亮端/方向/范围/过渡位置/过渡宽度，裁切在外壳环形区）、玻璃层（四边独立压边阴影 + 四角径向暗部 + 常驻反光，鼠标 3px 微移，Reduced Motion 关闭）、右下角电源凹槽与 ZHUYIJIA 小字。导航、Dither Canvas、Portal 预览、Archive sticky 预览与页面起始空间全部收进屏幕区。层级：玻璃 → 塑料机身 → 角件 → 折角阴影 → 电源槽。阴影参数按用户调校固化（上缘 0.79 / 下缘 0.535 / 左 0.715 / 右 0.695 等 36 项）。临时调参卡已随本轮删除（`CrtTuner` 组件与样式、App 挂载均移除），36 项参数以 CSS 变量形式保留在 `crt-shell.css` 供后续微调。
检查：生产构建、相关 ESLint、`git diff --check` 通过；本地截图工具多轮自检桌面 1440 / 1911、手机 390 与四角放大；排查并修复 canvas 替换元素不拉伸、mask XOR 奇偶泄漏等问题；10B 未开始。
需要用户确认：外壳整体质感与当前固化参数（10A 仍待验收）；确认后进入 Round 10B 开机序列。

2026-08-14 — Round 10A 验收修订与收尾 — DONE
修订 1（参数固化）：按用户调校更新 36 项阴影默认参数（上缘 0.71、角部暗部 0.2 / 0.195 / 0.17 / 0.18、左下折角范围 5.6、反光 0.05 / 0.06 等），写入 `crt-shell.css` 的 `:root` 与调参面板 `DEFAULTS`。
修订 2（切割圆角化）：折角阴影的内切割从直角 content-box 矩形改为带可调圆角的矩形；mask 按自底向上合成（切割矩形 → 全白 subtract → 角方块 conic add → 圆盘补集 radial intersect），修复了 composite 数量不足导致整层被减空、以及 `mask-position` 百分比对齐偏移两处问题；四角不再显露白色三角。
修订 3（调参面板恢复）：从左下角恢复 `CrtTuner`，新增外框底色渐变方向（`--crt-plastic-angle`）与切割框参数（水平 / 垂直偏移、宽 / 高调整、圆角半径 `--crt-cut-*`）；悬停 / 聚焦参数行显示对应区域的红色虚线参考框（仅调试提示，不进入画面）；点击右侧数值可直接输入，Enter / 失焦提交并自动夹取范围。
修订 4（顶部横向交互条）：移除视口原生纵向滚动条（仅根级，内部滚动容器保留），新增 `src/components/scroll-rail/ScrollRail.tsx`，固定在 CRT 屏幕最顶边、不新增独立栏目带；青色进度线与滑块反映阅读位置，01–08 章节刻度与导航当前状态同源同步（监听 `.portfolio-shell` 的 `data-active-section`），支持点击 / 拖拽跳转与键盘操作；Archive 复用为纯进度条。导航章节定义抽至 `src/sections/portfolio/navigation-sections.ts` 共用。
检查：生产构建、相关 ESLint、`git diff --check` 通过；Edge 无头截图自检桌面 1440 首页 / Archive、四角放大与顶边交互条；拖拽与悬停提示由用户实机验收。
确认：用户验收通过外壳质感、固化参数、圆角切割与顶部交互条；Round 10A 标记为 `DONE`，Round 10B（开机序列）标记为 `NEXT`，等待确认后开始。调参面板暂留，验收全部结束后随 10B 一并移除。

2026-08-14 — Round 10B 开机序列 — DONE
实现：新增 `src/components/crt/BootSequence.tsx` 与 `boot-sequence.css`。状态机：黑屏 0.2s → 开机 500ms（中心亮点 → 水平亮线 → 纵向展开为白屏，纯 transform / opacity）→ 打字机逐字打出 `ZHU YIJIA PORTFOLIO` 与 `UE / C++ GAME DEVELOPER`（块状光标 420ms 全程闪烁，行间留 4 tick 停顿）→ 打完光标再闪 5 次 → 文字 3 处水平位移故障并淡出 → 白屏提亮为纯白 → 连续收成发光水平亮线 → 缩成中心亮点熄灭（560ms，cubic-bezier(0.55,0.06,0.35,1)，无停顿）→ 撤场进主站。Overlay 只覆盖屏幕区（`inset: --crt-bezel` + 屏幕圆角），z-index 2900 位于页面内容之上、CRT 玻璃层（3000）之下，玻璃压暗与反光压在开机画面上。开机白屏内嵌第二个 Dither Canvas 实例（同一冻结参数）+ 与主站相同的 0.74 罩层，点阵强度与主站一致。
交互：任意点击 / 按键跳过——打字与闪烁阶段跳过仍播放完整故障收线；黑屏 / 开机阶段直接进主站；收线期间忽略跳过。Reduced Motion 完全不出现；播放期间锁定页面滚动；手机简化版（打字 40ms、闪 3 次、无故障位移）。Archive 不播放。每会话一次暂为测试模式（每次加载重播），Round 10 整体验收后决定是否恢复 sessionStorage 门控（保留 key `zhuyijia-crt-booted` 注释）。
修复：开机文字字体作用域（`--portfolio-pixel-font` 仅定义在 `.portfolio-shell` 内，开机层改用直接字体族声明）；第二行打字时第一行被顶起（第二行从始渲染隐藏光标占位行高）；息屏前"先关再开"闪烁（280ms 延迟期回退基础样式，fill 模式 forwards 改 both）；结尾黑屏硬切（收线时 Overlay 底色转透明，白色层收起时直接揭开同样白底点阵的主站，删除 120ms 黑屏停顿）。
清理：CRT 调参面板（CrtTuner 组件、样式与 App 挂载）随本轮移除，36 项参数已固化在 `crt-shell.css`，可从 Git 历史恢复调参工具。
检查：生产构建、相关 ESLint、`git diff --check` 通过；Edge 无头分阶段截图自检开机亮线、打字（像素字体 / 块状光标 / 双行不跳动）、收线后落点、390×844 手机简化版与 Archive 不播放；跳过路径与 Reduced Motion 由用户实机验收。
确认：用户验收通过开机序列完整流程、收线节奏与跳过行为；Round 10B 标记为 `DONE`，Round 10C（联合回归与规范更新）标记为 `NEXT`，等待确认后开始。

2026-08-14 — 主界面修订（10C 前）— DONE
修改：① Hero 改为任意尺寸满首屏：桌面 `min-height: calc(100svh - 64px - 2×bezel)`、手机 `calc(100svh - 58px - bezel)`，删除 ≥1100px 断点的 68svh clamp 覆盖；顺手删除 ≤440px 把能力条压成单列的旧规则（恢复 2×2），390×844 实测 hero 高度 = 776px 正好一屏，首屏不再露出 02 区块。② 02 GAME WORK 区块删除专属背景层（两处 `rgba(238,243,242,0.9)` 背景 + 全宽阴影声明），与其他区块共用同一层 0.74 浅罩（手机 0.84），点阵透出强度全站统一。③ Runtime Signal Viewport 停留位置重构：回到原生 `position: sticky` 原理（同用户提出修改前），停留阈值由 JS 在几何变化时计算 `top = (视口高 + 64) / 2 − 半盒高`，使框体中心停在导航下方可视区中心；进入时框顶与右栏首卡片顶齐平、划到中心才停留、栏底框底与末卡片底齐平后自然被接走，全程滚动零 JS。坑：自定义属性 `--crt-bezel` 的 computed 值是未求值的 `clamp()` 字符串，不可 parseFloat，改为读取框架元素解析后的几何。
检查：生产构建、相关 ESLint、`git diff --check` 通过；playwright-core 驱动 Edge 实测 1440×900 五档滚动位置的三态对齐数据（顶齐平 / 中心 482 停留 / 底齐平 652=652 / 同步退出）与 390×844、360×740 首屏高度；新增本地截图工具 `tmp/shots/`（playwright-core，已加入 .gitignore，不进版本库）。
确认：用户验收通过三项修订。

2026-08-14 — Round 10C 联合回归与规范更新 — DONE
回归：playwright-core 驱动系统 Edge 完成八组检查——桌面 1440 顶部 / 中段 / 页尾、390×844 触屏顶部与页尾、Reduced Motion、Archive 桌面与手机。开机序列正常播放、Esc 跳过播收线后无残留（Dither Canvas 从 2 回到 1）、Reduced Motion 直达主站、Archive 不播开机；所有页面横向溢出为 0；导航、ScrollRail、CRT 外壳在各尺寸就位；手机菜单 7 入口正常开合。键盘回归：Tab 依次经过导航、02 / 03 / 05 词条、Archive 入口、Contact 四格与返回顶部，焦点描边可见；ScrollRail 可聚焦（`role="slider"`），End 键直达页尾（scrollY 6257 = maxScroll，aria-valuenow 100）。
修复：favicon 404（`index.html` 加入内联 SVG 像素方块图标）；全局焦点描边从遗留酸性黄绿 `#D8FF32` 改为交互青 `#169eae`，选区颜色从红色改为 `#28b6c3`（`src/App.css`）。
性能：CRT 外壳零常驻重绘（无动画循环，仅指针移动驱动的反光 transform 且 rAF 节流）；ScrollRail 仅滚动事件驱动；待机页面满帧率无长任务，唯一常驻绘制是已验收的 12 FPS Dither 背景。
文档：`docs/portfolio-design-system.md` 升级为 v2——新增第 11 节 CRT 显示器外壳（层级、材质、圆角切割、36 项固化参数、零常驻重绘）与第 12 节开机序列（阶段、层级、跳过、降级、测试模式说明），第 3 节禁令加入开机序列例外条款，第 4 节冻结参数补充边框厚度与屏幕圆角，第 10 节写入 ScrollRail 替代原生滚动条；README 更新开机仪式描述。
未提交 Git；等待用户验收 Round 10C 后将 Round 10 整体标记为 DONE，并决定开机序列是否恢复每会话一次。

2026-08-15 — Round 10 整体验收 — DONE
确认：用户验收 Round 10C 的联合回归、规范 v2 与 README 更新；Round 10（10A 外壳 / 10B 开机序列 / 10C 回归与规范）整体标记为 `DONE`。
决定：开机序列保持每次加载重播，不恢复 sessionStorage 门控（规范 v2 与代码注释已同步）。
状态：无 `NEXT`；下一阶段由用户明确指定。

2026-08-15 — 内容内突实验 — REJECTED / REVERTED
试验：用 SVG feDisplacementMap + 程序生成径向位移图把页面内容做成与点阵背景同向的内突隆起（屏幕中心锚定、四边钉住、强度 / 曲线指数调参面板）。
否决：用户实测后判定得不偿失——文字在边距处剪切撕裂、滚动每帧重栅格化有性能代价、命中区与画面有位移偏差；点阵上的 8% 内突放到文字内容上不成立。
回退：删除 `ContentWarp.tsx` / `content-warp.css` 与 App / PortfolioHome 接入，工作区回到 `00e5035` 状态；实验代码可从本条目前的工作区历史或会话记录追溯，未提交。

2026-08-15 — 全站配色参数系统与黑底终端默认主题 — DONE
配色系统：新增 `src/lib/live-theme.ts` + `src/components/crt/ColorTuner.tsx`（永久保留的调参面板）。10 个合并颜色参数（页面背景 / 主要文字 / 主色 / 深色 / 交互色 / 大标题色 / 辅助文字色 / 点阵底色 / CRT 外框 / 遮罩面板色）+ 遮罩透明度滑杆 + 6 套预设；点阵引擎经 `liveDitherPalette` 引用共享实时换色。底层把全站 118+ 处硬编码色改为变量派生（`rgb(from var(...) r g b / α)` / `color-mix`）：墨色 rgba 跟随 ink、纸白 rgba 跟随 veilColor、三类青色跟随 primary/deep/active，surface/muted/shell 底色分别跟随 veilColor/site-bg。CRT 外壳 40 项阴影参数（外框渐变方向 / 切割框 / 四边压暗 / 角部暗部 / 四角折角×6 / 玻璃反光）全部暴露并可按预设绑定（preset.shell 覆盖），浅色预设封存 08-14 锁定值（LIGHT_FRAME_SHELL），深色外框预设共用 DARK_FRAME_SHELL。
单色可用性修复：黑底下交互色≈正文色导致 hover 无反馈——行 / 条目 / 按钮 hover 增加交互色 12% 背景提亮；滚动进入区块的标题变色恢复为跟随交互色 + 标题栏 10% 交互色洗刷（替换旧 transparent 锁定）；游戏区 `--signal-void` 从旧硬编码近白改为 `var(--site-bg)`，修复查看项目按钮 hover、视窗标签条、切换条激活段、RESERVED 徽章的白底白字。
默认主题切换：黑底终端设为全站默认（`:root` 变量、`DEFAULT_PALETTE`、`liveDitherPalette` 初值、`crt-shell.css` 折角 / 反光默认值、ColorTuner 初始态全部同步），开机界面与 Archive 页随变量体系一并切换，无 FOUC。开机收线阶段的纯白提亮保留——黑屏上收白线是经典 CRT 息屏观感。
检查：生产构建、相关 ESLint、`tsc --noEmit` 通过；playwright 实测全新加载即为终端主题（body #0b0d0c / h1 #f4f7f2 / veil 0.6 / 折角反光新默认值 / 点阵 #0f1211 底）、Archive 同步、五类元素 hover 与滚动变色在两套主题下均有可见反馈。
确认：用户决定调参面板永久保留，暂定黑底终端为默认风格，下一阶段进入细节打磨。

2026-08-15 — 细节打磨批次（泛光 / 椭圆反光 / 息屏连贯 / 开机等待）— DONE
修改：① 玻璃新增椭圆反光层（`.crt-shell-glare`，圆角裁剪 + 绕光心旋转），8 参数入面板：位置 X/Y、半径 X/Y、角度、过渡位置、过渡带宽、反光系数；用户调校固化（83/22、57/66、1°、22/15、0.1；反光主带 0.1、副带 0.005）。② 文字泛光改三层配方（0.25R 高亮核心 + 1R 中晕 + 3R 远晕，强度 2.2/1/0.45 递减），修复面板写 `5px` 导致 `calc(px×px)` 整条 text-shadow 失效的 bug（面板改写纯数字）；新增泛光颜色参数（默认跟随文字 currentColor，可选色覆盖，重置/复制参数均已接入）；用户调校固化（半径 20、强度 0.15）。③ 开机息屏深色适配：收线底色从硬编码纯白改为 `--site-veil-color`，收线关键帧加入亮度渐变（深色挤压同时荧光汇聚成白线再熄灭），消除黑站上的白屏硬闪；跳过路径（打字/闪烁 → 故障收线）经实测未回归。④ 开机等待优化：纯黑停顿 200→50→0ms；实测黑屏主因是 JS 加载（dev 约 0.9–1.3s、生产约 0.8–1.6s），`index.html` 内联深色底让首帧即 CRT 关机态、消除白闪。
检查：生产构建、`tsc --noEmit`、相关 ESLint 通过；playwright 实测泛光三层计算值、面板改值不失效、自定义泛光色与跟随恢复、跳过息屏各帧（故障 / 收线 / 揭幕）、dev 与 preview 加载耗时、白底两套预设泛光归零。
提交：`ae733f3` 已推送（含本轮前配色系统、黑底终端默认主题与单色修复）。

2026-08-16 — 复古程序窗口系统 + 子盒配色清扫 — DONE
配色清扫：全局 `--valiente-*` 旧变量改为 `--site-*` 别名（修复 portal 到 body 的浮动预览框显示远古橙 #FF3D00）；54 处旧硬编码派生化——酸性黄绿 rgba(216,255,50,·) → site-active、暗橄榄 rgba(72,84,15,·) → site-deep、中性灰 rgba(138,138,133,·) → site-ink。游戏视窗舞台区的近黑/近白为物理暗室设定，刻意保留。
窗口系统：删除 iOS 风格 IframeLightbox，新增 CRT 屏幕内复古程序窗口（Win3.1/95 风格，站点配色）。`LightboxContext` 升级为多窗口管理器：同 key 置前不重复开、点击置前（z 计数器）、ESC / 背景点击关最上层、像素 × 关指定窗口，明确不做拖动。直角凸起边框、深色像素标题栏（聚焦交互色字 / 失焦 muted）、CSS 像素图标（最大化 / 还原 / 关闭统一绘制）；尺寸比例化 min(1400px, 90%) × min(880px, 85%)，多开级联错开，最大化铺满屏幕区（`:has()` 取消级联偏移），手机退化为全屏 sheet；层级在内容之上、玻璃之下（z 2500）。02 与 Archive 的「查看项目」统一开窗，Archive 外链改为窗口。修复窗口父容器尺寸不定导致移动端塌缩、标题栏重写误吞 is-maximized 规则两处 bug。
文档：`docs/portfolio-design-system.md` 新增第 13 节（配色系统与调参面板）与第 14 节（复古程序窗口），开机序列节同步无黑屏停顿与深色收线，旧 13/14 顺延为 15/16。
检查：生产构建、`tsc --noEmit` 通过；playwright 实测双窗 z 序与置前、ESC / × 关闭、Archive 开窗、390px 全屏 sheet、1600 / 2560 窗口尺寸、最大化切换数值。
确认：用户验收窗口风格与尺寸比例，标题栏点阵纹理经试装后去除。

2026-08-17 — 02 预留位接入《显影 / DEVELOP》+ ECHOFLASH 封面替换 — DONE
显影接入：交付包 `develop-web-package-20260816.zip` 的 `01-site` 全量复制到 `public/embed/develop/`（34MB，全相对路径零改动）；封面 `public/projects/develop/cover.webp`（包内 S1）、预览 `preview.mp4`（23MB hero 太重，用 725KB 的 V01 片段）。`ue-project-upcoming` 条目按 `docs/adding-real-ue-project.md` 规范更新：标题 DEVELOP — 《显影》、published、2026、七个真实系统标签（Scene Capture / Render Target / Procedural Mesh / Line Trace / Undo / Restore 等）、中文摘要、detailUrl 指向 embed。实测 01 卡真实封面进共享视窗、复古窗口打开 WebGL 取景器正常。
ECHOFLASH 封面：用户提供的 16:9 新图（1920×1080）置于 `public/covers/echoflash-16x9.png`，`portfolioDerivedAssets.json` 的 `game-001` 封面派生映射指向新图（ratio 16:9）；`covers/echoflash.png` 原图与详情页均不动。期间发现用户侧曾把 4:3 crop webp 误覆盖到 `covers/echoflash.png`（webp 内容 png 后缀），已从 git 恢复原文件。
检查：生产构建、`tsc --noEmit` 通过；playwright 实测 01 卡内容、embed 窗口加载、02 卡新封面在共享视窗正常显示。

2026-08-17 — O1+O3 死代码与 CSS 遗产清理 — DONE
删除文件：整个 `src/components/ui/`（55 个 shadcn 组件，含 text-scramble / bilibili-player / dot-grid-background / video-player）；旧 section `AboutSection.tsx` `HeroSection.tsx` `StickyNavigation.tsx` `WorkDetailSection.tsx` `WorksIndexSection.tsx`；旧组件 `Preloader.tsx` `SmoothScroll.tsx` `SectionSnapController.tsx` `VideoPlayer.tsx`；`src/hooks/use-mobile.ts`（hooks 目录删空一并移除）；`src/lib/utils.ts`（cn helper）；`components.json`（shadcn 配置）。删除前全库 grep 核实：这些文件只互相引用，无活代码 import；删后复查 0 残留。
卸载依赖：48 个（全部 @radix-ui/* 26 个 + @hookform/resolvers、@types/three、class-variance-authority、clsx、cmdk、date-fns、embla-carousel-react、framer-motion、input-otp、lenis、next-themes、react-day-picker、react-hook-form、react-resizable-panels、recharts、sonner、split-type、tailwind-merge、three、vaul、zod），卸载前 grep 确认 src 零引用。保留 @gsap/react、gsap、lucide-react、react、react-dom；dependencies 从 26 行精简到 5 个包。
tailwind.config.js：删除 sidebar 全套颜色扩展与 accordion-down/up、caret-blink keyframes/animation（grep 确认活代码未用任何 shadcn 色 token 与动画类）。
CSS 清理（每个选择器均先 grep 核实 0 使用）：`src/index.css` 删 `.display-giant` `.body-mono` `.work-title` `.nav-link` `.sticky-nav` `.sticky-nav-bar`（含移动端 blur 媒体查询）`.section-full` `.char-reveal` 及 utilities 层 `.text-valiente-red` `.bg-valiente` `.text-balance`；触屏 touch-action 媒体查询保留但去掉 `.work-item` 选择器（button/a 全局规则仍在）。`src/App.css` 删 `.site-skip-link`（全库无引用，原跳转链接元素已不存在）`.work-item` 全套 `.timeline-item` `.body-mono` `placeholder-pulse` + `.aspect-[4/3] .section-label` `.nav-link` 下划线 `.display-giant` 媒体查询、Bilibili 播放器整块（`.video-player-*` 及两个媒体查询）。保留 `.section-label` `.work-index`（code 组件与 portfolio section 在用）、`:root` 全部主题变量、`--valiente-*` 别名（archive-page.css 等活代码在用）、`--site-*`、CRT 泛光、像素字体、滚动条样式。
构建体积：JS 400.04 kB（gzip 135.11）基本持平——死代码本就不在打包图内；CSS 240 kB → 160.25 kB（gzip 25.60），降约 33%。
检查：`tsc -b` 通过；`npm run build` 通过；`npx eslint src` 仅剩 1 个既有错误（`LightboxContext.tsx` react-refresh/only-export-components，本次未触碰该文件，为基线问题）；`git diff --check` 通过；74 文件变更（+70 / −12093 行）。5173 dev server 在清理时已被 HMR 中断，临时重启验证 `/` 与 `/archive` 均 200 后关闭，待主代理重启回归。

2026-08-17 — O2 图片懒加载与 WebP 压缩 — DONE
修改：为四个关键 `<img>` 节点添加 `loading="lazy"`：`RuntimeSignalViewport` 共享视窗封面、`InteractiveProjectIndex` 悬浮/展开预览封面、`FeaturedGamesSection` 精选项目封面、`RelevantWorkSection` TAJIMA 贴图。使用临时安装的 `sharp` 转换封面为 WebP：`echoflash-16x9.png` 1.5 MB → 133 KB（8.9%）、`echoflash.png` 1.2 MB → 99 KB（8.5%）、`eraser-odyssey.png` 496 KB → 221 KB（44.7%）；随即卸载 `sharp`，不在项目中保留依赖。同步更新 `portfolioProjects.ts`、`portfolioDerivedAssets.json`、`portfolioAssetCrops.json` 中对应的 source/derived 路径，以及 `public/embed/echoflash-detail/index.html` 的 video poster；删除原 PNG 文件。
检查：`npm run build` 与 `git diff --check` 通过；curl 验证 4 个 WebP 资源均返回 200 image/webp；playwright 桌面/Archive/390 手机截图无样式缺失；原 PNG 引用全库清零。未提交 git。

2026-08-17 — O5 Canvas 底层微优化 — DONE
修改：`src/features/ascii-lab/asciiEngine.ts` 新增调色板混色缓存（`getMixedPalette`），按 `${paper}:${coral}:${cyan}` 键值缓存 `coralLight` / `cyanLight` / `cyanDeep`，主题未变时不再每帧解析并混色 3 个 hex；`src/sections/portfolio/PortfolioDitherBackground.tsx` 给 `resize` 加 120ms 节流，避免拖动窗口时每帧重绘全幅 Canvas，并在 effect cleanup 中清除待执行的 timeout。
检查：`npm run build`、`git diff --check` 通过；JS bundle 增加 0.32 kB（可忽略）；桌面/Archive/390 手机截图无视觉回归。未提交 git。

2026-08-17 — O7-1 黑底终端主题转正 — DONE
修改：删除 `src/index.css` 中 `:root` 默认主题注释里的“（2026-08-15 暂定）”字样；`docs/portfolio-design-system.md` 第 13 节将“当前默认主题为「黑底终端」”改为“默认主题为正式确定的「黑底终端」”，确认 ColorTuner 永久保留、6 套预设继续可用。
检查：`npm run build`、`git diff --check` 通过；未提交 git。

2026-08-17 — 简历下载切换器 — DONE
修改：新增 `src/data/resume.ts` 简历配置文件与 `src/components/resume/ResumeDownload.tsx` 组件。`ResumeDownload` 根据 `available: true` 的条目数量自动降级：只有一份简历时显示单一下载按钮（保持现有 Hero「下载个人简历」与 Contact「简历 / RESUME · 中文」卡片）；多份简历时显示语言切换按钮组 + 下载链接。Hero 与 Contact 的硬编码简历链接均替换为组件。预留了英文简历注释模板：放入 `public/documents/ZhuYijia_Resume.pdf` 并将该条目 `available` 改为 `true` 即可自动出现切换 UI。
检查：`npm run build`、`git diff --check` 通过；桌面首页与 Contact 区截图显示单一下载按钮正常。未提交 git。

2026-08-17 — 修复开机画面卡顿 — DONE
问题：开机序列 `BootSequence.tsx` 内嵌了第二个 `PortfolioDitherBackground`，它以桌面 12 FPS / 手机 10 FPS 的呼吸循环运行，导致覆盖在全屏上的开机动画背景看起来明显掉帧、卡顿。
修复：给 `PortfolioDitherBackground` 新增 `frozen` 属性；`frozen=true` 时只绘制一帧静态点阵并立即退出，不启动 `requestAnimationFrame` 循环、不监听 pointer/resize/focus/visibility 事件。`BootSequence` 的背景改用 `<PortfolioDitherBackground frozen />`，主站背景仍为动态循环。保留开机画面的点阵质感，但消除低帧率循环带来的卡顿感。
检查：`npm run build`、`git diff --check` 通过；桌面首屏截图确认背景正常；已随 `bd9c5c5` 推送。

2026-08-17 — 配色调参面板默认隐藏 — DONE
修改：`src/components/crt/ColorTuner.tsx` 默认不渲染（`visible` 初始读取 `location.hash === '#tuner'`）；通过 URL hash `#tuner` 或快捷键 Ctrl+Shift+T 唤出，面板头部新增「关闭」按钮（或再按快捷键）关闭。不写 localStorage，刷新页面恢复默认主题；调参功能与全部参数完整保留。`docs/portfolio-design-system.md` 第 13 节「永久面板」描述同步更新为「默认隐藏、功能永久保留」。
检查：`npm run build`、`git diff --check` 通过；未提交 git。

2026-08-17 — 修复 O2 懒加载封面全隐形回归 — DONE
问题：02 GAME WORK 共享视窗封面纯黑、只在滚动切换瞬间出现画面（实为 dither 交接 canvas 的帧）。根因不是当日改动——`src/App.css` 遗留模板规则 `img[loading] { opacity: 0 }`（配套淡入 JS 从未存在），O2（12e3082）给共享视窗 / 03·05 预览 / 精选卡片 / TAJIMA 贴图的 img 加上 `loading="lazy"` 后全部命中该规则永久隐形，透出 stage 的 #050605 黑底。
实证：puppeteer-core + 系统 Edge headless 量得激活层 img complete=true、naturalWidth=1920、elementFromPoint 为 IMG 自身，但 computed opacity=0；全库 grep 确认无任何 JS 移除 loading 属性或做淡入。
修复：删除 `src/App.css` 的「Loading state for images」整块（`img { opacity: 1; transition }` 与 `img[loading] { opacity: 0 }`）。
附带发现：`72f321d` 简历切换器提交漏了 `src/data/resume.ts`（`ResumeDownload.tsx` 第 3 行 import 它），文件仅存在于工作区，远程 build 必挂——需随本次一并补提交。
回归：headless 实测 02 区 DEVELOP / ECHOFLASH 封面正常渲染；03 区键盘聚焦词条三个预览封面 opacity 全部恢复 1；390×844 手机端 02 卡片封面正常；Archive 页正常。临时依赖 puppeteer-core 与诊断脚本已清理（tmp/ 本就在 .gitignore）。
检查：`npm run build`、`git diff --check` 通过；未提交 git。

2026-08-25 — 修复线上 /archive 404 — DONE
问题：线上站点（Vercel 托管）点击「完整作品档案」跳转 /archive 返回 404。根因：站点为单页应用，路由由 `src/App.tsx` 在客户端读取 `window.location.pathname` 判断；本地 Vite dev server 对未知路径自动回退 index.html，但 Vercel 静态托管找不到 `/archive` 文件直接返回 404，index.html 根本未下发。
修复：新增 `vercel.json`，配置 rewrite 规则将 `/archive` 与 `/archive/` 指向 `/index.html`，SPA 接管后正常渲染 ArchivePage。
检查：`npm run build` 通过；待推送 main 后 Vercel 自动部署生效。
