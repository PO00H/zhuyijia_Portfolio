# UE / C++ 游戏开发作品集改版计划

> 状态：结构草案，等待确认后实施  
> 当前阶段：只重组信息架构，不修改配色、字体、现有项目正文和素材路径

## 1. 改版目标

网站的单一首要任务是：让招聘方在进入网站后的短时间内确认——朱翊嘉是一名以 Unreal Engine 与 C++ 为核心、同时理解玩法、美术资产和工具管线的游戏开发者。

首页不再承担“完整展示全部内容”的任务，而承担以下三个任务：

1. 明确岗位方向：UE / C++ 游戏开发。
2. 优先展示最能证明游戏开发能力的项目。
3. 让招聘方可以快速进入完整案例、查看履历并联系本人。

## 2. 本轮固定约束

- 保留当前配色，不在结构阶段重新选色。
- 保留当前字体，不在结构阶段重新选字。
- 不重写现有项目正文。
- 不搬动或删除现有项目素材和独立 HTML。
- 现有 Design、Game、Code 内容全部保留，但改变首页展示权重。
- 为即将加入的真实 UE 项目保留一个正式入口。
- UE 项目占位与 Eraser's Odyssey 使用同级的数据结构和页面入口能力。
- 结构确认前不开始制作大规模动效。

## 3. 推荐的信息架构

```text
全局导航
│
├── 01 Hero / 职业定位
│
├── 02 Featured Game Development / 核心游戏开发项目
│   ├── Upcoming UE / C++ Project（正式预留位）
│   ├── ECHOFLASH
│   └── Eraser's Odyssey
│
├── 03 Unreal Systems Lab / UE 技术实验
│   ├── IK 重定向
│   ├── 迭代缩小
│   └── 跟随指针
│
├── 04 Industry Experience / 实习与生产实践
│   ├── Meshy.ai — Technical Art Intern / Tools & Pipeline（重点展开）
│   └── 浙江无端科技 — Game Interaction & UX（紧凑呈现）
│
├── 05 Relevant Visual & Pipeline Work / 与 UE 开发相关的辅助能力
│   ├── StoneCity — 石之城
│   └── TAJIMA Cutter — PBR 美工刀
│
├── 06 Archive / 完整作品档案
│   ├── 3D / Visual：全部 5 个项目
│   ├── Web Design：全部 10 个项目
│   └── AI Interface：NewFace
│
├── 07 Profile / 精简履历
│   ├── 经历
│   ├── 教育
│   ├── 核心技能
│   └── 精选奖项
│
└── 08 Contact / 求职行动
    ├── 下载简历
    ├── 发送邮件
    └── GitHub / Demo（有链接后加入）
```

## 4. 各区块职责

### 4.1 Hero：用紧凑首屏建立职业身份

首屏不展示完整履历，也不罗列所有能力。它不只放一个职业名称，而是用约 65–75vh 的紧凑空间完成四件事：姓名、目标岗位、能力概括和求职行动。核心项目必须在首屏后较快露出，不能被超大标题长期挡在首屏之外。

建议的信息层级：

```text
ZHU YIJIA
UE / C++ GAME DEVELOPER

使用 Unreal Engine 与 C++ 构建玩法系统、交互原型和生产工具。
理解动画、技术美术与资产管线，能够跨越代码与最终表现完成落地。

[查看核心项目]  [下载简历]

C++ · Unreal Engine · Gameplay Systems · Tools Development
```

结构阶段允许调整文字，但继续使用当前颜色和字体。

### 4.2 Featured Game Development：网站主舞台

该区域必须位于 Hero 之后、履历之前，是全站面积和视觉权重最大的部分。

#### A. Upcoming UE / C++ Project

- 这是正式项目入口，不是普通的灰色“Coming Soon”卡片。
- 与 Eraser's Odyssey 采用同级卡片结构、尺寸规则和未来详情页能力。
- 当前状态标记为 `IN DEVELOPMENT` 或 `PROJECT SLOT RESERVED`。
- 在真实素材进入前，不伪造项目截图、技术说明或成果。
- 后续填入内容时不需要修改首页布局，只替换清单数据。

#### B. ECHOFLASH

- 定位：底层 C++ 游戏开发代表作。
- 首页只显示当前已有标题、视频、简述与技术标签。
- 后续单独补充架构、碰撞、FSM、对象池和调试证据，不在结构阶段重写。

#### C. Eraser's Odyssey

- 定位：完整游戏项目与跨职能协作能力证明。
- 保留当前独立 HTML 和全部项目内容。
- 在 UE/C++ 求职语境中作为“理解玩法并能完成原型”的辅助核心项目。
- 与新 UE 项目拥有同级入口能力，但介绍重点不同。

