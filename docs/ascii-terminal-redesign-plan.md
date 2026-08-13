# ASCII Terminal 全站改造计划

> 日期：2026-08-12
> 状态：ROUND 9A REVISION NEXT / 当前 ASCII Lab 的作品媒体转换对象已被否决，等待改为网站字符场
> 当前代码基线：Round 8D 静态像素材质已回退；Round 8C GAME WORK 转场继续作为正式页临时基线；本次只修订计划并上传分支，尚未执行 Round 9A 返工
> Round 9A 概念与验收图：[`concepts/ascii-lab-round-9a.png`](concepts/ascii-lab-round-9a.png)、[`concepts/ascii-lab-round-9a-desktop.png`](concepts/ascii-lab-round-9a-desktop.png)、[`concepts/ascii-lab-round-9a-spread.png`](concepts/ascii-lab-round-9a-spread.png)

## 1. 这次方向为什么变了

用户需要的不是“静态像素风网站”，而是：

- 网站背景、状态和界面动效真正由 ASCII 字符密度构成；项目图片和视频保持原貌。
- 字符能够在加载、滚动、项目切换和鼠标悬停时改变状态。
- 视觉像低饱和老式终端，而不是现代酸性赛博 UI。
- 强动效是稀有事件，例如 Claude Fable 发布时用户看到的紫色功率蔓延；稳定状态必须安静。
- 轻微鱼眼、四角阴影、扫描线和磷光属于后续 CRT 外壳，不抢第一轮核心交互。

因此执行顺序从“全站贴像素材质”改为“先验证一个可交互字符引擎，再逐层替换”。

## 2. 研究结论

### ASCII Magic

