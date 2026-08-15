/**
 * Live theme palette for the color tuner. The dither canvases read this
 * object by reference on every frame, so mutating it updates the background
 * without a re-mount. CSS-side colors are applied as :root variables.
 */
export const liveDitherPalette = {
  paper: '#0f1211',
  coral: '#b7c2ba',
  cyan: '#67716a',
};

export interface SitePalette {
  /** 页面背景 */
  bg: string;
  /** 主要文字 */
  ink: string;
  /** 主色（点阵主色 / 强调） */
  primary: string;
  /** 深色（点阵深色 / 次级文字与标题） */
  deep: string;
  /** 交互色（按钮、焦点、当前状态、交互条） */
  active: string;
  /** Hero 大标题色 */
  title: string;
  /** 辅助 / 次要文字色 */
  muted: string;
  /** 点状背景底色 */
  dotPaper: string;
  /** CRT 外框塑料基色 */
  frame: string;
  /** 遮罩 / 面板底色（section 面纱、卡片、导航底色） */
  veilColor: string;
}

/* 默认主题：黑底终端（2026-08-15 暂定）。 */
export const DEFAULT_PALETTE: SitePalette = {
  bg: '#0b0d0c',
  ink: '#e9ece7',
  primary: '#b7c2ba',
  deep: '#67716a',
  active: '#f4f7f2',
  title: '#f4f7f2',
  muted: '#8a938c',
  dotPaper: '#0f1211',
  frame: '#1e221f',
  veilColor: '#0e100f',
};

const DEFAULT_VEIL = 0.6;

/* 浅色外框（青灰 / 红蓝 / 人生切割术）的外壳阴影：2026-08-14 锁定值。 */
const LIGHT_FRAME_SHELL: Record<string, number> = {
  '--crt-fold-tl-dark': 0.76,
  '--crt-fold-tl-light': 0.275,
  '--crt-fold-tl-band': 3,
  '--crt-fold-tr-dark': 0.7,
  '--crt-fold-tr-light': 0.365,
  '--crt-fold-tr-pos': 51,
  '--crt-fold-tr-band': 3,
  '--crt-fold-bl-dark': 0.515,
  '--crt-fold-bl-light': 0.28,
  '--crt-fold-bl-scale': 5.6,
  '--crt-fold-bl-pos': 51,
  '--crt-fold-bl-band': 4,
  '--crt-fold-br-dark': 0.525,
  '--crt-fold-br-scale': 11.7,
  '--crt-fold-br-band': 2,
  '--crt-reflection': 0.05,
  '--crt-reflection-soft': 0.06,
  /* 旧浅色主题无文字泛光。 */
  '--crt-text-bloom-alpha': 0,
};

/* 深色外框（白底浅青 / 白底深蓝）共用的外壳阴影调校，由调参面板实测锁定。
   黑底终端的同款调校已成为 CSS 默认值，无需覆盖。 */
const DARK_FRAME_SHELL: Record<string, number> = {
  '--crt-reflection': 0.05,
  '--crt-reflection-soft': 0.06,
  '--crt-text-bloom-alpha': 0,
  '--crt-fold-tl-dark': 1,
  '--crt-fold-tl-light': 0.4,
  '--crt-fold-tl-band': 2,
  '--crt-fold-tr-dark': 1,
  '--crt-fold-tr-light': 0.4,
  '--crt-fold-tr-pos': 49,
  '--crt-fold-tr-band': 4,
  '--crt-fold-bl-dark': 0.115,
  '--crt-fold-bl-light': 0.245,
  '--crt-fold-bl-scale': 18.4,
  '--crt-fold-bl-pos': 50,
  '--crt-fold-bl-band': 2.5,
  '--crt-fold-br-dark': 0.685,
  '--crt-fold-br-scale': 19.1,
  '--crt-fold-br-band': 2.5,
};