推荐布局不是三个普通小卡片，而是一个可扩展的项目序列：

```text
┌──────────────────────────────────────────────┐
│ UPCOMING UE / C++ PROJECT                    │
│ 正式预留入口 · 与完整项目同级                │
└──────────────────────────────────────────────┘

┌──────────────────────┐ ┌─────────────────────┐
│ ECHOFLASH            │ │ ERASER'S ODYSSEY    │
│ C++ ENGINEERING      │ │ GAME PRODUCTION     │
└──────────────────────┘ └─────────────────────┘
```

新 UE 项目加入后，可以根据内容强度把它提升为最大卡片，ECHOFLASH 与 Eraser's Odyssey 作为下一层双项目；数据层级不变，只调整呈现尺寸。

### 4.3 Unreal Systems Lab：合并零散 UE 练习

IK 重定向、迭代缩小、跟随指针不再伪装为三个完整游戏项目，而是合并到一个技术实验区。

该区块的目标是证明技术覆盖面：

- Animation / IK
- Blueprint Interaction
- Gameplay Prototyping
- Unreal Engine Workflow

现有视频和文字继续使用，不要求修改原始项目文件。

展示采用紧凑的横向项目索引，而不是与核心游戏项目等大的内容卡片。桌面端悬停或键盘聚焦项目名时，在指针附近显示对应视频或封面预览；所有设备点击项目名时，都统一在当前词条下方展开或折叠完整内容，不再混用弹窗、独立查看界面和二次点击逻辑。预览只帮助快速辨认项目，不改变项目层级，也不使用持续跟随或夸张位移。

### 4.4 Industry Experience：用行业经历承载生产工具与团队实践

04 的栏目名称改为 **Industry Experience / 实习与生产实践**。相比直接命名为 Production & Tools，这个名称能让招聘方先识别真实行业经历，再从具体内容中看到工具、管线和跨职能能力。

Tools & Pipeline 不被删除，而是作为 Meshy.ai 经历的核心主题下沉到项目内容中。首页优先呈现两段与目标岗位最相关的经历：

#### A. Meshy.ai — Technical Art Intern / Tools & Pipeline

这是 04 的主案例，采用“问题 → 职责 / 系统 → 技术 → 结果”的结构，不写成普通履历条目。

- **问题**：三维产品生产中存在重复操作、材质与资产处理效率问题。
- **职责 / 系统**：参与三维产品部门工具箱及生产流程建设。
- **技术**：材质与资产自动处理、API 接入、Blender PBR / UV 插件。
- **结果**：产研提效 30%。

该案例证明的不只是“做过实习”，而是能够理解生产问题、开发工具并形成可量化结果。若目前没有可公开素材，先采用文字与抽象流程图，不伪造公司内部界面、代码或数据。

#### B. 浙江无端科技 — Game Interaction & UX

作为次级行业经历紧凑呈现，用于证明游戏团队环境、交互设计和跨职能协作经验。这里只保留与 UE / C++ 游戏开发求职有关的信息，不与 Meshy.ai 使用相同篇幅，也不把它包装成核心编程项目。

#### 与 Profile 的关系

- 04 是经过筛选的行业能力证据，强调做过什么、解决了什么问题、产生了什么结果。
- 07 Profile 是时间线式履历摘要，只保留公司、职位、时间和一句职责，不重复 04 的完整案例内容。
- 家具设计等与目标岗位关联较弱的实习不进入 04，仅保留在完整履历或简历中。

### 4.5 Relevant Visual & Pipeline Work：只证明与 UE 开发相关的辅助能力

05 不再放 Creative Code 和 AI Interface。网站设计与 AI 界面全部进入 Archive，避免再次形成 Design / Game / Code 三线并列。

这一部分只回答一个问题：为什么你比只会写代码的候选人更理解 UE 游戏生产。

首页保留两个项目：

1. **StoneCity — 石之城**
   - 保留理由：UE5 场景、Niagara、材质、环境构建，并有奖项证明。
   - 首页作用：证明你理解 UE 场景从资产到最终表现的完整链路。
2. **TAJIMA Cutter — PBR 美工刀**
   - 保留理由：Blender、ZBrush、Substance、Marmoset 与完整 PBR 贴图。
   - 首页作用：证明你理解游戏资产、材质通道和 PBR 管线。

