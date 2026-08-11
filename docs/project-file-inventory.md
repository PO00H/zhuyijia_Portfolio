# 项目与文件盘点（Round 1）

> 盘点日期：2026-08-11  
> 数据清单：`src/data/portfolioProjects.ts`  
> 本轮只建立映射，没有移动、删除或替换任何素材。

## 1. 盘点结论

- 已映射 22 个项目条目：1 个 UE / C++ 正式预留位、5 个现有游戏项目、5 个 3D / Visual 项目、10 个 Web Design 项目、1 个 AI Interface 项目。
- 已映射 2 段首页相关行业经历：Meshy.ai、浙江无端科技。
- 总清单共 24 条，其中 23 条为现有内容，1 条状态为 `reserved`。
- ECHOFLASH 与 Eraser's Odyssey 的封面和独立 HTML 入口均存在。
- 10 个网页项目的封面、Hover 视频和独立 HTML 均存在。
- 没有修改当前页面的数据来源，因此本轮不会改变网站外观。

## 2. 已映射项目

### Featured Game Development

| ID | 项目 | 封面 | 预览 | 详情 / 现有内容 |
|---|---|---|---|---|
| `ue-project-upcoming` | Upcoming UE / C++ Project | 待补 | 待补 | 待补，状态为 `reserved` |
| `game-001` | ECHOFLASH | `/covers/echoflash.png` | `/previews/echoflash.mp4` | `/embed/echoflash-detail/index.html` |
| `game-002` | Eraser's Odyssey | `/covers/eraser-odyssey.png` | 暂无 | `/embed/eraser-odyssey/index.html` |

### Unreal Systems Lab

| ID | 项目 | 现有视频 |
|---|---|---|
| `game-003` | IK 重定向 | `/videos/UE1.mp4` |
| `game-004` | 迭代缩小 | `/videos/UE2.mp4` |
| `game-005` | 跟随指针 | `/videos/UE3.mp4` |

### Industry Experience

| ID | 经历 | 当前公开素材 |
|---|---|---|
| `experience-meshy` | 北京格拉菲克斯 — Meshy.ai | 无；先使用现有真实履历文字 |
| `experience-wildfire` | 浙江无端科技有限公司 | 无；先使用现有真实履历文字 |

### 3D / Visual

| ID | 项目 | 本地内容 | 外部内容 |
|---|---|---|---|
| `design-001` | StoneCity | `/videos/002.mp4`、`/images/0021.jpg`、`/images/0022.jpg` | 无 |
| `design-002` | Peak | `/videos/001.mp4` | 无 |
| `design-003` | Blade Runner | `/videos/003.mp4` | 无 |
| `design-004` | Tajima Cutter | `/textures/T_TAJIMA_BC.png`、`MT`、`N`、`R` | Sketchfab 模型 |
| `design-006` | 风格化柠檬 | `/videos/blender1.mp4`、`/images/22.png` | 无 |

### Web Design

`frontend-001` 至 `frontend-010` 均已按相同规则映射：

```text
/covers/frontend-NNN.webp
/previews/frontend-NNN.mp4
/embed/frontend-NNN/index.html
```

对应名称依次为音频工具网站、创意平台网站、数据控制台、企业服务网站、字体品牌网站、互动字体网站、创作工具网站、开发者作品集、系统监控平台、创意开发作品集；完整中文内容说明以统一项目清单为准。

### AI Interface

| ID | 项目 | 封面 | 详情 / 现有内容 |
|---|---|---|---|
| `ai-001` | NewFace | `/covers/newface.webp` | `/embed/newface/index.html` |

## 3. 缺失但不阻塞结构阶段

- Upcoming UE / C++ Project：名称、年份、简介、封面、预览和详情入口均等待真实项目加入；清单中保持 `null`，没有生成假素材。
- Eraser's Odyssey：没有独立 Hover 预览视频，现阶段继续使用封面与详情页。
- 三个 Unreal Systems Lab 实验：有视频，但没有独立封面与详情 HTML。
- Meshy.ai 与无端科技：没有确认可公开的图片、界面或流程素材。
- Peak：当前代码记录了“2025 第四届 HKDADC 一等奖”，但奖项图片字段为空。
- StoneCity、Peak、Blade Runner 和风格化柠檬：当前以视频作为主要媒体，没有独立封面文件。
- Tajima Cutter：依赖外部 Sketchfab 嵌入；本轮只确认 URL 已映射，没有进行联网可用性验证。

## 4. 待用户确认

- Upcoming UE / C++ Project 的真实内容到达后再补齐，当前无需提供。
- 是否为 Eraser's Odyssey 和三个 UE 实验补独立封面，留到静态结构确认后决定。
- Meshy.ai 是否存在可以公开的工具截图、抽象流程图依据或演示素材。
- 无端科技是否存在可以公开的交互研究成果；若没有，保持文字摘要即可。
- Peak 的奖项图片是否需要补入。

## 5. 已存在但当前未纳入项目清单的文件

- `/images/image(2).png`：当前项目代码中未找到引用，暂时保留。
- `/embed/ai-coming-soon/index.html`：旧 AI 占位页，当前 NewFace 已有正式入口，暂时保留。
- `src/components/ui/video-player.tsx` 中保留了独角兽视频的 Bilibili 映射，但对应本地视频文件不存在，且当前项目页面未引用该项目。
- `src/components/VideoPlayer.tsx` 的默认海报为 `/images/poster.jpg`，文件不存在；当前页面未发现该组件的使用位置。

这些文件和旧映射都没有在 Round 1 删除，待后续确认是否属于历史遗留内容。