export const PALETTE_PRESETS: {
  id: string;
  label: string;
  palette: SitePalette;
  veil?: number;
  /** CRT 外壳阴影覆盖值（CSS 变量名 → 数值），缺省用 CRT_SHELL_DEFAULTS */
  shell?: Record<string, number>;
}[] = [
  { id: 'terminal', label: '黑底终端（默认）', palette: DEFAULT_PALETTE, veil: DEFAULT_VEIL },
  {
    id: 'light-cyan',
    label: '青灰（旧版）',
    veil: 0.74,
    shell: LIGHT_FRAME_SHELL,
    palette: {
      bg: '#f3f5f3',
      ink: '#172125',
      primary: '#28b6c3',
      deep: '#2d929b',
      active: '#169eae',
      title: '#2d929b',
      muted: '#69777a',
      dotPaper: '#e0e0e0',
      frame: '#d6d1c5',
      veilColor: '#f5f7f5',
    },
  },
  {
    id: 'reference',
    label: '红蓝测试',
    veil: 0.74,
    shell: LIGHT_FRAME_SHELL,
    palette: {
      bg: '#fafbf8',
      ink: '#172125',
      primary: '#ee8f89',
      deep: '#2d929b',
      active: '#2d929b',
      title: '#2d929b',
      muted: '#69777a',
      dotPaper: '#fafbf8',
      frame: '#d6d1c5',
      veilColor: '#f5f7f5',
    },
  },
  {
    id: 'lumon',
    label: '人生切割术',
    veil: 0.74,
    shell: LIGHT_FRAME_SHELL,
    palette: {
      bg: '#f5f6f4',
      ink: '#16324a',
      primary: '#5fb8bd',
      deep: '#25638c',
      active: '#178a96',
      title: '#25638c',
      muted: '#516670',
      dotPaper: '#e3e8e5',
      frame: '#e9ebe4',
      veilColor: '#f5f7f5',
    },
  },
  {
    id: 'lumon-white-cyan',
    label: '白底浅青',
    veil: 0.58,
    shell: DARK_FRAME_SHELL,
    palette: {
      bg: '#ffffff',
      ink: '#16324a',
      primary: '#5fb8bd',
      deep: '#25638c',
      active: '#178a96',
      title: '#25638c',
      muted: '#516670',
      dotPaper: '#e3e8e5',
      frame: '#021b3b',
      veilColor: '#f5f7f5',
    },
  },
  {
    id: 'lumon-white-blue',
    label: '白底深蓝',
    veil: 0.7,
    shell: DARK_FRAME_SHELL,
    palette: {
      bg: '#ffffff',
      ink: '#16324a',
      primary: '#063656',
      deep: '#25638c',
      active: '#178a96',
      title: '#25638c',
      muted: '#063656',
      dotPaper: '#e3e8e5',
      frame: '#021b3b',
      veilColor: '#f5f7f5',
    },
  },
];

/* --- CRT 外壳阴影参数：与预设绑定（preset.shell 覆盖默认值）。 --- */
export interface ShellParam {
  /** CSS 变量名 */
  varName: string;
  label: string;
  min: number;
  max: number;
  step: number;
  unit?: 'deg' | 'px';
  defaultValue: number;
  group: string;
}