[ASCII Magic](https://www.ascii-magic.com/)把 Characters、Pixel Art、Dither 明确分成不同渲染方式，并能对图片与视频逐帧转换。其[字符指南](https://www.ascii-magic.com/blog/ascii-characters-full-guide)指出两项核心变量：字符坡度与网格尺寸；亮度、边缘、对比度与密度是在此基础上的调校。其[视频指南](https://www.ascii-magic.com/blog/how-to-convert-video-to-ascii)还说明，过密字符在运动中容易闪烁，清晰轮廓、较高对比与适当字号更稳定。

对本项目的结论：

- 使用 Characters，不用 Pixel Art 或 Block Characters 作为主语言。
- 作品媒体不进入 ASCII 采样管线；字符算法只服务于程序生成的网站场、状态和交互反馈。
- Character Ramp、Grid Size、Contrast、Edge Emphasis 必须成为实验参数。
- CRT、Scanline、Vignette 是后处理层，不能替代字符生成。

### GitHub / 开源实现

- [textmode.js](https://github.com/humanbydefinition/textmode.js)提供实时字符网格、字体加载、图层、图像 / 视频源与 WebGL2 实例化渲染，适合将来需要复杂多层字符场时评估。
- [p5.asciify](https://github.com/humanbydefinition/p5.asciify)展示了亮度与边缘两类 renderer、响应式字符网格和逐单元颜色控制；项目已经归档，其作者推荐迁移到 textmode.js。
- [Three.js AsciiEffect](https://threejs.org/docs/pages/AsciiEffect.html)适合把已有 3D WebGL 场景转成 ASCII，但本网站没有必要为了 2D 字符背景先引入一整套 3D 渲染器。

对本项目的结论：第一原型采用 Canvas 2D 自建小型引擎；只有真实性能或多层需求证明它不够时，再引入 textmode.js。这样更容易适配现有 React 结构、移动端和 Reduced Motion。

### Reddit / 实践反馈

- [Ghostty ASCII 动画讨论](https://www.reddit.com/r/webdev/comments/1hn9e20/)指出，真实做法可以是每帧更新字符、从预制动画转换 ASCII，或用 Canvas 按亮度映射字符；字符不改变布局时，局部更新可以顺畅。
- [Monokai 填充效果讨论](https://www.reddit.com/r/webdev/comments/gsi7ya/)描述了“空字符 → 浅字符 → 中字符 → 满字符”且能记住滚动状态的填充过程，正适合章节阅读进度。
- 另一则 [web 动效性能讨论](https://www.reddit.com/r/webdev/comments/zuu3w1/)反复提醒：全屏高强度动画很容易显著增加 CPU 占用并妨碍信息浏览。

对本项目的结论：字符状态必须可逆或可稳定、只在局部运行、静止时停绘；作品集首先要让 HR 和开发者看懂项目。

### Claude Fable 参考

[Claude Fable 官方页面](https://www.anthropic.com/claude/fable)、[官方发布文](https://www.anthropic.com/news/claude-fable-5-mythos-5)与[官方发布视频](https://www.youtube.com/watch?v=CIQBP1w4B1M)可确认参考来源，但官方没有公开说明“最高功率紫色蔓延”的组件名或实现。精确逐帧复现仍需用户提供对应片段或时间码；计划只借用用户认可的行为结构：**局部能量种子 → 不规则传播前沿 → 全场被唤醒 → 尾迹退去并稳定**，不声称复制其源码或官方算法。

## 3. 技术架构

```text
AsciiFieldEngine
├── SiteFieldSource     布局状态 / 程序形状 → 密度与边缘场
├── GlyphRamp           亮度 / 边缘 → 字符索引
├── PaletteMapper       暖琥珀 / 冷青灰 / 灰紫
├── TransitionMask      蔓延、章节填充、外围状态联动
├── PointerField        鼠标距离、速度、方向
└── CanvasRenderer      批量绘字、节流、暂停与清理

使用方
├── /ascii-lab          仅本地实验与参数对照
├── HeroAsciiField      Hero 背景与高功率启动
├── SectionAsciiStatus  章节进度与导航状态
└── GameAsciiFrameSignal GAME WORK 边框 / 状态轨联动
```

首版不把每个字符做成 DOM 元素，不让动画层接管点击，也不把整个页面截图后实时字符化。

## 4. 分轮执行

### Round 9A — ASCII Material & Interaction Lab

只新增本地 `/ascii-lab`，不接首页。

当前状态：`NEXT / REVISION`。保留 Canvas 2D 字符引擎与参数控制，移除 ECHOFLASH 和其他作品媒体作为字符源，改用程序生成的网站布局场。

实现：

- 同一个程序化网站场的 Characters / Block Characters / 当前 Dither 三栏对照，直接确认媒介差异。
- 三套低饱和配色 A 暖琥珀、B 冷青灰、C 灰紫。
- 字符坡度、列数、对比度、边缘强调、背景密度控制。
- 高功率蔓延：自动一次 / CTA 起点两种触发。
- 鼠标 `LUMINANCE / FLOW / REPEL` 三种交互对照。
- 显示实时 FPS、绘制格数与动画是否已停止；这是真实调试数据，不伪造性能数字。

验收：用户能看出这是网站界面与背景的字符语言，而不是被转换的游戏封面；字符近看是字、远看形成结构；低饱和配色成立；鼠标交互不浮夸；静止后停止绘制。

### Round 9B — Hero + 章节状态小范围原型

只有 9A 通过才执行。

实现：

- 在 Hero 背景接入选定字符场与一次高功率蔓延。
- 只给 GAME WORK 与 Systems 两个标题接入 ASCII 章节填充，验证当前章节关联。
- 导航、标题和内容共用同一 active section 状态。
- 其余栏目保持不变，便于 A/B 对比。

验收：职业定位仍是首屏第一信息；强动效不阻塞阅读；栏目归属更清楚。

### Round 9C — GAME WORK 媒体安全的 ASCII 外围联动

只有 9B 通过才执行。

实现：

- 真实媒体使用干净的重叠交接或即时切换，不进行 ASCII、Dither 或低分辨率采样。
- 复用 Round 8C 的无黑帧与可中断原则，把 ASCII 传播放在共享窗口边框、状态轨与邻近空白。
- 支持滚动、键盘、快速连续切换和中断接管。
- 结束后外围 ASCII 场沉降为低密度状态，真实项目媒体全程保持原貌。

验收：项目辨识度、切换因果、无黑场、ASCII 不覆盖媒体、稳定清理、手机与 Reduced Motion。

### Round 9D — 全站视觉扩展

只有 9C 通过才执行。

实现：

- 把已验证的章节 ASCII 状态扩展到 Experience、Relevant Work、Archive、Profile、Contact。
- 用最终选定低饱和色板替换酸性黄绿，但分批检查对比度。
- Archive / Profile / Contact 只保留低强度 hover / focus 字符扫描，不给每项添加大动画。
- 删除 `/pixel-lab` 或保留为开发档案，由用户决定。

验收：全站统一但有强弱层级；中文招聘信息仍易扫读；风格明显不同于 Meshy。

### Round 9E — CRT 外壳与性能收尾

最后才执行。

实现：

- 轻鱼眼、四角阴影、低强度扫描线与字符磷光。
- 桌面、平板、手机分别调参；不直接缩放同一效果。
- Reduced Motion、无 WebGL2、低性能设备和打印模式降级。
- 对动画帧率、CPU 占用、页面隐藏暂停、事件清理和水平溢出做回归。

验收：用户能感到 CRT 材质，但正文、媒体、点击区域和滚动都没有畸变或拖慢。

## 5. 第一原型推荐默认值

| 参数 | 默认值 | 可调范围 |
|---|---:|---:|
| 配色 | A 暖琥珀 + 低饱和紫事件色 | A / B / C |
| 字符坡度 | ` .,:;i1tfLCG08@` | 3 套预设 + 自定义 |
| 桌面列数 | 96 | 64–120 |
| 手机列数 | 48 | 40–64 |
| 字符帧率 | 18 FPS | 12 / 18 / 24 |
| 鼠标模式 | LUMINANCE | LUMINANCE / FLOW / REPEL |
| 鼠标半径 | 160px | 100–220px |
| 蔓延时长 | 1000ms | 700–1400ms |
| GAME 外围信号时长 | 640ms | 480–800ms |

## 6. 明确不做

- 不恢复 Round 8D 静态像素材质。
- 不把参考图中的 Macintosh、CRT 字样或品牌图形直接放入网站。
- 不把全站长期转换成难读的 ASCII 截图。
- 不把游戏封面、项目截图、演示视频或 Sketchfab 内容转换成 ASCII；网站是 ASCII Terminal 风格，作品素材不是 ASCII 作品。
- 不用 ASCII 动画隐藏真实项目媒体的不足。
- 不先上全屏 WebGL，再讨论性能与可访问性。
- 不在用户确认 9A 前进入 Hero、GAME WORK 或最终配色替换。

## 7. 下一次只需确认的内容

开始 Round 9A 修订前，已确认与待确认内容如下：

1. 暖琥珀为主、低饱和紫只做高功率事件色。
2. 高功率蔓延同时提供 AUTO ONCE 与 CTA TRIGGER 对照，正式版稍后二选一。
3. 鼠标先比较 LUMINANCE / FLOW / REPEL，推荐 LUMINANCE。
4. 第一轮只做 `/ascii-lab`，不改正式首页。
5. 已确认：实验对象必须是程序化网站字符场，作品媒体不得 ASCII 化。