两者采用与 Systems Lab 一致的紧凑项目索引和词条下方展开方式，面积明显小于 Featured Game Development。它们不是新的主线，也不使用与核心游戏项目同等的视觉权重。StoneCity 展开现有视频与项目摘要；Tajima Cutter 展开旧站的 Sketchfab 三维查看器，并把 Base Color、Metallic、Normal、Roughness 四张 PBR 缩略图作为查看器角落的辅助信息。

以下内容不进入 05：

- Peak — 山崖 → Archive / 3D & Visual。
- Blade Runner — 银翼杀手 → Archive / 3D & Visual。
- Stylized Lemon — 风格化练习 → Archive / 3D & Visual。
- 10 个网站设计 → Archive / Web Design。
- NewFace → Archive / AI Interface。

### 4.6 Archive：保留全部内容但降低首页噪音

Archive 负责保存完整产出记录，但不再以长篇详情连续铺在首页。项目名称与归类如下。

#### 3D / Visual（5 个）

1. StoneCity — 石之城
2. Peak — 山崖
3. Blade Runner — 银翼杀手
4. TAJIMA Cutter — PBR 美工刀
5. Stylized Lemon — 风格化练习

《StoneCity》和 Tajima Cutter 会同时出现在首页精选与完整 Archive 中；Archive 是完整索引，因此允许重复入口，但不重复素材文件。

#### Web Design（10 个）

1. 音频工具网站 — 模块化工作站界面
2. 创意平台网站 — 等候名单
3. 数据控制台 — 孟菲斯风格系统看板
4. 企业服务网站 — 建筑合规咨询与审批
5. 字体品牌网站 — EXAT 页面复现
6. 互动字体网站 — EXAT 动态排版实验
7. 创作工具网站 — 终端式智能创作系统
8. 开发者作品集 — 创意前端与交互项目
9. 系统监控平台 — 实时基础设施数据看板
10. 创意开发作品集 — 代码与视觉项目

这些网站项目统一采用简化展示：封面、标题、年份、少量标签和打开按钮。Hover 视频可以保留，但不在首页逐个展开说明。

#### AI Interface（1 个）

1. NewFace — 分支式 AI 推演画布

NewFace 作为独立 Archive 分类保留，不进入首页主叙事。如果后续能够证明它与游戏工具、节点编辑器或 UE 生产流程存在真实联系，再考虑提升层级。

#### Archive 的实现选择

Archive 可以采用以下一种实现：

1. 默认折叠的分类列表。
2. 独立 `/archive` 页面。
3. 首页末端的紧凑索引，点击后继续打开现有 HTML。

推荐方案：独立 `/archive` 页面。首页只保留一个紧凑入口和作品数量摘要；Archive 页面采用“分类筛选 + 高密度名称列表 + 固定预览区”的结构。鼠标或键盘选择列表项时更新预览区，点击后继续打开现有独立 HTML 或媒体；触屏端改为点击切换行内预览。这样近 30 个项目无需全部展开成长卡片，首页保持聚焦，同时不会牺牲任何现有作品。

### 4.7 Profile：把 About 压缩为招聘摘要

首页只保留：

- 两段最相关经历：Meshy.ai、无端科技；这里只提供时间线摘要，并链接回 04 或完整简历，避免重复叙述。
- 当前硕士教育背景与本科信息。
- UE/C++ 相关核心技能。
- 3–4 个最有含金量或最相关的奖项。
- 联系方式与完整简历入口。

年龄、户籍、完整奖项、AI 工具清单等信息不删除，可以进入完整简历或展开区域。

## 5. 项目分级规则

| 层级 | 作用 | 当前内容 |
|---|---|---|
| Flagship | 直接决定是否进入面试 | Upcoming UE Project、ECHOFLASH、Eraser's Odyssey |
| Systems | 证明 UE 技术覆盖面 | IK、迭代缩小、跟随指针 |
| Industry | 证明真实团队、生产工具与跨职能实践 | Meshy.ai 工具开发、无端科技 Game Interaction & UX |
| Supporting | 证明 UE 场景与 PBR 资产管线理解 | 《StoneCity》、Tajima Cutter |
| Archive | 保留完整产出记录 | 5 个 3D / Visual、10 个 Web Design、NewFace |

## 6. 内容清单层：避免移动项目文件

结构实施时新增一个统一项目清单，现有文件继续保留在原路径。页面只读取清单决定顺序、层级、状态和入口。

建议的数据结构：

```json
{
  "id": "ue-project-upcoming",
  "title": "UE / C++ Project",
  "track": "game-development",
  "tier": "flagship",
  "status": "reserved",
  "featuredOrder": 1,
  "cover": null,
  "preview": null,
  "detailUrl": null,
  "existingContentPath": null,
  "tags": ["Unreal Engine", "C++"],
  "enabled": true
}
```

