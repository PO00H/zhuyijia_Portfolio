# 用真实 UE / C++ 项目替换首页预留位

> 适用位置：GAME WORK 第 01 项
> 当前数据 ID：`ue-project-upcoming`
> 原则：只替换真实内容，不重做首页结构，不覆盖旧素材和已验收派生素材。
> 配套规范：[`portfolio-design-system.md`](portfolio-design-system.md)

## 1. 替换前准备

先准备并确认这些真实内容：

- 项目中英文名称。
- 项目年份和当前发布状态。
- 一句可核实的中文摘要。
- 5–8 个真实技术标签。
- 一张封面图；建议同时准备一段无声预览视频。
- 可打开的详情入口：独立 HTML、视频或正式外部页面三选一。
- 详情页中的职责、系统、技术与结果均来自真实项目，不填未经验证的性能数字。

缺少的字段保持 `null`，不要用假截图、假进度或占位成绩补齐。

## 2. 放入新素材

不要移动旧素材。新项目建议使用独立目录，例如：

```text
public/projects/<project-slug>/cover.png
public/projects/<project-slug>/preview.mp4
public/embed/<project-slug>/index.html
```

路径写入项目清单时必须从 `/` 开始，例如 `/projects/<project-slug>/cover.png`。

如果详情页还没完成，可以先把 `detailUrl` 与 `existingContentPath` 保持为 `null`；首页会保留非可点击状态，不会制造死链。

## 3. 更新统一项目清单

打开 `src/data/portfolioProjects.ts`，找到 `id: 'ue-project-upcoming'` 的对象。建议保留这个 ID 和 `featuredOrder: 1`，只更新内容字段：

```ts
{
  id: 'ue-project-upcoming',
  entryKind: 'project',
  title: '项目英文名 — 《项目中文名》',
  track: 'game-development',
  tier: 'flagship',
  status: 'published',
  featuredOrder: 1,
  cover: '/projects/<project-slug>/cover.png',
  preview: '/projects/<project-slug>/preview.mp4',
  detailUrl: '/embed/<project-slug>/index.html',
  existingContentPath: '/embed/<project-slug>/index.html',
  tags: ['Unreal Engine 5', 'C++', 'Gameplay Ability System'],
  enabled: true,
  year: '2026',
  summary: '一句说明你负责了什么、实现了什么系统的真实中文摘要。',
  assetPaths: [
    '/projects/<project-slug>/cover.png',
    '/projects/<project-slug>/preview.mp4',
    '/embed/<project-slug>/index.html',
  ],
}
```

注意：

- `status` 改成 `published` 后，首页会显示年份和真实项目状态。
- `cover` 会进入共享 Runtime Signal Viewport；不要把重要文字放在封面边缘。
- `detailUrl` 非空后，“查看项目”按钮才会出现。
- `assetPaths` 要列出本项目所有公开素材与入口，便于后续自动检查。
- 不需要修改 `FeaturedGamesSection.tsx`；它会继续读取第 01 项并复用现有 560ms 切换。

## 4. 是否立即使用 Asset Lab

项目清单可以直接读取新原始路径，所以新项目无需等待裁切管线即可上线测试。

如果封面或视频需要统一构图：

1. 在开发环境打开 `/asset-lab`。
2. 调整比例、位置、缩放、封面帧和视频起止点。
3. 导出新的裁切 JSON，并保留原始素材。
4. 使用新的版本目录生成派生素材，再把映射并入 `portfolioDerivedAssets.json`。

当前 `public/derived/asset-lab-v1` 是冻结的已验收结果，现有脚本会主动拒绝覆盖该目录。不要为了加入新项目而删除或重建 v1；需要批处理时应新建版本化输出，例如 `asset-lab-v2`。

## 5. 必做验收

完成数据更新后检查：

- 桌面端第 01 项显示真实封面、年份、摘要和标签。
- 进入第 01 项时，共享媒体窗口切换到同一张真实封面。
- 手机端保持纵向单列，无水平滚动；标签和按钮之间仍有间距。
- “查看项目”能打开正确详情，关闭和 Escape 均可返回。
- `prefers-reduced-motion` 下没有像素拆散，内容保持静态可读。
- `/archive` 的 16 个旧项目数量与入口不受影响。
- 所有新增本地路径真实存在。
- `npm run build` 通过。

## 6. 交给 Codex 时的指令

```text
请完整读取 CODEX_TODO.md、docs/portfolio-design-system.md 和 docs/adding-real-ue-project.md。
只使用我提供的真实项目名称、说明、标签、素材和入口，替换 ue-project-upcoming 预留位。
不要移动旧素材，不要覆盖 public/derived/asset-lab-v1，不要修改已验收的页面结构、ASCII + Dithering 背景、全站像素字体和 560ms 切换。
完成后检查桌面、手机、键盘、reduced-motion、所有新增链接与生产构建，然后停下来等我验收。
```
