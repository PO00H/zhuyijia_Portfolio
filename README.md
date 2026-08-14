# 朱翊嘉作品集

面向 UE / C++ 游戏开发岗位的个人作品集。整个网站是一块复古未来 CRT 显示器的屏幕内容：首次访问播放一次开机序列（可跳过），随后进入浅色像素界面。首页优先展示游戏开发、Unreal 技术实验与行业实践，其他视觉、网站应用和 AI 界面项目收录在独立 Archive。

## 本地运行

```powershell
npm install
npm run dev
```

- 首页：`http://127.0.0.1:5173/`
- Archive：`http://127.0.0.1:5173/archive`
- Asset Lab（仅开发环境）：`http://127.0.0.1:5173/asset-lab`

提交前至少运行：

```powershell
npm run build
```

## 内容维护入口

- 全部项目事实与入口：`src/data/portfolioProjects.ts`
- 已确认的派生素材映射：`src/data/portfolioDerivedAssets.json`
- 首页核心游戏区：`src/sections/portfolio/FeaturedGamesSection.tsx`
- Archive 页面：`src/sections/archive/ArchivePage.tsx`
- 当前唯一设计与动效规范：`docs/portfolio-design-system.md`

## 加入真实 UE / C++ 项目

目前 GAME WORK 的第 01 项是正式预留位。真实项目完成后，不需要重新设计首页结构或动效，只需要补充素材、详情入口和统一项目清单。

完整步骤、字段示例、素材规则与验收清单见：

[`docs/adding-real-ue-project.md`](docs/adding-real-ue-project.md)

## 维护原则

- 不移动或覆盖现有原始素材与 `public/embed` 中的独立项目页面。
- 不直接覆盖 `public/derived/asset-lab-v1`；该目录是已验收裁切结果。
- 不在组件里重复写项目事实，标题、年份、标签、媒体和入口统一从项目清单读取。
- 新增动效先更新动效规范，并提供触屏与 `prefers-reduced-motion` 降级。
- 历史实验与旧提案不作为执行依据；任何设计调整先更新 `docs/portfolio-design-system.md`。
