---
title: Zhu Yijia Portfolio Content Inventory
document_type: content_inventory
status: working
owner: 朱翊嘉
updated: 2026-08-07
---

# 作品与内容清单

## 1. 文档职责

本文档记录项目去向、展示级别、素材、公开状态和缺失信息。

- 设计与页面规则见 [design.md](./design.md)。
- 开发步骤见 [implementation-plan.md](./implementation-plan.md)。
- `从首页移除` 不等于删除文件；`隐藏` 不等于删除项目。

## 2. 状态词

| 状态 | 含义 |
| --- | --- |
| `featured` | 首页重点展示 |
| `secondary` | 首页次级展示 |
| `all-works` | 仅在 All Works 展示 |
| `draft` | 内容或素材未完成，不渲染 |
| `private` | 公开边界不明，不渲染 |
| `hidden` | 保留数据和源文件，暂不公开 |

## 3. 项目数据模型

项目内容从页面组件中抽离，建立唯一 TypeScript 数据源：

```ts
type ProjectVisibility =
  | 'featured'
  | 'secondary'
  | 'all-works'
  | 'draft'
  | 'private'
  | 'hidden';

interface PortfolioProject {
  id: string;
  slug: string;
  title: string;
  titleZh?: string;
  year: number;
  primaryCategory: 'game' | 'technical-art' | 'tools' | 'web';
  disciplines: string[];
  featuredSections: Array<'selected-games' | 'gameplay-lab' | 'worlds' | 'tools'>;
  visibility: ProjectVisibility;
  status: 'complete' | 'in-progress' | 'archived';
  ownership: 'personal' | 'team';
  roles: string[];
  contribution?: string;
  tools: string[];
  summary: string;
  cover?: string;
  mobileCover?: string;
  previewVideo?: string;
  detailPath?: string;
  externalUrl?: string;
  order: number;
}
```

字段为空时保持为空，不生成虚构内容。`primaryCategory` 决定 All Works 分类，`disciplines` 记录跨领域能力，`featuredSections` 决定首页位置，`visibility` 决定是否渲染。数量必须从数据自动计算。

## 4. Selected Games

| 项目 | 所有权 | 首页 | 详情页 | All Works | 当前处理 |
| --- | --- | --- | --- | --- | --- |
| ECHOFLASH《白夜瞬闪》 | 个人作品 | `featured` | 扩充 | 保留 | 补齐设计目标、核心系统、迭代与复盘 |
| Eraser's Odyssey《橡皮奥德赛》 | 个人作品 | `featured` | 扩充 | 保留 | 补齐设计目标、核心系统、迭代与复盘 |
| 第三个大型游戏 | 待填写 | `draft` | 待新建 | 暂不显示 | 资料完成前不渲染 |

## 5. Gameplay Lab

| 项目 | 首页 | 详情页 | All Works | 当前处理 |
| --- | --- | --- | --- | --- |
| IK 重定向 | `secondary` | 可取消 | 保留 | 短说明 + 技术标签 + 按需视频 |
| 迭代缩小 | `secondary` | 可取消 | 保留 | 短说明 + 技术标签 + 按需视频 |
| 跟随指针 | `secondary` | 可取消 | 保留 | 短说明 + 技术标签 + 按需视频 |

## 6. Worlds & Visual Systems

| 项目 | 首页 | 详情页 | All Works | 当前处理 |
| --- | --- | --- | --- | --- |
| StoneCity《石之城》 | `featured` | 保留并整理 | 保留 | 首页缩短说明；奖项与技术细节进入详情 |
| Peak《山崖》 | 待确认 | 保留 | 保留 | 与 Blade Runner 择一进入首页 |
| Blade Runner《银翼杀手》 | 待确认 | 保留 | 保留 | 与 Peak 择一进入首页 |
| Tajima Cutter | `secondary` | 保留 | 保留 | 首页只展示最终模型；纹理通道进入详情 |
| Mech Prototype | `hidden` | 可保留 | 保留或隐藏 | 完成度提高后重新评估 |
| 风格化柠檬 | 待确认 | 保留 | 保留 | 有实现说明后才升级为首页项目 |

## 7. Tools & Interactive Systems

| 项目 | 首页 | 详情页 | All Works | 当前处理 |
| --- | --- | --- | --- | --- |
| NewFace | `featured` | 保留 | 保留 | Tools 区当前代表项目 |
| Meshy.ai 工具或插件 | `private` | 待新建 | 暂不显示 | 确认保密边界后再公开 |
| 网页代表项目 | 待确认 | 现有演示可保留 | 保留 | 从现有十项中选择一项进入首页 |

## 8. Web Experiments

现有网页项目先保留源文件与嵌入演示：

1. Synthwave OS
2. Waitlist — Join Now
3. Synth Dashboard — Memphis Console
4. Outsource Consultants
5. Exat — Hot Type Replica
6. Exat Typeface I
7. Exat Typeface II
8. Dev.Engineer — Frontend
9. Nexus Analytics — 数据可视化
10. Yijia.Zhu — Portfolio

按完成度、岗位相关性、功能差异、视觉差异和个人贡献逐项评估。首页最多选择一个，其余进入 All Works 或设为 `hidden`。

## 9. About / Resume 内容去向

| 内容 | 首页 | About / Resume | 处理 |
| --- | --- | --- | --- |
| 个人介绍 | 简短版本 | 完整版本 | 最终中英文文案待确认 |
| 教育 | 一句摘要或不显示 | 完整保留 | 从首页前半部分移出 |
| 工作经历 | 一至两条重点 | 完整保留 | 突出游戏与技术相关经历 |
| 奖项 | 最多三项或跟随项目 | 完整保留 | 优先归属对应项目 |
| 核心技能 | 少量能力标签 | 按能力分组 | 不堆砌软件清单 |
| AI 工具列表 | 不展示 | 精简或删除 | 只保留与成果有关的部分 |
| 年龄、户籍 | 删除 | 建议删除 | 不帮助作品判断 |
| 电话、微信 | 不公开 | 下载简历中待确认 | 网站以邮箱为主 |
| 邮箱 | Contact 展示 | 保留 | 主要联系入口 |

## 10. 素材盘点字段

每个公开项目必须检查：

- 桌面与移动端封面。
- 压缩预览视频的尺寸、时长与编码。
- 长视频、过程图、系统图、模型、纹理和奖项图。
- 个人或团队归属、本人职责和贡献范围。
- 目标、系统、迭代、结果和复盘。
- Bilibili、Sketchfab 或外部演示链接。
- 公司保密信息和第三方授权。
- 视频、图片或三维失败时的静态替代资源。

## 11. 当前待确认内容

- 第三个大型游戏的完整资料。
- ECHOFLASH 与 Eraser's Odyssey 的首页排序。
- Peak 与 Blade Runner 的首页选择。
- 网页首页代表项目。
- Meshy.ai 项目公开边界。
- 两个大型游戏项目的最终职责、系统与复盘文案。
- 简历文件及公开联系方式范围。