export const CRT_SHELL_PARAMS: ShellParam[] = [
  { varName: '--crt-plastic-angle', label: '外框渐变方向', min: 0, max: 360, step: 1, unit: 'deg', defaultValue: 160, group: '外框' },
  { varName: '--crt-cut-dx', label: '水平偏移', min: -80, max: 80, step: 1, unit: 'px', defaultValue: 0, group: '切割框' },
  { varName: '--crt-cut-dy', label: '垂直偏移', min: -80, max: 80, step: 1, unit: 'px', defaultValue: 0, group: '切割框' },
  { varName: '--crt-cut-dw', label: '宽度调整', min: -80, max: 80, step: 1, unit: 'px', defaultValue: 0, group: '切割框' },
  { varName: '--crt-cut-dh', label: '高度调整', min: -80, max: 80, step: 1, unit: 'px', defaultValue: 0, group: '切割框' },
  { varName: '--crt-cut-radius', label: '圆角半径', min: 0, max: 60, step: 1, unit: 'px', defaultValue: 10, group: '切割框' },
  { varName: '--crt-shadow-top', label: '上缘', min: 0, max: 1, step: 0.005, defaultValue: 0.71, group: '四边压暗' },
  { varName: '--crt-shadow-bottom', label: '下缘', min: 0, max: 1, step: 0.005, defaultValue: 0.535, group: '四边压暗' },
  { varName: '--crt-shadow-left', label: '左缘', min: 0, max: 1, step: 0.005, defaultValue: 0.715, group: '四边压暗' },
  { varName: '--crt-shadow-right', label: '右缘', min: 0, max: 1, step: 0.005, defaultValue: 0.695, group: '四边压暗' },
  { varName: '--crt-corner-dark-tl', label: '左上', min: 0, max: 1, step: 0.005, defaultValue: 0.2, group: '角部径向暗部' },
  { varName: '--crt-corner-dark-tr', label: '右上', min: 0, max: 1, step: 0.005, defaultValue: 0.195, group: '角部径向暗部' },
  { varName: '--crt-corner-dark-bl', label: '左下', min: 0, max: 1, step: 0.005, defaultValue: 0.17, group: '角部径向暗部' },
  { varName: '--crt-corner-dark-br', label: '右下', min: 0, max: 1, step: 0.005, defaultValue: 0.18, group: '角部径向暗部' },
  { varName: '--crt-fold-tl-dark', label: '暗端', min: 0, max: 1, step: 0.005, defaultValue: 1, group: '折角 · 左上' },
  { varName: '--crt-fold-tl-light', label: '亮端', min: 0, max: 1, step: 0.005, defaultValue: 0.4, group: '折角 · 左上' },
  { varName: '--crt-fold-tl-angle', label: '角度', min: 0, max: 360, step: 1, unit: 'deg', defaultValue: 225, group: '折角 · 左上' },
  { varName: '--crt-fold-tl-scale', label: '范围', min: 1, max: 30, step: 0.1, defaultValue: 15, group: '折角 · 左上' },
  { varName: '--crt-fold-tl-pos', label: '过渡位置', min: 0, max: 100, step: 1, defaultValue: 51, group: '折角 · 左上' },
  { varName: '--crt-fold-tl-band', label: '过渡带宽', min: 0, max: 20, step: 0.5, defaultValue: 2, group: '折角 · 左上' },
  { varName: '--crt-fold-tr-dark', label: '暗端', min: 0, max: 1, step: 0.005, defaultValue: 1, group: '折角 · 右上' },
  { varName: '--crt-fold-tr-light', label: '亮端', min: 0, max: 1, step: 0.005, defaultValue: 0.4, group: '折角 · 右上' },
  { varName: '--crt-fold-tr-angle', label: '角度', min: 0, max: 360, step: 1, unit: 'deg', defaultValue: 135, group: '折角 · 右上' },
  { varName: '--crt-fold-tr-scale', label: '范围', min: 1, max: 30, step: 0.1, defaultValue: 14, group: '折角 · 右上' },
  { varName: '--crt-fold-tr-pos', label: '过渡位置', min: 0, max: 100, step: 1, defaultValue: 49, group: '折角 · 右上' },
  { varName: '--crt-fold-tr-band', label: '过渡带宽', min: 0, max: 20, step: 0.5, defaultValue: 4, group: '折角 · 右上' },
  { varName: '--crt-fold-bl-dark', label: '暗端', min: 0, max: 1, step: 0.005, defaultValue: 0.115, group: '折角 · 左下' },
  { varName: '--crt-fold-bl-light', label: '亮端', min: 0, max: 1, step: 0.005, defaultValue: 0.245, group: '折角 · 左下' },
  { varName: '--crt-fold-bl-angle', label: '角度', min: 0, max: 360, step: 1, unit: 'deg', defaultValue: 135, group: '折角 · 左下' },
  { varName: '--crt-fold-bl-scale', label: '范围', min: 1, max: 30, step: 0.1, defaultValue: 18.4, group: '折角 · 左下' },
  { varName: '--crt-fold-bl-pos', label: '过渡位置', min: 0, max: 100, step: 1, defaultValue: 50, group: '折角 · 左下' },
  { varName: '--crt-fold-bl-band', label: '过渡带宽', min: 0, max: 20, step: 0.5, defaultValue: 2.5, group: '折角 · 左下' },
  { varName: '--crt-fold-br-dark', label: '暗端', min: 0, max: 1, step: 0.005, defaultValue: 0.685, group: '折角 · 右下' },
  { varName: '--crt-fold-br-light', label: '亮端', min: 0, max: 1, step: 0.005, defaultValue: 0.42, group: '折角 · 右下' },
  { varName: '--crt-fold-br-angle', label: '角度', min: 0, max: 360, step: 1, unit: 'deg', defaultValue: 225, group: '折角 · 右下' },
  { varName: '--crt-fold-br-scale', label: '范围', min: 1, max: 30, step: 0.1, defaultValue: 19.1, group: '折角 · 右下' },
  { varName: '--crt-fold-br-pos', label: '过渡位置', min: 0, max: 100, step: 1, defaultValue: 50, group: '折角 · 右下' },
  { varName: '--crt-fold-br-band', label: '过渡带宽', min: 0, max: 20, step: 0.5, defaultValue: 2.5, group: '折角 · 右下' },
  { varName: '--crt-reflection', label: '反光主带', min: 0, max: 0.5, step: 0.005, defaultValue: 0.1, group: '玻璃反光' },
  { varName: '--crt-reflection-soft', label: '反光副带', min: 0, max: 0.5, step: 0.005, defaultValue: 0.005, group: '玻璃反光' },
  { varName: '--crt-glare-x', label: '位置 X', min: 0, max: 100, step: 1, defaultValue: 83, group: '椭圆反光' },
  { varName: '--crt-glare-y', label: '位置 Y', min: 0, max: 100, step: 1, defaultValue: 22, group: '椭圆反光' },
  { varName: '--crt-glare-rx', label: '半径 X', min: 1, max: 150, step: 1, defaultValue: 57, group: '椭圆反光' },
  { varName: '--crt-glare-ry', label: '半径 Y', min: 1, max: 150, step: 1, defaultValue: 66, group: '椭圆反光' },
  { varName: '--crt-glare-angle', label: '角度', min: -180, max: 180, step: 1, unit: 'deg', defaultValue: 1, group: '椭圆反光' },
  { varName: '--crt-glare-pos', label: '过渡位置', min: 0, max: 100, step: 1, defaultValue: 22, group: '椭圆反光' },
  { varName: '--crt-glare-band', label: '过渡带宽', min: 0, max: 60, step: 1, defaultValue: 15, group: '椭圆反光' },
  { varName: '--crt-glare-strength', label: '反光系数', min: 0, max: 0.5, step: 0.005, defaultValue: 0.1, group: '椭圆反光' },
  { varName: '--crt-text-bloom-radius', label: '泛光半径(px)', min: 0, max: 20, step: 0.5, defaultValue: 20, group: '文字泛光' },
  { varName: '--crt-text-bloom-alpha', label: '泛光强度', min: 0, max: 1, step: 0.01, defaultValue: 0.15, group: '文字泛光' },
];