Eraser's Odyssey 使用同样的结构：

```json
{
  "id": "eraser-odyssey",
  "title": "Eraser's Odyssey — 《橡皮奥德赛》",
  "track": "game-development",
  "tier": "flagship",
  "status": "published",
  "featuredOrder": 3,
  "cover": "/covers/eraser-odyssey.png",
  "preview": null,
  "detailUrl": "/embed/eraser-odyssey/index.html",
  "existingContentPath": "/embed/eraser-odyssey/index.html",
  "tags": ["Game Development", "Godot", "Pixel Art"],
  "enabled": true
}
```

这样新 UE 项目到达时，只需补全清单字段和素材，不需要再次拆改首页组件。

### 6.1 Asset Lab：统一裁切但保留原件

在 Archive 和动效阶段之前增加一个仅本地开发环境使用的 `/asset-lab` 工具。它从原始项目清单读取全部图片与视频路径，以 16:9 为默认目标比例，允许逐项拖动、缩放、选择视频封面帧和裁切时间，并把结果保存为独立 JSON 参数。原始素材不被覆盖；批处理流程根据已确认参数生成 `/public/derived/asset-lab-v1` 下的 WebP、H.264 MP4 与视频 poster。作品集展示层通过独立映射读取派生媒体，Asset Lab 始终读取原件，以避免派生文件被重复裁切。

## 7. 导航建议

桌面端：

```text
ZHU YIJIA   GAME WORK   SYSTEMS   EXPERIENCE   ARCHIVE   CONTACT
```

移动端必须提供真正可操作的菜单，不能只显示当前栏目名称。

导航不再保留 Design / Game / Code 三者完全平级，因为这会再次模糊求职方向。

## 8. 实施顺序

### Phase 1：数据与页面骨架

- 建立统一项目清单。
- 保留所有原始素材路径。
- 建立新页面分区。
- 加入 UE 项目正式预留位。
- 把 GAME 提升到 Hero 后。
- 建立 Industry Experience 区块，以 Meshy.ai 为主案例、无端科技为次级经历。
- 把 About、Design 和 Code 重排到次级位置。
- 暂时关闭复杂入场动画，使用静态结构检查信息层级。

### Phase 2：结构验证

- 检查招聘方是否能在 10 秒内确认岗位。
- 检查前三个核心项目是否无需长距离滚动即可看到。
- 检查所有旧项目入口是否仍然可访问。
- 检查桌面和移动端导航。
- 检查真实 UE 项目加入时是否无需改布局。

### Phase 3：动效系统

- 先确定一个与 UE/C++ 开发相关的核心联动概念。
- 为每个动效记录触发、Before、After、强度和降级方式。
- 优先制作核心项目转场，不给普通履历堆叠复杂动效。
- 减少重复文字打乱和无目的淡入。
- 加入 `prefers-reduced-motion` 与触屏替代交互。

### Phase 4：配色与字体评估

- 仅在结构和动效稳定后评估。
- 保留现有方案作为基准版本。
- 判断是否需要调整，而不是默认必须更换。

### Phase 5：技术案例补强

- 新 UE 项目加入。
- ECHOFLASH 补充架构、代码、调试和性能证据。
- Meshy.ai 补充可公开的工具流程。
- 添加简历、GitHub、Demo 等真实链接。

## 9. 结构阶段验收标准

- 首屏明确出现 UE / C++ 游戏开发定位。
- GAME 是首页第一个内容区块。
- Upcoming UE Project 与 Eraser's Odyssey 都拥有正式项目入口结构。
- ECHOFLASH 位于核心项目区，而不是普通列表。
- 三个 UE 小实验被组织为 Systems Lab。
- 04 以 Industry Experience 命名；Meshy.ai 的 Tools & Pipeline 能力在案例内部明确呈现。
- 无端科技作为紧凑的相关行业经历出现，家具类经历不进入首页主叙事。
- Design 和 Code 内容没有删除，但不再与 GAME 平级竞争。
- About 不再占据首页第一大屏。
- 所有现有独立 HTML 和媒体路径继续可用。
- 配色和字体保持不变。
- 结构可以在没有复杂动效的情况下成立。

## 10. 暂不决定的事项

以下问题留到对应阶段，不在结构阶段提前锁死：

- 最终配色是否调整。
- 最终字体是否调整。
- 核心滚动联动的视觉形式。
- 是否使用 Canvas / WebGL。
- Archive 采用独立页面还是折叠列表。
- 新 UE 项目的最终名称、封面和技术描述。
- ECHOFLASH 是否建立新的独立详情页。
