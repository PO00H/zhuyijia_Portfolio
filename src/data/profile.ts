export interface ProfileTimelineItem {
  period: string;
  title: string;
  detail?: string;
}

export const profile = {
  publicContact: {
    email: '1002520702@qq.com',
  },
  education: [
    {
      period: '2025.09—2028.09',
      institution: '北京林业大学',
      program: '交互设计（硕士）',
      detail: '人机交互、三维空间体验、虚拟现实交互机制与游戏反馈回路研究。',
    },
    {
      period: '2021.09—2025.06',
      institution: '浙江农林大学',
      program: '家具设计与工程（本科）',
      detail: '通过工程力学与人体工学课程，建立物理常识与空间几何基础。',
    },
    {
      period: '2021.09—2023.09',
      institution: '浙江农林大学',
      program: '日语（专业辅修）',
      detail: '',
    },
  ],
  experience: [
    {
      period: '2026.04—2026.08',
      company: '北京格拉菲克斯 — Meshy.ai',
      role: '三维美术部门 · 技术美术实习生',
      detail: '研发三维产品部门工具箱，处理材质、资产与 API 流程；搭建 Blender PBR 与 UV 顶点组合插件。',
    },
    {
      period: '2024.06—2024.08',
      company: '浙江无端科技有限公司',
      role: '游戏交互实习生',
      detail: '参与游戏交互与 UX 调研，整理玩家行为链路、操作痛点、反馈数据与竞品系统，为交互逻辑迭代提供建议。',
    },
    {
      period: '2024.02—2024.04',
      company: '温州澳珀家俱有限公司',
      role: '产品交互实习生',
      detail: '依据工业工程制图规范完成复杂零部件的三维建模与二维图纸。',
    },
    {
      period: '2023.07—2023.09',
      company: '温州几米家具有限公司',
      role: '产品方向实习生',
      detail: '参与网站建设、广告策划与产品设计开发。',
    },
  ],
  awards: [
    { period: '国家级', title: '全国大学生机器人创意大赛：三等奖' },
    { period: '省级', title: '浙江省大学生机器人创意大赛：一等奖' },
    { period: '2025', title: 'BICC 中英国际创意大赛：银奖' },
    { period: '2025', title: '第二届 AADC 北美应用艺术设计奖：金奖' },
    { period: '2025', title: '第二届 AADC 北美应用艺术设计奖：铜奖' },
    { period: '2025', title: '第二届 AADC 北美应用艺术设计奖：铜奖' },
    { period: '2025', title: '第四届 HKDADC：一等奖' },
    { period: '2025', title: '第四届 HKDADC：三等奖' },
    { period: '2025', title: '第四届 HKDADC：三等奖' },
    { period: '2025', title: '第六届 G-CROSS 跨界艺术创意奖：佳作奖' },
  ],
  capabilities: [
    {
      index: '01',
      title: '玩法与系统',
      detail: '玩法循环、机制设计、原型验证、交互反馈与迭代。',
      tools: 'Game Design / Prototyping / Player Feedback',
    },
    {
      index: '02',
      title: '实时世界与技术美术',
      detail: '场景组织、材质、实时特效、硬表面建模与视觉实现。',
      tools: 'UE5 / Level Art / Materials / Niagara',
    },
    {
      index: '03',
      title: '程序与工具',
      detail: '用程序和工具把设计逻辑落实为可运行的系统。',
      tools: 'C++ / Blueprint / JavaScript / Frontend',
    },
  ],
} as const;