export const CRT_SHELL_DEFAULTS: Record<string, number> = Object.fromEntries(
  CRT_SHELL_PARAMS.map((param) => [param.varName, param.defaultValue]),
);

/** Apply CRT shell/shadow values (partial allowed; missing keys keep CSS). */
export function applyCrtShell(values: Record<string, number>) {
  const style = document.documentElement.style;
  for (const param of CRT_SHELL_PARAMS) {
    const value = values[param.varName];
    if (value === undefined) continue;
    style.setProperty(param.varName, `${value}${param.unit ?? ''}`);
  }
}

export function applySitePalette(palette: SitePalette) {
  const style = document.documentElement.style;
  style.setProperty('--site-bg', palette.bg);
  style.setProperty('--site-ink', palette.ink);
  style.setProperty('--site-primary', palette.primary);
  style.setProperty('--site-deep', palette.deep);
  style.setProperty('--site-active', palette.active);
  style.setProperty('--site-title', palette.title);
  style.setProperty('--site-muted', palette.muted);
  style.setProperty('--crt-plastic-base', palette.frame);
  style.setProperty('--site-veil-color', palette.veilColor);
  liveDitherPalette.paper = palette.dotPaper;
  liveDitherPalette.coral = palette.primary;
  liveDitherPalette.cyan = palette.deep;
  /* Nudge the dither canvases to repaint immediately (covers the static
     reduced-motion path; the live loop repaints on its own). */
  window.dispatchEvent(new Event('resize'));
}
